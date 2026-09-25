# Code Souls

Code Souls is a gamified learning app for becoming an AI engineer from a
beginner starting point. Learners face difficult "boss" challenges, retreat into
smaller prerequisite drills when stuck, gain XP, then return with the exact
skills needed to solve the bigger problem.

The end goal is not only learning syntax. The end goal is becoming able to
build, debug, evaluate, and deploy AI-powered software while understanding the
math and computer science ideas underneath it.

## What Works Now (v1)

The core loop is playable end to end:

- **21 real coding challenges** across 5 campaigns: 15 drills, 5 campaign
  bosses, and a final boss. Each one is a JavaScript exercise with an
  in-browser editor (CodeMirror) and automated tests.
- **Bosses are open from the start.** When you lose, each failed boss test
  links to the drill that trains that skill ("Retreat to Bugfire Watch").
  Drills the boss beat you on are highlighted on the command deck.
- **Souls mechanics**: boss HP (share of tests still failing), a death counter,
  a "YOU DIED" screen, and boss hints that unlock one per death.
- **XP and ranks** are earned the first time you clear a challenge. The final
  boss unlocks once all five campaign bosses are defeated.
- **Progress saves** in the browser: cleared nodes, deaths, and your code drafts.
- **Safe runner**: code runs in a Web Worker and is stopped after 3 seconds, so
  an infinite loop cannot freeze the page. `console.log` output is shown.

The curriculum goes from functions and loops to probability, cosine
similarity, gradient descent written from scratch, neurons, softmax and
attention, parsing model JSON, retrieval (RAG), grounding checks, and evals.
The final boss is a small production assistant with a cache, a relevance
threshold, and monitoring counters.

## How To Run

```bash
npm install
npm run dev     # play locally
npm test        # prove every challenge is solvable
npm run build
```

Keyboard: `Ctrl+Enter` (`Cmd+Enter` on Mac) runs your code.

## Project Layout

```
src/content/        challenge definitions, one file per campaign
src/engine/         test runner (expect helpers) and the Web Worker wrapper
src/components/     Deck (map view), Arena (editor + results), Brief renderer
src/state/          progress persistence (localStorage)
tests/              runner tests and challenge solvability tests
```

## Adding a Challenge

1. Add a drill or boss object to the campaign file in `src/content/`.
2. Write tests as JavaScript strings using `expect(...)`, with `toBe`,
   `toEqual`, `toBeCloseTo`, `toContain`, `toThrow`, or `toBeTruthy`.
3. On boss tests, set `trains` to the drill id that teaches that skill.
4. Add a reference solution in `tests/referenceSolutions.ts`. `npm test`
   fails unless the reference solution passes every test and the starter
   code fails at least one.

## Product Direction

The app should be built as an AI engineering campaign with connected paths:

1. **Programming foundations**
   Variables, data structures, functions, debugging, tests, Git, APIs, and
   deployment.

2. **Math for AI**
   Probability, statistics, linear algebra, calculus intuition, optimization,
   and evaluation metrics.

3. **Data and machine learning**
   Data cleaning, feature engineering, model training, validation, overfitting,
   and classical ML algorithms.

4. **Deep learning**
   Neural networks, embeddings, transformers, fine-tuning, inference, and model
   limitations.

5. **AI tools and applications**
   Prompting, agents, retrieval-augmented generation, vector databases, model
   APIs, evaluation, safety checks, and production monitoring.

6. **Boss projects**
   Larger projects that combine several paths, such as building a chatbot with
   retrieval, evaluating model outputs, deploying an AI API, or debugging a
   failed training run.

## Recommended Stack

- **React + TypeScript** for the app interface
- **Vite** for fast local development
- **CodeMirror 6** for in-browser code editing (done)
- **Vitest** to prove every challenge is solvable (done)
- **Local storage** for progress (done)
- **Python sandboxing** later for AI and data exercises
- **Supabase or Postgres** later for accounts, saved progress, and analytics
- **Model provider APIs** later for AI-tooling missions

## Learning Goal

The app should eventually teach a learner to:

- write and debug useful programs
- understand probability, statistics, and core ML concepts
- work with data and evaluate model performance
- build simple machine learning and deep learning workflows
- use AI coding tools and model APIs effectively
- design retrieval and agent-style AI applications
- test, monitor, and deploy AI-powered software
