import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * 时钟相关的 Store
 */
export const useClockStore = defineStore("islet-clock", () => {
  /**
   * 是否展示秒
   */
  const showSeconds = ref(true);

  return {
    showSeconds,
  };
});
