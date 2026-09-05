#!/usr/bin/env node

import { evaluateSkill, listEvaluationSkills, loadEvaluationSuite } from "../lib/evaluation.mjs";

try {
  const options = parseArguments(process.argv.slice(2));
  const root = process.cwd();

  if (options.validateOnly) {
    const skills = options.skill ? [options.skill] : await listEvaluationSkills(root);
    if (skills.length === 0) throw new Error("No evaluation suites found");
    let scenarioCount = 0;
    for (const skill of skills) scenarioCount += (await loadEvaluationSuite(root, skill)).scenarios.length;
    console.log(`Validated ${skills.length} evaluation suite(s) and ${scenarioCount} scenario(s).`);
  } else {
    if (!options.skill) {
      throw new Error(
        "Usage: npm run evaluate -- <skill> [--harness codex|opencode] [--model <model>]",
      );
    }
    const result = await evaluateSkill({
      root,
      skillName: options.skill,
      runs: options.runs,
      model: options.model,
      harness: options.harness,
      scenarioIds: options.scenarios,
      onProgress: options.json
        ? undefined
        : ({ scenario, run, runs }) => console.log(`⏳ ${scenario} ${run}/${runs}`),
    });
    if (options.json) console.log(JSON.stringify(result, null, 2));
    else printResult(result);
    if (!result.passed) process.exitCode = 1;
  }
} catch (error) {
  console.error(`🔴 ${error.message}`);
  process.exitCode = 1;
}

function parseArguments(arguments_) {
  const options = {
    harness: "codex",
    json: false,
    model: undefined,
    runs: 5,
    scenarios: [],
    skill: undefined,
    validateOnly: false,
  };

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (argument === "--json") options.json = true;
    else if (argument === "--validate-only") options.validateOnly = true;
    else if (argument === "--harness") {
      options.harness = requiredValue(arguments_, ++index, argument);
    } else if (argument === "--model") options.model = requiredValue(arguments_, ++index, argument);
    else if (argument === "--runs") options.runs = Number(requiredValue(arguments_, ++index, argument));
    else if (argument === "--scenario") {
      options.scenarios.push(requiredValue(arguments_, ++index, argument));
    } else if (argument.startsWith("--")) throw new Error(`Unknown option ${argument}`);
    else if (!options.skill) options.skill = argument;
    else throw new Error(`Unexpected argument ${argument}`);
  }
  return options;
}

function requiredValue(arguments_, index, option) {
  const value = arguments_[index];
  if (!value || value.startsWith("--")) throw new Error(`${option} requires a value`);
  return value;
}

function printResult(result) {
  console.log(`${result.passed ? "✅" : "🔴"} ${result.skill} ${result.passed ? "passed" : "failed"}`);
  console.log(
    `${result.harness.name} ${result.harness.version} → ${result.model} → ${result.sourceRevision}`,
  );
  for (const scenario of result.scenarios) {
    console.log(
      `${scenario.passed ? "✅" : "🔴"} ${scenario.id} → hard ${scenario.hardPasses}/${scenario.total}, quality ${scenario.qualityPasses}/${scenario.total} (need ${scenario.qualityRequired})`,
    );
    for (const error of scenario.errors) console.log(`  ${error}`);
  }
}
