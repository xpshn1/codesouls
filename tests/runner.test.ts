import { describe, expect, it } from 'vitest'
import { runSuite } from '../src/engine/runner'

describe('runSuite', () => {
  it('reports syntax errors as fatal', () => {
    const suite = runSuite('function (', [{ name: 't', code: 'expect(1).toBe(1)' }])
    expect(suite.fatal).toMatch(/SyntaxError/)
    expect(suite.results).toEqual([])
  })

  it('isolates state between tests', () => {
    const code = 'let count = 0\nfunction bump() { count += 1; return count }'
    const suite = runSuite(code, [
      { name: 'a', code: 'expect(bump()).toBe(1)' },
      { name: 'b', code: 'expect(bump()).toBe(1)' },
    ])
    expect(suite.results.every((r) => r.pass)).toBe(true)
  })

  it('explains failed assertions', () => {
    const suite = runSuite('function f() { return 2 }', [{ name: 't', code: 'expect(f()).toBe(3)' }])
    expect(suite.results[0].error).toBe('Expected 3 but got 2')
  })

  it('reports runtime errors from learner code', () => {
    const suite = runSuite('function f() { return missing.value }', [
      { name: 't', code: 'f()' },
    ])
    expect(suite.results[0].error).toMatch(/ReferenceError/)
  })

  it('captures console.log output', () => {
    const suite = runSuite('console.log("hi", [1, 2])', [{ name: 't', code: '' }])
    expect(suite.logs).toEqual(['hi [1,2]'])
  })

  it('carries boss routing tags through', () => {
    const suite = runSuite('', [{ name: 't', code: 'expect(1).toBe(2)', trains: 'rag' }])
    expect(suite.results[0].trains).toBe('rag')
  })

  it('checks toThrow messages', () => {
    const suite = runSuite('function f() { throw new Error("Bad shape") }', [
      { name: 'ok', code: 'expect(() => f()).toThrow("shape")' },
      { name: 'wrong', code: 'expect(() => f()).toThrow("length")' },
    ])
    expect(suite.results.map((r) => r.pass)).toEqual([true, false])
  })
})
