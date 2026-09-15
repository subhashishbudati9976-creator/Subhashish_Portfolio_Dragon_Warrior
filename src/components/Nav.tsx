import React, { useState, useEffect, useCallback, useRef } from 'react';

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

const SECTION_IDS = NAV_ITEMS.map(item => item.href.slice(1));

export const Nav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  /* Track active section via IntersectionObserver */
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-30% 0px -50% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  /* Smooth-scroll + close mobile overlay */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMobileOpen(false);
      if (mobileOpen) {
        hamburgerRef.current?.focus();
      }
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [mobileOpen]
  );

  const scrollToTop = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* Focus management and escape key listener for mobile drawer */
  useEffect(() => {
    if (!mobileOpen) return;

    closeButtonRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Minimal cinematic HUD navigation */}
      <nav
        className="cinematic-hud-nav"
        aria-label="Primary navigation"
        role="navigation"
      >
        <div className="hud-nav-inner">
          {/* Brand monogram */}
          <a
            href="#hero"
            className="hud-nav-brand"
            onClick={scrollToTop}
            aria-label="Return to top of page"
          >
            <span className="hud-brand-dot" aria-hidden="true" />
            <span className="hud-brand-text">SB</span>
          </a>

          {/* Desktop HUD links */}
          <div className="hud-nav-links" role="list">
            {NAV_ITEMS.map(item => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`hud-nav-link${isActive ? ' is-active' : ''}`}
                  onClick={e => handleNavClick(e, item.href)}
                  aria-current={isActive ? 'true' : undefined}
                  role="listitem"
                >
                  <span className="hud-nav-link-text">{item.label}</span>
                  {isActive && <span className="hud-active-line" aria-hidden="true" />}
                </a>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            className="hud-mobile-toggle"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-overlay"
            onClick={() => setMobileOpen(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect y="4" width="20" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="9.25" width="20" height="1.5" rx="0.75" fill="currentColor" />
              <rect y="14.5" width="20" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <div
        id="mobile-nav-overlay"
        className={`nav-mobile-overlay${mobileOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <button
          ref={closeButtonRef}
          className="nav-mobile-close"
          aria-label="Close navigation menu"
          onClick={() => {
            setMobileOpen(false);
            hamburgerRef.current?.focus();
          }}
        >
          &times;
        </button>

        <nav aria-label="Mobile navigation list" role="list">
          {NAV_ITEMS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-mobile-link${activeSection === item.href.slice(1) ? ' active' : ''}`}
              onClick={e => handleNavClick(e, item.href)}
              role="listitem"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};
