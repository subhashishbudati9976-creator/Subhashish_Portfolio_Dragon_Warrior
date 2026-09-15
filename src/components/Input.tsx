import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>{label}</span>
          {props.required && <span style={{ color: 'var(--color-accent-blue)' }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''} ${className}`.trim()}
        {...props}
      />
      {error && <span className="form-feedback error">{error}</span>}
      {!error && helperText && <span className="form-feedback helper">{helperText}</span>}
    </div>
  );
};
