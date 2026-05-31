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
        d="M4 14h2v6H4zm5 0h2v6H9zm-5-2h7v2H4zm0 8h7v2H4zm-2-4h2v2H2zm20-8h-4V6h4z"
      />
      <path
        d="M10 16h12v2H10zm5-8H2V6h13zm5-4v2h-2V4zm0 6V8h-2v2zm-7-8h7v2h-7zm0 10h7v-2h-7zm0-8h2v2h-2zm0 6h2V8h-2z"
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
