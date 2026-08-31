---
type: trigger
skill: prosto-write
---

# Compose an Orchestrator with Peers

## Given

A user asks for an agent Skill that explicitly coordinates two existing model-invoked Skills. The new Skill must be user-invoked and must not duplicate either Peer process.

## When

The agent writes the new Skill and its supported harness metadata.

## Then

The agent activates `prosto-write`, reads the Skill branch, creates a thin Orchestrator, declares both names in `metadata.prosto.requires`, aligns invocation controls across harnesses, and leaves Peer behavior in the Peer Skills.
