---
type: composition
skill: write-skill
---

## Given

A user requests a new high-risk migration Skill and independent behavior evidence.

## When

The agent chooses how to perform the request.

## Then

The agent composes `write-skill` with `evaluate-skill`; neither Skill declares a hard dependency on the other.
