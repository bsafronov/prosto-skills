import assert from "node:assert/strict";

// Sampled causal claims from artificial evidence, not arbitrary diagnosis scoring.
export function checkDiagnosis(id, summary) {
  if (!["stale-completion", "missing-timing"].includes(id)) return;
  const answer = JSON.parse(summary);
  if (id === "stale-completion") {
    assert.equal(answer.status, "supported");
    assert.match(answer.mechanism, /stale|older|earlier|out.of.order|race/i);
    assert.match(answer.mechanism, /complet|respon|resolv|overwrit|assign/i);
    assert(answer.evidenceIds.includes("S1"));
    assert(answer.evidenceIds.includes("T2"));
    assert(answer.evidenceIds.includes("T3"));
    assert.match(answer.cacheConclusion, /bypass|disabled|not.*cache|cache.*not|ruled out/i);
    assert.equal(answer.contrast.olderLast, "Alpha");
    assert.equal(answer.contrast.newerLast, "Beta");
    assert.match(answer.scope, /diagnos|repair|fix|supplied|observed|reproduc/i);
  } else {
    assert.equal(answer.status, "unresolved");
    assert.equal(answer.mechanism, null);
    assert.equal(answer.repair, null);
    const hypotheses = answer.liveHypotheses.join(" ");
    assert.match(hypotheses, /queue|H1/i);
    assert.match(hypotheses, /DNS|resolver|H2/i);
    const observations = answer.nextObservation.measurements.join(" ");
    assert.match(observations, /queue|admission|admit/i);
    assert.match(observations, /DNS|resol/i);
    assert.match(answer.nextObservation.queuePrediction, /queue|admission|admit/i);
    assert.match(answer.nextObservation.queuePrediction, /long|slow|delay|high|(4|four)[\s-]*(s|second)|dominat/i);
    assert.match(answer.nextObservation.dnsPrediction, /DNS|resol/i);
    assert.match(answer.nextObservation.dnsPrediction, /long|slow|delay|high|(4|four)[\s-]*(s|second)|dominat/i);
  }
}
