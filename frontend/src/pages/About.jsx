import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Mic2,
  Sparkles,
  GraduationCap,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react';
import debateCoachLogo from '/debate-coach-logo.png';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

// ─── Section card ─────────────────────────────────────────────────────────────

function InfoCard({ icon, color, title, children }) {
  return (
    <div
      className="card"
      style={{ borderLeft: `3px solid ${color}`, padding: 'var(--space-lg)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-md)' }}>
        <span style={{ color }}>{icon}</span>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          {title}
        </h3>
      </div>
      <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function About() {
  const navigate = useNavigate();
  useDocumentTitle('About — Debate Coach');

  return (
    <div className="page-fade">
      <div className="container-narrow">
        <div className="page-content">

          {/* Back button */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(-1)}
            style={{ marginBottom: 'var(--space-lg)', alignSelf: 'flex-start' }}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Hero */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: 'var(--space-2xl)',
              paddingBottom: 'var(--space-2xl)',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-lg)' }}>
              <img
                src={debateCoachLogo}
                alt="Debate Coach"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'contain',
                  boxShadow: '0 0 32px rgba(79,142,247,0.35), 0 4px 16px rgba(0,0,0,0.4)',
                }}
              />
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              About Debate Coach
            </h1>
            <p
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '1rem',
                maxWidth: 520,
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              An AI-powered training platform that helps students think sharper,
              argue smarter, and speak with confidence.
            </p>
          </div>

          {/* About the creator */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">The Creator</p>

            <div
              className="card"
              style={{
                padding: 'var(--space-xl)',
                background: 'var(--color-surface)',
                borderTop: '2px solid var(--color-primary)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-lg)',
                  flexWrap: 'wrap',
                }}
              >
                {/* Avatar initial */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: 'var(--color-primary-dim)',
                    border: '2px solid rgba(79,142,247,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                  }}
                >
                  A
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: 4,
                    }}
                  >
                    Avadh Gupta
                  </h2>
                  <p
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      marginBottom: 'var(--space-md)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Founder & Developer
                  </p>
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.95rem',
                      lineHeight: 1.8,
                      marginBottom: 'var(--space-md)',
                    }}
                  >
                    <strong>Debate Coach was founded and developed by Avadh Gupta.</strong>
                  </p>
                  <p
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: '0.95rem',
                      lineHeight: 1.8,
                    }}
                  >
                    Hi — I'm Avadh. I'm 14 years old and I built Debate Coach from scratch because
                    I wanted a smarter way to practise debating. I'm passionate about technology,
                    AI, and building things that are actually useful. Debate Coach is the result of
                    combining two things I enjoy: writing software and getting better at arguing
                    ideas clearly.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Interests */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Interests &amp; Skills</p>
            <div
              className="grid-2"
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 'var(--space-md)',
              }}
            >
              <InfoCard icon={<Code2 size={18} />} color="var(--color-primary)" title="Technology &amp; Development">
                I enjoy building full-stack applications and exploring what's possible with modern
                web tools. Debate Coach uses React, Node.js, and an AI backend — most of which I
                learnt while building it.
              </InfoCard>

              <InfoCard icon={<Sparkles size={18} />} color="var(--color-accent)" title="Artificial Intelligence">
                AI fascinates me — not just as a buzzword, but as a practical tool. I'm interested
                in how language models can give genuinely useful, specific feedback rather than
                generic responses.
              </InfoCard>

              <InfoCard icon={<Mic2 size={18} />} color="var(--color-success)" title="Debate &amp; Public Speaking">
                Debating teaches you to think on your feet, organise arguments under pressure, and
                engage seriously with opposing views. It's a skill that improves everything else
                you do.
              </InfoCard>

              <InfoCard icon={<GraduationCap size={18} />} color="var(--color-gold)" title="Learning by Building">
                My preferred way to learn something new is to build a real project with it.
                Debate Coach taught me more about AI APIs, authentication, and state management
                than any tutorial could.
              </InfoCard>
            </div>
          </section>

          {/* About the app */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">About the App</p>

            <div
              className="card"
              style={{ borderLeft: '3px solid var(--color-success)', padding: 'var(--space-lg)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-md)' }}>
                <MessageSquare size={18} color="var(--color-success)" />
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                  Why I Built This
                </h3>
              </div>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.925rem',
                  lineHeight: 1.8,
                  marginBottom: 'var(--space-md)',
                }}
              >
                Most debate practice tools either give you static reading material or connect you
                with another person. I wanted something in between — an AI opponent that reacts to
                what you actually say, gives honest per-round feedback, and helps you identify
                patterns in your reasoning over time.
              </p>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.925rem',
                  lineHeight: 1.8,
                }}
              >
                Debate Coach guides you through a full session: generating preparation material,
                sparring across five rounds against an adaptive AI opponent, and giving you a
                detailed report at the end — including logical fallacy detection, per-skill
                scoring, and specific coaching notes. The goal is to make deliberate practice
                accessible to any student, anywhere.
              </p>
            </div>
          </section>

          {/* Footer note */}
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-xl)',
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem',
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <p>
              Debate Coach · Built by Avadh Gupta
            </p>
            <p style={{ marginTop: 6, fontSize: '0.78rem', opacity: 0.7 }}>
              Scores on a 0–10 scale · AI-powered coaching · Works in demo mode without any credentials
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
