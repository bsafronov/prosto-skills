---
type: outcome
skill: prosto-contract
---

# Freeze an Implementation Contract

## Given

A draft contract cites its source documents but still contains one product question and one unaccepted agent recommendation.

## When

The user resolves the question and approves the outcome.

## Then

The agent records only the confirmed choice, removes the resolved question, verifies every acceptance condition is observable, sets the contract to approved, and returns its path and revision without creating technical tasks.
