import type { WorkerMessage, WorkerRequest } from './python.worker.ts'
import type { RunOutput, TestSpec } from './types.ts'

export const TIME_LIMIT_MS = 5000

export type RunnerStatus = 'loading' | 'ready' | 'failed'

/** The part of a Worker the runner uses, so tests can pass a fake. */
export type WorkerLike = {
  postMessage: (message: WorkerRequest) => void
  terminate: () => void
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null
}

type Pending = { id: number; tests: TestSpec[]; resolve: (output: RunOutput) => void; timer: ReturnType<typeof setTimeout> }

/**
 * Owns the Python worker (spec FR-4): one job at a time, a 5 s limit,
 * and a fresh worker after a timeout so a runaway program never freezes the page.
 */
export class PythonRunner {
  status: RunnerStatus = 'loading'
  private worker!: WorkerLike
  private nextId = 1
  private pending: Pending | null = null
  private queue: Promise<unknown> = Promise.resolve()
  private listeners = new Set<(status: RunnerStatus) => void>()
  private readonly createWorker: () => WorkerLike
  private readonly timeLimitMs: number

  constructor(createWorker: () => WorkerLike, timeLimitMs = TIME_LIMIT_MS) {
    this.createWorker = createWorker
    this.timeLimitMs = timeLimitMs
    this.start()
  }

  onStatus(listener: (status: RunnerStatus) => void) {
    this.listeners.add(listener)
    listener(this.status)
    return () => this.listeners.delete(listener)
  }

  /** Starts a fresh worker (also used by the loading screen's "Try again"). */
  restart() {
    this.worker?.terminate()
    this.start()
  }

  run(code: string, tests: TestSpec[]): Promise<RunOutput> {
    const job = this.queue.then(() => this.runNow(code, tests))
    this.queue = job.catch(() => undefined)
    return job
  }

  private start() {
    this.setStatus('loading')
    this.worker = this.createWorker()
    this.worker.onmessage = (event) => this.handle(event.data)
  }

  private setStatus(status: RunnerStatus) {
    this.status = status
    this.listeners.forEach((listener) => listener(status))
  }

  private handle(message: WorkerMessage) {
    if (message.kind === 'ready') this.setStatus('ready')
    else if (message.kind === 'failed') this.setStatus('failed')
    else if (this.pending && message.id === this.pending.id) {
      clearTimeout(this.pending.timer)
      const { resolve } = this.pending
      this.pending = null
      resolve(message.output)
    }
  }

  /** Resolves once Python is loaded, so loading time never counts toward the time limit. */
  whenReady(): Promise<void> {
    if (this.status === 'ready') return Promise.resolve()
    return new Promise((resolve, reject) => {
      const stop = this.onStatus((status) => {
        if (status === 'ready') {
          queueMicrotask(() => stop())
          resolve()
        } else if (status === 'failed') {
          queueMicrotask(() => stop())
          reject(new Error('Python failed to start'))
        }
      })
    })
  }

  private async runNow(code: string, tests: TestSpec[]): Promise<RunOutput> {
    await this.whenReady()
    return new Promise((resolve) => {
      const id = this.nextId++
      const timer = setTimeout(() => this.timeOut(), this.timeLimitMs)
      this.pending = { id, tests, resolve, timer }
      this.worker.postMessage({ id, code, tests })
    })
  }

  private timeOut() {
    if (!this.pending) return
    const { tests, resolve } = this.pending
    this.pending = null
    this.restart()
    resolve({
      stdout: '',
      error: null,
      timedOut: true,
      results: tests.map((test) => ({ id: test.id, status: 'timeout' })),
    })
  }
}
