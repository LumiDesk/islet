# Islet - 极简像素起始页

[![License: GPL-3.0](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-purple.svg)](https://vitejs.dev/)

**Islet** 是一个极简、优雅的浏览器新标签页扩展。它摒弃了喧嚣的信息流与复杂的组件，旨在为你的浏览器提供一个纯粹、专注且充满 8-bit 复古美学的上网起点。

> 兼容 Chrome 与 Firefox（Manifest V3），同时接管「新标签页」与「主页」。

---

## ✨ 核心特性

* **复古像素美学**：纯手工打造的 UI 组件，采用“新粗野主义 (Neo-brutalism)”设计风格，带来独特的复古游戏机质感。
* **沉浸式体验**：没有多余的干扰，专注于时间感知与快速导航。
* **多引擎搜索**：优雅的胶囊搜索框，支持一键无缝切换 Google、Bing、百度等主流引擎。
* **每日一言**：每次新建标签页，随机获取一句充满人文气息的语录，点亮你的心情。
* **智能深色模式**：随系统主题自动切换，首屏即正确着色、无闪屏，平滑的视觉过渡，全天候舒适阅读。
* **多语言**：内置简体中文、English、日本語。
* **隐私至上**：零数据收集，100% 本地运行，无需任何联网权限要求。

---

## 🛠️ 技术栈

<p align="left">
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="Sass" />
  <img src="https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=vue.js&logoColor=black" alt="Pinia" />
</p>

---

## 📦 安装使用

前往 [Releases](https://github.com/Talyra42/islet/releases) 下载最新的 `islet-vX.Y.Z.zip` 并解压，然后在浏览器中加载：

**Chrome / Edge**

1. 打开 `chrome://extensions`，开启右上角的「开发者模式」。
2. 点击「加载已解压的扩展程序」，选择解压后的文件夹。

**Firefox**

1. 打开 `about:debugging#/runtime/this-firefox`。
2. 点击「临时加载附加组件」，选择文件夹内的 `manifest.json`。

安装后新建标签页即可看到 Islet。

---

## 🚀 本地开发

> 需要 [Node.js](https://nodejs.org/) ≥ 22.13 与 [pnpm](https://pnpm.io/)。

1.  **克隆项目**
    ```bash
    git clone git@github.com:Talyra42/islet.git
    cd islet
    ```

2.  **安装依赖**
    ```bash
    pnpm install
    ```

3.  **启动开发服务器**
    ```bash
    pnpm dev
    ```

4.  **构建扩展**
    ```bash
    pnpm build
    ```
    构建完成后，产物位于 `dist/` 目录，可直接按上文「安装使用」加载。

---

## 🏷️ 发布

发布已通过 GitHub Actions 全自动化：推送一个 `vX.Y.Z` 形式的标签即可。

```bash
git tag v1.6.0
git push origin v1.6.0
```

CI 会自动完成：写入版本号到 `manifest.json` / `package.json` 并提交回 `main` → 构建 → 将 `dist/` 打包为 zip → 创建对应的 GitHub Release。无需手动改版本号或手动发布。

---

## 📄 开源协议

本项目采用 **GNU General Public License v3.0 (GPL-3.0)** 开源协议。
这意味着你可以自由地分发和修改该程序，但任何基于本项目修改后的版本发布，也必须保持开源并遵循 GPL-3.0 协议。

详见 [LICENSE](LICENSE) 文件。
