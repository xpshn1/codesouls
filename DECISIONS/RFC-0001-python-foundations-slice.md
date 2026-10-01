---
id: RFC-0001
title: Python Foundations Slice
status: approved
classification: internal
signoffs_required: 1
requested_by: Kalyan Molugooru
request_source: Claude Code chat session, 2026-10-01
owner: kalyanmolugooru@gmail.com
supersedes: []
related_rfcs: []
author: kalyanmolugooru@gmail.com
created: 2026-10-01
approved_by: [kalyanmolugooru@gmail.com]
---

# RFC-0001 — Python Foundations Slice

<!-- An RFC records a decision. Classification: `internal` (one repo) or `api` (crosses a repo
boundary — set signoffs_required to the number of leads it touches). Every section is
filled from the interview with the user; anything not yet answered is an unresolved marker. -->

## 1. Summary
Rebuild Code Souls from `main` as a Python learning game and ship one complete slice: Python
foundations. The learner writes real Python in the browser (Pyodide, bundled). Bosses are open
from the start. A failed boss challenge is a "death": it reveals which hidden tests failed, and
each failed test has a fixed route to the drill that trains the missing skill. Passed skills come
back for review after 1, 3, 7 and 21 days. Everything is deterministic: the same input always gives
the same result. Progress is saved in the browser with export/import. The interface is a calm,
dark, souls-like design with animations as you work through problems and as stats change.

## 2. The need
**User scenario:** Kalyan, a beginner on the way to AI engineering, opens the app, attempts a
boss before feeling ready, dies, is told exactly which skill failed, trains it in short drills,
returns and wins. Days later the bonfire calls skills back for review so they are not forgotten.
**Done means:** Kalyan can play the whole slice (3 mini-bosses + the Damage Calculator boss) using
only the app, and scheduled reviews a week later still pass without re-learning.

## 3. Interview record
<!-- Every question asked and the user's answer, verbatim in substance. This is the evidence
that the picture is clear. Group by theme. Effect is one of: Confirmed, Tension, Open decision,
Doc update, Out of scope. -->
| # | Question | Answer | Effect |
| --- | --- | --- | --- |
| 1 | Teach first, or boss first? | Boss first: a visible goal gives direction; failing first shows what you don't know | Confirmed |
| 2 | Risk of boss first for beginners? | Helplessness and quitting if the boss is far too hard; a boss must be startable but not yet finishable | Confirmed |
| 3 | Should the app adapt to the user's behaviour? | No. Deterministic and static once built; fixed rules decided in advance are fine | Confirmed |
| 4 | How static? | Fixed path + fixed routes + fixed review schedule | Confirmed |
| 5 | Which slice first? | Python foundations | Confirmed |
| 6 | Which language do learners write? | Python (Pyodide in the browser) | Confirmed |
| 7 | Starting point in the codebase? | Fresh from `main` on a new branch; `playable-v1` (JavaScript) is not reused as code | Confirmed |
| 8 | Review schedule? | 1, 3, 7, 21 days after passing; a failed review restarts at 1 day | Confirmed |
| 9 | Saving? | In the browser, plus export/import of a backup file | Confirmed |
| 10 | How many bosses? | 3 mini-bosses (values; lists + loops; functions) + the Damage Calculator boss | Confirmed |
| 11 | Drill types in v1? | All four: write code checked by tests, predict the output, fix the bug, reorder the lines | Confirmed |
| 12 | What does a review look like? | The same drill comes back with blank/starter code | Confirmed |
| 13 | Help while stuck on a boss? | Hints unlock on deaths: hint 1 after the 1st failed attempt, hint 2 after the 3rd; never the full answer | Confirmed |
| 14 | Look and feel? | Calm dark souls-like: dark, quiet, readable, small game touches without clutter | Confirmed |
| 15 | Which game touches? | All of: YOU DIED screen + death count; boss health bar (drops as boss tests pass); bonfire for reviews due; XP and ranks (only from real passes) | Confirmed |
| 16 | Devices? | Desktop/laptop only | Confirmed |
| 17 | Who requested it, from where? | Kalyan Molugooru, in a Claude Code chat session (2026-10-01) | Confirmed |
| 18 | Souls rule (drill XP held until the chunk's boss is beaten)? | Yes: drill XP shows as unbanked souls and is banked when that boss is beaten | Confirmed |
| 19 | Where is Pyodide loaded from? | Bundled with the app; no outside network call, works offline | Confirmed |
| 20 | Accessibility target? | No specific target; best effort | Confirmed |
| 21 | Relation to existing work? | Supersedes the old prototypes (`main` UI and the `playable-v1` JavaScript branch); no earlier RFC or spec exists | Confirmed |
| 22 | When does a boss attempt count as a death? | Only when pressing "Challenge boss" (runs all tests incl. hidden ones). "Run" is free experimenting and never counts | Confirmed |
| 23 | Can the learner see boss tests before failing? | 1–2 example tests visible; hidden tests are revealed after a death that fails them, with their route | Confirmed |
| 24 | Who writes content? | Claude drafts the drills, bosses, tests, routes and hints; Kalyan play-tests and corrects | Confirmed |
| 25 | How are Python errors shown? | Short plain-English message + line number, with the raw Python error underneath | Confirmed |
| 26 | Pyodide is now bundled, not fetched | ARCHITECTURE.md says "loaded once and cached by the browser"; must say bundled with the app | Doc update (ARCHITECTURE.md) |
| 27 | New words used in this RFC | PROJECT.md glossary needs: mini-boss, challenge, souls, bonfire, XP/rank | Doc update (PROJECT.md) |
| 28 | (via /design) How should the UI feel while working through problems and stats? | Stylistic, with animations as you work through problems and when stats change (boss HP draining, tests resolving one by one, souls gained, death screen, bonfire) | Confirmed |
| 29 | Design mockups requested before approval, but the process gate blocks writes until a spec is approved. Bypass or finish the proposal first? | Finish the proposal first; mockups come after approval | Confirmed |

### Read-back
<!-- Written at the end of the interview and confirmed by the user. -->
- **Confirmed:** Python slice (3 mini-bosses + Damage Calculator), boss-first and never locked;
  deaths only on "Challenge boss"; hidden tests revealed on death with one fixed route each; hints
  unlock on deaths 1 and 3; four drill types; reviews at 1/3/7/21 days by redoing the same drill;
  souls held until the chunk's boss falls; XP and ranks only from real passes; Pyodide bundled;
  browser saving + export/import; desktop only; calm dark souls-like look with animations;
  Claude drafts content, Kalyan play-tests.
- **Tensions:** None.
- **Open decisions:** None.
- **Docs to update after approval:** ARCHITECTURE.md (Pyodide bundled, not fetched); PROJECT.md
  glossary (mini-boss, challenge, souls, bonfire, XP/rank).

## 4. Proposal
**Content (static data).** About 16 drills and 4 bosses for: values and variables; lists and
loops; functions and return values; edge cases. Each challenge has starter code, tests (an input
and an expected result), a reference solution, and, for bosses, which tests are visible examples,
a route per test to one drill, and two hints.

**Drill types.** Write code (checked by tests); predict the output (the typed answer must match
what the code prints, ignoring surrounding spaces); fix the bug (tests); reorder the lines (the
assembled code is run against tests).

**Boss loop.** Bosses are open from the start. "Run" executes the visible example tests and never
counts. "Challenge boss" runs all tests: each test resolves one by one with an animation and the
boss health bar drops for each pass. All pass → victory: the chunk's unbanked souls are banked,
XP is added, the boss's skills are marked passed. Any fail → death: the death count goes up, a
YOU DIED screen shows each failed test (now revealed) with its route to a drill, and hints unlock
after the 1st and 3rd death.

**Reviews.** When a skill is passed, its first review is due 1 day later, then 3, 7 and 21 days.
Passing a review moves to the next gap; failing restarts at 1 day. Due reviews appear at the
bonfire on the hub. A review is the same drill with its starter code.

**Progress and stats.** Saved in the browser after every change; export to and import from a
JSON backup file with a version number. The hub shows rank, XP, banked and unbanked souls,
deaths, skills passed and reviews kept, with animated changes.

**Look.** Calm, dark, souls-like; readable code and text; motion used for feedback (tests
resolving, HP draining, souls gained, death and victory screens, bonfire flicker), and turned
down when the system asks for reduced motion.

## 5. Alternatives considered
- **Build on `playable-v1` (JavaScript).** Fastest, but JavaScript is less useful for later AI
  and math work. Rejected by the owner in favour of a fresh Python start.
- **Adaptive difficulty and routing.** Could tailor help, but the owner wants deterministic,
  static behaviour. Rejected.
- **Pyodide from a public CDN.** Smaller repo, but needs the internet. Rejected: bundled.
- **Prerequisite gates on bosses.** Rejected: boss first is the core idea.

## 6. Risks and objections
- **Helplessness:** a boss far too hard makes a beginner quit. Mitigation: mini-bosses are small,
  1–2 example tests are visible, hints unlock on deaths.
- **One test, two causes:** a failed test may come from different misunderstandings, but each
  test routes to one drill. Mitigation: author tests that isolate one skill each.
- **Bundle size:** Pyodide is about 10 MB. Mitigation: a loading state; loaded once per session.
- **Content cost:** ~20 challenges with tests and solutions. Mitigation: automated tests prove
  each is solvable and each route points to a real drill.
- **Animation overload:** motion could distract. Mitigation: motion only for feedback, short,
  and reduced-motion respected.

## 7. Impact
**Repos touched:** `xpshn1/codesouls` only (branch `redesign-python`).
**Relations:** Independent first feature; replaces the old prototype UI on `main` and the
JavaScript `playable-v1` branch (prototypes, no specs).
**Constitution check:** Deterministic (fixed routes, fixed schedule, no randomness) ✔; real
practice only (progress only from passed checks) ✔; bosses open ✔; every boss test has one route ✔;
every challenge proven solvable by tests ✔; learner code only in the worker ✔; no network beyond
loading the app (Pyodide bundled) ✔; content in `src/content/` ✔.
**Cost / performance / security notes:** No cost. ~10 MB bundled Python runtime. Learner code runs
in a worker with a time limit; a runaway program ends the worker, not the page.

## 8. Cross-repo contract (only if classification is `api`)
N/A, internal.

## 9. Out of scope
Adaptive behaviour; accounts and servers; an AI tutor; later campaigns (math, ML, deep learning,
AI tools); public hosting; phone layout; a formal accessibility target; sibling review drills.

## 10. Open questions
_None. (List any as unresolved markers; approval is blocked while any remain.)_
