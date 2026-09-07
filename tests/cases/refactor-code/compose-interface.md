---
type: composition
skill: refactor-code
---

## Given

The user wants repeated scheduling coordination moved behind a module, but caller cancellation and lifetime ownership are unsettled.

## When

Choose the contract, then implement the structural move while preserving current externally observable scheduling behavior.

## Then

Select design-interface for the unresolved contract and refactor-code for the separately requested structural implementation.
