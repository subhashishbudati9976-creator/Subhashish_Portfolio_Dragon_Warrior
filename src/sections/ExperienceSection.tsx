import React from 'react';

const SKILL_GROUPS = [
  {
    id: 'programming',
    label: 'PROGRAMMING',
    items: [
      { number: '01', value: 'C' },
      { number: '02', value: 'Python' },
      { number: '03', value: 'Java' },
      { number: '04', value: 'HTML' },
      { number: '05', value: 'CSS' },
    ],
  },
  {
    id: 'version-control',
    label: 'TOOLS & VERSION CONTROL',
    items: [
      { number: '01', value: 'Git' },
      { number: '02', value: 'GitHub' },
    ],
  },
  {
    id: 'computer-science',
    label: 'CORE COMPUTER SCIENCE',
    items: [
      { number: '01', value: 'Data Structures' },
      { number: '02', value: 'DBMS' },
      { number: '03', value: 'Operating Systems' },
      { number: '04', value: 'Computer Networks' },
      { number: '05', value: 'Software Engineering' },
      { number: '06', value: 'Design & Analysis of Algorithms' },
      { number: '07', value: 'Computer Organization & Architecture' },
    ],
  },
  {
    id: 'ai-software',
    label: 'AI & SOFTWARE DEVELOPMENT',
    items: [
      { number: '01', value: 'AI-powered Applications' },
      { number: '02', value: 'Google Gemini Integration' },
      { number: '03', value: 'API Integration' },
      { number: '04', value: 'Software Debugging' },
    ],
  },
  {
    id: 'devops',
    label: 'DEVOPS & DEPLOYMENT',
    items: [
      { number: '01', value: 'Deployment' },
      { number: '02', value: 'Containerization' },
      { number: '03', value: 'CI/CD' },
      { number: '04', value: 'Deployment Configuration' },
    ],
  },
];

export const ExperienceSection: React.FC = () => {
  return (
    <div className="stage-3-layout page-container">
      <div className="stage-chapter-marker motion-reveal arsenal-chapter" data-motion-reveal="fade-up">
        <span className="stage-chapter-num">CHAPTER 02</span>
      </div>

      <div className="stage-3-content-grid">
        <div className="stage-3-timeline-col">
          <h2 className="section-title arsenal-title motion-reveal" data-motion-reveal="fade-up">
            THE ARSENAL
          </h2>

          <p className="arsenal-subtitle motion-reveal" data-motion-reveal="fade-up">
            TOOLS OF THE CRAFT
          </p>
        </div>

        <div className="stage-3-negative-space" aria-hidden="true" />

        <aside className="stage-3-principles-col motion-reveal" data-motion-reveal="fade-up">
          <div className="arsenal-groups" aria-label="Technology groups">
            {SKILL_GROUPS.map((group, index) => (
              <div
                key={group.id}
                className="arsenal-group motion-reveal"
                data-motion-reveal="fade-up"
                style={{ '--motion-reveal-delay': `${index * 120}ms` } as React.CSSProperties}
              >
                <div className="arsenal-group-header">
                  <span>{group.label}</span>
                </div>

                <ul className="arsenal-list" aria-label={group.label}>
                  {group.items.map(item => (
                    <li key={`${group.id}-${item.number}`} className="arsenal-item">
                      <span className="arsenal-number">{item.number}</span>
                      <span className="arsenal-name">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="arsenal-footer">BUILDING THROUGH PRACTICAL PROJECTS.</p>
        </aside>
      </div>
    </div>
  );
};
