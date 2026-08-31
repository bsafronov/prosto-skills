# Contributing

Prosto Skills accepts contributions from humans and agents. A Maintainer remains responsible for every merged instruction and executable file.

## Before writing

1. Read [CONTEXT.md](CONTEXT.md) and the relevant [ADRs](docs/adr/).
2. State the intended behavior and checkable completion conditions.
3. Confirm the capability is independently useful and not already owned by another Skill.
4. Start new Skills under `skills/.experimental/prosto-<verb>/`.

## Skill contract

Each Skill must:

- use an action-oriented `prosto-<verb>` name;
- include `SKILL.md` and `agents/openai.yaml`;
- declare `metadata.internal: true` outside the Stable directory;
- declare `metadata.prosto.requires` and `metadata.prosto.tags`;
- keep user-invoked Skills thin and require model-invoked Peers;
- place branch-specific detail under `references/` behind a clear Context Pointer;
- include Trigger, Anti-trigger, or Outcome cases under `tests/cases/<skill>/`;
- avoid scripts unless deterministic execution materially improves the capability.

Scripts are executable supply-chain changes. Keep them narrow, document inputs and outputs, avoid ambient network or credential access, and request Maintainer review.

## Verify

Use Node 24 and run:

```sh
nvm use
npm install
npm run check
```

If generated routing changed, commit the generated catalog. Do not edit it directly.

## Promotion

Promotion is separate from merge and release. A Skill moves to `skills/<name>/` only after deterministic gates pass, each behavior case agrees across two runs on a declared reference harness/model, required compatibility runs pass, its complete Peer Closure is Stable, and a Maintainer approves.

New Skills and invocation or composition changes require compatibility evidence from Codex, Claude Code, Cursor, and OpenCode. Missing harness evidence blocks Promotion.

Evaluation Reports belong in pull-request or CI artifacts. They identify the cases, source revision, harness, model, results, variance, and blocking findings; raw agent sessions are not committed.

## Versioning

Stable user-visible changes require a Changeset:

```sh
npm run changeset
```

The private package records suite SemVer and Git tags only; it is not published to npm. See [ADR 0012](docs/adr/0012-version-the-private-suite-with-changesets.md) for release impact.

## Pull requests

Explain the problem, ownership boundary, behavior evidence, graph impact, and release impact. Pull-request automation receives read-only permissions and no secrets. All required checks must pass before merge.
