// Animated stat displays: XP bar with rank, souls counter (spec FR-18, FR-21).
import { useEffect, useRef, useState } from 'react'
import { rankFor } from '../../game/rank.ts'
import { useCountUp, useGlowOnIncrease } from '../hooks.ts'
import { SkullIcon, SoulIcon } from './Icons.tsx'

export function XpBar({ xp }: { xp: number }) {
  const shown = useCountUp(xp)
  const rank = rankFor(xp)
  const [rankUp, setRankUp] = useState<string | null>(null)
  const previousFloor = useRef(rank.floor)

  useEffect(() => {
    const risen = rank.floor > previousFloor.current
    previousFloor.current = rank.floor
    if (!risen) return
    const on = setTimeout(() => setRankUp(rank.name), 0)
    const off = setTimeout(() => setRankUp(null), 2400)
    return () => {
      clearTimeout(on)
      clearTimeout(off)
    }
  }, [rank.floor, rank.name])

  return (
    <div className="xp" aria-label={`Rank ${rank.name}, ${xp} XP`}>
      <div className="xp-head">
        <span className="xp-rank">{rank.name}</span>
        <span className="xp-num">
          {shown} XP{rank.next !== null && <span className="muted"> / {rank.next}</span>}
        </span>
      </div>
      <div className="xp-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(rank.progress * 100)} aria-label={rank.nextName ? `Progress to ${rank.nextName}` : 'Highest rank'}>
        <div className="xp-fill" style={{ width: `${rank.progress * 100}%` }} />
      </div>
      {rankUp && (
        <div className="rank-up" role="status">
          Rank attained: <strong>{rankUp}</strong>
        </div>
      )}
    </div>
  )
}

export function SoulsCounter({ banked, unbanked }: { banked: number; unbanked: number }) {
  const shownBanked = useCountUp(banked)
  const shownUnbanked = useCountUp(unbanked)
  const glowBanked = useGlowOnIncrease(banked)
  const glowUnbanked = useGlowOnIncrease(unbanked)
  return (
    <div className="souls" aria-label={`${banked} souls banked, ${unbanked} unbanked`}>
      <span className={`souls-banked ${glowBanked ? 'glow' : ''}`}>
        <SoulIcon /> <strong>{shownBanked}</strong> <span className="muted">souls</span>
      </span>
      <span className={`souls-unbanked ${glowUnbanked ? 'glow' : ''} ${unbanked > 0 ? 'has' : ''}`} title="Unbanked: kept until you beat that chunk's boss">
        +{shownUnbanked} <span>unbanked</span>
      </span>
    </div>
  )
}

export function DeathCount({ deaths }: { deaths: number }) {
  const shown = useCountUp(deaths, 600)
  return (
    <span className="death-count" aria-label={`${deaths} deaths`}>
      <SkullIcon /> <strong>{shown}</strong> <span className="muted">deaths</span>
    </span>
  )
}

export function Meter({ label, value, max, tone = 'ember' }: { label: string; value: number; max: number; tone?: 'ember' | 'pass' }) {
  const shown = useCountUp(value)
  const pct = max === 0 ? 0 : (value / max) * 100
  return (
    <div className="meter">
      <div className="meter-head">
        <span>{label}</span>
        <span>
          <strong>{shown}</strong>
          <span className="muted"> / {max}</span>
        </span>
      </div>
      <div className="meter-track">
        <div className={`meter-fill tone-${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
