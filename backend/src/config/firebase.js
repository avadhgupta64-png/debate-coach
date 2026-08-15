// Firebase Admin SDK configuration
// Used for server-side authentication token verification
// NEVER expose these credentials in frontend code

import admin from 'firebase-admin';

const isFirebaseConfigured = () => {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL
  );
};

let initialized = false;

export const initializeFirebaseAdmin = () => {
  if (initialized) return;

  if (!isFirebaseConfigured()) {
    console.warn(
      '⚠️  Firebase Admin not configured. Authentication will not work.\n' +
        '   Set FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL in backend/.env\n'
    );
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    initialized = true;
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error.message);
  }
};

export const getAuth = () => {
  if (!initialized) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.auth();
};

export const isInitialized = () => initialized;
