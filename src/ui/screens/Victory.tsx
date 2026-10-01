// Victory: XP gained, souls banked, rank (spec FR-9, FR-13, FR-21).
import { useEffect, useRef } from 'react'
import type { Boss } from '../../content/types.ts'
import { useCountUp } from '../hooks.ts'
import { SoulIcon } from '../parts/Icons.tsx'

export type VictoryInfo = { xpGained: number; soulsBanked: number; rankBefore: string; rankAfter: string }

export function Victory({ boss, info, onReturn }: { boss: Boss; info: VictoryInfo; onReturn: () => void }) {
  const xp = useCountUp(info.xpGained, 1100)
  const souls = useCountUp(info.soulsBanked, 1100)
  const button = useRef<HTMLButtonElement>(null)
  useEffect(() => button.current?.focus(), [])

  return (
    <div className="overlay victory" role="dialog" aria-modal="true" aria-labelledby="victory-title">
      <div className="victory-band">
        <h2 id="victory-title" className="victory-title">
          {boss.final ? 'Victory Achieved' : `${boss.name} Felled`}
        </h2>
      </div>
      <div className="victory-body">
        {info.xpGained > 0 ? (
          <div className="victory-gains">
            <div>
              <span className="kicker">XP</span>
              <strong className="gain">+{xp}</strong>
            </div>
            <div>
              <span className="kicker">Souls banked</span>
              <strong className="gain">
                <SoulIcon size={22} /> {souls}
              </strong>
            </div>
          </div>
        ) : (
          <p className="muted">Felled once more. No new rewards, but the skill is still yours.</p>
        )}
        {info.rankAfter !== info.rankBefore && (
          <p className="victory-rank">
            Rank attained: <strong>{info.rankAfter}</strong>
          </p>
        )}
        <p className="muted small">Its skills will call you back to the bonfire tomorrow.</p>
        <button ref={button} type="button" className="btn btn-ember" onClick={onReturn}>
          Return to the hub
        </button>
      </div>
    </div>
  )
}
