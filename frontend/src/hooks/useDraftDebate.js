import { useState, useCallback, useEffect } from 'react';

/**
 * useDraftDebate  (multi-draft edition)
 * ─────────────────────────────────────
 * Stores every in-progress session as a separate draft, keyed by a unique
 * draftId generated when the session starts. Drafts persist in localStorage
 * and are scoped per-user.
 *
 * Storage format (one localStorage key per user):
 * {
 *   [draftId]: {
 *     draftId:          string   — UUID-like identifier
 *     savedAt:          ISO string
 *     config:           { topic, position, difficulty, debateType, timeLimit }
 *     round:            number
 *     currentChallenge: string
 *     history:          array
 *     allScores:        array
 *     allResponses:     array
 *     totalHintsUsed:   number
 *   },
 *   ...
 * }
 *
 * API:
 *   saveDraft(draftId, data)   — create or update a draft
 *   loadDraft(draftId)         — load one draft by ID (or null)
 *   clearDraft(draftId)        — delete one draft
 *   clearAllDrafts()           — delete all drafts for this user
 *   listDrafts()               — return array of all drafts (newest first)
 *   hasDraft(draftId?)         — true if specific (or any) draft exists
 *   drafts                     — reactive array of all drafts (newest first)
 */

const MAP_KEY_PREFIX = 'dc_drafts_map_';
const FALLBACK_MAP_KEY = 'dc_drafts_map_guest';

function mapKey(userId) {
  return userId ? `${MAP_KEY_PREFIX}${userId}` : FALLBACK_MAP_KEY;
}

function readMap(userId) {
  try {
    const raw = localStorage.getItem(mapKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(userId, map) {
  try {
    localStorage.setItem(mapKey(userId), JSON.stringify(map));
  } catch {
    // storage full — silently skip
  }
}

/** Generate a short unique draft ID */
function newDraftId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export { newDraftId };

export function useDraftDebate(userId) {
  const [draftsMap, setDraftsMap] = useState(() => readMap(userId));

  // Re-sync when userId changes (sign-in / sign-out)
  useEffect(() => {
    setDraftsMap(readMap(userId));
  }, [userId]);

  // Sync across tabs
  useEffect(() => {
    const key = mapKey(userId);
    const handler = (e) => {
      if (e.key === key) setDraftsMap(readMap(userId));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [userId]);

  /** Save (create or update) a draft. Requires a draftId. */
  const saveDraft = useCallback(
    (draftId, draftData) => {
      if (!draftId) return;
      setDraftsMap((prev) => {
        const updated = {
          ...prev,
          [draftId]: {
            ...draftData,
            draftId,
            savedAt: new Date().toISOString(),
          },
        };
        writeMap(userId, updated);
        return updated;
      });
    },
    [userId]
  );

  /** Load a single draft by ID. Returns null if not found. */
  const loadDraft = useCallback(
    (draftId) => {
      if (!draftId) return null;
      const map = readMap(userId);
      const entry = map[draftId];
      if (!entry?.config || typeof entry.round !== 'number') return null;
      return entry;
    },
    [userId]
  );

  /** Load the most-recently-saved draft (for resume banner on Dashboard). */
  const loadLatestDraft = useCallback(() => {
    const map = readMap(userId);
    const entries = Object.values(map).filter(
      (e) => e?.config && typeof e.round === 'number'
    );
    if (entries.length === 0) return null;
    entries.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    return entries[0];
  }, [userId]);

  /** Delete a specific draft. */
  const clearDraft = useCallback(
    (draftId) => {
      if (!draftId) return;
      setDraftsMap((prev) => {
        const updated = { ...prev };
        delete updated[draftId];
        writeMap(userId, updated);
        return updated;
      });
    },
    [userId]
  );

  /** Delete all drafts for this user. */
  const clearAllDrafts = useCallback(() => {
    localStorage.removeItem(mapKey(userId));
    setDraftsMap({});
  }, [userId]);

  /** Returns sorted array of all valid drafts (newest first). */
  const listDrafts = useCallback(() => {
    const entries = Object.values(draftsMap).filter(
      (e) => e?.config && typeof e.round === 'number'
    );
    return entries.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  }, [draftsMap]);

  /**
   * hasDraft(draftId?)
   *  - with draftId: true if that specific draft exists
   *  - without: true if any draft exists
   */
  const hasDraft = useCallback(
    (draftId) => {
      if (draftId) return loadDraft(draftId) !== null;
      return listDrafts().length > 0;
    },
    [loadDraft, listDrafts]
  );

  // Reactive sorted drafts array for consumers that render lists
  const drafts = listDrafts();

  return {
    saveDraft,
    loadDraft,
    loadLatestDraft,
    clearDraft,
    clearAllDrafts,
    listDrafts,
    hasDraft,
    drafts,
    // Convenience: generate a new unique draftId (call once when session starts)
    newDraftId,
  };
}
