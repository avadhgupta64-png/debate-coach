import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

/*
 * HeroTargetAnimation
 * ─────────────────────────────────────────────────────────────────────────────
 * The period "." at the end of "Own the room." flies directly from its
 * position in the heading to the bullseye of the target board.
 *
 * Sequence:
 *   hidden   — period in h1 fully visible, target board visible
 *   fly      — period clones into a fixed portal and arcs to the bullseye
 *   impact   — ripple rings + +100 float animation
 *   resetting— brief hold, then period restored and loop restarts
 *
 * Props:
 *   periodRef   — ref on the period <span> in the h1
 *   scoreOffset — { x, y } randomised offset for the +100 badge
 */

// ── Timing ─────────────────────────────────────────────────────────────────
const T_INIT_DELAY = 900;   // pause before first launch (page settles)
const T_FLY        = 800;   // period arc flight
const T_IMPACT     = 650;   // ripple + score float
const T_RESET      = 1000;  // hold before next loop

const EASE_SMOOTH = 'cubic-bezier(0.4, 0, 0.2, 1)';

// ── SVG layout ─────────────────────────────────────────────────────────────
const SVG_W = 220;
const SVG_H = 175;
const TGT_X = 110;   // bullseye centre x (SVG coords) — centred in viewport
const TGT_Y = 82;    // bullseye centre y

const RINGS = [
  { r: 50, fill: 'rgba(255,255,255,0.03)', stroke: 'rgba(255,255,255,0.07)' },
  { r: 40, fill: 'rgba(248,113,113,0.08)', stroke: 'rgba(248,113,113,0.14)' },
  { r: 29, fill: 'rgba(79,142,247,0.12)',  stroke: 'rgba(79,142,247,0.18)'  },
  { r: 18, fill: 'rgba(124,106,245,0.16)', stroke: 'rgba(124,106,245,0.24)' },
  { r:  9, fill: 'rgba(240,180,41,0.55)',  stroke: 'rgba(240,180,41,0.80)'  },
];

// ── Bezier helper ──────────────────────────────────────────────────────────
function qBez(p0, p1, p2, t) {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

export default function HeroTargetAnimation({
  periodRef,
  scoreOffset = { x: 0, y: 0 },
}) {
  const containerRef = useRef(null);
  const flyingRef    = useRef(null);
  const timers       = useRef([]);
  const rafIds       = useRef([]);

  const [phase, setPhase]               = useState('hidden');
  const [showImpact, setShowImpact]     = useState(false);
  const [showScore, setShowScore]       = useState(false);
  const [scoreAnimate, setScoreAnimate] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const sched = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    rafIds.current.forEach(cancelAnimationFrame);
    rafIds.current = [];
  }, []);

  const getBullseyeScreen = useCallback(() => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    // If the container is hidden (display:none via .hide-mobile) its rect is all
    // zeros. Bail out so we don't fly to (0,0) and hide the period permanently.
    if (rect.width === 0 || rect.height === 0) return null;
    const sx = rect.width  / SVG_W;
    const sy = rect.height / SVG_H;
    return {
      x: rect.left + TGT_X * sx,
      y: rect.top  + TGT_Y * sy,
    };
  }, []);

  // rAF-driven quadratic bezier flight
  const flyAlong = useCallback((sx, sy, ex, ey, cpx, cpy, dur, onDone) => {
    const el = flyingRef.current;
    if (!el) return;
    const t0 = performance.now();

    const tick = (now) => {
      const raw = Math.min((now - t0) / dur, 1);
      // ease-in-out cubic
      const t = raw < 0.5
        ? 4 * raw * raw * raw
        : 1 - Math.pow(-2 * raw + 2, 3) / 2;

      const x = qBez(sx, cpx, ex, t);
      const y = qBez(sy, cpy, ey, t);
      // subtle scale: starts at 1, pops to 1.25 at apex, shrinks to 0.7 on arrival
      const scale = t < 0.5
        ? 1 + 0.5 * Math.sin(t * Math.PI)
        : 0.7 + 0.3 * (1 - t) * 2;

      el.style.left      = `${x - 7}px`;
      el.style.top       = `${y - 7}px`;
      el.style.transform = `scale(${scale})`;

      if (raw < 1) {
        const id = requestAnimationFrame(tick);
        rafIds.current.push(id);
      } else {
        onDone?.();
      }
    };

    const id = requestAnimationFrame(tick);
    rafIds.current.push(id);
  }, []);

  // ── Main sequence ─────────────────────────────────────────────────────────
  const runSequence = useCallback(() => {
    // ── Reset state ─────────────────────────────────────────────────────
    setPhase('hidden');
    setShowImpact(false);
    setShowScore(false);
    setScoreAnimate(false);

    if (periodRef?.current) {
      periodRef.current.style.visibility = 'visible';
      periodRef.current.style.opacity    = '1';
    }
    if (flyingRef.current) {
      flyingRef.current.style.opacity = '0';
    }

    if (prefersReducedMotion) {
      // Static: just show target + score badge, no motion
      setShowScore(true);
      return;
    }

    sched(() => {
      // ── Measure ─────────────────────────────────────────────────────
      const periodEl = periodRef?.current;
      const bullseye = getBullseyeScreen();
      if (!periodEl || !bullseye) {
        // Container is hidden (e.g. .hide-mobile on small screens).
        // Ensure the period is visible and stop — don't loop.
        if (periodEl) {
          periodEl.style.visibility = 'visible';
          periodEl.style.opacity    = '1';
        }
        return;
      }

      const pr   = periodEl.getBoundingClientRect();
      const srcX = pr.left + pr.width  / 2;
      const srcY = pr.top  + pr.height / 2;

      // Place clone at period's position, make it visible
      const el = flyingRef.current;
      if (el) {
        el.style.left      = `${srcX - 7}px`;
        el.style.top       = `${srcY - 7}px`;
        el.style.transform = 'scale(1)';
        el.style.opacity   = '1';
      }

      // Hide the original period
      periodEl.style.visibility = 'hidden';

      setPhase('fly');

      // Arc control point: peak is above the midpoint, biased toward the source
      const cpX = srcX + (bullseye.x - srcX) * 0.4;
      const cpY = Math.min(srcY, bullseye.y) - 60;

      flyAlong(srcX, srcY, bullseye.x, bullseye.y, cpX, cpY, T_FLY, () => {
        // ── Impact ────────────────────────────────────────────────────
        if (flyingRef.current) flyingRef.current.style.opacity = '0';

        setPhase('impact');
        setShowImpact(true);
        setShowScore(true);
        sched(() => setScoreAnimate(true), 60);

        sched(() => {
          setShowImpact(false);
          setPhase('resetting');

          sched(() => {
            // Restore period, clear score, restart
            setShowScore(false);
            setScoreAnimate(false);
            if (periodRef?.current) {
              periodRef.current.style.visibility = 'visible';
              periodRef.current.style.opacity    = '1';
            }
            sched(() => runSequence(), 150);
          }, T_RESET);
        }, T_IMPACT);
      });
    }, T_INIT_DELAY);
  }, [prefersReducedMotion, sched, periodRef, getBullseyeScreen, flyAlong]);

  useEffect(() => {
    runSequence();
    return clearAll;
  }, [runSequence, clearAll]);

  // ── Score badge position (relative to SVG container) ─────────────────────
  const scoreLeft = TGT_X + scoreOffset.x;
  const scoreTop  = TGT_Y + scoreOffset.y;

  return (
    <>
      {/* ── Flying period portal ──────────────────────────────────────────── */}
      {createPortal(
        <div
          ref={flyingRef}
          aria-hidden="true"
          style={{
            position:       'fixed',
            pointerEvents:  'none',
            zIndex:         9000,
            width:          14,
            height:         14,
            borderRadius:   '50%',
            background:     'linear-gradient(135deg, #4f8ef7, #7c6af5)',
            boxShadow:      '0 0 10px rgba(79,142,247,0.8), 0 0 4px rgba(124,106,245,0.5)',
            opacity:        0,
            willChange:     'left, top, transform',
          }}
        />,
        document.body,
      )}

      {/* ── Target board container ────────────────────────────────────────── */}
      <div
        ref={containerRef}
        aria-hidden="true"
        role="img"
        style={{
          position:   'relative',
          width:      SVG_W,
          height:     SVG_H,
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        <style>{`
          @keyframes heroImpactRipple {
            0%   { transform: scale(1);   opacity: 0; }
            15%  { transform: scale(1.05);opacity: 0.9; }
            65%  { transform: scale(1.7); opacity: 0.3; }
            100% { transform: scale(2.4); opacity: 0; }
          }
          @keyframes heroScoreFloat {
            0%   { transform: translateY(0px)   scale(0.4); opacity: 0; }
            12%  { transform: translateY(-4px)  scale(1.2); opacity: 1; }
            70%  { transform: translateY(-16px) scale(1.0); opacity: 1; }
            100% { transform: translateY(-30px) scale(0.85); opacity: 0; }
          }
        `}</style>

        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* Outer glow halo */}
          <circle cx={TGT_X} cy={TGT_Y} r={56}
            fill="none" stroke="rgba(79,142,247,0.05)" strokeWidth={1.5} />

          {/* Post */}
          <line x1={TGT_X} y1={TGT_Y + 51} x2={TGT_X} y2={148}
            stroke="rgba(255,255,255,0.18)" strokeWidth={3} strokeLinecap="round" />

          {/* Base foot */}
          <line x1={TGT_X - 16} y1={148} x2={TGT_X + 16} y2={148}
            stroke="rgba(255,255,255,0.22)" strokeWidth={4} strokeLinecap="round" />

          {/* Rings */}
          {RINGS.map((ring, i) => (
            <circle key={i} cx={TGT_X} cy={TGT_Y} r={ring.r}
              fill={ring.fill} stroke={ring.stroke} strokeWidth={1.5} />
          ))}

          {/* Crosshair */}
          <line x1={TGT_X - 56} y1={TGT_Y} x2={TGT_X + 56} y2={TGT_Y}
            stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
          <line x1={TGT_X} y1={TGT_Y - 56} x2={TGT_X} y2={TGT_Y + 56}
            stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
        </svg>

        {/* Impact ripple 1 */}
        <div style={{
          position:     'absolute',
          left:         TGT_X - 30,
          top:          TGT_Y - 30,
          width:        60,
          height:       60,
          borderRadius: '50%',
          border:       '2px solid rgba(240,180,41,0.75)',
          pointerEvents:'none',
          opacity:      0,
          animation:    showImpact && !prefersReducedMotion
            ? `heroImpactRipple ${T_IMPACT}ms ease-out forwards`
            : 'none',
        }} />

        {/* Impact ripple 2 (offset) */}
        <div style={{
          position:     'absolute',
          left:         TGT_X - 30,
          top:          TGT_Y - 30,
          width:        60,
          height:       60,
          borderRadius: '50%',
          border:       '2px solid rgba(124,106,245,0.55)',
          pointerEvents:'none',
          opacity:      0,
          animation:    showImpact && !prefersReducedMotion
            ? `heroImpactRipple ${T_IMPACT}ms ease-out 110ms forwards`
            : 'none',
        }} />

        {/* +100 badge */}
        <div style={{
          position:      'absolute',
          left:          scoreLeft - 20,
          top:           scoreTop,
          fontSize:      '0.72rem',
          fontWeight:    800,
          fontFamily:    'var(--font-sans)',
          color:         'var(--color-gold)',
          letterSpacing: '0.05em',
          background:    'rgba(240,180,41,0.12)',
          border:        '1px solid rgba(240,180,41,0.32)',
          borderRadius:  '20px',
          padding:       '2px 8px',
          whiteSpace:    'nowrap',
          pointerEvents: 'none',
          opacity:       showScore ? 1 : 0,
          transition:    showScore ? 'none' : 'opacity 150ms ease',
          animation:     scoreAnimate && !prefersReducedMotion
            ? `heroScoreFloat ${T_IMPACT + 200}ms ${EASE_SMOOTH} forwards`
            : 'none',
        }}>
          +100
        </div>
      </div>
    </>
  );
}
