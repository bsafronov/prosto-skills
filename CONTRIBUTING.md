# Contributing

Prosto Skills accepts contributions from humans and agents. A Maintainer remains responsible for every merged instruction and executable file.

## Before writing

1. Read [CONTEXT.md](CONTEXT.md) and relevant [ADRs](docs/adr/).
2. Identify concrete evidence of a recurring capability gap.
3. Confirm an existing Skill or deterministic Tool does not already own the outcome.
4. Confirm the unprefixed name does not collide in supported installation targets.
5. State one independently useful outcome, its nearest rejection boundary, and observable completion.
6. Start new Skills under `skills/.experimental/<verb-object>/`.

Do not create a Skill for one-off work, a universal Core rule, or a deterministic operation that a Tool already performs completely.

## Skill contract

Each Skill must:

- use an unprefixed lowercase verb-object name;
- include `SKILL.md` and `agents/openai.yaml`;
- keep name, directory, UI metadata, and Invocation Mode consistent;
- state outcome, use condition, and rejection boundary in its description;
- contain only decisions, boundaries, proof, and stopping guidance that changes capable-agent behavior;
- own one outcome and remain useful without another Skill;
- declare no hard Skill dependencies;
- set `metadata.internal: true` outside the Stable directory;
- include Trigger, Anti-trigger, and Outcome Cases when model-invoked;
- include a Composition Case when overlap with another Skill needs proof;
- avoid scripts unless deterministic execution materially improves the capability.

Model invocation is the default because users should speak in product language. Use explicit-only invocation when automatic selection would interrupt product work or cross a human authority boundary.

Skill installation must surface name collisions. Automated installation must not silently overwrite an existing Skill.

Scripts are executable supply-chain changes. Keep them narrow, document inputs and outputs, avoid ambient network or credential access, and request Maintainer review.

## Composition

Agents select the smallest sufficient Skill set for each request. A known bug may use `fix-bug`; an unknown bug may compose `investigate-bug` with `fix-bug`. Do not encode that conditional choice as a hard dependency.

Record a Flow only after repeated task evidence shows the same Skills and ordering remain useful.

## Verify

Use Node 24 and run:

```sh
nvm use
npm install
npm run check
```

## Promotion

Promotion is separate from merge and release. A Skill moves to `skills/<name>/` only after deterministic gates pass, its required behavior cases agree across two runs on a declared reference harness and model, required compatibility runs pass, and a Maintainer approves.

New Skills and invocation or composition changes require compatibility evidence from Codex, Claude Code, Cursor, and OpenCode. Missing harness evidence blocks Promotion.

Evaluation Reports belong in pull-request or CI artifacts. They identify cases, source revision, harness, model, results, variance, and blocking findings; raw agent sessions are not committed.

Validate artificial scenario structure without a model call:

```sh
npm run evaluate:validate
```

Run a Skill's isolated scenarios five times on a declared Codex model:

```sh
npm run evaluate -- <skill> --model <model>
```

Hard behavior requires 5/5 runs. Presentation quality allows one variable run and
requires 4/5. The runner deletes raw task output and prints only aggregate evidence.

## Versioning

Stable user-visible changes require a Changeset:

```sh
npm run changeset
```

The private package records suite SemVer and Git tags only; it is not published to npm. See [ADR 0012](docs/adr/0012-version-the-private-suite-with-changesets.md) for release impact.

## Pull requests

Explain the capability gap, Skill boundary, behavior evidence, composition impact, and release impact. Pull-request automation receives read-only permissions and no secrets. All required checks must pass before merge.
