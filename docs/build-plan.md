# Build Plan

## Core Idea

Code Souls should teach programming through a loop that feels like a challenging
game:

1. The learner attempts a boss puzzle.
2. The app detects or asks what part is hard.
3. The learner trains on smaller related concepts.
4. XP and mastery increase.
5. The learner returns to the boss puzzle with better preparation.

## MVP

The first useful version should not try to execute arbitrary user code yet.
That is a harder security and infrastructure problem. The MVP should prove the
learning design first.

The MVP should include:

- a concept map
- beginner concept lessons
- small drills
- boss puzzles that combine concepts
- XP and mastery tracking
- hints that point to prerequisite drills

## Later Technical Milestones

### Code Editor

Add Monaco Editor when learners need to type real code in the browser.

### Test Runner

Use Vitest-style puzzle tests so each challenge can define expected behavior.

### Safe Execution

Running user code safely should be handled in a sandboxed environment, not
directly in the browser or server process.

### Accounts

Use a database only after the local prototype proves the loop is fun and clear.
Local storage is enough for the first version.

## Concept Progression

Suggested early path:

1. Values and variables
2. Strings and numbers
3. Conditionals
4. Arrays
5. Loops
6. Functions
7. Objects
8. Debugging
9. API requests
10. Tests
11. Git and GitHub
12. Deployment

## Design Principle

Difficulty should come from combining concepts, not from confusing wording.
When a learner is stuck, the app should show the exact prerequisite skill that
will help.
