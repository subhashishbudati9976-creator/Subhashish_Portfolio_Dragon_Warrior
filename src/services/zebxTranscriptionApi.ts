export interface ZebxTranscriptionResponse {
  text: string;
}

export async function transcribeZebxAudio(audio: Blob): Promise<ZebxTranscriptionResponse> {
  const response = await fetch('/api/transcribe', {
    method: 'POST',
    headers: {
      'Content-Type': audio.type || 'application/octet-stream',
    },
    body: audio,
  });

  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string') {
      throw new Error(payload.error);
    }
    if (response.status === 404) {
      throw new Error('Voice transcription endpoint is not available on this server.');
    }
    throw new Error('Voice transcription is unavailable right now.');
  }

  if (!payload || typeof payload !== 'object' || !('text' in payload) || typeof payload.text !== 'string') {
    throw new Error('Voice transcription returned an invalid response.');
  }

  return payload as ZebxTranscriptionResponse;
}
