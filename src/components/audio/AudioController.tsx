import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import {
  cinematicAudio,
  PLAYLIST,
  type AudioPlaylistTrack,
  type AudioState,
} from '../../services/cinematicAudio';

export { PLAYLIST, type AudioPlaylistTrack };

export interface AudioControllerHandle {
  play: () => void;
  pause: () => void;
  setVolume: (val: number) => void;
  isPlaying: boolean;
}

interface AudioControllerProps {
  autoStartOnWelcome?: boolean;
}

/* ==========================================================================
   Crisp Inline SVG Icons (Zero Broken HTML Entities or Emojis)
   ========================================================================== */
const IconMusic = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const IconPrev = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="19 20 9 12 19 4 19 20" />
    <line x1="5" y1="4" x2="5" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const IconPlay = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

const IconPause = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="5" y="4" width="4" height="16" rx="1" />
    <rect x="15" y="4" width="4" height="16" rx="1" />
  </svg>
);

const IconNext = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <polygon points="5 4 15 12 5 20 5 4" />
    <line x1="19" y1="4" x2="19" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const IconVolumeMute = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);

const IconVolumeLow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const IconVolumeHigh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const IconPlaylist = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
    <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
    <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
  </svg>
);

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const AudioController = forwardRef<AudioControllerHandle, AudioControllerProps>((_props, ref) => {
  const [audioState, setAudioState] = useState<AudioState>(() => cinematicAudio.getState());
  const [showPlaylist, setShowPlaylist] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to the single persistent audio singleton
  useEffect(() => {
    const unsubscribe = cinematicAudio.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  // Robust outside-click & Escape-key detection for the "All Songs" drawer
  useEffect(() => {
    if (!showPlaylist) return;

    const handlePointerDown = (e: PointerEvent | MouseEvent) => {
      // If click originated outside the audio controller root, close cleanly
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setShowPlaylist(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPlaylist(false);
      }
    };

    // Attach on next tick to ensure the opening click does not trigger immediate dismissal
    const timer = setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showPlaylist]);

  const {
    trackIndex,
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
  } = audioState;

  // Expose imperative handle for external control (welcome screen, beatbox video)
  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        cinematicAudio.play().catch(() => {});
      },
      pause: () => {
        cinematicAudio.pause();
      },
      setVolume: (val: number) => {
        cinematicAudio.setVolume(val);
      },
      isPlaying,
    }),
    [isPlaying]
  );

  const playTrack = useCallback((index: number) => {
    cinematicAudio.playTrack(index);
    // User requirement: List stays open until intentionally closed or a song is selected
    setShowPlaylist(false);
  }, []);

  const handlePrevTrack = useCallback(() => {
    cinematicAudio.prevTrack();
  }, []);

  const handleNextTrack = useCallback(() => {
    cinematicAudio.nextTrack();
  }, []);

  const togglePlayback = () => {
    cinematicAudio.togglePlay();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    cinematicAudio.seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cinematicAudio.setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    cinematicAudio.toggleMute();
  };

  const handleTogglePlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlaylist(prev => !prev);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={rootRef}
      className="audio-controller-hud spotify-player-root"
      aria-label="Dragon Warrior atmospheric music player"
    >
      {/* 
        Single Persistent Audio Owner is cinematicAudio singleton.
        Zero duplicate <audio> tags or buffer conflicts.
      */}

      {/* Expandable Playlist Drawer — motion-reveal removed to prevent conflict with .motion-ready */}
      {showPlaylist && (
        <div
          className="spotify-playlist-drawer"
          role="dialog"
          aria-label="All Songs — Cinematic Soundtrack Playlist"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="spotify-drawer-header">
            <div className="spotify-drawer-title-group">
              <span className="spotify-drawer-badge">HUD AUDIO</span>
              <h4 className="spotify-drawer-title">ALL SONGS // SOUNDTRACK</h4>
            </div>
            <button
              type="button"
              className="spotify-drawer-close"
              onClick={() => setShowPlaylist(false)}
              aria-label="Close All Songs playlist"
              title="Close playlist"
            >
              <IconClose />
            </button>
          </div>

          <div className="spotify-playlist-list" role="list">
            {PLAYLIST.map((track, idx) => {
              const isCurrent = idx === trackIndex;
              return (
                <button
                  key={track.id}
                  type="button"
                  className={`spotify-playlist-item${isCurrent ? ' is-active' : ''}`}
                  onClick={() => playTrack(idx)}
                  role="listitem"
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  <span className="spotify-item-num">
                    {isCurrent && isPlaying ? (
                      <span className="spotify-item-playing-bars" aria-hidden="true">
                        <span className="s-bar sb1" />
                        <span className="s-bar sb2" />
                        <span className="s-bar sb3" />
                      </span>
                    ) : (
                      String(idx + 1).padStart(2, '0')
                    )}
                  </span>
                  <div className="spotify-item-info">
                    <span className="spotify-item-title">{track.title}</span>
                    {track.artist && <span className="spotify-item-artist">{track.artist}</span>}
                  </div>
                  {isCurrent && (
                    <span className="spotify-item-indicator" aria-hidden="true">
                      {isPlaying ? 'PLAYING' : 'PAUSED'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="spotify-drawer-footer">
            <span>SEQUENTIAL PLAYBACK &bull; AUTO-LOOPS TO TRACK 01</span>
          </div>
        </div>
      )}

      {/* Main Spotify-Inspired Player Bar */}
      <div className="spotify-player-bar">
        {/* Left: Now Playing Artwork & Meta */}
        <div className="spotify-meta-area">
          <div className={`spotify-art-badge${isPlaying ? ' is-spinning' : ''}`} aria-hidden="true">
            <div className="spotify-vinyl-center" />
            <div className="spotify-art-icon">
              <IconMusic />
            </div>
          </div>

          <div className="spotify-track-meta">
            <span className="spotify-track-title" title={currentTrack.title}>
              {currentTrack.title}
            </span>
            <span className="spotify-track-artist">
              {currentTrack.artist || 'Opening Track'}
            </span>
          </div>
        </div>

        {/* Center: Playback Controls & Scrubber */}
        <div className="spotify-controls-center">
          <div className="spotify-buttons-row">
            {/* Previous Track */}
            <button
              type="button"
              className="spotify-btn spotify-prev-btn"
              onClick={handlePrevTrack}
              title="Previous track"
              aria-label="Previous track"
            >
              <IconPrev />
            </button>

            {/* Play / Pause Toggle */}
            <button
              type="button"
              className={`spotify-btn spotify-play-btn${isPlaying ? ' is-playing' : ''}`}
              onClick={togglePlayback}
              title={isPlaying ? `Pause (${currentTrack.title})` : 'Play music'}
              aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
            >
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>

            {/* Next Track */}
            <button
              type="button"
              className="spotify-btn spotify-next-btn"
              onClick={handleNextTrack}
              title="Next track"
              aria-label="Next track"
            >
              <IconNext />
            </button>
          </div>

          {/* Progress Seek Bar */}
          <div className="spotify-scrub-row">
            <span className="spotify-time spotify-time-current">{formatTime(currentTime)}</span>
            <div className="spotify-progress-wrap">
              <div
                className="spotify-progress-fill"
                style={{ width: `${progressPercent}%` }}
                aria-hidden="true"
              />
              <input
                type="range"
                min="0"
                max={duration > 0 ? duration : 100}
                step="0.5"
                value={duration > 0 ? currentTime : 0}
                onChange={handleSeek}
                className="spotify-progress-input"
                aria-label="Seek track position"
              />
            </div>
            <span className="spotify-time spotify-time-total">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Playlist Toggle */}
        <div className="spotify-extra-controls">
          {/* Mute Button */}
          <button
            type="button"
            className={`spotify-icon-btn${isMuted ? ' is-muted' : ''}`}
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? <IconVolumeMute /> : volume < 0.4 ? <IconVolumeLow /> : <IconVolumeHigh />}
          </button>

          {/* Volume Slider */}
          <div className="spotify-volume-wrap">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="spotify-volume-slider"
              aria-label="Volume slider"
            />
            <span className="spotify-volume-val">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>

          {/* Playlist Drawer Toggle */}
          <button
            type="button"
            className={`spotify-icon-btn spotify-playlist-btn${showPlaylist ? ' is-open' : ''}`}
            onClick={handleTogglePlaylist}
            title="All Songs — Cinematic Soundtrack"
            aria-label="All Songs — Toggle soundtrack playlist"
          >
            <span className="playlist-icon-bars" aria-hidden="true">
              <IconPlaylist />
            </span>
            <span className="playlist-count-pill">{PLAYLIST.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
});

AudioController.displayName = 'AudioController';
