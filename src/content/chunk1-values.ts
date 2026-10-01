import type { Chunk } from './types.ts'

export const valuesChunk: Chunk = {
  id: 'values',
  name: 'Values and Variables',
  summary: 'Name things, do arithmetic with them, and build text from them.',
  drills: [
    {
      id: 'v-assign',
      chunk: 'values',
      skill: 'Store values in named variables',
      type: 'write',
      title: 'Name the Hollow',
      prompt:
        'Create a variable `hero` holding the text `"Ash"`, and a variable `level` holding the number `3`.',
      starter: '# Your code here\n',
      tests: [
        { id: 'hero', call: 'hero', expected: "'Ash'" },
        { id: 'level', call: 'level', expected: '3' },
      ],
      solution: 'hero = "Ash"\nlevel = 3\n',
      souls: 10,
      reviewXp: 5,
    },
    {
      id: 'v-arith',
      chunk: 'values',
      skill: 'Update a variable step by step',
      type: 'predict',
      title: 'Ledger of Wounds',
      prompt: 'Read the code. What does it print? Type the exact output.',
      code: 'hp = 20\nhp = hp - 5\nhp = hp * 2\nprint(hp)\n',
      expectedOutput: '30',
      souls: 10,
      reviewXp: 5,
    },
    {
      id: 'v-fstring',
      chunk: 'values',
      skill: 'Build text from values with f-strings',
      type: 'fix',
      title: 'The Mismatched Rune',
      prompt:
        'This crashes: Python cannot add text and a number. Fix it so `message` is `"Level 3"`, built from the `level` variable.',
      starter: 'level = 3\nmessage = "Level " + level\n',
      tests: [{ id: 'message', call: 'message', expected: "'Level 3'" }],
      solution: 'level = 3\nmessage = f"Level {level}"\n',
      souls: 15,
      reviewXp: 6,
    },
    {
      id: 'v-swap',
      chunk: 'values',
      skill: 'Order of assignments matters',
      type: 'reorder',
      title: 'Exchange of Arms',
      prompt:
        'Put the lines in order so that, at the end, `a` holds `"shield"` and `b` holds `"sword"`. Use `temp` to keep a value safe.',
      lines: ['a = b', 'temp = a', 'b = temp', 'a = "sword"', 'b = "shield"'],
      solutionOrder: [3, 4, 1, 0, 2],
      tests: [
        { id: 'a', call: 'a', expected: "'shield'" },
        { id: 'b', call: 'b', expected: "'sword'" },
      ],
      souls: 15,
      reviewXp: 6,
    },
  ],
  boss: {
    id: 'boss-hollow-variable',
    chunk: 'values',
    name: 'The Hollow Variable',
    epithet: 'Keeper of Forgotten Values',
    final: false,
    prompt:
      'A hero has `hp = 50` and `potions = 3`; each potion heals `heal_per_potion`.\n\n' +
      'Drink every potion. Afterwards:\n' +
      '- `healed_hp` is the hp after all the potions\n' +
      '- `status` is the text `"HP 95 after 3 potions"`, built from your variables\n' +
      '- `potions` is `0`, because they are all used\n' +
      '- `hp` still holds the starting hp',
    starter:
      'hp = 50\npotions = 3\nheal_per_potion = 15\n\n# Set healed_hp, status, and potions\n',
    tests: [
      { id: 'healed', call: 'healed_hp', expected: '95' },
      { id: 'status', call: 'status', expected: "'HP 95 after 3 potions'" },
      { id: 'potions-used', call: 'potions', expected: '0' },
      { id: 'hp-kept', call: 'hp', expected: '50' },
    ],
    examples: ['healed'],
    routes: {
      healed: 'v-arith',
      status: 'v-fstring',
      'potions-used': 'v-swap',
      'hp-kept': 'v-assign',
    },
    hints: [
      'Do the healing maths with the three variables, then build the text with an f-string.',
      'Order matters: use `potions` for the maths and the text before you set it to 0.',
    ],
    xp: 60,
    solution:
      'hp = 50\npotions = 3\nheal_per_potion = 15\n\n' +
      'healed_hp = hp + potions * heal_per_potion\n' +
      'status = f"HP {healed_hp} after {potions} potions"\n' +
      'potions = 0\n',
  },
}
