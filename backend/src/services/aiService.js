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
  arguments: [
    {
      title: 'Economic Efficiency',
      explanation: `Supporting the ${position} side on "${topic}" aligns with principles of economic efficiency. When resources are allocated effectively, society as a whole benefits from improved outcomes and reduced waste.`,
      supporting: 'Studies in organizational theory consistently show that structured approaches outperform ad hoc solutions in measurable outcomes.',
      strength: 'strong',
    },
    {
      title: 'Individual Autonomy',
      explanation: `From an individual rights perspective, the ${position} position respects personal agency. People should have the freedom to make decisions that affect their own lives, provided those decisions do not harm others.`,
      supporting: 'Liberal democratic theory, from Locke to Mill, places individual liberty as a cornerstone of just governance.',
      strength: 'strong',
    },
    {
      title: 'Long-term Social Benefit',
      explanation: `Looking at long-term societal impact, supporting the ${position} stance on "${topic}" creates sustainable positive change. Short-term costs are outweighed by durable benefits to future generations.`,
      supporting: 'Policy analysis frameworks such as cost-benefit analysis and intergenerational equity models support this view.',
      strength: 'moderate',
    },
  ],
  counterarguments: [
    {
      title: 'Implementation Costs',
      explanation: `Critics argue that the practical costs of implementing policies aligned with the ${position} position are prohibitively high, particularly for under-resourced communities.`,
      strength: 'moderate',
    },
    {
      title: 'Unintended Consequences',
      explanation: `Historical precedent shows that well-intentioned policies sometimes produce unforeseen negative outcomes, and the ${position} stance on "${topic}" may be no different.`,
      strength: 'strong',
    },
    {
      title: 'Equity Concerns',
      explanation: `Opponents contend that the ${position} position disproportionately benefits already-privileged groups while leaving marginalized communities behind.`,
      strength: 'moderate',
    },
  ],
  rebuttals: [
    {
      against: 'Implementation Costs',
      rebuttal: `While implementation costs are real, framing them as prohibitive ignores the much higher long-term costs of inaction. A phased approach with targeted subsidies for under-resourced communities addresses this concern directly.`,
    },
    {
      against: 'Unintended Consequences',
      rebuttal: `The appeal to unintended consequences is a logical fallacy when used to reject all change. Robust pilot programs, evidence reviews, and adaptive policy design minimize this risk substantially.`,
    },
    {
      against: 'Equity Concerns',
      rebuttal: `This objection, while important, is better addressed by strengthening equity provisions within the policy rather than abandoning the position altogether. Equity and effectiveness are not mutually exclusive.`,
    },
  ],
  evidence: [
    {
      title: 'Policy Precedent',
      content: `Similar frameworks have been adopted in multiple jurisdictions with documented positive outcomes. Comparative policy analysis supports the ${position} position on "${topic}".`,
      label: 'Example — verify before using',
      type: 'example',
    },
    {
      title: 'Expert Consensus',
      content: `Academic literature in this domain tends to support structured, evidence-based approaches. While specific citations should be independently verified, the general scholarly consensus aligns with this position.`,
      label: 'Example — verify before using',
      type: 'example',
    },
    {
      title: 'Case Study',
      content: `Finland's education reforms demonstrate that systemic change aligned with this position can yield measurable improvements. Adapt this reference to your specific topic and verify current details before use.`,
      label: 'Example — verify before using',
      type: 'example',
    },
  ],
  mode: 'demo',
});

const DEMO_CHALLENGE = (topic, position, round, previousResponse) => {
  const challenges = [
    `You argue ${position === 'for' ? 'in favor of' : 'against'} "${topic}". But doesn't this position ignore the real-world constraints that make implementation practically impossible for most institutions?`,
    `Your previous point raised interesting ideas, but it relies on an assumption of good faith from all parties involved. What happens when that good faith breaks down — and historically, it often does?`,
    `You've made a case based on general principles, but your opponents will cite specific recent failures of this approach. How do you address the gap between theory and documented practice?`,
    `Even if we accept your core argument, the evidence base you're relying on is contested. Leading researchers in this field disagree significantly on the outcomes you're describing. How do you account for that uncertainty?`,
    `Your position benefits a particular group, but at what cost to others? Can you defend the trade-offs your stance requires without acknowledging that some communities will be worse off?`,
  ];
  const idx = Math.min((round || 1) - 1, challenges.length - 1);
  return {
    challenge: challenges[idx],
    round: (round || 1) + 1,
    mode: 'demo',
  };
};

const DEMO_EVALUATE = (topic, position, response, round) => ({
  scores: {
    argumentQuality: 7,
    rebuttal: 6,
    logic: 7,
    evidence: 5,
    clarity: 8,
    confidence: 7,
  },
  strengths: [
    'Clear and direct opening statement',
    'Good use of logical structure',
    'Confident tone throughout',
  ],
  weaknesses: [
    'Could use more concrete evidence or examples',
    'Rebuttal to the counterargument was brief — develop it further',
    'Consider anticipating the strongest opposing point proactively',
  ],
  feedback: `Your response demonstrates solid foundational debating skills. You articulated your position clearly and maintained a logical flow. To strengthen your performance: first, lead with your most powerful argument rather than building to it; second, when rebutting, name the opposing argument explicitly before dismantling it — this shows you've understood it fully; third, ground your claims in specific examples, even hypothetical ones, to give your argument tangible weight. Overall, a competent response that can be elevated with more deliberate evidence use.`,
  nextChallenge: DEMO_CHALLENGE(topic, position, round + 1, response).challenge,
  mode: 'demo',
});

const DEMO_COMPLETE = (topic, position, rounds) => ({
  overallScore: 7.2,
  scores: {
    argumentQuality: 7,
    rebuttal: 6,
    logic: 7,
    evidence: 5,
    clarity: 8,
    confidence: 7,
  },
  strengths: [
    'Consistent logical structure across all rounds',
    'Strong clarity — arguments were easy to follow',
    'Good composure under pressure',
  ],
  weaknesses: [
    'Evidence and examples were underused',
    'Rebuttals could be more pointed and specific',
    'Consider varying your sentence structure for rhetorical effect',
  ],
  feedback: `Across ${rounds || 3} rounds on "${topic}", you demonstrated a reliable baseline debating ability. Your clearest strength is communication clarity — your arguments were well-organized and readable. The primary area for growth is evidence deployment: strong debaters don't just argue from principle, they anchor claims in data, cases, or expert opinion. As a next step, practice structuring each argument as: Claim → Warrant → Evidence → Impact. This framework will immediately elevate the persuasiveness of your responses.`,
  coachNote: `Keep practicing. Debate skill is built through repetition. Run this debate again, switch sides, and notice how your thinking on this topic deepens.`,
  mode: 'demo',
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const parseJSON = (text) => {
  try {
    // strip markdown code fences if present
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

export const generateDebate = async ({ topic, position, difficulty, debateType }) => {
  if (!isConfigured()) return DEMO_GENERATE(topic, position, difficulty);

  const system = `You are an expert debate coach. Respond ONLY with valid JSON, no markdown, no explanation.`;
  const user = `Generate structured debate preparation material.
Topic: "${topic}"
Position: ${position}
Difficulty: ${difficulty}
Debate Type: ${debateType}

Return this exact JSON structure:
{
  "topic": "${topic}",
  "position": "${position}",
  "arguments": [
    {"title": "...", "explanation": "...", "supporting": "...", "strength": "strong|moderate|weak"}
  ],
  "counterarguments": [
    {"title": "...", "explanation": "...", "strength": "strong|moderate|weak"}
  ],
  "rebuttals": [
    {"against": "...", "rebuttal": "..."}
  ],
  "evidence": [
    {"title": "...", "content": "...", "label": "Example — verify before using", "type": "example"}
  ]
}

Rules:
- 3 arguments, 3 counterarguments, 3 rebuttals, 3 evidence items
- Arguments appropriate for ${difficulty} level
- NEVER present invented statistics as verified facts
- Always label evidence items as "Example — verify before using"
- Rebuttals must directly address the counterarguments listed`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for debate generation');
  return { ...parsed, mode: 'ai' };
};

export const generateChallenge = async ({ topic, position, difficulty, round, previousResponse, conversationHistory }) => {
  if (!isConfigured()) return DEMO_CHALLENGE(topic, position, round, previousResponse);

  const system = `You are a sharp, rigorous debate opponent. Respond ONLY with valid JSON, no markdown.`;

  // Build a readable conversation history string if provided
  const historyText = conversationHistory && conversationHistory.length > 0
    ? conversationHistory
        .map((h) => `${h.type === 'challenge' ? 'You (AI)' : 'Debater'} [Round ${h.round}]: ${h.text}`)
        .join('\n')
    : null;

  const user = `Generate a debate challenge for round ${round}.
Topic: "${topic}"
Debater's Position: ${position}
Difficulty: ${difficulty}
Round: ${round}

${historyText ? `Full conversation so far:\n${historyText}\n` : ''}
Most recent debater response: "${previousResponse || 'Opening round — no previous response'}"

Return this exact JSON:
{
  "challenge": "A single sharp, specific challenge question or statement (2-3 sentences max)",
  "round": ${round + 1}
}

Rules:
- Make the challenge appropriate for ${difficulty} level
- Directly react to what the debater actually said in their most recent response
- If they made a specific claim, probe it — don't ask a generic question
- Build pressure progressively across rounds — each challenge should be harder to dodge than the last
- Never repeat a challenge you already made in this conversation`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for challenge');
  return { ...parsed, mode: 'ai' };
};


export const evaluateResponse = async ({ topic, position, response, round, challenge, conversationHistory }) => {
  if (!isConfigured()) return DEMO_EVALUATE(topic, position, response, round);

  const system = `You are an expert debate coach and judge. Respond ONLY with valid JSON, no markdown.`;

  const historyText = conversationHistory && conversationHistory.length > 0
    ? conversationHistory
        .map((h) => `${h.type === 'challenge' ? 'AI Opponent' : 'Debater'} [Round ${h.round}]: ${h.text}`)
        .join('\n')
    : null;

  const user = `Evaluate this debate response and generate the next challenge.
Topic: "${topic}"
Position: ${position}
Challenge given: "${challenge}"
Debater's response: "${response}"
Round: ${round}
${historyText ? `\nFull debate history so far:\n${historyText}\n` : ''}
Return this exact JSON:
{
  "scores": {
    "argumentQuality": <1-10>,
    "rebuttal": <1-10>,
    "logic": <1-10>,
    "evidence": <1-10>,
    "clarity": <1-10>,
    "confidence": <1-10>
  },
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "feedback": "2-3 sentence specific coaching note on THIS response",
  "modelAnswer": "A strong 3-4 sentence model answer to the challenge that the debater should study. Write it as if you are the debater arguing the ${position} side.",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "nextChallenge": "A sharp follow-up challenge for round ${round + 1} that directly reacts to what the debater just argued — probe a specific weakness or assumption in their response"
}

Rules:
- Be honest, specific, and constructive. Scores should reflect actual quality.
- modelAnswer: show what an ideal response to this exact challenge looks like — clear structure, strong logic, good evidence use.
- keywords: 4-6 power words or phrases a strong debater would use when answering this challenge (e.g. "empirical evidence", "false equivalence", "systemic impact").
- The nextChallenge must NOT repeat any previous challenge.
- The nextChallenge must feel like a natural continuation of the debate — build on what was said.`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for evaluation');
  return { ...parsed, mode: 'ai' };
};

export const completeDebate = async ({ topic, position, rounds, responses, scores }) => {
  if (!isConfigured()) return DEMO_COMPLETE(topic, position, rounds);

  const system = `You are an expert debate coach giving a final session evaluation. Respond ONLY with valid JSON, no markdown.`;
  const avgScore = scores && scores.length > 0
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : '6.5';

  const user = `Give a final debate session evaluation.
Topic: "${topic}"
Position: ${position}
Rounds completed: ${rounds}
Average score so far: ${avgScore}
Responses summary: ${responses ? responses.slice(-2).join(' | ') : 'Multiple rounds completed'}

Return this exact JSON:
{
  "overallScore": <number 1-10 with one decimal>,
  "scores": {
    "argumentQuality": <1-10>,
    "rebuttal": <1-10>,
    "logic": <1-10>,
    "evidence": <1-10>,
    "clarity": <1-10>,
    "confidence": <1-10>
  },
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "feedback": "3-4 sentence comprehensive coaching feedback",
  "coachNote": "One sentence motivational close"
}`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for completion');
  return { ...parsed, mode: 'ai' };
};
