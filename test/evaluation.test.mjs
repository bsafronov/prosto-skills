import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  evaluateScenarioReport,
  loadEvaluationSuite,
  openCodeEnvironment,
  parseHarnessReport,
  parseOpenCodeEvents,
  summarizeRuns,
} from "../lib/evaluation.mjs";

const scenario = {
  expect: {
    allowAdditionalFindings: false,
    capabilities: {
      allowAdditional: false,
      exclude: ["defect-review"],
      include: ["review-requirements"],
    },
    findings: [
      {
        kind: "requirement",
        label: "Missing",
        path: "src/reset.js",
        sourceId: "REQ-AUDIT",
      },
    ],
    outcome: "findings",
    readOnly: true,
  },
  quality: {
    findingSummaryMaxCharacters: 120,
    orderedFindingSourceIds: ["REQ-AUDIT"],
    summaryMaxCharacters: 160,
  },
};

const workspace = {
  files: new Map([["src/reset.js", { type: "file", lines: 8 }]]),
  root: "/tmp/artificial-workspace",
  roots: ["/tmp/artificial-workspace", "/private/tmp/artificial-workspace"],
};

test("an exact evidence-backed report passes hard and quality gates", () => {
  const result = evaluateScenarioReport(
    scenario,
    {
      selectedCapabilities: ["$review-requirements"],
      outcome: "findings",
      findings: [
        {
          kind: "requirement",
          label: "Missing",
          sourceIds: ["REQ-AUDIT"],
          path: "/tmp/artificial-workspace/src/reset.js",
          line: 5,
          summary: "Successful resets return without emitting the required audit event.",
        },
      ],
      summary: "The change misses one required behavior.",
    },
    workspace,
  );

  assert.deepEqual(result, { hardErrors: [], qualityErrors: [] });
});

test("missing, invented, and unauthorized behavior fails the hard gate", () => {
  const result = evaluateScenarioReport(
    scenario,
    {
      selectedCapabilities: ["review-requirements", "defect-review"],
      outcome: "satisfied",
      findings: [
        {
          kind: "defect",
          label: "Defect",
          sourceIds: ["resetPassword"],
          path: "src/missing.js",
          line: 20,
          summary: "An invented blocker.",
        },
      ],
      summary: "Done.",
    },
    workspace,
    true,
  );

  assert(result.hardErrors.includes("workspace changed"));
  assert(result.hardErrors.includes("unexpected capability defect-review"));
  assert(result.hardErrors.includes("outcome must be findings, got satisfied"));
  assert(result.hardErrors.some((error) => error.startsWith("missing finding")));
  assert(result.hardErrors.some((error) => error.startsWith("unexpected finding")));
  assert(result.hardErrors.includes("finding path does not exist: src/missing.js"));
});

test("quality may vary once in five runs but hard behavior may not", () => {
  const pass = { hardErrors: [], qualityErrors: [] };
  const weakWording = { hardErrors: [], qualityErrors: ["summary exceeds 160 characters"] };
  const hardFailure = { hardErrors: ["missing finding"], qualityErrors: [] };

  const tolerated = summarizeRuns("outcome", [pass, pass, pass, pass, weakWording]);
  assert.equal(tolerated.passed, true);
  assert.equal(tolerated.hardPasses, 5);
  assert.equal(tolerated.qualityPasses, 4);

  const rejected = summarizeRuns("outcome", [pass, pass, pass, pass, hardFailure]);
  assert.equal(rejected.passed, false);
  assert.equal(rejected.hardPasses, 4);
});

test("commit wording gates reject lost compatibility context and invented claims", () => {
  const commitScenario = structuredClone(scenario);
  commitScenario.expect.findings = [];
  commitScenario.quality.orderedFindingSourceIds = [];
  commitScenario.expect.outcome = "satisfied";
  commitScenario.expect.requiredSummaryPatterns = ["^feat!:", "BREAKING CHANGE:.*page"];
  commitScenario.expect.forbiddenSummaryPatterns = ["tests pass"];
  const report = {
    selectedCapabilities: ["review-requirements"],
    outcome: "satisfied",
    findings: [],
    summary: "feat!: use cursors\n\nBREAKING CHANGE: replace page with cursor",
  };
  assert.deepEqual(evaluateScenarioReport(commitScenario, report, workspace), {
    hardErrors: [], qualityErrors: [],
  });
  report.summary = "feat!: use cursors\n\nTests pass";
  const result = evaluateScenarioReport(commitScenario, report, workspace);
  assert.deepEqual(result.hardErrors, [
    "summary must match BREAKING CHANGE:.*page",
    "summary must not match tests pass",
  ]);
});

test("invalid wording assertions fail scenario validation before model execution", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "prosto-wording-test-"));
  try {
    await cp("skills", path.join(root, "skills"), { recursive: true });
    await cp("tests", path.join(root, "tests"), { recursive: true });
    const file = path.join(root, "tests/evaluations/write-commit-message/staged-fix.json");
    const candidate = JSON.parse(await readFile(file, "utf8"));
    candidate.expect.requiredSummaryPatterns = ["["];
    candidate.expect.forbiddenSummaryPatterns = "not-an-array";
    await writeFile(file, JSON.stringify(candidate));
    await assert.rejects(loadEvaluationSuite(root, "write-commit-message"), (error) => {
      assert.match(error.message, /requiredSummaryPatterns must contain valid regular expressions/);
      assert.match(error.message, /forbiddenSummaryPatterns must be a string array/);
      return true;
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("harness output accepts plain, fenced, and OpenCode event JSON", () => {
  const report = {
    selectedCapabilities: [],
    outcome: "selection",
    findings: [],
    summary: "Use defect review.",
  };
  const json = JSON.stringify(report);

  assert.deepEqual(parseHarnessReport(json), report);
  assert.deepEqual(parseHarnessReport(`\`\`\`json\n${json}\n\`\`\``), report);
  assert.deepEqual(
    parseOpenCodeEvents(
      `${JSON.stringify({ type: "step_start", part: { type: "step-start" } })}\n${JSON.stringify({ type: "text", part: { type: "text", text: json } })}\n`,
    ),
    report,
  );
});

test("OpenCode separates progress from a complete final report without accepting stale reports", () => {
  const report = { selectedCapabilities: [], outcome: "selection", findings: [], summary: "Use the host." };
  const json = JSON.stringify(report);
  const events = (...texts) => texts.map((text) => JSON.stringify({
    type: "text", part: { type: "text", text },
  })).join("\n");

  assert.deepEqual(parseOpenCodeEvents(events("Inspecting the diff.", json)), report);
  assert.deepEqual(parseOpenCodeEvents(events("Inspecting.", json.slice(0, 30), json.slice(30))), report);
  assert.throws(() => parseOpenCodeEvents(events(json, "Final report failed.")), /no valid final report/);
  assert.throws(() => parseOpenCodeEvents(events('{"summary":"Incomplete"}')), /no valid final report/);
});

test("OpenCode evaluations discard ambient configuration and disable sharing", () => {
  const env = openCodeEnvironment("/tmp/evaluation", {
    PATH: "/usr/bin",
    OPENCODE_CONFIG: "/user/config.json",
    OPENCODE_CONFIG_DIR: "/user/agents",
    OPENCODE_CONFIG_CONTENT: '{"share":"auto"}',
    OPENCODE_PERMISSION: '{"*":"allow"}',
    OPENCODE_AUTO_SHARE: "true",
    XDG_CONFIG_HOME: "/user/config",
  });
  assert.equal(env.PATH, "/usr/bin");
  for (const key of ["OPENCODE_CONFIG", "OPENCODE_CONFIG_DIR", "OPENCODE_PERMISSION", "OPENCODE_AUTO_SHARE"]) {
    assert.equal(env[key], undefined);
  }
  assert.equal(env.XDG_CONFIG_HOME, "/tmp/evaluation/opencode-config");
  assert.equal(env.OPENCODE_DISABLE_CLAUDE_CODE, "true");
  assert.equal(env.OPENCODE_DISABLE_EXTERNAL_SKILLS, "true");
  assert.equal(env.OPENCODE_DISABLE_PROJECT_CONFIG, "true");
  assert.equal(env.OPENCODE_DISABLE_SHARE, "true");
  const config = JSON.parse(env.OPENCODE_CONFIG_CONTENT);
  assert.equal(config.share, "disabled");
  assert.equal(config.permission["*"], "deny");
  assert.equal(config.permission.read, "allow");
  assert.equal(config.lsp, false);
});
