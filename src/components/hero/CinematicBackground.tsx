import React, { useEffect, useRef, useState } from 'react';

interface CinematicBackgroundProps {
  timelineRef: React.RefObject<HTMLElement | null>;
}

const VIDEO_SRC = '/media/cinematic/samurai-dragon-master.mp4';
const POSTER_SRC = '/media/cinematic/hero-poster.jpg';

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  timelineRef,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // High-performance refs — ZERO layout recalculation or React state updates during scroll
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const isTimelineInViewRef = useRef(true);

  // Cached layout dimensions — updated only on resize, NEVER during scroll
  const containerTopRef = useRef(0);
  const scrollableDistanceRef = useRef(1);

  // Seek gating & watchdog refs
  const seekBusyRef = useRef(false);
  const pendingTimeRef = useRef<number | null>(null);
  const seekWatchdogRef = useRef<number | null>(null);
  const lastSeekStampRef = useRef(0);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Safe seek with frame-accurate precision, deadband threshold & watchdog protection
  const requestSeek = (targetTime: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

    const safeTime = Math.max(0, Math.min(video.duration - 0.04, targetTime));

    // Deadband threshold: skip seek if within ~half-frame duration (20ms)
    if (Math.abs(video.currentTime - safeTime) < 0.02) return;

    if (seekBusyRef.current) {
      pendingTimeRef.current = safeTime;
      return;
    }

    seekBusyRef.current = true;
    lastSeekStampRef.current = performance.now();

    // Watchdog: auto-release busy lock if browser seeked event doesn't fire within 65ms
    if (seekWatchdogRef.current !== null) {
      window.clearTimeout(seekWatchdogRef.current);
    }
    seekWatchdogRef.current = window.setTimeout(() => {
      seekBusyRef.current = false;
      if (pendingTimeRef.current !== null) {
        const next = pendingTimeRef.current;
        pendingTimeRef.current = null;
        requestSeek(next);
      }
    }, 65);

    try {
      // Precision frame-accurate assignment (avoiding coarse keyframe jumps from fastSeek)
      video.currentTime = safeTime;
    } catch {
      seekBusyRef.current = false;
      if (seekWatchdogRef.current !== null) {
        window.clearTimeout(seekWatchdogRef.current);
        seekWatchdogRef.current = null;
      }
    }
  };

  // High-performance rAF interpolation loop (smooth inertial lerp)
  const tick = (now: number) => {
    const lastTick = lastTickRef.current || now;
    const dt = Math.min(64, now - lastTick);
    lastTickRef.current = now;

    // Fluid cinematic lerp factor (k=0.14) normalized across frame intervals (60Hz, 120Hz, 240Hz calibrated)
    const factor = 1 - Math.pow(1 - 0.14, dt / 16.667);
    const target = targetProgressRef.current;
    let current = currentProgressRef.current;

    current += (target - current) * factor;

    // Idle threshold: snap when close enough to save GPU cycles
    if (Math.abs(target - current) < 0.0002) {
      current = target;
      currentProgressRef.current = current;
      rafIdRef.current = null;
      lastTickRef.current = 0;
    } else {
      currentProgressRef.current = current;
      rafIdRef.current = requestAnimationFrame(tick);
    }

    // Seek video at throttled interval (calibrated for high-refresh-rate hardware video decoders)
    const video = videoRef.current;
    if (video && video.duration && (now - lastSeekStampRef.current > 24 || Math.abs(target - current) < 0.001)) {
      requestSeek(current * video.duration);
    }

    // Direct CSS variable update on timeline container (zero React re-renders)
    const timeline = timelineRef.current;
    if (timeline) {
      timeline.style.setProperty('--cinematic-progress', current.toFixed(4));
    }
  };

  const startLoopIfNeeded = () => {
    if (rafIdRef.current === null && isTimelineInViewRef.current && !isReducedMotion) {
      lastTickRef.current = 0;
      rafIdRef.current = requestAnimationFrame(tick);
    }
  };

  // Cache static dimensions and listen to resize / orientation changes
  useEffect(() => {
    const updateDimensions = () => {
      const container = timelineRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollTop = window.scrollY || window.pageYOffset;
      containerTopRef.current = rect.top + scrollTop;
      scrollableDistanceRef.current = Math.max(1, container.offsetHeight - window.innerHeight);

      // Recompute progress with cached values
      const scrolled = scrollTop - containerTopRef.current;
      targetProgressRef.current = Math.max(0, Math.min(1, scrolled / scrollableDistanceRef.current));
      startLoopIfNeeded();
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });

    if (timelineRef.current) {
      resizeObserver.observe(timelineRef.current);
    }

    window.addEventListener('resize', updateDimensions, { passive: true });
    window.addEventListener('orientationchange', updateDimensions, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, [timelineRef]);

  // Ultra-lightweight passive scroll listener (ZERO getBoundingClientRect calls)
  useEffect(() => {
    if (isReducedMotion) return;

    const onScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const scrolled = currentScrollY - containerTopRef.current;
      const progress = scrolled / scrollableDistanceRef.current;
      targetProgressRef.current = Math.max(0, Math.min(1, progress));

      startLoopIfNeeded();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isReducedMotion]);

  // IntersectionObserver to sleep rAF loop when outside viewport
  useEffect(() => {
    const container = timelineRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isTimelineInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startLoopIfNeeded();
        } else if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
          lastTickRef.current = 0;
        }
      },
      { threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [timelineRef, isReducedMotion]);

  // Video seek event listeners with watchdog cleanup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      if (seekWatchdogRef.current !== null) {
        window.clearTimeout(seekWatchdogRef.current);
        seekWatchdogRef.current = null;
      }
      seekBusyRef.current = false;
      if (pendingTimeRef.current !== null) {
        const next = pendingTimeRef.current;
        pendingTimeRef.current = null;
        requestSeek(next);
      }
    };

    const handleError = () => {
      if (seekWatchdogRef.current !== null) {
        window.clearTimeout(seekWatchdogRef.current);
        seekWatchdogRef.current = null;
      }
      seekBusyRef.current = false;
      pendingTimeRef.current = null;
    };

    const handleLoadedMetadata = () => {
      setIsVideoReady(true);
      requestSeek(targetProgressRef.current * video.duration);
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('error', handleError);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      if (seekWatchdogRef.current !== null) {
        window.clearTimeout(seekWatchdogRef.current);
        seekWatchdogRef.current = null;
      }
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="fullpage-cinematic-stage" aria-hidden="true">
      {/* Instant fallback poster */}
      <div
        className={`cinematic-poster${isVideoReady && !isReducedMotion ? ' is-hidden' : ''}`}
        style={{ backgroundImage: `url(${POSTER_SRC})` }}
      />

      {/* 1920x1080 Native 60fps Scrub-Optimized Video Layer */}
      {!isReducedMotion && (
        <video
          ref={videoRef}
          className={`cinematic-video${isVideoReady ? ' is-ready' : ''}`}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
        />
      )}

      {/* Subtle restrained directional vignette — ensures video is clearly visible */}
      <div className="cinematic-subtle-vignette" />
      <div className="cinematic-subtle-grain" />
    </div>
  );
};
