// AC-3, FR-5: per-test results, plain errors with line numbers, stdout capture.
import { beforeAll, describe, expect, it } from 'vitest'
import { plainMessage } from '../src/engine/plainErrors.ts'
import { getPython, run } from './python.ts'

const tests = [
  { id: 'many', call: 'total_damage([2, 3, 5])', expected: '10' },
  { id: 'empty', call: 'total_damage([])', expected: '0' },
]

describe('harness', () => {
  beforeAll(async () => {
    await getPython()
  })

  it('passes correct code', async () => {
    const out = await run('def total_damage(a):\n    return sum(a)\n', tests)
    expect(out.results.map((r) => r.status)).toEqual(['pass', 'pass'])
  })

  it('reports a failing test with expected and actual', async () => {
    const out = await run('def total_damage(a):\n    return 1\n', tests)
    expect(out.results[1]).toMatchObject({ id: 'empty', status: 'fail', expected: '0', actual: '1' })
  })

  it('reports an error inside one test with its line', async () => {
    const code = 'def total_damage(a):\n    total = a[0]\n    for x in a[1:]:\n        total += x\n    return total\n'
    const out = await run(code, tests)
    expect(out.results[0].status).toBe('pass')
    expect(out.results[1].status).toBe('error')
    expect(out.results[1].error).toMatchObject({ type: 'IndexError', line: 2 })
    expect(plainMessage(out.results[1].error!)).toMatch(/position the list does not have/)
  })

  it('reports a syntax error with a plain message, line and raw error (AC-3)', async () => {
    const out = await run('def total_damage(a:\n    return 0\n', tests)
    expect(out.error).toMatchObject({ type: 'SyntaxError', line: 1 })
    expect(out.error!.raw).toContain('SyntaxError')
    expect(plainMessage(out.error!)).toMatch(/couldn't read this line/)
    expect(out.results.every((r) => r.status === 'error')).toBe(true)
  })

  it('explains a wrong function name', async () => {
    const out = await run('def total(a):\n    return sum(a)\n', tests)
    expect(plainMessage(out.results[0].error!)).toBe(
      '`total_damage` is not defined. Check the spelling, or define it before using it.',
    )
  })

  it('captures printed output and keeps it out of results', async () => {
    const out = await run('print("hi")\ndef total_damage(a):\n    print("x")\n    return sum(a)\n', tests)
    expect(out.stdout).toBe('hi\n')
    expect(out.results.every((r) => r.status === 'pass')).toBe(true)
  })

  it('runs each test with its own setup', async () => {
    const out = await run('total = 0\nfor x in log:\n    total += x\n', [
      { id: 'a', setup: 'log = [1, 2]', call: 'total', expected: '3' },
      { id: 'b', setup: 'log = []', call: 'total', expected: '0' },
    ])
    expect(out.error).toBeNull()
    expect(out.results.map((r) => r.status)).toEqual(['pass', 'pass'])
  })

  it('treats 0 and 0.0 as equal numbers', async () => {
    const out = await run('def f():\n    return 0.0\n', [{ id: 't', call: 'f()', expected: '0' }])
    expect(out.results[0].status).toBe('pass')
  })

  it('does not treat True as 1', async () => {
    const out = await run('def f():\n    return 1\n', [{ id: 't', call: 'f()', expected: 'True' }])
    expect(out.results[0].status).toBe('fail')
  })

  it('refuses input() plainly', async () => {
    const out = await run('name = input()\n', [])
    expect(plainMessage(out.error!)).toMatch(/input\(\) is not available/)
  })

  it('cuts very long output', async () => {
    const out = await run('for i in range(100000):\n    print(i)\n', [])
    expect(out.stdout.length).toBeLessThan(4100)
    expect(out.stdout).toMatch(/output cut/)
  })
})
