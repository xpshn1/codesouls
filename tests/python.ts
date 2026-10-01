// Loads real Python (Pyodide) in Node with the same harness the app uses.
import { readFileSync } from 'node:fs'
import { loadPyodide } from 'pyodide'
import { installHarness, runJob, type PythonLike } from '../src/engine/runJob.ts'
import type { TestSpec } from '../src/engine/types.ts'

let python: Promise<PythonLike> | null = null

export function getPython(): Promise<PythonLike> {
  python ??= loadPyodide().then((py) => {
    const pythonLike = py as unknown as PythonLike
    installHarness(pythonLike, readFileSync('src/engine/harness.py', 'utf8'))
    return pythonLike
  })
  return python
}

export async function run(code: string, tests: TestSpec[]) {
  return runJob(await getPython(), code, tests)
}

/** Runs code and returns what it printed (for predict-the-output drills). */
export async function printed(code: string) {
  return (await run(code, [])).stdout
}
