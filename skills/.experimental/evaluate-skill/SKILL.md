---
name: evaluate-skill
description: Evaluate whether one agent Skill selects correctly, respects its boundary, composes cleanly, and achieves its outcome. Use when Skill behavior needs evaluation. Do not use to edit Skills or review product code.
license: Apache-2.0
metadata:
  internal: true
---

# Evaluate Skill

Evaluate behavior without changing the Skill.

1. Inspect the Skill, its cases, and descriptions of nearby Skills that could compete with it.
2. Exercise realistic selection, rejection, and outcome cases. Exercise composition only where multiple Skills should materially help.
3. Keep expected answers hidden from an independent evaluator when independent execution is available.
4. Record source revision, harness, model, result, variance, and concise evidence.
5. Report failures by observable behavior: wrong selection, boundary violation, harmful composition, or unmet outcome.

For Promotion evidence, run every required case twice on the reference harness and once on each required compatibility harness. Stop with a read-only Evaluation Report; do not edit or promote the Skill.
