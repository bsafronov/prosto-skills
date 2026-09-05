# Global Skill Cutover

This document records the evidence and stop conditions for replacing the current
global third-party Skill installation with the Prosto Skill Suite. It is a
migration ledger, not authorization to remove installed Skills.

## Current state

Snapshot date: 2026-09-05.

The Skills CLI reports 56 global Skills:

- 32 from `mattpocock/skills`;
- 19 from `JuliusBrussee/caveman`;
- 2 from `shadcn/ui`;
- 1 from `vercel-labs/skills`;
- 1 from `vercel-labs/agent-skills`;
- 1 local Skill, `frontend-design`, with no recorded upstream source.

The shared installation directory also contains exact copies of the three
current Prosto Experimental Skills: `write-skill`, `evaluate-skill`, and
`improve-skill`. They are intentionally hidden from normal suite installation
and are not represented in the global CLI listing.

Codex also provides six system Skills under `.codex/skills/.system` and several
plugin-provided Skills. They are host capabilities, not part of this cutover.
Never remove or replace them through this plan.

The Prosto suite currently has no Stable Skills. Its three Experimental Skills
develop and evaluate Skills; they do not replace day-to-day product-delivery
capabilities.

## Core boundary

Repository Core currently tells agents to:

- seek the user's actual outcome;
- inspect before asking and use evidence;
- select the smallest sufficient Skill composition;
- give deterministic work to tools;
- make the smallest correct change;
- prove the outcome in proportion to risk;
- challenge requests only when disagreement changes the outcome;
- stop when the outcome is proven.

Core is repository steering, not an installable Skill. It can eliminate some
generic Skills only after a behavior trial shows the host follows Core without
them. It cannot replace specialist knowledge or reusable judgment merely by
stating broad principles.

## Registry findings

The global registry and filesystem do not agree:

- `.agents/.skill-lock.json` contains 66 records;
- `.agents/skills` contains 58 directories;
- 11 registry records have no installed directory;
- 3 installed Prosto Experimental Skills have no registry record.

The 11 stale records are:

- `ask-matt`;
- `caveman-review`;
- `diagnosing-bugs`;
- `grill-me`;
- `grill-with-docs`;
- `implement`;
- `implement-spec`;
- `prosto-contract`;
- `prosto-implement`;
- `prosto-shape`;
- `prosto-write`.

The last four refer to Prosto Skills removed by the current architecture. The
three current Experimental directories match the repository checkout exactly.
Local Experimental installation may remain unregistered during development,
but a Stable cutover must use one reproducible source and provenance path.

The agent-specific Claude Skill at `.claude/skills/codebase-memory` also has
invalid YAML frontmatter and is skipped by the Skills CLI. Repair or remove it
as a separate host-maintenance task; it is outside the shared Skill cutover.

## Disposition vocabulary

- **Core trial**: test whether Core and native host behavior make the Skill
  unnecessary. Do not write a replacement first.
- **Replace**: recurring agent judgment likely needs a first-party Skill before
  removal. The name below is not an approved new Skill name.
- **Retain**: specialist or vendor knowledge is cheaper and safer to keep until
  evidence supports owning it.
- **Drop candidate**: no first-party replacement is expected. Confirm absence of
  real use before removal.
- **Review**: usage or ownership evidence is insufficient for a decision.

Every disposition is provisional until supported by completed-task evidence.
No task-history or telemetry evidence was inspected for this snapshot.

## Migration ledger

### JuliusBrussee/caveman

| Skill | Provisional disposition | Reason or candidate outcome |
| --- | --- | --- |
| `cavecrew` | Drop candidate | Native delegation plus Core should own selection; verify any compressed-agent requirement first. |
| `caveman` | Review | Communication style belongs in steering unless repeated judgment proves a Skill useful. This repository currently invokes it. |
| `caveman-commit` | Replace | Commit-message judgment may become a small first-party capability or steering rule. Current Codex instructions invoke it. |
| `caveman-compress` | Drop candidate | Deterministic compression and backup handling should be a tool unless judgment evidence says otherwise. |
| `caveman-discover` | Drop candidate | Caveman Cloud product integration is outside the Prosto Core. |
| `caveman-evidence-review` | Drop candidate | Caveman Cloud product integration is outside the Prosto Core. |
| `caveman-explore` | Core trial | Core already prefers direct evidence and deterministic discovery tools. |
| `caveman-help` | Drop candidate | Help for the removed Caveman suite needs no replacement. |
| `caveman-learn` | Drop candidate | Overlaps explicit, evidence-backed `improve-skill`; product-specific parts remain out of scope. |
| `caveman-manage` | Drop candidate | Caveman Cloud product integration is outside the Prosto Core. |
| `caveman-optimize` | Drop candidate | Caveman Cloud product integration is outside the Prosto Core. |
| `caveman-setup` | Drop candidate | Caveman Cloud product integration is outside the Prosto Core. |
| `caveman-stats` | Drop candidate | Caveman session statistics need no replacement unless still used. |
| `investigate-first` | Replace | Diagnose an ambiguous failure and name a credible mechanism before editing. |
| `lean-build` | Replace | Deliver a bounded feature without speculative infrastructure. |
| `migration` | Replace | Preserve compatibility and rollback during a transition. |
| `safe-refactor` | Replace | Preserve behavior while changing structure. |
| `surgical-patch` | Replace | Fix a known bug at the narrowest responsible layer with regression proof. |
| `verify-and-stop` | Core trial | Proportional proof and stopping already belong to Core; test host behavior before retaining a separate Skill. |

### mattpocock/skills

| Skill | Provisional disposition | Reason or candidate outcome |
| --- | --- | --- |
| `claude-handoff` | Review | Claude-specific continuation may be a host adapter, not a portable Skill. |
| `code-review` | Replace | Review against repository standards and originating specification. |
| `codebase-design` | Replace | Decide module boundaries and deepen interfaces. |
| `domain-modeling` | Replace | Establish shared domain language and durable decisions. |
| `git-guardrails-claude-code` | Retain | Host-specific safety setup should remain until an equivalent adapter or tool exists. |
| `grilling` | Replace | Stress-test a user-selected plan or decision without taking ownership from the user. |
| `handoff` | Core trial | Native task continuation may make a handoff Skill unnecessary. |
| `improve-codebase-architecture` | Drop candidate | Prefer composition of independent design, inspection, and discussion capabilities. |
| `loop-me` | Drop candidate | Workspace-specific orchestration should not become a generic replacement. |
| `migrate-to-shoehorn` | Retain | Narrow third-party migration knowledge. |
| `prototype` | Replace | Build a disposable artifact that answers one design question. |
| `research` | Replace | Gather authoritative evidence and preserve concise findings. |
| `resolving-merge-conflicts` | Retain | Specialist Git procedure; revisit after observing repeated gaps. |
| `retro` | Review | Retrospection should remain outside product delivery and requires concrete recurring value. |
| `scaffold-exercises` | Retain | Domain-specific course tooling. |
| `setup-matt-pocock-skills` | Drop candidate | Source-suite bootstrap becomes obsolete after cutover. |
| `setup-pre-commit` | Retain | Narrow ecosystem setup that can later move to a deterministic tool. |
| `setup-ts-deep-modules` | Retain | TypeScript-specific architecture setup. |
| `tdd` | Review | Test-first sequencing may be a user preference, a composition modifier, or a Skill; evidence must decide. |
| `teach` | Review | Broad outcome and explicit invocation need evidence before first-party ownership. |
| `to-questionnaire` | Core trial | Core can ask only material unresolved questions; external sharing needs usage evidence. |
| `to-spec` | Review | Specification synthesis may deserve a first-party Skill if repeated product evidence exists. |
| `to-tickets` | Review | Tracker mutation and work decomposition cross ownership boundaries; inspect actual use first. |
| `triage` | Retain | Tracker-specific state and external mutation require deliberate compatibility evidence. |
| `wait-what` | Drop candidate | Conversational rephrasing needs no persistent Skill. |
| `wayfinder` | Drop candidate | Large-work orchestration conflicts with native atomic composition unless repeated evidence proves a Flow. |
| `wizard` | Retain | Useful boundary for human-only infrastructure steps; consider first-party ownership after usage review. |
| `writing-beats` | Review | Keep only if long-form writing is a recurring supported outcome. |
| `writing-for-agents` | Replace | Write concise steering and agent-facing documents without duplicating Core. |
| `writing-fragments` | Review | Keep only if long-form writing is a recurring supported outcome. |
| `writing-great-skills` | Drop candidate | `write-skill` should own Skill-writing judgment after behavior comparison. |
| `writing-shape` | Review | Keep only if long-form writing is a recurring supported outcome. |

### shadcn/ui

| Skill | Provisional disposition | Reason or candidate outcome |
| --- | --- | --- |
| `migrate-radix-to-base` | Retain | Library-specific migration knowledge changes with upstream packages. |
| `shadcn` | Retain | Vendor-maintained component knowledge should not be copied without a concrete ownership reason. |

### Vercel

| Skill | Provisional disposition | Reason or candidate outcome |
| --- | --- | --- |
| `find-skills` | Drop candidate | External discovery becomes unnecessary when the selected suite is intentionally owned. |
| `web-design-guidelines` | Retain | Specialist guidance changes over time; first-party ownership would require an update policy. |

### Local

| Skill | Provisional disposition | Reason or candidate outcome |
| --- | --- | --- |
| `frontend-design` | Review | Upstream provenance is unknown; identify ownership and observed use before deciding. |

## First replacement wave

Do not reproduce source Skills verbatim. Start only from completed-task evidence
for these candidate outcomes:

1. Diagnose an ambiguous bug before editing.
2. Fix a known bug narrowly with regression proof.
3. Build a bounded feature without speculative infrastructure.
4. Refactor while preserving behavior.
5. Execute a compatibility-safe migration with rollback.
6. Review changes against repository standards and the originating request.

Treat verification as a Core trial first. If agents repeatedly stop without
adequate proof, that failure becomes evidence for a separate Skill.

## Registry repair plan

1. Save the current CLI listing and `.agents/.skill-lock.json` outside the
   repository as rollback evidence.
2. Remove only the 11 stale registry records through the Skills CLI. Do not
   delete directories manually.
3. Re-run global listing and compare registered names with installed
   directories. Account explicitly for local Experimental copies.
4. Repair the invalid Claude Skill separately.
5. Keep installing Experimental Prosto Skills from the checkout only for local
   evaluation. After Promotion, install Stable Skills from one repository or
   release reference so provenance and updates are reproducible.

Registry repair is complete when no registry record points to a missing Skill,
every installed third-party Skill has known provenance, and local Experimental
exceptions are documented.

## Cutover sequence

1. Add completed-task evidence to this ledger without committing raw sessions.
2. Confirm **Core trial**, **Replace**, **Retain**, or **Drop** for every Skill.
3. Develop each approved first-party replacement under `skills/.experimental/`.
4. Pass deterministic gates and required behavior evaluations.
5. Promote a minimum viable Stable suite with Maintainer approval.
6. Install that suite alongside retained specialist Skills in an isolated trial.
7. Remove third-party Skills by source-sized batches, verifying representative
   tasks after each batch.
8. Remove temporary rollback material only after the global installation remains
   stable through normal work.

Stop the cutover if a removed Skill owns a still-used outcome, a replacement
fails compatibility evidence, the registry cannot reproduce the installed
state, or rollback evidence is missing.

## Completion criteria

The migration is complete only when:

- every former global Skill has an evidence-backed disposition;
- every required replacement is Stable and passes its Quality Gate;
- retained specialist Skills have explicit ownership reasons;
- Core behavior has been tested without redundant Skills;
- global installation can be reproduced from recorded sources;
- system and plugin-provided Skills remain untouched;
- representative product work succeeds after cutover;
- rollback has been tested before its temporary artifacts are discarded.
