import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

/*
 * HeroCatapultAnimation
 * ─────────────────────────────────────────────────────────────────────────────
 * Cinematic sequence:
 *
 *   hidden      — everything invisible; period in h1 is fully visible
 *   catSpawn    — catapult fades/scales in near the period          (~500ms)
 *   periodFly   — period cloned into a fixed portal, flies to cup   (~600ms)
 *   loaded      — arm pulls back; period sits in cup                (~500ms)
 *   launch      — arm swings; period arcs to bullseye               (~850ms)
 *   impact      — ripple + +100 float                               (~600ms)
 *   resetting   — brief pause, everything fades; period reappears   (~900ms)
 *   → loop back to hidden
 *
 * Key technique for cross-column period travel:
 *   - The period <span> in the h1 has a ref passed down from Dashboard.
 *   - We measure its getBoundingClientRect() just before animating.
 *   - We render a fixed-position clone via a React portal that travels from
 *     the measured screen position to the catapult cup screen position.
 *   - While the clone is visible the original period's visibility is 'hidden'
 *     (preserves layout, invisible).
 *   - After launch completes the original period becomes visible again when
 *     the sequence resets.
 *
 * Props:
 *   periodRef   — ref attached to the period <span> in the h1
 *   scoreOffset — { x, y } pixel offset for +100 badge (randomised by parent)
 */

// ── Timing ────────────────────────────────────────────────────────────────────
const T_CAT_SPAWN   = 500;   // catapult fade-in
const T_PERIOD_FLY  = 600;   // period travels to cup
const T_LOADED      = 500;   // arm pulls back
const T_LAUNCH      = 850;   // projectile arc to target
const T_IMPACT      = 600;   // ripple + score float
const T_RESET       = 900;   // fade out, restore

// Initial pause before sequence starts (gives the page time to settle)
const T_INIT_DELAY  = 800;

const EASE_SMOOTH  = 'cubic-bezier(0.4, 0, 0.2, 1)';
const EASE_SPRING  = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const EASE_LAUNCH  = 'cubic-bezier(0.55, 0, 0.45, 1)';

// ── SVG layout constants ──────────────────────────────────────────────────────
// The catapult SVG viewport is 300 × 175.
// We keep the target on the right and the catapult on the left.
const SVG_W  = 300;
const SVG_H  = 175;
const TGT_X  = 238;   // target bullseye centre x (SVG coords)
const TGT_Y  = 82;    // target bullseye centre y
const CAT_PX = 58;    // catapult pivot x
const CAT_PY = 118;   // catapult arm pivot y
const ARM_L  = 40;    // arm half-length (cup end)

// Arm "loaded" angle: pulled back (cup pointing down-right, ready to launch)
// In SVG +y is down. Pulled-back = arm tilted ~35° clockwise from neutral.
const ARM_LOADED_DEG  =  35;   // degrees — loaded/pulled-back
const ARM_FIRED_DEG   = -82;   // degrees — after release (cup swings up)

// Cup position at loaded state (arm at ARM_LOADED_DEG, measured from pivot)
const loadedRad = (ARM_LOADED_DEG * Math.PI) / 180;
// The cup end of the arm is ARM_L units along the arm in the "cup direction"
// which is at angle (180° + ARM_LOADED_DEG) from the pivot (opposite counter-weight)
const CUP_LOADED_X = CAT_PX - ARM_L * Math.cos(loadedRad);  // to the left
const CUP_LOADED_Y = CAT_PY - ARM_L * Math.sin(loadedRad);  // upward

// ── Target board rings ────────────────────────────────────────────────────────
const RINGS = [
  { r: 50, fill: 'rgba(255,255,255,0.03)', stroke: 'rgba(255,255,255,0.07)' },
  { r: 40, fill: 'rgba(248,113,113,0.08)', stroke: 'rgba(248,113,113,0.14)' },
  { r: 29, fill: 'rgba(79,142,247,0.12)',  stroke: 'rgba(79,142,247,0.18)'  },
  { r: 18, fill: 'rgba(124,106,245,0.16)', stroke: 'rgba(124,106,245,0.24)' },
  { r:  9, fill: 'rgba(240,180,41,0.55)',  stroke: 'rgba(240,180,41,0.80)'  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }

// Quadratic bezier at t
function qBez(p0, p1, p2, t) {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}

export default function HeroCatapultAnimation({
  periodRef,
  scoreOffset = { x: 0, y: 0 },
}) {
  const containerRef   = useRef(null);  // the right-column wrapper div
  const timers         = useRef([]);
  const animFrames     = useRef([]);
  const [phase, setPhase]               = useState('hidden');
  const [catOpacity, setCatOpacity]     = useState(0);
  const [catScale, setCatScale]         = useState(0.6);
  const [armDeg, setArmDeg]             = useState(ARM_LOADED_DEG);
  const [periodHidden, setPeriodHidden] = useState(false);  // hides original period
  const [showImpact, setShowImpact]     = useState(false);
  const [showScore, setShowScore]       = useState(false);
  const [scoreAnimate, setScoreAnimate] = useState(false);

  // Flying period clone — controlled entirely via inline style updates
  // rather than re-renders to keep the transition fluid.
  const flyingRef  = useRef(null);
  const [showFlying, setShowFlying] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // ── Timer helpers ──────────────────────────────────────────────────────────
  const sched = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    animFrames.current.forEach(cancelAnimationFrame);
    animFrames.current = [];
  }, []);

  // ── Get SVG-container-relative position of the cup ────────────────────────
  // Returns { x, y } in viewport (screen) coordinates.
  const getCupScreenPos = useCallback(() => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    // The SVG fills the container. Scale from SVG coords to rendered px.
    const scaleX = rect.width  / SVG_W;
    const scaleY = rect.height / SVG_H;
    return {
      x: rect.left + CUP_LOADED_X * scaleX,
      y: rect.top  + CUP_LOADED_Y * scaleY,
    };
  }, []);

  // ── Smoothly animate the flying period along a quadratic bezier ───────────
  // from (startX, startY) to (endX, endY) with control point (cpX, cpY).
  const flyAlong = useCallback((startX, startY, endX, endY, cpX, cpY, durationMs, onDone) => {
    if (!flyingRef.current) return;
    const el = flyingRef.current;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const raw = Math.min(elapsed / durationMs, 1);
      // ease-in-out cubic
      const t = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;

      const x = qBez(startX, cpX, endX, t);
      const y = qBez(startY, cpY, endY, t);
      const scale = 1 + 0.3 * Math.sin(t * Math.PI);  // subtle scale pop mid-arc

      el.style.left      = `${x - 7}px`;
      el.style.top       = `${y - 7}px`;
      el.style.transform = `scale(${scale})`;

      if (raw < 1) {
        const id = requestAnimationFrame(tick);
        animFrames.current.push(id);
      } else {
        onDone?.();
      }
    };

    const id = requestAnimationFrame(tick);
    animFrames.current.push(id);
  }, []);

  // ── Main sequence ──────────────────────────────────────────────────────────
  const runSequence = useCallback(() => {
    if (prefersReducedMotion) {
      // Static composition: catapult visible, arm loaded, period in cup
      setCatOpacity(1);
      setCatScale(1);
      setArmDeg(ARM_LOADED_DEG);
      setShowScore(true);
      return;
    }

    // ── PHASE: hidden ─────────────────────────────────────────────────────
    setPhase('hidden');
    setCatOpacity(0);
    setCatScale(0.6);
    setArmDeg(ARM_LOADED_DEG);
    setPeriodHidden(false);
    setShowFlying(false);
    setShowImpact(false);
    setShowScore(false);
    setScoreAnimate(false);

    // Restore original period visibility immediately
    if (periodRef?.current) {
      periodRef.current.style.visibility = 'visible';
      periodRef.current.style.opacity    = '1';
    }

    sched(() => {
      // ── PHASE: catSpawn ─────────────────────────────────────────────────
      setPhase('catSpawn');
      setCatOpacity(1);
      setCatScale(1);

      sched(() => {
        // ── PHASE: periodFly ───────────────────────────────────────────────
        // Measure positions
        const periodEl  = periodRef?.current;
        const cupScreen = getCupScreenPos();
        if (!periodEl || !cupScreen) {
          // fallback: skip directly to loaded
          setPhase('loaded');
          setArmDeg(ARM_LOADED_DEG);
          sched(() => doLaunch(), T_LOADED);
          return;
        }

        const pRect = periodEl.getBoundingClientRect();
        const startX = pRect.left + pRect.width  / 2;
        const startY = pRect.top  + pRect.height / 2;

        // Place flying clone at the period's screen position
        if (flyingRef.current) {
          flyingRef.current.style.left      = `${startX - 7}px`;
          flyingRef.current.style.top       = `${startY - 7}px`;
          flyingRef.current.style.transform = 'scale(1)';
          flyingRef.current.style.opacity   = '1';
        }

        // Hide original, show clone
        periodEl.style.visibility = 'hidden';
        setShowFlying(true);
        setPhase('periodFly');

        // Control point: arc slightly upward and toward the cup
        const cpX = lerp(startX, cupScreen.x, 0.5);
        const cpY = Math.min(startY, cupScreen.y) - 30;

        flyAlong(startX, startY, cupScreen.x, cupScreen.y, cpX, cpY, T_PERIOD_FLY, () => {
          // ── PHASE: loaded ────────────────────────────────────────────────
          setPhase('loaded');
          setArmDeg(ARM_LOADED_DEG);  // arm already at loaded, confirm

          sched(() => {
            doLaunch();
          }, T_LOADED);
        });
      }, T_CAT_SPAWN);
    }, T_INIT_DELAY);
  }, [prefersReducedMotion, sched, periodRef, getCupScreenPos, flyAlong]);

  const doLaunch = useCallback(() => {
    // ── PHASE: launch ─────────────────────────────────────────────────────
    setPhase('launch');
    setArmDeg(ARM_FIRED_DEG);   // arm swings up (CSS transition on the SVG <g>)

    // Hide the clone in the cup and immediately show the arc projectile
    // The arc projectile starts at the cup and flies to the target.
    // We reuse flyingRef but update its position using the rAF loop.
    const cupScreen = getCupScreenPos();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!cupScreen || !containerRect) return;

    // Target bullseye in screen coordinates
    const scaleX = containerRect.width  / SVG_W;
    const scaleY = containerRect.height / SVG_H;
    const tgtScreenX = containerRect.left + TGT_X * scaleX;
    const tgtScreenY = containerRect.top  + TGT_Y * scaleY;

    // Control point for launch arc (higher apex)
    const cpX = lerp(cupScreen.x, tgtScreenX, 0.45);
    const cpY = Math.min(cupScreen.y, tgtScreenY) - 55;

    // Make sure the flying period is at the cup position before launching
    if (flyingRef.current) {
      flyingRef.current.style.left    = `${cupScreen.x - 7}px`;
      flyingRef.current.style.top     = `${cupScreen.y - 7}px`;
      flyingRef.current.style.opacity = '1';
    }
    setShowFlying(true);

    flyAlong(cupScreen.x, cupScreen.y, tgtScreenX, tgtScreenY, cpX, cpY, T_LAUNCH, () => {
      // Hide projectile at impact
      if (flyingRef.current) flyingRef.current.style.opacity = '0';
      setShowFlying(false);

      // ── PHASE: impact ──────────────────────────────────────────────────
      setPhase('impact');
      setShowImpact(true);
      setShowScore(true);
      sched(() => setScoreAnimate(true), 80);

      sched(() => {
        setShowImpact(false);

        // ── PHASE: resetting ─────────────────────────────────────────────
        setPhase('resetting');

        // Fade catapult out
        setCatOpacity(0);
        setCatScale(0.8);

        sched(() => {
          // Restore original period
          if (periodRef?.current) {
            periodRef.current.style.visibility = 'visible';
            periodRef.current.style.opacity    = '1';
          }
          setShowScore(false);
          setScoreAnimate(false);

          sched(() => {
            runSequence();
          }, 200);
        }, T_RESET);
      }, T_IMPACT);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCupScreenPos, flyAlong, sched, periodRef]);

  useEffect(() => {
    runSequence();
    return clearAll;
  }, [runSequence, clearAll]);

  // ── Arm CSS transition ─────────────────────────────────────────────────────
  const isLaunching = phase === 'launch';
  const armStyle = {
    transformOrigin: `${CAT_PX}px ${CAT_PY}px`,
    transform: `rotate(${armDeg}deg)`,
    transition: isLaunching
      ? `transform ${T_LAUNCH * 0.45}ms ${EASE_LAUNCH}`
      : `transform ${T_LOADED * 0.6}ms ${EASE_SPRING}`,
  };

  // ── Cup position after arm fires (for visual reference only) ──────────────
  // Not needed for the arc (we use the loaded cup pos for launch origin).

  // ── Catapult container style ───────────────────────────────────────────────
  const catBodyStyle = {
    opacity:   catOpacity,
    transform: `scale(${catScale})`,
    transition: phase === 'catSpawn'
      ? `opacity ${T_CAT_SPAWN}ms ${EASE_SMOOTH}, transform ${T_CAT_SPAWN}ms ${EASE_SPRING}`
      : phase === 'resetting'
      ? `opacity ${T_RESET * 0.55}ms ${EASE_SMOOTH}, transform ${T_RESET * 0.55}ms ${EASE_SMOOTH}`
      : 'none',
    transformOrigin: 'center bottom',
  };

  // ── Score badge ────────────────────────────────────────────────────────────
  // Positioned relative to the SVG container (not fixed), so it stays near the target.
  const scoreLeft = TGT_X + scoreOffset.x;
  const scoreTop  = TGT_Y + scoreOffset.y;

  // ── Wheel positions ────────────────────────────────────────────────────────
  const wheel1 = { cx: CAT_PX - 18, cy: 142 };
  const wheel2 = { cx: CAT_PX + 18, cy: 142 };

  // ── Counter-weight end of arm (opposite side from cup) ────────────────────
  // At loaded angle, the counter-weight hangs on the +x/+y side of pivot
  const CW_X = CAT_PX + (ARM_L * 0.55) * Math.cos(loadedRad);
  const CW_Y = CAT_PY + (ARM_L * 0.55) * Math.sin(loadedRad);

  return (
    <>
      {/* ── Flying period portal (fixed, covers full viewport) ─────────────── */}
      {createPortal(
        <div
          ref={flyingRef}
          aria-hidden="true"
          style={{
            position:     'fixed',
            pointerEvents:'none',
            zIndex:       9000,
            width:        14,
            height:       14,
            borderRadius: '50%',
            background:   'linear-gradient(135deg, #4f8ef7, #7c6af5)',
            boxShadow:    '0 0 10px rgba(79,142,247,0.7), 0 0 4px rgba(124,106,245,0.5)',
            display:      'flex',
            alignItems:   'center',
            justifyContent:'center',
            fontSize:     '9px',
            fontWeight:   700,
            color:        '#fff',
            fontFamily:   'var(--font-display)',
            lineHeight:   1,
            opacity:      0,  // controlled imperatively
            transition:   'opacity 80ms ease',
            willChange:   'left, top, transform',
          }}
        >
          .
        </div>,
        document.body,
      )}

      {/* ── SVG container ────────────────────────────────────────────────────── */}
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
        {/* Inject precise arc keyframe for the launch (computed from SVG coords) */}
        <style>{`
          @keyframes heroCatLaunchArc {
            0%   { transform: translate(0px, 0px) scale(1);    opacity: 1; }
            28%  { transform: translate(${(TGT_X - CUP_LOADED_X) * 0.28}px,
                               ${(TGT_Y - CUP_LOADED_Y) * 0.28 - 52}px) scale(1.25); opacity: 1; }
            62%  { transform: translate(${(TGT_X - CUP_LOADED_X) * 0.65}px,
                               ${(TGT_Y - CUP_LOADED_Y) * 0.65 - 28}px) scale(1.1);  opacity: 1; }
            88%  { transform: translate(${(TGT_X - CUP_LOADED_X) * 0.94}px,
                               ${(TGT_Y - CUP_LOADED_Y) * 0.94}px) scale(0.9); opacity: 0.85; }
            100% { transform: translate(${TGT_X - CUP_LOADED_X}px,
                               ${TGT_Y - CUP_LOADED_Y}px) scale(0.6);   opacity: 0; }
          }
          @keyframes heroCatImpactRipple {
            0%   { transform: scale(1);   opacity: 0; }
            18%  { transform: scale(1.1); opacity: 0.85; }
            65%  { transform: scale(1.6); opacity: 0.35; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          @keyframes heroCatScoreFloat {
            0%   { transform: translateY(0px)   scale(0.5); opacity: 0; }
            12%  { transform: translateY(-3px)  scale(1.2); opacity: 1; }
            70%  { transform: translateY(-14px) scale(1.0); opacity: 1; }
            100% { transform: translateY(-28px) scale(0.85); opacity: 0; }
          }
          @keyframes heroCatPeriodGlow {
            0%, 100% { box-shadow: 0 0 6px 2px rgba(79,142,247,0.4); }
            50%       { box-shadow: 0 0 16px 4px rgba(124,106,245,0.65); }
          }
        `}</style>

        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        >
          {/* ── Target board (always visible) ────────────────────────────── */}
          {/* Soft outer glow halo */}
          <circle cx={TGT_X} cy={TGT_Y} r={56}
            fill="none"
            stroke="rgba(79,142,247,0.05)"
            strokeWidth={1.5}
          />
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

          {/* ── Catapult body (opacity/scale animated via catBodyStyle) ─────── */}
          <g style={catBodyStyle}>
            {/* Ground dashes */}
            <line x1={CAT_PX - 32} y1={148} x2={CAT_PX + 32} y2={148}
              stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="3 5" />

            {/* Wheel 1 */}
            <circle cx={wheel1.cx} cy={wheel1.cy} r={8}
              fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} />
            <circle cx={wheel1.cx} cy={wheel1.cy} r={3}
              fill="rgba(255,255,255,0.14)" />
            {[0, 60, 120].map((d) => {
              const rad = (d * Math.PI) / 180;
              return (
                <line key={d}
                  x1={wheel1.cx + 8 * Math.cos(rad)} y1={wheel1.cy + 8 * Math.sin(rad)}
                  x2={wheel1.cx - 8 * Math.cos(rad)} y2={wheel1.cy - 8 * Math.sin(rad)}
                  stroke="rgba(255,255,255,0.10)" strokeWidth={1} />
              );
            })}

            {/* Wheel 2 */}
            <circle cx={wheel2.cx} cy={wheel2.cy} r={8}
              fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} />
            <circle cx={wheel2.cx} cy={wheel2.cy} r={3}
              fill="rgba(255,255,255,0.14)" />
            {[0, 60, 120].map((d) => {
              const rad = (d * Math.PI) / 180;
              return (
                <line key={d}
                  x1={wheel2.cx + 8 * Math.cos(rad)} y1={wheel2.cy + 8 * Math.sin(rad)}
                  x2={wheel2.cx - 8 * Math.cos(rad)} y2={wheel2.cy - 8 * Math.sin(rad)}
                  stroke="rgba(255,255,255,0.10)" strokeWidth={1} />
              );
            })}

            {/* Axle / plank */}
            <line x1={wheel1.cx} y1={142} x2={wheel2.cx} y2={142}
              stroke="rgba(255,255,255,0.16)" strokeWidth={2.5} />

            {/* Frame uprights */}
            <line x1={CAT_PX - 12} y1={134} x2={CAT_PX} y2={CAT_PY}
              stroke="rgba(255,255,255,0.28)" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={CAT_PX + 12} y1={134} x2={CAT_PX} y2={CAT_PY}
              stroke="rgba(255,255,255,0.28)" strokeWidth={2.5} strokeLinecap="round" />
            {/* Crossbar */}
            <line x1={CAT_PX - 24} y1={134} x2={CAT_PX + 24} y2={134}
              stroke="rgba(255,255,255,0.20)" strokeWidth={2.5} strokeLinecap="round" />

            {/* ── Arm group (rotates) ────────────────────────────────────── */}
            <g style={prefersReducedMotion ? undefined : armStyle}>
              {/* Throwing arm (pivot → cup direction) */}
              <line
                x1={CAT_PX} y1={CAT_PY}
                x2={CUP_LOADED_X} y2={CUP_LOADED_Y}
                stroke="rgba(255,255,255,0.38)"
                strokeWidth={3}
                strokeLinecap="round"
              />
              {/* Counter-weight arm (pivot → opposite) */}
              <line
                x1={CAT_PX} y1={CAT_PY}
                x2={CW_X}   y2={CW_Y}
                stroke="rgba(255,255,255,0.28)"
                strokeWidth={3}
                strokeLinecap="round"
              />
              {/* Counter-weight ball */}
              <circle cx={CW_X} cy={CW_Y} r={6}
                fill="rgba(79,142,247,0.40)"
                stroke="rgba(79,142,247,0.65)"
                strokeWidth={1.5}
              />
              {/* Cup (U-shaped arc at tip of throwing arm) */}
              <path
                d={`M ${CUP_LOADED_X - 6} ${CUP_LOADED_Y + 3}
                    Q ${CUP_LOADED_X} ${CUP_LOADED_Y - 4}
                      ${CUP_LOADED_X + 6} ${CUP_LOADED_Y + 3}`}
                stroke="rgba(255,255,255,0.38)"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
              />
            </g>

            {/* Tension rope (decorative — from pivot to counterweight, pulled taut) */}
            {(phase === 'loaded' || phase === 'periodFly' || phase === 'catSpawn') && (
              <line
                x1={CAT_PX} y1={CAT_PY + 10}
                x2={CW_X}   y2={CW_Y + 4}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1}
                strokeDasharray="2 3"
              />
            )}
          </g>

          {/* ── Trajectory guide (subtle, shown only in loaded phase) ─────── */}
          {(phase === 'loaded') && (
            <path
              d={`M ${CUP_LOADED_X} ${CUP_LOADED_Y}
                  Q ${(CUP_LOADED_X + TGT_X) / 2} ${Math.min(CUP_LOADED_Y, TGT_Y) - 40}
                  ${TGT_X} ${TGT_Y}`}
              stroke="rgba(79,142,247,0.10)"
              strokeWidth={1}
              strokeDasharray="3 6"
              fill="none"
            />
          )}
        </svg>

        {/* ── Impact ripple divs ─────────────────────────────────────────────── */}
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
            ? `heroCatImpactRipple ${T_IMPACT}ms ease-out forwards`
            : 'none',
        }} />
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
            ? `heroCatImpactRipple ${T_IMPACT}ms ease-out 100ms forwards`
            : 'none',
        }} />

        {/* ── +100 score badge ───────────────────────────────────────────────── */}
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
            ? `heroCatScoreFloat ${T_IMPACT + 250}ms ${EASE_SMOOTH} forwards`
            : 'none',
        }}>
          +100
        </div>
      </div>
    </>
  );
}
