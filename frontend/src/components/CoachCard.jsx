/**
 * CoachCard
 * ─────────────────────────────────────────────────────────────────────────────
 * A compact personalised AI coach summary for the Dashboard.
 * Shows strongest skill, focus area, and a "Practice My Weakness" CTA.
 *
 * Handles all three states:
 *  - empty         → prompt to start first debate
 *  - insufficient  → progress indicator toward minimum 3 debates
 *  - ready         → full personalised card
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Star, Target, Swords, ChevronRight, Zap, TrendingUp } from 'lucide-react';
import { useDebateProfile, buildWeaknessChallenge } from '../hooks/useDebateProfile.js';
import { useDebate } from '../App.jsx';

export default function CoachCard() {
  const navigate = useNavigate();
  const { setConfig } = useDebate();
  const profile = useDebateProfile();

  const handlePracticeWeakness = () => {
    if (!profile.weakestKey) return;
    const challenge = buildWeaknessChallenge(profile.weakestKey);
    setConfig({
      topic: challenge.topic,
      position: challenge.position || 'for',
      difficulty: challenge.difficulty || 'intermediate',
      debateType: 'casual',
      timeLimit: 5,
      focusNote: challenge.focusNote,
    });
    navigate('/preparation');
  };

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (profile.status === 'empty') {
    return (
      <div className="card" style={{ borderTop: '2px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={16} color="var(--color-primary)" />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Coach</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
          Complete your first debate to unlock your personalised coach analysis.
        </p>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/profile')}>
          View Profile <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  // ── Insufficient state (1-2 debates) ──────────────────────────────────────
  if (profile.status === 'insufficient') {
    const remaining = 3 - profile.debateCount;
    return (
      <div className="card" style={{ borderTop: '2px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={16} color="var(--color-primary)" />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Coach</span>
        </div>

        {/* Progress pips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-md)' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ height: 5, flex: 1, borderRadius: 'var(--radius-full)', background: n <= profile.debateCount ? 'var(--color-primary)' : 'var(--color-surface-3)' }} />
          ))}
        </div>

        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          Building your profile…
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)', lineHeight: 1.5 }}>
          {remaining === 1 ? 'One more debate' : `${remaining} more debates`} needed for full analysis.
        </p>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/profile')}>
          View Progress <ChevronRight size={14} />
        </button>
      </div>
    );
  }

  // ── Full profile card ────────────────────────────────────────────────────
  const { strongestLabel, strongestAvg, weakestLabel, weakestAvg, coachRecommendation } = profile;

  // Truncate recommendation for compact card (2 sentences max)
  const shortRec = coachRecommendation
    ? coachRecommendation.split('. ').slice(0, 2).join('. ') + (coachRecommendation.split('. ').length > 2 ? '.' : '')
    : '';

  return (
    <div className="card" style={{ borderTop: '2px solid var(--color-gold)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={16} color="var(--color-gold)" />
          </div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Coach</span>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate('/profile')}
          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
        >
          Full Profile <ChevronRight size={12} />
        </button>
      </div>

      {/* Skill rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
        {/* Strongest */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={13} color="var(--color-success)" fill="var(--color-success)" />
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 1 }}>Strongest skill</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{strongestLabel}</p>
            </div>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-success)' }}>
            {strongestAvg}<span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/10</span>
          </span>
        </div>

        {/* Weakest */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Target size={13} color="var(--color-warning)" />
            <div>
              <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: 1 }}>Focus area</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{weakestLabel}</p>
            </div>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-warning)' }}>
            {weakestAvg}<span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/10</span>
          </span>
        </div>
      </div>

      {/* Short recommendation */}
      {shortRec && (
        <p style={{ fontSize: '0.825rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, fontStyle: 'italic', marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-border)' }}>
          "{shortRec}"
        </p>
      )}

      {/* CTA */}
      <button
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={handlePracticeWeakness}
      >
        <Zap size={15} />
        Practice My Weakness
      </button>
    </div>
  );
}
