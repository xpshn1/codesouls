# Code Souls

Code Souls is a gamified learning app for becoming an AI engineer from a
beginner starting point. Learners face difficult "boss" challenges, retreat into
smaller prerequisite drills when stuck, gain XP, then return with the exact
skills needed to solve the bigger problem.

The end goal is not only learning syntax. The end goal is becoming able to
build, debug, evaluate, and deploy AI-powered software while understanding the
math and computer science ideas underneath it.

## Current Prototype

The first version is a React + TypeScript app that demonstrates the core loop:

- a boss puzzle that requires several prerequisite concepts
- smaller drills for beginner programming foundations
- XP gained by completing drills
- a readiness meter that unlocks the boss puzzle

The current UI still starts with programming basics because AI engineering needs
those fundamentals first.

## How To Run

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Product Direction

The app should be built as an AI engineering campaign with connected paths:

1. **Programming foundations**
   Variables, data structures, functions, debugging, tests, Git, APIs, and
   deployment.

2. **Math for AI**
   Probability, statistics, linear algebra, calculus intuition, optimization,
   and evaluation metrics.

3. **Data and machine learning**
   Data cleaning, feature engineering, model training, validation, overfitting,
   and classical ML algorithms.

4. **Deep learning**
   Neural networks, embeddings, transformers, fine-tuning, inference, and model
   limitations.

5. **AI tools and applications**
   Prompting, agents, retrieval-augmented generation, vector databases, model
   APIs, evaluation, safety checks, and production monitoring.

6. **Boss projects**
   Larger projects that combine several paths, such as building a chatbot with
   retrieval, evaluating model outputs, deploying an AI API, or debugging a
   failed training run.

## Recommended Stack

- **React + TypeScript** for the app interface
- **Vite** for fast local development
- **Monaco Editor** later for in-browser code editing
- **Vitest** later for puzzle test cases
- **Local storage** first for progress
- **Python sandboxing** later for AI and data exercises
- **Supabase or Postgres** later for accounts, saved progress, and analytics
- **Model provider APIs** later for AI-tooling missions

## Learning Goal

The app should eventually teach a learner to:

- write and debug useful programs
- understand probability, statistics, and core ML concepts
- work with data and evaluate model performance
- build simple machine learning and deep learning workflows
- use AI coding tools and model APIs effectively
- design retrieval and agent-style AI applications
- test, monitor, and deploy AI-powered software
