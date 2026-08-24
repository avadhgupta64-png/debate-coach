import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, ArrowLeft, Github, ExternalLink } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function Contact() {
  useDocumentTitle('Contact — Debate Coach');

  return (
    <div className="page-fade">
      <div className="container-narrow">
        <div className="page-content">

          {/* Back */}
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              marginBottom: 'var(--space-lg)',
            }}
          >
            <ArrowLeft size={15} /> Back to Home
          </Link>

          {/* Header */}
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <h1
              style={{
                fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              Contact
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Debate Coach is built and maintained by Avadh Gupta. If you have feedback, a bug
              report, a question about the platform, or a privacy/data request, you can reach out
              using the options below.
            </p>
          </div>

          {/* Contact cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>

            {/* Email */}
            <div
              className="card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-md)',
                borderLeft: '3px solid var(--color-primary)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Mail size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                  Email
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                  For general enquiries, feedback, bug reports, or data/privacy requests.
                </p>
                <a
                  href="mailto:contact@debatecoach.app"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                  }}
                >
                  contact@debatecoach.app <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* GitHub */}
            <div
              className="card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-md)',
                borderLeft: '3px solid var(--color-accent)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(124,106,245,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Github size={20} color="var(--color-accent)" />
              </div>
              <div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                  GitHub Issues
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                  Found a bug or have a feature request? Opening a GitHub issue is the fastest way
                  to get it tracked and addressed.
                </p>
                <a
                  href="https://github.com/avadhgupta/debate-coach/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                  }}
                >
                  Open an issue <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Feedback */}
            <div
              className="card"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-md)',
                borderLeft: '3px solid var(--color-success)',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(34,197,94,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MessageSquare size={20} color="var(--color-success)" />
              </div>
              <div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                  Feature Feedback
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  Have an idea to improve Debate Coach — a new debate format, a coaching feature, or
                  a UI improvement? Email us or open a GitHub discussion. All serious suggestions are
                  considered for future updates.
                </p>
              </div>
            </div>

          </div>

          {/* Response time note */}
          <div
            style={{
              padding: 'var(--space-lg)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: 'var(--color-text-secondary)' }}>Response time:</strong> We
            aim to respond to email enquiries within 3–5 business days. For urgent data deletion or
            privacy requests, please include "Privacy Request" in the subject line.
          </div>

          {/* Policy links */}
          <div
            style={{
              marginTop: 'var(--space-xl)',
              paddingTop: 'var(--space-lg)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: 'var(--space-lg)',
              flexWrap: 'wrap',
              fontSize: '0.875rem',
            }}
          >
            <Link to="/privacy" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/about" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>About Debate Coach</Link>
          </div>

        </div>
      </div>
    </div>
  );
}
