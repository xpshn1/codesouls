// AC-4–AC-11: the rules of the boss loop, souls, XP, rank and reviews.
import { describe, expect, it } from 'vitest'
import { bossById, bosses, drillById, exampleTests } from '../src/content/index.ts'
import type { TestResult } from '../src/engine/types.ts'
import { addDays } from '../src/game/dates.ts'
import {
  bossState,
  healthPercent,
  hintsUnlocked,
  newProgress,
  reduce,
  unbankedTotal,
  type Progress,
} from '../src/game/progress.ts'
import { rankFor } from '../src/game/rank.ts'
import { dueReviews } from '../src/game/reviews.ts'

const DAY0 = '2026-10-01'
const finalBoss = bossById('boss-damage-calculator')!

function results(passing: number, total: number): TestResult[] {
  return Array.from({ length: total }, (_, i) => ({ id: `t${i}`, status: i < passing ? 'pass' : 'fail' }))
}

describe('boss loop', () => {
  it('every boss, including the final one, is open from the start (AC-4, FR-6)', () => {
    const progress = newProgress()
    for (const boss of bosses) expect(bossState(progress, boss.id)).toEqual({ deaths: 0, beaten: false })
  })

  it('Run uses only the 1–2 visible examples (AC-5, FR-7)', () => {
    expect(exampleTests(finalBoss).map((t) => t.id)).toEqual(['several', 'single'])
  })

  it('a 4-of-5 challenge leaves health at 20%, counts a death, keeps souls (AC-6, FR-8, FR-10)', () => {
    let progress = reduce(newProgress(), { type: 'drillPassed', drillId: 'e-negative', today: DAY0 })
    const soulsBefore = unbankedTotal(progress)
    const outcome = results(4, 5)
    expect(healthPercent(outcome, 5)).toBe(20)
    progress = reduce(progress, { type: 'challengeResolved', bossId: finalBoss.id, results: outcome, today: DAY0 })
    expect(bossState(progress, finalBoss.id)).toEqual({ deaths: 1, beaten: false })
    expect(unbankedTotal(progress)).toBe(soulsBefore)
    expect(progress.xp).toBe(0)
  })

  it('unlocks hint 1 after the 1st death and hint 2 after the 3rd (AC-7, FR-11)', () => {
    expect([0, 1, 2, 3, 4].map(hintsUnlocked)).toEqual([0, 1, 1, 2, 2])
  })

  it('a full pass beats the boss, adds XP, banks the chunk souls, starts reviews (AC-8, FR-9)', () => {
    let progress = reduce(newProgress(), { type: 'drillPassed', drillId: 'e-negative', today: DAY0 })
    progress = reduce(progress, { type: 'drillPassed', drillId: 'l-total', today: DAY0 })
    progress = reduce(progress, { type: 'challengeResolved', bossId: finalBoss.id, results: results(5, 5), today: DAY0 })
    expect(bossState(progress, finalBoss.id).beaten).toBe(true)
    expect(progress.xp).toBe(finalBoss.xp)
    expect(progress.souls.banked).toBe(drillById('e-negative')!.souls)
    expect(progress.souls.unbanked.final).toBe(0)
    expect(progress.souls.unbanked.loops).toBe(drillById('l-total')!.souls) // other chunks stay unbanked
    for (const id of ['e-empty', 'e-negative', 'e-trace']) expect(progress.skills[id].nextReview).toBe(addDays(DAY0, 1))
  })

  it('beating a boss again gives nothing more', () => {
    let progress = reduce(newProgress(), { type: 'challengeResolved', bossId: finalBoss.id, results: results(5, 5), today: DAY0 })
    progress = reduce(progress, { type: 'challengeResolved', bossId: finalBoss.id, results: results(5, 5), today: DAY0 })
    expect(progress.xp).toBe(finalBoss.xp)
  })
})

describe('drills and souls', () => {
  it('passing a drill twice gives souls only once (AC-9, FR-12)', () => {
    let progress = reduce(newProgress(), { type: 'drillPassed', drillId: 'v-assign', today: DAY0 })
    const once = unbankedTotal(progress)
    progress = reduce(progress, { type: 'drillPassed', drillId: 'v-assign', today: DAY0 })
    expect(unbankedTotal(progress)).toBe(once)
    expect(once).toBe(drillById('v-assign')!.souls)
  })

  it('a drill passed after its boss fell banks souls at once', () => {
    let progress = reduce(newProgress(), {
      type: 'challengeResolved',
      bossId: 'boss-hollow-variable',
      results: results(4, 4),
      today: DAY0,
    })
    progress = reduce(progress, { type: 'drillPassed', drillId: 'v-assign', today: DAY0 })
    expect(progress.souls.banked).toBe(drillById('v-assign')!.souls)
  })

  it('drills give no XP; XP comes only from bosses and reviews (FR-13)', () => {
    const progress = reduce(newProgress(), { type: 'drillPassed', drillId: 'v-assign', today: DAY0 })
    expect(progress.xp).toBe(0)
  })
})

describe('rank (AC-10, FR-13)', () => {
  it('follows the thresholds', () => {
    expect(rankFor(95).name).toBe('Hollow')
    expect(rankFor(105).name).toBe('Kindled')
    expect(rankFor(250).name).toBe('Ashen')
    expect(rankFor(450).name).toBe('Unkindled Lord')
    expect(rankFor(450).next).toBeNull()
    expect(rankFor(175).progress).toBe(0.5)
  })
})

describe('reviews (AC-11, FR-14, FR-15)', () => {
  const passOn = (progress: Progress, day: string) =>
    reduce(progress, { type: 'reviewResolved', drillId: 'v-assign', passed: true, today: day })

  it('falls due on days 1, 4, 11 and 32, then retires', () => {
    let progress = reduce(newProgress(), { type: 'drillPassed', drillId: 'v-assign', today: DAY0 })
    const dueDays: string[] = []
    for (let i = 0; i < 4; i++) {
      const day = progress.skills['v-assign'].nextReview!
      dueDays.push(day)
      expect(dueReviews(progress, addDays(day, -1))).not.toContain('v-assign')
      expect(dueReviews(progress, day)).toContain('v-assign')
      progress = passOn(progress, day)
    }
    expect(dueDays).toEqual([1, 4, 11, 32].map((n) => addDays(DAY0, n)))
    expect(progress.skills['v-assign'].nextReview).toBeNull()
    expect(progress.reviews).toEqual({ taken: 4, kept: 4 })
    expect(progress.xp).toBe(4 * drillById('v-assign')!.reviewXp)
  })

  it('a failed review is due again the next day', () => {
    let progress = reduce(newProgress(), { type: 'drillPassed', drillId: 'v-assign', today: DAY0 })
    progress = passOn(progress, addDays(DAY0, 1))
    progress = reduce(progress, { type: 'reviewResolved', drillId: 'v-assign', passed: false, today: addDays(DAY0, 4) })
    expect(progress.skills['v-assign'].nextReview).toBe(addDays(DAY0, 5))
    expect(progress.reviews).toEqual({ taken: 2, kept: 1 })
  })

  it('stays due when skipped for days', () => {
    const progress = reduce(newProgress(), { type: 'drillPassed', drillId: 'v-assign', today: DAY0 })
    expect(dueReviews(progress, addDays(DAY0, 9))).toEqual(['v-assign'])
  })
})

describe('determinism (NFR-1)', () => {
  it('gives the same result for the same inputs', () => {
    const run = () =>
      reduce(reduce(newProgress(), { type: 'drillPassed', drillId: 'l-for', today: DAY0 }), {
        type: 'challengeResolved',
        bossId: 'boss-warden-of-loops',
        results: results(3, 6),
        today: DAY0,
      })
    expect(run()).toEqual(run())
  })
})
