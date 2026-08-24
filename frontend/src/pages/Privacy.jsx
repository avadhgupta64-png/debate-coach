import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
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

export default function Privacy() {
  useDocumentTitle('Privacy Policy — Debate Coach');

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
              <Shield size={24} color="var(--color-primary)" />
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
                Privacy Policy
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Last updated: August 2026
              </p>
            </div>
          </div>

          <Section title="Overview">
            <p>
              Debate Coach ("we", "our", or "the app") is an AI-powered debate training platform
              built and operated by Avadh Gupta. This Privacy Policy explains what information we
              collect when you use Debate Coach, how we use it, and the choices you have.
            </p>
            <p style={{ marginTop: 'var(--space-md)' }}>
              We keep this simple: we collect only what is necessary to run the service, we do not
              sell your data, and we give you control over your information.
            </p>
          </Section>

          <Section title="Information We Collect">
            <p><strong style={{ color: 'var(--color-text-primary)' }}>Account information.</strong> When you sign in with Google, we receive your name, email address, and profile photo from Google. We store these to identify your account and personalise your experience.</p>
            <p style={{ marginTop: 'var(--space-md)' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Debate session data.</strong> Your debate topics, chosen positions, responses, and AI-generated scores are stored so you can review your history and track progress over time. This data is associated with your account.
            </p>
            <p style={{ marginTop: 'var(--space-md)' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Usage data.</strong> We may log basic usage events (e.g., pages visited, features used) to understand how the app is being used and to fix bugs. This data is aggregated and not linked to individual users.
            </p>
            <p style={{ marginTop: 'var(--space-md)' }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>Guest sessions.</strong> If you use the app without signing in, no personal data is stored on our servers. Session state is kept only in your browser's local storage.
            </p>
          </Section>

          <Section title="How We Use Your Information">
            <ul style={{ paddingLeft: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>To operate and provide the Debate Coach service</li>
              <li>To save your debate history and progress across sessions</li>
              <li>To send your debate responses to our AI backend for analysis and scoring</li>
              <li>To improve the app based on aggregated usage patterns</li>
              <li>To respond to support requests you send to us</li>
            </ul>
            <p style={{ marginTop: 'var(--space-md)' }}>
              We do not use your data for advertising profiling, and we do not sell your personal information to third parties.
            </p>
          </Section>

          <Section title="Third-Party Services">
            <p>Debate Coach uses the following third-party services, each with their own privacy policies:</p>
            <ul style={{ paddingLeft: 'var(--space-lg)', marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong style={{ color: 'var(--color-text-primary)' }}>Firebase (Google)</strong> — authentication and database storage.</li>
              <li><strong style={{ color: 'var(--color-text-primary)' }}>Google AI / OpenAI</strong> — AI coaching, argument analysis, and feedback generation. Your debate text is sent to the AI provider to generate responses.</li>
              <li><strong style={{ color: 'var(--color-text-primary)' }}>Google AdSense</strong> — advertising. Google may use cookies to serve ads based on your prior visits to this or other websites. You can opt out via Google's Ad Settings.</li>
              <li><strong style={{ color: 'var(--color-text-primary)' }}>Vercel</strong> — hosting and deployment.</li>
            </ul>
          </Section>

          <Section title="Cookies">
            <p>
              We use cookies and browser local storage for the following purposes:
            </p>
            <ul style={{ paddingLeft: 'var(--space-lg)', marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Keeping you signed in (Firebase authentication session)</li>
              <li>Storing your draft debates and app preferences locally</li>
              <li>Google AdSense advertising cookies (you can opt out via Google's Ad Settings)</li>
            </ul>
          </Section>

          <Section title="Data Retention and Deletion">
            <p>
              Your account data and debate history are retained as long as your account is active.
              You can request deletion of your account and all associated data by emailing us at the
              contact address below. We will process deletion requests within 30 days.
            </p>
          </Section>

          <Section title="Children's Privacy">
            <p>
              Debate Coach is intended for users aged 13 and older. We do not knowingly collect
              personal data from children under 13. If you believe a child under 13 has created an
              account, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="Your Rights">
            <p>You have the right to:</p>
            <ul style={{ paddingLeft: 'var(--space-lg)', marginTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Object to data processing in certain circumstances</li>
            </ul>
            <p style={{ marginTop: 'var(--space-md)' }}>
              To exercise any of these rights, please contact us using the details on our{' '}
              <Link to="/contact" style={{ color: 'var(--color-primary)' }}>Contact page</Link>.
            </p>
          </Section>

          <Section title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the
              "last updated" date at the top of this page. Continued use of Debate Coach after changes
              are posted constitutes your acceptance of the updated policy.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this policy? Visit our{' '}
              <Link to="/contact" style={{ color: 'var(--color-primary)' }}>Contact page</Link>{' '}
              or see the <Link to="/about" style={{ color: 'var(--color-primary)' }}>About page</Link>.
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}
