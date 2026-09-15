/**
 * AssistantSection — Phase 2
 *
 * UI placeholder only. No Gemini connection, no API calls.
 * Communicates to visitors that an AI assistant will be available.
 * Phase 4 will activate the real chatbot.
 *
 * See docs/AI_SPEC.md and docs/ARCHITECTURE.md §7 for the full plan.
 */

import React from 'react';

const SAMPLE_MESSAGES = [
  {
    id: 'sys-1',
    type: 'system' as const,
    text: 'Hey! Ask me anything about Subhashish — his projects, skills, experience, or how to get in touch.',
  },
  {
    id: 'visitor-1',
    type: 'visitor' as const,
    text: 'What technologies does he work with?',
  },
];

export const AssistantSection: React.FC = () => {
  return (
    <section
      id="assistant"
      className="portfolio-section page-container"
      aria-labelledby="assistant-heading"
    >
      {/* Section header */}
      <div className="motion-reveal" data-motion-reveal="fade-up" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
        <div
          className="section-label"
          style={{ justifyContent: 'center', marginBottom: 'var(--space-3)' }}
        >
          <span className="type-eyebrow">Personal AI</span>
        </div>
        <h2 className="section-title" id="assistant-heading">
          Ask Subu Anything
        </h2>
        <p
          className="type-body"
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            color: 'var(--color-text-muted)',
          }}
        >
          A personal AI assistant trained on Subhashish&apos;s portfolio, projects,
          and background — coming in a future update.
        </p>
      </div>

      {/* Placeholder panel */}
      <div className="assistant-container motion-reveal" data-motion-reveal="fade-up">
        <div
          className="assistant-panel"
          aria-label="AI assistant preview — not yet active"
          aria-disabled="true"
        >
          {/* Panel header */}
          <div className="assistant-header">
            <div className="assistant-status-dot" aria-hidden="true" />
            <span className="assistant-header-label">
              SUBU — PERSONAL AI
            </span>
            <span className="assistant-header-coming-soon">
              PHASE 4 — COMING SOON
            </span>
          </div>

          {/* Sample messages — static preview */}
          <div
            className="assistant-messages"
            aria-label="Sample conversation preview"
            aria-live="polite"
          >
            {SAMPLE_MESSAGES.map(msg => (
              <div
                key={msg.id}
                className={`assistant-message ${msg.type}`}
                aria-label={`${msg.type === 'system' ? 'Assistant' : 'Visitor'}: ${msg.text}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Disabled input row */}
          <div className="assistant-input-area">
            <div
              className="assistant-input-placeholder"
              role="textbox"
              aria-label="Message input — not yet available"
              aria-disabled="true"
            >
              Ask a question about Subhashish…
            </div>
            <button
              className="btn btn-primary btn-sm"
              disabled
              aria-label="Send — not yet available"
              style={{ flexShrink: 0 }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Caption */}
        <p className="assistant-caption">
          The assistant will be grounded strictly in verified portfolio
          content.{' '}
          <a
            href="#contact"
            className="text-link"
            style={{ fontSize: 'inherit' }}
            onClick={e => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get in touch directly
          </a>{' '}
          in the meantime.
        </p>
      </div>
    </section>
  );
};
