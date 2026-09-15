import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  magnetic?: boolean; // deprecated prop retained for backwards compatibility
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  magnetic, // ignored: magnetic physics removed per user specification
  ...props
}) => {
  const sizeClass =
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  const variantClass =
    variant === 'secondary'
      ? 'btn-secondary'
      : variant === 'accent'
      ? 'btn-accent'
      : variant === 'ghost'
      ? 'btn-ghost'
      : 'btn-primary';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {icon && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
};