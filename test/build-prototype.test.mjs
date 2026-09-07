import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { evaluateScenarioReport } from "../lib/evaluation.mjs";
import { checkPrototypeArtifact } from "../tests/evaluations/build-prototype/check-artifact.mjs";

const ledger = {
  source: `function simulate(mode, events) {
    const state = {free: 2, held: 3, sold: 0};
    for (const event of events) {
      if (event === "confirm") { state.sold += state.held; state.held = 0; }
      if (event === "expire") { state.free += mode === "proposal" ? 3 : state.held; state.held = 0; }
    }
    return state;
  }`,
  verdict: "rejected", basis: "analysis",
  limit: "Production timer, network, and storage behavior was not exercised.",
  run: 'Call simulate("proposal", ["expire", "expire"]); compare guarded.',
};
const persistence = {
  source: "function save(ids) { return JSON.stringify(ids); } function reload(serialized) { return JSON.parse(serialized); }",
  scope: "The caller writes the serialization only within prototypes/scratch-renewals.",
  reset: "Remove prototypes/scratch-renewals.",
  verdict: "Unresolved for disk/restart behavior; serialization round-trip is analyzable.",
  limit: "No disk restart or crash durability run was performed.",
};

async function errors(id, summary, mutated = false) {
  const scenario = JSON.parse(await readFile(`tests/evaluations/build-prototype/${id}.json`, "utf8"));
  const report = { selectedCapabilities: ["build-prototype"], outcome: "satisfied", findings: [], summary };
  const result = evaluateScenarioReport(scenario, report, { root: "/fixture", files: new Map() }, mutated);
  try { checkPrototypeArtifact(id, summary); } catch (error) { result.hardErrors.push(error.message); }
  return result.hardErrors;
}

test("prototype artifact checks execute event-order and fresh-instance behavior", async () => {
  assert.deepEqual(await errors("ledger-probe", JSON.stringify(ledger)), []);
  assert.deepEqual(await errors("persistence-scope", JSON.stringify(persistence)), []);
  const corruptions = [
    { ...ledger, source: ledger.source.replace('mode === "proposal" ? 3 : state.held', 'state.held') },
    { ...ledger, source: ledger.source.replace('mode === "proposal" ? 3 : state.held', '3') },
    { ...ledger, source: 'function simulate() { return {free: 2, held: 3, sold: 0}; }' },
    { ...ledger, source: 'Plan: create a state machine and test it.' },
    { ...ledger, verdict: "supported" },
    { ...ledger, basis: "executed" },
    { ...persistence, source: 'let current; function save(ids) { current = ids; return JSON.stringify(ids); } function reload() { return current; }' },
    { ...persistence, source: 'function save(ids) { return JSON.stringify([...new Set(ids)]); } function reload(s) { return JSON.parse(s); }' },
    { ...persistence, verdict: "Verified durable across production crashes" },
    { ...persistence, scope: "Write through the production billing client." },
    { ...persistence, reset: "Delete every saved draft." },
  ];
  for (const [index, artifact] of corruptions.entries()) {
    const id = index < 6 ? "ledger-probe" : "persistence-scope";
    assert((await errors(id, JSON.stringify(artifact))).length > 0, `must reject semantic corruption ${index}`);
  }
  assert((await errors("ledger-probe", JSON.stringify(ledger), true)).includes("workspace changed"));
});

test("prototype handover rejects invented preference, reliability, and adoption", async () => {
  const handover = `Artifact: prototypes/invoice-compare.html
Run/reset: Open in a browser; reload resets synthetic state.
Observed: Selecting I-17 updates both modes with 810 original and 180 corrected; mode switching preserves I-17.
Preference: Unresolved; no reviewer has tried the alternatives.
Reliability: Unresolved; no production backend or latency measurement was involved.
Adoption: Not performed.`;
  assert.deepEqual(await errors("ui-evidence-limit", handover), []);
  for (const [before, after] of [
    ["Preference: Unresolved", "Preference: Columns validated as easier"],
    ["Reliability: Unresolved", "Reliability: Production reliability proven"],
    ["Adoption: Not performed", "Adoption: Implemented"],
    ["810 original and 180 corrected", "810 original and 810 corrected"],
    ["prototypes/invoice-compare.html", "production/invoices.html"],
  ]) assert((await errors("ui-evidence-limit", handover.replace(before, after))).length > 0);
});
