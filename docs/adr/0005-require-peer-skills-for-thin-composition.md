---
status: superseded by ADR-0015
---

# Require Peer Skills for thin composition

An Orchestrator Skill will require its named Peer Skills and stop with clear installation guidance when one is absent. It will not copy fallback behavior from Peer Skills. Required Peer Skills will be declared in the Orchestrator Skill's `metadata.prosto.requires`; repository catalogs and Peer Closure checks will be generated from that source. Validation rejects missing Peers, user-invoked Peers, cycles, cross-harness Invocation Mode disagreement, and any Stable Skill whose Peer Closure includes an Experimental or Maintainer-only Skill. This preserves one source of truth and keeps composition efficient despite the portable Agent Skills specification having no dependency mechanism.
