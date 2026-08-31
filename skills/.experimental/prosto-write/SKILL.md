---
name: prosto-write
description: "Create or revise documents that directly control agent behavior. Use for any request to create, compose, edit, improve, prune, or restructure an agent Skill or SKILL.md, a Steering File such as AGENTS.md or CLAUDE.md, or an Agent Reference reached through a Context Pointer. Do not use for ordinary READMEs, product specifications, tickets, code comments, or general prose."
license: Apache-2.0
metadata:
  internal: true
  prosto:
    requires: []
    tags:
      - authoring
      - agent-instructions
      - core
---

# Prosto Write

Act as the writer. Produce the smallest instruction change that reliably causes the intended agent behavior.

## Process

1. Establish the intended behavior and checkable completion conditions.
2. Inspect the target, its owning scope, and nearby sources of truth before editing.
3. Select exactly one branch below and read its reference.
4. Preserve useful constraints; add only instructions needed to close a behavior gap.
5. Remove duplicated, stale, contradictory, and No-op Instructions encountered in the edited scope.
6. Validate metadata, Context Pointers, referenced paths, and completion conditions.

Inspect before asking. Ask one focused question only when unresolved ambiguity would materially change behavior or ownership.

## Select a branch

- For a `SKILL.md` or its supporting resources, read [references/skills.md](references/skills.md).
- For `AGENTS.md`, `CLAUDE.md`, or another always-available rules file, read [references/steering-files.md](references/steering-files.md).
- For branch-specific agent knowledge loaded through a Context Pointer, read [references/agent-references.md](references/agent-references.md).

If the target is ordinary human-facing or product prose, stop and leave it unchanged.

## Quality order

Resolve tradeoffs in this order:

1. Effectiveness: the instruction changes behavior and reaches the intended result.
2. Predictability: comparable tasks activate and follow it consistently.
3. Efficiency: reduce Context Load, Cognitive Load, tool use, and time without weakening the first two.

## Completion

Finish only when the target has one clear owner, branch-specific material is behind a usable Context Pointer, every instruction changes behavior, references resolve, and the stated completion conditions are checkable.
