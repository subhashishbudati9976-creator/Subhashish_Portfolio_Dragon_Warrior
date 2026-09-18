import React, { useState, useEffect, useCallback } from 'react';
import { ShapeWaves } from '../effects/ShapeWaves';
import { DragonInkReveal } from '../effects/DragonInkReveal';
import { cinematicAudio, type AudioState } from '../../services/cinematicAudio';

interface CinematicWelcomeScreenProps {
  onEnter: () => void;
}

export const CinematicWelcomeScreen: React.FC<CinematicWelcomeScreenProps> = ({ onEnter }) => {
  const [isRevealing, setIsRevealing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [audioState, setAudioState] = useState<AudioState>(() => cinematicAudio.getState());

  // Attempt early autoplay on mount and listen to persistent audio state
  useEffect(() => {
    // Attempt playback immediately when landing page mounts
    void cinematicAudio.attemptAutoplay();

    // Subscribe to state updates
    const unsubscribe = cinematicAudio.subscribe((state) => {
      setAudioState(state);
    });

    return unsubscribe;
  }, []);

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
    if (isExiting || isDismissed || isRevealing) return;

    // STEP 3: Call audio.play() directly and synchronously within the user-activation click handler
    // If already playing, this will not restart or stutter the song.
    // If blocked or paused, this trusted user click immediately unlocks sound!
    cinematicAudio.play().catch((err) => {
      console.warn('[CinematicWelcomeScreen] User activation audio playback warning:', err);
    });

    // Notify parent
    onEnter();

    // Trigger full-screen Dragon Warrior Ink & Chi Particle reveal
    setIsRevealing(true);
    setIsExiting(true);
  }, [isExiting, isDismissed, isRevealing, onEnter]);

  const handleRevealComplete = useCallback(() => {
    console.log('[CinematicWelcomeScreen] Ink reveal completed. Cleanly dismissing welcome overlay.');
    setIsDismissed(true);
  }, []);

  // Support keyboard activation (Enter / Space)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEnter();
    }
  };

  if (isDismissed) return null;

  const isAudioPlaying = audioState.isPlaying;
  const isAutoplayBlocked = audioState.autoplayBlocked;

  return (
    <div
      className={`cinematic-welcome-overlay${isExiting ? ' is-exiting' : ''}${isRevealing ? ' is-revealing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Subhashish's Cinematic Universe"
    >
      {/* Full-Screen Ancient Martial Arts Ink Brush & Dragon Chi Reveal */}
      {isRevealing && (
        <DragonInkReveal onComplete={handleRevealComplete} duration={3.2} />
      )}

      <div className="welcome-background-glow" aria-hidden="true" />
      <div className="welcome-backdrop-image" aria-hidden="true" />

      {/* Dynamic ShapeWaves layer — stops rendering once entered */}
      <ShapeWaves isActive={!isExiting && !isDismissed} />

      <div className={`welcome-content-card${isExiting ? ' is-dissolving' : ''}`}>
        {/* Real-Time Cinematic Soundtrack Status Indicator */}
        <div
          className={`welcome-audio-status ${isAudioPlaying ? 'is-active' : isAutoplayBlocked ? 'is-blocked' : 'is-loading'}`}
          role="status"
          aria-live="polite"
        >
          {isAudioPlaying ? (
            <>
              <span className="welcome-audio-bars" aria-hidden="true">
                <span className="w-bar wb1" />
                <span className="w-bar wb2" />
                <span className="w-bar wb3" />
              </span>
              <span className="welcome-audio-label">SOUNDTRACK LIVE // KABALI (OPENING TRACK)</span>
            </>
          ) : (
            <>
              <span className="welcome-audio-dot" aria-hidden="true" />
              <span className="welcome-audio-label">
                {isAutoplayBlocked ? 'SOUND DISABLED BY BROWSER // CLICK TO ACTIVATE' : 'INITIALIZING KABALI SOUNDTRACK...'}
              </span>
            </>
          )}
        </div>

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
            className={`welcome-enter-btn${isAutoplayBlocked ? ' has-sound-prompt' : ''}`}
            onClick={handleEnter}
            onKeyDown={handleKeyDown}
            disabled={isExiting || isRevealing}
            autoFocus
            aria-label={isAutoplayBlocked ? 'Enter Subhashish\'s Cinematic Universe with sound' : 'Enter Subhashish\'s Cinematic Universe'}
          >
            <span className="btn-glow" aria-hidden="true" />
            <span className="btn-text">
              {isRevealing
                ? 'ENTERING CINEMATIC UNIVERSE...'
                : isAutoplayBlocked
                ? 'ENTER WITH SOUND'
                : 'ENTER THE SUBHASHISH\'S CINEMATIC UNIVERSE'}
            </span>
            <span className="btn-icon" aria-hidden="true">&rarr;</span>
          </button>

          {isAutoplayBlocked && !isRevealing && (
            <button
              type="button"
              className="welcome-enable-sound-btn"
              onClick={(e) => {
                e.stopPropagation();
                cinematicAudio.play().catch(() => {});
              }}
              aria-label="Enable sound directly"
            >
              <span className="sound-btn-icon" aria-hidden="true">▶</span>
              <span>ENABLE SOUND NOW</span>
            </button>
          )}
        </div>

        <span className="welcome-hint">
          {isAutoplayBlocked ? 'CLICK ANYWHERE OR PRESS ENTER TO UNMUTE & BEGIN' : 'CLICK OR PRESS ENTER TO BEGIN'}
        </span>
      </div>
    </div>
  );
};


