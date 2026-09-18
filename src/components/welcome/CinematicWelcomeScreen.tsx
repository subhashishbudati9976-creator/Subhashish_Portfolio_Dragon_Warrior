import React, { useState, useEffect, useCallback } from 'react';
import { ShapeWaves } from '../effects/ShapeWaves';

interface CinematicWelcomeScreenProps {
  onEnter: () => void;
}

export const CinematicWelcomeScreen: React.FC<CinematicWelcomeScreenProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Prevent background scrolling while welcome overlay is active
  useEffect(() => {
    if (!isDismissed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDismissed]);

  const handleEnter = useCallback(() => {
    if (isExiting || isDismissed) return;
    setIsExiting(true);
    
    // Trigger background audio playback synchronously within the user-activation gesture
    onEnter();
    
    // Allow cinematic exit transition animation to play before unmounting/hiding
    setTimeout(() => {
      setIsDismissed(true);
    }, 700);
  }, [isExiting, isDismissed, onEnter]);

  // Support keyboard activation (Enter / Space)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEnter();
    }
  };

  if (isDismissed) return null;

  return (
    <div
      className={`cinematic-welcome-overlay${isExiting ? ' is-exiting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Subhashish's Cinematic Universe"
    >
      <div className="welcome-background-glow" aria-hidden="true" />
      <div className="welcome-backdrop-image" aria-hidden="true" />

      {/* Dynamic ShapeWaves layer — stops rendering once entered */}
      <ShapeWaves isActive={!isExiting && !isDismissed} />

      <div className="welcome-content-card">
        <span className="welcome-eyebrow">SUBHASHISH BUDATI // DEV PORTFOLIO</span>
        
        <h1 className="welcome-title">
          THE DRAGON WARRIOR<br />
          <span className="welcome-highlight">EXPERIENCE</span>
        </h1>

        <p className="welcome-subtitle">
          Full-Stack Engineering &bull; Next-Gen Computational Intelligence &bull; Cinematic Systems
        </p>

        <div className="welcome-action-wrapper">
          <button
            type="button"
            className="welcome-enter-btn"
            onClick={handleEnter}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Enter Subhashish's Cinematic Universe"
          >
            <span className="btn-glow" aria-hidden="true" />
            <span className="btn-text">ENTER THE SUBHASHISH'S CINEMATIC UNIVERSE</span>
            <span className="btn-icon" aria-hidden="true">&rarr;</span>
          </button>
        </div>

        <span className="welcome-hint">CLICK OR PRESS ENTER TO BEGIN</span>
      </div>
    </div>
  );
};
