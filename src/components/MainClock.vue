<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const currentTime = ref("");
let timer: ReturnType<typeof setTimeout>;

const updateTime = () => {
  const now = new Date();

  // 补0
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  currentTime.value = `${hours} : ${minutes} : ${seconds}`;

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
  font-size: 40px;
  font-variant-numeric: tabular-nums;
}
</style>
