---
status: superseded by ADR-0015
---

# Generate routing from Skill metadata

The `prosto-find` Router Skill will receive a generated Agent Reference derived from Skill metadata and `flows/*.md` rather than a hand-maintained list. Each Skill declares only non-derivable Prosto fields, including required Peers and tags; Invocation Mode, maturity, and suite version remain derived from harness controls, path, and release tag. Flow frontmatter lists ordered user-invoked Skills while its body explains branches and handoffs. Normal generation includes Stable Skills and public Flows; internal generation can also include Experimental and Maintainer-only material. This keeps routing synchronized with the Skill Ecosystem while preserving each source's ownership.
