#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildCatalogs } from "../lib/catalog.mjs";
import { exists } from "../lib/repository.mjs";

const check = process.argv.includes("--check");

try {
  const outputs = await buildCatalogs(process.cwd());
  if (outputs.length === 0) {
    console.log("No prosto-find Router; catalog generation is not active yet.");
  }

  for (const output of outputs) {
    const relative = path.relative(process.cwd(), output.file);
    if (check) {
      const current = (await exists(output.file)) ? await readFile(output.file, "utf8") : null;
      if (current !== output.content) {
        throw new Error(`${relative} is stale; run npm run generate`);
      }
      console.log(`Fresh: ${relative}`);
    } else {
      await mkdir(path.dirname(output.file), { recursive: true });
      await writeFile(output.file, output.content);
      console.log(`Generated: ${relative}`);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
