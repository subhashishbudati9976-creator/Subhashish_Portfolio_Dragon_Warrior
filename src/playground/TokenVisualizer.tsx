import React from 'react';

interface ColorSwatch {
  name: string;
  token: string;
  value: string;
  textDark?: boolean;
  role: string;
}

export const TokenVisualizer: React.FC = () => {
  const backgroundSwatches: ColorSwatch[] = [
    { name: 'Canvas Base', token: '--color-bg-base', value: '#06070C', role: 'True obsidian — deepest void' },
    { name: 'Subtle Offset', token: '--color-bg-subtle', value: '#090D18', role: 'Directional depth — warm indigo shift' },
    { name: 'Secondary Layer', token: '--color-bg-secondary', value: '#0C1121', role: 'Structural section backing' },
    { name: 'Tertiary Layer', token: '--color-bg-tertiary', value: '#111827', role: 'Raised container — rich dark navy' },
    { name: 'Elevated', token: '--color-bg-elevated', value: '#182035', role: 'Highest z-level: dropdowns, modals' },
  ];

  const accentSwatches: ColorSwatch[] = [
    { name: 'Sky Blue (Atmospheric)', token: '--color-accent-blue', value: '#5BADEC', role: 'Primary CTA & atmospheric light' },
    { name: 'Blue Dim', token: '--color-accent-blue-dim', value: '#3A7DC4', role: 'Border, focused states' },
    { name: 'Blue Bright', token: '--color-accent-blue-hover', value: '#7EC8F8', role: 'Hover & luminance peak' },
    { name: 'Dragon Violet', token: '--color-accent-violet', value: '#8B5CF6', role: 'Single power accent — reserved' },
    { name: 'Violet Dim', token: '--color-accent-violet-dim', value: '#6D40C4', role: 'Deeper violet tonal variant' },
  ];

  const textSwatches: ColorSwatch[] = [
    { name: 'Primary Text', token: '--color-text-primary', value: '#EEF2F7', role: 'Headings — high contrast on obsidian' },
    { name: 'Secondary Text', token: '--color-text-secondary', value: '#C2CEDF', role: 'Body copy — cooler tone' },
    { name: 'Muted Text', token: '--color-text-muted', value: '#8898B0', role: 'Descriptions, timestamps, labels' },
    { name: 'Faint Text', token: '--color-text-faint', value: '#4F627D', role: 'Chrome: dividers, index numbers' },
  ];

  const statusSwatches: ColorSwatch[] = [
    { name: 'Success', token: '--color-success', value: '#22C55E', role: 'Live status, valid forms' },
    { name: 'Warning', token: '--color-warning', value: '#EAB308', role: 'Alerts, cautionary states' },
    { name: 'Error', token: '--color-error', value: '#F43F5E', role: 'Validation failures, destructive' },
  ];

  const spacingTokens = [
    { token: '--space-1', px: '4px', rem: '0.25rem' },
    { token: '--space-2', px: '8px', rem: '0.5rem' },
    { token: '--space-3', px: '12px', rem: '0.75rem' },
    { token: '--space-4', px: '16px', rem: '1rem' },
    { token: '--space-6', px: '24px', rem: '1.5rem' },
    { token: '--space-8', px: '32px', rem: '2rem' },
    { token: '--space-12', px: '48px', rem: '3rem' },
    { token: '--space-16', px: '64px', rem: '4rem' },
    { token: '--space-24', px: '96px', rem: '6rem' },
  ];

  const radiiTokens = [
    { token: '--radius-none', value: '0px' },
    { token: '--radius-xs', value: '2px   ← chips, code tags' },
    { token: '--radius-sm', value: '5px   ← cards, inputs (default)' },
    { token: '--radius-md', value: '8px   ← buttons, panels' },
    { token: '--radius-lg', value: '12px  ← section containers' },
    { token: '--radius-full', value: '9999px ← nav pill ONLY' },
  ];

  return (
    <div className="flex-col gap-8">
      {/* 1. Color Palette Inspector */}
      <div>
        <div className="section-header">
          <span className="type-eyebrow">Tokens 01 / Color Palette</span>
          <h2 className="type-heading-2">Curated Dark Cinematic Palette</h2>
          <p className="type-body">
            Obsidian backgrounds paired with atmospheric cool blue and restrained dragon violet accents. Zero generic saturation.
          </p>
        </div>

        <div className="flex-col gap-6">
          <div>
            <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-4)' }}>Background &amp; Surface Spectrum</h3>
            <div className="grid-4">
              {backgroundSwatches.map((item) => (
                <div key={item.token} className="surface-card" style={{ padding: 'var(--space-4)' }}>
                  <div
                    style={{
                      height: '72px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `var(${item.token})`,
                      border: '1px solid var(--border-default)',
                      marginBottom: 'var(--space-3)',
                    }}
                  />
                  <div className="type-body" style={{ fontWeight: 600 }}>{item.name}</div>
                  <div className="type-code" style={{ marginTop: 'var(--space-1)', display: 'inline-block' }}>{item.value}</div>
                  <p className="type-body-sm" style={{ marginTop: 'var(--space-2)' }}>{item.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-4)' }}>Atmospheric &amp; Dragon Accents</h3>
            <div className="grid-4">
              {accentSwatches.map((item) => (
                <div key={item.token} className="surface-card" style={{ padding: 'var(--space-4)' }}>
                  <div
                    style={{
                      height: '72px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `var(${item.token})`,
                      boxShadow: `0 4px 20px -2px ${item.value}40`,
                      marginBottom: 'var(--space-3)',
                    }}
                  />
                  <div className="type-body" style={{ fontWeight: 600 }}>{item.name}</div>
                  <div className="type-code" style={{ marginTop: 'var(--space-1)', display: 'inline-block' }}>{item.value}</div>
                  <p className="type-body-sm" style={{ marginTop: 'var(--space-2)' }}>{item.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-4)' }}>Typography Contrast Spectrum</h3>
            <div className="grid-4">
              {textSwatches.map((item) => (
                <div key={item.token} className="surface-card" style={{ padding: 'var(--space-4)' }}>
                  <div
                    style={{
                      height: '72px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `var(${item.token})`,
                      marginBottom: 'var(--space-3)',
                    }}
                  />
                  <div className="type-body" style={{ fontWeight: 600 }}>{item.name}</div>
                  <div className="type-code" style={{ marginTop: 'var(--space-1)', display: 'inline-block' }}>{item.value}</div>
                  <p className="type-body-sm" style={{ marginTop: 'var(--space-2)' }}>{item.role}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-4)' }}>Status / Functional Accents</h3>
            <div className="grid-3">
              {statusSwatches.map((item) => (
                <div key={item.token} className="surface-card" style={{ padding: 'var(--space-4)' }}>
                  <div
                    style={{
                      height: '48px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: `var(${item.token})`,
                      marginBottom: 'var(--space-3)',
                    }}
                  />
                  <div className="type-body" style={{ fontWeight: 600 }}>{item.name}</div>
                  <div className="type-code" style={{ marginTop: 'var(--space-1)', display: 'inline-block' }}>{item.value}</div>
                  <p className="type-body-sm" style={{ marginTop: 'var(--space-2)' }}>{item.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* 2. Typography Scale Inspector */}
      <div>
        <div className="section-header">
          <span className="type-eyebrow">Tokens 02 / Typography Hierarchy</span>
          <h2 className="type-heading-2">Editorial Scale &amp; Font Families</h2>
          <p className="type-body">
            Syne for impactful editorial display, Plus Jakarta Sans for UI legibility, JetBrains Mono for system metrics.
          </p>
        </div>

        <div className="surface-card flex-col gap-6" style={{ padding: 'var(--space-8)' }}>
          <div>
            <div className="type-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Display Hero Title (Syne 800)</div>
            <div className="type-display">Dragon Warrior Editorial</div>
          </div>

          <hr className="divider" style={{ margin: 0 }} />

          <div>
            <div className="type-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Heading 1 (Syne 700 / 36px)</div>
            <h1 className="type-heading-1">Editorial Typography &amp; Scale Specimen</h1>
          </div>

          <div>
            <div className="type-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Heading 2 (Syne 700 / 30px)</div>
            <h2 className="type-heading-2">Structured Foundation Built For High Contrast</h2>
          </div>

          <div>
            <div className="type-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Heading 3 (Plus Jakarta Sans 600 / 24px)</div>
            <h3 className="type-heading-3">Architectural Layouts &amp; System Primitives</h3>
          </div>

          <div>
            <div className="type-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Heading 4 (Plus Jakarta Sans 600 / 20px)</div>
            <h4 className="type-heading-4">Modular Component Tokens &amp; Surface Depths</h4>
          </div>

          <hr className="divider" style={{ margin: 0 }} />

          <div>
            <div className="type-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Body Large (Plus Jakarta Sans 400 / 18px)</div>
            <p className="type-body-lg">
              A foundational typography specimen demonstrating high typographic contrast, balanced editorial rhythm, and accessible line measure across all viewports.
            </p>
          </div>

          <div>
            <div className="type-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Body Base (Plus Jakarta Sans 400 / 16px)</div>
            <p className="type-body">
              Every interface token is calibrated for accessibility, sharp contrast ratios exceeding WCAG AAA guidelines on dark backings, and seamless responsive scaling across desktop, tablet, and mobile displays.
            </p>
          </div>

          <div>
            <div className="type-eyebrow" style={{ marginBottom: 'var(--space-2)' }}>Eyebrow &amp; Monospace (JetBrains Mono 600)</div>
            <div className="flex-row gap-4" style={{ alignItems: 'center' }}>
              <span className="type-eyebrow">PHASE_01_INITIALIZED</span>
              <span className="type-code">TOKEN_PRESET_OBSIDIAN_v1</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* 3. Spacing & Radii Inspector */}
      <div>
        <div className="section-header">
          <span className="type-eyebrow">Tokens 03 / Spacing &amp; Geometry</span>
          <h2 className="type-heading-2">Modular Rhythm &amp; Edge Curvature</h2>
          <p className="type-body">
            Consistent 4px/8px mathematical base increments ensuring predictable rhythm and layout stability.
          </p>
        </div>

        <div className="grid-2">
          {/* Spacing Bars */}
          <div className="surface-card">
            <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-4)' }}>Spacing Scale</h3>
            <div className="flex-col gap-3">
              {spacingTokens.map((item) => (
                <div key={item.token} className="flex-row gap-4" style={{ alignItems: 'center' }}>
                  <span className="type-code" style={{ width: '110px' }}>{item.token}</span>
                  <div
                    style={{
                      height: '18px',
                      width: item.px,
                      backgroundColor: 'var(--color-accent-blue)',
                      borderRadius: 'var(--radius-xs)',
                      opacity: 0.85,
                      minWidth: '4px',
                    }}
                  />
                  <span className="type-body-sm" style={{ color: 'var(--color-text-muted)' }}>{item.px} ({item.rem})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Corner Radii */}
          <div className="surface-card">
            <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-4)' }}>Corner Radii (Sharp Editorial vs Soft Glass)</h3>
            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
              {radiiTokens.map((item) => (
                <div
                  key={item.token}
                  style={{
                    height: '64px',
                    background: 'var(--surface-interactive-hover)',
                    border: '1px solid var(--border-hover)',
                    borderRadius: `var(${item.token})`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                  }}
                >
                  <span className="type-code" style={{ fontSize: '11px' }}>{item.token}</span>
                  <span className="type-body-sm" style={{ color: 'var(--color-accent-blue)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
