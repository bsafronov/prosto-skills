import assert from "node:assert/strict";
import test from "node:test";
import {
  evaluateScenarioReport,
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
