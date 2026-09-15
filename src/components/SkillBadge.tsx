/**
 * SkillBadge — Individual skill chip component
 */

import React from 'react';

export type SkillVariant = 'primary' | 'foundation' | 'default';

interface SkillBadgeProps {
  label: string;
  variant?: SkillVariant;
  note?: string;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  label,
  variant = 'default',
  note,
}) => {
  const className = `skill-chip${variant !== 'default' ? ` ${variant}` : ''}`;

  return (
    <span className={className} title={note || undefined}>
      {label}
    </span>
  );
};
