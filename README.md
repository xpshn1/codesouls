# Code Souls

Code Souls is a gamified programming tutor for beginners. Learners face hard
"boss" programming puzzles, retreat into smaller practice drills when stuck,
gain XP from the missing concepts, then return to solve the larger problem.

## Current Prototype

The first version is a React + TypeScript app that demonstrates the core loop:

- a boss puzzle that requires several concepts
- smaller drills for variables, loops, and functions
- XP gained by completing drills
- a readiness meter that unlocks the boss puzzle

## How To Run

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Product Direction

The app should be built in stages:

1. **Learning map**
   Show concepts as connected areas. A harder puzzle should list the simpler
   skills that prepare the learner for it.

2. **Puzzle engine**
   Start with guided prompts and multiple-choice checks. Later, add a real code
   editor and automated tests.

3. **XP and mastery**
   XP should reward practice, but mastery should come from proving the learner
   can solve the concept without hints.

4. **Boss encounters**
   Boss puzzles should combine multiple skills, such as variables, loops,
   functions, debugging, and deployment.

5. **Project campaigns**
   End-game paths should guide the learner through building, debugging, testing,
   and deploying complete apps.

## Recommended Stack

- **React + TypeScript** for the app interface
- **Vite** for fast local development
- **Monaco Editor** later for in-browser code editing
- **Vitest** later for puzzle test cases
- **Local storage** first for progress
- **Supabase or Postgres** later for accounts, saved progress, and analytics

## Learning Goal

The app should eventually teach a learner to:

- read unfamiliar code
- break problems into smaller functions
- debug errors calmly
- use Git and GitHub
- test code
- deploy a working project
