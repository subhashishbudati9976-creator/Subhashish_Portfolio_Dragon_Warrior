import dns from 'node:dns';
import { GoogleGenAI } from '@google/genai';
import { zebxKnowledge } from '../src/data/zebxKnowledge';
import { ZEBX_SYSTEM_PROMPT } from '../src/data/zebxSystemPrompt';
import type { ZebxChatRequest, ZebxChatResponse } from '../src/types/zebx';

// Prevent Node on Windows from stalling on unreachable IPv6 routes
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

export const ZEBX_GEMINI_MODEL = 'gemini-3.5-flash-lite';

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_ITEMS = 20;
const MAX_HISTORY_MESSAGE_LENGTH = 4000;

declare const process: {
  env: Record<string, string | undefined>;
};

export class ZebxHttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'ZebxHttpError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ZebxHttpError.prototype);
  }
}

const validateRequest = (request: ZebxChatRequest): void => {
  if (!request || typeof request.message !== 'string' || !request.message.trim()) {
    throw new ZebxHttpError(400, 'A non-empty message is required.');
  }

  if (request.message.length > MAX_MESSAGE_LENGTH) {
    throw new ZebxHttpError(400, 'The message is too long.');
  }

  if (!Array.isArray(request.history)) {
    throw new ZebxHttpError(400, 'The conversation history is invalid.');
  }

  if (request.history.length > MAX_HISTORY_ITEMS * 2) {
    throw new ZebxHttpError(400, 'The conversation history is too long.');
  }

  for (const item of request.history) {
    if (
      !item ||
      (item.role !== 'user' && item.role !== 'assistant') ||
      typeof item.content !== 'string' ||
      item.content.length > MAX_HISTORY_MESSAGE_LENGTH
    ) {
      throw new ZebxHttpError(400, 'The conversation history is invalid.');
    }
  }
};

const buildInput = (request: ZebxChatRequest): string => {
  // Bounded conversation history (latest 20 messages)
  const boundedHistory = request.history.slice(-MAX_HISTORY_ITEMS);
  const historyText = boundedHistory
    .map(item => `${item.role === 'user' ? 'Visitor' : 'ZEBX AI'}: ${item.content}`)
    .join('\n');

  return [
    historyText,
    `Visitor: ${request.message.trim()}`,
    'Respond as ZEBX AI:',
  ].filter(Boolean).join('\n');
};

const buildSystemInstruction = (): string => `${ZEBX_SYSTEM_PROMPT}

Portfolio knowledge source of truth:
${JSON.stringify(zebxKnowledge)}`;

export async function generateZebxResponse(
  request: ZebxChatRequest,
): Promise<ZebxChatResponse> {
  validateRequest(request);

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error('[ZEBX] Server configuration error: GEMINI_API_KEY is missing');
    throw new ZebxHttpError(503, 'ZEBX AI is not configured on the server.');
  }

  console.log('[ZEBX] request received');
  console.log(`[ZEBX] calling Gemini (${ZEBX_GEMINI_MODEL})`);

  try {
    const client = new GoogleGenAI({ apiKey });
    const interaction = await client.interactions.create(
      {
        model: ZEBX_GEMINI_MODEL,
        system_instruction: buildSystemInstruction(),
        input: buildInput(request),
        store: false,
        generation_config: {
          thinking_level: 'low',
        },
      },
      {
        retries: { strategy: 'none' },
        timeout_ms: 30000,
      },
    );

    const message = interaction.output_text?.trim();
    if (!message) {
      console.warn('[ZEBX] Gemini returned an empty response');
      throw new ZebxHttpError(502, 'ZEBX AI returned an empty response.');
    }

    console.log('[ZEBX] Gemini response received');
    return { message };
  } catch (error: unknown) {
    if (error instanceof ZebxHttpError) {
      console.error(`[ZEBX] Gemini request failed (${error.statusCode})`);
      throw error;
    }

    // Inspect error attributes safely without logging secrets or internal paths
    const errObj = (typeof error === 'object' && error !== null) ? (error as Record<string, unknown>) : {};
    const statusCode = Number(errObj.statusCode || errObj.status) || 0;
    const errName = typeof errObj.name === 'string' ? errObj.name : '';
    const rawMessage = error instanceof Error ? error.message : String(error);

    console.error(`[ZEBX] Gemini request failed (${statusCode || errName || 'unknown'})`);

    // Quota / Rate limit (429)
    if (
      statusCode === 429 ||
      errName === 'RateLimitError' ||
      rawMessage.includes('quota') ||
      rawMessage.includes('too_many_requests') ||
      rawMessage.includes('429')
    ) {
      throw new ZebxHttpError(429, 'ZEBX AI quota limit reached. Please try again shortly.');
    }

    // Authentication / Authorization (401, 403)
    if (
      statusCode === 401 ||
      statusCode === 403 ||
      rawMessage.includes('API key') ||
      rawMessage.includes('API_KEY_INVALID') ||
      rawMessage.includes('PERMISSION_DENIED')
    ) {
      throw new ZebxHttpError(401, 'ZEBX AI authentication issue. Please check server configuration.');
    }

    // Service unavailable / High demand / Overloaded (503)
    if (
      statusCode === 503 ||
      rawMessage.includes('high demand') ||
      rawMessage.includes('UNAVAILABLE') ||
      rawMessage.includes('temporarily unavailable')
    ) {
      throw new ZebxHttpError(503, 'ZEBX AI model is experiencing high demand. Please try again shortly.');
    }

    // Bad request from upstream (400)
    if (statusCode === 400 || rawMessage.includes('INVALID_ARGUMENT')) {
      throw new ZebxHttpError(400, 'ZEBX AI received an invalid request format.');
    }

    // Upstream failure fallback (502)
    throw new ZebxHttpError(502, 'ZEBX AI could not complete the request. Please try again shortly.');
  }
}

