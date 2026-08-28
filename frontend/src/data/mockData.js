export const SUGGESTED_TOPICS = [
  // Technology & Society
  'Should AI be allowed in schools?',
  'Should social media platforms be held legally responsible for misinformation?',
  'Should governments regulate the use of AI in hiring decisions?',
  'Is technology making us more isolated?',
  // Environment & Science
  'Is space exploration worth the cost?',
  'Is nuclear energy a viable climate solution?',
  'Should wealthy nations pay reparations for climate change?',
  'Should eating meat be taxed to fight climate change?',
  // Education & Youth
  'Should homework be abolished?',
  'Should school uniforms be mandatory?',
  'Should university education be free?',
  'Should smartphones be banned in schools?',
  // Politics & Society
  'Should voting be mandatory?',
  'Should the voting age be lowered to 16?',
  'Should social media have age restrictions?',
  'Is civil disobedience ever justified?',
  // Work & Economy
  'Is remote work better than office work?',
  'Should a four-day work week become the global standard?',
  'Should billionaires exist?',
  // Ethics & Philosophy
  'Should animals have the same rights as humans?',
  'Is privacy more important than security?',
  'Should gene editing in humans be allowed?',
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
  // New 0-100 scale categories
  logic: 'Logic',
  evidence: 'Evidence',
  rebuttal: 'Rebuttal',
  clarity: 'Clarity',
  persuasiveness: 'Persuasiveness',
  structure: 'Structure',
  // Legacy 0-10 categories (kept for backward compat with old history entries)
  argumentQuality: 'Argument Quality',
  confidence: 'Confidence',
};
