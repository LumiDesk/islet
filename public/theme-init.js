// 首屏防闪屏脚本（FOUC）：在页面绘制前同步套用主题背景色。
//
// 必须作为「外部脚本」引入，不能写成内联 <script>：
// 作为 MV3 浏览器扩展运行时，默认 CSP 为 script-src 'self'，会拦截内联脚本，
// 导致首屏主题无法提前套用，出现「白 -> 黑」闪屏。外部脚本来自扩展自身则被允许。
(function () {
  var isDark = false;
  try {
    var saved = localStorage.getItem("islet-setting");
    var theme = saved ? JSON.parse(saved).theme : "auto";
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    isDark = theme === "dark" || (theme === "auto" && systemDark);
  } catch (e) {
    /* localStorage 不可用或数据损坏时静默降级为浅色 */
  }
  var el = document.documentElement;
  if (isDark) el.classList.add("dark");
  // 与 style.css 中的 --bg-main / --text-main 保持一致
  el.style.backgroundColor = isDark ? "#121212" : "#ffffff";
  el.style.color = isDark ? "#e5e5e5" : "#1a1a1a";
})();
