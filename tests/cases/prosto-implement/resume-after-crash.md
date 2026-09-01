---
type: outcome
skill: prosto-implement
---

# Resume After Context Loss

## Given

A run has completed tasks, one active process, one claimed agent task, and then loses its conversation or controller process.

## When

A new agent resumes the run.

## Then

The agent reconstructs state from the approved contract, work state, task commits, process handles, logs, and evidence; it reconciles uncertain claims before dispatching new work and does not require the old chat.
