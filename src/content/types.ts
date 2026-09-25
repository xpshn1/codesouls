export type TestCase = {
  name: string
  /** JavaScript run after the learner's code. Uses expect(...). */
  code: string
  /** Boss tests only: the drill id that trains the skill this test checks. */
  trains?: string
}

export type Challenge = {
  id: string
  kind: 'drill' | 'boss'
  /** Themed location name, e.g. "Syntax Hollow". */
  title: string
  /** Plain-language concept, e.g. "Variables and functions". */
  concept: string
  xp: number
  /** Short task description. Blank lines separate paragraphs; `code` spans allowed. */
  brief: string
  starter: string
  tests: TestCase[]
  hints: string[]
}

export type Campaign = {
  id: string
  title: string
  domain: string
  difficulty: 'Foundation' | 'Apprentice' | 'Advanced' | 'Production'
  summary: string
  drills: Challenge[]
  boss: Challenge
}
