import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Plus, History, LogOut, User as UserIcon, Info, Brain, BookOpen } from 'lucide-react';
import debateCoachLogo from '/debate-coach-logo.png';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useGuest } from '../contexts/GuestContext.jsx';
import { useSignInModal } from '../App.jsx';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const { isGuest, exitGuestMode } = useGuest();
  const { openSignInModal } = useSignInModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  }, [location.pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileMenuOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.navbar-profile')) setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [profileMenuOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const navLinks = [
    { to: '/',          label: 'Dashboard', icon: <Home    size={15} /> },
    { to: '/history',   label: 'History',   icon: <History size={15} /> },
    { to: '/profile',   label: 'My Profile',icon: <Brain   size={15} /> },
    { to: '/resources', label: 'Resources', icon: <BookOpen size={15} /> },
    { to: '/about',     label: 'About',     icon: <Info    size={15} /> },
  ];

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <nav
        className="navbar"
        style={{
          position:        'fixed',
          top:             0,
          left:            0,
          right:           0,
          zIndex:          100,
          height:          'var(--nav-height)',
          display:         'flex',
          alignItems:      'center',
          background:      scrolled ? 'rgba(8,10,15,0.96)' : 'rgba(8,10,15,0.75)',
          backdropFilter:  'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom:    scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
          transition:      'background 0.3s ease, border-color 0.3s ease',
          padding:         '0 var(--space-xl)',
        }}
      >
        <div
          style={{
            maxWidth:        'var(--content-max)',
            width:           '100%',
            margin:          '0 auto',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'space-between',
            gap:             'var(--space-md)',
          }}
        >
          {/* ── Logo ─────────────────────────────────────────────────────── */}
          <Link
            to="/"
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '10px',
              textDecoration: 'none',
              flexShrink:     0,
            }}
          >
            <img
              src={debateCoachLogo}
              alt="Debate Coach"
              style={{
                width:        32,
                height:       32,
                borderRadius: 'var(--radius-md)',
                objectFit:    'contain',
              }}
            />
            <span
              style={{
                fontWeight:     800,
                fontSize:       '1rem',
                color:          'var(--color-text-primary)',
                letterSpacing:  '-0.02em',
              }}
            >
              Debate<span style={{ color: 'var(--color-primary)' }}>Coach</span>
            </span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────────────────────── */}
          <div
            className="hide-mobile"
            style={{
              display:     'flex',
              alignItems:  'center',
              gap:         '2px',
              flex:        1,
              justifyContent: 'center',
            }}
          >
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display:         'flex',
                    alignItems:      'center',
                    gap:             '6px',
                    padding:         '7px 13px',
                    borderRadius:    'var(--radius-md)',
                    fontSize:        '0.855rem',
                    fontWeight:      active ? 600 : 500,
                    textDecoration:  'none',
                    color:           active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    background:      active ? 'var(--color-surface-2)' : 'transparent',
                    transition:      'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color      = 'var(--color-text-primary)';
                      e.currentTarget.style.background = 'var(--color-surface-2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color      = 'var(--color-text-secondary)';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop Right Actions ────────────────────────────────────── */}
          <div
            className="hide-mobile"
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        'var(--space-sm)',
              flexShrink: 0,
            }}
          >
            <button
              className="btn btn-primary btn-sm"
              onClick={() => currentUser ? navigate('/setup') : openSignInModal('/setup')}
            >
              <Plus size={14} />
              Start Debate
            </button>

            {/* Guest indicator */}
            {!currentUser && isGuest && (
              <>
                <span
                  style={{
                    fontSize:    '0.75rem',
                    fontWeight:  500,
                    color:       'var(--color-text-muted)',
                    padding:     '5px 11px',
                    background:  'var(--color-surface-2)',
                    border:      '1px solid var(--color-border)',
                    borderRadius:'var(--radius-full)',
                  }}
                >
                  Exploring
                </span>
                <button
                  onClick={() => { exitGuestMode(); navigate('/login'); }}
                  className="btn btn-secondary btn-sm"
                >
                  Sign In
                </button>
              </>
            )}

            {/* Profile dropdown */}
            {currentUser && (
              <div className="navbar-profile" style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  style={{
                    display:      'flex',
                    alignItems:   'center',
                    gap:          '8px',
                    padding:      '5px 10px 5px 5px',
                    background:   'var(--color-surface-2)',
                    border:       `1px solid ${profileMenuOpen ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor:       'pointer',
                    transition:   'border-color var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { if (!profileMenuOpen) e.currentTarget.style.borderColor = 'var(--color-border-hover)'; }}
                  onMouseLeave={(e) => { if (!profileMenuOpen) e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover' }}
                    />
                  ) : (
                    <div style={{
                      width:28, height:28, borderRadius:'50%',
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <UserIcon size={15} color="#fff" />
                    </div>
                  )}
                  <span style={{
                    fontSize:'0.855rem', fontWeight:500,
                    color:'var(--color-text-primary)',
                    maxWidth:110, overflow:'hidden',
                    textOverflow:'ellipsis', whiteSpace:'nowrap',
                  }}>
                    {currentUser.displayName || 'User'}
                  </span>
                </button>

                {profileMenuOpen && (
                  <div style={{
                    position:     'absolute',
                    top:          'calc(100% + 8px)',
                    right:        0,
                    zIndex:       200,
                    background:   'var(--color-surface)',
                    border:       '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding:      '6px',
                    minWidth:     200,
                    boxShadow:    '0 12px 40px rgba(0,0,0,0.45)',
                    animation:    'fadeUp 0.18s ease forwards',
                  }}>
                    <div style={{
                      padding:      '10px 14px 12px',
                      borderBottom: '1px solid var(--color-border)',
                      marginBottom: '6px',
                    }}>
                      <p style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--color-text-primary)', marginBottom:3 }}>
                        {currentUser.displayName}
                      </p>
                      <p style={{ fontSize:'0.75rem', color:'var(--color-text-muted)' }}>
                        {currentUser.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      style={{
                        width:'100%', padding:'9px 14px',
                        background:'transparent', border:'none',
                        borderRadius:'var(--radius-sm)',
                        display:'flex', alignItems:'center', gap:'10px',
                        cursor:'pointer', fontSize:'0.875rem', fontWeight:500,
                        color:'var(--color-danger)',
                        transition:'background var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-danger-dim)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Mobile Hamburger ─────────────────────────────────────────── */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              display:    'none',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              color:      'var(--color-text-primary)',
              padding:    '4px',
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ────────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          style={{
            position:       'fixed',
            top:            'var(--nav-height)',
            left:           0,
            right:          0,
            zIndex:         99,
            background:     'var(--color-surface)',
            borderBottom:   '1px solid var(--color-border)',
            padding:        'var(--space-sm) var(--space-md) var(--space-md)',
            display:        'flex',
            flexDirection:  'column',
            gap:            '2px',
            boxShadow:      '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {navLinks.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            '10px',
                  padding:        '12px 14px',
                  borderRadius:   'var(--radius-md)',
                  textDecoration: 'none',
                  color:          active ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  background:     active ? 'var(--color-surface-2)' : 'transparent',
                  fontWeight:     active ? 600 : 500,
                  fontSize:       '0.9rem',
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}

          <button
            className="btn btn-primary"
            style={{ marginTop: 'var(--space-sm)' }}
            onClick={() => currentUser ? navigate('/setup') : openSignInModal('/setup')}
          >
            <Plus size={16} />
            Start Debate
          </button>

          {/* Guest — sign in prompt */}
          {!currentUser && isGuest && (
            <div style={{
              marginTop:   'var(--space-sm)',
              paddingTop:  'var(--space-sm)',
              borderTop:   '1px solid var(--color-border)',
              display:     'flex',
              flexDirection:'column',
              gap:         'var(--space-sm)',
            }}>
              <p style={{ fontSize:'0.8rem', color:'var(--color-text-muted)', padding:'0 4px' }}>
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

          {/* Authenticated user info + sign out */}
          {currentUser && (
            <div style={{
              marginTop:  'var(--space-sm)',
              paddingTop: 'var(--space-sm)',
              borderTop:  '1px solid var(--color-border)',
            }}>
              <div style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '10px',
                padding:    '10px 14px',
                marginBottom: 4,
              }}>
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    referrerPolicy="no-referrer"
                    style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover' }}
                  />
                ) : (
                  <div style={{
                    width:32, height:32, borderRadius:'50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <UserIcon size={15} color="#fff" />
                  </div>
                )}
                <div>
                  <p style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--color-text-primary)' }}>
                    {currentUser.displayName || 'User'}
                  </p>
                  <p style={{ fontSize:'0.75rem', color:'var(--color-text-muted)' }}>
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                style={{
                  width:'100%', padding:'11px 14px',
                  background:'transparent', border:'none',
                  borderRadius:'var(--radius-md)',
                  display:'flex', alignItems:'center', gap:'10px',
                  cursor:'pointer', fontSize:'0.875rem', fontWeight:500,
                  color:'var(--color-danger)',
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
          .hide-mobile     { display: none !important; }
        }
      `}</style>
    </>
  );
}
