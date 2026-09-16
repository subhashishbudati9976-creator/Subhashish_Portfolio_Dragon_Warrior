import React from 'react';

export type ZebxNeuralCoreState = 'idle' | 'listening' | 'thinking' | 'speaking';

const PARTICLES = [
  { x: 12, y: 24, delay: '0s' },
  { x: 23, y: 11, delay: '-1.2s' },
  { x: 42, y: 7, delay: '-2.1s' },
  { x: 68, y: 12, delay: '-0.6s' },
  { x: 87, y: 28, delay: '-1.7s' },
  { x: 91, y: 55, delay: '-2.8s' },
  { x: 78, y: 82, delay: '-0.9s' },
  { x: 58, y: 92, delay: '-2.4s' },
  { x: 31, y: 87, delay: '-1.5s' },
  { x: 10, y: 67, delay: '-3.1s' },
  { x: 28, y: 42, delay: '-2.7s' },
  { x: 73, y: 43, delay: '-1.1s' },
  { x: 63, y: 72, delay: '-3.4s' },
  { x: 39, y: 69, delay: '-0.4s' },
];

interface ZebxNeuralCoreProps {
  state: ZebxNeuralCoreState;
}

export const ZebxNeuralCore: React.FC<ZebxNeuralCoreProps> = ({ state }) => (
  <div className={`zebx-neural-core zebx-neural-core-${state}`} aria-label={`ZEBX Neural Core ${state}`}>
    <svg className="zebx-neural-filaments" viewBox="0 0 240 240" aria-hidden="true">
      <path className="zebx-filament zebx-filament-one" d="M20 142 C54 36 135 24 215 91" />
      <path className="zebx-filament zebx-filament-two" d="M35 54 C116 112 122 184 210 198" />
      <path className="zebx-filament zebx-filament-three" d="M22 190 C78 137 156 150 218 42" />
      <circle className="zebx-filament-node zebx-filament-node-one" cx="91" cy="61" r="2" />
      <circle className="zebx-filament-node zebx-filament-node-two" cx="157" cy="163" r="2" />
      <circle className="zebx-filament-node zebx-filament-node-three" cx="177" cy="83" r="2" />
    </svg>

    <div className="zebx-neural-rings" aria-hidden="true">
      <span className="zebx-neural-ring zebx-neural-ring-one" />
      <span className="zebx-neural-ring zebx-neural-ring-two" />
      <span className="zebx-neural-ring zebx-neural-ring-three" />
    </div>

    <div className="zebx-neural-particles" aria-hidden="true">
      {PARTICLES.map((particle, index) => (
        <span
          key={`${particle.x}-${particle.y}`}
          className="zebx-neural-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: particle.delay,
            '--particle-index': index,
          } as React.CSSProperties}
        />
      ))}
    </div>

    <div className="zebx-neural-nucleus" aria-hidden="true">
      <span className="zebx-neural-nucleus-core">Z</span>
    </div>

    <div className="zebx-neural-label">
      <strong>ZEBX // NEURAL CORE</strong>
      <span><i aria-hidden="true" />SYSTEM // {state === 'thinking' ? 'PROCESSING' : state === 'listening' ? 'LISTENING' : state === 'speaking' ? 'SPEAKING' : 'STANDBY'}</span>
    </div>
  </div>
);
