/**
 * CinematicAudio — Persistent Audio Singleton Service
 * 
 * Manages the single persistent HTMLAudioElement for the entire portfolio.
 * - Initializes immediately on bundle load with Kabali as Track 01.
 * - Attempts immediate autoplay upon landing page mount.
 * - Detects browser autoplay rejection (NotAllowedError) and updates state.
 * - Provides synchronous play() inside user gestures (Welcome screen click, etc.).
 * - Unlocks audio on first user pointerdown/keydown gesture if blocked.
 * - Never recreates the audio element during section transitions or intro screen dismissal.
 * - Never resets currentTime during scrolling or chapter changes.
 * - Emits reactive state updates to subscribers (Welcome screen, HUD Audio Controller).
 */

export interface AudioPlaylistTrack {
  id: string;
  title: string;
  artist?: string;
  src: string;
}

export const PLAYLIST: AudioPlaylistTrack[] = [
  {
    id: 'kabali',
    title: 'Kabali',
    artist: 'Opening Track',
    src: '/media/cinematic/aud/kabali_-_neruppu_da_(mp3.pm).mp3',
  },
  {
    id: 'fight-back',
    title: 'Fight Back',
    artist: 'NEFFEX',
    src: '/media/cinematic/aud/Fight_Back_-_NEFFEX_(mp3.pm).mp3',
  },
  {
    id: 'timeless-guitar',
    title: 'Timeless Guitar',
    artist: 'Latti Bankai',
    src: '/media/cinematic/aud/latti_Bankai_-_Timeless_-_Guitar_(mp3.pm).mp3',
  },
  {
    id: 'montagem-guerreiro',
    title: 'Montagem Guerreiro',
    artist: 'Shyx x Magisterphonk',
    src: '/media/cinematic/aud/shyx_x_magisterphonk_-_montagem_guerreiro_(mp3.pm).mp3',
  },
  {
    id: 'dna',
    title: 'DNA',
    artist: 'Kendrick Lamar',
    src: '/media/cinematic/aud/Kendrick_Lamar_-_DNA_-_Kendrick_Lamar_-_DNA_(mp3.pm).mp3',
  },
  {
    id: 'remember-the-name',
    title: 'Remember the Name',
    artist: 'Styles of Beyond',
    src: '/media/cinematic/aud/Fort_Minor_-_Remember_The_Name_feat.Styles_Of_Beyond_(mp3.pm).mp3',
  },
  {
    id: 'montagem-guerreiro-slowed',
    title: 'Montagem Guerreiro - Slowed',
    artist: 'Shyx x Magisterphonk',
    src: '/media/cinematic/aud/MONTAGEM GUERREIRO - Slowed.mp3',
  },
];

export interface AudioState {
  trackIndex: number;
  currentTrack: AudioPlaylistTrack;
  isPlaying: boolean;
  isPaused: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  autoplayAttempted: boolean;
  autoplayBlocked: boolean;
}

type AudioSubscriber = (state: AudioState) => void;

class CinematicAudioService {
  private audio: HTMLAudioElement | null = null;
  private subscribers: Set<AudioSubscriber> = new Set();
  private state: AudioState;
  private previousVolume = 0.22;
  private gestureUnlockBound = false;
  private autoplayPromise: Promise<void> | null = null;

  constructor() {
    this.state = {
      trackIndex: 0,
      currentTrack: PLAYLIST[0],
      isPlaying: false,
      isPaused: true,
      volume: 0.22,
      isMuted: false,
      currentTime: 0,
      duration: 0,
      autoplayAttempted: false,
      autoplayBlocked: false,
    };

    // Instantiate persistent audio element once in browser environment
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement(): void {
    if (this.audio) return;

    try {
      console.log('[CinematicAudio] Initializing single persistent audio owner for Kabali soundtrack.');
      this.audio = new Audio();
      this.audio.preload = 'auto';
      this.audio.volume = this.state.volume;
      this.audio.src = PLAYLIST[0].src;

      // Attach stable, persistent DOM event listeners
      this.audio.addEventListener('play', () => {
        console.log('[CinematicAudio] Event: play. Audio is now active.');
        this.state.isPlaying = true;
        this.state.isPaused = false;
        this.state.autoplayBlocked = false;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        console.log('[CinematicAudio] Event: pause.');
        this.state.isPlaying = false;
        this.state.isPaused = true;
        this.notify();
      });

      this.audio.addEventListener('timeupdate', () => {
        if (!this.audio) return;
        this.state.currentTime = this.audio.currentTime || 0;
        this.notify();
      });

      this.audio.addEventListener('durationchange', () => {
        if (!this.audio) return;
        if (this.audio.duration && !isNaN(this.audio.duration)) {
          this.state.duration = this.audio.duration;
          this.notify();
        }
      });

      this.audio.addEventListener('ended', () => {
        console.log('[CinematicAudio] Event: track ended. Advancing to next track.');
        this.nextTrack();
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('[CinematicAudio] Error on audio element:', e);
      });

      // Bind one-time gesture unlock fallback
      this.bindGestureUnlock();
    } catch (err) {
      console.error('[CinematicAudio] Failed to initialize persistent audio element:', err);
    }
  }

  /**
   * Attempt immediate autoplay as early as possible on landing page mount.
   */
  public attemptAutoplay(): Promise<boolean> {
    if (!this.audio) this.initAudioElement();
    if (!this.audio) return Promise.resolve(false);

    if (this.state.isPlaying) {
      console.log('[CinematicAudio] Already playing, skip duplicate autoplay attempt.');
      return Promise.resolve(true);
    }

    if (this.autoplayPromise) {
      return this.autoplayPromise.then(() => true).catch(() => false);
    }

    console.log('[CinematicAudio] Attempting immediate landing autoplay of Kabali...');
    this.state.autoplayAttempted = true;

    // Ensure source is loaded
    if (!this.audio.src || this.audio.src === '') {
      this.audio.src = PLAYLIST[this.state.trackIndex].src;
    }

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      this.autoplayPromise = playPromise
        .then(() => {
          console.log('[CinematicAudio] Autoplay SUCCEEDED with sound. Kabali track active on landing screen!');
          this.state.isPlaying = true;
          this.state.isPaused = false;
          this.state.autoplayBlocked = false;
          this.autoplayPromise = null;
          this.notify();
        })
        .catch((err: Error) => {
          console.warn('[CinematicAudio] Autoplay restricted by browser policy:', err.name, err.message);
          this.state.isPlaying = false;
          this.state.isPaused = true;
          this.state.autoplayBlocked = true;
          this.autoplayPromise = null;
          this.notify();
        });

      return this.autoplayPromise.then(() => true).catch(() => false);
    }

    return Promise.resolve(false);
  }

  /**
   * Synchronous user gesture playback invocation.
   * Can be called directly within onClick handlers without any async delays.
   */
  public play(): Promise<void> {
    if (!this.audio) this.initAudioElement();
    if (!this.audio) return Promise.reject(new Error('Audio element unavailable'));

    if (this.state.isPlaying && !this.audio.paused) {
      console.log('[CinematicAudio] Play called, but audio is already playing. Preserving playback without restart.');
      return Promise.resolve();
    }

    console.log('[CinematicAudio] Starting playback via user gesture for track:', this.state.currentTrack.title);
    if (!this.audio.src) {
      this.audio.src = PLAYLIST[this.state.trackIndex].src;
    }

    const promise = this.audio.play();
    if (promise !== undefined) {
      return promise
        .then(() => {
          console.log('[CinematicAudio] Playback started successfully.');
          this.state.isPlaying = true;
          this.state.isPaused = false;
          this.state.autoplayBlocked = false;
          this.notify();
        })
        .catch((err) => {
          console.error('[CinematicAudio] Play request rejected:', err);
          this.state.isPlaying = false;
          this.state.isPaused = true;
          this.notify();
          throw err;
        });
    }

    return Promise.resolve();
  }

  public pause(): void {
    if (!this.audio) return;
    console.log('[CinematicAudio] Pausing audio.');
    this.audio.pause();
    this.state.isPlaying = false;
    this.state.isPaused = true;
    this.notify();
  }

  public togglePlay(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play().catch(() => {});
    }
  }

  public playTrack(index: number): void {
    if (!this.audio) this.initAudioElement();
    if (!this.audio) return;

    const boundedIdx = (index + PLAYLIST.length) % PLAYLIST.length;
    this.state.trackIndex = boundedIdx;
    this.state.currentTrack = PLAYLIST[boundedIdx];

    const targetSrc = PLAYLIST[boundedIdx].src;
    console.log(`[CinematicAudio] Switching to track #${boundedIdx + 1}: ${PLAYLIST[boundedIdx].title}`);

    // Update src only if changed to avoid unnecessary re-buffering
    const currentUrl = this.audio.src ? new URL(this.audio.src, window.location.href).pathname : '';
    const targetUrl = new URL(targetSrc, window.location.href).pathname;

    if (currentUrl !== targetUrl) {
      this.audio.src = targetSrc;
    }

    this.play().catch(() => {});
    this.notify();
  }

  public nextTrack(): void {
    this.playTrack(this.state.trackIndex + 1);
  }

  public prevTrack(): void {
    this.playTrack(this.state.trackIndex - 1);
  }

  public seek(targetSeconds: number): void {
    if (!this.audio) return;
    const safeTime = Math.max(0, Math.min(this.state.duration || 0, targetSeconds));
    this.audio.currentTime = safeTime;
    this.state.currentTime = safeTime;
    this.notify();
  }

  public setVolume(val: number): void {
    if (!this.audio) return;
    const clamped = Math.max(0, Math.min(1, val));
    this.state.volume = clamped;
    this.audio.volume = this.state.isMuted ? 0 : clamped;
    if (clamped > 0) {
      this.previousVolume = clamped;
      if (this.state.isMuted) this.state.isMuted = false;
    }
    this.notify();
  }

  public toggleMute(): void {
    if (!this.audio) return;
    if (this.state.isMuted) {
      this.state.isMuted = false;
      const restored = this.previousVolume > 0 ? this.previousVolume : 0.22;
      this.state.volume = restored;
      this.audio.volume = restored;
    } else {
      this.previousVolume = this.state.volume > 0 ? this.state.volume : 0.22;
      this.state.isMuted = true;
      this.audio.volume = 0;
    }
    this.notify();
  }

  public getState(): AudioState {
    return { ...this.state };
  }

  public subscribe(callback: AudioSubscriber): () => void {
    this.subscribers.add(callback);
    callback(this.getState());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notify(): void {
    const snapshot = this.getState();
    this.subscribers.forEach((cb) => cb(snapshot));
  }

  /**
   * One-time gesture listener on the document:
   * If browser blocked initial autoplay, the very first user interaction anywhere
   * unlocks and starts the Kabali track synchronously.
   */
  private bindGestureUnlock(): void {
    if (this.gestureUnlockBound || typeof window === 'undefined') return;
    this.gestureUnlockBound = true;

    const unlockHandler = () => {
      if (this.state.autoplayBlocked && !this.state.isPlaying) {
        console.log('[CinematicAudio] User interaction detected — unlocking blocked audio.');
        this.play().catch(() => {});
      }
      window.removeEventListener('pointerdown', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };

    window.addEventListener('pointerdown', unlockHandler, { once: true, passive: true });
    window.addEventListener('keydown', unlockHandler, { once: true, passive: true });
  }
}

// Export singleton instance
export const cinematicAudio = new CinematicAudioService();
