import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

const SKILL_NAME = /^prosto-[a-z]+(?:-[a-z]+)*$/;
const FLOW_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const TAG = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const CASE_TYPES = new Set(["trigger", "anti-trigger", "outcome"]);

const zones = [
  { relative: "skills", maturity: "stable", skipHidden: true },
  { relative: "skills/.experimental", maturity: "experimental" },
  { relative: "skills/.system", maturity: "system" },
];

export function parseFrontmatter(source, file = "document") {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    throw new Error(`${file}: missing YAML frontmatter`);
  }

  let data;
  try {
    data = YAML.parse(match[1]) ?? {};
  } catch (error) {
    throw new Error(`${file}: invalid YAML frontmatter: ${error.message}`);
  }

  if (!isRecord(data)) {
    throw new Error(`${file}: frontmatter must be a mapping`);
  }

  return { data, body: source.slice(match[0].length) };
}

export async function inspectRepository(root) {
  const errors = [];
  const skills = await collectSkills(root, errors);
  validateSkillGraph(skills, errors);
  const flows = await collectFlows(root, skills, errors);
  const cases = await collectCases(root, skills, errors);
  validateCaseCoverage(skills, cases, errors);

  return { root, skills, flows, cases, errors };
}

export async function assertValidRepository(root) {
  const repository = await inspectRepository(root);
  if (repository.errors.length > 0) {
    const detail = repository.errors.map((error) => `- ${error}`).join("\n");
    throw new Error(`Repository validation failed:\n${detail}`);
  }
  return repository;
}

async function collectSkills(root, errors) {
  const skills = [];

  for (const zone of zones) {
    const zonePath = path.join(root, zone.relative);
    for (const entry of await readDirectories(zonePath)) {
      if (zone.skipHidden && entry.name.startsWith(".")) continue;

      const directory = path.join(zonePath, entry.name);
      const relativeDirectory = slash(path.relative(root, directory));
      const skillFile = path.join(directory, "SKILL.md");
      let parsed;

      let skillSource;
      try {
        skillSource = await readFile(skillFile, "utf8");
        parsed = parseFrontmatter(skillSource, slash(path.relative(root, skillFile)));
      } catch (error) {
        errors.push(error.message);
        continue;
      }

      await validateSkillDocuments(root, directory, skillFile, skillSource, errors);

      const document = parsed.data;
      const name = document.name;
      const prefix = `${relativeDirectory}/SKILL.md`;
      validateSkillFrontmatter(document, entry.name, zone.maturity, prefix, errors);

      const openaiFile = path.join(directory, "agents/openai.yaml");
      let openai = null;
      try {
        openai = YAML.parse(await readFile(openaiFile, "utf8"));
        if (!isRecord(openai)) throw new Error("must be a mapping");
      } catch (error) {
        errors.push(
          `${slash(path.relative(root, openaiFile))}: ${
            error.code === "ENOENT" ? "required file is missing" : `invalid YAML: ${error.message}`
          }`,
        );
      }

      const invocation = validateInvocation(document, openai, prefix, errors);
      validateOpenAiMetadata(openai, name, slash(path.relative(root, openaiFile)), errors);

      const prosto = isRecord(document.metadata?.prosto)
        ? document.metadata.prosto
        : {};

      skills.push({
        name,
        description: document.description,
        maturity: zone.maturity,
        invocation,
        internal: document.metadata?.internal === true,
        requires: Array.isArray(prosto.requires) ? prosto.requires : [],
        tags: Array.isArray(prosto.tags) ? prosto.tags : [],
        directory,
        relativeDirectory,
        document,
        openai,
      });
    }
  }

  const byName = new Map();
  for (const skill of skills) {
    if (typeof skill.name !== "string") continue;
    if (byName.has(skill.name)) {
      errors.push(
        `${skill.relativeDirectory}/SKILL.md: duplicate Skill name also used by ${byName.get(skill.name).relativeDirectory}`,
      );
    } else {
      byName.set(skill.name, skill);
    }
  }

  return skills;
}

function validateSkillFrontmatter(document, directoryName, maturity, file, errors) {
  if (typeof document.name !== "string" || !SKILL_NAME.test(document.name)) {
    errors.push(`${file}: name must match prosto-<verb> using lowercase hyphen-case`);
  } else if (document.name !== directoryName) {
    errors.push(`${file}: name must match directory ${directoryName}`);
  }

  if (
    typeof document.description !== "string" ||
    document.description.trim().length === 0 ||
    document.description.length > 1024
  ) {
    errors.push(`${file}: description must contain 1-1024 characters`);
  }

  if (document.license !== "Apache-2.0") {
    errors.push(`${file}: license must be Apache-2.0`);
  }

  if (!isRecord(document.metadata)) {
    errors.push(`${file}: metadata must be a mapping`);
    return;
  }

  const shouldBeInternal = maturity !== "stable";
  if (shouldBeInternal && document.metadata.internal !== true) {
    errors.push(`${file}: ${maturity} Skills require metadata.internal: true`);
  }
  if (!shouldBeInternal && document.metadata.internal === true) {
    errors.push(`${file}: Stable Skills cannot set metadata.internal: true`);
  }

  if (!isRecord(document.metadata.prosto)) {
    errors.push(`${file}: metadata.prosto must be a mapping`);
    return;
  }

  validateStringList(
    document.metadata.prosto.requires,
    `${file}: metadata.prosto.requires`,
    SKILL_NAME,
    errors,
  );
  validateStringList(
    document.metadata.prosto.tags,
    `${file}: metadata.prosto.tags`,
    TAG,
    errors,
    { nonEmpty: true },
  );
}

function validateInvocation(document, openai, file, errors) {
  const claudeControl = document["disable-model-invocation"];
  if (claudeControl !== undefined && claudeControl !== true) {
    errors.push(
      `${file}: disable-model-invocation must be true for user-invoked Skills or omitted for model-invoked Skills`,
    );
  }
  const claudeMode = claudeControl === true ? "user" : "model";

  const openaiControl = openai?.policy?.allow_implicit_invocation;
  if (typeof openaiControl !== "boolean") {
    errors.push(
      `${file}: agents/openai.yaml must explicitly set policy.allow_implicit_invocation`,
    );
  }
  const openaiMode = openaiControl === false ? "user" : "model";

  if (claudeMode !== openaiMode) {
    errors.push(
      `${file}: invocation conflict; SKILL.md is ${claudeMode}-invoked but agents/openai.yaml is ${openaiMode}-invoked`,
    );
    return "conflict";
  }

  return claudeMode;
}

function validateOpenAiMetadata(openai, name, file, errors) {
  if (!isRecord(openai)) return;
  if (!isRecord(openai.interface)) {
    errors.push(`${file}: interface must be a mapping`);
    return;
  }

  const displayName = openai.interface.display_name;
  if (typeof displayName !== "string" || displayName.trim().length === 0) {
    errors.push(`${file}: interface.display_name is required`);
  }

  const short = openai.interface.short_description;
  if (typeof short !== "string" || short.length < 25 || short.length > 64) {
    errors.push(`${file}: interface.short_description must contain 25-64 characters`);
  }

  const prompt = openai.interface.default_prompt;
  if (typeof prompt !== "string" || typeof name !== "string" || !prompt.includes(`$${name}`)) {
    errors.push(`${file}: interface.default_prompt must mention $${name}`);
  }
}

function validateSkillGraph(skills, errors) {
  const byName = new Map(
    skills.filter((skill) => typeof skill.name === "string").map((skill) => [skill.name, skill]),
  );

  for (const skill of skills) {
    if (typeof skill.name !== "string") continue;
    for (const requiredName of skill.requires) {
      const peer = byName.get(requiredName);
      if (!peer) {
        errors.push(`${skill.relativeDirectory}/SKILL.md: required Peer ${requiredName} does not exist`);
        continue;
      }
      if (peer.invocation !== "model") {
        errors.push(
          `${skill.relativeDirectory}/SKILL.md: required Peer ${requiredName} must be model-invoked`,
        );
      }
      if (skill.maturity === "stable" && peer.maturity !== "stable") {
        errors.push(
          `${skill.relativeDirectory}/SKILL.md: Stable Skill cannot require ${peer.maturity} Peer ${requiredName}`,
        );
      }
    }
  }

  const state = new Map();
  const reported = new Set();

  function visit(name, trail) {
    if (state.get(name) === "done") return;
    if (state.get(name) === "visiting") {
      const start = trail.indexOf(name);
      const cycle = [...trail.slice(start), name];
      const key = [...new Set(cycle)].sort().join("|");
      if (!reported.has(key)) {
        reported.add(key);
        errors.push(`Skill graph: dependency cycle ${cycle.join(" -> ")}`);
      }
      return;
    }

    state.set(name, "visiting");
    const skill = byName.get(name);
    if (skill) {
      for (const requiredName of skill.requires) {
        if (byName.has(requiredName)) visit(requiredName, [...trail, name]);
      }
    }
    state.set(name, "done");
  }

  for (const name of byName.keys()) visit(name, []);
}

async function collectFlows(root, skills, errors) {
  const flowRoot = path.join(root, "flows");
  const files = (await readFiles(flowRoot)).filter((entry) => entry.name.endsWith(".md"));
  const byName = new Map(
    skills.filter((skill) => typeof skill.name === "string").map((skill) => [skill.name, skill]),
  );
  const flows = [];

  for (const entry of files) {
    const filePath = path.join(flowRoot, entry.name);
    const relativeFile = slash(path.relative(root, filePath));
    let parsed;
    try {
      parsed = parseFrontmatter(await readFile(filePath, "utf8"), relativeFile);
    } catch (error) {
      errors.push(error.message);
      continue;
    }

    const { name, description, skills: steps, metadata } = parsed.data;
    if (typeof name !== "string" || !FLOW_NAME.test(name)) {
      errors.push(`${relativeFile}: name must use lowercase hyphen-case`);
    }
    if (entry.name !== `${name}.md`) {
      errors.push(`${relativeFile}: filename must match Flow name`);
    }
    if (typeof description !== "string" || description.trim().length === 0) {
      errors.push(`${relativeFile}: description is required`);
    }
    validateStringList(steps, `${relativeFile}: skills`, SKILL_NAME, errors, { nonEmpty: true });
    if (parsed.body.trim().length === 0) {
      errors.push(`${relativeFile}: body must explain branches and handoffs`);
    }

    const internal = metadata?.internal === true;
    if (metadata !== undefined && !isRecord(metadata)) {
      errors.push(`${relativeFile}: metadata must be a mapping`);
    }

    if (Array.isArray(steps)) {
      for (const step of steps) {
        const skill = byName.get(step);
        if (!skill) {
          errors.push(`${relativeFile}: Skill ${step} does not exist`);
          continue;
        }
        if (skill.invocation !== "user") {
          errors.push(`${relativeFile}: Flow step ${step} must be user-invoked`);
        }
        if (!internal && skill.maturity !== "stable") {
          errors.push(`${relativeFile}: public Flow cannot include ${skill.maturity} Skill ${step}`);
        }
      }
    }

    flows.push({ name, description, skills: Array.isArray(steps) ? steps : [], internal, filePath });
  }

  return flows;
}

async function validateSkillDocuments(root, skillDirectory, skillFile, skillSource, errors) {
  const referenceRoot = path.join(skillDirectory, "references");
  const referenceFiles = (await walkFiles(referenceRoot)).filter((file) => file.endsWith(".md"));
  const documents = [{ file: skillFile, source: skillSource }];
  for (const file of referenceFiles) {
    documents.push({ file, source: await readFile(file, "utf8") });
  }

  const incoming = new Map(referenceFiles.map((file) => [path.resolve(file), 0]));
  for (const document of documents) {
    for (const target of markdownTargets(document.source)) {
      if (isExternalTarget(target)) continue;
      const pathname = target.split("#", 1)[0].split("?", 1)[0];
      if (!pathname) continue;

      let decoded;
      try {
        decoded = decodeURIComponent(pathname);
      } catch {
        errors.push(`${slash(path.relative(root, document.file))}: invalid link ${target}`);
        continue;
      }

      const resolved = path.resolve(path.dirname(document.file), decoded);
      const insideSkill =
        resolved === path.resolve(skillDirectory) ||
        resolved.startsWith(`${path.resolve(skillDirectory)}${path.sep}`);
      if (!insideSkill) {
        errors.push(
          `${slash(path.relative(root, document.file))}: local link must remain inside the Skill: ${target}`,
        );
        continue;
      }
      if (!(await exists(resolved))) {
        errors.push(`${slash(path.relative(root, document.file))}: broken local link ${target}`);
        continue;
      }
      if (incoming.has(resolved)) incoming.set(resolved, incoming.get(resolved) + 1);
    }
  }

  for (const [file, count] of incoming) {
    if (count === 0) {
      errors.push(
        `${slash(path.relative(root, file))}: Agent Reference has no incoming Context Pointer`,
      );
    }
  }
}

async function collectCases(root, skills, errors) {
  const casesRoot = path.join(root, "tests/cases");
  const skillNames = new Set(
    skills.filter((skill) => typeof skill.name === "string").map((skill) => skill.name),
  );
  const cases = [];

  for (const directory of await readDirectories(casesRoot)) {
    const directoryPath = path.join(casesRoot, directory.name);
    for (const entry of (await readFiles(directoryPath)).filter((item) => item.name.endsWith(".md"))) {
      const filePath = path.join(directoryPath, entry.name);
      const relativeFile = slash(path.relative(root, filePath));
      let parsed;
      try {
        parsed = parseFrontmatter(await readFile(filePath, "utf8"), relativeFile);
      } catch (error) {
        errors.push(error.message);
        continue;
      }

      const type = parsed.data.type;
      const skill = parsed.data.skill;
      if (!CASE_TYPES.has(type)) {
        errors.push(`${relativeFile}: type must be trigger, anti-trigger, or outcome`);
      }
      if (typeof skill !== "string" || !SKILL_NAME.test(skill)) {
        errors.push(`${relativeFile}: skill must name a prosto Skill`);
      } else {
        if (skill !== directory.name) {
          errors.push(`${relativeFile}: skill must match containing directory ${directory.name}`);
        }
        if (!skillNames.has(skill)) {
          errors.push(`${relativeFile}: Skill ${skill} does not exist`);
        }
      }

      const headings = ["## Given", "## When", "## Then"];
      let previous = -1;
      for (const heading of headings) {
        const index = parsed.body.indexOf(heading);
        if (index === -1 || index <= previous) {
          errors.push(`${relativeFile}: requires ordered Given, When, and Then sections`);
          break;
        }
        previous = index;
      }

      cases.push({ type, skill, filePath, relativeFile });
    }
  }

  return cases;
}

function validateCaseCoverage(skills, cases, errors) {
  const covered = new Set(cases.map((item) => item.skill));
  for (const skill of skills) {
    if (typeof skill.name === "string" && !covered.has(skill.name)) {
      errors.push(`${skill.relativeDirectory}/SKILL.md: Skill requires at least one behavior case`);
    }
  }
}

function validateStringList(value, label, pattern, errors, options = {}) {
  if (!Array.isArray(value)) {
    errors.push(`${label} must be an array`);
    return;
  }
  if (options.nonEmpty && value.length === 0) {
    errors.push(`${label} must not be empty`);
  }

  const seen = new Set();
  for (const item of value) {
    if (typeof item !== "string" || !pattern.test(item)) {
      errors.push(`${label} contains invalid value ${JSON.stringify(item)}`);
      continue;
    }
    if (seen.has(item)) errors.push(`${label} contains duplicate ${item}`);
    seen.add(item);
  }
}

async function readDirectories(directory) {
  try {
    return (await readdir(directory, { withFileTypes: true })).filter((entry) => entry.isDirectory());
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function readFiles(directory) {
  try {
    return (await readdir(directory, { withFileTypes: true })).filter((entry) => entry.isFile());
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function walkFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }

  const files = [];
  for (const entry of entries) {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walkFiles(candidate)));
    if (entry.isFile()) files.push(candidate);
  }
  return files;
}

export async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function slash(value) {
  return value.split(path.sep).join("/");
}

function markdownTargets(source) {
  return [...source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((match) =>
    match[1].trim().replace(/^<|>$/g, ""),
  );
}

function isExternalTarget(target) {
  return /^(?:[a-z][a-z0-9+.-]*:|#)/i.test(target);
}
