---
id: 001-python-foundations-slice
rfc: RFC-0001
title: Python Foundations Slice
status: approved
created: 2026-10-01
author: kalyanmolugooru@gmail.com
requested_by: Kalyan Molugooru
owner: kalyanmolugooru@gmail.com
implemented_by: [kalyanmolugooru@gmail.com]
support: []
extends: []
depends_on: []
builds_against: []
amends: []
approved_by: [kalyanmolugooru@gmail.com]
---

# Spec: Python Foundations Slice

## 1. Problem
A beginner learning toward AI engineering rarely knows which small gap stops them from solving a
real problem, and forgets what they learned. Code Souls fixes this with a boss-first loop: try the
hard problem, fail, get pointed at the exact skill, train it, return and win; then review it on a
fixed schedule. Decided in RFC-0001.

## 2. Users and context
One learner (Kalyan), a beginner, on a desktop or laptop browser, offline-capable. The slice covers
Python foundations: values and variables; lists and loops; functions and return values; edge cases.

## 3. User stories
- **US-1**: As a learner, I want to attempt a boss before I feel ready so that my failure shows me what I don't know.
- **US-2**: As a learner, I want each failed boss test to send me to one drill so that I train exactly the missing skill.
- **US-3**: As a learner, I want skills I passed to come back on a fixed schedule so that they stick.
- **US-4**: As a learner, I want progress, souls, XP and rank to show and animate as I work so that the work feels rewarding.

## 4. Functional requirements
**Content**
- **FR-1**: The slice MUST contain 4 bosses — mini-boss 1 (values and variables), mini-boss 2 (lists and loops), mini-boss 3 (functions and return values) and the final boss, the Damage Calculator — and about 16 drills spread over those chunks, each drill training one named skill.
- **FR-2**: Every drill and boss MUST have starter code (or a question), tests, a reference solution and an author-set reward (souls for drills, XP for bosses and reviews). Every boss MUST mark 1–2 tests as visible examples, give every test exactly one route to a drill, and have two hints.
- **FR-3**: Drills MUST come in four types: write code (checked by tests); predict the output (the typed answer must equal what the code prints, ignoring leading/trailing spaces and line breaks); fix the bug (tests); reorder the lines (the learner orders shuffled lines, the result is run against tests). Shuffled order is fixed by the author, not random.
**Running code**
- **FR-4**: Learner code MUST run as real Python in the browser, with no network, and MUST stop after 5 seconds with a "took too long" result.
- **FR-5**: Results MUST be reported per test: passed; failed with expected vs. actual; or error, shown as a short plain-English message with the line number and the raw Python error underneath.
**Boss loop**
- **FR-6**: Every boss MUST be open from the start; drills are suggested, never required.
- **FR-7**: "Run" MUST run only the visible example tests and MUST NOT count as a death or change progress.
- **FR-8**: "Challenge boss" MUST run all tests, resolve them one at a time on screen, and lower the boss health bar for each passed test (health = share of tests still failing).
- **FR-9**: If every test passes, the boss MUST be marked beaten, its XP added, the chunk's unbanked souls banked, and its skills marked passed (starting their reviews).
- **FR-10**: If any test fails, the app MUST count a death, show a death screen listing each failed test (now revealed: input, expected, actual) with its route to a drill, and keep unbanked souls (they are never lost).
- **FR-11**: Hint 1 MUST unlock after the 1st death on that boss and hint 2 after the 3rd; hints never contain the full solution.
**Drills, souls and rank**
- **FR-12**: Passing a drill MUST mark its skill passed (starting its reviews) and add its souls to the chunk's unbanked souls; re-passing an already-passed drill gives no further souls.
- **FR-13**: XP MUST come only from beaten bosses and passed reviews. Rank MUST follow XP: Hollow (0), Kindled (100), Ashen (250), Unkindled Lord (450). The slice MUST offer enough XP to reach Unkindled Lord.
**Reviews**
- **FR-14**: A passed skill's review MUST fall due 1 day after passing, then 3, 7 and 21 days after each passed review; a failed review MUST reset it to 1 day. After the 21-day review passes, the skill is retired from reviews.
- **FR-15**: The hub MUST show a bonfire listing reviews due today; a review is the skill's drill with its starter code; passing gives its XP.
**Saving and stats**
- **FR-16**: Progress (passed skills, review dates, deaths, beaten bosses, souls, XP, code drafts) MUST be saved in the browser after every change and survive a reload.
- **FR-17**: The learner MUST be able to export progress to a backup file and import it again; the file carries a version number; an invalid file is refused without changing progress.
- **FR-18**: The hub MUST show the slice map (chunks, drills, bosses with status: untouched, deaths so far, beaten), rank, XP toward next rank, banked and unbanked souls, total deaths, skills passed of total, and reviews kept of reviews taken.
**Look and motion**
- **FR-19**: The look MUST be calm, dark and souls-like using these tokens: ground `#0D0C0B`; panel `#16130F`; raised `#1E1A15`; line `#2E2923`; text `#ECE5D8`; muted text `#A89F90`; ember/souls accent `#E3A53B`; death red `#C23B2E`; pass `#8FB573`; fail `#E0705C`. Type: a serif display face for titles and boss names (Cormorant Garamond), a sans for body (IBM Plex Sans), a mono for code (IBM Plex Mono); body 16 px, code 15 px; fonts bundled.
- **FR-20**: Screens MUST be: hub, boss fight, drill, death screen, victory screen, bonfire review, and a loading state while Python starts. Each also has an empty state where relevant (no reviews due: "The bonfire is quiet today").
- **FR-21**: Motion MUST give feedback: tests resolving one by one; health bar draining; souls counter counting up with a brief glow when souls are gained; XP bar filling and a rank-up moment; the death screen fading in ("YOU DIED"); the victory screen; a gentle bonfire flicker. Each animation lasts at most 1.2 s (the death and victory screens at most 2.5 s) and never blocks input afterwards.
- **FR-22**: When the system asks for reduced motion, animations MUST be replaced by instant changes.

## 5. Non-functional requirements
- **NFR-1**: Deterministic: the same progress and the same code always give the same results, routes, hints and review dates (only the current date varies).
- **NFR-2**: Works fully offline after first install; no network requests other than the app's own files.
- **NFR-3**: Python ready within 10 s on a typical laptop on first load; the page stays responsive meanwhile.
- **NFR-4**: Desktop and laptop widths from 1280 px; best-effort accessibility (no formal target), but body text uses the text/muted tokens on dark grounds and every action is a real button reachable by keyboard.

## 6. Acceptance criteria
- **AC-1**: Given the content, when the test suite runs, then there are 4 bosses and 14–18 drills, every reference solution passes all its tests, every starter fails at least one, and every boss test routes to an existing drill. (covers FR-1, FR-2, FR-3)
- **AC-2**: Given code with an endless loop, when it runs, then it stops within about 5 s with "took too long" and the page keeps working. (covers FR-4)
- **AC-3**: Given code that raises an error, when it runs, then the plain message, line number and raw error are shown. (covers FR-5)
- **AC-4**: Given a fresh start, when the learner opens the final boss, then it is playable. (covers FR-6)
- **AC-5**: Given failing code, when the learner presses Run, then only example tests run and the death count is unchanged. (covers FR-7)
- **AC-6**: Given code that passes 4 of 5 tests, when the learner challenges the boss, then tests resolve one by one, health ends at 20%, deaths +1, the death screen lists the failed test with its drill, and unbanked souls are unchanged. (covers FR-8, FR-10)
- **AC-7**: Given 1 and then 3 deaths on a boss, then hint 1 and then hint 2 become visible. (covers FR-11)
- **AC-8**: Given correct code, when challenged, then the boss is beaten, XP rises by its value, unbanked souls move to banked, and its skills get reviews due tomorrow. (covers FR-9)
- **AC-9**: Given a passed drill, when passed again, then souls do not change. (covers FR-12)
- **AC-10**: Given XP crosses 100, then rank changes from Hollow to Kindled; the slice's total XP is at least 450. (covers FR-13)
- **AC-11**: Given a skill passed on day 0, then reviews fall due on days 1, 4, 11 and 32 if each passes; a failed review is due again the next day. (covers FR-14, FR-15)
- **AC-12**: Given progress, when the page reloads, then everything is as before; when exported and imported into a fresh browser, it matches; a broken file is refused with a message. (covers FR-16, FR-17)
- **AC-13**: Given the hub, then map, rank, XP bar, souls (banked/unbanked), deaths, skills passed and reviews kept are shown. (covers FR-18)
- **AC-14**: Given the screens, then they use the listed colour and font tokens; the death screen, victory screen, bonfire and loading state exist. (covers FR-19, FR-20)
- **AC-15**: Given normal motion settings, then the listed animations play within their time limits; given reduced motion, then changes are instant. (covers FR-21, FR-22)

## 7. Failure behaviour
- Python fails to start: the loading state turns into a plain message with a "Try again" button; nothing else is lost.
- Endless loop: "took too long (over 5 s)"; the runner restarts for the next run.
- Saved progress unreadable: the app starts fresh and offers to import a backup; the unreadable data is not overwritten until the learner chooses.
- Import of a wrong or newer-version file: refused with a message; progress unchanged.

## 8. Manual test
1. `npm install`, then `npm run dev`; open the printed address in a desktop browser.
2. See the loading state, then the hub: slice map, rank Hollow, XP 0, souls 0/0, deaths 0, bonfire quiet.
3. Open the Damage Calculator directly (no drills). Write a `total_damage` that starts the total at the first item. Press Run: example tests only, deaths stay 0.
4. Press Challenge boss: tests resolve one by one, health drains, then YOU DIED shows the failed empty-list test and a link to its drill. Deaths = 1; hint 1 now visible.
5. Follow the link, pass the drill: souls counter counts up (unbanked).
6. Fix the code, challenge again: victory screen, XP rises, souls bank.
7. Type `while True: pass`, Run: "took too long" in about 5 s.
8. Reload: everything is kept. Export, clear site data, import: progress returns.
9. Turn on the OS "reduce motion" setting and reload: changes are instant.
10. To test reviews, set the computer's date a day ahead and reload: the bonfire lists the passed skills.

## 9. Out of scope
Adaptive behaviour; accounts and servers; AI tutor; later campaigns; public hosting; phone layout;
formal accessibility target; sibling review drills; sound.

## 10. Constitution check
- Deterministic → NFR-1, fixed routes (FR-2), fixed shuffles (FR-3), fixed schedule (FR-14).
- Real practice only → progress only from passed tests/answers (FR-9, FR-12, FR-13, FR-15).
- Bosses open → FR-6. One route per boss test → FR-2, AC-1. Proven solvable → AC-1.
- Learner code only in the isolated runner → FR-4. No network → NFR-2, fonts and Python bundled (FR-19).
- Content kept as data, separate from screens → required of the plan.
