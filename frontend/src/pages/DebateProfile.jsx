import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Award,
  AlertTriangle,
  BookOpen,
  Swords,
  ChevronRight,
  Minus,
  Star,
  BarChart2,
  Lightbulb,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useDebateProfile, buildWeaknessChallenge } from '../hooks/useDebateProfile.js';
import { useDebate } from '../App.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import ScoreBar from '../components/ScoreBar.jsx';

// ─── Skill tier label ─────────────────────────────────────────────────────────

function skillTier(avg) {
  if (avg >= 8.5) return { label: 'Exceptional', color: 'var(--color-gold)' };
  if (avg >= 7.5) return { label: 'Strong', color: 'var(--color-success)' };
  if (avg >= 6.5) return { label: 'Solid', color: 'var(--color-primary)' };
  if (avg >= 5.5) return { label: 'Developing', color: 'var(--color-warning)' };
  return { label: 'Needs Work', color: 'var(--color-danger)' };
}

// ─── Trend Arrow ──────────────────────────────────────────────────────────────

function TrendBadge({ direction, pct }) {
  if (direction === 'stable') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-text-muted)', padding: '2px 8px', background: 'var(--color-surface-3)', borderRadius: 'var(--radius-full)' }}>
        <Minus size={10} />
        Stable
      </span>
    );
  }
  if (direction === 'up') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-success)', padding: '2px 8px', background: 'rgba(52,211,153,0.1)', borderRadius: 'var(--radius-full)' }}>
        <ArrowUp size={10} />
        +{pct}%
      </span>
    );
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.72rem', fontWeight: 600, color: 'var(--color-danger)', padding: '2px 8px', background: 'rgba(248,113,113,0.1)', borderRadius: 'var(--radius-full)' }}>
      <ArrowDown size={10} />
      -{pct}%
    </span>
  );
}

// ─── Rating Circle ────────────────────────────────────────────────────────────

function RatingCircle({ score }) {
  const pct = score * 10;
  const color =
    pct >= 80 ? 'var(--color-success)' :
    pct >= 65 ? 'var(--color-primary)' :
    pct >= 50 ? 'var(--color-warning)' :
    'var(--color-danger)';

  return (
    <div style={{
      width: 110, height: 110, borderRadius: '50%',
      border: `3px solid ${color}`,
      boxShadow: `0 0 28px ${color}35`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: `${color}0d`,
    }}>
      <span style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1 }}>{score.toFixed(1)}</span>
      <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: 2 }}>out of 10</span>
    </div>
  );
}

// ─── Empty / Insufficient States ──────────────────────────────────────────────

function EmptyState({ navigate }) {
  return (
    <div className="page-fade">
      <div className="container-narrow">
        <div className="page-content" style={{ textAlign: 'center', paddingTop: 'var(--space-3xl)' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-xl)' }}>
            <Brain size={36} color="var(--color-text-muted)" />
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
            Your Debate Profile
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', maxWidth: 400, margin: '0 auto var(--space-2xl)', lineHeight: 1.7 }}>
            Complete your first debate to start building your personal Debate Profile. I'll track your skills and identify what to work on.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/setup')}>
            <Swords size={18} />
            Start Your First Debate
          </button>
        </div>
      </div>
    </div>
  );
}

function InsufficientState({ profile, navigate }) {
  const { debateCount, skillAverages, averageScore } = profile;
  const remaining = 3 - debateCount;

  return (
    <div className="page-fade">
      <div className="container-narrow">
        <div className="page-content">
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-dim)', border: '1px solid rgba(79,142,247,0.2)', marginBottom: 'var(--space-lg)' }}>
              <Brain size={14} color="var(--color-primary)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>My Debate Profile</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>
              Building Your Profile
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {debateCount === 1 ? '1 debate completed' : `${debateCount} debates completed`} · {remaining} more needed for full analysis
            </p>
          </div>

          {/* Progress indicator */}
          <div className="card" style={{ marginBottom: 'var(--space-xl)', textAlign: 'center', padding: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: n <= debateCount ? 'var(--color-primary)' : 'var(--color-surface-2)', border: `2px solid ${n <= debateCount ? 'var(--color-primary)' : 'var(--color-border)'}`, fontWeight: 700, fontSize: '1rem', color: n <= debateCount ? '#fff' : 'var(--color-text-muted)' }}>
                  {n <= debateCount ? '✓' : n}
                </div>
              ))}
            </div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>
              {remaining === 1 ? 'One more debate to go!' : `${remaining} more debates to unlock your full profile`}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: 380, margin: '0 auto var(--space-lg)', lineHeight: 1.7 }}>
              Complete a few more debates and I'll start identifying reliable patterns in your performance.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/setup')}>
              <Swords size={16} />
              Practice Now
            </button>
          </div>

          {/* Early stats if any */}
          {averageScore !== null && (
            <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
              <p className="section-label" style={{ marginBottom: 'var(--space-md)' }}>Early Results</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <RatingCircle score={averageScore} />
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>Avg Score</p>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  {Object.entries(skillAverages).slice(0, 4).map(([key, { avg, label }]) => (
                    <ScoreBar key={key} label={label} score={avg} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Full Profile ─────────────────────────────────────────────────────────────

export default function DebateProfile() {
  useDocumentTitle('My Debate Profile');
  const navigate = useNavigate();
  const { setConfig } = useDebate();
  const profile = useDebateProfile();

  // Show spinner while auth/history loads (profile.debateCount would be 0 momentarily)
  // We distinguish by status instead.

  if (profile.status === 'empty') {
    return <EmptyState navigate={navigate} />;
  }

  if (profile.status === 'insufficient') {
    return <InsufficientState profile={profile} navigate={navigate} />;
  }

  const {
    debateCount, averageScore, skillAverages, skillTrends,
    strongestKey, strongestLabel, strongestAvg,
    weakestKey, weakestLabel, weakestAvg,
    improvingSkills, decliningSkills,
    coachRecommendation, recentTrend,
  } = profile;

  // Sort skills by average descending for display
  const sortedSkills = Object.entries(skillAverages)
    .sort((a, b) => b[1].avg - a[1].avg);

  const handlePracticeWeakness = () => {
    if (!weakestKey) return;
    const challenge = buildWeaknessChallenge(weakestKey);
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

  const recentTrendColor = recentTrend === 'up' ? 'var(--color-success)' : recentTrend === 'down' ? 'var(--color-danger)' : 'var(--color-text-muted)';
  const RecentTrendIcon = recentTrend === 'up' ? TrendingUp : recentTrend === 'down' ? TrendingDown : Minus;

  return (
    <div className="page-fade">
      <div className="container-narrow">
        <div className="page-content">

          {/* ── Page Header ──────────────────────────────────────────────── */}
          <div style={{ marginBottom: 'var(--space-2xl)', paddingBottom: 'var(--space-xl)', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-dim)', border: '1px solid rgba(79,142,247,0.2)', marginBottom: 'var(--space-lg)' }}>
              <Brain size={14} color="var(--color-primary)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>My Debate Profile</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>
              Personal Performance Analysis
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Based on {debateCount} completed debate{debateCount !== 1 ? 's' : ''}
            </p>
          </div>

          {/* ── Overview Row ──────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
            {/* Overall Rating */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Overall Rating</p>
              <RatingCircle score={averageScore} />
              {recentTrend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: recentTrendColor }}>
                  <RecentTrendIcon size={13} />
                  <span style={{ fontWeight: 600 }}>
                    {recentTrend === 'up' ? 'Improving' : recentTrend === 'down' ? 'Slipping' : 'Stable'}
                  </span>
                </div>
              )}
            </div>

            {/* Strongest Skill */}
            <div className="card" style={{ borderTop: '2px solid var(--color-success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                <Star size={15} color="var(--color-success)" fill="var(--color-success)" />
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Strongest Skill</p>
              </div>
              <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>{strongestLabel}</p>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-success)', lineHeight: 1 }}>{strongestAvg}<span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/10</span></p>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>Keep leveraging this</p>
            </div>

            {/* Weakest Skill */}
            <div className="card" style={{ borderTop: '2px solid var(--color-warning)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                <Target size={15} color="var(--color-warning)" />
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Focus Area</p>
              </div>
              <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>{weakestLabel}</p>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-warning)', lineHeight: 1 }}>{weakestAvg}<span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/10</span></p>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>Biggest opportunity for growth</p>
            </div>
          </div>

          {/* ── Skill Breakdown ──────────────────────────────────────────── */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Skill Breakdown</p>
            <div className="card">
              {sortedSkills.map(([key, { avg, label }]) => {
                const trend = skillTrends[key];
                const tier = skillTier(avg);
                return (
                  <div key={key} style={{ marginBottom: 'var(--space-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{label}</span>
                        {key === strongestKey && (
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-success)', background: 'rgba(52,211,153,0.1)', padding: '1px 7px', borderRadius: 'var(--radius-full)' }}>Best</span>
                        )}
                        {key === weakestKey && (
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-warning)', background: 'rgba(251,191,36,0.1)', padding: '1px 7px', borderRadius: 'var(--radius-full)' }}>Focus</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {trend && <TrendBadge direction={trend.direction} pct={trend.pct} />}
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: tier.color, minWidth: 72, textAlign: 'right' }}>{tier.label}</span>
                      </div>
                    </div>
                    <ScoreBar label="" score={avg} />
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Trends Section ────────────────────────────────────────────── */}
          {(improvingSkills.length > 0 || decliningSkills.length > 0) && (
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
              <p className="section-label">Trends</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-md)' }}>
                {improvingSkills.length > 0 && (
                  <div className="card" style={{ borderLeft: '3px solid var(--color-success)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                      <TrendingUp size={15} color="var(--color-success)" />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Improving</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {improvingSkills.map(({ key, label, pct }) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{label}</span>
                          <TrendBadge direction="up" pct={pct} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {decliningSkills.length > 0 && (
                  <div className="card" style={{ borderLeft: '3px solid var(--color-danger)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                      <TrendingDown size={15} color="var(--color-danger)" />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Needs Attention</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {decliningSkills.map(({ key, label, pct }) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{label}</span>
                          <TrendBadge direction="down" pct={pct} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Coach's Focus ─────────────────────────────────────────────── */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Your Coach's Focus</p>
            <div className="card" style={{ borderLeft: '3px solid var(--color-gold)', background: 'linear-gradient(135deg, rgba(240,180,41,0.05) 0%, var(--color-surface) 100%)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Lightbulb size={22} color="var(--color-gold)" />
                </div>
                <div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>AI Coach</p>
                  <p style={{ fontSize: '0.975rem', color: 'var(--color-text-primary)', lineHeight: 1.75, fontStyle: 'italic' }}>
                    "{coachRecommendation}"
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Practice My Weakness ─────────────────────────────────────── */}
          {weakestKey && (
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
              <div style={{ padding: 'var(--space-xl)', background: 'linear-gradient(135deg, rgba(79,142,247,0.07) 0%, rgba(124,106,245,0.05) 100%)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-primary-dim)', border: '1px solid rgba(79,142,247,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)' }}>
                  <Zap size={24} color="var(--color-primary)" />
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>
                  Ready to strengthen your {weakestLabel}?
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto var(--space-xl)', lineHeight: 1.7 }}>
                  {buildWeaknessChallenge(weakestKey).focusNote}
                </p>
                <button className="btn btn-primary btn-lg" onClick={handlePracticeWeakness}>
                  <Swords size={18} />
                  Practice My Weakness
                  <ChevronRight size={18} />
                </button>
              </div>
            </section>
          )}

          {/* ── Debate History Summary ────────────────────────────────────── */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
              <p className="section-label" style={{ marginBottom: 0 }}>Recent Debates</p>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/history')}>
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {profile.history.slice(0, 5).map((debate, i) => {
                const score = typeof debate.overallScore === 'number'
                  ? (debate.overallScore > 10 ? debate.overallScore / 10 : debate.overallScore)
                  : null;
                const scoreColor = score === null ? 'var(--color-text-muted)' : score >= 8 ? 'var(--color-success)' : score >= 6 ? 'var(--color-primary)' : 'var(--color-warning)';
                return (
                  <div key={debate.id || i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.875rem', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{debate.topic}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>{debate.difficulty} · {debate.position}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: scoreColor }}>{score !== null ? score.toFixed(1) : '—'}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>/10</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
