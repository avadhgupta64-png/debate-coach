import { useState, useCallback, useEffect } from 'react';

// Fallback key used only when no user is signed in (demo / unauthenticated mode).
const FALLBACK_KEY = 'debate_coach_history_guest';

/** Build the per-user storage key so different accounts never share history. */
function storageKey(userId) {
  return userId ? `debate_coach_history_${userId}` : FALLBACK_KEY;
}

/**
 * Reads the raw history array from localStorage for a given user.
 * Returns an empty array if nothing is stored or on parse error.
 */
function readHistory(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persists the history array to localStorage for a given user.
 */
function writeHistory(userId, history) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(history));
  } catch {
    // storage might be full — silently skip
  }
}

/**
 * Derives summary stats from the history array.
 */
export function deriveStats(history) {
  if (!history || history.length === 0) {
    return {
      debatesPracticed: 0,
      averageScore: 0,
      strongestSkill: '—',
      currentStreak: 0,
    };
  }

  const debatesPracticed = history.length;

  // Average overall score — normalise to 0-100 if stored as 0-10
  const totalScore = history.reduce((sum, d) => {
    const s = d.overallScore || 0;
    return sum + (s <= 10 ? s * 10 : s);
  }, 0);
  const averageScore = +(totalScore / debatesPracticed).toFixed(1);

  // Strongest skill — average each skill across all sessions, pick highest
  const skillTotals = {};
  const skillCounts = {};
  history.forEach((d) => {
    if (d.scores && typeof d.scores === 'object') {
      Object.entries(d.scores).forEach(([skill, val]) => {
        // normalise to 0-100
        const v = val <= 10 ? val * 10 : val;
        skillTotals[skill] = (skillTotals[skill] || 0) + v;
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    }
  });

  const SKILL_LABELS = {
    argumentQuality: 'Argument Quality',
    rebuttal: 'Rebuttal',
    logic: 'Logic',
    evidence: 'Evidence',
    clarity: 'Clarity',
    confidence: 'Confidence',
    persuasiveness: 'Persuasiveness',
    structure: 'Structure',
  };

  let strongestSkill = '—';
  let highestAvg = 0; // only consider skills with a positive average score
  Object.entries(skillTotals).forEach(([skill, total]) => {
    const avg = total / skillCounts[skill];
    if (avg > highestAvg) {
      highestAvg = avg;
      strongestSkill = SKILL_LABELS[skill] || skill;
    }
  });

  // Current streak — consecutive days with at least one debate (most recent first)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get unique debate days sorted descending
  const debateDays = [
    ...new Set(
      history.map((d) => {
        const date = new Date(d.completedAt);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
    ),
  ].sort((a, b) => b - a);

  let streak = 0;
  let expectedDay = today.getTime();

  for (const dayTs of debateDays) {
    if (dayTs === expectedDay) {
      streak++;
      expectedDay -= 86400000; // go back one day
    } else if (dayTs === expectedDay + 86400000) {
      // Yesterday counts — start streak from yesterday
      streak++;
      expectedDay = dayTs - 86400000;
    } else if (dayTs < expectedDay) {
      break;
    }
  }

  return { debatesPracticed, averageScore, strongestSkill, currentStreak: streak };
}

/**
 * Hook for reading, writing, and reacting to debate history in localStorage.
 *
 * Pass the current user's UID (string or null) to scope history per account.
 * Different users on the same browser get completely separate history.
 *
 * Returns:
 *  - history: array of debate session objects
 *  - stats: derived { debatesPracticed, averageScore, strongestSkill, currentStreak }
 *  - saveDebate(sessionData): appends a new session and persists
 *  - clearHistory(): wipes history for this user only
 */
export function useDebateHistory(userId) {
  const [history, setHistory] = useState(() => readHistory(userId));

  // Re-load history whenever the userId changes (sign-in / sign-out)
  useEffect(() => {
    setHistory(readHistory(userId));
  }, [userId]);

  // Keep in sync when another tab changes localStorage
  useEffect(() => {
    const key = storageKey(userId);
    const handleStorage = (e) => {
      if (e.key === key) {
        setHistory(readHistory(userId));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [userId]);

  const saveDebate = useCallback(
    (sessionData) => {
      const entry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        completedAt: new Date().toISOString(),
        ...sessionData,
      };
      setHistory((prev) => {
        const updated = [entry, ...prev];
        writeHistory(userId, updated);
        return updated;
      });
      return entry.id;
    },
    [userId]
  );

  const clearHistory = useCallback(() => {
    localStorage.removeItem(storageKey(userId));
    setHistory([]);
  }, [userId]);

  const stats = deriveStats(history);

  return { history, stats, saveDebate, clearHistory };
}
