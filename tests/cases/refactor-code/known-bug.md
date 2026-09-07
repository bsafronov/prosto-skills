---
type: anti-trigger
skill: refactor-code
---

## Given

A reproduced empty input crash is traced to an unconditional first-element access. The expected empty result is agreed.

## When

Repair that mechanism and prove the failing case plus neighboring behavior.

## Then

Select fix-bug only.
