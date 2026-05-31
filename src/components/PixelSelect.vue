<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  modelValue: string;
  options: Array<{ label: string; value: string }>;
}>();

const emit = defineEmits(["update:modelValue"]);

// 控制下拉菜单的展开/收起状态
const isOpen = ref(false);

// 计算当前选中的标签文本，用于展示在框内
const currentLabel = computed(() => {
  const selectedOption = props.options.find(
    (opt) => opt.value === props.modelValue,
  );
  return selectedOption ? selectedOption.label : "请选择";
});

// 点击选项时的处理
const selectOption = (value: string) => {
  emit("update:modelValue", value);
  isOpen.value = false;
};
</script>

<template>
  <div class="pixel-select" tabindex="0" @blur="isOpen = false">
    <div
      class="select-trigger"
      @click="isOpen = !isOpen"
      :class="{ 'is-open': isOpen }"
    >
      <span>{{ currentLabel }}</span>
      <svg
        class="arrow-icon"
        viewBox="0 0 10 6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0h2v2H0V0zm2 2h2v2H2V2zm2 2h2v2H4V4zm2-2h2v2H6V2zm2-2h2v2H8V0z"
          fill="currentColor"
        />
      </svg>
    </div>

    <Transition name="dropdown">
      <div v-show="isOpen" class="select-dropdown">
        <div
          v-for="option in options"
          :key="option.value"
          class="option-item"
          :class="{ 'is-selected': option.value === modelValue }"
          @click.stop="selectOption(option.value)"
        >
          {{ option.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.pixel-select {
  position: relative;
  width: 120px;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  outline: none;
}

/* 触发器外观 */
.select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--hover-bg);
  border: 2px solid var(--border-hard);
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  color: var(--text-main);
  transition:
    all 0.2s ease,
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    background-color: var(--active-bg);
  }

  &.is-open {
    background-color: var(--panel-bg);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.arrow-icon {
  width: 10px;
  height: 6px;
  color: var(--text-main);
  transition:
    transform 0.2s ease,
    color 0.3s ease;
}

.select-trigger.is-open .arrow-icon {
  transform: rotate(180deg);
}

/* 下拉面板 */
.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: var(--panel-bg);
  border: 2px solid var(--border-hard);
  border-top: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  box-sizing: border-box;
  z-index: 100;
  overflow: hidden;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.option-item {
  padding: 10px 12px;
  font-size: 16px;
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    background-color 0.1s ease,
    color 0.1s ease;

  &:hover {
    background-color: var(--hover-bg);
    color: var(--text-main);
  }

  &.is-selected {
    background-color: var(--text-main);
    color: var(--panel-bg);
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: top;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
}
</style>
