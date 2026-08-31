# Writing Steering Files

Use this branch for always-available agent instructions such as `AGENTS.md`, `CLAUDE.md`, or scoped rule files.

## Minimize permanent load

A Steering File spends Context Load on every task in its scope. Keep only rules that apply broadly enough to justify that cost: scope boundaries, safety constraints, required discovery order, completion gates, and Context Pointers.

Inspect parent and child Steering Files before editing. Place a rule at the narrowest scope where it always applies. Do not duplicate a parent rule in a child or copy tool documentation the agent already receives.

## Replace bulk with pointers

Move conditional procedures, domain background, examples, and tool-specific detail to an Agent Reference. Replace them with a short Context Pointer that tells the agent:

1. what material exists;
2. the exact condition for loading it;
3. where it is located.

Example shape:

```markdown
When changing release behavior, read `docs/agent/releasing.md` before editing.
```

The pointer must be available before the branch decision. Avoid vague pointers such as "see docs".

## Prune

Remove stale paths, repeated constraints, motivational prose, generic quality reminders, and instructions that restate default agent behavior. Resolve contradictions in favor of the owning source of truth; update pointers instead of synchronizing copies.

Complete the edit when an agent can determine its scope, discover conditional material at the decision point, and verify the task without loading irrelevant branches.
