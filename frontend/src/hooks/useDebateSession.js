import { useState, useCallback } from 'react';
import * as api from '../services/api.js';

export function useDebateSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const withLoading = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      const msg = err?.message || 'An unexpected error occurred.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generate = useCallback(
    (config) => withLoading(() => api.generateDebate(config)),
    [withLoading]
  );

  const challenge = useCallback(
    (params) => withLoading(() => api.getChallenge(params)),
    [withLoading]
  );

  const evaluate = useCallback(
    (params) => withLoading(() => api.evaluateResponse(params)),
    [withLoading]
  );

  const complete = useCallback(
    (params) => withLoading(() => api.completeDebate(params)),
    [withLoading]
  );

  return {
    loading,
    error,
    clearError,
    generate,
    challenge,
    evaluate,
    complete,
  };
}
