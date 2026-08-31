# Matt Pocock's Skills: lessons for `prosto-skills`

Inspected 2026-08-31 at commit [`6654f6b`](https://github.com/mattpocock/skills/tree/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76).

## Main finding

The intended project is not one Skill Lifecycle split into author, review, test, and release commands. It is a composable ecosystem:

- reusable Peer Skills hold one discipline or vocabulary;
- thin user-invoked Skills compose those Peer Skills for a named task;
- Router Skills help a human choose a Skill or Flow;
- self-improvement Skills use real runs to improve the ecosystem.

Matt describes his Skills as small and composable, then maps several paths through them instead of imposing one process. [Repository README](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/README.md)

## Composition and Invocation Mode

Matt divides Skills by reach:

| Invocation Mode | Reach | Typical role |
|---|---|---|
| User-invoked | Only a human explicitly invokes it | Entry point, Orchestrator, Router |
| Model-invoked | Human, model, or another Skill can invoke it | Reusable discipline, vocabulary, autonomous behavior |

Claude Code uses `disable-model-invocation: true` for user-invoked Skills. Codex uses `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. A model-invoked description is a model-facing trigger; a user-invoked description is a human-facing summary. [Invocation rules](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/.agents/invocation.md) [Codex metadata example](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/grill-with-docs/agents/openai.yaml)

This is an architecture rule, not only UI metadata. A user-invoked Skill cannot invoke another user-invoked Skill. A Peer Skill that an Orchestrator must call therefore needs to be model-invoked. [Invocation dependencies](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/.agents/invocation.md)

`grill-with-docs` is the key example. Its only operative instruction is to call the Skill tool twice: once for `grilling`, once for `domain-modeling`. It does not copy either procedure. [grill-with-docs](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/grill-with-docs/SKILL.md)

The Peer Skills remain useful alone:

- `grilling` owns the design-tree interview, rounds, frontier, and completion condition. [grilling](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/productivity/grilling/SKILL.md)
- `domain-modeling` owns active glossary and ADR work. [domain-modeling](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/domain-modeling/SKILL.md)
- `grill-me` composes only `grilling`, giving the same interview a different entry point. [grill-me](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/productivity/grill-me/SKILL.md)

Matt requires operative composition to explicitly call the Skill tool. A bare `/skill` mention is only a label. Two required Skills mean two calls. Shared reference stays with the Skill that owns it. [Invocation dependencies](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/.agents/invocation.md)

## Router Skill versus Orchestrator Skill

`ask-matt` is a Router Skill. It maps situations to user-invoked Skills and Flows, but it does not execute them. The human chooses the next entry point. [ask-matt](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/ask-matt/SKILL.md)

`writing-for-agents` explains why: user-invoked Skills spend cognitive load because the human must remember them. A Router gives the human one entry point. It can recommend another user-invoked Skill but cannot invoke it. [Skill mechanics](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/productivity/writing-for-agents/SKILL-MECHANICS.md)

Recommended distinction:

- **Orchestrator Skill** executes a composition of model-invoked Peer Skills.
- **Router Skill** helps a human choose among user-invoked Skills and Flows.

## Self-improvement Core

`writing-great-skills` is no longer current. Matt renamed it `writing-for-agents`, broadened it to all agent-facing documents, and moved Skill-only mechanics into `SKILL-MECHANICS.md`. No compatibility alias remains. [Changelog](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/CHANGELOG.md) [writing-for-agents](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/productivity/writing-for-agents/SKILL.md)

Its core design language is useful for every `prosto-*` Skill:

- context pointers;
- context load and cognitive load;
- progressive disclosure;
- clear, demanding completion criteria;
- leading words;
- single sources of truth, pruning, and removal of no-op instructions.

`retro` begins the other half of the loop. It calls `writing-for-agents`, reads primary evidence from a coding session, and proposes improvements to navigation, checks, standards, steering, tool economy, no-op instructions, and information access. [retro](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/retro/SKILL.md)

But `retro` is explicitly an in-progress stub, excluded from the promoted set and not functional yet. It is a direction, not a mature implementation to copy. [In-progress README](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/README.md)

`prosto-skills` can complete that loop:

```text
real Skill run
  -> Retrospective Evidence
  -> improvement candidate
  -> agent-authored change
  -> independent review
  -> Trigger, Anti-trigger, and Outcome evaluation
  -> Maintainer approval
  -> promotion
```

The retrospective should propose evidence-backed changes. It should not silently modify or release the Skill Suite.

## Important conflict with the current ADR

Matt accepts hard Peer Skill requirements. `grill-with-docs` does not provide a fallback if `grilling` or `domain-modeling` is absent. His changelog tells users to install newly required shared Skills when existing Skills are rewired. [grill-with-docs](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/grill-with-docs/SKILL.md) [Changelog](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/CHANGELOG.md)

This conflicts with ADR 0001 in `prosto-skills`, which requires every Orchestrator Skill to remain usable without its Peer Skills. That decision should be reopened. Thin composition favors declared hard requirements. Reliable selective installation then needs either dependency-closure checks or a complete Skill Suite as the safe default.

## Quality gap to improve

At the inspected commit, Matt's repository has no dedicated Skill evaluation suite or automated Skill Quality Gate. `package.json` has release/version scripts, and the only GitHub workflow handles release. Repository instructions require manual plugin validation, but there are no Trigger Cases, Anti-trigger Cases, or Outcome Scenarios in CI. [package.json](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/package.json) [Release workflow](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/.github/workflows/release.yml) [Repository instructions](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/CLAUDE.md)

`prosto-skills` should keep its planned Quality Gate. That is how it can extend Matt's composition model instead of only copying it.

## Core principles for `prosto-skills`

1. Build a graph of Skills, not one lifecycle monolith.
2. Make reusable disciplines model-invoked.
3. Keep Orchestrator Skills thin.
4. Treat Router Skills as human indexes, not executors.
5. Treat descriptions as Context Pointers with precise triggers.
6. Make `writing-for-agents`-style guidance a Peer Skill beneath all authoring and review Flows.
7. Use Retrospective Evidence from real runs to propose improvements.
8. Promote changes only after Quality Gate evidence and Maintainer approval.
9. Separate experimental Skills from the stable Skill Suite. Matt uses a public `in-progress` bucket excluded from the promoted plugin. [Repository instructions](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/CLAUDE.md)
10. Reopen the fallback-only composition decision before designing the first Skill Suite.

## Candidate ubiquitous language

- **Invocation Mode**: whether a Skill is user-invoked or model-invoked.
- **Router Skill**: a user-invoked Skill that helps a human select a Skill or Flow.
- **Flow**: a recommended path through Skills for a class of problem.
- **Context Pointer**: short, always-visible text that states when to load a Skill or reference.
- **Promotion**: movement from experimental Skill to stable Skill Suite after Quality Gate evidence and Maintainer approval.
- **Retrospective Evidence**: observations from real Skill runs that support an improvement candidate.
