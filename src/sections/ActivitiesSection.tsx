import React from 'react';

interface ActivityItem {
  id: string;
  category: string;
  title: string;
  role: string;
  description: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'jac',
    category: 'Leadership & Coordination',
    title: 'JNTUH-JAC',
    role: '1st Year Coordinator',
    description:
      'Spearheaded student coordination, logistical planning, and onboarding initiatives across campus engineering departments.',
  },
  {
    id: 'cr',
    category: 'Academic Representation',
    title: 'University Class Representative',
    role: 'Class Representative (3 Semesters)',
    description:
      'Served as the elected representative for the CSE integrated dual-degree cohort for three consecutive semesters, facilitating academic liaison with department faculty.',
  },
  {
    id: 'quest',
    category: 'Technical Organization',
    title: 'QUEST 2025',
    role: 'Technical Workshop Organizer',
    description:
      'Contributed to the planning and execution of department technical workshops and public presentations for undergraduate developers.',
  },
  {
    id: 'beatbox',
    category: 'Vocal Percussion & Performance',
    title: 'Collegiate Music & Vocal Arts',
    role: 'Beatboxer (10 Years Experience)',
    description:
      'Dedicated vocal percussionist with a decade of acoustic practice in collegiate musical events and Raghavarsha club showcases. A distinct personal craft rooted in discipline, micro-timing, and breath control.',
  },
  {
    id: 'bootcamp',
    category: 'Workshops & Certifications',
    title: 'Being Infinity Bootcamp',
    role: 'Web Development & Deployment',
    description:
      'Completed intensive practical workshop covering modern web architecture, frontend styling, and production deployment lifecycles.',
  },
  {
    id: 'avalanche',
    category: 'Workshops & Certifications',
    title: 'Avalanche Ecosystem Workshop',
    role: 'Blockchain Architecture Attendee',
    description:
      'Participated in hands-on technical sessions exploring subnet architectures, consensus mechanisms, and decentralized system fundamentals.',
  },
];

export const ActivitiesSection: React.FC = () => {
  return (
    <section
      id="activities"
      className="portfolio-section page-container"
      aria-labelledby="activities-heading"
    >
      {/* Section Header */}
      <div className="motion-reveal" data-motion-reveal="fade-up" style={{ marginBottom: 'var(--space-10)' }}>
        <div className="section-label">
          <span className="type-eyebrow">Leadership &amp; Distinction</span>
        </div>
        <h2 className="section-title" id="activities-heading">
          Beyond the Code
        </h2>
        <p className="type-body" style={{ maxWidth: '560px', color: 'var(--color-text-muted)' }}>
          Extracurricular leadership, technical workshop organizing, and personal creative pursuits
          that shape how I communicate, coordinate, and perform.
        </p>
      </div>

      {/* Grid of Activities */}
      <div className="activities-grid">
        {ACTIVITIES.map((item, index) => (
          <article
            key={item.id}
            className="surface-card activity-card motion-reveal"
            data-motion-reveal="fade-up"
            style={{
              '--motion-reveal-delay': `${index * 90}ms`,
            } as React.CSSProperties}
          >
            <div className="activity-card-header">
              <span className="activity-category-tag">{item.category}</span>
            </div>
            <h3 className="activity-title">{item.title}</h3>
            <p className="activity-role">{item.role}</p>
            <p className="activity-desc">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
