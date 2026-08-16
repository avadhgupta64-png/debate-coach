import React, { useEffect, useState } from 'react';

/**
 * ScoreBar
 *
 * Displays a single score as an animated progress bar.
 * All scores are expected on a 0-10 scale after upstream normalisation.
 * If a raw 0-100 value is passed (e.g. from legacy history), it is safely
 * converted by dividing by 10 so it can never display as "62/10".
 */
export default function ScoreBar({ label, score, color }) {
  // Normalise: if score > 10 it is still on the 0-100 scale → convert to 0-10
  const normalisedScore = typeof score === 'number' && score > 10 ? score / 10 : (score ?? 0);
  const pct = Math.min(100, Math.max(0, (normalisedScore / 10) * 100));
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  const getColor = () => {
    if (color) return color;
    const pct100 = normalisedScore * 10; // normalise to 0-100 for colour threshold
    if (pct100 >= 80) return 'var(--color-success)';
    if (pct100 >= 60) return 'var(--color-primary)';
    if (pct100 >= 40) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const displayScore = typeof normalisedScore === 'number' ? normalisedScore.toFixed(1) : normalisedScore;

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <div className="flex-between" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>
          {label}
        </span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', minWidth: 52, textAlign: 'right' }}>
          {displayScore}
          <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>/10</span>
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
