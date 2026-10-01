---
id: 001-python-foundations-slice
spec: spec.md
spec_version: b13ce2e09b548dd046dea231eb138c9c588905a893944385ad0843c0a39645cc
created: 2026-10-01
---

# Plan: Python Foundations Slice

## 1. Approach
Replace the prototype UI on `main` with four layers, each testable on its own:
1. **Content** — plain TypeScript data: skills, drills, bosses, tests, routes, hints, rewards (FR-1, FR-2, FR-3). No UI code.
2. **Python engine** — Pyodide, bundled from the `pyodide` npm package and served from the app's own files (NFR-2), running in a Web Worker (FR-4). A small Python harness runs learner code and tests and returns one result per test (FR-5).
3. **Game logic** — pure functions over a progress object: challenge results, deaths, hints, souls, XP, rank, reviews (FR-6–FR-15, NFR-1). The current date is passed in, never read inside, so tests are deterministic.
4. **Screens** — React components for hub, boss fight, drill, death, victory, bonfire and loading (FR-18, FR-20), styled with CSS tokens (FR-19) and CSS animations (FR-21, FR-22).

No new framework, router or state library: React state + a reducer, screen chosen by app state. Deliberate departures from `main`: the old fonts and the CDN font import are removed (they break NFR-2 and FR-19).

## 2. Affected modules and files
- **Removed:** old `src/App.tsx` content and `src/App.css`, `src/assets/*`, `@fontsource/geist-sans`, `typeface-hk-grotesk`, the OffBit CDN import in `src/index.css`.
- **Added dependencies:** `pyodide`; `codemirror` + `@codemirror/lang-python` (editor); `@fontsource/cormorant-garamond`, `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono` (FR-19); dev: `vitest`, `jsdom`, `@testing-library/react`, `vite-plugin-static-copy` (copies Pyodide files into the build, NFR-2).
- `src/content/` — `types.ts` (shapes), `skills.ts`, `chunk1-values.ts`, `chunk2-loops.ts`, `chunk3-functions.ts`, `final-damage-calculator.ts`, `index.ts` (FR-1–FR-3). Outline: chunk 1 — variables, arithmetic, strings and f-strings, printing (4 drills, mini-boss "The Hollow Variable"); chunk 2 — lists, indexing, for loops, running totals from 0, empty lists (5 drills, mini-boss "Warden of Loops"); chunk 3 — defining functions, parameters, return vs print, calling (4 drills, mini-boss "The Function Knight"); final — edge cases, negative numbers, combining it all (3 drills, boss "Damage Calculator"). 16 drills; types mixed so all four appear in every chunk where sensible.
- `src/engine/harness.py` — runs code, tests, captures stdout, maps errors to line numbers (FR-5).
- `src/engine/python.worker.ts` — loads Pyodide, runs the harness (FR-4).
- `src/engine/runner.ts` — starts the worker, sends jobs, enforces the 5 s limit by ending and restarting the worker (FR-4, §5).
- `src/engine/plainErrors.ts` — Python error type → plain English (FR-5).
- `src/game/progress.ts` — progress shape and reducer (FR-9–FR-12, FR-16).
- `src/game/reviews.ts` — schedule 1/3/7/21 days (FR-14, FR-15). `src/game/rank.ts` (FR-13).
- `src/game/storage.ts` — save/load localStorage, export/import with version check (FR-16, FR-17).
- `src/ui/` — `App.tsx`, screens (`Hub`, `BossFight`, `Drill`, `DeathScreen`, `Victory`, `Bonfire`, `Loading`), parts (`CodeEditor`, `HealthBar`, `TestList`, `SoulsCounter`, `XpBar`, `SliceMap`, `ReorderLines`), `tokens.css`, `motion.css` (FR-18–FR-22).
- `tests/` — Vitest suites (§6). `package.json` gains `"test": "vitest run"`.

## 3. Data model and migrations
- **Content (static):** Skill `{id, name}`. Drill `{id, skillId, chunk, type: write|predict|fix|reorder, prompt, starter | lines+fixedOrder, tests[], solution, souls}`. Boss `{id, chunk, name, prompt, starter, tests[], examples: testId[], routes: {testId → drillId}, hints: [h1, h2], xp, skills: skillId[]}`. Test `{id, call, expected}` as Python expressions; predict drills compare printed output instead.
- **Progress (saved):** `{version: 1, passedSkills: {skillId → {passedOn, nextReview, step}}, drillsPassed: drillId[], bosses: {bossId → {deaths, beaten}}, souls: {banked, unbanked: {chunk → n}}, xp, reviews: {taken, kept}, drafts: {challengeId → code}}`. Dates are local calendar days (`YYYY-MM-DD`).
- **Migrations:** none (first version). Import refuses a missing or higher `version` (FR-17).

## 4. Interfaces and contracts
Internal only; no CONTRACTS/.
- `runChallenge(code, tests, mode: "run"|"challenge"|"predict") → Promise<{results: TestResult[], stdout, error?}>`, `TestResult = {id, status: pass|fail|error|timeout, expected?, actual?, message?, line?, raw?}` (FR-4, FR-5, FR-7, FR-8).
- Reducer actions: `challengeResolved(bossId, results)`, `drillPassed(drillId)`, `reviewResolved(skillId, passed, today)`, `importProgress(json)` (FR-9–FR-17).
- `dueReviews(progress, today) → skillId[]` (FR-15); `rankFor(xp)` (FR-13).

## 5. Failure modes and edge cases
- Endless loop → runner ends the worker at 5 s, reports `timeout`, starts a fresh worker for the next job (FR-4, AC-2).
- Pyodide fails to load → Loading screen shows a message and "Try again" (spec §7).
- Unreadable saved data → start fresh but keep the raw string under a backup key until the learner imports or resets (spec §7).
- Learner code defines no function / wrong name → each test reports a plain error ("`total_damage` is not defined") (FR-5).
- Learner `print`s inside a function in a test → stdout captured, not shown as a result.
- Re-passing a drill → no extra souls (FR-12). Beating an already-beaten boss → no extra XP.
- Reviews skipped for days → stay due until done; schedule continues from the day actually passed (FR-14).
- Clock moved backwards → nothing becomes un-passed; reviews just aren't due yet.

## 6. Test strategy
- **Content suite (Node + real Pyodide):** every solution passes, every starter fails, routes point to existing drills, counts and XP total ≥ 450, examples are 1–2 per boss → AC-1, AC-10 (total).
- **Harness suite (Node + Pyodide):** error message + line, wrong function name, stdout capture → AC-3.
- **Runner unit test (fake worker):** timeout ends and restarts the worker → AC-2; real timing checked by manual test.
- **Game logic unit tests:** Run vs. Challenge, 4/5 → health 20% and death, hints at deaths 1 and 3, victory banking, souls not re-awarded, rank thresholds, review dates 1/4/11/32 and reset, save/load/export/import/refusal → AC-4–AC-12.
- **Screen tests (jsdom + Testing Library):** hub shows all stats; final boss reachable from a fresh start; death screen lists failed test + drill link; reduced motion adds the instant-change class → AC-4, AC-6, AC-13, AC-14, AC-15 (partial).
- **Manual (spec §8):** animations' look and timing, fonts and colours, real 5 s timeout, offline load → AC-14, AC-15.

## 7. Rollout and rollback
Built on branch `redesign-python`; runs locally with `npm run dev`. Nothing is pushed until the owner says so. Rollback: check out `main` or an earlier commit. Saved progress is local and versioned.

## 8. Constitution check
- Deterministic: no randomness anywhere; fixed shuffle orders in content; date passed in (NFR-1).
- Real practice only: progress only through reducer actions fired by passed results (FR-9, FR-12, FR-13).
- Bosses open: no lock checks in the UI (FR-6). One route per boss test: enforced by the content suite (AC-1).
- Proven solvable: content suite (AC-1).
- Learner code only in the worker: the only path to Pyodide is `runner.ts` (FR-4).
- No network: Pyodide and fonts bundled; CDN import removed (NFR-2).
- Content separate from screens: `src/content/` only.
