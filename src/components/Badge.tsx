import React from 'react';

export interface BadgeProps {
  variant?: 'default' | 'crimson' | 'ember' | 'blue' | 'violet' | 'success';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  icon,
}) => {
  const variantClass =
    variant === 'crimson' || variant === 'blue'
      ? 'badge-crimson'
      : variant === 'ember' || variant === 'violet'
      ? 'badge-ember'
      : variant === 'success'
      ? 'badge-success'
      : '';

  return (
    <span className={`badge ${variantClass}`.trim()}>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
