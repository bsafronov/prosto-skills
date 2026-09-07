---
type: outcome
skill: design-interface
---

## Given

Two callers duplicate payment coordination across systems with no shared transaction.

## When

Design a caller contract with recovery and dependency proof.

## Then

Return a concrete operation and caller example; preserve requestId across retries, return pending for ambiguous timeouts, recover an already successful charge when receipt persistence fails, and keep notification failure separate from payment state. Explain ownership, a credible trade-off, and real provider verification.
