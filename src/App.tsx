import { useMemo, useState } from 'react'
import './App.css'

type Drill = {
  id: number
  title: string
  concept: string
  xp: number
  prompt: string
}

const drills: Drill[] = [
  {
    id: 1,
    title: 'Variable Ashes',
    concept: 'Variables',
    xp: 20,
    prompt: 'Store a player name and reuse it in a message.',
  },
  {
    id: 2,
    title: 'Loop Gauntlet',
    concept: 'Loops',
    xp: 30,
    prompt: 'Repeat an action until every item in a list has been checked.',
  },
  {
    id: 3,
    title: 'Function Forge',
    concept: 'Functions',
    xp: 40,
    prompt: 'Break a larger task into a named reusable step.',
  },
]

function App() {
  const [completedDrills, setCompletedDrills] = useState<number[]>([])

  const xp = useMemo(
    () =>
      drills
        .filter((drill) => completedDrills.includes(drill.id))
        .reduce((total, drill) => total + drill.xp, 0),
    [completedDrills],
  )

  const readiness = Math.min(Math.round((xp / 90) * 100), 100)

  function toggleDrill(drillId: number) {
    setCompletedDrills((current) =>
      current.includes(drillId)
        ? current.filter((id) => id !== drillId)
        : [...current, drillId],
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Code Souls</p>
          <h1 id="page-title">Defeat programming concepts by training smarter.</h1>
          <p className="hero-text">
            Face a hard boss puzzle, retreat into smaller drills when stuck, gain
            XP, then return with the exact skills needed to win.
          </p>
        </div>

        <div className="status-board" aria-label="Current learner status">
          <span className="status-label">Current Build</span>
          <strong>{xp} XP</strong>
          <div className="progress-track" aria-label={`${readiness}% ready`}>
            <span style={{ width: `${readiness}%` }} />
          </div>
          <small>{readiness}% ready for the boss puzzle</small>
        </div>
      </section>

      <section className="campaign-grid" aria-label="Learning campaign">
        <article className="boss-card">
          <span className="card-kicker">Boss Gate</span>
          <h2>Write a damage calculator</h2>
          <p>
            Combine variables, conditionals, loops, and functions to calculate
            combat damage from a list of attacks.
          </p>
          <ul>
            <li>Read attack values from an array</li>
            <li>Apply a critical-hit condition</li>
            <li>Return the final total from a function</li>
          </ul>
          <button type="button" disabled={readiness < 100}>
            {readiness < 100 ? 'Train before entering' : 'Enter boss puzzle'}
          </button>
        </article>

        <div className="drill-list">
          {drills.map((drill) => {
            const isComplete = completedDrills.includes(drill.id)

            return (
              <article className="drill-card" key={drill.id}>
                <div>
                  <span className="card-kicker">{drill.concept}</span>
                  <h3>{drill.title}</h3>
                  <p>{drill.prompt}</p>
                </div>
                <button
                  type="button"
                  className={isComplete ? 'complete' : ''}
                  onClick={() => toggleDrill(drill.id)}
                >
                  {isComplete ? 'Practiced' : `Gain ${drill.xp} XP`}
                </button>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default App
