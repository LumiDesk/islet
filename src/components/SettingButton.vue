<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useSettingStore } from "@/store/setting";

const settingStore = useSettingStore();

const visible = ref(true);

let hideTimer: number | null = null;

const clearHideTimer = () => {
  if (hideTimer !== null) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
};

const scheduleHide = () => {
  if (!settingStore.autoHideSettingButton) {
    return;
  }

  clearHideTimer();

  hideTimer = window.setTimeout(() => {
    visible.value = false;
  }, 1000);
};

const showButton = () => {
  visible.value = true;
  clearHideTimer();
};

const handleMouseMove = (event: MouseEvent) => {
  if (!settingStore.autoHideSettingButton) {
    return;
  }

  const nearTopRight =
    event.clientX >= window.innerWidth - 100 && event.clientY <= 100;

  if (nearTopRight) {
    showButton();
  } else {
    scheduleHide();
  }
};

const handleClickSettingButton = () => {
  settingStore.isSettingOpen = true;
};

watch(
  () => settingStore.autoHideSettingButton,
  (enabled) => {
    if (enabled) {
      scheduleHide();
    } else {
      visible.value = true;
      clearHideTimer();
    }
  },
);

onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);

  if (settingStore.autoHideSettingButton) {
    scheduleHide();
  }
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
  clearHideTimer();
});
</script>

<template>
  <div
    class="setting-icon"
    :class="{ 'setting-icon--hidden': !visible }"
    @click="handleClickSettingButton"
  >
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

  width: 32px;
  height: 32px;

  cursor: pointer;

  color: var(--text-secondary);

  opacity: 1;
  pointer-events: auto;

  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    color 0.3s ease;

  &:hover {
    color: var(--text-main);
  }

  &--hidden {
    opacity: 0;
    pointer-events: none;
    transform: translateX(16px);
  }

  &_svg {
    width: 100%;
    height: 100%;

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
