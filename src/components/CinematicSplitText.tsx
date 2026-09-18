import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(SplitText, ScrollTrigger);

interface CinematicSplitTextProps {
  lines: string[];
  className?: string;
  splitType?: 'lines' | 'words';
  start?: string;
  duration?: number;
  stagger?: number;
}

export const CinematicSplitText: React.FC<CinematicSplitTextProps> = ({
  lines,
  className = '',
  splitType = 'lines',
  start = 'top 80%',
  duration = 1,
  stagger = 0.1,
}) => {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const accessibleText = lines.join(' ');

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const setup = () => {
      if (cancelled || !root) return;
      const context = gsap.context(() => {
        const lineElements = gsap.utils.toArray<HTMLElement>('.cinematic-split-line');
        const splits = splitType === 'words'
          ? lineElements.map(line => new SplitText(line, { type: 'words' }))
          : [];
        const targets = splitType === 'words'
          ? splits.flatMap(split => split.words)
          : lineElements;

        gsap.set(targets, { opacity: 0, y: 64, force3D: true });
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root,
            start,
            once: true,
          },
          onComplete: () => {
            if (root) {
              const masks = root.querySelectorAll('.cinematic-split-mask');
              masks.forEach(mask => {
                (mask as HTMLElement).style.overflow = 'visible';
              });
            }
          },
        });

        cleanup = () => {
          splits.forEach(split => split.revert());
          context.revert();
        };
      }, root);
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    void fontsReady.then(setup);
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [duration, splitType, stagger, start]);

  return (
    <span ref={rootRef} className={`cinematic-split-text ${className}`}>
      <span className="cinematic-split-accessible">{accessibleText}</span>
      <span className="cinematic-split-visible" aria-hidden="true">
        {lines.map(line => (
          <span className="cinematic-split-mask" key={line}>
            <span className="cinematic-split-line">{line}</span>
          </span>
        ))}
      </span>
    </span>
  );
};
