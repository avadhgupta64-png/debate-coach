import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function EvidencePage() {
  useDocumentTitle('How to Use Evidence Effectively — Learn Debate');

  return (
    <div className="page-fade" style={{ minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-bg) 100%)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-2xl) 0 var(--space-xl)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-success-dim)', border: '1px solid rgba(52, 211, 153, 0.2)', marginBottom: 'var(--space-lg)' }}>
            <BookOpen size={13} color="var(--color-success)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Evidence Guide</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: 'var(--space-md)' }}>How to Use Evidence Effectively</h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>Choose credible sources and integrate them smoothly into your arguments.</p>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <article style={{ marginBottom: 'var(--space-2xl)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
              Evidence turns opinions into arguments. Without evidence, your claims are just
              assertions. With evidence, they become persuasive positions worth considering.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              But not all evidence is equal. The key is choosing credible sources and
              integrating them naturally — not dumping statistics in a way that feels
              disconnected from your argument.
            </p>
          </article>

          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <CheckCircle2 size={22} color="var(--color-success)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Evaluating Evidence</h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-md)' }}>Ask these questions about any source:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { question: 'Is the source current?', desc: 'Evidence from five years ago may be outdated, especially in fields like technology or medicine. Ask yourself: would the audience expect more recent data?' },
                { question: 'Is the source credible?', desc: 'Who wrote this? Do they have relevant expertise? Is this organization known for balanced reporting, or does it have a clear bias?' },
                { question: 'Does the source directly support the claim?', desc: 'Don\'t stretch evidence to fit your argument. If the evidence only weakly supports your point, you\'re more likely to be challenged successfully.' },
                { question: 'Is the evidence specific or vague?', desc: '"A recent study shows..." is weaker than "A 2024 study of 6,500 participants published in The Lancet found..."' },
              ].map((item, idx) => (
                <div key={idx} style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>{item.question}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <BookOpen size={22} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Integrating Evidence</h2>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-lg)' }}>Simply dropping a statistic rarely persuades anyone. Integrate evidence like this:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { step: 'Introduce the evidence', desc: 'Use context: "According to a 2024 Pew Research study..." or "Research from Stanford shows..."' },
                { step: 'State the finding', desc: 'Present the data clearly: "...62% of adults in the study reported improved critical thinking skills after six months of debate practice."' },
                { step: 'Explain the significance', desc: 'Connect it to your argument: "This matters because improved critical thinking directly supports our claim that debate training delivers transferable cognitive benefits."' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start', padding: 'var(--space-lg)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ minWidth: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--color-success-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', color: 'var(--color-success)', flexShrink: 0 }}>{idx + 1}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>{item.step}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div style={{ padding: 'var(--space-xl)', background: 'linear-gradient(135deg, var(--color-success-dim) 0%, rgba(52, 211, 153, 0.08) 100%)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>Common Evidence Mistakes</h3>
              <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                <li><strong>Unsupported claims:</strong> "Studies show..." without naming the study. Either provide the source or choose a different argument.</li>
                <li><strong>Outdated evidence:</strong> Citing 2018 cost figures for an argument about 2024 policy. Always check recency.</li>
                <li><strong>Irrelevant sources:</strong> A tech CEO's opinion on healthcare reform may not carry weight unless they have relevant expertise.</li>
              </ul>
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
