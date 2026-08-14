import React from 'react';
import {
  ChevronRight,
  MessageSquare,
  Lightbulb,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Star,
} from 'lucide-react';
import ScoreBar from './ScoreBar.jsx';
import { SCORE_LABELS } from '../data/mockData.js';

/**
 * Per-round feedback panel shown after each evaluation.
 * Displays: round score breakdown, coach feedback, model answer, and power keywords.
 */
export default function RoundFeedback({ evalResult, round, totalRounds, onNext, isLastRound }) {
  if (!evalResult) return null;

  const { scores = {}, feedback, strengths = [], weaknesses = [], modelAnswer, keywords = [] } = evalResult;

  const avgScore =
    Object.values(scores).length > 0
      ? Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
      : 0;

  const scoreColor =
    avgScore >= 8
      ? 'var(--color-success)'
      : avgScore >= 6
      ? 'var(--color-primary)'
      : avgScore >= 4
      ? 'var(--color-warning)'
      : 'var(--color-danger)';

  const scorePairs = Object.entries(scores).map(([key, value]) => ({
    key,
    label: SCORE_LABELS[key] || key,
    value,
  }));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-lg)',
        animation: 'fadeUp 0.3s ease',
      }}
    >
      {/* Round header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-md)',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Round {round} — Coach's Review
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                color: scoreColor,
                lineHeight: 1,
              }}
            >
              {avgScore.toFixed(1)}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>/10</span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={onNext}
          style={{ flexShrink: 0 }}
        >
          {isLastRound ? 'See Final Results' : `Round ${round + 1}`}
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Score breakdown */}
      {scorePairs.length > 0 && (
        <div className="card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 'var(--space-md)',
            }}
          >
            <TrendingUp size={14} color="var(--color-primary)" />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Score Breakdown
            </span>
          </div>
          {scorePairs.map((s) => (
            <ScoreBar key={s.key} label={s.label} score={s.value} />
          ))}
        </div>
      )}

      {/* Strengths & Weaknesses row */}
      {(strengths.length > 0 || weaknesses.length > 0) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-md)',
          }}
        >
          {strengths.length > 0 && (
            <div className="card" style={{ borderTop: '2px solid var(--color-success)', padding: 'var(--space-md)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 'var(--space-sm)',
                }}
              >
                <TrendingUp size={13} color="var(--color-success)" />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Strengths
                </span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {strengths.map((s, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 7,
                      fontSize: '0.85rem',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    <Star
                      size={11}
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

          {weaknesses.length > 0 && (
            <div className="card" style={{ borderTop: '2px solid var(--color-warning)', padding: 'var(--space-md)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 'var(--space-sm)',
                }}
              >
                <AlertTriangle size={13} color="var(--color-warning)" />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Weak Spots
                </span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {weaknesses.map((w, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 7,
                      fontSize: '0.85rem',
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
                        marginTop: 6,
                      }}
                    />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Coach feedback */}
      {feedback && (
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
              marginBottom: 'var(--space-sm)',
            }}
          >
            <MessageSquare size={14} color="var(--color-primary)" />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Coach's Notes
            </span>
          </div>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.8,
            }}
          >
            {feedback}
          </p>
        </div>
      )}

      {/* Model Answer */}
      {modelAnswer && (
        <div
          className="card"
          style={{
            borderLeft: '3px solid var(--color-accent)',
            background: 'var(--color-surface)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 'var(--space-sm)',
            }}
          >
            <BookOpen size={14} color="var(--color-accent)" />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Model Answer
            </span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.7rem',
                color: 'var(--color-accent)',
                background: 'var(--color-accent-dim)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
              }}
            >
              Study this
            </span>
          </div>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.8,
              fontStyle: 'italic',
            }}
          >
            "{modelAnswer}"
          </p>
        </div>
      )}

      {/* Power keywords */}
      {keywords.length > 0 && (
        <div className="card" style={{ background: 'var(--color-surface)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 'var(--space-md)',
            }}
          >
            <Lightbulb size={14} color="var(--color-gold)" />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Power Keywords
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-muted)',
                marginLeft: 4,
              }}
            >
              — use these in the next round
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {keywords.map((kw, i) => (
              <span
                key={i}
                style={{
                  padding: '5px 12px',
                  background: 'var(--color-gold-dim)',
                  border: '1px solid rgba(240,180,41,0.2)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--color-gold)',
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Continue button (bottom) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary btn-lg" onClick={onNext}>
          {isLastRound ? 'See Final Results' : `Continue to Round ${round + 1}`}
          <ChevronRight size={18} />
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
