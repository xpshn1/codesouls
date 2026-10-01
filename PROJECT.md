# codesouls — Project

> Business context, not technical detail. Written for a new teammate, a stakeholder, or an
> agent that needs to know *why* this exists. Technical shape lives in ARCHITECTURE.md.
> Never guess a fact here: ask the user.

## What this is
Code Souls is a game-style app for learning programming on the way to becoming an AI engineer.
You face a hard "boss" problem first, fail, get told exactly which small skill you are missing,
practise that skill in short drills, and return to beat the boss. Skills you beat come back on a
fixed review schedule so they stick.

## Who it is for
Version 1 is for one learner: Kalyan, a beginner programmer who wants to become an AI engineer.
Today's problem: tutorials teach topics in order, but you rarely know *why* you need a topic or
which gap is stopping you, and what you learned fades quickly.

## Why now / what success looks like
Success for version 1: **the learning sticks.** Kalyan beats the first slice, and the scheduled
reviews a week later still pass without re-learning the material.

## Scope
**In scope:** one complete slice, Python foundations (variables, lists, loops, functions,
edge cases), ending with the Damage Calculator boss; learners write real Python that is
checked by tests; failed boss tests send you to a fixed drill chosen in advance by the author;
a fixed review schedule; progress saved on the learner's own computer; runs locally.
**Explicitly out of scope:** behaviour that adapts or learns from the user (the app is
deterministic: the same input always gives the same result); accounts and servers; an AI
tutor; the later campaigns (math, ML, deep learning, AI tools); public hosting.

## Who works on what
| Person | Role | Owns / ask them about | Contact (email / chat handle) |
| --- | --- | --- | --- |
| Kalyan Molugooru | Owner, learner, builder, approver | Everything: content, design, releases | kalyanmolugooru@gmail.com |

## Stakeholders and decision makers
Kalyan Molugooru decides scope and approves every document and release.

## Repositories in this product
- `xpshn1/codesouls` — the whole app (content, engine, interface). Owner: Kalyan Molugooru.

## Glossary
- **Boss** — a larger problem that combines several skills. Open from the start.
- **Drill** — a short exercise that trains one skill.
- **Skill** — one small, nameable ability (e.g. "start a running total at the right value").
- **Test** — one automatic check of the learner's code: an input and the expected answer.
- **Route** — the author-written rule "if this boss test fails, go to this drill". Fixed in advance.
- **Death** — a failed boss attempt. It is feedback, not punishment.
- **Review** — a skill coming back after a fixed gap (for example 1, 3 and 7 days) to check it was remembered.
- **Slice** — one complete path of drills and bosses, built end to end.
- **Mini-boss** — a smaller boss closing one chunk of a slice; the final boss closes the slice.
- **Challenge** — pressing "Challenge boss": runs all tests, including hidden ones; a fail is a death. "Run" only runs the visible examples and never counts.
- **Souls** — reward from drills, held "unbanked" until that chunk's boss is beaten, then banked. Never lost on death.
- **XP / rank** — experience from beaten bosses and passed reviews; rank follows XP (Hollow, Kindled, Ashen, Unkindled Lord).
- **Bonfire** — the place on the hub where reviews due today wait.
