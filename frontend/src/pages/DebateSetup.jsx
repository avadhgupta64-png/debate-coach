import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Clock,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { useDebate } from '../App.jsx';
import { useToast } from '../App.jsx';
import { SUGGESTED_TOPICS, DIFFICULTIES, DEBATE_TYPES, TIME_LIMITS } from '../data/mockData.js';

const POSITION_OPTIONS = [
  { value: 'for', label: 'For', desc: 'Argue in favour', icon: <ThumbsUp size={18} /> },
  { value: 'against', label: 'Against', desc: 'Argue against', icon: <ThumbsDown size={18} /> },
];

function OptionCard({ value, label, desc, icon, selected, onClick, accentColor }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: selected ? accentColor + '15' : 'var(--color-surface-2)',
        border: `1.5px solid ${selected ? accentColor : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        width: '100%',
        transition: 'all var(--transition-base)',
        textAlign: 'left',
      }}
    >
      <span style={{ color: selected ? accentColor : 'var(--color-text-muted)', flexShrink: 0 }}>
        {icon}
      </span>
      <div>
        <p style={{ fontWeight: 600, color: selected ? accentColor : 'var(--color-text-primary)', fontSize: '0.9rem', margin: 0 }}>
          {label}
        </p>
        {desc && (
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', margin: 0, marginTop: 2 }}>
            {desc}
          </p>
        )}
      </div>
    </button>
  );
}

function SelectOption({ value, label, selected, onClick, color }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: selected ? (color || 'var(--color-primary)') + '15' : 'var(--color-surface-2)',
        border: `1.5px solid ${selected ? (color || 'var(--color-primary)') : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-sm)',
        padding: '9px 14px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: selected ? 600 : 500,
        color: selected ? (color || 'var(--color-primary)') : 'var(--color-text-secondary)',
        transition: 'all var(--transition-fast)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

const DIFFICULTY_COLORS = {
  beginner: 'var(--color-success)',
  intermediate: 'var(--color-primary)',
  advanced: 'var(--color-accent)',
  competition: 'var(--color-gold)',
};

export default function DebateSetup() {
  const navigate = useNavigate();
  const { setConfig } = useDebate();
  const { addToast } = useToast();

  const [topic, setTopic] = useState('');
  const [position, setPosition] = useState('for');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [debateType, setDebateType] = useState('school');
  const [timeLimit, setTimeLimit] = useState(5);
  const [topicError, setTopicError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const validateTopic = (value) => {
    if (!value.trim()) return 'Please enter a debate topic.';
    if (value.trim().length < 5) return 'Topic must be at least 5 characters.';
    if (value.trim().length > 300) return 'Topic must be under 300 characters.';
    return '';
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    if (topicError) setTopicError('');
  };

  const handleTopicBlur = () => {
    setTopicError(validateTopic(topic));
  };

  const handleSuggest = (t) => {
    setTopic(t);
    setTopicError('');
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateTopic(topic);
    if (err) {
      setTopicError(err);
      addToast(err, 'error');
      return;
    }
    const config = { topic: topic.trim(), position, difficulty, debateType, timeLimit };
    setConfig(config);
    navigate('/preparation');
  };

  const selectedDifficulty = DIFFICULTIES.find((d) => d.value === difficulty);

  return (
    <div className="page-fade">
      <div className="container-narrow">
        <div className="page-content">
          {/* Header */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Configure your session</p>
            <h1
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              Start a Debate
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Choose your topic, position, and difficulty level to begin.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Topic */}
            <div className="form-group">
              <label className="label" htmlFor="topic">Debate Topic *</label>
              <div style={{ position: 'relative' }}>
                <textarea
                  id="topic"
                  className={`textarea${topicError ? ' input-error' : ''}`}
                  style={{
                    minHeight: 80,
                    resize: 'none',
                    borderColor: topicError ? 'var(--color-danger)' : undefined,
                  }}
                  placeholder="e.g. Should AI be allowed in schools?"
                  value={topic}
                  onChange={handleTopicChange}
                  onBlur={handleTopicBlur}
                  maxLength={300}
                  rows={2}
                />
                {topicError && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--color-danger)',
                      fontSize: '0.82rem',
                      marginTop: 6,
                    }}
                  >
                    <AlertCircle size={13} />
                    {topicError}
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    alignItems: 'center',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ gap: 6 }}
                    onClick={() => setShowSuggestions(!showSuggestions)}
                  >
                    <Lightbulb size={14} />
                    Suggested topics
                    <ChevronDown
                      size={13}
                      style={{
                        transform: showSuggestions ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </button>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {topic.length}/300
                  </span>
                </div>

                {showSuggestions && (
                  <div
                    style={{
                      marginTop: 'var(--space-sm)',
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                    }}
                  >
                    {SUGGESTED_TOPICS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleSuggest(t)}
                        style={{
                          width: '100%',
                          padding: '11px 16px',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid var(--color-border)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: 'var(--color-text-secondary)',
                          transition: 'all var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--color-surface-3)';
                          e.currentTarget.style.color = 'var(--color-text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--color-text-secondary)';
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Position */}
            <div className="form-group">
              <label className="label">Your Position *</label>
              <div className="grid-2">
                {POSITION_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    {...opt}
                    selected={position === opt.value}
                    onClick={() => setPosition(opt.value)}
                    accentColor={opt.value === 'for' ? 'var(--color-success)' : 'var(--color-danger)'}
                  />
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="form-group">
              <label className="label">Difficulty</label>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 10 }}>
                {DIFFICULTIES.map((d) => (
                  <SelectOption
                    key={d.value}
                    value={d.value}
                    label={d.label}
                    selected={difficulty === d.value}
                    onClick={() => setDifficulty(d.value)}
                    color={DIFFICULTY_COLORS[d.value]}
                  />
                ))}
              </div>
              {selectedDifficulty && (
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={12} color={DIFFICULTY_COLORS[difficulty]} />
                  {selectedDifficulty.description}
                </p>
              )}
            </div>

            {/* Debate Type */}
            <div className="form-group">
              <label className="label">Debate Type</label>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {DEBATE_TYPES.map((t) => (
                  <SelectOption
                    key={t.value}
                    value={t.value}
                    label={t.label}
                    selected={debateType === t.value}
                    onClick={() => setDebateType(t.value)}
                  />
                ))}
              </div>
            </div>

            {/* Time limit */}
            <div className="form-group">
              <label className="label">
                <Clock size={13} style={{ display: 'inline', marginRight: 5 }} />
                Session Length
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {TIME_LIMITS.map((t) => (
                  <SelectOption
                    key={t.value}
                    value={t.value}
                    label={t.label}
                    selected={timeLimit === t.value}
                    onClick={() => setTimeLimit(t.value)}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <div
              style={{
                paddingTop: 'var(--space-lg)',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button type="submit" className="btn btn-primary btn-lg">
                Prepare My Debate
                <ChevronRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
