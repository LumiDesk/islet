<script setup lang="ts">
import MainClock from "./components/MainClock.vue";
</script>

<template>
  <div class="main-container">
    <MainClock></MainClock>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
