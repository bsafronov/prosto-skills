#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { closeSync, mkdirSync, openSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildPacket,
  claimTask,
  commandFingerprint,
  isPidAlive,
  loadWorkflow,
  pathExists,
  readJson,
  readyTasks,
  recordReview,
  resolveInside,
  transitionTask,
  validateContractSources,
  validateWork,
  withWorkLock,
  writeJsonAtomic,
} from "./workflow-engine.mjs";

const scriptFile = fileURLToPath(import.meta.url);
const argv = process.argv.slice(2);
const command = argv.shift();
const options = parseOptions(argv);

if (!command || command === "help" || command === "--help" || command === "-h" || options.help) {
  printHelp();
  process.exit(0);
}

try {
  if (command === "__run-process") {
    await runProcessJob(required(options, "job"));
  } else {
    const workFile = path.resolve(required(options, "work"));
    await dispatch(command, workFile, options);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

async function dispatch(name, workFile, commandOptions) {
  switch (name) {
    case "validate":
      await validateCommand(workFile);
      break;
    case "ready":
      await readyCommand(workFile);
      break;
    case "packet":
      await packetCommand(workFile, commandOptions);
      break;
    case "transition":
      await transitionCommand(workFile, commandOptions);
      break;
    case "review":
      await reviewCommand(workFile, commandOptions);
      break;
    case "run":
      await runCommand(workFile, commandOptions);
      break;
    case "refresh":
      await refreshCommand(workFile, false);
      break;
    case "cancel":
      await cancelCommand(workFile, commandOptions);
      break;
    case "recover":
      await refreshCommand(workFile, true);
      break;
    default:
      throw new Error(`unknown command ${name}`);
  }
}

async function validateCommand(workFile) {
  const state = await loadValidated(workFile);
  print({ ok: true, workId: state.work.workId, tasks: state.work.tasks.length });
}

async function readyCommand(workFile) {
  const state = await loadValidated(workFile);
  print({
    workId: state.work.workId,
    status: state.work.status,
    ready: readyTasks(state.work),
    active: state.work.tasks
      .filter((task) => new Set(["claimed", "running"]).has(task.status))
      .map((task) => ({ id: task.id, kind: task.kind, status: task.status })),
    blocked: state.work.tasks
      .filter((task) => new Set(["blocked", "failed", "lost"]).has(task.status))
      .map((task) => ({ id: task.id, status: task.status, summary: task.result?.summary })),
  });
}

async function packetCommand(workFile, commandOptions) {
  const taskId = required(commandOptions, "task");
  const worker = required(commandOptions, "worker");
  const packet = await withWorkLock(workFile, async () => {
    const state = await loadValidated(workFile);
    const value = claimTask(state.work, state.contract, taskId, worker);
    await writeJsonAtomic(workFile, state.work);
    return value;
  });
  print(packet);
}

async function transitionCommand(workFile, commandOptions) {
  const taskId = required(commandOptions, "task");
  const status = required(commandOptions, "status");
  const output = await withWorkLock(workFile, async () => {
    const state = await loadValidated(workFile);
    const result = commandOptions.result
      ? await readJson(resolveInside(state.repositoryRoot, commandOptions.result))
      : {
          summary: commandOptions.summary,
          evidence: commandOptions.evidence ? arrayOption(commandOptions.evidence) : [],
        };
    const currentTask = state.work.tasks.find((candidate) => candidate.id === taskId);
    if (!currentTask) throw new Error(`unknown task ${taskId}`);
    if (status === "completed") {
      if (currentTask.kind === "process") {
        throw new Error(`process task ${taskId} completes through refresh`);
      }
      validateChangedPaths(state.work, currentTask, result, state.repositoryRoot);
      const checks = runChecks(currentTask.checks ?? [], state.repositoryRoot);
      const failedCheck = checks.find((check) => !check.ok);
      if (failedCheck) {
        throw new Error(`check failed: ${failedCheck.command.join(" ")}\n${failedCheck.output ?? ""}`.trim());
      }
      result.checks = checks;
      result.evidence = [
        ...(Array.isArray(result.evidence) ? result.evidence : []),
        ...checks.map((check) => `check passed: ${check.command.join(" ")}`),
      ];
    }
    const task = transitionTask(state.work, taskId, status, result);
    await writeJsonAtomic(workFile, state.work);
    return { workId: state.work.workId, workStatus: state.work.status, task };
  });
  print(output);
}

async function reviewCommand(workFile, commandOptions) {
  const output = await withWorkLock(workFile, async () => {
    const state = await loadValidated(workFile);
    const result = await readJson(resolveInside(state.repositoryRoot, required(commandOptions, "result")));
    const review = recordReview(state.work, result);
    await writeJsonAtomic(workFile, state.work);
    return { workId: state.work.workId, workStatus: state.work.status, review };
  });
  print(output);
}

async function runCommand(workFile, commandOptions) {
  const taskId = required(commandOptions, "task");
  const output = await withWorkLock(workFile, async () => {
    const state = await loadValidated(workFile);
    const task = state.work.tasks.find((candidate) => candidate.id === taskId);
    if (!task) throw new Error(`unknown task ${taskId}`);
    if (task.kind !== "process") throw new Error(`task ${taskId} is not a process task`);
    if (!readyTasks(state.work).some((candidate) => candidate.id === taskId)) {
      throw new Error(`task ${taskId} is not ready`);
    }

    const runtimeDirectory = path.join(state.workDirectory, ".runtime");
    await mkdir(runtimeDirectory, { recursive: true });
    const jobFile = path.join(runtimeDirectory, `${safeName(task.id)}.job.json`);
    const resultFile = path.join(runtimeDirectory, `${safeName(task.id)}.result.json`);
    const logFile = path.join(runtimeDirectory, `${safeName(task.id)}.log`);
    const cwd = resolveInside(state.repositoryRoot, task.cwd ?? ".");
    await writeJsonAtomic(jobFile, {
      command: task.command,
      cwd,
      logFile,
      resultFile,
    });

    const child = spawn(process.execPath, [scriptFile, "__run-process", "--job", jobFile], {
      cwd: state.repositoryRoot,
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });
    child.unref();

    task.status = "running";
    task.claim = {
      worker: commandOptions.worker ?? "local-process",
      claimedAt: new Date().toISOString(),
    };
    task.process = {
      pid: child.pid,
      startedAt: new Date().toISOString(),
      commandFingerprint: commandFingerprint(task.command),
      logPath: path.relative(state.workDirectory, logFile),
      resultPath: path.relative(state.workDirectory, resultFile),
    };
    state.work.status = "running";
    try {
      await writeJsonAtomic(workFile, state.work);
    } catch (error) {
      try {
        process.kill(child.pid, "SIGTERM");
      } catch {}
      throw error;
    }
    return {
      workId: state.work.workId,
      task: task.id,
      status: task.status,
      pid: child.pid,
      logPath: task.process.logPath,
    };
  });
  print(output);
}

async function refreshCommand(workFile, recover) {
  const output = await withWorkLock(
    workFile,
    async () => {
      const state = await loadValidated(workFile);
      const refreshed = await refreshProcesses(state);
      await writeJsonAtomic(workFile, state.work);
      return {
        workId: state.work.workId,
        status: state.work.status,
        refreshed,
        uncertainClaims: state.work.tasks
          .filter((task) => task.kind === "agent" && task.status === "claimed")
          .map((task) => ({ id: task.id, worker: task.claim?.worker })),
        ready: readyTasks(state.work),
      };
    },
    { recover },
  );
  print(output);
}

async function cancelCommand(workFile, commandOptions) {
  const taskId = required(commandOptions, "task");
  const output = await withWorkLock(workFile, async () => {
    const state = await loadValidated(workFile);
    const task = state.work.tasks.find((candidate) => candidate.id === taskId);
    if (!task) throw new Error(`unknown task ${taskId}`);
    if (task.kind !== "process" || task.status !== "running" || !task.process) {
      throw new Error(`task ${taskId} is not a running process task`);
    }
    if (isPidAlive(task.process.pid)) process.kill(task.process.pid, "SIGTERM");
    task.process.cancellationRequestedAt = new Date().toISOString();
    await writeJsonAtomic(workFile, state.work);
    return { workId: state.work.workId, task: task.id, status: "cancellation-requested" };
  });
  print(output);
}

async function refreshProcesses(state) {
  const refreshed = [];
  for (const task of state.work.tasks) {
    if (task.kind !== "process" || task.status !== "running" || !task.process) continue;
    const resultFile = path.resolve(state.workDirectory, task.process.resultPath);
    if (await pathExists(resultFile)) {
      const result = await readJson(resultFile);
      if (task.process.cancellationRequestedAt) {
        transitionTask(state.work, task.id, "cancelled", {
          summary: "Process cancelled",
          evidence: [`process result ${task.process.resultPath}`],
        });
        refreshed.push({ id: task.id, status: "cancelled" });
        continue;
      }
      if (result.exitCode !== 0 || result.error) {
        const tail = await logTail(state, task);
        transitionTask(state.work, task.id, "failed", {
          summary: result.error ?? `Process exited ${result.exitCode}${result.signal ? ` (${result.signal})` : ""}`,
          evidence: tail ? [tail] : [],
        });
        refreshed.push({ id: task.id, status: "failed", logPath: task.process.logPath });
        continue;
      }

      const outputEvidence = [];
      let missingOutput = null;
      for (const output of task.outputs ?? []) {
        const file = resolveInside(state.repositoryRoot, output.path);
        if (!(await pathExists(file))) {
          missingOutput = output.path;
          break;
        }
        outputEvidence.push(`output ${output.path} exists`);
      }
      const checks = missingOutput ? [] : runChecks(task.checks ?? [], state.repositoryRoot);
      const failedCheck = checks.find((check) => !check.ok);
      if (missingOutput || failedCheck) {
        const summary = missingOutput
          ? `Missing declared output ${missingOutput}`
          : `Check failed: ${failedCheck.command.join(" ")}`;
        transitionTask(state.work, task.id, "failed", {
          summary,
          checks,
          evidence: await evidenceWithLog(state, task, outputEvidence),
        });
        refreshed.push({ id: task.id, status: "failed", logPath: task.process.logPath });
        continue;
      }

      transitionTask(state.work, task.id, "completed", {
        summary: "Process and declared checks completed",
        checks,
        evidence: [
          `process exited 0`,
          ...outputEvidence,
          ...checks.map((check) => `check passed: ${check.command.join(" ")}`),
        ],
      });
      refreshed.push({ id: task.id, status: "completed" });
    } else if (!isPidAlive(task.process.pid)) {
      transitionTask(state.work, task.id, task.process.cancellationRequestedAt ? "cancelled" : "lost", {
        summary: task.process.cancellationRequestedAt
          ? "Process ended after cancellation"
          : "Process handle ended without a result record",
        evidence: [],
      });
      refreshed.push({ id: task.id, status: task.status, logPath: task.process.logPath });
    } else {
      refreshed.push({ id: task.id, status: "running" });
    }
  }
  return refreshed;
}

function runChecks(checks, repositoryRoot) {
  return checks.map((check) => {
    const cwd = resolveInside(repositoryRoot, check.cwd ?? ".");
    const result = spawnSync(check.command[0], check.command.slice(1), {
      cwd,
      shell: false,
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
      windowsHide: true,
    });
    return {
      command: check.command,
      ok: result.status === 0,
      status: result.status,
      signal: result.signal,
      output: result.status === 0 ? undefined : tail(`${result.stdout ?? ""}\n${result.stderr ?? ""}`),
    };
  });
}

async function runProcessJob(jobFile) {
  const job = await readJson(path.resolve(jobFile));
  mkdirSync(path.dirname(job.logFile), { recursive: true });
  const log = openSync(job.logFile, "a", 0o600);
  let child;
  let cancellationSignal = null;

  const result = await new Promise((resolve) => {
    try {
      child = spawn(job.command[0], job.command.slice(1), {
        cwd: job.cwd,
        shell: false,
        stdio: ["ignore", log, log],
        windowsHide: true,
      });
    } catch (error) {
      resolve({ exitCode: null, signal: null, error: error.message });
      return;
    }

    const forward = (signal) => {
      cancellationSignal = signal;
      if (child && !child.killed) child.kill(signal);
    };
    process.once("SIGTERM", () => forward("SIGTERM"));
    process.once("SIGINT", () => forward("SIGINT"));
    child.once("error", (error) => resolve({ exitCode: null, signal: null, error: error.message }));
    child.once("close", (exitCode, signal) => resolve({ exitCode, signal: signal ?? cancellationSignal }));
  });

  closeSync(log);
  await writeJsonAtomic(job.resultFile, { ...result, finishedAt: new Date().toISOString() });
}

async function loadValidated(workFile) {
  const state = await loadWorkflow(workFile);
  const rootErrors = validateRepositoryRoot(state);
  const sourceErrors = await validateContractSources(state.contract, state.repositoryRoot);
  const errors = [...rootErrors, ...validateWork(state.work, state.contract, state), ...sourceErrors];
  if (errors.length > 0) throw new Error(errors.join("\n"));
  return state;
}

function validateChangedPaths(work, task, result, repositoryRoot) {
  if (!Array.isArray(result.changedPaths)) {
    throw new Error(`completed agent task ${task.id} requires changedPaths array`);
  }
  const expansions = Array.isArray(result.scopeExpansions) ? result.scopeExpansions : [];
  for (const value of [...result.changedPaths, ...expansions]) {
    if (typeof value !== "string" || value.length === 0) {
      throw new Error("changedPaths and scopeExpansions must contain non-empty strings");
    }
    resolveInside(repositoryRoot, value);
  }

  const otherActiveScopes = work.tasks
    .filter((candidate) => candidate.id !== task.id && new Set(["claimed", "running"]).has(candidate.status))
    .flatMap((candidate) => candidate.scope ?? []);
  for (const expansion of expansions) {
    if (otherActiveScopes.some((scope) => scopesOverlap(expansion, scope))) {
      throw new Error(`scope expansion ${expansion} overlaps another active task`);
    }
  }
  for (const changedPath of result.changedPaths) {
    if (otherActiveScopes.some((scope) => scopeCovers(scope, changedPath))) {
      throw new Error(`changed path ${changedPath} overlaps another active task`);
    }
    const declared = (task.scope ?? []).some((scope) => scopeCovers(scope, changedPath));
    const expanded = expansions.some((scope) => scopeCovers(scope, changedPath));
    if (!declared && !expanded) {
      throw new Error(`changed path ${changedPath} is outside task ${task.id} scope`);
    }
  }
  task.scope = [...new Set([...(task.scope ?? []), ...expansions])];
}

function scopeCovers(scope, target) {
  const normalizedScope = normalizeScope(scope);
  const normalizedTarget = normalizeScope(target);
  if (normalizedScope === "") return true;
  return normalizedScope === normalizedTarget || normalizedTarget.startsWith(`${normalizedScope}/`);
}

function scopesOverlap(left, right) {
  return scopeCovers(left, right) || scopeCovers(right, left);
}

function normalizeScope(value) {
  const normalized = value.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/$/, "");
  return normalized === "." ? "" : normalized;
}

function validateRepositoryRoot(state) {
  const errors = [];
  const filesystemRoot = path.parse(state.repositoryRoot).root;
  if (state.repositoryRoot === filesystemRoot) errors.push("repositoryRoot cannot be a filesystem root");
  if (
    state.absoluteWorkFile !== state.repositoryRoot &&
    !state.absoluteWorkFile.startsWith(`${state.repositoryRoot}${path.sep}`)
  ) {
    errors.push("work file must remain inside repositoryRoot");
  }
  const git = spawnSync("git", ["-C", state.workDirectory, "rev-parse", "--show-toplevel"], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (git.status === 0 && path.resolve(git.stdout.trim()) !== state.repositoryRoot) {
    errors.push("repositoryRoot must match the Git repository root");
  }
  return errors;
}

async function logTail(state, task) {
  try {
    return `log tail:\n${tail(await readFile(path.resolve(state.workDirectory, task.process.logPath), "utf8"))}`;
  } catch {
    return "";
  }
}

async function evidenceWithLog(state, task, evidence) {
  const log = await logTail(state, task);
  return log ? [...evidence, log] : evidence;
}

function parseOptions(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) throw new Error(`unexpected argument ${value}`);
    const key = value.slice(2).replaceAll("-", "_");
    if (key === "help") {
      parsed.help = true;
      continue;
    }
    const next = values[index + 1];
    if (next === undefined || next.startsWith("--")) throw new Error(`missing value for ${value}`);
    if (parsed[key] === undefined) parsed[key] = next;
    else parsed[key] = [...arrayOption(parsed[key]), next];
    index += 1;
  }
  return parsed;
}

function arrayOption(value) {
  return Array.isArray(value) ? value : [value];
}

function required(commandOptions, key) {
  const value = commandOptions[key];
  if (typeof value !== "string" || value.length === 0) throw new Error(`--${key.replaceAll("_", "-")} is required`);
  return value;
}

function safeName(value) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function tail(value, limit = 4000) {
  return value.length <= limit ? value.trim() : value.slice(-limit).trim();
}

function print(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function printHelp() {
  process.stdout.write(`workctl manages one approved implementation run.\n\n`);
  process.stdout.write(`Usage: workctl.mjs <command> --work <path> [options]\n\n`);
  process.stdout.write(`Commands:\n`);
  process.stdout.write(`  validate                         Validate contract, state, graph, and coverage\n`);
  process.stdout.write(`  ready                            Show runnable, active, and blocked tasks\n`);
  process.stdout.write(`  packet --task ID --worker NAME   Atomically claim a task and emit its packet\n`);
  process.stdout.write(`  transition --task ID --status S  Record task result (--result FILE recommended)\n`);
  process.stdout.write(`  review --result FILE             Record one bounded final-review pass\n`);
  process.stdout.write(`  run --task ID                    Start an approved process task without waiting\n`);
  process.stdout.write(`  refresh                          Reconcile process results and declared outputs\n`);
  process.stdout.write(`  cancel --task ID                 Request cooperative process cancellation\n`);
  process.stdout.write(`  recover                          Recover stale lock and reconcile durable state\n`);
}
