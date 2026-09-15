import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '../components/Button';

export const HeroSection: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsReady(true), 160);
    return () => window.clearTimeout(timer);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleAssistantOpen = useCallback(() => {
    if (typeof document !== 'undefined') {
      document.dispatchEvent(
        new CustomEvent('portfolio:assistant:open', {
          detail: {
            source: 'hero',
            section: 'hero-cta-assistant',
          },
        }),
      );
    }
  }, []);

  return (
    <div className={`hero-stage-layout page-container ${isReady ? 'hero-is-ready' : ''}`}>
      <div className="hero-stage-content">
        <div className="hero-status-stack" aria-live="polite">
          <span className="hero-system-line">SYSTEM // INITIALIZING</span>
          <span className="hero-verified-line">IDENTITY VERIFIED</span>
        </div>

        <h1 className="hero-headline" aria-label="Subhashish Budati">
          <span className="hero-name-block hero-name-primary">
            <span>SUBHASHISH</span>
          </span>
          <span className="hero-name-block hero-name-secondary">
            <span>BUDATI</span>
          </span>
        </h1>

        <p className="hero-discipline">CSE • AI APPLICATIONS • SOFTWARE ENGINEERING</p>
        <p className="hero-tagline">Turning ideas into impact.</p>
        <p className="hero-personality">“Hey amigos, I am Subhashish — you can call me Subu or Nani.”</p>

        <div className="hero-cta-group">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => scrollTo('projects')}
            id="hero-cta-projects"
            className="hero-cta-btn"
          >
            <span>EXPLORE MY WORK</span>
            <svg
              className="btn-arrow-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleAssistantOpen}
            id="hero-cta-assistant"
            className="hero-cta-btn hero-cta-assistant"
          >
            <span>MEET MY AI</span>
          </Button>
        </div>

        <button
          type="button"
          className="hero-scroll-indicator"
          onClick={() => scrollTo('about')}
          aria-label="Enter the journey"
        >
          <span className="hero-scroll-indicator-label">ENTER THE JOURNEY</span>
          <span className="hero-scroll-indicator-arrow" aria-hidden="true">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v12" />
              <path d="M6 17l6 6 6-6" />
            </svg>
          </span>
        </button>
      </div>

      <div className="hero-stage-negative-space" aria-hidden="true" />
    </div>
  );
};