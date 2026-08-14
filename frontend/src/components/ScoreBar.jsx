import React, { useEffect, useState } from 'react';

export default function ScoreBar({ label, score, maxScore = 10, color }) {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, Math.max(0, (score / maxScore) * 100));

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  const getColor = () => {
    if (color) return color;
    if (score >= 8) return 'var(--color-success)';
    if (score >= 6) return 'var(--color-primary)';
    if (score >= 4) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <div
        className="flex-between"
        style={{ marginBottom: 8 }}
      >
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--color-text-secondary)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            minWidth: 36,
            textAlign: 'right',
          }}
        >
          {score}
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>
            /{maxScore}
          </span>
        </span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${getColor()}, ${getColor()}aa)`,
          }}
        />
      </div>
    </div>
  );
}
