import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const original = readFileSync(new URL("./fixtures/remove-missing/src/cart.js", import.meta.url), "utf8");

function run(source, expression) {
  const context = vm.createContext(Object.create(null), {
    codeGeneration: { strings: false, wasm: false },
  });
  return vm.runInContext(`${source}\n${expression}`, context, { timeout: 250 });
}

// Execute generated artificial slices with no host API and a per-call bound.
// This proves sampled helper behavior, not production integration or model execution.
export function checkRepair(id, summary) {
  if (!["remove-missing", "proof-limits"].includes(id)) return;
  const answer = JSON.parse(summary);
  if (id === "proof-limits") {
    assert.equal(answer.localCorrection, "verified");
    assert(answer.regressionEvidence.includes("P1"));
    assert(answer.affectedBehaviorEvidence.includes("P2"));
    assert.equal(answer.broadGate, "pre_existing_failure");
    assert.equal(answer.remoteIntegration, "unverified");
    assert.match(answer.limitation, /remote|real|integrat|service/i);
    assert.match(answer.limitation, /unverif|unavail|not|cannot|doesn.t|does not|only|fake/i);
    return;
  }
  assert.equal(answer.proofStatus, "not_run", "source generation is not executed proof");
  assert.equal(typeof answer.source, "string");
  assert.equal(typeof answer.regressionSource, "string");
  assert.match(answer.explanation, /-1|absent|missing|not found/i);
  for (const [ids, target, expected] of [
    [[], "missing", []],
    [["A", "B"], "missing", ["A", "B"]],
    [["A", "B", "C"], "A", ["B", "C"]],
    [["A", "B", "C"], "B", ["A", "C"]],
    [["A", "B", "C"], "C", ["A", "B"]],
    [["A", "B", "A"], "A", ["B", "A"]],
    [["", "Д", "x"], "Д", ["", "x"]],
  ]) {
    const expression = `(() => {
      const input = ${JSON.stringify(ids)}.map((id, index) => ({id, index, quantity: 3}));
      const result = removeLine(input, ${JSON.stringify(target)});
      return JSON.stringify({ids: result.map(line => line.id), fresh: result !== input,
        identities: result.every(line => input.includes(line)), input});
    })()`;
    assert.deepEqual(JSON.parse(run(answer.source, expression)), {
      ids: expected, fresh: true, identities: true,
      input: ids.map((id, index) => ({ id, index, quantity: 3 })),
    });
  }
  run(`${answer.source}\n${answer.regressionSource}`, "regression(removeLine)");
  assert.throws(() => run(`${original}\n${answer.regressionSource}`, "regression(removeLine)"),
    "regression must reject the original defect");
}
