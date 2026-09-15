import React from 'react';

const COURSEWORK = [
  'Data Structures & Algorithms',
  'Database Management Systems (DBMS)',
  'Operating Systems',
  'Software Engineering',
  'Computer Networks',
  'Computer Organization & Architecture',
];

const FOCUS_AREAS = [
  'AI-powered application engineering & Gemini LLM integration',
  'Multi-container orchestration & Docker Compose environments',
  'Automated CI/CD build & verification pipelines',
  'Relational schema design & transactional data integrity',
  'Systematic runtime debugging & root-cause diagnosis',
];

export const AboutSection: React.FC = () => {
  return (
    <div className="stage-2-layout page-container">
      {/* Chapter Eyebrow */}
      <div className="stage-chapter-marker motion-reveal" data-motion-reveal="fade-up">
        <span className="stage-chapter-num">02 // STAGE</span>
        <span className="stage-chapter-title">The Awakening &bull; Identity &amp; Foundations</span>
      </div>

      {/* Asymmetric Editorial Grid — positions content in visual negative space */}
      <div className="stage-2-editorial-grid">
        {/* Left Column: Focused Narrative */}
        <div className="stage-2-bio-column motion-reveal" data-motion-reveal="fade-up">
          <div className="section-label">
            <span className="type-eyebrow">Professional Identity</span>
          </div>
          <h2 className="section-title">
            Engineering with Purpose &amp; Rigor
          </h2>

          <p className="about-bio-paragraph">
            I am a Computer Science student pursuing an Integrated Dual Degree (B.Tech + M.Tech)
            at <strong style={{ color: 'var(--color-text-primary)' }}>
              JNTUH – University College of Engineering, Science &amp; Technology Hyderabad
            </strong>.
            My work centers on software engineering, practical AI applications, and developer-focused
            systems designed for reliability, clarity, and performance.
          </p>

          <p className="about-bio-paragraph">
            I approach development with an engineer&apos;s discipline: diagnosing root causes rather than
            patching symptoms, writing maintainable code, and testing deployment pipelines end-to-end.
            Whether integrating conversational intelligence with Google Gemini or automating container
            deployments with Docker Compose, I care deeply about how systems behave under real conditions.
          </p>

          <p className="about-bio-paragraph">
            Beyond engineering, I bring 10 years of dedication to beatboxing in the collegiate music
            community. The rhythm, vocal acoustics, and structural timing of beatboxing require the same
            intense focus and iterative refinement as debugging complex distributed systems.
          </p>

          {/* Quick Identity Tags */}
          <div className="about-tags-row">
            <span className="about-personal-tag">HYDERABAD, INDIA</span>
            <span className="about-personal-tag">B.TECH + M.TECH (INTEGRATED)</span>
            <span className="about-personal-tag">AI &amp; DEVOPS FOCUS</span>
            <span className="about-personal-tag">BEATBOXER &bull; 10 YRS</span>
          </div>
        </div>

        {/* Center Negative Space — wide opening so the warrior's face and glowing red eye remain 100% visible */}
        <div className="stage-2-center-space" aria-hidden="true" />

        {/* Right Column: Verified Academic Credentials Card */}
        <aside className="stage-2-credentials-column motion-reveal" data-motion-reveal="fade-up">
          <div className="surface-card education-card">
            <div className="education-header">
              <span className="type-eyebrow">Academic Credentials</span>
              <span className="education-reg-badge">R22</span>
            </div>

            <ul className="about-detail-list">
              <li className="about-detail-item">
                <span className="about-detail-label">Institution</span>
                <span className="about-detail-value">JNTUH &ndash; UCESTH</span>
              </li>
              <li className="about-detail-item">
                <span className="about-detail-label">Program</span>
                <span className="about-detail-value">Integrated Dual Degree (B.Tech + M.Tech)</span>
              </li>
              <li className="about-detail-item">
                <span className="about-detail-label">Major</span>
                <span className="about-detail-value">Computer Science &amp; Engineering</span>
              </li>
              <li className="about-detail-item">
                <span className="about-detail-label">Timeline</span>
                <span className="about-detail-value">2024 &ndash; 2029</span>
              </li>
              <li className="about-detail-item">
                <span className="about-detail-label">Current Status</span>
                <span className="about-detail-value highlight">3rd Year, 1st Sem / 5th Sem</span>
              </li>
              <li className="about-detail-item">
                <span className="about-detail-label">Overall CGPA</span>
                <span className="about-detail-value cgpa-accent">
                  8.33333 <span className="cgpa-scale">/ 10</span>
                </span>
              </li>
            </ul>

            <hr className="education-divider" />

            <h4 className="type-eyebrow" style={{ marginBottom: 'var(--space-3)' }}>
              Core Coursework
            </h4>
            <ul className="coursework-list">
              {COURSEWORK.map(c => (
                <li key={c} className="coursework-item">
                  <span className="coursework-bullet" aria-hidden="true" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Technical Focus highlights */}
          <div className="stage-2-focus-box">
            <span className="type-eyebrow" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
              Core Focus Areas
            </span>
            <ul className="about-focus-list">
              {FOCUS_AREAS.map(item => (
                <li key={item} className="about-focus-item">
                  <span className="about-focus-bullet" aria-hidden="true">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
