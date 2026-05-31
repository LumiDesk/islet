<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useClockStore } from "@/store/clock";

const clockStore = useClockStore();

const currentTime = ref("");
let timer: ReturnType<typeof setTimeout>;

const updateTime = () => {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  if (clockStore.showSeconds) {
    const seconds = String(now.getSeconds()).padStart(2, "0");
    currentTime.value = `${hours} : ${minutes} : ${seconds}`;
  } else {
    currentTime.value = `${hours} : ${minutes}`;
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
  font-size: 40px;
  font-variant-numeric: tabular-nums;
}
</style>
