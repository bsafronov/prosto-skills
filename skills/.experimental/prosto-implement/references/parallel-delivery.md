# Parallel Delivery

Use this branch when at least two dependency-ready tasks have disjoint ownership.

Keep one integration owner. Parallel writers use isolated Git worktrees and local task branches when supported. Parallel read-only investigation may share a checkout. If safe writer isolation is unavailable or the repository has uncommitted user work, execute writers sequentially without stashing or rewriting that work.

Dispatch the critical-path task first, then other independent tasks. Route low-risk localized work to the fastest adequate worker; use stronger reasoning for shared architecture, security, data, concurrency, and stubborn failures. Model names are harness-specific and never part of work state.

Workers may touch necessary unclaimed files and must report expansion. Before integration, compare actual paths with active ownership. Integrate task commits in dependency order. On conflict, abort the integration attempt and create one high-risk repair task containing both intended outcomes. Continue unrelated work.

A failed worker gets one retry with its diagnostics and a stronger suitable worker. A second failure triggers decomposition or blocks that branch. Blind retries and overlapping writers are not parallelism.
