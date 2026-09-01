import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export const CONTRACT_SCHEMA_VERSION = 1;
export const WORK_SCHEMA_VERSION = 1;

const WORK_STATUSES = new Set([
  "approved",
  "running",
  "paused",
  "blocked",
  "review",
  "completed",
  "cancelled",
]);
const TASK_STATUSES = new Set([
  "pending",
  "claimed",
  "running",
  "blocked",
  "failed",
  "stale",
  "completed",
  "cancelled",
  "lost",
]);
const ACTIVE_TASK_STATUSES = new Set(["claimed", "running"]);
const RISK_ORDER = { high: 3, medium: 2, low: 1 };

export async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

export async function loadWorkflow(workFile) {
  const absoluteWorkFile = path.resolve(workFile);
  const work = await readJson(absoluteWorkFile);
  const workDirectory = path.dirname(absoluteWorkFile);
  const contractFile = path.resolve(workDirectory, work.contract?.path ?? "");
  const contract = await readJson(contractFile);
  const repositoryRoot = path.resolve(workDirectory, work.repositoryRoot ?? "");
  return { absoluteWorkFile, workDirectory, repositoryRoot, contractFile, contract, work };
}

export function validateContract(contract) {
  const errors = [];
  if (!isRecord(contract)) return ["contract must be an object"];
  if (contract.schemaVersion !== CONTRACT_SCHEMA_VERSION) {
    errors.push(`contract.schemaVersion must be ${CONTRACT_SCHEMA_VERSION}`);
  }
  requireString(contract.workId, "contract.workId", errors);
  if (!Number.isInteger(contract.revision) || contract.revision < 1) {
    errors.push("contract.revision must be a positive integer");
  }
  if (!new Set(["draft", "approved"]).has(contract.status)) {
    errors.push("contract.status must be draft or approved");
  }
  requireString(contract.goal, "contract.goal", errors);
  requireStringArray(contract.nonGoals, "contract.nonGoals", errors);
  requireStringArray(contract.constraints, "contract.constraints", errors);
  requireStringArray(contract.openQuestions, "contract.openQuestions", errors);
  validateIdObjects(contract.behaviors, "contract.behaviors", "description", errors);
  validateIdObjects(contract.acceptance, "contract.acceptance", "outcome", errors, { nonEmpty: true });
  validateDecisions(contract.decisions, errors);
  validateSources(contract.sources, errors);
  if (contract.status === "approved" && contract.openQuestions?.length > 0) {
    errors.push("approved contract must have no openQuestions");
  }
  if (contract.status === "approved" && contract.sources?.length === 0) {
    errors.push("approved contract must cite at least one source");
  }
  return errors;
}

export function validateWork(work, contract, context = {}) {
  const errors = validateContract(contract);
  if (!isRecord(work)) return [...errors, "work must be an object"];
  if (work.schemaVersion !== WORK_SCHEMA_VERSION) {
    errors.push(`work.schemaVersion must be ${WORK_SCHEMA_VERSION}`);
  }
  requireString(work.workId, "work.workId", errors);
  requireString(work.repositoryRoot, "work.repositoryRoot", errors);
  if (!WORK_STATUSES.has(work.status)) {
    errors.push(`work.status must be one of ${[...WORK_STATUSES].join(", ")}`);
  }
  if (!isRecord(work.contract)) {
    errors.push("work.contract must be an object");
  } else {
    requireString(work.contract.path, "work.contract.path", errors);
    if (!Number.isInteger(work.contract.revision) || work.contract.revision < 1) {
      errors.push("work.contract.revision must be a positive integer");
    }
  }
  if (work.workId !== contract?.workId) errors.push("work.workId must match contract.workId");
  if (work.contract?.revision !== contract?.revision) {
    errors.push("work.contract.revision must match contract.revision");
  }
  if (contract?.status !== "approved") errors.push("work requires an approved contract");

  if (!Array.isArray(work.tasks) || work.tasks.length === 0) {
    errors.push("work.tasks must be a non-empty array");
  } else {
    validateTasks(work.tasks, contract, errors, context);
  }

  if (!isRecord(work.review)) {
    errors.push("work.review must be an object");
  } else {
    if (!Number.isInteger(work.review.passes) || work.review.passes < 0 || work.review.passes > 2) {
      errors.push("work.review.passes must be an integer from 0 to 2");
    }
    if (!Array.isArray(work.review.blockingFindings)) {
      errors.push("work.review.blockingFindings must be an array");
    }
    if (!Array.isArray(work.review.evidence)) {
      errors.push("work.review.evidence must be an array");
    }
  }
  if (work.status === "completed") {
    if (!work.tasks?.every((task) => task.status === "completed")) {
      errors.push("completed work requires every task to be completed");
    }
    if (
      (work.review?.passes ?? 0) < 1 ||
      work.review?.blockingFindings?.length > 0 ||
      work.review?.evidence?.length === 0
    ) {
      errors.push("completed work requires a review pass with no blocking findings");
    }
  }
  return errors;
}

export async function validateContractSources(contract, repositoryRoot) {
  const errors = [];
  const cache = new Map();
  for (const source of contract.sources ?? []) {
    await validateSourcePointer(source.path, source.section, "contract source", repositoryRoot, cache, errors);
  }
  for (const decision of contract.decisions ?? []) {
    const [sourcePath, anchor] = decision.source.split("#", 2);
    await validateSourcePointer(
      sourcePath,
      anchor,
      `decision ${decision.id} source`,
      repositoryRoot,
      cache,
      errors,
    );
  }
  return errors;
}

export function readyTasks(work) {
  const tasks = work.tasks ?? [];
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const active = tasks.filter((task) => ACTIVE_TASK_STATUSES.has(task.status));
  const activeLocks = new Set(active.flatMap((task) => task.locks ?? []));
  const activeScopes = active.flatMap((task) => task.scope ?? []);
  const depth = criticalPathDepths(tasks);

  return tasks
    .filter((task) => task.status === "pending")
    .filter((task) => task.dependsOn.every((id) => byId.get(id)?.status === "completed"))
    .filter((task) => !(task.locks ?? []).some((lock) => activeLocks.has(lock)))
    .filter((task) => !(task.scope ?? []).some((scope) => activeScopes.some((other) => scopesOverlap(scope, other))))
    .map((task) => ({
      id: task.id,
      kind: task.kind,
      outcome: task.outcome,
      risk: task.risk,
      criticalPath: depth.get(task.id) ?? 1,
      locks: task.locks ?? [],
      scope: task.scope ?? [],
    }))
    .sort(
      (left, right) =>
        right.criticalPath - left.criticalPath ||
        RISK_ORDER[right.risk] - RISK_ORDER[left.risk] ||
        left.id.localeCompare(right.id),
    );
}

export function claimTask(work, contract, taskId, worker) {
  requireNonEmpty(worker, "worker");
  const ready = new Set(readyTasks(work).map((task) => task.id));
  if (!ready.has(taskId)) throw new Error(`task ${taskId} is not ready`);
  const task = work.tasks.find((candidate) => candidate.id === taskId);
  task.status = "claimed";
  task.claim = { worker, claimedAt: new Date().toISOString() };
  work.status = "running";
  return buildPacket(work, contract, task);
}

export function buildPacket(work, contract, task) {
  const acceptanceIds = new Set(task.covers ?? []);
  const decisionIds = new Set(task.uses ?? []);
  const dependencies = new Set(task.dependsOn ?? []);
  return {
    workId: work.workId,
    task: {
      id: task.id,
      kind: task.kind,
      outcome: task.outcome,
      risk: task.risk,
      scope: task.scope ?? [],
      checks: task.checks ?? [],
      locks: task.locks ?? [],
    },
    product: {
      goal: contract.goal,
      nonGoals: contract.nonGoals,
      constraints: contract.constraints,
      acceptance: contract.acceptance.filter((item) => acceptanceIds.has(item.id)),
      decisions: contract.decisions.filter((item) => decisionIds.has(item.id)),
    },
    dependencies: work.tasks
      .filter((candidate) => dependencies.has(candidate.id))
      .map((candidate) => ({
        id: candidate.id,
        outcome: candidate.outcome,
        evidence: (candidate.evidence ?? []).slice(-5),
      })),
    stopConditions: [
      "A product choice is missing or conflicts with the approved contract.",
      "A destructive or external action lacks authorization.",
      "Required scope overlaps another active task.",
      "The focused checks cannot prove the task outcome.",
    ],
  };
}

export function transitionTask(work, taskId, nextStatus, result = {}) {
  const task = work.tasks.find((candidate) => candidate.id === taskId);
  if (!task) throw new Error(`unknown task ${taskId}`);
  if (!TASK_STATUSES.has(nextStatus)) throw new Error(`unknown task status ${nextStatus}`);
  const allowed = allowedTransitions(task.status);
  if (!allowed.has(nextStatus)) {
    throw new Error(`cannot transition task ${taskId} from ${task.status} to ${nextStatus}`);
  }

  if (nextStatus === "completed") {
    const evidence = Array.isArray(result.evidence) ? result.evidence : [];
    if (evidence.length === 0) throw new Error(`completed task ${taskId} requires evidence`);
    task.evidence = [...(task.evidence ?? []), ...evidence];
  }
  if (new Set(["blocked", "failed", "lost"]).has(nextStatus)) {
    requireNonEmpty(result.summary, `${nextStatus} task summary`);
  }

  task.status = nextStatus;
  task.result = compactResult(result);
  if (new Set(["pending", "stale"]).has(nextStatus)) {
    delete task.claim;
    delete task.process;
  }
  recomputeWorkStatus(work);
  return task;
}

export function recordReview(work, result) {
  if (!work.tasks?.every((task) => task.status === "completed")) {
    throw new Error("review requires every implementation task to be completed");
  }
  if (
    !isRecord(result) ||
    !Array.isArray(result.blockingFindings) ||
    result.blockingFindings.some((finding) => typeof finding !== "string" || finding.length === 0)
  ) {
    throw new Error("review result requires a string blockingFindings array");
  }
  if (!Array.isArray(result.evidence) || result.evidence.length === 0) {
    throw new Error("review result requires non-empty evidence");
  }
  if ((work.review?.passes ?? 0) >= 2) throw new Error("review is limited to two passes");
  work.review.passes += 1;
  work.review.blockingFindings = result.blockingFindings;
  work.review.evidence = Array.isArray(result.evidence) ? result.evidence : [];
  recomputeWorkStatus(work);
  return work.review;
}

export function recomputeWorkStatus(work) {
  if (work.status === "cancelled" || work.status === "paused") return work.status;
  const tasks = work.tasks ?? [];
  if (tasks.length > 0 && tasks.every((task) => task.status === "completed")) {
    if ((work.review?.passes ?? 0) === 0) work.status = "review";
    else if ((work.review?.blockingFindings ?? []).length > 0) work.status = "blocked";
    else work.status = "completed";
  } else if (tasks.some((task) => ACTIVE_TASK_STATUSES.has(task.status))) {
    work.status = "running";
  } else if (readyTasks(work).length > 0) {
    work.status = "running";
  } else if (tasks.some((task) => new Set(["blocked", "failed", "lost"]).has(task.status))) {
    work.status = "blocked";
  } else {
    work.status = "approved";
  }
  return work.status;
}

export async function writeJsonAtomic(file, value) {
  const absolute = path.resolve(file);
  await mkdir(path.dirname(absolute), { recursive: true });
  const temporary = `${absolute}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, absolute);
}

export async function withWorkLock(workFile, callback, options = {}) {
  const lockDirectory = path.join(path.dirname(path.resolve(workFile)), ".lock");
  await acquireLock(lockDirectory, options.recover === true);
  try {
    return await callback();
  } finally {
    await rm(lockDirectory, { recursive: true, force: true });
  }
}

export function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}

export function commandFingerprint(command) {
  return createHash("sha256").update(JSON.stringify(command)).digest("hex");
}

export function resolveInside(root, target = ".") {
  const absoluteRoot = path.resolve(root);
  const absoluteTarget = path.resolve(absoluteRoot, target);
  if (absoluteTarget !== absoluteRoot && !absoluteTarget.startsWith(`${absoluteRoot}${path.sep}`)) {
    throw new Error(`path escapes repository root: ${target}`);
  }
  return absoluteTarget;
}

export async function pathExists(file) {
  try {
    await stat(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function validateTasks(tasks, contract, errors, context) {
  const ids = new Set();
  const acceptanceIds = new Set((contract.acceptance ?? []).map((item) => item.id));
  const decisionIds = new Set((contract.decisions ?? []).map((item) => item.id));
  const covered = new Set();

  for (const [index, task] of tasks.entries()) {
    const label = `work.tasks[${index}]`;
    if (!isRecord(task)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    requireString(task.id, `${label}.id`, errors);
    if (ids.has(task.id)) errors.push(`${label}.id duplicates ${task.id}`);
    ids.add(task.id);
    if (!new Set(["agent", "process"]).has(task.kind)) {
      errors.push(`${label}.kind must be agent or process`);
    }
    requireString(task.outcome, `${label}.outcome`, errors);
    requireStringArray(task.dependsOn, `${label}.dependsOn`, errors);
    requireStringArray(task.covers, `${label}.covers`, errors, { nonEmpty: true });
    requireStringArray(task.uses, `${label}.uses`, errors);
    requireStringArray(task.scope, `${label}.scope`, errors);
    requireStringArray(task.locks, `${label}.locks`, errors);
    if (!Object.hasOwn(RISK_ORDER, task.risk)) errors.push(`${label}.risk must be low, medium, or high`);
    if (!TASK_STATUSES.has(task.status)) errors.push(`${label}.status is invalid`);
    if (!Array.isArray(task.evidence)) errors.push(`${label}.evidence must be an array`);
    validateChecks(task.checks, `${label}.checks`, errors);

    if (context.repositoryRoot) {
      try {
        for (const scope of task.scope ?? []) resolveInside(context.repositoryRoot, scope);
      } catch (error) {
        errors.push(`${label}: ${error.message}`);
      }
    }

    for (const id of task.covers ?? []) {
      if (!acceptanceIds.has(id)) errors.push(`${label}.covers references unknown acceptance ${id}`);
      covered.add(id);
    }
    for (const id of task.uses ?? []) {
      if (!decisionIds.has(id)) errors.push(`${label}.uses references unknown decision ${id}`);
    }
    if (task.kind === "process") validateProcessTask(task, label, errors, context);
  }

  for (const task of tasks) {
    for (const dependency of task.dependsOn ?? []) {
      if (!ids.has(dependency)) errors.push(`task ${task.id} depends on unknown task ${dependency}`);
      if (dependency === task.id) errors.push(`task ${task.id} cannot depend on itself`);
    }
  }
  for (const id of acceptanceIds) {
    if (!covered.has(id)) errors.push(`acceptance ${id} is not covered by any task`);
  }
  detectCycles(tasks, errors);
}

function validateProcessTask(task, label, errors, context) {
  validateCommand(task.command, `${label}.command`, errors);
  if (task.cwd !== undefined && typeof task.cwd !== "string") {
    errors.push(`${label}.cwd must be a string`);
  }
  if (!Array.isArray(task.outputs) || task.outputs.length === 0) {
    errors.push(`${label}.outputs must be a non-empty array`);
  } else {
    for (const [index, output] of task.outputs.entries()) {
      const outputLabel = `${label}.outputs[${index}]`;
      if (!isRecord(output)) {
        errors.push(`${outputLabel} must be an object`);
        continue;
      }
      requireString(output.path, `${outputLabel}.path`, errors);
      if (!new Set(["deliver", "temporary", "tracked"]).has(output.retention)) {
        errors.push(`${outputLabel}.retention must be deliver, temporary, or tracked`);
      }
    }
  }
  if (context.repositoryRoot) {
    try {
      resolveInside(context.repositoryRoot, task.cwd ?? ".");
      for (const output of task.outputs ?? []) resolveInside(context.repositoryRoot, output.path);
    } catch (error) {
      errors.push(`${label}: ${error.message}`);
    }
  }
}

function validateChecks(checks, label, errors) {
  if (!Array.isArray(checks)) {
    errors.push(`${label} must be an array`);
    return;
  }
  for (const [index, check] of checks.entries()) {
    if (!isRecord(check)) {
      errors.push(`${label}[${index}] must be an object`);
      continue;
    }
    validateCommand(check.command, `${label}[${index}].command`, errors);
    if (check.cwd !== undefined && typeof check.cwd !== "string") {
      errors.push(`${label}[${index}].cwd must be a string`);
    }
  }
}

function validateCommand(command, label, errors) {
  if (!Array.isArray(command) || command.length === 0 || command.some((item) => typeof item !== "string" || item.length === 0)) {
    errors.push(`${label} must be a non-empty string array`);
  }
}

function validateDecisions(decisions, errors) {
  if (!Array.isArray(decisions)) {
    errors.push("contract.decisions must be an array");
    return;
  }
  const ids = new Set();
  for (const [index, decision] of decisions.entries()) {
    const label = `contract.decisions[${index}]`;
    if (!isRecord(decision)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    requireString(decision.id, `${label}.id`, errors);
    requireString(decision.choice, `${label}.choice`, errors);
    requireString(decision.source, `${label}.source`, errors);
    if (ids.has(decision.id)) errors.push(`${label}.id duplicates ${decision.id}`);
    ids.add(decision.id);
  }
}

function validateSources(sources, errors) {
  if (!Array.isArray(sources)) {
    errors.push("contract.sources must be an array");
    return;
  }
  for (const [index, source] of sources.entries()) {
    const label = `contract.sources[${index}]`;
    if (!isRecord(source)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    requireString(source.path, `${label}.path`, errors);
    if (source.section !== undefined && typeof source.section !== "string") {
      errors.push(`${label}.section must be a string`);
    }
  }
}

async function validateSourcePointer(sourcePath, section, label, repositoryRoot, cache, errors) {
  if (typeof sourcePath !== "string" || sourcePath.length === 0) return;
  let file;
  try {
    file = resolveInside(repositoryRoot, sourcePath);
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
    return;
  }
  if (!(await pathExists(file))) {
    errors.push(`${label} does not exist: ${sourcePath}`);
    return;
  }
  if (!section) return;
  let content = cache.get(file);
  if (content === undefined) {
    content = await readFile(file, "utf8");
    cache.set(file, content);
  }
  const wanted = normalizeAnchor(section);
  const headings = content
    .split(/\r?\n/)
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => normalizeAnchor(line.replace(/^#{1,6}\s+/, "")));
  if (!headings.includes(wanted)) errors.push(`${label} section does not exist: ${sourcePath}#${section}`);
}

function normalizeAnchor(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s+/g, "-");
}

function validateIdObjects(items, label, valueKey, errors, options = {}) {
  if (!Array.isArray(items) || (options.nonEmpty && items.length === 0)) {
    errors.push(`${label} must be ${options.nonEmpty ? "a non-empty" : "an"} array`);
    return;
  }
  const ids = new Set();
  for (const [index, item] of items.entries()) {
    const itemLabel = `${label}[${index}]`;
    if (!isRecord(item)) {
      errors.push(`${itemLabel} must be an object`);
      continue;
    }
    requireString(item.id, `${itemLabel}.id`, errors);
    requireString(item[valueKey], `${itemLabel}.${valueKey}`, errors);
    if (ids.has(item.id)) errors.push(`${itemLabel}.id duplicates ${item.id}`);
    ids.add(item.id);
  }
}

function detectCycles(tasks, errors) {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const state = new Map();
  function visit(id, trail) {
    if (state.get(id) === "done") return;
    if (state.get(id) === "visiting") {
      const start = trail.indexOf(id);
      errors.push(`task dependency cycle ${[...trail.slice(start), id].join(" -> ")}`);
      return;
    }
    state.set(id, "visiting");
    for (const dependency of byId.get(id)?.dependsOn ?? []) {
      if (byId.has(dependency)) visit(dependency, [...trail, id]);
    }
    state.set(id, "done");
  }
  for (const id of byId.keys()) visit(id, []);
}

function criticalPathDepths(tasks) {
  const children = new Map(tasks.map((task) => [task.id, []]));
  for (const task of tasks) {
    for (const dependency of task.dependsOn ?? []) children.get(dependency)?.push(task.id);
  }
  const memo = new Map();
  function depth(id, trail = new Set()) {
    if (memo.has(id)) return memo.get(id);
    if (trail.has(id)) return 0;
    const nextTrail = new Set(trail).add(id);
    const value = 1 + Math.max(0, ...(children.get(id) ?? []).map((child) => depth(child, nextTrail)));
    memo.set(id, value);
    return value;
  }
  for (const id of children.keys()) depth(id);
  return memo;
}

function scopesOverlap(left, right) {
  const a = left.replaceAll("\\", "/").replace(/\/$/, "");
  const b = right.replaceAll("\\", "/").replace(/\/$/, "");
  return a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
}

function allowedTransitions(status) {
  const transitions = {
    pending: new Set(["claimed", "running", "blocked", "failed", "cancelled", "stale"]),
    claimed: new Set(["pending", "completed", "blocked", "failed", "cancelled", "stale"]),
    running: new Set(["completed", "blocked", "failed", "cancelled", "lost", "stale"]),
    blocked: new Set(["pending", "cancelled", "stale"]),
    failed: new Set(["pending", "cancelled", "stale"]),
    stale: new Set(["pending", "cancelled"]),
    completed: new Set(["stale"]),
    cancelled: new Set(["pending"]),
    lost: new Set(["pending", "cancelled", "stale"]),
  };
  return transitions[status] ?? new Set();
}

function compactResult(result) {
  if (!isRecord(result)) return {};
  const keys = [
    "summary",
    "commit",
    "changedPaths",
    "checks",
    "evidence",
    "scopeExpansions",
    "discoveries",
    "productBlockers",
  ];
  return Object.fromEntries(keys.filter((key) => result[key] !== undefined).map((key) => [key, result[key]]));
}

async function acquireLock(lockDirectory, recover) {
  try {
    await mkdir(lockDirectory);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    if (!recover) throw new Error(`work state is locked: ${lockDirectory}`);
    let owner = null;
    try {
      owner = await readJson(path.join(lockDirectory, "owner.json"));
    } catch {
      throw new Error(`work state has an unreadable lock: ${lockDirectory}`);
    }
    if (isPidAlive(owner.pid)) throw new Error(`work state is locked by live process ${owner.pid}`);
    await rm(lockDirectory, { recursive: true, force: true });
    await mkdir(lockDirectory);
  }
  await writeJsonAtomic(path.join(lockDirectory, "owner.json"), {
    pid: process.pid,
    startedAt: new Date().toISOString(),
  });
}

function requireString(value, label, errors) {
  if (typeof value !== "string" || value.trim().length === 0) errors.push(`${label} must be a non-empty string`);
}

function requireStringArray(value, label, errors, options = {}) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || item.length === 0)) {
    errors.push(`${label} must be a string array`);
  } else if (options.nonEmpty && value.length === 0) {
    errors.push(`${label} must not be empty`);
  }
}

function requireNonEmpty(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(`${label} must be non-empty`);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
