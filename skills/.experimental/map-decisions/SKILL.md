---
name: map-decisions
description: Create or revise a resumable map of unresolved decisions and their evidence dependencies for an effort spanning multiple tasks. Use when uncertainty prevents a reliable route to an agreed destination, or new evidence changes that route. Do not use for a single bounded decision, specification writing, decomposing settled scope, critique alone, or task creation and status operations on an unchanged plan.
license: Apache-2.0
metadata:
  internal: true
---

# Map Decisions

Make an uncertain effort resumable without pretending its downstream decisions
are already known.

1. Establish the destination and what must be decided before reaching it. Reuse
   existing agreement, exclusions, and decision records. Scale alone is not a
   reason for a decision map: settled work needs execution or decomposition;
   a bounded question needs an answer. Ask about the destination only when
   available evidence leaves a material ambiguity.
2. Separate supported decisions, precise open questions, in-scope uncertainty
   that cannot yet be phrased as a question, and excluded work. A precise question
   belongs in the map even when blocked; an indistinct area stays broad until
   evidence makes it actionable. Keep excluded work outside the route.
3. For each open question, record why its answer matters to the destination,
   what evidence or human choice would resolve it, and its actual prerequisites.
   Connect questions only where one answer is needed to frame or resolve another.
   Prefer a bounded evidence-gathering step when speculation cannot settle a
   question. These units finish with a supported answer, not a shipped feature.
4. Identify the next useful unblocked question from current evidence and existing
   work. Prefer one that could change the route or make other questions answerable;
   do not duplicate an investigation already in progress. Distinguish facts the
   agent can obtain from choices the human owns. Pending evidence or an unanswered
   preference remains unresolved; an agent recommendation is not acceptance.
5. On resumption, refresh the relevant records before revising the map. Preserve
   each resolution's answer, basis, and status in its existing source and link a
   short gist from the map. When evidence changes that basis, reopen the affected
   decision and identify downstream answers that need reassessment; preserve
   unaffected decisions. Turn newly precise uncertainty into questions, remove
   duplicate placeholders, and retire questions that no longer serve the
   destination with a reason rather than presenting them as resolved decisions.

Use the project's existing artifact convention; return a local draft if none
exists. Keep one authoritative record per decision and enough context in the map
to resume without replaying every prior task. Task creation, assignment,
delegation, worktrees, tracker mutation, and status queries belong to native host
tools under the request's authorization. No tracker setup, fixed ticket taxonomy,
mandatory peer Skill, or one-decision-per-task limit is needed for the map.

Stop this update when the map reflects current evidence, genuine prerequisites,
unresolved areas, and the next decision or explicit blocker. Declare the route
clear only when every consequential in-scope uncertainty is resolved or explicitly
accepted as a risk by its owner. A clear route completes planning; carrying out
the destination requires its own authorization. Critique, specification writing,
and work decomposition compose only when their separate outcomes are requested.
