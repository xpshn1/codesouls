// Boss health: share of tests still failing (spec FR-8), with a lagging "chip" that drains after the hit (FR-21).
export function HealthBar({ percent, name }: { percent: number; name: string }) {
  return (
    <div className="health" role="meter" aria-label={`${name} health`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      <div className="health-name">{name}</div>
      <div className="health-track">
        <div className="health-chip" style={{ width: `${percent}%` }} />
        <div className="health-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
