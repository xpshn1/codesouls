import { runSuite } from './runner'
import type { TestCase } from '../content/types'

type Request = { code: string; tests: TestCase[] }

self.onmessage = (event: MessageEvent<Request>) => {
  const { code, tests } = event.data
  self.postMessage(runSuite(code, tests))
}
