<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSettingStore } from "@/store/setting";

const settingStore = useSettingStore();

// 存储一言文本和出处
const hitokotoText = ref("正在接收岛屿电波...");
const hitokotoFrom = ref("");

// 请求一言 API
const fetchHitokoto = async () => {
  try {
    const res = await fetch("https://v1.hitokoto.cn");
    const data = await res.json();
    hitokotoText.value = data.hitokoto;
    hitokotoFrom.value = data.from;
  } catch (error) {
    hitokotoText.value = "无论走到哪里，都应该记住，过去都是假的。";
    hitokotoFrom.value = "百年孤独";
  }
};

onMounted(() => {
  fetchHitokoto();
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
  color: #333333;
  font-size: 16px;
  line-height: 1.8;
  display: flex;
  align-items: flex-start;
  gap: 4px;
}

.quote-mark {
  color: #999999;
  font-size: 14px;
}

.text {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.hitokoto-from {
  margin-top: 12px;
  font-size: 14px;
  color: #888888;
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
