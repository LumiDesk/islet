#!/usr/bin/env bash
#
# Islet 发布脚本：升级版本号 -> 构建 -> 生成 Chrome / Firefox 双版本 zip -> 提交 + 打 tag。
#
# 用法：
#   scripts/publish.sh patch          # 1.7.0 -> 1.7.1
#   scripts/publish.sh minor          # 1.7.0 -> 1.8.0
#   scripts/publish.sh major          # 1.7.0 -> 2.0.0
#   scripts/publish.sh 1.9.3          # 指定版本号
#   scripts/publish.sh build          # 不改版本号，仅按当前版本构建双浏览器 zip（本地调试用）
#
# 产物位于 release/ 目录：
#   islet-vX.Y.Z-chrome.zip    （移除了 Firefox 专属键，Chrome 可正常加载）
#   islet-vX.Y.Z-firefox.zip   （完整 manifest，含主页接管与 gecko id）
#
# 脚本最后会询问是否推送 main 与 tag 到 origin；推送 tag 即触发 GitHub Actions
# 自动创建 Release（CI 会用同样的 scripts/make-browser-dists.mjs 生成双版本 zip）。

set -euo pipefail
cd "$(dirname "$0")/.."

usage() {
  sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
}

BUMP="${1:-}"
[[ -z "$BUMP" ]] && usage

# ---------- 仅构建模式：不动版本号与 git ----------
build_zips() {
  local version="$1"
  pnpm build
  node scripts/make-browser-dists.mjs
  mkdir -p release
  rm -f "release/islet-v${version}-chrome.zip" "release/islet-v${version}-firefox.zip"
  (cd dist-chrome && zip -qr "../release/islet-v${version}-chrome.zip" .)
  (cd dist-firefox && zip -qr "../release/islet-v${version}-firefox.zip" .)
  echo ""
  echo "产物："
  echo "  release/islet-v${version}-chrome.zip"
  echo "  release/islet-v${version}-firefox.zip"
}

if [[ "$BUMP" == "build" ]]; then
  VERSION=$(node -p "require('./package.json').version")
  build_zips "$VERSION"
  exit 0
fi

# ---------- 发布前检查 ----------
if [[ -n "$(git status --porcelain)" ]]; then
  echo "错误：工作区有未提交的改动，请先提交或 stash。" >&2
  exit 1
fi

BRANCH=$(git branch --show-current)
if [[ "$BRANCH" != "main" ]]; then
  echo "错误：当前分支为 '$BRANCH'，发布须在 main 分支进行。" >&2
  exit 1
fi

# ---------- 计算新版本号 ----------
VERSION=$(node -e '
  const cur = require("./package.json").version;
  const arg = process.argv[1];
  let v;
  if (/^\d+\.\d+\.\d+$/.test(arg)) {
    v = arg;
  } else {
    const [ma, mi, pa] = cur.split(".").map(Number);
    if (arg === "major") v = `${ma + 1}.0.0`;
    else if (arg === "minor") v = `${ma}.${mi + 1}.0`;
    else if (arg === "patch") v = `${ma}.${mi}.${pa + 1}`;
    else { console.error(`非法参数: ${arg}（应为 patch / minor / major / X.Y.Z / build）`); process.exit(1); }
  }
  console.log(v);
' "$BUMP")

if git rev-parse -q --verify "refs/tags/v${VERSION}" > /dev/null; then
  echo "错误：tag v${VERSION} 已存在。" >&2
  exit 1
fi

echo "版本：$(node -p "require('./package.json').version") -> ${VERSION}"

# ---------- 写入版本号（与 CI 的写回逻辑保持一致） ----------
node -e '
  const fs = require("fs");
  const version = process.argv[1];
  for (const file of ["public/manifest.json", "package.json"]) {
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    json.version = version;
    fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
  }
' "$VERSION"

# ---------- 构建并打包（失败则回滚版本号改动） ----------
if ! build_zips "$VERSION"; then
  git checkout -- public/manifest.json package.json
  echo "错误：构建失败，版本号改动已回滚。" >&2
  exit 1
fi

# ---------- 提交 + 打 tag ----------
git add public/manifest.json package.json
git commit -m "chore: 发布 v${VERSION}"
git tag "v${VERSION}"
echo ""
echo "已提交版本号并创建 tag v${VERSION}。"

# ---------- 推送（触发 GitHub Release） ----------
read -r -p "是否推送 main 与 tag v${VERSION} 到 origin 以触发 GitHub Release？[y/N] " ans
if [[ "$ans" =~ ^[Yy]$ ]]; then
  git push origin main "v${VERSION}"
  echo "已推送，GitHub Actions 将自动创建 Release。"
else
  echo "未推送。稍后可手动执行：git push origin main v${VERSION}"
fi
