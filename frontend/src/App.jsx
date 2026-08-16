import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import SignInModal from './components/SignInModal.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DebateSetup from './pages/DebateSetup.jsx';
import Preparation from './pages/Preparation.jsx';
import PracticeMode from './pages/PracticeMode.jsx';
import Results from './pages/Results.jsx';
import HistoryPage from './pages/History.jsx';
import Login from './pages/Login.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { GuestProvider, useGuest } from './contexts/GuestContext.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

// ─── Debate Context ─────────────────────────────────────────────────────────

const DebateContext = createContext(null);

export const useDebate = () => {
  const ctx = useContext(DebateContext);
  if (!ctx) throw new Error('useDebate must be used inside DebateProvider');
  return ctx;
};

const initialState = {
  config: null,       // { topic, position, difficulty, debateType, timeLimit }
  preparation: null,  // generated arguments/counterargs
  session: null,      // { rounds, responses, scores, challenges }
  results: null,      // final evaluation
};

function DebateProvider({ children }) {
  const [debate, setDebate] = useState(initialState);

  const setConfig = useCallback((config) => {
    setDebate((prev) => ({ ...prev, config, preparation: null, session: null, results: null }));
  }, []);

  const setPreparation = useCallback((preparation) => {
    setDebate((prev) => ({ ...prev, preparation }));
  }, []);

  const setSession = useCallback((session) => {
    setDebate((prev) => ({ ...prev, session }));
  }, []);

  const setResults = useCallback((results) => {
    setDebate((prev) => ({ ...prev, results }));
  }, []);

  const reset = useCallback(() => setDebate(initialState), []);

  return (
    <DebateContext.Provider value={{ debate, setConfig, setPreparation, setSession, setResults, reset }}>
      {children}
    </DebateContext.Provider>
  );
}

// ─── Toast Context ────────────────────────────────────────────────────────────

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <Toast toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ─── SignInModal Context ──────────────────────────────────────────────────────
// Allows any component deep in the tree to trigger the sign-in modal
// while remembering where the user was trying to go.

const SignInModalContext = createContext(null);
export const useSignInModal = () => useContext(SignInModalContext);

function SignInModalProvider({ children }) {
  const [modalState, setModalState] = useState({ open: false, intendedPath: '/' });

  const openSignInModal = useCallback((intendedPath = '/') => {
    setModalState({ open: true, intendedPath });
  }, []);

  const closeSignInModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <SignInModalContext.Provider value={{ openSignInModal, closeSignInModal }}>
      {children}
      <SignInModal
        isOpen={modalState.open}
        onClose={closeSignInModal}
        intendedPath={modalState.intendedPath}
      />
    </SignInModalContext.Provider>
  );
}

// ─── Protected Route ──────────────────────────────────────────────────────────
// Authenticated users → full access.
// Guests on action routes (/setup, /preparation, /practice, /results)
//   → redirect to dashboard + pop sign-in modal.
// Guests on browsing routes (/, /history) → allow (read-only view).
// Unauthenticated non-guest → redirect to /login.

const ACTION_ROUTES = ['/setup', '/preparation', '/practice', '/results'];

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const { isGuest } = useGuest();
  const location = useLocation();
  const { openSignInModal } = useSignInModal();

  const isActionRoute = ACTION_ROUTES.some((p) => location.pathname.startsWith(p));

  // Fire sign-in modal when a guest lands on an action route
  useEffect(() => {
    if (!loading && !currentUser && isGuest && isActionRoute) {
      openSignInModal(location.pathname);
    }
  }, [loading, currentUser, isGuest, isActionRoute, location.pathname, openSignInModal]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  // Authenticated — full access
  if (currentUser) return children;

  // Guest on action route — bounce to dashboard (modal pops over it)
  if (isGuest && isActionRoute) {
    return <Navigate to="/" replace />;
  }

  // Guest on browsing route — allow
  if (isGuest) return children;

  // Neither — send to /login, remember intended destination
  return <Navigate to="/login" state={{ from: location }} replace />;
}

// ─── App Routes ───────────────────────────────────────────────────────────────

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected — guests can browse, but protected actions show sign-in modal */}
      <Route path="/"           element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/setup"      element={<ProtectedRoute><DebateSetup /></ProtectedRoute>} />
      <Route path="/preparation" element={<ProtectedRoute><Preparation /></ProtectedRoute>} />
      <Route path="/practice"   element={<ProtectedRoute><PracticeMode /></ProtectedRoute>} />
      <Route path="/results"    element={<ProtectedRoute><Results /></ProtectedRoute>} />
      <Route path="/history"    element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ─── Splash Gate ─────────────────────────────────────────────────────────────
// Shows the splash screen once per browser session (sessionStorage flag).
// Once done, renders the main app shell.

const SPLASH_KEY = 'dc_splash_seen';

function SplashGate({ children }) {
  const alreadySeen = typeof sessionStorage !== 'undefined'
    ? sessionStorage.getItem(SPLASH_KEY) === '1'
    : true;

  const [splashDone, setSplashDone] = useState(alreadySeen);

  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem(SPLASH_KEY, '1');
    setSplashDone(true);
  }, []);

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      {/* Render children immediately so Firebase auth initialises in the
          background; the splash sits on top via position:fixed + z-index. */}
      {children}
    </>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GuestProvider>
          <ToastProvider>
            <DebateProvider>
              <SignInModalProvider>
                <SplashGate>
                  <div className="app-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <main className="page-wrapper">
                      <AppRoutes />
                    </main>
                  </div>
                </SplashGate>
              </SignInModalProvider>
            </DebateProvider>
          </ToastProvider>
        </GuestProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
