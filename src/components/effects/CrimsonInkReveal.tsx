import React, { useEffect, useRef } from 'react';

interface CrimsonInkRevealProps {
  onComplete: () => void;
  duration?: number; // Total cinematic duration in seconds (default ~3.4s)
}

interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  type: 'ember' | 'ink_splash' | 'smoke' | 'spark';
  curl: number;
  rotation: number;
  rotSpeed: number;
}

interface SpinePoint {
  x: number;
  y: number;
  width: number;
  time: number;
}

// Curated ancient Japanese martial-arts crimson ink & dragon palette
const CRIMSON_PALETTE = ['#ff2a2a', '#e11d2e', '#c6283d', '#ff4d5a', '#b71527'];
const DEEP_INK_PALETTE = ['#520710', '#6e0d17', '#8a111e', '#a31424', '#be182b'];
const EMBER_PALETTE = ['#ff3b30', '#ff5722', '#ff6b4a', '#ff9e80'];
const SUMI_DARK_PALETTE = ['#06070a', '#100c12', '#1a0d14'];

/**
 * CrimsonInkReveal
 *
 * Cinematic ancient samurai martial-arts ink-painting reveal:
 * - A thin, glowing crimson-red dragon energy line sweeps horizontally (Left -> Right).
 * - A thick, organic red ink trail follows behind like liquid sumi-e ink spreading across textured paper.
 * - Progressively reveals the actual mounted portfolio DOM beneath it via Canvas destination-out.
 * - Trailing ink diffuses smoothly into wisps and embers, leaving the portfolio crystal clear.
 * - 60Hz / 120Hz / 240Hz refresh-rate independent via delta-time rAF interpolation.
 * - Pre-allocated particle pool for zero garbage collection during animation.
 */
export const CrimsonInkReveal: React.FC<CrimsonInkRevealProps> = ({
  onComplete,
  duration = 3.4,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 1. Respect prefers-reduced-motion: Instant clean reveal
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timer = setTimeout(onComplete, 300);
      return () => clearTimeout(timer);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // High performance DPR capping (max 1.5 to protect GPU fill-rate on high-DPI displays)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let screenW = window.innerWidth;
    let screenH = window.innerHeight;

    canvas.width = Math.floor(screenW * dpr);
    canvas.height = Math.floor(screenH * dpr);
    ctx.scale(dpr, dpr);

    // Spine history queue for the flowing dragon energy body
    const spineHistory: SpinePoint[] = [];
    const MAX_SPINE_POINTS = 180;

    // Pre-allocated particle pool (up to 950 particles, zero GC pauses)
    const MAX_PARTICLES = Math.min(950, Math.floor((screenW * screenH) / 1100));
    const particles: InkParticle[] = [];
    let activeParticles = 0;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 2,
        alpha: 0,
        decay: 0.02,
        color: '#ff2a2a',
        type: 'ember',
        curl: 0,
        rotation: 0,
        rotSpeed: 0,
      });
    }

    const spawnParticle = (
      x: number,
      y: number,
      type: 'ember' | 'ink_splash' | 'smoke' | 'spark',
      baseVx: number,
      baseVy: number,
      speedMultiplier = 1
    ) => {
      if (activeParticles >= MAX_PARTICLES) return;
      const p = particles[activeParticles++];

      p.x = x + (Math.random() - 0.5) * 24;
      p.y = y + (Math.random() - 0.5) * 24;

      const spreadAngle = (Math.random() - 0.5) * Math.PI * 0.9;
      const speed = (1.2 + Math.random() * 3.8) * speedMultiplier;

      // Inherit backward drift from the sweeping dragon motion
      p.vx = baseVx * 0.12 - Math.cos(spreadAngle) * speed;
      p.vy = baseVy * 0.12 + Math.sin(spreadAngle) * speed + (Math.random() - 0.5) * 1.8;

      p.type = type;
      p.curl = (Math.random() - 0.5) * 0.08;
      p.rotation = Math.random() * Math.PI * 2;
      p.rotSpeed = (Math.random() - 0.5) * 0.1;

      if (type === 'ember') {
        p.color = CRIMSON_PALETTE[Math.floor(Math.random() * CRIMSON_PALETTE.length)];
        p.size = 1.8 + Math.random() * 3.2;
        p.alpha = 0.85 + Math.random() * 0.15;
        p.decay = 0.009 + Math.random() * 0.015;
      } else if (type === 'spark') {
        // Restrained red-orange ignition ember
        p.color = EMBER_PALETTE[Math.floor(Math.random() * EMBER_PALETTE.length)];
        p.size = 1.2 + Math.random() * 2.2;
        p.alpha = 0.95;
        p.decay = 0.014 + Math.random() * 0.024;
      } else if (type === 'ink_splash') {
        // Sumi-e red & dark ink droplet
        const isRed = Math.random() < 0.75;
        p.color = isRed
          ? DEEP_INK_PALETTE[Math.floor(Math.random() * DEEP_INK_PALETTE.length)]
          : SUMI_DARK_PALETTE[Math.floor(Math.random() * SUMI_DARK_PALETTE.length)];
        p.size = 3.0 + Math.random() * 6.5;
        p.alpha = 0.85 + Math.random() * 0.15;
        p.decay = 0.008 + Math.random() * 0.012;
      } else {
        // Subtle crimson smoky wisp
        p.color = 'rgba(180, 25, 42, 0.3)';
        p.size = 9.0 + Math.random() * 20.0;
        p.alpha = 0.35 + Math.random() * 0.2;
        p.decay = 0.006 + Math.random() * 0.009;
      }
    };

    let startTime = performance.now();
    let lastTime = startTime;
    let animationFrameId: number | null = null;
    let isCompleted = false;

    // Organic boundary X calculation across any Y (simulating Chinese/Japanese Xuan paper ink-bleed)
    const getBoundaryX = (y: number, currentHeadX: number, elapsed: number) => {
      const ny = y / Math.max(1, screenH);
      const wave1 = Math.sin(ny * Math.PI * 3.6 + elapsed * 2.8) * 44;
      const wave2 = Math.cos(ny * Math.PI * 7.5 - elapsed * 2.0) * 22;
      const wave3 = Math.sin(ny * Math.PI * 15.0) * 10;
      const microBrush = Math.sin(ny * 52.0 + elapsed * 6.0) * 4;
      return currentHeadX - 35 + wave1 + wave2 + wave3 + microBrush;
    };

    // Smooth organic S-curve easing (dramatic ignition, fluid surge, gentle settlement)
    const getEaseProgress = (t: number) => {
      const p = Math.max(0, Math.min(1, t));
      return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    };

    // Draw immediate synchronous shroud to guarantee zero 1-frame flash
    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, screenW, screenH);

    const render = (now: number) => {
      const dtMs = Math.min(50, Math.max(1, now - lastTime));
      lastTime = now;
      const dtScale = dtMs / 16.667;

      const elapsed = (now - startTime) / 1000;
      const totalProgress = Math.min(1.0, elapsed / duration);

      // Clear full canvas each frame
      ctx.clearRect(0, 0, screenW, screenH);

      // Phase timing:
      // 0.0s - 0.25s: Initial ignition spark on left edge
      // 0.25s - 2.85s: Crimson dragon energy sweeps across screen with flowing ink trail
      // 2.85s - 3.4s: Trail reaches right edge, ink dissipates gracefully into embers, clean handoff
      const sweepActive = elapsed >= 0.2;
      const sweepProgress = sweepActive ? Math.min(1.0, (elapsed - 0.2) / (duration - 0.95)) : 0;
      const sweepEase = getEaseProgress(sweepProgress);

      // Head travels horizontally from x = -70 to x = screenW + 240
      const headX = sweepActive
        ? -70 + sweepEase * (screenW + 310)
        : -30 + Math.sin(elapsed * 7) * 8;

      // Gently curved serpentine dragon flight trajectory
      const headY =
        screenH * 0.49 +
        Math.sin(sweepEase * Math.PI * 2.8 + elapsed * 1.6) * (screenH * 0.15) +
        Math.cos(sweepEase * Math.PI * 1.4) * (screenH * 0.06);

      // Record spine history for calligraphic dragon ribbon
      if (sweepActive && totalProgress < 0.95) {
        spineHistory.unshift({
          x: headX,
          y: headY,
          width: Math.min(15, 3.5 + sweepEase * 11.5),
          time: elapsed,
        });

        if (spineHistory.length > MAX_SPINE_POINTS) {
          spineHistory.pop();
        }
      }

      // =========================================================================
      // STEP 1: DRAW DARK OBSIDIAN SHROUD & CARVE LEFT-TO-RIGHT REVEAL
      // Destination-out cuts through to reveal the actual mounted portfolio DOM!
      // =========================================================================
      ctx.save();
      // Base dark charcoal/obsidian paper ground
      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, screenW, screenH);

      // Subtle atmospheric sumi-e parchment vignette
      const darkWash = ctx.createRadialGradient(
        screenW * 0.5,
        screenH * 0.5,
        80,
        screenW * 0.5,
        screenH * 0.5,
        Math.max(screenW, screenH) * 0.85
      );
      darkWash.addColorStop(0, 'rgba(16, 17, 24, 0.96)');
      darkWash.addColorStop(0.55, 'rgba(9, 10, 14, 0.98)');
      darkWash.addColorStop(1, '#050608');
      ctx.fillStyle = darkWash;
      ctx.fillRect(0, 0, screenW, screenH);

      // Carve away everything to the left of the advancing dragon front
      if (sweepActive) {
        ctx.globalCompositeOperation = 'destination-out';

        const ySteps = 48;
        const stepH = screenH / ySteps;

        ctx.beginPath();
        ctx.moveTo(-120, -60);

        // Trace the organic serpentine sumi-e bleed boundary
        for (let i = 0; i <= ySteps; i++) {
          const y = i * stepH;
          const bx = getBoundaryX(y, headX, elapsed);
          ctx.lineTo(bx, y);
        }

        ctx.lineTo(-120, screenH + 60);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fill();

        // Feathered calligraphic horsehair brush stamps along the cutting edge
        if (totalProgress < 0.96) {
          for (let i = 0; i <= ySteps; i += 2) {
            const y = i * stepH;
            const bx = getBoundaryX(y, headX, elapsed);
            // Dynamic brush bristle radius with organic variation
            const radius = 52 + Math.sin(i * 1.7 + elapsed * 3.5) * 20 + Math.random() * 14;

            ctx.beginPath();
            ctx.arc(bx, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
            ctx.fill();

            // Additional micro-splatter stamps for natural paper bleed
            if (i % 4 === 0) {
              const microOffset = (Math.random() - 0.5) * 25;
              ctx.beginPath();
              ctx.arc(bx + 12 + microOffset, y + microOffset, radius * 0.45, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.fill();
            }
          }
        }
      }
      ctx.restore();

      // =========================================================================
      // STEP 2: FLOWING ORGANIC RED INK TRAIL (SOURCE-OVER)
      // Painting the portfolio into existence with rich sumi-e crimson ink!
      // =========================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      if (sweepActive && spineHistory.length > 2) {
        // Calculate dissipation: ink is deep near advancing front, then diffuses to transparent
        const trailingInkAlpha = Math.max(0, Math.min(1, (1.0 - totalProgress) / 0.16));

        // 1. Organic Crimson Ink Wash along the reveal front
        // Draws a feathered, flowing red ink boundary that trails behind the energy line
        const inkWashWidth = Math.min(260, 80 + sweepEase * 180);
        const ySteps = 36;
        const stepH = screenH / ySteps;

        for (let i = 0; i <= ySteps; i++) {
          const y = i * stepH;
          const frontX = getBoundaryX(y, headX, elapsed);
          // Distance behind front where ink wash spreads
          const washX = frontX - inkWashWidth * (0.65 + 0.35 * Math.sin(i * 1.2 + elapsed * 2));

          const inkGrad = ctx.createLinearGradient(washX, y, frontX + 30, y);
          inkGrad.addColorStop(0, 'rgba(110, 13, 23, 0)');
          inkGrad.addColorStop(0.35, `rgba(138, 17, 30, ${0.42 * trailingInkAlpha})`);
          inkGrad.addColorStop(0.7, `rgba(198, 40, 61, ${0.72 * trailingInkAlpha})`);
          inkGrad.addColorStop(1, `rgba(225, 29, 46, ${0.85 * trailingInkAlpha})`);

          ctx.beginPath();
          ctx.ellipse(frontX - 25, y, 65 + Math.sin(i * 2.0) * 22, stepH * 1.3, 0, 0, Math.PI * 2);
          ctx.fillStyle = inkGrad;
          ctx.fill();
        }

        // 2. Flowing Dragon Ink Body Wash (spreading along the spine history)
        const spineLen = spineHistory.length;
        for (let i = 0; i < spineLen - 1; i += 2) {
          const pt = spineHistory[i];
          const tIdx = i / spineLen; // 0 = head, 1 = tail
          const taper = 1 - tIdx;
          // Ink opacity naturally dissolves into the wake
          const inkAlpha = Math.max(0, taper * 0.75 * trailingInkAlpha);

          if (inkAlpha > 0.02) {
            const inkRadius = (35 + pt.width * 2.8) * (0.8 + 0.2 * Math.sin(tIdx * Math.PI * 4));
            const inkGrad = ctx.createRadialGradient(
              pt.x,
              pt.y,
              4,
              pt.x,
              pt.y,
              inkRadius
            );
            inkGrad.addColorStop(0, `rgba(225, 29, 46, ${inkAlpha})`);
            inkGrad.addColorStop(0.5, `rgba(163, 20, 36, ${inkAlpha * 0.65})`);
            inkGrad.addColorStop(1, 'rgba(94, 9, 19, 0)');

            ctx.beginPath();
            ctx.arc(pt.x, pt.y, inkRadius, 0, Math.PI * 2);
            ctx.fillStyle = inkGrad;
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // =========================================================================
      // STEP 3: THE CRIMSON DRAGON ENERGY LINE (SOURCE-OVER / ADDITIVE CORE)
      // Thin, luminous crimson energy line leading the reveal
      // =========================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      if (spineHistory.length > 2) {
        const spineAlpha = Math.max(0, Math.min(1, (1.0 - totalProgress) / 0.14));

        // 1. Soft Crimson Dragon Aura Glow (Outer halo)
        ctx.beginPath();
        for (let i = 0; i < spineHistory.length; i++) {
          const pt = spineHistory[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(198, 40, 61, ${0.42 * spineAlpha})`;
        ctx.lineWidth = 32;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // 2. Braided Martial Dragon Chi Tendrils (Intertwined secondary chi filaments)
        ctx.beginPath();
        for (let i = 0; i < spineHistory.length; i++) {
          const pt = spineHistory[i];
          const tIdx = i / spineHistory.length;
          // Fluid counter-phase undulating chi offset
          const chiOffset = Math.sin(tIdx * Math.PI * 7.0 + elapsed * 5.0) * (16 * (1 - tIdx));
          const cx = pt.x;
          const cy = pt.y + chiOffset;
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.strokeStyle = `rgba(255, 77, 90, ${0.7 * spineAlpha})`;
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 3. Calligraphic Crimson Dragon Energy Ribbon
        for (let i = 0; i < spineHistory.length - 1; i++) {
          const curr = spineHistory[i];
          const next = spineHistory[i + 1];
          const taper = 1 - i / spineHistory.length; // Thicker near head, tapering smoothly to tail

          ctx.beginPath();
          ctx.moveTo(curr.x, curr.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(225, 29, 46, ${0.92 * taper * spineAlpha})`;
          ctx.lineWidth = Math.max(2.2, curr.width * taper);
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // 4. Luminous Brilliant Crimson-White Core Filament
        ctx.beginPath();
        for (let i = 0; i < spineHistory.length; i++) {
          const pt = spineHistory[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(255, 242, 245, ${0.96 * spineAlpha})`;
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 5. Radiant Dragon Head Ignition Core & Whisker Energy
        if (headX < screenW + 90 && spineAlpha > 0.05) {
          // Intense white jewel core
          ctx.beginPath();
          ctx.arc(headX, headY, 5.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = Math.min(1, spineAlpha);
          ctx.fill();

          // Crimson corona halo
          ctx.beginPath();
          ctx.arc(headX, headY, 22, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 42, 42, 0.45)';
          ctx.fill();

          // Traditional Eastern dragon whisker filaments (ryu whiskers)
          ctx.beginPath();
          ctx.moveTo(headX, headY);
          ctx.quadraticCurveTo(headX - 30, headY - 22, headX - 55, headY - 14);
          ctx.moveTo(headX, headY);
          ctx.quadraticCurveTo(headX - 30, headY + 22, headX - 55, headY + 14);
          ctx.strokeStyle = 'rgba(255, 180, 190, 0.85)';
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      } else if (!sweepActive) {
        // Phase 1-2 Awakening Spark on left edge
        const sparkPulse = 0.5 + 0.5 * Math.sin(elapsed * 14);
        ctx.beginPath();
        ctx.arc(32, screenH * 0.49, 3.5 + sparkPulse * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(32, screenH * 0.49, 18 + sparkPulse * 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(225, 29, 46, 0.4)';
        ctx.fill();
      }
      ctx.restore();

      // =========================================================================
      // STEP 4: SPAWN & UPDATE SUPPORTING ATMOSPHERIC PARTICLES
      // Embers, ink droplets, and subtle smoky wisps drifting into the wake
      // =========================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      if (sweepActive && totalProgress < 0.9) {
        // Spawn along dragon head
        const spawnCount = Math.floor(2 + Math.random() * 4);
        for (let s = 0; s < spawnCount; s++) {
          const r = Math.random();
          if (r < 0.45) {
            spawnParticle(headX, headY, 'ember', 2.8, 0, 1.2);
          } else if (r < 0.72) {
            spawnParticle(headX, headY, 'ink_splash', 2.0, 0, 1.0);
          } else if (r < 0.88) {
            spawnParticle(headX, headY, 'spark', 3.2, 0, 1.3);
          } else {
            spawnParticle(headX, headY, 'smoke', 1.2, 0, 0.6);
          }
        }

        // Spawn along the organic ink boundary
        const boundaryY = Math.random() * screenH;
        const boundaryX = getBoundaryX(boundaryY, headX, elapsed);
        if (Math.random() < 0.55) {
          spawnParticle(boundaryX, boundaryY, 'ink_splash', 1.0, (Math.random() - 0.5) * 2, 0.85);
        }
        if (Math.random() < 0.35) {
          spawnParticle(boundaryX, boundaryY, 'ember', 1.5, (Math.random() - 0.5) * 1.5, 0.9);
        }
      }

      // Update and render active particles
      let aliveCount = 0;
      for (let i = 0; i < activeParticles; i++) {
        const p = particles[i];
        p.alpha -= p.decay * dtScale;

        if (p.alpha > 0.01) {
          // Serpentine flow field curl
          p.vx += Math.sin(p.y * 0.018 + elapsed * 2.2) * p.curl * dtScale;
          p.vy += Math.cos(p.x * 0.018 + elapsed * 2.2) * p.curl * dtScale;

          // Drag / fluid deceleration
          p.vx *= Math.pow(0.972, dtScale);
          p.vy *= Math.pow(0.972, dtScale);

          p.x += p.vx * dtScale;
          p.y += p.vy * dtScale;
          p.rotation += p.rotSpeed * dtScale;

          ctx.beginPath();
          if (p.type === 'smoke') {
            // Soft smoky wisp expanding
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            ctx.fill();
          } else if (p.type === 'ember') {
            // Glowing crimson chi ember with bright white core
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            ctx.fill();

            if (p.size > 2.0 && p.alpha > 0.25) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * 0.8));
              ctx.fill();
            }
          } else if (p.type === 'spark') {
            // Restrained red-orange ignition spark
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            ctx.fill();
          } else {
            // Sumi-e dark crimson ink droplet with organic calligraphic rotation
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.ellipse(0, 0, p.size * 1.35, p.size * 0.8, 0, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            ctx.fill();
            ctx.restore();
          }

          particles[aliveCount++] = p;
        }
      }
      activeParticles = aliveCount;
      ctx.restore();

      // =========================================================================
      // STEP 5: COMPLETION CHECK (PHASE 5 — CLEAN FINALIZATION)
      // When line reaches right edge and ink dissipates, hand off cleanly to portfolio
      // =========================================================================
      if (totalProgress >= 1.0 && !isCompleted) {
        isCompleted = true;
        console.log('[CrimsonInkReveal] Crimson dragon ink reveal completed. Clean handoff to interactive portfolio.');
        onComplete();
        return;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Handle viewport resize gracefully
    const handleResize = () => {
      if (!canvas) return;
      screenW = window.innerWidth;
      screenH = window.innerHeight;
      canvas.width = Math.floor(screenW * dpr);
      canvas.height = Math.floor(screenH * dpr);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [duration, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="crimson-ink-reveal-canvas"
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};
export default CrimsonInkReveal;
