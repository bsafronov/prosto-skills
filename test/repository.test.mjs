import assert from "node:assert/strict";
import { appendFile, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { inspectRepository } from "../lib/repository.mjs";

test("the repository satisfies its own contract", async () => {
  const repository = await inspectRepository(process.cwd());
  assert.deepEqual(repository.errors, []);
  assert.equal(repository.skills.length, 16);
  assert.equal(repository.cases.length, 128);
});

test("Skill names are unprefixed verb-object names and cannot collide", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, { name: "writer", maturity: "experimental" });
    await writeSkill(root, { name: "prosto-write", maturity: "experimental" });
    await writeSkill(root, { name: "write-skill", maturity: "experimental" });
    await writeSkill(root, { name: "write-skill", maturity: "system" });

    const { errors } = await inspectRepository(root);
    assert(errors.some((error) => error.includes("lowercase verb-object name")));
    assert(errors.some((error) => error.includes("duplicate Skill name")));
  });
});

test("Skill descriptions require selection boundaries and hard dependencies are rejected", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, {
      name: "write-skill",
      maturity: "experimental",
      description: "Write a reusable Skill.",
      requires: ["evaluate-skill"],
    });

    const { errors } = await inspectRepository(root);
    assert(errors.some((error) => error.includes("both Use when and Do not use boundaries")));
    assert(errors.some((error) => error.includes("hard Skill dependencies are not supported")));
  });
});

test("invocation controls must agree across harness metadata", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, {
      name: "write-skill",
      maturity: "experimental",
      openaiInvocation: "user",
    });

    const { errors } = await inspectRepository(root);
    assert(errors.some((error) => error.includes("invocation conflict")));
  });
});

test("model-invoked Skills require selection, rejection, and outcome cases", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, {
      name: "write-skill",
      maturity: "experimental",
      caseTypes: ["outcome"],
    });

    const { errors } = await inspectRepository(root);
    assert(errors.some((error) => error.includes("requires a trigger case")));
    assert(errors.some((error) => error.includes("requires an anti-trigger case")));
  });
});

test("user-invoked Skills require only an outcome case", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, {
      name: "improve-skill",
      maturity: "experimental",
      invocation: "user",
      caseTypes: ["outcome"],
    });

    const { errors } = await inspectRepository(root);
    assert.deepEqual(errors, []);
  });
});

test("behavior cases allow composition and require ordered Given, When, and Then", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, {
      name: "write-skill",
      maturity: "experimental",
      caseTypes: ["trigger", "anti-trigger", "outcome", "composition"],
    });
    const file = path.join(root, "tests/cases/write-skill/broken.md");
    await writeFile(
      file,
      `---
type: composition
skill: write-skill
---

## Given

Something exists.

## Then

It changes.
`,
    );

    const { errors } = await inspectRepository(root);
    assert(errors.some((error) => error.includes("requires ordered Given, When, and Then")));
    assert(!errors.some((error) => error.includes("type must be")));
  });
});

test("Skill references require valid local links and incoming Context Pointers", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, { name: "write-skill", maturity: "experimental" });
    const directory = path.join(root, "skills/.experimental/write-skill");
    await mkdir(path.join(directory, "references"), { recursive: true });
    await appendFile(
      path.join(directory, "SKILL.md"),
      "\nRead [missing guidance](references/missing.md) when the missing branch applies.\n",
    );
    await writeFile(path.join(directory, "references/orphan.md"), "# Orphan\n");

    const { errors } = await inspectRepository(root);
    assert(errors.some((error) => error.includes("broken local link references/missing.md")));
    assert(errors.some((error) => error.includes("has no incoming Context Pointer")));
  });
});

async function withFixture(callback) {
  const root = await mkdtemp(path.join(os.tmpdir(), "prosto-skills-test-"));
  try {
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function writeSkill(
  root,
  {
    name,
    maturity,
    invocation = "model",
    openaiInvocation = invocation,
    caseTypes = ["trigger", "anti-trigger", "outcome"],
    description = "Perform one focused fixture outcome. Use when fixtures need this behavior. Do not use for unrelated work.",
    requires = [],
  },
) {
  const base =
    maturity === "stable"
      ? "skills"
      : maturity === "system"
        ? "skills/.system"
        : "skills/.experimental";
  const directory = path.join(root, base, name);
  await mkdir(path.join(directory, "agents"), { recursive: true });

  const disable = invocation === "user" ? "disable-model-invocation: true\n" : "";
  const internal = maturity === "stable" ? "" : "  internal: true\n";
  const dependency = requires.length
    ? `  prosto:\n    requires:\n${requires.map((skill) => `      - ${skill}`).join("\n")}\n`
    : "";
  const metadata = internal || dependency ? `metadata:\n${internal}${dependency}` : "";
  await writeFile(
    path.join(directory, "SKILL.md"),
    `---
name: ${name}
description: "${description}"
license: Apache-2.0
${disable}${metadata}---

# ${name}

Perform the focused fixture behavior.
`,
  );
  await writeFile(
    path.join(directory, "agents/openai.yaml"),
    `interface:
  display_name: "${name}"
  short_description: "Perform one focused fixture outcome"
  default_prompt: "Use $${name} to exercise this fixture."
policy:
  allow_implicit_invocation: ${openaiInvocation === "model"}
`,
  );

  const caseDirectory = path.join(root, "tests/cases", name);
  await mkdir(caseDirectory, { recursive: true });
  for (const type of caseTypes) {
    await writeFile(
      path.join(caseDirectory, `${type}.md`),
      `---
type: ${type}
skill: ${name}
---

## Given

A fixture.

## When

It runs.

## Then

It behaves.
`,
    );
  }
}
