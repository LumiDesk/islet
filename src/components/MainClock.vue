<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useSettingStore } from "@/store/setting";
import { useI18n } from "vue-i18n";

const settingStore = useSettingStore();
const { locale } = useI18n();

// 当前时间（每秒更新一次的响应式来源）
const now = ref(new Date());
let timer: ReturnType<typeof setTimeout>;

const updateTime = () => {
  now.value = new Date();
  // 对齐到下一秒，避免累积漂移
  timer = setTimeout(updateTime, 1000 - now.value.getMilliseconds());
};

// i18n 语言 -> BCP47，供 Intl 本地化日期 / 星期
const localeTag = computed(
  () =>
    ({ zh: "zh-CN", en: "en-US", ja: "ja-JP" })[locale.value] ?? "en-US",
);

// 12 小时制时的 AM/PM，24 小时制为空
const meridiem = computed(() => {
  if (settingStore.hourFormat !== "12") return "";
  return now.value.getHours() < 12 ? "AM" : "PM";
});

// 主时间文本 HH:MM(:SS)
const timeText = computed(() => {
  const d = now.value;
  let hour = d.getHours();
  if (settingStore.hourFormat === "12") hour = hour % 12 || 12;

  const hh = String(hour).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (!settingStore.showSeconds) return `${hh}:${mm}`;

  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
});

// 日期 / 星期（按当前语言本地化），按开关拼接
const dateText = computed(() => {
  const parts: string[] = [];
  if (settingStore.showWeekday) {
    parts.push(
      new Intl.DateTimeFormat(localeTag.value, { weekday: "long" }).format(
        now.value,
      ),
    );
  }
  if (settingStore.showDate) {
    parts.push(
      new Intl.DateTimeFormat(localeTag.value, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(now.value),
    );
  }
  return parts.join("　");
});

onMounted(() => {
  updateTime();
});

onUnmounted(() => {
  clearTimeout(timer);
});
</script>

<template>
  <div class="clock" :class="`size-${settingStore.clockSize}`">
    <div class="time-part">
      {{ timeText }}<span v-if="meridiem" class="meridiem">{{ meridiem }}</span>
    </div>
    <div v-if="dateText" class="date-part">{{ dateText }}</div>
  </div>
</template>

<style lang="scss" scoped>
.clock {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-part {
  font-variant-numeric: tabular-nums;
  font-family: "Fusion Pixel";
  color: var(--text-main);
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  -webkit-font-smoothing: none;
  font-smooth: never;
  line-height: 1.1;
  transition: color 0.3s ease;
}

.meridiem {
  margin-left: 0.3em;
  font-size: 0.4em;
  color: var(--text-secondary);
  vertical-align: baseline;
}

.date-part {
  margin-top: 8px;
  color: var(--text-secondary);
  font-family: "Fusion Pixel", monospace;
  -webkit-font-smoothing: none;
  font-smooth: never;
  transition: color 0.3s ease;
}

/* 字号档位 */
.size-small .time-part {
  font-size: 56px;
}
.size-medium .time-part {
  font-size: 80px;
}
.size-large .time-part {
  font-size: 112px;
}

.size-small .date-part {
  font-size: 14px;
}
.size-medium .date-part {
  font-size: 18px;
}
.size-large .date-part {
  font-size: 22px;
}
</style>
