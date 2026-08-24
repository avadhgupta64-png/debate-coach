import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 'var(--space-2xl)' }}>
      <h2
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-md)',
          paddingBottom: 'var(--space-sm)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {title}
      </h2>
      <div
        style={{
          color: 'var(--color-text-secondary)',
          fontSize: '0.925rem',
          lineHeight: 1.8,
        }}
      >
        {children}
      </div>
    </section>
  );
}

export default function Terms() {
  useDocumentTitle('Terms of Service — Debate Coach');

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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-2xl)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={24} color="var(--color-primary)" />
            </div>
            <div>
              <h1
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  marginBottom: 4,
                }}
              >
                Terms of Service
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Last updated: August 2026
              </p>
            </div>
          </div>

          <Section title="Acceptance of Terms">
            <p>
              By accessing or using Debate Coach ("the Service"), you agree to be bound by these
              Terms of Service. If you do not agree, please do not use the Service. Debate Coach is
              operated by Avadh Gupta ("we", "us", or "our").
            </p>
          </Section>

          <Section title="Description of the Service">
            <p>
              Debate Coach is an AI-powered debate training platform that allows users to practise
              debate skills, generate arguments and counterarguments, receive AI coaching feedback,
              and track their progress over time. The Service is provided for educational and
              personal development purposes.
            </p>
          </Section>

          <Section title="Eligibility">
            <p>
              You must be at least 13 years old to use Debate Coach. By using the Service, you
              represent and warrant that you meet this age requirement. If you are under 18, you
              should have parental or guardian consent.
            </p>
          </Section>

          <Section title="Your Account">
            <p>
              When you create an account by signing in with Google, you are responsible for
              maintaining the security of your account. You agree not to share your account
              credentials. You are responsible for all activity that occurs under your account.
            </p>
            <p style={{ marginTop: 'var(--space-md)' }}>
              We reserve the right to suspend or terminate accounts that violate these Terms or that
              are used in a way that harms other users or the Service.
            </p>
          </Section>

          <Section title="Acceptable Use">
            <p>You agree not to use Debate Coach to:</p>
            <ul style={{ paddingLeft: 'var(--space-lg)', marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Submit content that is unlawful, abusive, threatening, or harassing</li>
              <li>Attempt to reverse-engineer, scrape, or abuse the AI systems</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with the Service or its infrastructure</li>
              <li>Use the Service for any commercial purpose without our written consent</li>
            </ul>
          </Section>

          <Section title="AI-Generated Content">
            <p>
              Debate Coach uses AI to generate arguments, counterarguments, coaching feedback, and
              scores. This content is generated automatically and should be used for practice and
              educational purposes only. AI responses may occasionally be inaccurate, incomplete, or
              biased. Do not rely on AI-generated debate arguments as authoritative sources of fact
              or legal advice.
            </p>
            <p style={{ marginTop: 'var(--space-md)' }}>
              Your debate responses and topics are sent to our AI provider for processing. By using
              the Service, you consent to this processing as described in our{' '}
              <Link to="/privacy" style={{ color: 'var(--color-primary)' }}>Privacy Policy</Link>.
            </p>
          </Section>

          <Section title="Intellectual Property">
            <p>
              The Debate Coach platform, including its design, code, branding, and original content,
              is owned by Avadh Gupta. You retain ownership of the debate content you write. By
              submitting content through the Service, you grant us a limited licence to process and
              store that content for the purpose of providing the Service.
            </p>
          </Section>

          <Section title="Advertising">
            <p>
              Debate Coach may display advertisements served by Google AdSense. These ads are
              provided by Google and are subject to Google's advertising policies. We do not
              endorse the products or services advertised.
            </p>
          </Section>

          <Section title="Disclaimer of Warranties">
            <p>
              The Service is provided "as is" and "as available" without any warranties, express or
              implied. We do not guarantee that the Service will be uninterrupted, error-free, or
              that AI-generated content will be accurate. Use of the Service is at your own risk.
            </p>
          </Section>

          <Section title="Limitation of Liability">
            <p>
              To the fullest extent permitted by law, Avadh Gupta shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of the
              Service. Our total liability to you for any claim shall not exceed the amount you paid
              to use the Service in the preceding 12 months (or $0 for free users).
            </p>
          </Section>

          <Section title="Changes to These Terms">
            <p>
              We may update these Terms from time to time. When we do, we will update the "last
              updated" date above. Continued use of the Service after changes are posted constitutes
              your acceptance of the updated Terms.
            </p>
          </Section>

          <Section title="Governing Law">
            <p>
              These Terms are governed by applicable law. Any disputes shall be resolved through
              good-faith negotiation before any legal proceedings.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              If you have questions about these Terms, please visit our{' '}
              <Link to="/contact" style={{ color: 'var(--color-primary)' }}>Contact page</Link>.
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}
