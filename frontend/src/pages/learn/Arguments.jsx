import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Target,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import MetaTags from '../../components/MetaTags.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function ArgumentsPage() {
  useDocumentTitle('How to Build a Strong Argument');
  const pageUrl = 'https://debate-coach-zeta.vercel.app/learn/arguments';
  const pageImage = 'https://debate-coach-zeta.vercel.app/og-image.png';

  return (
    <div className="page-fade" style={{ minHeight: '100vh' }}>
      <MetaTags
        title="How to Build a Strong Argument — Debate Coach"
        description="Learn the PEEL structure and four essential argument types that make your case persuasive and memorable. Master claims, evidence, explanation, and link."
        url={pageUrl}
        image={pageImage}
      />
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-bg) 100%)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-2xl) 0 var(--space-xl)',
        }}
      >
        <div className="container" style={{ maxWidth: 760 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-dim)',
              border: '1px solid rgba(79,142,247,0.2)',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <Brain size={13} color="var(--color-primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Argumentation Guide
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              marginBottom: 'var(--space-md)',
            }}
          >
            How to Build a Strong Argument
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.75,
            }}
          >
            Learn the PEEL structure and four essential argument types that make your case persuasive and memorable.
          </p>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          {/* Introduction */}
          <article style={{ marginBottom: 'var(--space-2xl)' }}>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                marginBottom: 'var(--space-xl)',
              }}
            >
              A strong argument is not just an opinion stated loudly. It has a clear structure,
              honest evidence, and a logical link between premise and conclusion. In debate,
              arguments are your currency — and the stronger your arguments, the more persuasive
              you become.
            </p>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                marginBottom: 'var(--space-xl)',
              }}
            >
              This guide covers the most reliable argument-building method used by competitive
              debaters, plus the four main types of arguments and when to use each one.
            </p>
          </article>

          {/* PEEL Structure */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              <Brain size={22} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                The PEEL Structure
              </h2>
            </div>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                marginBottom: 'var(--space-lg)',
              }}
            >
              PEEL is the most reliable single-argument structure for debate. Each argument you
              make should follow this pattern:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { letter: 'P', word: 'Point', desc: 'State your claim clearly in one sentence. "Banning single-use plastics would significantly reduce ocean pollution."' },
                { letter: 'E', word: 'Evidence', desc: 'Support the claim with a specific fact, statistic, study, or example. "The UN Environment Programme estimates 8 million tonnes of plastic enter the ocean annually, 40% of which is single-use."' },
                { letter: 'E', word: 'Explanation', desc: 'Explain the logical link between your evidence and your point. "Since the majority of ocean plastic originates as single-use items, restricting them at source would reduce ocean influx at scale."' },
                { letter: 'L', word: 'Link', desc: 'Connect back to the motion or your overall case. "This directly supports our position that legislative action is the most effective lever for protecting marine ecosystems."' },
              ].map((item) => (
                <div
                  key={item.letter + item.word}
                  style={{
                    display: 'flex',
                    gap: 'var(--space-md)',
                    alignItems: 'flex-start',
                    padding: 'var(--space-lg)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div
                    style={{
                      minWidth: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-primary-dim)',
                      border: `1px solid rgba(79,142,247,0.25)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: 'var(--color-primary)',
                      flexShrink: 0,
                    }}
                  >
                    {item.letter}
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-xs)',
                      }}
                    >
                      {item.word}
                    </p>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.7,
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Argument Types */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              <Target size={22} color="var(--color-success)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                Four Types of Arguments
              </h2>
            </div>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.8,
                marginBottom: 'var(--space-xl)',
              }}
            >
              Different situations call for different argument strategies. Here are the four
              main types and when to use them:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-lg)' }}>
              <div
                className="card"
                style={{ borderLeft: '3px solid var(--color-primary)', padding: 'var(--space-lg)' }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  <Target size={18} color="var(--color-primary)" />
                </div>
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  Empirical Arguments
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  Based on evidence, data, or observed facts. Most persuasive when the data is
                  recent, from a credible source, and directly relevant to the motion. Best for
                  policy and science debates.
                </p>
              </div>

              <div
                className="card"
                style={{ borderLeft: '3px solid var(--color-success)', padding: 'var(--space-lg)' }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-success-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  <Shield size={18} color="var(--color-success)" />
                </div>
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  Principled Arguments
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  Based on values, rights, or moral principles. Effective when the empirical
                  evidence is contested or when you want to establish a framework the audience
                  already accepts (e.g., freedom, fairness).
                </p>
              </div>

              <div
                className="card"
                style={{ borderLeft: '3px solid var(--color-gold)', padding: 'var(--space-lg)' }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-gold-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  <Zap size={18} color="var(--color-gold)" />
                </div>
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  Comparative Arguments
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  Show that your solution is better than the alternative, not just that it has
                  some merit. "Policy A is better than Policy B because..." This wins debates
                  where both sides have valid points.
                </p>
              </div>

              <div
                className="card"
                style={{ borderLeft: '3px solid var(--color-danger)', padding: 'var(--space-lg)' }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-danger-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-md)',
                  }}
                >
                  <Brain size={18} color="var(--color-danger)" />
                </div>
                <h3
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  Consequentialist Arguments
                </h3>
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  Focus on outcomes: what happens if this policy passes or fails? Projecting
                  forward consequences is compelling, but needs to be grounded in evidence to
                  avoid sounding speculative.
                </p>
              </div>
            </div>
          </section>

          {/* Practical Tips */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              <CheckCircle2 size={22} color="var(--color-accent)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                Quick Tips for Stronger Arguments
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { title: 'Lead with clarity', desc: 'State your point in one clear sentence before diving into evidence. Judges and audiences need to know where you stand immediately.' },
                { title: 'Use recent, credible sources', desc: 'A 2024 study is more persuasive than a 2010 study — unless the older study is the original or landmark research.' },
                { title: 'Explain the link', desc: 'Don\'t assume the audience sees why your evidence proves your point. Bridge that gap explicitly: "This means..." or "Therefore..."' },
                { title: 'Avoid overclaiming', desc: 'Stick to what your evidence actually supports. Overstating weakens credibility and gives opponents easy targets.' },
              ].map((tip, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: 'var(--space-md) var(--space-lg)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.7,
                  }}
                >
                  <p style={{ fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>
                    {tip.title}
                  </p>
                  {tip.desc}
                </div>
              ))}
            </div>
          </section>

          {/* Next Steps */}
          <section
            style={{
              padding: 'var(--space-xl)',
              background: 'linear-gradient(135deg, var(--color-primary-dim) 0%, rgba(124,106,245,0.08) 100%)',
              border: '1px solid rgba(79,142,247,0.2)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              Ready to test this?
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-lg)',
              }}
            >
              Use Debate Coach to practice building arguments under pressure. The AI opponent
              will challenge your reasoning, helping you strengthen your cases.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-primary">
                Start Practising
              </Link>
              <Link to="/learn/rebuttals" className="btn btn-secondary">
                Learn Rebuttals
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
