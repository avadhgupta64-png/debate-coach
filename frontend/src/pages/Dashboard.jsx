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
  GraduationCap,
  Mic2,
  Users,
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

      {/* ── About Debate Coach (new homepage content) ────────────────────────── */}
      <section className="section section--bordered">
        <div className="container">
          <div className="section-header">
            <p className="section-label">What is Debate Coach?</p>
            <h2 className="section-title">AI-powered debate training for stronger arguments</h2>
            <p className="section-desc">Debate Coach helps students, competitors, and curious learners practise argumentation, sharpen reasoning, and become confident speakers.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
            <div className="card" style={{ borderLeft: '3px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                What is Debate Coach?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
                Debate Coach is an AI-powered debate training platform. You choose a topic and position, then debate a smart AI opponent across five focused rounds. The AI adapts to your arguments in real time — challenging your reasoning, pressing on weaknesses, and reinforcing your strengths.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                After each round, you receive coaching feedback on clarity, evidence, logic, and rebuttal quality. By the end, you walk away with a clear sense of what worked, what didn't, and exactly how to improve.
              </p>
            </div>

            <div className="card" style={{ borderLeft: '3px solid var(--color-success)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                How AI Debate Practice Works
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-sm)' }}>
                1. <strong style={{ color: 'var(--color-text-primary)' }}>Pick a topic</strong> — Any subject, from school policies to global affairs.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-sm)' }}>
                2. <strong style={{ color: 'var(--color-text-primary)' }}>Prepare briefly</strong> — The AI generates a two-sided briefing so you understand both sides of the argument.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-sm)' }}>
                3. <strong style={{ color: 'var(--color-text-primary)' }}>Debate five rounds</strong> — Each round builds on the last. The AI responds to what you actually say, not generic rebuttals.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-sm)' }}>
                4. <strong style={{ color: 'var(--color-text-primary)' }}>Get coaching feedback</strong> — After every round, specific notes on what to improve.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                5. <strong style={{ color: 'var(--color-text-primary)' }}>Review your results</strong> — See your scores by skill, identify patterns, and track improvement over time.
              </p>
            </div>

            <div className="card" style={{ borderLeft: '3px solid var(--color-accent)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                What You Learn
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" style={{ marginTop: 2 }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Strong argument structure:</strong> Claims, evidence, explanation, and link.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" style={{ marginTop: 2 }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Effective rebuttals:</strong> Identify flaws in reasoning and respond clearly under pressure.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" style={{ marginTop: 2 }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Evidence use:</strong> Choose credible sources and integrate them smoothly.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" style={{ marginTop: 2 }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Logical reasoning:</strong> Spot common fallacies and build arguments that hold up.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" style={{ marginTop: 2 }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Communication clarity:</strong> Express complex ideas in a way others can follow.
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ borderLeft: '3px solid var(--color-gold)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                How AI Feedback Helps
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
                After each debate round, the AI evaluates your performance across four core skills: clarity, evidence, logic, and rebuttals. You receive specific coaching notes — not generic praise.
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>
                For example, instead of "Good job!", you get: "Your evidence was strong, but try to cite the source directly in your response rather than at the end. That makes your point more persuasive."
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                This kind of specific, actionable feedback is what separates good debaters from great ones. You can see your scores improve over time and know exactly what to work on next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who It's For ───────────────────────────────────────────────────────── */}
      <section className="section section--bordered">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Who It's For</p>
            <h2 className="section-title">Whether you compete or just want to argue better</h2>
            <p className="section-desc">Debate Coach is designed for students, competitors, and anyone who values clear thinking and strong communication.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                <GraduationCap size={20} color="var(--color-primary)" />
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>
                Students & Debate Club Members
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                Practice beyond club hours. Try both sides of a motion, drill specific topics, and use feedback to tell your coach exactly where you need help.
              </p>
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                <Mic2 size={20} color="var(--color-accent)" />
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>
                Public Speakers & Presenters
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                The skills that make a good debater — structure, handling objections, delivering evidence confidently — directly transfer to presentations and pitches.
              </p>
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-success-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                <Brain size={20} color="var(--color-success)" />
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>
                Critical Thinkers
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                You don't need to compete to benefit. If you want to think more rigorously, understand both sides of complex issues, or practise constructing evidence-based arguments, this is for you.
              </p>
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-md)' }}>
                <Users size={20} color="var(--color-gold)" />
              </div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>
                Educators
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                Use Debate Coach as a classroom tool for practising argumentation. Students can practise individually between classes and bring better-prepared arguments to discussions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Structured Practice ───────────────────────────────────────────── */}
      <section className="section section--bordered">
        <div className="container">
          <div className="section-header">
            <p className="section-label">Why Structured Debate Practice</p>
            <h2 className="section-title">Because real skill needs real practice</h2>
            <p className="section-desc">Structured debate training builds transferable skills that matter in every academic discipline and professional context.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                Transferable Skills
              </h3>
              <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Critical thinking:</strong> Evaluating claims, spotting flawed reasoning, constructing sound arguments.</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Verbal reasoning:</strong> Building chains of logic that hold under pressure.</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Communication:</strong> Expressing complex ideas clearly and persuasively.</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Research:</strong> Quickly building a case on unfamiliar topics using credible evidence.</li>
              </ul>
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                Real-World Benefits
              </h3>
              <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Academic performance:</strong> Stronger essays, presentations, and class discussions.</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Careeradvantage:</strong> Better pitches, negotiations, and problem-solving.</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Informed citizenship:</strong> Understand both sides of complex issues before forming opinions.</li>
                <li><strong style={{ color: 'var(--color-text-primary)' }}>Confidence:</strong> Speak and think clearly when the stakes are high.</li>
              </ul>
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                Why AI?
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                A human debate partner is ideal, but one that's always available, adapts to your level, gives immediate feedback, and never gets frustrated is incredibly powerful. Debate Coach gives you that advantage.
              </p>
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                No Partner Needed
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                Most people don't have regular access to a debate partner. Debate Coach closes that gap — practice whenever you want, for however long you want, at your own pace.
              </p>
            </div>
          </div>

          <div className="section-cta" style={{ marginTop: 'var(--space-2xl)' }}>
            <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', maxWidth: 480, margin: '0 auto' }}>
              Ready to put these skills into practice? Your first debate is free.
            </p>
            <button className="btn btn-primary btn-lg" onClick={startDebate}>
              <Swords size={18} />
              Start Your First Debate
              <ArrowRight size={16} />
            </button>
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
