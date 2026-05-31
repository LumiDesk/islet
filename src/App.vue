<script setup lang="ts">
import MainClock from "./components/MainClock.vue";
import MainSearchBar from "./components/MainSearchBar.vue";
</script>

<template>
  <div class="main-container">
    <MainClock></MainClock>
    <MainSearchBar></MainSearchBar>
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
