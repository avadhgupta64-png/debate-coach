import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  Flame,
  Award,
  ChevronRight,
  Swords,
  BookOpen,
  ArrowRight,
  History,
  Clock,
} from 'lucide-react';
import { useDebateHistory } from '../hooks/useDebateHistory.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import PositionBadge from '../components/PositionBadge.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const DIFFICULTY_COLORS = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-primary)',
  advanced: 'var(--color-accent)',
  competition: 'var(--color-gold)',
};

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-md)',
        transition: 'border-color var(--transition-base)',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-md)',
          background: color + '18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1 }}>
          {value}
        </p>
        {sub && (
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{sub}</p>
        )}
      </div>
    </div>
  );
}

function timeAgo(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  return `${weeks} weeks ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { history, stats } = useDebateHistory(currentUser?.uid);
  useDocumentTitle('Dashboard');


  // Show the 3 most recent debates
  const recentDebates = history.slice(0, 3);

  return (
    <div className="page-fade">
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-bg) 100%)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-3xl) 0 var(--space-2xl)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-2xl)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ maxWidth: 560 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-dim)',
                  border: '1px solid rgba(79,142,247,0.2)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <Target size={14} color="var(--color-primary)" />
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  AI Debate Training
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.15,
                  marginBottom: 'var(--space-md)',
                }}
              >
                Sharpen your argument.{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Own the room.
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: 'var(--space-xl)',
                  maxWidth: 460,
                }}
              >
                Practice debates, anticipate counterarguments, and become harder to challenge.
              </p>

              <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/setup')}
                >
                  <Swords size={18} />
                  Start a Debate
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => navigate('/history')}
                >
                  <History size={18} />
                  View History
                </button>
              </div>
            </div>

            {/* Visual accent */}
            <div
              className="hide-mobile"
              style={{
                width: 220,
                height: 220,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle at 40% 40%, rgba(79,142,247,0.12), rgba(124,106,245,0.06), transparent 70%)',
                border: '1px solid rgba(79,142,247,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Target size={64} color="rgba(79,142,247,0.3)" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: 'var(--space-2xl) 0' }}>
        <div className="container">
          <p className="section-label">Your Progress</p>
          <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <StatCard
              icon={<Swords size={20} color="var(--color-primary)" />}
              label="Debates Practiced"
              value={stats.debatesPracticed}
              sub="Total sessions"
              color="var(--color-primary)"
            />
            <StatCard
              icon={<TrendingUp size={20} color="var(--color-success)" />}
              label="Average Score"
              value={stats.debatesPracticed > 0 ? `${stats.averageScore}/100` : '—'}
              sub={stats.debatesPracticed > 0 ? 'Across all sessions' : 'No sessions yet'}
              color="var(--color-success)"
            />
            <StatCard
              icon={<Award size={20} color="var(--color-gold)" />}
              label="Strongest Skill"
              value={stats.strongestSkill}
              sub={stats.debatesPracticed > 0 ? 'Keep it up' : 'Complete a session'}
              color="var(--color-gold)"
            />
            <StatCard
              icon={<Flame size={20} color="var(--color-danger)" />}
              label="Current Streak"
              value={`${stats.currentStreak} day${stats.currentStreak !== 1 ? 's' : ''}`}
              sub="Stay consistent"
              color="var(--color-danger)"
            />
          </div>
        </div>
      </section>

      {/* Recent Debates */}
      <section style={{ padding: 'var(--space-md) 0 var(--space-2xl)' }}>
        <div className="container">
          <div className="flex-between" style={{ marginBottom: 'var(--space-lg)' }}>
            <p className="section-label" style={{ marginBottom: 0 }}>Recent Debates</p>
            {history.length > 3 && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/history')}
              >
                View all <ArrowRight size={14} />
              </button>
            )}
          </div>

          {recentDebates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {recentDebates.map((debate) => (
                <div
                  key={debate.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                    cursor: 'pointer',
                    transition: 'border-color var(--transition-base)',
                    flexWrap: 'wrap',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  onClick={() => navigate('/history')}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        marginBottom: 6,
                        fontSize: '0.95rem',
                      }}
                    >
                      {debate.topic}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        flexWrap: 'wrap',
                      }}
                    >
                      <PositionBadge position={debate.position} />
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: DIFFICULTY_COLORS[debate.difficulty] || 'var(--color-text-muted)',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {debate.difficulty}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        <Clock size={11} />
                        {timeAgo(debate.completedAt)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: 700,
                          color:
                            debate.overallScore >= 8
                              ? 'var(--color-success)'
                              : debate.overallScore >= 6
                              ? 'var(--color-primary)'
                              : 'var(--color-warning)',
                          lineHeight: 1,
                        }}
                      >
                        {typeof debate.overallScore === 'number'
                          ? debate.overallScore.toFixed(1)
                          : '—'}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                        /10
                      </p>
                    </div>
                    <ChevronRight size={16} color="var(--color-text-muted)" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div
              style={{
                padding: 'var(--space-3xl) var(--space-lg)',
                background: 'var(--color-surface)',
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <Swords size={40} color="var(--color-text-muted)" style={{ marginBottom: 'var(--space-md)', opacity: 0.4 }} />
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
                No debates yet
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>
                Complete your first session — your scores and history will appear here.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/setup')}>
                <Swords size={16} />
                Start Your First Debate
              </button>
            </div>
          )}

          {recentDebates.length > 0 && (
            <div
              style={{
                marginTop: 'var(--space-lg)',
                padding: 'var(--space-lg)',
                background: 'var(--color-surface)',
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
                Ready to push further?
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/setup')}>
                <Swords size={16} />
                Start a New Debate
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
