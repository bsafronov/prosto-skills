import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const script = path.resolve("scripts/smoke-install.mjs");

test("installation smoke discovers future Skills and checks their complete contents", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "prosto-smoke-fixture-"));
  try {
    const skill = path.join(root, "skills/.experimental/future-outcome");
    await mkdir(path.join(skill, "agents"), { recursive: true });
    await mkdir(path.join(skill, "references"));
    await writeFile(path.join(skill, "SKILL.md"), `---
name: future-outcome
description: Complete a future fixture outcome. Use when the fixture needs completion. Do not use for unrelated work.
license: Apache-2.0
metadata:
  internal: true
---

# Future Outcome

Read [context](references/context.md) when fixture context is needed.
`);
    await writeFile(path.join(skill, "agents/openai.yaml"), `interface:
  display_name: "Future Outcome"
  short_description: "Complete a future fixture outcome"
  default_prompt: "Use $future-outcome to complete this fixture."
policy:
  allow_implicit_invocation: true
`);
    await writeFile(path.join(skill, "references/context.md"), "# Fixture context\n\nPreserve this supporting file.\n");
    const cases = path.join(root, "tests/cases/future-outcome");
    await mkdir(cases, { recursive: true });
    for (const type of ["trigger", "anti-trigger", "outcome"]) {
      await writeFile(path.join(cases, `${type}.md`), `---
type: ${type}
skill: future-outcome
---

## Given

A bounded fixture exists.

## When

Its outcome is requested.

## Then

The expected fixture boundary holds.
`);
    }
    const bin = path.join(root, "node_modules/.bin");
    await mkdir(bin, { recursive: true });
    await writeFile(path.join(bin, "skills"), `#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
if (process.argv.includes("--list")) {
  if (process.env.INSTALL_INTERNAL_SKILLS === "1") console.log("future-outcome");
  else { console.log("No skills found"); process.exitCode = 1; }
} else {
  const target = path.join(process.cwd(), ".agents/skills/future-outcome");
  fs.cpSync(path.join(process.argv[3], "skills/.experimental/future-outcome"), target, { recursive: true });
  if (process.env.PROSTO_SMOKE_FIXTURE === "omit-reference") fs.rmSync(path.join(target, "references/context.md"));
  if (process.env.PROSTO_SMOKE_FIXTURE === "alter-metadata") fs.appendFileSync(path.join(target, "agents/openai.yaml"), "# altered\\n");
}
`, { mode: 0o755 });

    for (const mode of ["complete", "omit-reference", "alter-metadata"]) {
      const result = spawnSync(process.execPath, [script], {
        cwd: root,
        env: { ...process.env, INSTALL_INTERNAL_SKILLS: "", PROSTO_SMOKE_FIXTURE: mode },
        encoding: "utf8",
      });
      const output = `${result.stdout}\n${result.stderr}`;
      if (mode === "complete") {
        assert.equal(result.status, 0, output);
        assert.match(output, /installs all 1 Skills with matching files/);
      } else {
        assert.notEqual(result.status, 0, output);
        assert.match(output, mode === "omit-reference" ? /file is unreadable/ : /file differs from source/);
      }
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
