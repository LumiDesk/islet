<script setup lang="ts">
import { ref } from "vue";
import { useSettingStore } from "@/store/setting";
import { useI18n } from "vue-i18n";
import ShortcutIcon from "./ShortcutIcon.vue";
import ShortcutEditor from "./ShortcutEditor.vue";

const { t } = useI18n();
const settingStore = useSettingStore();

const editorOpen = ref(false);
const editingId = ref<string | null>(null);

const openAdd = () => {
  editingId.value = null;
  editorOpen.value = true;
};

const openEdit = (id: string) => {
  editingId.value = id;
  editorOpen.value = true;
};
</script>

<template>
  <div class="shortcut-manager">
    <ul v-if="settingStore.shortcuts.length" class="sc-list">
      <li v-for="s in settingStore.shortcuts" :key="s.id" class="sc-row">
        <ShortcutIcon :shortcut="s" :size="32" />
        <div class="sc-info">
          <span class="sc-name">{{ s.name }}</span>
          <span class="sc-url">{{ s.url }}</span>
        </div>
        <div class="sc-ops">
          <button
            class="sc-op"
            :aria-label="t('SettingPanel.shortcuts.edit')"
            @click="openEdit(s.id)"
          >
            {{ t("SettingPanel.shortcuts.edit") }}
          </button>
          <button
            class="sc-op del"
            :aria-label="t('SettingPanel.shortcuts.remove')"
            @click="settingStore.removeShortcut(s.id)"
          >
            ×
          </button>
        </div>
      </li>
    </ul>
    <p v-else class="sc-empty">{{ t("SettingPanel.shortcuts.empty") }}</p>

    <button class="sc-add-btn" @click="openAdd">
      {{ t("SettingPanel.shortcuts.add") }}
    </button>

    <ShortcutEditor
      :open="editorOpen"
      :edit-id="editingId"
      @close="editorOpen = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.shortcut-manager {
  margin-top: 16px;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
}

.sc-list {
  list-style: none;
  margin: 0 0 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sc-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background-color: var(--hover-bg);
  border: 1px solid var(--border-main);
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.sc-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
  flex: 1;
  min-width: 0;
}

.sc-name {
  font-size: 15px;
  color: var(--text-main);
  transition: color 0.3s ease;
}

.sc-url {
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.sc-ops {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.sc-op {
  padding: 6px 10px;
  font-size: 13px;
  color: var(--text-secondary);
  background: none;
  border: 1px solid var(--border-main);
  border-radius: 6px;
  cursor: pointer;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    color: var(--text-main);
    border-color: var(--border-hard);
    background-color: var(--active-bg);
  }

  &.del {
    width: 30px;
    padding: 6px 0;
    font-size: 18px;
    line-height: 1;
  }
}

.sc-empty {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.sc-add-btn {
  padding: 8px 16px;
  font-size: 14px;
  color: var(--panel-bg);
  background-color: var(--text-main);
  border: 2px solid var(--border-hard);
  border-radius: 6px;
  cursor: pointer;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  transition:
    opacity 0.2s ease,
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover {
    opacity: 0.85;
  }
}
</style>
