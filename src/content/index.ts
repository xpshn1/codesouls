import { valuesChunk } from './chunk1-values.ts'
import { loopsChunk } from './chunk2-loops.ts'
import { functionsChunk } from './chunk3-functions.ts'
import { finalChunk } from './final-damage-calculator.ts'
import type { Boss, Chunk, ChunkId, Drill } from './types.ts'

/** The Python Foundations slice, in path order (FR-1). */
export const chunks: Chunk[] = [valuesChunk, loopsChunk, functionsChunk, finalChunk]

export const drills: Drill[] = chunks.flatMap((chunk) => chunk.drills)
export const bosses: Boss[] = chunks.map((chunk) => chunk.boss)

const drillsById = new Map(drills.map((drill) => [drill.id, drill]))
const bossesById = new Map(bosses.map((boss) => [boss.id, boss]))

export function drillById(id: string): Drill | undefined {
  return drillsById.get(id)
}

export function bossById(id: string): Boss | undefined {
  return bossesById.get(id)
}

export function chunkById(id: ChunkId): Chunk {
  return chunks.find((chunk) => chunk.id === id)!
}

/** The visible example tests "Run" uses (FR-7). */
export function exampleTests(boss: Boss) {
  return boss.tests.filter((test) => boss.examples.includes(test.id))
}

/** Skills a boss covers: the skills of its chunk's drills (FR-9). Skill id = drill id. */
export function bossSkills(boss: Boss): string[] {
  return chunkById(boss.chunk).drills.map((drill) => drill.id)
}
