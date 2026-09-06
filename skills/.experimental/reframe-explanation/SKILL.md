---
name: reframe-explanation
description: Re-explain a previous answer so the missing connection becomes concrete. Use when the user says an explanation did not land or asks to try explaining it another way. Do not use for a first explanation, shortening or translating understood text, or disagreement that asks for a new decision rather than clarification.
license: Apache-2.0
metadata:
  internal: true
---

# Reframe Explanation

Replace the failed explanation with a clearer route from the user's context to
the point they need to understand.

1. Recover the relevant previous answer and the user's stated confusion. Supply
   just enough context to reconnect the goal, current situation, and conclusion.
   When the referent is available, use it; when it is missing or materially
   ambiguous, ask one focused question instead of inventing the prior exchange.
2. Identify the missing link: an undefined term, a skipped cause, an abstraction,
   or an unsupported claim. Change the explanatory approach at that link, using
   a concrete example, a short cause-and-effect sequence, or a useful comparison.
   Repeating the same jargon with fewer words does not repair the explanation.
3. Use familiar words and short, connected sentences. Preserve exact domain
   terms and explain them where needed. When the explanation depends on local
   meanings, consult the relevant CONTEXT.md; use CONTEXT-MAP.md to locate its
   owner when available. Reading established terms does not require redefining
   the domain or editing its documents.
4. Preserve factual limits and distinguish current behavior from a proposal.
   If the previous answer was wrong, correct the claim explicitly before
   explaining it. Keep uncertainty visible. An analogy must preserve the
   distinction at issue; use a direct example when an analogy would erase it.
5. End once the replacement connects the missing link to its practical
   consequence at the requested depth. Ask a targeted follow-up only when a
   remaining ambiguity needs the user's answer. A delivered explanation is
   observable completion; understanding remains unconfirmed until the user
   demonstrates or reports it. Further confusion calls for another approach,
   not a compulsory quiz or a broader lesson.

Clarification alone authorizes no product change. Separately requested domain
decisions, implementation, or critique remain independent outcomes; resume
already-authorized work when the user asks, without adding an approval round.
