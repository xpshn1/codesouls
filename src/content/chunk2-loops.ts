import type { Chunk } from './types.ts'

export const loopsChunk: Chunk = {
  id: 'loops',
  name: 'Lists and Loops',
  summary: 'Hold many values in a list and walk through them one at a time.',
  drills: [
    {
      id: 'l-index',
      chunk: 'loops',
      skill: 'Read items and length of a list',
      type: 'predict',
      title: 'The Quiver',
      prompt: 'Read the code. What does it print? Type the exact output, one value per line.',
      code: 'attacks = [12, 8, 15]\nprint(attacks[0])\nprint(attacks[-1])\nprint(len(attacks))\n',
      expectedOutput: '12\n15\n3',
      souls: 10,
      reviewXp: 5,
    },
    {
      id: 'l-for',
      chunk: 'loops',
      skill: 'Visit every item with a for loop',
      type: 'write',
      title: 'Twin Strikes',
      prompt:
        'Use a `for` loop to fill `doubled` with every value of `attacks` times 2, in the same order.',
      starter: 'attacks = [12, 8, 15]\ndoubled = []\n\n# Loop here\n',
      tests: [{ id: 'doubled', call: 'doubled', expected: '[24, 16, 30]' }],
      solution: 'attacks = [12, 8, 15]\ndoubled = []\n\nfor attack in attacks:\n    doubled.append(attack * 2)\n',
      souls: 15,
      reviewXp: 6,
    },
    {
      id: 'l-total',
      chunk: 'loops',
      skill: 'Keep a running total',
      type: 'reorder',
      title: 'The Tally',
      prompt: 'Put the lines in order so `total` ends up as the sum of the list.',
      lines: ['    total = total + n', 'print(total)', 'total = 0', 'for n in [4, 6, 10]:'],
      solutionOrder: [2, 3, 0, 1],
      tests: [{ id: 'total', call: 'total', expected: '20' }],
      souls: 15,
      reviewXp: 6,
    },
    {
      id: 'l-start-zero',
      chunk: 'loops',
      skill: 'Start a total at the right value',
      type: 'fix',
      title: 'Where the Count Begins',
      prompt:
        'This crashes when `attacks` is empty, because it reads the first item. Fix it so `total` is correct for any list, including an empty one.',
      starter:
        'attacks = []\ntotal = attacks[0]\nfor attack in attacks[1:]:\n    total = total + attack\n',
      tests: [{ id: 'empty', call: 'total', expected: '0' }],
      solution: 'attacks = []\ntotal = 0\nfor attack in attacks:\n    total = total + attack\n',
      souls: 20,
      reviewXp: 8,
    },
    {
      id: 'l-if',
      chunk: 'loops',
      skill: 'Decide inside a loop with if',
      type: 'write',
      title: 'Count the Hits',
      prompt: 'An attack of `0` is a miss. Use a loop and `if` to set `hits` to the number of attacks that are not 0.',
      starter: 'attacks = [12, 0, 15, 0, 7]\nhits = 0\n\n# Loop here\n',
      tests: [{ id: 'hits', call: 'hits', expected: '3' }],
      solution: 'attacks = [12, 0, 15, 0, 7]\nhits = 0\n\nfor attack in attacks:\n    if attack != 0:\n        hits = hits + 1\n',
      souls: 20,
      reviewXp: 8,
    },
  ],
  boss: {
    id: 'boss-warden-of-loops',
    chunk: 'loops',
    name: 'Warden of Loops',
    epithet: 'Who Counts Every Blow',
    final: false,
    prompt:
      'You are given `log`, a list of attack numbers (it may be empty). Using a `for` loop, set:\n' +
      '- `total` — the sum of all attacks\n' +
      '- `count` — how many attacks there are\n' +
      '- `biggest` — the largest attack, or `0` if the list is empty\n\n' +
      'Every number in `log` is 0 or more. Do not use `sum`, `len` or `max`.',
    starter: '# `log` is given to you, e.g. [12, 8, 15]\n\n',
    tests: [
      { id: 'total', setup: 'log = [12, 8, 15]', call: 'total', expected: '35' },
      { id: 'count', setup: 'log = [12, 8, 15]', call: 'count', expected: '3' },
      { id: 'empty-total', setup: 'log = []', call: 'total', expected: '0' },
      { id: 'empty-biggest', setup: 'log = []', call: 'biggest', expected: '0' },
      { id: 'biggest-middle', setup: 'log = [3, 9, 2]', call: 'biggest', expected: '9' },
      { id: 'count-zeros', setup: 'log = [0, 5, 0]', call: 'count', expected: '3' },
    ],
    examples: ['total', 'count'],
    routes: {
      total: 'l-total',
      count: 'l-for',
      'empty-total': 'l-start-zero',
      'empty-biggest': 'l-start-zero',
      'biggest-middle': 'l-if',
      'count-zeros': 'l-for',
    },
    hints: [
      'Give each result a starting value that is already right for an empty list, then let the loop update it.',
      'For `biggest`, compare each attack with the biggest so far using `if`.',
    ],
    xp: 90,
    solution:
      'total = 0\ncount = 0\nbiggest = 0\nfor attack in log:\n' +
      '    total = total + attack\n    count = count + 1\n    if attack > biggest:\n        biggest = attack\n',
  },
}
