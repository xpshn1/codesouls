import type { Campaign } from './types'

export const ml: Campaign = {
  id: 'machine-learning',
  title: 'Data and Machine Learning',
  domain: 'Models',
  difficulty: 'Apprentice',
  summary:
    'Clean data, train a model with gradient descent you write yourself, and check whether its predictions hold up.',
  drills: [
    {
      id: 'datasets',
      kind: 'drill',
      title: 'Dataset Marsh',
      concept: 'Data cleaning',
      xp: 35,
      brief: `Real data is messy. Write \`cleanRows(rows, fields)\` that keeps only rows where every field in \`fields\` is a real, finite number.

Numeric strings like \`"3.5"\` should be converted to numbers. Blank strings, \`null\`, \`undefined\`, \`NaN\`, and text like \`"n/a"\` should drop the row.

Return new row objects. Do not change the input.`,
      starter: `function cleanRows(rows, fields) {
  // your code here
}
`,
      tests: [
        {
          name: 'keeps good rows',
          code: `expect(cleanRows([{ x: 1, y: 2 }, { x: 3, y: 4 }], ['x', 'y'])).toEqual([{ x: 1, y: 2 }, { x: 3, y: 4 }])`,
        },
        {
          name: 'drops missing values',
          code: `expect(cleanRows([{ x: 1, y: null }, { x: undefined, y: 2 }, { x: 5, y: 6 }], ['x', 'y'])).toEqual([{ x: 5, y: 6 }])`,
        },
        {
          name: 'drops NaN, blanks, and junk text',
          code: `expect(cleanRows([{ x: NaN }, { x: '' }, { x: 'n/a' }, { x: '  ' }, { x: 7 }], ['x'])).toEqual([{ x: 7 }])`,
        },
        {
          name: 'converts numeric strings',
          code: `expect(cleanRows([{ x: '3.5', y: '10' }], ['x', 'y'])).toEqual([{ x: 3.5, y: 10 }])`,
        },
        {
          name: 'does not change the input',
          code: `const rows = [{ x: '2' }]
cleanRows(rows, ['x'])
expect(rows[0].x).toBe('2')`,
        },
      ],
      hints: [
        '`Number("3.5")` is 3.5, `Number("n/a")` is NaN, and `Number("")` is 0. Blank strings need their own check.',
        '`Number.isFinite(value)` is false for NaN and Infinity.',
        'Build each output row with a spread (`{ ...row }`) and then overwrite the converted fields.',
      ],
    },
    {
      id: 'training',
      kind: 'drill',
      title: 'Training Grounds',
      concept: 'Gradient descent',
      xp: 45,
      brief: `Train a line \`y = w * x + b\` from scratch.

Write \`fitLine(xs, ys, learningRate, steps)\`. Start with \`w = 0, b = 0\`. On each step, nudge \`w\` and \`b\` against the gradient of the mean squared error. Return \`{ w, b }\`.

No libraries. This is the loop that trains every neural network, just in its smallest form.`,
      starter: `function fitLine(xs, ys, learningRate, steps) {
  let w = 0
  let b = 0
  for (let step = 0; step < steps; step++) {
    // 1. predict with the current w and b
    // 2. work out how wrong each prediction is
    // 3. compute the gradients dw and db
    // 4. update w and b
  }
  return { w, b }
}
`,
      tests: [
        {
          name: 'learns y = 2x + 1',
          code: `const m = fitLine([0, 1, 2, 3, 4], [1, 3, 5, 7, 9], 0.05, 2000)
expect(m.w).toBeCloseTo(2, 2)
expect(m.b).toBeCloseTo(1, 2)`,
        },
        {
          name: 'learns a negative slope',
          code: `const m = fitLine([0, 1, 2, 3], [5, 3, 1, -1], 0.05, 3000)
expect(m.w).toBeCloseTo(-2, 2)
expect(m.b).toBeCloseTo(5, 2)`,
        },
        {
          name: 'zero steps leaves the model untrained',
          code: `expect(fitLine([1, 2], [2, 4], 0.1, 0)).toEqual({ w: 0, b: 0 })`,
        },
      ],
      hints: [
        'error_i = (w * x_i + b) - y_i',
        'dw = (2 / n) * sum(error_i * x_i) and db = (2 / n) * sum(error_i)',
        'w = w - learningRate * dw, and the same for b. Work out both gradients before changing either value.',
      ],
    },
    {
      id: 'evaluation',
      kind: 'drill',
      title: 'Evaluation Gate',
      concept: 'Metrics',
      xp: 45,
      brief: `A model is only as good as your way of measuring it. Write two functions.

\`regressionMetrics(truth, preds)\` returns \`{ mse, mae }\`: the mean squared error and the mean absolute error.

\`precisionRecall(truth, preds)\` works on 0/1 labels and returns \`{ precision, recall }\`:
- precision = true positives / predicted positives
- recall = true positives / actual positives
- if a denominator is 0, that value is 0`,
      starter: `function regressionMetrics(truth, preds) {
  // your code here
}

function precisionRecall(truth, preds) {
  // your code here
}
`,
      tests: [
        {
          name: 'mse and mae',
          code: `const m = regressionMetrics([1, 2, 3], [1, 4, 0])
expect(m.mse).toBeCloseTo(13 / 3, 6)
expect(m.mae).toBeCloseTo(5 / 3, 6)`,
        },
        {
          name: 'perfect predictions have zero error',
          code: `expect(regressionMetrics([5, 6], [5, 6])).toEqual({ mse: 0, mae: 0 })`,
        },
        {
          name: 'precision and recall',
          code: `expect(precisionRecall([1, 1, 0, 0, 1], [1, 0, 1, 0, 1])).toEqual({ precision: 2 / 3, recall: 2 / 3 })`,
        },
        {
          name: 'a model that never predicts positive',
          code: `expect(precisionRecall([1, 0, 1], [0, 0, 0])).toEqual({ precision: 0, recall: 0 })`,
        },
      ],
      hints: [
        'Loop over indexes once and keep running totals.',
        'A true positive is truth[i] === 1 && preds[i] === 1.',
      ],
    },
  ],
  boss: {
    id: 'boss-ml',
    kind: 'boss',
    title: 'The Overfit Wyrm',
    concept: 'A full training pipeline',
    xp: 180,
    brief: `Build the whole pipeline. Write \`trainAndEvaluate(rows, options)\`, where rows look like \`{ x, y }\` (some are dirty) and \`options\` is \`{ learningRate, steps }\`.

1. Clean the rows so \`x\` and \`y\` are finite numbers (numeric strings count).
2. Split: the first \`Math.floor(n * 0.8)\` clean rows are the training set, and the rest are the test set.
3. Fit \`y = w * x + b\` on the training set with gradient descent.
4. Return \`{ w, b, trainMse, testMse, dropped }\`, where \`dropped\` is how many rows were removed.

Throw an \`Error\` mentioning \`"rows"\` if fewer than 2 clean rows remain.`,
    starter: `function trainAndEvaluate(rows, options) {
  // your code here
}
`,
    tests: [
      {
        name: 'drops dirty rows',
        trains: 'datasets',
        code: `const rows = [{ x: 0, y: 1 }, { x: 'oops', y: 2 }, { x: 1, y: 3 }, { x: 2, y: null }, { x: 2, y: 5 }, { x: '3', y: '7' }, { x: 4, y: 9 }]
expect(trainAndEvaluate(rows, { learningRate: 0.05, steps: 10 }).dropped).toBe(2)`,
      },
      {
        name: 'learns the line from training data',
        trains: 'training',
        code: `const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => ({ x: x / 3, y: 3 * (x / 3) - 2 }))
const r = trainAndEvaluate(rows, { learningRate: 0.05, steps: 4000 })
expect(r.w).toBeCloseTo(3, 1)
expect(r.b).toBeCloseTo(-2, 1)`,
      },
      {
        name: 'trains only on the first 80%',
        trains: 'training',
        code: `const rows = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 100 }]
const r = trainAndEvaluate(rows, { learningRate: 0.05, steps: 3000 })
expect(r.w).toBeCloseTo(1, 1)
expect(r.testMse > 1000).toBe(true)`,
      },
      {
        name: 'reports train and test error',
        trains: 'evaluation',
        code: `const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => ({ x: x / 3, y: 2 * (x / 3) + 1 }))
const r = trainAndEvaluate(rows, { learningRate: 0.05, steps: 4000 })
expect(r.trainMse).toBeCloseTo(0, 3)
expect(r.testMse).toBeCloseTo(0, 2)`,
      },
      {
        name: 'refuses to train on too little data',
        trains: 'datasets',
        code: `expect(() => trainAndEvaluate([{ x: 1, y: 2 }, { x: 'bad', y: 1 }], { learningRate: 0.1, steps: 10 })).toThrow('rows')`,
      },
    ],
    hints: [
      'This boss is three drills in a row: Dataset Marsh, then Training Grounds, then Evaluation Gate. Bring those functions in.',
      'Split after cleaning, not before.',
      'MSE on the test set is how you catch overfitting: a model can look great on data it has already seen.',
    ],
  },
}
