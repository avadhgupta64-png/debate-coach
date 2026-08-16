import React, { useEffect, useState, useRef } from 'react';
import { Target } from 'lucide-react';

/*
 * SplashScreen
 *
 * Full-screen cinematic splash shown once per session.
 * Calls onDone() after the animation completes so the parent can
 * unmount it or mark the splash as seen.
 *
 * Timing (normal motion):
 *   0 ms        — mount, elements invisible
 *   50 ms       — trigger enter transition (slight delay ensures paint)
 *   50+600 ms   — fully visible
 *   50+600+1200 — start exit transition
 *   50+600+1200+600 — exit complete → onDone()
 *   Total ≈ 2450 ms  (within 2.2–2.5s target)
 *
 * Reduced motion:
 *   No transforms, instant opacity toggle, total ≈ 800 ms.
 */

const ENTER_DELAY   = 50;
const ENTER_DUR     = 600;
const HOLD_DUR      = 1200;
const EXIT_DUR      = 600;

const ENTER_DELAY_REDUCED = 50;
const HOLD_DUR_REDUCED    = 600;
const EXIT_DUR_REDUCED    = 150;

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('hidden'); // hidden → visible → exiting
  const timers = useRef([]);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  const rm = prefersReducedMotion.current;
  const enterDelay = rm ? ENTER_DELAY_REDUCED : ENTER_DELAY;
  const enterDur   = rm ? 0   : ENTER_DUR;
  const holdDur    = rm ? HOLD_DUR_REDUCED : HOLD_DUR;
  const exitDur    = rm ? EXIT_DUR_REDUCED : EXIT_DUR;

  const schedule = (fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => {
    schedule(() => {
      setPhase('visible');
      schedule(() => {
        setPhase('exiting');
        schedule(() => {
          onDone?.();
        }, exitDur);
      }, enterDur + holdDur);
    }, enterDelay);

    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived styles ────────────────────────────────────────────────
  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

  // Overlay opacity
  const overlayOpacity = phase === 'visible' ? 1 : 0;
  const overlayTransition = rm
    ? `opacity ${exitDur}ms ease`
    : `opacity ${phase === 'hidden' ? enterDur : exitDur}ms ${easing}`;

  // Content elements: staggered slide-up on enter, slide-up on exit
  const contentVisible = phase === 'visible';

  const logoStyle = rm
    ? { opacity: contentVisible ? 1 : 0, transition: `opacity ${rm ? 200 : enterDur}ms ease` }
    : {
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible ? 'scale(1) translateY(0)' : phase === 'hidden' ? 'scale(0.8) translateY(20px)' : 'scale(1.05) translateY(-10px)',
        transition: `opacity ${enterDur}ms ${easing}, transform ${enterDur}ms ${easing}`,
        transitionDelay: phase === 'hidden' ? '0ms' : '0ms',
      };

  const titleStyle = rm
    ? { opacity: contentVisible ? 1 : 0, transition: `opacity ${rm ? 200 : enterDur}ms ease` }
    : {
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible ? 'translateY(0)' : phase === 'hidden' ? 'translateY(16px)' : 'translateY(-10px)',
        transition: `opacity ${enterDur}ms ${easing}, transform ${enterDur}ms ${easing}`,
        transitionDelay: contentVisible ? '80ms' : '0ms',
      };

  const taglineStyle = rm
    ? { opacity: contentVisible ? 1 : 0, transition: `opacity ${rm ? 200 : enterDur}ms ease` }
    : {
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible ? 'translateY(0)' : phase === 'hidden' ? 'translateY(16px)' : 'translateY(-10px)',
        transition: `opacity ${enterDur}ms ${easing}, transform ${enterDur}ms ${easing}`,
        transitionDelay: contentVisible ? '160ms' : '0ms',
      };

  return (
    <>
      {/* Inject keyframes for the ambient glow pulse */}
      <style>{`
        @keyframes splashGlow {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50%       { opacity: 0.28; transform: scale(1.08); }
        }
        @keyframes splashGlow2 {
          0%, 100% { opacity: 0.10; transform: scale(1); }
          50%       { opacity: 0.20; transform: scale(1.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes splashGlow  { 0%, 100% { opacity: 0.18; } }
          @keyframes splashGlow2 { 0%, 100% { opacity: 0.10; } }
        }
      `}</style>

      {/* Full-screen overlay */}
      <div
        role="status"
        aria-label="Loading Debate Coach"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'var(--color-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: overlayOpacity,
          transition: overlayTransition,
          pointerEvents: phase === 'exiting' ? 'none' : 'all',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow blobs — purely decorative */}
        <div aria-hidden="true" style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          {/* Primary blue glow */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,142,247,0.35) 0%, transparent 70%)',
            animation: rm ? 'none' : 'splashGlow 3s ease-in-out infinite',
            filter: 'blur(40px)',
          }} />
          {/* Accent purple glow */}
          <div style={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-30%, -50%)',
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,106,245,0.25) 0%, transparent 70%)',
            animation: rm ? 'none' : 'splashGlow2 3.5s ease-in-out infinite 0.5s',
            filter: 'blur(50px)',
          }} />
        </div>

        {/* Center content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-lg)',
          position: 'relative',
          zIndex: 1,
          padding: 'var(--space-lg)',
          textAlign: 'center',
        }}>
          {/* Logo icon */}
          <div style={logoStyle}>
            <div style={{
              width: 88,
              height: 88,
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(79,142,247,0.4), 0 8px 32px rgba(0,0,0,0.5)',
            }}>
              <Target size={44} color="#fff" strokeWidth={1.8} />
            </div>
          </div>

          {/* Wordmark */}
          <div style={titleStyle}>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
              fontWeight: 800,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--color-text-primary)',
            }}>
              Debate Coach
            </p>
          </div>

          {/* Tagline */}
          <div style={taglineStyle}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.02em',
            }}>
              Think. Challenge. Persuade.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
