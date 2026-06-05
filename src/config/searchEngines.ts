/**
 * 搜索引擎统一配置（单一数据源）
 *
 * 组件与设置面板都从这里读取引擎，避免多处硬编码不同步。
 */

export interface SearchEngine {
  /** 唯一标识；持久化在设置里的 defaultEngine 即引用此 id */
  id: string;
  /** 展示名称 */
  name: string;
  /** 搜索 URL 模板，用 %s 占位关键词；无 %s 时关键词直接拼接到末尾 */
  searchUrl: string;
  /** 是否内置（内置引擎不可编辑/删除） */
  builtin?: boolean;
}

/** 内置搜索引擎；id 与历史版本保持一致以兼容已持久化的设置 */
export const BUILTIN_ENGINES: SearchEngine[] = [
  {
    id: "bing",
    name: "Bing",
    searchUrl: "https://www.bing.com/search?q=%s",
    builtin: true,
  },
  {
    id: "google",
    name: "Google",
    searchUrl: "https://www.google.com/search?q=%s",
    builtin: true,
  },
  {
    id: "baidu",
    name: "Baidu",
    searchUrl: "https://www.baidu.com/s?wd=%s",
    builtin: true,
  },
  {
    id: "duckduckgo",
    name: "DuckDuckGo",
    searchUrl: "https://duckduckgo.com/?q=%s",
    builtin: true,
  },
];

/** 根据引擎与关键词拼接最终跳转地址 */
export const buildSearchUrl = (engine: SearchEngine, query: string): string => {
  const encoded = encodeURIComponent(query);
  return engine.searchUrl.includes("%s")
    ? engine.searchUrl.split("%s").join(encoded)
    : engine.searchUrl + encoded;
};
