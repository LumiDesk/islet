<script setup lang="ts">
import { ref } from "vue";
import { useSettingStore } from "@/store/setting";
import { useI18n } from "vue-i18n";
import ShortcutIcon from "./ShortcutIcon.vue";
import ShortcutEditor from "./ShortcutEditor.vue";
import PixelIcon from "./PixelIcon.vue";

const { t } = useI18n();
const settingStore = useSettingStore();

// 编辑器状态：open + 正在编辑的 id（null 为新增）
const editorOpen = ref(false);
const editingId = ref<string | null>(null);
const draggingId = ref<string | null>(null);
const suppressClick = ref(false);

const openAdd = () => {
  editingId.value = null;
  editorOpen.value = true;
};

const openEdit = (id: string) => {
  editingId.value = id;
  editorOpen.value = true;
};

const closeEditor = () => {
  editorOpen.value = false;
};

const onDragStart = (event: DragEvent, id: string) => {
  draggingId.value = id;
  if (!event.dataTransfer) return;
  event.dataTransfer.effectAllowed = "move";
  // Firefox 需要写入数据后才会开始拖动。
  event.dataTransfer.setData("text/plain", id);
};

const onDragEnter = (targetId: string) => {
  if (!draggingId.value || draggingId.value === targetId) return;
  settingStore.moveShortcut(draggingId.value, targetId);
};

const onDragOver = (event: DragEvent) => {
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
};

const finishDrag = () => {
  if (!draggingId.value) return;
  draggingId.value = null;
  suppressClick.value = true;
  window.setTimeout(() => {
    suppressClick.value = false;
  }, 0);
};

const onTileClick = (event: MouseEvent) => {
  if (!suppressClick.value) return;
  event.preventDefault();
  suppressClick.value = false;
};
</script>

<template>
  <div v-if="settingStore.showShortcuts" class="quick-nav">
    <a
      v-for="s in settingStore.shortcuts"
      :key="s.id"
      class="tile"
      :class="{ 'tile--dragging': draggingId === s.id }"
      :href="s.url"
      :title="s.name"
      draggable="false"
      @click="onTileClick"
      @dragenter.prevent="onDragEnter(s.id)"
      @dragover.prevent="onDragOver"
      @drop.prevent="finishDrag"
    >
      <span
        class="tile-drag-handle"
        draggable="true"
        @dragstart="onDragStart($event, s.id)"
        @dragend="finishDrag"
      >
        <ShortcutIcon :shortcut="s" :size="48" />
      </span>
      <span class="tile-name">{{ s.name }}</span>

      <!-- 悬停操作：编辑 / 删除 -->
      <span class="tile-actions">
        <button
          class="tile-act"
          :aria-label="t('SettingPanel.shortcuts.edit')"
          @click.prevent.stop="openEdit(s.id)"
        >
          <PixelIcon name="pencil" :size="12" />
        </button>
        <button
          class="tile-act"
          :aria-label="t('SettingPanel.shortcuts.remove')"
          @click.prevent.stop="settingStore.removeShortcut(s.id)"
        >
          <PixelIcon name="close" :size="12" />
        </button>
      </span>
    </a>

    <!-- 新增磁贴 -->
    <button
      class="tile add-tile"
      :aria-label="t('SettingPanel.shortcuts.addTitle')"
      @click="openAdd"
    >
      <span class="add-icon">
        <PixelIcon name="plus" :size="22" />
      </span>
      <span class="tile-name">{{ t("SettingPanel.shortcuts.addShort") }}</span>
    </button>

    <ShortcutEditor :open="editorOpen" :edit-id="editingId" @close="closeEditor" />
  </div>
</template>

<style lang="scss" scoped>
.quick-nav {
  margin-top: 28px;
  width: 80%;
  max-width: 640px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 18px 20px;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
}

.tile {
  position: relative;
  box-sizing: border-box;
  width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 10px;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  transition:
    transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.2s ease,
    opacity 0.15s ease;

  &:hover {
    transform: translateY(-3px);
  }
}

.tile.tile--dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.tile-drag-handle {
  display: inline-flex;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.tile-name {
  max-width: 100%;
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.tile:hover .tile-name {
  color: var(--text-main);
}

/* 悬停操作按钮 */
.tile-actions {
  position: absolute;
  top: -4px;
  right: -4px;
  display: flex;
  gap: 2px;
  opacity: 0;
  transform: scale(0.9);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.tile:hover .tile-actions {
  opacity: 1;
  transform: scale(1);
}

.tile-act {
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid var(--border-hard);
  background-color: var(--panel-bg);
  color: var(--text-secondary);
  border-radius: 5px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: var(--active-bg);
    color: var(--text-main);
  }
}

/* 新增磁贴 */
.add-tile .add-icon {
  box-sizing: border-box;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  border: 2px dashed var(--border-main);
  border-radius: 12px;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.add-tile:hover .add-icon {
  color: var(--text-main);
  border-color: var(--border-hard);
}
</style>
