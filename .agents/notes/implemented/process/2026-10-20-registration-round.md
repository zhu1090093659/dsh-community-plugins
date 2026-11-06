# Agent Note: The 2026-10-20 registration round

Status: implemented

## Problem

Twelve index pull requests were open at once, all appending to the tail of the `community.json` array, and six of them had never had their required check run: every first-time contributor's workflow sat at `action_required`, so `community index gate, typecheck, test and build` had no result and the branch reported BLOCKED for a reason that was not code. Three had fallen behind `main` far enough to conflict on that same array tail. The round had to separate what each pull request still owed from what the platform had never let it prove.

## Decision

Approving the pending workflow runs came first, because a BLOCKED branch whose required check never reported tells an author nothing. Seven runs were approved across the three satellite repositories and all seven completed green, which turned most of this queue from an unknown into a verdict.

**#45 merged as `2dd0aa05`** (dsh-loglens). Usefulness: a log query surface over Elasticsearch and OpenSearch that no existing `tools/dev` entry covers, with its Docker collection source reusing the dsh-docker route instead of duplicating it. Stability: `@hyzyn/dsh-loglens@0.1.3` published, upstream `hyzyn/dsh-plugin-kit` at 54 stars under Apache-2.0 and pushed the same day, `packages/loglens` present on `main`. Compatibility: appended at the tail after dsh-streamfold, `tools/dev` matching its nine sibling hyzyn entries, gate reporting `community-index: OK (143 entries)`. The recorded reservation is the exact-pinned non-official `@hyzyn/dsh-kit@0.6.0` runtime dependency, which does not block but adds a second package that must release in step.

**#41 was held on a broken file, not on content.** Its description rewrite dropped the comma after `dsh-delete-archived`'s `descriptionEn`, so `community.json` fails to parse at line 1672 and the branch's own `community-index: OK` comment no longer describes its head. Two of the four items from the previous round did land: the archived-chats overlap and the third-party SKILL.md warning. The permanent-delete sentence and the dsh-delete-session boundary are still outside the entry.

**Five hold on evidence rather than structure.** #43 duplicates the author's own registered dsh-logicprobe and needs the boundary stated. #40's entry still names `dsh-composer-pro` while upstream renamed to `dsh-composer-ease` 0.8.0 behind a 301. #47 ships no tests, no CI and a single README screenshot, which cannot show a resume button in the aborted, crashed and errored states. #36 has resolved its tests and dual-source concerns but has no tag and no release at all, so nothing names the installed version. #27 is correctly a plugin rather than a pet asset, because the tree carries no `pet.json`; it holds on Windows-only testing plus a roughly 70 MB install with no `files` whitelist.

**#32 and #38 were approved in the 2026-10-17 round and are still blocked only on the branch update**, which has since grown to two further entries. Both now conflict on the array tail, so each got a fresh review naming the sync as the sole blocking step; #32 additionally asks that the execve and teardown race, currently described only in the pull request body, move into the entry.

**#18 closed as stale, not as a rejection.** Fifteen days old, twelve days without a commit, and the two Windows absolute paths it was asked to remove are still published in npm 0.1.1, with `license: null` and no LICENSE file inside the package. The closing comment names the three changes that would justify reopening.

## Alternatives considered

Pushing conflict resolutions into contributor forks was rejected again for the reason the 2026-10-17 round recorded: it takes the branch update away from the author and hides whether the author understands the append-only contract.

Merging more than one registration per round was rejected, because each merge moves the tail every other branch appends to. One merge is what leaves the remaining ten resolvable by a single `git merge origin/main` each.

Treating #43's overlap with the author's own plugin as a store-quality preference instead of a gate was rejected, because usefulness covers duplicate and low-value wrapping, and two entries describing one capability is what that gate exists to catch.

## Consequences

Each remaining pull request here is one branch update, one tag or one sentence away from a merge; none needs code rework. The `action_required` gate is the standing cost of first-time contributors: a maintainer must approve every new head's run before the required check can report, so a re-push after a review starts that wait over.
