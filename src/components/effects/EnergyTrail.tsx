import React, { useEffect, useRef } from 'react';

/**
 * EnergyTrail (adapted from SwarmCursor concept)
 *
 * A subtle, high-performance global cinematic energy trail.
 * - Colors: #ff2a2a, #e11d2e, deep crimson/ember residue.
 * - Short trail (80–130px max length).
 * - 11 pre-allocated nodes (no garbage collection).
 * - Smooth inertia + organic sway.
 * - Auto-sleep when idle (0% CPU/GPU overhead when cursor stops).
 * - Canvas 2D with pointer-events: none.
 */

interface TrailNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  targetAlpha: number;
  size: number;
  color: string;
}

const NODE_COUNT = 11;

// Curated crimson/ember palette from lead to tail
const NODE_PALETTE = [
  '#ff2a2a', // Lead: brightest crimson/vermilion
  '#f52530',
  '#e11d2e',
  '#cf1b2a',
  '#ba1826',
  '#a51522',
  '#91121e',
  '#7c101a',
  '#680d16',
  '#540a12',
  '#40070e', // Tail: deep obsidian crimson
];

export const EnergyTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 1. Accessibility: Skip completely if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // 2. Mobile/Touch: Skip if primary pointer is coarse (touch screen)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // High performance DPR capping (max 1.5 to protect GPU fill-rate)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = (canvas.width = Math.floor(window.innerWidth * dpr));
    let height = (canvas.height = Math.floor(window.innerHeight * dpr));
    ctx.scale(dpr, dpr);

    // Reusable pre-allocated particle nodes — ZERO heap allocation in rAF loop
    const nodes: TrailNode[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const progress = i / (NODE_COUNT - 1);
      nodes.push({
        x: -100,
        y: -100,
        vx: 0,
        vy: 0,
        alpha: 0,
        targetAlpha: 0,
        // Particle size: 3.4px lead down to 1.3px tail
        size: Math.max(1.3, 3.4 * (1 - progress * 0.62)),
        color: NODE_PALETTE[i] || '#e11d2e',
      });
    }

    // Lightweight pointer state
    const mouse = {
      x: -100,
      y: -100,
      speed: 0,
      lastTime: 0,
      isMoving: false,
      inWindow: false,
      idleTimer: 0,
    };

    let rafId: number | null = null;
    let isSleeping = true;

    const handleResize = () => {
      width = canvas.width = Math.floor(window.innerWidth * dpr);
      height = canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Ultra-smooth rendering loop
    const render = (now: number) => {
      ctx.clearRect(0, 0, width / dpr, height / dpr);

      let anyVisible = false;

      // 1. Update lead node (Node 0)
      const lead = nodes[0];
      if (mouse.inWindow) {
        // High-responsiveness lerp toward cursor
        lead.x += (mouse.x - lead.x) * 0.46;
        lead.y += (mouse.y - lead.y) * 0.46;
      }

      // 2. Update subsequent nodes with constrained distance and subtle organic sway
      for (let i = 1; i < NODE_COUNT; i++) {
        const prev = nodes[i - 1];
        const curr = nodes[i];

        // Segment distance constraint: max 12px separation ensures short 90-130px visual trail
        const dx = prev.x - curr.x;
        const dy = prev.y - curr.y;
        const dist = Math.hypot(dx, dy);

        const targetDist = 11.5;
        const pullFactor = 0.38;

        if (dist > 0.001) {
          curr.x += dx * pullFactor;
          curr.y += dy * pullFactor;

          // Clamp max separation so trail never stretches excessively on fast flick
          if (dist > targetDist * 1.5) {
            const angle = Math.atan2(dy, dx);
            curr.x = prev.x - Math.cos(angle) * (targetDist * 1.5);
            curr.y = prev.y - Math.sin(angle) * (targetDist * 1.5);
          }
        }

        // Tiny organic micro-sway (0.6px max) gives living supernatural energy feel
        const sway = Math.sin(now * 0.007 + i * 0.85) * 0.45;
        curr.x += sway * 0.3;
        curr.y += sway * 0.3;
      }

      // 3. Alpha calculation & Drawing
      const isFast = mouse.speed > 8;
      const speedAlphaBonus = Math.min(0.25, mouse.speed * 0.015);

      for (let i = 0; i < NODE_COUNT; i++) {
        const node = nodes[i];
        const progress = i / (NODE_COUNT - 1);

        if (mouse.isMoving && mouse.inWindow) {
          // Particles closer to cursor are brighter; tail is dimmer
          node.targetAlpha = Math.max(
            0,
            (0.85 - progress * 0.65) * (isFast ? 1.0 : 0.75) + speedAlphaBonus
          );
        } else {
          // Fade away smoothly when mouse stops or leaves window
          node.targetAlpha = 0;
        }

        // Smooth alpha transition
        node.alpha += (node.targetAlpha - node.alpha) * (node.targetAlpha === 0 ? 0.12 : 0.28);

        if (node.alpha > 0.01) {
          anyVisible = true;

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);

          // Lead particle gets a restrained subtle red glow
          if (i === 0) {
            ctx.shadowBlur = 8;
            ctx.shadowColor = `rgba(225, 29, 46, ${node.alpha * 0.65})`;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillStyle = node.color;
          ctx.globalAlpha = Math.max(0, Math.min(1, node.alpha));
          ctx.fill();

          // Subtle energy thread linking nodes for fluid continuity
          if (i > 0 && nodes[i - 1].alpha > 0.05) {
            const prev = nodes[i - 1];
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = node.color;
            ctx.lineWidth = Math.max(0.7, node.size * 0.55);
            ctx.globalAlpha = Math.max(0, Math.min(1, node.alpha * 0.35));
            ctx.stroke();
          }
        }
      }

      // Reset context state for clean compositing
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // 4. Auto-sleep detection: if all particles have faded out and mouse is idle, stop rAF!
      if (!anyVisible && !mouse.isMoving) {
        ctx.clearRect(0, 0, width / dpr, height / dpr);
        rafId = null;
        isSleeping = true;
      } else {
        rafId = requestAnimationFrame(render);
      }
    };

    const wakeLoop = () => {
      if (isSleeping) {
        isSleeping = false;
        rafId = requestAnimationFrame(render);
      }
    };

    // Passive global pointer listener — ZERO getBoundingClientRect calls
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - mouse.lastTime);

      const dx = e.clientX - mouse.x;
      const dy = e.clientY - mouse.y;
      mouse.speed = Math.hypot(dx, dy) / (dt / 16.667);

      // Initialize position on first move to prevent flying in from (-100, -100)
      if (!mouse.inWindow) {
        for (let i = 0; i < NODE_COUNT; i++) {
          nodes[i].x = e.clientX;
          nodes[i].y = e.clientY;
        }
      }

      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastTime = now;
      mouse.inWindow = true;
      mouse.isMoving = true;

      // Reset idle timer
      if (mouse.idleTimer) window.clearTimeout(mouse.idleTimer);
      mouse.idleTimer = window.setTimeout(() => {
        mouse.isMoving = false;
        mouse.speed = 0;
      }, 100);

      wakeLoop();
    };

    const onMouseLeave = () => {
      mouse.inWindow = false;
      mouse.isMoving = false;
      mouse.speed = 0;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
          isSleeping = true;
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (mouse.idleTimer) window.clearTimeout(mouse.idleTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="energy-trail-canvas"
      aria-hidden="true"
    />
  );
};

// Also export as SwarmCursor for compatibility
export const SwarmCursor = EnergyTrail;
export default EnergyTrail;
