---
type: trigger
skill: refactor-code
---

## Given

The parser API and ownership destination are approved. Callers depend on parsing results, error types, and the original input remaining unchanged.

## When

Move the parser implementation into the chosen module and keep its callers working.

## Then

Select refactor-code for equivalence across a settled structural move.
