import { watchEffect, onMounted, onUnmounted } from "vue";
import { useSettingStore } from "@/store/setting";

/**
 * 根据设置中的主题模式（light / dark / auto）切换 html.dark 类名。
 *
 * - light / dark：直接套用
 * - auto：跟随系统，并在系统主题运行时切换时同步更新
 */
export const useTheme = () => {
  const settingStore = useSettingStore();
  const mql = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = () => {
    const theme = settingStore.theme;
    const isDark = theme === "dark" || (theme === "auto" && mql.matches);
    const el = document.documentElement;
    el.classList.toggle("dark", isDark);
    // 与 index.html 的首屏内联脚本保持同步，避免 html 背景残留旧主题色
    el.style.backgroundColor = isDark ? "#121212" : "#ffffff";
    el.style.color = isDark ? "#e5e5e5" : "#1a1a1a";
  };

  // theme 设置变化时触发（watchEffect 自动收集 settingStore.theme 依赖）
  watchEffect(applyTheme);

  // 系统主题切换时触发（仅 auto 模式下会改变结果，但无条件监听更简单且无副作用）
  onMounted(() => mql.addEventListener("change", applyTheme));
  onUnmounted(() => mql.removeEventListener("change", applyTheme));
};
