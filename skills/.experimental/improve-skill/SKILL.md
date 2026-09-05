---
name: improve-skill
description: Improve one agent Skill from concrete task or evaluation evidence after explicit invocation. Use when a recurring behavior gap is known between product tasks. Do not use during product delivery or for speculative cleanup.
license: Apache-2.0
disable-model-invocation: true
metadata:
  internal: true
---

# Improve Skill

Improve one Skill without interrupting product work or releasing changes automatically.

1. Inspect concrete evidence, the current Skill, its cases, and nearby selection boundaries.
2. Confirm the evidence shows a recurring behavior gap rather than one unusual task.
3. Propose the smallest instruction or boundary change and the case that would prove it. Request explicit approval before editing.
4. After approval, change only the owning Skill and required behavior cases, then evaluate affected behavior.
5. Report the change and evidence. Leave Promotion to a separate Maintainer decision.

Stop without editing when evidence does not support a reusable improvement.
