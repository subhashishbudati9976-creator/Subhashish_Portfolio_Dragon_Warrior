import React, { useEffect, useState } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  delay = 65,
  className = '',
}) => {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStarted(true);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <span
      className={`blur-text ${className}`}
      aria-label={text}
    >
      {Array.from(text).map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={`blur-text-letter${started ? ' is-visible' : ''}`}
          style={{
            transitionDelay: started ? `${index * delay}ms` : '0ms',
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default BlurText;