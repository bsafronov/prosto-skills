---
name: refactor-code
description: Implement an agreed structural code change while preserving observable behavior. Use when extraction, consolidation, or responsibility moves must keep existing behavior equivalent. Do not use for an unresolved interface decision alone, bug correction, new feature behavior, or a staged compatibility transition.
license: Apache-2.0
metadata:
  internal: true
---

# Refactor Code

Change the requested structure with evidence that its callers still observe the
same behavior.

- Define equivalence at the affected boundary: results and identity, side effects,
  ordering, errors, resource lifetime, and compatibility where the change touches
  them. Existing quirks remain behavior unless their correction is also in scope;
  an apparently cleaner result can still be a regression.
- Establish that boundary's behavior before changing its implementation. Reuse
  meaningful coverage; add characterization only where an exposed risk lacks
  proof. A pre-existing failure or unavailable check limits the baseline: record
  it, preserve the evidence, and use an independent observation where possible.
  A green run only after editing cannot establish before/after equivalence.
- Move the chosen responsibility while keeping callers' obligations intact.
  Preserve ordering and failure paths through extractions, including work that
  must not occur after failure. Keep useful behavior tests tied to the public
  boundary; replace an implementation-coupled assertion only with evidence that
  its behavior remains covered. Split genuinely independent moves when each can
  be verified; keep a coupled edit together when intermediate states cannot work.
- Repeat the same behavioral observations after the move, and verify the chosen
  structural boundary is now real rather than an unused wrapper. Treat a changed
  observation as a discrepancy to explain, not a reason to update expectations.
  Report the affected guarantees and any equivalence that remains unproved.

Stop when the requested structure exists and the relevant before/after behavior
agrees. An unresolved contract choice can compose with interface design; an
independently requested correction or feature remains a separate behavior change.
Small cleanup inside an already green test-first slice does not require another
Skill. This Skill owns preservation across structural change, not test-first
sequencing, diagnosis, or mixed-version rollout.
