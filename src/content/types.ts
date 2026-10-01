// Content shapes (spec FR-1, FR-2, FR-3; plan §3). Content is static data; nothing here is random.
import type { TestSpec } from '../engine/types.ts'

export type ChunkId = 'values' | 'loops' | 'functions' | 'final'

type DrillBase = {
  id: string
  chunk: ChunkId
  /** The one skill this drill trains; its review is this drill again (FR-15). */
  skill: string
  title: string
  prompt: string
  /** Author-set reward for a first pass, held unbanked until the chunk's boss falls (FR-12). */
  souls: number
  /** Author-set XP for passing this skill's review (FR-15). */
  reviewXp: number
}

/** Write code, or fix the bug in given code; checked by tests. */
export type CodeDrill = DrillBase & {
  type: 'write' | 'fix'
  starter: string
  tests: TestSpec[]
  solution: string
}

/** Read code and type exactly what it prints. */
export type PredictDrill = DrillBase & {
  type: 'predict'
  code: string
  expectedOutput: string
}

/** Put given lines in order; the assembled code is checked by tests. */
export type ReorderDrill = DrillBase & {
  type: 'reorder'
  /** Lines in the fixed order they are first shown (never shuffled at random). */
  lines: string[]
  /** Indexes into `lines` in the correct order. */
  solutionOrder: number[]
  tests: TestSpec[]
}

export type Drill = CodeDrill | PredictDrill | ReorderDrill

export type Boss = {
  id: string
  chunk: ChunkId
  name: string
  epithet: string
  prompt: string
  starter: string
  tests: TestSpec[]
  /** 1–2 test ids shown before any death (FR-2). */
  examples: string[]
  /** Exactly one drill per test (FR-2). */
  routes: Record<string, string>
  /** Hint 1 unlocks after the 1st death, hint 2 after the 3rd (FR-11). */
  hints: [string, string]
  xp: number
  solution: string
  final: boolean
}

export type Chunk = {
  id: ChunkId
  name: string
  summary: string
  drills: Drill[]
  boss: Boss
}

/** Normalises printed output for predict drills: ignore leading/trailing spaces and line breaks (FR-3). */
export function normaliseOutput(text: string): string {
  return text
    .trim()
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
}

/** Assembles a reorder drill's code from an order of line indexes. */
export function assemble(drill: ReorderDrill, order: number[]): string {
  return order.map((i) => drill.lines[i]).join('\n') + '\n'
}
