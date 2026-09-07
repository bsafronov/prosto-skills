---
type: anti-trigger
skill: refactor-code
---

## Given

Old and new clients share a database during a rolling release; a column rename must preserve both clients and recent writes on rollback.

## When

Implement the compatible transition stage and prove interruption recovery.

## Then

Select migrate-system only.
