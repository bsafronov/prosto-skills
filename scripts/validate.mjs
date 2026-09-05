#!/usr/bin/env node

import { assertValidRepository } from "../lib/repository.mjs";

try {
  const repository = await assertValidRepository(process.cwd());
  console.log(
    `Validated ${repository.skills.length} Skill(s) and ${repository.cases.length} case(s).`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
