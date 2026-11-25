# Agent Note: 2026-11-22 登记轮

Status: implemented

## Problem

本轮 `main` 起始 143 条（按 `id` 升序存放），宿主基线 `@deepseek-ai/dsh` 0.2.2-rc.5。`dsh-community-plugins` 有 10 个开放 PR：`#122` deep-projects、`#121` sixlayer-memory、`#120` session-color、`#119` handover-protocol、`#118` `dsh-man-031` 改名为 `dsh-man-report`、`#117` audio-reactive、`#116` HPC Style for AI、`#115` session-history、`#114` fanframe（承接被 7 天规则关闭的 `#68`）、`#100` regrevia 四插件合集。

六条来自 fork 首次贡献者的 PR（`#115`–`#117`、`#119`–`#121`）的 CI 停在 `action_required`：ruleset `main-branch-policy` 的必需检查 `community index gate, typecheck, test and build` 在未批准前不产生 check run，head 上只有 `Route PR to its reviewers`，`mergeStateStatus` 因此为 `BLOCKED`。不批准就没有可用的合并闸门。

## Decision

**合入 5 个，`main` 由 143 条增至 147 条，tip 为 `a55e815a`。** 六次 fork 运行先由维护者逐个批准，全部跑绿后再按闸门合并。

- `#114` fanframe（`0ee3a837`，squash，新增 `ui/panel`）：上轮唯一阻塞项解除。npm `fanframe@1.11.1` 的 15 个发布文件与 `AngleNaris/fanframe` 的 `main@c4d822b` 逐个 SHA-256 一致，`engines.dsh = ">=0.2.1-rc.1 <0.4.0-0"` 对 0.2.2 与 0.2.2-rc.3 都放行，`v1.10.0` / `v1.11.1` tag 齐备。正文里那张旧截图仍显示 `<=0.2.1-rc.6`、`OK (140 entries)` 也已过期，已在 review 里要求作者改正文，不阻塞内容。
- `#122` deep-projects（`c262c35e`，squash，新增 `knowledge/memory`）：`engines.dsh = ">=0.2.2-rc.1 <0.4.0-0"`，`dependencies` 为空与「零运行时依赖」一致，8 个 `projects_*` 工具与「不做提示词注入」在 `src/index.ts` 与 `src/core.ts` 里都能对上；`cordis.patch.yml` 用 `- insert: - id: deep-projects`，`ui-sidebar` 补丁在座位缺失时回落到 `sidebar.panellist`。
- `#118` 改名（`1eb4a080`，squash，目录维护）：新 `id`/`npm`/`repo` 三处可达，`dsh-man-report@1.0.0` 已是 latest，旧 `dsh-man-031@0.8.1` 带 deprecation 指引迁移。描述新增的外部行为逐项核实为真：四档情绪对应 `tierBands.money` 的 t1–t4，400 条整句录音对应 `assets/voices/amounts/` 下 400 个 mp3，`billingAmount()` 为两位小数向上取整，两个请求都是 24 小时节流、无 body 的 GET。`THIRD-PARTY-NOTICES.md` 对人物图与预制语音给出来源与「不主张权利、仅个人非商业随插件使用」的声明。不保留旧条目：`isRowMatch` 不认别名，留第二条只会让同插件并列两条。
- `#117` audio-reactive（`be830a16`，squash，新增 `ui/render`）：17 套预设、自定义预设 JSON 导入导出、按住透视、无操作沉浸遮罩都能在源码里对上；Windows 采集只在 `win32` 下用系统 PowerShell 编译 `native/WindowsLoopback.cs`，非 Windows 返回 501 且不出按钮。AGPL-3.0 与第三方声明在 `NOTICE` 与 `lib/upstream` 里齐备，插件不进本仓产物，无 copyleft 传染。
- `#115` session-history（`a55e815a`，squash，新增 `knowledge/memory`）：8 个数据源在 `lib/agents.js` 里逐一对上，WorkBuddy 在源码里本就标注实验性；依赖只有 `opencc-js@1.4.2`，npm `0.3.0` 与 repo main 逐文件哈希一致，CI 在 ubuntu/macos/windows 三平台各跑一遍。跨工具副作用（向其他 agent 的技能目录建软链）已确认有不覆盖、拒绝误删的保护，在 review 里要求作者在 README 顶部显式写一句。

**退回或待作者修改 4 个，关闭 1 个。**

- `#100`（regrevia 四插件）：11-13 的 review 之后零提交、零回复，四条意见全部未落实；分支落后 `main` 15 条并与 `community.json` 冲突。两条硬阻塞仍在：`dsh-fast-mode` 描述与 `1.7.45` 的纯提示侧实现矛盾（`index.js:965` 只读 `reasoningEffort` 记指标，注释写明不再改写请求字段），`dsh-mobile-use` 再分发 `vendor/scrcpy-server` 却未写进 `THIRD_PARTY_NOTICES.md`。已按 2026-11-16 的 7 天规则关闭：作者最后活动是 11-11 的提交，已满 11 天，用户在本轮确认关闭，关闭说明里附了完整整改清单与 reopen 指引。
- `#116` HPC Style for AI：定位不是问题（它是真插件，无 `npm` 字段也合规），问题是 `engines.dsh` 精确写成 `0.2.1-rc.5`。宿主是 0.2.2-rc.5，`semver.satisfies('0.2.2-rc.5', '0.2.1-rc.5', { includePrerelease: true })` 为 false，而宿主在有 `engines.dsh` 时只按它判定，安装前置检查会直接拒绝，条目等于「装了必然失败」。运行面其实宽松（`BUNDLED_SKILL_RANK` 与 `skills.registerProvider` 在 0.2.2-rc.5 都在），放宽区间并重新发版即可。
- `#120` session-color：描述写兼容 `0.2.1-rc.5`，但索引装到的 latest `0.3.0` 的 `engines.dsh` 已是 `>=0.2.2-rc.1 <0.3.0-0` 且客户端只走官方 `contextMenus`，照描述装会装上用不了的一版；仓库另缺 LICENSE 文件。
- `#121` sixlayer-memory：`cordis.patch.yml` 插入行的 id 是 `workbench`，与已被收录的 `dsh-workbench`（`liiydong/dsh-workbench`，同为 `- id: workbench`）撞同一个 loader 行 id，同时安装时按 id 的启用/禁用与补丁定位会串；仓库另缺 README 徽章所指向的 LICENSE 文件。apply 阶段向自身安装目录写 `docs/_rpc-diag.log` 属建议项。
- `#119` handover-protocol：条目字段与排序合规，但 `package.json` 只有 `engines.node`、没有 `engines.dsh`，商店对任何宿主版本都不设护栏；仓库两天历史、无测试无 CI，却挂了 `systemPrompt`/`tools`/`webServer`/`connection` 四个宿主服务，稳定性证据不足，已请作者写明实测的宿主版本与路径。另 `community.json:661` 把上下两条挤成 `},  {` 一行，与文件其余部分不一致。

## Alternatives considered

**继续等作者，不关闭 `#100`。** 否决：2026-11-18 那轮以「本轮不动」把它留着，但那是当时作者活动刚满 7 天的判断；到本轮作者已 11 天没有新提交或回复，四轮意见一条未落实，分支还与 `main` 冲突，继续占着队列与评审位没有收益。关闭可逆，作者补完随时 reopen，因此按规则关闭并把整改清单留在 PR 里。

**把 `#116` 的精确钉版当文案问题放过，只在描述里写清。** 否决：`engines.dsh` 存在时宿主只按它判定，句子写得再准也换不来一次能装上的安装，条目在商店里就是固定失败的路径。

**把 `#121` 的行 id 撞车当良性重叠。** 否决：`applyPatches` 用 id 建 `entryMap`，两行同 id 时后者覆盖前者，用户按 id 禁用其中一个会连带动到另一个；这是共存缺陷而不是风格差异。

**在 `#120` 上要求把 latest 指回兼容版本。** 否决：仓库侧发版策略不属本仓可决定的范围；把描述改成与最新版一致，或在描述里点明旧宿主该装 0.2.1，两条路都可行，选对作者负担小的那条。

## Consequences

- `main` 143 → 147 条；`dsh-web` 需移动 `satellites/dsh-community-plugins` 钉版并重建 `market/dist`，否则商店仍显示旧内容（`#118` 的改名尤其明显）。
- 已安装 `dsh-man-031` 的用户在商店里会显示成未安装：`isRowMatch` 只按 `id`/`npm`/`repo` 匹配，schema 没有别名或墓碑字段。迁移提示由 npm 的 deprecation 与发布说明承担。
- `#114` 与 `#115` 的 0.2.1-rc.3 壳类名写死、`dsh-unlag` 强制开启 hmr 这类上游残留仍然存在，属于已记录、留待上游版本处理的事项，不在本仓修复范围。
