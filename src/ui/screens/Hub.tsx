// The hub: slice map, stats, bonfire, backups (spec FR-15, FR-17, FR-18).
import { useRef, useState } from 'react'
import { bosses, drills } from '../../content/index.ts'
import { unbankedTotal } from '../../game/progress.ts'
import { dueReviews } from '../../game/reviews.ts'
import {
  backupFileName,
  discardUnreadable,
  exportText,
  parseProgress,
  type StorageLike,
} from '../../game/storage.ts'
import type { GameProps } from '../App.tsx'
import { FlameIcon } from '../parts/Icons.tsx'
import { SliceMap } from '../parts/SliceMap.tsx'
import { DeathCount, Meter, SoulsCounter, XpBar } from '../parts/Stats.tsx'

type Props = GameProps & {
  storage: StorageLike
  unreadable: boolean
  onUnreadableResolved: () => void
}

export function Hub({ progress, dispatch, nav, today, storage, unreadable, onUnreadableResolved }: Props) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [notice, setNotice] = useState<{ tone: 'ok' | 'bad'; text: string } | null>(null)

  const due = dueReviews(progress, today)
  const deaths = Object.values(progress.bosses).reduce((sum, b) => sum + b.deaths, 0)
  const beaten = bosses.filter((b) => progress.bosses[b.id]?.beaten).length
  const skillsPassed = Object.keys(progress.skills).length

  const exportBackup = () => {
    const url = URL.createObjectURL(new Blob([exportText(progress)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = backupFileName(today)
    link.click()
    URL.revokeObjectURL(url)
    setNotice({ tone: 'ok', text: 'Backup saved.' })
  }

  const importBackup = async (file: File) => {
    const parsed = parseProgress(await file.text())
    if (!parsed.ok) {
      setNotice({ tone: 'bad', text: `${parsed.message} Your progress was not changed.` })
      return
    }
    dispatch({ type: 'replaced', progress: parsed.progress })
    discardUnreadable(storage)
    onUnreadableResolved()
    setNotice({ tone: 'ok', text: 'Backup restored.' })
  }

  const startOver = () => {
    discardUnreadable(storage)
    onUnreadableResolved()
  }

  return (
    <main className="hub">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <FlameIcon size={20} />
          </span>
          <div>
            <h1 className="brand-name">Code Souls</h1>
            <p className="kicker">Python Foundations</p>
          </div>
        </div>
        <XpBar xp={progress.xp} />
        <SoulsCounter banked={progress.souls.banked} unbanked={unbankedTotal(progress)} />
        <DeathCount deaths={deaths} />
      </header>

      {unreadable && (
        <div className="banner banner-bad" role="alert">
          <p>Your saved progress could not be read. It has been kept aside. Import a backup, or start over.</p>
          <div className="banner-actions">
            <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
              Import backup
            </button>
            <button type="button" className="btn btn-ghost" onClick={startOver}>
              Start over
            </button>
          </div>
        </div>
      )}

      <div className="hub-grid">
        <section className="hub-map" aria-labelledby="map-title">
          <div className="section-head">
            <h2 id="map-title">The Path</h2>
            <p className="muted">Every boss is open. Face one whenever you like; drills are there when you fall.</p>
          </div>
          <SliceMap progress={progress} nav={nav} />
        </section>

        <aside className="hub-side">
          <section className={`bonfire-card ${due.length > 0 ? 'lit' : 'quiet'}`} aria-labelledby="bonfire-title">
            <div className="bonfire-glow" aria-hidden="true" />
            <div className="fire small" aria-hidden="true">
              <span className="flame f1" />
              <span className="flame f2" />
              <span className="flame f3" />
            </div>
            <h2 id="bonfire-title">Bonfire</h2>
            {due.length > 0 ? (
              <>
                <p>
                  <strong className="ember-text">{due.length}</strong> {due.length === 1 ? 'skill calls' : 'skills call'} for review
                  today.
                </p>
                <button type="button" className="btn btn-ember" onClick={() => nav({ kind: 'bonfire' })}>
                  Rest at the bonfire
                </button>
              </>
            ) : (
              <p className="muted">The bonfire is quiet today.</p>
            )}
          </section>

          <section className="panel stats-card" aria-labelledby="stats-title">
            <h2 id="stats-title">Record</h2>
            <Meter label="Skills passed" value={skillsPassed} max={drills.length} />
            <Meter label="Bosses felled" value={beaten} max={bosses.length} />
            <Meter label="Reviews kept" value={progress.reviews.kept} max={progress.reviews.taken} tone="pass" />
          </section>

          <section className="panel backup-card" aria-labelledby="backup-title">
            <h2 id="backup-title">Backup</h2>
            <p className="muted">Progress saves in this browser. Keep a copy in a file too.</p>
            <div className="backup-actions">
              <button type="button" className="btn" onClick={exportBackup}>
                Export
              </button>
              <button type="button" className="btn" onClick={() => fileInput.current?.click()}>
                Import
              </button>
            </div>
            {notice && (
              <p className={`notice notice-${notice.tone}`} role="status">
                {notice.text}
              </p>
            )}
          </section>
        </aside>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        aria-label="Backup file to import"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void importBackup(file)
          event.target.value = ''
        }}
      />
    </main>
  )
}
