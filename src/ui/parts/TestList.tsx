// Per-test results and errors (spec FR-5), revealed one at a time during a challenge (FR-8, FR-21).
import { plainMessage, TIMEOUT_MESSAGE } from '../../engine/plainErrors.ts'
import type { PyError, TestResult, TestSpec } from '../../engine/types.ts'
import { CheckIcon, CrossIcon } from './Icons.tsx'

export function ErrorBox({ error }: { error: PyError }) {
  return (
    <div className="error-box" role="alert">
      <p>
        {plainMessage(error)}
        {error.line !== null && <span className="error-line"> (line {error.line})</span>}
      </p>
      <pre className="error-raw">{error.raw}</pre>
    </div>
  )
}

type Props = {
  tests: TestSpec[]
  results: TestResult[]
  /** How many results are revealed so far; the rest show as pending. */
  revealed?: number
  /** Hide the call of tests that are not yet revealed to the learner (hidden boss tests). */
  hiddenIds?: string[]
}

export function TestList({ tests, results, revealed = results.length, hiddenIds = [] }: Props) {
  const byId = new Map(results.map((r) => [r.id, r]))
  return (
    <ol className="tests">
      {tests.map((test, index) => {
        const result = index < revealed ? byId.get(test.id) : undefined
        const hidden = hiddenIds.includes(test.id) && !(result && result.status !== 'pass')
        const status = result?.status ?? 'pending'
        return (
          <li key={test.id} className={`test test-${status}`}>
            <span className="test-mark" aria-hidden="true">
              {status === 'pass' ? <CheckIcon /> : status === 'pending' ? <span className="dot" /> : <CrossIcon />}
            </span>
            <div className="test-body">
              <code className="test-call">
                {hidden ? 'Hidden test' : test.setup ? `${test.setup}  →  ${test.call}` : test.call}
              </code>
              {result && result.status === 'fail' && (
                <p className="test-detail">
                  expected <code>{result.expected}</code>, got <code>{result.actual}</code>
                </p>
              )}
              {result && result.status === 'error' && result.error && (
                <p className="test-detail">
                  {plainMessage(result.error)}
                  {result.error.line !== null && ` (line ${result.error.line})`}
                </p>
              )}
              {result && result.status === 'timeout' && <p className="test-detail">{TIMEOUT_MESSAGE}</p>}
            </div>
            <span className="sr-only">{status}</span>
          </li>
        )
      })}
    </ol>
  )
}
