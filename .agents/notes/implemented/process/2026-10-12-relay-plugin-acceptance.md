# Agent Note: Accept relay and account-manager plugins in the index

Status: implemented

## Problem

#31 registers `dsh-trae-relay`, whose stated purpose is to relay DSH's model
calls through TRAE CN - a commercial service whose terms do not provide for
third-party relay access - and which adds multiple-account management, account
rotation and an optional daily check-in on top. It arrived after the round's
queue had been built, so no existing rule covered it: the repository's validator
checks JSON shape only, and unlike the skins repository there was no written
submission policy that could settle a submission whose primary value is access
outside a service's official interface.

The question was not whether the entry is well formed - it is - but whether the
official Workshop should make such a tool one click away for every user.

## Decision

**Merged as `aac4f75d` after the maintainer chose to accept relay-class plugins as
ordinary third-party registrations.** The index is a link-and-metadata catalog and
listing is not an endorsement; the entry layer does not perform a security or
legal audit of the plugins it points at, and drawing that line per submission
would make the catalog's inclusion rule unpredictable.

- **Index contract.** The entry is one append with all required fields and a legal
  `integration` / `external-ai` classification; `community-index.cjs --check`
  reports OK, and the id was free on main. The pull request had been cut before
  `dsh-url-router`, `dsh-flash-presets` and `dsh-connection-card-host` landed, so
  it conflicted on the array tail; both sides append, so the merge kept both, with
  the entry preserved verbatim and the gate re-run to 136 entries.
- **Host compatibility.** `dsh.client.inject` names
  `dsh-client-ui-layout`, `dsh-client-ui-sidebar` and `dsh-client-connection`, all
  present on the 0.2.0-rc.2 host, and both `peerDependencies`
  (`dsh-llm-pi-ai`, `dsh-credentials`) resolve to present packages. The peer ranges
  are written to accept the 0.2.0-rc line, so the host's `incompatible-version`
  check does not trip.
- **Install path.** `lib/` is committed, so the store's repo-URL fallback has an
  entry point, and there is no `prepare` or `postinstall` hook that would depend on
  a DSH source checkout - the failure mode that holds #28.
- **Disclosure.** The plugin ships the most explicit usage boundary seen in this
  index: automation off by default, no quota or suspension-bypass claims, an
  explicit instruction to verify that relay access and multi-account scheduling are
  permitted, and a statement that a disclaimer cannot legalize unlawful conduct.
  It also preserves the vendored upstream's non-commercial notice verbatim rather
  than reinterpreting it on the rights holder's behalf.
- **CI.** The fork's run sat in `action_required`; it was approved, and the
  required check then ran green.

## Alternatives considered

- **Refusing the registration.** Rejected by the maintainer. The reasoning that
  decided it: the index records what exists and who wrote it, the entry layer does
  no audit, and a per-submission judgement about a plugin's service arrangements
  would be applied inconsistently and would make the catalog's rule unpredictable.
- **Accepting with a mandatory store-description warning.** Not needed once the
  accept-as-ordinary decision was taken: the entry already carries the
  authorization and default-off statements, and the plugin ships its own bilingual
  disclaimer.
- **Holding for the plugin's own CI to run first.** The contributed artifact is one
  JSON entry; the plugin's repository CI is evidence about upstream, not about this
  repository's gate, and the required check is the one that gates the merge.

## Consequences

- Main now carries 136 entries; the dsh-web gitlink moved to `aac4f75d` and
  `market/dist` was rebuilt and pushed so the store serves the entry.
- The repository now has a precedent, recorded here rather than in a policy file:
  relay and account-manager plugins are accepted as ordinary registrations, and
  listing does not assert that a plugin's use of a third-party service is
  authorized. A future round that wants the opposite rule needs to change this
  note, not re-argue the submission.
- The maintainer, not the review, owns that boundary: the technical review could
  only establish that the entry is well formed, that it installs, that its declared
  host targets exist, and that its disclosures are candid.
