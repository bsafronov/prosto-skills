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

Before repair, the global registry and filesystem did not agree:

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

The stale records were removed through the Skills CLI on 2026-09-05 after an
exact registry backup. The repaired state is:

- 55 registry records;
- 58 shared Skill directories;
- no registry record without a directory;
- exactly 3 documented directory-only exceptions: `write-skill`,
  `evaluate-skill`, and `improve-skill`.

The Skills CLI still reports 56 global Skills because it also discovers the
Codex-local `frontend-design` Skill. No installed Skill directory was removed
during registry repair.

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

## Usage evidence

A local scan covered 1,641 Codex session files and 37,750 user or assistant
messages. Injected `AGENTS.md`, environment, app, permission, and plugin context
was excluded. The scan counted two explicit signals:

- a user message invoking `$skill-name`;
- a short assistant message declaring use of `` `skill-name` `` or
  `$skill-name`.

The counts are reference-frequency evidence, not proof that a Skill produced a
successful outcome. Forked tasks, repeated mentions, and assistant declarations
can increase counts. Absence means no matching explicit signal, not proof that
the capability was unused. Raw task content was not retained.

| Skill | User invocations | Assistant declarations | Sessions |
| --- | ---: | ---: | ---: |
| `caveman` | 34 | 345 | 270 |
| `caveman-commit` | 61 | 131 | 140 |
| `code-review` | 26 | 101 | 108 |
| `wayfinder` | 105 | 18 | 94 |
| `domain-modeling` | 4 | 66 | 57 |
| `tdd` | 13 | 45 | 52 |
| `grilling` | 5 | 53 | 51 |
| `to-spec` | 48 | 25 | 45 |
| `to-tickets` | 44 | 22 | 40 |
| `wait-what` | 46 | 18 | 34 |
| `frontend-design` | 17 | 21 | 30 |
| `shadcn` | 15 | 23 | 27 |
| `codebase-design` | 6 | 23 | 25 |
| `setup-matt-pocock-skills` | 22 | 6 | 21 |
| `research` | 21 | 6 | 21 |
| `handoff` | 37 | 6 | 19 |
| `prototype` | 23 | 13 | 14 |
| `writing-for-agents` | 1 | 14 | 12 |
| `triage` | 0 | 10 | 10 |
| `resolving-merge-conflicts` | 3 | 8 | 9 |
| `web-design-guidelines` | 5 | 1 | 4 |
| `lean-build` | 0 | 4 | 4 |
| `surgical-patch` | 0 | 7 | 4 |
| `setup-ts-deep-modules` | 3 | 2 | 3 |
| `migration` | 0 | 5 | 3 |
| `writing-great-skills` | 3 | 0 | 2 |
| `wizard` | 1 | 2 | 2 |
| `caveman-compress` | 1 | 0 | 1 |
| `caveman-help` | 1 | 1 | 1 |
| `migrate-radix-to-base` | 1 | 1 | 1 |
| `teach` | 1 | 0 | 1 |
| `improve-codebase-architecture` | 0 | 1 | 1 |
| `investigate-first` | 0 | 1 | 1 |

No explicit signal was found for 23 globally listed Skills:

- `cavecrew`;
- `caveman-discover`;
- `caveman-evidence-review`;
- `caveman-explore`;
- `caveman-learn`;
- `caveman-manage`;
- `caveman-optimize`;
- `caveman-setup`;
- `caveman-stats`;
- `claude-handoff`;
- `find-skills`;
- `git-guardrails-claude-code`;
- `loop-me`;
- `migrate-to-shoehorn`;
- `retro`;
- `safe-refactor`;
- `scaffold-exercises`;
- `setup-pre-commit`;
- `to-questionnaire`;
- `verify-and-stop`;
- `writing-beats`;
- `writing-fragments`;
- `writing-shape`.

## Migration ledger

### JuliusBrussee/caveman

| Skill | Provisional disposition | Reason or candidate outcome |
| --- | --- | --- |
| `cavecrew` | Drop candidate | Native delegation plus Core should own selection; verify any compressed-agent requirement first. |
| `caveman` | Replace | Strong usage evidence makes communication behavior a cutover blocker, but it should move to owned steering unless repeated judgment proves a Skill useful. |
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
| `handoff` | Review | Frequent explicit use blocks removal until native task continuation is compared against the owned outcome. |
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
| `tdd` | Replace | Frequent use supports owning test-first sequencing while keeping it independent from feature or bug-fix Skills. |
| `teach` | Review | Broad outcome and explicit invocation need evidence before first-party ownership. |
| `to-questionnaire` | Core trial | Core can ask only material unresolved questions; external sharing needs usage evidence. |
| `to-spec` | Replace | Frequent explicit use supports owning specification synthesis without tracker mutation by default. |
| `to-tickets` | Replace | Frequent explicit use supports owning work decomposition; tracker mutation remains an explicit boundary. |
| `triage` | Retain | Tracker-specific state and external mutation require deliberate compatibility evidence. |
| `wait-what` | Replace | Frequent explicit use supports a small user-invoked capability for re-pitching an explanation. |
| `wayfinder` | Replace | Strong usage evidence blocks deletion, but replacement should extract atomic planning judgment instead of copying orchestration. |
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
| `frontend-design` | Retain | Frequent use blocks removal; identify upstream provenance before deciding whether to own an equivalent. |

## Evidence-ranked first replacement wave

Do not reproduce source Skills verbatim. Reference frequency makes these the
current cutover blockers:

1. Move concise response behavior from `caveman` into owned steering, not a
   replacement Skill, unless behavior evaluation proves steering insufficient.
2. Write a concise Conventional Commit message from change intent.
3. Review changes against repository standards and the originating request.
4. Plan work too large for one task using independent decisions rather than an
   orchestration engine.
5. Build or revise a domain model and its durable terminology.
6. Apply test-first sequencing when explicitly requested.
7. Stress-test a user-owned plan or decision.
8. Synthesize an agreed specification and decompose it into bounded work while
   keeping tracker mutation explicit.
9. Re-pitch an explanation when the user says it did not land.

Retain `frontend-design`, `shadcn`, and other used specialist Skills through the
first wave. Lower-frequency engineering outcomes such as bug diagnosis, narrow
fixes, feature building, refactoring, and migration remain valid candidates but
do not outrank the observed cutover blockers. Treat verification as a Core trial
first. If agents repeatedly stop without adequate proof, that failure becomes
evidence for a separate Skill.

## Registry repair plan

1. Save the current CLI listing and `.agents/.skill-lock.json` outside the
   repository as rollback evidence. **Completed 2026-09-05.**
2. Remove only the 11 stale registry records through the Skills CLI. Do not
   delete directories manually. **Completed 2026-09-05.**
3. Re-run global listing and compare registered names with installed
   directories. Account explicitly for local Experimental copies. **Completed
   2026-09-05.**
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
