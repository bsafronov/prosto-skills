# Supplied catalog

- design-interface: Design a code interface and its responsibility boundary from concrete caller needs. Use when choosing what a module exposes, where coordination belongs, or how callers control dependencies and lifecycle. Do not use for visual UI design, domain terminology alone, critique alone, or implementing a settled feature or refactor without an unresolved interface decision.
- implement-test-first: Implement requested behavior through a failing behavioral test, a minimal change, and verified passing tests. Use when the user asks for test-first development, TDD, or red-green-refactor. Do not use for ordinary implementation without that sequencing request, adding tests for existing behavior alone, or verification-only work.

# Hypothetical task

Using TDD, add the accepted empty-input rejection to parseRows(text). Its input, result, and error contract are already decided.
