// The bonfire: reviews due today (spec FR-14, FR-15, FR-20, FR-21).
import { drillById } from '../../content/index.ts'
import { dueReviews, REVIEW_GAPS } from '../../game/reviews.ts'
import type { GameProps } from '../App.tsx'
import { BackIcon } from '../parts/Icons.tsx'

export function Bonfire({ progress, nav, today }: GameProps) {
  const due = dueReviews(progress, today)
  return (
    <main className="bonfire">
      <header className="fight-head">
        <button type="button" className="btn btn-ghost back-btn" onClick={() => nav({ kind: 'hub' })}>
          <BackIcon /> Hub
        </button>
        <div className="fight-title">
          <span className="kicker">Rest and remember</span>
          <h1>The Bonfire</h1>
        </div>
        <span />
      </header>

      <div className="bonfire-scene" aria-hidden="true">
        <div className="fire large">
          <span className="flame f1" />
          <span className="flame f2" />
          <span className="flame f3" />
          <span className="flame f4" />
          <span className="ember e1" />
          <span className="ember e2" />
          <span className="ember e3" />
        </div>
        <div className="sword-in-fire" />
      </div>

      {due.length === 0 ? (
        <p className="bonfire-empty">The bonfire is quiet today. Nothing calls for review.</p>
      ) : (
        <ul className="review-list" aria-label="Reviews due">
          {due.map((id, index) => {
            const drill = drillById(id)!
            const step = Math.min(progress.skills[id].step, REVIEW_GAPS.length - 1)
            return (
              <li key={id} className="review-item" style={{ animationDelay: `${index * 60}ms` }}>
                <div>
                  <span className="kicker">
                    Review {step + 1} of {REVIEW_GAPS.length}
                  </span>
                  <p className="review-title">{drill.title}</p>
                  <p className="muted small">{drill.skill}</p>
                </div>
                <button type="button" className="btn btn-ember" onClick={() => nav({ kind: 'drill', drillId: id, review: true })}>
                  Begin
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}
