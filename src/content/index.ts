import { deepLearning } from './deepLearning'
import { math } from './math'
import { ml } from './ml'
import { finalBoss, production } from './production'
import { programming } from './programming'
import type { Campaign, Challenge } from './types'

export const campaigns: Campaign[] = [programming, math, ml, deepLearning, production]

export { finalBoss }

export const allChallenges: Challenge[] = [
  ...campaigns.flatMap((campaign) => [...campaign.drills, campaign.boss]),
  finalBoss,
]

const byId = new Map(allChallenges.map((challenge) => [challenge.id, challenge]))

export function getChallenge(id: string): Challenge | undefined {
  return byId.get(id)
}

export function campaignOf(challengeId: string): Campaign | undefined {
  return campaigns.find(
    (campaign) =>
      campaign.boss.id === challengeId ||
      campaign.drills.some((drill) => drill.id === challengeId),
  )
}
