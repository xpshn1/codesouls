import { useMemo, useState } from 'react'
import './App.css'

type Lesson = {
  id: string
  title: string
  concept: string
  xp: number
  difficulty: 'Beginner' | 'Apprentice' | 'Boss Prep'
  summary: string
  practice: string
  code: string
}

const lessons: Lesson[] = [
  {
    id: 'variables',
    title: 'Variable Ashes',
    concept: 'Variables',
    xp: 20,
    difficulty: 'Beginner',
    summary: 'A variable stores a value so your program can reuse it later.',
    practice: 'Create a player name and use it inside a sentence.',
    code: 'const playerName = "Ash";\nconst message = `Rise, ${playerName}.`;',
  },
  {
    id: 'arrays',
    title: 'Inventory of Embers',
    concept: 'Arrays',
    xp: 25,
    difficulty: 'Beginner',
    summary: 'An array stores a list of values in one place.',
    practice: 'Put several attack values into one list.',
    code: 'const attacks = [12, 8, 15];\nconst firstAttack = attacks[0];',
  },
  {
    id: 'loops',
    title: 'Loop Gauntlet',
    concept: 'Loops',
    xp: 30,
    difficulty: 'Apprentice',
    summary: 'A loop repeats work for every item in a list.',
    practice: 'Add each attack value to a running total.',
    code: 'let total = 0;\nfor (const attack of attacks) {\n  total += attack;\n}',
  },
  {
    id: 'functions',
    title: 'Function Forge',
    concept: 'Functions',
    xp: 35,
    difficulty: 'Boss Prep',
    summary: 'A function wraps steps into a reusable command.',
    practice: 'Move the damage math into a named function.',
    code: 'function getTotalDamage(attacks) {\n  return attacks.reduce((total, attack) => total + attack, 0);\n}',
  },
]

const bossRequirements = lessons.map((lesson) => lesson.id)

function App() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id)

  const activeLesson =
    lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0]

  const xp = useMemo(
    () =>
      lessons
        .filter((lesson) => completedLessons.includes(lesson.id))
        .reduce((total, lesson) => total + lesson.xp, 0),
    [completedLessons],
  )

  const readiness = Math.round(
    (completedLessons.length / bossRequirements.length) * 100,
  )
  const isBossUnlocked = readiness === 100

  function toggleLesson(lessonId: string) {
    setCompletedLessons((current) =>
      current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId],
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-panel" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Code Souls</p>
          <h1 id="page-title">Train on smaller concepts, then face the boss.</h1>
          <p className="hero-text">
            This first campaign teaches the chain behind a damage calculator:
            variables, arrays, loops, and functions.
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

      <section className="learning-layout" aria-label="Learning campaign">
        <aside className="lesson-path" aria-label="Concept path">
          {lessons.map((lesson, index) => {
            const isComplete = completedLessons.includes(lesson.id)
            const isActive = lesson.id === activeLesson.id

            return (
              <button
                type="button"
                className={`path-step ${isActive ? 'active' : ''}`}
                key={lesson.id}
                onClick={() => setActiveLessonId(lesson.id)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{lesson.concept}</strong>
                <small>{isComplete ? 'Mastered' : lesson.difficulty}</small>
              </button>
            )
          })}
        </aside>

        <article className="lesson-card">
          <div>
            <span className="card-kicker">{activeLesson.difficulty}</span>
            <h2>{activeLesson.title}</h2>
            <p>{activeLesson.summary}</p>
          </div>

          <div className="practice-panel">
            <h3>Practice Goal</h3>
            <p>{activeLesson.practice}</p>
          </div>

          <pre aria-label={`${activeLesson.concept} example code`}>
            <code>{activeLesson.code}</code>
          </pre>

          <button
            type="button"
            className={
              completedLessons.includes(activeLesson.id) ? 'complete' : ''
            }
            onClick={() => toggleLesson(activeLesson.id)}
          >
            {completedLessons.includes(activeLesson.id)
              ? 'Mark as still practicing'
              : `Practice for ${activeLesson.xp} XP`}
          </button>
        </article>

        <article className="boss-card">
          <span className="card-kicker">Boss Gate</span>
          <h2>Damage Calculator</h2>
          <p>
            Build a function that receives a list of attack values, loops through
            them, and returns the final damage total.
          </p>

          <div className="requirement-list">
            {lessons.map((lesson) => {
              const isComplete = completedLessons.includes(lesson.id)

              return (
                <div className="requirement-row" key={lesson.id}>
                  <span aria-hidden="true">{isComplete ? '✓' : '○'}</span>
                  <div>
                    <strong>{lesson.concept}</strong>
                    <small>{lesson.practice}</small>
                  </div>
                </div>
              )
            })}
          </div>

          <button type="button" disabled={!isBossUnlocked}>
            {isBossUnlocked ? 'Enter boss puzzle' : 'Master all prerequisites'}
          </button>
        </article>
      </section>
    </main>
  )
}

export default App
