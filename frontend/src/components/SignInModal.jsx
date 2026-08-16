import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle } from 'lucide-react';
import debateCoachLogo from '/debate-coach-logo.png';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useGuest } from '../contexts/GuestContext.jsx';

/*
 * SignInModal
 *
 * Shown when a guest attempts a protected action.
 * After successful sign-in it navigates to `intendedPath` (the route
 * the user was trying to reach) rather than the generic dashboard.
 *
 * Props:
 *   isOpen       — boolean
 *   onClose      — called when the user dismisses without signing in
 *   intendedPath — pathname to navigate to after sign-in (defaults to '/')
 */
export default function SignInModal({ isOpen, onClose, intendedPath = '/' }) {
  const { signInWithGoogle } = useAuth();
  const { exitGuestMode } = useGuest();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Animate in/out
  useEffect(() => {
    if (isOpen) {
      // Small delay so the CSS transition fires after the element is mounted
      const id = setTimeout(() => setVisible(true), 20);
      return () => clearTimeout(id);
    } else {
      setVisible(false);
      setError(null);
    }
  }, [isOpen]);

  // Trap focus inside modal when open; restore on close
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      exitGuestMode();
      onClose?.();
      navigate(intendedPath, { replace: true });
    } catch (err) {
      console.error('Sign in failed:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .signin-modal-overlay, .signin-modal-card {
            transition: opacity 150ms ease !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-modal-title"
        className="signin-modal-overlay"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 500,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-lg)',
          opacity: visible ? 1 : 0,
          transition: `opacity 300ms ${easing}`,
        }}
      >
        {/* Card */}
        <div
          className="signin-modal-card"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 440,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-2xl)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            transition: `opacity 350ms ${easing}, transform 350ms ${easing}`,
          }}
        >
          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close sign-in prompt"
            style={{
              position: 'absolute',
              top: 'var(--space-md)',
              right: 'var(--space-md)',
              width: 32,
              height: 32,
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-text-primary)';
              e.currentTarget.style.borderColor = 'var(--color-border-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-muted)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            <X size={16} />
          </button>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <img
              src={debateCoachLogo}
              alt="Debate Coach"
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-md)',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto var(--space-md)',
                boxShadow: '0 4px 20px rgba(79,142,247,0.3)',
              }}
            />

            <h2
              id="signin-modal-title"
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-sm)',
              }}
            >
              Sign in to continue
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              maxWidth: 320,
              margin: '0 auto',
            }}>
              Create your free Debate Coach account to start practising, save your debates, and track your progress.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              padding: '12px 16px',
              background: 'var(--color-danger-dim)',
              border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-lg)',
            }}>
              <AlertCircle size={16} color="var(--color-danger)" />
              <span style={{ color: 'var(--color-danger)', fontSize: '0.8rem' }}>{error}</span>
            </div>
          )}

          {/* Google sign-in button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px 24px',
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
              marginBottom: 'var(--space-sm)',
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Maybe later */}
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px 24px',
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
            Maybe later
          </button>

          <p style={{
            fontSize: '0.72rem',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            marginTop: 'var(--space-lg)',
            lineHeight: 1.5,
          }}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </>
  );
}
