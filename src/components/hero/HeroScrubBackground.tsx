import React, { useEffect, useRef, useState } from 'react';

interface HeroScrubBackgroundProps {
  onProgressChange?: (progress: number) => void;
  containerRef: React.RefObject<HTMLElement | null>;
}

const VIDEO_SRC = '/media/cinematic/samurai-dragon-master.mp4';
const POSTER_SRC = '/media/cinematic/hero-poster.jpg';

export const HeroScrubBackground: React.FC<HeroScrubBackgroundProps> = ({
  onProgressChange,
  containerRef,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Track progress and animation frame refs
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const isHeroInViewRef = useRef(true);

  // Seek gating state
  const seekBusyRef = useRef(false);
  const pendingTimeRef = useRef<number | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Safe seek function with gating
  const requestSeek = (targetTime: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

    // Clamp time within video duration boundaries
    const safeTime = Math.max(0, Math.min(video.duration - 0.05, targetTime));

    if (seekBusyRef.current) {
      pendingTimeRef.current = safeTime;
      return;
    }

    seekBusyRef.current = true;
    try {
      video.currentTime = safeTime;
    } catch {
      // Browser rejected seek momentarily
      seekBusyRef.current = false;
    }
  };

  // Animation tick with frame-rate independent lerp
  const tick = (now: number) => {
    const lastTick = lastTickRef.current || now;
    const dt = Math.min(100, now - lastTick);
    lastTickRef.current = now;

    // Normalizing lerp factor k to 60fps reference
    const k = 0.16;
    const factor = 1 - Math.pow(1 - k, dt / 16.667);
    const target = targetProgressRef.current;
    let current = currentProgressRef.current;

    current += (target - current) * factor;

    if (Math.abs(target - current) < 0.0004) {
      current = target;
      currentProgressRef.current = current;
      rafIdRef.current = null;
      lastTickRef.current = 0;
    } else {
      currentProgressRef.current = current;
      rafIdRef.current = requestAnimationFrame(tick);
    }

    // Update video time
    const video = videoRef.current;
    if (video && video.duration) {
      requestSeek(current * video.duration);
    }

    if (onProgressChange) {
      onProgressChange(current);
    }
  };

  const startLoopIfNeeded = () => {
    if (rafIdRef.current === null && isHeroInViewRef.current && !isReducedMotion) {
      lastTickRef.current = 0;
      rafIdRef.current = requestAnimationFrame(tick);
    }
  };

  // Scroll measurement
  useEffect(() => {
    if (isReducedMotion) return;

    const calculateProgress = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) {
        targetProgressRef.current = 0;
      } else {
        const scrolled = -rect.top;
        const rawProgress = scrolled / scrollableDistance;
        targetProgressRef.current = Math.max(0, Math.min(1, rawProgress));
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
  }, [containerRef, isReducedMotion]);

  // IntersectionObserver to pause processing when hero is scrolled past
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isHeroInViewRef.current = entry.isIntersecting;
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
  }, [containerRef, isReducedMotion]);

  // Handle video seeked and error events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => {
      seekBusyRef.current = false;
      if (pendingTimeRef.current !== null) {
        const nextTime = pendingTimeRef.current;
        pendingTimeRef.current = null;
        requestSeek(nextTime);
      }
    };

    const handleError = () => {
      seekBusyRef.current = false;
      pendingTimeRef.current = null;
    };

    const handleLoadedMetadata = () => {
      setIsVideoReady(true);
      // Immediately sync to initial scroll position
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
    <div className="hero-scrub-container" aria-hidden="true">
      {/* Poster layer (acts as static fallback and loads instantly) */}
      <div
        className={`hero-scrub-poster${isVideoReady && !isReducedMotion ? ' is-hidden' : ''}`}
        style={{ backgroundImage: `url(${POSTER_SRC})` }}
      />

      {/* Background Video layer */}
      {!isReducedMotion && (
        <video
          ref={videoRef}
          className={`hero-scrub-video${isVideoReady ? ' is-ready' : ''}`}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
        />
      )}

      {/* Cinematic Vignette & Atmospheric Gradients */}
      <div className="hero-scrub-vignette" />
      <div className="hero-scrub-grain" />
    </div>
  );
};
