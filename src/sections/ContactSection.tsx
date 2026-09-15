import React from 'react';

export const ContactSection: React.FC = () => {
  return (
    <section
      id="contact"
      className="signal-section page-container"
      aria-labelledby="contact-heading"
    >
      <div className="signal-layout">
        <div className="signal-intro motion-reveal" data-motion-reveal="fade-up">
          <div className="stage-chapter-marker signal-chapter">
            <span className="stage-chapter-num">CHAPTER 05</span>
          </div>
          <p className="signal-kicker">THE SIGNAL</p>
          <h2 className="signal-title" id="contact-heading">
            IF YOU FOUND YOUR WAY HERE,
            <span>LET&apos;S BUILD SOMETHING.</span>
          </h2>
          <p className="signal-supporting">
            Have an idea, a project, or an opportunity worth exploring? Let&apos;s connect.
          </p>
        </div>

        <div className="signal-interface motion-reveal" data-motion-reveal="fade-up">
          <div className="signal-interface-heading">
            <span>CONTACT</span>
            <span className="signal-heading-line" aria-hidden="true" />
          </div>
          <a className="signal-contact-link" href="mailto:subhashishbudati9976@gmail.com">
            <span>EMAIL</span>
            <span>subhashishbudati9976@gmail.com ↗</span>
          </a>
          <a className="signal-contact-link" href="https://www.linkedin.com/in/subhashish-budati-685664427" target="_blank" rel="noopener noreferrer">
            <span>LINKEDIN</span>
            <span>PROFILE ↗</span>
          </a>
          <a className="signal-contact-link" href="https://github.com/subhashishbudati9976-creator" target="_blank" rel="noopener noreferrer">
            <span>GITHUB</span>
            <span>REPOSITORIES ↗</span>
          </a>
        </div>

        <div className="signal-action-zone motion-reveal" data-motion-reveal="fade-up">
          <a className="signal-primary-cta" href="mailto:subhashishbudati9976@gmail.com">
            <span>START A CONVERSATION</span>
            <span aria-hidden="true">↗</span>
          </a>
          <div className="signal-ai-hook" aria-label="Subu AI visual hook">
            <span>CURIOUS?</span>
            <span>ASK SUBU AI ↗</span>
          </div>
        </div>

        <div className="signal-signature motion-reveal" data-motion-reveal="fade-up">
          <strong>SUBHASHISH BUDATI</strong>
          <span>CSE · AI APPLICATIONS · SOFTWARE ENGINEERING</span>
          <span className="signal-signature-motto">BUILD. LEARN. EVOLVE.</span>
        </div>
      </div>

      <div className="signal-system motion-reveal" data-motion-reveal="fade-up">
        <span className="signal-system-line" aria-hidden="true" />
        <span>SYSTEM // JOURNEY COMPLETE</span>
        <span className="signal-ready"><i aria-hidden="true" />SIGNAL READY</span>
      </div>
    </section>
  );
};
