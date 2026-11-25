# Agent Note: community entries carry their published npm version

Status: implemented

## Problem

`community.json` described 123 npm-published plugins without a version field. The
official DSH plugin market index Format 1 (emitted by `scripts/market-build` in the
dsh-web repository as `market/dist/manifest/plugin-market-index.json`) installs an
entry by running `pnpm add <npm>@<version>`, so it only accepts entries that carry
an exact SemVer version. Without a version on the community side, that index
contained nothing but the 21 dsh-web family packages: users subscribing to
`https://dsh-market.com/manifest/plugin-market-index.json` from Plugins -> Discover
saw only family sub-packages and no community plugin.

Fabricating a placeholder version (`0.0.0`) was already rejected for the same
reason it is useless here: the value is applied verbatim by the installer.

## Decision

`version` becomes an optional entry field that requires `npm` and must be an exact
SemVer string; the validator rejects a version without `npm`, ranges, tags and
`v`-prefixed forms. Every published plugin entry now records the version currently
published for it on the npm registry, and the versions were taken from the
registry's `latest` dist-tag, not from a guess or from the repository copy.

The version describes the published package a store card installs. It is not a
claim about the repository HEAD, and the `repo` link stays the place to read
upstream source.

## Alternatives considered

- Have the market build query the npm registry while generating the index. That
  moves a network dependency into `pnpm market:check`, whose whole point is a
  reproducible, offline comparison of committed artifacts against their sources.
- Keep the index family-only and leave community plugins to the Workshop store.
  That leaves the official Discover surface unable to install the plugins this
  index exists to publish.
- Derive the version from the repository's `package.json` at review time. It can
  disagree with the registry (unpublished bumps, workspace-only versions) and the
  installer only ever reads the registry.

## Consequences

An entry that adds or bumps a published plugin has to update `version` in the same
change, and a stale value makes the store card install a version that is not the
one the author just released. The official market index now lists community
plugins beside family ones, so its size follows this file. Re-checking the 123
values against the registry is a routine maintainer check: a registry lookup per
`npm` name is cheap, and the gate stays offline because it validates shape, not
freshness.
