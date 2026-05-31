<script setup lang="ts">
import { useSettingStore } from "@/store/setting";

const settingStore = useSettingStore();

const handleClickSettingButton = () => {
  settingStore.isSettingOpen = true;
};
</script>

<template>
  <div class="setting-icon" v-on:click="handleClickSettingButton">
    <svg
      class="setting-icon_svg"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6 0h4v2h2v2h2v2h2v4h-2v2h-2v2h-2v2H6v-2H4v-2H2v-2H0V6h2V4h2V2h2V0Zm0 6h4v4H6V6Z"
        fill="currentColor"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.setting-icon {
  position: fixed;
  top: 24px;
  right: 24px;
  height: 32px;
  width: 32px;
  cursor: pointer;
  color: #dbdbdb;
  transition: color 0.3s ease;

  &:hover {
    color: #333333;
  }

  &_svg {
    height: 100%;
    width: 100%;
    transition:
      transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
      filter 0.3s ease;
  }

  &:hover &_svg {
    transform: rotate(90deg) scale(1.15);
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }

  &:active &_svg {
    transform: rotate(90deg) scale(0.95);
  }
}
</style>
