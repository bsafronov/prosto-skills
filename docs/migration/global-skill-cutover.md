# Global Skill Cutover

This document records the evidence and stop conditions for replacing the current
global third-party Skill installation with the Prosto Skill Suite. It is a
migration ledger, not authorization to remove installed Skills.

## Current state

Snapshot date: 2026-09-05.

The baseline Skills CLI listing reported 56 global Skills:

- 32 from `mattpocock/skills`;
- 19 from `JuliusBrussee/caveman`;
- 2 from `shadcn/ui`;
- 1 from `vercel-labs/skills`;
- 1 from `vercel-labs/agent-skills`;
- 1 local Skill, `frontend-design`, with no recorded upstream source.

After the first approved prune, 45 global Skills remain: 32 Matt Pocock, 8
Caveman, 2 shadcn, 2 Vercel, and 1 local Skill.

The shared installation directory also contains exact copies of the four
current Prosto Experimental Skills: `write-skill`, `evaluate-skill`,
`improve-skill`, and `review-requirements`. They are intentionally hidden from
normal suite installation and are not represented in the global CLI listing.

Codex also provides six system Skills under `.codex/skills/.system` and several
plugin-provided Skills. They are host capabilities, not part of this cutover.
Never remove or replace them through this plan.

The Prosto suite currently has no Stable Skills. Three Experimental Skills
develop and evaluate Skills. `review-requirements` and `write-commit-message`
are Experimental product-delivery capabilities. The latter is repository-only;
the four global Experimental copies listed above are unchanged.

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
exact registry backup. The first approved prune then removed 11 installed
Caveman helper Skills after a second backup. The current state is:

- 44 registry records;
- 48 shared Skill directories;
- no registry record without a directory;
- exactly 4 documented directory-only exceptions: `write-skill`,
  `evaluate-skill`, `improve-skill`, and `review-requirements`.

The Skills CLI reports 45 global Skills because it also discovers the
Codex-local `frontend-design` Skill. Registry repair removed no installed Skill
directory; the later prune removed only its 11 approved targets.

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
- **Removed**: approved removal completed with a recoverable backup.

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
| `cavecrew` | Removed | Removed 2026-09-05 after no explicit usage signal and a recoverable backup. |
| `caveman` | Core trial | Owned global steering replaced the external invocation on 2026-09-05. Keep the Skill installed until normal-task behavior proves the thin rule sufficient. |
| `caveman-commit` | Replace | Experimental `write-commit-message` owns commit wording; Core keeps general brevity. The third-party Skill and current Codex invocation remain until approved cutover. |
| `caveman-compress` | Removed | Removed 2026-09-05 after one explicit signal and a recoverable backup. |
| `caveman-discover` | Removed | Removed 2026-09-05; Caveman Cloud integration is outside Prosto Core. |
| `caveman-evidence-review` | Removed | Removed 2026-09-05; Caveman Cloud integration is outside Prosto Core. |
| `caveman-explore` | Removed | Removed 2026-09-05; Core and deterministic discovery tools own the behavior. |
| `caveman-help` | Removed | Removed 2026-09-05 after one explicit signal and a recoverable backup. |
| `caveman-learn` | Removed | Removed 2026-09-05; overlaps evidence-backed `improve-skill`. |
| `caveman-manage` | Removed | Removed 2026-09-05; Caveman Cloud integration is outside Prosto Core. |
| `caveman-optimize` | Removed | Removed 2026-09-05; Caveman Cloud integration is outside Prosto Core. |
| `caveman-setup` | Removed | Removed 2026-09-05; Caveman Cloud integration is outside Prosto Core. |
| `caveman-stats` | Removed | Removed 2026-09-05; session statistics need no replacement. |
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
| `code-review` | Replace | Split into the host's defect review and Experimental `review-requirements`; keep installed until composition evidence passes. |
| `codebase-design` | Replace | Decide module boundaries and deepen interfaces. |
| `domain-modeling` | Replace | Experimental `model-domain` establishes shared domain language and consequential domain decisions; keep the third-party Skill until cutover evidence passes. |
| `git-guardrails-claude-code` | Retain | Host-specific safety setup should remain until an equivalent adapter or tool exists. |
| `grilling` | Replace | Experimental `challenge-plan` tests consequential assumptions in a user-selected plan; keep the third-party Skill until cutover evidence passes. |
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
| `tdd` | Replace | Experimental `implement-test-first` owns requested red–green sequencing; keep the third-party Skill until cutover evidence passes. |
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

Do not reproduce source Skills verbatim. Reference frequency and the user's
current usage set this order. On 2026-09-06, the user confirmed frequent use of
`domain-modeling`, `tdd`, `grilling`, `to-spec`, `to-tickets`, and `wait-what`,
and less recent use of `wayfinder`. This current usage takes precedence over
historical invocation counts, placing `wayfinder` last in the first wave:

1. Move concise response behavior from `caveman` into owned steering, not a
   replacement Skill, unless behavior evaluation proves steering insufficient.
   **Completed 2026-09-05; behavior trial pending.**
2. Write a concise Conventional Commit message from change intent. **Experimental
   `write-commit-message` created 2026-09-06; see the bounded trial below.**
3. Review implementation against its originating requirements. **Experimental
   `review-requirements` created and installed for trials 2026-09-05. Its four
   isolated artificial scenarios pass hard behavior and presentation quality
   5/5 on Codex CLI 0.153.4 with `gpt-5.6-sol`. A one-run OpenCode 1.18.21
   compatibility check also passes with that model. These are pre-commit checks;
   clean-revision reports are recorded separately. Claude Code and Cursor
   Promotion evidence remains pending.**
4. Build or revise a domain model and its durable terminology. **Experimental
   `model-domain` created 2026-09-06; see the domain modeling trial below.**
5. Apply test-first sequencing when explicitly requested. **Experimental
   `implement-test-first` created 2026-09-06; see the test-first trial below.**
6. Stress-test a user-owned plan or decision. **Experimental `challenge-plan`
   created 2026-09-06; see the plan critique trial below.**
7. Synthesize an agreed specification and decompose it into bounded work while
   keeping tracker mutation explicit.
8. Re-pitch an explanation when the user says it did not land.
9. Plan work too large for one task using independent decisions rather than an
   orchestration engine.

Retain `frontend-design`, `shadcn`, and other used specialist Skills through the
first wave. Lower-frequency engineering outcomes such as bug diagnosis, narrow
fixes, feature building, refactoring, and migration remain valid candidates but
do not outrank the observed cutover blockers. Treat verification as a Core trial
first. If agents repeatedly stop without adequate proof, that failure becomes
evidence for a separate Skill.

## Commit wording trial

On 2026-09-06, `write-commit-message` became the next bounded Experimental
candidate. The 61 user invocations across 140 sessions support recurring demand;
they do not prove the replacement's Effectiveness.

General brevity stays in steering. Selecting a Conventional Commit type from
behavior, respecting the intended diff, preserving compatibility and security
context, and deciding whether an issue is resolved are conditional commit
judgments. Loading them for every task would thicken Core. Git commands remain
host operations and do not need another Skill.

The owned outcome is one accurate, concise message. Its nearest boundaries are
release notes, PR descriptions, and Git operations without message drafting.
The seven artificial cases cover staged scope, release-note rejection, composition
with authorized Git operations, breaking migration, security context and required
trailers, missing change evidence, and behavior-preserving refactoring.

No `write-commit-message` name collision was found in the shared, Codex, Claude,
Cursor, or OpenCode installation directories. It remains repository-only;
neither global steering nor third-party installations changed. Experimental
additions have no Stable release impact and require no Changeset.

The existing runner now checks required and forbidden wording patterns in the
reported message, in addition to selection and workspace immutability. These
assertions check specific fixture facts, not general semantic correctness.
The isolated runs receive the candidate text directly; normal host discovery
and ordinary-task usefulness remain trial obligations.

Initial trials exposed overly narrow checks for rejection status, duplicate-charge
wording, and issue-reference format. The cases now accept equivalent behavior
without permitting issue closure. OpenCode also emitted progress text before its
JSON report; the parser now accepts a valid final report while rejecting stale
or incomplete reports. A later OpenCode run omitted the supplied issue ID; the
Skill now explicitly retains IDs even for partially addressed issues.

Local acceptance evidence covers all seven cases: Codex CLI 0.153.4 with
`gpt-5.6-sol` has hard behavior and presentation 5/5 per case; OpenCode 1.18.21
with `openai/gpt-5.6-sol` has 1/1 per case. After each repair, affected cases
were rerun; unaffected evidence was reused. The final issue-ID clarification
was retested on the security case (Codex 5/5, OpenCode 1/1), not a fresh full-suite
sweep. All runs were pre-commit. Node 24 checks pass, including 16 deterministic
tests and normal/internal installation smoke checks. These local results do not
constitute Promotion evidence from all required harnesses.

Claude Code and Cursor compatibility work was explicitly deferred by the user.
This applies to the cutover work; do not restart sign-in flows. The prior
`review-requirements` clean-revision handoff records Codex 20/20, OpenCode 4/4,
and deterministic tests 13/13 at `4d8708da3139f90ac197fa8f60e1b9e1e7d2fc55`.
Both product Skills remain Experimental under the unchanged Promotion policy.

## Domain modeling trial

On 2026-09-06, `model-domain` became the next Experimental replacement, following
the user's current usage priority. Historical evidence includes four explicit
invocations and 66 assistant declarations across 57 sessions; this establishes
demand, not Effectiveness.

It owns resolving domain concepts, relationships, and shared terminology.
Reading a glossary, proofreading CONTEXT.md, or editing an implementation-only
ADR does not select it. Consequential domain decisions may be recorded in an
ADR; general architecture decisions remain outside its boundary. It preserves
context-specific meanings and distinguishes current code from intended rules.

Seven artificial cases cover identity distinctions, glossary-reading rejection,
technical-ADR rejection, unresolved product/implementation conflicts, separate
contexts, an accepted ownership decision, and independent defect-review
composition. The existing read-only runner evaluates returned drafts and
selection; it does not prove document editing or normal host discovery.

Initial OpenCode trials passed five cases. A diagnostic draft preserved context
boundaries using “independently”; the assertion now accepts that equivalent
wording. The ADR request now explicitly asks for the rejected alternative and
reason, aligning it with the case's required content. Both affected cases then
passed on OpenCode 1.18.21 with `openai/gpt-5.6-sol` (1/1 each); the other five
results were reused. The Skill instructions were unchanged during these repairs.

Codex repetition exposed further assertion limits: the identity case now accepts
either evidenced distinguishing scenario, and the context case checks roles and
lifecycle language rather than requiring a particular adjective. One ADR run
reported the third-party name instead of the candidate name. The evaluation
prompt now requests exact declared capability names; unknown names still fail.
Fresh full Codex and OpenCode trials cover this final evaluation contract.

Final local evidence: all seven cases pass hard behavior and presentation 5/5
on Codex CLI 0.153.4 with `gpt-5.6-sol` (35/35), and 1/1 on OpenCode 1.18.21
with `openai/gpt-5.6-sol` (7/7). Codex cases ran in separate scenario invocations
against the same final Skill and evaluation contract. Node 24 checks pass,
including 16 deterministic tests and normal/internal installation smoke checks.
These are pre-commit working-tree results at
`31f5ed1761fae1786f69f1caec9dd9db7bf308ac+dirty`, not clean-revision Promotion
evidence. Aggregate reports remain outside the repository; raw sessions are
not retained.

No `model-domain` collision was found in the shared, Codex, Claude, Cursor, or
OpenCode Skill directories. The candidate remains repository-only. Third-party
installations and global steering are unchanged. There is no Stable release
impact or Changeset. Claude Code and Cursor trials remain deferred under the
existing user instruction; Promotion and global cutover remain separate.

## Test-first trial

On 2026-09-06, `implement-test-first` became the next Experimental replacement.
The user confirmed frequent current use; historical evidence records 13 explicit
invocations and 45 assistant declarations across 52 sessions.

The Skill owns explicitly requested test-first implementation. Integration-test
requests, ordinary feature work, and final verification alone do not select it.
It reuses an evidenced public test boundary without repeated approval, checks
that red comes from the intended behavior, and completes one minimal green
slice before adding another. It permits useful local refactoring from green
without requiring a review Skill. Independent expectations and controlled
external boundaries keep tests sensitive to the actual contract.

Nine read-only artificial cases cover selection, two rejection boundaries,
runner failure, unexpected green, minimal implementation after meaningful red,
an independent test oracle, refactoring from green, and independent review
composition. Action-choice cases check the next decision, not the model's
ability to execute it. A separate instrumented local exercise checks an actual
shipping-fee red–green cycle and verifies the final tests against both the
original and updated implementation.

The writable Codex CLI 0.153.4 exercise with `gpt-5.6-sol` passed once: an
existing below-threshold shipping test passed; the new free-shipping test failed
with production unchanged; a one-line threshold implementation passed the same
tests. Instrumentation was unchanged. Independent checks confirmed that the
final tests reject the original implementation and that six values below, at,
and above the threshold return the required fee. Only the two requested source
and test files changed. This single execution trial supplements decision cases;
it does not establish repeated execution or cross-host editing compatibility.

All nine decision and selection cases pass hard behavior and presentation 5/5
on Codex CLI 0.153.4 with `gpt-5.6-sol` (45/45), and 1/1 on OpenCode 1.18.21
with `openai/gpt-5.6-sol` (9/9). No case or Skill repairs were needed. Node 24
checks pass, including 16 deterministic tests and normal/internal installation
smoke checks. These are pre-commit working-tree results at
`52687cb95db3c9ae8cf75860e7138d07d8b822b5+dirty`, not clean-revision Promotion
evidence. Aggregate reports remain outside the repository; the temporary
execution fixture and raw output were deleted after verification.

No `implement-test-first` name collision was found in the shared, Codex, Claude,
Cursor, or OpenCode Skill directories. It remains repository-only, with no
Stable release impact or Changeset. Existing third-party installations and
global steering remain unchanged. Claude Code and Cursor compatibility work
remains deferred under the existing user instruction; Promotion and cutover
remain separate.

## Plan critique trial

On 2026-09-06, `challenge-plan` became the next Experimental replacement.
The user confirmed frequent current use of `grilling`; historical evidence
records five explicit invocations and 53 assistant declarations across 51
sessions.

It owns a requested critique of a user-selected plan, decision, or idea. Ordinary
implementation and defect-only review do not select it. It checks available
facts, prioritizes consequential assumptions, asks prerequisite decisions before
dependent questions, and updates its critique when evidence changes. Supported
choices need no invented objections. It stops at the requested scope or the
user's stop request instead of requiring an exhaustive design tree. Critique
alone authorizes no implementation; separately authorized follow-up work needs
no extra confirmation to close the discussion.

Nine artificial cases cover a question grounded in actual capacity files,
implementation and defect-review rejection, retrieving facts, dependent
decisions, revised evidence, respecting a stop request, a supported plan, and
independent defect-review composition. The read-only runner checks one generated
question and choices at supplied conversation states. These trials do not prove
live multi-round adaptation or ordinary host discovery.

All nine cases pass hard behavior and presentation 5/5 on Codex CLI 0.153.4
with `gpt-5.6-sol` (45/45), and 1/1 on OpenCode 1.18.21 with
`openai/gpt-5.6-sol` (9/9). The generated-question case additionally rejects
multiple question marks to check the requested one-question budget; that case
was rerun on both hosts after adding the assertion, with the other eight results
reused. The Skill instructions needed no repairs. Node 24 checks pass, including
16 deterministic tests and normal/internal installation smoke checks.
These are pre-commit working-tree results at
`d253c5a0f52c56d8b3941c51a578188a5954135b+dirty`, not clean-revision Promotion
evidence. Aggregate reports remain outside the repository; raw sessions are
not retained.

No `challenge-plan` name collision was found in the shared, Codex, Claude,
Cursor, or OpenCode Skill directories. It remains repository-only with no Stable
release impact or Changeset. Third-party installations and global steering
remain unchanged. Claude Code and Cursor compatibility work remains deferred
under the existing user instruction; Promotion and cutover remain separate.

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
