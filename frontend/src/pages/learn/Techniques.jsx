import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

export default function TechniquesPage() {
  useDocumentTitle('Debate Techniques for Beginners — Learn Debate');

  return (
    <div className="page-fade" style={{ minHeight: '100vh' }}>
      <section style={{ background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-bg) 100%)', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-2xl) 0 var(--space-xl)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-accent-dim)', border: '1px solid rgba(124, 106, 245, 0.2)', marginBottom: 'var(--space-lg)' }}>
            <Zap size={13} color="var(--color-accent)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Beginner Techniques</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: 'var(--space-md)' }}>Debate Techniques for Beginners</h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>Essential habits that improve faster than raw talent.</p>
        </div>
      </section>

      <div className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <article style={{ marginBottom: 'var(--space-2xl)' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-xl)' }}>
              You don't need years of experience to debate well. Many successful debaters began
              with no formal training at all. The difference? They learned and applied a few
              high-leverage techniques from day one.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              This guide covers ten techniques that deliver measurable improvement quickly.
              Master these, and you\'ll outperform many debaters with more experience.
            </p>
          </article>

          <section style={{ marginBottom: 'var(--space-2xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
              <Zap size={22} color="var(--color-accent)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>10 Techniques That Work</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              {[
                { number: '1', title: 'Lead with your strongest point', desc: 'Judges and audiences form first impressions quickly. Open with your most compelling argument, not your weakest. The instinct to "build up to the big point" usually works against you.' },
                { number: '2', title: 'Define key terms early', desc: 'Vague terms let opponents reframe the debate on their own terms. If the motion says "significant harm", define what "significant" means for your case at the start. Whoever controls the definitions often controls the debate.' },
                { number: '3', title: 'Anticipate the three strongest counterarguments', desc: 'Before any debate, write out the three best arguments against your position and prepare a response to each. Nothing looks worse than being visibly surprised by a predictable objection.' },
                { number: '4', title: 'Use concrete examples, not abstract claims', desc: '"Social media harms mental health" is forgettable. "A 2023 study of 6,500 teenagers found a 37% increase in anxiety scores among daily TikTok users" is not. Specific examples stick.' },
                { number: '5', title: 'Pause and breathe before responding', desc: 'Silence feels longer to you than to your audience. A two-second pause to think produces a sharper response than a panicked immediate reply. Elite debaters use silence deliberately.' },
                { number: '6', title: 'Acknowledge what\'s true in the opposing argument', desc: '"I agree that X is a real concern — here\'s why it doesn\'t change the conclusion" is far more persuasive than flat denial. It shows intellectual honesty and builds trust.' },
                { number: '7', title: 'Signpost your structure', desc: 'Tell your audience what you\'re about to argue, then argue it. "I\'ll make three points. First..." is not unsophisticated — it\'s respectful of your audience\'s attention and makes your case easier to follow.' },
                { number: '8', title: 'Attack the argument, not the person', desc: 'Ad hominem attacks make you look weak, not strong. If the argument is flawed, demonstrating the flaw is always more effective than dismissing its source.' },
                { number: '9', title: 'Vary your pace and emphasis', desc: 'Monotone delivery puts arguments to sleep no matter how good they are. Slow down on your key point, speed up on context, and pause after a punchline. Rhythm signals confidence.' },
                { number: '10', title: 'End with a clear summary, not new points', desc: 'Your closing is the last thing people hear. Summarise the two or three things you proved, not three new things you wish you\'d said earlier. Closing with new arguments reads as disorganised.' },
              ].map((item) => (
                <div key={item.number} style={{ padding: 'var(--space-lg)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 'var(--space-lg)', left: 'var(--space-lg)', width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--color-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', color: 'var(--color-accent)', flexShrink: 0 }}>{item.number}</div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-xs)', paddingLeft: '44px' }}>{item.title}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0, paddingLeft: '44px' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div style={{ padding: 'var(--space-xl)', background: 'linear-gradient(135deg, var(--color-accent-dim) 0%, rgba(124, 106, 245, 0.08) 100%)', border: '1px solid rgba(124, 106, 245, 0.2)', borderRadius: 'var(--radius-lg)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>How to Practice These Techniques</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 'var(--space-lg)' }}>Don't try to master all ten at once. Pick one per debate session:</p>
              <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                <li><strong>Week 1:</strong> Focus on leading with your strongest point and defining key terms early.</li>
                <li><strong>Week 2:</strong> Anticipate counterarguments and use concrete examples.</li>
                <li><strong>Week 3:</strong> Pause before responding and acknowledge what's true in the opposition's case.</li>
                <li><strong>Week 4:</strong> Signpost your structure and attack the argument, not the person.</li>
                <li><strong>Week 5+:</strong> Combine techniques — vary your pace and always end with a summary.</li>
              </ul>
              <div style={{ marginTop: 'var(--space-lg)' }}>
                <Link to="/learn/preparation" className="btn btn-secondary">
                  Learn Preparation <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
