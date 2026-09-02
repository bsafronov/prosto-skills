# Implementation Contract

Use this schema when compiling durable product documents for implementation.

```json
{
  "schemaVersion": 1,
  "workId": "short-hyphenated-id",
  "revision": 1,
  "status": "draft",
  "goal": "Observable outcome for the user",
  "nonGoals": ["Explicitly excluded outcome"],
  "behaviors": [
    { "id": "B1", "description": "Observable product behavior" }
  ],
  "constraints": ["Product, compatibility, permission, or delivery constraint"],
  "acceptance": [
    { "id": "A1", "outcome": "Checkable product result" }
  ],
  "decisions": [
    {
      "id": "D1",
      "choice": "Confirmed choice",
      "source": "docs/product/brief.md#relevant-section"
    }
  ],
  "openQuestions": [],
  "sources": [
    { "path": "docs/product/brief.md", "section": "Relevant section" }
  ]
}
```

Follow the repository's product-document convention. When none exists, use `.prosto/contracts/<workId>.json` without asking the user to choose a technical path. Do not commit operational planning material unless the repository or user requires it.

## Drafting rules

- Use stable IDs within a contract revision.
- Keep one goal. Split unrelated outcomes into separate contracts.
- Express behaviors and acceptance as externally observable results, not implementation steps.
- Record a technical choice only when the user requested it or it is a confirmed constraint.
- Keep rejected options, discussion, and extended rationale in source documents.
- Label unresolved matters in `openQuestions`; never hide them as assumptions.
- Turn ambiguous ordering, range, default, and failure language into an open question. For example, "by version" needs an explicit direction before approval.
- Increment `revision` when approved product meaning changes.
- Set `status` to `approved` only when `openQuestions` is empty and either the user explicitly approves the contract or its product meaning is fully derived from current approved sources.

The approved contract is the product source for implementation. Later product changes create a new revision; they do not silently rewrite the approved revision.
