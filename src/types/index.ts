/**
 * SHARED TYPES — Phase 2 Core Portfolio
 * Centralised interfaces used across sections and components.
 */

/* ==========================================================================
   Project
   ========================================================================== */

export type ProjectType = 'academic' | 'team';

export interface ProjectLink {
  label: string;
  href: string | null; // null = placeholder / not yet verified
}

export interface ProjectData {
  id: string;
  year: string;
  type: ProjectType;
  title: string;
  summary: string;
  context: string;
  contributions: string[];
  technologies: string[];
  github: ProjectLink;
  live: ProjectLink;
  featured?: boolean;
}

/* ==========================================================================
   Skills
   ========================================================================== */

export interface SkillItem {
  label: string;
  note?: string; // optional context e.g. "primary language"
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: SkillItem[];
}

/* ==========================================================================
   Experience
   ========================================================================== */

export interface ExperienceItem {
  id: string;
  role: string;
  organisation: string;
  timeline: string;
  type: string; // "Internship" | "Academic" | "Education"
  bullets: string[];
}

/* ==========================================================================
   Contact Form
   ========================================================================== */

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface ContactFormState {
  data: ContactFormData;
  errors: ContactFormErrors;
  status: FormStatus;
  serverError?: string;
}
