import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  error,
  id,
  className = '',
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={textareaId} className="form-label">
          <span>{label}</span>
          {props.required && <span style={{ color: 'var(--color-accent-blue)' }}>*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`textarea-field ${error ? 'input-error' : ''} ${className}`.trim()}
        {...props}
      />
      {error && <span className="form-feedback error">{error}</span>}
      {!error && helperText && <span className="form-feedback helper">{helperText}</span>}
    </div>
  );
};
