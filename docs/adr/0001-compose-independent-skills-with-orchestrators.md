---
status: superseded by ADR-0005
---

# Compose independent Skills with Orchestrator Skills

Skills will remain useful when installed alone and will share repository vocabulary rather than form hard runtime dependencies. Each installed Skill will include the terms and instructions it needs instead of depending on repository-level files. Larger workflows will be represented by optional Orchestrator Skills that provide a basic fallback when Peer Skills are unavailable, because hard dependencies would make selective installation fragile and are not represented by the portable Agent Skills specification.
