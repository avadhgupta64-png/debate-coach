import React, { createContext, useContext, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DebateSetup from './pages/DebateSetup.jsx';
import Preparation from './pages/Preparation.jsx';
import PracticeMode from './pages/PracticeMode.jsx';
import Results from './pages/Results.jsx';
import HistoryPage from './pages/History.jsx';
import Login from './pages/Login.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
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

// ─── Protected Route ──────────────────────────────────────────────────────────

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// ─── App Routes ───────────────────────────────────────────────────────────────

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
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

      {/* Protected */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/setup" element={<ProtectedRoute><DebateSetup /></ProtectedRoute>} />
      <Route path="/preparation" element={<ProtectedRoute><Preparation /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><PracticeMode /></ProtectedRoute>} />
      <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <DebateProvider>
            <div className="app-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main className="page-wrapper">
                <AppRoutes />
              </main>
            </div>
          </DebateProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
