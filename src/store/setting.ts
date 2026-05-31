import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * 设置相关的 Store
 */
export const useSettingStore = defineStore("islet-setting", () => {
  /**
   * 是否展示设置面板
   */
  const isSettingOpen = ref(false);

  /**
   * 是否展示秒
   */
  const showSeconds = ref(true);

  return {
    isSettingOpen,
    showSeconds,
  };
});
