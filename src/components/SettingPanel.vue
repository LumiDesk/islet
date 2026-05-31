<script setup lang="ts">
import { ref } from "vue";
import { useSettingStore } from "@/store/setting";

const settingStore = useSettingStore();

// 定义左侧的 Tabs 列表
const tabs = [
  { id: "clock", label: "时钟" },
  { id: "system", label: "系统" },
  { id: "about", label: "关于" },
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
                <p>
                  这里可以添加：12/24小时制切换、是否显示秒、时间颜色等配置...
                </p>
              </div>

              <div v-show="activeTab === 'system'" class="tab-content">
                <h3>系统偏好</h3>
                <p>
                  这里可以添加：搜索引擎默认选项、背景壁纸上传、透明度调整等配置...
                </p>
              </div>

              <div v-show="activeTab === 'about'" class="tab-content">
                <h3>关于 Islet</h3>
                <p>
                  一个极简、优雅的浏览器起始页。<br />由前端开发高手精心打造。
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
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* --- 面板本体 --- */
.setting-panel {
  width: 760px;
  height: 520px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* 全局应用像素字体并关闭抗锯齿 */
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
}

/* --- 顶部 Header --- */
.panel-header {
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;

  .title {
    margin: 0;
    font-size: 20px; /* 稍微调大一点字号替代加粗效果 */
    font-weight: normal; /* 强制取消默认加粗，保护像素完整性 */
    color: #1a1a1a;
  }

  .close-btn {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f5f5f5;
      color: #333;
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
  background-color: #fafafa;
  border-right: 1px solid #f0f0f0;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tab-item {
  padding: 12px 16px;
  font-size: 16px; /* 像素字体字号稍大一点更清晰 */
  color: #888888; /* 未选中时颜色调淡 */
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    background-color: #f0f0f0;
    color: #333;
  }

  &.active {
    background-color: #ffffff;
    color: #1a1a1a; /* 选中时使用极深色替代加粗 */
    font-weight: normal; /* 取消加粗 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
}

/* --- 右侧内容区 --- */
.content-area {
  flex: 1;
  padding: 24px 32px;
  background-color: #ffffff;
  overflow-y: auto;
}

.tab-content {
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 22px;
    font-weight: normal;
    color: #1a1a1a;
  }

  p {
    font-size: 16px;
    color: #666;
    line-height: 1.8; /* 像素字体行高稍微拉大一点阅读体验更好 */
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
