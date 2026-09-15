import React from 'react';

interface HeroExperienceFallbackProps {
  onContinue: () => void;
}

const HeroExperienceFallback: React.FC<HeroExperienceFallbackProps> = ({
  onContinue,
}) => {
  return (
    <div
      className="hero-experience-fallback"
      role="status"
      aria-live="polite"
    >
      <div className="hero-experience-fallback-mark" aria-hidden="true">
        ◇
      </div>

      <p className="hero-experience-fallback-title">
        ShadowFox cinematic unavailable
      </p>

      <p className="hero-experience-fallback-copy">
        Continuing with the standard experience.
      </p>

      <button
        type="button"
        className="hero-experience-action"
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  );
};

export default HeroExperienceFallback;