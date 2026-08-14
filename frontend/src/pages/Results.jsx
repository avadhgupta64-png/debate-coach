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
} from 'lucide-react';
import { useDebate } from '../App.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import ScoreBar from '../components/ScoreBar.jsx';
import PositionBadge from '../components/PositionBadge.jsx';
import { SCORE_LABELS } from '../data/mockData.js';
import { useDebateHistory } from '../hooks/useDebateHistory.js';

function ScoreCircle({ score }) {
  const color =
    score >= 8 ? 'var(--color-success)' :
    score >= 6 ? 'var(--color-primary)' :
    score >= 4 ? 'var(--color-warning)' :
    'var(--color-danger)';

  const grade =
    score >= 9 ? 'A+' :
    score >= 8 ? 'A' :
    score >= 7 ? 'B+' :
    score >= 6 ? 'B' :
    score >= 5 ? 'C' : 'D';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-sm)',
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: `4px solid ${color}`,
          boxShadow: `0 0 30px ${color}40`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${color}10`,
        }}
      >
        <span
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color,
            lineHeight: 1,
          }}
        >
          {typeof score === 'number' ? score.toFixed(1) : score}
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
          out of 10
        </span>
      </div>
      <div
        style={{
          padding: '4px 14px',
          background: `${color}15`,
          borderRadius: 'var(--radius-full)',
          fontSize: '0.85rem',
          fontWeight: 700,
          color,
        }}
      >
        Grade: {grade}
      </div>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const { debate, reset } = useDebate();
  const { saveDebate } = useDebateHistory();
  const results = debate.results;
  const config = debate.config;
  const savedRef = useRef(false);
  useDocumentTitle('Debate Results');

  // Save to history once when results first load
  useEffect(() => {
    if (!results || !config || savedRef.current) return;
    if (results.mode === 'error') return; // don't save failed sessions
    savedRef.current = true;
    saveDebate({
      topic: config.topic,
      position: config.position,
      difficulty: config.difficulty,
      debateType: config.debateType,
      overallScore: results.overallScore,
      scores: results.scores,
      strengths: results.strengths,
      weaknesses: results.weaknesses,
      feedback: results.feedback,
      coachNote: results.coachNote,
      mode: results.mode,
      rounds: 5,
      conversationHistory: results.conversationHistory || [],
    });
  }, [results, config, saveDebate]);

  if (!results || !config) {
    return (
      <div className="page-fade" style={{ textAlign: 'center', padding: 'var(--space-3xl)' }}>
        <Target size={48} color="var(--color-text-muted)" style={{ marginBottom: 'var(--space-lg)' }} />
        <h2 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>No results yet</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
          Complete a practice session to see your results.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/setup')}>
          Start a Debate
        </button>
      </div>
    );
  }

  const scores = results.scores || {};
  const scorePairs = Object.entries(scores).map(([key, value]) => ({
    key,
    label: SCORE_LABELS[key] || key,
    value,
  }));

  const handlePracticeAgain = () => {
    navigate('/practice');
  };

  const handleNewDebate = () => {
    reset();
    navigate('/setup');
  };

  return (
    <div className="page-fade">
      <div className="container-narrow">
        <div className="page-content">
          {/* Header */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 'var(--space-2xl)',
              paddingBottom: 'var(--space-2xl)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-gold-dim)',
                border: '1px solid rgba(240,180,41,0.2)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              <Trophy size={14} color="var(--color-gold)" />
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--color-gold)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Session Complete
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              Your Results
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
                flexWrap: 'wrap',
                marginBottom: 'var(--space-xl)',
              }}
            >
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.9rem',
                  maxWidth: 400,
                }}
              >
                {config.topic}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-xl)',
                flexWrap: 'wrap',
              }}
            >
              <PositionBadge position={config.position} size="sm" />
              <span className="badge badge-muted" style={{ textTransform: 'capitalize' }}>
                {config.difficulty}
              </span>
              {results.mode && (
                <span className={`badge ${results.mode === 'demo' ? 'badge-gold' : 'badge-green'}`}>
                  {results.mode === 'demo' ? 'Demo Mode' : 'AI Evaluated'}
                </span>
              )}
            </div>

            <ScoreCircle score={results.overallScore || 0} />
          </div>

          {/* Score Breakdown */}
          {scorePairs.length > 0 && (
            <section style={{ marginBottom: 'var(--space-2xl)' }}>
              <p className="section-label">Score Breakdown</p>
              <div className="card">
                {scorePairs.map((s) => (
                  <ScoreBar key={s.key} label={s.label} score={s.value} />
                ))}
              </div>
            </section>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid-2" style={{ marginBottom: 'var(--space-2xl)' }}>
            {/* Strengths */}
            {results.strengths?.length > 0 && (
              <div className="card" style={{ borderTop: '2px solid var(--color-success)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  <TrendingUp size={16} color="var(--color-success)" />
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                    Your Strengths
                  </h3>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {results.strengths.map((s, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      <Star
                        size={12}
                        color="var(--color-success)"
                        fill="var(--color-success)"
                        style={{ flexShrink: 0, marginTop: 3 }}
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {results.weaknesses?.length > 0 && (
              <div className="card" style={{ borderTop: '2px solid var(--color-warning)' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  <AlertTriangle size={16} color="var(--color-warning)" />
                  <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                    Weak Spots
                  </h3>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {results.weaknesses.map((w, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'var(--color-warning)',
                          flexShrink: 0,
                          marginTop: 7,
                        }}
                      />
                      {w}
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
              <div
                className="card"
                style={{
                  borderLeft: '3px solid var(--color-primary)',
                  background: 'var(--color-surface)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  <MessageSquare size={16} color="var(--color-primary)" />
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Detailed Feedback
                  </span>
                </div>
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                    fontSize: '0.95rem',
                    marginBottom: results.coachNote ? 'var(--space-md)' : 0,
                  }}
                >
                  {results.feedback}
                </p>
                {results.coachNote && (
                  <div
                    style={{
                      padding: '10px 14px',
                      background: 'var(--color-primary-dim)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem',
                      color: 'var(--color-primary)',
                      fontStyle: 'italic',
                    }}
                  >
                    {results.coachNote}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-md)',
              justifyContent: 'center',
              flexWrap: 'wrap',
              paddingTop: 'var(--space-lg)',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              <Home size={16} />
              Dashboard
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/history')}>
              <History size={16} />
              View History
            </button>
            <button className="btn btn-secondary" onClick={handlePracticeAgain}>
              <RefreshCw size={16} />
              Practice Again
            </button>
            <button className="btn btn-primary btn-lg" onClick={handleNewDebate}>
              <Plus size={18} />
              New Debate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
