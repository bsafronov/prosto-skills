# Agent Skills Repository

This repository curates a composable ecosystem of reusable capabilities for agents. Its language distinguishes independently useful Skills from the structures that invoke, combine, route, and improve them.

## Language

**Skill**:
A reusable capability for an agent, expressed as instructions with optional supporting resources. A Skill remains useful when installed by itself.
_Avoid_: Prompt, command, plugin

**Skill Suite**:
The complete curated collection of Skills maintained in this repository.
_Avoid_: Skill pack, bundle

**Experimental Skill**:
A Skill still gathering Quality Gate evidence. It is hidden from normal installation until Promotion.
_Avoid_: Draft skill, in-progress skill

**Stable Skill**:
A Skill admitted to the normal installable Skill Suite through Promotion.
_Avoid_: Production skill, released skill

**Skill Ecosystem**:
The Skill Suite together with its Invocation Modes, compositions, Flows, Quality Gates, and improvement practices.
_Avoid_: Skill library, command collection

**Core Skill**:
A Skill that helps agents write, compose, evaluate, or improve other Skills and agent-facing material.
_Avoid_: Base skill, system skill

**Orchestrator Skill**:
A user-invoked Skill that calls model-invoked Peer Skills to perform a composed task. It stays thin by requiring its named Peer Skills instead of copying their behavior.
_Avoid_: Meta-skill, wrapper skill

**Peer Skill**:
An independently useful, model-invoked Skill that an Orchestrator Skill can call. An Orchestrator Skill can require named Peer Skills.
_Avoid_: Sub-skill

**Peer Closure**:
The complete set of direct and transitive Peer Skills required by an Orchestrator Skill.
_Avoid_: Dependency bundle, install set

**Invocation Mode**:
The rule that determines whether a Skill is user-invoked or model-invoked.
_Avoid_: Visibility, activation type

**User-invoked Skill**:
A Skill that only a human can start explicitly. It commonly acts as an Orchestrator Skill or Router Skill.
_Avoid_: Command, manual skill

**Model-invoked Skill**:
A Skill that a human, model, or Orchestrator Skill can start. It commonly owns a reusable behavior, discipline, or vocabulary.
_Avoid_: Automatic skill, implicit skill

**Router Skill**:
A user-invoked Skill that helps a human select another user-invoked Skill or Flow without starting it.
_Avoid_: Orchestrator Skill, index skill

**Skill Catalog**:
A generated description of available Skills, their Invocation Modes, relationships, maturity, and applicable problems.
_Avoid_: Skill list, registry

**Flow**:
A recommended path through multiple Skills for a class of problems.
_Avoid_: Pipeline, workflow

**Context Pointer**:
Short, available text that states what material exists and when an agent should load it.
_Avoid_: Link, reference

**Context Load**:
The agent attention and context-window cost of material kept available whether or not it is used.
_Avoid_: Token count, prompt size

**Cognitive Load**:
The human effort required to remember what Skills and material exist and when to use them.
_Avoid_: Complexity, learning curve

**Progressive Disclosure**:
Placement of branch-specific material behind a Context Pointer so the agent loads it only when needed.
_Avoid_: Lazy loading, file splitting

**Completion Criterion**:
A checkable condition that tells an agent when a step or task is genuinely complete.
_Avoid_: Definition of done, acceptance criterion

**Single Source of Truth**:
The one authoritative location for a behavior, rule, or fact; other material points to it instead of copying it.
_Avoid_: Canonical copy, primary file

**No-op Instruction**:
An instruction that does not materially change agent behavior from its default.
_Avoid_: Redundant instruction, filler

**Steering File**:
An always-available instruction file that controls agent behavior within a user or project scope.
_Avoid_: Rules file, memory file

**Agent Reference**:
Agent-facing material loaded through a Context Pointer only when its branch applies.
_Avoid_: Documentation, knowledge file

**Skill Lifecycle**:
The progression through authoring, review, evaluation, and release of a Skill.
_Avoid_: Skill pipeline, publishing flow

**Quality Gate**:
Required evidence that a Skill conforms to the format, installs correctly, activates appropriately, and produces acceptable outcomes.
_Avoid_: Checklist, lint pass

**Effectiveness**:
The degree to which a Skill changes agent behavior and achieves its intended outcome.
_Avoid_: Usefulness, quality

**Predictability**:
The degree to which a Skill activates and follows its intended process consistently across comparable runs.
_Avoid_: Determinism, repeatability

**Efficiency**:
The reduction of context, cognition, tool use, and time that preserves Effectiveness.
_Avoid_: Brevity, cheapness

**Trigger Case**:
A scenario where an agent should activate a Skill.
_Avoid_: Positive test

**Anti-trigger Case**:
A scenario where an agent should not activate a Skill.
_Avoid_: Negative test

**Outcome Scenario**:
A representative task and acceptance conditions used to evaluate a Skill's behavior.
_Avoid_: Prompt test, example

**Evaluation Report**:
Promotion evidence that identifies evaluated cases, source revision, harness, model, results, variance, and blocking findings.
_Avoid_: Test output, scorecard

**Retrospective Evidence**:
Observations from a real agent run that support a proposed improvement to the Skill Ecosystem.
_Avoid_: Feedback, session notes

**Change Record**:
A durable summary that connects selected Retrospective Evidence to one proposed change and its release impact.
_Avoid_: Session log, change request

**Promotion**:
Movement of a Skill or change into the stable Skill Suite after Quality Gate evidence and Maintainer approval.
_Avoid_: Publication, deployment

**Release Checkpoint**:
A suite-level semantic-version tag and changelog update that records accumulated Stable Skill changes without publishing an npm package.
_Avoid_: Promotion, npm release

**Adapter**:
An optional Skill or resource that maps a portable capability to one agent's product-specific behavior.
_Avoid_: Fork, vendor patch

**Maintainer**:
A human who accepts responsibility for approving changes and releases, including work authored by agents.
_Avoid_: Approver, owner
