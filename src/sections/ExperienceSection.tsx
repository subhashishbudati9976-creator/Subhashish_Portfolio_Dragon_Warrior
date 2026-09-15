import React from 'react';
import type { ExperienceItem } from '../types';

const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'shadowfox',
    role: 'Full-Stack Developer Intern',
    organisation: 'ShadowFox',
    timeline: 'September 2026',
    type: 'Internship',
    bullets: [
      '1-month virtual internship focused on practical, project-based full-stack software development.',
      'Progressive tasks emphasizing modern web architecture, clean component structure, and backend workflows.',
      'Active collaboration with mentors, self-paced technical research, and iterative code reviews.',
      'Applied systematic debugging to solve hands-on engineering challenges toward final project submission.',
    ],
  },
  {
    id: 'academic-dev',
    role: 'Software Developer — AI & Systems',
    organisation: 'Academic Software Engineering',
    timeline: '2026',
    type: 'Academic Project',
    bullets: [
      'Architected and implemented an AI-powered virtual assistant utilizing Python and Google Gemini for natural-language workflows.',
      'Configured multi-container environments using Docker and Docker Compose for seamless local and deployment parity.',
      'Established automated CI/CD pipeline checks for reproducible linting, builds, and test verification.',
      'Diagnosed and resolved subtle API throttling, streaming response edge cases, and environment variable configurations.',
      'Maintained thorough technical documentation detailing architecture decisions and troubleshooting runbooks.',
    ],
  },
];

const PRINCIPLES = [
  {
    title: 'Debug Systematically',
    desc: 'Diagnosing root causes in container environments and API pipelines saves more time than guesswork.',
  },
  {
    title: 'Iterate Toward Reliability',
    desc: 'Reliability comes from continuous deploy-observe-fix cycles until the system is hardened.',
  },
  {
    title: 'Document as You Build',
    desc: 'Architectural decisions that are not recorded are lost. Runbooks and technical specs are part of the deliverable.',
  },
];

export const ExperienceSection: React.FC = () => {
  return (
    <div className="stage-3-layout page-container">
      {/* Chapter Marker */}
      <div className="stage-chapter-marker motion-reveal" data-motion-reveal="fade-up">
        <span className="stage-chapter-num">03 // STAGE</span>
        <span className="stage-chapter-title">Crimson Resonance &bull; Experience &amp; Engineering Disciplines</span>
      </div>

      <div className="stage-3-content-grid">
        {/* Left Column: Focused Timeline — minimal, semi-translucent cards so crimson aura remains visible */}
        <div className="stage-3-timeline-col motion-reveal" data-motion-reveal="fade-up">
          <div className="section-label">
            <span className="type-eyebrow">Professional Timeline</span>
          </div>
          <h2 className="section-title">
            Where I&apos;ve Engineered
          </h2>

          <ol className="timeline" aria-label="Career and academic experience timeline">
            {EXPERIENCE.map((item, index) => (
              <li
                key={item.id}
                className="timeline-item motion-reveal"
                data-motion-reveal="fade-up"
                style={{
                  '--motion-reveal-delay': `${index * 120}ms`,
                } as React.CSSProperties}
              >
                <div className="timeline-dot" aria-hidden="true" />

                <div className="timeline-meta">
                  <span className="timeline-date">{item.timeline}</span>
                  <span className="timeline-type-tag">
                    {item.type.toUpperCase()}
                  </span>
                </div>

                <h3 className="timeline-role">{item.role}</h3>
                <p className="timeline-org">{item.organisation}</p>

                <ul className="timeline-bullets" aria-label={`Details for ${item.role}`}>
                  {item.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        {/* Center/Right space: Keeps the warrior and crimson energy unsheathing in full view */}
        <div className="stage-3-negative-space" aria-hidden="true" />

        {/* Right Lower Box: Engineering Principles */}
        <aside className="stage-3-principles-col motion-reveal" data-motion-reveal="fade-up">
          <div className="surface-card principles-card">
            <span className="type-eyebrow" style={{ display: 'block', marginBottom: 'var(--space-4)' }}>
              Engineering Mindset
            </span>

            <div className="principles-list">
              {PRINCIPLES.map(p => (
                <div key={p.title} className="principle-entry">
                  <h4 className="principle-entry-title">{p.title}</h4>
                  <p className="principle-entry-desc">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
