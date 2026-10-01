// What the screens need from the outside world, passed in so tests can supply fakes.
import { createContext, useContext } from 'react'
import { PythonRunner, type RunnerStatus, type WorkerLike } from '../engine/runner.ts'
import type { RunOutput, TestSpec } from '../engine/types.ts'

export type RunnerApi = {
  run: (code: string, tests: TestSpec[]) => Promise<RunOutput>
  restart: () => void
  onStatus: (listener: (status: RunnerStatus) => void) => () => void
}

export function createBrowserRunner(): RunnerApi {
  const runner = new PythonRunner(
    () => new Worker(new URL('../engine/python.worker.ts', import.meta.url), { type: 'module' }) as unknown as WorkerLike,
  )
  return {
    run: (code, tests) => runner.run(code, tests),
    restart: () => runner.restart(),
    onStatus: (listener) => {
      const stop = runner.onStatus(listener)
      return () => void stop()
    },
  }
}

export const RunnerContext = createContext<RunnerApi | null>(null)

export function useRunner(): RunnerApi {
  const runner = useContext(RunnerContext)
  if (!runner) throw new Error('RunnerContext missing')
  return runner
}
