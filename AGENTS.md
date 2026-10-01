# AGENTS.md — codesouls

Instructions for coding agents. Humans: read PROJECT.md first.

## Read before you write anything
1. `PROJECT.md` — what we build and why, and who to ask.
2. `ARCHITECTURE.md` — the boxes and their names.
3. `CONSTITUTION.md` — non-negotiable rules.
4. `DECISIONS/` — RFCs (proposals, approved or not) and the ADRs they left behind.
5. `specs/` — approved feature specs.

## Commands (Node.js 22, npm)
- Set up: `npm install`
- Run: `npm run dev`
- Lint: `npm run lint`
- Build (also type-checks): `npm run build`
- Test: `npm test` (Vitest; content and Python engine tests load real Pyodide in Node, ~15 s)
- The UI tests mock the code editor; check CodeMirror by hand (spec §8).

## Conventions
- Use the glossary words from PROJECT.md (boss, drill, skill, test, route, death, review, slice).
- Content is data in `src/content/`; UI components never hard-code lessons.
- Learner code runs only through the Python runner (Pyodide in a Web Worker).
- Nothing random and nothing adaptive (see CONSTITUTION.md, principle 1).
- Work on a branch; the redesign lives on `redesign-python`. Do not push without the owner's say-so.
- The old prototype is on `main`; a JavaScript prototype is on `playable-v1`. Ideas may be reused, code is rebuilt.

## Tooling defaults
- Python tooling (if any is added outside the browser) uses `uv`, never `pip`.

## Process (enforced by the groundwork plugin)
Interview → RFC → human approval → spec → plan → tasks → evals → implement → handover.
You cannot approve documents; only the user can, with `/groundwork-specflow:approve`.

## Repositories
- codesouls — `C:\Users\lenovo\Projects\codesouls` — the whole app.
