import React from 'react';

export const ResponsiveLayoutTest: React.FC = () => {
  return (
    <div className="flex-col gap-8">
      <div className="section-header">
        <span className="type-eyebrow">Layout 01 / Responsive Grid &amp; Containers</span>
        <h2 className="type-heading-2">Viewport Adaptations &amp; Vertical Rhythm</h2>
        <p className="type-body">
          Stress-testing 12-column, 3-column, and 2-column responsive behavior across Desktop (&gt;1024px), Tablet (768px–1024px), and Mobile (&lt;768px).
        </p>
      </div>

      {/* 1. 3-Column Grid Collapse Test */}
      <div className="surface-card">
        <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h3 className="type-heading-4">3-Column Grid (Desktop 3 &rarr; Tablet 2 &rarr; Mobile 1)</h3>
          <span className="type-code">.grid-3</span>
        </div>

        <div className="grid-3">
          {[1, 2, 3].map((col) => (
            <div
              key={col}
              style={{
                padding: 'var(--space-5)',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span className="type-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Column 0{col}</span>
              <h4 className="type-heading-4" style={{ marginBottom: 'var(--space-2)' }}>Structural Column</h4>
              <p className="type-body-sm">
                Adapts seamlessly without horizontal overflow. In mobile viewports, this stack shifts smoothly into a clean vertical rhythm.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Asymmetric 12-Column Grid (8 + 4 Editorial Layout) */}
      <div className="surface-card">
        <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h3 className="type-heading-4">Asymmetric 12-Column Split (8 cols + 4 cols)</h3>
          <span className="type-code">.grid-12</span>
        </div>

        <div className="grid-12">
          {/* Main Area: 8 columns on desktop */}
          <div
            style={{
              gridColumn: 'span 8',
              padding: 'var(--space-6)',
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span className="type-eyebrow">Main Editorial Span (8 Col)</span>
            <h4 className="type-heading-3" style={{ margin: 'var(--space-2) 0' }}>
              Primary Narrative Container
            </h4>
            <p className="type-body">
              Designed for technical documentation, architectural diagrams, and code displays. Provides spacious reading width while maintaining strict line-length bounds.
            </p>
          </div>

          {/* Sidebar Area: 4 columns on desktop */}
          <div
            style={{
              gridColumn: 'span 4',
              padding: 'var(--space-6)',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <span className="type-eyebrow" style={{ color: 'var(--color-accent-violet)' }}>Sidebar Span (4 Col)</span>
            <h4 className="type-heading-4" style={{ margin: 'var(--space-2) 0' }}>
              System Specs
            </h4>
            <ul className="type-body-sm" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li>&bull; <strong style={{ color: 'var(--color-text-primary)' }}>Breakpoints:</strong> 480 / 768 / 1024</li>
              <li>&bull; <strong style={{ color: 'var(--color-text-primary)' }}>Container:</strong> 1200px max</li>
              <li>&bull; <strong style={{ color: 'var(--color-text-primary)' }}>Overflow:</strong> Zero horizontal bleed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Auto-Fit Card Matrix */}
      <div className="surface-card">
        <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <h3 className="type-heading-4">Auto-Fit Responsive Grid</h3>
          <span className="type-code">minmax(260px, 1fr)</span>
        </div>

        <div className="grid-auto-fit">
          {['Content Module Alpha', 'Content Module Beta', 'Content Module Gamma', 'Content Module Delta'].map((title, idx) => (
            <div
              key={idx}
              className="surface-card"
              style={{
                padding: 'var(--space-4)',
                background: 'rgba(255,255,255,0.02)',
              }}
            >
              <div className="type-code" style={{ marginBottom: 'var(--space-2)' }}>MOD_0{idx + 1}</div>
              <h5 className="type-heading-4" style={{ fontSize: '1rem', marginBottom: 'var(--space-1)' }}>{title}</h5>
              <p className="type-body-sm" style={{ color: 'var(--color-text-muted)' }}>
                Fluid width wrapping cleanly based on available viewport real estate.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
