# Agent Skills Repository

This repository develops a small Core mindset and atomic Skills that agents select and compose from simple product language.

## Language

**Core**:
The always-applicable agent mindset: seek the outcome, use evidence, choose the smallest sufficient composition, delegate deterministic work to tools, prove proportionally to risk, and stop. Core is not a Skill, workflow, or runtime.
_Avoid_: Core Skill, agent OS, universal workflow

**Skill**:
An atomic reusable capability for agent judgment, expressed as instructions with optional supporting resources. It owns one independently useful outcome and a clear selection boundary.
_Avoid_: Prompt, command, primitive, policy

**Skill Name**:
An unprefixed verb-object identifier that states the owned outcome and is unique in its installation target. A collision blocks installation instead of silently shadowing another Skill.
_Avoid_: Vendor prefix, category path, silent overwrite

**Skill Development Skill**:
A Skill whose outcome is writing, evaluating, or improving another Skill.
_Avoid_: Core Skill, meta-skill

**Skill Suite**:
The curated collection of Skills maintained in this repository.
_Avoid_: Skill pack, bundle

**Skill Ecosystem**:
The Core, Skill Suite, Compositions, Quality Gates, and improvement practices together.
_Avoid_: Agent runtime, workflow engine

**Composition**:
The zero or more Skills and their ordering selected by an agent for one request. Composition is task-specific and creates no dependency between Skills.
_Avoid_: Dependency graph, pipeline

**Flow**:
A durable recommended Composition whose repeated use shows that the same Skills and ordering remain valuable.
_Avoid_: Speculative workflow, mandatory pipeline

**Tool**:
A deterministic mechanism used for search, transformation, validation, compilation, testing, or another mechanical operation. A Tool is not a Skill unless its use requires reusable agent judgment.
_Avoid_: Primitive Skill, tool wrapper

**Adapter**:
A minimal host-specific binding added only when compatibility evidence shows native behavior is insufficient.
_Avoid_: Core fork, speculative integration

**Evidence**:
An observation from a repository, tool, runtime, document, or user that can change an agent decision.
_Avoid_: Raw log, assumption

**Proof**:
Evidence sufficient to show that an outcome or boundary holds within its relevant scope.
_Avoid_: Completed edit, best-effort absence

**Completion Criterion**:
A checkable condition that tells an agent when a Skill or task is complete.
_Avoid_: Step list, activity report

**Invocation Mode**:
Whether an agent may select a Skill or a human must invoke it explicitly.
_Avoid_: Visibility, activation type

**Model-invoked Skill**:
A Skill whose description lets an agent select it from plain-language intent.
_Avoid_: Automatic workflow

**User-invoked Skill**:
A Skill that only a human starts explicitly. Use this mode when automatic invocation would interrupt product work or cross an ownership boundary.
_Avoid_: Command

**Experimental Skill**:
A Skill still gathering Quality Gate evidence and hidden from normal installation.
_Avoid_: Draft Skill

**Stable Skill**:
A Skill admitted to normal installation through Promotion.
_Avoid_: Production Skill, released Skill

**Maintainer-only Skill**:
A Skill reserved for repository governance or release authority.
_Avoid_: System command

**Context Pointer**:
Short available text that states what conditional material exists and when an agent should load it.
_Avoid_: Bare link, duplicated reference

**Context Load**:
Agent attention and context-window cost paid whenever material is available.
_Avoid_: File size, token count alone

**Cognitive Load**:
Human effort required to remember what Skills exist and when to invoke them.
_Avoid_: Context Load

**Trigger Case**:
A scenario where an agent should select a model-invoked Skill.
_Avoid_: Keyword test

**Anti-trigger Case**:
A scenario where an agent should reject a Skill, especially in favor of nearby behavior.
_Avoid_: Negative wording test

**Composition Case**:
A scenario where multiple independently useful Skills should combine without hard dependencies.
_Avoid_: Flow definition

**Outcome Case**:
A representative task whose observable result tests a Skill's Effectiveness.
_Avoid_: Instruction snapshot

**Quality Gate**:
Required deterministic and behavioral evidence that a Skill is valid, selectable, bounded, effective, and installable.
_Avoid_: Checklist alone

**Effectiveness**:
The degree to which a Skill changes agent behavior and achieves its intended outcome.
_Avoid_: Instruction length

**Predictability**:
The degree to which comparable runs select and follow a Skill consistently.
_Avoid_: Tool determinism

**Efficiency**:
Reduced context, cognition, tool use, and time while preserving Effectiveness and Predictability.
_Avoid_: Brevity alone

**Evaluation Report**:
Read-only evidence identifying cases, source revision, harness, model, results, variance, and blocking findings.
_Avoid_: Raw session log

**Retrospective Evidence**:
A concrete recurring behavior gap observed in completed work and suitable for a separate improvement task.
_Avoid_: Mandatory post-task introspection

**Promotion**:
Maintainer-approved movement of an Experimental Skill into the Stable Skill Suite after its Quality Gate passes.
_Avoid_: Improvement, publication

**Release Checkpoint**:
A suite-level semantic-version tag and changelog update recording accumulated Stable Skill changes.
_Avoid_: Promotion, npm publication

**Maintainer**:
A human responsible for approving Skill mutations, Promotion, and releases.
_Avoid_: Autonomous agent
