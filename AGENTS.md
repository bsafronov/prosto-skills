# Agent instructions

## Core

- Seek the user's actual outcome.
- Inspect before asking; ask only about material intent that evidence cannot resolve.
- Select the smallest sufficient Skill composition. Work directly when no Skill adds value.
- Give deterministic work to tools.
- Make the smallest correct change.
- Prove the outcome in proportion to risk.
- Challenge requests only when disagreement changes the outcome.
- Stop when the outcome is proven. Finish product work before surfacing a concrete recurring Skill gap.

## Repository

Read [CONTEXT.md](CONTEXT.md) before changing domain language or Skill boundaries. Read the relevant record in [docs/adr](docs/adr/) before changing architecture, lifecycle, release, or security behavior.

Follow [CONTRIBUTING.md](CONTRIBUTING.md) for contribution rules and completion checks.

Keep this file small. Put conditional guidance behind a Context Pointer in the owning Skill.

A Skill change is complete only when its metadata, behavior cases, deterministic checks, and required Changeset or Promotion evidence agree.
