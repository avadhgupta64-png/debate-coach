import React from 'react';
import { Link } from 'react-router-dom';
import { Target, ArrowRight, CheckCircle2, Brain, Zap, Shield } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function RebuttalsPage() {
  useDocumentTitle('How to Rebut an Opposing Argument — Learn Debate');

  return (
    <div className="page-fade" style={{ minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-bg) 100%)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-2xl) 0 var(--space-xl)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-danger-dim)', border: '1px solid rgba(248, 113, 113, 0.2)', marginBottom: 'var(--space-lg)' }}>
            <Target size={13} color="var(--color-danger)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-danger)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Rebuttal Guide</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: 'var(--space-md)' }}>How to Rebut an Opposing Argument</h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>Use the DARE framework to dismantle flawed reasoning and defend your position effectively.</p>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <article style={{ marginBottom: 'var(--space-2xl)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
              Strong debaters don't just state their case — they actively dismantle the opposition.
              A well-delivered rebuttal doesn't just say "I disagree." It identifies exactly what
              is wrong with the opposing argument and why.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              This guide covers the DARE rebuttal framework and five proven rebuttal types.
            </p>
          </article>

          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Target size={22} color="var(--color-danger)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>The DARE Rebuttal Framework</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-lg)' }}>When you hear an argument you need to rebut, apply DARE:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { letter: 'D', word: 'Describe', desc: 'Briefly state the argument you\'re rebutting. "My opponent claims that renewable energy is too expensive to deploy at scale."' },
                { letter: 'A', word: 'Attack', desc: 'Identify the specific flaw — a flawed premise, missing evidence, a logical error, or a misrepresentation. "This relies on 2018 cost figures. Solar and wind costs have dropped 80–90% since then."' },
                { letter: 'R', word: 'Replace', desc: 'Offer the correct picture. "In 2024, renewables are the cheapest form of new electricity generation in most markets, according to the IEA."' },
                { letter: 'E', word: 'Extend', desc: 'Link back to your case. "This actually strengthens our argument: cost is no longer a barrier, which means the only obstacle is political will."' },
              ].map((item) => (
                <div key={item.letter + item.word} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', padding: 'var(--space-lg)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ minWidth: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-danger-dim)', border: `1px solid rgba(248, 113, 113, 0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: 'var(--color-danger)', flexShrink: 0 }}>{item.letter}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>{item.word}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Brain size={22} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Five Types of Rebuttals</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { type: 'Factual rebuttal', icon: <CheckCircle2 size={15} />, color: 'var(--color-success)', desc: 'Directly contradict a claim with more accurate or more recent data. The most straightforward and powerful rebuttal when you have the evidence.' },
                { type: 'Concede and redirect', icon: <ArrowRight size={15} />, color: 'var(--color-primary)', desc: 'Acknowledge the point is valid but show it doesn\'t affect the conclusion, or that it supports your case more than theirs. "Yes, X is true — but that actually proves our point because..."' },
                { type: 'Logical flaw', icon: <Brain size={15} />, color: 'var(--color-accent)', desc: 'Show that the conclusion doesn\'t follow from the premises even if both premises are true. The argument has a structural error, not just a factual one.' },
                { type: 'Turn the argument', icon: <Zap size={15} />, color: 'var(--color-gold)', desc: 'Show that the opponent\'s argument actually supports your position. "Their own evidence proves our point." This is high-risk but devastatingly effective.' },
                { type: 'Minimise the impact', icon: <Shield size={15} />, color: 'var(--color-text-muted)', desc: 'When you can\'t fully refute a point, show it\'s too small, too rare, or too speculative to carry much weight in the overall debate.' },
              ].map((r) => (
                <div key={r.type} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ color: r.color, marginTop: 2 }}>{r.icon}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>{r.type}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div style={{ padding: 'var(--space-xl)', background: 'linear-gradient(135deg, var(--color-danger-dim) 0%, rgba(248, 113, 113, 0.08) 100%)', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>Practice with Debate Coach</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>Each round in Debate Coach ends with the AI delivering a counterargument. Treat every AI response as a live rebuttal challenge:</p>
              <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                <li>Read the AI's response fully before writing your reply.</li>
                <li>Identify the core claim in its argument — don't respond to the edges.</li>
                <li>Choose a rebuttal type deliberately rather than just writing whatever comes to mind.</li>
                <li>After the session, review the coach feedback on your rebuttal score specifically.</li>
              </ul>
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <Link to="/" className="btn btn-primary">Start Practising</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
