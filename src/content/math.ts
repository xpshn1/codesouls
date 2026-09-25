import type { Campaign } from './types'

export const math: Campaign = {
  id: 'math',
  title: 'Math for AI',
  domain: 'Theory',
  difficulty: 'Apprentice',
  summary:
    'Probability, statistics, and vectors: the math you need to reason about model behavior. You write it as code, not just formulas.',
  drills: [
    {
      id: 'probability',
      kind: 'drill',
      title: 'Chance Catacombs',
      concept: 'Probability from data',
      xp: 30,
      brief: `Write \`probability(outcomes, predicate)\`. It returns the fraction of \`outcomes\` for which \`predicate(outcome)\` is true.

An empty list has probability \`0\`.

Example: \`probability([1, 2, 3, 4], n => n > 2)\` is \`0.5\`.`,
      starter: `function probability(outcomes, predicate) {
  // your code here
}
`,
      tests: [
        { name: 'counts matching outcomes', code: `expect(probability([1, 2, 3, 4], n => n > 2)).toBe(0.5)` },
        { name: 'works with strings', code: `expect(probability(['H', 'T', 'H', 'H'], s => s === 'H')).toBe(0.75)` },
        { name: 'no matches is 0', code: `expect(probability([1, 2], n => n > 10)).toBe(0)` },
        { name: 'empty list is 0', code: `expect(probability([], () => true)).toBe(0)` },
      ],
      hints: [
        'probability = matching outcomes / total outcomes',
        'You can pass `predicate` straight to `.filter`.',
      ],
    },
    {
      id: 'statistics',
      kind: 'drill',
      title: 'Metric Chapel',
      concept: 'Mean, median, and spread',
      xp: 35,
      brief: `Write \`describe(values)\` that returns \`{ mean, median, std }\`:
- \`median\`: the middle value after sorting. With an even count, it is the average of the two middle values.
- \`std\`: the population standard deviation, the square root of the average squared distance from the mean.

Do not change the order of the input array.`,
      starter: `function describe(values) {
  // your code here
}
`,
      tests: [
        { name: 'mean of a simple list', code: `expect(describe([1, 2, 3, 4, 5]).mean).toBe(3)` },
        { name: 'median of an odd-length list', code: `expect(describe([9, 1, 5]).median).toBe(5)` },
        { name: 'median of an even-length list', code: `expect(describe([4, 1, 3, 2]).median).toBe(2.5)` },
        { name: 'standard deviation', code: `expect(describe([2, 4, 4, 4, 5, 5, 7, 9]).std).toBeCloseTo(2, 5)` },
        {
          name: 'does not reorder the input',
          code: `const data = [3, 1, 2]
describe(data)
expect(data).toEqual([3, 1, 2])`,
        },
      ],
      hints: [
        'Sort a copy: `[...values].sort((a, b) => a - b)`. Without the compare function, the default sort orders numbers as text.',
        'For even lengths, the middle two indexes are `n / 2 - 1` and `n / 2`.',
        'std = Math.sqrt(mean of (x - mean) ** 2)',
      ],
    },
    {
      id: 'vectors',
      kind: 'drill',
      title: 'Vector Bridge',
      concept: 'Dot product and cosine similarity',
      xp: 40,
      brief: `Models represent meaning as vectors. Write:
- \`dot(a, b)\`: the sum of \`a[i] * b[i]\`
- \`cosineSimilarity(a, b)\`: \`dot(a, b) / (|a| * |b|)\`

If the lengths differ, throw an \`Error\` mentioning \`"length"\`. If either vector is all zeros, return \`0\`.`,
      starter: `function dot(a, b) {
  // your code here
}

function cosineSimilarity(a, b) {
  // your code here
}
`,
      tests: [
        { name: 'dot product', code: `expect(dot([1, 2, 3], [4, 5, 6])).toBe(32)` },
        { name: 'identical direction is 1', code: `expect(cosineSimilarity([1, 2], [2, 4])).toBeCloseTo(1, 6)` },
        { name: 'perpendicular is 0', code: `expect(cosineSimilarity([1, 0], [0, 3])).toBeCloseTo(0, 6)` },
        { name: 'opposite is -1', code: `expect(cosineSimilarity([1, 1], [-1, -1])).toBeCloseTo(-1, 6)` },
        { name: 'zero vector is 0', code: `expect(cosineSimilarity([0, 0], [1, 2])).toBe(0)` },
        { name: 'length mismatch throws', code: `expect(() => dot([1, 2], [1])).toThrow('length')` },
      ],
      hints: [
        'The length |a| is Math.sqrt(dot(a, a)).',
        'Check lengths inside `dot`, and cosineSimilarity gets the check for free.',
      ],
    },
  ],
  boss: {
    id: 'boss-math',
    kind: 'boss',
    title: 'The Twin Oracle',
    concept: 'Compare two models with evidence',
    xp: 150,
    brief: `Two models output a probability (0 to 1) that each example is positive. \`truth\` holds the real labels (0 or 1).

Write \`compareModels(truth, predsA, predsB)\` returning:
\`{ a: { accuracy, meanConfidence }, b: { accuracy, meanConfidence }, similarity, winner }\`
- a prediction counts as positive when it is **0.5 or higher**
- \`accuracy\`: the fraction of predictions that match \`truth\`
- \`meanConfidence\`: the average predicted probability
- \`similarity\`: the cosine similarity between \`predsA\` and \`predsB\`
- \`winner\`: \`'A'\`, \`'B'\`, or \`'tie'\`, by accuracy
- throw an \`Error\` mentioning \`"length"\` if the three arrays differ in length`,
    starter: `function compareModels(truth, predsA, predsB) {
  // your code here
}
`,
    tests: [
      {
        name: 'accuracy of each model',
        trains: 'probability',
        code: `const r = compareModels([1, 0, 1, 0], [0.9, 0.2, 0.3, 0.1], [0.6, 0.7, 0.8, 0.4])
expect(r.a.accuracy).toBe(0.75)
expect(r.b.accuracy).toBe(0.75)`,
      },
      {
        name: 'threshold is inclusive at 0.5',
        trains: 'probability',
        code: `expect(compareModels([1], [0.5], [0.49]).a.accuracy).toBe(1)`,
      },
      {
        name: 'mean confidence',
        trains: 'statistics',
        code: `const r = compareModels([1, 0], [0.8, 0.4], [0.5, 0.5])
expect(r.a.meanConfidence).toBeCloseTo(0.6, 6)
expect(r.b.meanConfidence).toBeCloseTo(0.5, 6)`,
      },
      {
        name: 'similarity between the models',
        trains: 'vectors',
        code: `expect(compareModels([1, 0], [1, 0], [0, 1]).similarity).toBeCloseTo(0, 6)
expect(compareModels([1, 1], [0.2, 0.4], [0.4, 0.8]).similarity).toBeCloseTo(1, 6)`,
      },
      {
        name: 'declares a winner or tie',
        trains: 'probability',
        code: `expect(compareModels([1, 0], [0.9, 0.1], [0.1, 0.9]).winner).toBe('A')
expect(compareModels([1, 0], [0.1, 0.9], [0.9, 0.1]).winner).toBe('B')
expect(compareModels([1, 0], [0.9, 0.9], [0.1, 0.1]).winner).toBe('tie')`,
      },
      {
        name: 'rejects mismatched lengths',
        trains: 'vectors',
        code: `expect(() => compareModels([1, 0], [0.5], [0.5, 0.5])).toThrow('length')`,
      },
    ],
    hints: [
      'Turn each probability into a label first: p >= 0.5 ? 1 : 0.',
      'Accuracy is a probability: the chance a prediction matches the truth. Reuse your Chance Catacombs idea.',
      'Bring your dot and cosineSimilarity helpers from Vector Bridge. Copying your own code is allowed.',
    ],
  },
}
