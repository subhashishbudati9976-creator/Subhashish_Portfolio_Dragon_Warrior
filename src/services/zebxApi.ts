import type { ZebxChatRequest, ZebxChatResponse } from '../types/zebx';

const ZEBX_CHAT_ENDPOINT = '/api/chat';

export async function sendZebxMessage(
  message: string,
  history: ZebxChatRequest['history'],
): Promise<ZebxChatResponse> {
  const request: ZebxChatRequest = { message, history };
  let response: Response;
  try {
    response = await fetch(ZEBX_CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error('Unable to reach Zebx AI service. Please check your network connection.');
  }

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string') {
      throw new Error(payload.error);
    }
    if (response.status === 404) {
      throw new Error('Zebx AI backend endpoint (/api/chat) was not found on this deployment.');
    }
    if (response.status === 503) {
      throw new Error('ZEBX AI is not configured on the server. Please check GEMINI_API_KEY in Vercel settings.');
    }
    throw new Error('ZEBX AI could not complete the request.');
  }

  if (!payload || typeof payload !== 'object' || !('message' in payload) || typeof payload.message !== 'string') {
    throw new Error('ZEBX chat response was invalid.');
  }

  return payload as ZebxChatResponse;
}
