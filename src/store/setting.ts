import type { LanguageTypes } from "@/types/language";
import type { SearchEngine } from "@/config/searchEngines";
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
      addSearchHistory,
      removeSearchHistory,
      clearSearchHistory,
      addCustomEngine,
      removeCustomEngine,
    };
  },
  {
    persist: true,
  },
);
