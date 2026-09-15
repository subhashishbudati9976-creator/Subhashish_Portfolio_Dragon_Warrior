import React, { useEffect, useRef, useState } from 'react';
import { sendZebxMessage } from '../../services/zebxApi';

interface ZebxMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onstart: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

type SpeechStatus = 'idle' | 'listening' | 'stopped' | 'error' | 'unsupported';

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
  const [speechStatus, setSpeechStatus] = useState<SpeechStatus>('idle');
  const [speechMessage, setSpeechMessage] = useState('');
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechBaseTextRef = useRef('');

  useEffect(() => {
    const handleAssistantOpen = () => setExpanded(true);
    document.addEventListener('portfolio:assistant:open', handleAssistantOpen);
    return () => document.removeEventListener('portfolio:assistant:open', handleAssistantOpen);
  }, []);

  useEffect(() => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setSpeechStatus('unsupported');
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setSpeechStatus('listening');
      setSpeechMessage('LISTENING');
    };
    recognition.onresult = event => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let index = 0; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript ?? '';
        if (event.results[index].isFinal) finalTranscript += transcript;
        else interimTranscript += transcript;
      }

      const transcript = [speechBaseTextRef.current, finalTranscript, interimTranscript]
        .map(value => value.trim())
        .filter(Boolean)
        .join(' ');
      setInputText(transcript);
    };
    recognition.onerror = event => {
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('[ZEBX SpeechRecognition]', {
          event,
          message: event.message ?? '',
          error: event.error,
        });
      }
      const messages: Record<string, string> = {
        'not-allowed': 'Microphone permission was denied.',
        'service-not-allowed': 'Speech input is not allowed in this browser.',
        'no-speech': 'No speech was detected.',
        'audio-capture': 'No microphone was detected.',
        network: 'Speech input is temporarily unavailable.',
        aborted: 'Voice input stopped.',
      };
      setSpeechStatus(event.error === 'aborted' ? 'stopped' : 'error');
      setSpeechMessage(messages[event.error] ?? 'Voice input is unavailable.');
    };
    recognition.onend = () => {
      setSpeechStatus(current => current === 'listening' ? 'stopped' : current);
      setSpeechMessage(current => current === 'LISTENING' ? 'READY' : current);
    };
    recognitionRef.current = recognition;

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const stopSpeechRecognition = () => {
    recognitionRef.current?.stop();
    setSpeechStatus('stopped');
    setSpeechMessage('READY');
  };

  const toggleSpeechRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition || speechStatus === 'unsupported') return;
    if (speechStatus === 'listening') {
      stopSpeechRecognition();
      return;
    }

    speechBaseTextRef.current = inputText.trim();
    setSpeechMessage('STARTING');
    try {
      recognition.start();
    } catch {
      setSpeechStatus('error');
      setSpeechMessage('Voice input could not start.');
    }
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && expanded) setExpanded(false);
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
      setMessages(current => [
        ...current,
        {
          id: `zebx-assistant-${Date.now()}`,
          role: 'assistant',
          content: response.message,
        },
      ]);
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
                stopSpeechRecognition();
                setExpanded(false);
              }}
              aria-label="Minimize assistant guide"
            >
              &times;
            </button>
          </div>

          <div className="zebx-interface-body">
            <div className="zebx-identity-column">
              <div className="zebx-avatar" aria-hidden="true">
                <span className="zebx-avatar-ring zebx-avatar-ring-outer" />
                <span className="zebx-avatar-ring zebx-avatar-ring-inner" />
                <span className="zebx-avatar-core">Z</span>
              </div>
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
                  className={`zebx-microphone-button${speechStatus === 'listening' ? ' is-listening' : ''}`}
                  onClick={toggleSpeechRecognition}
                  disabled={speechStatus === 'unsupported' || isThinking}
                  aria-label={speechStatus === 'listening' ? 'Stop voice input' : 'Start voice input'}
                  title={speechStatus === 'unsupported' ? 'Voice input is not supported in this browser' : undefined}
                >
                  <span aria-hidden="true">{speechStatus === 'listening' ? '■' : 'MIC'}</span>
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
                <span>{isThinking ? 'PROCESSING // STANDBY' : 'GEMINI 3.5 FLASH // CONNECTED'}</span>
                <span className="zebx-footer-signal"><i aria-hidden="true" />{isThinking ? 'THINKING' : 'READY'}</span>
              </div>
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
