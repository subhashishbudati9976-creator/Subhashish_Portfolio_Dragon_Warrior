import type { ZebxChatRequest, ZebxChatResponse } from '../types/zebx';

const ZEBX_CHAT_ENDPOINT = '/api/chat';

export async function sendZebxMessage(
  message: string,
  history: ZebxChatRequest['history'],
): Promise<ZebxChatResponse> {
  const request: ZebxChatRequest = { message, history };
  const response = await fetch(ZEBX_CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`ZEBX chat request failed with status ${response.status}.`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== 'object' || !('message' in payload) || typeof payload.message !== 'string') {
    throw new Error('ZEBX chat response was invalid.');
  }

  return payload as ZebxChatResponse;
}
