<script setup lang="ts">
import { ref } from "vue";
import { useSettingStore } from "@/store/setting";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const settingStore = useSettingStore();

const name = ref("");
const url = ref("");

const addEngine = () => {
  const n = name.value.trim();
  const u = url.value.trim();
  if (!n || !u) return;
  settingStore.addCustomEngine(n, u);
  name.value = "";
  url.value = "";
};
</script>

<template>
  <div class="engine-manager">
    <ul v-if="settingStore.customEngines.length" class="engine-list">
      <li
        v-for="engine in settingStore.customEngines"
        :key="engine.id"
        class="engine-row"
      >
        <div class="engine-info">
          <span class="engine-name">{{ engine.name }}</span>
          <span class="engine-url">{{ engine.searchUrl }}</span>
        </div>
        <button
          class="engine-del"
          :aria-label="t('SettingPanel.engineManager.remove')"
          @click="settingStore.removeCustomEngine(engine.id)"
        >
          ×
        </button>
      </li>
    </ul>
    <p v-else class="engine-empty">
      {{ t("SettingPanel.engineManager.empty") }}
    </p>

    <div class="engine-add">
      <input
        v-model="name"
        class="engine-input name"
        :placeholder="t('SettingPanel.engineManager.namePlaceholder')"
        @keyup.enter="addEngine"
      />
      <input
        v-model="url"
        class="engine-input url"
        :placeholder="t('SettingPanel.engineManager.urlPlaceholder')"
        @keyup.enter="addEngine"
      />
      <button class="engine-add-btn" @click="addEngine">
        {{ t("SettingPanel.engineManager.add") }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.engine-manager {
  margin-top: 16px;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
}

.engine-list {
  list-style: none;
  margin: 0 0 12px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.engine-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  background-color: var(--hover-bg);
  border: 1px solid var(--border-main);
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.engine-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.engine-name {
  font-size: 15px;
  color: var(--text-main);
  transition: color 0.3s ease;
}

.engine-url {
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.engine-del {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  line-height: 1;
  border: none;
  background: none;
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
  border-radius: 6px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: var(--active-bg);
    color: var(--text-main);
  }
}

.engine-empty {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.engine-add {
  display: flex;
  gap: 8px;
}

.engine-input {
  padding: 8px 12px;
  font-size: 14px;
  color: var(--text-main);
  background-color: var(--panel-bg);
  border: 2px solid var(--border-hard);
  border-radius: 6px;
  outline: none;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  transition:
    color 0.3s ease,
    background-color 0.3s ease,
    border-color 0.3s ease;

  &::placeholder {
    color: var(--text-secondary);
  }

  &.name {
    width: 110px;
    flex-shrink: 0;
  }

  &.url {
    flex: 1;
    min-width: 0;
  }
}

.engine-add-btn {
  flex-shrink: 0;
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
