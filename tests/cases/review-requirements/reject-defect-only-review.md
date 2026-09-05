---
type: anti-trigger
skill: review-requirements
---

## Given

A pull request has no originating requirements and the user asks only for bugs,
security issues, and regressions.

## When

The agent chooses how to review the change.

## Then

The agent does not select `review-requirements`; it uses the host's defect-review
capability because requirement conformance is not requested or evidenced.
