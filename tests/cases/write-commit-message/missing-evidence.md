---
type: outcome
skill: write-commit-message
---

## Given

A requested commit message has no diff or description, and a supplied status confirms no changes.

## When

The agent tries to draft the message.

## Then

Ask for the intended change or missing diff; do not fabricate a commit message or mutate files.
