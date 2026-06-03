<script setup lang="ts">
import { ref } from "vue";
import { useSettingStore } from "@/store/setting";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const settingStore = useSettingStore();

const engineUrls: Record<string, string> = {
  bing: "https://www.bing.com/search?q=",
  google: "https://www.google.com/search?q=",
  baidu: "https://www.baidu.com/s?wd=",
};

const keyword = ref("");

const handleSearch = () => {
  const query = keyword.value.trim();
  if (!query) return;

  const currentEngine = settingStore.defaultEngine || "bing";
  const baseUrl = engineUrls[currentEngine];

  // 拼接跳转
  window.location.href = `${baseUrl}${encodeURIComponent(query)}`;
};
</script>

<template>
  <div class="search-wrapper">
    <input
      type="text"
      v-model="keyword"
      @keyup.enter="handleSearch"
      :placeholder="t('MainSearchBar.empty')"
      class="capsule-input"
      autofocus
    />
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-top: 40px;
  width: 80%;
  max-width: 800px;
  display: flex;
  justify-content: center;
}

.capsule-input {
  width: 100%;
  padding: 16px 32px;
  font-size: 18px;

  /* 1. 替换文字和背景颜色 */
  color: var(--text-main);
  background-color: var(--panel-bg);
  border: 1px solid var(--border-main);

  border-radius: 50px;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  /* 2. 只列举实际会变化的属性，避免 `all` 监听全部可动画属性带来的多余开销 */
  transition:
    box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease;

  text-align: center;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
}

.capsule-input:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.capsule-input:focus {
  /* 3. 聚焦时的边框颜色也可以换成变量 */
  border-color: var(--border-hard);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.capsule-input::placeholder {
  /* 4. 提示文字换成次要文字颜色 */
  color: var(--text-secondary);
  font-size: 16px;
}
</style>
