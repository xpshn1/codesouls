// Saving progress in the browser and backup files (spec FR-16, FR-17, §7).
import { newProgress, PROGRESS_VERSION, type Progress } from './progress.ts'

export const STORAGE_KEY = 'codesouls.progress'
/** Where unreadable saved data is kept until the learner imports a backup or starts over (spec §7). */
export const UNREADABLE_KEY = 'codesouls.progress.unreadable'

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export type LoadResult = { progress: Progress; unreadable: boolean }

type ParseResult = { ok: true; progress: Progress } | { ok: false; message: string }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/** Checks a backup or saved value and returns progress, or why it was refused. */
export function parseProgress(text: string): ParseResult {
  let data: unknown
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, message: 'This file is not a Code Souls backup (it is not valid JSON).' }
  }
  if (!isRecord(data) || typeof data.version !== 'number') {
    return { ok: false, message: 'This file is not a Code Souls backup (no version number).' }
  }
  if (data.version > PROGRESS_VERSION) {
    return { ok: false, message: `This backup is from a newer version of Code Souls (version ${data.version}).` }
  }
  if (data.version !== PROGRESS_VERSION) {
    return { ok: false, message: `This backup's version (${data.version}) is not supported.` }
  }
  const base = newProgress()
  const souls = isRecord(data.souls) ? data.souls : {}
  const shapeOk =
    isRecord(data.skills) &&
    Array.isArray(data.drillsPassed) &&
    isRecord(data.bosses) &&
    typeof souls.banked === 'number' &&
    isRecord(souls.unbanked) &&
    typeof data.xp === 'number' &&
    isRecord(data.reviews) &&
    isRecord(data.drafts)
  if (!shapeOk) return { ok: false, message: 'This backup is damaged or incomplete.' }
  return {
    ok: true,
    progress: {
      ...base,
      ...(data as unknown as Progress),
      souls: {
        banked: souls.banked as number,
        unbanked: { ...base.souls.unbanked, ...(souls.unbanked as Progress['souls']['unbanked']) },
      },
    },
  }
}

export function loadProgress(storage: StorageLike): LoadResult {
  const text = storage.getItem(STORAGE_KEY)
  if (text === null) return { progress: newProgress(), unreadable: false }
  const parsed = parseProgress(text)
  if (parsed.ok) return { progress: parsed.progress, unreadable: false }
  // Keep the unreadable data aside; never overwrite it until the learner chooses (spec §7).
  if (storage.getItem(UNREADABLE_KEY) === null) storage.setItem(UNREADABLE_KEY, text)
  return { progress: newProgress(), unreadable: true }
}

export function saveProgress(storage: StorageLike, progress: Progress) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Storage full or blocked: progress stays in memory for this session.
  }
}

/** Clears the kept unreadable data once the learner has imported or chosen to start over. */
export function discardUnreadable(storage: StorageLike) {
  storage.removeItem(UNREADABLE_KEY)
}

export function exportText(progress: Progress): string {
  return JSON.stringify(progress, null, 2)
}

export function backupFileName(today: string): string {
  return `codesouls-backup-${today}.json`
}
