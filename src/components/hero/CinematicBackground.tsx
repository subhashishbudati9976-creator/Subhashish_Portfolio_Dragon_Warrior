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

  // Performance refs — ZERO React state updates during scroll
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const isTimelineInViewRef = useRef(true);

  // Seek gating refs
  const seekBusyRef = useRef(false);
  const pendingTimeRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Safe seek with deadband threshold & queue gating
  const requestSeek = (targetTime: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

    const safeTime = Math.max(0, Math.min(video.duration - 0.05, targetTime));

    // Avoid redundant seeking if already within 0.025s deadband
    if (Math.abs(video.currentTime - safeTime) < 0.025) return;

    if (seekBusyRef.current) {
      pendingTimeRef.current = safeTime;
      return;
    }

    seekBusyRef.current = true;
    try {
      video.currentTime = safeTime;
    } catch {
      seekBusyRef.current = false;
    }
  };

  // High-performance rAF interpolation loop
  const tick = (now: number) => {
    const lastTick = lastTickRef.current || now;
    const dt = Math.min(100, now - lastTick);
    lastTickRef.current = now;

    // Normalizing lerp factor (k=0.18) to 60fps
    const factor = 1 - Math.pow(1 - 0.18, dt / 16.667);
    const target = targetProgressRef.current;
    let current = currentProgressRef.current;

    current += (target - current) * factor;

    // Idle detection threshold
    if (Math.abs(target - current) < 0.0003) {
      current = target;
      currentProgressRef.current = current;
      rafIdRef.current = null;
      lastTickRef.current = 0;
    } else {
      currentProgressRef.current = current;
      rafIdRef.current = requestAnimationFrame(tick);
    }

    // Direct video currentTime update
    const video = videoRef.current;
    if (video && video.duration) {
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

  // Passive window scroll tracking
  useEffect(() => {
    if (isReducedMotion) return;

    const calculateProgress = () => {
      const container = timelineRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = container.offsetHeight - window.innerHeight;

      if (scrollableDistance <= 0) {
        targetProgressRef.current = 0;
      } else {
        const scrolled = -rect.top;
        const progress = scrolled / scrollableDistance;
        targetProgressRef.current = Math.max(0, Math.min(1, progress));
      }

      startLoopIfNeeded();
    };

    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress);
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [timelineRef, isReducedMotion]);

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

  // Seek listeners to guarantee deadlock safety
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      seekBusyRef.current = false;
      if (pendingTimeRef.current !== null) {
        const next = pendingTimeRef.current;
        pendingTimeRef.current = null;
        requestSeek(next);
      }
    };

    const handleError = () => {
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
