---
name: investigate-bug
description: Identify the mechanism behind an unexplained failure by discriminating plausible causes. Use when a bug, intermittent failure, or performance regression has an unknown cause. Do not use for repairing an established cause, implementing expected new behavior, or verifying a known change alone.
license: Apache-2.0
metadata:
  internal: true
---

# Investigate Bug

Explain the observed failure with a mechanism that survives a meaningful attempt
to distinguish it from plausible alternatives.

- Separate observations from explanations: record the triggering inputs, relevant
  state or event order, actual result, and expected behavior. A recent change or
  correlated metric is a lead, not a cause. If expected behavior itself is
  unsettled, identify that missing decision before classifying it as a defect.
- Trace the failing path only far enough to locate competing mechanisms. Rank
  hypotheses by their fit to the evidence and the cost of distinguishing them.
  Choose a probe whose possible results would change that ranking; vary the
  suspected cause while holding consequential inputs constant. Repeating the
  same broad failing check adds little when both explanations predict it.
- Interpret each probe against its prediction. For intermittent failures, retain
  the event order, state, workload, and environment that make the contrast
  meaningful; one clean run does not disprove a race. A reproduction, comparison,
  or trace must connect the proposed mechanism to the observed failure, not just
  show that some error occurs.
- Close with the supported mechanism, decisive evidence, and remaining uncertainty.
  When access or observability prevents discrimination, report the exact missing
  observation and how its possible results separate the live hypotheses. An
  untested favorite remains a hypothesis.

This outcome ends at a supported cause or a specific diagnostic blocker. Diagnosis
alone does not authorize a product repair. When repair is also requested, carry
its evidence into that work instead of restarting the investigation. Comparing
external sources, specifying desired behavior, and requested test-first sequencing
remain independently useful outcomes; none is a prerequisite here.
