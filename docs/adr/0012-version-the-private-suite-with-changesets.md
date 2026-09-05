---
status: accepted
---

# Version the private suite with Changesets

The repository will use Changesets to store selected Change Records, update one private suite version, generate `CHANGELOG.md`, and create semantic-version tags without publishing an npm package. Private-package versioning and tagging will be enabled explicitly, matching Git-hosted Skill distribution while retaining a conventional release history. Major versions represent removed or renamed Stable Skills, changed Invocation Modes, or incompatible Flow changes; minor versions add Stable Skills, Flows, or capabilities; patch versions make compatible behavior, wording, or evaluation improvements. Promotion reaches installable `main` immediately, while a later Release Checkpoint consumes accumulated Changesets.
