# Handover — Code Souls, Python Foundations slice

> Start here when picking this project up in a new session. Last updated 2026-10-01.
> Read next: `PROJECT.md` (why), `ARCHITECTURE.md` (how), `CONSTITUTION.md` (rules),
> `specs/001-python-foundations-slice/` (what was built and how it is checked).

## Where we left off
- The first slice is **built, tested and committed** on branch `redesign-python` (pushed to GitHub).
  `main` still holds the old prototype; `playable-v1` holds an older JavaScript prototype (not reused).
- Process state (groundwork plugin): RFC-0001 approved → spec 001 approved → plan/tasks/evals done →
  15 of 16 tasks done. **Open: task T902**, the owner's hand test (see "Next actions").
- An empty design canvas exists at https://claude.ai/artifact/8YaVy35MwtmTsAHeKWT1NE. It was blocked
  by the process gate and then not needed, because the real screens were built instead. Fill it or delete it.

## How we got here (session of 2026-10-01)
1. Reviewed the old repo: it had a nice look but no actual learning. "Training" was a done-toggle, the bosses did nothing,
   and nothing was saved.
2. A short learning-science discussion with the owner settled the design:
   - **Boss first** (productive failure): failing first shows you exactly what you don't know.
   - **The catch:** a boss far too hard causes helplessness, so a boss must be *startable but not yet finishable*.
   - Difficulty comes from **combining concepts**; tiers are a prediction to check against real attempts.
   - The owner wants the app **deterministic and static**: fixed rules written in advance, nothing adaptive.
     Fixed routes from failed tests to drills and a fixed review schedule are fine.
   - One test can fail for two reasons (e.g. empty list vs. wrong starting total), so **author tests that
     isolate one skill each**. This was left unfinished as a lesson; worth revisiting when writing new bosses.
3. The owner chose: Python, a fresh start from `main`, the Python foundations slice first, local-only, the owner as the only user.

## Architecture and dependencies touched
- `src/content/` — static data: 4 chunks, 16 drills, 4 bosses, tests, routes, hints, rewards.
- `src/engine/` — `harness.py` (runs code + tests in Python), `python.worker.ts` (Pyodide in a Web
  Worker), `runner.ts` (one job at a time, 5 s limit, restarts the worker on timeout).
- `src/game/` — pure rules: `progress.ts` (deaths, souls, XP, beaten bosses), `reviews.ts`
  (1/3/7/21 days), `rank.ts`, `storage.ts` (localStorage + export/import), `dates.ts`.
- `src/ui/` — React screens (hub, boss fight, death, victory, drill, bonfire, loading), CodeMirror
  editor, `tokens.css` (colours/fonts), `motion.css` (animations + reduced motion).
- Key packages: `pyodide` (Python 3.14 in WASM, copied into the build by `vite-plugin-static-copy`),
  `codemirror` + `@codemirror/lang-python`, `@fontsource/*` (fonts bundled, no CDN), Vitest + jsdom.

## State: done / in progress / deliberately deferred
- **Done:** everything in spec 001: content, engine, rules, saving, all screens, animations, 78 tests.
- **In progress:** the owner's hand test (T902).
- **Deferred on purpose:** adaptive behaviour, accounts/servers, AI tutor, later campaigns (math, ML,
  deep learning, AI tools), public hosting, phone layout, sound, sibling review drills.

## Decisions taken and alternatives rejected
- Python via bundled Pyodide, not JavaScript: Python is the language of AI work. Not CDN: works offline.
- Fresh rebuild, not building on `playable-v1`: the owner chose a clean start.
- Bosses never locked; "Run" is free and only "Challenge boss" can cost a death, so experimenting is never punished.
- Each test runs in a fresh Python scope, optionally with `setup` (e.g. `log = []`), so a boss can
  test the same code against many inputs.
- Numbers compare numerically (0 equals 0.0) but booleans don't count as numbers (True is not 1).
- Rewards are set per item by difficulty. Souls are held until the chunk's boss falls and are never lost.
  XP comes only from bosses and reviews. Ranks: Hollow 0, Kindled 100, Ashen 250, Unkindled Lord 450.
- Skill id = drill id; beating a boss also passes its chunk's skills (they enter review).

## Contracts, with example requests and responses
Internal only. Runner call (`src/engine/types.ts`):
```
run("def total_damage(a):\n    return sum(a)\n",
    [{ id: "empty", call: "total_damage([])", expected: "0" }])
→ { stdout: "", error: null, timedOut: false,
    results: [{ id: "empty", status: "pass", expected: "0", actual: "0" }] }
```
On a timeout every result has `status: "timeout"` and `timedOut: true`.

## Known limitations and edge cases
- Python takes about 10–15 s to start (the spec target is 10 s). There is a loading screen.
- Desktop only (min width 1280 px).
- Hidden boss tests that pass stay labelled "Hidden test"; only failed ones are revealed.
- A boss win marks its chunk's skills passed even if their drills were never done (by design).
- The spec is ~1,800 words, over the plugin's 1,200 limit; `groundwork.py check --strict` fails on that warning only.
- The UI tests replace the code editor with a textarea; CodeMirror itself is only checked by hand.

## How to run, test and deploy
```
npm install
npm run dev      # then open the printed address (desktop browser)
npm test         # ~15 s, loads real Python
npm run lint
npm run build    # output in dist/, includes dist/pyodide/
```
Not deployed anywhere. Local use only.

## Ownership and support
**Owner:** Kalyan Molugooru (kalyanmolugooru@gmail.com)
**Requested by:** Kalyan Molugooru, in a Claude Code session on 2026-10-01
**Implemented by:** Kalyan Molugooru, with Claude Code
**Deployed by / how to deploy:** not deployed; runs locally with `npm run dev`
**Support (first contact, escalation, hours):** Kalyan Molugooru; no escalation (solo project)

## Next three recommended actions
1. Do the hand test (spec §8, steps 8–10): export → clear site data → import; turn on the OS "reduce motion"
   setting; move the computer's date ahead one day to see the bonfire reviews. Then mark T902 done.
2. Play the slice yourself as the learner and note which bosses feel too hard or too easy. That is the
   real test of the "startable but not yet finishable" rule.
3. Decide the next feature (e.g. split the long spec, a second slice such as "Math for AI", or faster
   Python start). Start it with the interview step of the groundwork process.
