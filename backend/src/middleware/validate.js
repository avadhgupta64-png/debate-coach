const VALID_POSITIONS = ['for', 'against'];
const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'competition'];
const VALID_DEBATE_TYPES = ['school', 'mun', 'parliamentary', 'casual'];

export const validateGenerate = (req, res, next) => {
  const { topic, position, difficulty, debateType } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length < 5) {
    return res.status(400).json({ error: true, message: 'Topic must be at least 5 characters.' });
  }
  if (topic.trim().length > 300) {
    return res.status(400).json({ error: true, message: 'Topic must be under 300 characters.' });
  }
  if (!position || !VALID_POSITIONS.includes(position.toLowerCase())) {
    return res.status(400).json({ error: true, message: `Position must be one of: ${VALID_POSITIONS.join(', ')}.` });
  }
  if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty.toLowerCase())) {
    return res.status(400).json({ error: true, message: `Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}.` });
  }
  if (!debateType || !VALID_DEBATE_TYPES.includes(debateType.toLowerCase())) {
    return res.status(400).json({ error: true, message: `Debate type must be one of: ${VALID_DEBATE_TYPES.join(', ')}.` });
  }

  req.body.topic = topic.trim();
  req.body.position = position.toLowerCase();
  req.body.difficulty = difficulty.toLowerCase();
  req.body.debateType = debateType.toLowerCase();
  next();
};

export const validateChallenge = (req, res, next) => {
  const { topic, position, round } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length < 5) {
    return res.status(400).json({ error: true, message: 'Topic is required.' });
  }
  if (!position || !VALID_POSITIONS.includes(position.toLowerCase())) {
    return res.status(400).json({ error: true, message: `Position must be one of: ${VALID_POSITIONS.join(', ')}.` });
  }
  if (round !== undefined && (typeof round !== 'number' || round < 1)) {
    return res.status(400).json({ error: true, message: 'Round must be a positive number.' });
  }

  req.body.topic = topic.trim();
  req.body.position = position.toLowerCase();
  next();
};

export const validateEvaluate = (req, res, next) => {
  const { topic, position, response } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length < 5) {
    return res.status(400).json({ error: true, message: 'Topic is required.' });
  }
  if (!position || !VALID_POSITIONS.includes(position.toLowerCase())) {
    return res.status(400).json({ error: true, message: `Position must be one of: ${VALID_POSITIONS.join(', ')}.` });
  }
  if (!response || typeof response !== 'string' || response.trim().length < 10) {
    return res.status(400).json({ error: true, message: 'Response must be at least 10 characters.' });
  }
  if (response.trim().length > 5000) {
    return res.status(400).json({ error: true, message: 'Response must be under 5000 characters.' });
  }

  req.body.topic = topic.trim();
  req.body.position = position.toLowerCase();
  req.body.response = response.trim();
  next();
};

export const validateRefine = (req, res, next) => {
  const { topic, position, argument } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length < 5) {
    return res.status(400).json({ error: true, message: 'Topic is required.' });
  }
  if (!position || !VALID_POSITIONS.includes(position.toLowerCase())) {
    return res.status(400).json({ error: true, message: `Position must be one of: ${VALID_POSITIONS.join(', ')}.` });
  }
  if (!argument || typeof argument !== 'string' || argument.trim().length < 20) {
    return res.status(400).json({ error: true, message: 'Argument must be at least 20 characters.' });
  }
  if (argument.trim().length > 3000) {
    return res.status(400).json({ error: true, message: 'Argument must be under 3000 characters.' });
  }

  req.body.topic = topic.trim();
  req.body.position = position.toLowerCase();
  req.body.argument = argument.trim();
  next();
};

export const validateHint = (req, res, next) => {
  const { topic, position, challenge, hintLevel } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length < 5) {
    return res.status(400).json({ error: true, message: 'Topic is required.' });
  }
  if (!position || !VALID_POSITIONS.includes(position.toLowerCase())) {
    return res.status(400).json({ error: true, message: `Position must be one of: ${VALID_POSITIONS.join(', ')}.` });
  }
  if (!challenge || typeof challenge !== 'string' || challenge.trim().length < 5) {
    return res.status(400).json({ error: true, message: 'Challenge is required.' });
  }
  if (hintLevel !== undefined && (typeof hintLevel !== 'number' || hintLevel < 1 || hintLevel > 3)) {
    return res.status(400).json({ error: true, message: 'Hint level must be 1, 2, or 3.' });
  }

  req.body.topic = topic.trim();
  req.body.position = position.toLowerCase();
  req.body.challenge = challenge.trim();
  req.body.hintLevel = hintLevel || 1;
  next();
};
