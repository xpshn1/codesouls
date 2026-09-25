import type { TestCase } from '../content/types'

export type TestResult = {
  name: string
  pass: boolean
  error?: string
  trains?: string
}

export type SuiteResult = {
  results: TestResult[]
  logs: string[]
  /** Set when the code could not run at all (syntax error, timeout). */
  fatal?: string
}

class AssertionError extends Error {}

function show(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'function') return '[Function]'
  if (value === undefined) return 'undefined'
  if (typeof value === 'number' && Number.isNaN(value)) return 'NaN'
  try {
    const text = JSON.stringify(value)
    return text === undefined ? String(value) : text
  } catch {
    return String(value)
  }
}

export function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    return false
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const aKeys = Object.keys(a as object)
  const bKeys = Object.keys(b as object)
  if (aKeys.length !== bKeys.length) return false
  return aKeys.every((key) =>
    deepEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key],
    ),
  )
}

export function expect(received: unknown) {
  const fail = (message: string): never => {
    throw new AssertionError(message)
  }

  return {
    toBe(expected: unknown) {
      if (!Object.is(received, expected)) {
        fail(`Expected ${show(expected)} but got ${show(received)}`)
      }
    },
    toEqual(expected: unknown) {
      if (!deepEqual(received, expected)) {
        fail(`Expected ${show(expected)} but got ${show(received)}`)
      }
    },
    toBeCloseTo(expected: number, digits = 2) {
      const ok =
        typeof received === 'number' &&
        Math.abs(expected - received) < 10 ** -digits / 2
      if (!ok) {
        fail(
          `Expected about ${expected} (to ${digits} decimal places) but got ${show(received)}`,
        )
      }
    },
    toBeTruthy() {
      if (!received) fail(`Expected a truthy value but got ${show(received)}`)
    },
    toContain(item: unknown) {
      const ok =
        (typeof received === 'string' && typeof item === 'string' && received.includes(item)) ||
        (Array.isArray(received) && received.some((entry) => deepEqual(entry, item)))
      if (!ok) fail(`Expected ${show(received)} to contain ${show(item)}`)
    },
    toThrow(fragment?: string) {
      if (typeof received !== 'function') {
        fail('toThrow needs a function, e.g. expect(() => fn()).toThrow()')
        return
      }
      let threw = false
      let message = ''
      try {
        ;(received as () => unknown)()
      } catch (error) {
        threw = true
        message = error instanceof Error ? error.message : String(error)
      }
      if (!threw) fail('Expected the call to throw an error, but it returned normally')
      if (fragment && !message.toLowerCase().includes(fragment.toLowerCase())) {
        fail(`Expected an error mentioning "${fragment}" but got "${message}"`)
      }
    },
  }
}

function describeError(error: unknown): string {
  if (error instanceof AssertionError) return error.message
  if (error instanceof Error) return `${error.name}: ${error.message}`
  return String(error)
}

/**
 * Runs learner code against a list of tests. Each test gets a fresh copy of
 * the learner code so one test cannot leak state into another.
 */
export function runSuite(code: string, tests: TestCase[]): SuiteResult {
  const logs: string[] = []
  const fakeConsole = {
    log: (...args: unknown[]) =>
      logs.push(args.map((arg) => (typeof arg === 'string' ? arg : show(arg))).join(' ')),
  }

  try {
    // Compile once up front so syntax errors are reported clearly.
    new Function('expect', 'console', `"use strict";\n${code}`)
  } catch (error) {
    return { results: [], logs, fatal: describeError(error) }
  }

  const results = tests.map((test): TestResult => {
    try {
      const run = new Function(
        'expect',
        'console',
        `"use strict";\n${code}\n;\n${test.code}`,
      )
      run(expect, fakeConsole)
      return { name: test.name, pass: true, trains: test.trains }
    } catch (error) {
      return {
        name: test.name,
        pass: false,
        error: describeError(error),
        trains: test.trains,
      }
    }
  })

  return { results, logs: logs.slice(0, 200) }
}
