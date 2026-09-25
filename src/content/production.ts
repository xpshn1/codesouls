import type { Campaign, Challenge } from './types'

const DOCS = `const docs = [
  { id: 'refunds', text: 'Refunds are issued within 14 days of purchase to the original card.' },
  { id: 'shipping', text: 'Standard shipping takes 3 to 5 business days. Express shipping takes 1 day.' },
  { id: 'passwords', text: 'Reset your password from the login page using the forgot password link.' },
]`

export const production: Campaign = {
  id: 'production-ai',
  title: 'AI Tools and Production',
  domain: 'Ship',
  difficulty: 'Production',
  summary:
    'Handle messy model output, ground answers in retrieved documents, and measure quality with evals, the way real AI products are built.',
  drills: [
    {
      id: 'model-apis',
      kind: 'drill',
      title: 'API Reliquary',
      concept: 'Parsing and validating model output',
      xp: 45,
      brief: `Models are asked for JSON, but they sometimes wrap it in markdown code fences or send a broken shape. Never trust the raw text.

Write \`parseModelResponse(raw)\`. Remove any \`\`\`json fences, parse the JSON, and check its shape:
- \`answer\`: a non-empty string
- \`confidence\`: a number from 0 to 1
- \`sources\`: an array of strings

Return \`{ ok: true, data: { answer, confidence, sources } }\`. On failure, return \`{ ok: false, error }\`, where \`error\` names the problem: \`"json"\`, or the name of the bad field.`,
      starter: `function parseModelResponse(raw) {
  // your code here
}
`,
      tests: [
        {
          name: 'parses clean JSON',
          code: `expect(parseModelResponse('{"answer":"Yes","confidence":0.9,"sources":["a"]}')).toEqual({ ok: true, data: { answer: 'Yes', confidence: 0.9, sources: ['a'] } })`,
        },
        {
          name: 'strips markdown fences',
          code: 'const raw = "\\u0060\\u0060\\u0060json\\n{\\"answer\\":\\"Hi\\",\\"confidence\\":1,\\"sources\\":[]}\\n\\u0060\\u0060\\u0060"\nexpect(parseModelResponse(raw).ok).toBe(true)',
        },
        {
          name: 'reports broken JSON',
          code: `const r = parseModelResponse('{"answer": "oops"')
expect(r.ok).toBe(false)
expect(r.error).toContain('json')`,
        },
        {
          name: 'rejects out-of-range confidence',
          code: `expect(parseModelResponse('{"answer":"x","confidence":7,"sources":[]}').error).toContain('confidence')`,
        },
        {
          name: 'rejects an empty answer',
          code: `expect(parseModelResponse('{"answer":"","confidence":0.5,"sources":[]}').error).toContain('answer')`,
        },
        {
          name: 'rejects bad sources',
          code: `expect(parseModelResponse('{"answer":"x","confidence":0.5,"sources":"a"}').error).toContain('sources')`,
        },
        {
          name: 'drops extra fields',
          code: `expect(parseModelResponse('{"answer":"x","confidence":0,"sources":[],"secret":1}').data).toEqual({ answer: 'x', confidence: 0, sources: [] })`,
        },
      ],
      hints: [
        'Trim the text, then strip the fences with a regex such as /^```(?:json)?\\s*|\\s*```$/g.',
        'Wrap JSON.parse in try/catch, because it throws on bad input.',
        '`Array.isArray(s) && s.every(x => typeof x === "string")`',
      ],
    },
    {
      id: 'rag',
      kind: 'drill',
      title: 'Retrieval Depths',
      concept: 'Retrieval-augmented generation',
      xp: 60,
      brief: `RAG gives a model the right documents so it answers from facts, not from memory. Write:

\`tokenize(text)\`: lowercase words, split on anything that is not a letter or digit, with no empty strings.

\`retrieve(question, docs, k)\`: \`docs\` look like \`{ id, text }\`. Score each document by the cosine similarity of word-count vectors (bag of words). Return the top \`k\` as \`{ id, text, score }\`, best first. Leave out documents with score 0.

\`buildPrompt(question, docs)\` returns exactly:
\`\`\`
Answer using only the sources below. Cite source ids.

[refunds] Refunds are issued...
[shipping] Standard shipping...

Question: <question>
\`\`\``,
      starter: `function tokenize(text) {
  // your code here
}

function retrieve(question, docs, k) {
  // your code here
}

function buildPrompt(question, docs) {
  // your code here
}
`,
      tests: [
        { name: 'tokenizes text', code: `expect(tokenize("How do I reset my Password? It's 2FA!")).toEqual(['how', 'do', 'i', 'reset', 'my', 'password', 'it', 's', '2fa'])` },
        {
          name: 'retrieves the most relevant doc',
          code: `${DOCS}
expect(retrieve('how long does express shipping take', docs, 1).map(d => d.id)).toEqual(['shipping'])`,
        },
        {
          name: 'skips irrelevant docs',
          code: `${DOCS}
expect(retrieve('password reset', docs, 3).map(d => d.id)).toEqual(['passwords'])`,
        },
        {
          name: 'includes a score',
          code: `const r = retrieve('cats', [{ id: 'x', text: 'cats' }], 1)
expect(r[0].score).toBeCloseTo(1, 6)`,
        },
        {
          name: 'builds the prompt',
          code: `const prompt = buildPrompt('When?', [{ id: 'a', text: 'Monday.' }, { id: 'b', text: 'Noon.' }])
expect(prompt).toBe('Answer using only the sources below. Cite source ids.\\n\\n[a] Monday.\\n[b] Noon.\\n\\nQuestion: When?')`,
        },
      ],
      hints: [
        "`text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)`",
        'Count words into an object ({ word: count }), then compute cosine over the union of both word lists.',
        'The prompt is three parts joined by blank lines ("\\n\\n"). The source lines are joined by "\\n".',
      ],
    },
    {
      id: 'evals-monitoring',
      kind: 'drill',
      title: 'Evals Citadel',
      concept: 'Evaluating AI systems',
      xp: 70,
      brief: `You cannot improve what you do not measure. Write \`runEvals(cases, system)\`.

Each case is \`{ input, mustInclude }\`. \`system(input)\` returns an answer string. A case passes when the answer contains **every** \`mustInclude\` phrase, ignoring case.

Return \`{ score, passed, failures }\`:
- \`score\`: passed / total (0 when there are no cases)
- \`failures\`: \`{ input, reason }\`, where reason is \`"missing: <phrase>"\` for the first missing phrase, or \`"error: <message>"\` if \`system\` throws

One crashing case must not stop the others.`,
      starter: `function runEvals(cases, system) {
  // your code here
}
`,
      tests: [
        {
          name: 'scores a perfect system',
          code: `const r = runEvals([{ input: 'hi', mustInclude: ['hello'] }], () => 'Hello there')
expect(r).toEqual({ score: 1, passed: 1, failures: [] })`,
        },
        {
          name: 'reports the first missing phrase',
          code: `const r = runEvals([{ input: 'q', mustInclude: ['14 days', 'card'] }], () => 'Refunds take 14 days')
expect(r.failures).toEqual([{ input: 'q', reason: 'missing: card' }])`,
        },
        {
          name: 'survives a crashing system',
          code: `const system = q => { if (q === 'boom') throw new Error('timeout'); return 'ok' }
const r = runEvals([{ input: 'boom', mustInclude: ['ok'] }, { input: 'fine', mustInclude: ['OK'] }], system)
expect(r.score).toBe(0.5)
expect(r.failures).toEqual([{ input: 'boom', reason: 'error: timeout' }])`,
        },
        { name: 'no cases scores 0', code: `expect(runEvals([], () => '')).toEqual({ score: 0, passed: 0, failures: [] })` },
      ],
      hints: [
        'Use try/catch inside the loop, not around it.',
        '`.find()` returns the first phrase that is missing.',
      ],
    },
  ],
  boss: {
    id: 'boss-production',
    kind: 'boss',
    title: 'The Hallucination Lich',
    concept: 'A grounded RAG pipeline with evals',
    xp: 260,
    brief: `\`model(prompt)\` is a fake LLM that returns raw text. Build a pipeline that refuses to hallucinate.

\`answer(question, docs, model)\`:
1. Retrieve the top 2 docs. If none match, return the fallback **without calling the model**.
2. Build the prompt, call \`model(prompt)\`, and parse and validate the response.
3. The answer is grounded only if \`sources\` is non-empty and every source is one of the retrieved doc ids.
4. Return \`{ answer, sources, grounded: true }\`, or the fallback \`{ answer: "I don't know", sources: [], grounded: false }\` if parsing fails or the answer is not grounded.

\`scorePipeline(cases, docs, model)\`: returns the eval score of \`answer\` over the cases.`,
    starter: `function answer(question, docs, model) {
  // your code here
}

function scorePipeline(cases, docs, model) {
  // your code here
}
`,
    tests: [
      {
        name: 'answers from retrieved docs',
        trains: 'rag',
        code: `${DOCS}
let seen = ''
const model = prompt => { seen = prompt; return '{"answer":"Within 14 days.","confidence":0.9,"sources":["refunds"]}' }
expect(answer('when are refunds issued', docs, model)).toEqual({ answer: 'Within 14 days.', sources: ['refunds'], grounded: true })
expect(seen).toContain('[refunds]')`,
      },
      {
        name: 'does not call the model when nothing matches',
        trains: 'rag',
        code: `${DOCS}
let calls = 0
const r = answer('zebra migration', docs, () => { calls++; return '' })
expect(calls).toBe(0)
expect(r.grounded).toBe(false)`,
      },
      {
        name: 'survives fenced or broken model output',
        trains: 'model-apis',
        code: `${DOCS}
expect(answer('refunds', docs, () => '\\u0060\\u0060\\u0060json\\n{"answer":"14 days","confidence":0.8,"sources":["refunds"]}\\n\\u0060\\u0060\\u0060').grounded).toBe(true)
expect(answer('refunds', docs, () => 'Sure! Refunds take 14 days.')).toEqual({ answer: "I don't know", sources: [], grounded: false })`,
      },
      {
        name: 'catches hallucinated sources',
        trains: 'model-apis',
        code: `${DOCS}
const liar = () => '{"answer":"Refunds are instant.","confidence":0.99,"sources":["made-up-policy"]}'
expect(answer('refunds', docs, liar).answer).toBe("I don't know")`,
      },
      {
        name: 'scores the pipeline with evals',
        trains: 'evals-monitoring',
        code: `${DOCS}
const model = p => p.includes('[shipping]')
  ? '{"answer":"Express takes 1 day.","confidence":0.9,"sources":["shipping"]}'
  : '{"answer":"Unsure","confidence":0.2,"sources":["nowhere"]}'
const cases = [
  { input: 'how long is express shipping', mustInclude: ['1 day'] },
  { input: 'refund timing', mustInclude: ['14 days'] },
]
expect(scorePipeline(cases, docs, model)).toBe(0.5)`,
      },
    ],
    hints: [
      'This boss uses all three drills: retrieve and buildPrompt from Retrieval Depths, parseModelResponse from API Reliquary, and runEvals from Evals Citadel.',
      "Grounding check: `sources.length > 0 && sources.every(id => retrievedIds.includes(id))`",
      'scorePipeline is a single call to runEvals(cases, q => answer(q, docs, model).answer).',
    ],
  },
}

export const finalBoss: Challenge = {
  id: 'final-boss',
  kind: 'boss',
  title: 'The Architect',
  concept: 'Ship a production assistant',
  xp: 500,
  brief: `The last test. Write \`createAssistant({ docs, model, minScore })\`, which returns an object with two methods.

\`ask(question)\`:
- retrieve the top 2 docs. If the best score is below \`minScore\` (or nothing matches), return the fallback without calling the model. That saves cost and avoids guessing.
- otherwise call the model, parse and validate the reply, and check grounding
- return \`{ answer, sources }\`. The fallback is \`{ answer: "I don't know", sources: [] }\`
- **cache**: asking the same question again (ignoring case and surrounding spaces) returns the cached result without calling the model

\`stats()\` returns monitoring counters: \`{ questions, modelCalls, fallbacks, cacheHits }\`.

Each assistant keeps its own counters and cache.`,
  starter: `function createAssistant({ docs, model, minScore }) {
  // your code here
  return {
    ask(question) {},
    stats() {},
  }
}
`,
  tests: [
    {
      name: 'answers a grounded question',
      trains: 'boss-production',
      code: `${DOCS}
const bot = createAssistant({ docs, minScore: 0.1, model: () => '{"answer":"3 to 5 business days","confidence":0.9,"sources":["shipping"]}' })
expect(bot.ask('how long does standard shipping take')).toEqual({ answer: '3 to 5 business days', sources: ['shipping'] })`,
    },
    {
      name: 'skips the model on weak matches',
      trains: 'rag',
      code: `${DOCS}
let calls = 0
const bot = createAssistant({ docs, minScore: 0.9, model: () => { calls++; return '{}' } })
expect(bot.ask('shipping')).toEqual({ answer: "I don't know", sources: [] })
expect(calls).toBe(0)`,
    },
    {
      name: 'caches repeated questions',
      trains: 'variables-functions',
      code: `${DOCS}
let calls = 0
const bot = createAssistant({ docs, minScore: 0.1, model: () => { calls++; return '{"answer":"14 days","confidence":1,"sources":["refunds"]}' } })
bot.ask('When are refunds issued?')
const again = bot.ask('  when are REFUNDS issued?  ')
expect(calls).toBe(1)
expect(again.answer).toBe('14 days')`,
    },
    {
      name: 'falls back on ungrounded answers',
      trains: 'boss-production',
      code: `${DOCS}
const bot = createAssistant({ docs, minScore: 0.1, model: () => '{"answer":"Forever","confidence":1,"sources":["blog"]}' })
expect(bot.ask('refunds').answer).toBe("I don't know")`,
    },
    {
      name: 'tracks monitoring stats',
      trains: 'evals-monitoring',
      code: `${DOCS}
const bot = createAssistant({ docs, minScore: 0.2, model: p => p.includes('[passwords]')
  ? '{"answer":"Use the forgot password link.","confidence":0.9,"sources":["passwords"]}'
  : 'not json' })
bot.ask('reset password')
bot.ask('reset password')
bot.ask('refunds card')
bot.ask('quantum physics')
expect(bot.stats()).toEqual({ questions: 4, modelCalls: 2, fallbacks: 2, cacheHits: 1 })`,
    },
    {
      name: 'assistants do not share state',
      trains: 'variables-functions',
      code: `${DOCS}
const model = () => '{"answer":"ok","confidence":1,"sources":["refunds"]}'
const a = createAssistant({ docs, model, minScore: 0.1 })
const b = createAssistant({ docs, model, minScore: 0.1 })
a.ask('refunds')
expect(b.stats().questions).toBe(0)`,
    },
  ],
  hints: [
    'Keep the counters and a Map cache as local variables inside createAssistant. The returned methods close over them.',
    'Most of this is your Hallucination Lich pipeline plus a threshold, a cache, and counters.',
    'Count a cache hit as a question, but not as a model call or a fallback.',
  ],
}
