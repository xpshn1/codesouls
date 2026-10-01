# codesouls — Constitution

> The non-negotiable rules. Every RFC, spec and pull request is checked against this. If a
> change conflicts with it, stop and say so — amend it deliberately instead of working around it.
> Keep it short: a rule that cannot be checked is a wish.

**Version:** 1.0.0 · **Ratified:** 2026-10-01

## Principles
1. **Deterministic.** The same learner input always gives the same result. Routes, hints and the
   review schedule are written in advance; no randomness, no behaviour that adapts to the user.
2. **Real practice only.** Progress is earned only by passing checks on work the learner produced
   (code that passes tests, or an answer that is checked). No "mark as done" buttons.
3. **Bosses are open.** A boss can be attempted from the start. Prerequisites are recommended, never locked.
4. **Every failure points somewhere.** Every boss test has exactly one route to a drill.
5. **Every challenge is proven solvable.** Each drill and boss has a reference solution that passes
   all its tests, and starter code that fails at least one.

## Guardrails (things that must never happen)
- Learner code never runs outside the Python runner worker.
- No server, account, tracking or network call other than loading the app and Pyodide.
- No content hard-coded inside UI components; content lives in `src/content/`.

## Quality gates (what "done" means)
- `npm run lint`, `npm run build` and `npm test` pass.
- The test suite checks every challenge's reference solution, starter code and routes.
- Acceptance criteria in the spec are covered by tests or the spec's manual-test steps.

## Amendments
_None yet._
