import { describe, expect, it } from 'vitest'
import { allChallenges, campaigns, getChallenge } from '../src/content'
import { runSuite } from '../src/engine/runner'
import { referenceSolutions } from './referenceSolutions'

describe('challenge content', () => {
  it('has unique ids', () => {
    const ids = allChallenges.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every challenge has a reference solution', () => {
    for (const challenge of allChallenges) {
      expect(referenceSolutions[challenge.id], challenge.id).toBeTypeOf('string')
    }
  })

  it('boss tests point at real challenges', () => {
    for (const challenge of allChallenges.filter((c) => c.kind === 'boss')) {
      for (const test of challenge.tests) {
        expect(test.trains, `${challenge.id}: ${test.name}`).toBeTruthy()
        expect(getChallenge(test.trains!), test.trains).toBeDefined()
      }
    }
  })

  it('campaign bosses only route to their own drills', () => {
    for (const campaign of campaigns) {
      const drillIds = campaign.drills.map((d) => d.id)
      for (const test of campaign.boss.tests) {
        expect(drillIds, `${campaign.id}: ${test.name}`).toContain(test.trains)
      }
    }
  })
})

describe.each(allChallenges.map((c) => [c.id, c] as const))('%s', (_id, challenge) => {
  it('reference solution passes every test', () => {
    const suite = runSuite(referenceSolutions[challenge.id], challenge.tests)
    expect(suite.fatal).toBeUndefined()
    const failing = suite.results.filter((r) => !r.pass)
    expect(failing).toEqual([])
    expect(suite.results).toHaveLength(challenge.tests.length)
  })

  it('starter code does not already pass', () => {
    const suite = runSuite(challenge.starter, challenge.tests)
    expect(suite.results.some((r) => !r.pass)).toBe(true)
  })
})
