import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { evaluateScenarioReport } from "../lib/evaluation.mjs";

const workspace = { root: "/tmp/research-fixture", files: new Map() };
const controls = [
  {
    id: "versioned-answer",
    summary: "Delivery: At least once; duplicates can occur [contract](sources/current.md).\nOrdering: Within each stream with serial=true; no global order [contract](sources/current.md).\nRetry: 48 hours [contract](sources/current.md).\nAssessment: The newsletter is unsupported by its own primary source.",
    corruptions: [
      ["negated delivery contract", (s) => s.replace("At least once", "Not at least once")],
      ["unsupported delivery guarantee", (s) => s.replace("At least once; duplicates can occur", "Exactly once is guaranteed")],
      ["outdated retry window", (s) => s.replace("48 hours", "24 hours")],
      ["wrong delivery authority", (s) => s.replace("duplicates can occur [contract](sources/current.md)", "duplicates can occur [article](sources/article.md)")],
      ["missing ordering configuration", (s) => s.replace("with serial=true", "by default")],
      ["global ordering inflation", (s) => s.replace("no global order", "guaranteed global order")],
      ["unrequested implementation", (s) => s + "\nImplement the consumer with a new database."],
    ],
  },
  {
    id: "conflicting-contracts",
    summary: "Retention: Unresolved; 7 days in [API](sources/api.md) conflicts with 30 days in [operations](sources/operations.md) for the same scope.\nEncryption: AES-256 at rest [API](sources/api.md).\nResolution: Obtain an owner clarification of precedence or a deployed retention measurement.",
    corruptions: [
      ["recency invents certainty", (s) => s.replace("Unresolved; 7 days", "Supported; the newer 30-day policy supersedes 7 days")],
      ["conflict hides one primary source", (s) => s.replace("[API](sources/api.md) conflicts", "[newsletter](sources/press.md) conflicts")],
      ["wrong encryption source", (s) => s.replace("AES-256 at rest [API](sources/api.md)", "AES-256 at rest [operations](sources/operations.md)")],
      ["invented measurement", (s) => s.replace("Obtain an owner clarification of precedence or a deployed retention measurement", "An owner already confirmed 30 days from a deployed measurement")],
    ],
  },
  {
    id: "bounded-coverage",
    summary: "Measured: 40% lower peak memory for 20000 events in one warm-cache run [benchmark](sources/benchmark.md).\nIndependence: One experiment; the announcement repeats it [announcement](sources/announcement.md).\nLatency: Unresolved; the production appendix is inaccessible [access record](sources/access.md).\nCoverage: 3 requested documents, 2 retrieved documents, 1 unavailable document.\nConclusion: Evidence is limited to this benchmark; production p99 remains unresolved.",
    corruptions: [
      ["reversed empirical result", (s) => s.replace("40% lower peak memory", "40% higher peak memory")],
      ["invented certainty beneath unresolved label", (s) => s.replace("Unresolved; the production appendix is inaccessible", "Unresolved; production p99 is guaranteed faster")],
      ["inaccessible source treated as a negative finding", (s) => s.replace("Unresolved; the production appendix is inaccessible", "Contradicted; no production latency benefit exists")],
      ["wrong benchmark source", (s) => s.replace("[benchmark](sources/benchmark.md)", "[access](sources/access.md)")],
      ["duplicated reports become independent evidence", (s) => s.replace("One experiment; the announcement repeats it", "Two independent experiments agree")],
      ["erased population limit", (s) => s.replace("for 20000 events in one warm-cache run", "across all workloads")],
      ["invented complete coverage", (s) => s.replace("3 requested documents, 2 retrieved documents, 1 unavailable document", "3 requested documents, 3 retrieved documents, 0 unavailable documents")],
      ["research expands into an experiment", (s) => s + "\nRun a production benchmark before answering."],
    ],
  },
];

for (const control of controls) {
  test(`research assertions accept ${control.id} and reject semantic corruptions`, async () => {
    const scenario = JSON.parse(await readFile(`tests/evaluations/synthesize-evidence/${control.id}.json`, "utf8"));
    const report = { selectedCapabilities: ["synthesize-evidence"], outcome: "satisfied", findings: [], summary: control.summary };
    assert.deepEqual(evaluateScenarioReport(scenario, report, workspace), { hardErrors: [], qualityErrors: [] });
    const located = { ...report, summary: report.summary.replaceAll(".md)", ".md#L2-L4)") };
    assert.deepEqual(evaluateScenarioReport(scenario, located, workspace), { hardErrors: [], qualityErrors: [] });
    if (control.id === "versioned-answer") {
      const equivalent = { ...report, summary: report.summary.replace("no global order", "no cross-stream ordering").replace("Retry: 48 hours [contract](sources/current.md).", "Retry: 48 hours [contract](sources/current.md); the archived API 2.0 limit was 24 hours [archive](sources/archive.md).") };
      assert.deepEqual(evaluateScenarioReport(scenario, equivalent, workspace), { hardErrors: [], qualityErrors: [] });
    }
    if (control.id === "conflicting-contracts") {
      const absolute = { ...report, summary: report.summary.replaceAll("](sources/", "](/tmp/prosto-skill-eval-sample/workspace/sources/") };
      assert.deepEqual(evaluateScenarioReport(scenario, absolute, workspace), { hardErrors: [], qualityErrors: [] });
    }
    if (control.id === "bounded-coverage") {
      const equivalent = { ...report, summary: report.summary.replace("40% lower peak memory", "40% less peak memory").replace("One experiment; the announcement repeats it", "The announcement repeats LQ-17: one evidence chain rather than two independent observations").replace("[benchmark](sources/benchmark.md).", "[benchmark](sources/benchmark.md); this does not establish a general production guarantee.") };
      assert.deepEqual(evaluateScenarioReport(scenario, equivalent, workspace), { hardErrors: [], qualityErrors: [] });
    }
    for (const [label, corrupt] of control.corruptions) {
      const result = evaluateScenarioReport(scenario, { ...report, summary: corrupt(control.summary) }, workspace);
      assert(result.hardErrors.length > 0, `${control.id}: accepted ${label}`);
    }
    assert(evaluateScenarioReport(scenario, report, workspace, true).hardErrors.includes("workspace changed"));
  });
}
