import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Target, Menu, X, Home, Plus, History, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useGuest } from '../contexts/GuestContext.jsx';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { isGuest, exitGuestMode } = useGuest();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <Home size={16} /> },
    { to: '/history', label: 'History', icon: <History size={16} /> },
    { to: '/setup', label: 'New Debate', icon: <Plus size={16} /> },
  ];

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav
        className="navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 'var(--nav-height)',
          display: 'flex',
          alignItems: 'center',
          background: scrolled
            ? 'rgba(10, 12, 16, 0.95)'
            : 'rgba(10, 12, 16, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled
            ? '1px solid var(--color-border)'
            : '1px solid transparent',
          transition: 'all 0.3s ease',
          padding: '0 var(--space-lg)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--content-max)',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Target size={18} color="#fff" />
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              Debate<span style={{ color: 'var(--color-primary)' }}>Coach</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div
            className="hide-mobile"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive(link.to)
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-secondary)',
                  background: isActive(link.to) ? 'var(--color-surface-2)' : 'transparent',
                  transition: 'all var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                    e.currentTarget.style.background = 'var(--color-surface-2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button
              className="btn btn-primary btn-sm"
              style={{ marginLeft: 'var(--space-sm)' }}
              onClick={() => navigate('/setup')}
            >
              <Plus size={14} />
              Start Debate
            </button>

            {/* Guest mode indicator — desktop */}
            {!currentUser && isGuest && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginLeft: 'var(--space-sm)' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: 'var(--color-text-muted)',
                  padding: '4px 10px',
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                }}>
                  Exploring
                </span>
                <button
                  onClick={() => { exitGuestMode(); navigate('/login'); }}
                  className="btn btn-secondary btn-sm"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* User profile dropdown */}
            {currentUser && (
              <div style={{ position: 'relative', marginLeft: 'var(--space-sm)' }}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <UserIcon size={16} color="#fff" />
                    </div>
                  )}
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--color-text-primary)',
                      maxWidth: 120,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentUser.displayName || 'User'}
                  </span>
                </button>

                {/* Dropdown menu */}
                {profileMenuOpen && (
                  <>
                    <div
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 98,
                      }}
                      onClick={() => setProfileMenuOpen(false)}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        zIndex: 99,
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '8px',
                        minWidth: 200,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      }}
                    >
                      <div
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--color-border)',
                          marginBottom: '8px',
                        }}
                      >
                        <p
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: 'var(--color-text-primary)',
                            marginBottom: '4px',
                          }}
                        >
                          {currentUser.displayName}
                        </p>
                        <p
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {currentUser.email}
                        </p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        style={{
                          width: '100%',
                          padding: '10px 16px',
                          background: 'transparent',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: 'var(--color-danger)',
                          transition: 'background var(--transition-fast)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--color-danger-dim)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-primary)',
              padding: '4px',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 'var(--nav-height)',
            left: 0,
            right: 0,
            zIndex: 99,
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            padding: 'var(--space-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-xs)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: isActive(link.to)
                  ? 'var(--color-text-primary)'
                  : 'var(--color-text-secondary)',
                background: isActive(link.to) ? 'var(--color-surface-2)' : 'transparent',
                fontWeight: 500,
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          <button
            className="btn btn-primary"
            style={{ marginTop: 'var(--space-sm)' }}
            onClick={() => navigate('/setup')}
          >
            <Plus size={16} />
            Start Debate
          </button>

          {/* Mobile user info + sign out */}
          {!currentUser && isGuest && (
            <div style={{
              marginTop: 'var(--space-sm)',
              paddingTop: 'var(--space-sm)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-sm)',
            }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', padding: '0 4px' }}>
                You're exploring as a guest. Sign in to start practising and save your progress.
              </p>
              <button
                onClick={() => { exitGuestMode(); navigate('/login'); }}
                className="btn btn-secondary"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Mobile authenticated user info + sign out */}
          {currentUser && (
            <div
              style={{
                marginTop: 'var(--space-sm)',
                paddingTop: 'var(--space-sm)',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  marginBottom: 4,
                }}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    referrerPolicy="no-referrer"
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UserIcon size={16} color="#fff" />
                  </div>
                )}
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {currentUser.displayName || 'User'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--color-danger)',
                  textAlign: 'left',
                }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
