/**
 * 快捷导航内置像素图标（单一数据源）
 *
 * 图标取自 pixelarticons（https://github.com/halfmage/pixelarticons，MIT License）。
 * 均为单色像素 SVG，通过 `currentColor` 换色；每个图标仅存储合并后的 path 数据，
 * 由 PixelIcon.vue 统一渲染。纯本地内置，零联网（不拉取远程 favicon）。
 *
 * 视图坐标系统一为 24×24。
 */

/** 图标 id -> path 的 `d` 数据 */
export const NAV_ICONS: Record<string, string> = {
  // UI 操作图标（用于快捷导航的新增 / 编辑 / 删除按钮，始终随主包内置）
  plus: "M13 11h7v2h-7v7h-2v-7H4v-2h7V4h2v7Z",
  close:
    "M7 19H5V17H7V19ZM19 19H17V17H19V19ZM9 15V17H7V15H9ZM17 17H15V15H17V17ZM11 15H9V13H11V15ZM15 15H13V13H15V15ZM13 13H11V11H13V13ZM11 11H9V9H11V11ZM15 11H13V9H15V11ZM9 9H7V7H9V9ZM17 9H15V7H17V9ZM7 7H5V5H7V7ZM19 7H17V5H19V7Z",
  globe:
    "M6 2h12v2H6zm0 18h12v2H6zM4 4h2v2H4zm5 0h2v2H9zm0 14h2v2H9zm4 0h2v2h-2zM7 6h2v12H7zm8 0h2v12h-2zm-2-2h2v2h-2zm7 0h-2v2h2zM2 6h2v12H2zm20 0h-2v12h2zM4 18h2v2H4zm16 0h-2v2h2z M3 11h18v2H3z",
  home: "M4 20h16v2H4zm16-10h2v10h-2zM2 10h2v10H2zm2-2h2v2H4zm2-2h2v2H6zm2-2h2v2H8zm2-2h4v2h-4zm4 2h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2zM8 14h2v6H8zm2-2h4v2h-4zm4 2h2v6h-2z",
  search:
    "M22 22h-2v-2h2v2Zm-2-2h-2v-2h2v2Zm-6-2H6v-2h8v2Zm4 0h-2v-2h2v2ZM6 16H4v-2h2v2Zm10 0h-2v-2h2v2ZM4 14H2V6h2v8Zm14 0h-2V6h2v8ZM6 6H4V4h2v2Zm10 0h-2V4h2v2Zm-2-2H6V2h8v2Z",
  mail: "M6 8h2v2H6zm2 2h2v2H8zm10-2h-2v2h2zm-2 2h-2v2h2zm-6 2h4v2h-4zM2 6h2v12H2zm18 0h2v12h-2zM4 4h16v2H4zm0 14h16v2H4z",
  "message-text":
    "M20 2H4v2h16zm0 14H6v2h14zm2-12h-2v12h2zM4 4H2v18h2zm2 14H4v2h2zm0-6h4v2H6zm0-4h8v2H6z",
  comment: "M4 2h16v2H4zm0 14h14v2H4zM2 4h2v12H2zm18 0h2v18h-2zm-2 14h2v2h-2z",
  user: "M9 2h6v2H9zm0 8h6v2H9zm6-6h2v6h-2zM7 4h2v6H7zM4 18h2v4H4zm14 0h2v4h-2zM8 14h8v2H8zm-2 2h2v2H6zm10 0h2v2h-2z",
  users:
    "M5 2h6v2H5zm10 0h4v2h-4zM5 10h6v2H5zm10 0h4v2h-4zm4-6h2v6h-2zm-8 0h2v6h-2zM3 4h2v6H3zM0 18h2v4H0zm14 0h2v4h-2zm8 0h2v4h-2zM4 14h8v2H4zm12 0h4v2h-4zM2 16h2v2H2zm10 0h2v2h-2zm8 0h2v2h-2z",
  video: "M20 17V7h2v10zm-2-2V9h2v6zM2 7h2v10H2zm14 0h2v10h-2zM4 5h12v2H4zm0 12h12v2H4z",
  play: "M15 11h-2V9h2zm0 4h-2v-2h2zm-2 2h-2v-2h2zm0-8h-2V7h2zm-2-2H9V5h2zM9 21H7V3h2zm6-8h2v-2h-2zm-6 4h2v2H9z",
  clapperboard:
    "M4 3h16v2H4zm0 6h16v2H4zM2 5h2v14H2zm18 0h2v14h-2zM4 19h16v2H4zM18 7h-2v2h2zm-8 0H8v2h2zm6-2h-2v2h2zM8 5H6v2h2z",
  tv: "M4 3h16v2H4zM2 5h2v10H2zm2 10h16v2H4zM20 5h2v10h-2zM6 19h12v2H6zm3-2h2v2H9zm4 0h2v2h-2z",
  music:
    "M4 12h4v2H4zm-2 2h2v4H2zm2 4h4v2H4zM8 6h2v12H8zm10 0h2v12h-2zm-6 8h2v4h-2zm2-2h4v2h-4zm0 6h4v2h-4zM10 4h8v2h-8z",
  headphone:
    "M14 13h7v2h-7zm2 6h3v2h-3z M14 13h2v8h-2zm5-6h2v12h-2zM3 13h7v2H3zm2 6h3v2H5z M3 7h2v12H3zm5 6h2v8H8zM7 3h10v2H7zM5 5h2v2H5zm12 0h2v2h-2z",
  "git-branch":
    "M4 14h4v2H4zm0 6h4v2H4zm-2-4h2v4H2zm6 0h2v4H8zm8-14h4v2h-4zm0 6h4v2h-4zm-2-4h2v4h-2zm6 0h2v4h-2zm-8 13h5v2h-5zm5-5h2v5h-2zM5 2h2v10H5z",
  terminal:
    "M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zM6 16h2v2H6zm2-2h2v2H8zm-2-2h2v2H6z",
  braces:
    "M6 4h4v2H6zm12 0h-4v2h4zM6 20h4v-2H6zm12 0h-4v-2h4zM4 6h2v5H4zm16 0h-2v5h2zM4 18h2v-5H4zm16 0h-2v-5h2zM2 11h2v2H2zm20 0h-2v2h2z",
  "shopping-cart":
    "M2 2h2v2H2zm2 6h2v4H4zm2 4h2v4H6zm2 4h10v2H8zm10-4h2v4h-2zm2-4h2v4h-2zM4 6h18v2H4zm0-4h2v4H4zm2 17h3v3H6zm11 0h3v3h-3z",
  "shopping-bag":
    "M3 6h18v2H3zm2 14h14v2H5zM3 8h2v12H3zm16 0h2v12h-2z M7 4h2v6H7zm2-2h6v2H9zm6 2h2v6h-2z",
  store:
    "M3 13h2v8H3zm2 8h14v2H5zm14-8h2v8h-2zm-9-2h4v2h-4zm4-2h4v2h-4zm4 2h4v2h-4zM6 9h4v2H6zm-4 2h4v2H2zM0 7h2v4H0zm2-2h2v2H2zm18 0h2v2h-2zm2 2h2v4h-2zM4 3h16v2H4zm6 12h4v2h-4zm-2 2h2v4H8zm6 0h2v4h-2z",
  "credit-card":
    "M4 4h16v2H4zm0 14h16v2H4zM2 6h2v12H2zm18 0h2v12h-2zM4 8h16v4H4zm2 6h6v2H6z",
  wallet:
    "M18 5h2v2h-2zM4 3h14v2H4zM2 5h2v14H2zm2 14h16v2H4zm12-4h6v2h-6zm0-4h6v2h-6zm-2 0h2v6h-2z M20 7h2v12h-2zM4 7h16v2H4z",
  image:
    "M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-4 8h2v2h-2zm-2 2h2v2h-2zm4 0h2v2h-2zm-8 0h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2z M20 16h2v2h-2zM8 16h2v2H8zm-2 2h2v2H6zM8 6h2v2H8zM6 8h2v2H6zm2 2h2v2H8zm2-2h2v2h-2z",
  images:
    "M7 2h14v2H7zm0 14h14v2H7zm-4 4h14v2H3zM5 4h2v12H5zM1 8h2v12H1zm20-4h2v12h-2zm-4 6h2v2h-2zm2 2h2v2h-2zm-4 0h2v2h-2zm-2 2h2v2h-2zm-2-8h2v2h-2zM9 8h2v2H9zm2 2h2v2h-2zm2-2h2v2h-2zM3 6h2v2H3zm14 12h2v2h-2z",
  camera:
    "M4 5h4v2H4zm4-2h8v2H8zm8 2h4v2h-4zM2 7h2v12H2zm2 12h16v2H4zM20 7h2v12h-2zM10 8h4v2h-4zm0 6h4v2h-4zm-2-4h2v4H8zm6 0h2v4h-2z",
  cloud:
    "M22 10h-4v2h4v-2Zm2 2h-2v6h2v-6Zm-2 6H2v2h20v-2ZM2 12H0v6h2v-6Zm2-2H2v2h2v-2Zm4-2H4v2h4V8Zm8-4h-6v2h6V4Zm-6 2H8v2h2V6Zm0 4H8v2h2v-2Zm8-4h-2v2h2V6Z M20 8h-2v4h2V8Zm-2 4h-2v2h2v-2Z",
  "cloud-server":
    "M20 6h-2v2h2V6Zm2 2h-2v4h2V8Zm-2 4H4v2h16v-2ZM4 8H2v4h2V8Zm4-2H4v2h4V6Zm8-4h-6v2h6V2Zm-6 2H8v2h2V4Zm0 4H8v2h2V8Zm8-4h-2v2h2V4Zm0 4h-2v2h2V8Zm-7 8h2v2h-2zm0 4h2v2h-2zm-7-2h7v2H4zm9 0h7v2h-7zm-2-4h2v2h-2z",
  database:
    "M2 6h2v4H2zm0 4h2v4H2zm0 4h2v4H2zm18-8h2v4h-2zm0 4h2v4h-2zm0 4h2v4h-2zM4 4h4v2H4zm0 8h4v-2H4zm0 4h4v-2H4zm0 4h4v-2H4zM16 4h4v2h-4zm0 8h4v-2h-4zm0 4h4v-2h-4zm0 4h4v-2h-4zM8 2h8v2H8zm0 12h8v-2H8zm0 4h8v-2H8zm0 4h8v-2H8z",
  server: "M6 7h4v2H6zm0 8h4v2H6zM2 5h2v14H2zm18 0h2v14h-2zM4 19h16v2H4zM4 3h16v2H4zm0 8h16v2H4z",
  "book-open":
    "M2 3h9v2H2zM0 19h11v2H0zM13 3h9v2h-9zm0 16h11v2H13zM11 5h2v18h-2zM0 5h2v14H0zm22 0h2v14h-2zm-7 2h5v2h-5zm0 4h5v2h-5zm0 4h2v2h-2z",
  library: "M3 4h2v17H3zm4 4h2v13H7zm4-2h2v15h-2zm4 0h2v5h-2zm2 5h2v5h-2zm2 5h2v5h-2z",
  article:
    "M8 2h12v2H8zM6 4h2v16H6zm14 0h2v16h-2zM4 20h16v2H4zm-2-9h2v9H2zm2-2h2v2H4zm6-3h8v2h-8zm0 4h8v2h-8zm0-2h2v2h-2zm6 0h2v2h-2zm-6 5h8v2h-8zm0 3h4v2h-4z",
  rss: "M4 10h6v2H4zm8 4h2v6h-2zm6 0h2v6h-2zM4 16h4v4H4zm12-6h2v4h-2zm-2-2h2v2h-2zM4 4h6v2H4zm6 2h4v2h-4zm0 6h2v2h-2z",
  feather:
    "M2 20h2v2H2zm6-2h6v2H8zm-2-2h2v2H6zm-2 2h2v2H4zm4-4h2v2H8zm2-2h2v2h-2zm2-2h2v2h-2zm2-2h2v2h-2zm0 8h2v2h-2zm2-2h2v2h-2zm2-2h2v2h-2zm2-6h2v6h-2zm-2-2h2v2h-2zM4 10h2v6H4zm2-2h2v2H6zm2-2h2v2H8zm2-2h2v2h-2zm2-2h6v2h-6z",
  pencil:
    "M4 16H6V18H8V20H10V22H2V14H4V16ZM12 20H10V18H12V20ZM14 18H12V16H14V18ZM10 16H8V14H10V16ZM16 16H14V14H16V16ZM6 14H4V12H6V14ZM12 14H10V12H12V14ZM18 14H16V12H18V14ZM8 12H6V10H8V12ZM14 12H12V10H14V12ZM20 12H18V10H20V12ZM10 10H8V8H10V10ZM18 10H16V8H18V10ZM22 10H20V8H22V10ZM12 8H10V6H12V8ZM16 8H14V6H16V8ZM20 8H18V6H20V8ZM14 6H12V4H14V6ZM18 6H16V4H18V6ZM16 4H14V2H16V4Z",
  calendar:
    "M5 4h14v2H5zm0 16h14v2H5zM3 10h2v10H3zm0-4h2v2H3zm16 0h2v2h-2zm0 4h2v10h-2zM3 8h18v2H3zm12-6h2v2h-2zM7 2h2v2H7z",
  "map-pin":
    "M7 2h10v2H7zM5 4h2v2H5zm14 0h-2v2h2zM7 17h2v2H7zm2 2h2v2H9zm6-2h2v2h-2zm-2 2h2v2h-2zm-2 2h2v2h-2zm-6-7h2v3H5zm12 0h2v3h-2zM3 6h2v8H3zm18 0h-2v8h2zM10 6h4v2h-4zM8 8h2v4H8zm2 4h4v2h-4zm4-4h2v4h-2z",
  coffee:
    "M4 4h16v2H4zm0 2h2v8H4zm2 8h10v2H6zm14-8h2v4h-2zm-2 4h2v2h-2zm-2-4h2v8h-2zM2 18h18v2H2z",
  heart:
    "M13 22h-2v-2h2v2Zm-2-2H9v-2h2v2Zm4 0h-2v-2h2v2Zm-6-2H7v-2h2v2Zm8 0h-2v-2h2v2ZM7 16H5v-2h2v2Zm12 0h-2v-2h2v2ZM5 14H3v-2h2v2Zm16 0h-2v-2h2v2ZM3 12H1V6h2v6Zm20 0h-2V6h2v6ZM13 8h-2V6h2v2ZM5 6H3V4h2v2Zm6 0H9V4h2v2Zm4 0h-2V4h2v2Zm6 0h-2V4h2v2ZM9 4H5V2h4v2Zm10 0h-4V2h4v2Z",
  star: "M5 20H8V22H3V16H5V20ZM21 22H16V20H19V16H21V22ZM10 20H8V18H10V20ZM16 20H14V18H16V20ZM14 18H10V16H14V18ZM7 16H5V13H7V16ZM19 16H17V13H19V16ZM5 13H3V11H5V13ZM21 13H19V11H21V13ZM9 9H3V11H1V7H9V9ZM23 11H21V9H15V7H23V11ZM11 7H9V3H11V7ZM15 7H13V3H15V7ZM13 3H11V1H13V3Z",
  bookmark:
    "M6 2h12v2H6zM4 4h2v18H4zm14 0h2v18h-2zm-2 16h2v2h-2zm-2-2h2v2h-2zm-8 2h2v2H6zm2-2h2v2H8zm2-2h4v2h-4z",
  folder: "M4 4h6v2H4zm0 14h16v2H4zM20 8h2v10h-2zM2 6h2v12H2zm8 0h10v2H10z",
  download:
    "M21 15v4h-2v-4zm-2 4v2H5v-2zM5 15v4H3v-4zm8-12v14h-2V3z M7 11v2h10v-2zm2 2v2h2v-2zm4 0v2h2v-2z M15 11v2h2v-2z",
  link: "M4 6h7v2H4zm0 10h7v2H4zM2 8h2v8H2zm18-2h-7v2h7zm0 10h-7v2h7zm2-8h-2v8h2zM7 11h10v2H7z",
  briefcase:
    "M2 8h2v12H2zm18 0h2v12h-2zM4 6h16v2H4zm0 14h16v2H4zM8 4h2v2H8zm2-2h4v2h-4zm4 2h2v2h-2z",
  gamepad:
    "M4 4h16v2H4zm0 14h16v2H4zM2 6h2v12H2zm18 0h2v12h-2zM8 9h2v6H8z M6 11h6v2H6zm8-2h2v2h-2zm2 4h2v2h-2z",
  university:
    "M1 10h2v10H1zm2 10h18v2H3zm18-10h2v10h-2zM3 8h4v2H3zm14 0h4v2h-4zM7 6h2v2H7zm2-2h2v2H9zm2-2h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2zm-4 2h2v2h-2zm-2 2h2v2H9zm2 2h2v2h-2zm2-2h2v2h-2zm-8 3h2v2H5zm0 4h2v2H5zm12 0h2v2h-2zm0-4h2v2h-2zm-8 5h2v2H9zm0-2h6v2H9zm4 2h2v2h-2z",
  lightbulb:
    "M9 4h6v2H9zM7 6h2v2H7zm8 0h2v2h-2zm4-2h2v2h-2zm2-2h2v2h-2zM0 10h3v2H0zm21 0h3v2h-3zM3 4h2v2H3zM1 2h2v2H1zm6 12h2v2H7zm8 0h2v2h-2zM5 8h2v6H5zm12 0h2v6h-2zm-8 8h6v2H9zm0 4h6v2H9zm0-2h2v2H9zm4 0h2v2h-2zM11 0h2v3h-2z",
  flag: "M4 2h2v20H4z M4 4h16v2H4zm12 2h2v2h-2zm-2 2h2v2h-2zm2 2h2v2h-2zM4 12h16v2H4z",
  zap: "M4 13h8v6h2v2h-2v2h-2v-8H2v-4h2v2Zm12 6h-2v-2h2v2Zm2-2h-2v-2h2v2Zm2-2h-2v-2h2v2Zm-6-6h8v4h-2v-2h-8V5h-2V3h2V1h2v8Zm-8 2H4V9h2v2Zm2-2H6V7h2v2Zm2-2H8V5h2v2Z",
  chart: "M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zM7 11h2v6H7zm4-4h2v10h-2zm4 6h2v4h-2z",
  analytics:
    "M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-9 8h2v6h-2zm-4 2h2v4H7zm8-8h2v12h-2z",
  gift: "M4 6h16v2H4zM2 8h2v4H2zm2 4h16v2H4zm16-4h2v4h-2zM6 4h2v2H6zm2-2h3v2H8zm3 2h2v2h-2zm2-2h3v2h-3zm3 2h2v2h-2zM4 14h2v6H4zm2 6h12v2H6zm12-6h2v6h-2zm-7-6h2v4h-2zm0 6h2v6h-2z",
  "info-box": "M4 2h16v2H4zm0 18h16v2H4zM2 4h2v16H2zm18 0h2v16h-2zm-9 5h2V7h-2zm0 8h2v-6h-2z",
};

/** 图标 id 列表（决定选择器中的展示顺序） */
export const NAV_ICON_IDS: string[] = Object.keys(NAV_ICONS);
