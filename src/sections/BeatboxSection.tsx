import React, { useRef } from 'react';
import { CinematicSplitText } from '../components/CinematicSplitText';

interface BeatboxSectionProps {
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
}

export const BeatboxSection: React.FC<BeatboxSectionProps> = ({
  onVideoPlay,
  onVideoPause,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handlePlay = () => {
    if (onVideoPlay) {
      onVideoPlay();
    }
  };

  const handlePauseOrEnd = () => {
    if (onVideoPause) {
      onVideoPause();
    }
  };

  return (
    <section id="beatbox" className="portfolio-section page-container beatbox-section" aria-labelledby="beatbox-heading">
      <div className="beatbox-layout">
        <div className="beatbox-header motion-reveal" data-motion-reveal="fade-up">
          <div className="stage-chapter-marker beatbox-chapter">
            <span className="stage-chapter-num">
              <CinematicSplitText lines={['CREATIVE CRAFT // VOCAL PERCUSSION']} splitType="words" />
            </span>
          </div>

          <h2 className="section-title beatbox-title" id="beatbox-heading">
            <CinematicSplitText lines={['THE RHYTHM BEHIND THE CODE']} splitType="words" />
          </h2>

          <p className="beatbox-subheading">
            <CinematicSplitText lines={['RHYTHM. CREATIVITY. EXPRESSION.']} splitType="words" />
          </p>
        </div>

        <div className="beatbox-content-grid">
          <div className="beatbox-copy-col motion-reveal" data-motion-reveal="fade-up">
            <p className="beatbox-lead">
              Beyond engineering software and computational intelligence, vocal rhythm and beatboxing have been an essential part of my creative journey for over 10 years.
            </p>

            <p className="beatbox-description">
              Just as writing clean code demands structure, timing, and modular design, mastering beatboxing requires acoustic precision, rhythm control, and continuous practice. It is a raw form of expression that sharpens focus, performance confidence, and creative agility.
            </p>

            <div className="beatbox-stat-badge">
              <span className="stat-number">10+</span>
              <span className="stat-label">YEARS OF VOCAL RHYTHM &amp; BEATBOXING PERFORMANCE</span>
            </div>
          </div>

          <div className="beatbox-video-col motion-reveal" data-motion-reveal="fade-up">
            <div className="beatbox-video-card">
              <div className="beatbox-video-wrapper">
                <video
                  ref={videoRef}
                  className="beatbox-video-player"
                  src="/media/cinematic/vid/VID-20240925-WA0007.mp4"
                  controls
                  preload="metadata"
                  playsInline
                  onPlay={handlePlay}
                  onPause={handlePauseOrEnd}
                  onEnded={handlePauseOrEnd}
                  aria-label="Subhashish beatboxing performance video"
                />
              </div>
              <div className="beatbox-video-caption">
                <span className="caption-dot" aria-hidden="true" />
                <span>LIVE PERFORMANCE // VOCAL RHYTHM SESSION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
