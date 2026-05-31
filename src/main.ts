import { createApp } from "vue";
import { createPinia } from "pinia";
import { useSettingStore } from "./store/setting";
import persist from "pinia-plugin-persistedstate";
import App from "./App.vue";
import { i18n, setupI18n } from "./i18n";
import "./style.css";

const pinia = createPinia().use(persist);
const app = createApp(App);

app.use(pinia);
app.use(i18n);

const settingStore = useSettingStore();
setupI18n(settingStore.language);

app.mount("#app");
