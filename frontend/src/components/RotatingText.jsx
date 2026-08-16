import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_PHRASES = [
  'Build stronger arguments.',
  'Challenge your reasoning.',
  'Sharpen your rebuttals.',
  'Think faster under pressure.',
  'Become a better debater.',
];

// Default timing (ms) — total cycle ~3s per phrase
const DEFAULT_HOLD = 1800;       // How long a phrase stays fully visible
const DEFAULT_TRANSITION = 600;  // Fade + slide in/out duration

// Animation phases: entering → visible → leaving → (next) → ...
const STYLE_MAP = {
  entering: { opacity: 0, transform: 'translateY(10px)' },
  visible:  { opacity: 1, transform: 'translateY(0)'    },
  leaving:  { opacity: 0, transform: 'translateY(-8px)' },
};

/**
 * RotatingText
 *
 * Displays one phrase at a time in a smooth cinematic fade+slide loop.
 *
 * Props:
 *   phrases          — array of strings to rotate (defaults to tagline phrases)
 *   holdDuration     — ms each phrase stays fully visible (default 1800)
 *   transitionDuration — ms for each fade+slide transition (default 600)
 *   textStyle        — extra style applied to the inner <span>
 *   minHeight        — override the container's minHeight (default '3.2em')
 *   style            — extra style applied to the outer container
 *   className        — extra class applied to the outer container
 */
export default function RotatingText({
  phrases = DEFAULT_PHRASES,
  holdDuration = DEFAULT_HOLD,
  transitionDuration = DEFAULT_TRANSITION,
  textStyle = {},
  minHeight = '3.2em',
  style = {},
  className = '',
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState('entering'); // 'entering' | 'visible' | 'leaving'
  const timers = useRef([]);

  // Detect reduced-motion preference once on mount
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  // Store timer IDs so we can clear them all on unmount
  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  };

  useEffect(() => {
    let cancelled = false;

    const runCycle = () => {
      if (cancelled) return;

      // 1. Entering — phrase slides and fades in
      setPhase('entering');

      schedule(() => {
        if (cancelled) return;
        // 2. Visible — hold on screen
        setPhase('visible');

        schedule(() => {
          if (cancelled) return;
          // 3. Leaving — phrase slides and fades out
          setPhase('leaving');

          schedule(() => {
            if (cancelled) return;
            // 4. Advance to next phrase, restart cycle
            setIndex((prev) => (prev + 1) % phrases.length);
            runCycle();
          }, transitionDuration);
        }, holdDuration);
      }, transitionDuration);
    };

    runCycle();

    return () => {
      cancelled = true;
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // Re-run if the phrase list or timing changes (covers different instances)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrases, holdDuration, transitionDuration]);

  // Reduced-motion: opacity-only, no transform
  const easing = `cubic-bezier(0.4, 0, 0.2, 1)`;
  const currentStyle = prefersReducedMotion.current
    ? {
        opacity: phase === 'visible' ? 1 : 0,
        transform: 'none',
        transition: `opacity ${transitionDuration}ms ease`,
      }
    : {
        ...STYLE_MAP[phase],
        transition: `opacity ${transitionDuration}ms ${easing}, transform ${transitionDuration}ms ${easing}`,
      };

  return (
    /*
     * Outer container reserves stable vertical space so surrounding layout
     * (e.g. the Google login button) never shifts when phrase length changes.
     */
    <div
      aria-live="polite"
      aria-atomic="true"
      className={className}
      style={{
        minHeight,
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
          ...textStyle,
        }}
      >
        {phrases[index]}
      </span>
    </div>
  );
}
