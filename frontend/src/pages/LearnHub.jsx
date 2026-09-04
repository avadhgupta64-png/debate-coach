import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Target,
  AlertTriangle,
  BookOpen,
  Clock,
  Zap,
  Shield,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  BookOpen as BookOpenIcon,
} from 'lucide-react';
import MetaTags from '../components/MetaTags.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

export default function LearnHub() {
  useDocumentTitle('Learn Debate');
  const pageUrl = 'https://debate-coach-zeta.vercel.app/learn';
  const pageImage = 'https://debate-coach-zeta.vercel.app/og-image.png';

  const resources = [
    {
      id: 'arguments',
      title: 'How to Build a Strong Argument',
      subtitle: 'Learn the PEEL structure and four essential argument types',
      icon: <Brain size={20} color="var(--color-primary)" />,
      color: 'var(--color-primary)',
      description: 'Master the foundation of all debate — constructing arguments that are clear, well-supported, and logically sound. Learn the PEEL structure and when to use empirical, principled, comparative, and consequentialist arguments.',
      path: '/learn/arguments',
    },
    {
      id: 'rebuttals',
      title: 'How to Rebut an Opposing Argument',
      subtitle: 'Use the DARE framework to dismantle flawed reasoning',
      icon: <Target size={20} color="var(--color-danger)" />,
      color: 'var(--color-danger)',
      description: 'Strong debaters don\'t just state their case — they actively dismantle the opposition. Learn the DARE rebuttal framework and five proven rebuttal types that work in any format.',
      path: '/learn/rebuttals',
    },
    {
      id: 'fallacies',
      title: 'Logical Fallacies in Debate',
      subtitle: 'Spot and avoid common reasoning errors',
      icon: <AlertTriangle size={20} color="var(--color-warning)" />,
      color: 'var(--color-warning)',
      description: 'Logical fallacies undermine credibility. This guide covers the most common fallacies you\'ll encounter — and how to both avoid them and exploit them in your opponent\'s arguments.',
      path: '/learn/fallacies',
    },
    {
      id: 'evidence',
      title: 'How to Use Evidence Effectively',
      subtitle: 'Choose credible sources and integrate them smoothly',
      icon: <BookOpen size={20} color="var(--color-success)" />,
      color: 'var(--color-success)',
      description: 'Evidence turns opinions into arguments. Learn how to evaluate source credibility, integrate statistics and quotes naturally, and avoid the common mistake of dumping evidence without explanation.',
      path: '/learn/evidence',
    },
    {
      id: 'preparation',
      title: 'How to Prepare for a Debate',
      subtitle: 'Create a balanced brief for both sides',
      icon: <Clock size={20} color="var(--color-gold)" />,
      color: 'var(--color-gold)',
      description: 'Preparation separates confident debaters from overwhelmed ones. Learn how to build a two-sided briefing quickly, anticipate counterarguments, and focus your research on the strongest points.',
      path: '/learn/preparation',
    },
    {
      id: 'techniques',
      title: 'Debate Techniques for Beginners',
      subtitle: 'Essential habits that improve faster than raw talent',
      icon: <Zap size={20} color="var(--color-accent)" />,
      color: 'var(--color-accent)',
      description: 'You don\'t need years of experience to debate well. These ten techniques — from lead-with-your strongest-point to signpost your structure — are proven to improve performance quickly.',
      path: '/learn/techniques',
    },
    {
      id: 'mistakes',
      title: 'Common Debate Mistakes',
      subtitle: 'Avoid the errors that hold even smart debaters back',
      icon: <Shield size={20} color="var(--color-text-muted)" />,
      color: 'var(--color-text-muted)',
      description: 'The best debaters win by avoiding mistakes as much as by doing things right. This guide covers what actually holds debaters back — and how to fix those habits before they hurt your performance.',
      path: '/learn/mistakes',
    },
  ];

  return (
    <div className="page-fade" style={{ minHeight: '100vh' }}>
      <MetaTags
        title="Learn Debate — Debate Coach"
        description="Free educational hub with guides on building arguments, delivering rebuttals, spotting logical fallacies, using evidence effectively, and more. Practical, beginner-friendly debate techniques."
        url={pageUrl}
        image={pageImage}
      />

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
            <BookOpenIcon size={13} color="var(--color-primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Free Educational Hub
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.15,
              marginBottom: 'var(--space-md)',
            }}
          >
            Learn Debate
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.75,
              marginBottom: 'var(--space-xl)',
            }}
          >
            Practical, beginner-friendly guides on building arguments, delivering rebuttals,
            spotting logical fallacies, using evidence, and more. No fluff — just the techniques
            that actually improve your debating.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              Start Practising
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn About Debate Coach
            </Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)' }}>
            Choose a topic to start learning
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
            {resources.map((resource) => (
              <Link
                key={resource.id}
                to={resource.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  className="card"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-md)',
                    transition: 'border-color var(--transition-base)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-sm)',
                      marginBottom: 'var(--space-sm)',
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        background: resource.color + '18',
                        border: `1px solid ${resource.color}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {resource.icon}
                    </div>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: resource.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        margin: 0,
                      }}
                    >
                      Guide
                    </p>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-xs)',
                      }}
                    >
                      {resource.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--space-md)',
                      }}
                    >
                      {resource.subtitle}
                    </p>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        lineHeight: 1.7,
                        marginBottom: 'var(--space-lg)',
                        flex: 1,
                      }}
                    >
                      {resource.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-xs)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: resource.color,
                      marginTop: 'auto',
                    }}
                  >
                    Read this guide
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section style={{ padding: 'var(--space-3xl) 0' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div
            style={{
              padding: 'var(--space-2xl)',
              background: 'linear-gradient(135deg, var(--color-primary-dim) 0%, rgba(124,106,245,0.08) 100%)',
              border: '1px solid rgba(79,142,247,0.2)',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>
              Ready to apply what you\'ve learned?
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-xl)',
                maxWidth: 520,
                margin: '0 auto var(--space-xl)',
              }}
            >
              Reading about debate techniques is useful. Practising them against a live AI opponent
              is how you actually become better.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-primary btn-lg">
                Start Your First Debate
                <ArrowRight size={18} />
              </Link>
              <Link to="/history" className="btn btn-secondary btn-lg">
                My History
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-xl) 0', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-md)' }}>
              Additional Resources
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Check out our comprehensive debate resources section for more detailed guides and tips.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/resources"
              style={{
                padding: '10px 20px',
                border: '1px solid rgba(79,142,247,0.25)',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary-dim)',
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              More Debate Resources
            </Link>
            <Link
              to="/about"
              style={{
                padding: '10px 20px',
                border: '1px solid rgba(124,106,245,0.25)',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-accent-dim)',
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              About Debate Coach
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: 'var(--space-xl) 0' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-lg)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-sm)' }}>
              Debating is a skill — and like any skill, it improves with deliberate practice.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Whether you\'re new to debate or preparing for competition, these guides help you
              build a strong foundation and avoid common pitfalls.
            </p>
            <div style={{ marginTop: 'var(--space-md)' }}>
              <Link to="/" className="btn btn-primary">
                Start Practising Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
