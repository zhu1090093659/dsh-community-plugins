# Agent Note: 2026-11-25 登记轮

Status: implemented

## Problem

本轮起始 `main` 共 151 条插件索引（`5c4543d3`，已为全部 123 条 npm 条目补齐精确 `version` 字段以供给官方 `Plugins -> Discover`），宿主基线为 `@deepseek-ai/dsh@0.2.3-alpha.2`。四个卫星仓开放 PR 概况如下：`dsh-pet` 与 `dsh-presets` 各 0 个；`dsh-skins` 仅 `#111`（`whale-desk` 1.1.3，11-24 已 `CHANGES_REQUESTED`，仅过 1 天且无新提交，保持等待）；`dsh-community-plugins` 共有 4 个开放 PR（均无协作者正式 review）：

1. `#261`（`shinji00222`，`dsh-persona-continuity`）：新投稿，注册仓库安装条目（无 `npm` 字段），来自首次/fork 贡献者通道，CI（run `45396866045`）停在 `action_required`。
2. `#260`（`PerryLink`，`register PerryLink plugins (135 entries)`）：作者按 11-24 维护者对单 PR 合并提审口径整理出的 135 条汇总 PR，fork CI（run `45384295398`）停在 `action_required`。经核查，正文声称已排除 6 个 `FROZEN` 仓库，但实际仓库描述、与 `main` 存量已迁出条目关系、今日新增的精确 `version` 契约以及 `0.2.3-alpha.2` 客户端依赖仍存在多处冲突。
3. `#116`（`WangZW928`，`HPC Style for AI`）与 `#119`（`CoolrfulDARkness`，`dsh-handover-protocol`）：自 11-22 留言提出修改意见后均满 3 天（未满 7 天关闭线）；`#116` 上游仓库 11-24 虽提交文档改进 `2eedf1d5`，但 `package.json` 的 `engines.dsh` 仍钉死 `0.2.1-rc.5`，两个 PR 本身均无新回应。

## Decision

**合入 `#261`（`main` 由 151 条增至 152 条），对 `#260` 提交 `REQUEST_CHANGES` 退回修改，保持 `#116` 与 `#119` 开放等待。**

### 合入 `#261` `dsh-persona-continuity`

- 先批准运行 fork CI run `45396866045` 并确认 `community index gate, typecheck, test and build` 跑绿，随后提交 `APPROVE` 并 squash 合入（提交 `f9617e28`）。
- 三性与兼容性核验：MIT 协议、零运行时依赖、`cordis.patch.yml` 为纯 LF 换行且行 ID `persona-continuity` 与现有条目及家族包无撞车；上游 `v0.2.0-preview.17` 通过 `node:sqlite` 与 `$DSH_HOME/persona-continuity/memories/` 实现独立本地 Markdown 跨会话记忆与凭据脱敏，普通会话/子会话/无痕会话默认隔离，本地运行 `npm run check && npm test` 38/38 全过；源码核查 7 个注入服务、`connection.fetch.register` 路由以及 4 个客户端 slot 均与 `0.2.3-alpha.2` 契约对齐；diff 仅新增单条且按 `id` 升序落于 `dsh-persona-continuity` 位置。
- 在 review 中附加三条非阻塞建议供下次发版完善：补齐 `package.json` 的 `engines.dsh`（例如 `>=0.2.2-rc.3 <0.4.0-0`）以启用宿主安装前预检；将 `client.js` 中 `fetch('/api/persona-continuity' + path)` 改为相对路径 `'api/persona-continuity' + path` 以兼容子路径反代；中文描述在提及「合并 Tobs Bot 模式」时补明需按仓库说明本地另行打包。

### 退回修改 `#260` `PerryLink` 135 条汇总 PR

- 按维护者确认的「同意整批单 PR」口径继续审查，提交 `REQUEST_CHANGES`（暂不批准 fork CI run `45384295398`）。
- 先确认全量核查通过的部分：135 个 npm `latest` tarball 全部可解析、全部满足 `0.2.2-rc.5` 与 `0.2.3-alpha.2` 的 `engines.dsh` 且均包含 `LICENSE`；135 条内部及与 `dsh-web` 家族不存在 `cordis.patch.yml` 行 ID 冲突；7 个非冻结客户端 UI 插件中 `dsh-memento` 路由走 `webServer.register`（`0.2.3-alpha.2` 默认鉴权）。
- 要求作者落实以下五项阻塞后复评：
  1. **移出 6 个仍标注 `FROZEN` 的仓库**：`dsh-autotier`（`[FROZEN 2026-10-31]`）、`dsh-budget`、`dsh-claude-move`、`dsh-defend`（其 tarball 内 `cordis.patch.yml` 还含 CRLF 换行）、`dsh-draw`、`dsh-reach`（这 5 个仓库描述均含 `Maintenance status: FROZEN since 2026-10-05`）。
  2. **替换而非并列 `main` 现有 5 组已迁移旧条目**：删除已归档或标记 MOVED 的旧条目 `dsh-plugin-doctor`（对应 `dsh-clinic`，两者 `cordis.patch.yml` 行 ID 均为 `plugin-doctor`）、`dsh-ticktick`（对应 `dsh-dida`，两者行 ID 均为 `ticktick`）、`dsh-github`（对应 `dsh-github-bot`）、`dsh-plugin-upgrade`（对应 `dsh-codemod`）、`dsh-plugin-kit`（对应 `dsh-scaffold`）。其中 `dsh-scaffold` 的 `cordis.patch.yml` 为空数组 `[]`（共享库而非独立插件），建议删去旧 `dsh-plugin-kit` 且不新增 `dsh-scaffold`。
  3. **基于最新 `main`（`5c4543d3` 之后）补齐全部 `version` 字段**：逐条填入 npm `latest` 的精确 SemVer 字符串，否则全部 135 条不会进入官方 `Plugins -> Discover`。
  4. **修复 `0.2.3-alpha.2` 兼容性问题**：`dsh-permission-rules`（`0.8.7`）的 `dsh.client.inject` 与 `peerDependencies` 仍引用已移除的 `@deepseek-ai/dsh-client-web`；`dsh-doublecheck`（`0.9.36`）的非可选 `peerDependencies` 含 `0.2.3-alpha.2` 已不存在的 `@deepseek-ai/dsh-invariants`（未在 `peerDependenciesMeta` 标为 optional），需发新版清理并同步 `version`。另附非阻塞建议：`dsh-dida`（`0.2.1`）与 `dsh-github-bot`（`0.9.2`）的 `dsh.client.inject` 分别列入了平台静态模块 `@deepseek-ai/dsh-client-ui-primitives` 与 `@deepseek-ai/dsh-client-ui-slots`，建议移出。
  5. **`dsh-famling` 非商用许可写进商店文案**：已核实上游 `LICENSE`（`PolyForm-Noncommercial-1.0.0`）、`LICENSE-ART`（`CC BY-NC-SA 4.0`）与 `NOTICE` 确认属于原创 OC 素材、未打包第三方素材；要求在 `community.json` 中英文描述中明确写明非商用许可与「非官方、不关联 DeepSeek」。

### 保持 `#116` 与 `#119` 开放等待

- 两个 PR 距 11-22 评审反馈均仅满 3 天（未满 7 天关闭线），保持开放等待作者回应，本轮不重复评论。

## Alternatives considered

- **直接关闭 `#260` 维持 11-24 批量拒收口径。** 否决：维护者已同意作者整理为单个汇总 PR 提审，本轮改为按内容、兼容与目录规范给出完整可执行的整改清单并退回修改。
- **先合入 `#260` 再在后续 PR 补 `version` 字段或清理 5 组旧条目。** 否决：`5c4543d3` 之后缺 `version` 会导致 135 条全部进不了 `Plugins -> Discover`，且 `dsh-clinic`/`dsh-dida` 与存量 `dsh-plugin-doctor`/`dsh-ticktick` 共享完全相同的 `cordis.patch.yml` 行 ID，并列合入会导致索引重复与 loader 行覆盖。
- **因 `dsh-persona-continuity` 缺少 `engines.dsh` 而阻塞 `#261`。** 否决：参照 `#123`（`dsh-connectors`）先例，缺失 `engines.dsh` 时宿主不触发前置版本拒绝，且 `#261` 的 38/38 单测与 `0.2.3-alpha.2` 服务端/客户端接口已全部核对通过，作为非阻塞建议写入 review 即可。

## Consequences

- `dsh-community-plugins` `main` 由 151 条增至 152 条（`#261` 合入提交 `f9617e28`），需同步在 `dsh-web` 移动 `satellites/dsh-community-plugins` 钉版并重建 `market/dist` 使 Workshop 商店收录 `dsh-persona-continuity`（无 `npm` 字段，通过 `repo` 安装，不进 `plugin-market-index.json`）。
- `#260` 保持开放等待作者完成 5 项修订并推送后批准 CI 复评。
