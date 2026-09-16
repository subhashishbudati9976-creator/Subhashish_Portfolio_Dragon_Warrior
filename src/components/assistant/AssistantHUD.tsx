import React, { useEffect, useRef, useState } from 'react';
import { sendZebxMessage } from '../../services/zebxApi';
import { transcribeZebxAudio } from '../../services/zebxTranscriptionApi';
import { ZebxNeuralCore, type ZebxNeuralCoreState } from '../ZebxNeuralCore';

interface ZebxMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type SpeechStatus = 'idle' | 'recording' | 'transcribing' | 'error' | 'unsupported';

const ZEBX_SPEECH_SETTINGS = {
  rate: 0.95,
  pitch: 0.9,
  volume: 1,
};

const selectPreferredVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  const englishVoices = voices.filter(voice => voice.lang.toLowerCase().startsWith('en'));
  if (!englishVoices.length) return null;

  return [...englishVoices].sort((first, second) => {
    const score = (voice: SpeechSynthesisVoice) => {
      const metadata = `${voice.name} ${voice.lang}`.toLowerCase();
      let value = 0;
      if (metadata.includes('neural') || metadata.includes('premium')) value += 40;
      if (metadata.includes('natural')) value += 30;
      if (!voice.localService) value += 10;
      return value;
    };
    return score(second) - score(first);
  })[0] ?? null;
};

const cleanSpeechText = (text: string): string => text
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/[`*_>#~]/g, '')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/\s+/g, ' ')
  .trim();

const SUGGESTED_PROMPTS = [
  'Tell me about your projects',
  'What technologies do you use?',
  'Tell me about your experience',
  "What's your journey?",
  'What are you working on?',
];

/**
 * AssistantHUD — Extension Point & Architecture Shell
 *
 * Designed for future integration with:
 * - Speech-to-Text / Voice input
 * - Conversational LLM service (Gemini API)
 * - Text-to-Speech audio streaming
 *
 * Decoupled from concrete AI backend providers.
 * Pure UI shell with persistent status capsule and expandable capability preview.
 */

export interface AssistantState {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
}

export const AssistantHUD: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState<ZebxMessage[]>([
    {
      id: 'zebx-welcome',
      role: 'assistant',
      content: 'Interface initialized. Ask about the work, the systems, or the journey.',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>('idle');
  const [speechMessage, setSpeechMessage] = useState('');
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const lastAssistantResponseRef = useRef('');
  const neuralCoreState: ZebxNeuralCoreState = isThinking
    ? 'thinking'
    : speechStatus === 'recording'
      ? 'listening'
      : isSpeaking
        ? 'speaking'
        : 'idle';

  useEffect(() => {
    const handleAssistantOpen = () => setExpanded(true);
    document.addEventListener('portfolio:assistant:open', handleAssistantOpen);
    return () => document.removeEventListener('portfolio:assistant:open', handleAssistantOpen);
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return;
    speechSynthesisRef.current = window.speechSynthesis;
    setCanSpeak(true);

    return () => {
      window.speechSynthesis.cancel();
      speechSynthesisRef.current = null;
    };
  }, []);

  const cleanupRecording = () => {
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === 'recording') recorder.stop();
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setSpeechStatus('unsupported');
      setSpeechMessage('Voice recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg'].find(type => MediaRecorder.isTypeSupported(type)) ?? '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = event => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const audio = new Blob(audioChunksRef.current, { type: recorder.mimeType || mimeType || 'audio/webm' });
        cleanupRecording();
        if (!audio.size) {
          setSpeechStatus('error');
          setSpeechMessage('No audio was recorded.');
          return;
        }

        setSpeechStatus('transcribing');
        setSpeechMessage('TRANSCRIBING');
        try {
          const result = await transcribeZebxAudio(audio);
          if (!result.text.trim()) throw new Error('Empty transcript.');
          setInputText(result.text.trim());
          setSpeechStatus('idle');
          setSpeechMessage('TRANSCRIPT READY');
        } catch {
          setSpeechStatus('error');
          setSpeechMessage('Voice transcription is unavailable right now.');
        }
      };
      recorder.onerror = () => {
        cleanupRecording();
        setSpeechStatus('error');
        setSpeechMessage('Voice recording failed.');
      };
      recorder.start();
      setSpeechStatus('recording');
      setSpeechMessage('RECORDING');
    } catch {
      cleanupRecording();
      setSpeechStatus('error');
      setSpeechMessage('Microphone permission was denied.');
    }
  };

  const toggleSpeechRecording = () => {
    if (speechStatus === 'recording') stopRecording();
    else if (speechStatus !== 'transcribing' && speechStatus !== 'unsupported') void startRecording();
  };

  const stopSpeaking = () => {
    speechSynthesisRef.current?.cancel();
    setIsSpeaking(false);
  };

  const speakResponse = (text: string) => {
    const synthesis = speechSynthesisRef.current;
    const cleanedText = cleanSpeechText(text);
    if (!synthesis || !cleanedText) return;

    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const voices = synthesis.getVoices();
    utterance.voice = selectPreferredVoice(voices);
    utterance.rate = ZEBX_SPEECH_SETTINGS.rate;
    utterance.pitch = ZEBX_SPEECH_SETTINGS.pitch;
    utterance.volume = ZEBX_SPEECH_SETTINGS.volume;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthesis.speak(utterance);
  };

  useEffect(() => () => {
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    cleanupRecording();
    stopSpeaking();
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && expanded) {
        stopRecording();
        stopSpeaking();
        setExpanded(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [expanded]);

  useEffect(() => {
    const conversation = conversationRef.current;
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }, [messages, isThinking]);

  const submitMessage = async (message: string) => {
    const content = message.trim();
    if (!content || isThinking) return;

    const history = messages.slice(-20).map(({ role, content: messageContent }) => ({
      role,
      content: messageContent,
    }));

    setMessages(current => [
      ...current,
      { id: `zebx-user-${Date.now()}`, role: 'user', content },
    ]);
    setInputText('');
    setIsThinking(true);

    try {
      const response = await sendZebxMessage(content, history);
      lastAssistantResponseRef.current = response.message;
      setMessages(current => [
        ...current,
        {
          id: `zebx-assistant-${Date.now()}`,
          role: 'assistant',
          content: response.message,
        },
      ]);
      speakResponse(response.message);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'ZEBX AI could not respond right now. Please try again shortly.';
      setMessages(current => [
        ...current,
        {
          id: `zebx-error-${Date.now()}`,
          role: 'assistant',
          content: errorMessage,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitMessage(inputText);
    }
  };

  return (
    <aside
      className="assistant-hud-container"
      aria-label="Personal AI Assistant guide"
    >
      {expanded && (
        <div
          className="assistant-hud-panel zebx-interface"
          role="dialog"
          aria-modal="false"
          aria-label="ZEBX AI cinematic interface"
        >
          <div className="assistant-hud-panel-header">
            <div className="assistant-hud-badge">
              <span className="hud-ember-dot" aria-hidden="true" />
              <span>ZEBX AI &bull; PERSONAL INTELLIGENCE</span>
            </div>
            <button
              type="button"
              className="assistant-hud-close"
              onClick={() => {
                stopRecording();
                stopSpeaking();
                setExpanded(false);
              }}
              aria-label="Minimize assistant guide"
            >
              &times;
            </button>
          </div>

          <div className="zebx-interface-body">
            <div className="zebx-identity-column">
              <ZebxNeuralCore state={neuralCoreState} />
              <span className="zebx-identity-label">ZEBX AI</span>
              <span className="zebx-identity-status"><i aria-hidden="true" />VISUAL MODE / READY</span>
              <p className="zebx-identity-note">A cinematic interface for the intelligence layer behind this portfolio.</p>
            </div>

            <div className="zebx-conversation-column">
              <div className="zebx-conversation-meta">
                <span>CHANNEL // PERSONAL AI</span>
                <span>SESSION 001</span>
              </div>
              <div className="zebx-messages" ref={conversationRef} aria-live="polite">
                {messages.map(message => (
                  <div key={message.id} className={`zebx-message zebx-message-${message.role}`}>
                    <span className="zebx-message-label">{message.role === 'assistant' ? 'ZEBX' : 'YOU'}</span>
                    <p>{message.content}</p>
                  </div>
                ))}
                {isThinking && (
                  <div className="zebx-thinking" role="status" aria-live="polite">
                    <span className="zebx-thinking-dot" aria-hidden="true" />
                    ZEBX AI // THINKING...
                  </div>
                )}
              </div>
              <div className="zebx-prompts" aria-label="Suggested prompts">
                {SUGGESTED_PROMPTS.map(prompt => (
                  <button
                    type="button"
                    key={prompt}
                    className="zebx-prompt-chip"
                    onClick={() => submitMessage(prompt)}
                    disabled={isThinking}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="zebx-input-shell">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={event => setInputText(event.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask me anything..."
                  aria-label="Ask ZEBX AI a question"
                  rows={1}
                  disabled={isThinking}
                />
                <button
                  type="button"
                  className={`zebx-microphone-button${speechStatus === 'recording' ? ' is-listening' : ''}`}
                  onClick={toggleSpeechRecording}
                  disabled={speechStatus === 'unsupported' || speechStatus === 'transcribing' || isThinking}
                  aria-label={speechStatus === 'recording' ? 'Stop voice input' : 'Start voice input'}
                  title={speechStatus === 'unsupported' ? 'Voice input is not supported in this browser' : undefined}
                >
                  <span aria-hidden="true">{speechStatus === 'recording' ? '■' : 'MIC'}</span>
                </button>
                <button
                  type="button"
                  className="zebx-send-button"
                  onClick={() => submitMessage(inputText)}
                  disabled={!inputText.trim() || isThinking}
                  aria-label="Send message to ZEBX AI"
                >
                  ↗
                </button>
              </div>
              {speechMessage && speechStatus !== 'idle' && speechStatus !== 'unsupported' && (
                <div className={`zebx-speech-status zebx-speech-status-${speechStatus}`} role="status" aria-live="polite">
                  {speechMessage}
                </div>
              )}
              <div className="zebx-interface-footer">
                <span>{isThinking ? 'PROCESSING // STANDBY' : isSpeaking ? 'ZEBX // SPEAKING' : 'GEMINI 3.5 FLASH // CONNECTED'}</span>
                {isSpeaking && (
                  <button
                    type="button"
                    className="zebx-stop-speech"
                    onClick={stopSpeaking}
                    aria-label="Stop ZEBX speech"
                    title="Stop ZEBX speech"
                  >
                    ■ STOP
                  </button>
                )}
                <span className="zebx-footer-signal"><i aria-hidden="true" />{isThinking ? 'THINKING' : isSpeaking ? 'SPEAKING' : 'READY'}</span>
              </div>
              {canSpeak && !isSpeaking && lastAssistantResponseRef.current && (
                <button
                  type="button"
                  className="zebx-speak-response"
                  onClick={() => speakResponse(lastAssistantResponseRef.current)}
                  aria-label="Speak the latest ZEBX response"
                >
                  SPEAK RESPONSE ↗
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Trigger Capsule */}
      <button
        type="button"
        className={`assistant-hud-capsule${expanded ? ' is-active' : ''}`}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label="Toggle Subu AI personal guide overview"
      >
        <span className="assistant-waveform" aria-hidden="true">
          <span className="wave-bar bar-1" />
          <span className="wave-bar bar-2" />
          <span className="wave-bar bar-3" />
        </span>
        <span className="assistant-capsule-label">ZEBX AI</span>
        <span className="assistant-status-dot" aria-hidden="true" />
      </button>
    </aside>
  );
};
