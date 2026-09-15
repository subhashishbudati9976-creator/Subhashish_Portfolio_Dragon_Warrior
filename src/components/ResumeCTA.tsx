import React from 'react';

const RESUME_URL = '/resume/Subhashish-Budati-Resume.pdf';

export const ResumeCTA: React.FC = () => {
  return (
    <section className="resume-cta-section page-container" aria-label="Resume access">
      <div className="resume-cta-card motion-reveal" data-motion-reveal="fade-up">
        <div className="resume-cta-glow" aria-hidden="true" />
        <div className="resume-cta-content">
          <div className="resume-cta-icon-wrap" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>

          <div className="resume-cta-text">
            <span className="type-eyebrow resume-eyebrow">CURRICULUM VITAE</span>
            <h2 className="resume-cta-heading">Want the full picture?</h2>
            <p className="resume-cta-description">
              View my resume for a concise overview of my experience, projects, skills, education,
              and achievements.
            </p>
          </div>

          <div className="resume-cta-actions">
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-md resume-btn"
              aria-label="View Subhashish Budati Resume PDF in a new tab"
            >
              <span>View Resume</span>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ marginLeft: '6px' }}
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>

            <a
              href={RESUME_URL}
              download="Subhashish-Budati-Resume.pdf"
              className="btn btn-secondary btn-md resume-btn"
              aria-label="Download Subhashish Budati Resume PDF"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ marginRight: '6px' }}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
