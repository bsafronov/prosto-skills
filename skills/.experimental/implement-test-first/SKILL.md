---
name: implement-test-first
description: Implement requested behavior through a failing behavioral test, a minimal change, and verified passing tests. Use when the user asks for test-first development, TDD, or red-green-refactor. Do not use for ordinary implementation without that sequencing request, adding tests for existing behavior alone, or verification-only work.
license: Apache-2.0
metadata:
  internal: true
---

# Implement Test First

Make each requested behavior observable before implementing it, then close that
red–green cycle before starting another.

1. Ground one small behavior in the request and an observable interface. Reuse
   the repository's test conventions and existing public boundary. Existing
   user decisions and clear code evidence are sufficient to choose the test
   boundary; ask only when an unresolved product or interface choice changes
   what correctness means. A test-first request does not settle an unknown bug's
   cause or expected behavior.
2. Establish the relevant baseline, then add one behavioral test. Derive its
   expected result from a requirement or independently worked example, not from
   the implementation's algorithm. Prefer real internal behavior; control time,
   randomness, and external systems at their boundaries. An interaction assertion
   is appropriate when the interaction itself is the observable contract.
3. Run that test before changing production behavior. Confirm that it fails for
   the intended missing behavior. A broken runner, missing dependency, syntax
   error, or unrelated failure is not that proof: repair or isolate the obstacle
   and rerun. If the test already passes, inspect whether the behavior exists or
   the test misses it; do not manufacture a failure or rewrite working code to
   perform a ceremonial cycle.
4. Make the smallest production change that satisfies the demonstrated behavior,
   and run the test again. Keep the assertion tied to the requirement instead of
   weakening it to obtain green. Run relevant existing tests before declaring the
   slice complete. Add another test only for the next required behavior after
   this slice is green; avoid a speculative batch of tests or implementation.
5. Refactor only from green when it materially clarifies the changed code, with
   the behavioral tests passing again afterward. Keep broader redesign separate.
   Refactoring needs no mandatory review Skill or extra approval for routine,
   authorized changes.

Test-first sequencing composes with diagnosis, feature work, and review when
those outcomes are needed, without making another Skill a prerequisite.

Stop when the requested behaviors pass, each new implementation slice has an
observed relevant failure followed by success, and affected existing checks
pass. Report tests that could not run and pre-existing failures precisely;
passing final tests alone does not establish that the work was test-first.
