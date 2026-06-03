<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useSettingStore } from "@/store/setting";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const settingStore = useSettingStore();

// 存储一言文本和出处
const hitokotoText = ref(t("HitokotoWidget.padding"));
const hitokotoFrom = ref("");

// 组件卸载时用于中断仍在进行的请求
const controller = new AbortController();

// 请求一言 API
const fetchHitokoto = async () => {
  try {
    const res = await fetch("https://v1.hitokoto.cn", {
      signal: controller.signal,
    });
    const data = await res.json();
    hitokotoText.value = data.hitokoto;
    hitokotoFrom.value = data.from;
  } catch (error) {
    // 主动中断不算错误，无需展示兜底文案
    if (controller.signal.aborted) return;
    hitokotoText.value = t("HitokotoWidget.empty.title");
    hitokotoFrom.value = t("HitokotoWidget.empty.from");
  }
};

onMounted(() => {
  fetchHitokoto();
});

onUnmounted(() => {
  controller.abort();
});
</script>

<template>
  <Transition name="fade">
    <div v-if="settingStore.showHitokoto" class="hitokoto-wrapper">
      <div class="hitokoto-content">
        <!-- 传统的语录直角引号，很有文学气息 -->
        <span class="quote-mark">「</span>
        <span class="text">{{ hitokotoText }}</span>
        <span class="quote-mark">」</span>
      </div>
      <!-- 出处信息 -->
      <div v-if="hitokotoFrom" class="hitokoto-from">—— {{ hitokotoFrom }}</div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.hitokoto-wrapper {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 80%;
  text-align: center;

  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
}

.hitokoto-content {
  /* 1. 主体文字使用主颜色 */
  color: var(--text-main);
  font-size: 16px;
  line-height: 1.8;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  /* 加上颜色平滑过渡 */
  transition: color 0.3s ease;
}

.quote-mark {
  /* 2. 引号使用次要颜色 */
  color: var(--text-secondary);
  font-size: 14px;
  transition: color 0.3s ease;
}

.text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.hitokoto-from {
  margin-top: 12px;
  font-size: 14px;
  /* 3. 出处使用次要颜色 */
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
