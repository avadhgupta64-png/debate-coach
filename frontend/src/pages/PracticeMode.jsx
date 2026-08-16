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
  Lightbulb,
  ChevronDown,
} from 'lucide-react';
import { useDebate } from '../App.jsx';
import { useToast } from '../App.jsx';
import { useDebateSession } from '../hooks/useDebateSession.js';
import { useDraftDebate } from '../hooks/useDraftDebate.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import PositionBadge from '../components/PositionBadge.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import RoundFeedback from '../components/RoundFeedback.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

const TOTAL_ROUNDS = 5;

// ─── Timer Component ──────────────────────────────────────────────────────────

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
    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isLow ? 'var(--color-danger)' : 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
      {mins}:{secs}
    </span>
  );
}

// ─── Hint Panel ───────────────────────────────────────────────────────────────

// Fallback hints used when the API is unavailable (e.g. not yet deployed)
const FALLBACK_HINTS = {
  1: 'Think about the underlying assumption your opponent is relying on. What are they taking for granted? Challenge that assumption rather than defending your original claim directly.',
  2: 'Your opponent is attacking the practicality of your argument. Counter this by distinguishing between short-term difficulty and long-term benefit — acknowledge the concern, then show why the bigger picture changes the calculation.',
  3: 'A strong response here would: (1) concede the narrow point your opponent raised, (2) show it is the exception not the rule, (3) redirect to the broader evidence that supports your position, (4) end with a clear statement of why your overall case still stands. Go on the attack — do not be defensive.',
};

function HintPanel({ topic, position, challenge, conversationHistory, getHint, currentHintLevel, setCurrentHintLevel, hintText, setHintText, onHintUsed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleGetHint = async () => {
    const nextLevel = Math.min((currentHintLevel || 0) + 1, 3);
    setLoading(true);
    setError(null);
    try {
      const result = await getHint({
        topic,
        position,
        challenge,
        conversationHistory: conversationHistory || [],
        hintLevel: nextLevel,
      });
      setHintText(result.hint);
      setCurrentHintLevel(nextLevel);
      setOpen(true);
      onHintUsed(nextLevel);
    } catch (err) {
      // If the API is unavailable (404 or network error), fall back to built-in hints
      const fallback = FALLBACK_HINTS[nextLevel];
      if (fallback) {
        setHintText(fallback);
        setCurrentHintLevel(nextLevel);
        setOpen(true);
        onHintUsed(nextLevel);
        setError(null);
      } else {
        setError(err.message || 'Could not load hint.');
      }
    } finally {
      setLoading(false);
    }
  };

  const levelLabel = ['', 'Subtle hint', 'Specific hint', 'Strong guidance'];
  const levelColor = ['', 'var(--color-success)', 'var(--color-warning)', 'var(--color-accent)'];
  const nextLevel = Math.min((currentHintLevel || 0) + 1, 3);
  const allHintsUsed = currentHintLevel >= 3;

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={allHintsUsed ? () => setOpen(!open) : handleGetHint}
          disabled={loading}
          style={{
            border: '1px solid rgba(240,180,41,0.3)',
            color: 'var(--color-gold)',
            gap: 6,
          }}
        >
          {loading ? (
            <><span className="spinner" style={{ width: 14, height: 14 }} /> Getting hint...</>
          ) : (
            <><Lightbulb size={14} /> {allHintsUsed ? (open ? 'Hide hints' : 'Show hints') : `Need a hint? (${nextLevel}/3)`}</>
          )}
        </button>

        {currentHintLevel > 0 && (
          <div style={{ display: 'flex', gap: 4 }}>
            {[1, 2, 3].map((l) => (
              <div
                key={l}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: l <= currentHintLevel ? levelColor[l] : 'var(--color-surface-3)',
                }}
              />
            ))}
          </div>
        )}

        {error && <span style={{ fontSize: '0.78rem', color: 'var(--color-danger)' }}>{error}</span>}
      </div>

      {open && hintText && (
        <div
          style={{
            marginTop: 'var(--space-sm)',
            padding: '14px 16px',
            background: 'rgba(240,180,41,0.07)',
            border: '1px solid rgba(240,180,41,0.2)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {levelLabel[currentHintLevel]} (Level {currentHintLevel}/3)
            </span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: 0 }}>
              <ChevronDown size={14} />
            </button>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>{hintText}</p>
          {!allHintsUsed && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleGetHint}
              disabled={loading}
              style={{ marginTop: 10, color: 'var(--color-gold)', borderColor: 'rgba(240,180,41,0.3)' }}
            >
              {loading ? 'Loading...' : `Get stronger hint (${nextLevel}/3)`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main PracticeMode ────────────────────────────────────────────────────────

export default function PracticeMode() {
  const navigate = useNavigate();
  const { debate, setResults, setConfig } = useDebate();
  const { addToast } = useToast();
  const { currentUser } = useAuth();
  const { loading, error, challenge, evaluate, complete, getHint, clearError } = useDebateSession();
  const { saveDraft, loadDraft, clearDraft } = useDraftDebate(currentUser?.uid);

  const config = debate.config;
  useDocumentTitle('Practice Debate');

  const [round, setRound] = useState(1);
  const [currentChallenge, setCurrentChallenge] = useState('');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [allScores, setAllScores] = useState([]);
  const [allResponses, setAllResponses] = useState([]);
  const [phase, setPhase] = useState('loading'); // loading | challenge | evaluating | feedback | done
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentEval, setCurrentEval] = useState(null);

  // Hint state per round
  const [currentHintLevel, setCurrentHintLevel] = useState(0);
  const [hintText, setHintText] = useState('');
  const [roundHintsUsed, setRoundHintsUsed] = useState(0);
  const [totalHintsUsed, setTotalHintsUsed] = useState(0);

  // Track whether we restored from a draft (skip fetchFirstChallenge in that case)
  const restoredFromDraft = useRef(false);

  const responseRef = useRef(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    // ── Draft restore ─────────────────────────────────────────────────────────
    // If the user left mid-session, a draft may have been saved. Restore it so
    // they continue from where they stopped rather than starting over.
    const draft = loadDraft();
    if (draft && draft.config) {
      // Restore config into DebateContext if it isn't already set (e.g. user
      // navigated directly to /practice after a page refresh).
      if (!config) {
        setConfig(draft.config);
      }
      // Restore all session state
      setRound(draft.round ?? 1);
      setCurrentChallenge(draft.currentChallenge ?? '');
      setHistory(draft.history ?? []);
      setAllScores(draft.allScores ?? []);
      setAllResponses(draft.allResponses ?? []);
      setTotalHintsUsed(draft.totalHintsUsed ?? 0);
      setPhase('challenge');
      setTimerRunning(true);
      restoredFromDraft.current = true;
      addToast('Draft restored — carry on from where you left off.', 'info');
      return;
    }

    // ── Normal start ──────────────────────────────────────────────────────────
    if (!config) { navigate('/setup'); return; }
    fetchFirstChallenge();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, phase]);

  // ── Auto-save draft on every meaningful state change ──────────────────────
  // Only save when there is an active challenge (i.e. the session has started
  // and at least one AI challenge has been received). We do NOT save during
  // the very first loading phase to avoid writing an empty draft.
  useEffect(() => {
    if (!config) return;
    if (phase === 'loading' && round === 1 && history.length === 0) return; // nothing yet
    if (phase === 'done') return; // session finished — clearDraft handles this
    saveDraft({
      config,
      round,
      currentChallenge,
      history,
      allScores,
      allResponses,
      totalHintsUsed,
    });
  }, [round, currentChallenge, history, allScores, allResponses, phase, totalHintsUsed]);

  const resetHints = () => {
    setCurrentHintLevel(0);
    setHintText('');
    setRoundHintsUsed(0);
  };

  const handleHintUsed = useCallback((level) => {
    setRoundHintsUsed(level);
    setTotalHintsUsed((prev) => prev + 1);
  }, []);

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
        hintsUsed: roundHintsUsed,
      });

      const roundScores = evalResult.scores || {};
      // Backend returns individual scores on 0-100 scale. Normalise to 0-10.
      const normalisedRoundScores = Object.fromEntries(
        Object.entries(roundScores).map(([k, v]) => [k, typeof v === 'number' && v > 10 ? v / 10 : v])
      );
      const avgScore = Object.values(normalisedRoundScores).length
        ? Object.values(normalisedRoundScores).reduce((a, b) => a + b, 0) / Object.values(normalisedRoundScores).length
        : 6; // default to 6/10 (≈60%) if no scores returned

      setAllScores([...allScores, avgScore]);
      setAllResponses([...allResponses, userResponse]);
      setCurrentEval(evalResult);
      setPhase('feedback');
      resetHints();
    } catch (err) {
      addToast('Evaluation failed: ' + err.message, 'error');
      setPhase('challenge');
    }
  };

  const handleFeedbackNext = async () => {
    if (!currentEval) return;

    if (round >= TOTAL_ROUNDS) {
      await finishDebate(allScores, allResponses, history);
    } else {
      setCurrentChallenge(currentEval.nextChallenge);
      setCurrentEval(null);
      setRound((r) => r + 1);
      setPhase('challenge');
      setTimerRunning(true);
    }
  };

  const finishDebate = async (scores, responses, finalHistory) => {
    setPhase('loading');
    clearDraft(); // session ending — remove the draft
    try {
      const result = await complete({
        topic: config.topic,
        position: config.position,
        rounds: TOTAL_ROUNDS,
        responses,
        scores,
        conversationHistory: finalHistory,
        totalHintsUsed,
      });
      setResults({ ...result, conversationHistory: finalHistory });
      navigate('/results');
    } catch (err) {
      addToast('Failed to complete debate: ' + err.message, 'error');
      setResults({ overallScore: 0, scores: {}, feedback: 'Could not retrieve results.', mode: 'error', conversationHistory: finalHistory });
      navigate('/results');
    }
  };

  const handleSkip = async () => {
    // Record a 0 score for the skipped round so the final average is accurate
    const newScores = [...allScores, 0];
    const newResponses = [...allResponses, '[skipped]'];

    // Add the skipped challenge to history so the transcript is complete
    const newHistory = [
      ...history,
      { type: 'challenge', text: currentChallenge, round },
      { type: 'response', text: '[Round skipped]', round },
    ];
    setHistory(newHistory);
    setAllScores(newScores);
    setAllResponses(newResponses);
    setResponse('');
    resetHints();

    if (round >= TOTAL_ROUNDS) {
      finishDebate(newScores, newResponses, newHistory);
      return;
    }

    // Fetch a fresh challenge for the next round
    const nextRound = round + 1;
    setRound(nextRound);
    setCurrentEval(null);
    setPhase('loading');
    setTimerRunning(false);
    try {
      const result = await challenge({
        topic: config.topic,
        position: config.position,
        difficulty: config.difficulty,
        round: nextRound,
        previousResponse: '',
        conversationHistory: newHistory,
      });
      setCurrentChallenge(result.challenge);
      setPhase('challenge');
      setTimerRunning(true);
    } catch (err) {
      addToast('Failed to load next challenge. ' + err.message, 'error');
      setPhase('challenge');
    }
  };

  const handleEnd = async () => {
    if (allResponses.length === 0) { navigate('/setup'); return; }
    await finishDebate(allScores, allResponses, history);
  };

  const handleTimerExpire = useCallback(() => {
    addToast('Time is up! Submitting your response.', 'warning');
    if (response.trim()) handleSubmit();
    else handleSkip();
  }, [response]);

  if (!config) return null;

  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0;
  const completedRounds = round - 1;

  return (
    <div className="page-fade" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="container-narrow">
        <div className="page-content">

          {/* Header bar */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => {
                // Save a draft so the user can resume from Dashboard
                if (config && currentChallenge) {
                  saveDraft({ config, round, currentChallenge, history, allScores, allResponses, totalHintsUsed });
                  addToast('Draft saved — resume from the Dashboard anytime.', 'info');
                }
                navigate('/');
              }}>
                <ChevronLeft size={16} />
              </button>
              <PositionBadge position={config.position} />
              <span className="badge badge-muted" style={{ textTransform: 'capitalize' }}>{config.difficulty}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Round</span>
                <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{Math.min(round, TOTAL_ROUNDS)}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>/</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{TOTAL_ROUNDS}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={14} color="var(--color-text-muted)" />
                {phase === 'challenge' ? (
                  <Timer running={timerRunning} limitMinutes={config.timeLimit} onExpire={handleTimerExpire} />
                ) : (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>—</span>
                )}
              </div>
            </div>
          </div>

          {/* Topic */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Topic</p>
            <h2 style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{config.topic}</h2>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 'var(--radius-full)',
                  background: i < completedRounds ? 'var(--color-success)' : i === round - 1 ? (phase === 'feedback' ? 'var(--color-success)' : 'var(--color-primary)') : 'var(--color-surface-3)',
                  transition: 'background 0.3s ease',
                }} />
              ))}
            </div>
          </div>

          {/* Chat history */}
          {history.length > 0 && (
            <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {history.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', flexDirection: item.type === 'response' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: item.type === 'challenge' ? 'var(--color-danger-dim)' : 'var(--color-primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.type === 'challenge' ? <Bot size={14} color="var(--color-danger)" /> : <User size={14} color="var(--color-primary)" />}
                  </div>
                  <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: item.type === 'challenge' ? 'var(--radius-md) var(--radius-md) var(--radius-md) 0' : 'var(--radius-md) var(--radius-md) 0 var(--radius-md)', background: item.type === 'challenge' ? 'var(--color-surface-2)' : 'var(--color-primary-dim)', border: `1px solid ${item.type === 'challenge' ? 'var(--color-border)' : 'rgba(79,142,247,0.2)'}`, fontSize: '0.875rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: item.type === 'challenge' ? 'var(--color-danger)' : 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                      {item.type === 'challenge' ? `AI Opponent · Round ${item.round}` : `You · Round ${item.round}`}
                    </div>
                    {item.text}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
          )}

          {phase === 'loading' && <LoadingSpinner message="AI is preparing..." />}

          {/* Current challenge bubble */}
          {(phase === 'challenge' || phase === 'evaluating') && currentChallenge && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-danger-dim)', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={16} color="var(--color-danger)" />
              </div>
              <div className="card" style={{ flex: 1, borderColor: 'rgba(248,113,113,0.2)', background: 'var(--color-surface-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 'var(--space-sm)' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    AI Opponent — Round {round}
                  </span>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>{currentChallenge}</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '10px 14px', background: 'var(--color-danger-dim)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
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
              {/* Hint panel above textarea */}
              <HintPanel
                topic={config.topic}
                position={config.position}
                challenge={currentChallenge}
                conversationHistory={history}
                getHint={getHint}
                currentHintLevel={currentHintLevel}
                setCurrentHintLevel={setCurrentHintLevel}
                hintText={hintText}
                setHintText={setHintText}
                onHintUsed={handleHintUsed}
              />

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-sm)' }}>
                <User size={14} color="var(--color-primary)" />
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Response</span>
              </div>
              <textarea
                ref={responseRef}
                className="textarea"
                style={{ minHeight: 140, marginBottom: 'var(--space-sm)' }}
                placeholder="Type your argument here. Be clear, specific, and direct..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit(); }}
                disabled={loading}
                maxLength={5000}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                  {wordCount} word{wordCount !== 1 ? 's' : ''} ·{' '}
                  <kbd style={{ background: 'var(--color-surface-3)', padding: '1px 5px', borderRadius: 3, fontSize: '0.75rem' }}>Ctrl+Enter</kbd> to submit
                </span>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button className="btn btn-ghost btn-sm" onClick={handleSkip} disabled={loading}><SkipForward size={14} /> Skip</button>
                  <button className="btn btn-danger btn-sm" onClick={handleEnd} disabled={loading}><StopCircle size={14} /> End</button>
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !response.trim()}>
                    {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <Send size={16} />}
                    Submit Response
                  </button>
                </div>
              </div>
            </div>
          )}

          {phase === 'evaluating' && <LoadingSpinner message="AI is evaluating your response..." />}

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
