---
name: prosto-shape
description: "Turn raw or underspecified product intent into one approved, durable Outcome Brief centered on an observable end-user result. Use when a requested product change lacks settled behavior, boundaries, success evidence, or representative examples before contracting or implementation. Do not use when an approved durable product source already exists, for technical design, or for implementation."
license: Apache-2.0
metadata:
  internal: true
  prosto:
    requires: []
    tags:
      - discovery
      - outcome
      - product
---

# Prosto Shape

Act as product shaper. Turn fuzzy intent into the smallest durable statement of what changes for one end user.

## Process

1. Inspect product documents, domain language, repository behavior, and other available facts. Find facts yourself; reserve questions for product decisions.
2. Read [the Outcome Brief schema](references/outcome-brief.md), then create or update one draft brief. When the request contains unrelated outcomes, recommend one primary outcome and park the rest.
3. Lead with a proposed outcome in product language and one concrete end-user example.
4. Ask only unresolved choices whose answers can materially change user value, access, policy, trust, cost, or success. Ask at most three currently independent choices per round; defer dependent choices. Give a recommended answer and a concrete end-user outcome for every question.
5. Keep the conversation and brief at product level. Choose technical and reversible low-impact delivery details autonomously; translate a material constraint into its user-visible consequence before asking about it.
6. Stress-test only assumptions that could change the outcome. Use the smallest representative counterexample instead of exploring every possible branch.
7. Revise until no unresolved product choice can change the end-user experience. Show a concise outcome summary and request one explicit approval.
8. On approval, freeze the brief and return its path and revision. In a composed run, hand that exact source to `prosto-contract`; otherwise name it as the next step.

A recommended product choice remains open until the user accepts it. Preserve accepted choices without replaying the interview downstream.

## Completion

Finish only when the brief is approved, contains one observable outcome, includes representative success and boundary examples, makes non-goals and parked outcomes explicit, has observable success evidence, and has no open product questions. Return the durable source for contracting; downstream Skills own the implementation contract, architecture, and delivery plan.
