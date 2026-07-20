<script setup lang="ts">
import { computed } from "vue";
import { NAV_ICONS } from "@/config/navIcons";

const props = defineProps<{
  /** 直接给出 path 的 `d` 数据（优先） */
  path?: string;
  /** 或给出内置 UI 图标名（在 NAV_ICONS 中查表） */
  name?: string;
  /** 尺寸（px），默认 24 */
  size?: number | string;
}>();

const d = computed(() => props.path ?? (props.name ? NAV_ICONS[props.name] : "") ?? "");
const dim = computed(() => props.size ?? 24);
</script>

<template>
  <svg
    v-if="d"
    :width="dim"
    :height="dim"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path :d="d" />
  </svg>
</template>

<style scoped>
/* 作为 flex 项时避免行内基线间隙导致图标偏移 */
svg {
  display: block;
  flex-shrink: 0;
}
</style>
