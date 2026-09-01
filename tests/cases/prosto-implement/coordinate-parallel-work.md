---
type: outcome
skill: prosto-implement
---

# Coordinate Parallel Work

## Given

An approved contract yields two independent implementation tasks and one integration task depending on both.

## When

The harness supports isolated workers and the repository is clean.

## Then

The agent dispatches the independent tasks with disjoint ownership, keeps one integration owner, integrates their evidence in dependency order, then runs the integration task.
