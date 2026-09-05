---
name: write-skill
description: Create or revise one atomic agent Skill with a precise selection boundary and observable completion. Use when recurring work needs reusable agent judgment. Do not use for ordinary documentation or one-off instructions.
license: Apache-2.0
metadata:
  internal: true
---

# Write Skill

Create the smallest Skill that changes agent decisions for one independently useful outcome.

1. Establish the recurring outcome and inspect nearby Skills before writing.
2. Keep deterministic work in tools. Create a Skill only when agent judgment adds value.
3. Name it with a clear verb and object. Describe its outcome, use condition, and nearest rejection boundary.
4. Include only decisions, boundaries, proof, and stopping guidance that capable agents cannot safely infer.
5. Add realistic selection, rejection, and outcome cases. Add a composition case when another Skill may also apply.
6. Run repository checks.

Split outcomes that can vary independently. Keep one-off knowledge in repository guidance. Stop when another agent can select the Skill correctly and complete its outcome without unrelated instructions.
