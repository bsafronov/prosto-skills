import assert from "node:assert/strict";
import test from "node:test";
import { checkDiagnosis } from "../tests/evaluations/investigate-bug/check-diagnosis.mjs";
import { checkRepair } from "../tests/evaluations/fix-bug/check-repair.mjs";

const stale = {
  status: "supported", mechanism: "An older completion overwrites the later selected record.",
  evidenceIds: ["S1", "T2", "T3"], cacheConclusion: "Cache was bypassed in this reproduction.",
  contrast: { olderLast: "Alpha", newerLast: "Beta" }, scope: "Diagnosis of supplied reproduction only.",
};
const missing = {
  status: "unresolved", mechanism: null, liveHypotheses: ["H1 queue delay", "H2 DNS delay"],
  nextObservation: { measurements: ["queue admission interval", "DNS start and end"],
    queuePrediction: "Long queue admission with fast DNS.", dnsPrediction: "Prompt admission with slow DNS." },
  repair: null,
};
const repaired = {
  source: "function removeLine(lines,id) { const copy=lines.slice(); const index=lines.findIndex(line=>line.id===id); if(index>=0) copy.splice(index,1); return copy; }",
  regressionSource: "function regression(removeLine) { const rows=[{id:'A'},{id:'B'}]; const actual=removeLine(rows,'missing'); if(actual.length!==2 || actual[0]!==rows[0] || actual[1]!==rows[1]) throw Error('missing ID changed contents'); }",
  proofStatus: "not_run", explanation: "An absent ID returns -1, so guard removal at the shared helper.",
};
const limits = {
  localCorrection: "verified", regressionEvidence: ["P1"], affectedBehaviorEvidence: ["P2"],
  broadGate: "pre_existing_failure", remoteIntegration: "unverified",
  limitation: "The real remote service is unavailable; a fake cannot establish integration behavior.",
};
function corrupt(check, id, base, change) {
  const copy = structuredClone(base); change(copy);
  assert.throws(() => check(id, JSON.stringify(copy)));
}

test("diagnosis controls accept evidence-backed conclusions and unresolved discrimination", () => {
  checkDiagnosis("stale-completion", JSON.stringify(stale));
  checkDiagnosis("missing-timing", JSON.stringify(missing));
  checkDiagnosis("missing-timing", JSON.stringify({ ...missing, nextObservation: {
    ...missing.nextObservation,
    queuePrediction: "The approximately four-second gap occurs before queue admission; DNS start-to-end remains short.",
    dnsPrediction: "Queue admission occurs promptly; a four-second gap occurs between DNS start and end.",
  } }));
  checkDiagnosis("stale-completion", JSON.stringify({ ...stale, mechanism: "A race lets an earlier response assign the displayed record." }));
});

test("diagnosis controls reject unsupported causes, lost contrast, and invented repair", () => {
  for (const change of [
    a => { a.status = "unresolved"; },
    a => { a.mechanism = "The queue is saturated."; },
    a => { a.evidenceIds = ["S1", "T2"]; },
    a => { a.contrast.olderLast = "Beta"; },
    a => { a.cacheConclusion = "Cache corruption is established."; },
  ]) corrupt(checkDiagnosis, "stale-completion", stale, change);
  for (const change of [
    a => { a.status = "supported"; a.mechanism = "DNS stalls"; },
    a => { a.repair = "Add retry timeout"; },
    a => { a.liveHypotheses = ["H1"]; },
    a => { a.nextObservation.measurements = ["total duration"]; },
    a => { a.nextObservation.dnsPrediction = "No conclusion."; },
  ]) corrupt(checkDiagnosis, "missing-timing", missing, change);
});

test("repair controls execute correction and independently falsify original", () => {
  checkRepair("remove-missing", JSON.stringify(repaired));
  checkRepair("proof-limits", JSON.stringify(limits));
  checkRepair("remove-missing", JSON.stringify({ ...repaired,
    source: "function removeLine(lines,id) { let removed=false; return lines.filter(line=>{if(!removed && line.id===id){removed=true;return false;}return true;}); }" }));
});

test("repair controls reject symptom preservation, behavior loss, and vacuous proof", () => {
  for (const change of [
    a => { a.source = "function removeLine(lines,id) { const copy=lines.slice();copy.splice(lines.findIndex(line=>line.id===id),1);return copy; }"; },
    a => { a.source = "function removeLine(lines,id) { return lines.filter(line=>line.id!==id); }"; },
    a => { a.source = "function removeLine(lines,id) { return lines; }"; },
    a => { a.source = "function removeLine(lines,id) { const i=lines.findIndex(line=>line.id===id);if(i>=0)lines.splice(i,1);return lines.slice(); }"; },
    a => { a.source = "function removeLine(lines,id) { let removed=false;return lines.filter(line=>{if(!removed&&line.id===id){removed=true;return false;}return true;}).map(line=>({...line})); }"; },
    a => { a.source = "function removeLine(lines,id) { if(lines[0]) lines[0].quantity=99; const copy=lines.slice();const i=lines.findIndex(line=>line.id===id);if(i>=0)copy.splice(i,1);return copy; }"; },
    a => { a.regressionSource = "function regression(removeLine) {}"; },
    a => { a.regressionSource = "function regression(removeLine) { throw Error('always'); }"; },
    a => { a.proofStatus = "executed"; },
  ]) corrupt(checkRepair, "remove-missing", repaired, change);
  for (const change of [
    a => { a.broadGate = "passed"; },
    a => { a.broadGate = "new_failure"; },
    a => { a.remoteIntegration = "verified"; },
    a => { a.regressionEvidence = []; },
    a => { a.affectedBehaviorEvidence = []; },
  ]) corrupt(checkRepair, "proof-limits", limits, change);
});
