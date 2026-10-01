// Rank follows XP (spec FR-13).

export const RANKS = [
  { name: 'Hollow', xp: 0 },
  { name: 'Kindled', xp: 100 },
  { name: 'Ashen', xp: 250 },
  { name: 'Unkindled Lord', xp: 450 },
] as const

export type RankInfo = {
  name: string
  /** XP where this rank starts. */
  floor: number
  /** XP where the next rank starts, or null at the top. */
  next: number | null
  nextName: string | null
  /** 0–1 progress toward the next rank (1 at the top). */
  progress: number
}

export function rankFor(xp: number): RankInfo {
  let index = 0
  RANKS.forEach((rank, i) => {
    if (xp >= rank.xp) index = i
  })
  const current = RANKS[index]
  const next = RANKS[index + 1]
  return {
    name: current.name,
    floor: current.xp,
    next: next?.xp ?? null,
    nextName: next?.name ?? null,
    progress: next ? (xp - current.xp) / (next.xp - current.xp) : 1,
  }
}
