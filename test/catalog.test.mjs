import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildCatalogs } from "../lib/catalog.mjs";

test("catalog generation separates public and internal Skills", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "prosto-catalog-test-"));
  try {
    await writeSkill(root, "prosto-find", "stable", "user");
    await writeSkill(root, "prosto-solve", "stable", "model");
    await writeSkill(root, "prosto-draft", "experimental", "model");

    const outputs = await buildCatalogs(root);
    assert.equal(outputs.length, 2);
    const publicCatalog = outputs.find((output) => output.file.endsWith("/catalog.md"));
    const internalCatalog = outputs.find((output) => output.file.endsWith("/catalog.internal.md"));

    assert.match(publicCatalog.content, /prosto-find/);
    assert.match(publicCatalog.content, /prosto-solve/);
    assert.doesNotMatch(publicCatalog.content, /prosto-draft/);
    assert.match(internalCatalog.content, /prosto-draft/);
    assert.match(internalCatalog.content, /experimental/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

async function writeSkill(root, name, maturity, invocation) {
  const base = maturity === "stable" ? "skills" : "skills/.experimental";
  const directory = path.join(root, base, name);
  await mkdir(path.join(directory, "agents"), { recursive: true });
  const internal = maturity === "stable" ? "" : "  internal: true\n";
  const disable = invocation === "user" ? "disable-model-invocation: true\n" : "";

  await writeFile(
    path.join(directory, "SKILL.md"),
    `---
name: ${name}
description: "Solve the focused ${name} catalog fixture when explicitly requested."
license: Apache-2.0
${disable}metadata:
${internal}  prosto:
    requires: []
    tags:
      - catalog
---

# ${name}

Complete this catalog fixture.
`,
  );
  await writeFile(
    path.join(directory, "agents/openai.yaml"),
    `interface:
  display_name: "${name}"
  short_description: "Solve a focused catalog fixture task"
  default_prompt: "Use $${name} for this catalog fixture."
policy:
  allow_implicit_invocation: ${invocation === "model"}
`,
  );

  const caseDirectory = path.join(root, "tests/cases", name);
  await mkdir(caseDirectory, { recursive: true });
  await writeFile(
    path.join(caseDirectory, "basic.md"),
    `---
type: outcome
skill: ${name}
---

## Given

A catalog fixture.

## When

The catalog is generated.

## Then

The Skill appears in its allowed catalog.
`,
  );
}
