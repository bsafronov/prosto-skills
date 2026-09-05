---
status: accepted
---

# Use a Core mindset and native atomic Skill composition

Users will state product outcomes without selecting Skills. Core is a small always-applicable agent mindset, not a Skill or runtime; each unprefixed verb-object Skill owns one independently useful outcome and exposes a precise selection boundary through its name and description. Agents select zero or more Skills natively for each request, while deterministic phases remain Tools. The repository Steering File carries Core for repository work; installed Skills assume a capable host and do not duplicate it, with compatibility evidence deciding whether a host needs a small Adapter. The suite will not encode hard Skill dependencies, a resolver, an orchestration engine, or generated routing; a durable Flow is added only after repeated behavior evidence proves the same Composition useful. This trades enforced dependency graphs for lower context and coordination cost, with selection, rejection, Composition, and outcome cases providing the evidence boundary. This decision supersedes ADR-0001, ADR-0005, and ADR-0013.
