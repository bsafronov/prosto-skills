---
name: prosto-implement
description: "Deliver a large, bounded repository change from durable product documents or an approved implementation contract. Use when work spans multiple dependent slices, benefits from safe parallel execution, or includes long non-agent jobs such as renders, builds, exports, or simulations. Use direct implementation for small localized changes."
license: Apache-2.0
disable-model-invocation: true
metadata:
  internal: true
  prosto:
    requires:
      - prosto-contract
    tags:
      - delivery
      - implementation
      - orchestration
---

# Prosto Implement

Act as delivery owner. Complete the approved outcome quickly and correctly while keeping technical orchestration out of the user's way.

## Start

1. If the change is small and localized, take the direct path: implement, run focused proof, report the result. Do not create workflow state.
2. For substantial work, invoke the required `prosto-contract` Peer to create or validate one approved contract. Stop with installation guidance when the Peer is unavailable.
3. Inspect repository rules, architecture, existing seams, tests, and current Git state. Ask no question whose answer can be found there.
4. Present only the outcome, non-goals, acceptance conditions, and material product risks. Obtain one approval, then continue autonomously within that contract.

## Deliver

1. Read [work state and task packets](references/work-state.md). Create a dependency graph whose tasks each own one coherent outcome and map to contract acceptance IDs.
2. When multiple independent slices exist, read [parallel delivery](references/parallel-delivery.md). Use isolated workers when the harness and repository support them; otherwise preserve the same graph sequentially.
3. When routine commands can outlive useful model work, read [background processes](references/background-processes.md). Start them without holding an agent turn, continue independent work, then resume at a completion event or cheap status check.
4. Replan technical details freely. Request approval only for changed product behavior, relaxed constraints, destructive actions, new external effects, or material scope expansion.
5. Report milestones, batched product blockers, and background-job state. Keep raw logs, task branches, model routing, and routine progress out of user updates unless requested.
6. Read [bounded review](references/bounded-review.md) before completion. Repair blocking findings, run final proof, then stop.
7. After successful proof, remove integrated temporary worktrees, task branches, and runtime artifacts. Preserve all recovery state while paused or blocked, and retain product documents required by the repository.

Natural requests such as `status`, `pause`, `resume`, `change requirement`, and `cancel` control the run. Preserve state when paused or blocked. A changed contract revision makes affected tasks and their dependents stale; unaffected work may continue.

## Completion

Finish only when every contract acceptance ID has passing evidence, every required task is complete, final repository checks pass, bounded review has no blocking finding, and intended changes are integrated. Report delivered behavior, proof, deviations, and remaining blockers. Never claim completion for a paused or blocked run.
