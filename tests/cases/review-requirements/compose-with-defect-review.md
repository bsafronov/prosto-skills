---
type: composition
skill: review-requirements
---

## Given

A user requests a full review of a pull request with an originating
specification.

## When

The agent chooses the smallest sufficient Skill composition.

## Then

The agent composes `review-requirements` with the host's independent
defect-review capability; neither review depends on or duplicates the other.
