/**
 * useDebateProfile
 * ─────────────────────────────────────────────────────────────────────────────
 * Analyses a user's debate history and derives their personal performance
 * profile: skill averages, trends, strengths, weaknesses, and a coach
 * recommendation.
 *
 * Rules:
 *  - 0 debates        → status 'empty'
 *  - 1-2 debates      → status 'insufficient'  (show "keep practicing")
 *  - 3+ debates       → status 'ready'          (show full profile)
 *
 * All scores are normalised to 0-10 internally. Legacy 0-100 values are
 * divided by 10 before any computation so displayed values never exceed 10.
 */

import { useMemo } from 'react';
import { useDebateHistory } from './useDebateHistory.js';
import { useAuth } from '../contexts/AuthContext.jsx';

// Skills in the order we want to display them.
// Maps internal key → display label.
export const PROFILE_SKILLS = {
  logic: 'Logic',
  structure: 'Argument Structure',
  evidence: 'Evidence',
  rebuttal: 'Rebuttal',
  persuasiveness: 'Persuasiveness',
  clarity: 'Clarity',
  // Legacy keys kept for backward compatibility
  argumentQuality: 'Argument Quality',
  confidence: 'Confidence',
};

// Minimum number of debates before we show a full profile.
const MIN_DEBATES_FOR_PROFILE = 3;

/**
 * Normalise a raw score value to 0-10.
 * Handles: number on 0-100 scale, number on 0-10 scale, null/undefined.
 */
function normalise(val) {
  if (typeof val !== 'number' || isNaN(val)) return null;
  return val > 10 ? val / 10 : val;
}

/**
 * Given an array of debate history entries, compute per-skill averages.
 * Returns { [skillKey]: { avg: number, count: number } }
 */
function computeSkillAverages(history) {
  const totals = {};   // { skillKey: number }
  const counts = {};   // { skillKey: number }

  history.forEach((debate) => {
    if (!debate.scores || typeof debate.scores !== 'object') return;
    Object.entries(debate.scores).forEach(([key, rawVal]) => {
      const val = normalise(rawVal);
      if (val === null) return;
      totals[key] = (totals[key] || 0) + val;
      counts[key] = (counts[key] || 0) + 1;
    });
  });

  const result = {};
  Object.keys(totals).forEach((key) => {
    result[key] = {
      avg: +(totals[key] / counts[key]).toFixed(2),
      count: counts[key],
      label: PROFILE_SKILLS[key] || key,
    };
  });
  return result;
}

/**
 * Detect trends by comparing the first half of recent debates vs the second half.
 * "Recent" = the most recent 6 debates (or all if fewer).
 * Returns { [skillKey]: { direction: 'up'|'down'|'stable', pct: number } }
 */
function computeSkillTrends(history) {
  // Work with most recent N debates in chronological order (oldest first)
  const recent = history.slice(0, Math.min(6, history.length)).slice().reverse();
  if (recent.length < 2) return {};

  const mid = Math.ceil(recent.length / 2);
  const older = recent.slice(0, mid);
  const newer = recent.slice(mid);

  function avgSkill(subset, key) {
    const vals = subset
      .map((d) => normalise(d.scores?.[key]))
      .filter((v) => v !== null);
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  // Collect all skill keys from newer half
  const skillKeys = new Set();
  newer.forEach((d) => {
    if (d.scores) Object.keys(d.scores).forEach((k) => skillKeys.add(k));
  });

  const trends = {};
  skillKeys.forEach((key) => {
    const oldAvg = avgSkill(older, key);
    const newAvg = avgSkill(newer, key);
    if (oldAvg === null || newAvg === null || oldAvg === 0) return;
    const delta = newAvg - oldAvg;
    const pct = Math.round((delta / oldAvg) * 100);
    trends[key] = {
      direction: Math.abs(pct) < 5 ? 'stable' : pct > 0 ? 'up' : 'down',
      pct: Math.abs(pct),
      delta: +delta.toFixed(2),
    };
  });
  return trends;
}

/**
 * Build a coach recommendation based on the user's weakest skill and
 * strongest skill.
 */
function buildCoachRecommendation({ weakestKey, weakestLabel, weakestAvg, strongestLabel, strongestAvg, debateCount }) {
  if (debateCount < MIN_DEBATES_FOR_PROFILE) {
    return "Complete a few more debates and I'll identify your personal strengths and weaknesses.";
  }

  const weakPhrases = {
    rebuttal: `Your arguments are often solid, but your rebuttals need work. Your next sessions should focus on directly addressing your opponent's strongest claim rather than restating your own position.`,
    evidence: `You reason well, but your arguments lack supporting evidence. Practice citing facts, statistics, and examples to make your case undeniable.`,
    logic: `Some of your arguments have logical gaps. Focus on identifying hidden assumptions and ensuring each claim follows logically from the previous one.`,
    structure: `Your ideas are often good, but they lose impact due to weak structure. Practice opening with a clear thesis, supporting it systematically, and closing with a decisive summary.`,
    persuasiveness: `Your arguments are technically sound but could be more compelling. Work on adapting your tone, building momentum, and landing your key point with conviction.`,
    clarity: `Your arguments can be difficult to follow. Practice expressing each idea in one clear sentence before expanding on it.`,
    argumentQuality: `The substance of your arguments needs strengthening. Focus on making each claim specific, defensible, and directly relevant to the topic.`,
    confidence: `You have the ideas — now you need to own them. Practice committing fully to your position without hedging.`,
  };

  const weakPhrase = weakPhrases[weakestKey]
    || `Your ${weakestLabel.toLowerCase()} (${weakestAvg}/10) is the area most holding you back. Target it directly in your next few sessions.`;

  return `Your ${strongestLabel.toLowerCase()} is your strongest weapon (${strongestAvg}/10). ${weakPhrase}`;
}

/**
 * Build a targeted debate topic/config for the user's weakest skill.
 * Returns { topic, focusNote } to be merged into a debate config.
 */
export function buildWeaknessChallenge(weakestKey) {
  const challenges = {
    rebuttal: {
      topic: "Artificial intelligence will replace most human jobs within 20 years",
      position: 'against',
      focusNote: "Your challenge: directly counter the opposition's strongest claims. Do not just repeat your position — attack their reasoning.",
      difficulty: 'intermediate',
    },
    evidence: {
      topic: "Governments should ban single-use plastics immediately",
      position: 'for',
      focusNote: "Your challenge: every argument you make must be backed by a specific fact, statistic, or real-world example.",
      difficulty: 'intermediate',
    },
    logic: {
      topic: "Social media does more harm than good to society",
      position: 'against',
      focusNote: "Your challenge: identify the hidden assumptions in the opposition's arguments and construct a logically consistent case step by step.",
      difficulty: 'intermediate',
    },
    structure: {
      topic: "Universal basic income should be implemented in all developed countries",
      position: 'for',
      focusNote: "Your challenge: open each response with a clear one-sentence thesis, support it with two structured points, and close with a decisive summary.",
      difficulty: 'intermediate',
    },
    persuasiveness: {
      topic: "Space exploration is worth the cost",
      position: 'for',
      focusNote: "Your challenge: focus on making your arguments emotionally resonant and persuasive, not just factually correct.",
      difficulty: 'intermediate',
    },
    clarity: {
      topic: "Homework should be abolished in schools",
      position: 'against',
      focusNote: "Your challenge: express each idea in one clear sentence before expanding. Avoid jargon. Make every point immediately understandable.",
      difficulty: 'beginner',
    },
    argumentQuality: {
      topic: "Nuclear energy is essential for solving climate change",
      position: 'for',
      focusNote: "Your challenge: build specific, defensible arguments directly tied to the topic. Avoid vague claims.",
      difficulty: 'intermediate',
    },
    confidence: {
      topic: "Voting should be mandatory for all eligible citizens",
      position: 'for',
      focusNote: "Your challenge: commit fully to your position. Do not hedge. Deliver every argument as if you are certain of it.",
      difficulty: 'intermediate',
    },
  };

  return challenges[weakestKey] || {
    topic: "Technology has done more good than harm for humanity",
    position: 'for',
    focusNote: "Your challenge: build a complete, well-structured argument that demonstrates all your debate skills.",
    difficulty: 'intermediate',
  };
}

/**
 * Main hook: derives the user's debate profile from their history.
 *
 * Returns:
 * {
 *   status:              'empty' | 'insufficient' | 'ready'
 *   debateCount:         number
 *   averageScore:        number | null
 *   skillAverages:       { [key]: { avg, count, label } }
 *   skillTrends:         { [key]: { direction, pct, delta } }
 *   strongestKey:        string | null
 *   strongestLabel:      string | null
 *   strongestAvg:        number | null
 *   weakestKey:          string | null
 *   weakestLabel:        string | null
 *   weakestAvg:          number | null
 *   improvingSkills:     Array<{ key, label, pct }>
 *   decliningSkills:     Array<{ key, label, pct }>
 *   coachRecommendation: string
 *   recentTrend:         'up' | 'down' | 'stable' | null
 *   history:             raw history array
 * }
 */
export function useDebateProfile() {
  const { currentUser } = useAuth();
  const { history } = useDebateHistory(currentUser?.uid);

  return useMemo(() => {
    const debateCount = history.length;

    if (debateCount === 0) {
      return {
        status: 'empty',
        debateCount: 0,
        averageScore: null,
        skillAverages: {},
        skillTrends: {},
        strongestKey: null,
        strongestLabel: null,
        strongestAvg: null,
        weakestKey: null,
        weakestLabel: null,
        weakestAvg: null,
        improvingSkills: [],
        decliningSkills: [],
        coachRecommendation: "Complete your first debate to start building your Debate Profile.",
        recentTrend: null,
        history,
      };
    }

    if (debateCount < MIN_DEBATES_FOR_PROFILE) {
      // Still compute what we can for 1-2 debates, but mark as insufficient
      const skillAverages = computeSkillAverages(history);
      const avgScore = history.reduce((sum, d) => {
        const s = normalise(d.overallScore) ?? 0;
        return sum + s;
      }, 0) / debateCount;

      return {
        status: 'insufficient',
        debateCount,
        averageScore: +avgScore.toFixed(1),
        skillAverages,
        skillTrends: {},
        strongestKey: null,
        strongestLabel: null,
        strongestAvg: null,
        weakestKey: null,
        weakestLabel: null,
        weakestAvg: null,
        improvingSkills: [],
        decliningSkills: [],
        coachRecommendation: "Complete a few more debates and I'll start identifying reliable patterns.",
        recentTrend: null,
        history,
      };
    }

    // ── Full profile (3+ debates) ──────────────────────────────────────────

    const skillAverages = computeSkillAverages(history);
    const skillTrends = computeSkillTrends(history);

    // Overall average
    const avgScore = history.reduce((sum, d) => {
      const s = normalise(d.overallScore) ?? 0;
      return sum + s;
    }, 0) / debateCount;

    // Find strongest / weakest (only consider skills with ≥ 2 data points for
    // reliability, but fall back to any skill if nothing qualifies)
    const qualifiedSkills = Object.entries(skillAverages)
      .filter(([, v]) => v.count >= 2);
    const allSkills = Object.entries(skillAverages);
    const candidates = qualifiedSkills.length >= 2 ? qualifiedSkills : allSkills;

    let strongestKey = null, strongestAvg = -1;
    let weakestKey = null, weakestAvg = Infinity;

    candidates.forEach(([key, { avg }]) => {
      if (avg > strongestAvg) { strongestAvg = avg; strongestKey = key; }
      if (avg < weakestAvg) { weakestAvg = avg; weakestKey = key; }
    });

    // Make sure strongest ≠ weakest (possible if only one skill recorded)
    if (strongestKey === weakestKey && candidates.length > 1) {
      // Pick second-lowest as weakest
      const sorted = [...candidates].sort((a, b) => a[1].avg - b[1].avg);
      weakestKey = sorted[0][0];
      strongestKey = sorted[sorted.length - 1][0];
    }

    const strongestLabel = strongestKey ? (skillAverages[strongestKey]?.label || PROFILE_SKILLS[strongestKey] || strongestKey) : null;
    const strongestAvgDisplay = strongestKey ? +strongestAvg.toFixed(1) : null;
    const weakestLabel = weakestKey ? (skillAverages[weakestKey]?.label || PROFILE_SKILLS[weakestKey] || weakestKey) : null;
    const weakestAvgDisplay = weakestKey ? +weakestAvg.toFixed(1) : null;

    // Categorise improving / declining skills
    const improvingSkills = [];
    const decliningSkills = [];
    Object.entries(skillTrends).forEach(([key, trend]) => {
      const label = skillAverages[key]?.label || PROFILE_SKILLS[key] || key;
      if (trend.direction === 'up') {
        improvingSkills.push({ key, label, pct: trend.pct, delta: trend.delta });
      } else if (trend.direction === 'down') {
        decliningSkills.push({ key, label, pct: trend.pct, delta: trend.delta });
      }
    });

    // Overall recent trend: compare last debate's score to overall average
    let recentTrend = null;
    if (history.length >= 2) {
      const latestScore = normalise(history[0]?.overallScore);
      const prevScore = normalise(history[1]?.overallScore);
      if (latestScore !== null && prevScore !== null) {
        const delta = latestScore - prevScore;
        recentTrend = Math.abs(delta) < 0.3 ? 'stable' : delta > 0 ? 'up' : 'down';
      }
    }

    const coachRecommendation = buildCoachRecommendation({
      weakestKey,
      weakestLabel,
      weakestAvg: weakestAvgDisplay,
      strongestLabel,
      strongestAvg: strongestAvgDisplay,
      debateCount,
    });

    return {
      status: 'ready',
      debateCount,
      averageScore: +avgScore.toFixed(1),
      skillAverages,
      skillTrends,
      strongestKey,
      strongestLabel,
      strongestAvg: strongestAvgDisplay,
      weakestKey,
      weakestLabel,
      weakestAvg: weakestAvgDisplay,
      improvingSkills,
      decliningSkills,
      coachRecommendation,
      recentTrend,
      history,
    };
  }, [history]);
}
