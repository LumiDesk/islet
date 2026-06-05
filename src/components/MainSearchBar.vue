<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSettingStore } from "@/store/setting";
import { useI18n } from "vue-i18n";
import { BUILTIN_ENGINES, buildSearchUrl } from "@/config/searchEngines";

const { t } = useI18n();
const settingStore = useSettingStore();

// 所有可用引擎 = 内置 + 用户自定义
const engines = computed(() => [
  ...BUILTIN_ENGINES,
  ...settingStore.customEngines,
]);

// 当前选中的引擎，找不到时回退到第一个内置引擎
const currentEngine = computed(
  () =>
    engines.value.find((e) => e.id === settingStore.defaultEngine) ??
    BUILTIN_ENGINES[0],
);

const keyword = ref("");

// --- 引擎快捷切换菜单 ---
const engineMenuOpen = ref(false);

const selectEngine = (id: string) => {
  settingStore.defaultEngine = id;
  engineMenuOpen.value = false;
};

// --- 搜索历史联想 ---
const MAX_SUGGESTIONS = 8;
const isFocused = ref(false);
const activeIndex = ref(-1);

const suggestions = computed(() => {
  if (!settingStore.enableSearchHistory) return [];
  const kw = keyword.value.trim().toLowerCase();
  const list = settingStore.searchHistory.filter((h) => {
    const lower = h.toLowerCase();
    return kw ? lower.includes(kw) && lower !== kw : true;
  });
  return list.slice(0, MAX_SUGGESTIONS);
});

const showSuggestions = computed(
  () => isFocused.value && suggestions.value.length > 0,
);

// 输入变化时取消高亮，避免回车时误用旧的高亮项
watch(keyword, () => (activeIndex.value = -1));

const go = (query: string) => {
  const q = query.trim();
  if (!q) return;
  settingStore.addSearchHistory(q);
  window.location.href = buildSearchUrl(currentEngine.value, q);
};

const handleSearch = () => {
  // 有高亮的联想项则用联想项，否则用输入框内容
  if (activeIndex.value >= 0 && activeIndex.value < suggestions.value.length) {
    go(suggestions.value[activeIndex.value]);
  } else {
    go(keyword.value);
  }
};

const onArrowDown = () => {
  if (!showSuggestions.value) return;
  activeIndex.value = (activeIndex.value + 1) % suggestions.value.length;
};

const onArrowUp = () => {
  if (!showSuggestions.value) return;
  activeIndex.value =
    activeIndex.value <= 0
      ? suggestions.value.length - 1
      : activeIndex.value - 1;
};

const pickSuggestion = (term: string) => {
  keyword.value = term;
  go(term);
};

const removeSuggestion = (term: string) => {
  settingStore.removeSearchHistory(term);
  activeIndex.value = -1;
};
</script>

<template>
  <div class="search-wrapper">
    <div class="search-box">
      <div class="capsule" :class="{ 'is-focused': isFocused }">
        <!-- 当前搜索引擎，点击可快捷切换 -->
        <button
          class="engine-prefix"
          :class="{ 'is-open': engineMenuOpen }"
          :aria-label="t('MainSearchBar.switchEngine')"
          @click="engineMenuOpen = !engineMenuOpen"
          @blur="engineMenuOpen = false"
        >
          {{ currentEngine.name.toLowerCase() }}<span class="scheme">://</span>
        </button>

        <input
          type="text"
          v-model="keyword"
          :placeholder="t('MainSearchBar.empty')"
          class="capsule-input"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @keydown.enter="handleSearch"
          @keydown.down.prevent="onArrowDown"
          @keydown.up.prevent="onArrowUp"
          @keydown.esc="isFocused = false"
        />

        <!-- 引擎切换下拉 -->
        <Transition name="suggest">
          <ul v-if="engineMenuOpen" class="engine-menu">
            <li
              v-for="engine in engines"
              :key="engine.id"
              class="engine-option"
              :class="{ selected: engine.id === currentEngine.id }"
              @mousedown.prevent="selectEngine(engine.id)"
            >
              {{ engine.name }}
            </li>
          </ul>
        </Transition>
      </div>

      <!-- 历史联想 -->
      <Transition name="suggest">
        <ul v-if="showSuggestions" class="suggestions">
          <li
            v-for="(item, index) in suggestions"
            :key="item"
            class="suggestion-item"
            :class="{ active: index === activeIndex }"
            @mousedown.prevent="pickSuggestion(item)"
            @mouseenter="activeIndex = index"
          >
            <span class="suggestion-text">{{ item }}</span>
            <button
              class="suggestion-remove"
              :aria-label="t('MainSearchBar.removeHistory')"
              @mousedown.prevent.stop="removeSuggestion(item)"
            >
              ×
            </button>
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-top: 40px;
  width: 80%;
  max-width: 800px;
  display: flex;
  justify-content: center;
}

.search-box {
  position: relative;
  width: 100%;
}

/* 胶囊容器（边框/阴影/聚焦动效都在这一层） */
.capsule {
  display: flex;
  align-items: center;
  padding: 0 28px;
  background-color: var(--panel-bg);
  border: 1px solid var(--border-main);
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition:
    box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
    background-color 0.3s ease,
    border-color 0.3s ease;
}

.capsule:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.capsule.is-focused {
  border-color: var(--border-hard);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* 引擎前缀，如 google:// */
.engine-prefix {
  flex-shrink: 0;
  border: none;
  background: none;
  padding: 0;
  margin-right: 12px;
  font-size: 18px;
  color: var(--text-main);
  cursor: pointer;
  white-space: nowrap;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;

  .scheme {
    color: var(--text-secondary);
  }

  &:hover,
  &.is-open {
    opacity: 0.7;
  }
}

.capsule-input {
  flex: 1;
  min-width: 0;
  padding: 16px 0;
  font-size: 18px;
  color: var(--text-main);
  background: transparent;
  border: none;
  outline: none;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  transition: color 0.3s ease;

  &::placeholder {
    color: var(--text-secondary);
    font-size: 16px;
  }
}

/* 引擎切换下拉（贴左对齐前缀） */
.engine-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 160px;
  list-style: none;
  margin: 0;
  padding: 6px;
  box-sizing: border-box;
  background-color: var(--panel-bg);
  border: 1px solid var(--border-main);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 60;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
}

.engine-option {
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  color: var(--text-secondary);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: var(--hover-bg);
    color: var(--text-main);
  }

  &.selected {
    color: var(--text-main);
    background-color: var(--hover-bg);
  }
}

/* --- 历史联想下拉 --- */
.suggestions {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 6px;
  box-sizing: border-box;
  background-color: var(--panel-bg);
  border: 1px solid var(--border-main);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 50;
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
}

.suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--text-secondary);
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &.active {
    background-color: var(--hover-bg);
    color: var(--text-main);
  }
}

.suggestion-text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 15px;
  text-align: left;
}

.suggestion-remove {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  line-height: 1;
  border: none;
  background: none;
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  border-radius: 6px;
  opacity: 0;
  transition:
    opacity 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: var(--active-bg);
    color: var(--text-main);
  }
}

.suggestion-item.active .suggestion-remove {
  opacity: 1;
}

/* 下拉出现/消失动画 */
.suggest-enter-active,
.suggest-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: top;
}
.suggest-enter-from,
.suggest-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
