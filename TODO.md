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

### 1. ⬜ 搜索引擎可扩展 + 搜索建议
- 引擎配置抽到**单一数据源**，消除 `MainSearchBar.vue` 与 `SettingPanel.vue` 的重复定义。
- 支持更多内置引擎；支持**用户自定义引擎**（名称 + URL 模板，`%s`/占位符）。
- 增加搜索建议（联想）；注意与「隐私至上」卖点的权衡（可做成默认关闭 / 可选）。
- ⚠️ 约束：整体样式保持简洁美观，与像素风一致。

### 2. ⬜ 一言增强
- 增加**点击刷新**、**点击复制**。
- ⚠️ 约束：**不内置本地语录库**（避免增大插件体积）。

### 3. ⬜ 时钟样式可选
- 12 / 24 小时制切换。
- 显示日期、星期。
- 字号切换。
- 样式细节后续再定。

### 4. ⬜ 自定义背景
- 使用 **IndexedDB** 存储（避免 localStorage 体积限制）。
- 支持：上传图片 / 纯色 / 自定义渐变 / **自定义背景 CSS**。
- ⚠️ 约束：样式美观，提供合理的默认与预览。

### 5. ⬜ 多主题 / 强调色
- 引入可选配色方案 + 强调色。
- ⚠️ 注意：涉及整体主题架构（CSS 变量体系、`useTheme`、防闪屏脚本），需谨慎设计后再动手。

### 6. ⬜ 配置去重 + 类型收敛
- 引擎等配置统一为单一来源并派生类型。
- `defaultEngine` 等裸 `string` 收敛为联合类型（见 [setting.ts:29](src/store/setting.ts#L29)）。
- 可与任务 1 协同完成。

### 7. ⬜ 设置导入 / 导出
- 一键导出 / 导入 JSON，方便换设备迁移（纯本地，符合隐私定位）。

---

## 🧭 建议实现顺序

1. **任务 6 + 1**（配置去重 → 搜索引擎扩展），打好数据/类型基础。
2. **任务 2**（一言增强，改动小、见效快）。
3. **任务 3**（时钟样式）。
4. **任务 5**（主题架构）——为任务 4 的样式体系铺路。
5. **任务 4**（自定义背景）。
6. **任务 7**（导入导出）——放最后，覆盖以上新增的所有设置项。

> 顺序可按需调整；每完成一项更新本文件的状态标记。
