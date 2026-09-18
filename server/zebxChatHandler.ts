import type { IncomingMessage, ServerResponse } from 'node:http';
import { generateZebxResponse, ZebxHttpError } from './zebxGeminiProvider';
import type { ZebxChatRequest } from '../src/types/zebx';

const MAX_BODY_BYTES = 64 * 1024;

type NodeRequest = IncomingMessage & { body?: unknown };
type NodeResponse = ServerResponse & { statusCode: number };
type NextFn = (err?: unknown) => void;

const sendJson = (response: NodeResponse, statusCode: number, payload: unknown): void => {
  if (response.headersSent) return;
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
};

const readJsonBody = async (request: NodeRequest): Promise<unknown> => {
  if (request.body && typeof request.body === 'object') {
    return request.body;
  }
  if (typeof request.body === 'string' && request.body.trim()) {
    try {
      return JSON.parse(request.body);
    } catch {
      throw new ZebxHttpError(400, 'Request body must be valid JSON.');
    }
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as string);
    totalBytes += buffer.length;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new ZebxHttpError(400, 'Request body is too large.');
    }
    chunks.push(buffer);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  if (!rawBody.trim()) throw new ZebxHttpError(400, 'Request body is required.');

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new ZebxHttpError(400, 'Request body must be valid JSON.');
  }
};

const isZebxRequest = (payload: unknown): payload is ZebxChatRequest => {
  if (!payload || typeof payload !== 'object') return false;
  const req = payload as Partial<ZebxChatRequest>;
  return typeof req.message === 'string' && Array.isArray(req.history);
};

export function handleZebxChat(
  request: NodeRequest,
  response: NodeResponse,
  next: NextFn,
): void {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  // Wrap all async work so unhandled rejections never crash the Vite process
  const run = async (): Promise<void> => {
    const payload = await readJsonBody(request);

    if (!isZebxRequest(payload)) {
      sendJson(response, 400, { error: 'A valid message and conversation history are required.' });
      return;
    }

    const result = await generateZebxResponse(payload);
    sendJson(response, 200, result);
  };

  run().catch((error: unknown) => {
    // Route ZebxHttpError directly — status code is authoritative
    if (error instanceof ZebxHttpError) {
      sendJson(response, error.statusCode, { error: error.message });
      return;
    }

    // Safety net: unexpected error — log sanitised message, never expose internals
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[ZEBX] Unexpected handler error:', msg);
    sendJson(response, 500, { error: 'ZEBX AI encountered an unexpected server error.' });

    // Pass to Vite/Connect error chain only when response is already sent or unsalvageable
    if (typeof next === 'function') next(error);
  });
}
