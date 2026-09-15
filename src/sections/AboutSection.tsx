import React from 'react';

const ACADEMIC_FOUNDATION = [
  'Data Structures',
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'Software Engineering',
  'Design & Analysis of Algorithms',
  'Computer Organization & Architecture',
];

export const AboutSection: React.FC = () => {
  return (
    <div className="stage-2-layout page-container">
      <div className="stage-chapter-marker motion-reveal about-chapter-marker" data-motion-reveal="fade-up">
        <span className="stage-chapter-num">CHAPTER 01</span>
      </div>

      <div className="stage-2-editorial-grid">
        <div className="stage-2-bio-column">
          <div className="about-journey-label motion-reveal" data-motion-reveal="fade-up">
            <span>THE JOURNEY</span>
          </div>

          <h2 className="section-title about-journey-title motion-reveal" data-motion-reveal="fade-up">
            BUILDING WITH CURIOSITY.
            <span className="about-title-break">LEARNING BY DOING.</span>
          </h2>

          <p className="about-bio-paragraph motion-reveal" data-motion-reveal="fade-up">
            I&apos;m a Computer Science student focused on AI applications and software engineering,
            exploring the space where technology, creativity, and real-world problem solving meet.
          </p>
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
            <span className="about-info-label">BEYOND THE CODE</span>
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
