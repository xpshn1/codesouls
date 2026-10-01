// A drill of any of the four types, as practice or as a review (spec FR-3, FR-12, FR-15).
import { useState } from 'react'
import { bossById, chunkById, drillById } from '../../content/index.ts'
import { assemble, normaliseOutput } from '../../content/types.ts'
import type { RunOutput } from '../../engine/types.ts'
import { allPassed } from '../../game/progress.ts'
import { REVIEW_GAPS } from '../../game/reviews.ts'
import type { GameProps } from '../App.tsx'
import { useRunner } from '../runtime.ts'
import { CodeEditor } from '../parts/CodeEditor.tsx'
import { BackIcon, SoulIcon } from '../parts/Icons.tsx'
import { Prose } from '../parts/Prose.tsx'
import { ReorderLines } from '../parts/ReorderLines.tsx'
import { ErrorBox, TestList } from '../parts/TestList.tsx'

const TYPE_LABEL = {
  write: 'Write the code',
  predict: 'Predict the output',
  fix: 'Fix the bug',
  reorder: 'Reorder the lines',
} as const

type Outcome = { passed: boolean; soulsGained: number; xpGained: number; counted: boolean; repeat: boolean }

type Props = GameProps & { drillId: string; review: boolean; fromBoss?: string }

export function Drill({ progress, dispatch, nav, today, drillId, review, fromBoss }: Props) {
  const drill = drillById(drillId)!
  const runner = useRunner()
  const boss = fromBoss ? bossById(fromBoss) : undefined
  const alreadyPassed = progress.drillsPassed.includes(drill.id)
  const skill = progress.skills[drill.id]

  const starter = drill.type === 'write' || drill.type === 'fix' ? drill.starter : ''
  const [localCode, setLocalCode] = useState(starter)
  const code = drill.type === 'write' || drill.type === 'fix' ? (review ? localCode : (progress.drafts[drill.id] ?? starter)) : ''
  const [answer, setAnswer] = useState('')
  const [order, setOrder] = useState(() => (drill.type === 'reorder' ? drill.lines.map((_, i) => i) : []))
  const [output, setOutput] = useState<RunOutput | null>(null)
  const [busy, setBusy] = useState(false)
  const [wrongPredict, setWrongPredict] = useState(0)
  const [outcome, setOutcome] = useState<Outcome | null>(null)

  const setCode = (next: string) => {
    if (review) setLocalCode(next)
    else dispatch({ type: 'draftSaved', challengeId: drill.id, code: next })
  }

  const resolve = (passed: boolean) => {
    if (review) {
      if (outcome?.counted) {
        setOutcome({ ...outcome, passed })
        return
      }
      dispatch({ type: 'reviewResolved', drillId: drill.id, passed, today })
      setOutcome({ passed, soulsGained: 0, xpGained: passed ? drill.reviewXp : 0, counted: true, repeat: false })
      return
    }
    // Decide from progress before this pass is recorded.
    const repeat = outcome?.counted === true || alreadyPassed
    if (passed && !repeat) dispatch({ type: 'drillPassed', drillId: drill.id, today })
    setOutcome({ passed, soulsGained: passed && !repeat ? drill.souls : 0, xpGained: 0, counted: passed || repeat, repeat })
  }

  const check = async () => {
    if (busy) return
    if (drill.type === 'predict') {
      const passed = normaliseOutput(answer) === normaliseOutput(drill.expectedOutput)
      if (!passed) setWrongPredict((n) => n + 1)
      resolve(passed)
      return
    }
    setBusy(true)
    const source = drill.type === 'reorder' ? assemble(drill, order) : code
    const out = await runner.run(source, drill.tests)
    setOutput(out)
    setBusy(false)
    resolve(allPassed(out.results))
  }

  const backTo = review ? 'bonfire' : 'hub'
  const step = skill ? Math.min(skill.step, REVIEW_GAPS.length - 1) : 0

  return (
    <main className="drill">
      <header className="fight-head">
        <button type="button" className="btn btn-ghost back-btn" onClick={() => nav({ kind: backTo })}>
          <BackIcon /> {review ? 'Bonfire' : 'Hub'}
        </button>
        <div className="fight-title">
          <span className="kicker">
            {review ? `Review ${step + 1} of ${REVIEW_GAPS.length}` : chunkById(drill.chunk).name} · {TYPE_LABEL[drill.type]}
          </span>
          <h1>{drill.title}</h1>
        </div>
        {!review && (
          <span className="drill-reward">
            <SoulIcon /> {alreadyPassed ? 'Passed' : `${drill.souls} souls`}
          </span>
        )}
      </header>

      {boss && !review && (
        <p className="why-banner">
          You fell to <strong>{boss.name}</strong> on this skill: <em>{drill.skill.toLowerCase()}</em>.
        </p>
      )}

      <div className="drill-grid">
        <section className="panel drill-brief" aria-labelledby="task-title">
          <h2 id="task-title" className="kicker">
            Skill: {drill.skill}
          </h2>
          <Prose text={drill.prompt} />
          {drill.type !== 'predict' && (
            <div className="examples">
              <h3 className="kicker">Checks</h3>
              <ul>
                {drill.tests.map((t) => (
                  <li key={t.id}>
                    <code>{t.call}</code> should be <code>{t.expected}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="drill-work" aria-label="Your answer">
          {(drill.type === 'write' || drill.type === 'fix') && (
            <div className="editor-frame">
              <CodeEditor value={code} label={`Code for ${drill.title}`} onChange={setCode} />
            </div>
          )}

          {drill.type === 'predict' && (
            <>
              <div className="editor-frame read-only">
                <CodeEditor value={drill.code} label={`Code to read for ${drill.title}`} readOnly />
              </div>
              <label className="predict-label" htmlFor="predict-answer">
                What does it print?
              </label>
              <textarea
                id="predict-answer"
                key={wrongPredict}
                className={`predict-input ${wrongPredict > 0 && outcome && !outcome.passed ? 'shake' : ''}`}
                value={answer}
                rows={4}
                spellCheck={false}
                onChange={(event) => setAnswer(event.target.value)}
              />
            </>
          )}

          {drill.type === 'reorder' && <ReorderLines lines={drill.lines} order={order} onChange={setOrder} disabled={busy} />}

          <div className="action-row">
            <button type="button" className="btn btn-ember" onClick={check} disabled={busy}>
              {busy ? 'Checking…' : 'Check'}
            </button>
          </div>

          {output && (
            <div className="panel results" aria-live="polite">
              {output.error && <ErrorBox error={output.error} />}
              <TestList tests={drill.type === 'predict' ? [] : drill.tests} results={output.results} />
            </div>
          )}

          {outcome && (
            <div className={`outcome ${outcome.passed ? 'outcome-pass' : 'outcome-fail'}`} role="status">
              {outcome.passed ? (
                <>
                  <p className="outcome-title">{review ? 'Remembered.' : 'Skill learned.'}</p>
                  {outcome.soulsGained > 0 && (
                    <p className="souls-gain">
                      <SoulIcon /> +{outcome.soulsGained} souls, unbanked until {chunkById(drill.chunk).boss.name} falls
                    </p>
                  )}
                  {review && outcome.xpGained > 0 && <p className="souls-gain">+{outcome.xpGained} XP</p>}
                  {!review && outcome.repeat && <p className="muted small">Already passed before: no new souls.</p>}
                  <div className="outcome-actions">
                    {boss && (
                      <button type="button" className="btn btn-blood" onClick={() => nav({ kind: 'boss', bossId: boss.id })}>
                        Return to {boss.name}
                      </button>
                    )}
                    <button type="button" className="btn" onClick={() => nav({ kind: backTo })}>
                      Back to the {backTo}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="outcome-title">Not yet.</p>
                  <p className="muted">
                    {drill.type === 'predict'
                      ? 'Trace it line by line: what does each variable hold after every step?'
                      : 'Read the failed checks above, change your answer, and check again.'}
                  </p>
                  {review && outcome.counted && (
                    <p className="muted small">This review counts as missed; the skill will call again tomorrow. Keep practising here.</p>
                  )}
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
