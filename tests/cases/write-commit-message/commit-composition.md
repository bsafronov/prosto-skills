---
type: composition
skill: write-commit-message
---

## Given

A user authorizes committing the staged fix and asks for a concise Conventional Commit message.

## When

The agent selects capabilities without executing the commit in this evaluation.

## Then

Compose write-commit-message with host git-operations; wording does not take ownership of Git mutations.
