#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const command = path.join(root, "node_modules", ".bin", "skills");

const normal = run({}, { allowEmpty: true });
if (normal.includes("prosto-write")) {
  fail("Experimental prosto-write leaked into normal Skills CLI discovery");
}

const internal = run({ INSTALL_INTERNAL_SKILLS: "1" });
if (!internal.includes("prosto-write")) {
  fail("Internal Skills CLI discovery did not find prosto-write");
}

console.log("Skills CLI discovery hides Experimental Skills normally and exposes them internally.");

function run(environment, options = {}) {
  const result = spawnSync(command, ["add", ".", "--list"], {
    cwd: root,
    env: { ...process.env, ...environment, NO_COLOR: "1" },
    encoding: "utf8",
  });
  const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  const expectedEmpty = options.allowEmpty && /No (?:valid )?skills found/i.test(output);
  if (result.status !== 0 && !expectedEmpty) {
    fail(`Skills CLI exited ${result.status}:\n${output.trim()}`);
  }
  return output;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
