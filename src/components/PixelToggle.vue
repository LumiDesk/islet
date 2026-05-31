<script setup lang="ts">
// 接收 v-model 绑定的值
const props = defineProps<{
  modelValue: boolean;
}>();

// 定义更新事件
const emit = defineEmits(["update:modelValue"]);

// 切换开关状态
const toggle = () => {
  emit("update:modelValue", !props.modelValue);
};
</script>

<template>
  <div class="pixel-toggle" :class="{ 'is-on': modelValue }" @click="toggle">
    <div class="toggle-thumb"></div>
  </div>
</template>

<style lang="scss" scoped>
.pixel-toggle {
  width: 46px;
  height: 26px;
  background-color: #e5e5e5;
  border: 2px solid #1a1a1a;
  border-radius: 6px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  padding: 2px;

  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pixel-toggle.is-on {
  background-color: #1a1a1a;
}

.toggle-thumb {
  width: 18px;
  height: 18px;
  background-color: #ffffff;
  border: 2px solid #1a1a1a;
  border-radius: 4px;
  box-sizing: border-box;

  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.3s ease;
}

.pixel-toggle.is-on .toggle-thumb {
  transform: translateX(20px);
  border-color: #ffffff;
}
</style>
