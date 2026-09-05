---
name: review-requirements
description: Review a concrete code change against its originating requirements and report missing, partial, incorrect, or unrequested behavior. Use when checking a PR, branch, commit, or WIP diff with an available request or spec. Do not use for defect-only code review, requirements drafting, or implementation.
license: Apache-2.0
metadata:
  internal: true
---

# Review Requirements

Determine whether a change delivers the agreed outcome and only that outcome.
Keep the review read-only.

1. Pin the change scope. Use the supplied comparison point; otherwise infer the
   current branch's merge base when unambiguous. Confirm the diff is non-empty.
2. Pin the requirements source from the user request, linked issue, PR, or named
   specification. Ask only when no authoritative source can be identified.
3. Extract every explicit behavior, constraint, and non-goal. Do not invent
   requirements from design preference.
4. Trace each requirement through changed code, tests, and affected boundaries.
   Classify it as satisfied, missing, partial, or incorrect. Identify behavior
   added outside the agreed scope.
5. Report actionable gaps first. For each gap, cite the requirement source and
   the smallest relevant changed location, then state expected behavior, actual
   behavior, and impact.
6. If every requirement is satisfied, say so. Report material evidence gaps or
   unverifiable requirements separately.

Use `Missing`, `Partial`, `Incorrect`, and `Scope` as finding labels. Keep
the report limited to requirement-conformance gaps. Leave optional design advice
and unrelated defects to their separate review outcomes.

Stop when every explicit requirement and non-goal maps to implementation
evidence or an actionable finding, with no code changes made.
