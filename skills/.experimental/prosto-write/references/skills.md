# Writing Skills

Use this branch only for a Skill's `SKILL.md`, `agents/` metadata, or owned supporting resources.

## Establish ownership

Define one reusable capability. The Skill must remain useful when installed alone. If another Skill already owns part of the behavior, declare it as a required Peer instead of restating its process.

Use an action-oriented `prosto-<verb>` name. Make the description the activation boundary: front-load what the Skill does, name realistic triggers, and state important exclusions. Do not hide trigger logic only in the body because agents see the description before loading the instructions.

## Write the instruction body

Use imperative steps with explicit inputs, outputs, and Completion Criteria. Give the agent the task-specific decisions it cannot reliably infer. Remove generic encouragement, explanations that do not change action, repeated platform defaults, and multiple examples that teach the same rule.

Keep the main path in `SKILL.md`. Move branch-specific material to `references/` and leave a Context Pointer that states both what the reference contains and when to read it. Do not create a reference that has no incoming pointer.

Prefer instructions. Add a script only when deterministic execution, repeated transformation, or external tooling materially improves the capability. State the script's inputs, outputs, side effects, and failure behavior.

## Preserve composition

Declare Prosto metadata in frontmatter:

```yaml
metadata:
  prosto:
    requires:
      - prosto-peer
    tags:
      - focused-problem
```

Use `metadata.internal: true` for Experimental and System Skills. User-invoked Orchestrators require model-invoked Peers and remain thin. A required Peer is a hard dependency; do not embed a fallback copy.

Invocation controls across harnesses must agree. User-invoked Skills disable model invocation in supported harness metadata. Model-invoked Skills omit user-only controls and allow implicit invocation.

## Complete the change

Confirm the directory and frontmatter names match, referenced files resolve, metadata reflects actual composition, and relevant behavior cases express activation, rejection, or outcome expectations. Run the repository's deterministic validator when one exists.
