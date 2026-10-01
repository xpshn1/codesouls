// The learner's progress and every rule that changes it (spec FR-6–FR-15, NFR-1).
// Pure functions only: the same progress, action and day always give the same result.
import { bossById, bossSkills, drillById } from '../content/index.ts'
import type { ChunkId } from '../content/types.ts'
import type { TestResult } from '../engine/types.ts'
import { afterReview, startSchedule } from './reviews.ts'

export const PROGRESS_VERSION = 1

export type SkillState = {
  passedOn: string
  /** How many reviews in a row have passed (index into the review gaps). */
  step: number
  /** Day the next review is due, or null once retired. */
  nextReview: string | null
}

export type BossState = { deaths: number; beaten: boolean }

export type Progress = {
  version: typeof PROGRESS_VERSION
  /** Keyed by skill id (= the drill id that trains it). */
  skills: Record<string, SkillState>
  drillsPassed: string[]
  bosses: Record<string, BossState>
  souls: { banked: number; unbanked: Record<ChunkId, number> }
  xp: number
  reviews: { taken: number; kept: number }
  drafts: Record<string, string>
}

export function newProgress(): Progress {
  return {
    version: PROGRESS_VERSION,
    skills: {},
    drillsPassed: [],
    bosses: {},
    souls: { banked: 0, unbanked: { values: 0, loops: 0, functions: 0, final: 0 } },
    xp: 0,
    reviews: { taken: 0, kept: 0 },
    drafts: {},
  }
}

export type Action =
  | { type: 'challengeResolved'; bossId: string; results: TestResult[]; today: string }
  | { type: 'drillPassed'; drillId: string; today: string }
  | { type: 'reviewResolved'; drillId: string; passed: boolean; today: string }
  | { type: 'draftSaved'; challengeId: string; code: string }
  | { type: 'replaced'; progress: Progress }

export function bossState(progress: Progress, bossId: string): BossState {
  return progress.bosses[bossId] ?? { deaths: 0, beaten: false }
}

export function allPassed(results: TestResult[]): boolean {
  return results.length > 0 && results.every((r) => r.status === 'pass')
}

/** Boss health as a percentage: the share of tests still failing (FR-8). */
export function healthPercent(results: TestResult[], totalTests: number): number {
  const passed = results.filter((r) => r.status === 'pass').length
  return Math.round(((totalTests - passed) / totalTests) * 100)
}

/** How many hints are unlocked: 1 after the 1st death, 2 after the 3rd (FR-11). */
export function hintsUnlocked(deaths: number): 0 | 1 | 2 {
  return deaths >= 3 ? 2 : deaths >= 1 ? 1 : 0
}

function passSkill(progress: Progress, skillId: string, today: string): Progress {
  if (progress.skills[skillId]) return progress
  return { ...progress, skills: { ...progress.skills, [skillId]: startSchedule(today) } }
}

export function reduce(progress: Progress, action: Action): Progress {
  switch (action.type) {
    case 'challengeResolved': {
      const boss = bossById(action.bossId)
      if (!boss) return progress
      const state = bossState(progress, boss.id)
      if (!allPassed(action.results)) {
        // A death: counted, souls kept (FR-10).
        return { ...progress, bosses: { ...progress.bosses, [boss.id]: { ...state, deaths: state.deaths + 1 } } }
      }
      if (state.beaten) return progress // no second reward
      let next: Progress = {
        ...progress,
        bosses: { ...progress.bosses, [boss.id]: { ...state, beaten: true } },
        xp: progress.xp + boss.xp,
        souls: {
          banked: progress.souls.banked + progress.souls.unbanked[boss.chunk],
          unbanked: { ...progress.souls.unbanked, [boss.chunk]: 0 },
        },
      }
      for (const skillId of bossSkills(boss)) next = passSkill(next, skillId, action.today)
      return next
    }
    case 'drillPassed': {
      const drill = drillById(action.drillId)
      if (!drill || progress.drillsPassed.includes(drill.id)) return progress // no farming (FR-12)
      const chunkBeaten = Object.entries(progress.bosses).some(
        ([bossId, state]) => state.beaten && bossById(bossId)?.chunk === drill.chunk,
      )
      const souls = chunkBeaten
        ? { ...progress.souls, banked: progress.souls.banked + drill.souls }
        : {
            ...progress.souls,
            unbanked: { ...progress.souls.unbanked, [drill.chunk]: progress.souls.unbanked[drill.chunk] + drill.souls },
          }
      return passSkill({ ...progress, drillsPassed: [...progress.drillsPassed, drill.id], souls }, drill.id, action.today)
    }
    case 'reviewResolved': {
      const skill = progress.skills[action.drillId]
      const drill = drillById(action.drillId)
      if (!skill || !drill) return progress
      return {
        ...progress,
        skills: { ...progress.skills, [action.drillId]: afterReview(skill, action.passed, action.today) },
        xp: progress.xp + (action.passed ? drill.reviewXp : 0),
        reviews: {
          taken: progress.reviews.taken + 1,
          kept: progress.reviews.kept + (action.passed ? 1 : 0),
        },
      }
    }
    case 'draftSaved':
      return { ...progress, drafts: { ...progress.drafts, [action.challengeId]: action.code } }
    case 'replaced':
      return action.progress
  }
}

/** Total unbanked souls across all chunks. */
export function unbankedTotal(progress: Progress): number {
  return Object.values(progress.souls.unbanked).reduce((sum, n) => sum + n, 0)
}
