---
name: prosto-contract
description: "Turn durable product and design documents into a concise, approved implementation contract. Use when agreed product behavior must be converted into goals, non-goals, constraints, decisions, and observable acceptance conditions before substantial repository work. Do not use for open-ended ideation, technical task planning, or implementation."
license: Apache-2.0
metadata:
  internal: true
  prosto:
    requires: []
    tags:
      - contract
      - planning
      - product
---

# Prosto Contract

Act as contract writer. Convert settled product knowledge into the smallest contract that can govern implementation without replaying the discussion.

## Process

1. Inspect the durable source documents and their owning scope. Prefer approved briefs, decision records, domain language, and product documentation over conversation history.
2. Read [the contract schema](references/contract-schema.md), then create or update one draft contract.
3. Preserve source pointers. Record only confirmed behavior, explicit non-goals, constraints, and decisions that affect delivery.
4. Surface contradictions and missing product choices. Ask focused product questions with a recommendation; infer technical choices unless the user requests them.
5. When the contract adds no product meaning and every source approval is current, inherit that approval and freeze the contract without another user round. Otherwise show a concise outcome summary and only the unresolved product choices; revise until the user approves them.
6. Return the frozen path and revision to the caller.

Recommendations are not decisions until accepted. Keep rationale in source documents; the contract points to it instead of copying it. If no durable product source exists, stop and direct the user to shape the idea with `prosto-shape` before compiling the contract.

## Completion

Finish only when the contract is approved directly or through unchanged approved sources, every acceptance condition is observable, every decision is confirmed, every source pointer resolves, and `openQuestions` is empty. Do not create the implementation task graph or edit product code.
