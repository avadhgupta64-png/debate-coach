import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Mic2,
  Sparkles,
  GraduationCap,
  MessageSquare,
  BookOpen,
  Target,
  Users,
  Award,
  Brain,
  Swords,
  TrendingUp,
  CheckCircle,
  ArrowRight,
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

function FeatureRow({ icon, color, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-md)',
          background: color + '18',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>{title}</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function About() {
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
        "author": { "@type": "Person", "name": "Avadh Gupta" }
      })}
      </script>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-bg) 100%)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-2xl) 0 var(--space-xl)',
          textAlign: 'center',
        }}
      >
        <div className="container-narrow">
          <img
            src={debateCoachLogo}
            alt="Debate Coach"
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-lg)',
              objectFit: 'contain',
              boxShadow: '0 0 32px rgba(79,142,247,0.35), 0 4px 16px rgba(0,0,0,0.4)',
              marginBottom: 'var(--space-lg)',
            }}
          />
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--space-md)',
              lineHeight: 1.2,
            }}
          >
            About Debate Coach
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.75,
              maxWidth: 580,
              margin: '0 auto var(--space-xl)',
            }}
          >
            Debate Coach is a free AI-powered debate training platform designed to help students,
            competitors, and curious learners practise argumentation, sharpen their reasoning, and
            become more confident speakers — without needing a debate partner.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary">
              <Swords size={16} /> Start Practising
            </Link>
            <Link to="/resources" className="btn btn-secondary">
              <BookOpen size={16} /> Debate Resources
            </Link>
          </div>
        </div>
      </section>

      <div className="container-narrow">
        <div className="page-content">

          {/* ── Creator section ─────────────────────────────────────────────── */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Creator</p>
            <div
              className="card"
              style={{
                padding: 'var(--space-xl)',
                borderTop: '2px solid var(--color-primary)',
              }}
            >
              <p
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.8,
                  marginBottom: 'var(--space-md)',
                }}
              >
                <strong>Debate Coach was founded and built by Avadh Gupta.</strong>
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
                Avadh Gupta — Founder &amp; Developer
              </p>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
                Avadh Gupta built Debate Coach from scratch to give students a way to practise
                debate independently — with an AI opponent that actually challenges them, feedback
                that is specific rather than generic, and progress tracking that rewards consistency.
                The entire platform — design, frontend, backend, and AI integration — was
                developed by Avadh.
              </p>
            </div>
          </section>

          {/* ── What is Debate Coach ─────────────────────────────────────────── */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">What Is Debate Coach</p>
            <div
              className="card"
              style={{ borderLeft: '3px solid var(--color-success)', padding: 'var(--space-lg)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--space-md)' }}>
                <MessageSquare size={18} color="var(--color-success)" />
                <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
                  An AI Practice Partner for Debate
                </h2>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: 'var(--space-md)' }}>
                Debate Coach takes you through a full structured debate session: you choose a topic
                and position, receive an AI-generated preparation brief covering both sides of the
                argument, then spar across five rounds against an adaptive AI opponent. At the end,
                you receive a detailed performance report.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: 'var(--space-md)' }}>
                The AI opponent is not a push-over. It adapts its counterarguments to what you
                actually say — if your argument is weak, it exploits that; if your argument is
                strong, it challenges you from a different angle. The goal is to create the kind of
                challenge you'd face in a real competitive debate.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: 1.8, margin: 0 }}>
                Because sessions are available anytime, you can practise daily without coordinating
                schedules with another person. The platform tracks your scores across sessions so
                you can see real improvement over time.
              </p>
            </div>
          </section>

          {/* ── Features ─────────────────────────────────────────────────────── */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Platform Features</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <FeatureRow
                icon={<Brain size={18} />}
                color="var(--color-primary)"
                title="AI Debate Preparation"
                desc="Before each session, the AI generates a structured brief covering the strongest arguments for and against your chosen position. This mirrors how competitive debaters research before a round and ensures you enter the debate with a plan."
              />
              <FeatureRow
                icon={<Swords size={18} />}
                color="var(--color-accent)"
                title="Live AI Sparring — Five Rounds"
                desc="Each debate runs across five rounds. You deliver your argument, the AI responds with a genuine counterargument targeted at what you said — not a generic rebuttal. The conversation builds in complexity as the debate progresses."
              />
              <FeatureRow
                icon={<Target size={18} />}
                color="var(--color-success)"
                title="Per-Round Coaching Feedback"
                desc="After each round, you receive specific coaching notes on what you did well and what to improve. Feedback covers argument clarity, use of evidence, logical structure, and rebuttal quality — not just a score."
              />
              <FeatureRow
                icon={<Award size={18} />}
                color="var(--color-gold)"
                title="Detailed Results Report"
                desc="The end-of-session results page breaks down your performance by skill (clarity, evidence, logic, rebuttals), identifies any logical fallacies used, shows a round-by-round score graph, and gives a summary coaching note with specific improvement targets."
              />
              <FeatureRow
                icon={<TrendingUp size={18} />}
                color="var(--color-danger)"
                title="Progress Tracking"
                desc="Every completed debate is saved to your history. Your profile page tracks your average score over time, your strongest and weakest skills, your current practice streak, and your improvement trend. Consistent practice is what produces real skill gains."
              />
              <FeatureRow
                icon={<BookOpen size={18} />}
                color="var(--color-text-muted)"
                title="Multiple Debate Formats"
                desc="Debate Coach supports British Parliamentary, Oxford-style, Lincoln-Douglas, and open freestyle formats. You can set difficulty from beginner to competition level. The AI adjusts its behaviour accordingly."
              />
            </div>
          </section>

          {/* ── Who it's for ─────────────────────────────────────────────────── */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Who Debate Coach Is For</p>
            <div
              className="grid-2"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-md)' }}
            >
              <InfoCard icon={<GraduationCap size={18} />} color="var(--color-primary)" title="Students and Debate Club Members">
                If you compete in school or university debate, Debate Coach gives you a way to
                practise beyond club hours. You can drill specific topics, try both sides of a
                motion, and use the feedback to identify exactly which skills your coach should
                focus on with you.
              </InfoCard>
              <InfoCard icon={<Mic2 size={18} />} color="var(--color-accent)" title="Public Speakers and Presenters">
                The skills that make a good debater — clear structure, handling objections,
                delivering evidence confidently — directly transfer to presentations, pitches, and
                public speaking. Debate Coach is used by people who want to improve how they
                communicate ideas under pressure.
              </InfoCard>
              <InfoCard icon={<Users size={18} />} color="var(--color-success)" title="Curious Learners and Critical Thinkers">
                You don't need to be in a debate competition to benefit. If you want to think more
                rigorously, understand both sides of complex issues, or practise constructing
                evidence-based arguments, Debate Coach is useful for that too.
              </InfoCard>
              <InfoCard icon={<Code2 size={18} />} color="var(--color-gold)" title="Teachers and Educators">
                Debate Coach can be used as a classroom tool for practising argumentation and
                critical thinking. Students can practise individually between classes and bring
                better-prepared arguments to in-class discussions.
              </InfoCard>
            </div>
          </section>

          {/* ── Educational value ────────────────────────────────────────────── */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Educational Value</p>
            <div className="card" style={{ padding: 'var(--space-lg)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                Why Debate Training Matters
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: 'var(--space-md)' }}>
                Debate training is one of the most effective educational activities for developing
                transferable skills. Research in educational psychology consistently shows that
                structured debate improves critical thinking, verbal reasoning, and the ability to
                construct and evaluate arguments. These are skills that matter in every academic
                discipline and professional context.
              </p>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', lineHeight: 1.8, marginBottom: 'var(--space-lg)' }}>
                The specific skills Debate Coach helps build:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { skill: 'Structured argumentation', desc: 'Learning to make claims, support them with evidence, and explain the logical link between the two.' },
                  { skill: 'Critical evaluation', desc: 'Identifying weak reasoning, unsupported claims, and logical fallacies — in your own arguments and others\'.' },
                  { skill: 'Rebuttal and counter-reasoning', desc: 'Responding to challenges under pressure, without losing coherence or resorting to rhetorical tricks.' },
                  { skill: 'Research and preparation', desc: 'Learning how to quickly build a case on an unfamiliar topic using the best available evidence.' },
                  { skill: 'Communication clarity', desc: 'Expressing complex ideas precisely, in a form that a non-specialist can follow and evaluate.' },
                ].map((item) => (
                  <div key={item.skill} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <CheckCircle size={15} color="var(--color-success)" style={{ marginTop: 3, flexShrink: 0 }} />
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
                      <strong style={{ color: 'var(--color-text-primary)' }}>{item.skill}:</strong> {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Builder's note ───────────────────────────────────────────────── */}
          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <p className="section-label">Why It Was Built</p>
            <div
              className="grid-2"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-md)' }}
            >
              <InfoCard icon={<Code2 size={18} />} color="var(--color-primary)" title="Technology &amp; Development">
                Debate Coach is a full-stack web app built with React, Node.js, and Firebase.
                Most of what went into it was learnt during the building process — which is
                exactly the point.
              </InfoCard>
              <InfoCard icon={<Sparkles size={18} />} color="var(--color-accent)" title="Practical AI">
                The AI backend is designed to give genuinely useful, specific feedback — not
                generic praise. That's harder than it sounds, and it's what makes the coaching
                actually valuable rather than just impressive-looking.
              </InfoCard>
              <InfoCard icon={<Mic2 size={18} />} color="var(--color-success)" title="Debate Skills">
                Debate teaches you to think fast, organise arguments under pressure, and take
                opposing views seriously. It's one of the best intellectual training activities
                that exists, and most people never get access to it.
              </InfoCard>
              <InfoCard icon={<GraduationCap size={18} />} color="var(--color-gold)" title="Learning by Building">
                The best way to learn something is to build something real with it. Debate Coach
                was built as a genuine project — and it turned into something genuinely useful.
              </InfoCard>
            </div>
          </section>

          {/* ── Links ────────────────────────────────────────────────────────── */}
          <section
            style={{
              padding: 'var(--space-xl)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-md)' }}>
              More from Debate Coach
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
              {[
                { to: '/resources', label: 'Debate Resources', icon: <BookOpen size={15} /> },
                { to: '/contact', label: 'Contact', icon: <MessageSquare size={15} /> },
                { to: '/privacy', label: 'Privacy Policy', icon: <ArrowRight size={15} /> },
                { to: '/terms', label: 'Terms of Service', icon: <ArrowRight size={15} /> },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    padding: '6px 12px',
                    border: '1px solid rgba(79,142,247,0.25)',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary-dim)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {l.icon} {l.label}
                </Link>
              ))}
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
            <p>Debate Coach © 2026 — Founded &amp; developed by Avadh Gupta</p>
            <p style={{ marginTop: 6, fontSize: '0.78rem', opacity: 0.7 }}>
              Scores on a 0–10 scale · AI-powered coaching · Free to use
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
