// All backend communication goes through this file.
// Never put fetch() calls in components or pages directly.

import { auth } from '../config/firebase.js';

const BASE_URL = import.meta.env.VITE_API_URL || '';

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

// Get the current user's Firebase ID token for authenticated requests.
// Returns null if no user is signed in (falls back to unauthenticated).
async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    // forceRefresh=false: uses cached token unless it's about to expire
    return await user.getIdToken(false);
  } catch (err) {
    console.error('Failed to get ID token:', err);
    return null;
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}/api${path}`;

  const token = await getIdToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Attach Bearer token when authenticated
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
    // Merge any caller-supplied headers on top
    ...(options.headers
      ? { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } }
      : {}),
  };

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new APIError(
      'Unable to reach the server. Please check your connection.',
      0
    );
  }

  // Token expired or invalid — clear local session so user is prompted to sign back in
  if (response.status === 401) {
    throw new APIError('Session expired. Please sign in again.', 401);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new APIError('Server returned an unexpected response.', response.status);
  }

  if (!response.ok) {
    throw new APIError(
      data?.message || `Request failed (${response.status})`,
      response.status
    );
  }

  return data;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const healthCheck = () => request('/health');

export const generateDebate = (body) =>
  request('/debate/generate', { method: 'POST', body: JSON.stringify(body) });

export const getChallenge = (body) =>
  request('/debate/challenge', { method: 'POST', body: JSON.stringify(body) });

export const evaluateResponse = (body) =>
  request('/debate/evaluate', { method: 'POST', body: JSON.stringify(body) });

export const completeDebate = (body) =>
  request('/debate/complete', { method: 'POST', body: JSON.stringify(body) });

export const refineArgument = (body) =>
  request('/debate/refine', { method: 'POST', body: JSON.stringify(body) });

export const getHint = (body) =>
  request('/debate/hint', { method: 'POST', body: JSON.stringify(body) });

export { APIError };
