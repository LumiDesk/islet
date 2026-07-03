/**
 * 从 dist/ 生成 Chrome 与 Firefox 双浏览器版本目录（dist-chrome/ 与 dist-firefox/）。
 *
 * public/manifest.json 以 Firefox 完整形态为准（单一数据源），本脚本为 Chrome 做裁剪：
 *
 * - chrome_settings_overrides（主页接管）：Chrome 仅在 Windows / macOS 支持该键，
 *   Linux 上会直接拒绝加载整个扩展（"not allowed for specified platform"）；
 *   且 Chrome 要求 homepage 为完整 URL，不接受扩展内相对路径。故 Chrome 版移除，
 *   Chrome 侧只接管新标签页。
 * - browser_specific_settings：Firefox 专属键（gecko id 等），Chrome 不识别并告警。
 *
 * 本脚本被 scripts/publish.sh 与 GitHub Actions 共用，避免两处裁剪逻辑不同步。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

if (!fs.existsSync(path.join(dist, "manifest.json"))) {
  console.error("未找到 dist/manifest.json，请先执行 pnpm build");
  process.exit(1);
}

/** 复制 dist 到目标目录，并用 transform 调整其中的 manifest.json */
const make = (name, transform) => {
  const target = path.join(root, name);
  fs.rmSync(target, { recursive: true, force: true });
  fs.cpSync(dist, target, { recursive: true });

  const manifestPath = path.join(target, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  transform(manifest);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`已生成 ${name}/`);
};

make("dist-chrome", (m) => {
  delete m.chrome_settings_overrides;
  delete m.browser_specific_settings;
});

// Firefox：manifest 原样即为完整形态
make("dist-firefox", () => {});
