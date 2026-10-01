import type { Chunk } from './types.ts'

export const finalChunk: Chunk = {
  id: 'final',
  name: 'Edge Cases',
  summary: 'Make code that is right for the strange inputs too: empty, negative, too big.',
  drills: [
    {
      id: 'e-empty',
      chunk: 'final',
      skill: 'Handle an empty list',
      type: 'write',
      title: 'The Empty Hall',
      prompt: 'Write `average(nums)` that returns the average of the numbers, or `0` when the list is empty.',
      starter: 'def average(nums):\n    return sum(nums) / len(nums)\n',
      tests: [
        { id: 'two', call: 'average([2, 4])', expected: '3' },
        { id: 'one', call: 'average([5])', expected: '5' },
        { id: 'empty', call: 'average([])', expected: '0' },
      ],
      solution: 'def average(nums):\n    if len(nums) == 0:\n        return 0\n    return sum(nums) / len(nums)\n',
      souls: 20,
      reviewXp: 8,
    },
    {
      id: 'e-negative',
      chunk: 'final',
      skill: 'Skip values that should not count',
      type: 'fix',
      title: 'Healing in Disguise',
      prompt:
        'Healing spells appear in the list as negative numbers and must not count as damage. Fix `total_damage` so it ignores them.',
      starter:
        'def total_damage(attacks):\n    total = 0\n    for attack in attacks:\n        total = total + attack\n    return total\n',
      tests: [
        { id: 'mixed', call: 'total_damage([5, -3, 2])', expected: '7' },
        { id: 'all-healing', call: 'total_damage([-1, -1])', expected: '0' },
        { id: 'plain', call: 'total_damage([4])', expected: '4' },
      ],
      solution:
        'def total_damage(attacks):\n    total = 0\n    for attack in attacks:\n        if attack > 0:\n            total = total + attack\n    return total\n',
      souls: 20,
      reviewXp: 8,
    },
    {
      id: 'e-trace',
      chunk: 'final',
      skill: 'Trace a starting value through odd inputs',
      type: 'predict',
      title: 'The Lowest Ebb',
      prompt: 'Read the code. What does it print? Type the exact output, one value per line.',
      code:
        'def best(values):\n    top = 0\n    for v in values:\n        if v > top:\n            top = v\n    return top\n\n' +
        'print(best([3, -2, 0]))\nprint(best([-5, -1]))\nprint(best([]))\n',
      expectedOutput: '3\n0\n0',
      souls: 15,
      reviewXp: 6,
    },
  ],
  boss: {
    id: 'boss-damage-calculator',
    chunk: 'final',
    name: 'Damage Calculator',
    epithet: 'The Sum of All Blows',
    final: true,
    prompt:
      'Write `total_damage(attacks)` that returns the total damage from a list of attack numbers:\n' +
      '- an empty list deals `0`\n' +
      '- negative numbers are healing and deal nothing\n' +
      '- any single attack above `100` deals only `100`',
    starter: 'def total_damage(attacks):\n    pass\n',
    tests: [
      { id: 'several', call: 'total_damage([2, 3, 5])', expected: '10' },
      { id: 'single', call: 'total_damage([7])', expected: '7' },
      { id: 'empty', call: 'total_damage([])', expected: '0' },
      { id: 'healing', call: 'total_damage([-4, 4])', expected: '4' },
      { id: 'capped', call: 'total_damage([150, 10])', expected: '110' },
    ],
    examples: ['several', 'single'],
    routes: {
      several: 'l-total',
      single: 'f-def',
      empty: 'l-start-zero',
      healing: 'e-negative',
      capped: 'f-params',
    },
    hints: [
      'Start with a total that is already right for an empty list. Then decide, for each attack, how much it should add.',
      'An attack below 0 adds nothing; an attack above 100 adds only 100.',
    ],
    xp: 200,
    solution:
      'def total_damage(attacks):\n    total = 0\n    for attack in attacks:\n        if attack > 100:\n            attack = 100\n' +
      '        if attack > 0:\n            total = total + attack\n    return total\n',
  },
}
