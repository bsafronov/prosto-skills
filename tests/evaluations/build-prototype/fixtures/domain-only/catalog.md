Supplied catalog for classification only. Exact IDs are build-prototype, write-spec, model-domain, frontend-design, synthesize-evidence, design-interface. Select any subset, including none, needed for the hypothetical task; native installed Skills are outside this catalog. The candidate description is supplied in the evaluation prompt.

write-spec: Synthesize or revise a feature specification from agreed discussion, supplied requirements, and relevant repository evidence. Use when the user asks to capture intended behavior and acceptance criteria as a spec. Do not use for brainstorming alone, ticket decomposition, publishing an unchanged document, or reviewing implementation against an existing spec.

model-domain: Establish or revise domain concepts, their relationships, and shared terminology from product evidence. Use when meanings conflict or a domain model needs defining, including its glossary and consequential decisions. Do not use for merely reading terminology, editorial document changes, or implementation-only architecture decisions.

frontend-design: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.

synthesize-evidence: Resolve a bounded research question into findings supported by attributable evidence, including applicability limits and unresolved conflicts. Use when sources must be compared, reconciled, or assessed for coverage before an answer is reliable. Do not use for a single factual lookup, locating files or links, domain decisions, or writing a specification from settled facts.

design-interface: Design a code interface and its responsibility boundary from concrete caller needs. Use when choosing what a module exposes, where coordination belongs, or how callers control dependencies and lifecycle. Do not use for visual UI design, domain terminology alone, critique alone, or implementing a settled feature or refactor without an unresolved interface decision.
