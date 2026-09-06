# Prosto Skills

Atomic Skills written for agents, by agents.

Prosto Skills lets a developer state a product outcome in ordinary language. The agent applies a small Core mindset, selects zero or more relevant Skills from their names and descriptions, uses deterministic tools for mechanical work, proves the result, and stops.

The project is pre-release. All six Skills are Experimental; no Skill is Stable or included in a normal install yet.

## Model

- **Core** is agent mindset, not an installable Skill or runtime.
- **Skills** are atomic capabilities with one outcome and a precise selection boundary.
- **Composition** is chosen dynamically for each request. Skills have no hard Skill dependencies.
- **Tools** perform deterministic search, transformation, and proof work.
- **Flows** are recorded only after repeated evidence proves a durable ordering useful.

There is no resolver, orchestration engine, canonical Skill IR, capability registry, fact schema, or proof-ledger runtime. Native agent selection is the starting point. Adapters are added only when cross-agent evidence shows a concrete gap.

[AGENTS.md](AGENTS.md) is this repository's Core source. Installed Skills assume a capable host agent and do not duplicate Core rules; compatibility evaluation determines whether any host needs a small adapter.

## Skill development

- `write-skill` creates or revises one atomic Skill.
- `evaluate-skill` tests selection, rejection, composition, and outcome without editing.
- `improve-skill` is explicitly invoked between product tasks and changes one Skill only after human approval.

Experimental product capabilities:

- `review-requirements` checks a concrete change against its originating requirements.
- `write-commit-message` expresses change intent as a concise Conventional Commit message.
- `model-domain` resolves domain concepts, relationships, and shared terminology.

Every Skill uses an unprefixed verb-object name. Its description states what outcome it owns, when to use it, and when not to use it. Search, rewrite, typecheck, and similar phases remain tools rather than Skills.

Unprefixed names share the installation target's namespace. Installation must surface collisions instead of silently replacing an existing Skill; the Maintainer chooses a clearer name when needed.

See [CONTEXT.md](CONTEXT.md) for shared language and [the ADRs](docs/adr/) for accepted decisions.

## Install

After the first Promotion, install Stable Skills with:

```sh
npx skills@latest add bsafronov/prosto-skills
```

Maintainers can install all Experimental Skills from the current checkout globally into Codex:

```sh
npm run install:codex
```

## Develop

Use Node 24:

```sh
nvm use
npm install
npm run check
```

- `npm run validate` checks Skill, invocation, reference, and behavior-case contracts.
- `npm run evaluate:validate` checks artificial scenario definitions without model calls.
- `npm run evaluate -- <skill> --model <model>` runs each scenario five times in an isolated,
  read-only Codex task. Hard behavior must pass 5/5 runs; wording quality must pass 4/5.
- Add `--harness opencode` and an OpenCode model name for an isolated, read-only compatibility run.
- `npm test` tests deterministic repository tooling.
- `npm run smoke` verifies normal and internal Skills CLI discovery and installation.

See [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a Skill. Stable changes use Changesets; this private package is versioned and tagged but never published to npm.

## Research

Initial composition research drew from [Matt Pocock's Skills](docs/research/mattpocock-skills.md). Current native-composition decisions and differences are recorded in [ADR-0015](docs/adr/0015-use-core-mindset-and-native-skill-composition.md).

When replacing an existing global third-party installation, use the
[global Skill cutover ledger](docs/migration/global-skill-cutover.md) to preserve
capability coverage, registry provenance, and rollback evidence.

## License

Apache-2.0. See [LICENSE](LICENSE).
