import React from 'react';
import { CinematicSplitText } from '../components/CinematicSplitText';

interface Campaign {
  id: string;
  label: string;
  year: string;
  title: string;
  subtitle?: string;
  summary: string;
  classifications: string[];
  href: string | null;
}

const PROJECTS: Record<'chatbot' | 'oda' | 'rail', Campaign> = {
  chatbot: {
    id: '01',
    label: 'PRIMARY CAMPAIGN',
    year: '2026',
    title: 'AI-DRIVEN CHATBOT',
    subtitle: 'AS A VIRTUAL ASSISTANT',
    summary:
      'An AI-powered virtual assistant focused on conversational interaction and Google Gemini integration, developed with attention to user interaction, backend communication, conversation/session handling, deployment configuration, and engineering/debugging.',
    classifications: ['AI APPLICATIONS', 'GEMINI INTEGRATION', 'DEPLOYMENT', 'CONTAINERIZATION', 'CI/CD'],
    href: 'https://github.com/subhashishbudati9976-creator/AI-Driven-Chatbot-as-a-Virtual-Assistant',
  },
  oda: {
    id: '02',
    label: 'ORBITAL COMMAND',
    year: '2026',
    title: 'ODA-CMS',
    subtitle: 'ORBITAL DEBRIS AVOIDANCE CONSTELLATION MANAGEMENT SYSTEM',
    summary:
      'A full-stack platform for simulated satellite constellation monitoring, conjunction-threat analysis, avoidance decisions, and mission analytics.',
    classifications: ['3D ORBITAL VISUALIZATION', 'ORBIT PROPAGATION', 'CONJUNCTION THREAT DETECTION', 'ALERTS', 'MISSION ANALYTICS'],
    href: null,
  },
  rail: {
    id: '03',
    label: 'RAIL RESERVE',
    year: '2026',
    title: 'RAILWAY RESERVATION SYSTEM',
    summary:
      'A web-based railway reservation and management system covering train search, passenger management, booking, cancellation, schedules, payments, and administration.',
    classifications: ['TRAIN SEARCH', 'BOOKING', 'CANCELLATION', 'PASSENGER MANAGEMENT', 'RELATIONAL DATA'],
    href: 'https://github.com/subhashishbudati9976-creator/RailReserve-Railway-Reservation-System',
  },
};

const ProjectLink: React.FC<{ project: Campaign }> = ({ project }) => (
  project.href ? (
    <a className="campaign-link" href={project.href} target="_blank" rel="noopener noreferrer">
      <span>VIEW PROJECT</span>
      <span aria-hidden="true">↗</span>
    </a>
  ) : (
    <span className="campaign-link campaign-link-disabled" aria-disabled="true" title="Repository link not available">
      <span>VIEW PROJECT</span>
      <span aria-hidden="true">↗</span>
    </span>
  )
);

const ProjectVisual: React.FC<{ projectId: string; label: string }> = ({ projectId, label }) => (
  <div className={`campaign-visual campaign-visual-${projectId}`} aria-label={`${label} dossier frame`}>
    <span className="campaign-visual-corner campaign-visual-corner-top" aria-hidden="true" />
    <span className="campaign-visual-corner campaign-visual-corner-bottom" aria-hidden="true" />
    <span className="campaign-visual-line" aria-hidden="true" />
    <span className="campaign-visual-label">MISSION DOSSIER // {label}</span>
    <span className="campaign-visual-code">{projectId === '01' ? 'AI / GEMINI / CI-CD' : projectId === '02' ? 'ORBIT / ALERT / ANALYTICS' : 'RAIL / BOOK / DATA'}</span>
  </div>
);

const CampaignMeta: React.FC<{ project: Campaign }> = ({ project }) => (
  <div className="campaign-meta-line">
    <span><b>{project.id}</b> / {project.label}</span>
    <span>{project.year}</span>
  </div>
);

const ClassificationList: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="campaign-classifications" aria-label="Project classifications">
    {items.map(item => <li key={item}>{item}</li>)}
  </ul>
);

export const ProjectsSection: React.FC = () => {
  return (
    <div className="stage-4-layout page-container">
      <div className="stage-chapter-marker motion-reveal campaigns-chapter" data-motion-reveal="fade-up">
        <span className="stage-chapter-num"><CinematicSplitText lines={['CHAPTER 03']} splitType="words" /></span>
      </div>

      <div className="campaigns-intro motion-reveal" data-motion-reveal="fade-up">
        <p className="campaigns-kicker"><CinematicSplitText lines={['THE CAMPAIGNS']} splitType="words" /></p>
        <h2 className="section-title campaigns-title">
          <CinematicSplitText lines={['THINGS I HAVE BUILT.']} splitType="words" />
        </h2>
        <p className="campaigns-supporting">From AI-powered applications to systems built for real-world problems.</p>
      </div>

      <div className="campaigns-list">
        <article className="campaign campaign-primary motion-reveal" data-motion-reveal="fade-up">
          <CampaignMeta project={PROJECTS.chatbot} />
          <div className="campaign-primary-heading">
            <h3><CinematicSplitText lines={['AI-DRIVEN CHATBOT']} splitType="words" /></h3>
            <h4><CinematicSplitText lines={['AS A VIRTUAL ASSISTANT']} splitType="words" /></h4>
          </div>
          <ProjectVisual projectId={PROJECTS.chatbot.id} label="PRIMARY CAMPAIGN" />
          <div className="campaign-primary-footer">
            <ClassificationList items={PROJECTS.chatbot.classifications} />
            <div className="campaign-copy-block">
              <p>{PROJECTS.chatbot.summary}</p>
              <ProjectLink project={PROJECTS.chatbot} />
            </div>
          </div>
        </article>

        <article className="campaign campaign-secondary campaign-oda motion-reveal" data-motion-reveal="fade-up">
          <div className="campaign-secondary-copy">
            <CampaignMeta project={PROJECTS.oda} />
            <h3><CinematicSplitText lines={['ODA-CMS']} splitType="words" /></h3>
            <p>{PROJECTS.oda.summary}</p>
            <ClassificationList items={PROJECTS.oda.classifications} />
            <ProjectLink project={PROJECTS.oda} />
          </div>
          <ProjectVisual projectId={PROJECTS.oda.id} label="ORBITAL COMMAND" />
        </article>

        <article className="campaign campaign-secondary campaign-rail motion-reveal" data-motion-reveal="fade-up">
          <ProjectVisual projectId={PROJECTS.rail.id} label="RAIL RESERVE" />
          <div className="campaign-secondary-copy">
            <CampaignMeta project={PROJECTS.rail} />
            <h3><CinematicSplitText lines={['RAILWAY RESERVATION SYSTEM']} splitType="words" /></h3>
            <p>{PROJECTS.rail.summary}</p>
            <ClassificationList items={PROJECTS.rail.classifications} />
            <ProjectLink project={PROJECTS.rail} />
          </div>
        </article>
      </div>

      <div className="campaigns-transition motion-reveal" data-motion-reveal="fade-up">
        <span className="campaigns-transition-line" aria-hidden="true" />
        <span>03 / CAMPAIGNS COMPLETE</span>
        <span>NEXT // EXPERIENCE</span>
      </div>
    </div>
  );
};
