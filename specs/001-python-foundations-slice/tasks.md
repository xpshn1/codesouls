---
id: 001-python-foundations-slice
spec: spec.md
spec_version: b13ce2e09b548dd046dea231eb138c9c588905a893944385ad0843c0a39645cc
plan: plan.md
created: 2026-10-01
---

# Tasks: Python Foundations Slice

> One task = one reviewable change, ordered so the suite stays green after each.
> `[P]` marks tasks on disjoint files. Legend: `[ ]` not started · `[~]` in progress · `[x]` done.
> Mark a task `[x]` only after its "done when" is verified.

- [x] **T001** — Clean base: remove prototype UI, old fonts and CDN import; add dependencies, Vitest and the `test` script; empty app shell with tokens.
  - **Files:** `package.json`, `src/main.tsx`, `src/index.css`, `src/App.tsx`, `src/App.css`, `src/assets/*`, `src/ui/App.tsx`, `src/ui/tokens.css`, `vite.config.ts`
  - **Done when:** `npm run build`, `npm run lint` and `npm test` pass; no network URL remains in `src/`.
  - **Covers:** FR-19, NFR-2
- [x] **T002** — Python engine: harness, worker, runner with 5 s limit and restart, plain error messages; Pyodide copied into the build.
  - **Files:** `src/engine/harness.py`, `src/engine/python.worker.ts`, `src/engine/runner.ts`, `src/engine/plainErrors.ts`, `vite.config.ts`, `tests/harness.test.ts`, `tests/runner.test.ts`
  - **Done when:** harness tests (pass/fail/error+line/wrong name/stdout) and runner timeout test pass.
  - **Covers:** FR-4, FR-5, NFR-2, NFR-3
- [x] **T003** — Content types and the content suite (solutions pass, starters fail, routes valid, counts, XP ≥ 450, 1–2 examples per boss).
  - **Files:** `src/content/types.ts`, `src/content/index.ts`, `tests/content.test.ts`
  - **Done when:** suite runs against an empty-but-valid content set.
  - **Covers:** FR-1, FR-2, FR-3
- [x] **T004** — Content: skills, chunk 1 and chunk 2 (9 drills, 2 mini-bosses).
  - **Files:** `src/content/skills.ts`, `src/content/chunk1-values.ts`, `src/content/chunk2-loops.ts`
  - **Done when:** content suite passes for these.
  - **Covers:** FR-1, FR-2, FR-3
- [x] **T005** — Content: chunk 3 and the Damage Calculator (7 drills, mini-boss + final boss).
  - **Files:** `src/content/chunk3-functions.ts`, `src/content/final-damage-calculator.ts`
  - **Done when:** content suite passes for all 16 drills and 4 bosses, XP total ≥ 450.
  - **Covers:** FR-1, FR-2, FR-3, FR-13
- [x] **T006** [P] — Game logic: progress reducer (challenge, deaths, hints, souls, XP), rank, reviews, with tests first.
  - **Files:** `src/game/progress.ts`, `src/game/rank.ts`, `src/game/reviews.ts`, `tests/game.test.ts`
  - **Done when:** tests for AC-4–AC-11 pass.
  - **Covers:** FR-6, FR-7, FR-8, FR-9, FR-10, FR-11, FR-12, FR-13, FR-14, FR-15, NFR-1
- [x] **T007** [P] — Storage: save/load, export/import with version check, unreadable-data backup.
  - **Files:** `src/game/storage.ts`, `tests/storage.test.ts`
  - **Done when:** tests for AC-12 pass.
  - **Covers:** FR-16, FR-17
- [x] **T008** — Screens part 1: loading, hub (slice map, stats, bonfire entry), editor component.
  - **Files:** `src/ui/screens/Loading.tsx`, `src/ui/screens/Hub.tsx`, `src/ui/parts/SliceMap.tsx`, `src/ui/parts/XpBar.tsx`, `src/ui/parts/SoulsCounter.tsx`, `src/ui/parts/CodeEditor.tsx`, `src/ui/App.tsx`, `tests/ui.test.tsx`
  - **Done when:** hub test shows every stat (AC-13); app starts and shows the loading state then the hub.
  - **Covers:** FR-18, FR-20, FR-21
- [x] **T009** — Screens part 2: boss fight (Run / Challenge, test list resolving, health bar), death screen with routes and hints, victory.
  - **Files:** `src/ui/screens/BossFight.tsx`, `src/ui/screens/DeathScreen.tsx`, `src/ui/screens/Victory.tsx`, `src/ui/parts/HealthBar.tsx`, `src/ui/parts/TestList.tsx`, `tests/ui.test.tsx`
  - **Done when:** UI tests for AC-4 and AC-6 pass.
  - **Covers:** FR-6, FR-7, FR-8, FR-9, FR-10, FR-11, FR-20, FR-21
- [x] **T010** — Screens part 3: drill screen for all four types (incl. reorder lines), bonfire review.
  - **Files:** `src/ui/screens/Drill.tsx`, `src/ui/screens/Bonfire.tsx`, `src/ui/parts/ReorderLines.tsx`, `tests/ui.test.tsx`
  - **Done when:** each drill type can be passed in a UI test; bonfire empty state shows.
  - **Covers:** FR-3, FR-12, FR-15, FR-20
- [x] **T011** — Motion: animations and reduced-motion handling; export/import buttons on the hub.
  - **Files:** `src/ui/motion.css`, `src/ui/screens/Hub.tsx`, `tests/ui.test.tsx`
  - **Done when:** reduced-motion test passes; animations stay within the spec's time limits.
  - **Covers:** FR-17, FR-21, FR-22, NFR-4
- [x] **T012** — README rewrite for the new app (run, test, how content is written).
  - **Files:** `README.md`, `docs/build-plan.md`
  - **Done when:** README commands work as written.
  - **Covers:** FR-1

## Verification
- [x] **T900** — full check/test command passes
- [x] **T901** — every FR in the spec maps to at least one completed task
- [ ] **T902** — the spec's manual-test section was run by hand and matches
- [x] **T903** — foundation docs (ARCHITECTURE/AGENTS/CONTRACTS/PROJECT) updated or explicitly unchanged; `groundwork.py fresh` is clean
