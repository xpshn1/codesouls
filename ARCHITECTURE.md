# codesouls — Architecture

> High-level technical truth. Names used here are the names used everywhere else — do not
> invent parallel vocabulary. Update in the same change as the thing it describes.

## Overview
Code Souls is a single-page web app that runs entirely in the learner's browser. There is no
server. Learning content (skills, drills, bosses, tests, routes) is static data shipped with the
app. Learner code is real Python, run by Pyodide (Python compiled to WebAssembly) inside a Web
Worker so a slow or endless program cannot freeze the page. Progress is saved in the browser and
can be exported to a file.

```
 ┌──────────────── Browser ────────────────────────────────────────┐
 │                                                                 │
 │  Content (static data) ──▶ App UI (React) ◀──▶ Progress store  │
 │   skills, drills, bosses,      │   ▲            (localStorage,  │
 │   tests, routes, hints         │   │             export/import) │
 │                                ▼   │                            │
 │                       Python runner (Web Worker + Pyodide)      │
 │                       runs code + tests, 5 s time limit         │
 └─────────────────────────────────────────────────────────────────┘
```

## Components and repositories
| Component | Responsibility | Tech | Owner |
| --- | --- | --- | --- |
| Content | Skills, drills, bosses, their tests, the route from each boss test to a drill, hints | TypeScript data files under `src/content/` | Kalyan Molugooru |
| Python runner | Run learner code against a challenge's tests in isolation, with a time limit, and report pass/fail per test | Pyodide in a Web Worker (`src/engine/`) | Kalyan Molugooru |
| Progress store | Remember attempts, passed skills, deaths, code drafts and review due dates; export/import a backup file | localStorage + JSON file (`src/game/storage.ts`) | Kalyan Molugooru |
| Game rules + review scheduler | Deaths, souls, XP, rank, and which skills are due on the fixed 1, 3, 7, 21-day schedule | Pure TypeScript functions (`src/game/`) | Kalyan Molugooru |
| App UI | Hub, boss, drill, death, victory, bonfire and loading screens; code editor; motion | React + TypeScript + CodeMirror 6 (`src/ui/`) | Kalyan Molugooru |

## Data flow
1. The learner opens a boss or drill. The UI loads its starter code (or a saved draft).
2. The learner presses Run. The UI sends the code and the challenge's tests to the Python runner.
3. The runner executes them in Pyodide and returns a result per test (passed, failed with
   expected vs. actual, or error/timeout).
4. On a failed boss attempt, the UI looks up the fixed route of each failed test and shows the
   drills to train. The attempt is recorded as a death in the Progress store.
5. On a pass, the Progress store marks the skill(s) passed and the Review scheduler sets the next
   review date. The same inputs always produce the same result: nothing adapts.

## Tech stack and tools
- TypeScript, React 19, Vite (existing base, kept).
- Pyodide for in-browser Python, bundled with the app (no CDN; works offline). Fonts bundled too (RFC-0001).
- CodeMirror 6 for the code editor (Python mode).
- Vitest for tests. No backend, no database, no third-party services.

## Deployment and environments
One environment: the learner's own computer, started with `npm run dev`. No hosting, no
pipeline. Rolling back means checking out an earlier git commit. A production build
(`npm run build`) is possible but not published.

## Boundaries and contracts
- Content ↔ runner: a challenge's tests are defined in the content data; the runner returns one
  result per test id. The shape is the TypeScript types in `src/content/types.ts`.
- Progress store: the saved/exported JSON carries a version number so older files can be read.

## Cross-cutting concerns
- **Determinism:** no randomness, no adaptive behaviour; routes and the review schedule are fixed in advance.
- **Safety:** learner code runs only in the worker; a time limit kills runaway code by ending the worker.
- **Performance:** the bundled Pyodide is about 10 MB; the app shows a loading state while it starts.
- No auth, no secrets, no cost.

## Local development
Requires Node.js 22 and npm.
```
npm install
npm run dev      # start the app locally
npm test         # content, engine, game rules, saving, screens (Vitest)
npm run lint
npm run build
```
