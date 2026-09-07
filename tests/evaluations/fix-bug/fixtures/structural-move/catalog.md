Supplied hypothetical catalog for classification only. Native installed Skills are outside this catalog. Select any subset, including none, for the requested independent outcomes.

investigate-bug: Identify the mechanism behind an unexplained failure by discriminating plausible causes. Use when a bug, intermittent failure, or performance regression has an unknown cause. Do not use for repairing an established cause, implementing expected new behavior, or verifying a known change alone.

fix-bug: Repair an established bug mechanism and prove the failing behavior is corrected without breaking affected behavior. Use when the cause and expected behavior are known. Do not use for diagnosis alone, new feature behavior, structural refactoring, or staged compatibility migration.

implement-test-first: Implement requested behavior through a failing behavioral test, a minimal change, and verified passing tests. Use when the user asks for test-first development, TDD, or red-green-refactor. Do not use for ordinary implementation without that sequencing request, adding tests for existing behavior alone, or verification-only work.

refactor-code: Implement an agreed structural code change while preserving observable behavior. Use when extraction, consolidation, or responsibility moves must keep existing behavior equivalent. Do not use for an unresolved interface decision alone, bug correction, new feature behavior, or a staged compatibility transition.

migrate-system: Implement and prove a requested stage of a compatibility or persisted-data transition with a viable recovery path. Use when old and new readers, writers, data forms, or deployments must coexist or recover from partial migration. Do not use for an in-place refactor, an ordinary feature or dependency update without a transition window, or ticket decomposition alone.

synthesize-evidence: Resolve a bounded research question into findings supported by attributable evidence, including applicability limits and unresolved conflicts. Use when sources must be compared, reconciled, or assessed for coverage before an answer is reliable. Do not use for a single factual lookup, locating files or links, domain decisions, or writing a specification from settled facts.

write-spec: Synthesize or revise a feature specification from agreed discussion, supplied requirements, and relevant repository evidence. Use when the user asks to capture intended behavior and acceptance criteria as a spec. Do not use for brainstorming alone, ticket decomposition, publishing an unchanged document, or reviewing implementation against an existing spec.

design-interface: Design a code interface and its responsibility boundary from concrete caller needs. Use when choosing what a module exposes, where coordination belongs, or how callers control dependencies and lifecycle. Do not use for visual UI design, domain terminology alone, critique alone, or implementing a settled feature or refactor without an unresolved interface decision.
