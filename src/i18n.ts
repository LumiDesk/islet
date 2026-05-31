import { createI18n } from "vue-i18n";
import type { LanguageTypes } from "./types/language";
import zh from "./locales/zh.json";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

export const i18n = createI18n({
  legacy: false,
  locale: "zh",
  fallbackLocale: "en",
  messages: { zh, en, ja },
});

export const setupI18n = (lang: LanguageTypes) => {
  i18n.global.locale.value = lang;
};
