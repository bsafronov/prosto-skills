---
type: outcome
skill: migrate-system
---

## Given

Legacy and new wallet clients coexist; old writers update only balanceCents. Interrupted backfill must preserve later writes and allow rollback.

## When

Implement the requested additive transition as an executable in-memory artifact.

## Then

New reads stay correct through legacy writes, new writes preserve old readers, retries preserve records, and rollback retains the latest balances.
