import { useCallback } from 'react';

/**
 * useDraftDebate
 *
 * Persists an in-progress practice session to localStorage so the user can
 * leave mid-session and resume later from the Dashboard.
 *
 * Draft schema saved to localStorage:
 * {
 *   savedAt:         ISO string
 *   config:          { topic, position, difficulty, debateType, timeLimit }
 *   round:           number   — current round (1-based)
 *   currentChallenge: string  — the AI challenge the user has not yet answered
 *   history:         array    — conversation history so far
 *   allScores:       array    — 0-10 scores for completed rounds
 *   allResponses:    array    — user responses for completed rounds
 *   totalHintsUsed:  number
 * }
 *
 * Key is scoped per user so different accounts never share drafts.
 */

const DRAFT_KEY_PREFIX = 'dc_draft_';
const FALLBACK_KEY = 'dc_draft_guest';

function draftKey(userId) {
  return userId ? `${DRAFT_KEY_PREFIX}${userId}` : FALLBACK_KEY;
}

export function useDraftDebate(userId) {
  /** Save the current practice state as a draft. */
  const saveDraft = useCallback(
    (draftData) => {
      try {
        const entry = {
          ...draftData,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(draftKey(userId), JSON.stringify(entry));
      } catch {
        // localStorage full or unavailable — silently skip
      }
    },
    [userId]
  );

  /** Load the saved draft for this user, or null if none exists. */
  const loadDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(draftKey(userId));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Basic sanity check
      if (!parsed?.config || typeof parsed.round !== 'number') return null;
      return parsed;
    } catch {
      return null;
    }
  }, [userId]);

  /** Delete the draft (call when session completes or user explicitly discards). */
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(draftKey(userId));
    } catch {
      // ignore
    }
  }, [userId]);

  /** True only when a valid draft exists for this user. */
  const hasDraft = useCallback(() => {
    return loadDraft() !== null;
  }, [loadDraft]);

  return { saveDraft, loadDraft, clearDraft, hasDraft };
}
