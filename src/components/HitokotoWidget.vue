<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useSettingStore } from "@/store/setting";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const settingStore = useSettingStore();

// 存储一言文本和出处
const hitokotoText = ref(t("HitokotoWidget.padding"));
const hitokotoFrom = ref("");

// 加载态：避免重复点击刷新；复制态：短暂的「已复制」反馈
const loading = ref(false);
const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | undefined;

// 组件卸载时用于中断仍在进行的请求
const controller = new AbortController();

// 请求一言 API
const fetchHitokoto = async () => {
  if (loading.value) return;
  loading.value = true;
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
  } finally {
    loading.value = false;
  }
};

// 复制当前一言（含出处）
const copyHitokoto = async () => {
  const text = hitokotoFrom.value
    ? `${hitokotoText.value} —— ${hitokotoFrom.value}`
    : hitokotoText.value;
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = false), 1500);
  } catch (error) {
    // 剪贴板不可用时静默失败
  }
};

onMounted(() => {
  fetchHitokoto();
});

onUnmounted(() => {
  controller.abort();
  clearTimeout(copiedTimer);
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

      <!-- 操作按钮：刷新 / 复制 -->
      <div class="hitokoto-actions">
        <button
          class="action-btn"
          :class="{ loading }"
          :disabled="loading"
          :aria-label="t('HitokotoWidget.refresh')"
          :title="t('HitokotoWidget.refresh')"
          @click="fetchHitokoto"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path
              d="M13 20H9V18H13V20ZM19 16H21V18H19V20H17V18H15V16H17V8H19V16ZM9 18H7V16H9V18ZM7 6H9V8H7V16H5V8H3V6H5V4H7V6ZM15 16H13V14H15V16ZM23 16H21V14H23V16ZM3 10H1V8H3V10ZM11 10H9V8H11V10ZM17 8H15V6H17V8ZM15 6H11V4H15V6Z"
            />
          </svg>
        </button>
        <button
          class="action-btn"
          :aria-label="t('HitokotoWidget.copy')"
          :title="copied ? t('HitokotoWidget.copied') : t('HitokotoWidget.copy')"
          @click="copyHitokoto"
        >
          <svg v-if="!copied" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path
              d="M18 22h-8v-2h8v2Zm-8-2H8v-2H6v-2h2V8h2v12Zm10 0h-2V8h2v12ZM6 16H4V4h2v12ZM16 6h2v2h-8V6h4V4h2v2Zm-2-2H6V2h8v2Z"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path
              d="M10 18H8v-2h2v2Zm-2-2H6v-2h2v2Zm4-2v2h-2v-2h2Zm-6 0H4v-2h2v2Zm8 0h-2v-2h2v2Zm2-2h-2v-2h2v2Zm2-2h-2V8h2v2Zm2-2h-2V6h2v2Z"
            />
          </svg>
        </button>
      </div>
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

/* 操作按钮：默认淡出，hover 整块或聚焦时显现 */
.hitokoto-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hitokoto-wrapper:hover .hitokoto-actions,
.hitokoto-actions:focus-within {
  opacity: 1;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: none;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: var(--hover-bg);
    color: var(--text-main);
  }

  &:disabled {
    cursor: default;
  }

  &.loading svg {
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
