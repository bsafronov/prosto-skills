import assert from "node:assert/strict";
import vm from "node:vm";

// Execute only bounded artificial in-memory source. These checks establish local
// stage behavior; they cannot prove database transactions or real deployment.
export function checkMigrationArtifact(id, summary) {
  if (!["balance-transition", "authorized-contraction"].includes(id)) return;
  const artifact = JSON.parse(summary);
  assert.equal(typeof artifact.source, "string");
  assert.equal(typeof artifact.verification, "string");
  const evaluate = (expression) => JSON.parse(vm.runInContext(`${artifact.source}\nJSON.stringify(${expression})`,
    vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } }), { timeout: 250 }));
  if (id === "balance-transition") {
    for (const initial of [0, 120, -25]) {
      const result = evaluate(`(() => {
        const snapshot = value => JSON.parse(JSON.stringify(value));
        const rows = [{id:'a',balanceCents:${initial},note:'keep'}, {id:'b',balanceCents:19}];
        const first = rows[0], second = rows[1]; const before = snapshot(rows.map(row => readBalance({...row}))); let error;
        try { backfill(rows, 1); } catch (e) { error = e.message; }
        const partial = [Object.hasOwn(rows[0],'balance'),Object.hasOwn(rows[1],'balance')];
        rows[0].balanceCents = 777;
        const legacyChanged = snapshot(readBalance(rows[0]));
        writeBalance(rows[1], 251);
        const newWrite = snapshot([rows[1].balanceCents,readBalance(rows[1])]);
        backfill(rows); backfill(rows);
        const recovered = snapshot(rows.map(readBalance));
        const stored = snapshot(rows.map(r => r.balance));
        writeBalance(rows[0], -60); rows[1].balanceCents = 402;
        rollback(rows); rollback(rows);
        return {before,error,partial,legacyChanged,newWrite,recovered,stored,rows,
          identities:rows.length === 2 && rows[0] === first && rows[1] === second};
      })()`);
      assert.deepEqual(result.before, [{minor: initial, currency: "USD"}, {minor: 19, currency: "USD"}], "new readers work before backfill");
      assert.equal(result.error, "interrupted");
      assert.deepEqual(result.partial, [true, false], "interruption leaves observable partial progress");
      assert.deepEqual(result.legacyChanged, { minor: 777, currency: "USD" }, "legacy writes remain authoritative");
      assert.deepEqual(result.newWrite, [251, { minor: 251, currency: "USD" }], "new writes preserve both consumers");
      const balances = [{ minor: 777, currency: "USD" }, { minor: 251, currency: "USD" }];
      assert.deepEqual(result.recovered, balances);
      assert.deepEqual(result.stored, balances, "retry refreshes stale backfill without overwriting current writes");
      assert.deepEqual(result.rows, [{ id: "a", balanceCents: -60, note: "keep" }, { id: "b", balanceCents: 402 }], "rollback retains writes made during coexistence");
      assert.equal(result.identities, true);
    }
  } else {
    for (const minor of [0, -35, 892]) {
      const result = evaluate(`(() => {
        const rows = [{id:'a',balanceCents:12,balance:{minor:12,currency:'USD'},note:'keep'}];
        const original = rows[0]; contract(rows); contract(rows);
        const contracted = JSON.parse(JSON.stringify(rows));
        rows[0].balance.minor = ${minor}; rollback(rows); rollback(rows);
        return {contracted,rows,same:rows[0] === original};
      })()`);
      assert.deepEqual(result.contracted, [{ id: "a", balance: { minor: 12, currency: "USD" }, note: "keep" }], "execute the scoped obsolete-field removal");
      assert.deepEqual(result.rows, [{ id: "a", balance: { minor, currency: "USD" }, note: "keep", balanceCents: minor }], "rollback reconstructs legacy data from current new writes");
      assert.equal(result.same, true);
    }
  }
}
