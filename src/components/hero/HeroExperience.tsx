import React, { useEffect, useRef, useState } from 'react';

interface HeroExperienceProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const VIDEO_SRC = '/media/cinematic/shadowfox-dragon-cinematic.mp4';
const CINEMATIC_HEIGHT = '235vh';

const HeroExperience: React.FC<HeroExperienceProps> = ({
  isActive,
  onComplete,
  onSkip,
}) => {
  const experienceRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setIsReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const frame = window.requestAnimationFrame(() => {
      experienceRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || isReducedMotion) return;

    const experience = experienceRef.current;
    const video = videoRef.current;
    if (!experience || !video) return;

    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    const renderProgress = () => {
      frameRef.current = null;
      const scrollDistance = experience.offsetHeight - window.innerHeight;
      const progress = scrollDistance <= 0
        ? 0
        : clamp(-experience.getBoundingClientRect().top / scrollDistance);

      progressRef.current = progress;
      experience.style.setProperty('--cinematic-progress', progress.toFixed(4));
      experience.style.setProperty('--cinematic-opacity', Math.min(1, progress * 7).toFixed(4));
      experience.style.setProperty('--cinematic-exit', Math.max(0, (progress - 0.9) * 10).toFixed(4));

      if (isReady && Number.isFinite(video.duration) && video.duration > 0) {
        const targetTime = progress * Math.max(0, video.duration - 0.05);
        if (Math.abs(video.currentTime - targetTime) > 0.025) {
          try {
            video.currentTime = targetTime;
          } catch {
            // Some browsers briefly reject seeks while metadata is being updated.
          }
        }
      }
    };

    const requestRender = () => {
      if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(renderProgress);
    };

    requestRender();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);

    return () => {
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', requestRender);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [isActive, isReady, isReducedMotion]);

  useEffect(() => {
    if (!isActive) {
      progressRef.current = 0;
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <section
      ref={experienceRef}
      className={`hero-experience${isReducedMotion ? ' is-reduced-motion' : ''}${hasError ? ' has-error' : ''}`}
      style={{ '--cinematic-height': CINEMATIC_HEIGHT } as React.CSSProperties}
      aria-label="ShadowFox scroll-driven cinematic"
    >
      <div className="hero-experience-stage">
        <div className="hero-experience-depth hero-experience-depth-back" aria-hidden="true" />
        <div className="hero-experience-depth hero-experience-depth-mid" aria-hidden="true" />
        <div className="hero-experience-frame">
          <video
            ref={videoRef}
            className="hero-experience-video"
            src={VIDEO_SRC}
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate"
            aria-label="ShadowFox dragon cinematic"
            onLoadedMetadata={() => setIsReady(true)}
            onError={() => setHasError(true)}
          />
        </div>

        <div className="hero-experience-vignette" aria-hidden="true" />
        <div className="hero-experience-copy">
          <span className="hero-experience-kicker">SHADOWFOX / SCROLL STUDY</span>
          <h2>Enter the<br /><em>quiet before impact.</em></h2>
          <p>Scroll to move through the frame. The dragon follows your pace.</p>
          <div className="hero-experience-progress" aria-hidden="true">
            <span />
          </div>
        </div>

        <div className="hero-experience-controls">
          <span className="hero-experience-status">
            {hasError ? 'Cinematic unavailable' : isReducedMotion ? 'Static preview' : 'Scroll to explore'}
          </span>
          <button type="button" className="hero-experience-skip" onClick={onSkip}>
            Exit ShadowFox <span aria-hidden="true">↗</span>
          </button>
        </div>

        {hasError && (
          <div className="hero-experience-error" role="status" aria-live="polite">
            <strong>Cinematic unavailable</strong>
            <span>The portfolio is still available below.</span>
            <button type="button" className="hero-experience-action" onClick={onComplete}>
              Continue to portfolio
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroExperience;
