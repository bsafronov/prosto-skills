---
name: build-prototype
description: Build a disposable artifact that answers a design question through concrete behavior or comparison. Use when a proposed interaction, state model, or interface needs trying before a design decision. Do not use for production implementation, visual polish alone, source research, or recording an already agreed spec or domain model.
license: Apache-2.0
metadata:
  internal: true
---

# Build Prototype

Turn one design uncertainty into an inspectable experiment and a bounded answer.

1. Recover the question, the decision it informs, and the observation that could
   distinguish the alternatives. Inspect relevant constraints and prior decisions.
   A vague request to try a feature may leave the question unresolved; ask what
   decision the experiment must inform when choosing it would change the work.
   Use an explicit, reversible assumption when the available evidence supports
   a useful bounded slice. A page or backend filename alone does not decide it.
2. Choose the smallest artifact whose fidelity exposes that uncertainty. A state
   experiment needs relevant transitions and awkward event orders; an interaction
   experiment needs the context and actions that distinguish the options. Preserve
   the proposal being tested instead of silently correcting it. Compare only as
   many alternatives as the question needs, using the project's useful tools and
   conventions without requiring a framework, format, or variant switcher.
3. Mark and isolate disposable work so it cannot enter normal product behavior
   accidentally. Use synthetic data and in-memory state by default; stub external
   mutations. When persistence or integration is the question, use an explicitly
   scoped scratch resource and state its reset or removal path. Existing credentials
   or a production client are not permission to use live data. Read-only or
   draft-only scope governs the deliverable; return an artifact in the allowed
   form or the precise blocked requirement rather than silently widening scope.
4. Make the artifact easy to run or inspect and expose the state or differences
   needed to judge it. Exercise the distinguishing cases with proportionate checks;
   a runnable demo that conceals the failing event order has not answered the
   question. Avoid unrelated polish and infrastructure. If a tool or input needed
   for the experiment is unavailable, identify what remains untested.
5. Return the artifact's location or contents, its run/reset instructions, the
   question, and what the observations support. Separate executed behavior from
   simulated inputs, assumptions, and remaining human judgment. A successful stub
   cannot establish production reliability, and an agent's layout preference is
   not user validation. An unresolved answer is valid when the missing observation
   is explicit; claim neither a run nor a settled decision without its evidence.

Stop when the bounded experiment is usable and its answer or remaining evidence
is clear. Building the prototype does not authorize adopting it in production,
editing durable domain or specification records, or publishing. These outcomes
compose only when separately requested. Branches and tracker setup are not required;
use reversible isolation choices within the existing authorization without adding
a new approval round. Further iteration
needs a question that the current artifact does not already answer.
