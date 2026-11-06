# Agent Note: The 2026-10-17 registration round

Status: implemented

## Problem

Twelve index pull requests were open at once, all appending one object to the tail of the `community.json` array. Each needs the mandatory usefulness, stability and compatibility assessment, and each has to be told apart by what it still owes rather than by age. Because they all write the same array tail, only one of them can merge in a round; the merge that lands invalidates the rest.

## Decision

**#33 merged as `75496560`** (dsh-vitals). Usefulness: no existing entry reports hardware load, and dsh-usage-panel covers token spend instead of CPU, memory, temperature or GPU. Stability: `dsh-vitals@0.1.15`, six files in the package, no install hook, no runtime dependency, public upstream. Compatibility: `dsh.bundle.patch` plus `dsh.client.platform: web`, and `dsh.compatibility.dsh` at `>=0.1.0-rc.5`. On the merge result the index gate reports `community-index: OK (141 entries)` and its test file passes 9 cases.

**#39 merged as `9b2fea20`** (dsh-streamfold) after its author merged `origin/main` into the branch ten minutes after the request, which is the loop this round relies on: the approving review names the branch update, and the sync is followed by a merge rather than another review.

**Three remain approved and blocked only on that branch update**: #32 (dsh-restart-anywhere), #38 (smart-compaction) and #40 (dsh-composer-pro). #32 also records that the execve restart path swaps the process image on a port-close signal, so writes still queued in another session can be lost.

**Five were held on evidence**: #41 (skill-install plus delete-archived) needs the difference from the deletion surface already shipped by dsh-archived-chats, a confirmation or a written warning for a model-callable permanent delete, and end-to-end evidence for two repositories created the same day; #36 (version-guard) has no test directory at all, keeps `.dsh-market/state.json` in its snapshot set, and disables plugins by dropping dependencies instead of the official `disabled: true` marker; #27 (cute-fat-fish-pet) is a plugin rather than a pet asset, and still ships a single-parent commit with no CI run and no `dsh.compatibility` floor; #18 (media-dock) still publishes two Windows absolute paths in 0.1.1 and has no LICENSE file; #34 (the Trae2api rename) removed the usage-boundary sentence that the 2026-10-12 relay acceptance recorded as a premise.

## Alternatives considered

Pushing resolved merge commits into the four contributor forks was rejected: it takes a branch update away from the author for no gain, and a maintainer-resolved conflict hides whether the author understands the append-only contract. Landing all five with one maintainer integration commit was rejected because it bypasses the required check and leaves no per-pull-request merge record.

## Consequences

Only one registration pull request can land per round unless its author syncs the branch; #39 proves the wait is measured in minutes when the author is around. An approved-but-blocked queue is the intended resting state: the next merge is one branch update away.
