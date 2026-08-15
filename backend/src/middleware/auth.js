// Authentication middleware.
// Verifies the Firebase ID token from the Authorization header.
// Attaches verified user info to req.user — never trusts client-supplied userId.

import { getAuth, isInitialized } from '../config/firebase.js';

/**
 * Require a valid Firebase ID token.
 * Rejects with 401 if missing, expired, or invalid.
 * On success: attaches req.user = { uid, email, name, picture }
 */
export const authenticateUser = async (req, res, next) => {
  // If Firebase isn't configured, allow through with a warning (dev mode)
  if (!isInitialized()) {
    console.warn(
      '[auth] Firebase not configured. Bypassing auth in dev/demo mode.\n' +
        '       Configure FIREBASE_* env vars to enable authentication.'
    );
    req.user = { uid: 'demo-user', email: 'demo@example.com', name: 'Demo User' };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized: missing or malformed Authorization header.',
    });
  }

  const idToken = authHeader.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized: token is empty.',
    });
  }

  try {
    const decoded = await getAuth().verifyIdToken(idToken);

    // Attach verified user to request — NEVER use req.body.userId
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
      picture: decoded.picture || null,
    };

    next();
  } catch (err) {
    console.error('[auth] Token verification failed:', err.code || err.message);

    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: true,
        message: 'Session expired. Please sign in again.',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      error: true,
      message: 'Unauthorized: invalid token.',
    });
  }
};

/**
 * Optional auth middleware — if a token is present it is verified and attached,
 * but the request is still allowed through if no token is supplied.
 * Useful for endpoints that behave differently when authenticated.
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ') || !isInitialized()) {
    req.user = null;
    return next();
  }

  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
      picture: decoded.picture || null,
    };
  } catch {
    req.user = null;
  }

  next();
};
