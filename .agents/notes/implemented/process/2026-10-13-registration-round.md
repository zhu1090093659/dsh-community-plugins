# Agent Note: The 2026-10-13 registration round

Status: implemented

## Problem

Nine registrations were open at the start of the round: #35 (refreshing the
Archive Management description), #23 (`dsh-web-start-ui`), #28 (`dsh-breadboard`),
#33 (`dsh-vitals` and `smart-compaction`), #32 (`dsh-restart-anywhere`), #34
(renaming the existing Trae relay entry), and the three the previous round left
waiting on their author, #27, #26 and #18. Two of the nine were merged, four are
held on written blockers, and three are still waiting with no new commits; the
waiting three also now conflict with main, so their next push has to resolve the
conflict first.

## Decision

**Two registrations were merged - #35 as `92b86aa` and #23 as `39ce23b` - and the
index stands at 137 entries.** Four pull requests are held and three remain
waiting.

- **#35 (Archive Management copy refresh) merged.** The diff is exactly the two
  description fields of the `dsh-archived-chats` entry, +2/-2, and nothing else:
  id, repo, npm and category are untouched, which is what a description refresh
  should look like. Upstream `v1.5.2` and npm `latest` were both published on
  2026-10-12, and the twelve capability statements in the new copy were checked
  one by one against that release. `community-index.cjs --check` reports OK, the
  contract tests pass, and both CI jobs are green.
- **#23 (`dsh-web-start-ui`) merged after maintainer-side conflict resolution.**
  The contributor's "head is updated to 08fef57" refers to the plugin repository
  `stushansusu/dsh-web-start-ui`, not to this pull request: the branch head is and
  remains `6f4b31c`, with the maintainer's
  `Merge remote-tracking branch 'origin/main' into verify-pr23` (`e70842a`) on top
  of it. The conflict was an append collision at the end of `community.json` -
  main had gained `dsh-trae-relay` meanwhile - and both sides only append, so main
  was merged into the contributor's branch, both entries were kept, the index gate
  reported OK, and the result was pushed to the contributor's fork branch
  (`maintainer_can_modify=true`) before the merge. The previous round's
  installation blocker is cleared by measurement: installing the repository URL in
  an isolated environment yields 0.4.6 with no `allowBuilds` entry needed. Three
  residual risks are recorded rather than fixed - the entry carries neither an
  `npm` field nor a pinned ref, so a store install always takes the upstream main
  HEAD; it overlaps the registered `dsh-550c-boot` with no mutual-exclusion
  declaration; and it installs about 16 MB.
- **#28 (`dsh-breadboard`) is held.** The entry and the gates conform, but
  one-click installation from the store still fails: this package is the only one
  in the index declaring a `postinstall`, pnpm blocks it and writes a pending
  `allowBuilds` entry, and `dsh plugin --profile web add
  @noob-stupid/dsh-breadboard` exits 1, while a clean profile installing
  `dsh-quick-ask` exits 0. The requirement is to move the `postinstall` out of the
  published package or to document the manual approval.
- **#33 is held for `smart-compaction` only.** `dsh-vitals` installs and runs
  (0.1.15, no install scripts, exit 0). `smart-compaction`'s `postinstall` fails
  the install with `ERR_PNPM_IGNORED_BUILDS`, and that script rewrites
  `$DSH_HOME/.agent-presets/*/agent.cordis.yml` with no rollback path, so the
  recommendation is to split the pull request in two.
- **#32 (`dsh-restart-anywhere`) is held on an out-of-scope file.** The entry and
  the install path pass, including an isolated `DSH_HOME` install with exit 0 and
  no `postinstall`/`prepare` in the package, but the pull request also commits
  local pnpm `allowBuilds` residue into `pnpm-workspace.yaml` (its file list is
  `community.json` plus `pnpm-workspace.yaml`), replacing the five leading blank
  lines with a placeholder block; that has to be restored before the merge.
- **#34 (renaming the Trae relay entry) is held on one sentence.** Keeping `id`
  as `dsh-trae-relay` is correct: the store matches an installed row through
  `item.id === entry.id` (`packages/dsh-market/src/client/install-source.ts:85` in
  dsh-web), and the old package name is exactly that id, so renaming the id would
  show the plugin as not installed for existing users; pointing `repo` at the
  renamed upstream, whose old address answers 301, is likewise right. What blocks
  it is that the pull request deletes the existing sentence
  "自动签到与轮询默认关闭；仅限有权使用且服务方允许的账号与功能，详见仓库免责声明"
  while the upstream README still states that check-in and rotation are off by
  default and `DISCLAIMER.md` still exists, so the sentence has to come back.
- **#27, #26 and #18 keep waiting.** Their blockers were written in the previous
  round and no commit has landed since; each is now dirty against main, so the
  next push must resolve the conflict before anything is reviewed again. This
  round neither re-reviews them nor files a second comment in their place.

## Alternatives considered

- **Letting the #23 contributor rebase instead of resolving the collision here.**
  Both sides only append at the array end, the fork allows maintainer edits, and
  the gate verifies the result, so a round trip would buy nothing that keeping
  both entries verbatim does not already give; the previous round reasoned the
  same way about #25 and #24.
- **Treating a `postinstall` install failure as an acceptable installation
  prerequisite.** The store's promise is one click, and a package that needs a
  manual `allowBuilds` approval breaks that promise for every user; other entries
  in the same index install without any install script. Documenting the manual
  approval is accepted as a fix, not as a reason to merge as is.
- **Changing #34's `id` to match the renamed upstream (`Trae2api-dsh`).** The id
  is the installed-row key, while the display name may follow the upstream rename
  - which is how the pull request already treats the repository URL.
- **Merging #28 and #33 on the strength of the index gate.** The gate validates
  the JSON contract (required fields, unique ids, category and subcategory
  validity) and says nothing about whether the package installs, which is where
  both fail.
- **Merging #33 as one pull request because `dsh-vitals` passes.** Half the
  submission is installable and half is not, so merging the whole would ship the
  failing half under a passing gate.
- **Adding another review comment to #27, #26 and #18 instead of waiting.**
  Nothing has been pushed since the previous round's comment, so a second review
  would reproduce the same findings from the same commit and add noise to a thread
  whose author has not returned; the existing comment already names the blocker,
  and the conflict is the contributor's to resolve on the next push. The one-week
  stall rule that closed five pull requests in the previous round does not apply,
  because it measures author silence and these are waiting on a push the round
  itself asked for.

## Consequences

- Main carries 137 entries, up from 136 when this round started; the one addition
  is `dsh-web-start-ui` (#23). `dsh-trae-relay` was already on main from the
  previous round, and the `dsh-archived-chats` copy changed in place.
  `community-index.cjs --check` reports `OK (137 entries)` with no duplicate id,
  and seven pull requests remain open.
- The Workshop sees `dsh-web-start-ui` and the refreshed Archive Management copy
  through the dsh-web pin: `f6e4b1a4` on that repository's `dev` moves the
  `satellites/dsh-community-plugins` gitlink from `aac4f75d` to `39ce23b` and
  rebuilds `market/dist` in the same commit, and that commit's `deploy-market` run
  is green.
- #28, #33, #32 and #34 stay open with their blockers on the pull requests; #27,
  #26 and #18 stay open, need a conflict resolution on their next push, and have
  not been re-reviewed this round.
- Checks the round confirms for later rounds: the index gate covers shape only, so
  a registration is proven by installing it in a clean profile; an install script
  is the most common reason a compliant entry cannot be installed, so
  `postinstall` is checked before a merge; and a description-only diff is safe
  when it stays inside the description fields.
- Provenance of this note's numbers: the entry count and index gate, the #35 diff,
  the #23 merge graph, the current `dsh-trae-relay` copy, the #32 file list and the
  store's matching line were re-read in this worktree and in the dsh-web checkout.
  The install reproductions (isolated `pnpm add`, `dsh plugin add` exit codes,
  package size and publish dates) are the round's measurements and were not
  reproduced here, because this worktree carries no `node_modules`.
