import React, { createContext, useContext, useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Toast from './components/Toast.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DebateSetup from './pages/DebateSetup.jsx';
import Preparation from './pages/Preparation.jsx';
import PracticeMode from './pages/PracticeMode.jsx';
import Results from './pages/Results.jsx';
import HistoryPage from './pages/History.jsx';

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

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <DebateProvider>
          <div className="app-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main className="page-wrapper">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/setup" element={<DebateSetup />} />
                <Route path="/preparation" element={<Preparation />} />
                <Route path="/practice" element={<PracticeMode />} />
                <Route path="/results" element={<Results />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </DebateProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
