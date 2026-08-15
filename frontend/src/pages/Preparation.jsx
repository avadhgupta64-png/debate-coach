import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Shield,
  Swords,
  MessageSquare,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Target,
  Map,
  Zap,
  AlertCircle,
  Send,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useDebate } from '../App.jsx';
import { useToast } from '../App.jsx';
import { useDebateSession } from '../hooks/useDebateSession.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ArgumentCard from '../components/ArgumentCard.jsx';
import EvidenceCard from '../components/EvidenceCard.jsx';
import PositionBadge from '../components/PositionBadge.jsx';

// ─── Shared Section Header ────────────────────────────────────────────────────

function SectionHeader({ icon, title, color, subtitle }) {
  return (
    <div style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
        <span style={{ color }}>{icon}</span>
        <h2 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)', margin: 0 }}>
          {title}
        </h2>
      </div>
      {subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 6, marginLeft: 0 }}>{subtitle}</p>}
    </div>
  );
}

// ─── Info Box ─────────────────────────────────────────────────────────────────

function InfoBox({ color, icon, items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ color, flexShrink: 0, marginTop: 2 }}>{icon}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Collapsible Section ──────────────────────────────────────────────────────

function CollapsibleSection({ icon, title, color, subtitle, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', marginBottom: open ? 'var(--space-md)' : 0, paddingBottom: 'var(--space-sm)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span style={{ color }}>{icon}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>{title}</span>
        </div>
        <span style={{ color: 'var(--color-text-muted)' }}>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
      </button>
      {subtitle && open && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)', marginTop: -8 }}>{subtitle}</p>}
      {open && children}
    </section>
  );
}

// ─── Argument Refinement Panel ────────────────────────────────────────────────

function RefinementPanel({ config }) {
  const [argument, setArgument] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Use a completely independent session so refine errors never affect the parent page
  const { refine } = useDebateSession();
  const wordCount = argument.trim() ? argument.trim().split(/\s+/).length : 0;

  const handleRefine = async () => {
    if (!argument.trim() || argument.trim().length < 20) return;
    setError(null);
    setLoading(true);
    try {
      const result = await refine({
        topic: config.topic,
        position: config.position,
        difficulty: config.difficulty,
        argument: argument.trim(),
      });
      setFeedback(result);
    } catch (err) {
      setError(err.message || 'Failed to analyse argument.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefineAgain = () => {
    setFeedback(null);
    setError(null);
  };

  return (
    <div>
      <div
        style={{
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-lg)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
          Write one of your own arguments below. The AI will analyse it and give you specific coaching — what's strong, what's weak, what evidence you need, and hints on how to improve it. The AI will <strong style={{ color: 'var(--color-text-primary)' }}>not</strong> rewrite it for you.
        </p>
        <textarea
          className="textarea"
          style={{ minHeight: 120, marginBottom: 'var(--space-sm)' }}
          placeholder={`Write your argument for the ${config.position === 'for' ? 'FOR' : 'AGAINST'} side here. Be specific — the more detail you include, the better the coaching...`}
          value={argument}
          onChange={(e) => setArgument(e.target.value)}
          disabled={loading}
          maxLength={3000}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
            {wordCount} word{wordCount !== 1 ? 's' : ''} · {argument.length}/3000 chars
          </span>
          <button
            className="btn btn-primary"
            onClick={handleRefine}
            disabled={loading || argument.trim().length < 20}
          >
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Analysing...</> : <><Send size={16} /> Analyse My Argument</>}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '12px 16px', background: 'var(--color-danger-dim)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-lg)' }}>
          <AlertCircle size={16} color="var(--color-danger)" />
          <span style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</span>
        </div>
      )}

      {loading && <LoadingSpinner message="Analysing your argument..." />}

      {feedback && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {/* Persuasiveness overview */}
          <div style={{ padding: 'var(--space-md)', background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Overall Assessment</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', lineHeight: 1.6 }}>{feedback.persuasivenessAssessment}</p>
          </div>

          <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {/* Strengths */}
            {(feedback.strengths || []).length > 0 && (
              <div style={{ padding: 'var(--space-md)', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>✓ Strengths</p>
                {(feedback.strengths || []).map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--color-success)', flexShrink: 0 }}>•</span>{s}
                  </div>
                ))}
              </div>
            )}
            {/* Weaknesses */}
            {(feedback.weaknesses || []).length > 0 && (
              <div style={{ padding: 'var(--space-md)', background: 'var(--color-danger-dim)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>✗ Weaknesses</p>
                {(feedback.weaknesses || []).map((w, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--color-danger)', flexShrink: 0 }}>•</span>{w}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logical issues & missing evidence */}
          {((feedback.logicalProblems || []).length > 0 || (feedback.missingEvidence || []).length > 0 || (feedback.unsupportedAssumptions || []).length > 0) && (
            <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {(feedback.logicalProblems || []).length > 0 && (
                <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>⚠ Logical Issues</p>
                  {(feedback.logicalProblems || []).map((l, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--color-accent)', flexShrink: 0 }}>•</span>{l}
                    </div>
                  ))}
                </div>
              )}
              {(feedback.missingEvidence || []).length > 0 && (
                <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>📎 Missing Evidence</p>
                  {(feedback.missingEvidence || []).map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--color-gold)', flexShrink: 0 }}>•</span>{m}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Structural improvements */}
          {(feedback.structuralImprovements || []).length > 0 && (
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Structure Improvements</p>
              {(feedback.structuralImprovements || []).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--color-primary)', flexShrink: 0 }}>{i + 1}.</span>{s}
                </div>
              ))}
            </div>
          )}

          {/* Refinement hints */}
          {(feedback.refinementHints || []).length > 0 && (
            <div style={{ padding: 'var(--space-md)', background: 'rgba(240,180,41,0.07)', border: '1px solid rgba(240,180,41,0.2)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>💡 Coaching Hints</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 10 }}>Use these to guide your revisions — not as a script:</p>
              {(feedback.refinementHints || []).map((hint, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', background: 'rgba(240,180,41,0.07)', borderRadius: 'var(--radius-sm)', marginBottom: 8, border: '1px solid rgba(240,180,41,0.15)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-gold)', flexShrink: 0 }}>#{i + 1}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{hint}</span>
                </div>
              ))}
            </div>
          )}

          <button className="btn btn-secondary" onClick={handleRefineAgain}>
            <RefreshCw size={16} /> Revise & Analyse Again
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Preparation() {
  const navigate = useNavigate();
  const { debate, setPreparation } = useDebate();
  const { addToast } = useToast();
  const { loading, error, generate } = useDebateSession();
  const [data, setData] = useState(null);

  const config = debate.config;
  useDocumentTitle('Prepare for Debate');

  useEffect(() => {
    if (!config) { navigate('/setup'); return; }
    if (debate.preparation) { setData(debate.preparation); return; }
    fetchPreparation();
  }, []);

  const fetchPreparation = async () => {
    if (!config) return;
    try {
      const result = await generate(config);
      setData(result);
      setPreparation(result);
    } catch (err) {
      addToast(err.message || 'Failed to generate debate preparation.', 'error');
    }
  };

  if (!config) return null;

  return (
    <div className="page-fade">
      <div className="container">
        <div className="page-content">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap' }}>
            <div>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/setup')} style={{ marginBottom: 'var(--space-md)' }}>
                <ChevronLeft size={16} /> Back
              </button>
              <p className="section-label">Debate Preparation</p>
              <h1 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)', maxWidth: 600 }}>
                {config.topic}
              </h1>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                <PositionBadge position={config.position} size="sm" />
                <span className="badge badge-muted" style={{ textTransform: 'capitalize' }}>{config.difficulty}</span>
                <span className="badge badge-muted" style={{ textTransform: 'capitalize' }}>{config.debateType}</span>
                {data?.mode === 'demo' && <span className="badge badge-gold">Demo Mode</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={() => { setData(null); fetchPreparation(); }} disabled={loading}>
                <RefreshCw size={16} className={loading ? 'spin' : ''} /> Regenerate
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/practice')} disabled={!data || loading}>
                Start Practice <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {loading && <LoadingSpinner size="lg" message="Preparing your debate material..." />}

          {error && !loading && (
            <div className="card" style={{ borderColor: 'var(--color-danger)', background: 'var(--color-danger-dim)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <AlertTriangle size={20} color="var(--color-danger)" />
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--color-danger)', fontWeight: 600, marginBottom: 4 }}>Failed to load preparation</p>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{error}</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => { setData(null); fetchPreparation(); }}>Retry</button>
            </div>
          )}

          {data && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>

              {/* Motion Interpretation */}
              {data.motionInterpretation && (
                <CollapsibleSection icon={<Target size={16} />} title="Understanding the Motion" color="var(--color-primary)">
                  <div style={{ padding: 'var(--space-md)', background: 'rgba(79,142,247,0.07)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontSize: '0.95rem', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>{data.motionInterpretation}</p>
                  </div>
                  {(data.keyDefinitions || []).length > 0 && (
                    <div style={{ marginTop: 'var(--space-md)' }}>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Key Definitions</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {(data.keyDefinitions || []).map((def, i) => (
                          <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                            <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', flexShrink: 0, minWidth: 120 }}>{def.term}:</strong>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{def.definition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CollapsibleSection>
              )}

              {/* Assumptions & Weaknesses */}
              {((data.assumptions || []).length > 0 || (data.potentialWeaknesses || []).length > 0) && (
                <CollapsibleSection icon={<AlertTriangle size={16} />} title="Assumptions & Vulnerabilities" color="var(--color-warning)" subtitle="Know your position's weaknesses before your opponent exploits them.">
                  <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                    {(data.assumptions || []).length > 0 && (
                      <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Your Side's Assumptions</p>
                        <InfoBox color="var(--color-warning)" icon={<AlertCircle size={13} />} items={data.assumptions} />
                      </div>
                    )}
                    {(data.potentialWeaknesses || []).length > 0 && (
                      <div style={{ padding: 'var(--space-md)', background: 'var(--color-danger-dim)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Potential Weaknesses</p>
                        <InfoBox color="var(--color-danger)" icon={<AlertTriangle size={13} />} items={data.potentialWeaknesses} />
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              )}

              {/* Your Arguments */}
              <CollapsibleSection icon={<Swords size={16} />} title="Your Core Arguments" color="var(--color-primary)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {(data.arguments || []).map((arg, i) => <ArgumentCard key={i} argument={arg} variant="argument" index={i} />)}
                </div>
              </CollapsibleSection>

              {/* Counterarguments */}
              <CollapsibleSection icon={<Shield size={16} />} title="Likely Counterarguments" color="var(--color-danger)" subtitle="Study these — your opponent will use them. Know them better than they do.">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {(data.counterarguments || []).map((arg, i) => <ArgumentCard key={i} argument={arg} variant="counter" index={i} />)}
                </div>
              </CollapsibleSection>

              {/* Rebuttals */}
              <CollapsibleSection icon={<MessageSquare size={16} />} title="Your Rebuttals" color="var(--color-accent)">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {(data.rebuttals || []).map((r, i) => (
                    <ArgumentCard key={i} argument={{ title: `Against: "${r.against}"`, explanation: r.rebuttal, strength: 'strong' }} variant="rebuttal" index={i} />
                  ))}
                </div>
              </CollapsibleSection>

              {/* Evidence */}
              <CollapsibleSection icon={<BookOpen size={16} />} title="Evidence & Examples" color="var(--color-gold)">
                <div style={{ background: 'var(--color-gold-dim)', border: '1px solid rgba(240,180,41,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 'var(--space-md)', fontSize: '0.82rem', color: 'var(--color-gold)' }}>
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>AI-generated for practice only. Always verify facts, statistics, and citations before using in a real debate.</span>
                </div>
                <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                  {(data.evidence || []).map((ev, i) => <EvidenceCard key={i} evidence={ev} />)}
                </div>
              </CollapsibleSection>

              {/* Debate Strategy */}
              {(data.debateStrategy || data.openingGuidance || data.closingGuidance) && (
                <CollapsibleSection icon={<Map size={16} />} title="Debate Strategy" color="var(--color-success)">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {data.debateStrategy && (
                      <div style={{ padding: 'var(--space-md)', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Overall Strategy</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)', lineHeight: 1.7 }}>{data.debateStrategy}</p>
                      </div>
                    )}
                    <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-md)' }}>
                      {data.openingGuidance && (
                        <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Opening Guidance</p>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{data.openingGuidance}</p>
                        </div>
                      )}
                      {data.closingGuidance && (
                        <div style={{ padding: 'var(--space-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Closing Guidance</p>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{data.closingGuidance}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CollapsibleSection>
              )}

              {/* Argument Refinement */}
              <CollapsibleSection icon={<Zap size={16} />} title="Refine My Argument" color="var(--color-gold)" subtitle="Write your own argument and get personal coaching on how to strengthen it." defaultOpen={false}>
                <RefinementPanel config={config} />
              </CollapsibleSection>

              {/* CTA */}
              <div style={{ padding: 'var(--space-xl)', background: 'linear-gradient(135deg, var(--color-primary-dim), var(--color-accent-dim))', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 6 }}>Ready to face the opponent?</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Study your material, then put it to the test in a live 5-round debate.</p>
                </div>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/practice')}>
                  Start Live Debate <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
