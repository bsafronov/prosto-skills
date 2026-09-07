---
name: synthesize-evidence
description: Resolve a bounded research question into findings supported by attributable evidence, including applicability limits and unresolved conflicts. Use when sources must be compared, reconciled, or assessed for coverage before an answer is reliable. Do not use for a single factual lookup, locating files or links, domain decisions, or writing a specification from settled facts.
license: Apache-2.0
metadata:
  internal: true
---

# Synthesize Evidence

Return an answer whose material claims can be checked against the evidence that
supports them and whose limits remain visible.

1. Bound the question by the requested decision, comparison, population, version,
   and time where they affect the answer. Identify the claims that could change
   it. Use the user's depth or source limits; choose a proportionate boundary
   when none is given. Broader adjacent topics earn investigation only when they
   could change an in-scope conclusion.
2. Seek the source that can establish each claim: the owning specification or
   documentation for a contract, implementation or observation for actual
   behavior, and original study or data for an empirical result. A primary source
   is authoritative only within that role. Follow summaries to their original
   basis; several accounts of one observation are one evidence chain. Search
   snippets identify leads, not verified support.
3. Compare scope before resolving disagreement. Date, version, configuration,
   population, and measurement method can make different findings compatible.
   An explicit applicable revision can supersede old evidence; a newer date alone
   cannot settle a same-scope conflict. Keep unresolved contradictions visible
   with both sources and the missing evidence that would distinguish them.
4. Attach material factual claims to the exact supporting source or local path
   and useful locator. Separate observed results, source claims, and your
   inferences. Preserve qualifications that affect the answer; a narrow benchmark
   cannot establish a general guarantee. Treat inaccessible evidence and a bounded
   search with no result as coverage limits, not proof of absence or certainty.
5. Synthesize the answer around the question, not the reading order. State the
   supported conclusion, decisive evidence, and material uncertainty. Use the
   requested response or artifact and existing note conventions when saving is
   requested; research alone needs no new file or background task. Recommendations
   may explain what the evidence supports without becoming accepted product or
   domain decisions.

Stop when every decision-bearing claim is supported at the requested scope or
explicitly unresolved, and further available investigation within the agreed
bounds would not change that status. Name incomplete coverage and the specific
missing evidence when it limits the answer; do not call the research exhaustive.
An answered question completes this outcome. Specification, domain modeling,
implementation, and further experiments compose only for separately requested
outcomes.
