---
name: write-spec
description: Synthesize or revise a feature specification from agreed discussion, supplied requirements, and relevant repository evidence. Use when the user asks to capture intended behavior and acceptance criteria as a spec. Do not use for brainstorming alone, ticket decomposition, publishing an unchanged document, or reviewing implementation against an existing spec.
license: Apache-2.0
metadata:
  internal: true
---

# Write Spec

Produce a specification another person can implement and assess without
reconstructing the conversation or mistaking proposals for decisions.

1. Identify the requested artifact and inspect the discussion, existing spec,
   domain language, and relevant repository behavior. Separate the user's
   problem, accepted decisions, proposals, and current implementation. Explicit
   revisions supersede earlier choices; recency alone does not settle a genuine
   contradiction. Preserve unaffected requirements when revising an existing spec.
2. Synthesize the available agreement without restarting discovery. Keep missing
   or conflicting decisions visible, with the behavior or acceptance criterion
   they block. For a draft, record them as open questions instead of inventing an
   answer. If the user needs a resolved specification and evidence cannot supply
   a material decision, ask only for that decision. Do not claim implementation
   readiness while a consequential requirement remains unresolved.
3. Follow the project's useful specification conventions. Otherwise capture the
   problem and intended outcome, in-scope behavior, observable acceptance
   criteria, exclusions, and material open decisions. Add actors, error cases,
   constraints, and user stories only where they clarify agreed behavior; an
   exhaustive template must not manufacture scope.
4. Make acceptance criteria distinguish success from failure through an
   observable interface. Reuse agreed test boundaries and repository evidence;
   a spec request does not require a new test architecture, another boundary
   approval, or TDD. Record only supported implementation decisions. Preserve
   exact contracts or a small decision-bearing prototype excerpt when prose
   would lose meaning, identifying its status without treating it as implemented.
5. Check that every agreed in-scope behavior has a checkable acceptance criterion,
   exclusions remain excluded, and assumptions or proposals are not presented
   as facts. Current code is evidence of what exists, not authority to overwrite
   the agreed target. Surface relevant implementation gaps without fixing them.

Return the spec or update the requested local artifact. This Skill owns the
specification; decomposition, implementation, tracker creation, labels, and
publication are separate actions. Complete the reviewable draft before any
needed publication approval. Existing explicit authorization for a destination
remains sufficient; never require tracker setup merely to write a local spec.

Stop when the requested artifact captures the agreement, acceptance criteria
cover its behavior, and remaining blockers are explicit. A spec is not evidence
that its behavior has been implemented or verified.
