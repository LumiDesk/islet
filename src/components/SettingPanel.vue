<script setup lang="ts">
import type { LanguageTypes } from "@/types/language";
import { computed, ref, watch } from "vue";
import { useSettingStore } from "@/store/setting";
import { useI18n } from "vue-i18n";
import { BUILTIN_ENGINES } from "@/config/searchEngines";
import PixelToggle from "./PixelToggle.vue";
import PixelSelect from "./PixelSelect.vue";
import SearchEngineManager from "./SearchEngineManager.vue";

const settingStore = useSettingStore();
const { t, locale } = useI18n();

// 定义左侧的 Tabs 列表
const tabs = computed(() => [
  { id: "clock", label: t("SettingPanel.tabs.clock") },
  { id: "system", label: t("SettingPanel.tabs.system") },
  { id: "about", label: t("SettingPanel.tabs.about") },
]);

// 搜索引擎选项 = 内置 + 用户自定义（统一来源，避免硬编码重复）
const engineOptions = computed(() =>
  [...BUILTIN_ENGINES, ...settingStore.customEngines].map((e) => ({
    label: e.name,
    value: e.id,
  })),
);

// 时间制式选项
const hourFormatOptions = computed(() => [
  { label: t("SettingPanel.clock.hour24"), value: "24" },
  { label: t("SettingPanel.clock.hour12"), value: "12" },
]);

// 时钟字号选项
const clockSizeOptions = computed(() => [
  { label: t("SettingPanel.clock.sizeSmall"), value: "small" },
  { label: t("SettingPanel.clock.sizeMedium"), value: "medium" },
  { label: t("SettingPanel.clock.sizeLarge"), value: "large" },
]);

// 定义主题模式数据
const themeOptions = computed(() => [
  { label: t("SettingPanel.themeOptions.auto"), value: "auto" },
  { label: t("SettingPanel.themeOptions.light"), value: "light" },
  { label: t("SettingPanel.themeOptions.dark"), value: "dark" },
]);

// 定义多语言的选项数据
const languageOptions: {
  label: string;
  value: LanguageTypes;
}[] = [
  { label: "简体中文", value: "zh" },
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
];

// 记录当前选中的 Tab，默认选中第一个
const activeTab = ref(tabs.value[0].id);

// 关闭面板的方法
const handleClosePanel = () => {
  settingStore.isSettingOpen = false;
};

// 监听切换语言
watch(
  () => settingStore.language,
  (newLang) => {
    locale.value = newLang;
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="settingStore.isSettingOpen"
        class="setting-overlay"
        @click.self="handleClosePanel"
      >
        <div class="setting-panel">
          <div class="panel-header">
            <h2 class="title">{{ t("SettingPanel.title") }}</h2>
            <button class="close-btn" @click="handleClosePanel">
              <svg
                viewBox="0 0 16 16"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 2h2v2H2V2z M12 2h2v2h-2V2z M4 4h2v2H4V4z M10 4h2v2h-2V4z M6 6h4v4H6V6z M4 10h2v2H4v-2z M10 10h2v2h-2v-2z M2 12h2v2H2v-2z M12 12h2v2h-2v-2z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>

          <div class="panel-body">
            <div class="sidebar">
              <div
                v-for="tab in tabs"
                :key="tab.id"
                class="tab-item"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                {{ tab.label }}
              </div>
            </div>

            <div class="content-area">
              <div v-show="activeTab === 'clock'" class="tab-content">
                <h3>{{ t("SettingPanel.clock.style") }}</h3>

                <div class="setting-list">
                  <div class="setting-item">
                    <span>{{ t("SettingPanel.clock.hourFormat") }}</span>
                    <PixelSelect
                      v-model="settingStore.hourFormat"
                      :options="hourFormatOptions"
                    />
                  </div>

                  <div class="setting-item">
                    <span>{{ t("SettingPanel.clock.size") }}</span>
                    <PixelSelect
                      v-model="settingStore.clockSize"
                      :options="clockSizeOptions"
                    />
                  </div>

                  <div class="setting-item">
                    <span>{{ t("SettingPanel.clock.showSec") }}</span>
                    <PixelToggle v-model="settingStore.showSeconds" />
                  </div>

                  <div class="setting-item">
                    <span>{{ t("SettingPanel.clock.showDate") }}</span>
                    <PixelToggle v-model="settingStore.showDate" />
                  </div>

                  <div class="setting-item">
                    <span>{{ t("SettingPanel.clock.showWeekday") }}</span>
                    <PixelToggle v-model="settingStore.showWeekday" />
                  </div>
                </div>
              </div>

              <div v-show="activeTab === 'system'" class="tab-content">
                <h3>{{ t("SettingPanel.system.title") }}</h3>

                <div class="setting-item">
                  <span>{{ t("SettingPanel.system.language") }}</span>
                  <PixelSelect
                    v-model="settingStore.language"
                    :options="languageOptions"
                  />
                </div>

                <div class="setting-list">
                  <div class="setting-item">
                    <span>{{ t("SettingPanel.system.defaultEngine") }}</span>
                    <PixelSelect
                      v-model="settingStore.defaultEngine"
                      :options="engineOptions"
                    />
                  </div>

                  <div class="setting-item">
                    <span>{{ t("SettingPanel.system.searchHistory") }}</span>
                    <div class="item-controls">
                      <button
                        v-if="settingStore.searchHistory.length"
                        class="text-btn"
                        @click="settingStore.clearSearchHistory()"
                      >
                        {{ t("SettingPanel.system.clearHistory") }}
                      </button>
                      <PixelToggle v-model="settingStore.enableSearchHistory" />
                    </div>
                  </div>

                  <div class="setting-item">
                    <span>{{ t("SettingPanel.system.appearance") }}</span>
                    <PixelSelect
                      v-model="settingStore.theme"
                      :options="themeOptions"
                    />
                  </div>

                  <div class="setting-item">
                    <span>{{ t("SettingPanel.system.showHitokoto") }}</span>
                    <PixelToggle v-model="settingStore.showHitokoto" />
                  </div>

                  <div class="setting-item">
                    <span>{{
                      t("SettingPanel.system.autoHideSettingButton")
                    }}</span>
                    <PixelToggle v-model="settingStore.autoHideSettingButton" />
                  </div>
                </div>

                <h3 class="sub-title">
                  {{ t("SettingPanel.engineManager.title") }}
                </h3>
                <SearchEngineManager />
              </div>

              <div v-show="activeTab === 'about'" class="tab-content">
                <h3>{{ t("SettingPanel.about.title") }}</h3>
                <p style="white-space: pre-wrap">
                  {{ t("SettingPanel.about.content") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
/* --- 遮罩层 --- */
.setting-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background-color: var(--panel-overlay);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

/* --- 面板本体 --- */
.setting-panel {
  width: 760px;
  height: 520px;
  background-color: var(--panel-bg);
  border-radius: 20px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;

  transition: background-color 0.3s ease;
}

/* --- 顶部 Header --- */
.panel-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-main);
  transition: border-color 0.3s ease;

  .title {
    margin: 0;
    font-size: 20px;
    font-weight: normal;
    color: var(--text-main);
    transition: color 0.3s ease;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--active-bg);
      color: var(--text-main);
    }
  }
}

/* --- 下方主体布局 --- */
.panel-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* --- 左侧 Tabs --- */
.sidebar {
  width: 180px;
  background-color: var(--hover-bg);
  border-right: 1px solid var(--border-main);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.tab-item {
  padding: 12px 16px;
  font-size: 16px;
  color: var(--text-secondary);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background-color: var(--active-bg);
    color: var(--text-main);
  }

  &.active {
    background-color: var(--panel-bg);
    color: var(--text-main);
    font-weight: normal;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
}

/* --- 右侧内容区 --- */
.content-area {
  flex: 1;
  padding: 24px 32px;
  background-color: var(--panel-bg);
  overflow-y: auto;
  transition: background-color 0.3s ease;
}

.tab-content {
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 22px;
    font-weight: normal;
    color: var(--text-main);
    transition: color 0.3s ease;
  }

  h3.sub-title {
    margin-top: 32px;
    font-size: 18px;
  }

  p {
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.8;
    transition: color 0.3s ease;
  }
}

/* 针对设置项列表的排版 */
.setting-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--hover-bg);
  border: 1px solid var(--border-main);
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;

  span {
    font-size: 16px;
    color: var(--text-main);
    transition: color 0.3s ease;
  }
}

/* 设置项右侧多个控件并排（如「清空」按钮 + 开关） */
.item-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.text-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  transition: color 0.2s ease;

  &:hover {
    color: var(--text-main);
    text-decoration: underline;
  }
}

/* --- Vue 弹窗过渡动画 --- */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .setting-panel {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-leave-active .setting-panel {
  transition: transform 0.3s ease;
}
.modal-enter-from .setting-panel,
.modal-leave-to .setting-panel {
  transform: scale(0.92) translateY(10px);
}
</style>
