/**
 * Reference solutions used only by the test suite to prove every challenge is
 * solvable. They are never imported by the app, so learners do not see them.
 */

const average = `
function average(numbers) {
  if (!Array.isArray(numbers)) throw new Error('expected an array')
  if (numbers.length === 0) return 0
  let total = 0
  for (let i = 0; i < numbers.length; i++) total += numbers[i]
  return total / numbers.length
}
`

const vectors = `
function dot(a, b) {
  if (a.length !== b.length) throw new Error('length mismatch')
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum
}
function cosineSimilarity(a, b) {
  const denom = Math.sqrt(dot(a, a)) * Math.sqrt(dot(b, b))
  return denom === 0 ? 0 : dot(a, b) / denom
}
`

const cleanRows = `
function cleanRows(rows, fields) {
  const out = []
  for (const row of rows) {
    const next = { ...row }
    let ok = true
    for (const f of fields) {
      const v = row[f]
      if (v === null || v === undefined || (typeof v === 'string' && v.trim() === '')) { ok = false; break }
      const n = Number(v)
      if (!Number.isFinite(n)) { ok = false; break }
      next[f] = n
    }
    if (ok) out.push(next)
  }
  return out
}
`

const fitLine = `
function fitLine(xs, ys, learningRate, steps) {
  let w = 0, b = 0
  const n = xs.length
  for (let s = 0; s < steps; s++) {
    let dw = 0, db = 0
    for (let i = 0; i < n; i++) {
      const err = w * xs[i] + b - ys[i]
      dw += err * xs[i]
      db += err
    }
    w -= learningRate * (2 / n) * dw
    b -= learningRate * (2 / n) * db
  }
  return { w, b }
}
`

const neuron = `
function neuron(inputs, weights, bias, activation) {
  if (inputs.length !== weights.length) throw new Error('shape mismatch')
  let z = bias
  for (let i = 0; i < inputs.length; i++) z += inputs[i] * weights[i]
  if (activation === 'linear') return z
  if (activation === 'relu') return Math.max(0, z)
  if (activation === 'sigmoid') return 1 / (1 + Math.exp(-z))
  throw new Error('unknown activation')
}
`

const softmax = `
function softmax(xs) {
  const max = Math.max(...xs)
  const exps = xs.map(x => Math.exp(x - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map(e => e / sum)
}
`

const topK = `
function topK(query, items, k) {
  return items
    .map(item => ({ id: item.id, score: cosineSimilarity(query, item.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(item => item.id)
}
`

const parse = `
function parseModelResponse(raw) {
  const text = String(raw).trim().replace(/^\`\`\`(?:json)?\\s*|\\s*\`\`\`$/g, '')
  let data
  try { data = JSON.parse(text) } catch { return { ok: false, error: 'invalid json' } }
  if (!data || typeof data !== 'object') return { ok: false, error: 'invalid json shape' }
  if (typeof data.answer !== 'string' || data.answer.trim() === '') return { ok: false, error: 'bad answer' }
  if (typeof data.confidence !== 'number' || data.confidence < 0 || data.confidence > 1) return { ok: false, error: 'bad confidence' }
  if (!Array.isArray(data.sources) || !data.sources.every(s => typeof s === 'string')) return { ok: false, error: 'bad sources' }
  return { ok: true, data: { answer: data.answer, confidence: data.confidence, sources: data.sources } }
}
`

const rag = `
function tokenize(text) {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)
}
function counts(tokens) {
  const c = {}
  for (const t of tokens) c[t] = (c[t] || 0) + 1
  return c
}
function bowCosine(a, b) {
  let d = 0, na = 0, nb = 0
  for (const k in a) { na += a[k] * a[k]; if (b[k]) d += a[k] * b[k] }
  for (const k in b) nb += b[k] * b[k]
  return na && nb ? d / Math.sqrt(na * nb) : 0
}
function retrieve(question, docs, k) {
  const q = counts(tokenize(question))
  return docs
    .map(doc => ({ id: doc.id, text: doc.text, score: bowCosine(q, counts(tokenize(doc.text))) }))
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}
function buildPrompt(question, docs) {
  const lines = docs.map(d => '[' + d.id + '] ' + d.text).join('\\n')
  return 'Answer using only the sources below. Cite source ids.\\n\\n' + lines + '\\n\\nQuestion: ' + question
}
`

const evals = `
function runEvals(cases, system) {
  const failures = []
  let passed = 0
  for (const c of cases) {
    try {
      const out = String(system(c.input)).toLowerCase()
      const missing = c.mustInclude.find(p => !out.includes(p.toLowerCase()))
      if (missing === undefined) passed++
      else failures.push({ input: c.input, reason: 'missing: ' + missing })
    } catch (e) {
      failures.push({ input: c.input, reason: 'error: ' + e.message })
    }
  }
  return { score: cases.length ? passed / cases.length : 0, passed, failures }
}
`

const lichPipeline = `${parse}${rag}${evals}
const FALLBACK = { answer: "I don't know", sources: [], grounded: false }
function answer(question, docs, model) {
  const hits = retrieve(question, docs, 2)
  if (hits.length === 0) return { ...FALLBACK, sources: [] }
  const parsed = parseModelResponse(model(buildPrompt(question, hits)))
  if (!parsed.ok) return { ...FALLBACK, sources: [] }
  const ids = hits.map(h => h.id)
  const { sources } = parsed.data
  if (sources.length === 0 || !sources.every(s => ids.includes(s))) return { ...FALLBACK, sources: [] }
  return { answer: parsed.data.answer, sources, grounded: true }
}
function scorePipeline(cases, docs, model) {
  return runEvals(cases, q => answer(q, docs, model).answer).score
}
`

export const referenceSolutions: Record<string, string> = {
  'variables-functions': `
function formatProfile(name, level = 1) {
  return \`\${name.trim()} (Lv. \${level})\`
}
`,
  'data-structures': `
function summarize(lessons) {
  const done = lessons.filter(l => l.done)
  return {
    count: lessons.length,
    doneCount: done.length,
    totalXp: done.reduce((sum, l) => sum + l.xp, 0),
    titles: lessons.map(l => l.title).sort(),
  }
}
`,
  'debug-loops': average,
  'boss-programming': `${average}
function buildReport(students) {
  if (!Array.isArray(students)) throw new Error('expected an array')
  return students
    .map(s => ({ name: s.name, avg: average(s.scores) }))
    .sort((a, b) => b.avg - a.avg)
    .map(s => s.name + ': ' + s.avg.toFixed(1) + ' ' + (s.avg >= 60 ? 'PASS' : 'FAIL'))
}
`,
  probability: `
function probability(outcomes, predicate) {
  if (outcomes.length === 0) return 0
  return outcomes.filter(predicate).length / outcomes.length
}
`,
  statistics: `
function describe(values) {
  const n = values.length
  const mean = values.reduce((a, b) => a + b, 0) / n
  const sorted = [...values].sort((a, b) => a - b)
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2
  const std = Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / n)
  return { mean, median, std }
}
`,
  vectors,
  'boss-math': `${vectors}
function compareModels(truth, predsA, predsB) {
  if (truth.length !== predsA.length || truth.length !== predsB.length) throw new Error('length mismatch')
  const score = preds => ({
    accuracy: preds.filter((p, i) => (p >= 0.5 ? 1 : 0) === truth[i]).length / truth.length,
    meanConfidence: preds.reduce((a, b) => a + b, 0) / preds.length,
  })
  const a = score(predsA)
  const b = score(predsB)
  const winner = a.accuracy > b.accuracy ? 'A' : b.accuracy > a.accuracy ? 'B' : 'tie'
  return { a, b, similarity: cosineSimilarity(predsA, predsB), winner }
}
`,
  datasets: cleanRows,
  training: fitLine,
  evaluation: `
function regressionMetrics(truth, preds) {
  let se = 0, ae = 0
  for (let i = 0; i < truth.length; i++) {
    const d = preds[i] - truth[i]
    se += d * d
    ae += Math.abs(d)
  }
  return { mse: se / truth.length, mae: ae / truth.length }
}
function precisionRecall(truth, preds) {
  let tp = 0, pp = 0, ap = 0
  for (let i = 0; i < truth.length; i++) {
    if (preds[i] === 1) pp++
    if (truth[i] === 1) ap++
    if (preds[i] === 1 && truth[i] === 1) tp++
  }
  return { precision: pp ? tp / pp : 0, recall: ap ? tp / ap : 0 }
}
`,
  'boss-ml': `${cleanRows}${fitLine}
function mse(rows, w, b) {
  if (rows.length === 0) return 0
  return rows.reduce((a, r) => a + (w * r.x + b - r.y) ** 2, 0) / rows.length
}
function trainAndEvaluate(rows, options) {
  const clean = cleanRows(rows, ['x', 'y'])
  if (clean.length < 2) throw new Error('not enough clean rows')
  const cut = Math.floor(clean.length * 0.8)
  const train = clean.slice(0, cut)
  const test = clean.slice(cut)
  const { w, b } = fitLine(train.map(r => r.x), train.map(r => r.y), options.learningRate, options.steps)
  return { w, b, trainMse: mse(train, w, b), testMse: mse(test, w, b), dropped: rows.length - clean.length }
}
`,
  'neural-networks': neuron,
  embeddings: `${vectors}${topK}`,
  transformers: `${softmax}
function attend(query, keys, values) {
  const d = query.length
  const scores = keys.map(k => k.reduce((s, kv, i) => s + kv * query[i], 0) / Math.sqrt(d))
  const weights = softmax(scores)
  const out = new Array(values[0].length).fill(0)
  weights.forEach((w, i) => values[i].forEach((v, j) => { out[j] += w * v }))
  return out
}
`,
  'boss-deep-learning': `${neuron}${softmax}${vectors}${topK}
function forward(input, layers) {
  return layers.reduce((x, layer) => {
    if (layer.weights.length !== layer.biases.length) throw new Error('shape mismatch')
    return layer.weights.map((row, i) => neuron(x, row, layer.biases[i], layer.activation))
  }, input)
}
function predict(input, layers, labels) {
  const probs = softmax(forward(input, layers))
  let best = 0
  probs.forEach((p, i) => { if (p > probs[best]) best = i })
  return { label: labels[best], confidence: probs[best] }
}
function retrieve(input, layers, library, k) {
  return topK(forward(input, layers), library, k)
}
`,
  'model-apis': parse,
  rag,
  'evals-monitoring': evals,
  'boss-production': lichPipeline,
  'final-boss': `${parse}${rag}
function createAssistant({ docs, model, minScore }) {
  const cache = new Map()
  const stats = { questions: 0, modelCalls: 0, fallbacks: 0, cacheHits: 0 }
  const fallback = () => { stats.fallbacks++; return { answer: "I don't know", sources: [] } }
  function run(question) {
    const hits = retrieve(question, docs, 2)
    if (hits.length === 0 || hits[0].score < minScore) return fallback()
    stats.modelCalls++
    const parsed = parseModelResponse(model(buildPrompt(question, hits)))
    if (!parsed.ok) return fallback()
    const ids = hits.map(h => h.id)
    const { answer, sources } = parsed.data
    if (sources.length === 0 || !sources.every(s => ids.includes(s))) return fallback()
    return { answer, sources }
  }
  return {
    ask(question) {
      stats.questions++
      const key = question.trim().toLowerCase()
      if (cache.has(key)) { stats.cacheHits++; return cache.get(key) }
      const result = run(question)
      cache.set(key, result)
      return result
    },
    stats() { return { ...stats } },
  }
}
`,
}
