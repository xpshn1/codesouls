// @vitest-environment jsdom
// Screen tests: AC-4, AC-5, AC-6, AC-13, AC-14 (screens exist), AC-15 (reduced motion), and each drill type (T010).
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { drillById } from '../src/content/index.ts'
import type { RunnerStatus } from '../src/engine/runner.ts'
import type { RunOutput, TestSpec } from '../src/engine/types.ts'
import { newProgress, reduce, type Progress } from '../src/game/progress.ts'
import { saveProgress, STORAGE_KEY, type StorageLike } from '../src/game/storage.ts'
import App from '../src/ui/App.tsx'
import type { RunnerApi } from '../src/ui/runtime.ts'

// The code editor is a plain textarea here; CodeMirror itself is checked by hand (spec §8).
vi.mock('../src/ui/parts/CodeEditor.tsx', () => ({
  CodeEditor: ({ value, onChange, label }: { value: string; onChange?: (v: string) => void; label: string }) => (
    <textarea aria-label={label} value={value} onChange={(e) => onChange?.(e.target.value)} />
  ),
}))

const TODAY = '2026-10-01'

/** A fake runner: every test passes unless the code contains `FAIL:<test id>`. */
function fakeRunner(): RunnerApi & { calls: { code: string; tests: TestSpec[] }[] } {
  const calls: { code: string; tests: TestSpec[] }[] = []
  return {
    calls,
    run: async (code, tests): Promise<RunOutput> => {
      calls.push({ code, tests })
      return {
        stdout: '',
        error: null,
        timedOut: false,
        results: tests.map((t) =>
          code.includes(`FAIL:${t.id}`)
            ? { id: t.id, status: 'fail', expected: t.expected, actual: '1' }
            : { id: t.id, status: 'pass', expected: t.expected, actual: t.expected },
        ),
      }
    },
    restart: () => {},
    onStatus: (listener: (s: RunnerStatus) => void) => {
      listener('ready')
      return () => {}
    },
  }
}

function memoryStorage(progress?: Progress): StorageLike {
  const data = new Map<string, string>()
  const storage: StorageLike = {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  }
  if (progress) saveProgress(storage, progress)
  return storage
}

function saved(storage: StorageLike): Progress {
  return JSON.parse(storage.getItem(STORAGE_KEY)!) as Progress
}

function setReducedMotion(reduced: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: reduced && query.includes('reduce'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
}

function start(progress?: Progress, runner = fakeRunner()) {
  const storage = memoryStorage(progress)
  render(<App runner={runner} storage={storage} today={() => TODAY} />)
  return { storage, runner }
}

beforeEach(() => {
  setReducedMotion(true)
  window.scrollTo = () => {}
})
afterEach(() => cleanup())

describe('hub (AC-13, FR-18)', () => {
  it('shows map, rank, XP, souls, deaths, skills, reviews and a quiet bonfire', () => {
    start()
    expect(screen.getByText('Hollow')).toBeTruthy()
    expect(screen.getByLabelText('Rank Hollow, 0 XP')).toBeTruthy()
    expect(screen.getByLabelText('0 souls banked, 0 unbanked')).toBeTruthy()
    expect(screen.getByLabelText('0 deaths')).toBeTruthy()
    expect(screen.getByText('Skills passed')).toBeTruthy()
    expect(screen.getByText('Reviews kept')).toBeTruthy()
    expect(screen.getByText('The bonfire is quiet today.')).toBeTruthy()
    expect(screen.getAllByText(/Mini-boss|Final boss/i).length).toBeGreaterThanOrEqual(4)
  })

  it('lists due reviews at the bonfire', () => {
    const progress = reduce(newProgress(), { type: 'drillPassed', drillId: 'v-assign', today: '2026-09-30' })
    start(progress)
    expect(screen.getByText(/skill calls for review/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Rest at the bonfire' }))
    expect(screen.getByText(drillById('v-assign')!.title)).toBeTruthy()
  })
})

describe('boss fight', () => {
  it('opens the final boss from a fresh start (AC-4, FR-6)', () => {
    start()
    fireEvent.click(screen.getByRole('button', { name: /Damage Calculator/ }))
    expect(screen.getByRole('heading', { level: 1, name: 'Damage Calculator' })).toBeTruthy()
  })

  it('Run uses only the examples and never counts a death (AC-5, FR-7)', async () => {
    const progress = reduce(newProgress(), {
      type: 'draftSaved',
      challengeId: 'boss-damage-calculator',
      code: '# FAIL:several',
    })
    const { storage, runner } = start(progress)
    fireEvent.click(screen.getByRole('button', { name: /Damage Calculator/ }))
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Run examples' })))
    expect(runner.calls[0].tests.map((t) => t.id)).toEqual(['several', 'single'])
    expect(saved(storage).bosses['boss-damage-calculator']).toBeUndefined()
  })

  it('a failed challenge shows YOU DIED with the route, counts a death, keeps souls (AC-6, FR-10)', async () => {
    let progress = reduce(newProgress(), { type: 'drillPassed', drillId: 'e-negative', today: TODAY })
    progress = reduce(progress, { type: 'draftSaved', challengeId: 'boss-damage-calculator', code: '# FAIL:empty' })
    const { storage } = start(progress)
    fireEvent.click(screen.getByRole('button', { name: /Damage Calculator/ }))
    await act(async () => fireEvent.click(screen.getByRole('button', { name: /Challenge boss/ })))
    const dialog = await screen.findByRole('dialog', { name: 'YOU DIED' })
    expect(within(dialog).getByRole('button', { name: 'Train: Where the Count Begins' })).toBeTruthy()
    expect(screen.getByRole('meter', { name: 'Damage Calculator health' }).getAttribute('aria-valuenow')).toBe('20')
    expect(saved(storage).bosses['boss-damage-calculator']).toEqual({ deaths: 1, beaten: false })
    expect(saved(storage).souls.unbanked.final).toBe(drillById('e-negative')!.souls)
    expect(within(dialog).getByText('A hint has surfaced in the trial.')).toBeTruthy()

    fireEvent.click(within(dialog).getByRole('button', { name: 'Train: Where the Count Begins' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Where the Count Begins' })).toBeTruthy()
    expect(screen.getByText(/You fell to/)).toBeTruthy()
  })

  it('a full pass shows victory and banks the reward (AC-8, FR-9)', async () => {
    const { storage } = start()
    fireEvent.click(screen.getByRole('button', { name: /Damage Calculator/ }))
    await act(async () => fireEvent.click(screen.getByRole('button', { name: /Challenge boss/ })))
    expect(await screen.findByRole('dialog', { name: 'Victory Achieved' })).toBeTruthy()
    expect(saved(storage).xp).toBe(200)
  })

  it('resolves instantly when reduced motion is on, and with a delay otherwise (AC-15, FR-21, FR-22)', async () => {
    vi.useFakeTimers()
    try {
      setReducedMotion(false)
      start()
      fireEvent.click(screen.getByRole('button', { name: /Damage Calculator/ }))
      await act(async () => fireEvent.click(screen.getByRole('button', { name: /Challenge boss/ })))
      expect(screen.queryByRole('dialog')).toBeNull()
      await act(async () => vi.advanceTimersByTime(1200 + 350))
      expect(screen.getByRole('dialog', { name: 'Victory Achieved' })).toBeTruthy()
      cleanup()

      setReducedMotion(true)
      start()
      fireEvent.click(screen.getByRole('button', { name: /Damage Calculator/ }))
      await act(async () => fireEvent.click(screen.getByRole('button', { name: /Challenge boss/ })))
      await act(async () => vi.advanceTimersByTime(0))
      expect(screen.getByRole('dialog', { name: 'Victory Achieved' })).toBeTruthy()
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('drills (FR-3, FR-12)', () => {
  const open = (title: string) => fireEvent.click(screen.getByRole('button', { name: new RegExp(title) }))

  it('write: passing gives unbanked souls once', async () => {
    const { storage } = start()
    open('Name the Hollow')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Check' })))
    expect(screen.getByText('Skill learned.')).toBeTruthy()
    expect(saved(storage).souls.unbanked.values).toBe(10)
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Check' })))
    expect(saved(storage).souls.unbanked.values).toBe(10)
  })

  it('predict: the typed output must match', async () => {
    const { storage } = start()
    open('Ledger of Wounds')
    const box = screen.getByLabelText('What does it print?')
    fireEvent.change(box, { target: { value: '25' } })
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Check' })))
    expect(screen.getByText('Not yet.')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('What does it print?'), { target: { value: ' 30 \n' } })
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Check' })))
    expect(screen.getByText('Skill learned.')).toBeTruthy()
    expect(saved(storage).drillsPassed).toContain('v-arith')
  })

  it('reorder: the assembled lines are what gets checked', async () => {
    const { runner } = start()
    open('Exchange of Arms')
    fireEvent.click(screen.getByRole('button', { name: 'Move line 4 up' }))
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Check' })))
    expect(runner.calls[0].code).toBe('a = b\ntemp = a\na = "sword"\nb = temp\nb = "shield"\n')
  })

  it('fix: the starter code is what is checked first', async () => {
    const { runner } = start()
    open('The Mismatched Rune')
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Check' })))
    expect(runner.calls[0].code).toContain('"Level " + level')
  })
})

describe('loading and failure (FR-20, spec §7)', () => {
  it('shows the loading state, then a retry when Python fails', () => {
    let emit: (s: RunnerStatus) => void = () => {}
    const restart = vi.fn()
    const runner: RunnerApi = {
      run: async () => ({ stdout: '', error: null, timedOut: false, results: [] }),
      restart,
      onStatus: (listener) => {
        emit = listener
        listener('loading')
        return () => {}
      },
    }
    render(<App runner={runner} storage={memoryStorage()} today={() => TODAY} />)
    expect(screen.getByText('Kindling the Python flame…')).toBeTruthy()
    act(() => emit('failed'))
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))
    expect(restart).toHaveBeenCalled()
  })
})
