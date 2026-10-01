// NFR-2: the app makes no network requests beyond its own files.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function filesUnder(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? filesUnder(path) : [path]
  })
}

describe('offline (NFR-2)', () => {
  it('has no external URLs in the app source', () => {
    const offenders = filesUnder('src').filter((file) =>
      /https?:\/\//.test(readFileSync(file, 'utf8')),
    )
    expect(offenders).toEqual([])
  })

  it('has no external URLs in index.html', () => {
    expect(readFileSync('index.html', 'utf8')).not.toMatch(/https?:\/\//)
  })
})
