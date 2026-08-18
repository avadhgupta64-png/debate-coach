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
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Debate Coach",
        "description": "An AI-powered debate training platform that helps users prepare arguments, anticipate counterarguments, practice rebuttals, debate against an AI opponent, and receive detailed performance feedback.",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web",
        "url": "https://debate-coach-zeta.vercel.app/",
        "creator": {
          "@type": "Person",
          "name": "Avadh Gupta",
          "description": "Founder and Developer of Debate Coach",
          "jobTitle": "Founder & Developer"
        },
        "author": {
          "@type": "Person",
          "name": "Avadh Gupta"
        },
        "developer": {
          "@type": "Person",
          "name": "Avadh Gupta"
        },
        "funder": {
          "@type": "Person",
          "name": "Avadh Gupta"
        }
      })}
      </script>

      <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Avadh Gupta",
        "jobTitle": "Founder & Developer",
        "description": "Founder and Developer of Debate Coach",
        "url": "https://debate-coach-zeta.vercel.app/about"
      })}
      </script>

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

          {/* Hero - Strong Founder Attribution at Top */}
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

            {/* Strong Creator Attribution - Near Top */}
            <div
              className="card"
              style={{
                padding: 'var(--space-xl)',
                background: 'var(--color-surface)',
                borderTop: '2px solid var(--color-primary)',
                marginTop: 'var(--space-lg)',
              }}
            >
              <h2
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-md)',
                }}
              >
                Creator
              </h2>
              <p
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.8,
                  marginBottom: 'var(--space-md)',
                }}
              >
                <strong>Debate Coach is an AI-powered debate training platform founded and developed by Avadh Gupta.</strong>
              </p>
              <p
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: 'var(--space-md)',
                }}
              >
                Avadh Gupta — Founder & Developer
              </p>
              <p
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.95rem',
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                Avadh Gupta is the creator of Debate Coach, building the platform from scratch to help students develop stronger arguments and speak with confidence through AI-powered debate practice.
              </p>
            </div>
          </div>

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
              Debate Coach © 2026 — Founded & developed by Avadh Gupta
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
