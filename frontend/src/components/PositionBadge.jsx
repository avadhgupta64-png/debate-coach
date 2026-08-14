import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function PositionBadge({ position, size = 'sm' }) {
  const isFor = position === 'for';
  const padding = size === 'lg' ? '6px 16px' : '3px 10px';
  const fontSize = size === 'lg' ? '0.85rem' : '0.72rem';
  const iconSize = size === 'lg' ? 14 : 10;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding,
        borderRadius: 'var(--radius-full)',
        fontSize,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: isFor ? 'var(--color-success-dim)' : 'var(--color-danger-dim)',
        color: isFor ? 'var(--color-success)' : 'var(--color-danger)',
      }}
    >
      {isFor ? <ThumbsUp size={iconSize} /> : <ThumbsDown size={iconSize} />}
      {isFor ? 'For' : 'Against'}
    </span>
  );
}
