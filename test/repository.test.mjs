import assert from "node:assert/strict";
import { appendFile, mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { inspectRepository } from "../lib/repository.mjs";

test("the repository satisfies its own contract", async () => {
  const repository = await inspectRepository(process.cwd());
  assert.deepEqual(repository.errors, []);
  assert.equal(repository.skills.length, 3);
  assert.equal(repository.cases.length, 15);
});

test("Peer graph rejects missing Peers, cycles, and unstable closure", async (t) => {
  await t.test("missing Peer", async () => {
    await withFixture(async (root) => {
      await writeSkill(root, {
        name: "prosto-compose",
        maturity: "experimental",
        requires: ["prosto-missing"],
      });
      const { errors } = await inspectRepository(root);
      assert(errors.some((error) => error.includes("required Peer prosto-missing does not exist")));
    });
  });

  await t.test("cycle", async () => {
    await withFixture(async (root) => {
      await writeSkill(root, {
        name: "prosto-write",
        maturity: "experimental",
        requires: ["prosto-review"],
      });
      await writeSkill(root, {
        name: "prosto-review",
        maturity: "experimental",
        requires: ["prosto-write"],
      });
      const { errors } = await inspectRepository(root);
      assert(errors.some((error) => error.includes("dependency cycle")));
    });
  });

  await t.test("Stable Peer Closure", async () => {
    await withFixture(async (root) => {
      await writeSkill(root, {
        name: "prosto-compose",
        maturity: "stable",
        requires: ["prosto-write"],
      });
      await writeSkill(root, { name: "prosto-write", maturity: "experimental" });
      const { errors } = await inspectRepository(root);
      assert(
        errors.some((error) =>
          error.includes("Stable Skill cannot require experimental Peer prosto-write"),
        ),
      );
    });
  });
});

test("required Peers must be model-invoked and harness controls must agree", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, {
      name: "prosto-compose",
      maturity: "experimental",
      requires: ["prosto-route"],
    });
    await writeSkill(root, {
      name: "prosto-route",
      maturity: "experimental",
      invocation: "user",
    });
    await writeSkill(root, {
      name: "prosto-write",
      maturity: "experimental",
      openaiInvocation: "user",
    });

    const { errors } = await inspectRepository(root);
    assert(errors.some((error) => error.includes("required Peer prosto-route must be model-invoked")));
    assert(errors.some((error) => error.includes("invocation conflict")));
  });
});

test("Flows contain ordered user-invoked Skills", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, { name: "prosto-find", maturity: "stable", invocation: "user" });
    await writeSkill(root, { name: "prosto-write", maturity: "stable" });
    await mkdir(path.join(root, "flows"), { recursive: true });
    await writeFile(
      path.join(root, "flows", "write-better.md"),
      `---
name: write-better
description: Improve an agent-facing document.
skills:
  - prosto-find
  - prosto-write
---

Start with routing, then hand the selected target to the writer.
`,
    );

    const { errors } = await inspectRepository(root);
    assert(errors.some((error) => error.includes("Flow step prosto-write must be user-invoked")));
  });
});

test("behavior cases require ordered Given, When, and Then sections", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, { name: "prosto-write", maturity: "experimental" });
    const file = path.join(root, "tests/cases/prosto-write/broken.md");
    await writeFile(
      file,
      `---
type: outcome
skill: prosto-write
---

## Given

Something exists.

## Then

It changes.
`,
    );
    const { errors } = await inspectRepository(root);
    assert(errors.some((error) => error.includes("requires ordered Given, When, and Then")));
  });
});

test("Skill references require valid local links and incoming Context Pointers", async () => {
  await withFixture(async (root) => {
    await writeSkill(root, { name: "prosto-write", maturity: "experimental" });
    const directory = path.join(root, "skills/.experimental/prosto-write");
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

  const internal = maturity === "stable" ? "" : "  internal: true\n";
  const disable = invocation === "user" ? "disable-model-invocation: true\n" : "";
  const required = requires.length
    ? `\n${requires.map((peer) => `      - ${peer}`).join("\n")}`
    : " []";

  await writeFile(
    path.join(directory, "SKILL.md"),
    `---
name: ${name}
description: "Perform a focused test capability when repository fixtures need it."
license: Apache-2.0
${disable}metadata:
${internal}  prosto:
    requires:${required}
    tags:
      - testing
---

# ${name}

Perform the focused fixture behavior.
`,
  );
  await writeFile(
    path.join(directory, "agents/openai.yaml"),
    `interface:
  display_name: "${name}"
  short_description: "Perform a focused fixture capability"
  default_prompt: "Use $${name} to exercise this fixture."
policy:
  allow_implicit_invocation: ${openaiInvocation === "model"}
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

A fixture.

## When

It runs.

## Then

It behaves.
`,
  );
}
