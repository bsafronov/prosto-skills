---
type: outcome
skill: design-interface
---

## Given

A pure formatter already owns all common behavior; a facade adds unrelated state and prerequisites.

## When

Choose the appropriate boundary without manufacturing a redesign.

## Then

Keep formatPrice and its caller-independent contract; explain why database initialization and unrelated loading belong elsewhere, preserve existing tests, and return a concrete usage and verification example.
