import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildPacket,
  claimTask,
  readyTasks,
  recordReview,
  transitionTask,
  validateContract,
  validateWork,
} from "../skills/.experimental/prosto-implement/scripts/workflow-engine.mjs";

const workctl = path.resolve("skills/.experimental/prosto-implement/scripts/workctl.mjs");

test("workflow validation enforces approved contracts, coverage, and acyclic tasks", () => {
  const contract = sampleContract();
  const work = sampleWork();
  assert.deepEqual(validateContract(contract), []);
  assert.deepEqual(validateWork(work, contract), []);

  const broken = structuredClone(work);
  for (const task of broken.tasks) task.covers = [];
  broken.tasks[0].dependsOn = ["T2"];
  broken.tasks[1].dependsOn = ["T1"];
  const errors = validateWork(broken, contract);
  assert(errors.some((error) => error.includes("acceptance A1 is not covered")));
  assert(errors.some((error) => error.includes("task dependency cycle")));
});

test("ready queue follows the critical path and packets disclose only relevant product context", () => {
  const contract = sampleContract();
  const work = sampleWork();
  assert.deepEqual(
    readyTasks(work).map((task) => task.id),
    ["T1", "T2"],
  );

  const packet = claimTask(work, contract, "T1", "builder-1");
  assert.equal(packet.task.id, "T1");
  assert.deepEqual(packet.product.acceptance.map((item) => item.id), ["A1"]);
  assert.deepEqual(packet.product.decisions.map((item) => item.id), ["D1"]);
  assert(!JSON.stringify(packet).includes("discarded implementation detail"));
  assert.equal(work.tasks[0].status, "claimed");

  const directPacket = buildPacket(work, contract, work.tasks[1]);
  assert.deepEqual(directPacket.product.decisions, []);
});

test("workctl permits only one concurrent claim", async () => {
  await withWorkflow(sampleWork(), async ({ workFile }) => {
    const args = [workctl, "packet", "--work", workFile, "--task", "T1", "--worker", "builder"];
    const results = await Promise.all([runNode(args), runNode(args)]);
    assert.deepEqual(
      results.map((result) => result.code).sort(),
      [0, 1],
    );
    const work = JSON.parse(await readFile(workFile, "utf8"));
    assert.equal(work.tasks.find((task) => task.id === "T1").status, "claimed");
  });
});

test("completed tasks require a bounded final review before work completes", () => {
  const contract = sampleContract();
  const work = sampleWork();
  work.tasks = [work.tasks[0]];
  claimTask(work, contract, "T1", "builder");
  transitionTask(work, "T1", "completed", { evidence: ["focused checks passed"] });
  assert.equal(work.status, "review");

  recordReview(work, { blockingFindings: ["regression"], evidence: ["review one"] });
  assert.equal(work.status, "blocked");
  recordReview(work, { blockingFindings: [], evidence: ["regression repaired"] });
  assert.equal(work.status, "completed");
  assert.throws(
    () => recordReview(work, { blockingFindings: [], evidence: ["third review"] }),
    /limited to two passes/,
  );
});

test("workctl resolves source anchors, enforces agent scope and checks, then gates completion", async () => {
  const work = sampleWork();
  work.tasks = [
    {
      ...work.tasks[0],
      checks: [
        {
          command: [
            process.execPath,
            "-e",
            "process.exit(require('node:fs').readFileSync('src/critical/result.txt', 'utf8') === 'ok' ? 0 : 1)",
          ],
        },
      ],
    },
  ];

  await withWorkflow(work, async ({ root, contractFile, workFile }) => {
    const valid = await runNode([workctl, "validate", "--work", workFile]);
    assert.equal(valid.code, 0, valid.stderr);

    const brokenContract = JSON.parse(await readFile(contractFile, "utf8"));
    brokenContract.decisions[0].source = "docs/brief.md#missing";
    await writeFile(contractFile, `${JSON.stringify(brokenContract, null, 2)}\n`);
    const invalid = await runNode([workctl, "validate", "--work", workFile]);
    assert.equal(invalid.code, 1);
    assert.match(invalid.stderr, /section does not exist/);
    await writeFile(contractFile, `${JSON.stringify(sampleContract(), null, 2)}\n`);

    const claimed = await runNode([
      workctl,
      "packet",
      "--work",
      workFile,
      "--task",
      "T1",
      "--worker",
      "builder",
    ]);
    assert.equal(claimed.code, 0, claimed.stderr);

    const resultFile = path.join(root, "result.json");
    await writeFile(
      resultFile,
      `${JSON.stringify({ changedPaths: ["docs/escape.md"], evidence: ["implemented"] })}\n`,
    );
    const outside = await runNode([
      workctl,
      "transition",
      "--work",
      workFile,
      "--task",
      "T1",
      "--status",
      "completed",
      "--result",
      "result.json",
    ]);
    assert.equal(outside.code, 1);
    assert.match(outside.stderr, /outside task T1 scope/);

    await mkdir(path.join(root, "src/critical"), { recursive: true });
    await writeFile(path.join(root, "src/critical/result.txt"), "bad");
    await writeFile(
      resultFile,
      `${JSON.stringify({ changedPaths: ["src/critical/result.txt"], evidence: ["implemented"] })}\n`,
    );
    const failedCheck = await runNode([
      workctl,
      "transition",
      "--work",
      workFile,
      "--task",
      "T1",
      "--status",
      "completed",
      "--result",
      "result.json",
    ]);
    assert.equal(failedCheck.code, 1);
    assert.match(failedCheck.stderr, /check failed/);

    await writeFile(path.join(root, "src/critical/result.txt"), "ok");
    const completedTask = await runNode([
      workctl,
      "transition",
      "--work",
      workFile,
      "--task",
      "T1",
      "--status",
      "completed",
      "--result",
      "result.json",
    ]);
    assert.equal(completedTask.code, 0, completedTask.stderr);
    assert.equal(JSON.parse(completedTask.stdout).workStatus, "review");

    const reviewFile = path.join(root, "review.json");
    await writeFile(reviewFile, `${JSON.stringify({ blockingFindings: [], evidence: ["final review passed"] })}\n`);
    const reviewed = await runNode([
      workctl,
      "review",
      "--work",
      workFile,
      "--result",
      "review.json",
    ]);
    assert.equal(reviewed.code, 0, reviewed.stderr);
    assert.equal(JSON.parse(reviewed.stdout).workStatus, "completed");
  });
});

test("workctl detaches and validates a process task", async () => {
  const work = processWork({
    command: [
      process.execPath,
      "-e",
      "setTimeout(() => require('node:fs').writeFileSync('render.txt', 'ok'), 120)",
    ],
    outputs: [{ path: "render.txt", retention: "deliver" }],
    checks: [
      {
        command: [
          process.execPath,
          "-e",
          "process.exit(require('node:fs').readFileSync('render.txt', 'utf8') === 'ok' ? 0 : 1)",
        ],
      },
    ],
  });

  await withWorkflow(work, async ({ workFile }) => {
    const startedAt = Date.now();
    const started = await runNode([workctl, "run", "--work", workFile, "--task", "P1"]);
    assert.equal(started.code, 0, started.stderr);
    assert(Date.now() - startedAt < 1000, "run should return without waiting for process completion");

    const final = await pollWork(workFile, "P1", "completed");
    assert.equal(final.tasks[0].status, "completed");
    assert(final.tasks[0].evidence.some((item) => item.includes("output render.txt exists")));
  });
});

test("workctl cancels a detached process cooperatively", async () => {
  const work = processWork({
    command: [process.execPath, "-e", "setTimeout(() => {}, 5000)"],
    outputs: [{ path: "never.txt", retention: "temporary" }],
    checks: [],
  });

  await withWorkflow(work, async ({ workFile }) => {
    const started = await runNode([workctl, "run", "--work", workFile, "--task", "P1"]);
    assert.equal(started.code, 0, started.stderr);
    const cancelled = await runNode([workctl, "cancel", "--work", workFile, "--task", "P1"]);
    assert.equal(cancelled.code, 0, cancelled.stderr);
    const final = await pollWork(workFile, "P1", "cancelled");
    assert.equal(final.tasks[0].status, "cancelled");
  });
});

function sampleContract() {
  return {
    schemaVersion: 1,
    workId: "demo",
    revision: 1,
    status: "approved",
    goal: "Deliver observable behavior",
    nonGoals: ["Do not redesign unrelated behavior"],
    behaviors: [{ id: "B1", description: "User can observe the result" }],
    constraints: ["Preserve compatibility"],
    acceptance: [{ id: "A1", outcome: "Focused proof passes" }],
    decisions: [
      { id: "D1", choice: "Keep current interface", source: "docs/brief.md#interface" },
      {
        id: "D2",
        choice: "discarded implementation detail",
        source: "docs/brief.md#internal",
      },
    ],
    openQuestions: [],
    sources: [{ path: "docs/brief.md", section: "Outcome" }],
  };
}

function sampleWork() {
  return {
    schemaVersion: 1,
    workId: "demo",
    contract: { path: "../../contracts/demo.json", revision: 1 },
    repositoryRoot: "../../..",
    status: "approved",
    tasks: [
      {
        id: "T1",
        kind: "agent",
        outcome: "Critical implementation",
        dependsOn: [],
        covers: ["A1"],
        uses: ["D1"],
        scope: ["src/critical"],
        checks: [],
        locks: [],
        risk: "medium",
        status: "pending",
        evidence: [],
      },
      {
        id: "T2",
        kind: "agent",
        outcome: "Independent documentation",
        dependsOn: [],
        covers: ["A1"],
        uses: [],
        scope: ["docs/change.md"],
        checks: [],
        locks: [],
        risk: "low",
        status: "pending",
        evidence: [],
      },
      {
        id: "T3",
        kind: "agent",
        outcome: "Integrate critical implementation",
        dependsOn: ["T1"],
        covers: ["A1"],
        uses: ["D1"],
        scope: ["src/integration"],
        checks: [],
        locks: [],
        risk: "high",
        status: "pending",
        evidence: [],
      },
    ],
    review: { passes: 0, blockingFindings: [], evidence: [] },
  };
}

function processWork(overrides) {
  const work = sampleWork();
  work.tasks = [
    {
      id: "P1",
      kind: "process",
      outcome: "Produce validated artifact",
      dependsOn: [],
      covers: ["A1"],
      uses: ["D1"],
      scope: ["render.txt"],
      command: overrides.command,
      cwd: ".",
      outputs: overrides.outputs,
      checks: overrides.checks,
      locks: ["renderer"],
      risk: "low",
      status: "pending",
      evidence: [],
    },
  ];
  return work;
}

async function withWorkflow(work, callback) {
  const root = await mkdtemp(path.join(os.tmpdir(), "prosto-workflow-test-"));
  try {
    const contractDirectory = path.join(root, ".prosto/contracts");
    const workDirectory = path.join(root, ".prosto/work/demo");
    await mkdir(contractDirectory, { recursive: true });
    await mkdir(workDirectory, { recursive: true });
    await mkdir(path.join(root, "docs"), { recursive: true });
    await writeFile(path.join(root, "docs/brief.md"), "# Outcome\n\n## Interface\n\n## Internal\n");
    const contractFile = path.join(contractDirectory, "demo.json");
    const workFile = path.join(workDirectory, "work.json");
    await writeFile(contractFile, `${JSON.stringify(sampleContract(), null, 2)}\n`);
    await writeFile(workFile, `${JSON.stringify(work, null, 2)}\n`);
    await callback({ root, contractFile, workFile });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function pollWork(workFile, taskId, expectedStatus) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const refreshed = await runNode([workctl, "refresh", "--work", workFile]);
    assert.equal(refreshed.code, 0, refreshed.stderr);
    const work = JSON.parse(await readFile(workFile, "utf8"));
    const status = work.tasks.find((task) => task.id === taskId).status;
    if (status === expectedStatus) return work;
    if (new Set(["failed", "lost"]).has(status)) {
      assert.fail(`process reached ${status}: ${refreshed.stdout}`);
    }
  }
  assert.fail(`process did not reach ${expectedStatus}`);
}

function runNode(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { encoding: "utf8" });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}
