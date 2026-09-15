import React, { useRef } from 'react';
import { Nav } from './components/Nav';
import { CinematicBackground } from './components/hero/CinematicBackground';
import { HeroSection } from './sections/HeroSection';
import { AboutSection } from './sections/AboutSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';
import { ActivitiesSection } from './sections/ActivitiesSection';
import { ResumeCTA } from './components/ResumeCTA';
import { ContactSection } from './sections/ContactSection';
import { Footer } from './components/Footer';
import { AssistantHUD } from './components/assistant/AssistantHUD';
import { AudioController } from './components/audio/AudioController';
import Aurora from './components/effects/Aurora';
import { EnergyTrail } from './components/effects/EnergyTrail';
import { useRevealObserver } from './hooks/useRevealObserver';

export const App: React.FC = () => {
  useRevealObserver();
  const timelineRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="portfolio-app">
      {/* Global Subtle Cinematic Energy Trail Overlay */}
      <EnergyTrail />

      {/* Cinematic HUD Navigation */}
      <Nav />

      {/* Atmospheric Audio Controller HUD */}
      <AudioController />

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
            <ActivitiesSection />
            <ResumeCTA />
          </section>
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