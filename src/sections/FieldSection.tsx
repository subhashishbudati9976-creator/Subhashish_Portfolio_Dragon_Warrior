import React from 'react';

const FIELD_DETAILS = [
  { label: 'STATUS', value: 'ONGOING' },
  { label: 'START', value: 'SEPTEMBER 2026' },
  { label: 'MODE', value: 'VIRTUAL' },
  { label: 'DURATION', value: '01 MONTH' },
];

const FIELD_TIMELINE = ['ACADEMICS', 'PROJECTS', 'SHADOWFOX', 'NEXT'];

export const FieldSection: React.FC = () => {
  return (
    <section className="field-section" aria-label="Professional field">
      <div className="field-layout page-container">
        <div className="field-intro">
          <div className="stage-chapter-marker motion-reveal field-chapter" data-motion-reveal="fade-up">
            <span className="stage-chapter-num">CHAPTER 04</span>
          </div>

          <p className="field-kicker motion-reveal" data-motion-reveal="fade-up">THE FIELD</p>
          <h2 className="field-title motion-reveal" data-motion-reveal="fade-up">
            WHERE I AM
            <span>HEADED.</span>
          </h2>
          <p className="field-supporting motion-reveal" data-motion-reveal="fade-up">
            Moving from academic experimentation into professional engineering.
          </p>

          <div className="field-timeline motion-reveal" data-motion-reveal="fade-up" aria-label="Professional transition timeline">
            {FIELD_TIMELINE.map((item, index) => (
              <div key={item} className={`field-timeline-step${item === 'SHADOWFOX' ? ' is-active' : ''}`}>
                <span className="field-timeline-marker" aria-hidden="true" />
                <span>{item}</span>
                {index < FIELD_TIMELINE.length - 1 && <span className="field-timeline-connector" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>

        <div className="field-briefing motion-reveal" data-motion-reveal="fade-up">
          <div className="field-status-hud">
            <span className="field-status-dot" aria-hidden="true" />
            <span>FIELD STATUS</span>
            <b>ONGOING</b>
          </div>

          <div className="field-briefing-header">
            <span className="field-briefing-index">01 / CURRENT DEPLOYMENT</span>
            <span className="field-briefing-year">2026</span>
          </div>

          <div className="field-briefing-title">
            <h3>SHADOWFOX</h3>
            <p>FULL-STACK DEVELOPER INTERN</p>
          </div>

          <div className="field-details" aria-label="ShadowFox internship details">
            {FIELD_DETAILS.map(detail => (
              <div className="field-detail" key={detail.label}>
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
              </div>
            ))}
          </div>

          <p className="field-transition-statement">
            A new chapter is underway — an opportunity to learn, build, and contribute in a professional engineering environment.
          </p>
        </div>
      </div>

      <div className="field-transition page-container motion-reveal" data-motion-reveal="fade-up">
        <span className="field-transition-line" aria-hidden="true" />
        <span>NEXT // THE SIGNAL</span>
      </div>
    </section>
  );
};
