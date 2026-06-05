# Islet 迭代规划 TODO

> 极简像素风浏览器起始页 · 当前版本见 `package.json` / `public/manifest.json`
> 本文档记录已确定的迭代方向与进度，便于长期维护。

---

## 📌 项目现状（已实现功能）

| 模块 | 文件 | 说明 |
| --- | --- | --- |
| 时钟 | [src/components/MainClock.vue](src/components/MainClock.vue) | HH:MM(:SS) 显示，可开关「秒」（`showSeconds`）。逐秒对齐刷新。 |
| 搜索栏 | [src/components/MainSearchBar.vue](src/components/MainSearchBar.vue) | 胶囊输入框，回车跳转。引擎：Bing / Google / Baidu（**硬编码**）。 |
| 一言 | [src/components/HitokotoWidget.vue](src/components/HitokotoWidget.vue) | 每次加载请求 `hitokoto.cn`，失败有文案兜底，可开关显示。 |
| 设置入口 | [src/components/SettingButton.vue](src/components/SettingButton.vue) | 可设为自动隐藏（`autoHideSettingButton`）。 |
| 设置面板 | [src/components/SettingPanel.vue](src/components/SettingPanel.vue) | Tabs：时钟 / 系统 / 关于。 |
| 像素控件 | [PixelSelect.vue](src/components/PixelSelect.vue) / [PixelToggle.vue](src/components/PixelToggle.vue) | 复用的下拉与开关。 |
| 主题 | [src/composables/useTheme.ts](src/composables/useTheme.ts) + [public/theme-init.js](public/theme-init.js) | light/dark/auto；首屏外部脚本防 FOUC（绕过 MV3 CSP）。 |
| 状态 | [src/store/setting.ts](src/store/setting.ts) | Pinia + 持久化（localStorage key: `islet-setting`）。 |
| i18n | [src/i18n.ts](src/i18n.ts) + [src/locales/](src/locales/) | 简体中文 / English / 日本語。 |
| 主题变量 | [src/style.css](src/style.css) | CSS 变量定义浅色/深色配色。 |

**设计原则**：极简、像素美学（Neo-brutalism）、隐私至上（零联网权限要求、零数据收集）、插件体积尽量小。

---

## 🎯 迭代任务清单

> 流程：**逐个实现 → 交给用户手动验收 → 通过后再 commit**（commit 不含 AI 署名信息）。
> 状态标记：⬜ 待开始 · 🚧 进行中 · ✅ 已完成验收

### 1. ✅ 搜索引擎可扩展 + 搜索建议（已完成 · commit e1219e5）
- ✅ 引擎配置抽到**单一数据源** [src/config/searchEngines.ts](src/config/searchEngines.ts)，消除两处硬编码。
- ✅ 新增内置 DuckDuckGo；支持**用户自定义引擎**（名称 + URL 模板，`%s` 占位）——见 [src/components/SearchEngineManager.vue](src/components/SearchEngineManager.vue)。
- ✅ 搜索建议改为 **本地搜索历史联想**（输入框下拉，支持键盘上下键 / Esc / 单条删除 / 一键清空），纯本地零联网，契合隐私卖点。可在设置中开关。
  - 说明：实时引擎联想因各引擎接口无 CORS 头、且 MV3 CSP 禁 JSONP，需 host_permissions 才能用，会破坏「零联网权限」卖点，故本期采用本地历史方案（已与你确认）。

### 2. ✅ 一言增强（已完成）
- ✅ 增加**点击刷新（换一句）**：带 loading 态防重复，刷新时图标旋转。
- ✅ 增加**点击复制**：复制「文本 —— 出处」，成功短暂显示对勾 + 「已复制」。
- ✅ 按钮平时淡出，悬停一言区域时显现，保持极简。
- ✅ 未内置本地库，仍只走 hitokoto.cn，体积不增。

### 3. ✅ 时钟样式可选（已完成）
- ✅ 12 / 24 小时制切换（12 制带小号 AM/PM）。
- ✅ 显示日期、星期，按当前语言本地化（Intl.DateTimeFormat）。
- ✅ 字号三档（小/中/大），日期同步缩放。
- 样式细节后续如需再调。

### 4. ⛔ 自定义背景（已搁置 · 暂不实现）
- 原计划：IndexedDB 存储，支持图片 / 纯色 / 渐变 / 自定义 CSS。
- 决定：当前认为非必要，跳过。如后续需要可再启用。

### 5. ⛔ 多主题 / 强调色（已搁置 · 暂不实现）
- 原计划：可选配色方案 + 强调色（涉及主题架构）。
- 决定：当前认为非必要，跳过。如后续需要可再启用。

### 6. ✅ 配置去重 + 类型收敛（已完成 · commit e1219e5）
- ✅ 引擎配置统一到 [src/config/searchEngines.ts](src/config/searchEngines.ts)（`SearchEngine` 接口 + `BUILTIN_ENGINES` + `buildSearchUrl`），`MainSearchBar` 与 `SettingPanel` 均从此读取。
- 备注：`defaultEngine` 因需兼容动态的自定义引擎 id，保持 `string` 类型（不再硬编码引擎列表，重复已消除）。

### 7. ✅ 设置导入 / 导出（已完成）
- ✅ 导出为 `islet-settings.json`（带 app/version 标识）。
- ✅ 导入逐项类型校验，非法文件不污染状态，带成功/失败反馈。
- ✅ 工具：[src/utils/settingsTransfer.ts](src/utils/settingsTransfer.ts)；入口在设置面板「设置备份」区。

---

## 🧭 建议实现顺序

1. **任务 6 + 1**（配置去重 → 搜索引擎扩展），打好数据/类型基础。
2. **任务 2**（一言增强，改动小、见效快）。
3. **任务 3**（时钟样式）。
4. **任务 5**（主题架构）——为任务 4 的样式体系铺路。
5. **任务 4**（自定义背景）。
6. **任务 7**（导入导出）——放最后，覆盖以上新增的所有设置项。

> 顺序可按需调整；每完成一项更新本文件的状态标记。
