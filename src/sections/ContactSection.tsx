import React from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { useContactForm } from '../hooks/useContactForm';

export const ContactSection: React.FC = () => {
  const {
    data,
    errors,
    status,
    serverError,
    handleChange,
    handleSubmit,
    handleReset,
  } = useContactForm();

  return (
    <section
      id="contact"
      className="portfolio-section page-container"
      aria-labelledby="contact-heading"
    >
      <div className="contact-grid">
        {/* Left Column: Direct Outreach & Social Links */}
        <div className="contact-intro-col motion-reveal" data-motion-reveal="fade-up">
          <div className="section-label">
            <span className="type-eyebrow">Initiate Contact</span>
          </div>
          <h2 className="section-title" id="contact-heading">
            Let&apos;s Build Together
          </h2>
          <p className="type-body-lg" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
            Whether discussing engineering roles, AI initiatives, distributed systems,
            or open-source collaboration, my inbox is open.
          </p>

          <div className="contact-channels-list">
            <div className="contact-channel-card">
              <span className="contact-channel-label">Direct Email</span>
              <a
                className="contact-channel-value link"
                href="mailto:subhashishbudati9976@gmail.com"
              >
                subhashishbudati9976@gmail.com
              </a>
            </div>

            <div className="contact-channel-card">
              <span className="contact-channel-label">Base Location</span>
              <span className="contact-channel-value">Hyderabad, India</span>
            </div>
          </div>

          {/* Social Profiles Grid */}
          <div className="contact-socials-block">
            <span className="contact-channel-label" style={{ marginBottom: 'var(--space-3)', display: 'block' }}>
              Professional Profiles
            </span>
            <div className="contact-social-links">
              <a
                href="https://github.com/subhashishbudati9976-creator"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-btn"
                aria-label="Subhashish Budati on GitHub (opens in new tab)"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/subhashish-budati-685664427"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-btn"
                aria-label="Subhashish Budati on LinkedIn (opens in new tab)"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://leetcode.com/u/Nani_7096/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-btn"
                aria-label="Subhashish Budati on LeetCode (opens in new tab)"
              >
                <LeetCodeIcon />
                <span>LeetCode</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="contact-form-card motion-reveal motion-scale-fade" data-motion-reveal="scale-fade">
          {status === 'success' ? (
            <div className="contact-success" role="status" aria-live="polite">
              <div className="contact-success-icon" aria-hidden="true">&#10003;</div>
              <h3 className="contact-success-title">Message Received</h3>
              <p className="contact-success-body">
                Thank you for reaching out! Your message was submitted successfully.
                You can also email me directly at{' '}
                <a href="mailto:subhashishbudati9976@gmail.com" className="text-link">
                  subhashishbudati9976@gmail.com
                </a>.
              </p>
              <Button type="button" variant="secondary" onClick={handleReset}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {serverError && (
                <div className="contact-error-banner" role="alert">
                  {serverError}
                </div>
              )}

              <div className="contact-form-row">
                <Input
                  id="contact-name"
                  name="name"
                  label="Name"
                  value={data.name}
                  onChange={handleChange}
                  error={errors.name}
                  autoComplete="name"
                  maxLength={80}
                  required
                />
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={data.email}
                  onChange={handleChange}
                  error={errors.email}
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </div>

              <Input
                id="contact-subject"
                name="subject"
                label="Subject"
                value={data.subject}
                onChange={handleChange}
                error={errors.subject}
                maxLength={120}
                required
              />

              <Textarea
                id="contact-message"
                name="message"
                label="Message"
                value={data.message}
                onChange={handleChange}
                error={errors.message}
                maxLength={2000}
                rows={6}
                required
              />

              <div className="contact-form-actions">
                <Button type="submit" size="lg" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Transmitting...' : 'Send Message'}
                </Button>
                <span className="form-feedback helper">
                  Responses typically sent within 24 hours.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* Profile Icons */
const GitHubIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const LeetCodeIcon: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.874 5.874 0 0 0 .349 1.017 5.938 5.938 0 0 0 .584.951l.013.015a5.736 5.736 0 0 0 4.708 2.404c1.391 0 2.696-.508 3.708-1.423l3.08-2.79a1.357 1.357 0 0 0 .159-1.899 1.365 1.365 0 0 0-1.921-.161l-3.01 2.729a3.1 3.1 0 0 1-2.016.77 3.003 3.003 0 0 1-2.456-1.258 3.197 3.197 0 0 1-.497-1.802 3.238 3.238 0 0 1 .497-1.801l3.528-3.774 4.908-5.246a1.371 1.371 0 0 0-.961-2.316zM15.485 10.428a1.375 1.375 0 0 0-.974.402l-4.229 4.228a1.375 1.375 0 1 0 1.944 1.945l4.23-4.228a1.375 1.375 0 0 0-.971-2.347zM20.088 12.001H14.5a1.375 1.375 0 1 0 0 2.75h5.588a1.375 1.375 0 1 0 0-2.75z" />
  </svg>
);