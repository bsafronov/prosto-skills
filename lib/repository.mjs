import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";

const SKILL_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/;
const CASE_TYPES = new Set(["trigger", "anti-trigger", "composition", "outcome"]);

const zones = [
  { relative: "skills", maturity: "stable", skipHidden: true },
  { relative: "skills/.experimental", maturity: "experimental" },
  { relative: "skills/.system", maturity: "system" },
];

export function parseFrontmatter(source, file = "document") {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${file}: missing YAML frontmatter`);

  let data;
  try {
    data = YAML.parse(match[1]) ?? {};
  } catch (error) {
    throw new Error(`${file}: invalid YAML frontmatter: ${error.message}`);
  }
  if (!isRecord(data)) throw new Error(`${file}: frontmatter must be a mapping`);

  return { data, body: source.slice(match[0].length) };
}

export async function inspectRepository(root) {
  const errors = [];
  const skills = await collectSkills(root, errors);
  const cases = await collectCases(root, skills, errors);
  validateCaseCoverage(skills, cases, errors);
  return { root, skills, cases, errors };
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
      let source;
      try {
        source = await readFile(skillFile, "utf8");
        parsed = parseFrontmatter(source, slash(path.relative(root, skillFile)));
      } catch (error) {
        errors.push(error.message);
        continue;
      }

      await validateSkillDocuments(root, directory, skillFile, source, errors);

      const document = parsed.data;
      const file = `${relativeDirectory}/SKILL.md`;
      validateSkillFrontmatter(document, parsed.body, entry.name, zone.maturity, file, errors);

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

      const invocation = validateInvocation(document, openai, file, errors);
      validateOpenAiMetadata(openai, document.name, slash(path.relative(root, openaiFile)), errors);

      skills.push({
        name: document.name,
        description: document.description,
        maturity: zone.maturity,
        invocation,
        internal: document.metadata?.internal === true,
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
    const prior = byName.get(skill.name);
    if (prior) {
      errors.push(
        `${skill.relativeDirectory}/SKILL.md: duplicate Skill name also used by ${prior.relativeDirectory}`,
      );
    } else {
      byName.set(skill.name, skill);
    }
  }

  return skills;
}

function validateSkillFrontmatter(document, body, directoryName, maturity, file, errors) {
  if (
    typeof document.name !== "string" ||
    document.name.length > 64 ||
    document.name.startsWith("prosto-") ||
    !SKILL_NAME.test(document.name)
  ) {
    errors.push(`${file}: name must be a lowercase verb-object name of at most 64 characters`);
  } else if (document.name !== directoryName) {
    errors.push(`${file}: name must match directory ${directoryName}`);
  }

  if (
    typeof document.description !== "string" ||
    document.description.trim().length === 0 ||
    document.description.length > 1024
  ) {
    errors.push(`${file}: description must contain 1-1024 characters`);
  } else if (!document.description.includes("Use when") || !document.description.includes("Do not use")) {
    errors.push(`${file}: description must state both Use when and Do not use boundaries`);
  }
  if (body.trim().length === 0) errors.push(`${file}: instruction body is required`);
  if (document.license !== "Apache-2.0") {
    errors.push(`${file}: license must be Apache-2.0`);
  }

  if (document.metadata !== undefined && !isRecord(document.metadata)) {
    errors.push(`${file}: metadata must be a mapping when present`);
    return;
  }

  const shouldBeInternal = maturity !== "stable";
  if (shouldBeInternal && document.metadata?.internal !== true) {
    errors.push(`${file}: ${maturity} Skills require metadata.internal: true`);
  }
  if (!shouldBeInternal && document.metadata?.internal === true) {
    errors.push(`${file}: Stable Skills cannot set metadata.internal: true`);
  }
  if (document.requires !== undefined || document.metadata?.prosto?.requires !== undefined) {
    errors.push(`${file}: hard Skill dependencies are not supported; use dynamic Composition`);
  }
}

function validateInvocation(document, openai, file, errors) {
  const portableControl = document["disable-model-invocation"];
  if (portableControl !== undefined && portableControl !== true) {
    errors.push(
      `${file}: disable-model-invocation must be true for user-invoked Skills or omitted for model-invoked Skills`,
    );
  }
  const portableMode = portableControl === true ? "user" : "model";

  const openaiControl = openai?.policy?.allow_implicit_invocation;
  if (typeof openaiControl !== "boolean") {
    errors.push(`${file}: agents/openai.yaml must explicitly set policy.allow_implicit_invocation`);
  }
  const openaiMode = openaiControl === false ? "user" : "model";

  if (portableMode !== openaiMode) {
    errors.push(
      `${file}: invocation conflict; SKILL.md is ${portableMode}-invoked but agents/openai.yaml is ${openaiMode}-invoked`,
    );
    return "conflict";
  }
  return portableMode;
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

async function validateSkillDocuments(root, skillDirectory, skillFile, skillSource, errors) {
  const referenceFiles = (await walkFiles(path.join(skillDirectory, "references"))).filter((file) =>
    file.endsWith(".md"),
  );
  const documents = [{ file: skillFile, source: skillSource }];
  for (const file of referenceFiles) documents.push({ file, source: await readFile(file, "utf8") });

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
      const skillRoot = path.resolve(skillDirectory);
      const insideSkill = resolved === skillRoot || resolved.startsWith(`${skillRoot}${path.sep}`);
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
      errors.push(`${slash(path.relative(root, file))}: Agent Reference has no incoming Context Pointer`);
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
        errors.push(`${relativeFile}: type must be trigger, anti-trigger, composition, or outcome`);
      }
      if (typeof skill !== "string" || !SKILL_NAME.test(skill)) {
        errors.push(`${relativeFile}: skill must name a verb-object Skill`);
      } else {
        if (skill !== directory.name) {
          errors.push(`${relativeFile}: skill must match containing directory ${directory.name}`);
        }
        if (!skillNames.has(skill)) errors.push(`${relativeFile}: Skill ${skill} does not exist`);
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
  const bySkill = new Map();
  for (const item of cases) {
    if (!bySkill.has(item.skill)) bySkill.set(item.skill, new Set());
    bySkill.get(item.skill).add(item.type);
  }

  for (const skill of skills) {
    if (typeof skill.name !== "string") continue;
    const required = skill.invocation === "model" ? ["trigger", "anti-trigger", "outcome"] : ["outcome"];
    const covered = bySkill.get(skill.name) ?? new Set();
    for (const type of required) {
      if (!covered.has(type)) {
        const article = type === "anti-trigger" ? "an" : "a";
        errors.push(
          `${skill.relativeDirectory}/SKILL.md: ${skill.invocation}-invoked Skill requires ${article} ${type} case`,
        );
      }
    }
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
