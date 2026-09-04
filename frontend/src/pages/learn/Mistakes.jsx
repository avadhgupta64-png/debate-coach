import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function MistakesPage() {
  useDocumentTitle('Common Debate Mistakes — Learn Debate');

  return (
    <div className="page-fade" style={{ minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-bg) 100%)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-2xl) 0 var(--space-xl)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-text-muted-dim)', border: '1px solid rgba(139, 147, 167, 0.2)', marginBottom: 'var(--space-lg)' }}>
            <Shield size={13} color="var(--color-text-muted)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Mistakes Guide</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: 'var(--space-md)' }}>Common Debate Mistakes</h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>Avoid the errors that hold even smart debaters back.</p>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <article style={{ marginBottom: 'var(--space-2xl)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
              The best debaters win by avoiding mistakes as much as by doing things right.
              Many competent debaters lose not because they lack skill, but because they make
              predictable errors that weaken their position.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              This guide covers the most common mistakes and how to fix them before they hurt
              your performance.
            </p>
          </article>

          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <AlertTriangle size={22} color="var(--color-warning)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>The Big Five Mistakes</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { title: 'Skipping preparation', desc: 'Even a 10-minute brief covering both sides gives you a structural edge. Without preparation, you\'re reactive, not proactive. Fix: Build a quick three-point case for your side and sketch rebuttals to the three strongest opposition arguments.' },
                { title: 'Addressing every point', desc: 'Trying to respond to everything leaves you shallow. Pick your battles: focus on the three most important objections, not the seven easiest to find. Fix: Rank opposition arguments by impact. Defeat the strongest ones well; concede or minimally address the weaker ones.' },
                { title: 'Focusing on delivery over substance', desc: 'Fluent delivery with empty arguments impresses no one. The best speakers combine clear language with substance. Fix: Practice outlining your key arguments first, then add delivery polish. A simple, clear argument delivered well beats a complex one mumbled poorly.' },
                { title: 'Defending a position you don\'t understand', desc: 'Saying "I don\'t agree with this, but for the sake of debate..." weakens your performance. You\'ll be defensive, not persuasive. Fix: Practice arguing both sides. Even if you\'re assigned the "wrong" side, understanding the strongest version of that position makes you stronger overall.' },
                { title: 'Not reviewing your performance', desc: 'One debate without reflection is like running without checking your form. You\'ll repeat the same mistakes. Fix: After every session, ask: "What went well?" "What would I do differently?" "What one thing should I improve next time?"' },
              ].map((item, idx) => (
                <div key={idx} style={{ padding: 'var(--space-lg)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)' }}>
                    <AlertTriangle size={18} color="var(--color-warning)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>{item.title}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-sm)' }}>{item.desc}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 600, marginBottom: 0 }}>Fix: {item.fix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <CheckCircle2 size={22} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Less Obvious Mistakes</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { title: 'Quoting without context', desc: 'A soundbite out of context is misleading. The audience doesn\'t know the full situation. Fix: Always provide enough background for your quote to make sense. "X said Y, which in context means Z..."' },
                { title: 'Overusing rhetorical questions', desc: 'Rhetorical questions can engage, but too many make you sound evasive. If you ask a question, answer it. Fix: Limit rhetorical questions to one or two per speech, and always follow them with your answer.' },
                { title: 'Repeating the same point', desc: 'You think you need to repeat to make your point stick. The audience hears redundancy. Fix: State your point once, clearly. Support it with evidence. Move on.' },
                { title: 'Failing to adapt to the format', desc: 'British Parliamentary debates have different rules than Lincoln-Douglas. Using the wrong structure hurts your performance. Fix: Before any debate, clarify the format and time limits. Practice with those constraints.' },
              ].map((item, idx) => (
                <div key={idx} style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>{item.title}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div style={{ padding: 'var(--space-xl)', background: 'linear-gradient(135deg, var(--color-text-muted-dim) 0%, rgba(139, 147, 167, 0.08) 100%)', border: '1px solid rgba(139, 147, 167, 0.2)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>Turn Mistakes into Improvement</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-lg)' }}>After each debate, spend two minutes identifying:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                {[
                  { label: 'One mistake you made', placeholder: 'e.g., I didn\'t define key terms early' },
                  { label: 'One thing you did well', placeholder: 'e.g., My opening statement was clear' },
                  { label: 'One thing to fix next time', placeholder: 'e.g., I\'ll write a one-sentence definition before my first argument' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)', flexShrink: 0, minWidth: 110 }}>{item.label}:</span>
                    <div style={{ flex: 1 }}>
                      <input type="text" placeholder={item.placeholder} readOnly style={{ width: '100%', padding: '8px 12px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <Link to="/learn/arguments" className="btn btn-secondary">
                  Learn Argument Structure <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
