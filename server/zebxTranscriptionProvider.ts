import dns from 'node:dns';
import { GoogleGenAI } from '@google/genai';

// Prevent Node on Windows from stalling on unreachable IPv6 routes
if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

export const ZEBX_TRANSCRIPTION_MODEL = 'gemini-3.5-flash-lite';

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const SUPPORTED_AUDIO_TYPES = new Set([
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/ogg',
  'audio/mp4',
  'audio/mpeg',
  'audio/wav',
]);

declare const process: {
  env: Record<string, string | undefined>;
};

export const validateTranscriptionAudio = (audio: Buffer, mimeType: string): void => {
  if (!audio.length) throw new Error('No audio was recorded.');
  if (audio.length > MAX_AUDIO_BYTES) throw new Error('The recording is too large.');
  if (!SUPPORTED_AUDIO_TYPES.has(mimeType.split(';')[0].toLowerCase())) {
    throw new Error('This audio format is not supported.');
  }
};

export async function transcribeZebxAudio(audio: Buffer, mimeType: string): Promise<string> {
  validateTranscriptionAudio(audio, mimeType);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('ZEBX AI transcription is not configured on the server.');

  try {
    const client = new GoogleGenAI({ apiKey });
    const response = await client.models.generateContent({
      model: ZEBX_TRANSCRIPTION_MODEL,
      contents: [
        {
          inlineData: {
            data: audio.toString('base64'),
            mimeType,
          },
        },
        {
          text: 'Transcribe the spoken audio exactly. Return only the transcript text, with no commentary.',
        },
      ],
    });

    const transcript = response.text?.trim();
    if (!transcript) throw new Error('The transcription provider returned no text.');
    return transcript;
  } catch (error) {
    if (error instanceof Error && (
      error.message.startsWith('No audio') ||
      error.message.startsWith('The recording') ||
      error.message.startsWith('This audio') ||
      error.message.startsWith('ZEBX AI')
    )) {
      throw error;
    }
    throw new Error('The transcription provider could not process the recording.');
  }
}
