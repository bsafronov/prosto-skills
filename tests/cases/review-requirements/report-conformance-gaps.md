---
type: outcome
skill: review-requirements
---

## Given

A specification requires an audit event after password reset, but the change
implements the reset without emitting that event and adds an unrelated profile
field.

## When

The agent reviews requirement conformance.

## Then

The report contains an evidence-backed `Missing` finding for the audit event and
a `Scope` finding for the unrelated field, excludes generic design advice, and
uses valid source paths and one-based lines. It makes no code changes.
