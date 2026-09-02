---
type: trigger
skill: prosto-implement
---

# Deliver a Large Repository Change

## Given

A user explicitly invokes `prosto-implement` for an approved change spanning several dependent repository areas.

## When

The agent begins delivery.

## Then

The agent validates the contract through the required `prosto-contract` Peer, maps every acceptance ID to coherent tasks, preserves the existing outcome approval, and continues autonomously through proof without requesting another approval.
