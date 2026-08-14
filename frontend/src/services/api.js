// All backend communication goes through this file.
// Never put fetch() calls in components or pages directly.

const BASE_URL = import.meta.env.VITE_API_URL || '';

class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}/api${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
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

export { APIError };
