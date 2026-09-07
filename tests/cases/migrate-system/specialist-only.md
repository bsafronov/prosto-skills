---
type: anti-trigger
skill: migrate-system
---

## Given

Only TypeScript test fixtures need conversion from as assertions to @total-typescript/shoehorn; runtime and persisted state are untouched.

## When

Convert those test files using the library-specific guidance.

## Then

Select migrate-to-shoehorn only; a migration keyword does not establish staged transition work.
