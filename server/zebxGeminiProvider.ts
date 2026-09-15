import { GoogleGenAI } from '@google/genai';
import { zebxKnowledge } from '../src/data/zebxKnowledge';
import { ZEBX_SYSTEM_PROMPT } from '../src/data/zebxSystemPrompt';
import type { ZebxChatRequest, ZebxChatResponse } from '../src/types/zebx';

export const ZEBX_GEMINI_MODEL = 'gemini-3.8-flash';

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_ITEMS = 24;
const MAX_HISTORY_MESSAGE_LENGTH = 4000;

declare const process: {
  env: Record<string, string | undefined>;
};

const createProviderError = (message: string): Error => new Error(message);

const validateRequest = (request: ZebxChatRequest): void => {
  if (!request || typeof request.message !== 'string' || !request.message.trim()) {
    throw createProviderError('A non-empty message is required.');
  }

  if (!Array.isArray(request.history) || request.history.length > MAX_HISTORY_ITEMS) {
    throw createProviderError('The conversation history is invalid.');
  }

  if (request.message.length > MAX_MESSAGE_LENGTH) {
    throw createProviderError('The message is too long.');
  }

  for (const item of request.history) {
    if (
      !item ||
      (item.role !== 'user' && item.role !== 'assistant') ||
      typeof item.content !== 'string' ||
      item.content.length > MAX_HISTORY_MESSAGE_LENGTH
    ) {
      throw createProviderError('The conversation history is invalid.');
    }
  }
};

const buildInput = (request: ZebxChatRequest): string => {
  const history = request.history
    .map(item => `${item.role === 'user' ? 'Visitor' : 'ZEBX AI'}: ${item.content}`)
    .join('\n');

  return [
    history,
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw createProviderError('ZEBX AI is not configured on the server.');
  }

  try {
    const client = new GoogleGenAI({ apiKey });
    const interaction = await client.interactions.create({
      model: ZEBX_GEMINI_MODEL,
      system_instruction: buildSystemInstruction(),
      input: buildInput(request),
      store: false,
      generation_config: {
        thinking_level: 'low',
      },
    });

    const message = interaction.output_text?.trim();
    if (!message) {
      throw createProviderError('ZEBX AI returned an empty response.');
    }

    return { message };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('ZEBX AI ')) {
      throw error;
    }

    throw createProviderError('ZEBX AI could not complete the request.');
  }
}
