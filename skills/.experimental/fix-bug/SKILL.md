---
name: fix-bug
description: Repair an established bug mechanism and prove the failing behavior is corrected without breaking affected behavior. Use when the cause and expected behavior are known. Do not use for diagnosis alone, new feature behavior, structural refactoring, or staged compatibility migration.
license: Apache-2.0
metadata:
  internal: true
---

# Fix Bug

Correct the established mechanism at the boundary that owns the behavior, with
credible regression evidence.

- Check that the supplied cause explains the failing path and that the expected
  result has an independent basis. Reuse credible diagnostic evidence; reopen
  only the uncertainty that would change the repair. If the mechanism remains
  unknown, resolving it is a separate outcome.
- Repair the owning behavior rather than masking its symptom in a caller. The
  responsible change may span files or layers; the fewest changed lines is not
  the goal. Account for callers that share the mechanism and preserve their
  valid behavior, including consequential boundaries and failure paths.
- Choose regression proof that distinguishes the defect from the correction.
  Reuse an existing check when it already detects the defect. Add a focused test
  when recurrence risk warrants it; otherwise preserve a concrete reproduction,
  before/after observation, or equivalent evidence. Derive the expected result
  from the contract, not from the changed algorithm. A check that passes on the
  faulty version cannot alone prove this repair.
- Verify the correction and affected behavior through the relevant boundary.
  Distinguish an unavailable check, an unrelated baseline failure, and a failure
  caused by the change. A mock or unit result does not establish an external
  integration guarantee. Report the remaining limit instead of weakening the
  expected behavior to make a check pass.

Complete when the established failure is corrected and the available regression
and affected-behavior evidence supports that claim; state any material unverified
part precisely. This Skill does not prescribe test-before-code ordering. Compose
requested test-first work when that sequence matters; independent interface
choices, new features, structural refactoring, and compatibility transitions keep
their own outcomes.
