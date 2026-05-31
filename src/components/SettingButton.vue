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
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M18 2h2v2h-2zM4 2h2v2H4zm16 20h-2v-2h2zM4 22h2v-2H4zM20 4h2v2h-2zM6 4h4v2H6zm12 16h-4v-2h4zM6 20h4v-2H6zM18 6h2v4h-2zM4 6h2v4H4zm16 12h-2v-4h2zM4 18h2v-4H4zM14 4h4v2h-4zM2 4h2v2H2zm20 16h-2v-2h2zM2 20h2v-2H2z"
      />
      <path d="M8 2h2v4H8zm0 20h2v-4H8z" />
      <path d="M8 2h8v2H8zm0 20h8v-2H8zM2 8h2v8H2zm20 8h-2V8h2z" />
      <path
        d="M20 8h2v4h-2zM10 8h4v2h-4zm-2 2h2v4H8zm2 4h4v2h-4zm4-4h2v4h-2z"
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
