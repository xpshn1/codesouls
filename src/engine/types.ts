// Shapes exchanged with the Python runner (plan §4).

export type TestSpec = {
  id: string
  /** A Python expression evaluated after the learner's code, e.g. `total_damage([])`. */
  call: string
  /** A Python expression for the expected value, e.g. `0`. */
  expected: string
  /** Optional Python run before the learner's code, e.g. `log = []`, to give the code its input. */
  setup?: string
}

export type PyError = {
  type: string
  detail: string
  line: number | null
  raw: string
}

export type TestStatus = 'pass' | 'fail' | 'error' | 'timeout'

export type TestResult = {
  id: string
  status: TestStatus
  expected?: string
  actual?: string
  error?: PyError
}

export type RunOutput = {
  stdout: string
  error: PyError | null
  results: TestResult[]
  timedOut: boolean
}
