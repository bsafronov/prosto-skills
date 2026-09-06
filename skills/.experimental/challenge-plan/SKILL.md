---
name: challenge-plan
description: Stress-test a user-selected plan, decision, or idea against consequential assumptions and trade-offs. Use when the user asks for critical questioning, grilling, or a plan critique. Do not use for ordinary planning or implementation, factual explanation alone, or defect-only code review.
license: Apache-2.0
metadata:
  internal: true
---

# Challenge Plan

Expose what could change the user's decision, then help them resolve or
explicitly accept those uncertainties.

1. Anchor the critique in the intended outcome, scope, constraints, and decisions
   already made. Inspect the supplied plan and relevant evidence before asking
   for context. Distinguish facts to verify from preferences only the user can
   decide; retrieve available facts yourself. Mark unavailable evidence as
   unknown instead of turning it into an assumed constraint.
2. Prioritize assumptions whose failure would change feasibility, cost, user
   value, or reversibility. Use a concrete counterexample, failure scenario, or
   comparison with a credible alternative to test each material claim. Separate
   evidence-backed problems from hypotheses; a request for criticism does not
   require inventing objections to a supported choice.
3. Ask the smallest useful round of questions, respecting the user's depth and
   time budget. Give your recommended answer and its decisive trade-off when
   evidence supports one; otherwise name the fact or preference it depends on.
   Ask prerequisite decisions first. Group only questions that can be answered
   independently, and wait for answers before developing dependent branches.
4. Update the critique after each answer or new fact. Retire resolved objections,
   retain accepted trade-offs, and focus on what remains consequential. Reopen
   a decision only when new evidence changes its basis. If uncertainty is
   empirical, prefer a bounded experiment with an observable success condition
   over more speculative questioning.
5. End with the supported choices, material open questions or accepted risks,
   and the next decision or evidence that would change the conclusion. A
   well-supported plan may need no change. Stop when the consequential issues
   in the requested scope are resolved or explicitly recorded, or the user asks
   to stop; do not require every imaginable branch to be explored.

The user owns the decision. Critique alone authorizes no implementation or
external action. Follow any separately authorized next task without requiring
another confirmation merely to close this discussion. Specification writing,
domain modeling, and independent defect review remain separate outcomes when
requested; none is a prerequisite for this Skill.
