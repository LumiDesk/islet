/**
 * 快捷导航（quick starts）数据结构与相关工具（单一数据源）
 *
 * 磁贴外观：内置像素图标（见 navIcons.ts）或站点名首字母；主色可选自
 * 下方精选调色板，未选择时按名称稳定派生一个颜色，保证默认也井然有序。
 */

export interface Shortcut {
  /** 唯一标识 */
  id: string;
  /** 展示名称 */
  name: string;
  /** 目标地址（已归一化，含协议） */
  url: string;
  /**
   * 图标 SVG 的 path `d` 数据（选择图标时直接内联存储，
   * 使新标签页渲染磁贴无需加载庞大的图标库）；为空则展示名称首字母。
   */
  iconPath?: string;
  /** 磁贴主色（hex，如 #4a6fa5）；为空则按名称派生 */
  color?: string;
}

/**
 * 精选像素调色板：整体偏低饱和、沉稳，营造「高级质感」。
 * 深浅两种主题下均可读，前景统一用近白色。
 */
export const SHORTCUT_COLORS: string[] = [
  "#64748b", // slate
  "#c14953", // rose
  "#c2703d", // orange
  "#b7791f", // amber
  "#5b8266", // green
  "#3f7f7a", // teal
  "#3b7f99", // cyan
  "#4a6fa5", // blue
  "#5b5f97", // indigo
  "#7c6a9c", // violet
  "#b06a8f", // pink
  "#8a6d52", // brown
];

/** 磁贴前景色（图标 / 首字母），固定近白以贴合沉稳底色 */
export const SHORTCUT_FG = "#f5f5f5";

/** 按名称稳定派生一个调色板颜色（同名恒定，视觉上分布均匀） */
export const colorForName = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return SHORTCUT_COLORS[hash % SHORTCUT_COLORS.length];
};

/** 取名称首字符作为字母图标（英文大写，其余原样，空则回退 ?） */
export const initialForName = (name: string): string => {
  const ch = name.trim().charAt(0);
  if (!ch) return "?";
  return /[a-z]/.test(ch) ? ch.toUpperCase() : ch;
};

/**
 * 归一化用户输入的 URL：缺协议时补 https://。
 * 返回空字符串表示无法识别为有效地址。
 */
export const normalizeUrl = (raw: string): string => {
  const value = raw.trim();
  if (!value) return "";
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(value)
    ? value
    : `https://${value}`;
  try {
    return new URL(withScheme).href;
  } catch {
    return "";
  }
};
