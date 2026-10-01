// Shown while Python starts (spec FR-20, NFR-3), or when it fails to (spec §7).
import { FlameIcon } from '../parts/Icons.tsx'

export function Loading({ failed, onRetry }: { failed: boolean; onRetry: () => void }) {
  return (
    <main className="loading">
      <div className={`loading-flame ${failed ? 'out' : ''}`}>
        <FlameIcon size={56} />
      </div>
      <h1 className="loading-title">Code Souls</h1>
      {failed ? (
        <div className="loading-failed" role="alert">
          <p>The flame would not catch: Python failed to start.</p>
          <button type="button" className="btn btn-ember" onClick={onRetry}>
            Try again
          </button>
        </div>
      ) : (
        <p className="loading-text" role="status">
          Kindling the Python flame…
        </p>
      )}
    </main>
  )
}
