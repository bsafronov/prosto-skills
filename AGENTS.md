# Agent instructions

Read [CONTEXT.md](CONTEXT.md) before changing domain language or Skill relationships. Read the relevant record in [docs/adr](docs/adr/) before changing architecture, lifecycle, release, or security behavior.

For contribution rules and completion checks, follow [CONTRIBUTING.md](CONTRIBUTING.md).

Keep this file small. Put branch-specific guidance in an Agent Reference and leave a Context Pointer here or in the owning Skill.

Do not hand-edit a generated `prosto-find/references/catalog.md`. Run `npm run generate`.

A Skill change is complete only when its metadata, behavior cases, deterministic checks, and required Changeset or Promotion evidence agree.
