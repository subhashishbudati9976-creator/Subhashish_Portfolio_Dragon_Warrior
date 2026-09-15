import React from 'react';
import { Badge } from './Badge';
import type { ProjectData } from '../types';

interface ProjectCardProps {
  project: ProjectData;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const {
    year,
    type,
    title,
    summary,
    context,
    contributions,
    technologies,
    github,
    live,
    featured,
  } = project;

  const cardRectRef = React.useRef<DOMRect | null>(null);

  const handlePointerEnter = (event: React.PointerEvent<HTMLElement>) => {
    cardRectRef.current = event.currentTarget.getBoundingClientRect();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = cardRectRef.current;
    if (!rect) return;
    event.currentTarget.style.setProperty(
      '--spotlight-x',
      `${event.clientX - rect.left}px`
    );
    event.currentTarget.style.setProperty(
      '--spotlight-y',
      `${event.clientY - rect.top}px`
    );
  };

  return (
    <article
      className={`project-card motion-reveal${featured ? ' featured-card' : ''}`}
      data-motion-reveal="fade-up"
      aria-label={`Project: ${title}`}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
    >
      <div className="project-card-inner">
        {/* Header meta */}
        <div className="project-header">
          <div className="project-meta">
            <span className="project-year">{year}</span>
            <Badge variant={type === 'academic' ? 'crimson' : 'default'}>
              {type === 'academic' ? 'ACADEMIC' : 'TEAM PROJECT'}
            </Badge>
            {featured && (
              <Badge variant="ember">
                <span className="featured-badge-dot" aria-hidden="true" />
                FEATURED ARCHITECTURE
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="project-title">{title}</h3>

        {/* Summary */}
        <p className="project-summary">{summary}</p>

        {/* Context / Engineering Scope if featured */}
        {featured && context && (
          <p className="project-context">
            <strong>Architecture &amp; Focus:</strong> {context}
          </p>
        )}

        {/* Contributions / Implementation Details */}
        {contributions && contributions.length > 0 && (
          <div className="project-contributions-block">
            <span className="project-contributions-label">Key Engineering Contributions:</span>
            <ul className="project-contributions" aria-label="Key contributions">
              {contributions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="project-tech-row" aria-label="Technologies used">
            {technologies.map(tech => (
              <span key={tech} className="project-tech-tag">
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Link actions */}
        <div className="project-links">
          {github.href ? (
            <a
              href={github.href}
              className="project-link-btn primary-action"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View GitHub repository for ${title} (opens in new tab)`}
            >
              <GitHubIcon />
              <span>View Source Code</span>
              <ExternalArrow />
            </a>
          ) : (
            <span
              className="project-link-btn disabled"
              aria-disabled="true"
              title="Repository access restricted or academic internal"
            >
              <GitHubIcon />
              <span>Academic Internal</span>
            </span>
          )}

          {live.href && (
            <a
              href={live.href}
              className="project-link-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open live demonstration for ${title} (opens in new tab)`}
            >
              <ExternalIcon />
              <span>{live.label}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

/* SVG Icons */
const GitHubIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const ExternalArrow: React.FC = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ marginLeft: '4px' }}
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const ExternalIcon: React.FC = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15,3 21,3 21,9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);