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
- **A plugin registration is assessed on three axes before it enters the
  index: usefulness, stability, and compatibility.** The index is not a link
  list — an entry is an install command the store shows to every user, so the
  review reproduces the install in an isolated `DSH_HOME`, reads the upstream
  source that backs each described capability, and checks the entry's ids
  against the existing catalog and the family bundle. A claim that cannot be
  backed by the repository at review time is reported as unverified rather than
  accepted on the strength of a README.
- **An install that never mounts is a compatibility failure, not a
  documentation gap.** `dsh plugin add` installs a package that declares no
  `dsh.bundle` as a plain dependency: the reconcile step skips it, it never
  enters the profile's `bundles`, and a restart does not load it. A
  registration whose upstream package is missing that declaration is held until
  upstream ships it — the entry may be perfectly compliant, but the plugin is
  not installable as advertised, and the store would be sending every user to a
  no-op. The check is a reproduction of the install, not a reading of the
  README.
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
- **Accept a registration on the strength of the upstream README.** Rejected.
  `agent-body`'s description claims capabilities (heartbeat, reflex arcs,
  memory consolidation, a zero-residence context engine) that only the source
  can confirm, and one of its claims — that the non-core organs install from
  release tarballs — was already stale for `dsh-anatomy-panel`, which has no
  tarball in `dist/`. Reading the repository is what separates a store listing
  from a verified one.

## Consequences

- Registration pull requests are reviewed against live upstream source, which
  costs a fetch of the plugin repository per entry. This is the price of the
  store copy being accurate, and it is paid once per registration.
- The index cannot absorb parallel merges. Maintainers must sequence them, and a
  batch merges in order with each branch re-based onto the previous result.
- Repairing a contributor's branch adds a merge commit authored by the
  maintainer to their branch. The contributor's commit and its authorship are
  preserved as the first parent.
- Verification: at the 2026-09-25 round the four registrations all merged
  (`dsh-ltm`, `dsh-session-suspend`, `dsh-attention-health`, then
  `dsh-wx-bridge` after its description was corrected, then `agent-body`),
  ending at `community-index: OK (124 entries)` with the nine index tests
  passing on each result. Each conflict resolution was checked by diffing the
  merged id set against both parents' id sets and asserting that no id from
  either side was lost and that no interior entry changed.
- Later registrations in the same round re-confirmed the append conflict: after
  `dsh-wx-bridge` merged, `agent-body` and `dsh-wx-bridge` conflicted at the
  same anchor, so each repair rebuilt the file as current `main` plus the one
  new entry.
- Verification: the second 2026-09-26 round merged one registration,
  `dsh-model-priority` (entry diff `+11/−0`), after reproducing the install,
  reading the plugin's write path against its store copy — the four pre-write
  checks and the "unchanged means no write, reuse an existing backup, keep five"
  backup policy in `lib/index.js` and `lib/backup.js` — and confirming the
  description's narrowing matched the source. The head's CI reported
  `community index gate, typecheck, test and build: success` and
  `community-index: OK (125 entries)`. The contributor withdrew
  `dsh-auto-continue` from the same pull request themselves before review, so
  only one entry entered the index.
- Verification: `dsh-zhipu-mcp` stayed open on the missing `dsh.bundle`
  declaration. Its index gate was green and the entry itself compliant, so the
  hold names exactly one upstream change; the review also recorded, as a
  non-blocking note, that the plugin resolves the host's `dsh-mcp-client` from
  hard-coded desktop app roots that do not exist on a standard npm install.
