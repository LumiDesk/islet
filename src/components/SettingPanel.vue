<script setup lang="ts">
import { ref } from "vue";
import { useSettingStore } from "@/store/setting";
import PixelToggle from "./PixelToggle.vue";
import PixelSelect from "./PixelSelect.vue";

const settingStore = useSettingStore();

// 定义左侧的 Tabs 列表
const tabs = [
  { id: "clock", label: "时钟" },
  { id: "system", label: "系统" },
  { id: "about", label: "关于" },
];

// 定义搜索引擎选项数据
const engineOptions = [
  { label: "Bing", value: "bing" },
  { label: "Google", value: "google" },
  { label: "Baidu", value: "baidu" },
];

// 定义主题模式数据
const themeOptions = [
  { label: "跟随系统", value: "auto" },
  { label: "浅色模式", value: "light" },
  { label: "深色模式", value: "dark" },
];

// 记录当前选中的 Tab，默认选中第一个
const activeTab = ref(tabs[0].id);

// 关闭面板的方法
const handleClosePanel = () => {
  settingStore.isSettingOpen = false;
};
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
            <h2 class="title">设置</h2>
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
                <h3>时钟样式</h3>

                <div class="setting-list">
                  <div class="setting-item">
                    <span>显示秒数</span>
                    <PixelToggle v-model="settingStore.showSeconds" />
                  </div>
                </div>
              </div>

              <div v-show="activeTab === 'system'" class="tab-content">
                <h3>系统偏好</h3>

                <div class="setting-item">
                  <span>默认搜索引擎</span>
                  <PixelSelect
                    v-model="settingStore.defaultEngine"
                    :options="engineOptions"
                  />
                </div>

                <div class="setting-item">
                  <span>主题外观</span>
                  <PixelSelect
                    v-model="settingStore.theme"
                    :options="themeOptions"
                  />
                </div>

                <div class="setting-list">
                  <div class="setting-item">
                    <span>显示一言</span>
                    <PixelToggle v-model="settingStore.showHitokoto" />
                  </div>
                </div>
              </div>

              <div v-show="activeTab === 'about'" class="tab-content">
                <h3>关于 Islet</h3>
                <p>
                  一个极简、优雅的浏览器起始页。<br />由 Talyra42 精心打造。
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
