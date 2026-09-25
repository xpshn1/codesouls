import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { Deck } from './components/Deck'
import { allChallenges, campaigns, finalBoss, getChallenge } from './content'
import { useProgress } from './state/progress'

// The arena pulls in the code editor, so load it only when a challenge opens.
const Arena = lazy(() => import('./components/Arena').then((m) => ({ default: m.Arena })))

function readRoute(): string | null {
  const match = window.location.hash.match(/^#\/c\/([\w-]+)$/)
  return match && getChallenge(match[1]) ? match[1] : null
}

function App() {
  const { progress, update, reset } = useProgress()
  const [routeId, setRouteId] = useState<string | null>(readRoute)

  useEffect(() => {
    const onHash = () => setRouteId(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((challengeId: string | null) => {
    window.location.hash = challengeId ? `/c/${challengeId}` : ''
  }, [])

  const xp = useMemo(
    () =>
      allChallenges
        .filter((challenge) => progress.completed.includes(challenge.id))
        .reduce((total, challenge) => total + challenge.xp, 0),
    [progress.completed],
  )

  // The final boss stays sealed until every campaign boss is down.
  const finalSealed = !campaigns.every((c) => progress.completed.includes(c.boss.id))
  const challenge =
    routeId && !(routeId === finalBoss.id && finalSealed) ? getChallenge(routeId) : undefined

  if (challenge) {
    return (
      <Suspense fallback={<main className="console-shell loading">Loading arena…</main>}>
        <Arena
          key={challenge.id}
          challenge={challenge}
          progress={progress}
          update={update}
          navigate={navigate}
        />
      </Suspense>
    )
  }

  return <Deck progress={progress} xp={xp} onOpen={navigate} onReset={reset} />
}

export default App
