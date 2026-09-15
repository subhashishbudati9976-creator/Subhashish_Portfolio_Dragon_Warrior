import React, { useEffect, useRef, useState } from 'react';

export interface OptionWheelProps {
  items: string[];
  defaultSelected?: number;
  textColor?: string;
  activeColor?: string;
  side?: 'left' | 'right';
  fontSize?: number;
  spacing?: number;
  curve?: number;
  tilt?: number;
  blur?: number;
  fade?: number;
  minOpacity?: number;
  smoothing?: number;
  inset?: number;
  loop?: boolean;
  draggable?: boolean;
  soundUrl?: string;
  wheelEnabled?: boolean;
  onChange?: (index: number, value: string) => void;
}

const clampIndex = (index: number, length: number, loop: boolean) => {
  if (loop) return (index + length) % length;
  return Math.max(0, Math.min(index, length - 1));
};

export const OptionWheel: React.FC<OptionWheelProps> = ({
  items,
  defaultSelected = 0,
  textColor = '#777777',
  activeColor = '#ffffff',
  side = 'left',
  fontSize = 1.45,
  spacing = 1,
  curve = 0.75,
  tilt = 7,
  blur = 1.4,
  fade = 0.22,
  minOpacity = 0.08,
  smoothing = 160,
  inset = 28,
  loop = true,
  draggable = true,
  soundUrl = '',
  wheelEnabled = true,
  onChange,
}) => {
  const [selected, setSelected] = useState(() => clampIndex(defaultSelected, items.length, loop));
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedRef = useRef(selected);
  const lastDragRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectIndex = (nextIndex: number) => {
    if (items.length === 0) return;
    const next = clampIndex(nextIndex, items.length, loop);
    selectedRef.current = next;
    setSelected(next);
    onChange?.(next, items[next]);
    if (soundUrl && typeof Audio !== 'undefined') {
      audioRef.current ??= new Audio(soundUrl);
      audioRef.current.currentTime = 0;
      void audioRef.current.play().catch(() => undefined);
    }
  };

  const scheduleSelection = (nextIndex: number) => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(() => {
      selectIndex(nextIndex);
      animationRef.current = null;
    });
  };

  useEffect(() => {
    if (!wheelEnabled) return;
    const root = rootRef.current;
    if (!root) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      scheduleSelection(selectedRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    root.addEventListener('wheel', handleWheel, { passive: false });
    return () => root.removeEventListener('wheel', handleWheel);
  }, [wheelEnabled]);

  useEffect(() => () => {
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    lastDragRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || lastDragRef.current === null) return;
    const delta = event.clientY - lastDragRef.current;
    if (Math.abs(delta) >= 18) {
      scheduleSelection(selectedRef.current + (delta < 0 ? 1 : -1));
      lastDragRef.current = event.clientY;
    }
  };

  const handlePointerUp = () => {
    lastDragRef.current = null;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      scheduleSelection(selectedRef.current + 1);
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      scheduleSelection(selectedRef.current - 1);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`option-wheel option-wheel-${side}`}
      style={{
        '--option-wheel-text': textColor,
        '--option-wheel-active': activeColor,
        '--option-wheel-size': `${fontSize}rem`,
        '--option-wheel-spacing': `${spacing}rem`,
        '--option-wheel-curve': curve,
        '--option-wheel-tilt': `${tilt}deg`,
        '--option-wheel-blur': `${blur}px`,
        '--option-wheel-fade': fade,
        '--option-wheel-min-opacity': minOpacity,
        '--option-wheel-smoothing': `${smoothing}ms`,
        '--option-wheel-inset': `${inset}px`,
      } as React.CSSProperties}
      role="listbox"
      aria-label="Contact channels"
      aria-activedescendant={`option-wheel-item-${selected}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <span className="option-wheel-active-marker" aria-hidden="true" />
      <div className="option-wheel-items">
        {items.map((item, index) => {
          const rawDistance = index - selected;
          const distance = loop && items.length > 1
            ? (Math.abs(rawDistance) > items.length / 2
              ? rawDistance - Math.sign(rawDistance) * items.length
              : rawDistance)
            : rawDistance;
          const absoluteDistance = Math.abs(distance);
          const offset = distance * (2.35 + spacing * 0.55);
          const curveOffset = Math.pow(distance, 2) * curve * 0.6;
          const isSelected = index === selected;
          return (
            <button
              type="button"
              key={item}
              id={`option-wheel-item-${index}`}
              className={`option-wheel-item${isSelected ? ' is-selected' : ''}`}
              style={{
                transform: `translate(${(side === 'left' ? 1 : -1) * curveOffset}rem, ${offset}rem) rotate(${distance * tilt * 0.16}deg)`,
                opacity: isSelected ? 1 : Math.max(minOpacity, 1 - absoluteDistance * fade),
                filter: isSelected ? 'none' : `blur(${Math.min(blur, absoluteDistance * blur)}px)`,
              }}
              role="option"
              aria-selected={isSelected}
              onClick={() => selectIndex(index)}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};
