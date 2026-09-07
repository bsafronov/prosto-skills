#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { inspectRepository } from "../lib/repository.mjs";

const root = process.cwd();
const command = path.join(root, "node_modules", ".bin", "skills");
const repository = await inspectRepository(root);
if (repository.errors.length) fail(repository.errors.join("\n"));
const internalSkills = repository.skills.filter((skill) => skill.internal);

const normal = run({ INSTALL_INTERNAL_SKILLS: "" }, { allowEmpty: true });
for (const skill of repository.skills) {
  if (skill.internal && normal.includes(skill.name)) {
    fail(`Internal ${skill.name} leaked into normal Skills CLI discovery`);
  }
  if (!skill.internal && !normal.includes(skill.name)) {
    fail(`Normal Skills CLI discovery did not find ${skill.name}`);
  }
}

const internal = run({ INSTALL_INTERNAL_SKILLS: "1" });
for (const skill of repository.skills) {
  if (!internal.includes(skill.name)) fail(`Internal Skills CLI discovery did not find ${skill.name}`);
}

const installRoot = await mkdtemp(path.join(os.tmpdir(), "prosto-install-smoke-"));
try {
  const install = spawnSync(
    command,
    ["add", root, "--skill", "*", "--agent", "codex", "--copy", "-y"],
    {
      cwd: installRoot,
      env: { ...process.env, INSTALL_INTERNAL_SKILLS: "1", NO_COLOR: "1" },
      encoding: "utf8",
    },
  );
  if (install.status !== 0) {
    fail(`Skills CLI install exited ${install.status}:\n${install.stderr || install.stdout}`);
  }

  for (const skill of repository.skills) {
    for (const relative of await readdir(skill.directory, { recursive: true })) {
      const source = path.join(skill.directory, relative);
      if (!(await stat(source)).isFile()) continue;
      const installed = path.join(installRoot, ".agents/skills", skill.name, relative);
      let contents;
      try {
        contents = await readFile(installed);
      } catch (error) {
        throw new Error(`Installed Skill file is unreadable: ${installed}`, { cause: error });
      }
      if (!contents.equals(await readFile(source))) {
        throw new Error(`Installed Skill file differs from source: ${installed}`);
      }
    }
  }
} finally {
  await rm(installRoot, { recursive: true, force: true });
}

console.log(
  `Skills CLI hides ${internalSkills.length} internal Skills normally and installs all ${repository.skills.length} Skills with matching files.`,
);

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
  throw new Error(message);
}
