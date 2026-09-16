import React from 'react';
import { CinematicSplitText } from '../components/CinematicSplitText';

const ACADEMIC_FOUNDATION = [
  'Data Structures',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'Design & Analysis of Algorithms',
  'Computer Organization & Architecture',
];

const JOURNEY_PRINCIPLES = [
  { index: '01', icon: '+', title: 'LEARN', detail: 'New Concepts' },
  { index: '02', icon: '[]', title: 'BUILD', detail: 'Real Projects' },
  { index: '03', icon: '>', title: 'IMPROVE', detail: 'Everyday' },
  { index: '04', icon: '=', title: 'REPEAT', detail: 'With Purpose' },
];

export const AboutSection: React.FC = () => {
  return (
    <div className="stage-2-layout page-container">
      <div className="stage-chapter-marker motion-reveal about-chapter-marker" data-motion-reveal="fade-up">
        <span className="stage-chapter-num"><CinematicSplitText lines={['CHAPTER 01']} splitType="words" /></span>
      </div>

      <div className="stage-2-editorial-grid">
        <div className="stage-2-bio-column">
          <div className="about-journey-label motion-reveal" data-motion-reveal="fade-up">
            <CinematicSplitText lines={['THE JOURNEY']} splitType="words" />
          </div>

          <h2 className="section-title about-journey-title motion-reveal" data-motion-reveal="fade-up">
            <CinematicSplitText lines={['BUILDING WITH CURIOSITY.', 'LEARNING BY DOING.']} />
          </h2>

          <p className="about-bio-paragraph motion-reveal" data-motion-reveal="fade-up">
            I&apos;m a Computer Science student focused on AI applications and software engineering,
            exploring the space where technology, creativity, and real-world problem solving meet.
          </p>

          <div className="journey-principles-wrap motion-reveal" data-motion-reveal="fade-up">
            <div className="journey-principles" aria-label="Personal engineering principles">
              {JOURNEY_PRINCIPLES.map((principle, index) => (
                <div
                  key={principle.index}
                  className="journey-principle-tile"
                  style={{ '--principle-delay': `${index * 80}ms` } as React.CSSProperties}
                >
                  <span className="journey-principle-index">{principle.index}</span>
                  <span className="journey-principle-icon" aria-hidden="true">{principle.icon}</span>
                  <strong>{principle.title}</strong>
                  <span className="journey-principle-detail">{principle.detail}</span>
                </div>
              ))}
            </div>

            <div className="journey-signature" aria-label="Same curiosity, higher horizons">
              <span className="journey-signature-mark">進む</span>
              <span className="journey-signature-rule" aria-hidden="true" />
              <span className="journey-signature-copy">SAME CURIOSITY. HIGHER HORIZONS.</span>
            </div>
          </div>
        </div>

        <div className="stage-2-center-space" aria-hidden="true" />

        <aside className="about-secondary-stack motion-reveal" data-motion-reveal="fade-up">
          <div className="about-info-block">
            <span className="about-info-label">EDUCATION</span>
            <div className="about-info-body">
              <p>JNTUH — University College of Engineering,</p>
              <p>Science &amp; Technology Hyderabad</p>
              <p>B.Tech + M.Tech</p>
              <p>Computer Science &amp; Engineering</p>
              <p>Integrated Dual Degree Program</p>
              <p>2024 — 2029</p>
            </div>
          </div>

          <div className="about-info-block">
            <span className="about-info-label">ACADEMIC FOUNDATION</span>
            <ul className="about-info-list">
              {ACADEMIC_FOUNDATION.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="about-info-block">
            <span className="about-info-label"><CinematicSplitText lines={['BEYOND THE CODE']} splitType="words" /></span>
            <div className="about-personal-dimension">
              <span>Raghavarsha Club</span>
              <span>Beatboxing</span>
              <span>10 YEARS</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
