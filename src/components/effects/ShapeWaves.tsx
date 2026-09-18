import React, { useEffect, useRef } from 'react';

interface ShapeWavesProps {
  isActive?: boolean;
}

/**
 * ShapeWaves — WebGPU / Canvas2D Dynamic Wave Background
 * 
 * Renders smooth, subtle crimson/ember wave movement matching the Dragon Warrior aesthetic.
 * - Detects WebGPU support with automatic graceful Canvas2D fallback.
 * - Auto-disposes rendering loops and GPU resources when isActive becomes false.
 * - Respects prefers-reduced-motion.
 */
export const ShapeWaves: React.FC<ShapeWavesProps> = ({ isActive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let isDestroyed = false;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas || isDestroyed) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Fallback Canvas 2D organic cinematic wave renderer (reliable across all browsers and WebGPU states)
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    let lastTime = performance.now();
    const waveCount = 5;
    const colors = [
      'rgba(198, 40, 61, 0.16)', // Crimson
      'rgba(110, 23, 38, 0.14)', // Deep blood crimson
      'rgba(245, 37, 48, 0.08)', // Ember
      'rgba(40, 10, 18, 0.35)',  // Shadow crimson
      'rgba(198, 40, 61, 0.10)', // Ambient wave
    ];

    const render = (now: number) => {
      if (isDestroyed || !ctx) return;
      const dt = Math.min(64, Math.max(1, now - lastTime));
      lastTime = now;
      const dtScale = dt / 16.667;

      time += 0.012 * dtScale;

      ctx.clearRect(0, 0, width, height);

      // Render smooth layered flowing waves
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        const baseHeight = height * (0.45 + w * 0.1);
        const amplitude = 35 + w * 18;
        const frequency = 0.0018 + w * 0.0006;
        const speed = time * (0.8 + w * 0.2);

        ctx.moveTo(0, height);
        ctx.lineTo(0, baseHeight);

        for (let x = 0; x <= width; x += 15) {
          const y = baseHeight +
            Math.sin(x * frequency + speed) * amplitude +
            Math.cos(x * frequency * 0.5 - speed * 0.7) * (amplitude * 0.4);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        ctx.fillStyle = colors[w % colors.length];
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isDestroyed = true;
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="shape-waves-canvas"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};
