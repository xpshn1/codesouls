import { useState } from 'react'
import { campaigns, finalBoss, getChallenge } from '../content'
import type { Campaign } from '../content/types'
import type { Progress } from '../state/progress'
import { briefSummary } from './briefSummary'

type Props = {
  progress: Progress
  xp: number
  onOpen: (challengeId: string) => void
  onReset: () => void
}

const ranks = [
  { min: 0, title: 'Cadet' },
  { min: 150, title: 'Apprentice' },
  { min: 500, title: 'Engineer' },
  { min: 1000, title: 'Senior Engineer' },
  { min: 1800, title: 'AI Architect' },
]

export function Deck({ progress, xp, onOpen, onReset }: Props) {
  const done = (id: string) => progress.completed.includes(id)
  const firstOpen = campaigns.find((c) => !done(c.boss.id)) ?? campaigns[0]
  const [activeCampaignId, setActiveCampaignId] = useState(firstOpen.id)
  const [confirmReset, setConfirmReset] = useState(false)

  const activeCampaign = campaigns.find((c) => c.id === activeCampaignId) ?? campaigns[0]

  const allNodes = [...campaigns.flatMap((c) => [...c.drills, c.boss]), finalBoss]
  const overall = Math.round(
    (allNodes.filter((node) => done(node.id)).length / allNodes.length) * 100,
  )
  const totalDeaths = Object.values(progress.deaths).reduce((a, b) => a + b, 0)
  const rank = [...ranks].reverse().find((r) => xp >= r.min) ?? ranks[0]
  const bossesDown = campaigns.filter((c) => done(c.boss.id)).length
  const finalUnlocked = bossesDown === campaigns.length

  const readiness = (campaign: Campaign) =>
    Math.round(
      (campaign.drills.filter((d) => done(d.id)).length / campaign.drills.length) * 100,
    )

  const boss = activeCampaign.boss
  const bossDeaths = progress.deaths[boss.id] ?? 0
  const retreat = progress.retreatTo[boss.id] ?? []
  const bossHp = done(boss.id) ? 0 : progress.bossHp[boss.id] ?? 1

  return (
    <main className="console-shell">
      <header className="command-bar" aria-label="Code Souls command bar">
        <div className="brand-mark" aria-hidden="true">
          <span />
        </div>
        <div>
          <p className="eyebrow">Code Souls // Terminal v1.0</p>
          <h1 id="page-title">AI Engineer Command Deck</h1>
        </div>
        <div className="command-meta">
          <span>RANK: {rank.title.toUpperCase()}</span>
          <span>XP: {xp}</span>
          <span>SYNC: {overall}%</span>
          <span>DEATHS: {totalDeaths}</span>
        </div>
      </header>

      <div className="cockpit-grid">
        <aside className="side-rail panel" aria-label="Learning navigation">
          <div className="pilot-card">
            <div className="pilot-avatar" aria-hidden="true">
              AI
            </div>
            <div>
              <span>{rank.title.toUpperCase()}</span>
              <strong>ZERO.NORTH</strong>
              <small>
                {bossesDown} / {campaigns.length} bosses down
              </small>
            </div>
          </div>

          <nav className="campaign-nav" aria-label="Campaigns">
            {campaigns.map((campaign, index) => (
              <button
                type="button"
                className={`nav-node ${campaign.id === activeCampaign.id ? 'active' : ''}`}
                key={campaign.id}
                onClick={() => setActiveCampaignId(campaign.id)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{campaign.title}</strong>
                <small>
                  {campaign.domain} / {readiness(campaign)}%
                  {done(campaign.boss.id) ? ' / BOSS DOWN' : ''}
                </small>
              </button>
            ))}
          </nav>

          <div className="system-feed">
            <span>SYS.LOG</span>
            <p>You can challenge a boss at any time. Losing shows you which drill to train next.</p>
            <p>Progress saves in this browser.</p>
            <button type="button" className="ghost small" onClick={() => {
              if (confirmReset) {
                onReset()
                setConfirmReset(false)
              } else {
                setConfirmReset(true)
              }
            }}>
              {confirmReset ? 'Confirm: wipe progress' : 'Reset progress'}
            </button>
          </div>
        </aside>

        <section className="main-viewport panel" aria-labelledby="page-title">
          <div className="viewport-copy">
            <span className="card-kicker">Current Sector</span>
            <h2>{activeCampaign.title}</h2>
            <p>{activeCampaign.summary}</p>
          </div>

          <div className="orbital-map">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            {campaigns.map((campaign, index) => (
              <button
                type="button"
                className={`orbital-node node-${index + 1} ${
                  campaign.id === activeCampaign.id ? 'active' : ''
                } ${done(campaign.boss.id) ? 'cleared' : ''}`}
                key={campaign.id}
                onClick={() => setActiveCampaignId(campaign.id)}
                aria-label={campaign.title}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="status-row">
            <div>
              <span>SECTOR MASTERY</span>
              <strong>{readiness(activeCampaign)}%</strong>
            </div>
            <div>
              <span>GLOBAL SYNC</span>
              <strong>{overall}%</strong>
            </div>
            <div>
              <span>XP RESERVE</span>
              <strong>{xp}</strong>
            </div>
          </div>
        </section>

        <aside className="mission-terminal panel" aria-label="Campaign boss">
          <span className="card-kicker">
            {activeCampaign.difficulty} Boss // {boss.xp} XP
          </span>
          <h2>{boss.title}</h2>
          <p>{boss.concept}.</p>

          <div className="boss-hp compact">
            <div className="hp-track">
              <div className="hp-fill" style={{ width: `${Math.round(bossHp * 100)}%` }} />
            </div>
            <small>
              {done(boss.id) ? 'DEFEATED' : `HP ${Math.round(bossHp * 100)}%`} // DEATHS{' '}
              {bossDeaths}
            </small>
          </div>

          <div className="requirement-list">
            {activeCampaign.drills.map((drill) => {
              const recommended = retreat.includes(drill.id)
              return (
                <button
                  type="button"
                  className={`requirement-row ${recommended ? 'recommended' : ''}`}
                  key={drill.id}
                  onClick={() => onOpen(drill.id)}
                >
                  <span aria-hidden="true">{done(drill.id) ? 'OK' : '--'}</span>
                  <div>
                    <strong>{drill.concept}</strong>
                    <small>
                      {recommended
                        ? done(drill.id)
                          ? 'Trained. Take it back to the boss. '
                          : 'The boss beat you here. Train this. '
                        : ''}
                      {drill.title}
                    </small>
                  </div>
                </button>
              )
            })}
          </div>

          <button type="button" onClick={() => onOpen(boss.id)}>
            {done(boss.id) ? 'Replay boss' : bossDeaths ? 'Rematch boss' : 'Challenge boss'}
          </button>
        </aside>
      </div>

      <section className="training-console panel" aria-label="Training nodes">
        <div className="section-heading">
          <div>
            <span className="card-kicker">Training Deck</span>
            <h2>{activeCampaign.title} Drills</h2>
          </div>
          <p>
            {activeCampaign.domain} / {activeCampaign.difficulty}
          </p>
        </div>

        <div className="milestone-list">
          {activeCampaign.drills.map((drill) => {
            const complete = done(drill.id)
            return (
              <article className="milestone-card" key={drill.id}>
                <div>
                  <span className="card-kicker">{drill.concept}</span>
                  <h3>{drill.title}</h3>
                  <p>{briefSummary(drill.brief)}</p>
                </div>
                <pre aria-label={`${drill.concept} starter`}>
                  <code>{drill.starter.trim()}</code>
                </pre>
                <div className="node-footer">
                  <button
                    type="button"
                    className={complete ? 'complete' : ''}
                    onClick={() => onOpen(drill.id)}
                  >
                    {complete ? 'Replay drill' : `Enter drill (${drill.xp} XP)`}
                  </button>
                  <span>
                    {complete ? 'MASTERED' : progress.drafts[drill.id] ? 'IN PROGRESS' : 'STANDBY'}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="final-boss panel" aria-label="Final boss">
        <div>
          <span className="card-kicker">Final Boss // {finalBoss.xp} XP</span>
          <h2>{finalBoss.title}: {finalBoss.concept}</h2>
          <p>
            Retrieval, validation, grounding, caching, and monitoring all in one
            assistant. The gate opens once all five campaign bosses are defeated.
          </p>
        </div>

        <div className="final-requirements">
          {campaigns.map((campaign) => (
            <span className={done(campaign.boss.id) ? 'ready' : ''} key={campaign.id}>
              {getChallenge(campaign.boss.id)?.title}
            </span>
          ))}
        </div>

        <button
          type="button"
          disabled={!finalUnlocked}
          onClick={() => onOpen(finalBoss.id)}
        >
          {!finalUnlocked
            ? `Gate sealed (${bossesDown}/${campaigns.length})`
            : done(finalBoss.id)
              ? 'Replay final boss'
              : 'Enter the gate'}
        </button>
      </section>
    </main>
  )
}
