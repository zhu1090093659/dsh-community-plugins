# Agent Note: The 2026-10-16 registration round

Status: implemented

## Problem

Eleven index pull requests were open at once, all appending one object to the
`community.json` array. Every one of them needs the mandatory usefulness,
stability and compatibility assessment, and because they all touch the same
array tail, merging any single one invalidates the rest. The round also had to
separate entries that are simply awaiting the required check from entries that
have not yet earned it.

## Decision

**#37 merged as `b37cc4ce`** (dsh-workspace-activity) and **#28 merged as
`2e2800c0`** (dsh-breadboard). Both cleared all three properties on evidence: the
upstream repositories are public, MIT or BSD-3-Clause, unarchived, and their
published artifacts match their `main` byte for byte; `#37`'s slot geometry,
colour tokens and row anchors were checked against the installed host, and its
install was reproduced under an isolated `DSH_HOME` (`dsh plugin --profile web add`
exits 0 and the bundle lands in the profile); `#28`'s install was reproduced in a
profile-shaped pnpm workspace (exit 0, no `--allow-build` needed), which also
retires the earlier `allowBuilds` objection. Neither duplicates an existing
entry: #37 is the only workspace-level running indicator, #28 the only hardware
simulation surface.

**Three more were reviewed as acceptable and are blocked only on the array
tail**: #39 (dsh-streamfold), #33 (dsh-vitals) and #32 (dsh-restart-anywhere). Each
got an approving review that names what is still required from the author - a
branch update - rather than a re-review. #32 additionally records that the restart
path swaps the process image on a port-close signal rather than on teardown
completion, which can drop still-queued session records, and that the execve path
has no rollback.

**Four were held on evidence**: #38 (smart-compaction) must show an end-to-end run
in a standard preset, because the mount script it asks the user to run writes to
`$DSH_HOME/.agent-presets/`, which is empty on a standard install while the host
disables its own compaction rows in favour of per-preset isolated ones; #36
(dsh-version-guard) claims upstream tests that do not exist in its repository and
keeps a disable mechanism that does not recognise the official plugin manager's
`disabled: true` marker; #27 (cute-fat-fish-pet) still owes host-load evidence for a
browser half outside the desktop shell; and #18 (dsh-media-dock) must clear two
hard-coded Windows paths that already shipped in 0.1.1. #34 (the Trae2api rename)
waits on a description correction that the 2026-10-13 comment already requested.
#26 (dsh-clear-usage) conflicts and awaits that same push.

**All of these stay in this catalog.** #27 was checked specifically: its upstream
has no `pet.json` and no `petManifestVersion`, so it is a cordis plugin and not a
pet asset pack, and `docs/plugins.md` plus `market-inputs.lock.json` put only
`pet.json` v2 packs on the pet path.

## Alternatives considered

**Merge several entries in one pass.** GitHub refuses: they append at the same
array tail, so after the first merge the rest report `CONFLICTING`, and
`update-branch` returns 422 rather than merging the base in. Merging is one entry
per round unless an author rebases.

**Hold the whole batch until every author rebases.** Two entries were mergeable
and fully assessed; withholding them would delay content that had already earned
its place for the sake of the others.

**Land the reviewed entries with a maintainer commit on `main` and close the
pull requests.** It would clear the backlog in one commit, at the cost of the
contributors' authorship and of the review trail the catalog depends on.

## Consequences

The catalog grew from 137 to 139 entries and the Workshop picked both up. The
tail-append contention is now a standing property of this catalog rather than an
accident of one round: contributors have to merge `main` before their entry can
land, and the required check has to be re-approved after each such push because
the pull requests come from forks. Reviews that accept an entry but demand a
rebase say so explicitly, so the next round can tell "needs a rebase" apart from
"needs a decision".


## Second pass, 2026-10-16 (maintenance round)

Correction to the round above: #26 no longer conflicts.

**#26 (dsh-clear-usage) merged**, taking the catalog from 139 to 140 entries. All
three earlier asks landed - `engines.dsh` is now `>=0.2.0-rc.2`, `engines.node`
matches the deepseek-harness root, and the overlap with `dsh-usage-panel` is
written into both descriptions and the upstream README. The head is a pure tail
append: the other 139 entries compare equal, and the gate plus its nine contract
tests pass on it. The author force-pushed again despite the earlier instruction,
which invalidated the previous approval and the approved CI run.

**#39 (dsh-streamfold) needs one sentence fixed.** The entry added in 7f2491b
claims the official transcript display is restored "on uninstall or when switching
back to an official mode". Switching back does write the chosen mode
(`lib/client.js:125`), but the uninstall path only calls `stopOfficialRowHide()`,
which disconnects an observer and strips two attributes
(`lib/client.js:3536`); `transcriptView` is written in exactly three places
(108, 119, 125) and never from a dispose path, so after uninstall the official
value stays on `verbose`. Structure, provenance and compatibility all pass; only
the claim is wrong.

**#34 (the Trae2api rename) is not waiting on a maintainer.** Its last commit is
`2026-10-13T08:50:43Z` and the comment asking for the "automation is off by
default" clause back is `2026-10-13T15:27:25Z`, so the author has not pushed
since. `pulls/34/reviews` is empty; the request lives in an issue comment, which
is why it was easy to misread as an unreviewed submission.

**#27 (cute-fat-fish-pet)** rebuilt its file correctly - the head is `main` plus
one entry, 140 entries, gate OK - but the commit whose message says `merge` has a
single parent, so `merge-base` is still `c7852a6` and GitHub keeps reporting
`CONFLICTING`. The content is right; the fix is a real `git merge origin/main`.

**#33, #32, #38, #36 and #18** were each told that they conflict and why, since
all six append at the same array tail.

## Decision

Merge #26, request the sentence fix on #39, and tell the conflicted set what to do
instead of waiting on it. One entry per round stays the rule: #39 and #26 conflict
with each other, so whichever tries second loses.

No entry was landed with a maintainer commit on top of `main`. That alternative
clears the backlog in one push at the cost of the contributors' authorship and the
review trail the catalog depends on.

## Alternatives considered

**Merge #39 and ask #26 to rebase.** #26 was ready and #39 was not; ordering by
readiness keeps a correct entry from waiting on an incorrect one.

**Accept the #39 wording because upstream is where the description came from.**
Upstream is where the defect is - `stopOfficialRowHide()` never restores the
value - so copying it faithfully copies the bug.

**Treat #34's missing clause as already closed.** The catalog is the page a user
reads before installing an automation plugin; dropping "off by default" is a
user-visible loss even while the upstream README still carries it.

**Re-approve the CI run for #27.** GitHub does not start `pull_request` workflows
on a conflicted pull request at all, so there is no run to approve until the
conflict is resolved.

## Consequences

The Workshop picked up the 140th entry. The tail-append contention now has a
worked example on both sides: an entry that merged because it was ready, and an
entry that was held because a sentence contradicted the code it described.
