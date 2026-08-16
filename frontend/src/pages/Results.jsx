import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  RefreshCw,
  Plus,
  Home,
  Star,
  Target,
  History,
  Zap,
  Award,
  TrendingDown,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import { useDebate } from '../App.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import ScoreBar from '../components/ScoreBar.jsx';
import PositionBadge from '../components/PositionBadge.jsx';
import { SCORE_LABELS } from '../data/mockData.js';
import { useDebateHistory } from '../hooks/useDebateHistory.js';
import { useAuth } from '../contexts/AuthContext.jsx';

// ─── Score Circle: always 0-10 scale ─────────────────────────────────────────
// If a legacy 0-100 score somehow reaches here, normalise it to 0-10 first.

function ScoreCircle({ score }) {
  // Normalise: anything above 10 is still on the 0-100 scale
  const normalisedScore = typeof score === 'number' && score > 10 ? score / 10 : (score ?? 0);

  // Convert to 0-100 range purely for colour/grade thresholds
  const pct = normalisedScore * 10;

  const color =
    pct >= 80 ? 'var(--color-success)' :
    pct >= 60 ? 'var(--color-primary)' :
    pct >= 40 ? 'var(--color-warning)' :
    'var(--color-danger)';

  const grade =
    pct >= 95 ? 'A+' :
    pct >= 85 ? 'A'  :
    pct >= 75 ? 'B+' :
    pct >= 65 ? 'B'  :
    pct >= 50 ? 'C'  : 'D';

  const display = normalisedScore.toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
      <div style={{ width: 130, height: 130, borderRadius: '50%', border: `4px solid ${color}`, boxShadow: `0 0 36px ${color}40`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `${color}10` }}>
        <span style={{ fontSize: '2.2rem', fontWeight: 800, color, lineHeight: 1 }}>{display}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>out of 10</span>
      </div>
      <div style={{ padding: '4px 14px', background: `${color}15`, borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 700, color }}>
        Grade: {grade}
      </div>
    </div>
  );
}

// ─── Highlight Card ────────────────────────────────────────────────────────────

function HighlightCard({ icon, color, label, text }) {
  if (!text) return null;
  return (
    <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface-2)', border: `1px solid ${color}30`, borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ color }}>{icon}</span>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

// ─── Fallacy Card ─────────────────────────────────────────────────────────────

function FallacyCard({ fallacy, index }) {
  const isDefinite = fallacy.confidence === 'definite';
  const color = isDefinite ? 'var(--color-danger)' : 'var(--color-warning)';

  return (
    <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface-2)', border: `1px solid ${color}25`, borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {fallacy.fallacyName}
        </span>
        <span style={{ padding: '2px 8px', background: `${color}15`, borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700, color, border: `1px solid ${color}30` }}>
          {isDefinite ? 'Detected' : 'Potential'}
        </span>
      </div>
      {fallacy.statement && (
        <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: 10, borderLeft: '2px solid var(--color-border)' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>"{fallacy.statement}"</p>
        </div>
      )}
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{fallacy.explanation}</p>
      {fallacy.improvement && (
        <div style={{ display: 'flex', gap: 8, padding: '8px 12px', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: 'var(--radius-sm)' }}>
          <Lightbulb size={14} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{fallacy.improvement}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Results() {
  const navigate = useNavigate();
  const { debate, reset } = useDebate();
  const { currentUser } = useAuth();
  const { saveDebate } = useDebateHistory(currentUser?.uid);
  const results = debate.results;
  const config = debate.config;
  const savedRef = useRef(false);
  useDocumentTitle('Debate Results');

  useEffect(() => {
    if (!results || !config || savedRef.current) return;
    if (results.mode === 'error') return;
    savedRef.current = true;
    // Normalise all scores to 0-10 before saving to localStorage
    const normScores = results.scores
      ? Object.fromEntries(
          Object.entries(results.scores).map(([k, v]) => [k, typeof v === 'number' && v > 10 ? v / 10 : v])
        )
      : {};
    const normOverall = typeof results.overallScore === 'number' && results.overallScore > 10
      ? results.overallScore / 10
      : (results.overallScore ?? 0);
    saveDebate({
      topic: config.topic,
      position: config.position,
      difficulty: config.difficulty,
      debateType: config.debateType,
      overallScore: normOverall,
      scores: normScores,
      strengths: results.strengths,
      weaknesses: results.weaknesses,
      feedback: results.feedback,
      coachNote: results.coachNote,
      mode: results.mode,
      rounds: 5,
      conversationHistory: results.conversationHistory || [],
      detectedFallacies: results.detectedFallacies || [],
    });
  }, [results, config, saveDebate]);

  if (!results || !config) {
    return (
      <div className="page-fade" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Target size={48} color="var(--color-text-muted)" style={{ marginBottom: 'var(--space-lg)' }} />
        <h2 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>No results yet</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>Complete a practice session to see your results.</p>
        <button className="btn btn-primary" onClick={() => navigate('/setup')}>Start a Debate</button>
      </div>
    );
  }

  const scores = results.scores || {};
  const scorePairs = Object.entries(scores)
    .filter(([, v]) => typeof v === 'number')
    .map(([key, value]) => ({
      key,
      label: SCORE_LABELS[key] || key,
      // Normalise each individual score: if > 10 it is on the 0-100 scale
      value: value > 10 ? value / 10 : value,
    }));

  // Normalise overall score: backend returns 0-100, display as 0-10
  const normalisedOverall = typeof results.overallScore === 'number' && results.overallScore > 10
    ? results.overallScore / 10
    : (results.overallScore ?? 0);

  const fallacies = results.detectedFallacies || [];

  return (
    <div className="page-fade">
      <div className="container-narrow">
        <div className="page-content">

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 'var(--radius-full)', background: 'var(--color-gold-dim)', border: '1px solid rgba(240,180,41,0.2)', marginBottom: 'var(--space-lg)' }}>
              <Trophy size={14} color="var(--color-gold)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Session Complete</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>Your Results</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: 480, margin: '0 auto var(--space-lg)' }}>{config.topic}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
              <PositionBadge position={config.position} size="sm" />
              <span className="badge badge-muted" style={{ textTransform: 'capitalize' }}>{config.difficulty}</span>
              {results.mode && (
                <span className={`badge ${results.mode === 'demo' ? 'badge-gold' : 'badge-green'}`}>
                  {results.mode === 'demo' ? 'Demo Mode' : 'AI Evaluated'}
                </span>
              )}
            </div>
            <ScoreCircle score={normalisedOverall} />
          </div>

          {/* Score Breakdown */}
          {scorePairs.length > 0 && (
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
              <p className="section-label">Score Breakdown</p>
              <div className="card">
                {scorePairs.map((s) => <ScoreBar key={s.key} label={s.label} score={s.value} />)}
              </div>
            </section>
          )}

          {/* Highlights Grid */}
          {(results.strongestMoment || results.weakestMoment || results.bestArgument || results.biggestMissedOpportunity) && (
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
              <p className="section-label">Debate Highlights</p>
              <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-md)' }}>
                <HighlightCard icon={<Zap size={16} />} color="var(--color-success)" label="Strongest Moment" text={results.strongestMoment} />
                <HighlightCard icon={<TrendingDown size={16} />} color="var(--color-warning)" label="Weakest Moment" text={results.weakestMoment} />
                <HighlightCard icon={<Award size={16} />} color="var(--color-primary)" label="Best Argument" text={results.bestArgument} />
                <HighlightCard icon={<Target size={16} />} color="var(--color-danger)" label="Biggest Missed Opportunity" text={results.biggestMissedOpportunity} />
              </div>
            </section>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid-2" style={{ marginBottom: 'var(--space-2xl)' }}>
            {results.strengths?.length > 0 && (
              <div className="card" style={{ borderTop: '2px solid var(--color-success)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                  <TrendingUp size={16} color="var(--color-success)" />
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Your Strengths</h3>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {results.strengths.map((s, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      <Star size={12} color="var(--color-success)" fill="var(--color-success)" style={{ flexShrink: 0, marginTop: 3 }} />{s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.weaknesses?.length > 0 && (
              <div className="card" style={{ borderTop: '2px solid var(--color-warning)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                  <AlertTriangle size={16} color="var(--color-warning)" />
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Weak Spots</h3>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {results.weaknesses.map((w, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-warning)', flexShrink: 0, marginTop: 7 }} />{w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Coach's Feedback */}
          {results.feedback && (
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
              <p className="section-label">Coach's Feedback</p>
              <div className="card" style={{ borderLeft: '3px solid var(--color-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                  <MessageSquare size={16} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Detailed Feedback</span>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: results.coachNote ? 'var(--space-md)' : 0 }}>
                  {results.feedback}
                </p>
                {results.coachNote && (
                  <div style={{ padding: '10px 14px', background: 'var(--color-primary-dim)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--color-primary)', fontStyle: 'italic' }}>
                    {results.coachNote}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Recommended Next Skill */}
          {results.recommendedNextSkill && (
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 'var(--space-lg)', background: 'rgba(240,180,41,0.07)', border: '1px solid rgba(240,180,41,0.25)', borderRadius: 'var(--radius-md)' }}>
                <Lightbulb size={20} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Recommended Next Skill</p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>{results.recommendedNextSkill}</p>
                </div>
              </div>
            </section>
          )}

          {/* Logical Fallacies */}
          {fallacies.length > 0 && (
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
              <p className="section-label">Logical Fallacy Analysis</p>
              <div style={{ padding: '10px 14px', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.82rem', color: 'var(--color-danger)' }}>
                <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  The following potential logical issues were detected in your arguments. Review each one — improving your reasoning will make your arguments significantly more persuasive.
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {fallacies.map((f, i) => <FallacyCard key={i} fallacy={f} index={i} />)}
              </div>
            </section>
          )}

          {/* No fallacies found */}
          {fallacies.length === 0 && results.mode !== 'error' && (
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'var(--space-md)', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 'var(--radius-md)' }}>
                <Star size={16} color="var(--color-success)" fill="var(--color-success)" />
                <span style={{ fontSize: '0.875rem', color: 'var(--color-success)' }}>No logical fallacies detected in your arguments. Good logical discipline!</span>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border)' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/')}><Home size={16} /> Dashboard</button>
            <button className="btn btn-secondary" onClick={() => navigate('/history')}><History size={16} /> View History</button>
            <button className="btn btn-secondary" onClick={() => navigate('/practice')}><RefreshCw size={16} /> Practice Again</button>
            <button className="btn btn-primary btn-lg" onClick={() => { reset(); navigate('/setup'); }}><Plus size={18} /> New Debate</button>
          </div>
        </div>
      </div>
    </div>
  );
}
