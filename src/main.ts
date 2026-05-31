import { createApp } from "vue";
import { createPinia } from "pinia";
import persist from "pinia-plugin-persistedstate";
import App from "./App.vue";
import "./style.css";

const pinia = createPinia().use(persist);
const app = createApp(App);

app.use(pinia);
app.mount("#app");
