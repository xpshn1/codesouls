// Runs learner code in Pyodide, off the main thread (spec FR-4).
import { loadPyodide } from 'pyodide'
import harnessSource from './harness.py?raw'
import { installHarness, runJob, type PythonLike } from './runJob.ts'
import type { TestSpec } from './types.ts'

export type WorkerRequest = { id: number; code: string; tests: TestSpec[] }
export type WorkerMessage =
  | { kind: 'ready' }
  | { kind: 'failed'; message: string }
  | { kind: 'result'; id: number; output: ReturnType<typeof runJob> }

const post = (message: WorkerMessage) => self.postMessage(message)

const pythonReady = loadPyodide({ indexURL: `${self.location.origin}${import.meta.env.BASE_URL}pyodide/` })
  .then((py) => {
    installHarness(py as unknown as PythonLike, harnessSource)
    post({ kind: 'ready' })
    return py as unknown as PythonLike
  })
  .catch((error: unknown) => {
    post({ kind: 'failed', message: String(error) })
    throw error
  })

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const py = await pythonReady
  const { id, code, tests } = event.data
  post({ kind: 'result', id, output: runJob(py, code, tests) })
}
