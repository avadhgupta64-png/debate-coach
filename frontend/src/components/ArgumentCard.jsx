import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Shield, AlertTriangle } from 'lucide-react';

const STRENGTH_CONFIG = {
  strong: { label: 'Strong', color: 'var(--color-success)', Icon: Zap },
  moderate: { label: 'Moderate', color: 'var(--color-warning)', Icon: Shield },
  weak: { label: 'Weak', color: 'var(--color-danger)', Icon: AlertTriangle },
};

export default function ArgumentCard({ argument, variant = 'argument', index }) {
  const [expanded, setExpanded] = useState(false);
  const strength = STRENGTH_CONFIG[argument.strength] || STRENGTH_CONFIG.moderate;
  const StrengthIcon = strength.Icon;

  const accentColor =
    variant === 'counter'
      ? 'var(--color-danger)'
      : variant === 'rebuttal'
      ? 'var(--color-accent)'
      : 'var(--color-primary)';

  return (
    <div
      className="card"
      style={{
        borderLeft: `3px solid ${accentColor}`,
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex-between" style={{ gap: 'var(--space-md)', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 6 }}>
            {index !== undefined && (
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: accentColor + '22',
                  color: accentColor,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>
            )}
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
              {argument.title}
            </h4>
          </div>
          <p
            style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {argument.explanation}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
          {argument.strength && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: strength.color + '18',
                color: strength.color,
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              <StrengthIcon size={10} />
              {strength.label}
            </div>
          )}
          {expanded ? <ChevronUp size={16} color="var(--color-text-muted)" /> : <ChevronDown size={16} color="var(--color-text-muted)" />}
        </div>
      </div>

      {expanded && (
        <div
          style={{
            marginTop: 'var(--space-md)',
            paddingTop: 'var(--space-md)',
            borderTop: '1px solid var(--color-border)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {argument.supporting && (
            <div
              style={{
                background: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: accentColor, fontWeight: 600 }}>Supporting: </span>
              {argument.supporting}
            </div>
          )}
          {argument.rebuttal && (
            <div
              style={{
                background: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 14px',
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: accentColor, fontWeight: 600 }}>Rebuttal: </span>
              {argument.rebuttal}
            </div>
          )}
          {argument.against && (
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
              Counters: <em>{argument.against}</em>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
