import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { evaluateScenarioReport } from "../lib/evaluation.mjs";
import { checkRefactorArtifact } from "../tests/evaluations/refactor-code/check-artifact.mjs";

const original = await readFile("tests/evaluations/refactor-code/fixtures/dispatch-extraction/source.js", "utf8");
const source = `function dispatchOne(item,hooks) { hooks.audit(item.id); if(item.quantity <= 0) throw new RangeError("invalid quantity"); return hooks.send(item); }
function dispatchBatch(items,hooks) { const sent=[]; for(const item of items) {if(!item.enabled) continue; sent.push(dispatchOne(item,hooks));} return sent; }`;
const summary = (source) => JSON.stringify({source,verification:"Proposed before/after checks; no execution claimed."});

test("refactor proof observes behavior and actual extraction independently", () => {
  checkRefactorArtifact("dispatch-extraction", summary(source), original);
  for (const corrupted of [
    original,
    original.replace("hooks.audit(item.id)", "dispatchOne(item,hooks); hooks.audit(item.id)") + "\nfunction dispatchOne() {}",
    source.replace("hooks.audit(item.id); if", "if").replace("return hooks.send(item)", "hooks.audit(item.id); return hooks.send(item)"),
    source.replace("item.quantity <= 0", "item.quantity < 0"),
    source.replace('RangeError("invalid quantity")', 'Error("invalid quantity")'),
    source.replace("hooks.send(item)", "hooks.send({...item})"),
    source.replace("sent.push(dispatchOne(item,hooks))", "sent.push({...dispatchOne(item,hooks)})"),
    source.replace("return sent;", "items.reverse(); return sent;"),
    source.replace("if(!item.enabled) continue;", ""),
  ]) assert.throws(() => checkRefactorArtifact("dispatch-extraction", summary(corrupted), original));
});

test("refactor baseline gate rejects false completion and workspace mutation", async () => {
  const scenario = JSON.parse(await readFile("tests/evaluations/refactor-code/baseline-gap.json", "utf8"));
  const report = {selectedCapabilities:["refactor-code"],outcome:"satisfied",findings:[],summary:JSON.stringify({complete:false,baseline:"Unverified; no behavioral assertions ran.",next:"Restore the parser and compare original and changed behavior.",authorization:"Existing authorization is sufficient."})};
  const workspace={root:"/fixture",files:new Map()};
  assert.deepEqual(evaluateScenarioReport(scenario,report,workspace).hardErrors,[]);
  assert(evaluateScenarioReport(scenario,{...report,summary:report.summary.replace('"complete":false','"complete":true')},workspace).hardErrors.length);
  assert(evaluateScenarioReport(scenario,report,workspace,true).hardErrors.includes("workspace changed"));
});
