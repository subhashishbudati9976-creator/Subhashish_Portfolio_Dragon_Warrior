import React from 'react';
import { SkillBadge } from '../components/SkillBadge';
import { CinematicSplitText } from '../components/CinematicSplitText';
import type { SkillCategory } from '../types';

/* Confirmed personal technical skill categories */
const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'programming',
    label: 'Programming',
    skills: [
      { label: 'C', note: 'Low-level systems programming & algorithms' },
      { label: 'Python', note: 'Primary language for AI, automation & tooling' },
      { label: 'Java', note: 'Object-oriented application development' },
    ],
  },
  {
    id: 'web-data',
    label: 'Web / Data',
    skills: [
      { label: 'HTML' },
      { label: 'CSS' },
      { label: 'SQL' },
      { label: 'SQLite' },
      { label: 'SQLAlchemy', note: 'Python ORM & relational querying' },
    ],
  },
  {
    id: 'devops-tools',
    label: 'DevOps / Tools',
    skills: [
      { label: 'Git' },
      { label: 'GitHub' },
      { label: 'GitHub Actions', note: 'CI/CD pipeline automation' },
      { label: 'Docker' },
      { label: 'Docker Compose', note: 'Multi-container application orchestration' },
      { label: 'Prometheus', note: 'Metrics collection & monitoring' },
      { label: 'Grafana', note: 'Observability & metric visualization' },
    ],
  },
];

/* Academic & Core CS foundations */
const FOUNDATIONS: SkillCategory = {
  id: 'academic-foundations',
  label: 'Academic & Engineering Foundations',
  skills: [
    { label: 'Data Structures' },
    { label: 'Algorithms' },
    { label: 'DBMS' },
    { label: 'Operating Systems' },
    { label: 'Computer Networks' },
    { label: 'Software Engineering' },
    { label: 'Systematic Debugging' },
  ],
};

export const SkillsSection: React.FC = () => {
  return (
    <section
      id="skills"
      className="portfolio-section page-container"
      aria-labelledby="skills-heading"
    >
      {/* Section header */}
      <div className="motion-reveal" data-motion-reveal="fade-up" style={{ marginBottom: 'var(--space-10)' }}>
        <div className="section-label">
          <span className="type-eyebrow">Technical Capability</span>
        </div>
        <h2 className="section-title" id="skills-heading">
          <CinematicSplitText lines={['SKILLS & TOOLING']} splitType="words" />
        </h2>
        <p
          className="type-body"
          style={{ maxWidth: '560px', color: 'var(--color-text-muted)' }}
        >
          Tools and technologies practiced through academic systems, containerized deployments,
          and practical software development.
        </p>
      </div>

      {/* Primary Skills Grid */}
      <div className="skills-grid" style={{ marginBottom: 'var(--space-8)' }}>
        {SKILL_CATEGORIES.map((category, index) => (
          <div
            key={category.id}
            className="surface-card skills-card motion-reveal"
            data-motion-reveal="fade-up"
            style={{
              '--motion-reveal-delay': `${index * 110}ms`,
            } as React.CSSProperties}
          >
            <div className="skills-card-header">
              <h3 className="skills-category-title">{category.label}</h3>
              <span className="skills-count-pill">{category.skills.length}</span>
            </div>
            <div className="skills-chip-row">
              {category.skills.map(skill => (
                <SkillBadge
                  key={skill.label}
                  label={skill.label}
                  variant="primary"
                  note={skill.note}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Academic Foundations */}
      <div
        className="surface-card foundations-card motion-reveal"
        data-motion-reveal="fade-up"
      >
        <div className="skills-card-header">
          <h3 className="skills-category-title">{FOUNDATIONS.label}</h3>
          <span className="skills-count-pill subtle">{FOUNDATIONS.skills.length}</span>
        </div>
        <div className="skills-chip-row">
          {FOUNDATIONS.skills.map(skill => (
            <SkillBadge
              key={skill.label}
              label={skill.label}
              variant="foundation"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
