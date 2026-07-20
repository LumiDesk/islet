<script setup lang="ts">
import { computed } from "vue";
import type { Shortcut } from "@/config/shortcuts";
import {
  colorForName,
  initialForName,
  SHORTCUT_FG,
} from "@/config/shortcuts";
import PixelIcon from "./PixelIcon.vue";

const props = defineProps<{
  /** 传入完整 shortcut，或仅 name/iconPath/color 的草稿（用于编辑预览） */
  shortcut: Pick<Shortcut, "name" | "iconPath" | "color">;
  /** 磁贴边长（px） */
  size?: number;
}>();

const size = computed(() => props.size ?? 48);
const bg = computed(() => props.shortcut.color || colorForName(props.shortcut.name));
const initial = computed(() => initialForName(props.shortcut.name));
/** 图标尺寸约为磁贴的一半 */
const iconSize = computed(() => Math.round(size.value * 0.5));
/** 字母字号约为磁贴的 0.42 */
const letterSize = computed(() => Math.round(size.value * 0.42));
</script>

<template>
  <span
    class="shortcut-icon"
    :style="{
      width: size + 'px',
      height: size + 'px',
      backgroundColor: bg,
      color: SHORTCUT_FG,
      borderRadius: Math.round(size * 0.25) + 'px',
    }"
  >
    <PixelIcon
      v-if="shortcut.iconPath"
      :path="shortcut.iconPath"
      :size="iconSize"
    />
    <span v-else class="letter" :style="{ fontSize: letterSize + 'px' }">{{
      initial
    }}</span>
  </span>
</template>

<style lang="scss" scoped>
.shortcut-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  transition: background-color 0.2s ease;
}

.letter {
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  line-height: 1;
}
</style>
