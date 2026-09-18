import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleZebxTranscription } from '../server/zebxTranscriptionHandler';

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse & { statusCode: number },
): Promise<void> {
  return handleZebxTranscription(req, res);
}
