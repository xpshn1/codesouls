import { useMemo, useState } from 'react'
import './App.css'

type Milestone = {
  id: string
  title: string
  concept: string
  xp: number
  summary: string
  practice: string
  example: string
}

type Campaign = {
  id: string
  title: string
  domain: string
  difficulty: 'Foundation' | 'Apprentice' | 'Advanced' | 'Production'
  summary: string
  boss: string
  milestones: Milestone[]
}

const campaigns: Campaign[] = [
  {
    id: 'programming',
    title: 'Programming Foundations',
    domain: 'Code',
    difficulty: 'Foundation',
    summary:
      'Learn to read, write, debug, test, and ship small programs before adding AI complexity.',
    boss: 'Build and deploy a small app that calls an API and handles errors.',
    milestones: [
      {
        id: 'variables-functions',
        title: 'Syntax Hollow',
        concept: 'Variables and functions',
        xp: 20,
        summary: 'Store values and wrap repeated steps into named actions.',
        practice: 'Write a function that formats a user profile message.',
        example:
          'function greet(name: string) {\n  return `Welcome, ${name}`\n}',
      },
      {
        id: 'data-structures',
        title: 'Inventory Keep',
        concept: 'Arrays and objects',
        xp: 25,
        summary: 'Represent lists and real-world things in code.',
        practice: 'Store lessons as objects inside an array.',
        example:
          'const lesson = { title: "Loops", xp: 30 }\nconst lessons = [lesson]',
      },
      {
        id: 'debug-tests',
        title: 'Bugfire Watch',
        concept: 'Debugging and tests',
        xp: 35,
        summary: 'Find mistakes and prove your code still works.',
        practice: 'Write a failing test, fix the bug, then run the test again.',
        example:
          'expect(getTotal([2, 3, 5])).toBe(10)',
      },
    ],
  },
  {
    id: 'math',
    title: 'Math for AI',
    domain: 'Theory',
    difficulty: 'Apprentice',
    summary:
      'Build the probability, statistics, vectors, and optimization intuition needed to reason about models.',
    boss: 'Explain why one model performs better using metrics and probability.',
    milestones: [
      {
        id: 'probability',
        title: 'Chance Catacombs',
        concept: 'Probability',
        xp: 30,
        summary: 'Reason about uncertainty instead of guessing from vibes.',
        practice: 'Calculate the chance of an event from observed outcomes.',
        example: 'probability = favorable_outcomes / total_outcomes',
      },
      {
        id: 'statistics',
        title: 'Metric Chapel',
        concept: 'Statistics',
        xp: 35,
        summary: 'Summarize data and compare results with evidence.',
        practice: 'Compute an average and explain what it hides.',
        example: 'mean = sum(values) / len(values)',
      },
      {
        id: 'vectors',
        title: 'Vector Bridge',
        concept: 'Linear algebra',
        xp: 40,
        summary: 'Understand how models represent information as numbers.',
        practice: 'Compare two vectors with a similarity score.',
        example: 'similarity = dot(a, b) / (norm(a) * norm(b))',
      },
    ],
  },
  {
    id: 'machine-learning',
    title: 'Data and Machine Learning',
    domain: 'Models',
    difficulty: 'Apprentice',
    summary:
      'Learn how datasets become predictions, and how to evaluate whether those predictions are trustworthy.',
    boss: 'Train a simple classifier, evaluate it, and diagnose overfitting.',
    milestones: [
      {
        id: 'datasets',
        title: 'Dataset Marsh',
        concept: 'Data cleaning',
        xp: 35,
        summary: 'Prepare messy input before trusting model output.',
        practice: 'Find missing values and decide how to handle them.',
        example: 'clean_rows = rows.dropna()',
      },
      {
        id: 'training',
        title: 'Training Grounds',
        concept: 'Model training',
        xp: 45,
        summary: 'Fit a model to examples without memorizing noise.',
        practice: 'Split data into training and test sets.',
        example: 'model.fit(train_inputs, train_labels)',
      },
      {
        id: 'evaluation',
        title: 'Evaluation Gate',
        concept: 'Metrics',
        xp: 45,
        summary: 'Use metrics to judge whether a model is useful.',
        practice: 'Choose precision, recall, or accuracy for a scenario.',
        example: 'precision = true_positives / predicted_positives',
      },
    ],
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    domain: 'Neural Nets',
    difficulty: 'Advanced',
    summary:
      'Understand embeddings, neural networks, transformers, fine-tuning, and inference tradeoffs.',
    boss: 'Debug a model input issue and explain the inference tradeoff.',
    milestones: [
      {
        id: 'neural-networks',
        title: 'Neuron Bastion',
        concept: 'Neural networks',
        xp: 50,
        summary: 'Learn how layers transform inputs into predictions.',
        practice: 'Trace data through a tiny network step by step.',
        example: 'output = activation(weight * input + bias)',
      },
      {
        id: 'embeddings',
        title: 'Embedding Vault',
        concept: 'Embeddings',
        xp: 55,
        summary: 'Represent meaning as vectors that can be searched.',
        practice: 'Explain why two similar sentences have close vectors.',
        example: 'nearest = vector_store.search(query_embedding)',
      },
      {
        id: 'transformers',
        title: 'Attention Spire',
        concept: 'Transformers',
        xp: 60,
        summary: 'Understand attention, tokens, context, and model limits.',
        practice: 'Identify what context a model can and cannot use.',
        example: 'response = model.generate(prompt, max_tokens=300)',
      },
    ],
  },
  {
    id: 'production-ai',
    title: 'AI Tools and Production',
    domain: 'Ship',
    difficulty: 'Production',
    summary:
      'Use model APIs, retrieval, agents, evals, safety checks, monitoring, and deployment to build real AI tools.',
    boss: 'Ship a retrieval chatbot with evals, monitoring, and a deployment plan.',
    milestones: [
      {
        id: 'model-apis',
        title: 'API Reliquary',
        concept: 'Model APIs',
        xp: 45,
        summary: 'Call AI models from an app and handle structured results.',
        practice: 'Send a prompt and validate the response shape.',
        example: 'const result = await client.responses.create({ model, input })',
      },
      {
        id: 'rag',
        title: 'Retrieval Depths',
        concept: 'RAG',
        xp: 60,
        summary: 'Ground model answers in documents instead of memory alone.',
        practice: 'Retrieve relevant notes before asking the model to answer.',
        example: 'answer = generate(query, retrieved_context)',
      },
      {
        id: 'evals-monitoring',
        title: 'Evals Citadel',
        concept: 'Evaluation and monitoring',
        xp: 70,
        summary: 'Measure quality, cost, latency, and failure patterns.',
        practice: 'Create a small test set for expected AI behavior.',
        example: 'score = evaluate(outputs, expected_answers)',
      },
    ],
  },
]

const allMilestones = campaigns.flatMap((campaign) => campaign.milestones)

function App() {
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([])
  const [activeCampaignId, setActiveCampaignId] = useState(campaigns[0].id)

  const activeCampaign =
    campaigns.find((campaign) => campaign.id === activeCampaignId) ??
    campaigns[0]

  const xp = useMemo(
    () =>
      allMilestones
        .filter((milestone) => completedMilestones.includes(milestone.id))
        .reduce((total, milestone) => total + milestone.xp, 0),
    [completedMilestones],
  )

  const completedCampaigns = campaigns.filter((campaign) =>
    campaign.milestones.every((milestone) =>
      completedMilestones.includes(milestone.id),
    ),
  )

  const overallReadiness = Math.round(
    (completedMilestones.length / allMilestones.length) * 100,
  )
  const finalBossUnlocked = completedCampaigns.length === campaigns.length

  function getCampaignReadiness(campaign: Campaign) {
    const completedCount = campaign.milestones.filter((milestone) =>
      completedMilestones.includes(milestone.id),
    ).length

    return Math.round((completedCount / campaign.milestones.length) * 100)
  }

  function toggleMilestone(milestoneId: string) {
    setCompletedMilestones((current) =>
      current.includes(milestoneId)
        ? current.filter((id) => id !== milestoneId)
        : [...current, milestoneId],
    )
  }

  const activeCampaignReadiness = getCampaignReadiness(activeCampaign)

  return (
    <main className="console-shell">
      <header className="command-bar" aria-label="Code Souls command bar">
        <div className="brand-mark" aria-hidden="true">
          <span />
        </div>
        <div>
          <p className="eyebrow">Code Souls // Terminal v0.2</p>
          <h1 id="page-title">AI Engineer Command Deck</h1>
        </div>
        <div className="command-meta">
          <span>USER: ZERO.NORTH</span>
          <span>XP: {xp}</span>
          <span>SYNC: {overallReadiness}%</span>
        </div>
      </header>

      <div className="cockpit-grid">
        <aside className="side-rail panel" aria-label="Learning navigation">
          <div className="pilot-card">
            <div className="pilot-avatar" aria-hidden="true">
              AI
            </div>
            <div>
              <span>CADET</span>
              <strong>ZERO.NORTH</strong>
              <small>AI Engineer Build</small>
            </div>
          </div>

          <nav className="campaign-nav" aria-label="Campaigns">
            {campaigns.map((campaign, index) => {
              const readiness = getCampaignReadiness(campaign)
              const isActive = campaign.id === activeCampaign.id

              return (
                <button
                  type="button"
                  className={`nav-node ${isActive ? 'active' : ''}`}
                  key={campaign.id}
                  onClick={() => setActiveCampaignId(campaign.id)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{campaign.title}</strong>
                  <small>
                    {campaign.domain} / {readiness}%
                  </small>
                </button>
              )
            })}
          </nav>

          <div className="system-feed">
            <span>SYS.LOG</span>
            <p>Protocol start: AI engineering path engaged.</p>
            <p>Tip: train missing nodes before boss entry.</p>
          </div>
        </aside>

        <section className="main-viewport panel" aria-labelledby="page-title">
          <div className="viewport-copy">
            <span className="card-kicker">Current Sector</span>
            <h2>{activeCampaign.title}</h2>
            <p>{activeCampaign.summary}</p>
          </div>

          <div className="orbital-map" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            {campaigns.map((campaign, index) => {
              const isActive = campaign.id === activeCampaign.id

              return (
                <button
                  type="button"
                  className={`orbital-node node-${index + 1} ${
                    isActive ? 'active' : ''
                  }`}
                  key={campaign.id}
                  onClick={() => setActiveCampaignId(campaign.id)}
                  aria-label={campaign.title}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>

          <div className="status-row">
            <div>
              <span>SECTOR MASTERY</span>
              <strong>{activeCampaignReadiness}%</strong>
            </div>
            <div>
              <span>GLOBAL SYNC</span>
              <strong>{overallReadiness}%</strong>
            </div>
            <div>
              <span>XP RESERVE</span>
              <strong>{xp}</strong>
            </div>
          </div>
        </section>

        <aside className="mission-terminal panel" aria-label="Selected campaign">
          <span className="card-kicker">{activeCampaign.difficulty}</span>
          <h2>{activeCampaign.boss}</h2>
          <p>
            Campaign boss locked to prerequisite mastery. Train every listed
            node, then return for the combined challenge.
          </p>

          <div className="requirement-list">
            {activeCampaign.milestones.map((milestone) => {
              const isComplete = completedMilestones.includes(milestone.id)

              return (
                <div className="requirement-row" key={milestone.id}>
                  <span aria-hidden="true">{isComplete ? 'OK' : '--'}</span>
                  <div>
                    <strong>{milestone.concept}</strong>
                    <small>{milestone.practice}</small>
                  </div>
                </div>
              )
            })}
          </div>

          <button type="button" disabled={activeCampaignReadiness < 100}>
            {activeCampaignReadiness === 100
              ? 'Enter campaign boss'
              : 'Master campaign nodes'}
          </button>
        </aside>
      </div>

      <section className="training-console panel" aria-label="Training nodes">
        <div className="section-heading">
          <div>
            <span className="card-kicker">Training Deck</span>
            <h2>{activeCampaign.title} Nodes</h2>
          </div>
          <p>{activeCampaign.domain} / {activeCampaign.difficulty}</p>
        </div>

        <div className="milestone-list">
          {activeCampaign.milestones.map((milestone) => {
            const isComplete = completedMilestones.includes(milestone.id)

            return (
              <article className="milestone-card" key={milestone.id}>
                <div>
                  <span className="card-kicker">{milestone.concept}</span>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.summary}</p>
                </div>

                <div className="practice-panel">
                  <h4>Practice Goal</h4>
                  <p>{milestone.practice}</p>
                </div>

                <pre aria-label={`${milestone.concept} example`}>
                  <code>{milestone.example}</code>
                </pre>

                <div className="node-footer">
                  <button
                    type="button"
                    className={isComplete ? 'complete' : ''}
                    onClick={() => toggleMilestone(milestone.id)}
                  >
                    {isComplete ? 'Reopen node' : `Train for ${milestone.xp} XP`}
                  </button>
                  <span>{isComplete ? 'COMPLETE' : 'STANDBY'}</span>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="final-boss panel" aria-label="Final boss project">
        <div>
          <span className="card-kicker">Final Boss</span>
          <h2>Ship an AI Engineer Project</h2>
          <p>
            Build, evaluate, and deploy an AI-powered application using code,
            data, model APIs, retrieval, evals, and production monitoring.
          </p>
        </div>

        <div className="final-requirements">
          {campaigns.map((campaign) => {
            const isComplete = getCampaignReadiness(campaign) === 100

            return (
              <span className={isComplete ? 'ready' : ''} key={campaign.id}>
                {campaign.title}
              </span>
            )
          })}
        </div>

        <button type="button" disabled={!finalBossUnlocked}>
          {finalBossUnlocked ? 'Start final boss' : 'Complete every campaign'}
        </button>
      </section>
    </main>
  )
}

export default App
