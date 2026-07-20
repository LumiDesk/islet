<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSettingStore } from "@/store/setting";
import { useI18n } from "vue-i18n";
import { NAV_ICONS } from "@/config/navIcons";
import { SHORTCUT_COLORS } from "@/config/shortcuts";
import PixelIcon from "./PixelIcon.vue";
import ShortcutIcon from "./ShortcutIcon.vue";

const props = defineProps<{
  /** 是否打开 */
  open: boolean;
  /** 编辑的 shortcut id；为 null 表示新增 */
  editId: string | null;
}>();

const emit = defineEmits<{ close: [] }>();

const { t } = useI18n();
const settingStore = useSettingStore();

const name = ref("");
const url = ref("");
const iconPath = ref(""); // 空 = 首字母
const color = ref(""); // 空 = 自动
const error = ref(false);

// --- 图标库（通用像素图标常驻 + 品牌图标懒加载）---
interface IconItem {
  key: string;
  title: string;
  path: string;
  hex?: string;
}

/** 仅作 UI 用途、不进选择器的图标 */
const UI_ONLY = new Set(["plus", "close", "pencil"]);

const genericItems: IconItem[] = Object.entries(NAV_ICONS)
  .filter(([k]) => !UI_ONLY.has(k))
  .map(([k, path]) => ({ key: `g:${k}`, title: k, path }));

const library = ref<IconItem[]>(genericItems);
const brandLoaded = ref(false);
const brandLoading = ref(false);

// 首次打开时懒加载庞大的品牌图标库（独立 chunk）
const ensureBrandLibrary = async () => {
  if (brandLoaded.value || brandLoading.value) return;
  brandLoading.value = true;
  try {
    const mod = await import("@/config/brandIcons");
    const brands: IconItem[] = mod.default.map(([slug, title, hex, path]) => ({
      key: `b:${slug}`,
      title,
      path,
      hex,
    }));
    library.value = [...genericItems, ...brands];
    brandLoaded.value = true;
  } finally {
    brandLoading.value = false;
  }
};

// --- 搜索 + 触底分页 ---
const query = ref("");
const PAGE = 60;
const visible = ref(PAGE);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return library.value;
  return library.value.filter(
    (it) =>
      it.title.toLowerCase().includes(q) || it.key.toLowerCase().includes(q),
  );
});

const shown = computed(() => filtered.value.slice(0, visible.value));

watch(query, () => (visible.value = PAGE));

const onGridScroll = (e: Event) => {
  const el = e.target as HTMLElement;
  if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
    if (visible.value < filtered.value.length) visible.value += PAGE;
  }
};

// 打开时按模式初始化表单
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    error.value = false;
    query.value = "";
    visible.value = PAGE;
    if (props.editId) {
      const s = settingStore.shortcuts.find((x) => x.id === props.editId);
      name.value = s?.name ?? "";
      url.value = s?.url ?? "";
      iconPath.value = s?.iconPath ?? "";
      color.value = s?.color ?? "";
    } else {
      name.value = "";
      url.value = "";
      iconPath.value = "";
      color.value = "";
    }
    ensureBrandLibrary();
  },
);

const pickIcon = (item: IconItem) => {
  iconPath.value = item.path;
  // 选品牌图标时，若用户尚未指定颜色，自动套用品牌色
  if (item.hex && color.value === "") color.value = `#${item.hex}`;
};

const useLetter = () => {
  iconPath.value = "";
};

const close = () => emit("close");

const save = () => {
  const ok = props.editId
    ? settingStore.updateShortcut(props.editId, {
        name: name.value,
        url: url.value,
        iconPath: iconPath.value,
        color: color.value,
      })
    : settingStore.addShortcut(
        name.value,
        url.value,
        iconPath.value,
        color.value,
      );
  if (ok) {
    close();
  } else {
    error.value = true;
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="editor-overlay" @click.self="close">
        <div class="editor-panel">
          <div class="editor-header">
            <h3 class="editor-title">
              {{
                editId
                  ? t("SettingPanel.shortcuts.editTitle")
                  : t("SettingPanel.shortcuts.addTitle")
              }}
            </h3>
            <button
              class="editor-close"
              :aria-label="t('SettingPanel.shortcuts.cancel')"
              @click="close"
            >
              <PixelIcon name="close" :size="16" />
            </button>
          </div>

          <div class="editor-body">
            <!-- 预览 -->
            <div class="preview">
              <ShortcutIcon
                :shortcut="{ name: name || '?', iconPath, color }"
                :size="56"
              />
            </div>

            <!-- 名称 / 地址 -->
            <label class="field">
              <span class="field-label">{{
                t("SettingPanel.shortcuts.name")
              }}</span>
              <input
                v-model="name"
                class="field-input"
                :placeholder="t('SettingPanel.shortcuts.namePlaceholder')"
                @keyup.enter="save"
              />
            </label>
            <label class="field">
              <span class="field-label">{{
                t("SettingPanel.shortcuts.url")
              }}</span>
              <input
                v-model="url"
                class="field-input"
                :placeholder="t('SettingPanel.shortcuts.urlPlaceholder')"
                @keyup.enter="save"
              />
            </label>

            <!-- 图标选择 -->
            <div class="field">
              <span class="field-label">{{
                t("SettingPanel.shortcuts.icon")
              }}</span>
              <input
                v-model="query"
                class="icon-search"
                :placeholder="t('SettingPanel.shortcuts.searchIcon')"
              />
              <div class="icon-grid" @scroll="onGridScroll">
                <button
                  type="button"
                  class="icon-cell"
                  :class="{ selected: iconPath === '' }"
                  :title="t('SettingPanel.shortcuts.letterIcon')"
                  @click="useLetter"
                >
                  <span class="letter-mark">Aa</span>
                </button>
                <button
                  v-for="item in shown"
                  :key="item.key"
                  type="button"
                  class="icon-cell"
                  :class="{ selected: iconPath === item.path }"
                  :title="item.title"
                  @click="pickIcon(item)"
                >
                  <PixelIcon :path="item.path" :size="20" />
                </button>
                <div
                  v-if="brandLoading && !brandLoaded"
                  class="icon-hint"
                >
                  {{ t("SettingPanel.shortcuts.loadingIcons") }}
                </div>
                <div
                  v-else-if="filtered.length === 0"
                  class="icon-hint"
                >
                  {{ t("SettingPanel.shortcuts.noIcon") }}
                </div>
              </div>
            </div>

            <!-- 颜色选择 -->
            <div class="field">
              <span class="field-label">{{
                t("SettingPanel.shortcuts.color")
              }}</span>
              <div class="color-row">
                <button
                  type="button"
                  class="swatch auto"
                  :class="{ selected: color === '' }"
                  :title="t('SettingPanel.shortcuts.autoColor')"
                  @click="color = ''"
                >
                  A
                </button>
                <button
                  v-for="c in SHORTCUT_COLORS"
                  :key="c"
                  type="button"
                  class="swatch"
                  :class="{ selected: color === c }"
                  :style="{ backgroundColor: c }"
                  @click="color = c"
                />
              </div>
            </div>

            <p v-if="error" class="editor-error">
              {{ t("SettingPanel.shortcuts.invalid") }}
            </p>
          </div>

          <div class="editor-footer">
            <button class="btn ghost" @click="close">
              {{ t("SettingPanel.shortcuts.cancel") }}
            </button>
            <button class="btn primary" @click="save">
              {{ t("SettingPanel.shortcuts.save") }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.editor-overlay {
  position: fixed;
  inset: 0;
  z-index: 1100;
  /* 不用 backdrop-filter：避免与设置面板遮罩叠加双重模糊导致卡顿 */
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}

.editor-panel {
  width: 440px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: var(--panel-bg);
  border: 2px solid var(--border-hard);
  border-radius: 16px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  overflow: hidden;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-main);
}

.editor-title {
  margin: 0;
  font-size: 18px;
  font-weight: normal;
  color: var(--text-main);
}

.editor-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: var(--text-secondary);
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

.editor-body {
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;

  scrollbar-width: thin;
  scrollbar-color: var(--active-bg) transparent;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--active-bg);
    border: 2px solid var(--panel-bg);
  }
}

.preview {
  display: flex;
  justify-content: center;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.field-input,
.icon-search {
  padding: 10px 12px;
  font-size: 15px;
  color: var(--text-main);
  background-color: var(--hover-bg);
  border: 2px solid var(--border-hard);
  border-radius: 6px;
  outline: none;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;

  &::placeholder {
    color: var(--text-secondary);
  }
}

.icon-search {
  font-size: 14px;
  padding: 8px 12px;
}

/* 图标选择网格 */
.icon-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 6px;
  height: 176px;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid var(--border-main);
  border-radius: 8px;
  align-content: start;

  scrollbar-width: thin;
  scrollbar-color: var(--active-bg) transparent;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: var(--active-bg);
    border: 2px solid var(--panel-bg);
  }
}

.icon-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 6px;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    background-color: var(--hover-bg);
    color: var(--text-main);
  }

  &.selected {
    border-color: var(--border-hard);
    color: var(--text-main);
    background-color: var(--active-bg);
  }
}

.letter-mark {
  font-size: 13px;
  line-height: 1;
}

.icon-hint {
  grid-column: 1 / -1;
  padding: 8px 4px;
  font-size: 13px;
  color: var(--text-secondary);
  text-align: center;
}

/* 颜色 */
.color-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.swatch {
  width: 26px;
  height: 26px;
  border: 2px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.15s ease;

  &.selected {
    border-color: var(--border-hard);
  }

  &.auto {
    background-color: var(--hover-bg);
    color: var(--text-secondary);
    font-size: 13px;
    font-family: "Fusion Pixel", monospace;
    -webkit-font-smoothing: none;
    font-smooth: never;
  }
}

.editor-error {
  margin: 0;
  font-size: 13px;
  color: #e5484d;
}

.editor-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--border-main);
}

.btn {
  padding: 8px 18px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &.ghost {
    color: var(--text-secondary);
    background: none;
    border: 2px solid var(--border-main);

    &:hover {
      color: var(--text-main);
      border-color: var(--border-hard);
    }
  }

  &.primary {
    color: var(--panel-bg);
    background-color: var(--text-main);
    border: 2px solid var(--border-hard);

    &:hover {
      opacity: 0.85;
    }
  }
}

/* 过渡 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .editor-panel {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-enter-from .editor-panel,
.modal-leave-to .editor-panel {
  transform: scale(0.94) translateY(8px);
}
</style>
