import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Swords,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Target,
  Shield,
  Zap,
  Brain,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

// ─── Reusable components ──────────────────────────────────────────────────────

function SectionHeader({ icon, color, id, title, subtitle }) {
  return (
    <div id={id} style={{ marginBottom: 'var(--space-xl)', scrollMarginTop: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ color }}>{icon}</span>
        <h2 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 680, margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function TipCard({ number, title, children }) {
  return (
    <div
      className="card"
      style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}
    >
      <div
        style={{
          minWidth: 36,
          height: 36,
          borderRadius: 'var(--radius-full)',
          background: 'var(--color-primary-dim)',
          border: '1px solid rgba(79,142,247,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.85rem',
          color: 'var(--color-primary)',
        }}
      >
        {number}
      </div>
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          {title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
          {children}
        </p>
      </div>
    </div>
  );
}

function ConceptCard({ icon, color, title, children }) {
  return (
    <div className="card" style={{ borderTop: `3px solid ${color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ color }}>{icon}</span>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          {title}
        </h3>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.75, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}

function FallacyRow({ name, example, why }) {
  return (
    <div
      style={{
        padding: 'var(--space-md)',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-sm)',
      }}
    >
      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>
        {name}
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 4, fontStyle: 'italic' }}>
        Example: "{example}"
      </p>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0 }}>
        {why}
      </p>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        marginBottom: 'var(--space-sm)',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
          padding: 'var(--space-md) var(--space-lg)',
          background: open ? 'var(--color-surface-2)' : 'var(--color-surface)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background var(--transition-fast)',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--color-text-primary)' }}>
          {question}
        </span>
        {open
          ? <ChevronUp size={16} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
          : <ChevronDown size={16} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />}
      </button>
      {open && (
        <div
          style={{
            padding: 'var(--space-md) var(--space-lg) var(--space-lg)',
            background: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.8,
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
}

// ─── Nav anchors ──────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: 'training', label: 'Training Guide', icon: <BookOpen size={14} /> },
  { id: 'tips', label: 'Debate Tips', icon: <Lightbulb size={14} /> },
  { id: 'argumentation', label: 'Argumentation', icon: <Brain size={14} /> },
  { id: 'rebuttals', label: 'Rebuttals', icon: <Swords size={14} /> },
  { id: 'faq', label: 'FAQ', icon: <HelpCircle size={14} /> },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Resources() {
  useDocumentTitle('Debate Resources — Debate Coach');

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-fade">

      {/* Page header */}
      <section
        style={{
          background: 'linear-gradient(160deg, var(--color-surface) 0%, var(--color-bg) 100%)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-2xl) 0 var(--space-xl)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-dim)',
              border: '1px solid rgba(79,142,247,0.2)',
              marginBottom: 'var(--space-md)',
            }}
          >
            <BookOpen size={13} color="var(--color-primary)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Free Resources
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              marginBottom: 'var(--space-md)',
            }}
          >
            Debate Training Resources
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              maxWidth: 580,
              marginBottom: 'var(--space-xl)',
            }}
          >
            Practical guides on how to debate, build arguments, deliver effective rebuttals,
            and get the most from AI-powered practice. No fluff — just the techniques that
            actually improve your debating.
          </p>

          {/* Anchor nav */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }}
              >
                {l.icon} {l.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────────── */}
      <div className="container" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>

          {/* ── 1. TRAINING GUIDE ─────────────────────────────────────────── */}
          <section>
            <SectionHeader
              id="training"
              icon={<BookOpen size={22} />}
              color="var(--color-primary)"
              title="Debate Training Guide"
              subtitle="Whether you're preparing for competitive debate, a class presentation, or just want to argue more clearly, this guide covers the fundamentals of structured practice."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

              <div className="card" style={{ borderLeft: '3px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 10 }}>
                  The Three-Stage Practice Loop
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-md)' }}>
                  Effective debate training follows a consistent loop: <strong style={{ color: 'var(--color-text-primary)' }}>prepare</strong>, <strong style={{ color: 'var(--color-text-primary)' }}>spar</strong>, and <strong style={{ color: 'var(--color-text-primary)' }}>review</strong>. Skipping the review stage is the single most common reason debaters plateau.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                  {[
                    { step: '1. Prepare', desc: 'Research both sides of the motion. Strong debaters know the opposing case as well as their own — sometimes better.' },
                    { step: '2. Spar', desc: 'Deliver your arguments under pressure. With Debate Coach, the AI opponent adapts to your responses so you face genuinely challenging counterarguments.' },
                    { step: '3. Review', desc: 'Analyse your scores, read the coach feedback, and identify one or two specific things to improve before your next session.' },
                  ].map((s) => (
                    <div key={s.step} style={{ padding: 'var(--space-md)', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-primary)', marginBottom: 6 }}>{s.step}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ borderLeft: '3px solid var(--color-success)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 10 }}>
                  Choosing Your Practice Topics
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
                  Beginners should start with topics they know well, then progressively tackle unfamiliar subjects. Here is a progression that builds real skill:
                </p>
                <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
                  <li><strong style={{ color: 'var(--color-text-primary)' }}>Weeks 1–2:</strong> Topics from your own life and experience (school policies, local issues, technology habits).</li>
                  <li><strong style={{ color: 'var(--color-text-primary)' }}>Weeks 3–4:</strong> Social and ethical topics (social media regulation, universal basic income, mandatory voting).</li>
                  <li><strong style={{ color: 'var(--color-text-primary)' }}>Month 2+:</strong> Complex policy and science topics (climate policy, AI regulation, healthcare reform) — research required.</li>
                </ul>
              </div>

              <div className="card" style={{ borderLeft: '3px solid var(--color-gold)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 10 }}>
                  How to Use Debate Coach Effectively
                </h3>
                <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
                  <li>Complete the full preparation phase before each session — don't skip it. The AI-generated briefs show you arguments from both sides.</li>
                  <li>Write your responses as if speaking aloud: full sentences, not bullet points. This builds the habit of articulating complete thoughts.</li>
                  <li>After each round, read the AI's response before writing your next one. Treat it like a real opponent.</li>
                  <li>Use the Results page to track your scores by skill (clarity, evidence, logic, rebuttals) across sessions. Focus improvement on your lowest-scoring area.</li>
                  <li>Try the same topic twice — once for each side. This forces you to engage with arguments you personally disagree with, which is the fastest way to improve.</li>
                </ul>
              </div>

            </div>
          </section>

          {/* ── 2. DEBATE TIPS ────────────────────────────────────────────── */}
          <section>
            <SectionHeader
              id="tips"
              icon={<Lightbulb size={22} />}
              color="var(--color-gold)"
              title="10 Debate Tips That Actually Work"
              subtitle="These are the habits that separate good debaters from great ones. Each one is actionable from your next session."
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
              <TipCard number="1" title="Lead with your strongest point">
                Judges and audiences form first impressions quickly. Open with your most compelling argument, not your weakest. The instinct to "build up to the big point" usually works against you.
              </TipCard>
              <TipCard number="2" title="Define key terms early">
                Vague terms let opponents reframe the debate on their own terms. If the motion says "significant harm", define what "significant" means for your case at the start. Whoever controls the definitions often controls the debate.
              </TipCard>
              <TipCard number="3" title="Anticipate the three strongest counterarguments">
                Before any debate, write out the three best arguments against your position and prepare a response to each. Nothing looks worse than being visibly surprised by a predictable objection.
              </TipCard>
              <TipCard number="4" title="Use concrete examples, not abstract claims">
                "Social media harms mental health" is forgettable. "A 2023 study of 6,500 teenagers found a 37% increase in anxiety scores among daily TikTok users" is not. Specific examples stick.
              </TipCard>
              <TipCard number="5" title="Pause and breathe before responding">
                Silence feels longer to you than to your audience. A two-second pause to think produces a sharper response than a panicked immediate reply. Elite debaters use silence deliberately.
              </TipCard>
              <TipCard number="6" title="Acknowledge what's true in the opposing argument">
                "I agree that X is a real concern — here's why it doesn't change the conclusion" is far more persuasive than flat denial. It shows intellectual honesty and makes audiences trust your other points.
              </TipCard>
              <TipCard number="7" title="Signpost your structure">
                Tell your audience what you're about to argue, then argue it. "I'll make three points. First..." is not unsophisticated — it's respectful of your audience's attention and makes your case easier to follow.
              </TipCard>
              <TipCard number="8" title="Attack the argument, not the person">
                Ad hominem attacks (criticising the speaker rather than their argument) make you look weak, not strong. If the argument is flawed, demonstrating the flaw is always more effective than dismissing its source.
              </TipCard>
              <TipCard number="9" title="Vary your pace and emphasis">
                Monotone delivery puts arguments to sleep no matter how good they are. Slow down on your key point, speed up on context, and pause after a punchline. Rhythm signals confidence.
              </TipCard>
              <TipCard number="10" title="End with a clear summary, not new points">
                Your closing is the last thing people hear. Summarise the two or three things you proved, not three new things you wish you'd said earlier. Closing with new arguments reads as disorganised.
              </TipCard>
            </div>
          </section>

          {/* ── 3. ARGUMENTATION ──────────────────────────────────────────── */}
          <section>
            <SectionHeader
              id="argumentation"
              icon={<Brain size={22} />}
              color="var(--color-accent)"
              title="How to Build Strong Arguments"
              subtitle="A strong argument is not just an opinion stated loudly. It has a clear structure, honest evidence, and a logical link between premise and conclusion."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

              {/* PEEL */}
              <div className="card" style={{ borderLeft: '3px solid var(--color-accent)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 10 }}>
                  The PEEL Structure
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-md)' }}>
                  PEEL is the most reliable single-argument structure for debate. Each argument you make should follow this pattern:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {[
                    { letter: 'P', word: 'Point', color: 'var(--color-primary)', desc: 'State your claim clearly in one sentence. "Banning single-use plastics would significantly reduce ocean pollution."' },
                    { letter: 'E', word: 'Evidence', color: 'var(--color-success)', desc: 'Support the claim with a specific fact, statistic, study, or example. "The UN Environment Programme estimates 8 million tonnes of plastic enter the ocean annually, 40% of which is single-use."' },
                    { letter: 'E', word: 'Explanation', color: 'var(--color-gold)', desc: 'Explain the logical link between your evidence and your point. "Since the majority of ocean plastic originates as single-use items, restricting them at source would reduce ocean influx at scale."' },
                    { letter: 'L', word: 'Link', color: 'var(--color-accent)', desc: 'Connect back to the motion or your overall case. "This directly supports our position that legislative action is the most effective lever for protecting marine ecosystems."' },
                  ].map((item) => (
                    <div key={item.letter + item.word} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 32, height: 32, borderRadius: 'var(--radius-md)', background: item.color + '22', border: `1px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: item.color }}>
                        {item.letter}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-primary)', marginBottom: 3 }}>{item.word}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core argument types */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                  Four Types of Arguments and When to Use Them
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)' }}>
                  <ConceptCard icon={<Target size={16} />} color="var(--color-primary)" title="Empirical Arguments">
                    Based on evidence, data, or observed facts. Most persuasive when the data is recent, from a credible source, and directly relevant to the motion. Best for policy and science debates.
                  </ConceptCard>
                  <ConceptCard icon={<Shield size={16} />} color="var(--color-success)" title="Principled Arguments">
                    Based on values, rights, or moral principles. Effective when the empirical evidence is contested or when you want to establish a framework the audience already accepts (e.g., freedom, fairness).
                  </ConceptCard>
                  <ConceptCard icon={<Zap size={16} />} color="var(--color-gold)" title="Comparative Arguments">
                    Show that your solution is better than the alternative, not just that it has some merit. "Policy A is better than Policy B because..." This wins debates where both sides have valid points.
                  </ConceptCard>
                  <ConceptCard icon={<AlertTriangle size={16} />} color="var(--color-danger)" title="Consequentialist Arguments">
                    Focus on outcomes: what happens if this policy passes or fails? Projecting forward consequences is compelling, but needs to be grounded in evidence to avoid sounding speculative.
                  </ConceptCard>
                </div>
              </div>

              {/* Common fallacies */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 6 }}>
                  Common Logical Fallacies to Avoid
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-md)' }}>
                  Debate Coach's AI automatically flags these in your responses. Understanding them helps you avoid them — and catch them in your opponent's arguments.
                </p>
                <FallacyRow
                  name="Straw Man"
                  example="My opponent wants to ban all cars, which would destroy the economy."
                  why="Misrepresenting the opposing argument as more extreme than it is, then attacking the exaggerated version. Attack the actual claim your opponent made."
                />
                <FallacyRow
                  name="Ad Hominem"
                  example="We can't trust their economic data — their party has always been anti-business."
                  why="Attacking the speaker's character or motives instead of the argument itself. Even a flawed source can make a valid argument."
                />
                <FallacyRow
                  name="False Dichotomy"
                  example="Either we implement this policy now, or our children will inherit a ruined planet."
                  why="Presenting only two options when more exist. Real policy questions almost always have a spectrum of possible positions."
                />
                <FallacyRow
                  name="Appeal to Authority"
                  example="Professor Smith supports this view, therefore it must be correct."
                  why="Expert opinion is evidence, not proof. Authorities can be wrong, biased, or outside their expertise. Use it alongside, not instead of, reasoning."
                />
                <FallacyRow
                  name="Slippery Slope"
                  example="If we allow this, next they'll be banning everything we enjoy."
                  why="Claiming that one step inevitably leads to extreme consequences without demonstrating each step of the causal chain."
                />
                <FallacyRow
                  name="Circular Reasoning"
                  example="This law is unjust because it's unfair to the people it targets."
                  why="The conclusion is used as a premise. 'Unjust' and 'unfair' are the same claim restated, not a reason."
                />
              </div>

            </div>
          </section>

          {/* ── 4. REBUTTALS ──────────────────────────────────────────────── */}
          <section>
            <SectionHeader
              id="rebuttals"
              icon={<Swords size={22} />}
              color="var(--color-danger)"
              title="How to Deliver Effective Rebuttals"
              subtitle="Rebuttals are where debates are won or lost. A strong rebuttal doesn't just say 'I disagree' — it identifies exactly what is wrong with the opposing argument and why."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>

              <div className="card" style={{ borderLeft: '3px solid var(--color-danger)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 10 }}>
                  The DARE Rebuttal Framework
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-md)' }}>
                  When you hear an argument you need to rebut, apply DARE:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {[
                    { letter: 'D', word: 'Describe', color: 'var(--color-primary)', desc: 'Briefly state the argument you\'re rebutting. "My opponent claims that renewable energy is too expensive to deploy at scale."' },
                    { letter: 'A', word: 'Attack', color: 'var(--color-danger)', desc: 'Identify the specific flaw — a flawed premise, missing evidence, a logical error, or a misrepresentation. "This relies on 2018 cost figures. Solar and wind costs have dropped 80–90% since then."' },
                    { letter: 'R', word: 'Replace', color: 'var(--color-gold)', desc: 'Offer the correct picture. "In 2024, renewables are the cheapest form of new electricity generation in most markets, according to the IEA."' },
                    { letter: 'E', word: 'Extend', color: 'var(--color-success)', desc: 'Link back to your case. "This actually strengthens our argument: cost is no longer a barrier, which means the only obstacle is political will."' },
                  ].map((item) => (
                    <div key={item.letter + item.word} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 32, height: 32, borderRadius: 'var(--radius-md)', background: item.color + '22', border: `1px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: item.color }}>
                        {item.letter}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-primary)', marginBottom: 3 }}>{item.word}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rebuttal types */}
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-md)' }}>
                  Five Types of Rebuttals
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {[
                    { type: 'Factual rebuttal', icon: <CheckCircle size={15} />, color: 'var(--color-success)', desc: 'Directly contradict a claim with more accurate or more recent data. The most straightforward and powerful rebuttal when you have the evidence.' },
                    { type: 'Concede and redirect', icon: <ArrowRight size={15} />, color: 'var(--color-primary)', desc: 'Acknowledge the point is valid but show it doesn\'t affect the conclusion, or that it supports your case more than theirs. "Yes, X is true — but that actually proves our point because..."' },
                    { type: 'Logical flaw', icon: <Brain size={15} />, color: 'var(--color-accent)', desc: 'Show that the conclusion doesn\'t follow from the premises even if both premises are true. The argument has a structural error, not just a factual one.' },
                    { type: 'Turn the argument', icon: <Zap size={15} />, color: 'var(--color-gold)', desc: 'Show that the opponent\'s argument actually supports your position. "Their own evidence proves our point." This is high-risk but devastatingly effective.' },
                    { type: 'Minimise the impact', icon: <Shield size={15} />, color: 'var(--color-text-muted)', desc: 'When you can\'t fully refute a point, show it\'s too small, too rare, or too speculative to carry much weight in the overall debate.' },
                  ].map((r) => (
                    <div key={r.type} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', padding: 'var(--space-md)' }}>
                      <span style={{ color: r.color, marginTop: 2 }}>{r.icon}</span>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-primary)', marginBottom: 4 }}>{r.type}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ borderLeft: '3px solid var(--color-gold)', padding: 'var(--space-lg)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 10 }}>
                  Practising Rebuttals with Debate Coach
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 8 }}>
                  Each round in Debate Coach ends with the AI delivering a counterargument to your position. Treat every AI response as a live rebuttal challenge:
                </p>
                <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>
                  <li>Read the AI's response fully before writing your reply.</li>
                  <li>Identify the core claim in its argument — don't respond to the edges.</li>
                  <li>Choose a rebuttal type deliberately (from the five above) rather than just writing whatever comes to mind.</li>
                  <li>After the session, review the coach feedback on your rebuttal score specifically.</li>
                </ul>
              </div>

            </div>
          </section>

          {/* ── 5. FAQ ────────────────────────────────────────────────────── */}
          <section>
            <SectionHeader
              id="faq"
              icon={<HelpCircle size={22} />}
              color="var(--color-success)"
              title="Frequently Asked Questions"
              subtitle="Common questions about using Debate Coach and about debate practice in general."
            />

            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-md)' }}>
                About Debate Coach
              </p>
              <FAQItem
                question="Do I need to create an account to use Debate Coach?"
                answer="No — you can explore the interface and browse all public content as a guest. To start a full AI debate session, save your history, and track progress over time, you'll need to sign in with a Google account. Sign-in is free."
              />
              <FAQItem
                question="How does the AI scoring work?"
                answer="After each debate session, the AI evaluates your performance across four core skills: clarity of argument, use of evidence, logical reasoning, and quality of rebuttals. Each skill is scored out of 10. The AI also checks for logical fallacies and provides specific coaching notes on what to improve. Scores are meant to guide practice, not to be taken as absolute judgements."
              />
              <FAQItem
                question="Can I practise debate topics I choose myself?"
                answer="Yes. When starting a new debate, you can enter any topic you want — there's no list to choose from. You can also set your position (for or against), difficulty level, and debate format. The AI adapts to whatever you give it."
              />
              <FAQItem
                question="How many rounds does a debate session have?"
                answer="A standard Debate Coach session runs five rounds. Each round consists of you delivering your argument and the AI opponent responding. After all five rounds, you receive a detailed results breakdown. Drafts are saved automatically, so you can resume an unfinished session."
              />
              <FAQItem
                question="Is Debate Coach free?"
                answer="Yes, Debate Coach is free to use. The service is supported by Google AdSense advertising. There are no paid tiers or hidden costs."
              />
              <FAQItem
                question="What debate formats does Debate Coach support?"
                answer="Debate Coach supports British Parliamentary, Oxford-style, Lincoln-Douglas, and open/freestyle formats. The format affects how the AI structures its arguments and evaluates yours. Choose the format that matches your competition or class environment."
              />

              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 'var(--space-xl) 0 var(--space-md)' }}>
                About Debating
              </p>
              <FAQItem
                question="How long does it take to become a good debater?"
                answer="Most people see a noticeable improvement in argument structure and confidence within 4–6 weeks of regular practice (3–4 sessions per week). Reaching a competitive level takes months of deliberate practice, but the fundamentals — clear structure, specific evidence, direct rebuttals — can be learned and applied quickly."
              />
              <FAQItem
                question="Is it okay to argue for a position I personally disagree with?"
                answer="Not only is it okay — it's one of the most valuable exercises in debate training. Arguing the 'wrong side' forces you to engage seriously with the strongest version of an opposing argument. It builds intellectual flexibility and helps you anticipate objections to your real positions. Debate Coach lets you choose or be assigned either side of any topic."
              />
              <FAQItem
                question="What's the difference between a debate and an argument?"
                answer="In common usage they overlap, but structured debate follows explicit rules: each speaker has a defined role, evidence standards are expected, and the goal is to persuade a third party (judge or audience), not necessarily the opponent. A productive argument seeks to find the truth; a debate also considers how to present that truth effectively."
              />
              <FAQItem
                question="How do I handle a topic I know nothing about?"
                answer="Use Debate Coach's preparation phase — the AI generates a brief covering the key arguments on both sides before you begin. Read both sides carefully. In a real debate with no prep time, use structural arguments (what kind of world do we want? what principles are at stake?) rather than data-heavy empirical claims you can't back up."
              />
              <FAQItem
                question="Does practising online debate help with in-person debates?"
                answer="Yes, directly. The core skills — structuring an argument, anticipating counterpoints, choosing strong evidence, delivering clear rebuttals — transfer directly from text practice to live speech. Many competitive debaters use written practice to rehearse argument structure before focusing on delivery. Debate Coach builds the argument-building foundation."
              />
            </div>
          </section>

          {/* CTA */}
          <section
            style={{
              padding: 'var(--space-2xl)',
              background: 'linear-gradient(135deg, var(--color-primary-dim) 0%, rgba(124,106,245,0.08) 100%)',
              border: '1px solid rgba(79,142,247,0.2)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-sm)' }}>
              Ready to put this into practice?
            </h2>
            <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', maxWidth: 480, margin: '0 auto var(--space-lg)' }}>
              Reading about debate technique is useful. Practising it against a live AI opponent is how you actually improve.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/" className="btn btn-primary">
                <Swords size={16} />
                Start Practising
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn About Debate Coach
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
