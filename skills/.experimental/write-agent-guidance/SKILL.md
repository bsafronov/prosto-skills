---
name: write-agent-guidance
description: Write repository steering and referenced guidance that agents can reach and apply at the right task boundary. Use when creating or restructuring agent-facing instructions, repairing missed context, or clarifying instruction completion. Do not use for Skill authoring alone, ordinary prose edits, domain terminology decisions, or merely following existing guidance.
license: Apache-2.0
metadata:
  internal: true
---

# Write Agent Guidance

Make the requested guidance usable from the context an agent actually receives,
with the same intended obligations and a checkable stopping point.

1. Inspect the entry document, relevant referenced material, and local sources of
   authority. Identify which task decisions the guidance must change and where
   agents currently miss them. Preserve scope, exceptions, approval boundaries,
   and unresolved disagreements; editing instructions does not authorize deciding
   new policy or executing the actions they describe.
2. Keep broadly needed local rules in the entry document. Put conditional detail
   at its existing owner when one exists. A Context Pointer must name the material
   and the task condition that requires reading it, early enough to affect the
   decision. Cover distinct branches without making every task load every document.
   Repair a weak pointer before copying its target into always-loaded steering.
3. Keep each rule authoritative in one place, with its exceptions and completion
   condition nearby. Refer to discoverable commands and configuration instead of
   maintaining a second copy. Remove stale or redundant wording only after checking
   that its meaning survives. Split files only when a real conditional boundary
   earns the navigation cost; a short coherent document can stay intact.
4. State the action and the observable evidence that finishes it. Preserve required
   prohibitions and prerequisites when omission would change behavior. Clarify a
   vague completion bound before inventing a workflow, handoff, or extra document.
   When sources conflict, expose the narrow unresolved choice instead of silently
   accepting one rule or weakening both.
5. Return a draft or edit the authorized documents at the requested scope. Check
   affected links and trace representative tasks from the entry context: one that
   must reach each changed branch and one nearby task that should bypass it. Verify
   that obligations, exceptions, and stopping evidence survive the rewrite. A link
   existing is structural proof; an agent reaching and applying it is behavior
   evidence. Distinguish a simulated trace from an independent execution.

This Skill owns the delivery of repository instructions through documents.
Skill selection contracts and Skill bodies belong to Skill authoring; domain
meaning belongs to domain modeling. Compose only when the request includes a
separate guidance outcome, such as both a new Skill and repository steering.
General agent mindset stays in Core. A filename such as AGENTS.md or CLAUDE.md
does not by itself require this Skill.

Stop when the requested guidance is drafted or changed, affected routes resolve,
and representative tasks preserve the intended decisions and completion bounds,
or when a material policy conflict is explicitly left for its owner.
