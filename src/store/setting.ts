import { defineStore } from "pinia";
import { ref } from "vue";

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
     * 默认搜索引擎
     */
    const defaultEngine = ref("bing");

    /**
     * 主题模式，默认跟随系统
     */
    const theme = ref<"light" | "dark" | "auto">("auto");

    return {
      isSettingOpen,
      showSeconds,
      showHitokoto,
      defaultEngine,
      theme,
    };
  },
  {
    persist: true,
  },
);
