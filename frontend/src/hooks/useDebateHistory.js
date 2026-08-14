import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'debate_coach_history';

/**
 * Reads the raw history array from localStorage.
 * Returns an empty array if nothing is stored or on parse error.
 */
function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Persists the history array to localStorage.
 */
function writeHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
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

  // Average overall score
  const totalScore = history.reduce((sum, d) => sum + (d.overallScore || 0), 0);
  const averageScore = +(totalScore / debatesPracticed).toFixed(1);

  // Strongest skill — average each skill across all sessions, pick highest
  const skillTotals = {};
  const skillCounts = {};
  history.forEach((d) => {
    if (d.scores && typeof d.scores === 'object') {
      Object.entries(d.scores).forEach(([skill, val]) => {
        skillTotals[skill] = (skillTotals[skill] || 0) + val;
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
  };

  let strongestSkill = '—';
  let highestAvg = -1;
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
 * Returns:
 *  - history: array of debate session objects
 *  - stats: derived { debatesPracticed, averageScore, strongestSkill, currentStreak }
 *  - saveDebate(sessionData): appends a new session and persists
 *  - clearHistory(): wipes all stored history
 */
export function useDebateHistory() {
  const [history, setHistory] = useState(() => readHistory());

  // Keep in sync when another tab changes localStorage
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setHistory(readHistory());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveDebate = useCallback((sessionData) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      completedAt: new Date().toISOString(),
      ...sessionData,
    };
    setHistory((prev) => {
      const updated = [entry, ...prev];
      writeHistory(updated);
      return updated;
    });
    return entry.id;
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  const stats = deriveStats(history);

  return { history, stats, saveDebate, clearHistory };
}
