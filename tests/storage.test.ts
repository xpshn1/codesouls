// AC-12 (FR-16, FR-17, spec §7): saving, reloading, backups and refusals.
import { describe, expect, it } from 'vitest'
import { newProgress, reduce } from '../src/game/progress.ts'
import {
  exportText,
  loadProgress,
  parseProgress,
  saveProgress,
  STORAGE_KEY,
  UNREADABLE_KEY,
  type StorageLike,
} from '../src/game/storage.ts'

function memoryStorage(): StorageLike & { data: Map<string, string> } {
  const data = new Map<string, string>()
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
    removeItem: (key) => void data.delete(key),
  }
}

const someProgress = () => {
  let progress = reduce(newProgress(), { type: 'drillPassed', drillId: 'l-for', today: '2026-10-01' })
  progress = reduce(progress, { type: 'draftSaved', challengeId: 'boss-damage-calculator', code: 'def total_damage(a):\n    pass\n' })
  return progress
}

describe('storage', () => {
  it('starts fresh with nothing saved', () => {
    expect(loadProgress(memoryStorage())).toEqual({ progress: newProgress(), unreadable: false })
  })

  it('survives a reload', () => {
    const storage = memoryStorage()
    saveProgress(storage, someProgress())
    expect(loadProgress(storage).progress).toEqual(someProgress())
  })

  it('exports and imports into a fresh browser unchanged', () => {
    const parsed = parseProgress(exportText(someProgress()))
    expect(parsed).toEqual({ ok: true, progress: someProgress() })
  })

  it.each([
    ['not JSON', 'hello'],
    ['random JSON', '{"name": "x"}'],
    ['a newer version', JSON.stringify({ ...newProgress(), version: 2 })],
    ['damaged', JSON.stringify({ version: 1, skills: {} })],
  ])('refuses %s with a message', (_label, text) => {
    const parsed = parseProgress(text)
    expect(parsed.ok).toBe(false)
    if (!parsed.ok) expect(parsed.message.length).toBeGreaterThan(10)
  })

  it('keeps unreadable saved data aside instead of overwriting it', () => {
    const storage = memoryStorage()
    storage.setItem(STORAGE_KEY, '{broken')
    const loaded = loadProgress(storage)
    expect(loaded.unreadable).toBe(true)
    expect(loaded.progress).toEqual(newProgress())
    expect(storage.getItem(UNREADABLE_KEY)).toBe('{broken')
  })
})
