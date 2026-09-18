import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleZebxChat } from '../server/zebxChatHandler';

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse & { statusCode: number },
): Promise<void> {
  return new Promise<void>((resolve) => {
    handleZebxChat(req, res, () => {
      resolve();
    });
    res.on('finish', resolve);
    res.on('close', resolve);
  });
}
