import React from 'react';

export default function LoadingSpinner({ size = 'md', message }) {
  const cls = size === 'lg' ? 'spinner spinner-lg' : 'spinner';
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-md)',
        padding: 'var(--space-2xl)',
      }}
    >
      <div className={cls} role="status" aria-label="Loading" />
      {message && (
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          {message}
        </p>
      )}
    </div>
  );
}
