import React, { useState, useMemo } from 'react';
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
  PlayCircle,
  FileText,
  Search,
  Download,
  Filter,
  X,
} from 'lucide-react';
import { useDebateHistory } from '../hooks/useDebateHistory.js';
import { useDraftDebate } from '../hooks/useDraftDebate.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import PositionBadge from '../components/PositionBadge.jsx';
import ScoreBar from '../components/ScoreBar.jsx';
import { SCORE_LABELS } from '../data/mockData.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useDebate } from '../App.jsx';

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

const SKILL_LABELS = {
  argumentQuality: 'Argument Quality',
  rebuttal: 'Rebuttal',
  logic: 'Logic',
  evidence: 'Evidence',
  clarity: 'Clarity',
  confidence: 'Confidence',
  persuasiveness: 'Persuasiveness',
  structure: 'Structure',
};

// Helper to extract normalized scores from a debate entry
function getDebateScores(debate) {
  if (!debate.scores || typeof debate.scores !== 'object') return {};
  return Object.fromEntries(
    Object.entries(debate.scores).map(([k, v]) => [k, typeof v === 'number' && v > 10 ? v / 10 : v])
  );
}

function getTopSkill(debate) {
  const scores = getDebateScores(debate);
  if (Object.keys(scores).length === 0) return null;
  let bestSkill = null;
  let bestScore = -1;
  Object.entries(scores).forEach(([skill, score]) => {
    if (score > bestScore) {
      bestScore = score;
      bestSkill = skill;
    }
  });
  return bestSkill;
}

// Filter debates based on search term, date range, skill, and difficulty
function filterDebates(debates, searchQuery, dateFrom, dateTo, skillFilter, difficultyFilter) {
  return debates.filter((debate) => {
    // Search term filter (topic)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!debate.topic.toLowerCase().includes(query)) return false;
    }

    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom);
      from.setHours(0, 0, 0, 0);
      if (new Date(debate.completedAt) < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      if (new Date(debate.completedAt) > to) return false;
    }

    // Skill filter (top skill must match)
    if (skillFilter) {
      const topSkill = getTopSkill(debate);
      if (!topSkill || topSkill !== skillFilter) return false;
    }

    // Difficulty filter
    if (difficultyFilter && debate.difficulty !== difficultyFilter) return false;

    return true;
  });
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { history, stats, clearHistory } = useDebateHistory(currentUser?.uid);
  const { drafts, clearDraft } = useDraftDebate(currentUser?.uid);
  const { setConfig } = useDebate();
  const [confirmClear, setConfirmClear] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
  const [showFilters, setShowFilters] = useState(false);
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

  const resumeDraft = (draft) => {
    setConfig(draft.config);
    navigate('/practice');
  };

  // Export to CSV or JSON
  const handleExport = () => {
    const filteredHistory = filterDebates(
      history,
      searchQuery,
      dateFrom,
      dateTo,
      skillFilter,
      difficultyFilter
    );

    if (filteredHistory.length === 0) {
      alert('No debates match your filters to export.');
      return;
    }

    if (exportFormat === 'json') {
      const dataStr = JSON.stringify(filteredHistory, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `debate-history-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // CSV format
      const headers = ['Date', 'Topic', 'Position', 'Difficulty', 'Overall Score', 'Argument Quality', 'Rebuttal', 'Logic', 'Evidence', 'Clarity', 'Confidence', 'Persuasiveness', 'Structure'];
      
      const rows = filteredHistory.map((debate) => {
        const scores = getDebateScores(debate);
        return [
          new Date(debate.completedAt).toISOString().split('T')[0],
          `"${debate.topic.replace(/"/g, '""')}"`,
          debate.position || '',
          debate.difficulty || '',
          (typeof debate.overallScore === 'number' && debate.overallScore > 10 ? debate.overallScore / 10 : debate.overallScore || 0).toFixed(1),
          scores.argumentQuality?.toFixed(1) || '',
          scores.rebuttal?.toFixed(1) || '',
          scores.logic?.toFixed(1) || '',
          scores.evidence?.toFixed(1) || '',
          scores.clarity?.toFixed(1) || '',
          scores.confidence?.toFixed(1) || '',
          scores.persuasiveness?.toFixed(1) || '',
          scores.structure?.toFixed(1) || '',
        ].join(',');
      });

      const csvContent = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `debate-history-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const filteredHistory = useMemo(() => {
    return filterDebates(history, searchQuery, dateFrom, dateTo, skillFilter, difficultyFilter);
  }, [history, searchQuery, dateFrom, dateTo, skillFilter, difficultyFilter]);

  // Get all unique skills from history for filter dropdown
  const allSkills = useMemo(() => {
    const skills = new Set();
    history.forEach((debate) => {
      const scores = getDebateScores(debate);
      Object.keys(scores).forEach((skill) => skills.add(skill));
    });
    return Array.from(skills);
  }, [history]);

  const hasActiveFilters = searchQuery || dateFrom || dateTo || skillFilter || difficultyFilter;

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

            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
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
                className="btn btn-secondary btn-sm"
                onClick={handleExport}
              >
                <Download size={14} />
                Export ({exportFormat.toUpperCase()})
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowFilters(!showFilters)}
                style={{ border: hasActiveFilters ? '1px solid var(--color-primary)' : undefined }}
              >
                <Filter size={14} />
                Filters {hasActiveFilters && <span style={{ marginLeft: 4, fontSize: '0.7rem', background: 'var(--color-primary)', color: 'white', padding: '2px 6px', borderRadius: 8 }}>{filteredHistory.length}</span>}
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/setup')}
              >
                <Swords size={14} />
                New Debate
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div
              className="card"
              style={{
                marginTop: 'var(--space-md)',
                padding: 'var(--space-md)',
                background: 'var(--color-surface)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 'var(--space-md)',
                }}
              >
                {/* Search */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Search Topic</label>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      className="input"
                      placeholder="Search by topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ paddingLeft: 34 }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: 10,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--color-text-muted)',
                          padding: 0,
                        }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Date From */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>From Date</label>
                  <input
                    type="date"
                    className="input"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>

                {/* Date To */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>To Date</label>
                  <input
                    type="date"
                    className="input"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>

                {/* Skill Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Best Skill</label>
                  <select
                    className="select"
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                  >
                    <option value="">All Skills</option>
                    {allSkills.map((skill) => (
                      <option key={skill} value={skill}>{SKILL_LABELS[skill] || skill}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Difficulty</label>
                  <select
                    className="select"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="competition">Competition</option>
                  </select>
                </div>

                {/* Export Format */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Export Format</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="exportFormat"
                        value="csv"
                        checked={exportFormat === 'csv'}
                        onChange={(e) => setExportFormat(e.target.value)}
                      />
                      <span style={{ fontSize: '0.85rem' }}>CSV</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="exportFormat"
                        value="json"
                        checked={exportFormat === 'json'}
                        onChange={(e) => setExportFormat(e.target.value)}
                      />
                      <span style={{ fontSize: '0.85rem' }}>JSON</span>
                    </label>
                  </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setSearchQuery('');
                        setDateFrom('');
                        setDateTo('');
                        setSkillFilter('');
                        setDifficultyFilter('');
                      }}
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* In-progress drafts */}
          {drafts.length > 0 && (
            <div style={{ marginBottom: 'var(--space-xl)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 'var(--space-md)',
                }}
              >
                <FileText size={14} color="var(--color-warning)" />
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  In Progress · {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {drafts.map((draft) => (
                  <div
                    key={draft.draftId}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-md)',
                      padding: 'var(--space-md) var(--space-lg)',
                      borderLeft: '3px solid var(--color-warning)',
                      flexWrap: 'wrap',
                    }}
                  >
                    {/* Icon */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <PlayCircle size={18} color="var(--color-warning)" />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          color: 'var(--color-text-primary)',
                          marginBottom: 2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {draft.config?.topic || 'Untitled debate'}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-sm)',
                          flexWrap: 'wrap',
                        }}
                      >
                        {draft.config?.position && (
                          <PositionBadge position={draft.config.position} />
                        )}
                        <span
                          style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}
                        >
                          Round {draft.round ?? 1} of 5
                        </span>
                        {draft.savedAt && (
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
                            {timeAgo(draft.savedAt)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', flexShrink: 0 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--color-text-muted)' }}
                        onClick={() => clearDraft(draft.draftId)}
                        title="Discard draft"
                      >
                        <Trash2 size={14} />
                        Discard
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => resumeDraft(draft)}
                      >
                        <PlayCircle size={14} />
                        Resume
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary stats bar */}
          {filteredHistory.length > 0 && (
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
                { label: 'Sessions', value: filteredHistory.length, icon: <Swords size={16} color="var(--color-primary)" /> },
                { label: 'Avg Score', value: `${(filteredHistory.reduce((sum, d) => sum + (d.overallScore || 0), 0) / filteredHistory.length).toFixed(1)}/10`, icon: <Trophy size={16} color="var(--color-gold)" /> },
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

          {/* Filtered debate list */}
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Showing {filteredHistory.length} of {history.length} session{history.length !== 1 ? 's' : ''}
              {hasActiveFilters && <span style={{ marginLeft: 8, background: 'var(--color-primary-dim)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem' }}>Filters Active</span>}
            </span>
          </div>

          {filteredHistory.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {filteredHistory.map((debate, i) => (
                <DebateCard key={debate.id} debate={debate} index={i} />
              ))}
            </div>
          ) : hasActiveFilters ? (
            <div
              style={{
                padding: 'var(--space-3xl) var(--space-lg)',
                background: 'var(--color-surface)',
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
              }}
            >
              <Filter
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
                No debates match your filters
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
                Try adjusting your search, date range, skill, or difficulty filters.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setDateFrom('');
                  setDateTo('');
                  setSkillFilter('');
                  setDifficultyFilter('');
                }}
              >
                Clear Filters
              </button>
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
