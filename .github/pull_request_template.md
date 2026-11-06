## What

<!-- One or two sentences: the index entry or the index change. -->

## Plugin

Plugin repository URL:

<!-- Required: public https:// GitHub URL of the plugin source. -->

Plugin description:

<!-- Required: what it does, its dependencies and its known limitations. -->

## Index checklist

- [ ] `community.json` gained one entry with the next free `rank` and every required
      field (`id`, `name`, `nameEn`, `author`, `description`, `descriptionEn`,
      `repo`, `npm`, `category`, `subcategory`)
- [ ] `pnpm community:check` and `node --test scripts/community-index.test.mjs` pass
- [ ] The plugin is a cordis bundle (`dsh.bundle.patch` pointing at
      `cordis.patch.yml`, `dsh.client` browser half) typed only against the official
      `@deepseek-ai/*` SDK, with no DSH source modifications
- [ ] The author keeps the entry current as the plugin and the ecosystem move

## Verification

<!-- Paste the commands you ran and their result. -->
