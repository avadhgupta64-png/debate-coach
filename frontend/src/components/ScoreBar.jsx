import React, { useEffect, useState } from 'react';

// Handles both 0-10 (legacy) and 0-100 scales automatically
export default function ScoreBar({ label, score, maxScore, color }) {
  // Auto-detect scale: if score > 10, treat as 0-100
  const detectedMax = maxScore || (score > 10 ? 100 : 10);
  const pct = Math.min(100, Math.max(0, (score / detectedMax) * 100));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  const getColor = () => {
    if (color) return color;
    // Normalize to 0-100 for colour comparison
    const normalised = detectedMax === 10 ? score * 10 : score;
    if (normalised >= 80) return 'var(--color-success)';
    if (normalised >= 60) return 'var(--color-primary)';
    if (normalised >= 40) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const displayScore = detectedMax === 100 ? Math.round(score) : (typeof score === 'number' ? score.toFixed(1) : score);

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <div className="flex-between" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          {label}
        </span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', minWidth: 52, textAlign: 'right' }}>
          {displayScore}
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>/{detectedMax}</span>
        </span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${width}%`, background: `linear-gradient(90deg, ${getColor()}, ${getColor()}aa)` }}
        />
      </div>
    </div>
  );
}
