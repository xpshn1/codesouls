// AC-1 (FR-1, FR-2, FR-3) and the XP part of AC-10 (FR-13): every challenge is real and solvable.
import { beforeAll, describe, expect, it } from 'vitest'
import { bosses, chunks, drillById, drills } from '../src/content/index.ts'
import { assemble, normaliseOutput, type Drill } from '../src/content/types.ts'
import { getPython, printed, run } from './python.ts'

const allPass = (results: { status: string }[]) => results.every((r) => r.status === 'pass')

describe('content shape', () => {
  it('has 4 bosses, the last the Damage Calculator, and 14–18 drills', () => {
    expect(bosses).toHaveLength(4)
    expect(bosses.at(-1)!.name).toBe('Damage Calculator')
    expect(bosses.filter((b) => b.final)).toHaveLength(1)
    expect(drills.length).toBeGreaterThanOrEqual(14)
    expect(drills.length).toBeLessThanOrEqual(18)
  })

  it('uses all four drill types', () => {
    expect(new Set(drills.map((d) => d.type))).toEqual(new Set(['write', 'predict', 'fix', 'reorder']))
  })

  it('has unique ids', () => {
    const ids = [...drills.map((d) => d.id), ...bosses.map((b) => b.id)]
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every drill positive author-set rewards', () => {
    for (const drill of drills) {
      expect(drill.souls, drill.id).toBeGreaterThan(0)
      expect(drill.reviewXp, drill.id).toBeGreaterThan(0)
      expect(drill.chunk).toBe(chunks.find((c) => c.drills.includes(drill))!.id)
    }
  })

  it('offers enough boss XP to reach Unkindled Lord (450)', () => {
    expect(bosses.reduce((sum, b) => sum + b.xp, 0)).toBeGreaterThanOrEqual(450)
  })

  for (const boss of bosses) {
    it(`${boss.name}: 1–2 examples, one route per test to a real drill, two hints`, () => {
      expect(boss.examples.length).toBeGreaterThanOrEqual(1)
      expect(boss.examples.length).toBeLessThanOrEqual(2)
      const testIds = boss.tests.map((t) => t.id)
      for (const example of boss.examples) expect(testIds).toContain(example)
      expect(Object.keys(boss.routes).sort()).toEqual([...testIds].sort())
      for (const drillId of Object.values(boss.routes)) expect(drillById(drillId), drillId).toBeDefined()
      expect(boss.hints.every((h) => h.length > 0)).toBe(true)
      expect(boss.xp).toBeGreaterThan(0)
    })
  }
})

describe('every challenge is solvable and starts unsolved', () => {
  beforeAll(async () => {
    await getPython()
  })

  for (const boss of bosses) {
    it(`boss ${boss.name}`, async () => {
      expect(allPass((await run(boss.solution, boss.tests)).results)).toBe(true)
      expect(allPass((await run(boss.starter, boss.tests)).results)).toBe(false)
    })
  }

  for (const drill of drills) {
    it(`drill ${drill.id} (${drill.type})`, async () => {
      await checkDrill(drill)
    })
  }
})

async function checkDrill(drill: Drill) {
  if (drill.type === 'predict') {
    expect(normaliseOutput(await printed(drill.code))).toBe(normaliseOutput(drill.expectedOutput))
    expect(normaliseOutput('')).not.toBe(normaliseOutput(drill.expectedOutput))
  } else if (drill.type === 'reorder') {
    expect([...drill.solutionOrder].sort()).toEqual(drill.lines.map((_, i) => i))
    expect(allPass((await run(assemble(drill, drill.solutionOrder), drill.tests)).results)).toBe(true)
    const shown = drill.lines.map((_, i) => i)
    expect(allPass((await run(assemble(drill, shown), drill.tests)).results)).toBe(false)
  } else {
    expect(allPass((await run(drill.solution, drill.tests)).results)).toBe(true)
    expect(allPass((await run(drill.starter, drill.tests)).results)).toBe(false)
  }
}
