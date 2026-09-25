import type { Campaign } from './types'

export const programming: Campaign = {
  id: 'programming',
  title: 'Programming Foundations',
  domain: 'Code',
  difficulty: 'Foundation',
  summary:
    'Read, write, and debug small programs. Every later campaign is built from these moves.',
  drills: [
    {
      id: 'variables-functions',
      kind: 'drill',
      title: 'Syntax Hollow',
      concept: 'Variables and functions',
      xp: 20,
      brief: `Write a function \`formatProfile(name, level)\` that returns a label like \`"Ada (Lv. 3)"\`.

If \`level\` is not given, treat it as level 1. Remove extra spaces around the name.`,
      starter: `function formatProfile(name, level) {
  // your code here
}
`,
      tests: [
        { name: 'formats a name and level', code: `expect(formatProfile('Ada', 3)).toBe('Ada (Lv. 3)')` },
        { name: 'works for another learner', code: `expect(formatProfile('Grace', 12)).toBe('Grace (Lv. 12)')` },
        { name: 'defaults to level 1', code: `expect(formatProfile('Linus')).toBe('Linus (Lv. 1)')` },
        { name: 'trims spaces around the name', code: `expect(formatProfile('  Alan  ', 2)).toBe('Alan (Lv. 2)')` },
      ],
      hints: [
        'Template literals build strings: `${name} (Lv. ${level})` (with backticks).',
        'Default parameters look like `function f(level = 1)`.',
        'Strings have a `.trim()` method.',
      ],
    },
    {
      id: 'data-structures',
      kind: 'drill',
      title: 'Inventory Keep',
      concept: 'Arrays and objects',
      xp: 25,
      brief: `Lessons are stored as objects: \`{ title: 'Loops', xp: 30, done: true }\`.

Write \`summarize(lessons)\` that returns \`{ count, doneCount, totalXp, titles }\`:
- \`count\`: how many lessons there are
- \`doneCount\`: how many have \`done: true\`
- \`totalXp\`: XP summed over the **done** lessons only
- \`titles\`: every title, sorted alphabetically`,
      starter: `function summarize(lessons) {
  // your code here
}
`,
      tests: [
        {
          name: 'summarizes a small list',
          code: `expect(summarize([
  { title: 'Loops', xp: 30, done: true },
  { title: 'Arrays', xp: 20, done: false },
  { title: 'Functions', xp: 25, done: true },
])).toEqual({ count: 3, doneCount: 2, totalXp: 55, titles: ['Arrays', 'Functions', 'Loops'] })`,
        },
        {
          name: 'handles an empty list',
          code: `expect(summarize([])).toEqual({ count: 0, doneCount: 0, totalXp: 0, titles: [] })`,
        },
        {
          name: 'does not reorder the original array',
          code: `const lessons = [{ title: 'B', xp: 1, done: true }, { title: 'A', xp: 1, done: true }]
summarize(lessons)
expect(lessons[0].title).toBe('B')`,
        },
      ],
      hints: [
        '`lessons.filter(l => l.done)` keeps only the finished lessons.',
        '`.reduce((sum, l) => sum + l.xp, 0)` adds numbers up.',
        '`.sort()` changes the array it is called on. Copy first with `[...array]` or `.map(...)`.',
      ],
    },
    {
      id: 'debug-loops',
      kind: 'drill',
      title: 'Bugfire Watch',
      concept: 'Loops, conditionals, and errors',
      xp: 35,
      brief: `This \`average(numbers)\` function has bugs. Fix it so that:
- it returns the average of the numbers
- an empty array returns \`0\`
- anything that is not an array throws an \`Error\` whose message contains \`"array"\``,
      starter: `function average(numbers) {
  let total = 0
  for (let i = 0; i <= numbers.length; i++) {
    total += numbers[i]
  }
  return total / numbers.length
}
`,
      tests: [
        { name: 'averages numbers', code: `expect(average([2, 4, 6])).toBe(4)` },
        { name: 'handles decimals', code: `expect(average([1, 2])).toBe(1.5)` },
        { name: 'empty array returns 0', code: `expect(average([])).toBe(0)` },
        { name: 'rejects non-arrays', code: `expect(() => average('1,2,3')).toThrow('array')` },
      ],
      hints: [
        'Run it and use console.log(total) inside the loop. What happens on the last step?',
        'Array indexes go from 0 to length - 1, so the loop condition should be `i < numbers.length`.',
        '`Array.isArray(x)` checks the type. `throw new Error("expected an array")` stops the function.',
      ],
    },
  ],
  boss: {
    id: 'boss-programming',
    kind: 'boss',
    title: 'The Gradebook Daemon',
    concept: 'Combine functions, data, loops, and errors',
    xp: 120,
    brief: `Students look like \`{ name: 'Ada', scores: [90, 70] }\`.

Write \`buildReport(students)\` that returns an array of lines like \`"Ada: 80.0 PASS"\`:
- the average is shown with exactly one decimal place
- \`PASS\` when the average is 60 or higher, otherwise \`FAIL\`
- a student with no scores has an average of 0
- lines are sorted from highest average to lowest
- throw an \`Error\` mentioning \`"array"\` if \`students\` is not an array`,
    starter: `function buildReport(students) {
  // your code here
}
`,
    tests: [
      {
        name: 'formats one student',
        trains: 'variables-functions',
        code: `expect(buildReport([{ name: 'Ada', scores: [90, 70] }])).toEqual(['Ada: 80.0 PASS'])`,
      },
      {
        name: 'marks failing students',
        trains: 'variables-functions',
        code: `expect(buildReport([{ name: 'Bob', scores: [50, 55] }])).toEqual(['Bob: 52.5 FAIL'])`,
      },
      {
        name: 'passes at exactly 60',
        trains: 'debug-loops',
        code: `expect(buildReport([{ name: 'Cy', scores: [60] }])).toEqual(['Cy: 60.0 PASS'])`,
      },
      {
        name: 'no scores means 0.0',
        trains: 'debug-loops',
        code: `expect(buildReport([{ name: 'Di', scores: [] }])).toEqual(['Di: 0.0 FAIL'])`,
      },
      {
        name: 'sorts from highest to lowest',
        trains: 'data-structures',
        code: `expect(buildReport([
  { name: 'Low', scores: [40] },
  { name: 'High', scores: [95, 85] },
  { name: 'Mid', scores: [70] },
])).toEqual(['High: 90.0 PASS', 'Mid: 70.0 PASS', 'Low: 40.0 FAIL'])`,
      },
      {
        name: 'rejects bad input',
        trains: 'debug-loops',
        code: `expect(() => buildReport(null)).toThrow('array')`,
      },
    ],
    hints: [
      'Break it up: write a small average helper first. You already built one at Bugfire Watch.',
      '`number.toFixed(1)` turns 80 into "80.0".',
      'Work out every average, sort the objects by average, then turn them into strings.',
    ],
  },
}
