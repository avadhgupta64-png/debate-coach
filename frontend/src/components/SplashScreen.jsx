import React, { useEffect, useState, useRef } from 'react';
import debateCoachLogo from '/debate-coach-logo.png';

/*
 * SplashScreen
 *
 * Full-screen cinematic splash shown once per session.
 * Calls onDone() after the animation completes.
 *
 * Timing (normal motion) — total = exactly 3000 ms:
 *   0 ms         — mount, elements invisible
 *   50 ms        — trigger enter transition
 *   50 + 600 ms  — fully visible
 *   50 + 600 + 1750 ms — start exit transition     (hold = 1750 ms)
 *   50 + 600 + 1750 + 600 ms — exit complete → onDone()
 *   Total = 50 + 600 + 1750 + 600 = 3000 ms ✓
 *
 * Reduced motion: no transforms, minimal timing, total ≈ 900 ms.
 */

const ENTER_DELAY = 50;
const ENTER_DUR   = 600;
const HOLD_DUR    = 1750;
const EXIT_DUR    = 600;

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

  // Total visible time = enterDur + holdDur. The progress bar fills over this period.
  const fillDuration = enterDur + holdDur;

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

  // ── Derived styles ──────────────────────────────────────────────────────────
  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

  // Overlay opacity
  const overlayOpacity = phase === 'visible' ? 1 : 0;
  const overlayTransition = rm
    ? `opacity ${exitDur}ms ease`
    : `opacity ${phase === 'hidden' ? enterDur : exitDur}ms ${easing}`;

  const contentVisible = phase === 'visible';

  const logoStyle = rm
    ? { opacity: contentVisible ? 1 : 0, transition: `opacity ${rm ? 200 : enterDur}ms ease` }
    : {
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible
          ? 'scale(1) translateY(0)'
          : phase === 'hidden'
          ? 'scale(0.8) translateY(20px)'
          : 'scale(1.05) translateY(-10px)',
        transition: `opacity ${enterDur}ms ${easing}, transform ${enterDur}ms ${easing}`,
      };

  const titleStyle = rm
    ? { opacity: contentVisible ? 1 : 0, transition: `opacity ${rm ? 200 : enterDur}ms ease` }
    : {
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible
          ? 'translateY(0)'
          : phase === 'hidden'
          ? 'translateY(16px)'
          : 'translateY(-10px)',
        transition: `opacity ${enterDur}ms ${easing}, transform ${enterDur}ms ${easing}`,
        transitionDelay: contentVisible ? '80ms' : '0ms',
      };

  const taglineStyle = rm
    ? { opacity: contentVisible ? 1 : 0, transition: `opacity ${rm ? 200 : enterDur}ms ease` }
    : {
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible
          ? 'translateY(0)'
          : phase === 'hidden'
          ? 'translateY(16px)'
          : 'translateY(-10px)',
        transition: `opacity ${enterDur}ms ${easing}, transform ${enterDur}ms ${easing}`,
        transitionDelay: contentVisible ? '160ms' : '0ms',
      };

  // Loading indicator fades in with the content
  const loaderStyle = rm
    ? { opacity: contentVisible ? 1 : 0, transition: `opacity ${rm ? 200 : enterDur}ms ease` }
    : {
        opacity: contentVisible ? 1 : 0,
        transition: `opacity ${enterDur}ms ${easing}`,
        transitionDelay: contentVisible ? '240ms' : '0ms',
      };

  // The fill bar starts animating as soon as the content becomes visible.
  // It completes over fillDuration ms so it reaches ~100% just before the exit.
  const barFillStyle = contentVisible
    ? {
        width: '100%',
        transition: rm
          ? `width ${holdDur}ms linear`
          : `width ${fillDuration}ms ${easing}`,
      }
    : {
        width: '0%',
        transition: 'none',
      };

  return (
    <>
      {/* Keyframes for ambient glow and dot pulse */}
      <style>{`
        @keyframes splashGlow {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50%       { opacity: 0.28; transform: scale(1.08); }
        }
        @keyframes splashGlow2 {
          0%, 100% { opacity: 0.10; transform: scale(1); }
          50%       { opacity: 0.20; transform: scale(1.12); }
        }
        @keyframes splashDot {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes splashGlow  { 0%, 100% { opacity: 0.18; } }
          @keyframes splashGlow2 { 0%, 100% { opacity: 0.10; } }
          @keyframes splashDot   { 0%, 100% { opacity: 0.7; } }
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
        {/* Ambient glow blobs — decorative */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute',
            top: '30%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 480, height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79,142,247,0.35) 0%, transparent 70%)',
            animation: rm ? 'none' : 'splashGlow 3s ease-in-out infinite',
            filter: 'blur(40px)',
          }} />
          <div style={{
            position: 'absolute',
            top: '60%', left: '50%',
            transform: 'translate(-30%, -50%)',
            width: 360, height: 360,
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
          width: '100%',
          maxWidth: 320,
        }}>
          {/* Logo */}
          <div style={logoStyle}>
            <img
              src={debateCoachLogo}
              alt="Debate Coach"
              style={{
                width: 88,
                height: 88,
                borderRadius: 'var(--radius-lg)',
                objectFit: 'contain',
                boxShadow: '0 0 40px rgba(79,142,247,0.4), 0 8px 32px rgba(0,0,0,0.5)',
              }}
            />
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

          {/* Loading indicator */}
          <div aria-hidden="true" style={{ ...loaderStyle, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            {/* Animated progress bar */}
            <div style={{
              width: '100%',
              height: 3,
              borderRadius: 'var(--radius-full)',
              background: 'rgba(79,142,247,0.15)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(90deg, var(--color-primary), rgba(124,106,245,0.9))',
                ...barFillStyle,
              }} />
            </div>

            {/* Three-dot pulse for reduced-motion users and as supplemental animation */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    animation: rm ? 'none' : `splashDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    opacity: rm ? 0.6 : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
