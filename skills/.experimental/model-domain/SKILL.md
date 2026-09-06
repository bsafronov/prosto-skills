---
name: model-domain
description: Establish or revise domain concepts, their relationships, and shared terminology from product evidence. Use when meanings conflict or a domain model needs defining, including its glossary and consequential decisions. Do not use for merely reading terminology, editorial document changes, or implementation-only architecture decisions.
license: Apache-2.0
metadata:
  internal: true
---

# Model Domain

Resolve domain meaning into a model that distinguishes real product cases and
can be carried into the project's durable language.

1. Locate the relevant glossary, context map, and prior domain decisions. Follow
   existing ownership and document conventions; one word may legitimately mean
   different things in different contexts. Create documents only when there is
   resolved content to record.
2. Separate intended product rules, current implementation, and proposed changes.
   Inspect relevant behavior when it can resolve a claim. Code is evidence of
   what exists, not authority over what the product should mean. When evidence
   cannot settle a material conflict, state the alternatives and ask the smallest
   question that changes the model; keep unresolved meaning explicitly proposed.
3. Test a disputed concept with a concrete distinguishing scenario: identity,
   lifecycle, cardinality, ownership, or an exception. Choose terms that preserve
   meaningful differences; merge synonyms only within a context where they mean
   the same thing. Avoid introducing concepts that the evidence does not need.
4. Record resolved terms and relationships in the existing domain document when
   the task authorizes edits. Preserve unrelated entries and local structure.
   If no convention exists, use short definitions with context and misleading
   aliases where useful. Keep implementation mechanics and task plans outside
   the glossary. For discussion or draft-only requests, return the proposed text.
5. Capture a domain decision in an ADR when a real choice has consequential
   reversal cost and rationale future readers would otherwise miss. Record the
   decision's actual status, alternatives, and consequence using local conventions;
   a proposal is not an accepted decision. Ordinary wording changes need no ADR.

This Skill owns domain meaning and its record. Implementation changes, module
redesign, and independent defect review remain separate outcomes and compose
only when requested. A file named CONTEXT.md or ADR alone does not select it.

Stop when each affected concept has a supported definition or an explicit open
question, a distinguishing scenario checks the disputed boundary, and resolved
changes are recorded or returned at the requested scope. Report remaining
implementation mismatches without silently fixing them.
