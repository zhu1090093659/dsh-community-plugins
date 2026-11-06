# Agent Note: The 2026-10-06 registration round

Status: implemented

## Problem

This round took the nine open registrations: #22, an in-place edit that syncs one
existing entry (`dsh-plugin-hub`) with its renamed upstream repository, and eight
pull requests that earlier rounds had already held - #20 (dsh-shipcheck), #19
(dsh-palate), #18 (dsh-media-dock), #17 (dsh-camofox-browser), #15 (seven
right-sidebar plugins), #14 (dsh-whale-musume), #12 (dsh-nexttavern) and #7
(dsh-zhipu-mcp). Seven of the eight are also in conflict with main, which now
carries 132 entries including `dsh-pet-quota`; every one of those branches was cut
before that entry existed, so a naive merge would drop it.

## Decision

**#22 was merged as `e8a843f0`. All eight held pull requests were re-checked and
remain held; no author had pushed since their last review, so no further review was
posted.**

- **#22 (dsh-plugin-hub sync).** The diff is one entry and five fields (`name`,
  `nameEn`, `description`, `descriptionEn`, `repo`), +5/-5, and nothing else in
  `community.json` moved: 132 entries before and after, same order, no duplicate
  id. The upstream repository was renamed rather than recreated - the old URL
  returns a 301 and both names resolve to the same repository id - and the old
  address still clones. The new copy matches the upstream README. Verified with
  `node scripts/community-index.cjs --check` (OK, 132 entries) and
  `node --test scripts/community-index.test.mjs` (9/9). The pull-request text
  quotes an npm `latest` that has since moved on; the entry pins no version, so
  nothing follows from it.
- **The eight holds.** Every head is unchanged since its review, and each blocker
  was re-confirmed against upstream: #7's upstream still publishes no
  `dsh.bundle`, so the plugin would install and never mount; #12's published
  0.2.9 still pins every `@deepseek-ai/dsh-*` peer to `0.1.7-rc.2` against a
  0.2.x host; #18 still ships the author's absolute `outputDir` and a hardcoded
  loopback proxy in the packaged `cordis.patch.yml`; #17 still pins Windows
  absolute paths and needs a manual engine download; #15's `dsh-irc-dock` entry
  still describes Libera.Chat while the shipped patch overrides the default to
  EFnet; #14's entry still says the conversation and balance switches default to
  off while the source reads the last conversation node and the low-balance marker
  by default; #19 and #20 are held on the rebase, and #19 also on a wording fix.
  All eight stay open for their authors.

## Alternatives considered

- **Merging #7 because the entry itself is conflict-free and the required check is
  green.** The hold is not about the entry: a registration that mounts nothing on
  the current host sends store users to a plugin that never loads, which is the
  reason the entry layer exists.
- **Rebasing the held branches ourselves.** Rewriting a contributor's branch would
  drop `dsh-pet-quota` from their tree, mix maintainer edits into their commit and
  hide that the described behaviour is still unimplemented. The conflict is the
  author's to resolve by merging main.
- **Re-posting the holds.** A second copy of the same review on an unchanged head
  is noise; the existing review record already carries the evidence and the fix
  list.

## Consequences

- The `dsh-plugin-hub` entry now points at `dsh-plugin-gating-hub`; the Workshop
  shows it only after the dsh-web submodule gitlink moves to this repository's main
  and `market/dist` is rebuilt.
- Eight registrations remain open, each with a written, still-valid blocker.
