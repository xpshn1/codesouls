// The slice as a path: each chunk's drills, then its boss (spec FR-18). Bosses are never locked (FR-6).
import { chunks } from '../../content/index.ts'
import type { Drill } from '../../content/types.ts'
import { bossState, type Progress } from '../../game/progress.ts'
import type { Nav } from '../App.tsx'
import { CheckIcon, SkullIcon, SoulIcon, SwordIcon } from './Icons.tsx'

const TYPE_LABEL: Record<Drill['type'], string> = {
  write: 'Write',
  predict: 'Predict',
  fix: 'Fix',
  reorder: 'Reorder',
}

export function SliceMap({ progress, nav }: { progress: Progress; nav: Nav }) {
  return (
    <ol className="slice-map" aria-label="Python Foundations">
      {chunks.map((chunk, chunkIndex) => {
        const boss = chunk.boss
        const state = bossState(progress, boss.id)
        const waiting = progress.souls.unbanked[chunk.id]
        const passedCount = chunk.drills.filter((d) => progress.drillsPassed.includes(d.id)).length
        return (
          <li key={chunk.id} className="chunk" style={{ animationDelay: `${chunkIndex * 70}ms` }}>
            <div className="chunk-rail" aria-hidden="true">
              <span className={`chunk-orb ${state.beaten ? 'lit' : ''}`} />
            </div>
            <div className="chunk-body">
              <header className="chunk-head">
                <span className="kicker">
                  {chunk.boss.final ? 'Final trial' : `Chunk ${chunkIndex + 1}`} · {passedCount}/{chunk.drills.length} drills
                </span>
                <h3>{chunk.name}</h3>
                <p className="muted">{chunk.summary}</p>
              </header>
              <div className="drill-row">
                {chunk.drills.map((drill) => {
                  const passed = progress.drillsPassed.includes(drill.id)
                  return (
                    <button
                      key={drill.id}
                      type="button"
                      className={`drill-node ${passed ? 'passed' : ''}`}
                      onClick={() => nav({ kind: 'drill', drillId: drill.id })}
                    >
                      <span className="drill-node-type">{TYPE_LABEL[drill.type]}</span>
                      <span className="drill-node-title">{drill.title}</span>
                      <span className="drill-node-foot">
                        {passed ? (
                          <>
                            <CheckIcon size={14} /> Passed
                          </>
                        ) : (
                          <>
                            <SoulIcon size={14} /> {drill.souls}
                          </>
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                className={`boss-card ${state.beaten ? 'beaten' : ''} ${boss.final ? 'final' : ''}`}
                onClick={() => nav({ kind: 'boss', bossId: boss.id })}
              >
                <span className="boss-card-icon" aria-hidden="true">
                  <SwordIcon size={22} />
                </span>
                <span className="boss-card-text">
                  <span className="kicker">{boss.final ? 'Final boss' : 'Mini-boss'}</span>
                  <span className="boss-card-name">{boss.name}</span>
                  <span className="boss-card-epithet">{boss.epithet}</span>
                </span>
                <span className="boss-card-meta">
                  {state.beaten ? (
                    <span className="beaten-tag">Felled</span>
                  ) : (
                    <>
                      <span className="boss-card-deaths">
                        <SkullIcon size={15} /> {state.deaths}
                      </span>
                      {waiting > 0 && (
                        <span className="boss-card-souls">
                          <SoulIcon size={15} /> {waiting} wait at the gate
                        </span>
                      )}
                    </>
                  )}
                  <span className="boss-card-xp">{boss.xp} XP</span>
                </span>
              </button>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
