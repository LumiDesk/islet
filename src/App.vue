<script setup lang="ts">
import { watchEffect } from "vue";
import { useSettingStore } from "./store/setting";
import MainClock from "./components/MainClock.vue";
import MainSearchBar from "./components/MainSearchBar.vue";
import SettingButton from "./components/SettingButton.vue";
import SettingPanel from "./components/SettingPanel.vue";
import HitokotoWidget from "./components/HitokotoWidget.vue";

const settingStore = useSettingStore();

watchEffect(() => {
  const theme = settingStore.theme;
  const isSystemDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  const htmlEl = document.documentElement;

  if (theme === "dark" || (theme === "auto" && isSystemDark)) {
    htmlEl.classList.add("dark");
  } else {
    htmlEl.classList.remove("dark");
  }
});
</script>

<template>
  <div class="main-container">
    <!-- 主页内容 -->
    <MainClock></MainClock>
    <MainSearchBar></MainSearchBar>
    <HitokotoWidget></HitokotoWidget>

    <!-- 设置相关内容 -->
    <SettingButton></SettingButton>
    <SettingPanel></SettingPanel>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style>
