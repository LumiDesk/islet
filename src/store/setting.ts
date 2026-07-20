import type { LanguageTypes } from "@/types/language";
import type { SearchEngine } from "@/config/searchEngines";
import type { Shortcut } from "@/config/shortcuts";
import { normalizeUrl } from "@/config/shortcuts";
import { defineStore } from "pinia";
import { ref } from "vue";

/** 搜索历史最多保留的条数 */
const MAX_HISTORY = 50;

/**
 * 设置相关的 Store
 */
export const useSettingStore = defineStore(
  "islet-setting",
  () => {
    /**
     * 是否展示设置面板
     */
    const isSettingOpen = ref(false);

    /**
     * 是否展示一言
     */
    const showHitokoto = ref(true);

    /**
     * 是否展示秒
     */
    const showSeconds = ref(true);

    /**
     * 时间制式：24 小时制 / 12 小时制
     */
    const hourFormat = ref<"24" | "12">("24");

    /**
     * 是否展示日期
     */
    const showDate = ref(false);

    /**
     * 是否展示星期
     */
    const showWeekday = ref(false);

    /**
     * 时钟字号：小 / 中 / 大
     */
    const clockSize = ref<"small" | "medium" | "large">("medium");

    /**
     * 默认搜索引擎（引用 searchEngines 中的 id，可为内置或自定义）
     */
    const defaultEngine = ref("bing");

    /**
     * 用户自定义的搜索引擎
     */
    const customEngines = ref<SearchEngine[]>([]);

    /**
     * 是否启用搜索历史联想（纯本地，不联网）
     */
    const enableSearchHistory = ref(true);

    /**
     * 搜索历史记录（最新在前）
     */
    const searchHistory = ref<string[]>([]);

    /**
     * 主题模式，默认跟随系统
     */
    const theme = ref<"light" | "dark" | "auto">("auto");

    /**
     * 当前语言
     */
    const language = ref<LanguageTypes>("zh");

    /**
     * 是否自动隐藏设置按钮
     */
    const autoHideSettingButton = ref(false);

    /**
     * 是否展示搜索栏下方的快捷导航
     */
    const showShortcuts = ref(true);

    /**
     * 快捷导航列表（用户自定义的常用网站）
     */
    const shortcuts = ref<Shortcut[]>([]);

    /** 新增一条搜索历史（去重并置顶，超出上限则截断） */
    const addSearchHistory = (term: string) => {
      const value = term.trim();
      if (!value) return;
      const next = searchHistory.value.filter((item) => item !== value);
      next.unshift(value);
      searchHistory.value = next.slice(0, MAX_HISTORY);
    };

    /** 删除某一条搜索历史 */
    const removeSearchHistory = (term: string) => {
      searchHistory.value = searchHistory.value.filter((item) => item !== term);
    };

    /** 清空搜索历史 */
    const clearSearchHistory = () => {
      searchHistory.value = [];
    };

    /** 添加自定义搜索引擎 */
    const addCustomEngine = (name: string, searchUrl: string) => {
      customEngines.value = [
        ...customEngines.value,
        { id: `custom-${crypto.randomUUID()}`, name, searchUrl, builtin: false },
      ];
    };

    /** 删除自定义搜索引擎；若删除的是当前默认引擎，回退到 bing */
    const removeCustomEngine = (id: string) => {
      customEngines.value = customEngines.value.filter((e) => e.id !== id);
      if (defaultEngine.value === id) defaultEngine.value = "bing";
    };

    /**
     * 新增一个快捷导航；URL 会归一化（补协议）。
     * 返回是否成功（名称为空或 URL 非法则失败）。
     */
    const addShortcut = (
      name: string,
      url: string,
      iconPath?: string,
      color?: string,
    ): boolean => {
      const trimmedName = name.trim();
      const normalized = normalizeUrl(url);
      if (!trimmedName || !normalized) return false;
      shortcuts.value = [
        ...shortcuts.value,
        {
          id: `sc-${crypto.randomUUID()}`,
          name: trimmedName,
          url: normalized,
          iconPath: iconPath || undefined,
          color: color || undefined,
        },
      ];
      return true;
    };

    /** 更新一个快捷导航（按 id）；URL 归一化，非法则不写入。返回是否成功 */
    const updateShortcut = (
      id: string,
      patch: { name: string; url: string; iconPath?: string; color?: string },
    ): boolean => {
      const trimmedName = patch.name.trim();
      const normalized = normalizeUrl(patch.url);
      if (!trimmedName || !normalized) return false;
      shortcuts.value = shortcuts.value.map((s) =>
        s.id === id
          ? {
              ...s,
              name: trimmedName,
              url: normalized,
              iconPath: patch.iconPath || undefined,
              color: patch.color || undefined,
            }
          : s,
      );
      return true;
    };

    /** 删除一个快捷导航 */
    const removeShortcut = (id: string) => {
      shortcuts.value = shortcuts.value.filter((s) => s.id !== id);
    };

    return {
      isSettingOpen,
      showSeconds,
      hourFormat,
      showDate,
      showWeekday,
      clockSize,
      showHitokoto,
      defaultEngine,
      customEngines,
      enableSearchHistory,
      searchHistory,
      theme,
      language,
      autoHideSettingButton,
      showShortcuts,
      shortcuts,
      addSearchHistory,
      removeSearchHistory,
      clearSearchHistory,
      addCustomEngine,
      removeCustomEngine,
      addShortcut,
      updateShortcut,
      removeShortcut,
    };
  },
  {
    persist: true,
  },
);
