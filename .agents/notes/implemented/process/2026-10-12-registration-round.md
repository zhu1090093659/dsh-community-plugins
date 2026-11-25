# Agent Note: The 2026-10-12 registration round

Status: implemented

## Problem

Sixteen registrations were open, and the round applied a new standing rule for
the first time: an open pull request whose author has not responded for more than
a week is closed with a short explanation rather than held indefinitely. Seven of
the sixteen had been carried across several earlier rounds - #7 (dsh-zhipu-mcp),
#12 (dsh-nexttavern), #14 (dsh-whale-musume), #15 (the seven right-sidebar
plugins), #17 (dsh-camofox-browser), #18 (dsh-media-dock) and #19 (dsh-palate) -
and #20 (dsh-shipcheck) was held on a rebase. Every one of the held branches had
been cut before `dsh-pet-quota` landed, so a naive merge would drop it.

## Decision

**Four registrations were merged: #30 as `3f79e9e8`, #29 as `d86a963e`, #25 as
`32cfe1de` and #24 as `1f276a43`. Five stalled pull requests were closed: #7,
#12, #14, #15 and #17. The rest stay open with written blockers.** The dsh-web
gitlink moved to `1f276a43` and `market/dist` was rebuilt in the same run.

- **#30 (dsh-url-router)** merged. The entry is one append and the required check
  is green; upstream `dsh-url-router` `latest` is 0.3.1 on npm, matching the
  entry, and the packaged manifest declares
  `dsh.engines.dsh: ">=0.2.0-rc.2"`, which the host accepts. Its extra
  `dsh.compatibility.dshReleases` key is inert - the host manifest type carries
  only `engines`, `bundle` and `client`, and nothing in dsh-web reads it - so it
  was noted for cleanup rather than treated as a blocker.
- **#29 (dsh-workbench description sync)** merged. This is the corrective entry of
  the round. The diff is exactly two fields, `+2/-2`, 132 entries before and
  after, no duplicate id and no field-set change; every sentence in the new copy
  traces to the upstream README or CHANGELOG, including the removal of the demo
  project that 0.6.0 deleted. The author also flagged, correctly, that npm already
  carries an unrelated `dsh-workbench`; the entry has no `npm` field so nothing
  installs wrongly today.
- **#25 (dsh-flash-presets)** merged. The upstream `cordis.patch.yml` only
  configures plugins the official line provides, all 29 plugin names exist on the
  0.2.0-rc.2 host, and the store install command reproduces. This pull request
  conflicted with main once #30 landed, because both append at the array end;
  keeping both preserves each contribution, and the fork permitted a maintainer
  edit, so the merge was made on the contributor's behalf with the entry preserved
  verbatim and the index gate reporting OK.
- **#24 (dsh-connection-card-host)** merged after the same append conflict was
  resolved the same way. The published 1.0.75 ships `lib/`, its four
  `peerDependencies` are range-form and optional (installing by package name adds
  exactly one top-level package), and the host half imports no `@deepseek-ai/*` at
  runtime. Its `dsh.client.inject` still names `@deepseek-ai/dsh-client-runtime`,
  which the 0.2.0-rc.2 host no longer provides; the inject lookup skips a missing
  row silently, so the declaration is dead but harmless, and it was reported for
  cleanup.
- **#7, #12, #14, #15 and #17 were closed** under the one-week rule. In each case
  the author's last activity was at least seven days before the round: #7's
  upstream had not moved since 2026-09-25 and still ships no `dsh.bundle`; #12's
  published 0.2.9 still pins every `@deepseek-ai/dsh-*` peer to `0.1.7-rc.2`
  against a 0.2.x host; #14's entry still contradicts the source, which reads the
  last conversation node and the low-balance marker by default; #15 still
  describes `dsh-irc-dock` as connecting to Libera.Chat while the shipped default
  is EFnet; #17 still ships the author's Windows absolute paths as defaults. Each
  closure carries a comment naming the blocker and inviting a reopen with the fix.
- **#19 and #20 stay open.** Both are single rebases held since 2026-10-05; at the
  time of the round the authors' last activity was under seven days old, and the
  pull requests were already carrying a comment naming the rebase as the blocker.
- **#18, #23, #26, #27 and #28 stay open** with blockers written on the pull
  requests: #18 fixed three of four items and still ships `ytDlpPath` /
  `ffmpegPath` as the author's Windows paths (survivable through the `existsSync`
  PATH fallback, but not clean); #23 fails the store install because
  `tsdown.config.ts` imports `../../shared/tsdown.client.ts`, a path that only
  exists inside the dsh-web monorepo layout, while the store's repo-URL install
  does not use the `link:` form the author tested; #26 writes `engines.dsh` as a
  caret range, which the update gate rejects once the package is published, and
  overlaps the existing `dsh-usage-panel`; #27 is complete on provenance but has no
  runtime evidence that its web half loads without the Electron shell, plus a
  70.53 MiB pack and an unresolved question about sharing `$DSH_HOME/dsh-pet/`;
  and #28's `lib/` is gitignored and its build needs a DSH source checkout, so a
  one-click install yields a plugin with no entry point.

## Alternatives considered

- **Continuing to hold #7, #12, #14, #15 and #17.** They had each been re-reviewed
  across two or three rounds without the author pushing, which is what the
  one-week rule exists to end. A comment naming the blocker keeps the record
  actionable and the reopen path explicit.
- **Closing #15 with the same wording as the others.** Its author had actually
  redone the work into seven entries and replied; the only outstanding item was a
  one-line description fix. It was closed under the same rule, with the comment
  stating plainly that the substance was accepted and only the wording remained.
- **Resolving the #25 and #24 conflicts by asking the authors to rebase.** Both are
  mechanical append collisions at the array end, the forks allow maintainer edits,
  and the gate verifies the result. Sending them back would have cost a round trip
  to reproduce a merge that preserves both sides exactly.
- **Treating #30's and #24's inert `dsh.compatibility` / `inject` keys as
  blockers.** Neither changes runtime behaviour: the unknown manifest key is
  ignored and a missing inject row is skipped. Reporting them as cleanups keeps
  the entries honest without failing a working registration.

## Consequences

- Main now carries 135 entries (132 before the round).
- The Workshop sees #30, #29, #25 and #24 only after the dsh-web submodule gitlink
  moves to this repository's main and `market/dist` is rebuilt; this round pinned
  it in the same maintenance run.
- Five registrations are closed and can be reopened with the fix; the remaining
  open ones each carry a written blocker.
- The round confirms two reusable checks for later rounds: an entry with no `npm`
  field must be installed through the store's generated repo-URL command in a clean
  `DSH_HOME`, since `--dump-config` and `link:` both hide failures like #23's; and
  `dsh.client.inject` is the field most likely to drift from the host module table.
- The automated index gate covers only the JSON shape, so "installs, loads, and
  agrees with the host" remains a manual item.
