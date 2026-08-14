export const SUGGESTED_TOPICS = [
  'Should AI be allowed in schools?',
  'Should social media have age restrictions?',
  'Is space exploration worth the cost?',
  'Should homework be abolished?',
  'Should school uniforms be mandatory?',
  'Is remote work better than office work?',
  'Should voting be mandatory?',
  'Is nuclear energy a viable climate solution?',
];

export const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', description: 'Fundamental arguments, guided structure' },
  { value: 'intermediate', label: 'Intermediate', description: 'Deeper analysis, more pressure' },
  { value: 'advanced', label: 'Advanced', description: 'Expert-level challenges, nuanced critique' },
  { value: 'competition', label: 'Competition', description: 'Full competition intensity' },
];

export const DEBATE_TYPES = [
  { value: 'school', label: 'School Debate' },
  { value: 'mun', label: 'MUN' },
  { value: 'parliamentary', label: 'Parliamentary' },
  { value: 'casual', label: 'Casual Practice' },
];

export const TIME_LIMITS = [
  { value: 2, label: '2 minutes' },
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
];

export const MOCK_RECENT_DEBATES = [
  {
    id: 1,
    topic: 'Should AI be allowed in schools?',
    position: 'for',
    difficulty: 'intermediate',
    score: 8.2,
    date: '2 days ago',
    rounds: 5,
  },
  {
    id: 2,
    topic: 'Is space exploration worth the cost?',
    position: 'against',
    difficulty: 'advanced',
    score: 7.5,
    date: '5 days ago',
    rounds: 4,
  },
  {
    id: 3,
    topic: 'Should social media have age restrictions?',
    position: 'for',
    difficulty: 'beginner',
    score: 9.1,
    date: '1 week ago',
    rounds: 3,
  },
];

export const MOCK_STATS = {
  debatesPracticed: 3,
  averageScore: 8.3,
  strongestSkill: 'Clarity',
  currentStreak: 2,
};

export const SCORE_LABELS = {
  argumentQuality: 'Argument Quality',
  rebuttal: 'Rebuttal',
  logic: 'Logic',
  evidence: 'Evidence',
  clarity: 'Clarity',
  confidence: 'Confidence',
};
