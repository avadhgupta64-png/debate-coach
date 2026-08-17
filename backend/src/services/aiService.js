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
// Randomisation helpers — ensure each session feels different
// ---------------------------------------------------------------------------

const ARGUMENT_ANGLES = [
  'economic and financial impact',
  'individual rights and personal freedoms',
  'social equity and justice',
  'environmental and long-term sustainability',
  'technological innovation and progress',
  'public health and wellbeing',
  'international relations and geopolitics',
  'cultural identity and social cohesion',
  'education and generational impact',
  'ethical and philosophical principles',
];

const ARGUMENT_FRAMEWORKS = [
  'utilitarian cost-benefit analysis (greatest good for greatest number)',
  'rights-based deontological framing (duties, rights, moral constraints)',
  'virtue ethics and character-based reasoning',
  'social contract theory and collective obligation',
  'pragmatic incrementalism (what actually works in practice)',
  'structural-systemic analysis (root causes and institutional forces)',
  'comparative policy analysis (what other jurisdictions have done)',
  'intergenerational equity and long-run consequences',
  'intersectionality and differential impact across social groups',
  'precautionary principle and management of uncertainty',
];

const STAKEHOLDER_LENSES = [
  'frontline workers and labour market participants',
  'children and future generations',
  'small business owners and entrepreneurs',
  'marginalised and low-income communities',
  'governments and public institutions',
  'civil society organisations and NGOs',
  'global south nations and developing economies',
  'consumers and ordinary citizens',
  'researchers and academic experts',
  'minority and indigenous communities',
];

const CAUSAL_CHAINS = [
  'immediate direct effects → second-order ripple effects → long-run equilibrium',
  'incentive structures → behavioural responses → aggregate outcomes',
  'historical precedent → pattern recognition → likely trajectory',
  'institutional constraints → implementation gaps → real-world vs theoretical outcomes',
  'power dynamics → distributional effects → winners and losers',
];

const CHALLENGE_STYLES = [
  'Use pointed rhetorical questions to put the debater on the back foot.',
  'Lead with a sharp counter-statistic or empirical challenge.',
  'Attack the debater\'s underlying assumption before engaging with their conclusion.',
  'Introduce a real-world counterexample that contradicts their argument.',
  'Challenge the debater to define a key term they are implicitly relying on.',
  'Expose an internal contradiction in the debater\'s position.',
  'Argue from a stakeholder perspective that the debater has ignored.',
  'Press on the practical implementation gap between theory and reality.',
];

const EVIDENCE_EMPHASIS = [
  'Emphasise historical case studies and precedents.',
  'Focus on quantitative data and statistical comparisons.',
  'Ground examples in recent (last 5 years) policy or news events.',
  'Draw examples from multiple countries or regions for contrast.',
  'Use philosophical frameworks and ethical theory as evidence.',
  'Anchor evidence in peer-reviewed academic research.',
];

/** Picks a random element from an array */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/** Produces a variant descriptor injected into AI prompts */
const sessionVariant = () => ({
  angle: pick(ARGUMENT_ANGLES),
  framework: pick(ARGUMENT_FRAMEWORKS),
  stakeholderLens: pick(STAKEHOLDER_LENSES),
  causalChain: pick(CAUSAL_CHAINS),
  challengeStyle: pick(CHALLENGE_STYLES),
  evidenceEmphasis: pick(EVIDENCE_EMPHASIS),
  nonce: `${Date.now()}-${Math.floor(Math.random() * 1e9)}`,
});

// ---------------------------------------------------------------------------
// DEMO MODE responses — returned when no AI key is configured
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Demo mode argument pools — multiple variants to avoid identical responses
// ---------------------------------------------------------------------------

const DEMO_ARGUMENT_SETS = [
  // Variant A: Economic & structural framing
  (position) => ({
    arguments: [
      { title: 'Economic Efficiency', explanation: `The ${position} position aligns with principles of resource allocation and productive efficiency. Markets and institutions function better when incentives are correctly aligned with outcomes.`, supporting: 'Policy economics research consistently shows structured, evidence-based interventions outperform ad hoc approaches in cost-effectiveness over time.', strength: 'strong' },
      { title: 'Systemic Institutional Change', explanation: `Addressing this issue requires structural reform, not piecemeal fixes. The ${position} stance enables the kind of deep institutional change that produces durable improvements.`, supporting: 'Comparative studies across OECD nations show nations that took bold structural positions in analogous debates achieved better long-term outcomes.', strength: 'strong' },
      { title: 'Long-term Cost Savings', explanation: `Short-term investment in the ${position} direction prevents far greater future costs. The compounding effect of early action is well-documented in analogous policy domains.`, supporting: 'Intergenerational cost modelling regularly shows upfront reform costs are dwarfed by the avoided costs of continued inaction.', strength: 'moderate' },
    ],
    counterarguments: [
      { title: 'Implementation Costs', explanation: `The practical costs of implementing policies aligned with the ${position} position may be prohibitively high, especially for smaller institutions and developing economies.`, strength: 'moderate' },
      { title: 'Market Distortion Risk', explanation: `Intervention in this domain risks creating market distortions that produce inefficiencies greater than the problem being solved.`, strength: 'strong' },
      { title: 'Regulatory Capture', explanation: `Once new regulatory frameworks are created, they tend to be captured by the most powerful stakeholders, producing outcomes opposite to the stated intent.`, strength: 'moderate' },
    ],
    rebuttals: [
      { against: 'Implementation Costs', rebuttal: 'A phased approach with targeted institutional support directly addresses this concern. The long-run costs of inaction consistently exceed upfront transition costs in comparable domains.' },
      { against: 'Market Distortion Risk', rebuttal: 'Well-designed policy incorporates market mechanisms rather than overriding them. The empirical record of carefully designed interventions shows distortion fears are often overstated.' },
      { against: 'Regulatory Capture', rebuttal: 'Transparency requirements, sunset clauses, and independent oversight boards are proven tools to prevent capture. This objection argues for better governance, not for inaction.' },
    ],
    evidence: [
      { title: 'OECD Policy Comparison', content: 'Nations that adopted analogous structural positions show measurably better outcomes across key indicators compared to those that did not.', label: 'Example — verify before using', type: 'example' },
      { title: 'Cost-Benefit Analysis Research', content: 'Academic literature on comparable policy interventions consistently finds positive net present value when long-term benefits are properly discounted.', label: 'Example — verify before using', type: 'example' },
    ],
  }),
  // Variant B: Rights & justice framing
  (position) => ({
    arguments: [
      { title: 'Individual Rights and Autonomy', explanation: `The ${position} position is grounded in a fundamental respect for individual agency. People have the right to make choices that affect their own lives, and this motion engages directly with where that line should be drawn.`, supporting: 'Liberal political philosophy from Locke through Rawls consistently affirms that restricting autonomy requires a strong justification — the burden is on those who would limit freedom.', strength: 'strong' },
      { title: 'Distributive Justice', explanation: `The current status quo creates systematic advantages for already-privileged groups. The ${position} stance corrects a structural injustice that compounds over generations.`, supporting: 'Rawlsian difference principle: a just arrangement must benefit the least advantaged members of society. The ${position} position passes this test; the opposing position does not.', strength: 'strong' },
      { title: 'Democratic Legitimacy', explanation: `The ${position} position reflects what citizens in comparable democracies have chosen when given a clear mandate. This is not a technocratic imposition — it represents democratic will expressed over time.`, supporting: 'Survey data and electoral outcomes across multiple democracies consistently show majority support for positions analogous to this one.', strength: 'moderate' },
    ],
    counterarguments: [
      { title: 'Competing Rights Claims', explanation: `The rights claimed on the ${position} side come into direct conflict with equally legitimate rights on the opposing side. The motion presents a false binary that ignores this tension.`, strength: 'strong' },
      { title: 'Tyranny of the Majority', explanation: `Democratic majorities have historically endorsed positions that violated minority rights. Popularity does not equal justice, and this motion may be an example of that pattern.`, strength: 'moderate' },
      { title: 'Unintended Discrimination', explanation: `Policies designed with the best intentions often produce discriminatory outcomes in practice due to enforcement asymmetries and institutional biases.`, strength: 'moderate' },
    ],
    rebuttals: [
      { against: 'Competing Rights Claims', rebuttal: 'Not all rights claims are equal — the harm principle allows us to rank competing claims by the magnitude and directness of impact. On that basis, the ${position} position is clearly superior.' },
      { against: 'Tyranny of the Majority', rebuttal: 'This motion includes explicit protections for minority positions. The objection describes a risk that the policy design specifically guards against.' },
      { against: 'Unintended Discrimination', rebuttal: 'Equity audits, community consultation, and iterative policy review are standard tools to detect and correct discriminatory application. This risk is manageable, not a reason to reject the motion.' },
    ],
    evidence: [
      { title: 'Rights Jurisprudence', content: 'Constitutional courts in comparable jurisdictions have consistently held that positions analogous to this one are compatible with fundamental rights frameworks.', label: 'Example — verify before using', type: 'example' },
      { title: 'Social Mobility Research', content: 'Longitudinal studies show societies that adopt the ${position} stance exhibit greater social mobility and lower inequality over generational timescales.', label: 'Example — verify before using', type: 'example' },
    ],
  }),
  // Variant C: Public health, environment & long-run sustainability framing
  (position) => ({
    arguments: [
      { title: 'Public Health and Wellbeing', explanation: `The ${position} position produces measurable improvements in population health and wellbeing outcomes. This is not an abstract claim — it is supported by outcome data from comparable interventions.`, supporting: 'Public health meta-analyses consistently find that proactive, preventive approaches in analogous domains outperform reactive strategies by a factor of 3-5 in cost-effectiveness.', strength: 'strong' },
      { title: 'Environmental Sustainability', explanation: `The long-run sustainability of current practices depends on choices made today. The ${position} stance is the only approach that is compatible with long-term environmental stability.`, supporting: 'IPCC modelling and environmental economics research both support early, decisive action over delayed adjustment — the costs of waiting grow non-linearly.', strength: 'strong' },
      { title: 'Intergenerational Responsibility', explanation: `Decisions made today will constrain the choices available to future generations. The ${position} position takes this responsibility seriously; the opposing side discounts the future at an ethically unjustifiable rate.`, supporting: 'Stern Review and follow-up environmental economics scholarship establish that a near-zero social discount rate is the ethically appropriate standard for intergenerational decisions.', strength: 'moderate' },
    ],
    counterarguments: [
      { title: 'Economic Disruption', explanation: `Moving in the ${position} direction imposes significant transition costs on workers, industries, and communities that depend on the current model. These human costs should not be dismissed.`, strength: 'strong' },
      { title: 'Technological Uncertainty', explanation: `The ${position} position assumes technological solutions that do not yet exist at scale. Betting on speculative technology is not a sound policy basis.`, strength: 'moderate' },
      { title: 'Displacement Not Reduction', explanation: `Action in one jurisdiction simply displaces the activity to others without reducing the underlying harm — a phenomenon well-documented in trade and environmental economics.`, strength: 'moderate' },
    ],
    rebuttals: [
      { against: 'Economic Disruption', rebuttal: 'Transition support, retraining programmes, and just transition funds are proven tools to manage disruption. Delay does not eliminate these costs — it concentrates them on the most vulnerable.' },
      { against: 'Technological Uncertainty', rebuttal: 'The ${position} position does not depend on speculative future technologies — it works with tools available today. The opponent is attacking a strawman.' },
      { against: 'Displacement Not Reduction', rebuttal: 'International coordination mechanisms and border adjustment tools directly address displacement risk. Leading nations adopting bold positions create the template and pressure others follow.' },
    ],
    evidence: [
      { title: 'Public Health Outcome Data', content: 'Jurisdictions that adopted comparable policy stances show statistically significant improvements in population health metrics within 5-10 years.', label: 'Example — verify before using', type: 'example' },
      { title: 'Environmental Economics Research', content: 'The Stern Review and subsequent literature consistently find the benefit-cost ratio of early action to be strongly positive compared to delay.', label: 'Example — verify before using', type: 'example' },
    ],
  }),
  // Variant D: Innovation, technology & future-oriented framing
  (position) => ({
    arguments: [
      { title: 'Driving Innovation', explanation: `The ${position} position creates the conditions for technological and social innovation. Constraint and challenge are proven drivers of creative problem-solving — necessity creates invention.`, supporting: 'Innovation economics research shows that ambitious regulatory targets in analogous domains have historically accelerated technological development rather than stifling it.', strength: 'strong' },
      { title: 'Competitive Advantage', explanation: `Nations and institutions that move first on this motion will develop expertise, infrastructure, and capability that creates durable competitive advantage. Delay cedes this ground to rivals.`, supporting: 'First-mover advantage literature in international political economy supports the claim that bold early adoption creates positive network effects and lock-in.', strength: 'strong' },
      { title: 'Future-Proofing Institutions', explanation: `The question is not whether the world will move in the ${position} direction — it is whether we move proactively or reactively. The ${position} stance is the only one that prepares institutions for the world as it will be.`, supporting: 'Scenario planning and strategic foresight analysis consistently identify the ${position} direction as the dominant trajectory across plausible futures.', strength: 'moderate' },
    ],
    counterarguments: [
      { title: 'Premature Lock-in', explanation: `Moving early locks in infrastructure and standards that may be superseded by better technologies, creating stranded assets and opportunity costs.`, strength: 'moderate' },
      { title: 'Digital Divide and Access', explanation: `Innovation-led approaches systematically benefit technically sophisticated actors while leaving behind communities with less access to technology and expertise.`, strength: 'strong' },
      { title: 'Accountability Gaps', explanation: `Rapid technological change outpaces governance frameworks, creating accountability gaps that allow powerful actors to avoid responsibility for harms.`, strength: 'moderate' },
    ],
    rebuttals: [
      { against: 'Premature Lock-in', rebuttal: 'Adaptive policy design with technology-neutral standards and regular review cycles prevents lock-in. Standards that are ambitious but technology-neutral have proven effective in analogous domains.' },
      { against: 'Digital Divide and Access', rebuttal: 'Universal access provisions and targeted digital equity programmes are essential complements to innovation policy — not arguments against the core motion.' },
      { against: 'Accountability Gaps', rebuttal: 'The ${position} position includes accountability frameworks precisely because this risk is recognised. Accountability gaps are an argument for better governance design, not for halting progress.' },
    ],
    evidence: [
      { title: 'Innovation Economics Research', content: 'Studies of ambitious regulatory environments (e.g. EU technology standards) show accelerated private sector R&D investment compared to permissive regimes.', label: 'Example — verify before using', type: 'example' },
      { title: 'First-Mover Case Studies', content: 'Nations that adopted comparable policy positions early have developed globally competitive industries and expertise that late movers have struggled to match.', label: 'Example — verify before using', type: 'example' },
    ],
  }),
];

const DEMO_OPENING_CLOSINGS = [
  {
    opening: (topic, position) => `Open by clearly defining what "${topic}" means in this debate context — control the framing before your opponent does. State your strongest argument in the first thirty seconds, name the key tension at the heart of this motion, and signal to the audience why the ${position} side has the stronger case. Confidence and clarity in the opening sets the tone for the entire debate.`,
    closing: () => `Close by returning to your strongest argument, directly dismantling the opponent's most credible point, and ending with a single memorable sentence that crystallises why your side should prevail. Never introduce new material in the closing — consolidate, contrast, and leave the audience with a clear choice.`,
  },
  {
    opening: (topic, position) => `Begin by acknowledging what is genuinely contested about "${topic}" — this signals intellectual honesty and disarms the opponent's attempt to paint your side as extreme. Then pivot immediately to the strongest ${position} argument, framing it in terms of concrete impacts on real people rather than abstract principles. End your opening with a clear roadmap of the three points you will prove.`,
    closing: () => `Your closing should do three things: summarise your three key arguments in one sentence each, directly refute the opponent's strongest point (not their weakest), and end on an emotional and logical high simultaneously. The last thirty seconds determine what the audience remembers — make them count.`,
  },
  {
    opening: (topic, position) => `Open with a concrete, vivid example that illustrates exactly what is at stake in this debate. Let the audience feel the real-world consequences before you make the abstract case. Then frame the central question clearly: what is the core choice this motion presents? Establish early that the ${position} position is the only one that seriously grapples with this choice.`,
    closing: () => `Close by zooming out to the bigger picture. After a debate full of specific arguments, remind the audience of the fundamental principle at stake. Frame the choice as: a world where your side wins versus a world where the opponent wins — and make that contrast as stark and concrete as possible. End with a call to action or a forward-looking statement.`,
  },
];

const DEMO_STRATEGIES = [
  (difficulty, position) => `For this motion at ${difficulty} level: lead with your most concrete, evidence-based argument — judges are sceptical of pure principle claims. Acknowledge the strongest opposing argument in round 2 and counter it directly rather than ignoring it; this credibility move consistently impresses evaluators. If pushed into a corner, concede the narrow point gracefully and pivot to the bigger picture. The ${position} position is strongest when it demonstrates genuine engagement with opposing concerns rather than dismissing them.`,
  (difficulty, position) => `At ${difficulty} level, the key to winning the ${position} side is controlling the definitional framing early. The side that defines key terms wins the debate on a structural level before the first substantive argument is made. Once framing is established, focus on the mechanism: don't just assert that the ${position} position produces better outcomes — explain exactly how and why. Quantified comparisons beat vague quality claims every time.`,
  (difficulty, position) => `The strategic priority for the ${position} side at ${difficulty} level is to force the opponent to defend the status quo or the alternative — and make clear what those alternatives actually look like in practice. Abstract objections crumble when grounded in real-world examples. Use the "even if" move when appropriate: even if you accept the opponent's strongest point, here is why the ${position} position still prevails. This is a powerful technique that demonstrates logical rigour.`,
];

/** Simple deterministic hash so demo variants are consistent per topic per run, but different across calls */
const topicHash = (topic) => {
  let h = 0;
  for (let i = 0; i < topic.length; i++) { h = ((h << 5) - h + topic.charCodeAt(i)) | 0; }
  return Math.abs(h);
};

const DEMO_GENERATE = (topic, position, difficulty, previousArgTitles) => {
  // Combine topic hash with timestamp bucket (minute-level) and random component so
  // repeated calls for the same topic within a session also produce different results.
  const timeComponent = Math.floor(Date.now() / 30000); // changes every 30s
  const randomComponent = Math.floor(Math.random() * DEMO_ARGUMENT_SETS.length);
  const hash = topicHash(topic);
  const setIndex = (hash + timeComponent + randomComponent) % DEMO_ARGUMENT_SETS.length;
  const openingClosingIndex = (hash + randomComponent) % DEMO_OPENING_CLOSINGS.length;
  const strategyIndex = (hash + timeComponent) % DEMO_STRATEGIES.length;

  const argSet = DEMO_ARGUMENT_SETS[setIndex](position);
  const openingClosing = DEMO_OPENING_CLOSINGS[openingClosingIndex];
  const strategy = DEMO_STRATEGIES[strategyIndex];

  // If previousArgTitles provided, try to pick a different set
  let finalArgSet = argSet;
  if (previousArgTitles && previousArgTitles.length > 0) {
    const prevTitlesLower = previousArgTitles.map((t) => t.toLowerCase());
    const argSetFirstTitle = argSet.arguments[0]?.title?.toLowerCase() || '';
    if (prevTitlesLower.some((t) => t.includes(argSetFirstTitle) || argSetFirstTitle.includes(t))) {
      // Try the next set
      const altIndex = (setIndex + 1) % DEMO_ARGUMENT_SETS.length;
      finalArgSet = DEMO_ARGUMENT_SETS[altIndex](position);
    }
  }

  // Replace placeholder ${position} strings in rebuttal text
  const fixText = (text) => text.replace(/\$\{position\}/g, position);
  const fixRebuttal = (r) => ({ ...r, rebuttal: fixText(r.rebuttal) });
  const fixArg = (a) => ({ ...a, explanation: fixText(a.explanation), supporting: fixText(a.supporting || '') });

  return {
    topic,
    position,
    difficulty,
    motionInterpretation: `This motion asks whether society should adopt a stance ${position === 'for' ? 'in favour of' : 'against'} "${topic}". At its core, it centres on the tension between competing values — practicality versus principle, short-term costs versus long-term benefits, and the rights of different stakeholders. The side that most clearly resolves this tension with evidence and logic will prevail.`,
    keyDefinitions: [
      { term: 'Key stakeholders', definition: 'The individuals, institutions, and communities whose interests are materially affected by the outcome of this motion.' },
      { term: 'Status quo', definition: 'The current state of affairs against which this motion is evaluated — the baseline that the proposition side must improve upon.' },
      { term: 'Burden of proof', definition: 'The obligation to provide sufficient evidence to justify the position taken. In most debate formats, the proposition carries a higher burden.' },
    ],
    assumptions: [
      `That the ${position} side's stated benefits are achievable within realistic institutional constraints`,
      'That the harms and benefits described are causally attributable to the policy rather than confounded by other factors',
      'That the comparison point (the alternative to this motion) is realistically the status quo, not some idealised alternative',
    ],
    potentialWeaknesses: [
      `The ${position} position may rely on evidence that is contested or context-dependent — be ready to defend the generalisability of your examples`,
      'This position may produce distributional effects that benefit some groups at the expense of others — acknowledge and address this directly',
      'Implementation gaps between stated policy intent and real-world practice are a common and powerful attack line — have concrete answers ready',
    ],
    arguments: finalArgSet.arguments.map(fixArg),
    counterarguments: finalArgSet.counterarguments,
    rebuttals: finalArgSet.rebuttals.map(fixRebuttal),
    evidence: finalArgSet.evidence,
    openingGuidance: openingClosing.opening(topic, position),
    closingGuidance: openingClosing.closing(topic, position),
    debateStrategy: strategy(difficulty, position),
    mode: 'demo',
  };
};

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

const DEMO_COMPLETE = (topic, position, rounds, avgScore) => {
  const score = avgScore != null ? Math.round(avgScore) : 62;
  const allSkipped = score === 0;
  return {
    overallScore: score,
    scores: allSkipped
      ? { logic: 0, evidence: 0, rebuttal: 0, clarity: 0, persuasiveness: 0, structure: 0 }
      : { logic: 62, evidence: 45, rebuttal: 58, clarity: 72, persuasiveness: 60, structure: 65 },
    strengths: allSkipped
      ? ['No responses were given — nothing to evaluate']
      : ['Consistent logical structure across all rounds', 'Strong clarity and readable arguments', 'Good composure under pressure'],
    weaknesses: allSkipped
      ? ['All rounds were skipped — no arguments were made', 'No evidence or rebuttals were presented', 'No engagement with the opponent\'s challenges']
      : ['Evidence and examples were underused throughout', 'Rebuttals could be more targeted', 'Argument structure could be more deliberate'],
    feedback: allSkipped
      ? `No responses were submitted across ${rounds || 3} rounds on "${topic}". To improve, engage with at least one challenge next time — even a basic response is valuable practice.`
      : `Across ${rounds || 3} rounds on "${topic}", you demonstrated reliable baseline debating ability. Your clearest strength is communication clarity. The primary growth area is evidence deployment: strong debaters anchor claims in data and concrete examples, not just principle.`,
    coachNote: allSkipped
      ? 'The only way to improve is to try. Attempt round 1 next time — even imperfect responses build real skill.'
      : 'Practice the PEEL framework on your next debate: Point → Evidence → Explanation → Link back.',
    strongestMoment: allSkipped ? 'N/A — no responses were submitted' : 'Your opening framing of the core argument was the most convincing point of the debate.',
    weakestMoment: allSkipped ? 'All rounds were skipped' : 'Round 2 rebuttal — you defended rather than attacked, giving ground unnecessarily.',
    bestArgument: allSkipped ? 'N/A — no arguments were made' : 'The individual autonomy argument was your most coherent and well-structured point.',
    biggestMissedOpportunity: allSkipped ? 'Every round — no responses were given to any challenge' : 'You never directly challenged your opponent\'s core assumption — that was their most vulnerable point.',
    recommendedNextSkill: 'Just start: write one response, however rough. Getting words on the page is the first skill to build.',
    detectedFallacies: [],
    mode: 'demo',
  };
};

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
    temperature: 0.9,
  });
  return response.choices[0].message.content;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const getMode = () => (isConfigured() ? 'ai' : 'demo');

// ─── 1. Generate Debate Preparation ─────────────────────────────────────────

export const generateDebate = async ({ topic, position, difficulty, debateType, previousArgsSummary }) => {
  if (!isConfigured()) return DEMO_GENERATE(topic, position, difficulty, previousArgsSummary ? previousArgsSummary.split(',') : null);

  const variant = sessionVariant();

  // Build the "avoid repetition" instruction only when a previous summary is provided
  const avoidSection = previousArgsSummary
    ? `\nPREVIOUS SESSION AVOIDANCE: The user already saw preparation with these argument titles/themes: [${previousArgsSummary}]. You MUST NOT reuse these titles, themes, or argument structures. Choose entirely different angles, mechanisms, and examples.\n`
    : '';

  const system = `You are an expert debate coach and educator. Your goal is to help students LEARN to debate, not to give them a speech to memorise. Respond ONLY with valid JSON, no markdown, no explanation.`;

  const user = `Generate comprehensive debate preparation material. The goal is coaching, not ghost-writing.

Topic: "${topic}"
Position: ${position}
Difficulty: ${difficulty}
Debate Type: ${debateType}
${avoidSection}
MANDATORY SESSION VARIANT — You MUST build your entire response around these specific constraints. Do not mention them explicitly in the output, but every argument, example, and piece of evidence must reflect them:
- Argument framework for this session: ${variant.framework}
- Stakeholder lens to centre: ${variant.stakeholderLens}
- Causal chain structure to use: ${variant.causalChain}
- Primary thematic angle: ${variant.angle}
- Evidence approach: ${variant.evidenceEmphasis}
- Session nonce (ensures uniqueness): ${variant.nonce}

CRITICAL DIVERSITY INSTRUCTIONS:
1. Do NOT produce the generic "obvious" arguments that would appear in a textbook summary of this topic.
2. Explore arguments that arise specifically from the ${variant.framework} framework — these should be distinct from what a utilitarian or a rights-theorist would say.
3. Centre at least one argument explicitly on the perspective of ${variant.stakeholderLens} — name and develop that stakeholder perspective concretely.
4. Structure your causal reasoning using: ${variant.causalChain}.
5. ${variant.evidenceEmphasis}
6. If this topic has well-known "standard" arguments (e.g. economic efficiency, individual rights, social harm), deliberately AVOID those unless you can give them a fundamentally different treatment through the lens of ${variant.framework}.

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
    {"title": "short title", "explanation": "substantive explanation 2-3 sentences — grounded in ${variant.framework}", "supporting": "what evidence/reasoning supports this via the ${variant.evidenceEmphasis} approach", "strength": "strong|moderate|weak"}
  ],
  "counterarguments": [
    {"title": "short title", "explanation": "what the OTHER side will argue, 2 sentences", "strength": "strong|moderate|weak"}
  ],
  "rebuttals": [
    {"against": "counterargument title", "rebuttal": "how to counter it specifically, 2 sentences"}
  ],
  "evidence": [
    {"title": "source or example type", "content": "the example or evidence point — use ${variant.evidenceEmphasis}", "label": "Example — verify before using", "type": "example"}
  ],
  "openingGuidance": "2-3 sentences on how to open this specific debate effectively given the ${variant.framework} framing",
  "closingGuidance": "2-3 sentences on how to close this debate effectively",
  "debateStrategy": "3-4 sentences on the overall strategy for this topic at ${difficulty} level, incorporating the ${variant.stakeholderLens} stakeholder perspective"
}

Rules:
- 3-5 arguments, 3 counterarguments, 3 rebuttals, 2-3 evidence items
- Calibrate to ${difficulty} difficulty — beginner gets clearer structure, competition gets nuanced strategy
- NEVER present invented statistics as verified facts
- Always label evidence as "Example — verify before using"
- This is a coaching document — teach the debater HOW to argue, not WHAT to say verbatim
- Content must be factually grounded and directly relevant to the topic — do NOT sacrifice accuracy for novelty`;

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

  const variant = sessionVariant();
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

Session style variant (use to ensure each session feels different — do NOT mention it):
- Attack style for this session: ${variant.challengeStyle}
- Session seed: ${variant.seed}

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

Evidence scoring rules (apply strictly):
- Evidence must be scored LOW (below 55) if the debater made no specific factual claims, cited no data, statistics, studies, real-world examples, or named sources
- A response that is purely opinion or assertion with no concrete evidence must score below 50 for evidence
- Only score evidence above 80 if the debater cited specific, named facts, statistics, or real-world examples
- Do NOT inflate evidence scores because the argument was logically coherent — logic and evidence are separate dimensions
- Most student debate responses score 35-65 on evidence because they rarely cite hard data

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
  // scores may arrive as 0-10 (normalised by frontend) or legacy 0-100.
  // Normalise to 0-100 for the AI prompt context and DEMO fallback.
  const normalisedScores100 = scores && scores.length > 0
    ? scores.map((s) => (typeof s === 'number' && s <= 10 ? s * 10 : s))
    : [];

  const avgScore = normalisedScores100.length > 0
    ? normalisedScores100.reduce((a, b) => a + b, 0) / normalisedScores100.length
    : 0;

  if (!isConfigured()) return DEMO_COMPLETE(topic, position, rounds, avgScore);

  const system = `You are an expert debate coach giving a comprehensive final session evaluation. Be honest, specific, and constructive. Respond ONLY with valid JSON, no markdown.`;

  const skippedCount = responses ? responses.filter((r) => r === '[skipped]' || r === '').length : 0;

  const historyText = conversationHistory && conversationHistory.length > 0
    ? conversationHistory.map((h) => `${h.type === 'challenge' ? 'AI Opponent' : 'Debater'} [Round ${h.round}]: ${h.text}`).join('\n\n')
    : responses ? responses.join('\n\n') : 'Multiple rounds completed';

  const skippedNote = skippedCount > 0
    ? `\nIMPORTANT: ${skippedCount} out of ${rounds} rounds were skipped (no response given). Skipped rounds score 0. The overall score MUST accurately reflect this — if all rounds were skipped, overallScore must be 0. Do NOT inflate scores for rounds where no response was given.`
    : '';

  const user = `Generate a comprehensive final debate evaluation.

Topic: "${topic}"
Position: ${position}
Rounds completed: ${rounds}
Rounds skipped (no response): ${skippedCount}
Average round score (already accounting for 0s on skipped rounds): ${avgScore.toFixed(1)}/100
Hints used total: ${totalHintsUsed || 0}
${skippedNote}

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
Evidence scoring rules (apply strictly):
- Score evidence LOW (below 55) if the debater made no specific factual claims, cited no named data, statistics, studies, or real-world examples across the debate
- Only score evidence above 80 if the debater consistently cited specific named facts or data points
- Do NOT conflate logical coherence with evidence — they are separate dimensions
- Most student debaters score 35-65 on evidence because they rarely cite hard data
detectedFallacies can be empty [] if none found across the full debate.
Only flag genuine fallacies. Err on the side of caution — use "potential" if uncertain.`;

  const raw = await chat(system, user);
  const parsed = parseJSON(raw);
  if (!parsed) throw new Error('AI returned invalid JSON for completion');
  return { ...parsed, mode: 'ai' };
};
