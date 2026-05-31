import { createI18n } from "vue-i18n";
import zh from "./locales/zh.json";
import en from "./locales/en.json";

export const i18n = createI18n({
  legacy: false,
  locale: "zh",
  fallbackLocale: "en",
  messages: { zh, en },
});

export const setupI18n = (lang: "zh" | "en") => {
  i18n.global.locale.value = lang;
};
