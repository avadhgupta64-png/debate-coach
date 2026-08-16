import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  ChevronDown,
  ChevronUp,
  Swords,
  Trophy,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Bot,
  User,
  Trash2,
  Star,
  Clock,
  Target,
  BarChart2,
} from 'lucide-react';
import { useDebateHistory } from '../hooks/useDebateHistory.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import PositionBadge from '../components/PositionBadge.jsx';
import ScoreBar from '../components/ScoreBar.jsx';
import { SCORE_LABELS } from '../data/mockData.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const DIFFICULTY_COLORS = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-primary)',
  advanced: 'var(--color-accent)',
  competition: 'var(--color-gold)',
};

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
  if (weeks < 5) return `${weeks} weeks ago`;
  return new Date(isoString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function scoreColor(score) {
  if (score >= 8) return 'var(--color-success)';
  if (score >= 6) return 'var(--color-primary)';
  if (score >= 4) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

function DebateCard({ debate, index }) {
  const [expanded, setExpanded] = useState(false);

  const scorePairs = debate.scores
    ? Object.entries(debate.scores).map(([key, value]) => ({
        key,
        label: SCORE_LABELS[key] || key,
        // Normalise to 0-10: legacy entries may have 0-100 values
        value: typeof value === 'number' && value > 10 ? value / 10 : value,
      }))
    : [];

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        transition: 'border-color var(--transition-base)',
      }}
    >
      {/* Card header — always visible */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          padding: 'var(--space-lg)',
          cursor: 'pointer',
          flexWrap: 'wrap',
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Index badge */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            flexShrink: 0,
          }}
        >
          #{index + 1}
        </div>

        {/* Topic + meta */}
        <div style={{ flex: 1, minWidth: 180 }}>
          <p
            style={{
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              fontSize: '0.95rem',
              marginBottom: 6,
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
            {debate.difficulty && (
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
            )}
            {debate.debateType && (
              <span
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--color-text-muted)',
                  textTransform: 'capitalize',
                }}
              >
                · {debate.debateType}
              </span>
            )}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
              }}
            >
              <Clock size={11} />
              {timeAgo(debate.completedAt)}
            </span>
          </div>
        </div>

        {/* Score + expand toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-md)',
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: scoreColor(typeof debate.overallScore === 'number' && debate.overallScore > 10 ? debate.overallScore / 10 : debate.overallScore),
                lineHeight: 1,
              }}
            >
              {typeof debate.overallScore === 'number'
                ? (debate.overallScore > 10 ? (debate.overallScore / 10).toFixed(1) : debate.overallScore.toFixed(1))
                : '—'}
            </p>
            <p
              style={{
                fontSize: '0.7rem',
                color: 'var(--color-text-muted)',
                marginTop: 2,
              }}
            >
              /10
            </p>
          </div>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--color-surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {expanded ? (
              <ChevronUp size={14} color="var(--color-text-muted)" />
            ) : (
              <ChevronDown size={14} color="var(--color-text-muted)" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            padding: 'var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xl)',
            background: 'var(--color-bg)',
          }}
        >
          {/* Score breakdown */}
          {scorePairs.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 'var(--space-md)',
                }}
              >
                <BarChart2 size={14} color="var(--color-primary)" />
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Score Breakdown
                </span>
              </div>
              <div
                className="card"
                style={{ padding: 'var(--space-md)', background: 'var(--color-surface)' }}
              >
                {scorePairs.map((s) => (
                  <ScoreBar key={s.key} label={s.label} score={s.value} />
                ))}
              </div>
            </div>
          )}

          {/* Strengths & Weaknesses */}
          {(debate.strengths?.length > 0 || debate.weaknesses?.length > 0) && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 'var(--space-md)',
              }}
            >
              {debate.strengths?.length > 0 && (
                <div
                  className="card"
                  style={{
                    background: 'var(--color-surface)',
                    borderTop: '2px solid var(--color-success)',
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
                    <TrendingUp size={14} color="var(--color-success)" />
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      Strengths
                    </span>
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-sm)',
                    }}
                  >
                    {debate.strengths.map((s, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
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

              {debate.weaknesses?.length > 0 && (
                <div
                  className="card"
                  style={{
                    background: 'var(--color-surface)',
                    borderTop: '2px solid var(--color-warning)',
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
                    <AlertTriangle size={14} color="var(--color-warning)" />
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      Weak Spots
                    </span>
                  </div>
                  <ul
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-sm)',
                    }}
                  >
                    {debate.weaknesses.map((w, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
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
          {debate.feedback && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 'var(--space-md)',
                }}
              >
                <MessageSquare size={14} color="var(--color-primary)" />
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Coach's Feedback
                </span>
              </div>
              <div
                className="card"
                style={{
                  background: 'var(--color-surface)',
                  borderLeft: '3px solid var(--color-primary)',
                }}
              >
                <p
                  style={{
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                    fontSize: '0.9rem',
                    marginBottom: debate.coachNote ? 'var(--space-md)' : 0,
                  }}
                >
                  {debate.feedback}
                </p>
                {debate.coachNote && (
                  <div
                    style={{
                      padding: '10px 14px',
                      background: 'var(--color-primary-dim)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      color: 'var(--color-primary)',
                      fontStyle: 'italic',
                    }}
                  >
                    {debate.coachNote}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Conversation replay */}
          {debate.conversationHistory && debate.conversationHistory.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 'var(--space-md)',
                }}
              >
                <MessageSquare size={14} color="var(--color-text-muted)" />
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Debate Transcript
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-md)',
                  maxHeight: 400,
                  overflowY: 'auto',
                  padding: 'var(--space-sm)',
                  paddingRight: 'var(--space-md)',
                }}
              >
                {debate.conversationHistory.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--space-sm)',
                      flexDirection: item.type === 'response' ? 'row-reverse' : 'row',
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background:
                          item.type === 'challenge'
                            ? 'var(--color-danger-dim)'
                            : 'var(--color-primary-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.type === 'challenge' ? (
                        <Bot size={12} color="var(--color-danger)" />
                      ) : (
                        <User size={12} color="var(--color-primary)" />
                      )}
                    </div>
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '10px 14px',
                        borderRadius:
                          item.type === 'challenge'
                            ? 'var(--radius-md) var(--radius-md) var(--radius-md) 0'
                            : 'var(--radius-md) var(--radius-md) 0 var(--radius-md)',
                        background:
                          item.type === 'challenge'
                            ? 'var(--color-surface)'
                            : 'var(--color-primary-dim)',
                        border: `1px solid ${
                          item.type === 'challenge'
                            ? 'var(--color-border)'
                            : 'rgba(79,142,247,0.2)'
                        }`,
                        fontSize: '0.85rem',
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.6,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color:
                            item.type === 'challenge'
                              ? 'var(--color-danger)'
                              : 'var(--color-primary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: 6,
                        }}
                      >
                        {item.type === 'challenge' ? `AI · Round ${item.round}` : `You · Round ${item.round}`}
                      </div>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { history, stats, clearHistory } = useDebateHistory(currentUser?.uid);
  const [confirmClear, setConfirmClear] = useState(false);
  useDocumentTitle('Debate History');

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearHistory();
    setConfirmClear(false);
  };

  return (
    <div className="page-fade">
      <div className="container-narrow">
        <div className="page-content">
          {/* Page header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-xl)',
              flexWrap: 'wrap',
              gap: 'var(--space-md)',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-dim)',
                  border: '1px solid rgba(79,142,247,0.2)',
                  marginBottom: 'var(--space-sm)',
                }}
              >
                <History size={13} color="var(--color-primary)" />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Session History
                </span>
              </div>
              <h1
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 4,
                }}
              >
                Your Debate History
              </h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                {history.length > 0
                  ? `${history.length} session${history.length !== 1 ? 's' : ''} · avg score ${stats.averageScore}/10`
                  : 'No sessions yet — complete a debate to see it here'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              {history.length > 0 && (
                <button
                  className="btn btn-ghost btn-sm"
                  style={{
                    color: confirmClear ? 'var(--color-danger)' : undefined,
                    borderColor: confirmClear ? 'var(--color-danger)' : undefined,
                  }}
                  onClick={handleClear}
                >
                  <Trash2 size={14} />
                  {confirmClear ? 'Confirm clear?' : 'Clear all'}
                </button>
              )}
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/setup')}
              >
                <Swords size={14} />
                New Debate
              </button>
            </div>
          </div>

          {/* Summary stats bar */}
          {history.length > 0 && (
            <div
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 0,
                marginBottom: 'var(--space-xl)',
                padding: 0,
                overflow: 'hidden',
              }}
            >
              {[
                { label: 'Sessions', value: stats.debatesPracticed, icon: <Swords size={16} color="var(--color-primary)" /> },
                { label: 'Avg Score', value: `${stats.averageScore}/10`, icon: <Trophy size={16} color="var(--color-gold)" /> },
                { label: 'Best Skill', value: stats.strongestSkill, icon: <TrendingUp size={16} color="var(--color-success)" /> },
                { label: 'Streak', value: `${stats.currentStreak}d`, icon: <Target size={16} color="var(--color-danger)" /> },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    padding: 'var(--space-md) var(--space-lg)',
                    borderRight: i < 3 ? '1px solid var(--color-border)' : 'none',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                    {stat.icon}
                  </div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      color: 'var(--color-text-primary)',
                      marginBottom: 2,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Debate list */}
          {history.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {history.map((debate, i) => (
                <DebateCard key={debate.id} debate={debate} index={i} />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: 'var(--space-3xl) var(--space-lg)',
                background: 'var(--color-surface)',
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <History
                size={48}
                color="var(--color-text-muted)"
                style={{ marginBottom: 'var(--space-lg)', opacity: 0.3 }}
              />
              <h3
                style={{
                  color: 'var(--color-text-secondary)',
                  fontWeight: 600,
                  marginBottom: 'var(--space-sm)',
                }}
              >
                No debate history yet
              </h3>
              <p
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: '0.875rem',
                  marginBottom: 'var(--space-xl)',
                  maxWidth: 360,
                  margin: '0 auto var(--space-xl)',
                }}
              >
                Complete a debate session and it will appear here with full scores, feedback, and transcript.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/setup')}>
                <Swords size={16} />
                Start Your First Debate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
