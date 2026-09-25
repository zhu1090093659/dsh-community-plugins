# @linxin666/dsh-client-ui-community-plugins

[English](README.md) | 中文

dsh web 生态的社区插件索引数据源：`community.json` 是创意工坊商店插件目录与 dsh-market.com 插件清单（`manifest/plugins.json`）的唯一来源。条目只收录第三方插件作者的仓库链接与元数据——本仓库从不搬运它们的代码。

## 功能

- 索引数据：`community.json` 由维护者审核合并（流程见 [docs/plugins.md](../../docs/plugins.md) 的「社区插件索引登记」），每条包含 `id` / `name` / `nameEn` / `author` / `repo`（必填）与 `description` / `descriptionEn` / `npm` / `category` / `subcategory`（可选；`subcategory` 为 `category` 下的二级分类，枚举见 `scripts/community-index`，仅当 `category` 已填时有效）。
- 消费方：`scripts/market-build` 从本文件派生出创意工坊商店与 dsh-market.com 的插件清单。
- 校验：`node scripts/community-index` 对索引执行契约校验（CI 门禁 `pnpm community:check` 同款）。
- 无设置面：本包不再提供任何设置界面（社区插件卡已被创意工坊商店的插件目录取代）；保留 inert cordis 行只是为了让既有 profile 与聚合包继续解析该行，安装后无任何 UI。

## 人气插件

[dsh-market.com](https://dsh-market.com) 创意工坊插件分类里人气最高的三个插件，按网站默认的「按人气」排序——它们都是 `community.json` 的条目：

| 插件 | 作者 | 分类 | 功能 |
|---|---|---|---|
| [子代理管理](https://dsh-market.com/#plugin:dsh-chatgpt-subscription)（`dsh-chatgpt-subscription`） | Aa728848 | integration / external-ai | 让 DSH 通过 ChatGPT 订阅使用 GPT 系列模型：PKCE OAuth 登录、凭据存储、流式 Responses、图片生成、Codex 搜索、额度展示与子代理管理 |
| [Mnemon 记忆系统](https://dsh-market.com/#plugin:dsh-mnemon)（`dsh-mnemon`） | omdsh-dev | knowledge / memory | 与 Mnemon CLI 集成的跨 Agent、本地优先持久记忆：用户画像、工作记忆、项目档案与长期 Memory Spaces，支持导入导出 |
| [免费搜索](https://dsh-market.com/#plugin:dsh-free-search)（`dsh-free-search`） | DDDMUC | tools / dev | 无需 API key 的多引擎网络搜索：10 个引擎自动回退、时间过滤、8 个平台搜索与 Web 设置面板 |

## 安装

本包无需直接安装；它以索引数据源身份随仓库发布。

既有 profile 若仍挂载旧卡（如聚合包），可在官方「插件」分区的插件管理 Tab 中卸载 `@linxin666/dsh-client-ui-community-plugins`（下次启动生效）。

## 已知限制

- 索引只收录链接，不校验第三方代码质量与安全；条目版权归原作者。
- 新条目进入创意工坊站与商店需运行 `node scripts/market-build` 并提交生成的 `market/dist`（`market:check` 门禁）。
