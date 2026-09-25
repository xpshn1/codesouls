import { useCallback, useEffect, useState } from 'react'

export type Progress = {
  completed: string[]
  deaths: Record<string, number>
  drafts: Record<string, string>
  hintsShown: Record<string, number>
  /** Boss id -> drill ids the last failed attempt pointed at. */
  retreatTo: Record<string, string[]>
  /** Boss id -> share of boss HP left after the last attempt (0..1). */
  bossHp: Record<string, number>
}

const STORAGE_KEY = 'codesouls.progress.v1'

const empty: Progress = {
  completed: [],
  deaths: {},
  drafts: {},
  hintsShown: {},
  retreatTo: {},
  bossHp: {},
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    return { ...empty, ...(JSON.parse(raw) as Partial<Progress>) }
  } catch {
    return empty
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Storage can be full or blocked (private mode). Progress still works for this visit.
    }
  }, [progress])

  const update = useCallback((change: (current: Progress) => Progress) => {
    setProgress((current) => change(current))
  }, [])

  const reset = useCallback(() => setProgress(empty), [])

  return { progress, update, reset }
}
