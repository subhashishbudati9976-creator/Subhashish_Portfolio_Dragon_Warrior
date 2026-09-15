import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Badge } from '../components/Badge';

export const InteractiveShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [activeNav, setActiveNav] = useState('overview');

  const handleTestValidate = () => {
    if (!inputValue.trim()) {
      setInputError('Input field cannot be left blank for validation.');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="flex-col gap-8">
      <div className="section-header">
        <span className="type-eyebrow">Primitives 01 / Interactive Elements</span>
        <h2 className="type-heading-2">Buttons, Forms &amp; Tactile States</h2>
        <p className="type-body">
          Tactile micro-animations, accessible keyboard focus rings, and explicit state validation without unnecessary external dependencies.
        </p>
      </div>

      {/* 1. Button Matrix */}
      <div className="surface-card">
        <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-4)' }}>Button Hierarchy &amp; Variants</h3>
        <div className="flex-col gap-5">
          <div className="flex-wrap" style={{ alignItems: 'center' }}>
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary Option</Button>
            <Button variant="accent">Dragon Accent</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="primary" disabled>Disabled State</Button>
          </div>

          <div className="flex-wrap" style={{ alignItems: 'center' }}>
            <Button variant="primary" size="sm">Small Action</Button>
            <Button variant="primary" size="md">Default Medium</Button>
            <Button variant="primary" size="lg">Large Hero CTA</Button>
          </div>
        </div>
      </div>

      {/* 2. Text Links */}
      <div className="surface-card">
        <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-4)' }}>Text Links &amp; Inline Navigation</h3>
        <div className="flex-wrap" style={{ alignItems: 'center', gap: 'var(--space-8)' }}>
          <a href="#link-demo" className="text-link" onClick={(e) => e.preventDefault()}>
            Standard Text Link &rarr;
          </a>
          <a href="#link-demo2" className="text-link" style={{ color: 'var(--color-accent-violet)' }} onClick={(e) => e.preventDefault()}>
            Dragon Accent Anchor &rarr;
          </a>
          <span className="type-body-sm">
            Inline text link demonstration showing <a href="#test" className="text-link" onClick={(e) => e.preventDefault()}>animated underline hover effect</a> inside standard body copy.
          </span>
        </div>
      </div>

      {/* 3. Form Controls & Validation */}
      <div className="surface-card">
        <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-4)' }}>Form Inputs &amp; Field Validation</h3>
        <div className="grid-2">
          <div className="flex-col gap-4">
            <Input
              label="Standard Text Input"
              placeholder="e.g. Enter a sample string..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (inputError) setInputError('');
              }}
              helperText="Helper text providing field guidance."
              error={inputError}
              required
            />

            <div className="flex-row gap-3">
              <Button variant="secondary" size="sm" onClick={handleTestValidate}>
                Trigger Validation Error
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setInputValue(''); setInputError(''); }}>
                Reset Field
              </Button>
            </div>
          </div>

          <div className="flex-col gap-4">
            <Textarea
              label="Multiline Message Area"
              placeholder="Enter neutral sample feedback or questions..."
              helperText="Supports vertical resizing with accessible outline on focus."
            />
          </div>
        </div>
      </div>

      {/* 4. Navigation Primitives & Badges */}
      <div className="surface-card">
        <h3 className="type-heading-4" style={{ marginBottom: 'var(--space-4)' }}>Pill Navigation &amp; Status Badges</h3>
        <div className="flex-col gap-6">
          <div>
            <span className="type-body-sm" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
              Floating Glass Navigation Bar
            </span>
            <nav className="nav-bar" style={{ display: 'inline-flex' }} aria-label="Playground Demonstration Navigation">
              {['overview', 'components', 'tokens', 'accessibility'].map((tab) => (
                <button
                  key={tab}
                  className={`nav-link ${activeNav === tab ? 'active' : ''}`}
                  onClick={() => setActiveNav(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <span className="type-body-sm" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
              System Status Badges
            </span>
            <div className="flex-wrap" style={{ alignItems: 'center' }}>
              <Badge variant="blue">SYSTEM_READY</Badge>
              <Badge variant="violet">DRAGON_WARRIOR</Badge>
              <Badge variant="success">ACCESSIBLE_AAA</Badge>
              <Badge variant="default">PHASE_1_FOUNDATION</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
