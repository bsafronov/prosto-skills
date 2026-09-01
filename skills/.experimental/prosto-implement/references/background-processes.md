# Background Processes

Use this branch for deterministic work that can continue without model judgment: renders, builds, exports, downloads, simulations, test suites, or local batch jobs.

Represent the work as `kind: process` in the task graph. Declare an argument-array command, working directory, expected outputs, success checks, optional resource locks, and output retention. Exit code alone is insufficient when artifacts can be incomplete or corrupt.

Start the task through `workctl run`. It returns a durable handle immediately and redirects logs outside model context. Continue independent agent work. When no useful task remains, yield the agent turn and arrange the cheapest supported wake or later recovery. Never sleep, stream routine logs, or repeatedly poll from a reasoning turn.

Refresh at a dependency boundary, terminal notification, or scheduled wake. Success returns command, exit code, checks, and artifact paths. Failure returns a capped log tail plus the full log path. A failure creates a diagnostic agent task; it does not trigger a blind rerun.

Keep refresh checks short. Represent any check that can itself run for a long time as another process task so a status refresh never becomes the wait it was meant to avoid.

Use arbitrary locks such as `gpu`, `renderer`, or `integration-environment` to prevent resource contention. Long duration alone is not failure. Cancellation requests cooperative termination and preserves logs and state. Treat partial output as unusable. After the process ends, cleanup may remove only artifacts declared with `temporary` retention.

The bundled runner uses Node.js standard-library process spawning with `shell: false`. It executes only the command already declared in approved work state. It has no ambient network or credential behavior; the command itself remains subject to the user's authorization and repository policy.
