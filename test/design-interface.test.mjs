import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { evaluateScenarioReport } from "../lib/evaluation.mjs";

const workspace = { root: "/tmp/design-interface-controls", files: new Map() };

async function check(id, summary, capabilities = ["design-interface"], mutated = false) {
  const scenario = JSON.parse(await readFile(
    `tests/evaluations/design-interface/${id}.json`, "utf8",
  ));
  return evaluateScenarioReport(scenario, {
    selectedCapabilities: capabilities,
    outcome: "satisfied",
    findings: [],
    summary,
  }, workspace, mutated).hardErrors;
}

test("interface payment assertions reject lost recovery and payment guarantees", async () => {
  const design = `Contract: submit(order): Promise<Paid | Pending> accepts stable requestId and amount.
Caller: await submit({ requestId: order.requestId, amount: order.amount }).
Ownership: Coordinator owns payment and receipt recovery; callers own order identity.
Retry: Reuse the same requestId across retries.
Timeout: Return pending while provider lookup cannot establish the outcome.
Persistence: Recover receipt persistence with lookup and putOnce after a successful charge, without another charge.
Notification: Keep the order paid if delivery fails.
Verification: Plan real gateway integration tests for idempotency plus receipt-write failures; none run.
Trade-off: Less caller duplication costs an explicit pending recovery state.`;
  assert.deepEqual(await check("payment-contract", design), []);
  assert.deepEqual(await check("payment-contract", design
    .replace("without another charge", "never charges under a different key")
    .replace("Keep the order paid if delivery fails", "Delivery failure still returns paid")), []);
  for (const corrupted of [
    design.replace("Reuse the same requestId", "Generate a new requestId"),
    design.replace("Reuse the same requestId", "Do not reuse the same requestId"),
    design.replace("Return pending", "Return an unpaid state"),
    design.replace("without another charge", "by charging again"),
    design.replace("without another charge", "do not prevent a second charge"),
    design.replace("Recover receipt persistence with lookup and putOnce after a successful charge, without another charge", "Abandon receipt persistence after a successful charge, without another charge"),
    design.replace("Keep the order paid if delivery fails", "Mark the order unpaid if delivery fails"),
    design.replace("real gateway integration tests", "mock-only tests"),
    design.replace("none run", "tests passed"),
  ]) assert((await check("payment-contract", corrupted)).length > 0, corrupted);
  assert((await check("payment-contract", design, ["design-interface"], true)).includes("workspace changed"));
});

test("interface lifecycle assertions reject hidden cancellation and abandoned cleanup", async () => {
  const design = `Contract: startExport(input): ExportHandle with result, cancel(), and dispose().
Caller: const job = startExport(input); try { await job.result; } finally { job.dispose(); }
Cancellation: Cancel prevents publication of late success.
Cleanup: Dispose releases the worker on completion, cancellation, failure, or tab close.
Failure: Encoder failure remains distinct from user cancellation.
Dependency: One production encoder; control completion and cancellation in focused tests.
Verification: Retain cancellation and teardown tests; plan real worker integration proof.
Trade-off: An explicit lifetime costs a handle but gives Stop and tab-close callers control.`;
  assert.deepEqual(await check("export-lifecycle", design), []);
  assert.deepEqual(await check("export-lifecycle", design
    .replace("Dispose releases the worker", "The export owns worker teardown")), []);
  for (const corrupted of [
    design.replace("Cancel prevents publication of late success", "Cancellation may publish late success"),
    design.replace("Cancel prevents publication of late success", "Do not suppress late success"),
    design.replace("Dispose releases the worker", "Never release the worker"),
    design.replace("Dispose releases the worker", "Skip worker teardown"),
    design.replace("Encoder failure remains distinct from user cancellation", "Cancellation is not distinct from encoder failure"),
    design.replace("One production encoder", "Require a second production encoder"),
    design.replace("Retain cancellation and teardown tests", "Delete cancellation and teardown tests"),
  ]) assert((await check("export-lifecycle", corrupted)).length > 0, corrupted);
});

test("interface assertions reject unnecessary facade ownership and false test-first evidence", async () => {
  const retained = `Recommendation: Keep formatPrice as the public operation.
Contract: formatPrice(amountMinor, currency, locale): string.
Caller: formatPrice(1200, 'USD', 'en-US').
Responsibility: Catalog loading, history pagination, and database setup remain separate.
Verification: Keep negative-amount and zero-decimal currency tests.
Trade-off: Keep the direct call; the facade adds database initialization without reducing duplication.`;
  assert.deepEqual(await check("retain-boundary", retained), []);
  assert.deepEqual(await check("retain-boundary", retained
    .replace("Keep formatPrice as the public operation", "Retain the standalone pure formatter")
    .replace("Catalog loading, history pagination, and database setup remain separate", "Catalog loading and history pagination retain their own lifecycle")), []);
  assert.deepEqual(await check("retain-boundary", retained.replace(
    "Catalog loading, history pagination, and database setup remain separate",
    "formatPrice owns formatting without I/O or lifecycle management",
  )), []);
  assert((await check("retain-boundary", retained.replace(
    "Keep formatPrice as the public operation", "Keep formatPrice but require database initialization",
  ))).length > 0);

  assert((await check("retain-boundary", retained.replace(
    "Catalog loading, history pagination, and database setup remain separate",
    "formatPrice owns database initialization, data retrieval, and formatting",
  ))).length > 0);

  const composition = `Contract: createCache(clock) exposes get(key) and put(key, value, expiresAt).
Caller: cache.put('a', 3, 10); cache.get('a').
Dependency: The cache owns its injected clock; ordinary callers supply only keys and values.
First slice: At now equal to expiresAt, expect a miss; run the test and observe the intended failure before implementing expiry and observing green. This is planned, not executed.`;
  const selected = ["design-interface", "implement-test-first"];
  assert.deepEqual(await check("compose-test-first", composition, selected), []);
  assert.deepEqual(await check("compose-test-first", composition.replace("expect a miss", "expect undefined"), selected), []);
  for (const separator of [" —", " (planned):"]) {
    const equivalent = composition.replace(/(Contract|Caller|Dependency|First slice):/g, `$1${separator}`);
    assert.deepEqual(await check("compose-test-first", equivalent, selected), []);
  }
  for (const corrupted of [
    composition.replace("expect a miss", "expect a hit"),
    composition.replace("This is planned, not executed", "Tests passed"),
  ]) assert((await check("compose-test-first", corrupted, selected)).length > 0, corrupted);
});
