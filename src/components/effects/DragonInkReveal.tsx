import React, { useEffect, useRef } from 'react';

interface DragonInkRevealProps {
  onComplete: () => void;
  duration?: number; // Total duration in seconds (default ~3.2s)
}

interface InkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
  type: 'ink' | 'crimson' | 'gold' | 'smoke';
  curl: number;
  rotation: number;
  rotSpeed: number;
}

const CRIMSON_PALETTE = ['#ff2a2a', '#e11d2e', '#c6283d', '#ff4d5a', '#ba1826'];
const GOLD_PALETTE = ['#ffca58', '#ffd700', '#e5a823'];
const INK_PALETTE = ['#08090c', '#0f1015', '#1a1014', '#140c10'];

/**
 * DragonInkReveal
 *
 * Full-screen ancient martial arts ink-brush & dragon chi particle reveal.
 * - Carves an organic sumi-e brushstroke wave across the screen using Canvas destination-out.
 * - Spawns thousands of dynamic ink splashes, crimson chi embers, and golden sparks.
 * - 60Hz / 120Hz display refresh-rate independent via delta-time rAF interpolation.
 * - Pre-allocated particle pool for zero garbage collection during animation.
 */
export const DragonInkReveal: React.FC<DragonInkRevealProps> = ({
  onComplete,
  duration = 3.2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const timer = setTimeout(onComplete, 400);
      return () => clearTimeout(timer);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.scale(dpr, dpr);

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    // Diagonal sweep distance across screen
    const maxSweepDist = Math.hypot(screenW, screenH) * 1.35;

    // Pre-allocated particle pool (1,000 particles)
    const MAX_PARTICLES = Math.min(1100, Math.floor((screenW * screenH) / 1000));
    const particles: InkParticle[] = [];
    let activeParticleCount = 0;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 2,
        alpha: 0,
        maxAlpha: 1,
        decay: 0.02,
        color: '#ff2a2a',
        type: 'crimson',
        curl: 0,
        rotation: 0,
        rotSpeed: 0,
      });
    }

    const spawnParticle = (
      x: number,
      y: number,
      type: 'ink' | 'crimson' | 'gold' | 'smoke',
      normalX: number,
      normalY: number,
      speedMultiplier = 1
    ) => {
      if (activeParticleCount >= MAX_PARTICLES) return;
      const p = particles[activeParticleCount++];

      p.x = x + (Math.random() - 0.5) * 28;
      p.y = y + (Math.random() - 0.5) * 28;

      const baseSpeed = (1.5 + Math.random() * 4.5) * speedMultiplier;
      const spreadAngle = (Math.random() - 0.5) * 1.4;
      const baseAngle = Math.atan2(normalY, normalX) + spreadAngle;

      p.vx = Math.cos(baseAngle) * baseSpeed;
      p.vy = Math.sin(baseAngle) * baseSpeed;

      p.type = type;
      p.curl = (Math.random() - 0.5) * 0.08;
      p.rotation = Math.random() * Math.PI * 2;
      p.rotSpeed = (Math.random() - 0.5) * 0.12;

      if (type === 'crimson') {
        p.color = CRIMSON_PALETTE[Math.floor(Math.random() * CRIMSON_PALETTE.length)];
        p.size = 1.8 + Math.random() * 3.8;
        p.maxAlpha = 0.85 + Math.random() * 0.15;
        p.alpha = p.maxAlpha;
        p.decay = 0.009 + Math.random() * 0.016;
      } else if (type === 'gold') {
        p.color = GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)];
        p.size = 1.4 + Math.random() * 2.4;
        p.maxAlpha = 0.95;
        p.alpha = p.maxAlpha;
        p.decay = 0.012 + Math.random() * 0.022;
      } else if (type === 'ink') {
        p.color = INK_PALETTE[Math.floor(Math.random() * INK_PALETTE.length)];
        p.size = 3.5 + Math.random() * 7.5;
        p.maxAlpha = 0.9 + Math.random() * 0.1;
        p.alpha = p.maxAlpha;
        p.decay = 0.008 + Math.random() * 0.014;
      } else {
        // Smoke wisp
        p.color = 'rgba(198, 40, 61, 0.4)';
        p.size = 8 + Math.random() * 18;
        p.maxAlpha = 0.28 + Math.random() * 0.22;
        p.alpha = p.maxAlpha;
        p.decay = 0.006 + Math.random() * 0.01;
      }
    };

    let startTime = performance.now();
    let lastTime = startTime;
    let animationFrameId: number | null = null;
    let isCompleted = false;

    // Draw initial opaque cinematic shroud overlay on canvas
    ctx.fillStyle = '#08090c';
    ctx.fillRect(0, 0, screenW, screenH);

    // Subtle dark ink texture wash
    const wash = ctx.createRadialGradient(
      screenW * 0.5,
      screenH * 0.45,
      100,
      screenW * 0.5,
      screenH * 0.5,
      Math.max(screenW, screenH)
    );
    wash.addColorStop(0, 'rgba(20, 10, 15, 0.95)');
    wash.addColorStop(0.6, 'rgba(10, 11, 14, 0.98)');
    wash.addColorStop(1, '#06070a');
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, screenW, screenH);

    // Organic noise / serpentine curve helper for the sweeping dragon brush front
    const getFrontPoint = (ratio: number, currentSweepDist: number) => {
      // Sweeping diagonal arc from top-left (-0.1, -0.1) toward bottom-right (1.1, 1.1)
      const sweepAngle = Math.PI * 0.28; // ~50 degrees diagonal
      const cosA = Math.cos(sweepAngle);
      const sinA = Math.sin(sweepAngle);

      // Base coordinate along line perpendicular to sweep direction
      const perpDist = (ratio - 0.5) * Math.max(screenW, screenH) * 1.6;
      const perpX = -sinA * perpDist;
      const perpY = cosA * perpDist;

      // Advance along sweep direction
      let x = currentSweepDist * cosA + perpX;
      let y = currentSweepDist * sinA + perpY;

      // Add fluid serpentine dragon curvature & calligraphy dry-brush harmonics
      const harmonic1 = Math.sin(ratio * Math.PI * 3.5 + currentSweepDist * 0.004) * 45;
      const harmonic2 = Math.cos(ratio * Math.PI * 7.0 - currentSweepDist * 0.008) * 22;
      const harmonic3 = Math.sin(ratio * Math.PI * 14.0) * 9;

      x += cosA * (harmonic1 + harmonic2 + harmonic3);
      y += sinA * (harmonic1 + harmonic2 + harmonic3);

      return { x, y, normX: cosA, normY: sinA };
    };

    let prevSweepDist = -40;

    const render = (now: number) => {
      const dtMs = Math.min(50, Math.max(1, now - lastTime));
      lastTime = now;
      const dtScale = dtMs / 16.667;

      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(1.0, elapsed / duration);

      // Organic easing: slow dramatic start, accelerating surge, smooth settling tail
      // Custom ease-in-out-cubic
      const easeProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentSweepDist = easeProgress * (maxSweepDist + 120);

      // =========================================================================
      // STEP 1: CARVE THE INK BRUSH WIPE USING DESTINATION-OUT
      // Makes pixels transparent, revealing the underlying interactive portfolio!
      // =========================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';

      const segmentCount = 48;
      const distStep = currentSweepDist - prevSweepDist;

      // Draw sweeping organic brush strokes between previous and current sweep distance
      for (let s = 0; s <= segmentCount; s++) {
        const ratio = s / segmentCount;
        const pt = getFrontPoint(ratio, currentSweepDist);

        // Splatter brush stamp radius (varies dynamically like an ancient coarse horsehair brush)
        const brushRadius = 55 + Math.sin(ratio * 12.0) * 18 + Math.random() * 16;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, brushRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fill();

        // If sweeping fast, fill interpolation gap to avoid gaps in the brush
        if (distStep > 4) {
          const midPt = getFrontPoint(ratio, (currentSweepDist + prevSweepDist) * 0.5);
          ctx.beginPath();
          ctx.arc(midPt.x, midPt.y, brushRadius * 0.95, 0, Math.PI * 2);
          ctx.fill();
        }

        // Spawn ink and chi particles along the leading tearing edge
        if (progress < 0.92) {
          const spawnRoll = Math.random();
          if (spawnRoll < 0.42) {
            spawnParticle(pt.x, pt.y, 'crimson', pt.normX, pt.normY, 1.2);
          } else if (spawnRoll < 0.65) {
            spawnParticle(pt.x, pt.y, 'ink', pt.normX, pt.normY, 0.9);
          } else if (spawnRoll < 0.82) {
            spawnParticle(pt.x, pt.y, 'gold', pt.normX, pt.normY, 1.4);
          } else if (spawnRoll < 0.94) {
            spawnParticle(pt.x, pt.y, 'smoke', pt.normX, pt.normY, 0.6);
          }
        }
      }

      prevSweepDist = currentSweepDist;
      ctx.restore();

      // =========================================================================
      // STEP 2: RENDER PARTICLES & DRAGON CHI WISPS (NORMAL BLENDING)
      // =========================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';

      let aliveCount = 0;

      for (let i = 0; i < activeParticleCount; i++) {
        const p = particles[i];
        p.alpha -= p.decay * dtScale;

        if (p.alpha > 0.01) {
          // Serpentine flow field curl
          p.vx += Math.sin(p.y * 0.015 + now * 0.003) * p.curl * dtScale;
          p.vy += Math.cos(p.x * 0.015 + now * 0.003) * p.curl * dtScale;

          // Drag / deceleration
          p.vx *= Math.pow(0.975, dtScale);
          p.vy *= Math.pow(0.975, dtScale);

          p.x += p.vx * dtScale;
          p.y += p.vy * dtScale;

          p.rotation += p.rotSpeed * dtScale;

          ctx.beginPath();
          if (p.type === 'smoke') {
            // Soft atmospheric smoke puff
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            ctx.fill();
          } else if (p.type === 'crimson') {
            // Glowing crimson chi ember
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            ctx.fill();

            // Subtle luminous core
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * 0.8));
            ctx.fill();
          } else if (p.type === 'gold') {
            // Golden dragon spark
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            ctx.fill();
          } else {
            // Sumi-e dark ink droplet with slight organic deformation
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.ellipse(0, 0, p.size * 1.3, p.size * 0.8, 0, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
            ctx.fill();
            ctx.restore();
          }

          // Compact active particle pool in place
          particles[aliveCount++] = p;
        }
      }

      activeParticleCount = aliveCount;
      ctx.restore();

      // =========================================================================
      // STEP 3: COMPLETION CHECK
      // =========================================================================
      if (progress >= 1.0 && activeParticleCount === 0 && !isCompleted) {
        isCompleted = true;
        console.log('[DragonInkReveal] Cinematic reveal transition completed successfully.');
        onComplete();
        return;
      }

      // Safety timeout: if progress completes and lingering particles remain after +0.5s, finish cleanly
      if (elapsed > duration + 0.6 && !isCompleted) {
        isCompleted = true;
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
      className="dragon-ink-reveal-canvas"
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
export default DragonInkReveal;
