import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Send,
  SkipForward,
  StopCircle,
  Bot,
  User,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useDebate } from '../App.jsx';
import { useToast } from '../App.jsx';
import { useDebateSession } from '../hooks/useDebateSession.js';
import PositionBadge from '../components/PositionBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import RoundFeedback from '../components/RoundFeedback.jsx';

const TOTAL_ROUNDS = 5;

function Timer({ running, onExpire, limitMinutes }) {
  const [seconds, setSeconds] = useState(limitMinutes * 60);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(intervalRef.current);
      onExpire?.();
    }
  }, [seconds]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const isLow = seconds < 60;

  return (
    <span
      style={{
        fontWeight: 700,
        fontSize: '0.9rem',
        color: isLow ? 'var(--color-danger)' : 'var(--color-text-secondary)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {mins}:{secs}
    </span>
  );
}

export default function PracticeMode() {
  const navigate = useNavigate();
  const { debate, setResults } = useDebate();
  const { addToast } = useToast();
  const { loading, error, challenge, evaluate, complete, clearError } = useDebateSession();

  const config = debate.config;

  const [round, setRound] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [allScores, setAllScores] = useState([]);
  const [allResponses, setAllResponses] = useState([]);
  // phase: loading | challenge | responding | evaluating | feedback | done
  const [phase, setPhase] = useState('loading');
  const [timerRunning, setTimerRunning] = useState(false);
  // Stores the last eval result for the feedback panel
  const [currentEval, setCurrentEval] = useState(null);
  const responseRef = useRef(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (!config) {
      navigate('/setup');
      return;
    }
    fetchFirstChallenge();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, phase]);

  const fetchFirstChallenge = async () => {
    if (!config) return;
    setPhase('loading');
    try {
      const result = await challenge({
        topic: config.topic,
        position: config.position,
        difficulty: config.difficulty,
        round: 1,
        previousResponse: '',
        conversationHistory: [],
      });
      setCurrentChallenge(result.challenge);
      setPhase('challenge');
      setTimerRunning(true);
    } catch (err) {
      addToast('Failed to load challenge. ' + err.message, 'error');
      setPhase('challenge');
    }
  };

  const handleSubmit = async () => {
    if (!response.trim()) {
      addToast('Please write a response before submitting.', 'warning');
      return;
    }
    clearError();
    setTimerRunning(false);
    setPhase('evaluating');

    const newHistory = [
      ...history,
      { type: 'challenge', text: currentChallenge, round },
      { type: 'response', text: response.trim(), round },
    ];
    setHistory(newHistory);
    const userResponse = response.trim();
    setResponse('');

    try {
      const evalResult = await evaluate({
        topic: config.topic,
        position: config.position,
        response: userResponse,
        round,
        challenge: currentChallenge,
        conversationHistory: newHistory,
      });

      const avgScore =
        Object.values(evalResult.scores).reduce((a, b) => a + b, 0) /
        Object.values(evalResult.scores).length;

      const newScores = [...allScores, avgScore];
      const newResponses = [...allResponses, userResponse];

      setAllScores(newScores);
      setAllResponses(newResponses);
      setCurrentEval(evalResult);
      setPhase('feedback');
    } catch (err) {
      addToast('Evaluation failed: ' + err.message, 'error');
      setPhase('challenge');
    }
  };

  /**
   * Called when user clicks "Next Round" or "See Final Results" in the feedback panel.
   */
  const handleFeedbackNext = async () => {
    if (!currentEval) return;

    if (round >= TOTAL_ROUNDS) {
      await finishDebate(allScores, allResponses, history);
    } else {
      // Use the nextChallenge from the eval response
      setCurrentChallenge(currentEval.nextChallenge);
      setCurrentEval(null);
      setRound((r) => r + 1);
      setPhase('challenge');
      setTimerRunning(true);
    }
  };

  const finishDebate = async (scores, responses, finalHistory) => {
    setPhase('loading');
    try {
      const result = await complete({
        topic: config.topic,
        position: config.position,
        rounds: TOTAL_ROUNDS,
        responses,
        scores,
      });
      setResults({ ...result, conversationHistory: finalHistory || history });
      navigate('/results');
    } catch (err) {
      addToast('Failed to complete debate: ' + err.message, 'error');
      setResults({
        overallScore: 0,
        scores: {},
        feedback: 'Could not retrieve results.',
        mode: 'error',
        conversationHistory: finalHistory || history,
      });
      navigate('/results');
    }
  };

  const handleSkip = () => {
    if (round >= TOTAL_ROUNDS) {
      finishDebate(allScores, allResponses, history);
      return;
    }
    setRound((r) => r + 1);
    setResponse('');
    setCurrentEval(null);
    setPhase('challenge');
    setTimerRunning(true);
  };

  const handleEnd = async () => {
    if (allResponses.length === 0) {
      navigate('/setup');
      return;
    }
    await finishDebate(allScores, allResponses, history);
  };

  const handleTimerExpire = useCallback(() => {
    addToast('Time is up! Submitting your response.', 'warning');
    if (response.trim()) {
      handleSubmit();
    } else {
      handleSkip();
    }
  }, [response]);

  if (!config) return null;

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0;

  // Compute the displayed round number for the progress bar / header
  const displayRound = Math.min(round, TOTAL_ROUNDS);
  // Rounds that are fully complete (i.e., the user has seen their feedback)
  const completedRounds = phase === 'feedback' ? round - 1 : round - 1;

  return (
    <div className="page-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="container-narrow">
        <div className="page-content">
          {/* Header bar */}
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-lg)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/preparation')}
              >
                <ChevronLeft size={16} />
              </button>
              <PositionBadge position={config.position} />
              <span
                className="badge badge-muted"
                style={{ textTransform: 'capitalize' }}
              >
                {config.difficulty}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 12px',
                  background: 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  Round
                </span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  {displayRound}
                </span>
                <span style={{ color: 'var(--color-text-muted)' }}>/</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{TOTAL_ROUNDS}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} color="var(--color-text-muted)" />
                {phase === 'challenge' ? (
                  <Timer
                    running={timerRunning}
                    limitMinutes={config.timeLimit}
                    onExpire={handleTimerExpire}
                  />
                ) : (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>—</span>
                )}
              </div>
            </div>
          </div>

          {/* Topic */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--color-text-muted)',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              Topic
            </p>
            <h2
              style={{
                fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              {config.topic}
            </h2>
          </div>

          {/* Round progress bar */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 'var(--radius-full)',
                    background:
                      i < completedRounds
                        ? 'var(--color-success)'
                        : i === round - 1
                        ? phase === 'feedback'
                          ? 'var(--color-success)'
                          : 'var(--color-primary)'
                        : 'var(--color-surface-3)',
                    transition: 'background 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Chat history */}
          {history.length > 0 && (
            <div
              style={{
                marginBottom: 'var(--space-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
              }}
            >
              {history.map((item, i) => (
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
                      width: 32,
                      height: 32,
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
                      <Bot size={14} color="var(--color-danger)" />
                    ) : (
                      <User size={14} color="var(--color-primary)" />
                    )}
                  </div>
                  <div
                    style={{
                      maxWidth: '80%',
                      padding: '12px 16px',
                      borderRadius:
                        item.type === 'challenge'
                          ? 'var(--radius-md) var(--radius-md) var(--radius-md) 0'
                          : 'var(--radius-md) var(--radius-md) 0 var(--radius-md)',
                      background:
                        item.type === 'challenge'
                          ? 'var(--color-surface-2)'
                          : 'var(--color-primary-dim)',
                      border: `1px solid ${
                        item.type === 'challenge'
                          ? 'var(--color-border)'
                          : 'rgba(79,142,247,0.2)'
                      }`,
                      fontSize: '0.875rem',
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
                      {item.type === 'challenge'
                        ? `AI Opponent · Round ${item.round}`
                        : `You · Round ${item.round}`}
                    </div>
                    {item.text}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
          )}

          {/* Loading state */}
          {phase === 'loading' && (
            <LoadingSpinner message="AI is preparing..." />
          )}

          {/* Current challenge */}
          {(phase === 'challenge' || phase === 'evaluating') && currentChallenge && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--color-danger-dim)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bot size={16} color="var(--color-danger)" />
              </div>
              <div
                className="card"
                style={{
                  flex: 1,
                  borderColor: 'rgba(248,113,113,0.2)',
                  background: 'var(--color-surface-2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--color-danger)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    AI Opponent — Round {round}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.7,
                  }}
                >
                  {currentChallenge}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: '10px 14px',
                background: 'var(--color-danger-dim)',
                border: '1px solid rgba(248,113,113,0.2)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-md)',
              }}
            >
              <AlertCircle size={16} color="var(--color-danger)" />
              <span style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</span>
              <button className="btn btn-ghost btn-sm" onClick={clearError} style={{ marginLeft: 'auto' }}>
                <RefreshCw size={13} />
              </button>
            </div>
          )}

          {/* Response area */}
          {phase === 'challenge' && (
            <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 'var(--space-sm)',
                }}
              >
                <User size={14} color="var(--color-primary)" />
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Your Response
                </span>
              </div>
              <textarea
                ref={responseRef}
                className="textarea"
                style={{ minHeight: 140, marginBottom: 'var(--space-sm)' }}
                placeholder="Type your argument here. Be clear, specific, and direct..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) handleSubmit();
                }}
                disabled={loading}
                maxLength={5000}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--space-sm)',
                }}
              >
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {wordCount} word{wordCount !== 1 ? 's' : ''} ·{' '}
                  <kbd
                    style={{
                      background: 'var(--color-surface-3)',
                      padding: '1px 5px',
                      borderRadius: 3,
                      fontSize: '0.75rem',
                    }}
                  >
                    Ctrl+Enter
                  </kbd>{' '}
                  to submit
                </span>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={handleSkip}
                    disabled={loading}
                  >
                    <SkipForward size={14} />
                    Skip
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={handleEnd}
                    disabled={loading}
                  >
                    <StopCircle size={14} />
                    End
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading || !response.trim()}
                  >
                    {loading ? (
                      <span className="spinner" style={{ width: 16, height: 16 }} />
                    ) : (
                      <Send size={16} />
                    )}
                    Submit Response
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Evaluating state */}
          {phase === 'evaluating' && (
            <LoadingSpinner message="AI is evaluating your response..." />
          )}

          {/* Per-round feedback panel */}
          {phase === 'feedback' && currentEval && (
            <RoundFeedback
              evalResult={currentEval}
              round={round}
              totalRounds={TOTAL_ROUNDS}
              isLastRound={round >= TOTAL_ROUNDS}
              onNext={handleFeedbackNext}
            />
          )}
        </div>
      </div>
    </div>
  );
}
