import React, { useEffect, useRef, useState, useCallback } from 'react';

/*
 * HeroCatapultAnimation
 * ─────────────────────
 * Renders an SVG catapult with a period-projectile aimed at the target bullseye.
 *
 * Phases (normal motion):
 *   idle      — projectile sitting in catapult cup, +100 visible
 *   launching — arm swings, projectile arcs toward target (900 ms)
 *   impact    — ripple on target, +100 animates out  (600 ms)
 *   reset     — brief pause then re-arm              (1200 ms)
 *
 * Reduced motion: static composition, no animation.
 *
 * Props:
 *   scoreOffset  — { x, y } pixel offsets for the +100 badge (randomised by parent)
 */

const LAUNCH_DUR   = 900;   // ms — projectile flight
const IMPACT_DUR   = 600;   // ms — ripple display
const RESET_PAUSE  = 1200;  // ms — hold after impact before re-arming
const IDLE_DELAY   = 1200;  // ms — hold in idle before first launch

// Easing string helpers
const ease = 'cubic-bezier(0.4, 0, 0.2, 1)';

export default function HeroCatapultAnimation({ scoreOffset = { x: 0, y: 0 } }) {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const [phase, setPhase] = useState('idle'); // idle | launching | impact | resetting
  const timers = useRef([]);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const runSequence = useCallback(() => {
    if (prefersReducedMotion) return;

    setPhase('idle');
    schedule(() => {
      setPhase('launching');
      schedule(() => {
        setPhase('impact');
        schedule(() => {
          setPhase('resetting');
          schedule(() => {
            runSequence(); // loop
          }, RESET_PAUSE);
        }, IMPACT_DUR);
      }, LAUNCH_DUR);
    }, IDLE_DELAY);
  }, [prefersReducedMotion, schedule]);

  useEffect(() => {
    runSequence();
    return clearAll;
  }, [runSequence, clearAll]);

  /* ── Derived animation states ──────────────────────────────────────────── */
  const isLaunching  = phase === 'launching';
  const isImpact     = phase === 'impact';
  const showImpact   = isImpact;
  const showScore    = phase === 'idle' || phase === 'launching';
  const scoreAnimate = isImpact;

  /* ── Target board rings ─────────────────────────────────────────────────
   *  We draw our own compact target so it integrates with the animation.
   *  Rings (outer → inner):  muted / warning / primary / accent / gold
   */
  const rings = [
    { r: 48, fill: 'rgba(255,255,255,0.04)',  stroke: 'rgba(255,255,255,0.08)' },
    { r: 38, fill: 'rgba(248,113,113,0.10)',  stroke: 'rgba(248,113,113,0.15)' },
    { r: 28, fill: 'rgba(79,142,247,0.14)',   stroke: 'rgba(79,142,247,0.20)'  },
    { r: 18, fill: 'rgba(124,106,245,0.18)',  stroke: 'rgba(124,106,245,0.25)' },
    { r: 9,  fill: 'rgba(240,180,41,0.55)',   stroke: 'rgba(240,180,41,0.80)'  },
  ];

  /* ── Layout constants (SVG viewport) ────────────────────────────────────
   *  Viewport: 300 × 160
   *  Catapult base centre: x=55, base y=138
   *  Target centre: x=238, y=80
   */
  const SVG_W = 300;
  const SVG_H = 160;
  const CAT_X = 55;   // catapult pivot x
  const CAT_Y = 115;  // catapult arm pivot y
  const TGT_X = 238;  // target centre x
  const TGT_Y = 80;   // target centre y

  // Arm: at idle the arm points ~45° up-right (cup on upper-left end)
  // Arm length 38px, pivot at CAT_X, CAT_Y
  const ARM_LEN = 38;
  // Cup rests at: pivot + arm rotated -45°
  const CUP_IDLE_X = CAT_X - ARM_LEN * Math.cos(Math.PI / 4);  // ≈ 28
  const CUP_IDLE_Y = CAT_Y - ARM_LEN * Math.sin(Math.PI / 4);  // ≈ 88

  /* ── Arm rotation ────────────────────────────────────────────────────── */
  const armRotation = isLaunching
    ? {
        transform: `rotate(-88deg)`,
        transition: `transform ${LAUNCH_DUR * 0.55}ms cubic-bezier(0.6, 0, 0.4, 1)`,
        transformOrigin: `${CAT_X}px ${CAT_Y}px`,
      }
    : phase === 'impact' || phase === 'resetting'
    ? {
        transform: `rotate(-88deg)`,
        transition: 'none',
        transformOrigin: `${CAT_X}px ${CAT_Y}px`,
      }
    : {
        transform: `rotate(0deg)`,
        transition: phase === 'resetting'
          ? `transform ${RESET_PAUSE * 0.5}ms ${ease}`
          : 'none',
        transformOrigin: `${CAT_X}px ${CAT_Y}px`,
      };

  /* ── Projectile ──────────────────────────────────────────────────────── */
  // In idle: sits at cup position
  // In launching: follows arc keyframe animation
  // After launch: invisible until reset
  const projectileVisible = phase === 'idle' || phase === 'launching';

  const projectileStyle = {
    position: 'absolute',
    // Place projectile at cup start; the keyframe animation moves it
    left: CUP_IDLE_X - 7,
    top: CUP_IDLE_Y - 7,
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4f8ef7, #7c6af5)',
    boxShadow: '0 0 8px rgba(79,142,247,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    color: '#fff',
    fontFamily: 'var(--font-display)',
    lineHeight: 1,
    opacity: projectileVisible ? 1 : 0,
    // Keyframe for arc motion (we use CSS custom property offsets)
    animation: isLaunching && !prefersReducedMotion
      ? `heroLaunch ${LAUNCH_DUR}ms ${ease} forwards`
      : 'none',
    // Idle glow pulse
    ...(phase === 'idle' && !prefersReducedMotion
      ? { animation: 'heroPeriodIdle 2s ease-in-out infinite' }
      : {}),
    // CSS variable offsets for the keyframe
    '--launch-dx': `${TGT_X - CUP_IDLE_X}px`,
    '--launch-dy': `${TGT_Y - CUP_IDLE_Y}px`,
  };

  /* ── Score badge ─────────────────────────────────────────────────────── */
  const scoreStyle = {
    position: 'absolute',
    left: TGT_X + scoreOffset.x - 18,
    top: TGT_Y + scoreOffset.y - 10,
    fontSize: '0.7rem',
    fontWeight: 800,
    fontFamily: 'var(--font-sans)',
    color: 'var(--color-gold)',
    letterSpacing: '0.05em',
    background: 'rgba(240,180,41,0.12)',
    border: '1px solid rgba(240,180,41,0.3)',
    borderRadius: '20px',
    padding: '2px 7px',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    opacity: showScore ? 1 : 0,
    animation: scoreAnimate && !prefersReducedMotion
      ? `heroScoreFloat ${IMPACT_DUR + 200}ms ${ease} forwards`
      : 'none',
    transition: showScore ? 'none' : `opacity 200ms ease`,
  };

  /* ── Impact ripple ───────────────────────────────────────────────────── */
  const rippleStyle = {
    position: 'absolute',
    left: TGT_X - 28,
    top: TGT_Y - 28,
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: '2px solid rgba(240,180,41,0.7)',
    pointerEvents: 'none',
    opacity: 0,
    animation: showImpact && !prefersReducedMotion
      ? `heroImpact ${IMPACT_DUR}ms ease-out forwards`
      : 'none',
  };

  /* ── SVG element helpers ─────────────────────────────────────────────── */
  // Catapult base: two small wheels + a horizontal plank
  // Arm: a rectangle rotated around the pivot
  // String/rope: thin line from arm tip to counter-weight stub

  // Wheel positions
  const wheel1 = { cx: CAT_X - 16, cy: 138 };
  const wheel2 = { cx: CAT_X + 16, cy: 138 };

  return (
    <div
      aria-hidden="true"
      role="img"
      style={{
        position: 'relative',
        width: SVG_W,
        height: SVG_H,
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {/* ── SVG: catapult body + target rings ─────────────────────────── */}
      <svg
        width={SVG_W}
        height={SVG_H}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* ── Target board ─────────────────────────────────────────── */}
        {/* Outer glow */}
        <circle cx={TGT_X} cy={TGT_Y} r={52}
          fill="none"
          stroke="rgba(79,142,247,0.06)"
          strokeWidth={1}
        />
        {/* Target post */}
        <line
          x1={TGT_X} y1={TGT_Y + 50}
          x2={TGT_X} y2={143}
          stroke="rgba(255,255,255,0.18)"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Target base foot */}
        <line
          x1={TGT_X - 14} y1={143}
          x2={TGT_X + 14} y2={143}
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Rings */}
        {rings.map((ring, i) => (
          <circle
            key={i}
            cx={TGT_X}
            cy={TGT_Y}
            r={ring.r}
            fill={ring.fill}
            stroke={ring.stroke}
            strokeWidth={1.5}
          />
        ))}
        {/* Crosshair lines on target */}
        <line x1={TGT_X - 54} y1={TGT_Y} x2={TGT_X + 54} y2={TGT_Y}
          stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        <line x1={TGT_X} y1={TGT_Y - 54} x2={TGT_X} y2={TGT_Y + 54}
          stroke="rgba(255,255,255,0.04)" strokeWidth={1} />

        {/* ── Catapult body ─────────────────────────────────────────── */}
        {/* Ground line */}
        <line x1={CAT_X - 30} y1={143} x2={CAT_X + 30} y2={143}
          stroke="rgba(255,255,255,0.10)" strokeWidth={1} strokeDasharray="3 4" />

        {/* Wheels */}
        <circle cx={wheel1.cx} cy={wheel1.cy} r={7}
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.20)" strokeWidth={1.5} />
        <circle cx={wheel1.cx} cy={wheel1.cy} r={2.5}
          fill="rgba(255,255,255,0.15)" />
        <circle cx={wheel2.cx} cy={wheel2.cy} r={7}
          fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.20)" strokeWidth={1.5} />
        <circle cx={wheel2.cx} cy={wheel2.cy} r={2.5}
          fill="rgba(255,255,255,0.15)" />

        {/* Wheel spokes (decorative) */}
        {[0, 60, 120].map((deg) => (
          <line
            key={deg}
            x1={wheel1.cx + 7 * Math.cos((deg * Math.PI) / 180)}
            y1={wheel1.cy + 7 * Math.sin((deg * Math.PI) / 180)}
            x2={wheel1.cx - 7 * Math.cos((deg * Math.PI) / 180)}
            y2={wheel1.cy - 7 * Math.sin((deg * Math.PI) / 180)}
            stroke="rgba(255,255,255,0.12)" strokeWidth={1}
          />
        ))}
        {[0, 60, 120].map((deg) => (
          <line
            key={deg}
            x1={wheel2.cx + 7 * Math.cos((deg * Math.PI) / 180)}
            y1={wheel2.cy + 7 * Math.sin((deg * Math.PI) / 180)}
            x2={wheel2.cx - 7 * Math.cos((deg * Math.PI) / 180)}
            y2={wheel2.cy - 7 * Math.sin((deg * Math.PI) / 180)}
            stroke="rgba(255,255,255,0.12)" strokeWidth={1}
          />
        ))}

        {/* Frame uprights */}
        <line x1={CAT_X - 10} y1={131} x2={CAT_X} y2={CAT_Y}
          stroke="rgba(255,255,255,0.22)" strokeWidth={2.5} strokeLinecap="round" />
        <line x1={CAT_X + 10} y1={131} x2={CAT_X} y2={CAT_Y}
          stroke="rgba(255,255,255,0.22)" strokeWidth={2.5} strokeLinecap="round" />
        {/* Frame crossbar */}
        <line x1={CAT_X - 24} y1={131} x2={CAT_X + 24} y2={131}
          stroke="rgba(255,255,255,0.18)" strokeWidth={2.5} strokeLinecap="round" />

        {/* Arm — rotates around pivot (CAT_X, CAT_Y) */}
        <g
          style={
            !prefersReducedMotion
              ? {
                  transformOrigin: `${CAT_X}px ${CAT_Y}px`,
                  transform: armRotation.transform,
                  transition: armRotation.transition,
                }
              : undefined
          }
        >
          {/* Main arm */}
          <line
            x1={CAT_X + ARM_LEN * Math.cos(Math.PI / 4) * 0.42}
            y1={CAT_Y + ARM_LEN * Math.sin(Math.PI / 4) * 0.42}
            x2={CUP_IDLE_X}
            y2={CUP_IDLE_Y}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Counter-weight stub */}
          <line
            x1={CAT_X + ARM_LEN * Math.cos(Math.PI / 4) * 0.42}
            y1={CAT_Y + ARM_LEN * Math.sin(Math.PI / 4) * 0.42}
            x2={CAT_X + ARM_LEN * Math.cos(Math.PI / 4) * 0.85}
            y2={CAT_Y + ARM_LEN * Math.sin(Math.PI / 4) * 0.85}
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Counter-weight ball */}
          <circle
            cx={CAT_X + ARM_LEN * Math.cos(Math.PI / 4) * 0.92}
            cy={CAT_Y + ARM_LEN * Math.sin(Math.PI / 4) * 0.92}
            r={5}
            fill="rgba(79,142,247,0.35)"
            stroke="rgba(79,142,247,0.55)"
            strokeWidth={1.5}
          />
          {/* Cup */}
          <path
            d={`M ${CUP_IDLE_X - 6} ${CUP_IDLE_Y + 2} Q ${CUP_IDLE_X} ${CUP_IDLE_Y - 5} ${CUP_IDLE_X + 6} ${CUP_IDLE_Y + 2}`}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* ── Trajectory dotted guide line ──────────────────────────── */}
        <line
          x1={CUP_IDLE_X}
          y1={CUP_IDLE_Y}
          x2={TGT_X}
          y2={TGT_Y}
          stroke="rgba(79,142,247,0.12)"
          strokeWidth={1}
          strokeDasharray="3 5"
        />
        {/* Trajectory midpoint arc suggestion */}
        <path
          d={`M ${CUP_IDLE_X} ${CUP_IDLE_Y}
              Q ${(CUP_IDLE_X + TGT_X) / 2} ${Math.min(CUP_IDLE_Y, TGT_Y) - 35}
              ${TGT_X} ${TGT_Y}`}
          stroke="rgba(79,142,247,0.08)"
          strokeWidth={1}
          strokeDasharray="2 6"
          fill="none"
        />
      </svg>

      {/* ── Projectile (period "." ) ─────────────────────────────────────── */}
      {/*
        The CSS @keyframes heroLaunch uses transform: translate(...).
        We position the element at the cup's idle location and the keyframe
        translates it to the target. We use CSS custom properties to pass
        the delta. However, since custom properties inside keyframes aren't
        supported in all browsers, we inject a scoped <style> instead.
      */}
      <style>{`
        @keyframes heroLaunch {
          0%   { transform: translate(0, 0) scale(1);    opacity: 1; }
          30%  { transform: translate(${(TGT_X - CUP_IDLE_X) * 0.28}px, ${(TGT_Y - CUP_IDLE_Y) * 0.28 - 38}px) scale(1.2); opacity: 1; }
          65%  { transform: translate(${(TGT_X - CUP_IDLE_X) * 0.72}px, ${(TGT_Y - CUP_IDLE_Y) * 0.72 - 18}px) scale(1.05); opacity: 1; }
          90%  { transform: translate(${(TGT_X - CUP_IDLE_X) * 0.96}px, ${(TGT_Y - CUP_IDLE_Y) * 0.96}px) scale(0.85); opacity: 0.8; }
          100% { transform: translate(${TGT_X - CUP_IDLE_X}px, ${TGT_Y - CUP_IDLE_Y}px) scale(0.6); opacity: 0; }
        }
      `}</style>

      <div style={projectileStyle}>
        .
      </div>

      {/* ── Impact ripple overlay ────────────────────────────────────────── */}
      <div style={rippleStyle} />
      {/* Second ripple, slightly delayed */}
      <div style={{
        ...rippleStyle,
        animation: showImpact && !prefersReducedMotion
          ? `heroImpact ${IMPACT_DUR}ms ease-out ${80}ms forwards`
          : 'none',
        borderColor: 'rgba(124,106,245,0.5)',
      }} />

      {/* ── +100 Score badge ─────────────────────────────────────────────── */}
      <div style={scoreStyle}>+100</div>
    </div>
  );
}
