import assert from "node:assert/strict";
import vm from "node:vm";

// Candidate-specific checks of returned artifact slices, not a shared harness
// extension. Each call gets a fresh context without host APIs; source is bounded
// artificial evaluation output. This checks executed behavior, not code spelling.
export function checkPrototypeArtifact(id, summary) {
  if (!["ledger-probe", "persistence-scope"].includes(id)) return;
  const artifact = JSON.parse(summary);
  assert.equal(typeof artifact.source, "string", "artifact must contain source");
  assert(artifact.source.trim(), "artifact source cannot be empty");
  const evaluate = (expression) => {
    const context = vm.createContext(Object.create(null), {
      codeGeneration: { strings: false, wasm: false },
    });
    return JSON.parse(
      vm.runInContext(`${artifact.source}\nJSON.stringify(${expression})`, context, { timeout: 250 }),
    );
  };

  if (id === "ledger-probe") {
    assert.equal(artifact.verdict, "rejected", "the proposed conservation claim is false");
    assert.equal(artifact.basis, "analysis", "do not claim a model-executed run");
    let sequences = [[]];
    for (let length = 1; length <= 4; length++) {
      sequences = sequences.concat(
        sequences.filter((events) => events.length === length - 1)
          .flatMap((events) => [events.concat("confirm"), events.concat("expire")]),
      );
    }
    for (const events of sequences) {
      for (const mode of ["proposal", "guarded"]) {
        const result = evaluate(`simulate(${JSON.stringify(mode)}, ${JSON.stringify(events)})`);
        // Independent event accounting: confirmation can sell only the original
        // live hold; expiry before confirmation releases it. The proposal adds
        // three for every expiry, including stale events.
        const first = events[0];
        const expected = {
          free: mode === "proposal"
            ? 2 + 3 * events.filter((event) => event === "expire").length
            : first === "expire" ? 5 : 2,
          held: events.length === 0 ? 3 : 0,
          sold: first === "confirm" ? 3 : 0,
        };
        assert.deepEqual(result, expected, `${mode} must preserve the model for ${events.join(",")}`);
        if (mode === "guarded") assert.equal(result.free + result.held + result.sold, 5);
      }
    }
    const rerun = evaluate('[simulate("guarded", ["expire"]), simulate("guarded", [])]');
    assert.deepEqual(rerun[1], { free: 2, held: 3, sold: 0 }, "each experiment must reset");
  } else {
    for (const ids of [[], ["D-4", "D-9"], ["D-\\\"8", "Д-5", "D-4", "D-4"]]) {
      const serialized = evaluate(`save(${JSON.stringify(ids)})`);
      assert.equal(typeof serialized, "string", "save must produce portable serialized data");
      assert.deepEqual(JSON.parse(serialized), ids, "save must preserve every draft ID");
      // A fresh VM prevents accidental reliance on the previous instance's memory.
      assert.deepEqual(evaluate(`reload(${JSON.stringify(serialized)})`), ids);
    }
    assert.match(artifact.verdict, /^Unresolved\b/, "disk/restart evidence is still absent");
    assert.match(artifact.scope, /prototypes\/scratch-renewals/, "scope must name the authorized scratch path");
    assert.match(artifact.reset, /prototypes\/scratch-renewals/, "reset must name the authorized scratch path");
  }
}
