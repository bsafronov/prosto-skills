import assert from "node:assert/strict";
import vm from "node:vm";

// Artificial source only; no host APIs. The original fixture is the preservation
// oracle, and helper interception separately proves the requested extraction.
export function checkRefactorArtifact(id, summary, original) {
  if (id !== "dispatch-extraction") return;
  const artifact = JSON.parse(summary);
  assert.equal(typeof artifact.source, "string");
  assert.equal(typeof artifact.verification, "string");
  const scenarios = [
    [],
    [{ id: "skip", enabled: false, quantity: -1 }],
    [{ id: "one", enabled: true, quantity: 2 }],
    [{ id: "zero", enabled: true, quantity: 0 }, { id: "later", enabled: true, quantity: 4 }],
    [{ id: "negative", enabled: true, quantity: -2 }],
    [{ id: "a", enabled: true, quantity: 2 }, { id: "zero", enabled: true, quantity: 0 }, { id: "later", enabled: true, quantity: 1 }],
    [{ id: "a", enabled: 1, quantity: 1 }, { id: "b", enabled: true, quantity: 3 }],
    [{ id: "a", enabled: true, quantity: 2 }, { id: "skip", enabled: false, quantity: 0 }, { id: "b", enabled: true, quantity: 1 }],
  ];
  const invoke = (source, items, failure, intercept = false) => {
    const context = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
    return JSON.parse(vm.runInContext(`${source}
      (() => {
        const items = ${JSON.stringify(items)};
        const before = JSON.stringify(items);
        const trace = []; const sent = []; let calls = 0;
        ${intercept ? "const helper = dispatchOne; dispatchOne = (...args) => { calls++; return helper(...args); };" : ""}
        const hooks = {
          audit(id) { trace.push(['audit', id]); if (${JSON.stringify(failure)} === 'audit') throw new Error('audit down'); },
          send(item) {
            trace.push(['send', item.id, items.includes(item)]);
            if (${JSON.stringify(failure)} === 'send') throw new Error('send down');
            const receipt = {id: item.id}; sent.push(receipt); return receipt;
          }
        };
        let result; let error = null;
        try { result = dispatchBatch(items, hooks); } catch (e) { error = [e.name, e.message]; }
        return JSON.stringify({trace, error, result, sameReceipts: result ? result.every((x, i) => x === sent[i]) : null,
          unchanged: JSON.stringify(items) === before, calls});
      })()`, context, { timeout: 250 }));
  };
  for (const items of scenarios) {
    for (const failure of [null, "audit", "send"]) {
      const baseline = invoke(original, items, failure);
      const after = invoke(artifact.source, items, failure);
      assert.deepEqual(after, baseline, "results, identity, side effects, errors, order and input mutation must match the original");
    }
  }
  // Calling the helper independently distinguishes a real responsibility move
  // from a no-op helper call left next to the original inline implementation.
  const throughHelper = `${artifact.source}
dispatchBatch = (items, hooks) => {
    const sent = []; for (const item of items) {
      if (item.enabled) sent.push(dispatchOne(item, hooks));
    } return sent;
  };`;
  for (const items of [scenarios[2], scenarios[3]]) {
    for (const failure of [null, "audit", "send"]) {
      assert.deepEqual(invoke(throughHelper, items, failure), invoke(original, items, failure),
        "dispatchOne owns audit, validation and sending independently");
    }
  }
  const intercepted = invoke(artifact.source, scenarios[6], null, true);
  assert.equal(intercepted.calls, 2, "dispatchBatch must use the extracted dispatchOne");
  assert.equal(invoke(artifact.source, scenarios[1], null, true).calls, 0, "disabled filtering stays in dispatchBatch");
}
