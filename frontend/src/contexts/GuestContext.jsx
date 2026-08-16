import React, { createContext, useContext, useState, useCallback } from 'react';

/*
 * GuestContext
 *
 * Tracks whether the user is in "guest exploration mode" —
 * i.e. they chose "Explore without signing in" on the landing page.
 *
 * Guest mode is purely a frontend UX concept. It does NOT bypass
 * Firebase authentication on the backend. Every protected API call
 * still requires a valid Firebase token; guests simply cannot make
 * those calls.
 *
 * State is in-memory only (resets on hard refresh). That's intentional:
 * a returning guest should see the landing page again, not get silently
 * auto-admitted into a guest session.
 */

const GuestContext = createContext(null);

export const useGuest = () => {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error('useGuest must be used inside GuestProvider');
  return ctx;
};

export function GuestProvider({ children }) {
  const [isGuest, setIsGuest] = useState(false);

  // Call this when the user clicks "Explore without signing in"
  const enterGuestMode = useCallback(() => {
    setIsGuest(true);
  }, []);

  // Call this when the guest completes sign-in or explicitly exits
  const exitGuestMode = useCallback(() => {
    setIsGuest(false);
  }, []);

  return (
    <GuestContext.Provider value={{ isGuest, enterGuestMode, exitGuestMode }}>
      {children}
    </GuestContext.Provider>
  );
}
