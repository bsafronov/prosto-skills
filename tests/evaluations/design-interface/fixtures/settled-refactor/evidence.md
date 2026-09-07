# Supplied catalog

- design-interface: Design a code interface and its responsibility boundary from concrete caller needs. Use when choosing what a module exposes, where coordination belongs, or how callers control dependencies and lifecycle. Do not use for visual UI design, domain terminology alone, critique alone, or implementing a settled feature or refactor without an unresolved interface decision.
- safe-refactor: Restructure code while preserving behavior. Use for extraction, consolidation, ownership moves, or cleanup where verification must bracket structural edits.

# Hypothetical task

Move the pure parser into the chosen package, preserving its signature, ordering, failures, and behavior. The interface decision is settled; execute and verify this extraction.
