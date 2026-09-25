import type { TestCase } from '../content/types'
import type { SuiteResult } from './runner'

const TIMEOUT_MS = 3000

/**
 * Runs learner code in a throwaway Web Worker. If the code hangs (for example
 * an infinite loop), the worker is terminated after a few seconds so the page
 * stays responsive.
 */
export function runInWorker(code: string, tests: TestCase[]): Promise<SuiteResult> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./runner.worker.ts', import.meta.url), {
      type: 'module',
    })

    const timer = window.setTimeout(() => {
      worker.terminate()
      resolve({
        results: [],
        logs: [],
        fatal: `Your code ran for more than ${TIMEOUT_MS / 1000} seconds and was stopped. Check for a loop that never ends.`,
      })
    }, TIMEOUT_MS)

    worker.onmessage = (event: MessageEvent<SuiteResult>) => {
      window.clearTimeout(timer)
      worker.terminate()
      resolve(event.data)
    }

    worker.onerror = (event) => {
      window.clearTimeout(timer)
      worker.terminate()
      resolve({ results: [], logs: [], fatal: event.message || 'The code runner crashed.' })
    }

    worker.postMessage({ code, tests })
  })
}
