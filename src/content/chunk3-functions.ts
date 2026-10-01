import type { Chunk } from './types.ts'

export const functionsChunk: Chunk = {
  id: 'functions',
  name: 'Functions and Return Values',
  summary: 'Wrap steps in a named function that takes inputs and hands back a result.',
  drills: [
    {
      id: 'f-def',
      chunk: 'functions',
      skill: 'Define a function that returns a value',
      type: 'write',
      title: 'The First Oath',
      prompt: 'Write `greet(name)` so it returns `"Welcome, "` followed by the name, e.g. `greet("Ash")` returns `"Welcome, Ash"`.',
      starter: 'def greet(name):\n    pass\n',
      tests: [
        { id: 'ash', call: 'greet("Ash")', expected: "'Welcome, Ash'" },
        { id: 'empty', call: 'greet("")', expected: "'Welcome, '" },
      ],
      solution: 'def greet(name):\n    return "Welcome, " + name\n',
      souls: 15,
      reviewXp: 6,
    },
    {
      id: 'f-return',
      chunk: 'functions',
      skill: 'Return a result instead of printing it',
      type: 'fix',
      title: 'The Silent Echo',
      prompt:
        '`double` shows the right number but hands nothing back, so `double(4)` is `None`. Fix it so it returns the doubled number.',
      starter: 'def double(n):\n    print(n * 2)\n',
      tests: [
        { id: 'four', call: 'double(4)', expected: '8' },
        { id: 'zero', call: 'double(0)', expected: '0' },
      ],
      solution: 'def double(n):\n    return n * 2\n',
      souls: 20,
      reviewXp: 8,
    },
    {
      id: 'f-params',
      chunk: 'functions',
      skill: 'Use parameters and guard their values',
      type: 'reorder',
      title: 'The Floor of Steel',
      prompt:
        'Put the lines in order to build `damage(base, multiplier)`: a multiplier below 1 counts as 1, then return base times multiplier.',
      lines: ['    return base * multiplier', 'def damage(base, multiplier):', '    if multiplier < 1:', '        multiplier = 1'],
      solutionOrder: [1, 2, 3, 0],
      tests: [
        { id: 'double', call: 'damage(10, 2)', expected: '20' },
        { id: 'floor', call: 'damage(10, 0)', expected: '10' },
      ],
      souls: 15,
      reviewXp: 6,
    },
    {
      id: 'f-call',
      chunk: 'functions',
      skill: 'Trace what a function call changes',
      type: 'predict',
      title: 'The Unchanged Flask',
      prompt: 'Read the code. What does it print? Type the exact output, one value per line.',
      code: 'def heal(hp):\n    return hp + 10\n\nhp = 5\nheal(hp)\nprint(hp)\nprint(heal(heal(hp)))\n',
      expectedOutput: '5\n25',
      souls: 15,
      reviewXp: 6,
    },
  ],
  boss: {
    id: 'boss-function-knight',
    chunk: 'functions',
    name: 'The Function Knight',
    epithet: 'Sworn to Return',
    final: false,
    prompt:
      'Write `armor_after(armor, hits)`. Each hit removes 2 armor. Return the armor left, but never less than 0.\n\n' +
      'Example: `armor_after(10, 3)` returns `4`.',
    starter: 'def armor_after(armor, hits):\n    pass\n',
    tests: [
      { id: 'three-hits', call: 'armor_after(10, 3)', expected: '4' },
      { id: 'no-hits', call: 'armor_after(10, 0)', expected: '10' },
      { id: 'floor', call: 'armor_after(3, 5)', expected: '0' },
      { id: 'returns', call: 'armor_after(4, 1) is not None', expected: 'True' },
      { id: 'named', call: 'armor_after(armor=6, hits=2)', expected: '2' },
    ],
    examples: ['three-hits'],
    routes: {
      'three-hits': 'f-def',
      'no-hits': 'f-call',
      floor: 'f-params',
      returns: 'f-return',
      named: 'f-def',
    },
    hints: [
      'Work out the armor lost from the hits, take it away, then make sure the result cannot drop below 0.',
      'Return the number. Printing it does not hand it back to whoever called the function.',
    ],
    xp: 120,
    solution:
      'def armor_after(armor, hits):\n    left = armor - hits * 2\n    if left < 0:\n        left = 0\n    return left\n',
  },
}
