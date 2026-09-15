import React from 'react';
import StaggeredText from '../components/effects/StaggeredText';
import { ProjectCard } from '../components/ProjectCard';
import type { ProjectData } from '../types';

const PROJECTS: ProjectData[] = [
  {
    id: 'ai-chatbot',
    year: '2026',
    type: 'academic',
    title: 'Deployment of an AI-Driven Chatbot as a Virtual Assistant Using DevOps',
    summary:
      'An AI-driven virtual assistant engineered as an academic DevOps project. Integrates Google Gemini for natural-language conversational processing and features containerized architecture with reproducible CI/CD delivery pipelines.',
    context:
      'Engineered with a focus on deployment reliability, containerization discipline, environment configuration management, and systematic API error handling.',
    contributions: [
      'Integrated Google Gemini LLM API with optimized prompts and conversational context retention.',
      'Containerized the entire application stack using Docker and Docker Compose for consistent multi-environment execution.',
      'Designed automated CI/CD workflows for automated build checks and lint verification.',
      'Diagnosed and resolved streaming response edge cases, environment variable isolation, and container health checks.',
      'Documented complete architectural blueprints and deployment runbooks.',
    ],
    technologies: ['Python', 'Google Gemini', 'Docker', 'Docker Compose', 'CI/CD', 'API Integration'],
    github: {
      label: 'GitHub',
      href: 'https://github.com/subhashishbudati9976-creator/AI-Driven-Chatbot-as-a-Virtual-Assistant',
    },
    live: { label: 'Live Demo', href: null },
    featured: true,
  },
  {
    id: 'railway',
    year: '2026',
    type: 'team',
    title: 'Railway Reservation System',
    summary:
      'A full-stack railway reservation and passenger management system featuring search algorithms, seat allocation, booking lifecycle management, fare calculation, and administration workflows.',
    context:
      'Built as an academic team project emphasizing robust relational schema design, transactional integrity, and clean interface workflows.',
    contributions: [
      'Engineered relational database models and queries supporting train schedules and seat availability.',
      'Implemented front-end booking interfaces with input validation and state management.',
      'Collaborated on system architecture and end-to-end user reservation journeys.',
    ],
    technologies: ['HTML', 'CSS', 'SQL', 'SQLite', 'Full-Stack Web'],
    github: {
      label: 'GitHub',
      href: 'https://github.com/subhashishbudati9976-creator/RailReserve-Railway-Reservation-System',
    },
    live: { label: 'Live Demo', href: null },
    featured: false,
  },
  {
    id: 'oda-cms',
    year: '2026',
    type: 'team',
    title: 'Orbital Debris Avoidance Constellation Management System (ODA-CMS)',
    summary:
      'A high-complexity platform for simulated satellite constellation tracking, orbital propagation, conjunction threat detection, and automated avoidance decision analytics.',
    context:
      'Academic collaborative systems project combining 3D orbital mechanics visualization, spatial threat calculation, and mission operations analytics.',
    contributions: [
      'Contributed to data flow workflows and constellation telemetry representation.',
      'Worked on interface layout and data-presentation clarity for mission alerts.',
    ],
    technologies: ['Full-Stack', 'Orbital Mechanics', '3D Visualisation', 'Data Analytics'],
    github: { label: 'GitHub', href: null },
    live: { label: 'Live Demo', href: null },
    featured: false,
  },
];

export const ProjectsSection: React.FC = () => {
  return (
    <div className="stage-4-layout page-container">
      {/* Chapter Marker */}
      <div className="stage-chapter-marker motion-reveal" data-motion-reveal="fade-up">
        <span className="stage-chapter-num">04 // STAGE</span>
        <span className="stage-chapter-title">Dragon Manifestation &bull; Selected Engineering &amp; Climax</span>
      </div>

      {/* Section header with slow, premium staggered reveal */}
      <div className="stage-4-header motion-reveal" data-motion-reveal="fade-up">
        <div className="section-label">
          <span className="type-eyebrow">Selected Work</span>
        </div>
        <h2 className="section-title">
          <StaggeredText
            text="Things I've Built"
            delay={85}
            duration={900}
          />
        </h2>
        <p
          className="type-body"
          style={{ maxWidth: '600px', color: 'var(--color-text-muted)' }}
        >
          Practical projects spanning conversational AI, multi-container DevOps deployment,
          and relational systems engineering.
        </p>
      </div>

      {/* Project cards — organized in lower/left negative space, keeping the dragon's head and wings unobstructed */}
      <div className="stage-4-projects-grid">
        {PROJECTS.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};
