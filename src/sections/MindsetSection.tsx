/**
 * MindsetSection — Phase 2
 *
 * Communicates how Subhashish approaches building software.
 * Content derived exclusively from verified project and experience
 * details in docs/CONTENT.md §6, §8. No invented principles.
 */

import React from 'react';

const PRINCIPLES = [
  {
    id: 'debug',
    title: 'Debug Systematically',
    body: 'When something breaks, the instinct is to understand why, not just to patch it. Diagnosing API integration issues, containerisation failures, and CI/CD pipeline errors taught me that systematic investigation saves more time than guesswork.',
  },
  {
    id: 'iterate',
    title: 'Iterate Toward Reliability',
    body: 'Reliability comes from iterative improvement — not from getting everything right the first time. Each cycle of deploy → observe → fix brings the system closer to something you can actually trust.',
  },
  {
    id: 'document',
    title: 'Document as You Go',
    body: 'Implementation decisions that aren\'t documented are lost. Writing down what was decided, why it was decided, and what was discovered along the way is part of the work — not an afterthought.',
  },
  {
    id: 'practical',
    title: 'Keep It Practical',
    body: 'Architecture should serve the actual product. The best solution is the one that is maintainable, testable, and proportional to the real requirement — not the one that looks most impressive on paper.',
  },
];

export const MindsetSection: React.FC = () => {
  return (
    <section
      id="mindset"
      className="portfolio-section page-container"
      aria-labelledby="mindset-heading"
    >
      <div className="mindset-grid">
        {/* Left: intro */}
        <div className="motion-reveal" data-motion-reveal="fade-up">
          <div className="section-label" style={{ marginBottom: 'var(--space-3)' }}>
            <span className="type-eyebrow">Engineering Mindset</span>
          </div>
          <h2 className="section-title" id="mindset-heading">
            How I Build
          </h2>
          <p className="mindset-intro">
            My approach to software comes from hands-on debugging,
            iterative problem solving, and building things that needed to
            actually work — not just demonstrate a concept.
          </p>
          <p
            className="type-body"
            style={{ color: 'var(--color-text-muted)' }}
          >
            These are the principles I&apos;ve found useful through academic
            project work and self-directed development. They&apos;re not
            abstract values — they come from real debugging sessions and
            real deployment failures.
          </p>
        </div>

        {/* Right: principles */}
        <div className="mindset-principles motion-stagger motion-reveal" data-motion-reveal="fade-up" role="list">
          {PRINCIPLES.map((principle, index) => (
            <div
              key={principle.id}
              className="mindset-principle"
              data-motion-reveal-item
              style={{ '--motion-reveal-index': index } as React.CSSProperties}
              role="listitem"
            >
              <h3 className="mindset-principle-title">{principle.title}</h3>
              <p className="mindset-principle-body">{principle.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
