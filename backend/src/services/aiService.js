import OpenAI from 'openai';

const isConfigured = () => {
  return !!(process.env.AI_API_KEY && process.env.AI_API_KEY.trim());
};

let client = null;

const getClient = () => {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.AI_API_KEY || 'demo',
      baseURL: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
    });
  }
  return client;
};

const MODEL = () => process.env.AI_MODEL || 'gpt-4o-mini';

// ---------------------------------------------------------------------------
// DEMO MODE responses — returned when no AI key is configured
// ---------------------------------------------------------------------------

const DEMO_GENERATE = (topic, position, difficulty) => ({
  topic,
  position,
  difficulty,
  motionInterpretation: `This motion asks whether society should adopt a stance ${position === 'for' ? 'in favour of' : 'against'} "${topic}". At its core, it centres on questions of practicality, rights, and societal impact.`,
  keyDefinitions: [
    { term: 'Key stakeholders', definition: 'The individuals, institutions, and communities directly affected by this debate.' },
    { term: 'Status quo', definition: 'The current state of affairs against which this motion is evaluated.' },
  ],
  assumptions: [
    'That implementation is feasible within current institutional frameworks',
    'That the harms/benefits described are measurable and attributable',
  ],
  potentialWeaknesses: [
    'The evidence base may be contested by expert communities in this field',
    'This position may disproportionately benefit some groups over others',
  ],
  arguments: [
    { title: 'Economic Efficiency', explanation: `Supporting the ${position} side aligns with principles of economic efficiency and resource allocation.`, supporting: 'Studies in policy analysis consistently show structured approaches outperform ad hoc solutions.', strength: 'strong' },
    { title: 'Individual Autonomy', explanation: `From a rights perspective, the ${position} position respects personal agency and individual decision-making.`, supporting: 'Liberal democratic theory places individual liberty as a cornerstone of just governance.', strength: 'strong' },
    { title: 'Long-term Social Benefit', explanation: `Looking at long-term societal impact, the ${position} stance creates sustainable positive change.`, supporting: 'Cost-benefit analysis frameworks and intergenerational equity models support this view.', strength: 'moderate' },
  ],
  counterarguments: [
    { title: 'Implementation Costs', explanation: `The practical costs of implementing policies aligned with the ${position} position may be prohibitively high.`, strength: 'moderate' },
    { title: 'Unintended Consequences', explanation: `Well-intentioned policies sometimes produce unforeseen negative outcomes.`, strength: 'strong' },
    { title: 'Equity Concerns', explanation: `This position may disproportionately benefit already-privileged groups.`, strength: 'moderate' },
  ],
  rebuttals: [
    { against: 'Implementation Costs', rebuttal: 'A phased approach with targeted support addresses cost concerns directly. Long-term costs of inaction are far greater.' },
    { against: 'Unintended Consequences', rebuttal: 'Pilot programs and adaptive policy design substantially reduce this risk. Historical examples show iterative approaches succeed.' },
    { against: 'Equity Concerns', rebuttal: 'Equity provisions can be strengthened within the policy framework. This objection argues for reform, not rejection.' },
  ],
  evidence: [
    { title: 'Policy Precedent', content: `Similar frameworks adopted in multiple jurisdictions have documented positive outcomes.`, label: 'Example — verify before using', type: 'example' },
    { title: 'Expert Consensus', content: `Academic literature tends to support structured, evidence-based approaches in this domain.`, label: 'Example — verify before using', type: 'example' },
  ],
  openingGuidance: `Open by clearly defining your position on "${topic}". Establish the key terms, state your strongest argument first, and signal the overall structure of your case. Your opening should be confident and set the framing for the entire debate.`,
  closingGuidance: `Close by summarising your three strongest points, directly addressing the most powerful opposing argument, and ending with a clear, memorable statement of why your side should prevail. Do not introduce new arguments in closing.`,
  debateStrategy: `For this motion at ${difficulty} level: focus on concrete examples over abstract principles. Acknowledge the strongest opposing argument early and counter it — this builds credibility. If pushed on a weak point, concede the minor point and pivot to the bigger picture.`,
  mode: 'demo',
});

const DEMO_REFINE = (topic, argument) => ({
  strengths: [
    'The argument has a clear central claim that is easy to identify',
    'The logical flow is generally coherent',
  ],
  weaknesses: [
    'The argument relies on assertions without specific supporting evidence',
    'The final conclusion could be stated more forcefully',
  ],
  missingEvidence: [
    'A specific statistic or study to back the central claim',
    'A real-world example or case study',
  ],
  unsupportedAssumptions: [
    'It assumes the reader already accepts the premise without justification',
  ],
  logicalProblems: [
    'The argument moves from a general principle to a specific conclusion without bridging the gap',
  ],
  clarityIssues: [
    'The second sentence is ambiguous — it could be read in two ways',
  ],
  persuasivenessAssessment: 'Moderately persuasive. The core idea is sound, but without evidence it will not convince a sceptical audience.',
  structuralImprovements: [
    'Open with your strongest claim, not background context',
    'Use the PEEL structure: Point → Evidence → Explanation → Link back',
  ],
  refinementHints: [
    'Try adding a single concrete statistic to your opening claim',
    'Explicitly acknowledge and pre-empt the strongest counter to your argument',
    'Your final sentence should leave the reader with a memorable phrase, not a trailing thought',
  ],
  mode: 'demo',
});

const DEMO_CHALLENGE = (topic, position, round) => {
  const challenges = [
    `You argue ${position === 'for' ? 'in favour of' : 'against'} "${topic}". But your position ignores the real-world constraints that make implementation practically impossible for most institutions. How do you answer that?`,
    `Your previous point raised interesting ideas, but it relies on an assumption of good faith from all parties. History shows that good faith consistently breaks down in these situations. What is your response?`,
    `You've made a case based on general principles, but your opponents will cite specific recent failures of this approach. How do you address the gap between your theory and documented practice?`,
    `Even accepting your core argument, the evidence base you're implying is heavily contested. Leading researchers disagree significantly on the outcomes you're describing. How do you account for that uncertainty?`,
    `Your position benefits a particular group, but at documented cost to others. Can you defend those trade-offs without acknowledging that some communities will be materially worse off?`,
  ];
  const idx = Math.min((round || 1) - 1, challenges.length - 1);
  return { challenge: challenges[idx], round: (round || 1) + 1, mode: 'demo' };
};

const DEMO_HINT = (hintLevel) => {
  const hints = {
    1: {
      hint: 'Think about the underlying principle behind the challenge. What assumption is your opponent relying on? Challenge that assumption rather than defending your original claim directly.',
      hintLevel: 1,
      mode: 'demo',
    },
    2: {
      hint: 'Your opponent is attacking the practicality of your argument. Counter this by distinguishing between short-term difficulty and long-term benefit. Acknowledge the practical concern, then show why the long-run picture changes the calculation.',
      hintLevel: 2,
      mode: 'demo',
    },
    3: {
      hint: 'A strong response here would: (1) concede the narrow point your opponent raised, (2) show it is the exception not the rule, (3) redirect to the broader evidence that supports your position, (4) end with a clear statement of why your overall case still stands. Do not be defensive — go on the attack.',
      hintLevel: 3,
      mode: 'demo',
    },
  };
  return hints[hintLevel] || hints[1];
};

const DEMO_EVALUATE = (topic, position, response, round) => ({
  scores: {
    logic: 62,
    evidence: 45,
    rebuttal: 58,
    clarity: 72,
    persuasiveness: 60,
    structure: 65,
  },
  strengths: ['Clear and direct opening statement', 'Good use of logical progression', 'Confident, decisive tone'],
  weaknesses: ['Evidence and examples are missing', 'Rebuttal to the main counter was too brief', 'Consider pre-empting the strongest opposing argument'],
  feedback: 'Your response demonstrates solid foundational debating skills. You articulated your position clearly. To improve: lead with your most powerful argument, name the opposing argument explicitly before dismantling it, and ground your claims in specific evidence.',
  modelAnswer: `A strong response here would open by directly acknowledging the challenge, then pivot to the core claim: the long-term benefits outweigh the short-term costs. It would cite at least one concrete example, pre-empt the strongest counter-argument, and close with a clear statement of why the overall case still holds.`,
  keywords: ['empirical evidence', 'long-term impact', 'structural reform', 'stakeholder analysis', 'burden of proof'],
  nextChallenge: DEMO_CHALLENGE(topic, position, round + 1).challenge,
  detectedFallacies: [],
  mode: 'demo',
});

const DEMO_COMPLETE = (topic, position, rounds) => ({
  overallScore: 62,
  scores: { logic: 62, evidence: 45, rebuttal: 58, clarity: 72, persuasiveness: 60, structure: 65 },
  strengths: ['Consistent logical structure across all rounds', 'Strong clarity and readable arguments', 'Good composure under pressure'],
  weaknesses: ['Evidence and examples were underused throughout', 'Rebuttals could be more targeted', 'Argument structure could be more deliberate'],
  feedback: `Across ${rounds || 3} rounds on "${topic}", you demonstrated reliable baseline debating ability. Your clearest strength is communication clarity. The primary growth area is evidence deployment: strong debaters anchor claims in data and concrete examples, not just principle.`,
  coachNote: 'Practice the PEEL framework on your next debate: Point → Evidence → Explanation → Link back.',
  strongestMoment: 'Your opening framing of the core argument was the most convincing point of the debate.',
  weakestMoment: 'Round 2 rebuttal — you defended rather than attacked, giving ground unnecessarily.',
  bestArgument: 'The individual autonomy argument was your most coherent and well-structured point.',
  biggestMissedOpportunity: 'You never directly challenged your opponent\'s core assumption — that was their most vulnerable point.',
  recommendedNextSkill: 'Evidence integration: practice citing one specific real-world example per argument.',
  detectedFallacies: [],
  mode: 'demo',
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const parseJSON = (text) => {
  try {
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const chat = async (systemPrompt, userPrompt) => {
  const response = await getClient().chat.completions.create({
    model: MODEL(),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  });
  return response.choices[0].message.content;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const getMode = () => (isConfigured() ? 'ai' : 'demo');

// ─── 1. Generate Debate Preparation ─────────────────────────────────────────

export const generateDebate = async ({ topic, position, difficulty, debateType }) => {
  if (!isConfigured()) return DEMO_GENERATE(topic, position, difficulty);

  const system = `You are an expert debate coach and educator. Your goal is to help students LEARN to debate, not to give them a speech to memorise. Respond ONLY with valid JSON, no markdown, no explanation.`;

  const user = `Generate comprehensive debate preparation material. The goal is coaching, not ghost-writing.

Topic: "${topic}"
Position: ${position}
Difficulty: ${difficulty}
Debate Type: ${debateType}

Return this EXACT JSON structure:
{
  "topic": "${topic}",
  "position": "${position}",
  "motionInterpretation": "1-2 sentences explaining what this motion is really asking and the key tension at its heart",
  "keyDefinitions": [
    {"term": "important term", "definition": "how this term should be defined in this debate context"}
  ],
  "assumptions": ["assumption the ${position} side is making", "another assumption"],
  "potentialWeaknesses": ["vulnerability in the ${position} position that the opponent will likely attack", "another weakness"],
  "arguments": [
    {"title": "short title", "explanation": "substantive explanation 2-3 sentences", "supporting": "what evidence/reasoning supports this", "strength": "strong|moderate|weak"}
  ],
  "counterarguments": [
    {"title": "short title", "explanation": "what the OTHER side will argue, 2 sentences", "strength": "strong|moderate|weak"}
  ],
  "rebuttals": [
    {"against": "counterargument title", "rebuttal": "how to counter it specifically, 2 sentences"}
  ],
  "evidence": [
    {"title": "source or example type", "content": "the example or evidence point", "label": "Example — verify before using", "type": "example"}
  ],
  "openingGuidance": "2-3 sentences on how to open this specific debate effectively",
  "closingGuidance": "2-3 sentences on how to close this debate effectively",
  "debateStrategy": "3-4 sentences on the overall strategy for this topic at ${difficulty} level"
}

Rules:
- 3-5 arguments, 3 counterarguments, 3 rebuttals, 2-3 evidence items
- Calibrate to ${difficulty} difficulty — beginner gets clearer structure, competition gets nuanced strategy
- NEVER present invented statistics as verified facts
- Always label evidence as "Example — verify before using"
- This is a coaching document — teach the debater HOW to argue, not WHAT to say verbatim`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for debate generation');
  return { ...parsed, mode: 'ai' };
};

// ─── 2. Refine Argument ───────────────────────────────────────────────────────

export const refineArgument = async ({ topic, position, argument, difficulty }) => {
  if (!isConfigured()) return DEMO_REFINE(topic, argument);

  const system = `You are an expert debate coach. Analyse the student's argument and give specific, constructive coaching. Do NOT rewrite the argument for them — help them improve it themselves. Respond ONLY with valid JSON, no markdown.`;

  const user = `Analyse this debater's argument and provide coaching feedback.

Topic: "${topic}"
Position: ${position}
Difficulty: ${difficulty || 'intermediate'}
The debater's argument:
"${argument}"

Return this EXACT JSON:
{
  "strengths": ["specific strength 1", "specific strength 2"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "missingEvidence": ["what type of evidence is missing", "another gap"],
  "unsupportedAssumptions": ["assumption being made without justification"],
  "logicalProblems": ["specific logical issue if any, e.g. non-sequitur, circular reasoning"],
  "clarityIssues": ["specific phrasing or structural clarity problem"],
  "persuasivenessAssessment": "1-2 sentences on overall persuasiveness and why",
  "structuralImprovements": ["concrete structural change 1", "concrete structural change 2"],
  "refinementHints": [
    "specific actionable hint to make this argument stronger — question or prompt, NOT a rewrite",
    "another specific hint",
    "a third hint"
  ]
}

Rules:
- Be honest and specific — vague feedback is useless
- Reference actual phrases from the argument where possible
- Hints must be questions or prompts that help the debater think, NOT rewritten sentences
- Do NOT write the argument for them
- 2-4 items per array is ideal`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for argument refinement');
  return { ...parsed, mode: 'ai' };
};

// ─── 3. Generate Challenge ────────────────────────────────────────────────────

export const generateChallenge = async ({ topic, position, difficulty, round, previousResponse, conversationHistory }) => {
  if (!isConfigured()) return DEMO_CHALLENGE(topic, position, round);

  const system = `You are a skilled, challenging debate opponent — not a teacher, but a genuine adversary. Your job is to make the debater work hard. Respond ONLY with valid JSON, no markdown.`;

  const historyText = conversationHistory && conversationHistory.length > 0
    ? conversationHistory.map((h) => `${h.type === 'challenge' ? 'You (AI Opponent)' : 'Debater'} [Round ${h.round}]: ${h.text}`).join('\n')
    : null;

  const user = `Generate a debate challenge for round ${round}.

Topic: "${topic}"
Debater's Position: ${position} (you take the OPPOSITE position)
Difficulty: ${difficulty}
Round: ${round}
${historyText ? `\nFull conversation history:\n${historyText}\n` : ''}
Most recent debater response: "${previousResponse || 'Opening round — no previous response'}"

Return this EXACT JSON:
{
  "challenge": "Your challenge or argument (2-4 sentences max). At higher rounds, make it sharper.",
  "round": ${round + 1}
}

Rules:
- In round 1: present a strong opening argument from the opposing position. Do not ask a question — make a case.
- In rounds 2+: DIRECTLY react to what the debater said. Quote or reference their specific claim before attacking it.
- Find the weakest link in their argument and probe it relentlessly
- Ask a specific probing question OR make a sharp counter-claim — alternate between the two as appropriate
- NEVER hallucinate that the debater said something they did not say
- NEVER repeat an argument or challenge from earlier in the conversation
- Escalate pressure each round — by round 4-5 the debater should be under real pressure
- At 'beginner': be firm but fair. At 'competition': be forensic and relentless.`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for challenge');
  return { ...parsed, mode: 'ai' };
};

// ─── 4. Generate Hint ────────────────────────────────────────────────────────

export const generateHint = async ({ topic, position, challenge, conversationHistory, hintLevel }) => {
  if (!isConfigured()) return DEMO_HINT(hintLevel);

  const level = hintLevel || 1;
  const system = `You are a debate coach providing a progressive hint. Do NOT give the answer. Help the debater think. Respond ONLY with valid JSON, no markdown.`;

  const historyText = conversationHistory && conversationHistory.length > 0
    ? conversationHistory.slice(-4).map((h) => `${h.type === 'challenge' ? 'AI Opponent' : 'Debater'} [Round ${h.round}]: ${h.text}`).join('\n')
    : '';

  const levelInstructions = {
    1: 'Give a SUBTLE hint. Point to the strategic direction without naming the specific argument. Ask a question that helps them identify the right approach.',
    2: 'Give a MORE SPECIFIC hint. Identify the type of argument they should make (e.g. "think about the economic angle") and why, without writing the argument for them.',
    3: 'Give STRONG guidance. Outline the structure of a good response step by step (e.g. "Start by conceding X, then pivot to Y, close with Z"). Do NOT write the actual response — give them a clear roadmap.',
  };

  const user = `The debater is stuck and has asked for hint level ${level}/3.

Topic: "${topic}"
Debater's position: ${position}
Current challenge they need to respond to: "${challenge}"
${historyText ? `\nRecent debate context:\n${historyText}\n` : ''}

Hint level instruction: ${levelInstructions[level]}

Return this EXACT JSON:
{
  "hint": "Your hint text here (2-4 sentences at level ${level})",
  "hintLevel": ${level}
}`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for hint');
  return { ...parsed, mode: 'ai' };
};

// ─── 5. Evaluate Response ─────────────────────────────────────────────────────

export const evaluateResponse = async ({ topic, position, response, round, challenge, conversationHistory, hintsUsed }) => {
  if (!isConfigured()) return DEMO_EVALUATE(topic, position, response, round);

  const system = `You are an expert debate judge and coach. Evaluate fairly and honestly. Score on a 0-100 scale. Respond ONLY with valid JSON, no markdown.`;

  const historyText = conversationHistory && conversationHistory.length > 0
    ? conversationHistory.map((h) => `${h.type === 'challenge' ? 'AI Opponent' : 'Debater'} [Round ${h.round}]: ${h.text}`).join('\n')
    : null;

  const user = `Evaluate this debater's response and generate the next challenge.

Topic: "${topic}"
Debater's Position: ${position}
Challenge posed: "${challenge}"
Debater's response: "${response}"
Round: ${round}
Hints used this round: ${hintsUsed || 0}
${historyText ? `\nFull debate history:\n${historyText}\n` : ''}

Return this EXACT JSON:
{
  "scores": {
    "logic": <0-100>,
    "evidence": <0-100>,
    "rebuttal": <0-100>,
    "clarity": <0-100>,
    "persuasiveness": <0-100>,
    "structure": <0-100>
  },
  "strengths": ["specific strength referencing actual words used", "another strength"],
  "weaknesses": ["specific weakness referencing what was missing or wrong", "another weakness"],
  "feedback": "2-3 sentence coaching note on THIS specific response. Be concrete.",
  "modelAnswer": "A strong 3-4 sentence example response to this challenge. Write as the debater on the ${position} side. Show what good looks like.",
  "keywords": ["power phrase 1", "power phrase 2", "power phrase 3", "power phrase 4", "power phrase 5"],
  "nextChallenge": "Sharp follow-up challenge for round ${round + 1} that reacts to what the debater just said",
  "detectedFallacies": [
    {
      "fallacyName": "name of the fallacy",
      "statement": "the specific phrase or sentence from the response",
      "explanation": "why this may be a fallacy",
      "confidence": "definite|potential",
      "improvement": "how to make the reasoning stronger"
    }
  ]
}

Scoring guidelines (0-100):
- 0-39: Poor — serious problems with basic requirements
- 40-59: Below average — some merit but significant gaps
- 60-74: Satisfactory — meets basic standards with clear room for improvement
- 75-84: Good — solid performance with minor weaknesses
- 85-94: Very good — strong performance, minor refinements possible
- 95-100: Excellent — near-perfect execution

Rules:
- detectedFallacies may be empty [] if none are found
- Only flag genuine fallacies. If uncertain, use confidence: "potential"
- modelAnswer shows what excellence looks like — not what the debater said
- keywords: 4-6 power phrases a strong debater would use for this specific challenge
- If hints were used (${hintsUsed || 0} hints), factor this into feedback but do not penalise the score
- nextChallenge must NOT repeat any previous challenge`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for evaluation');
  return { ...parsed, mode: 'ai' };
};

// ─── 6. Complete Debate (Final Evaluation) ────────────────────────────────────

export const completeDebate = async ({ topic, position, rounds, responses, scores, conversationHistory, totalHintsUsed }) => {
  if (!isConfigured()) return DEMO_COMPLETE(topic, position, rounds);

  const system = `You are an expert debate coach giving a comprehensive final session evaluation. Be honest, specific, and constructive. Respond ONLY with valid JSON, no markdown.`;

  const avgScore = scores && scores.length > 0
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : '60';

  const historyText = conversationHistory && conversationHistory.length > 0
    ? conversationHistory.map((h) => `${h.type === 'challenge' ? 'AI Opponent' : 'Debater'} [Round ${h.round}]: ${h.text}`).join('\n\n')
    : responses ? responses.join('\n\n') : 'Multiple rounds completed';

  const user = `Generate a comprehensive final debate evaluation.

Topic: "${topic}"
Position: ${position}
Rounds completed: ${rounds}
Average round score: ${avgScore}/100
Hints used total: ${totalHintsUsed || 0}

Full debate transcript:
${historyText}

Return this EXACT JSON:
{
  "overallScore": <number 0-100 with one decimal>,
  "scores": {
    "logic": <0-100>,
    "evidence": <0-100>,
    "rebuttal": <0-100>,
    "clarity": <0-100>,
    "persuasiveness": <0-100>,
    "structure": <0-100>
  },
  "strengths": ["strength 1 with specific example from debate", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1 with specific example", "weakness 2", "weakness 3"],
  "feedback": "3-4 sentence comprehensive coaching feedback referencing the actual debate",
  "coachNote": "One motivational sentence to close",
  "strongestMoment": "The single best thing the debater did, with the specific round/argument",
  "weakestMoment": "The single biggest drop, with specific round/context",
  "bestArgument": "Which argument was most effective and why",
  "biggestMissedOpportunity": "What the debater could have said but didn't — be specific",
  "recommendedNextSkill": "The single most important skill to practise next, with a specific suggestion",
  "detectedFallacies": [
    {
      "fallacyName": "name",
      "statement": "exact quote from debate",
      "explanation": "why this is or may be a fallacy",
      "confidence": "definite|potential",
      "improvement": "how to fix the reasoning"
    }
  ]
}

Use the same 0-100 scoring scale as individual rounds.
detectedFallacies can be empty [] if none found across the full debate.
Only flag genuine fallacies. Err on the side of caution — use "potential" if uncertain.`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for completion');
  return { ...parsed, mode: 'ai' };
};
