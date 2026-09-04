import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function FallaciesPage() {
  useDocumentTitle('Logical Fallacies in Debate — Learn Debate');

  return (
    <div className="page-fade" style={{ minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-bg) 100%)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-2xl) 0 var(--space-xl)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-warning-dim)', border: '1px solid rgba(251, 191, 36, 0.2)', marginBottom: 'var(--space-lg)' }}>
            <AlertTriangle size={13} color="var(--color-warning)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-warning)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Fallacies Guide</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: 'var(--space-md)' }}>Logical Fallacies in Debate</h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>Spot and avoid common reasoning errors that undermine credibility.</p>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <article style={{ marginBottom: 'var(--space-2xl)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
              Logical fallacies are errors in reasoning that undermine the logical validity of
              your arguments. They hurt your credibility and give opponents easy targets.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              The best debaters avoid fallacies in their own arguments and spot them in their
              opponent's reasoning. This guide covers the most common fallacies and how to use
              them to your advantage.
            </p>
          </article>

          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <AlertTriangle size={22} color="var(--color-warning)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>Common Fallacies</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {[
                { name: 'Straw Man', example: '"My opponent wants to ban all cars, which would destroy the economy."', why: 'Misrepresenting the opposing argument as more extreme than it is. Attack the actual claim, not the exaggerated version.' },
                { name: 'Ad Hominem', example: '"We can\'t trust their economic data — their party has always been anti-business."', why: 'Attacking the speaker\'s character instead of the argument itself. A flawed source can still make a valid argument.' },
                { name: 'False Dichotomy', example: '"Either we implement this policy now, or our children will inherit a ruined planet."', why: 'Presenting only two options when more exist. Real policy questions almost always have a spectrum of positions.' },
                { name: 'Appeal to Authority', example: '"Professor Smith supports this view, therefore it must be correct."', why: 'Expert opinion is evidence, not proof. Authorities can be wrong or outside their expertise.' },
                { name: 'Slippery Slope', example: '"If we allow this, next they\'ll be banning everything we enjoy."', why: 'Claiming one step inevitably leads to extreme consequences without demonstrating each causal step.' },
                { name: 'Circular Reasoning', example: '"This law is unjust because it\'s unfair to the people it targets."', why: 'The conclusion is used as a premise. \'Unjust\' and \'unfair\' are the same claim restated.' },
                { name: 'Hasty Generalization', example: '"I met one rude person from that city, so everyone there must be rude."', why: 'Drawing a broad conclusion from insufficient evidence. One example doesn\'t represent a group.' },
              ].map((fallacy, idx) => (
                <div key={idx} style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)' }}>{fallacy.name}</p>
                  <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)', fontStyle: 'italic' }}>Example: "{fallacy.example}"</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>{fallacy.why}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div style={{ padding: 'var(--space-xl)', background: 'linear-gradient(135deg, var(--color-warning-dim) 0%, rgba(251, 191, 36, 0.08) 100%)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>How to Avoid Fallacies</h3>
              <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                <li>Ask yourself: "Does my conclusion follow from my premises, or am I assuming what I'm trying to prove?"</li>
                <li>Address the actual argument made, not a distorted version of it.</li>
                <li>Separate attacking the person from attacking their argument.</li>
                <li>When citing authority, explain why their expertise is relevant to the topic.</li>
                <li>Base generalizations on representative samples, not single examples.</li>
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
