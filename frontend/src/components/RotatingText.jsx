import React, { useState, useEffect, useRef } from 'react';

const PHRASES = [
  'Build stronger arguments.',
  'Challenge your reasoning.',
  'Sharpen your rebuttals.',
  'Think faster under pressure.',
  'Become a better debater.',
];

// Timing constants (ms)
// Total cycle: TRANSITION_IN + HOLD + TRANSITION_OUT ≈ 2800ms per phrase (~2.5–3s)
const HOLD_DURATION = 1800;      // How long a phrase stays fully visible
const TRANSITION_DURATION = 600; // Fade + slide in/out duration (500–700ms range)

// Animation phases: entering → visible → leaving → (next) → ...
const STYLE_MAP = {
  entering: {
    opacity: 0,
    transform: 'translateY(10px)',
  },
  visible: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  leaving: {
    opacity: 0,
    transform: 'translateY(-8px)',
  },
};

export default function RotatingText({ style = {}, className = '' }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('entering'); // 'entering' | 'visible' | 'leaving'
  const timers = useRef([]);

  // Detect reduced-motion preference once on mount
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  // Store timer refs so we can clean up on unmount
  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  };

  useEffect(() => {
    let cancelled = false;

    const runCycle = () => {
      if (cancelled) return;

      // 1. Enter — phrase slides and fades in
      setPhase('entering');

      schedule(() => {
        if (cancelled) return;
        // 2. Visible — hold on screen
        setPhase('visible');

        schedule(() => {
          if (cancelled) return;
          // 3. Leave — phrase slides and fades out
          setPhase('leaving');

          schedule(() => {
            if (cancelled) return;
            // 4. Advance to next phrase, restart cycle
            setIndex((prev) => (prev + 1) % PHRASES.length);
            runCycle();
          }, TRANSITION_DURATION);
        }, HOLD_DURATION);
      }, TRANSITION_DURATION);
    };

    runCycle();

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []); // Run once on mount

  // Reduced-motion: simple opacity fade, no transform
  const currentStyle = prefersReducedMotion.current
    ? {
        opacity: phase === 'visible' ? 1 : 0,
        transform: 'none',
        transition: `opacity ${TRANSITION_DURATION}ms ease`,
      }
    : {
        ...STYLE_MAP[phase],
        transition: `opacity ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      };

  return (
    /*
     * Outer container reserves a stable vertical area so the surrounding
     * layout (logo, button) never shifts when phrases change length.
     * minHeight covers the tallest phrase at ~1rem font size on narrow screens.
     */
    <div
      aria-live="polite"
      aria-atomic="true"
      className={className}
      style={{
        minHeight: '3.2em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <span
        style={{
          display: 'block',
          color: 'var(--color-text-secondary)',
          fontSize: '1rem',
          lineHeight: 1.6,
          textAlign: 'center',
          willChange: 'opacity, transform',
          ...currentStyle,
        }}
      >
        {PHRASES[index]}
      </span>
    </div>
  );
}
