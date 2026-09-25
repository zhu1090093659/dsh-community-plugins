# Agent Note: Index entries describe today's upstream, and the index is an append-only file

Status: implemented

## Problem

`community.json` is the single source of the Workshop store catalog and the
dsh-market.com plugin manifest: an entry added here reaches every user of the
family bundle. The 2026-09-25 maintenance round reviewed four registration pull
requests at the same time and surfaced two problems that the structure validator
cannot see.

First, an entry's `description` fields are user-visible store copy. One pull
request carried a security statement that upstream had already withdrawn —
it said the WeChat phone channel's permission preset was deliberately widened,
while upstream had moved the default to `workspace-write` with in-chat approval
hours after the pull request was opened. Merging it would have published a false
security claim to every user, and no gate would have caught it, because the
validator only checks that a description is a non-empty string.

Second, every one of the four pull requests appended its entry at the same
position, so they conflicted with each other the moment one merged. The single
data file means registration pull requests are serialized by construction.

## Decision

- **An entry's description is reviewed as published copy, not as metadata.**
  Claims about defaults, permissions, capabilities, or platform support are
  checked against the upstream repository's current source at review time.
  A description that was accurate when opened but has since drifted is a merge
  blocker: the correct fix is to update the text, not to merge and correct later.
- **The index file is append-only, and registration pull requests are merged
  one at a time.** Concurrent registrations will conflict at the append anchor,
  so each is re-based onto the current `main` before merging. Conflicts here are
  resolved by rebuilding the file as current `main` plus the one new entry, never
  by picking a side: both the existing entries and the new one are preserved
  because the two sides never actually disagree about any interior entry.
- **Contributors' forks are repaired with a merge commit, not a force push.**
  When a registration pull request conflicts, the branch is advanced by merging
  `main` into it and pushing that merge back. This keeps the contributor's own
  commit intact and does not rewrite their history.

## Alternatives considered

- **Validate descriptions mechanically.** Rejected. Whether "the permission
  preset is wide by design" is still true cannot be decided from the string; it
  requires reading the upstream implementation. Adding a text-matching rule
  would produce false confidence, not coverage.
- **Let GitHub's update-branch button resolve the conflict.** Rejected as
  insufficient. It refuses with `merge conflict between base and head` when both
  sides append at the same anchor, which is exactly this shape; the resolution
  has to be done in a worktree.
- **Resolve the conflict by taking the incoming side (theirs) for the whole
  file.** Rejected as data loss. The two sides differ only at the append point,
  so taking one side would silently drop the other's entry — and, after the
  first merge, would drop the already-merged entries too.
- **Force-push the contributor's branch into the rebased shape.** Rejected. It
  rewrites a contributor's history for a mechanical conflict, and the merge
  commit preserves the original work and its authorship.

## Consequences

- Registration pull requests are reviewed against live upstream source, which
  costs a fetch of the plugin repository per entry. This is the price of the
  store copy being accurate, and it is paid once per registration.
- The index cannot absorb parallel merges. Maintainers must sequence them, and a
  batch merges in order with each branch re-based onto the previous result.
- Repairing a contributor's branch adds a merge commit authored by the
  maintainer to their branch. The contributor's commit and its authorship are
  preserved as the first parent.
- Verification: at the 2026-09-25 round three registrations merged
  (`dsh-ltm`, `dsh-session-suspend`, `dsh-attention-health`) with
  `community-index: OK (122 entries)` and the nine index tests passing on each
  result, and the fourth (`dsh-wx-bridge`) was held pending a description fix.
  The conflict resolution was checked by diffing the merged id set against both
  parents' id sets and asserting that no id from either side was lost.
