/**
 * 设置导入 / 导出工具
 *
 * 纯本地：导出为 JSON 文件下载，导入时解析并按类型校验后写回 store。
 */
import type { useSettingStore } from "@/store/setting";

type SettingStore = ReturnType<typeof useSettingStore>;

/** 导出文件的格式版本，便于未来兼容处理 */
const EXPORT_VERSION = 1;

/** 参与导入 / 导出的设置项（排除 isSettingOpen 等临时 UI 状态） */
const TRANSFER_KEYS = [
  "showHitokoto",
  "showSeconds",
  "hourFormat",
  "showDate",
  "showWeekday",
  "clockSize",
  "defaultEngine",
  "customEngines",
  "enableSearchHistory",
  "searchHistory",
  "theme",
  "language",
  "autoHideSettingButton",
] as const;

type TransferKey = (typeof TRANSFER_KEYS)[number];

const isStr = (v: unknown): v is string => typeof v === "string";
const isBool = (v: unknown): boolean => typeof v === "boolean";

const isValidEngine = (e: unknown): boolean =>
  !!e &&
  typeof e === "object" &&
  isStr((e as Record<string, unknown>).id) &&
  isStr((e as Record<string, unknown>).name) &&
  isStr((e as Record<string, unknown>).searchUrl);

/** 每个设置项的取值校验，导入时逐项过滤非法值 */
const VALIDATORS: Record<TransferKey, (v: unknown) => boolean> = {
  showHitokoto: isBool,
  showSeconds: isBool,
  hourFormat: (v) => v === "24" || v === "12",
  showDate: isBool,
  showWeekday: isBool,
  clockSize: (v) => v === "small" || v === "medium" || v === "large",
  defaultEngine: isStr,
  customEngines: (v) => Array.isArray(v) && v.every(isValidEngine),
  enableSearchHistory: isBool,
  searchHistory: (v) => Array.isArray(v) && v.every(isStr),
  theme: (v) => v === "light" || v === "dark" || v === "auto",
  language: (v) => v === "zh" || v === "en" || v === "ja",
  autoHideSettingButton: isBool,
};

/** 构造导出对象 */
const buildExport = (store: SettingStore) => {
  const settings: Record<string, unknown> = {};
  for (const key of TRANSFER_KEYS) settings[key] = store[key];
  return { app: "islet", version: EXPORT_VERSION, settings };
};

/** 导出设置为 JSON 文件并触发下载 */
export const downloadSettings = (store: SettingStore) => {
  const data = JSON.stringify(buildExport(store), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "islet-settings.json";
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * 解析并应用导入的设置文本。
 * @returns 是否成功导入（文件可解析且至少有一项合法设置）
 */
export const applySettingsImport = (
  store: SettingStore,
  raw: string,
): boolean => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return false;
  }

  const settings = (parsed as Record<string, unknown>)?.settings;
  if (!settings || typeof settings !== "object") return false;

  const source = settings as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  for (const key of TRANSFER_KEYS) {
    if (key in source && VALIDATORS[key](source[key])) {
      patch[key] = source[key];
    }
  }

  if (Object.keys(patch).length === 0) return false;

  store.$patch(patch);
  return true;
};
