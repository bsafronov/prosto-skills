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
| `codebase-design` | Replace | Experimental `design-interface` designs caller contracts and responsibility boundaries; retain the third-party Skill until compatibility, representative-task, and cutover evidence passes. |
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
| `to-spec` | Replace | Experimental `write-spec` owns grounded specification synthesis without tracker mutation by default; keep the third-party Skill until cutover evidence passes. |
| `to-tickets` | Replace | Experimental `split-work` owns bounded work decomposition and genuine blockers; keep the third-party Skill until cutover evidence passes. |
| `triage` | Retain | Tracker-specific state and external mutation require deliberate compatibility evidence. |
| `wait-what` | Replace | Experimental `reframe-explanation` repairs a previous explanation after expressed confusion; keep the third-party Skill until cutover evidence passes. |
| `wayfinder` | Replace | Experimental `map-decisions` owns resumable uncertainty and decision dependencies; Core, existing Skills, and native tools cover the remaining outcomes. Keep the third-party Skill until cutover evidence passes. |
| `wizard` | Retain | Useful boundary for human-only infrastructure steps; consider first-party ownership after usage review. |
| `writing-beats` | Review | Keep only if long-form writing is a recurring supported outcome. |
| `writing-for-agents` | Replace | Experimental `write-agent-guidance` owns repository instruction delivery; `write-skill` owns Skill authoring and Core keeps general mindset. Keep the third-party Skill until cutover evidence passes. |
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
   keeping tracker mutation explicit. **Experimental `write-spec` created
   2026-09-06 and `split-work` created 2026-09-07; see their trials below.**
8. Re-pitch an explanation when the user says it did not land. **Experimental
   `reframe-explanation` created 2026-09-07; see the re-explanation trial below.**
9. Plan work too large for one task using independent decisions rather than an
   orchestration engine. **Experimental `map-decisions` created 2026-09-07; see
   the decision mapping trial below.**

Retain `frontend-design`, `shadcn`, and other used specialist Skills through the
first wave. Lower-frequency engineering outcomes such as bug diagnosis, narrow
fixes, feature building, refactoring, and migration remain valid candidates but
do not outrank the observed cutover blockers. Treat verification as a Core trial
first. If agents repeatedly stop without adequate proof, that failure becomes
evidence for a separate Skill.

## Working queue after the first wave

This is the coordinating task's recommended development order, not a new
user-reported usage ranking. Real-case testing of the first wave runs separately.

1. `writing-for-agents`: Experimental `write-agent-guidance` created 2026-09-07.
   It comes first because it supports current Skill authoring work; Skill authoring
   itself stays in `write-skill`. See the agent guidance trial below.
2. `codebase-design`: Experimental `design-interface` created 2026-09-07.
   It owns code contracts and responsibility boundaries; see the interface design trial below.
3. `research`: gather authoritative evidence and preserve concise findings.
4. `prototype`: build a disposable artifact that answers one design question.

The first two candidates have repository-only implementations. The documented engineering
candidates—bug diagnosis, narrow fixes, feature building, refactoring, and
migration—remain for later consideration; verification remains a Core trial.

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

## Specification trial

On 2026-09-06, `write-spec` became the next Experimental replacement.
The user confirmed frequent current use of `to-spec`; historical evidence
records 48 explicit invocations and 25 assistant declarations across 45 sessions.

It owns synthesis or revision of a feature specification from existing
agreement and relevant evidence. The model-invoked description requires a
request for specification work; ordinary discussion, ticket decomposition,
publishing an unchanged document, and conformance review do not select it.
This differs from the third-party Skill's explicit-only Invocation Mode and
bundled tracker publication.

The replacement preserves agreed scope, observable acceptance, explicit
revisions, and unaffected requirements. It records contradictions as open
decisions instead of inventing agreement or claiming readiness. It can preserve
precise prototype contracts without treating them as production behavior.
Existing test-boundary decisions need no repeated approval. Publication,
labels, decomposition, and implementation remain separately authorized actions.

Ten artificial cases cover a generated CSV-export specification, decomposition
and conformance-review rejection, conflicting decisions, explicit revisions,
implementation drift, draft-only scope, already-authorized publication,
prototype contracts, and independent defect-review composition. The read-only
runner checks the returned draft and decisions at supplied task states; it does
not prove document editing, tracker integration, or normal host discovery.

Initial trials exposed two evaluation-contract issues. Conformance review
correctly rejected `write-spec` but selected an alternate review capability; the
case now checks the candidate's rejection without judging the alternate review.
The draft assertion now accepts equivalent wording for an absent selection and
also checks the required visible message and absence of an output file. Both
affected cases were rerun on both hosts; the other eight results were reused.
The Skill instructions were unchanged during these repairs.

Final local results on 2026-09-07: all ten cases pass hard behavior and
presentation 5/5 on Codex CLI 0.153.4 with `gpt-5.6-sol` (50/50), and 1/1 on
OpenCode 1.18.21 with `openai/gpt-5.6-sol` (10/10). Node 24 checks pass,
including 16 deterministic tests and normal/internal installation smoke checks.
These are pre-commit working-tree results at
`b8d2c3798e44f398ca81dfc91828065da6c7497c+dirty`, not clean-revision Promotion
evidence. Aggregate reports remain outside the repository; raw sessions are
not retained.

No `write-spec` name collision was found in the shared, Codex, Claude, Cursor,
or OpenCode Skill directories. It remains repository-only with no Stable
release impact or Changeset. Existing third-party installations and global
steering remain unchanged. Claude Code and Cursor compatibility work remains
deferred under the existing user instruction; Promotion and cutover remain
separate.

## Work decomposition trial

On 2026-09-07, `split-work` became the next Experimental replacement.
The user confirmed frequent current use of `to-tickets`; historical evidence
records 44 explicit invocations and 22 assistant declarations across 40 sessions.

It owns bounded, verifiable work decomposition from agreed scope. The
model-invoked description requires a breakdown request; specification writing
alone, implementation, and tracker operations on an unchanged breakdown remain
outside its boundary. This differs from the third-party Skill's explicit-only
Invocation Mode and bundled publication.

The replacement prefers narrow complete behaviors, genuine prerequisites, and
source-linked acceptance. It avoids arbitrary layer tickets, invented blockers,
mandatory refactoring, and automatic readiness labels. Compatibility transitions
can use additive changes, bounded migrations, and evidence-gated removal; a
shared integration boundary must be explicit when pieces cannot land safely
alone. Small work can remain one task. Drafts need no tracker setup, fixed local
file layout, or blanket approval round. Publication uses existing authorization
and actual returned IDs without implying labels or parent-issue changes.

Eleven artificial cases cover a generated independent two-ticket breakdown,
specification and status-operation rejection, vertical slices, a blocker graph,
a bounded change, a compatibility transition, unresolved requirements,
draft-only scope, authorized publication, and composition with `write-spec`.
The composition case supplies the peer Skill's description explicitly. The
read-only runner checks a returned breakdown and choices at supplied task states;
it does not prove local file creation, tracker integration, or normal host
discovery.

Initial rejection trials exposed a result-format mismatch: models correctly
declined specification-only and status-only requests but reported
`not_applicable` where the cases expected `selection`. Those cases now assess
only the candidate and explicitly define the rejection result. The generated
breakdown also checks that exactly two ticket titles are returned. All three
affected cases were rerun on both hosts; the other eight results were reused.
The Skill instructions needed no repairs.

Final local results on 2026-09-07: all eleven cases pass hard behavior and
presentation 5/5 on Codex CLI 0.153.4 with `gpt-5.6-sol` (55/55), and 1/1 on
OpenCode 1.18.21 with `openai/gpt-5.6-sol` (11/11). Node 24 checks pass,
including 16 deterministic tests and normal/internal installation smoke checks.
These are pre-commit working-tree results at
`e7eb89eddbf2eebbef622692e0918e39651f18e3+dirty`, not clean-revision Promotion
evidence. Aggregate reports remain outside the repository; raw sessions are
not retained.

No `split-work` name collision was found in the shared, Codex, Claude, Cursor,
or OpenCode Skill directories. It remains repository-only with no Stable
release impact or Changeset. Existing third-party installations and global
steering remain unchanged. Claude Code and Cursor compatibility work remains
deferred under the existing user instruction; Promotion and cutover remain
separate.

## Re-explanation trial

On 2026-09-07, `reframe-explanation` became the next Experimental replacement.
The user confirmed frequent current use of `wait-what`; historical evidence
records 46 explicit invocations and 18 assistant declarations across 34 sessions.

It owns a replacement explanation after the user expresses confusion about a
previous answer. Its model-invoked description requires that signal; first
explanations, editing understood text, and disagreement seeking a new decision
remain outside its boundary. This differs from the third-party Skill's
explicit-only Invocation Mode. Plain product-language requests can select it
without requiring the user to remember its name.

The replacement recovers the missing connection, changes the explanatory
approach, and uses established domain terms without redefining them. It corrects
false prior claims and preserves uncertainty and the difference between current
behavior and proposals. Missing context warrants one focused question; known
confusion warrants an explanation. Completion is the delivered explanation,
not an unsupported claim that the user understands. It uses simple language
without claiming ASD-STE100 conformance or requiring a quiz, lesson, document
edit, or implementation.

Nine artificial cases cover a generated stock example using a mapped glossary,
a generated correction of a retry guarantee, first-explanation and editorial
rejection, a missing referent, an already-identified point of confusion,
completion without claimed understanding, a generated proposal clarification,
and independent composition with `model-domain`. The composition case supplies
the peer description. Read-only trials test generated explanations and choices
at supplied conversation states. Pattern assertions check selected facts and
limits; the presentation gate checks length. Neither proves human comprehension,
general prose quality, live multi-turn adaptation, or ordinary host discovery.

Initial stock-example trials exposed a brittle conclusion-phrase assertion.
Diagnostic runs on both hosts produced correct explanations that the assertion
rejected: “4 more orders, not 5” and an explanation that five orders would leave
one order without an item. Accepting the first wording still left Codex at 4/5.
The case now requests an explicit computed new-order limit alongside the free
explanation and checks that it is four. It retains the stock terms, arithmetic,
and remaining-quantity checks. Controlled answers with limits of five or seven
still fail. A further 4/5 Codex batch exposed a digit-only assertion: a diagnostic
answer correctly said “accepting five would promise eight.” Quantity assertions
now accept equivalent number words while rejecting incorrect quantities. This
output marker belongs only to the evaluation contract; the Skill instructions
needed no repair. The final affected case was rerun five times on Codex and once
on OpenCode; the other eight cases reuse their unchanged results.

Final local results on 2026-09-07: all nine cases pass hard behavior and
presentation 5/5 on Codex CLI 0.153.4 with `gpt-5.6-sol` (45/45), and 1/1 on
OpenCode 1.18.21 with `openai/gpt-5.6-sol` (9/9).

Node 24.20.0 checks pass, including 16 deterministic tests and normal/internal
installation smoke checks. Deterministic validation alone is not Effectiveness
evidence. These are pre-commit working-tree trials at
`36fcafba103069f2558038d2ec4fdbbc4017b29e+dirty`, not clean-revision Promotion
evidence. Aggregate reports and evaluated-input hashes remain outside the
repository; raw sessions are not retained.

No `reframe-explanation` name collision was found in the shared, Codex, Claude,
Cursor, or OpenCode Skill directories. The candidate remains repository-only,
with no Stable release impact or Changeset. Third-party installations and global
steering remain unchanged. Claude Code and Cursor compatibility work remains
explicitly deferred; Promotion and cutover remain separate.

The worktree and original checkout both started at
`36fcafba103069f2558038d2ec4fdbbc4017b29e`, already including `split-work` and its
ledger, README, and count changes. No prior work was copied or redone. This
candidate increases the actual baseline from ten Skills and 66 behavior cases
to eleven Skills and 75 cases.

## Decision mapping trial

On 2026-09-07, `map-decisions` became the final Experimental candidate in the
first replacement wave. The user reports less recent use of `wayfinder`;
historical evidence records 105 explicit invocations and 18 assistant declarations
across 94 sessions. This supports recurring demand for the source capability,
not Effectiveness or a demonstrated advantage over capable-agent defaults.

The clean worktree baseline was
`19039b8eb6ee20500b416f7b15ed62ad2196ae5c`, already including all preceding
replacements. The installed source at `.agents/skills/wayfinder/SKILL.md` was
inspected directly (SHA-256
`fee6e1d0c50f0e736b4ef8a599060c959afae904c9a97d82c97f049fcc3aa0f1`).
No completed replacement was copied or redone.

An independent evaluator, without access to the expected behavior cases,
identified the same atomic gap: distinguish supported decisions, precise but
possibly blocked questions, uncertainty too indistinct to specify, and exclusions;
revise that structure when new evidence changes the route. `write-spec` captures
agreement and its unresolved requirements. `split-work` decomposes agreed scope
into implementable units. `challenge-plan` critiques requested assumptions.
None owns the evolving decision map. Core supplies general judgment, while
native task, delegation, worktree, tracker, and status tools perform operations
without deciding how uncertainty changes the plan.

The owned outcome is a resumable map with justified prerequisites, evidence or
human choices needed to resolve each question, and a useful next decision or
explicit blocker. Scale alone does not select it. Specification synthesis,
settled implementation breakdowns, standalone critique, bounded decisions, and
unchanged task/status operations reject it. This model-invoked boundary differs
from the third-party Skill's explicit-only Invocation Mode. Mapping is selected
from the requested planning outcome, not an upstream Skill name.

The candidate reopens contradicted decisions and identifies affected downstream
answers, preserves unrelated agreement, turns newly precise uncertainty into
questions, and retires abandoned branches with reasons. It keeps recommendations
separate from human acceptance and does not duplicate work already in progress.
An empty question list cannot clear the route while consequential in-scope
uncertainty remains; an explicitly accepted risk need not be investigated forever.
Completing an accurate map update and reaching a clear route are distinct states.

The smallest sufficient Composition is `map-decisions` for this map, with
`challenge-plan` only for separately requested critique, `write-spec` for a spec,
and `split-work` for implementation decomposition after agreement. No durable
Flow is asserted. Wayfinder's tracker schema, labels, fixed ticket taxonomy,
mandatory peer invocations, automatic research agents, research branches, and
one-decision-per-session rule are not retained. Native tools handle authorized
persistence and coordination. A local draft requires no tracker setup.

Thirteen artificial scenarios cover a generated initial map, five rejection
boundaries, a generated update after contradictory evidence, newly precise
uncertainty, a pending human choice alongside independent work, unresolved areas
behind a closed question list, completion with an accepted risk, retired branches,
and independent critique composition. Peer descriptions are supplied explicitly
in selection cases. The runner checks generated excerpts and action choices;
pattern assertions test selected fixture facts and statuses, while the presentation
gate checks length. These are read-only, supplied-state trials. They do not prove
live tracker integration, concurrent editing, multi-task adaptation, normal host
discovery, or improved outcomes relative to a no-Skill baseline.

Independent read-only probes also revised an event-delivery map after a provider
guarantee changed and checked a continuation with implementation already
authorized. The first reopened affected decisions, preserved independent
agreement, and retained broad uncertainty without claiming the route clear.
The second would continue into the already-authorized implementation without
another confirmation. No blocking defect was observed in these two probes;
they are qualitative supplied-state evidence, not live execution or reference
harness repetition.

Initial generated-map trials exposed a mismatch between the free-text Next:
field and its assertion: Codex passed 0/5 and OpenCode 0/1 on the required ID
position. An OpenCode diagnostic correctly wrote “Resolve E1 by benchmarking
candidate regions” and put the 80 ms p95 threshold in the question rather than
repeating it in the evidence line. The evaluation now asks for just the next ID
and accepts the threshold within either part of the same question record. It
also checks p95 explicitly. Controlled answers with the wrong next question,
800 ms threshold, or missing prerequisite remain rejected. The Skill instructions
are unchanged; the affected case was rerun completely on both hosts.

The revised-map case also passed 0/5 on its initial Codex batch because the
Next: line did not match the required decision reference. Two separate diagnostic
runs returned the correct reassessment order and passed; the failed batch's raw
outputs were deleted by the runner, so their semantic correctness is unknown.
The request now explicitly asks for the existing decision ID to revisit before
dependent decisions, followed by its evidence action. Its assertions are unchanged.
Controlled drafts still reject a stale primary or dependent decision, false
completion, and the wrong next decision. This output-contract clarification
was retested in fresh affected-case runs on both hosts; it is not evidence of
a Skill repair.

Final local results: all thirteen cases pass hard behavior and presentation 5/5
on Codex CLI 0.153.4 with `gpt-5.6-sol` (65/65), and 1/1 on OpenCode 1.18.21
with `openai/gpt-5.6-sol` (13/13). Both generated-map cases were rerun on both
hosts after their output-contract repairs; the other eleven cases reuse their
unchanged results. The Skill instructions needed no repair.

Node 24.20.0 checks pass, including 16 deterministic tests and normal/internal
installation smoke checks. These are pre-commit working-tree trials at
`19039b8eb6ee20500b416f7b15ed62ad2196ae5c+dirty`, not clean-revision Promotion
evidence. Aggregate reports, initial failures, assertion controls, independent
assessment, and final input hashes remain outside the repository. Raw sessions
are not retained.

No `map-decisions` name collision was found in the shared, Codex, Claude,
Cursor, or OpenCode Skill directories. The candidate remains repository-only
and Experimental, with no Stable release impact or Changeset. Existing global
Skills and steering are unchanged. Claude Code and Cursor compatibility work
remains explicitly deferred; clean-revision Promotion evidence, Maintainer
approval, isolated installation trials, representative live tasks, and approved
global cutover remain separate work.

Actual files increase the baseline from eleven Skills and 75 behavior cases to
twelve Skills and 88 cases.

## Agent guidance trial

On 2026-09-07, `write-agent-guidance` became the first repository-only
Experimental candidate in the working queue after the first wave. Historical
usage records one explicit user invocation and 14 assistant declarations across
12 sessions for `writing-for-agents`. These are demand signals, not proof of
Effectiveness or an advantage over a capable agent without the Skill.

The worktree started clean at
`f06c9b43accc727fae70e5f25339fb0dc1516885`, including all twelve preceding
Experimental Skills. The installed source was inspected directly at
`.agents/skills/writing-for-agents/SKILL.md` (SHA-256
`551adca942227b44192edba88acd4e8db911f0121ce58ad16944ccf6a896a74a`), along with
its Skill mechanics reference, owned neighbors, Core, and relevant ADRs. No
completed replacement was copied or redone.

An independent read-only assessor, without access to the candidate draft or
expected cases, identified the same remaining outcome: repository instructions
whose obligations are reachable on the right task branch and whose completion
is checkable. Core supplies general evidence, composition, and stopping judgment.
`write-skill` already owns Skill selection contracts, bodies, and their references.
`model-domain` owns the meaning of terms. Neither owns the placement and delivery
of repository instructions through steering and referenced task guidance.

The new Skill preserves policy scope, exceptions, prerequisites, and approval
boundaries while editing guidance. It repairs weak Context Pointers before
copying conditional detail into always-loaded steering, keeps rules at one owner,
uses existing command/configuration sources, and sharpens vague completion bounds.
Conflicting policies remain explicit questions for their owner. Already coherent
guidance needs no manufactured split. Filename or agent readership alone does not
select it: Skill-only authoring, editorial edits, domain definitions, and ordinary
product work following guidance reject it. Composition with `write-skill` is useful
only when a separate repository-guidance outcome is also requested; no dependency
or durable Flow is introduced.

The source's broad agent-document boundary, router model, invocation claims,
blanket advice against negation, and claims about special leading words are not
retained. The owned Skill changes instruction delivery decisions without copying
source prose or adding universal Core behavior.

Ten artificial scenarios cover three generated-document outcomes (conditional
routing, preservation of release obligations and exceptions, and row-accounting
completion), unresolved policy conflict, already coherent guidance, four rejection
boundaries, and independent Skill-authoring composition. Neighbor descriptions
are supplied in selection cases. Generated-text assertions check selected source
facts, conditions, paths, and statuses; the quality gate checks length. Positive
and deliberately corrupted drafts exercise the assertions separately. These
read-only supplied-state trials do not prove normal host discovery, live global
steering behavior, or better outcomes than a no-Skill baseline.

Initial Codex trials passed the completion, obligation-preservation, and pointer
cases 0/5; Skill-only selection passed 1/5, domain selection 2/5, and composition
4/5. OpenCode initially failed those three document assertions and domain
selection (0/1 each). Other initial cases passed. Diagnostics produced a valid
“unexplained row means verification is incomplete” criterion, valid plain-path
references, and an external `skill-creator` selection in place of the supplied
`write-skill`. Failed batches discarded their raw output, so their semantic
correctness cannot be inferred from these separate diagnostics.

The requests now explicitly require Markdown links and the relevant trace paths;
the peer comparisons declare the supplied catalog and allow none, either, or both.
Expected selections are unchanged. The completion assertion accepts the observed
equivalent incomplete condition while still rejecting unexplained rows declared
complete. An intermediate pointer rerun passed only 3/5 on Codex and 0/1 on
OpenCode because the schema trace lacked its required exact path; a separate
diagnostic passed. The request now makes the one-line path contract explicit,
with the assertion preserved. These are supplied-catalog selection and generated
text trials, not ordinary host discovery.

Independent review also found two deterministic false positives: a draft could
make approval optional and discard rollout/rollback proof, or omit staging
execution from the full import runbook. The checks now require release-specific
owner approval before publication, metrics within the approved budget, verified
rollback readiness, and staging execution. Seven positive controls pass; twenty-one
semantic corruptions and five workspace mutations are rejected. This strengthens
the sampled invariants without claiming general semantic proof from regexes.
No candidate-body repair was supported by these observations; its instructions
remain unchanged throughout the trials.

The stronger release check initially passed 0/5 on Codex because it required
“rehearsal” again after the `Rehearsal:` label. A later form passed 2/5 on Codex
and 0/1 on OpenCode by requiring particular obligation words. An observed
OpenCode draft instead used the valid imperative “Rehearse rollback before
publishing” with the emergency waiver and record. The final request explicitly
asks for a source-supported Required, Optional, or Not required status followed
by the action and exception; the gate requires the correct mandatory status,
rollback action, and waiver record. Optional and not-required controls fail.
This clarifies the generated document's review format without changing policy.

A permanent deterministic regression test now covers weakened release policy,
missing staging, missing rejection reasons, false completion, and publication
without approval. Its first run exposed another false positive: the word
“reason” alone accepted “without a reason.” The completion gate now requires a
recorded or documented reason and rejects that negation; the regression passes.

After the catalog clarification, Skill-only selection still passed only 3/5 on
Codex, substituting `skill-creator` in the other runs. The final request explicitly
classifies a hypothetical task against the supplied catalog without performing
authoring. It retains the expected `write-skill` selection and candidate rejection.
This is boundary classification evidence, separate from generated-document
outcome evidence; it does not prove native discovery, invocation, or preference
over installed Skills. A read-only CLI catalog probe found 64 visible Skills,
57 enabled, including `skill-creator`, even from an empty temporary workspace.
An under-development discovery flag produced one successful model diagnostic
but did not change the catalog listing, so no isolation guarantee was inferred
and no harness change was made. Temporary files are isolated; the Codex host Skill
catalog is not. Promotion needs separately controlled discovery evidence.

An independent artificial-file probe also rewrote a temporary repository's
steering, repaired a data-migration pointer, and extracted a release-only guide.
Parent verification resolved all three entry links and confirmed exact
preservation of the release policy, data guidance, contribution rules, and
package scripts. A fresh independent reader then handled a persisted-field
rename from the generated entry document: it read contribution and data guidance,
identified reader inventory and rollback prerequisites, required compatibility
verification for every supported reader, and bypassed the release guide. This is
one temporary-file authoring execution and one read-only following probe; the
author's additional branch walkthrough was simulated. It is qualitative evidence,
not normal discovery, repeated reference-harness behavior, or live global use.

Final local results on 2026-09-07: all ten scenarios pass hard behavior and
presentation 5/5 on Codex CLI 0.153.4 with `gpt-5.6-sol` (50/50), and 1/1 on
OpenCode 1.18.21 with `openai/gpt-5.6-sol` (10/10). Within those totals, the three
generated-document cases pass 15/15 Codex runs, the two guidance-decision cases
pass 10/10, and the five supplied-catalog classifications pass 25/25. Each affected
case was rerun fully after its final request or assertion repair; unchanged
results are reused. The final completion runs used the same Codex executor flags
with an observer of generated summaries; raw CLI sessions were discarded.

Node 24.20.0 checks pass, including 17 deterministic tests and normal/internal
installation smoke checks. These are pre-commit working-tree trials at
`f06c9b43accc727fae70e5f25339fb0dc1516885+dirty`, not clean-revision Promotion
evidence. Aggregate reports, initial failures, final input hashes, assertion
controls, and independent probe evidence remain outside the repository. Raw
sessions are not committed. The visible Codex host catalog, artificial output
contracts, and supplied-state scope remain limitations despite passing scores.

No `write-agent-guidance` collision was found in the shared, Codex, Claude,
Cursor, or default OpenCode Skill directories checked; absent directories were
recorded, not treated as installed targets. Alternate installation roots remain
outside this local screen. The candidate has no Stable release impact and needs
no Changeset. Existing global Skills and steering are unchanged. Claude Code and
Cursor compatibility work remains deferred. Clean-revision Promotion evidence,
Maintainer approval, installation trials, representative real tasks, and approved
cutover remain separate work.

Actual files increase the baseline from twelve Skills and 88 behavior cases to
thirteen Skills and 98 cases. The other queued and engineering candidates remain
unimplemented in this task.

## Interface design trial

On 2026-09-07, the approved replacement work created repository-only Experimental
`design-interface`. The usage scan found 6 explicit user invocations and 23
assistant declarations across 25 sessions for `codebase-design`. These counts
justify investigating a recurring capability, not a claim of successful outcomes.
The installed source and its deepening/alternative-design references supplied
boundary evidence. Existing owned Skills leave a distinct outcome: a concrete
caller contract and responsibility boundary, justified through caller and failure
or lifecycle examples.

The candidate places repeated coordination with its information and consistency
requirements while keeping necessary caller choices visible. It accounts for
resource ownership, failure, cancellation, and recovery when relevant, compares
the proposal with a meaningful alternative or existing boundary, and makes
verification ownership explicit. A current interface can be the right answer.
It uses project language without requiring the source's glossary, adapter count,
method-count heuristic, blanket test deletion, or parallel-agent process.

Domain meaning belongs to `model-domain`; critique alone belongs to
`challenge-plan`; `implement-test-first` owns requested implementation sequencing.
Settled structural changes belong to refactoring, settled feature work to ordinary
implementation, and visual interface design to frontend work. The candidate can
compose with another outcome without depending on a peer Skill. Core and tools
retain general judgment and deterministic discovery. No new ADR, workflow, or
shared evaluation runtime is introduced.

Ten artificial scenarios cover three generated interface recommendations,
one generated design plus test-first slice, and six supplied-catalog rejection
classifications. Payment coordination preserves retry identity and ambiguous
outcomes across independent payment and receipt systems. Export lifecycle tests
a one-method proposal against caller cancellation, error identity, resource
cleanup, late success, and a single production encoder. The formatter case keeps
an already useful boundary when a facade adds unrelated database initialization.
The composition case preserves the accepted expiry boundary and distinguishes a
planned red-green slice from executed proof.

Selection trials supply exact peer names and descriptions and classify a
hypothetical task against that catalog. This is not normal discovery or proof
that installed competitors are hidden. Codex filesystem isolation does not hide
its host Skill catalog, as established in the agent-guidance trial. Generated
summary contracts are artificial read-only design artifacts; they do not prove
implemented runtime behavior. Expected answers remain outside model input.

Deterministic controls initially accepted late successful publication after
cancellation and unnecessary database initialization. Stronger assertions now
require suppression of late success and reject abandoned cleanup, collapsed
failure identity, and facade prerequisites. Eleven positive controls, twenty
semantic corruptions, and a workspace-mutation control pass. These checks protect
sampled invariants, not general semantic correctness; no candidate-body repair
has yet been supported by a failed artifact.

An independent parent execution read only the lifecycle task and candidate and
wrote a temporary `design.md`, without receiving expected cases or assertions.
It is supplementary artifact execution, not an isolated reference-harness run.
The artifact and its assessment remain outside the repository.

Initial OpenCode trials passed 6/10 scenarios. The other four failed lifecycle
error wording, payment notification wording, a formatter recommendation pattern,
and the no-Skill result status. Their raw sessions were discarded, so those
initial failures alone do not establish whether the generated contracts were
semantically wrong. Observed diagnostic outputs subsequently preserved the
required behavior with equivalent expressions such as a private worker factory,
notification that "still returns paid," and no charging under a different key.
A formatter legitimately kept lifecycle with its existing owners rather than
repeating a particular separation term. The gate now accepts those meanings,
recognizes worker teardown as cleanup, and scopes labels to their own statements
so a single-paragraph artifact cannot borrow or contradict another label's words.
An empty supplied-catalog selection uses `not_applicable` consistently.

The observed Codex design batch initially scored 1/5 on lifecycle, 2/5 on payment,
and 0/5 on retaining the boundary under earlier assertions. All fifteen generated
outputs were inspected; those failures exposed assertion phrasing and label-scope
problems, not a supported candidate-body defect. Re-scoring the same five outputs
per case against the final assertions passes 15/15 hard behavior and presentation.
Their candidate, request, and fixture inputs stayed unchanged throughout that
batch; the original aggregate remains available. A separate ordinary-feature
rejection rerun passes 5/5 under its final result contract.

The final observed OpenCode batch initially passed 7/10 under its starting
assertions. The three generated-design outputs failed cleanup terminology, retry
identity phrasing, and responsibility wording. Each actual output was inspected
and all ten pass hard behavior and presentation after the same assertion-only
re-scoring. No model input changed during that batch. The reports distinguish
new executions from re-scored evidence and retain exact final input hashes.

The initial Codex batch passed 38/50 hard checks: composition 1/5, lifecycle
1/5, ordinary-feature status 4/5, payment 5/5, retained boundary 2/5, and the
other five rejection groups 5/5 each. Their original aggregate is preserved.
The five unchanged rejection groups contribute 25 final passing runs; their
request and assertion contracts are unchanged. The observed composition rerun initially scored 2/5 because valid drafts used
dash labels, parenthetical planned labels, or `undefined` as their declared miss
representation. Accepting these equivalent forms without changing the task or
expected behavior yields 5/5 on re-scoring; semantic inversion controls still
fail. All five outputs contain a concrete cache contract, caller example,
controlled clock, and a planned failing expiry check before implementation.

Final local evidence on 2026-09-07: Codex CLI 0.153.4 with `gpt-5.6-sol` passes
50/50 hard checks and presentation across ten cases. That total comprises 25
unchanged rejection runs, five ordinary-feature status reruns, fifteen re-scored
design outputs, and five re-scored composition outputs. OpenCode 1.18.21 with
`openai/gpt-5.6-sol` passes 10/10 after the documented re-scoring. These are
working-tree trials at `6242feb845bb04439443795932dc607f4de108e7+dirty`, not
clean-revision Promotion evidence. Model requests and fixtures for re-scored
batches are unchanged; exact input hashes, original aggregates, selected generated
artifacts, semantic controls, and independent assessments remain outside the repo.
No raw CLI sessions are committed.

Node 24.20.0 checks pass: fourteen Experimental Skills, 108 behavior cases,
eleven evaluation suites with 99 scenarios, twenty deterministic tests, and
normal/internal installation smoke checks. The candidate adds one Skill and ten
cases to the thirteen-Skill, 98-case baseline. No shared evaluator code changed.
This candidate remains Experimental. No Stable release impact or
Changeset is required. Shared, Codex, and Claude installation roots had no
`design-interface` collision; checked Cursor and default OpenCode roots were
absent. Alternate roots remain outside this screen. Existing global Skills and
steering are unchanged. Claude Code, Cursor, clean-revision Promotion evidence,
Maintainer approval, installation/removal, and representative live cutover work
remain deferred.

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
