import React, { useState, useRef, useCallback } from 'react';
import { Nav } from './components/Nav';
import { CinematicBackground } from './components/hero/CinematicBackground';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { FieldSection } from './sections/FieldSection';
import { SkillsSection } from './sections/SkillsSection';
import { ActivitiesSection } from './sections/ActivitiesSection';
import { BeatboxSection } from './sections/BeatboxSection';
import { ResumeCTA } from './components/ResumeCTA';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './components/Footer';
import { AssistantHUD } from './components/assistant/AssistantHUD';
import { AudioController, type AudioControllerHandle } from './components/audio/AudioController';
import { AutoScrollController } from './components/autoscroll/AutoScrollController';
import { CinematicWelcomeScreen } from './components/welcome/CinematicWelcomeScreen';
import Aurora from './components/effects/Aurora';
import { EnergyTrail } from './components/effects/EnergyTrail';
import { useRevealObserver } from './hooks/useRevealObserver';
import { cinematicAudio } from './services/cinematicAudio';

export const App: React.FC = () => {
  useRevealObserver();
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const audioControllerRef = useRef<AudioControllerHandle | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const wasPlayingBeforeVideoRef = useRef(false);

  const handleWelcomeEnter = useCallback(() => {
    // Synchronously ensure playback when user clicks enter
    // If already playing, this is a smooth no-op without restart
    cinematicAudio.play().catch(() => {});
  }, []);

  const handleBeatboxVideoPlay = useCallback(() => {
    // Pause background music while beatboxing performance video plays
    setIsVideoPlaying(true);
    if (cinematicAudio.getState().isPlaying) {
      wasPlayingBeforeVideoRef.current = true;
      cinematicAudio.pause();
    } else {
      wasPlayingBeforeVideoRef.current = false;
    }
  }, []);

  const handleBeatboxVideoPause = useCallback(() => {
    // Resume background music when beatboxing video is paused or ends
    setIsVideoPlaying(false);
    if (wasPlayingBeforeVideoRef.current) {
      cinematicAudio.play().catch(() => {});
      wasPlayingBeforeVideoRef.current = false;
    }
  }, []);


  return (
    <div className="portfolio-app">
      {/* Full-Screen Cinematic Welcome Overlay */}
      <CinematicWelcomeScreen onEnter={handleWelcomeEnter} />

      {/* Global Subtle Cinematic Energy Trail Overlay */}
      <EnergyTrail />

      {/* Cinematic HUD Navigation */}
      <Nav />

      {/* Atmospheric Audio Controller HUD */}
      <AudioController ref={audioControllerRef} />

      {/* Optional Independent Cinematic AutoScroll Controller HUD */}
      <AutoScrollController isPausedByMedia={isVideoPlaying} />

      <main>
        {/* =====================================================================
            FULL-PAGE CONTINUOUS CINEMATIC TIMELINE (Stages 1 through 4)
            The 32-second video is mounted as a sticky background layer across
            this complete timeline container, driven continuously by page scroll.
            ===================================================================== */}
        <div className="cinematic-timeline-container" ref={timelineRef}>
          {/* High-Performance, Zero-Lag Video Background */}
          <CinematicBackground timelineRef={timelineRef} />

          {/* STAGE 1 (0–8s, ~0%–25% scroll): Seated Samurai / Hero Introduction */}
          <section id="hero" className="cinematic-stage stage-1-stage" aria-label="Hero Introduction">
            <HeroSection />
          </section>

          {/* STAGE 2 (~8–16s, ~25%–50% scroll): Red-Eye Awakening / Identity & Education */}
          <section id="about" className="cinematic-stage stage-2-stage" aria-label="Identity and Education">
            <AboutSection />
          </section>

          {/* STAGE 3 (~16–24s, ~50%–75% scroll): Crimson Resonance / Experience & Disciplines */}
          <section id="experience" className="cinematic-stage stage-3-stage" aria-label="Experience and Engineering Mindset">
            <ExperienceSection />
          </section>

          {/* STAGE 4 (~24–32s, ~75%–100% scroll): Dragon Manifestation / Climax */}
          <section id="projects" className="cinematic-stage stage-4-stage" aria-label="Selected Projects and Climax">
            <ProjectsSection />
            <SkillsSection />
            {/* Original "BEYOND THE CODE" Section */}
            <ActivitiesSection />
            {/* Dedicated Beatboxing Performance Section immediately below "BEYOND THE CODE" */}
            <BeatboxSection
              onVideoPlay={handleBeatboxVideoPlay}
              onVideoPause={handleBeatboxVideoPause}
            />
            <ResumeCTA />
          </section>

          <FieldSection />
        </div>

        {/* =====================================================================
            FINAL RECRUITER & OUTREACH SECTION
            Seamless transition into the contact section with subtle whisper Aurora
            ===================================================================== */}
        <div className="contact-transition-wrapper">
          <div
            className="ambient-aurora-layer"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.16, // Whisper level — never competes with the video
              zIndex: 0,
            }}
            aria-hidden="true"
          >
            <Aurora
              colorStops={['#6e1726', '#c6283d', '#1a0910']}
              amplitude={0.8}
              blend={0.5}
              speed={0.7}
            />
          </div>

          <ContactSection />
        </div>
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Personal AI Assistant HUD Capsule (Architecture Extension Point) */}
      <AssistantHUD />
    </div>
  );
};