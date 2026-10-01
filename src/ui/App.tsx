import { useCallback, useEffect, useReducer, useState } from 'react'
import { todayLocal } from '../game/dates.ts'
import { reduce, type Action, type Progress } from '../game/progress.ts'
import { loadProgress, saveProgress, type StorageLike } from '../game/storage.ts'
import type { RunnerStatus } from '../engine/runner.ts'
import { RunnerContext, type RunnerApi } from './runtime.ts'
import { Loading } from './screens/Loading.tsx'
import { Hub } from './screens/Hub.tsx'
import { BossFight } from './screens/BossFight.tsx'
import { Drill } from './screens/Drill.tsx'
import { Bonfire } from './screens/Bonfire.tsx'
import './app.css'

export type Screen =
  | { kind: 'hub' }
  | { kind: 'boss'; bossId: string }
  | { kind: 'drill'; drillId: string; review?: boolean; fromBoss?: string }
  | { kind: 'bonfire' }

export type Nav = (screen: Screen) => void

export type GameProps = {
  progress: Progress
  dispatch: (action: Action) => void
  nav: Nav
  today: string
}

type Props = {
  runner: RunnerApi
  storage: StorageLike
  /** Supplies the current day; tests pass a fixed one (NFR-1). */
  today?: () => string
}

function screenKey(screen: Screen): string {
  switch (screen.kind) {
    case 'boss':
      return `boss:${screen.bossId}`
    case 'drill':
      return `drill:${screen.drillId}:${screen.review ? 'review' : 'learn'}`
    default:
      return screen.kind
  }
}

export default function App({ runner, storage, today = () => todayLocal() }: Props) {
  const [initial] = useState(() => loadProgress(storage))
  const [progress, dispatch] = useReducer(reduce, initial.progress)
  const [unreadable, setUnreadable] = useState(initial.unreadable)
  const [status, setStatus] = useState<RunnerStatus>('loading')
  const [everReady, setEverReady] = useState(false)
  const [screen, setScreen] = useState<Screen>({ kind: 'hub' })

  useEffect(() => saveProgress(storage, progress), [storage, progress])

  useEffect(
    () =>
      runner.onStatus((next) => {
        setStatus(next)
        if (next === 'ready') setEverReady(true)
      }),
    [runner],
  )

  const nav = useCallback<Nav>((next) => {
    setScreen(next)
    window.scrollTo?.({ top: 0 })
  }, [])

  const day = today()

  if (!everReady) return <Loading failed={status === 'failed'} onRetry={() => runner.restart()} />

  const game: GameProps = { progress, dispatch, nav, today: day }

  return (
    <RunnerContext.Provider value={runner}>
      <div className="app">
        {status !== 'ready' && (
          <div className="runner-status" role="status">
            {status === 'failed' ? (
              <>
                Python stopped working.{' '}
                <button type="button" className="link-btn" onClick={() => runner.restart()}>
                  Try again
                </button>
              </>
            ) : (
              'Rekindling Python…'
            )}
          </div>
        )}
        <div className="screen-enter" key={screenKey(screen)}>
          {screen.kind === 'hub' && (
            <Hub {...game} storage={storage} unreadable={unreadable} onUnreadableResolved={() => setUnreadable(false)} />
          )}
          {screen.kind === 'boss' && <BossFight {...game} bossId={screen.bossId} />}
          {screen.kind === 'drill' && (
            <Drill {...game} drillId={screen.drillId} review={screen.review ?? false} fromBoss={screen.fromBoss} />
          )}
          {screen.kind === 'bonfire' && <Bonfire {...game} />}
        </div>
      </div>
    </RunnerContext.Provider>
  )
}
