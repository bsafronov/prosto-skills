# Prosto Skills

Composable Skills written for agents, by agents.

Prosto Skills aims to become an ecosystem of focused capabilities that solve problems independently and combine without duplicating behavior. User-invoked Orchestrators and Routers coordinate model-invoked Peer Skills. Core Skills improve how the ecosystem writes, reviews, evaluates, reflects, and evolves.

The project is pre-release. `prosto-write`, `prosto-shape`, `prosto-contract`, and `prosto-implement` are Experimental; no Skill is Stable or included in a normal install yet.

## Install

After the first Promotion, install Stable Skills with:

```sh
npx skills@latest add bsafronov/prosto-skills
```

Maintainers can install all Experimental Skills from the current checkout globally into Codex:

```sh
npm run install:codex
```

## Architecture

- `skills/<name>/` contains Stable Skills.
- `skills/.experimental/<name>/` contains Experimental Skills.
- `skills/.system/<name>/` contains Maintainer-only Skills.
- `flows/*.md` describes recommended paths through user-invoked Skills.
- `tests/cases/<skill>/` contains agent behavior cases.
- `metadata.prosto.requires` declares hard Peer dependencies.

Every Skill is named `prosto-<verb>`. Orchestrators require Peers rather than copying them. The validator rejects missing Peers, non-model-invoked Peers, dependency cycles, cross-harness invocation conflicts, and Stable Skills whose Peer Closure is not Stable.

The Experimental Core can write agent-facing material and run the internal Feature Delivery Flow: shape raw intent into one approved user outcome, compile it into an implementation contract without duplicate approval, and deliver the complete bounded change through durable task state and non-blocking process work. Planned additions include `prosto-review`, `prosto-evaluate`, `prosto-reflect`, `prosto-improve`, `prosto-promote`, and `prosto-find`. Only complete, independently useful slices are added.

See [CONTEXT.md](CONTEXT.md) for the domain language and [the ADRs](docs/adr/) for accepted decisions.

## Develop

Use Node 24:

```sh
nvm use
npm install
npm run check
```

Useful commands:

- `npm run validate` checks Skill, graph, Flow, and case contracts.
- `npm run generate` refreshes the `prosto-find` catalog when that Router exists.
- `npm test` runs deterministic tooling tests.
- `npm run smoke` checks normal and internal discovery through Skills CLI.

See [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a Skill. Stable changes use Changesets; this private package is versioned and tagged but never published to npm.

## License

Apache-2.0. See [LICENSE](LICENSE).

## Acknowledgements

The ecosystem design is influenced by [Matt Pocock's composable Skills work](https://github.com/mattpocock/skills), especially hard Skill composition, user/model invocation boundaries, and generated routing. See the [source-backed research note](docs/research/mattpocock-skills.md). Prosto instructions and terminology are original to this project.
