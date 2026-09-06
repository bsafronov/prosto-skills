---
name: split-work
description: Decompose agreed scope into bounded, verifiable work items or ticket drafts with genuine prerequisites. Use when the user asks to break a plan, spec, or discussion into implementable tasks. Do not use for specification writing alone, implementation, or status and publication operations on an unchanged breakdown.
license: Apache-2.0
metadata:
  internal: true
---

# Split Work

Produce the smallest useful breakdown that preserves the agreed outcome and
makes each unit's scope, proof, and prerequisites clear.

1. Inspect the source agreement, relevant updates, existing work, and repository
   constraints. Preserve requirement identifiers and domain language. Separate
   settled scope from unresolved decisions; decomposition must not silently
   invent a missing requirement or expand an accepted specification.
2. Size units around observable outcomes that can be implemented and verified
   on top of their prerequisites. Prefer a narrow complete path through the
   necessary layers over separate schema, API, UI, and test tickets. Include
   only layers the behavior needs. Keep already bounded work as one unit, and
   respect the user's useful granularity constraints.
3. Give each unit a concise title, delivered outcome, source requirement or
   rationale, checkable acceptance criteria, and blockers. Include enough context
   for an implementer to work without reconstructing the whole discussion.
   Preserve precise contracts where needed; avoid repeating the entire spec or
   inventing estimates, assignees, architecture, or readiness labels.
4. Add a blocking edge only when another unit supplies a condition genuinely
   required to start or verify this one. Shared files, preferred order, or a
   numbered list alone are not dependencies. Check for cycles, missing blockers,
   and unresolved external prerequisites. Keep independent work independent;
   mark affected work blocked when a material decision remains open.
5. Introduce preparation or refactoring only when evidence makes it necessary
   for the requested change. For a broad compatibility transition, consider an
   additive form, bounded consumer migrations, then removal after proving the
   old form unused. If pieces cannot land safely on their own, keep the coupled
   change together or state its shared integration boundary and final proof;
   never promise independent green states the sequence cannot deliver.
6. Check coverage against the source: every agreed requirement is assigned,
   acceptance criteria prove the delivered behavior, and no task adds unrelated
   scope. Merge redundant units and split units with several independent outcomes
   when doing so improves execution. Report remaining decisions and genuine
   prerequisites instead of labeling every draft ready by construction.

Return the requested breakdown or write the requested local artifacts using
existing project conventions. Use local IDs for draft links; tracker IDs must
come from actual tracker evidence. Drafting requires no tracker setup, blanket
approval round, or fixed one-file-per-ticket layout. Publication, labels, parent
issue changes, and execution are separate actions. Complete the reviewable
breakdown before any needed publication approval; reuse existing explicit
publication authorization and preserve blocker links using returned real IDs.

Stop when the work covers the agreed scope, each unit has observable completion,
blockers are justified and acyclic, and unresolved prerequisites are visible.
Specification synthesis can compose when it is also requested; it is not a
prerequisite for splitting an already agreed scope.
