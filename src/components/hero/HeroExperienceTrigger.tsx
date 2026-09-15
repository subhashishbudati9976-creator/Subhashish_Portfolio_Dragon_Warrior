import { forwardRef } from 'react';

interface HeroExperienceTriggerProps {
  onActivate: () => void;
  disabled?: boolean;
}

const HeroExperienceTrigger = forwardRef<
  HTMLButtonElement,
  HeroExperienceTriggerProps
>(({ onActivate, disabled = false }, ref) => {
  return (
    <button
         ref={ref}
         type="button"
      className="hero-experience-trigger"
      onClick={onActivate}
      disabled={disabled}
      aria-label="Launch ShadowFox cinematic introduction"
    >
      <span className="hero-experience-trigger-icon" aria-hidden="true">
        ◇
      </span>

      <span className="hero-experience-trigger-text">
        Enter ShadowFox
      </span>

      <span className="hero-experience-trigger-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
});
HeroExperienceTrigger.displayName = 'HeroExperienceTrigger';
export default HeroExperienceTrigger;