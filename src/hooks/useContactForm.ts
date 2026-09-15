/**
 * useContactForm — Phase 2 Contact Form State & Validation
 *
 * Manages form field state, client-side validation, and submission state.
 * In Phase 2: simulates a successful submission (no real API call).
 * Phase 5: replace the simulateSubmit call with a real POST to /api/contact.
 */

import { useState, useCallback } from 'react';
import type {
  ContactFormData,
  ContactFormErrors,
  FormStatus,
} from '../types';

const EMPTY_DATA: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const EMPTY_ERRORS: ContactFormErrors = {};

/* Validation rules */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 80;
const MAX_EMAIL = 254;
const MAX_SUBJECT = 120;
const MAX_MESSAGE = 2000;

function validate(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required.';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  } else if (data.name.trim().length > MAX_NAME) {
    errors.name = `Name must be under ${MAX_NAME} characters.`;
  }

  if (!data.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (data.email.trim().length > MAX_EMAIL) {
    errors.email = `Email address must be under ${MAX_EMAIL} characters.`;
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.subject.trim()) {
    errors.subject = 'Subject is required.';
  } else if (data.subject.trim().length < 3) {
    errors.subject = 'Subject must be at least 3 characters.';
  } else if (data.subject.trim().length > MAX_SUBJECT) {
    errors.subject = `Subject must be under ${MAX_SUBJECT} characters.`;
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required.';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  } else if (data.message.length > MAX_MESSAGE) {
    errors.message = `Message must be under ${MAX_MESSAGE} characters.`;
  }

  return errors;
}

export function useContactForm() {
  const [data, setData] = useState<ContactFormData>(EMPTY_DATA);
  const [errors, setErrors] = useState<ContactFormErrors>(EMPTY_ERRORS);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverError, setServerError] = useState<string | undefined>(undefined);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setData(prev => ({ ...prev, [name]: value }));
      // Clear the error for this field as the user types
      setErrors(prev => {
        if (prev[name as keyof ContactFormErrors]) {
          const next = { ...prev };
          delete next[name as keyof ContactFormErrors];
          return next;
        }
        return prev;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationErrors = validate(data);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setStatus('submitting');
      setServerError(undefined);

      try {
        /*
         * PHASE 2: Simulate submission delay.
         * PHASE 5: Replace with:
         *   const res = await fetch('/api/contact', {
         *     method: 'POST',
         *     headers: { 'Content-Type': 'application/json' },
         *     body: JSON.stringify(data),
         *   });
         *   if (!res.ok) throw new Error('Server error');
         */
        await new Promise<void>(resolve => setTimeout(resolve, 1200));
        setStatus('success');
      } catch {
        setStatus('error');
        setServerError(
          'Something went wrong sending your message. Please try again or email directly.'
        );
      }
    },
    [data]
  );

  const handleReset = useCallback(() => {
    setData(EMPTY_DATA);
    setErrors(EMPTY_ERRORS);
    setStatus('idle');
    setServerError(undefined);
  }, []);

  return {
    data,
    errors,
    status,
    serverError,
    handleChange,
    handleSubmit,
    handleReset,
  };
}
