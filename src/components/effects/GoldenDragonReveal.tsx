import React, { useEffect, useRef } from 'react';

interface GoldenDragonRevealProps {
  onComplete: () => void;
  duration?: number; // Total cinematic duration in seconds (default ~3.8s)
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
  type: 'gold' | 'crimson' | 'ink';
  curl: number;
}

interface SpinePoint {
  x: number;
  y: number;
  width: number;
  time: number;
}

const GOLD_PALETTE = ['#fff8db', '#ffd700', '#ffb700', '#ffc107', '#ffe082'];
const CRIMSON_PALETTE = ['#ff2a2a', '#e11d2e', '#c6283d', '#ff4d5a'];
const INK_PALETTE = ['#08090c', '#120d14', '#181018'];

/**
 * GoldenDragonReveal
 *
 * Cinematic East-Asian martial-arts map reveal driven by a flowing Golden Dragon Energy Path.
 * - Linear LEFT -> RIGHT movement with organic serpentine curve.
 * - Leading edge unmasks the underlying portfolio using Canvas destination-out with natural ink-brush boundary.
 * - Magnificent flowing golden dragon spine with radiant golden core and braided crimson chi wisps.
 * - Supporting atmospheric sparks, embers, and ink dust that naturally peel away and dissipate.
 * - 60Hz / 120Hz / 240Hz display refresh-rate independent via delta-time rAF timestamps.
 */
export const GoldenDragonReveal: React.FC<GoldenDragonRevealProps> = ({
  onComplete,
  duration = 3.8,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timer = setTimeout(onComplete, 350);
      return () => clearTimeout(timer);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    canvas.width = Math.floor(screenW * dpr);
    canvas.height = Math.floor(screenH * dpr);
    ctx.scale(dpr, dpr);

    // Spine history queue for the dragon's flowing calligraphic body
    const spineHistory: SpinePoint[] = [];
    const MAX_SPINE_POINTS = 160;

    // Pre-allocated particle pool for zero GC pauses
    const MAX_PARTICLES = Math.min(850, Math.floor((screenW * screenH) / 1300));
    const particles: Particle[] = [];
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
        color: '#ffd700',
        type: 'gold',
        curl: 0,
      });
    }

    const spawnParticle = (
      x: number,
      y: number,
      type: 'gold' | 'crimson' | 'ink',
      baseVx: number,
      baseVy: number,
      intensity = 1
    ) => {
      if (activeParticles >= MAX_PARTICLES) return;
      const p = particles[activeParticles++];

      p.x = x + (Math.random() - 0.5) * 16;
      p.y = y + (Math.random() - 0.5) * 16;

      // Particles inherit some backward drag from dragon movement
      const spreadAngle = (Math.random() - 0.5) * Math.PI * 0.85;
      const speed = (0.8 + Math.random() * 2.8) * intensity;

      p.vx = baseVx * 0.15 - Math.cos(spreadAngle) * speed;
      p.vy = baseVy * 0.15 + Math.sin(spreadAngle) * speed + (Math.random() - 0.5) * 1.5;

      p.type = type;
      p.curl = (Math.random() - 0.5) * 0.06;

      if (type === 'gold') {
        p.color = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];
        p.size = 1.6 + Math.random() * 2.8;
        p.alpha = 0.85 + Math.random() * 0.15;
        p.decay = 0.008 + Math.random() * 0.014;
      } else if (type === 'crimson') {
        p.color = CRIMSON_PALETTE[Math.floor(Math.random() * CRIMSON_PALETTE.length)];
        p.size = 1.4 + Math.random() * 2.5;
        p.alpha = 0.75 + Math.random() * 0.25;
        p.decay = 0.007 + Math.random() * 0.012;
      } else {
        // Soft ink dust
        p.color = INK_PALETTE[Math.floor(Math.random() * INK_PALETTE.length)];
        p.size = 3.5 + Math.random() * 6.5;
        p.alpha = 0.5 + Math.random() * 0.3;
        p.decay = 0.006 + Math.random() * 0.009;
      }
    };

    let startTime = performance.now();
    let lastTime = startTime;
    let animationFrameId: number | null = null;
    let isCompleted = false;

    // Organic boundary X calculation across any Y
    const getBoundaryX = (y: number, currentHeadX: number, elapsed: number) => {
      const ny = y / screenH;
      // Serpentine undulations simulating traditional Xuan paper ink-bleed
      const wave1 = Math.sin(ny * Math.PI * 4.2 + elapsed * 2.6) * 48;
      const wave2 = Math.cos(ny * Math.PI * 8.5 - elapsed * 1.8) * 22;
      const wave3 = Math.sin(ny * Math.PI * 16.0) * 10;
      return currentHeadX - 45 + wave1 + wave2 + wave3;
    };

    // Smooth organic S-curve easing
    const getEaseProgress = (t: number) => {
      // 0.0 to 1.0 clamped
      const p = Math.max(0, Math.min(1, t));
      // S-curve with majestic acceleration and gentle deceleration
      return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    };

    const render = (now: number) => {
      const dtMs = Math.min(50, Math.max(1, now - lastTime));
      lastTime = now;
      const dtScale = dtMs / 16.667;

      const elapsed = (now - startTime) / 1000;
      const totalProgress = Math.min(1.0, elapsed / duration);

      // Clear full canvas each frame
      ctx.clearRect(0, 0, screenW, screenH);

      // =========================================================================
      // STAGE 1-2: THE GATE & AWAKENING (0.0s - 0.4s)
      // STAGE 3-4: THE DRAGON PASSES & WORLD OPENS (0.4s - 2.8s)
      // STAGE 5-6: FINAL SWEEP & SILENCE (2.8s - 3.8s)
      // =========================================================================

      // Calculate Dragon Head Coordinates (LEFT -> RIGHT linear sweep)
      // Dragon starts slightly before 0.4s to awaken, then travels across the screen
      const sweepActive = elapsed >= 0.28;
      const sweepProgress = sweepActive ? Math.min(1.0, (elapsed - 0.28) / (duration - 1.1)) : 0;
      const sweepEase = getEaseProgress(sweepProgress);

      // Head travels horizontally from x = -80 to x = screenW + 180
      const headX = sweepActive
        ? -80 + sweepEase * (screenW + 260)
        : -40 + Math.sin(elapsed * 6) * 8;

      // Serpentine vertical flight path (graceful dragon undulation)
      const headY =
        screenH * 0.48 +
        Math.sin(sweepEase * Math.PI * 3.4 + elapsed * 1.5) * (screenH * 0.16) +
        Math.cos(sweepEase * Math.PI * 1.7) * (screenH * 0.07);

      // Record spine history
      if (sweepActive && totalProgress < 0.94) {
        spineHistory.unshift({
          x: headX,
          y: headY,
          width: Math.min(14, 4 + sweepEase * 10),
          time: elapsed,
        });

        if (spineHistory.length > MAX_SPINE_POINTS) {
          spineHistory.pop();
        }
      }

      // =========================================================================
      // STEP 1: DRAW DARK PARCHMENT MASK & CARVE LEFT-TO-RIGHT REVEAL
      // =========================================================================
      ctx.save();
      // Draw dark obsidian shroud covering the unrevealed area
      ctx.fillStyle = '#06070a';
      ctx.fillRect(0, 0, screenW, screenH);

      // Subtle atmospheric dark ink vignette
      const darkWash = ctx.createRadialGradient(
        screenW * 0.5,
        screenH * 0.5,
        80,
        screenW * 0.5,
        screenH * 0.5,
        Math.max(screenW, screenH) * 0.8
      );
      darkWash.addColorStop(0, 'rgba(15, 16, 22, 0.96)');
      darkWash.addColorStop(0.6, 'rgba(8, 9, 12, 0.98)');
      darkWash.addColorStop(1, '#050608');
      ctx.fillStyle = darkWash;
      ctx.fillRect(0, 0, screenW, screenH);

      // Now carve away everything to the left of the dragon using destination-out!
      if (sweepActive) {
        ctx.globalCompositeOperation = 'destination-out';

        const ySteps = 42;
        const stepH = screenH / ySteps;

        ctx.beginPath();
        ctx.moveTo(-100, -50);

        // Trace the organic serpentine boundary edge
        for (let i = 0; i <= ySteps; i++) {
          const y = i * stepH;
          const bx = getBoundaryX(y, headX, elapsed);
          ctx.lineTo(bx, y);
        }

        ctx.lineTo(-100, screenH + 50);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fill();

        // Feathered dry-brush stamp edge along the boundary
        if (totalProgress < 0.95) {
          for (let i = 0; i <= ySteps; i += 2) {
            const y = i * stepH;
            const bx = getBoundaryX(y, headX, elapsed);
            const radius = 45 + Math.sin(i * 1.5 + elapsed * 3) * 18 + Math.random() * 12;

            ctx.beginPath();
            ctx.arc(bx, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // =========================================================================
      // STEP 2: RENDER THE GOLDEN DRAGON ENERGY SPINE (SOURCE-OVER)
      // The hero visual: a magnificent flowing golden serpentine energy path
      // =========================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      if (spineHistory.length > 2) {
        // Overall energy intensity fades gently near the end (Stage 5-6)
        const spineAlpha = Math.max(0, Math.min(1, (1.0 - totalProgress) / 0.18));

        // 1. Warm Golden Amber Outer Aura
        ctx.beginPath();
        for (let i = 0; i < spineHistory.length; i++) {
          const pt = spineHistory[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(255, 183, 0, ${0.32 * spineAlpha})`;
        ctx.lineWidth = 26;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // 2. Braided Martial Crimson Chi Wisps (Counter-phase undulating tendrils)
        ctx.beginPath();
        for (let i = 0; i < spineHistory.length; i++) {
          const pt = spineHistory[i];
          const tIdx = i / spineHistory.length;
          // Undulating braided offset
          const chiOffset = Math.sin(tIdx * Math.PI * 6.0 + elapsed * 4.0) * (14 * (1 - tIdx));
          const cx = pt.x;
          const cy = pt.y + chiOffset;
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.strokeStyle = `rgba(225, 29, 46, ${0.65 * spineAlpha})`;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 3. Main Calligraphic Golden Energy Ribbon
        for (let i = 0; i < spineHistory.length - 1; i++) {
          const curr = spineHistory[i];
          const next = spineHistory[i + 1];
          const taper = 1 - i / spineHistory.length; // Thicker at dragon chest, tapering to tail

          ctx.beginPath();
          ctx.moveTo(curr.x, curr.y);
          ctx.lineTo(next.x, next.y);
          ctx.strokeStyle = `rgba(255, 215, 0, ${0.9 * taper * spineAlpha})`;
          ctx.lineWidth = Math.max(2, curr.width * taper);
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // 4. Luminous Brilliant Golden-White Core Filament
        ctx.beginPath();
        for (let i = 0; i < spineHistory.length; i++) {
          const pt = spineHistory[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(255, 252, 235, ${0.95 * spineAlpha})`;
        ctx.lineWidth = 2.4;
        ctx.lineCap = 'round';
        ctx.stroke();

        // 5. Radiant Dragon Head Core Spark
        if (headX < screenW + 80 && spineAlpha > 0.05) {
          // Intense radiant jewel core
          ctx.beginPath();
          ctx.arc(headX, headY, 5.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = Math.min(1, spineAlpha);
          ctx.fill();

          // Golden corona halo
          ctx.beginPath();
          ctx.arc(headX, headY, 18, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
          ctx.fill();

          // Whisker energy filaments
          ctx.beginPath();
          ctx.moveTo(headX, headY);
          ctx.quadraticCurveTo(headX - 25, headY - 18, headX - 45, headY - 10);
          ctx.moveTo(headX, headY);
          ctx.quadraticCurveTo(headX - 25, headY + 18, headX - 45, headY + 10);
          ctx.strokeStyle = 'rgba(255, 240, 180, 0.75)';
          ctx.lineWidth = 1.4;
          ctx.stroke();
        }
      } else if (!sweepActive) {
        // Stage 1-2 Awakening Spark on far left edge
        const sparkPulse = 0.5 + 0.5 * Math.sin(elapsed * 12);
        ctx.beginPath();
        ctx.arc(35, screenH * 0.48, 3 + sparkPulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(35, screenH * 0.48, 14 + sparkPulse * 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
        ctx.fill();
      }

      // =========================================================================
      // STEP 3: SPAWN & UPDATE SUPPORTING ATMOSPHERIC PARTICLES
      // Particles peel off the dragon spine and reveal boundary into the wake
      // =========================================================================
      if (sweepActive && totalProgress < 0.88) {
        // Spawn along dragon head
        const spawnCount = Math.floor(2 + Math.random() * 3);
        for (let s = 0; s < spawnCount; s++) {
          const r = Math.random();
          if (r < 0.65) {
            spawnParticle(headX, headY, 'gold', 3, 0, 1.2);
          } else if (r < 0.88) {
            spawnParticle(headX, headY, 'crimson', 2.5, 0, 1.0);
          } else {
            spawnParticle(headX, headY, 'ink', 1.5, 0, 0.7);
          }
        }

        // Also spawn intermittently along the serpentine reveal boundary
        const boundaryY = Math.random() * screenH;
        const boundaryX = getBoundaryX(boundaryY, headX, elapsed);
        if (Math.random() < 0.45) {
          spawnParticle(boundaryX, boundaryY, 'gold', 1, (Math.random() - 0.5) * 2, 0.9);
        }
      }

      // Update and draw active particles
      let aliveCount = 0;
      for (let i = 0; i < activeParticles; i++) {
        const p = particles[i];
        p.alpha -= p.decay * dtScale;

        if (p.alpha > 0.01) {
          // Subtle serpentine curl
          p.vx += Math.sin(p.y * 0.02 + elapsed * 2) * p.curl * dtScale;
          p.vy += Math.cos(p.x * 0.02 + elapsed * 2) * p.curl * dtScale;

          // Drag / deceleration
          p.vx *= Math.pow(0.97, dtScale);
          p.vy *= Math.pow(0.97, dtScale);

          p.x += p.vx * dtScale;
          p.y += p.vy * dtScale;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
          ctx.fill();

          // Golden sparks get a subtle bright center core
          if (p.type === 'gold' && p.size > 2.0 && p.alpha > 0.3) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * 0.7));
            ctx.fill();
          }

          particles[aliveCount++] = p;
        }
      }
      activeParticles = aliveCount;
      ctx.restore();

      // =========================================================================
      // STEP 4: COMPLETION CHECK (STAGE 6: SILENCE)
      // Clean handoff to interactive portfolio
      // =========================================================================
      if (totalProgress >= 1.0 && !isCompleted) {
        isCompleted = true;
        console.log('[GoldenDragonReveal] Golden dragon sweep completed. Portfolio fully interactive.');
        onComplete();
        return;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [duration, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="golden-dragon-reveal-canvas"
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
export default GoldenDragonReveal;
