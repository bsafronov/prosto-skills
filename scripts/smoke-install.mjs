#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { access, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const command = path.join(root, "node_modules", ".bin", "skills");
const experimental = ["write-skill", "evaluate-skill", "improve-skill"];

const normal = run({}, { allowEmpty: true });
for (const skill of experimental) {
  if (normal.includes(skill)) fail(`Experimental ${skill} leaked into normal Skills CLI discovery`);
}

const internal = run({ INSTALL_INTERNAL_SKILLS: "1" });
for (const skill of experimental) {
  if (!internal.includes(skill)) fail(`Internal Skills CLI discovery did not find ${skill}`);
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

  for (const skill of experimental) {
    const installedSkill = path.join(installRoot, ".agents/skills", skill, "SKILL.md");
    try {
      await access(installedSkill);
    } catch {
      fail(`Installed Skill is missing: ${installedSkill}`);
    }
  }
} finally {
  await rm(installRoot, { recursive: true, force: true });
}

console.log(
  "Skills CLI hides Experimental Skills normally, exposes them internally, and installs each atomic Skill.",
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
  console.error(message);
  process.exit(1);
}
