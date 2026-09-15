import React, { useState } from 'react';

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

  return (
    <aside
      className="assistant-hud-container"
      aria-label="Personal AI Assistant guide"
    >
      {/* Expanded Architecture Card */}
      {expanded && (
        <div
          className="assistant-hud-panel"
          role="dialog"
          aria-label="Assistant Overview"
        >
          <div className="assistant-hud-panel-header">
            <div className="assistant-hud-badge">
              <span className="hud-ember-dot" aria-hidden="true" />
              <span>SUBU AI &bull; DIGITAL GUIDE</span>
            </div>
            <button
              type="button"
              className="assistant-hud-close"
              onClick={() => setExpanded(false)}
              aria-label="Minimize assistant guide"
            >
              &times;
            </button>
          </div>

          <div className="assistant-hud-panel-body">
            <h4 className="assistant-hud-heading">Personal Interactive Assistant</h4>
            <p className="assistant-hud-text">
              An intelligent conversational guide trained on Subhashish&apos;s verified engineering
              portfolio, projects, and systems architecture — coming in the next release.
            </p>

            <div className="assistant-capabilities-list">
              <div className="assistant-cap-item">
                <span className="cap-indicator">&bull;</span>
                <span>Spoken voice interactions &amp; speech synthesis</span>
              </div>
              <div className="assistant-cap-item">
                <span className="cap-indicator">&bull;</span>
                <span>Deep dive technical explanations of projects</span>
              </div>
              <div className="assistant-cap-item">
                <span className="cap-indicator">&bull;</span>
                <span>Direct recruiter Q&amp;A on skills &amp; experience</span>
              </div>
            </div>

            <div className="assistant-hud-footer-note">
              <span>Architecture initialized &bull; Voice &amp; LLM layer standby</span>
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
        <span className="assistant-capsule-label">SUBU AI</span>
        <span className="assistant-status-dot" aria-hidden="true" />
      </button>
    </aside>
  );
};
