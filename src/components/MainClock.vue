<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useSettingStore } from "@/store/setting";

const settingStore = useSettingStore();

const currentTime = ref("");
let timer: ReturnType<typeof setTimeout>;

const updateTime = () => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  if (settingStore.showSeconds) {
    const seconds = String(now.getSeconds()).padStart(2, "0");
    currentTime.value = `${hours}:${minutes}:${seconds}`;
  } else {
    currentTime.value = `${hours}:${minutes}`;
  }

  const msUntilNextSecond = 1000 - now.getMilliseconds();

  timer = setTimeout(updateTime, msUntilNextSecond);
};

onMounted(() => {
  updateTime();
});

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<template>
  <div class="time-part">
    {{ currentTime }}
  </div>
</template>

<style lang="scss" scoped>
.time-part {
  font-size: 80px;
  font-variant-numeric: tabular-nums;
  font-family: "Fusion Pixel";
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  -webkit-font-smoothing: none;
  font-smooth: never;
}
</style>
