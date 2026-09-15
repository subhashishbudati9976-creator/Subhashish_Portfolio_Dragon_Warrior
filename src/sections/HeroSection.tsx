import React, { useCallback } from 'react';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

export const HeroSection: React.FC = () => {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="hero-stage-layout page-container">
      <div className="hero-stage-content">
        {/* Eyebrow & Status */}
        <div className="hero-eyebrow motion-reveal" data-motion-reveal="fade-up">
          <Badge variant="crimson">CSE &bull; NEXT-GEN COMPUTATIONAL INTELLIGENCE</Badge>
          <span className="hero-location-tag">
            <span className="hero-status-pulse" aria-hidden="true" />
            Hyderabad, India
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-headline motion-reveal" data-motion-reveal="fade-up">
          Subhashish Budati
        </h1>

        {/* Primary Positioning */}
        <p className="hero-positioning motion-reveal" data-motion-reveal="fade-up">
          Software Engineer / AI Developer
        </p>

        {/* Supporting Text */}
        <p className="hero-description motion-reveal" data-motion-reveal="fade-up">
          Building practical software, AI applications, and developer-focused
          systems with a strong interest in engineering, automation, and modern infrastructure.
        </p>

        {/* Primary CTAs — clean CSS hover without magnetic physics */}
        <div className="hero-cta-group motion-reveal" data-motion-reveal="fade-up">
          <Button
            variant="primary"
            size="lg"
            onClick={() => scrollTo('projects')}
            id="hero-cta-projects"
          >
            <span>View Projects</span>
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
            variant="secondary"
            size="lg"
            onClick={() => scrollTo('contact')}
            id="hero-cta-contact"
          >
            <span>Contact Me</span>
          </Button>
        </div>

        {/* Cinematic Timeline Kicker */}
        <div className="hero-timeline-kicker motion-reveal" data-motion-reveal="fade-up">
          <span className="timeline-kicker-num">01 // STAGE</span>
          <span className="timeline-kicker-title">Dormant Warrior &bull; Scroll to Awaken</span>
        </div>
      </div>

      {/* Right/center area is intentionally unoccupied — allows seated samurai to dominate the frame */}
      <div className="hero-stage-negative-space" aria-hidden="true" />
    </div>
  );
};