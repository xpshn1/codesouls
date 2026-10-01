// AC-2, FR-4: a runaway job times out, the worker is replaced, and the next job still runs.
import { describe, expect, it } from 'vitest'
import type { WorkerMessage, WorkerRequest } from '../src/engine/python.worker.ts'
import { PythonRunner, type WorkerLike } from '../src/engine/runner.ts'

class FakeWorker implements WorkerLike {
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null = null
  terminated = false
  hangs: boolean

  constructor(hangs: boolean) {
    this.hangs = hangs
    setTimeout(() => this.send({ kind: 'ready' }), 0)
  }

  send(message: WorkerMessage) {
    this.onmessage?.({ data: message } as MessageEvent<WorkerMessage>)
  }

  postMessage(request: WorkerRequest) {
    if (this.hangs) return
    setTimeout(() =>
      this.send({
        kind: 'result',
        id: request.id,
        output: { stdout: '', error: null, timedOut: false, results: request.tests.map((t) => ({ id: t.id, status: 'pass' })) },
      }),
    )
  }

  terminate() {
    this.terminated = true
  }
}

describe('PythonRunner', () => {
  it('times out a runaway job, restarts, and runs the next job', async () => {
    const workers: FakeWorker[] = []
    const runner = new PythonRunner(() => {
      const worker = new FakeWorker(workers.length === 0)
      workers.push(worker)
      return worker
    }, 50)

    const tests = [{ id: 'a', call: 'f()', expected: '1' }]
    const first = await runner.run('while True: pass', tests)
    expect(first.timedOut).toBe(true)
    expect(first.results[0].status).toBe('timeout')
    expect(workers[0].terminated).toBe(true)

    const second = await runner.run('def f(): return 1', tests)
    expect(second.results[0].status).toBe('pass')
    expect(workers).toHaveLength(2)
  })

  it('does not count loading time toward the limit', async () => {
    let worker: FakeWorker | null = null
    const runner = new PythonRunner(() => {
      worker = new FakeWorker(false)
      return worker
    }, 50)
    const job = runner.run('x = 1', [])
    await new Promise((r) => setTimeout(r, 10))
    expect(worker).not.toBeNull()
    expect((await job).timedOut).toBe(false)
  })
})
