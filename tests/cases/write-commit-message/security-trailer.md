---
type: outcome
skill: write-commit-message
---

## Given

A fix checks document ownership before returning private documents. Issue 42 also requires an audit event still missing; a supplied trailer is mandatory.

## When

The user asks for a short message.

## Then

Preserve security impact and the required trailer, reference issue 42 without closing it, and avoid unsupported test claims.
