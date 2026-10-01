---
id: 001-python-foundations-slice
spec: spec.md
spec_version: b13ce2e09b548dd046dea231eb138c9c588905a893944385ad0843c0a39645cc
created: 2026-10-01
---

# Evaluations: Python Foundations Slice

| ID | Scenario | Input | Expected | Covers | How checked |
| --- | --- | --- | --- | --- | --- |
| E1 | Every challenge is solvable and fails at the start | All 16 drills, 4 bosses | Solutions pass all tests; starters fail ≥ 1 | AC-1 | content suite |
| E2 | Every boss test has a real route | All boss tests | Each maps to one existing drill | AC-1, FR-2 | content suite |
| E3 | Endless loop | `while True: pass` | "took too long" by ~5 s; next run works | AC-2, FR-4 | runner test + manual |
| E4 | Syntax error | `def f(:` | Plain message, line 1, raw error | AC-3, FR-5 | harness test |
| E5 | Wrong function name | defines `total` not `total_damage` | Each test: "`total_damage` is not defined" | FR-5 | harness test |
| E6 | Final boss from a fresh start | new progress | Boss opens and runs | AC-4, FR-6 | UI test |
| E7 | Run never kills | failing code, Run | Only examples run; deaths 0 | AC-5, FR-7 | game + UI test |
| E8 | Partial challenge | passes 4 of 5 | Health 20%; deaths +1; death screen lists the empty-list test + its drill; souls same | AC-6, FR-8, FR-10 | game + UI test |
| E9 | Hint unlocks | deaths 1, then 3 | Hint 1, then hint 2 visible | AC-7, FR-11 | game test |
| E10 | Victory | correct code | Beaten; XP +boss XP; unbanked → banked; reviews due tomorrow | AC-8, FR-9 | game test |
| E11 | Farming a drill | pass same drill twice | Souls unchanged second time | AC-9, FR-12 | game test |
| E12 | Rank up | XP 95 → 105 | Hollow → Kindled | AC-10, FR-13 | game test |
| E13 | Review schedule | pass day 0, pass every review | Due days 1, 4, 11, 32; then retired | AC-11, FR-14 | game test |
| E14 | Failed review | fail on day 4 | Due again day 5 | AC-11, FR-14 | game test |
| E15 | Reload and backup | reload; export → clear → import | Identical progress | AC-12, FR-16, FR-17 | storage test + manual |
| E16 | Bad backup file | random JSON; version 2 | Refused with a message; progress unchanged | AC-12, FR-17 | storage test |
| E17 | Hub stats | mid-slice progress | Map, rank, XP bar, souls both kinds, deaths, skills, reviews kept shown | AC-13, FR-18 | UI test |
| E18 | Look | open each screen | Token colours and the three fonts; all named screens exist | AC-14, FR-19, FR-20 | manual |
| E19 | Motion and reduced motion | normal; then OS reduce motion | Animations within limits; then instant | AC-15, FR-21, FR-22 | UI test + manual |
| E20 | Offline | disconnect network, reload a built app | Loads and runs Python | NFR-2 | manual |

## Scenario catalogue (things real users will do that nobody wrote down)
- Pastes a huge program or prints in a loop 100,000 times: output is cut to a readable length, no freeze.
- Uses `input()`: told plainly that input isn't available in challenges.
- Leaves a review undone for a week: it stays due; nothing breaks.
- Clicks Challenge repeatedly while tests are resolving: the second click is ignored until the first ends.
- Edits code, then leaves the page: the draft is still there on return.
- Opens the app in two tabs: the last save wins; no crash.
- Beats a boss again later: no extra XP, victory still shows.
