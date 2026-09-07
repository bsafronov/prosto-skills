---
type: trigger
skill: migrate-system
---

## Given

A sole application is stopped in a verified maintenance window while its persisted decimal amounts are converted to integer minor units. The source backup is present; partial conversion and rollback still require proof.

## When

Implement this offline data transition and verify conversion, interruption recovery, and restoration before restarting the application.

## Then

Select migrate-system even though simultaneous old and new consumers are absent.
