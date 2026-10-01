# Code Souls

A game-style app for learning Python on the way to AI engineering. You face a boss before you
feel ready, fail, are shown exactly which skill you were missing, train it in a short drill, and
return to win. Skills you pass come back for review at the bonfire after 1, 3, 7 and 21 days.

Everything runs in your browser: your code is real Python (Pyodide), and nothing is sent anywhere.

## The first slice: Python Foundations

| Chunk | Drills | Boss |
| --- | --- | --- |
| Values and Variables | 4 | The Hollow Variable |
| Lists and Loops | 5 | Warden of Loops |
| Functions and Return Values | 4 | The Function Knight |
| Edge Cases | 3 | Damage Calculator (final) |

- **Run examples** is free. **Challenge boss** runs every test, including hidden ones; a failure is a death.
- Each failed boss test points to one drill. Hints unlock after your 1st and 3rd death.
- Drills give **souls**, held unbanked until that chunk's boss falls. Bosses and reviews give **XP**, which sets your rank:
  Hollow → Kindled (100) → Ashen (250) → Unkindled Lord (450).
- Progress saves in the browser. Use Export / Import on the hub for a backup file.

## Run it

Needs Node.js 22.

```bash
npm install
npm run dev
```

Open the address it prints in a desktop browser. The first load starts Python, which takes a few seconds.

## Check it

```bash
npm test       # content, Python engine, game rules, saving, screens
npm run lint
npm run build
```

`npm test` runs every drill and boss with real Python: each model answer must pass, each starting
point must fail, and every boss test must point to a real drill.

## Writing content

Content is plain data in `src/content/` (one file per chunk); the shapes are in `src/content/types.ts`.
A test is `{ id, call, expected, setup? }`: `call` and `expected` are Python expressions, and the
optional `setup` runs before the learner's code (for example `log = []`). After changing content,
run `npm test`.

## Project documents

`PROJECT.md` (why and for whom), `ARCHITECTURE.md` (how it fits together), `CONSTITUTION.md` (rules),
`DECISIONS/` (approved proposals) and `specs/` (feature specs, plans, tasks and test checks).
