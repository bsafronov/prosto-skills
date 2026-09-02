---
name: feature-delivery
description: "Deliver one bounded user outcome from raw intent through proof with one user invocation and no duplicate product approval."
skills:
  - prosto-implement
metadata:
  internal: true
---

# Feature Delivery

Invoke `prosto-implement` once with raw intent, approved product sources, or an approved contract.

For a small localized change whose product meaning is already clear, it uses the direct implementation path. For substantial work with unsettled product meaning, it invokes `prosto-shape`, receives one approved Outcome Brief, hands that source to `prosto-contract`, and delivers the resulting contract autonomously. Current approved sources skip discovery, and faithful contract compilation inherits their approval.

The user sees product choices, material product risks, milestones, blockers, and delivered evidence. Technical questions, contract storage, task packets, worker coordination, and routine logs remain internal unless requested. Changed product meaning creates a new revision and requires new approval; unchanged technical replanning does not.
