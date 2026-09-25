import type { Campaign } from './types'

export const deepLearning: Campaign = {
  id: 'deep-learning',
  title: 'Deep Learning',
  domain: 'Neural Nets',
  difficulty: 'Advanced',
  summary:
    'Build neurons, layers, embeddings, softmax, and attention by hand, so the parts of a transformer stop being a black box.',
  drills: [
    {
      id: 'neural-networks',
      kind: 'drill',
      title: 'Neuron Bastion',
      concept: 'Neurons and activations',
      xp: 50,
      brief: `A neuron computes \`activation(dot(inputs, weights) + bias)\`.

Write \`neuron(inputs, weights, bias, activation)\`, where \`activation\` is one of:
- \`'linear'\`: the value unchanged
- \`'relu'\`: \`max(0, z)\`
- \`'sigmoid'\`: \`1 / (1 + e^-z)\`

Throw an \`Error\` mentioning \`"shape"\` if \`inputs\` and \`weights\` have different lengths, and one mentioning \`"activation"\` for an unknown activation.`,
      starter: `function neuron(inputs, weights, bias, activation) {
  // your code here
}
`,
      tests: [
        { name: 'linear neuron', code: `expect(neuron([1, 2], [3, 4], 1, 'linear')).toBe(12)` },
        { name: 'relu clips negatives', code: `expect(neuron([1, 2], [-3, 1], 0, 'relu')).toBe(0)` },
        { name: 'relu keeps positives', code: `expect(neuron([2], [2], 1, 'relu')).toBe(5)` },
        { name: 'sigmoid of 0 is 0.5', code: `expect(neuron([1], [1], -1, 'sigmoid')).toBeCloseTo(0.5, 6)` },
        { name: 'sigmoid squashes big values', code: `expect(neuron([10], [1], 0, 'sigmoid')).toBeCloseTo(0.99995, 5)` },
        { name: 'shape mismatch throws', code: `expect(() => neuron([1, 2, 3], [1, 2], 0, 'linear')).toThrow('shape')` },
        { name: 'unknown activation throws', code: `expect(() => neuron([1], [1], 0, 'tanhh')).toThrow('activation')` },
      ],
      hints: [
        'Compute z first, then apply the activation.',
        '`Math.exp(-z)` gives e^-z.',
        'The shape check comes before any math. Shape bugs are the most common deep learning error in practice.',
      ],
    },
    {
      id: 'embeddings',
      kind: 'drill',
      title: 'Embedding Vault',
      concept: 'Embeddings and similarity search',
      xp: 55,
      brief: `Embeddings put similar meanings close together as vectors. Write \`topK(query, items, k)\`.

\`items\` look like \`{ id, vector }\`. Return the \`k\` ids whose vectors have the highest cosine similarity to \`query\`, best first. When two items tie, keep their original order.

This is what a vector database does under the hood.`,
      starter: `function topK(query, items, k) {
  // your code here
}
`,
      tests: [
        {
          name: 'finds the nearest item',
          code: `const items = [{ id: 'cat', vector: [1, 0.1] }, { id: 'car', vector: [0, 1] }]
expect(topK([1, 0], items, 1)).toEqual(['cat'])`,
        },
        {
          name: 'ranks by similarity, not raw size',
          code: `const items = [{ id: 'big', vector: [10, 10] }, { id: 'aligned', vector: [0.1, 0] }, { id: 'away', vector: [-1, 0] }]
expect(topK([1, 0], items, 3)).toEqual(['aligned', 'big', 'away'])`,
        },
        {
          name: 'keeps order on ties',
          code: `const items = [{ id: 'a', vector: [1, 0] }, { id: 'b', vector: [2, 0] }]
expect(topK([1, 0], items, 2)).toEqual(['a', 'b'])`,
        },
        {
          name: 'k larger than the list',
          code: `expect(topK([1], [{ id: 'only', vector: [1] }], 5)).toEqual(['only'])`,
        },
      ],
      hints: [
        'Score every item, then sort by score from high to low. JavaScript sort is stable, so ties keep their order.',
        'Bring cosineSimilarity from Vector Bridge.',
        '`.slice(0, k)` takes the first k items.',
      ],
    },
    {
      id: 'transformers',
      kind: 'drill',
      title: 'Attention Spire',
      concept: 'Softmax and attention',
      xp: 60,
      brief: `Attention is how a transformer decides what to focus on. Write:

\`softmax(xs)\`: turns scores into probabilities that sum to 1. Subtract the max score first so large numbers do not overflow.

\`attend(query, keys, values)\`: score each key with \`dot(query, key) / sqrt(d)\`, where \`d\` is the query length. Softmax the scores, then return the weighted sum of \`values\` (a vector).`,
      starter: `function softmax(xs) {
  // your code here
}

function attend(query, keys, values) {
  // your code here
}
`,
      tests: [
        {
          name: 'softmax sums to 1',
          code: `const p = softmax([1, 2, 3])
expect(p[0] + p[1] + p[2]).toBeCloseTo(1, 9)
expect(p[2]).toBeCloseTo(0.66524, 4)`,
        },
        { name: 'equal scores give equal weights', code: `expect(softmax([5, 5])).toEqual([0.5, 0.5])` },
        {
          name: 'softmax survives huge numbers',
          code: `const p = softmax([1000, 1000, 1000])
expect(p[0]).toBeCloseTo(1 / 3, 6)`,
        },
        {
          name: 'attention focuses on the matching key',
          code: `const out = attend([10, 0], [[10, 0], [0, 10]], [[1, 0], [0, 1]])
expect(out[0]).toBeCloseTo(1, 4)
expect(out[1]).toBeCloseTo(0, 4)`,
        },
        {
          name: 'attention blends when unsure',
          code: `const out = attend([0, 0], [[1, 0], [0, 1]], [[2, 4], [4, 8]])
expect(out).toEqual([3, 6])`,
        },
      ],
      hints: [
        'softmax: exps = xs.map(x => Math.exp(x - max)), then divide each by their sum.',
        'The output has the same length as one value vector. Start from zeros and add weight[i] * values[i].',
      ],
    },
  ],
  boss: {
    id: 'boss-deep-learning',
    kind: 'boss',
    title: 'The Shape Colossus',
    concept: 'A small neural network, end to end',
    xp: 220,
    brief: `A network is a list of layers: \`{ weights, biases, activation }\`. \`weights\` holds one row per output neuron, and each row is as long as the layer's input.

Write three functions:
- \`forward(input, layers)\`: runs the input through every layer and returns the final vector. Throw an \`Error\` mentioning \`"shape"\` on any size mismatch.
- \`predict(input, layers, labels)\`: softmaxes the output and returns \`{ label, confidence }\` for the most likely label.
- \`retrieve(input, layers, library, k)\`: uses \`forward(input)\` as an embedding and returns the top \`k\` library ids by cosine similarity. Library items look like \`{ id, vector }\`.`,
    starter: `function forward(input, layers) {
  // your code here
}

function predict(input, layers, labels) {
  // your code here
}

function retrieve(input, layers, library, k) {
  // your code here
}
`,
    tests: [
      {
        name: 'single linear layer',
        trains: 'neural-networks',
        code: `const layers = [{ weights: [[1, 2], [0, 1]], biases: [0, 1], activation: 'linear' }]
expect(forward([3, 4], layers)).toEqual([11, 5])`,
      },
      {
        name: 'stacks layers with relu',
        trains: 'neural-networks',
        code: `const layers = [
  { weights: [[1, -1], [-1, 1]], biases: [0, 0], activation: 'relu' },
  { weights: [[2, 3]], biases: [1], activation: 'linear' },
]
expect(forward([5, 2], layers)).toEqual([7])`,
      },
      {
        name: 'catches shape errors between layers',
        trains: 'neural-networks',
        code: `const layers = [
  { weights: [[1, 0], [0, 1]], biases: [0, 0], activation: 'linear' },
  { weights: [[1, 1, 1]], biases: [0], activation: 'linear' },
]
expect(() => forward([1, 2], layers)).toThrow('shape')`,
      },
      {
        name: 'predicts the most likely label',
        trains: 'transformers',
        code: `const layers = [{ weights: [[1, 0], [0, 1], [0, 0]], biases: [0, 0, 0], activation: 'linear' }]
const r = predict([2, 0], layers, ['cat', 'dog', 'bird'])
expect(r.label).toBe('cat')
expect(r.confidence).toBeCloseTo(Math.exp(2) / (Math.exp(2) + 2), 6)`,
      },
      {
        name: 'retrieves by embedding similarity',
        trains: 'embeddings',
        code: `const layers = [{ weights: [[1, 0], [0, 1]], biases: [0, 0], activation: 'relu' }]
const library = [{ id: 'north', vector: [0, 1] }, { id: 'east', vector: [1, 0] }, { id: 'ne', vector: [1, 1] }]
expect(retrieve([3, 0.2], layers, library, 2)).toEqual(['east', 'ne'])`,
      },
    ],
    hints: [
      'Each layer is a list of neurons: one neuron per row of weights. Reuse your Neuron Bastion function.',
      'A layer output becomes the next layer input. `layers.reduce(...)` fits nicely here.',
      'predict = softmax(forward(...)), then pick the index of the highest probability.',
    ],
  },
}
