import type { IncomingMessage, ServerResponse } from 'node:http';
import { transcribeZebxAudio } from './zebxTranscriptionProvider';

const MAX_BODY_BYTES = 10 * 1024 * 1024;

type NodeRequest = IncomingMessage;
type NodeResponse = ServerResponse & { statusCode: number };

const sendJson = (response: NodeResponse, statusCode: number, payload: unknown) => {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
};

const readAudio = async (request: NodeRequest): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    totalBytes += buffer.length;
    if (totalBytes > MAX_BODY_BYTES) throw new Error('The recording is too large.');
    chunks.push(buffer);
  }

  return Buffer.concat(chunks);
};

export async function handleZebxTranscription(
  request: NodeRequest,
  response: NodeResponse,
): Promise<void> {
  if (request.method !== 'POST') {
    sendJson(response, 405, { error: 'Method not allowed.' });
    return;
  }

  try {
    const mimeType = request.headers['content-type']?.split(';')[0]?.toLowerCase() ?? '';
    const audio = await readAudio(request);
    const text = await transcribeZebxAudio(audio, mimeType);
    sendJson(response, 200, { text });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';

    if (message === 'No audio was recorded.' || message === 'The recording is too large.' || message === 'This audio format is not supported.') {
      sendJson(response, 400, { error: message });
      return;
    }
    if (message === 'ZEBX AI transcription is not configured on the server.') {
      sendJson(response, 503, { error: message });
      return;
    }
    if (message === 'The transcription provider returned no text.' || message === 'The transcription provider could not process the recording.') {
      sendJson(response, 502, { error: message });
      return;
    }
    sendJson(response, 500, { error: 'Voice transcription encountered an unexpected server error.' });
  }
}
