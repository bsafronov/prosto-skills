# Outcome Brief

Use this structure as the durable product source for one shaped outcome:

```markdown
---
schemaVersion: 1
workId: short-hyphenated-id
revision: 1
status: draft
---

# Outcome title

## User and situation

The affected user and the moment in which their need occurs.

## Outcome

The single observable change for that user.

## Product rules

Confirmed behavior, access, policy, ordering, defaults, and boundaries that define the outcome.

## Representative examples

- Success: situation -> user action -> visible result.
- Boundary or failure: situation -> user action -> visible result.

## Success evidence

Observable product results that would show the outcome works.

## Non-goals

Outcomes explicitly excluded from this brief.

## Constraints

Confirmed product, compatibility, permission, or delivery constraints that affect the outcome.

## Parked outcomes

Related but independent outcomes reserved for separate briefs.

## Open product questions

Unresolved choices that could change the end-user experience.

## Sources

Durable product documents, repository behavior, or decision records that establish relevant facts.
```

## Drafting rules

- Follow the owning workspace's product-document convention. When none exists, use `.prosto/outcomes/<workId>.md`.
- Keep one user outcome per brief. Put independent outcomes under `Parked outcomes` until they receive their own brief.
- Express rules, examples, and success evidence as externally observable product results.
- Record a product recommendation as settled only after the user accepts it.
- Keep technical choices, architecture, and task planning in downstream work.
- Set `status` to `approved` only after explicit approval and when `Open product questions` is empty.
- Increment `revision` and return the brief to `draft` when approved product meaning changes.
- Preserve source paths and relevant sections so `prosto-contract` can resolve them.
