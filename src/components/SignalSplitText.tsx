import React from 'react';
import { CinematicSplitText } from './CinematicSplitText';

export const SignalSplitText: React.FC = () => {
  return (
    <CinematicSplitText
      lines={['IF YOU FOUND', 'YOUR WAY', 'HERE,', 'LET\'S', 'BUILD', 'SOMETHING.']}
      className="signal-split-text"
      splitType="words"
      start="top 78%"
    />
  );
};
