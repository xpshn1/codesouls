import { useCallback, useEffect, useState } from 'react'
import { campaignOf, getChallenge } from '../content'
import type { Challenge } from '../content/types'
import { runInWorker } from '../engine/runInWorker'
import type { SuiteResult } from '../engine/runner'
import type { Progress } from '../state/progress'
import { Brief } from './Brief'
import { CodeEditor } from './CodeEditor'

type Props = {
  challenge: Challenge
  progress: Progress
  update: (change: (current: Progress) => Progress) => void
  navigate: (challengeId: string | null) => void
}

type Banner = { kind: 'death' | 'victory' | 'mastered'; text: string; sub: string }

export function Arena({ challenge, progress, update, navigate }: Props) {
  const isBoss = challenge.kind === 'boss'
  const code = progress.drafts[challenge.id] ?? challenge.starter
  const deaths = progress.deaths[challenge.id] ?? 0
  const isComplete = progress.completed.includes(challenge.id)
  const campaign = campaignOf(challenge.id)

  const [suite, setSuite] = useState<SuiteResult | null>(null)
  const [running, setRunning] = useState(false)
  const [banner, setBanner] = useState<Banner | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const hintsShown = isBoss
    ? Math.min(deaths, challenge.hints.length)
    : Math.min(progress.hintsShown[challenge.id] ?? 0, challenge.hints.length)

  // App remounts this component per challenge (key={id}), so state starts fresh.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    if (!banner) return
    const timer = window.setTimeout(() => setBanner(null), banner.kind === 'death' ? 2600 : 3200)
    return () => window.clearTimeout(timer)
  }, [banner])

  const setCode = useCallback(
    (value: string) =>
      update((current) => ({
        ...current,
        drafts: { ...current.drafts, [challenge.id]: value },
      })),
    [challenge.id, update],
  )

  const run = useCallback(async () => {
    if (running) return
    setRunning(true)
    const result = await runInWorker(code, challenge.tests)
    setSuite(result)
    setRunning(false)

    const total = challenge.tests.length
    const failed = result.fatal ? total : result.results.filter((r) => !r.pass).length
    const passedAll = failed === 0

    if (passedAll) {
      const firstClear = !progress.completed.includes(challenge.id)
      update((current) => ({
        ...current,
        completed: current.completed.includes(challenge.id)
          ? current.completed
          : [...current.completed, challenge.id],
        retreatTo: { ...current.retreatTo, [challenge.id]: [] },
        bossHp: { ...current.bossHp, [challenge.id]: 0 },
      }))
      setBanner(
        isBoss
          ? {
              kind: 'victory',
              text: challenge.id === 'final-boss' ? 'Architect Fallen' : 'Boss Defeated',
              sub: firstClear ? `+${challenge.xp} XP` : 'Victory replayed',
            }
          : {
              kind: 'mastered',
              text: 'Node Mastered',
              sub: firstClear ? `+${challenge.xp} XP` : 'Still sharp',
            },
      )
      return
    }

    if (isBoss) {
      const retreat = result.fatal
        ? []
        : [
            ...new Set(
              result.results
                .filter((r) => !r.pass && r.trains)
                .map((r) => r.trains as string),
            ),
          ]
      update((current) => ({
        ...current,
        deaths: { ...current.deaths, [challenge.id]: (current.deaths[challenge.id] ?? 0) + 1 },
        retreatTo: { ...current.retreatTo, [challenge.id]: retreat },
        bossHp: { ...current.bossHp, [challenge.id]: failed / total },
      }))
      setBanner({
        kind: 'death',
        text: 'You Died',
        sub: `${challenge.title} still has ${failed} of ${total} HP`,
      })
    }
  }, [challenge, code, isBoss, progress.completed, running, update])

  const revealHint = () =>
    update((current) => ({
      ...current,
      hintsShown: {
        ...current.hintsShown,
        [challenge.id]: (current.hintsShown[challenge.id] ?? 0) + 1,
      },
    }))

  const resetCode = () => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    setConfirmReset(false)
    update((current) => {
      const drafts = { ...current.drafts }
      delete drafts[challenge.id]
      return { ...current, drafts }
    })
  }

  const passedCount = suite?.results.filter((r) => r.pass).length ?? 0
  const total = challenge.tests.length
  const hpShare = suite
    ? suite.fatal
      ? 1
      : (total - passedCount) / total
    : progress.bossHp[challenge.id] ?? 1

  return (
    <main className="console-shell arena-shell">
      {banner && (
        <button
          type="button"
          className={`banner banner-${banner.kind}`}
          onClick={() => setBanner(null)}
          aria-live="assertive"
        >
          <strong>{banner.text}</strong>
          <span>{banner.sub}</span>
        </button>
      )}

      <header className="command-bar arena-bar">
        <button type="button" className="ghost" onClick={() => navigate(null)}>
          ← Deck
        </button>
        <div>
          <p className="eyebrow">
            {campaign ? campaign.title : 'Final Boss'} // {isBoss ? 'Boss' : 'Drill'} //{' '}
            {challenge.xp} XP
          </p>
          <h1>{challenge.title}</h1>
        </div>
        <div className="command-meta">
          <span>{challenge.concept}</span>
          {isBoss && <span>DEATHS: {deaths}</span>}
          <span>{isComplete ? 'CLEARED' : 'UNCLEARED'}</span>
        </div>
      </header>

      {isBoss && (
        <div className="boss-hp panel" aria-label="Boss health">
          <span>{challenge.title}</span>
          <div className="hp-track">
            <div className="hp-fill" style={{ width: `${Math.round(hpShare * 100)}%` }} />
          </div>
          <small>
            {Math.round(hpShare * total)} / {total} HP
          </small>
        </div>
      )}

      <div className="arena-grid">
        <section className="panel arena-brief" aria-label="Challenge">
          <span className="card-kicker">Objective</span>
          <Brief text={challenge.brief} />

          <div className="hint-block">
            <span className="card-kicker">
              {isBoss ? 'Messages from fallen attempts' : 'Hints'}
            </span>
            {challenge.hints.slice(0, hintsShown).map((hint, index) => (
              <div className="hint" key={index}>
                <Brief text={hint} />
              </div>
            ))}
            {isBoss ? (
              hintsShown < challenge.hints.length && (
                <small className="muted">
                  {deaths === 0
                    ? 'Each death reveals a hint. Go ahead and try.'
                    : `${challenge.hints.length - hintsShown} more revealed by dying.`}
                </small>
              )
            ) : (
              hintsShown < challenge.hints.length && (
                <button type="button" className="ghost small" onClick={revealHint}>
                  Reveal hint ({challenge.hints.length - hintsShown} left)
                </button>
              )
            )}
          </div>
        </section>

        <section className="panel arena-editor" aria-label="Code">
          <div className="editor-frame">
            <CodeEditor value={code} onChange={setCode} onRun={run} />
          </div>
          <div className="editor-actions">
            <button type="button" onClick={run} disabled={running}>
              {running ? 'Running…' : isBoss ? 'Attack (Ctrl+Enter)' : 'Run tests (Ctrl+Enter)'}
            </button>
            <button type="button" className="ghost" onClick={resetCode}>
              {confirmReset ? 'Click again to reset' : 'Reset code'}
            </button>
          </div>

          <div className="results" aria-live="polite">
            {!suite && (
              <p className="muted">
                {total} tests are waiting. Your code runs in your browser and nothing is sent anywhere.
              </p>
            )}
            {suite?.fatal && (
              <div className="result-row fail">
                <span>XX</span>
                <div>
                  <strong>Your code did not run</strong>
                  <small>{suite.fatal}</small>
                </div>
              </div>
            )}
            {suite && !suite.fatal && (
              <p className="results-summary">
                {passedCount} / {total} tests passing
              </p>
            )}
            {suite?.results.map((result) => {
              const drill = result.trains ? getChallenge(result.trains) : undefined
              return (
                <div className={`result-row ${result.pass ? 'pass' : 'fail'}`} key={result.name}>
                  <span>{result.pass ? 'OK' : 'XX'}</span>
                  <div>
                    <strong>{result.name}</strong>
                    {result.error && <small>{result.error}</small>}
                    {!result.pass && drill && (
                      <button
                        type="button"
                        className="retreat"
                        onClick={() => navigate(drill.id)}
                      >
                        Retreat to {drill.title} ({drill.concept}) →
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
            {suite && suite.logs.length > 0 && (
              <div className="console-out">
                <span className="card-kicker">console.log</span>
                <pre>
                  <code>{suite.logs.join('\n')}</code>
                </pre>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
