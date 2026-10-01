// Fixed review schedule (spec FR-14, FR-15): 1, 3, 7, 21 days; a failed review resets to 1 day.
import { drills } from '../content/index.ts'
import { addDays } from './dates.ts'
import type { Progress, SkillState } from './progress.ts'

export const REVIEW_GAPS = [1, 3, 7, 21] as const

/** A skill's state right after it is first passed. */
export function startSchedule(today: string): SkillState {
  return { passedOn: today, step: 0, nextReview: addDays(today, REVIEW_GAPS[0]) }
}

/** A skill's state after a review on `today`. After the 21-day review passes, it is retired (nextReview null). */
export function afterReview(skill: SkillState, passed: boolean, today: string): SkillState {
  if (!passed) return { ...skill, step: 0, nextReview: addDays(today, REVIEW_GAPS[0]) }
  const step = skill.step + 1
  return { ...skill, step, nextReview: step < REVIEW_GAPS.length ? addDays(today, REVIEW_GAPS[step]) : null }
}

/** Skills (drill ids) whose review is due on or before `today`, in slice order. */
export function dueReviews(progress: Progress, today: string): string[] {
  return drills
    .map((drill) => drill.id)
    .filter((id) => {
      const next = progress.skills[id]?.nextReview
      return next != null && next <= today
    })
}
