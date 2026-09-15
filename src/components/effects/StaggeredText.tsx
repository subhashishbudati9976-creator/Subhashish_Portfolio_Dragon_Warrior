import React, { useEffect, useRef, useState } from 'react';

interface StaggeredTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}

const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  delay = 70,
  duration = 850,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <span
      ref={ref}
      className={`staggered-text ${className}`}
      aria-label={text}
    >
      {words.map((word, index) => (
        <React.Fragment key={`${word}-${index}`}>
          <span
            className={`staggered-text-word${visible ? ' is-visible' : ''}`}
            style={{
              transitionDuration: `${duration}ms`,
              transitionDelay: visible ? `${index * delay}ms` : '0ms',
            }}
            aria-hidden="true"
          >
            {word}
          </span>
          {index < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  );
};

export default StaggeredText;