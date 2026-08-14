import React from 'react';
import { BookOpen, AlertTriangle } from 'lucide-react';

export default function EvidenceCard({ evidence }) {
  return (
    <div
      className="card"
      style={{ borderTop: '2px solid var(--color-gold)', background: 'var(--color-surface)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
        <BookOpen size={16} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: 2 }} />
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
          {evidence.title}
        </h4>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-sm)' }}>
        {evidence.content}
      </p>
      {evidence.label && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            background: 'var(--color-gold-dim)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--color-gold)',
            fontWeight: 600,
          }}
        >
          <AlertTriangle size={12} />
          {evidence.label}
        </div>
      )}
    </div>
  );
}
