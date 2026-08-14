import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { useDebate } from '../App.jsx';
import { useToast } from '../App.jsx';
import { useDebateSession } from '../hooks/useDebateSession.js';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ArgumentCard from '../components/ArgumentCard.jsx';
import EvidenceCard from '../components/EvidenceCard.jsx';
import PositionBadge from '../components/PositionBadge.jsx';

function SectionHeader({ icon, title, color }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
        marginBottom: 'var(--space-md)',
        paddingBottom: 'var(--space-sm)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <span style={{ color }}>{icon}</span>
      <h2
        style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          margin: 0,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

export default function Preparation() {
  const navigate = useNavigate();
  const { debate, setPreparation } = useDebate();
  const { addToast } = useToast();
  const { loading, error, generate } = useDebateSession();
  const [data, setData] = useState(null);

  const config = debate.config;
  useDocumentTitle('Prepare for Debate');

  useEffect(() => {
    if (!config) {
      navigate('/setup');
      return;
    }
    // Use cached preparation if available
    if (debate.preparation) {
      setData(debate.preparation);
      return;
    }
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

  const handleRegenerate = () => {
    setData(null);
    fetchPreparation();
  };

  const handleStartPractice = () => {
    navigate('/practice');
  };

  if (!config) return null;

  return (
    <div className="page-fade">
      <div className="container">
        <div className="page-content">
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--space-lg)',
              marginBottom: 'var(--space-2xl)',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/setup')}
                style={{ marginBottom: 'var(--space-md)' }}
              >
                <ChevronLeft size={16} /> Back
              </button>
              <p className="section-label">Debate Preparation</p>
              <h1
                style={{
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-sm)',
                  maxWidth: 600,
                }}
              >
                {config.topic}
              </h1>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                <PositionBadge position={config.position} size="sm" />
                <span
                  className="badge badge-muted"
                  style={{ textTransform: 'capitalize' }}
                >
                  {config.difficulty}
                </span>
                <span
                  className="badge badge-muted"
                  style={{ textTransform: 'capitalize' }}
                >
                  {config.debateType}
                </span>
                {data?.mode === 'demo' && (
                  <span className="badge badge-gold">Demo Mode</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={handleRegenerate}
                disabled={loading}
              >
                <RefreshCw size={16} className={loading ? 'spin' : ''} />
                Regenerate
              </button>
              <button
                className="btn btn-primary"
                onClick={handleStartPractice}
                disabled={!data || loading}
              >
                Start Practice
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <LoadingSpinner
              size="lg"
              message="Preparing your debate arguments..."
            />
          )}

          {/* Error */}
          {error && !loading && (
            <div
              className="card"
              style={{
                borderColor: 'var(--color-danger)',
                background: 'var(--color-danger-dim)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                flexWrap: 'wrap',
              }}
            >
              <AlertTriangle size={20} color="var(--color-danger)" />
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--color-danger)', fontWeight: 600, marginBottom: 4 }}>
                  Failed to load preparation
                </p>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{error}</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={handleRegenerate}>
                Retry
              </button>
            </div>
          )}

          {/* Content */}
          {data && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
              {/* Your Arguments */}
              <section>
                <SectionHeader
                  icon={<Swords size={16} />}
                  title="Your Core Arguments"
                  color="var(--color-primary)"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {(data.arguments || []).map((arg, i) => (
                    <ArgumentCard key={i} argument={arg} variant="argument" index={i} />
                  ))}
                </div>
              </section>

              {/* Counterarguments */}
              <section>
                <SectionHeader
                  icon={<Shield size={16} />}
                  title="Likely Counterarguments"
                  color="var(--color-danger)"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {(data.counterarguments || []).map((arg, i) => (
                    <ArgumentCard key={i} argument={arg} variant="counter" index={i} />
                  ))}
                </div>
              </section>

              {/* Rebuttals */}
              <section>
                <SectionHeader
                  icon={<MessageSquare size={16} />}
                  title="Your Rebuttals"
                  color="var(--color-accent)"
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {(data.rebuttals || []).map((r, i) => (
                    <ArgumentCard
                      key={i}
                      argument={{
                        title: `Rebuttal ${i + 1}`,
                        explanation: r.rebuttal,
                        against: r.against,
                        strength: 'strong',
                      }}
                      variant="rebuttal"
                      index={i}
                    />
                  ))}
                </div>
              </section>

              {/* Evidence */}
              <section>
                <SectionHeader
                  icon={<BookOpen size={16} />}
                  title="Evidence & Examples"
                  color="var(--color-gold)"
                />
                <div
                  style={{
                    background: 'var(--color-gold-dim)',
                    border: '1px solid rgba(240,180,41,0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    marginBottom: 'var(--space-md)',
                    fontSize: '0.82rem',
                    color: 'var(--color-gold)',
                  }}
                >
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>
                    All evidence below is AI-generated for practice purposes. Always verify facts, statistics, and citations before using in a real debate.
                  </span>
                </div>
                <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
                  {(data.evidence || []).map((ev, i) => (
                    <EvidenceCard key={i} evidence={ev} />
                  ))}
                </div>
              </section>

              {/* CTA */}
              <div
                style={{
                  padding: 'var(--space-xl)',
                  background: 'linear-gradient(135deg, var(--color-primary-dim), var(--color-accent-dim))',
                  border: '1px solid rgba(79,142,247,0.2)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-lg)',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <h3 style={{ color: 'var(--color-text-primary)', marginBottom: 6 }}>
                    Ready to face the challenge?
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                    Study your arguments, then test them against the AI opponent.
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleStartPractice}
                >
                  Start Practice
                  <ChevronRight size={18} />
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
