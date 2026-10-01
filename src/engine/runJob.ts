import type { RunOutput, TestSpec } from './types.ts'

/** The part of a Pyodide instance the harness needs. */
export type PythonLike = {
  runPython: (code: string) => unknown
  globals: { get: (name: string) => unknown }
}

/** Installs the harness into a Pyodide instance. */
export function installHarness(py: PythonLike, harnessSource: string) {
  py.runPython(harnessSource)
}

/** Runs learner code against tests with an installed harness (FR-5). */
export function runJob(py: PythonLike, code: string, tests: TestSpec[]): RunOutput {
  const run = py.globals.get('run_job') as (code: string, tests: string) => string
  const parsed = JSON.parse(run(code, JSON.stringify(tests))) as Omit<RunOutput, 'timedOut'>
  return { ...parsed, timedOut: false }
}
