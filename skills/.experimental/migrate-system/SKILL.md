---
name: migrate-system
description: Implement and prove a requested stage of a compatibility or persisted-data transition with a viable recovery path. Use when old and new readers, writers, data forms, or deployments must coexist or recover from partial migration. Do not use for an in-place refactor, an ordinary feature or dependency update without a transition window, or ticket decomposition alone.
license: Apache-2.0
metadata:
  internal: true
---

# Migrate System

Reach the requested transition stage while preserving the guarantees needed by
remaining consumers and recoverable data.

- Identify which readers and writers can exist at each relevant stage, which
  representation is authoritative, and what a rollback would actually restore.
  Include writes made after migration begins: reverting code or restoring an old
  backup alone may lose those writes or leave them unreadable.
- Choose the smallest viable transition from the actual rollout constraints.
  An additive form, backfill, consumer switch, and removal are useful only where
  coexistence requires them. A coordinated offline conversion can instead use a
  verified maintenance window. Keep transitional code temporary and give its
  removal a concrete compatibility condition.
- Make partial progress safe to resume. Define checkpoints, retry identity, and
  handling of concurrent writes or failed batches from the storage guarantees;
  do not infer atomicity from a successful happy path. Preserve source data until
  recovery no longer depends on it. Make incomplete, rejected, and conflicting
  records observable instead of silently skipping them as complete.
- Prove old and new paths at the stages the task reaches, using representative
  data and failure points. Exercise interruption and retry, overlapping writers
  where allowed, and rollback after new writes. Check the resulting data and
  consumer behavior, not just that the migration command exited successfully.
  Distinguish local simulation from storage, deployment, or production proof.
- Perform only the requested stage. Preparation and reversible implementation
  use the user's existing authorization. Execute destructive contraction only
  when it is in that authorization and its compatibility and recovery conditions
  hold; a plan may describe it without executing it. Carry forward an explicit
  authorized destructive phase rather than asking for the same approval again.

Stop when that stage's compatibility, data preservation, and recovery claims have
supporting evidence, or name the specific claim still unproved. Interface choice,
work decomposition, specialized library conversion, and requested test-first
sequencing can contribute independent outcomes; none is a prerequisite. Keep
ordinary structure-preserving edits outside this transition lifecycle.
