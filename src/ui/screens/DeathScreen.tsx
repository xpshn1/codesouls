// YOU DIED: each failed test, now revealed, with its route to one drill (spec FR-10, FR-11, FR-21).
import { useEffect, useRef } from 'react'
import { drillById } from '../../content/index.ts'
import type { Boss } from '../../content/types.ts'
import { plainMessage, TIMEOUT_MESSAGE } from '../../engine/plainErrors.ts'
import type { TestResult } from '../../engine/types.ts'
import { SoulIcon } from '../parts/Icons.tsx'

type Props = {
  boss: Boss
  failed: TestResult[]
  deaths: number
  hints: number
  soulsWaiting: number
  onTrain: (drillId: string) => void
  onRetry: () => void
}

function whatHappened(result: TestResult): string {
  if (result.status === 'timeout') return TIMEOUT_MESSAGE
  if (result.status === 'error' && result.error) return plainMessage(result.error)
  return `expected ${result.expected}, got ${result.actual}`
}

export function DeathScreen({ boss, failed, deaths, hints, soulsWaiting, onTrain, onRetry }: Props) {
  const firstAction = useRef<HTMLButtonElement>(null)
  useEffect(() => firstAction.current?.focus(), [])

  const testsById = new Map(boss.tests.map((t) => [t.id, t]))
  const newHint = (deaths === 1 && hints === 1) || (deaths === 3 && hints === 2)

  return (
    <div className="overlay death" role="dialog" aria-modal="true" aria-labelledby="death-title">
      <div className="death-band">
        <h2 id="death-title" className="death-title">
          YOU DIED
        </h2>
      </div>
      <div className="death-body">
        <p className="death-sub">
          Death {deaths} against {boss.name}. {failed.length === 1 ? 'One test' : `${failed.length} tests`} struck you down.
        </p>
        <ul className="death-list">
          {failed.map((result) => {
            const test = testsById.get(result.id)!
            const drill = drillById(boss.routes[result.id])!
            return (
              <li key={result.id} className="death-item">
                <div>
                  <code className="test-call">{test.setup ? `${test.setup}  →  ${test.call}` : test.call}</code>
                  <p className="muted small">{whatHappened(result)}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-ember"
                  ref={result === failed[0] ? firstAction : undefined}
                  onClick={() => onTrain(drill.id)}
                >
                  Train: {drill.title}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="death-foot">
          {soulsWaiting > 0 && (
            <p className="souls-wait">
              <SoulIcon size={16} /> Your {soulsWaiting} unbanked souls wait at the gate. They are not lost.
            </p>
          )}
          {newHint && <p className="hint-new">A hint has surfaced in the trial.</p>}
          <button type="button" className="btn" onClick={onRetry}>
            Rise and try again
          </button>
        </div>
      </div>
    </div>
  )
}
