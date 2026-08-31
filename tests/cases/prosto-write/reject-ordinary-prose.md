---
type: anti-trigger
skill: prosto-write
---

# Reject Ordinary Prose

## Given

A user asks to rewrite a product README, feature specification, ticket, and code comment for human clarity. None directly controls agent behavior.

## When

The agent selects an appropriate capability.

## Then

The agent does not activate `prosto-write` and does not reinterpret the documents as Steering Files or Agent References.
