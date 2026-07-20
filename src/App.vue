<script setup lang="ts">
import MainClock from "./components/MainClock.vue";
import MainSearchBar from "./components/MainSearchBar.vue";
import QuickNav from "./components/QuickNav.vue";
import SettingButton from "./components/SettingButton.vue";
import SettingPanel from "./components/SettingPanel.vue";
import HitokotoWidget from "./components/HitokotoWidget.vue";
import { useTheme } from "./composables/useTheme";

// 主题模式与系统主题同步
useTheme();
</script>

<template>
  <div class="main-container">
    <!-- 主页内容 -->
    <MainClock></MainClock>
    <MainSearchBar></MainSearchBar>
    <QuickNav></QuickNav>
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
