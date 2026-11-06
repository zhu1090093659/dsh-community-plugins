# Contributing

This repository is the community plugin index for the dsh web ecosystem.
`community.json` is the single source of the Workshop store plugin list and the
`dsh-market.com` plugin manifest, so an entry added here reaches every user of
the family bundle.

## Adding or updating a plugin entry

1. Append one object to `community.json` with the next free `rank`.
2. Fill every required field: `id`, `name`, `nameEn`, `author`,
   `description`, `descriptionEn`, `repo`, `npm`, `category`,
   `subcategory`.
3. Run the gate and the tests before pushing:

   ```sh
   pnpm install
   pnpm community:check
   node --test scripts/community-index.test.mjs
   ```

The gate rejects malformed registrations: `repo` must be an `https://` URL
without whitespace or shell metacharacters (the market turns it into a shell
command) and `npm` must be a valid npm package name. `pnpm test` covers the
same validation through the module API.

## Commit and review

Use Conventional Commits (`feat(community-plugins): ...`, `fix(...)`,
`docs(...)`). Do not use emoji in code, comments, documentation, or commit
messages. Keep changes to one entry per commit where practical so the diff is
reviewable.

## Release

The version is per-repository: it advances here and no longer with the dsh-web
monorepo. To cut a release, bump `version` in `package.json`, add the matching
`docs/release-notes/vX.Y.Z.md`, commit both, then push the tag:

```sh
git tag vX.Y.Z
git push origin vX.Y.Z
```

The tag is the release switch. `.github/workflows/release.yml` reruns the CI
gates, refuses to publish when `package.json` disagrees with the tag, publishes
to npm, verifies the version resolves from the registry, and creates the GitHub
Release. It needs the repository secret `NPM_TOKEN` (an npm automation token for
the `@linxin666` scope).

