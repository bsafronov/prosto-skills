---
name: write-commit-message
description: Write a concise Conventional Commit message grounded in the intended change. Use when drafting a message for a diff or a commit task. Do not use for release notes, PR descriptions, or Git operations alone.
license: Apache-2.0
metadata:
  internal: true
---

# Write Commit Message

Produce a message that preserves the change's intent and compatibility impact.
This Skill owns wording; staging, committing, amending, and publishing require
separate host handling under the user's authorization.

1. Pin the intended diff or supplied change description. For a staged-message
   request, exclude unstaged work. Ask for missing scope or evidence only when
   it would change the message; an empty diff supports no invented change.
2. Follow explicit repository and user conventions. Otherwise use
   `type(scope): imperative intent`, with scope only when it clarifies the
   affected area. Choose the type from the actual effect: `fix` restores
   intended behavior, `feat` adds it, and `refactor` preserves it.
3. Describe the resulting behavior in the shortest clear subject. Aim for 50
   characters and stay within 72 unless an explicit convention requires more.
   Preserve exact technical names when their identity matters.
4. Add a body only when the subject would lose material rationale, compatibility
   impact, security context, migration steps, or revert intent. Mark breaking
   changes with `!` and a `BREAKING CHANGE:` footer naming the incompatibility
   and the evidenced migration path. Never invent a workaround or deadline.
5. Preserve required trailers and carry supplied issue IDs into the message,
   including partially addressed issues. Use a closing reference only when the
   change resolves that issue. Do not claim tests,
   authorship, fixes, or user impact unsupported by the evidence.

Return one ready-to-use message, without a file inventory or process narration.
Stop when the message covers the intended diff, preserves material context and
required trailers, and makes no unsupported claim.
