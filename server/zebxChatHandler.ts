import type { IncomingMessage, ServerResponse } from 'node:http';
import { generateZebxResponse } from './zebxGeminiProvider';
import type { ZebxChatRequest } from '../src/types/zebx';

const MAX_BODY_BYTES = 64 * 1024;

type NodeRequest = IncomingMessage & { body?: unknown };

type NodeResponse = ServerResponse & {
  statusCode: number;
};

const sendJson = (response: NodeResponse, statusCode: number, payload: unknown) => {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
};

const readJsonBody = async (request: NodeRequest): Promise<unknown> => {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new Error('Request body is too large.');
    }
    chunks.push(buffer);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  if (!rawBody) throw new Error('Request body is required.');
  return JSON.parse(rawBody);
};

const isZebxRequest = (payload: unknown): payload is ZebxChatRequest => {
  if (!payload || typeof payload !== 'object') return false;
  const request = payload as Partial<ZebxChatRequest>;
  return typeof request.message === 'string' && Array.isArray(request.history);
};

export async function handleZebxChat(
  request: NodeRequest,
  response: NodeResponse,
): Promise<void> {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const payload = await readJsonBody(request);
    if (!isZebxRequest(payload)) {
      sendJson(response, 400, { error: 'A valid message and conversation history are required.' });
      return;
    }

    const result = await generateZebxResponse(payload);
    sendJson(response, 200, result);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';

    if (message === 'Request body is too large.' || message === 'Request body is required.') {
      sendJson(response, 400, { error: message });
      return;
    }

    if (message === 'Unexpected token' || message.includes('JSON')) {
      sendJson(response, 400, { error: 'Request body must be valid JSON.' });
      return;
    }

    if (message === 'A non-empty message is required.' || message === 'The message is too long.' || message === 'The conversation history is invalid.') {
      sendJson(response, 400, { error: message });
      return;
    }

    if (message === 'ZEBX AI is not configured on the server.') {
      sendJson(response, 503, { error: message });
      return;
    }

    if (message === 'ZEBX AI returned an empty response.' || message === 'ZEBX AI could not complete the request.') {
      sendJson(response, 502, { error: message });
      return;
    }

    sendJson(response, 500, { error: 'ZEBX AI encountered an unexpected server error.' });
  }
}
