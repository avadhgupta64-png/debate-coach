import React, { useMemo, useRef } from 'react';
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
  PlayCircle,
  Trash2,
  Zap,
  Brain,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { useDebateHistory } from '../hooks/useDebateHistory.js';
import { useDraftDebate } from '../hooks/useDraftDebate.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import PositionBadge from '../components/PositionBadge.jsx';
import CoachCard from '../components/CoachCard.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useSignInModal } from '../App.jsx';
import { useDebate } from '../App.jsx';
import HeroCatapultAnimation from '../components/HeroCatapultAnimation.jsx';

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
  const { openSignInModal } = useSignInModal();
  const { history, stats } = useDebateHistory(currentUser?.uid);
  const { loadLatestDraft, clearDraft, hasDraft } = useDraftDebate(currentUser?.uid);
  const { setConfig } = useDebate();
  useDocumentTitle('Dashboard');

  // Randomise +100 badge offset once per mount/reload.
  const scoreOffset = useMemo(() => ({
    x: Math.round((Math.random() - 0.5) * 80),
    y: Math.round(Math.random() * -60 - 10),
  }), []);

  // Ref for the period span — the animation measures its position to fly from
  const periodRef = useRef(null);

  // Draft detection — pick the most recent draft for the resume banner
  const draft = hasDraft() ? loadLatestDraft() : null;

  // Gate: guests must sign in before starting a debate
  const startDebate = () => {
    if (!currentUser) {
      openSignInModal('/setup');
    } else {
      navigate('/setup');
    }
  };

  // Resume a saved draft: restore config into DebateContext then navigate to practice
  const resumeDraft = () => {
    if (!draft) return;
    setConfig(draft.config);
    navigate('/practice');
  };

  const discardDraft = () => {
    if (draft?.draftId) clearDraft(draft.draftId);
    navigate('/', { replace: true });
  };

  // Show the 3 most recent debates
  const recentDebates = history.slice(0, 3);

  return (
    <div className="page-fade">

      {/* ── Draft resume banner ─────────────────────────────────────────────── */}
      {draft && (
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(79,142,247,0.10) 0%, rgba(124,106,245,0.07) 100%)',
            borderBottom: '1px solid rgba(79,142,247,0.18)',
          }}
        >
          <div
            className="container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              padding: 'var(--space-md) var(--space-lg)',
              flexWrap: 'wrap',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary-dim)',
                border: '1px solid rgba(79,142,247,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PlayCircle size={20} color="var(--color-primary)" />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: 2,
                }}
              >
                You have an unfinished debate
              </p>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {draft.config?.topic
                  ? `"${draft.config.topic}" · Round ${draft.round ?? 1} of 5`
                  : `Round ${draft.round ?? 1} of 5`}
                {draft.savedAt
                  ? ` · saved ${timeAgo(draft.savedAt)}`
                  : ''}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexShrink: 0 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={discardDraft}
                style={{ color: 'var(--color-text-muted)' }}
                title="Discard draft"
              >
                <Trash2 size={14} />
                Discard
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={resumeDraft}
              >
                <PlayCircle size={14} />
                Resume
              </button>
            </div>
          </div>
        </div>
      )}

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
                Argue better.{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Own the room
                </span>
                {/*
                  The period is the projectile. The animation hides it via
                  periodRef.current.style.visibility = 'hidden' while a portal
                  clone flies across the screen. Full opacity initially.
                */}
                <span
                  ref={periodRef}
                  aria-hidden="true"
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                  }}
                >.</span>
                {/* Screen-reader-only period so the sentence punctuation is correct */}
                <span className="sr-only">.</span>
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
                Debate a sharp AI opponent, get instant round-by-round coaching, and leave a stronger speaker — in under 30 minutes.
              </p>

              <div className="hero-cta-group" style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={startDebate}
                  style={{ minWidth: 200 }}
                >
                  <Swords size={18} />
                  Start Your First Debate
                  <ArrowRight size={16} />
                </button>
                <button
                  className="btn btn-ghost btn-lg"
                  onClick={() => navigate('/history')}
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <History size={18} />
                  My History
                </button>
              </div>

              {/* Social proof strip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
                {[
                  { icon: <CheckCircle2 size={13} color="var(--color-success)" />, text: 'Free to start' },
                  { icon: <CheckCircle2 size={13} color="var(--color-success)" />, text: 'No prep needed' },
                  { icon: <CheckCircle2 size={13} color="var(--color-success)" />, text: 'Instant feedback' },
                ].map(({ icon, text }) => (
                  <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {icon}{text}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero animation — catapult + target board */}
            <div
              className="hide-mobile"
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HeroCatapultAnimation scoreOffset={scoreOffset} periodRef={periodRef} />
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      {history.length === 0 && (
        <section
          style={{
            padding: 'var(--space-3xl) 0',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
              <p className="section-label">How it works</p>
              <h2
                style={{
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-sm)',
                }}
              >
                From zero to confident debater in 3 steps
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: 440, margin: '0 auto' }}>
                No prep, no partner, no problem. Just pick a topic and go.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 'var(--space-lg)',
                position: 'relative',
              }}
            >
              {[
                {
                  step: 1,
                  icon: <Target size={22} color="var(--color-primary)" />,
                  color: 'var(--color-primary)',
                  title: 'Pick your topic',
                  desc: 'Choose any topic or hit "Suggest a Topic" for an instant pick. Set your position and difficulty.',
                },
                {
                  step: 2,
                  icon: <MessageSquare size={22} color="var(--color-accent)" />,
                  color: 'var(--color-accent)',
                  title: 'Debate the AI',
                  desc: '5 focused rounds against an AI that challenges, presses, and adapts to your arguments in real time.',
                },
                {
                  step: 3,
                  icon: <TrendingUp size={22} color="var(--color-success)" />,
                  color: 'var(--color-success)',
                  title: 'Get your verdict',
                  desc: 'See if you won, get a score breakdown, your key strength, one targeted fix, and a coach note.',
                },
              ].map(({ step, icon, color, title, desc }) => (
                <div
                  key={step}
                  className="card"
                  style={{
                    position: 'relative',
                    paddingTop: 'var(--space-xl)',
                    borderTop: `2px solid ${color}`,
                  }}
                >
                  {/* Step number pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: -14,
                      left: 'var(--space-lg)',
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#fff',
                      boxShadow: `0 0 12px ${color}60`,
                    }}
                  >
                    {step}
                  </div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-md)',
                      background: `${color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    {icon}
                  </div>
                  <h3
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--space-sm)',
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
              <button className="btn btn-primary btn-lg" onClick={startDebate}>
                <Swords size={18} />
                Try your first debate
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Benefits ─────────────────────────────────────────────────────────── */}
      {history.length === 0 && (
        <section style={{ padding: 'var(--space-3xl) 0', borderBottom: '1px solid var(--color-border)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
              <p className="section-label" style={{ display: 'block' }}>Why Debate Coach</p>
              <h2
                style={{
                  fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-sm)',
                }}
              >
                Built for people who want to win arguments
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: 420, margin: '0 auto' }}>
                Not just a chatbot — a structured training system with real feedback.
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 'var(--space-lg)',
              }}
            >
              {[
                {
                  icon: <Brain size={20} color="var(--color-gold)" />,
                  color: 'var(--color-gold)',
                  title: 'Real debate formats',
                  desc: 'Structured rounds mirror school, parliamentary, MUN, and casual practice — so skills transfer to real life.',
                },
                {
                  icon: <Zap size={20} color="var(--color-primary)" />,
                  color: 'var(--color-primary)',
                  title: 'Instant, specific feedback',
                  desc: 'Every response is scored on logic, evidence, clarity, and persuasiveness — with one actionable note per round.',
                },
                {
                  icon: <ShieldCheck size={20} color="var(--color-success)" />,
                  color: 'var(--color-success)',
                  title: 'Track your improvement',
                  desc: 'History, skill scores, and streaks are saved so you can see exactly how far you\'ve come.',
                },
              ].map(({ icon, color, title, desc }) => (
                <div
                  key={title}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-md)',
                    padding: 'var(--space-lg)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderTop: `2px solid ${color}`,
                    borderRadius: 'var(--radius-lg)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: `${color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-xs)',
                      }}
                    >
                      {title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section style={{ padding: 'var(--space-2xl) 0' }}>
        <div className="container">
          <p className="section-label">Your Progress</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 'var(--space-md)',
            }}
          >
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
              value={stats.debatesPracticed > 0 ? `${stats.averageScore}/10` : '—'}
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

      {/* AI Coach Card */}
      <section style={{ padding: 'var(--space-md) 0 var(--space-lg)' }}>
        <div className="container">
          <p className="section-label">Your Coach</p>
          <div style={{ maxWidth: 480 }}>
            <CoachCard />
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
                            (typeof debate.overallScore === 'number' && debate.overallScore > 10 ? debate.overallScore / 10 : debate.overallScore) >= 8
                              ? 'var(--color-success)'
                              : (typeof debate.overallScore === 'number' && debate.overallScore > 10 ? debate.overallScore / 10 : debate.overallScore) >= 6
                              ? 'var(--color-primary)'
                              : 'var(--color-warning)',
                          lineHeight: 1,
                        }}
                      >
                        {typeof debate.overallScore === 'number'
                          ? (debate.overallScore > 10 ? (debate.overallScore / 10).toFixed(1) : debate.overallScore.toFixed(1))
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
              <button className="btn btn-primary" onClick={startDebate}>
                <Swords size={16} />
                Start Your First Debate
              </button>
            </div>
          )}

          {recentDebates.length > 0 && (
            <div
              style={{
                marginTop: 'var(--space-lg)',
                padding: 'var(--space-xl) var(--space-lg)',
                background: 'linear-gradient(135deg, rgba(79,142,247,0.07) 0%, rgba(124,106,245,0.07) 100%)',
                border: '1px solid rgba(79,142,247,0.18)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <p style={{ color: 'var(--color-text-primary)', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
                Ready to push your score higher?
              </p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 'var(--space-lg)' }}>
                Each session sharpens a different skill. Start another debate to keep the streak going.
              </p>
              <button className="btn btn-primary btn-lg" onClick={startDebate}>
                <Swords size={18} />
                Start a New Debate
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
