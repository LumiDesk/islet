<script setup lang="ts">
import { ref } from "vue";
import { useSettingStore } from "@/store/setting";

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
      placeholder="输入内容，按回车搜索..."
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
  color: #333333;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 50px;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
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
  border-color: #cccccc;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.capsule-input::placeholder {
  color: #bbbbbb;
  font-size: 16px;
}
</style>
