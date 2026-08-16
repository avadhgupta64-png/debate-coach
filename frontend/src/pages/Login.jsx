import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Target, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useGuest } from '../contexts/GuestContext.jsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import RotatingText from '../components/RotatingText.jsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, loading: authLoading } = useAuth();
  const { enterGuestMode } = useGuest();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useDocumentTitle('Sign In');

  const from = location.state?.from?.pathname || '/';

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Sign in failed:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExploreAsGuest = () => {
    enterGuestMode();
    navigate('/', { replace: true });
  };

  if (authLoading) {
    return (
      <div className="page-fade" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  return (
    <div className="page-fade">
      <div className="container-narrow" style={{ maxWidth: 480 }}>
        <div className="page-content">
          {/* Logo and welcome */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-lg)',
                boxShadow: '0 8px 32px rgba(79,142,247,0.25)',
              }}
            >
              <Target size={40} color="#fff" />
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              Welcome to <span style={{ color: 'var(--color-primary)' }}>DebateCoach</span>
            </h1>
            <RotatingText
              style={{
                fontSize: '1rem',
                maxWidth: 360,
                margin: '0 auto',
              }}
            />
          </div>

          {/* Sign in card */}
          <div className="card" style={{ textAlign: 'center' }}>
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-sm)',
                  padding: '12px 16px',
                  background: 'var(--color-danger-dim)',
                  border: '1px solid rgba(248,113,113,0.2)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-lg)',
                }}
              >
                <AlertCircle size={18} color="var(--color-danger)" />
                <span style={{ color: 'var(--color-danger)', fontSize: '0.875rem', textAlign: 'left' }}>
                  {error}
                </span>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 24px',
                background: '#fff',
                border: '1.5px solid #dadce0',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#3c4043',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-sm)',
                transition: 'all var(--transition-base)',
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#c6c6c6';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#dadce0';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 20, height: 20 }} />
                  Signing in...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--space-lg)',
                lineHeight: 1.5,
              }}
            >
              By signing in, you agree to our Terms of Service and Privacy Policy.
              Your debate sessions and progress will be saved securely.
            </p>

            {/* Guest mode CTA */}
            <div style={{ marginTop: 'var(--space-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-lg)' }}>
              <button
                onClick={handleExploreAsGuest}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'var(--color-surface-2)';
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                    e.currentTarget.style.borderColor = 'var(--color-border-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }
                }}
              >
                Explore without signing in
              </button>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 'var(--space-sm)', lineHeight: 1.5 }}>
                Browse the interface freely. Sign in when you're ready to start practising.
              </p>
            </div>
          </div>

          {/* Features list — rotating cinematic presentation */}
          <div style={{ marginTop: 'var(--space-2xl)' }}>
            <h3
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 'var(--space-md)',
                textAlign: 'center',
              }}
            >
              What you'll get
            </h3>
            {/*
              Outer card shell matches the original row styling (surface-2 bg,
              border, rounded corners) so the section retains its visual weight.
              RotatingText reserves a stable height so nothing below it shifts.
            */}
            <div
              style={{
                padding: '10px 16px',
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <RotatingText
                phrases={[
                  'AI-powered debate preparation and argument analysis',
                  'Live sparring with an adaptive AI opponent',
                  'Detailed performance feedback and scoring',
                  'Logical fallacy detection and coaching',
                  'Progress tracking across all your debates',
                ]}
                holdDuration={2000}
                transitionDuration={550}
                /* minHeight sized for two-line wrap on narrow mobile screens */
                minHeight="4em"
                textStyle={{ fontSize: '0.875rem' }}
                style={{ justifyContent: 'flex-start' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
