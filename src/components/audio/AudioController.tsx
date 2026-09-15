import React, { useState, useRef, useEffect } from 'react';

/**
 * AudioController — Atmospheric Background Audio Extension Point
 *
 * Requirements:
 * - Muted by default (no forced autoplay)
 * - User-controlled play/pause and volume
 * - Points to placeholder asset: /audio/portfolio-ambience.mp3
 * - Clean mobile-friendly HUD toggle
 */

const AUDIO_PLACEHOLDER_SRC = '/audio/portfolio-ambience.mp3';

export const AudioController: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35); // subtle 35% volume by default
  const [showVolume, setShowVolume] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    // Check if placeholder audio file is present
    const handleCanPlay = () => setIsAvailable(true);
    const handleError = () => setIsAvailable(false);

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [volume]);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Handled gracefully when file is placeholder
        setIsPlaying(false);
      });
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  return (
    <div
      className="audio-controller-hud"
      aria-label="Background audio player"
      onMouseEnter={() => setShowVolume(true)}
      onMouseLeave={() => setShowVolume(false)}
    >
      <audio
        ref={audioRef}
        src={AUDIO_PLACEHOLDER_SRC}
        loop
        preload="none"
      />

      {showVolume && isPlaying && (
        <div className="audio-volume-popover" aria-label="Volume controller">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="audio-volume-slider"
            aria-label="Volume level"
          />
          <span className="audio-volume-percent">{Math.round(volume * 100)}%</span>
        </div>
      )}

      <button
        type="button"
        className={`audio-toggle-btn${isPlaying ? ' is-playing' : ''}`}
        onClick={togglePlayback}
        title={
          isAvailable
            ? isPlaying ? 'Mute background ambience' : 'Play atmospheric background audio'
            : 'Audio architecture ready (/audio/portfolio-ambience.mp3)'
        }
        aria-label={isPlaying ? 'Pause background audio' : 'Play background audio'}
      >
        <span className="audio-bars-icon" aria-hidden="true">
          <span className={`bar b1${isPlaying ? ' animate' : ''}`} />
          <span className={`bar b2${isPlaying ? ' animate' : ''}`} />
          <span className={`bar b3${isPlaying ? ' animate' : ''}`} />
          <span className={`bar b4${isPlaying ? ' animate' : ''}`} />
        </span>
        <span className="audio-btn-label">
          {isPlaying ? 'AUDIO ON' : 'AUDIO OFF'}
        </span>
      </button>
    </div>
  );
};
