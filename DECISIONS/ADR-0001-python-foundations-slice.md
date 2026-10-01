# ADR-0001 — Python Foundations Slice (outcome of RFC-0001)

**Status:** accepted and built · 2026-10-01 · feature `specs/001-python-foundations-slice/`

**Decision:** rebuild Code Souls from `main` as a deterministic, browser-only Python learning game.
Learners face bosses first; each failed boss test routes to one drill; skills return for review
after 1, 3, 7 and 21 days. Python runs in the browser through bundled Pyodide in a Web Worker.

**Why:** failing first shows the learner exactly which skill is missing; fixed rules keep the app
predictable; Python is the language of AI work; bundling keeps it offline and free.

**Rejected:** building on the JavaScript `playable-v1` branch; adaptive difficulty or routing;
Pyodide from a CDN; locking bosses behind prerequisites.

**Consequences:** about a 10 MB Python runtime and a 10–15 s first start; content must be authored
with one skill per boss test; every challenge is proven solvable by the test suite.
