# Build Plan

## Core Idea

Code Souls should teach the path from beginner programmer to AI engineer through
a loop that feels like a challenging game:

1. The learner attempts a boss challenge.
2. The app detects or asks what part is hard.
3. The learner trains on smaller related concepts.
4. XP and mastery increase.
5. The learner returns to the boss challenge with better preparation.

The campaign should make hard AI work feel navigable by showing the prerequisite
chain behind each challenge.

## Target Learner

The learner may start with little programming experience, but the long-term goal
is practical AI engineering. That means the app should teach coding, math, data,
machine learning, deep learning, AI tools, evaluation, and deployment as one
connected skill tree.

## MVP

The first useful version should not try to execute arbitrary user code yet.
That is a harder security and infrastructure problem. The MVP should prove the
learning design first.

The MVP should include:

- a concept map
- beginner programming concept lessons
- small drills
- boss challenges that combine concepts
- XP and mastery tracking
- hints that point to prerequisite drills
- a visible long-term AI engineering path

## Learning Campaigns

### Campaign 1: Programming Foundations

Goal: become comfortable reading, writing, and debugging small programs.

Topics:

- values and variables
- strings and numbers
- conditionals
- arrays and objects
- loops
- functions
- debugging
- tests
- Git and GitHub
- APIs
- deployment basics

Boss examples:

- build a damage calculator
- debug a broken function
- call an API and display the result
- deploy a small app

### Campaign 2: Math for AI

Goal: understand the math ideas needed to reason about models.

Topics:

- probability
- distributions
- descriptive statistics
- correlation and causation
- vectors and matrices
- gradients and optimization intuition
- loss functions
- evaluation metrics

Boss examples:

- explain why a model is inaccurate
- calculate precision and recall
- compare two model outputs with metrics
- tune a simple optimization loop

### Campaign 3: Data and Machine Learning

Goal: train and evaluate basic ML models responsibly.

Topics:

- datasets
- data cleaning
- train/test splits
- feature engineering
- regression
- classification
- overfitting
- validation
- model evaluation

Boss examples:

- clean a messy dataset
- train a simple classifier
- diagnose overfitting
- choose the right metric for a problem

### Campaign 4: Deep Learning

Goal: understand modern neural-network workflows well enough to use them
carefully.

Topics:

- tensors
- neural networks
- activation functions
- embeddings
- attention
- transformers
- fine-tuning
- inference
- model limitations

Boss examples:

- explain an embedding search result
- debug a model input shape error
- compare fine-tuning and prompting
- optimize an inference workflow

### Campaign 5: AI Tools and Production AI

Goal: build useful AI-powered software with real tools.

Topics:

- prompt design
- model APIs
- structured outputs
- retrieval-augmented generation
- vector databases
- agents and tools
- evals
- safety checks
- monitoring
- cost and latency

Boss examples:

- build a retrieval chatbot
- evaluate hallucination risk
- design an agent tool workflow
- deploy an AI API with monitoring

## Later Technical Milestones

### Code Editor

Add Monaco Editor when learners need to type real code in the browser.

### Test Runner

Use Vitest-style puzzle tests so each challenge can define expected behavior.

### Python Exercises

Add Python-based exercises for data, statistics, machine learning, and deep
learning concepts.

### Safe Execution

Running user code safely should be handled in a sandboxed environment, not
directly in the browser or server process.

### AI API Missions

Add missions that teach learners how to call model APIs, validate outputs, use
structured responses, and evaluate results.

### Accounts

Use a database only after the local prototype proves the loop is fun and clear.
Local storage is enough for the first version.

## Design Principle

Difficulty should come from combining concepts, not from confusing wording.
When a learner is stuck, the app should show the exact prerequisite skill that
will help.

The app should teach AI engineering as a ladder. A learner should always be able
to see why a smaller topic matters for a larger AI project.
