---
name: design-interface
description: Design a code interface and its responsibility boundary from concrete caller needs. Use when choosing what a module exposes, where coordination belongs, or how callers control dependencies and lifecycle. Do not use for visual UI design, domain terminology alone, critique alone, or implementing a settled feature or refactor without an unresolved interface decision.
license: Apache-2.0
metadata:
  internal: true
---

# Design Interface

Give callers a usable contract that puts coordination and change in a justified
place, with enough detail to implement and verify the choice.

1. Ground the decision in representative callers, current behavior, and the
   change or testing difficulty that prompted it. Trace the knowledge each caller
   repeats and what actually varies. Preserve the project's domain terms and
   accepted constraints; mark missing behavior or ownership decisions as open
   rather than choosing product policy through a type signature.
2. Place responsibilities where their information and consistency requirements
   can be satisfied. Hide coordination that callers otherwise repeat, while
   leaving necessary caller choices visible. Account for resource ownership,
   ordering, failure, cancellation, concurrency, and compatibility where relevant.
   A smaller signature can conceal more obligations; fewer methods or more hidden
   code does not by itself improve a design.
3. Sketch a concrete contract and realistic caller use, including a consequential
   failure or lifecycle path. State inputs, results, obligations, and which side
   owns side effects and recovery. Compare against the current design or a
   materially different alternative using caller burden, change locality, and
   required guarantees. Keep the existing boundary when a wrapper or merger adds
   indirection or couples responsibilities without demonstrated benefit.
4. Choose dependency control from the behavior that must be exercised. A single
   production implementation can still need a boundary for time, I/O, lifetime,
   or isolation; a second adapter is not a prerequisite. Conversely, a test alone
   does not justify exposing internal wiring to every caller. State what can be
   verified through the proposed contract and what needs real dependency or
   integration evidence. Keep useful existing tests unless their coverage is
   demonstrably replaced; a redesign is not blanket authority to delete them.
5. Recommend a design with its decisive trade-off, supported guarantees, and any
   remaining uncertainty. Return or record the contract at the requested scope.
   Distinguish a worked example from executed proof and a proposed interface from
   implemented behavior. Stop when representative callers and the material failure
   or lifecycle path fit the contract, responsibility and verification ownership
   are explicit, and the choice or unresolved blocker is reviewable.

This Skill owns the interface decision. Code discovery stays in tools; ordinary
implementation and behavior-preserving structural edits are separate outcomes.
Domain modeling resolves disputed meaning, critique tests a selected proposal,
and test-first work controls implementation order. Compose only when their
independent outcomes are also requested. Choosing an interface does not require
a glossary, an ADR, multiple agents, or implementation permission beyond the
user's existing scope.
