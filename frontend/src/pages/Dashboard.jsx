import React, { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  TrendingUp,
  Flame,
  Award,
  ChevronRight,
  Swords,
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
  Sparkles,
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
    <div className="stat-card">
      <div className="stat-card__icon" style={{ '--stat-color': color }}>
        {icon}
      </div>
      <div className="stat-card__body">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
        {sub && <p className="stat-card__sub">{sub}</p>}
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

function scoreColor(score) {
  if (score >= 8) return 'var(--color-success)';
  if (score >= 6) return 'var(--color-primary)';
  return 'var(--color-warning)';
}

function normalizeScore(raw) {
  if (typeof raw !== 'number') return null;
  return raw > 10 ? raw / 10 : raw;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { openSignInModal } = useSignInModal();
  const { history, stats } = useDebateHistory(currentUser?.uid);
  const { loadLatestDraft, clearDraft, hasDraft } = useDraftDebate(currentUser?.uid);
  const { setConfig } = useDebate();
  useDocumentTitle('Dashboard');

  const scoreOffset = useMemo(() => ({
    x: Math.round((Math.random() - 0.5) * 80),
    y: Math.round(Math.random() * -60 - 10),
  }), []);

  const periodRef = useRef(null);
  const draft = hasDraft() ? loadLatestDraft() : null;
  const recentDebates = history.slice(0, 3);
  const isNewUser = history.length === 0;

  const startDebate = () => {
    if (!currentUser) openSignInModal('/setup');
    else navigate('/setup');
  };

  const resumeDraft = () => {
    if (!draft) return;
    setConfig(draft.config);
    navigate('/practice');
  };

  const discardDraft = () => {
    if (draft?.draftId) clearDraft(draft.draftId);
    navigate('/', { replace: true });
  };

  return (
    <div className="page-fade dashboard">

      {/* ── Draft Resume Banner ──────────────────────────────────────────────── */}
      {draft && (
        <div className="draft-banner">
          <div className="container draft-banner__inner">
            <div className="draft-banner__icon">
              <PlayCircle size={18} color="var(--color-primary)" />
            </div>
            <div className="draft-banner__text">
              <p className="draft-banner__title">Unfinished debate</p>
              <p className="draft-banner__sub">
                {draft.config?.topic ? `"${draft.config.topic}" · ` : ''}
                Round {draft.round ?? 1} of 5
                {draft.savedAt ? ` · saved ${timeAgo(draft.savedAt)}` : ''}
              </p>
            </div>
            <div className="draft-banner__actions">
              <button className="btn btn-ghost btn-sm" onClick={discardDraft}>
                <Trash2 size={13} /> Discard
              </button>
              <button className="btn btn-primary btn-sm" onClick={resumeDraft}>
                <PlayCircle size={13} /> Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-section__bg" aria-hidden="true" />
        <div className="container hero-section__inner">

          {/* Left column */}
          <div className="hero-section__content">
            <div className="hero-pill">
              <Sparkles size={13} color="var(--color-primary)" />
              <span>AI Debate Training</span>
            </div>

            <h1 className="hero-heading">
              Argue better.{' '}
              <span className="hero-heading__gradient">
                Own the room
              </span>
              <span
                ref={periodRef}
                aria-hidden="true"
                className="hero-heading__gradient hero-period"
              >.</span>
              <span className="sr-only">.</span>
            </h1>

            <p className="hero-subtext">
              Debate a sharp AI opponent, get instant round-by-round coaching, and leave a stronger speaker — in under 30 minutes.
            </p>

            <div className="hero-cta-group">
              <button className="btn btn-primary btn-lg hero-cta-primary" onClick={startDebate}>
                <Swords size={18} />
                Start Your First Debate
                <ArrowRight size={16} />
              </button>
              <button
                className="btn btn-ghost btn-lg"
                onClick={() => navigate('/history')}
              >
                <History size={17} />
                My History
              </button>
            </div>

            <div className="hero-proof">
              {[
                { text: 'Free to start' },
                { text: 'No prep needed' },
                { text: 'Instant feedback' },
              ].map(({ text }) => (
                <span key={text} className="hero-proof__item">
                  <CheckCircle2 size={13} color="var(--color-success)" />
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — animation */}
          <div className="hero-section__visual hide-mobile">
            <HeroCatapultAnimation scoreOffset={scoreOffset} periodRef={periodRef} />
          </div>
        </div>
      </section>

      {/* ── How it works (new users only) ───────────────────────────────────── */}
      {isNewUser && (
        <section className="section section--bordered">
          <div className="container">
            <div className="section-header">
              <p className="section-label">How it works</p>
              <h2 className="section-title">From zero to confident debater in 3 steps</h2>
              <p className="section-desc">No prep, no partner, no problem. Just pick a topic and go.</p>
            </div>

            <div className="steps-grid">
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
                <div key={step} className="step-card" style={{ '--step-color': color }}>
                  <div className="step-card__number">{step}</div>
                  <div className="step-card__icon-wrap">{icon}</div>
                  <h3 className="step-card__title">{title}</h3>
                  <p className="step-card__desc">{desc}</p>
                </div>
              ))}
            </div>

            <div className="section-cta">
              <button className="btn btn-primary btn-lg" onClick={startDebate}>
                <Swords size={18} />
                Try your first debate
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Benefits (new users only) ────────────────────────────────────────── */}
      {isNewUser && (
        <section className="section section--bordered">
          <div className="container">
            <div className="section-header">
              <p className="section-label">Why Debate Coach</p>
              <h2 className="section-title">Built for people who want to win arguments</h2>
              <p className="section-desc">Not just a chatbot — a structured training system with real feedback.</p>
            </div>

            <div className="benefits-grid">
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
                  desc: "History, skill scores, and streaks are saved so you can see exactly how far you've come.",
                },
              ].map(({ icon, color, title, desc }) => (
                <div key={title} className="benefit-card" style={{ '--benefit-color': color }}>
                  <div className="benefit-card__icon-wrap">{icon}</div>
                  <div>
                    <h3 className="benefit-card__title">{title}</h3>
                    <p className="benefit-card__desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Stats ────────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <p className="section-label">Your Progress</p>
          <div className="stats-grid">
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

      {/* ── AI Coach ─────────────────────────────────────────────────────────── */}
      <section className="section section--compact">
        <div className="container">
          <p className="section-label">Your Coach</p>
          <div className="coach-card-wrap">
            <CoachCard />
          </div>
        </div>
      </section>

      {/* ── Recent Debates ───────────────────────────────────────────────────── */}
      <section className="section section--bottom">
        <div className="container">
          <div className="section-row">
            <p className="section-label" style={{ marginBottom: 0 }}>Recent Debates</p>
            {history.length > 3 && (
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/history')}>
                View all <ArrowRight size={14} />
              </button>
            )}
          </div>

          {recentDebates.length > 0 ? (
            <div className="debates-list">
              {recentDebates.map((debate) => {
                const score = normalizeScore(debate.overallScore);
                return (
                  <div
                    key={debate.id}
                    className="debate-row"
                    onClick={() => navigate('/history')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/history')}
                  >
                    <div className="debate-row__main">
                      <p className="debate-row__topic">{debate.topic}</p>
                      <div className="debate-row__meta">
                        <PositionBadge position={debate.position} />
                        <span
                          className="debate-row__difficulty"
                          style={{ color: DIFFICULTY_COLORS[debate.difficulty] || 'var(--color-text-muted)' }}
                        >
                          {debate.difficulty}
                        </span>
                        <span className="debate-row__time">
                          <Clock size={11} />
                          {timeAgo(debate.completedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="debate-row__score">
                      <span
                        className="debate-row__score-value"
                        style={{ color: score ? scoreColor(score) : 'var(--color-text-muted)' }}
                      >
                        {score !== null ? score.toFixed(1) : '—'}
                      </span>
                      <span className="debate-row__score-denom">/10</span>
                      <ChevronRight size={15} color="var(--color-text-muted)" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">
                <Swords size={32} color="var(--color-text-muted)" />
              </div>
              <p className="empty-state__title">No debates yet</p>
              <p className="empty-state__desc">
                Complete your first session — your scores and history will appear here.
              </p>
              <button className="btn btn-primary" onClick={startDebate}>
                <Swords size={16} />
                Start Your First Debate
              </button>
            </div>
          )}

          {recentDebates.length > 0 && (
            <div className="cta-banner">
              <div className="cta-banner__text">
                <p className="cta-banner__title">Ready to push your score higher?</p>
                <p className="cta-banner__desc">
                  Each session sharpens a different skill. Start another debate to keep the streak going.
                </p>
              </div>
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
