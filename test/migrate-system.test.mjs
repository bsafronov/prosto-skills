import assert from "node:assert/strict";
import test from "node:test";
import { checkMigrationArtifact } from "../tests/evaluations/migrate-system/check-artifact.mjs";

const transition = `function readBalance(row){return {minor:row.balanceCents,currency:'USD'};}
function writeBalance(row,minor){row.balanceCents=minor;row.balance={minor,currency:'USD'};}
function backfill(rows,stopAfter){let processed=0;for(const row of rows){row.balance=readBalance(row);processed++;if(processed===stopAfter)throw new Error('interrupted');}}
function rollback(rows){for(const row of rows)delete row.balance;}`;
const contraction = `function contract(rows){for(const row of rows)delete row.balanceCents;}
function rollback(rows){for(const row of rows)row.balanceCents=row.balance.minor;}`;
const summary = (source) => JSON.stringify({source,verification:"Only an in-memory artifact; deployment and storage remain unproved."});

test("migration artifact controls reject lost coexistence, progress and rollback data", () => {
  checkMigrationArtifact("balance-transition", summary(transition));
  const inPlace = transition.replace("row.balance={minor,currency:'USD'}", "row.balance ??= {};row.balance.minor=minor;row.balance.currency='USD'");
  checkMigrationArtifact("balance-transition", summary(inPlace));
  checkMigrationArtifact("balance-transition", summary(inPlace.replace("return {minor:row.balanceCents,currency:'USD'}", "row.balance={minor:row.balanceCents,currency:'USD'};return row.balance")));
  for (const source of [
    transition.replace("minor:row.balanceCents", "minor:row.balance?.minor ?? row.balanceCents"),
    transition.replace("row.balanceCents=minor;", ""),
    transition.replace("row.balance=readBalance(row)", "row.balance ??= readBalance(row)"),
    transition.replace("if(processed===stopAfter)throw new Error('interrupted');", ""),
    transition.replace("delete row.balance;", "{row.balanceCents=row.balance?.minor;delete row.balance;}"),
    transition.replace("delete row.balance;", "{delete row.balance;delete row.note;}"),
  ]) {
    assert.throws(() => checkMigrationArtifact("balance-transition", summary(source)));
  }
  assert.throws(() => checkMigrationArtifact("balance-transition", summary(transition.replace("let processed=0;", "rows.push({id:'extra',balanceCents:0});let processed=0;"))));
});

test("authorized contraction executes only scoped removal and preserves later writes on rollback", () => {
  checkMigrationArtifact("authorized-contraction", summary(contraction));
  for (const source of [
    contraction.replace("delete row.balanceCents", "void row.balanceCents"),
    contraction.replace("delete row.balanceCents", "delete row.balance"),
    contraction.replace("row.balanceCents=row.balance.minor", "row.balanceCents=12"),
    contraction.replace("row.balanceCents=row.balance.minor", "row.balanceCents=row.balance.minor;for(const row of rows)delete row.note"),
    "Wait for approval before implementing this already authorized phase.",
  ]) assert.throws(() => checkMigrationArtifact("authorized-contraction", summary(source)));
});
