# Work State and Task Packets

Use durable work state only for substantial changes. Default to `.prosto/work/<workId>/work.json`. The state survives context loss; it is not a progress narrative.

```json
{
  "schemaVersion": 1,
  "workId": "approved-contract-id",
  "contract": {
    "path": "../../contracts/approved-contract-id.json",
    "revision": 1
  },
  "repositoryRoot": "../../..",
  "status": "approved",
  "tasks": [
    {
      "id": "T1",
      "kind": "agent",
      "outcome": "One coherent implementation result",
      "dependsOn": [],
      "covers": ["A1"],
      "uses": ["D1"],
      "scope": ["src/owned-area/"],
      "checks": [
        { "command": ["npm", "test", "--", "focused-test"] }
      ],
      "locks": [],
      "risk": "low",
      "status": "pending",
      "evidence": []
    }
  ],
  "review": {
    "passes": 0,
    "blockingFindings": [],
    "evidence": []
  }
}
```

Process tasks also declare `command`, optional `cwd`, `outputs`, and resource `locks`. Commands and checks are argument arrays; never encode a shell program in one string.

## Task design

Each task has one outcome, known dependencies, acceptance coverage, relevant decision IDs, ownership scope, focused checks, and risk `low`, `medium`, or `high`. Use `high` for security, data, concurrency, public interfaces, destructive behavior, or unresolved architecture.

Prioritize the critical path. Fill remaining capacity with tasks whose scopes and locks do not overlap. The orchestrator alone mutates work state. Workers receive task packets and return structured results; they never receive the complete state or unrelated discussion.

A packet contains the task outcome, relevant acceptance and decisions, global constraints, dependency evidence, starting paths or symbols, ownership scope, checks, risk, and stop conditions. A worker returns status, summary, changed paths, checks, evidence, scope expansion, discoveries, and product blockers.

Use the bundled script for deterministic validation, scheduling, claims, transitions, process state, and recovery:

```sh
node <skill-directory>/scripts/workctl.mjs validate --work .prosto/work/<workId>/work.json
node <skill-directory>/scripts/workctl.mjs ready --work .prosto/work/<workId>/work.json
```

The script requires Node.js 20 or later and no third-party packages. Run `--help` for command details. It confines referenced files and working directories to the repository root. The controller performs no network or credential access; approved commands and checks retain their normal repository permissions.
