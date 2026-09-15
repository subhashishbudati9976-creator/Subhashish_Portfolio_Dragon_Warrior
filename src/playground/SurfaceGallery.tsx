import React from 'react';
import { Badge } from '../components/Badge';

export const SurfaceGallery: React.FC = () => {
  return (
    <div className="flex-col gap-8">
      <div className="section-header">
        <span className="type-eyebrow">Surfaces 01 / Depth &amp; Hierarchy</span>
        <h2 className="type-heading-2">Obsidian Surfaces &amp; Restrained Atmospheric Glow</h2>
        <p className="type-body">
          Solid-first layered depth. Glass is a reserved exception for navigation only. Surfaces are weighted, not airy.
        </p>
      </div>

      <div className="grid-2">
        {/* 1. Default Surface Card */}
        <div className="surface-card">
          <div className="flex-row gap-2" style={{ marginBottom: 'var(--space-4)', justifyContent: 'space-between' }}>
            <Badge variant="blue">SURFACE_RAISED</Badge>
            <span className="type-code">solid #111827</span>
          </div>
          <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-2)' }}>Structural Card</h3>
          <p className="type-body-sm" style={{ marginBottom: 'var(--space-4)' }}>
            Default surface for data cards, technical summaries, and modular containers. Sharp radius-sm, top-lit rim, 1px border.
          </p>
          <div
            style={{
              padding: 'var(--space-3)',
              background: 'var(--surface-inset)',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-hairline)',
            }}
          >
            <span className="type-code" style={{ fontSize: '12px' }}>
              background: var(--surface-raised) /* opaque */
            </span>
          </div>
        </div>

        {/* 2. Elevated Surface */}
        <div className="surface-elevated">
          <div className="flex-row gap-2" style={{ marginBottom: 'var(--space-4)', justifyContent: 'space-between' }}>
            <Badge variant="violet">SURFACE_ELEVATED</Badge>
            <span className="type-code">solid #182035</span>
          </div>
          <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-2)' }}>Elevated Container</h3>
          <p className="type-body-sm" style={{ marginBottom: 'var(--space-4)' }}>
            High-priority panels, modal dialogs, dropdowns. Higher z-depth. Deeper shadow footprint. Sharper rim.
          </p>
          <div
            style={{
              padding: 'var(--space-3)',
              background: 'var(--surface-inset)',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-hairline)',
            }}
          >
            <span className="type-code" style={{ fontSize: '12px' }}>
              background: var(--surface-elevated) /* opaque */
            </span>
          </div>
        </div>

        {/* 3. Inset Surface */}
        <div className="surface-card">
          <div className="flex-row gap-2" style={{ marginBottom: 'var(--space-4)', justifyContent: 'space-between' }}>
            <Badge variant="default">SURFACE_INSET</Badge>
            <span className="type-code">recessed field</span>
          </div>
          <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-2)' }}>Inset / Field Background</h3>
          <p className="type-body-sm" style={{ marginBottom: 'var(--space-4)' }}>
            Recessed interior: form fields, code blocks, embedded data readouts. Sunken inset shadow creates depth contrast.
          </p>
          <div className="surface-inset">
            <span className="type-code" style={{ fontSize: '12px' }}>
              background: var(--surface-inset) + inset shadow
            </span>
          </div>
        </div>

        {/* 4. Dragon Violet Glow — Reserved state */}
        <div className="surface-card surface-glow-violet">
          <div className="flex-row gap-2" style={{ marginBottom: 'var(--space-4)', justifyContent: 'space-between' }}>
            <Badge variant="violet">DRAGON_GLOW</Badge>
            <span className="type-code">reserved accent</span>
          </div>
          <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-2)' }}>Violet Power Glow</h3>
          <p className="type-body-sm" style={{ marginBottom: 'var(--space-4)' }}>
            Applied only to ONE featured item per context — highlighted metric or milestone container. Never as a repeating pattern.
          </p>
          <div
            style={{
              padding: 'var(--space-3)',
              background: 'var(--color-accent-violet-subtle)',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(139, 92, 246, 0.22)',
            }}
          >
            <span className="type-code" style={{ fontSize: '12px', color: 'var(--color-accent-violet)' }}>
              modifier: .surface-glow-violet
            </span>
          </div>
        </div>
      </div>

      {/* 5. Glass Surface — Navigation context demo */}
      <div className="surface-card surface-rule-top" style={{ padding: 'var(--space-8)' }}>
        <span className="type-eyebrow" style={{ marginBottom: 'var(--space-3)' }}>Reserved Exception</span>
        <h3 className="type-heading-3" style={{ marginBottom: 'var(--space-2)' }}>Glass Surface — Navigation Only</h3>
        <p className="type-body" style={{ marginBottom: 'var(--space-6)' }}>
          Glassmorphism is a reserved treatment for the floating navigation bar exclusively. It appears pill-shaped, centered, floating above the canvas.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <nav className="surface-glass" aria-label="Navigation specimen">
            <a className="nav-link type-nav active" href="#specimen-1" onClick={(e) => e.preventDefault()}>Specimen 01</a>
            <a className="nav-link type-nav" href="#specimen-2" onClick={(e) => e.preventDefault()}>Specimen 02</a>
            <a className="nav-link type-nav" href="#specimen-3" onClick={(e) => e.preventDefault()}>Specimen 03</a>
            <a className="nav-link type-nav" href="#specimen-4" onClick={(e) => e.preventDefault()}>Specimen 04</a>
          </nav>
        </div>
        <p className="type-body-sm" style={{ marginTop: 'var(--space-4)', textAlign: 'center', color: 'var(--color-text-faint)' }}>
          backdrop-filter: blur(16px) — pill shape — glass exclusive
        </p>
      </div>

      {/* 6. Accent Rule Demo */}
      <div className="surface-card" style={{ padding: 'var(--space-8)' }}>
        <span className="type-eyebrow" style={{ marginBottom: 'var(--space-3)' }}>Accent Lines</span>
        <h3 className="type-heading-3" style={{ marginBottom: 'var(--space-2)' }}>Horizontal Rule Accent</h3>
        <p className="type-body" style={{ marginBottom: 'var(--space-5)' }}>
          Blue-to-violet gradient rules used as section separators. Narrow, directional, not scattered.
        </p>
        <hr className="rule-accent" />
        <p className="type-body-sm" style={{ marginTop: 'var(--space-4)', color: 'var(--color-text-faint)' }}>
          .rule-accent — linear-gradient 90deg blue→violet
        </p>
      </div>
    </div>
  );
};
