// The boss fight: Run (free) and Challenge (counts), tests resolving one by one, health draining
// (spec FR-6–FR-11, FR-21).
import { useEffect, useRef, useState } from 'react'
import { bossById, exampleTests } from '../../content/index.ts'
import type { RunOutput, TestResult } from '../../engine/types.ts'
import { allPassed, bossState, healthPercent, hintsUnlocked } from '../../game/progress.ts'
import { rankFor } from '../../game/rank.ts'
import type { GameProps } from '../App.tsx'
import { usePrefersReducedMotion } from '../hooks.ts'
import { useRunner } from '../runtime.ts'
import { CodeEditor } from '../parts/CodeEditor.tsx'
import { HealthBar } from '../parts/HealthBar.tsx'
import { BackIcon, SkullIcon } from '../parts/Icons.tsx'
import { DeathCount } from '../parts/Stats.tsx'
import { ErrorBox, TestList } from '../parts/TestList.tsx'
import { DeathScreen } from './DeathScreen.tsx'
import { Victory, type VictoryInfo } from './Victory.tsx'
import { Prose } from '../parts/Prose.tsx'

type Phase = 'idle' | 'running' | 'resolving' | 'died' | 'victory'

const RESOLVE_TOTAL_MS = 1200
const RESOLVE_PAUSE_MS = 350

export function BossFight({ progress, dispatch, nav, today, bossId }: GameProps & { bossId: string }) {
  const boss = bossById(bossId)!
  const runner = useRunner()
  const reduced = usePrefersReducedMotion()
  const state = bossState(progress, boss.id)
  const code = progress.drafts[boss.id] ?? boss.starter

  const [phase, setPhase] = useState<Phase>('idle')
  const [mode, setMode] = useState<'run' | 'challenge'>('run')
  const [output, setOutput] = useState<RunOutput | null>(null)
  const [revealed, setRevealed] = useState(0)
  const [revealedHidden, setRevealedHidden] = useState<string[]>([])
  const [lastFailed, setLastFailed] = useState<TestResult[]>([])
  const [victory, setVictory] = useState<VictoryInfo | null>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const busy = phase === 'running' || phase === 'resolving'
  const examples = exampleTests(boss)
  const hiddenIds = boss.tests.filter((t) => !boss.examples.includes(t.id) && !revealedHidden.includes(t.id)).map((t) => t.id)
  const shownTests = mode === 'challenge' && output ? boss.tests : examples
  const health =
    mode === 'challenge' && output ? healthPercent(output.results.slice(0, revealed), boss.tests.length) : state.beaten ? 0 : 100
  const hints = hintsUnlocked(state.deaths)

  const later = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms))
  }

  const run = async () => {
    if (busy) return
    setMode('run')
    setPhase('running')
    const out = await runner.run(code, examples)
    setOutput(out)
    setRevealed(out.results.length)
    setPhase('idle')
  }

  const challenge = async () => {
    if (busy) return
    setMode('challenge')
    setPhase('running')
    setRevealed(0)
    const out = await runner.run(code, boss.tests)
    setOutput(out)
    setPhase('resolving')
    const step = reduced ? 0 : Math.min(240, RESOLVE_TOTAL_MS / out.results.length)
    out.results.forEach((_, i) => later(step * (i + 1), () => setRevealed(i + 1)))
    later(reduced ? 0 : step * out.results.length + RESOLVE_PAUSE_MS, () => finish(out.results))
  }

  const finish = (results: TestResult[]) => {
    const won = allPassed(results)
    if (won) {
      const xpGained = state.beaten ? 0 : boss.xp
      setVictory({
        xpGained,
        soulsBanked: state.beaten ? 0 : progress.souls.unbanked[boss.chunk],
        rankBefore: rankFor(progress.xp).name,
        rankAfter: rankFor(progress.xp + xpGained).name,
      })
    } else {
      const failed = results.filter((r) => r.status !== 'pass')
      setLastFailed(failed)
      setRevealedHidden((ids) => [...new Set([...ids, ...failed.map((r) => r.id)])])
    }
    dispatch({ type: 'challengeResolved', bossId: boss.id, results, today })
    setPhase(won ? 'victory' : 'died')
  }

  return (
    <main className={`boss-fight ${phase === 'resolving' ? 'shaking' : ''}`}>
      <header className="fight-head">
        <button type="button" className="btn btn-ghost back-btn" onClick={() => nav({ kind: 'hub' })}>
          <BackIcon /> Hub
        </button>
        <div className="fight-title">
          <span className="kicker">{boss.final ? 'Final boss' : 'Mini-boss'} · {boss.epithet}</span>
          <h1>{boss.name}</h1>
        </div>
        <DeathCount deaths={state.deaths} />
      </header>

      <HealthBar percent={health} name={boss.name} />

      <div className="fight-grid">
        <section className="panel fight-brief" aria-labelledby="brief-title">
          <h2 id="brief-title" className="kicker">The trial</h2>
          <Prose text={boss.prompt} />
          <div className="examples">
            <h3 className="kicker">Visible examples</h3>
            <ul>
              {examples.map((t) => (
                <li key={t.id}>
                  <code>{t.setup ? `${t.setup}  →  ${t.call}` : t.call}</code> should be <code>{t.expected}</code>
                </li>
              ))}
            </ul>
            <p className="muted small">{boss.tests.length - examples.length} more tests stay hidden until they defeat you.</p>
          </div>
          <div className="hints">
            <h3 className="kicker">Hints</h3>
            {hints === 0 && <p className="muted small">The first hint surfaces after your first death.</p>}
            {hints >= 1 && <p className="hint">{boss.hints[0]}</p>}
            {hints === 1 && <p className="muted small">Another surfaces after your third death.</p>}
            {hints >= 2 && <p className="hint">{boss.hints[1]}</p>}
          </div>
        </section>

        <section className="fight-work" aria-label="Your code">
          <div className="editor-frame">
            <CodeEditor
              value={code}
              label={`Code for ${boss.name}`}
              onChange={(next) => dispatch({ type: 'draftSaved', challengeId: boss.id, code: next })}
            />
          </div>
          <div className="action-row">
            <button type="button" className="btn" onClick={run} disabled={busy}>
              Run examples
            </button>
            <button type="button" className="btn btn-blood challenge-btn" onClick={challenge} disabled={busy}>
              <SkullIcon /> Challenge boss
            </button>
            <span className="muted small">Run is free. A failed challenge is a death.</span>
          </div>

          <div className="panel results" aria-live="polite">
            <h2 className="kicker">{mode === 'challenge' && output ? 'Challenge' : 'Results'}</h2>
            {phase === 'running' && <p className="muted">Running…</p>}
            {output && phase !== 'running' && (
              <>
                {output.error && <ErrorBox error={output.error} />}
                <TestList
                  tests={shownTests}
                  results={output.results}
                  revealed={revealed}
                  hiddenIds={mode === 'challenge' ? hiddenIds : []}
                />
                {output.stdout && (
                  <div className="stdout">
                    <h3 className="kicker">Printed</h3>
                    <pre>{output.stdout}</pre>
                  </div>
                )}
              </>
            )}
            {!output && phase === 'idle' && <p className="muted">Run the examples, or challenge the boss when you dare.</p>}
          </div>
        </section>
      </div>

      {phase === 'died' && (
        <DeathScreen
          boss={boss}
          failed={lastFailed}
          deaths={state.deaths}
          hints={hints}
          soulsWaiting={progress.souls.unbanked[boss.chunk]}
          onTrain={(drillId) => nav({ kind: 'drill', drillId, fromBoss: boss.id })}
          onRetry={() => setPhase('idle')}
        />
      )}
      {phase === 'victory' && victory && <Victory boss={boss} info={victory} onReturn={() => nav({ kind: 'hub' })} />}
    </main>
  )
}
