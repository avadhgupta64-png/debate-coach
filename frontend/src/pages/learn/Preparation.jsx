import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight, Target, Brain } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function PreparationPage() {
  useDocumentTitle('How to Prepare for a Debate — Learn Debate');

  return (
    <div className="page-fade" style={{ minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-bg) 100%)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-2xl) 0 var(--space-xl)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-gold-dim)', border: '1px solid rgba(240, 180, 41, 0.2)', marginBottom: 'var(--space-lg)' }}>
            <Clock size={13} color="var(--color-gold)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Preparation Guide</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: 'var(--space-md)' }}>How to Prepare for a Debate</h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>Create a balanced brief for both sides and anticipate the strongest counterarguments.</p>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <article style={{ marginBottom: 'var(--space-2xl)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
              Preparation separates confident debaters from overwhelmed ones. Even if you have
              no time for extensive research, a focused brief covering both sides of the motion
              gives you a structural advantage.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              This guide walks you through a quick but effective preparation process you can
              use even with limited time.
            </p>
          </article>

          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Clock size={22} color="var(--color-gold)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>The 30-Minute Brief</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-lg)' }}>Even with tight timing, you can build a solid foundation:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { time: '5 minutes', step: 'Identify the motion clearly', desc: 'Write the motion exactly as it\'s worded. Clarify any ambiguous terms. Define key terms in ways that help your case.' },
                { time: '10 minutes', step: 'Build your side\'s case', desc: 'List three to four main arguments using the PEEL structure. For each, note one strong piece of evidence or example.' },
                { time: '10 minutes', step: 'Anticipate opposition', desc: 'Write down the three strongest arguments against your position. For each, sketch a quick rebuttal.' },
                { time: '5 minutes', step: 'Summarize key points', desc: 'Write one- or two-sentence summaries of your strongest argument and your best rebuttal. These become your opening and closing anchors.' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', padding: 'var(--space-lg)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ minWidth: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--color-gold-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', color: 'var(--color-gold)', flexShrink: 0 }}>{item.time}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>{item.step}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Target size={22} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Anticipating Counterarguments</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-lg)' }}>The best way to handle surprise objections is to expect them. For each of your arguments, ask:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { question: 'What\'s the strongest objection?', desc: 'Not the weakest — the one that would actually convince a judge if unaddressed.' },
                { question: 'Does this objection attack a premise, evidence, or conclusion?', desc: 'Identifying the type of objection helps you craft the right kind of rebuttal.' },
                { question: 'Do I have a response ready?', desc: 'If not, can I build one quickly? If you can\'t, either adjust your argument or be prepared to concede and redirect.' },
              ].map((item, idx) => (
                <div key={idx} style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>{item.question}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div style={{ padding: 'var(--space-xl)', background: 'linear-gradient(135deg, var(--color-gold-dim) 0%, rgba(240, 180, 41, 0.08) 100%)', border: '1px solid rgba(240, 180, 41, 0.2)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>When You Have Limited Time</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-lg)' }}>Prioritize depth over breadth:</p>
              <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                <li>Focus on one strong argument rather than three weak ones.</li>
                <li>Prepare a clear rebuttal for the most likely objection.</li>
                <li>Know your opening and closing sentences cold — these anchor your performance.</li>
                <li>Don\'t try to cover every angle. Do one thing well, and you\'ll be stronger than most opponents.</li>
              </ul>
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <Link to="/learn/techniques" className="btn btn-secondary">
                  Learn Quick Techniques <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
