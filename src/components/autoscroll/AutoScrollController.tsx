import React, { useState, useEffect, useRef, useCallback } from 'react';

interface AutoScrollControllerProps {
  isPausedByMedia?: boolean;
}

const IconScrollDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconScrollPause = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

export const AutoScrollController: React.FC<AutoScrollControllerProps> = ({ isPausedByMedia = false }) => {
  const [isActive, setIsActive] = useState(false);
  const isEnabledRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  // Stop autoscroll cleanly and immediately
  const stopAutoScroll = useCallback(() => {
    isEnabledRef.current = false;
    setIsActive(false);

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // Pause immediately if media (beatbox video) plays
  useEffect(() => {
    if (isPausedByMedia && isEnabledRef.current) {
      stopAutoScroll();
    }
  }, [isPausedByMedia, stopAutoScroll]);

  // Main smooth restrained scroll loop
  useEffect(() => {
    if (!isActive) {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stopAutoScroll();
      return;
    }

    isEnabledRef.current = true;
    let lastTime = performance.now();
    let subpixelAccumulator = 0;

    // Comfortable slow reading speed (~45px per second)
    const pixelsPerSecond = 45;

    const tick = (now: number) => {
      if (!isEnabledRef.current) return;

      const dt = Math.min(50, now - lastTime) / 1000;
      lastTime = now;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY || window.pageYOffset;

      if (currentScroll >= maxScroll - 4) {
        // Reached end of page: stop cleanly
        stopAutoScroll();
        return;
      }

      subpixelAccumulator += pixelsPerSecond * dt;
      if (subpixelAccumulator >= 1) {
        const step = Math.floor(subpixelAccumulator);
        subpixelAccumulator -= step;
        window.scrollBy({
          top: step,
          left: 0,
          behavior: 'auto',
        });
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isActive, stopAutoScroll]);

  // Immediate kill-switch on manual user interaction
  useEffect(() => {
    if (!isActive) return;

    const handleUserInterrupt = (e: Event) => {
      const target = e.target as HTMLElement | null;
      // Allow clicking the autoscroll toggle button itself without killing it
      if (target?.closest('.autoscroll-toggle-btn')) {
        return;
      }
      stopAutoScroll();
    };

    const handleKeyInterrupt = (e: KeyboardEvent) => {
      // Keys that navigate or move scroll position
      const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Tab'];
      if (scrollKeys.includes(e.key)) {
        stopAutoScroll();
      }
    };

    // User manual scroll listeners
    window.addEventListener('wheel', handleUserInterrupt, { passive: true });
    window.addEventListener('touchmove', handleUserInterrupt, { passive: true });
    window.addEventListener('keydown', handleKeyInterrupt);

    // Nav click interrupt: if user clicks any link or other button
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('a') || target?.closest('button:not(.autoscroll-toggle-btn)')) {
        stopAutoScroll();
      }
    };
    document.addEventListener('click', handleLinkClick);

    // Form inputs and typing listeners: focusin on any input, textarea, contenteditable (such as ZEBX AI)
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        stopAutoScroll();
      }
    };
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      window.removeEventListener('wheel', handleUserInterrupt);
      window.removeEventListener('touchmove', handleUserInterrupt);
      window.removeEventListener('keydown', handleKeyInterrupt);
      document.removeEventListener('click', handleLinkClick);
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [isActive, stopAutoScroll]);

  const toggleAutoScroll = () => {
    if (isActive) {
      stopAutoScroll();
    } else {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      setIsActive(true);
      isEnabledRef.current = true;
    }
  };

  return (
    <div className="autoscroll-hud-container" aria-label="Cinematic auto-scroll controller">
      <button
        type="button"
        className={`autoscroll-toggle-btn${isActive ? ' is-active' : ''}`}
        onClick={toggleAutoScroll}
        title={isActive ? 'Disable automatic scrolling' : 'Enable smooth cinematic auto-scroll'}
        aria-pressed={isActive}
        aria-label={isActive ? 'Disable auto-scroll' : 'Enable auto-scroll'}
      >
        <span className="autoscroll-icon" aria-hidden="true">
          {isActive ? <IconScrollPause /> : <IconScrollDown />}
        </span>
        <span className="autoscroll-label">
          {isActive ? 'AUTOSCROLL ON' : 'AUTOSCROLL'}
        </span>
        <span className={`autoscroll-status-dot${isActive ? ' is-pulse' : ''}`} aria-hidden="true" />
      </button>
    </div>
  );
};
