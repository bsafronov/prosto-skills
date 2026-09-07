# Hypothetical task

A reproduced empty input crash is traced to an unconditional first-element access. The expected empty result is agreed.

Repair that mechanism and prove the failing case plus neighboring behavior.

# Supplied catalog

- `refactor-code`: Implement an agreed structural code change while preserving observable behavior. Use when extraction, consolidation, or responsibility moves must keep existing behavior equivalent. Do not use for an unresolved interface decision alone, bug correction, new feature behavior, or a staged compatibility transition.
- `migrate-system`: Implement and prove a requested stage of a compatibility or persisted-data transition with a viable recovery path. Use when old and new readers, writers, data forms, or deployments must coexist or recover from partial migration. Do not use for an in-place refactor, an ordinary feature or dependency update without a transition window, or ticket decomposition alone.
- `design-interface`: Design a code interface and its responsibility boundary from concrete caller needs. Use when choosing what a module exposes, where coordination belongs, or how callers control dependencies and lifecycle. Do not use for visual UI design, domain terminology alone, critique alone, or implementing a settled feature or refactor without an unresolved interface decision.
- `implement-test-first`: Implement requested behavior through a failing behavioral test, a minimal change, and verified passing tests. Use when the user asks for test-first development, TDD, or red-green-refactor. Do not use for ordinary implementation without that sequencing request, adding tests for existing behavior alone, or verification-only work.
- `split-work`: Decompose agreed scope into bounded, verifiable work items or ticket drafts with genuine prerequisites. Use when the user asks to break a plan, spec, or discussion into implementable tasks. Do not use for specification writing alone, implementation, or status and publication operations on an unchanged breakdown.
- `fix-bug`: Repair an established bug mechanism and prove the failing behavior is corrected without breaking affected behavior. Use when the cause and expected behavior are known. Do not use for diagnosis alone, new feature behavior, structural refactoring, or staged compatibility migration.
- `investigate-bug`: Identify the mechanism behind an unexplained failure by discriminating plausible causes. Use when a bug, intermittent failure, or performance regression has an unknown cause. Do not use for repairing an established cause, implementing expected new behavior, or verifying a known change alone.
- `migrate-to-shoehorn`: Migrate test files from `as` type assertions to @total-typescript/shoehorn. Use when user mentions shoehorn, wants to replace `as` in tests, or needs partial test data.
