/**
 * 魏紫 —— OneTHU 暗色主题插件（非官方创作，与清华大学无关）
 *
 * 与 `onethu.theme.jiegengzi`（桔梗紫）配套的深色主题：同一套色相与圆角人格，
 * 层次靠明度步进与 1px 描边建立，不靠阴影（暗色下阴影几乎不可见）。
 * 除 `vars` 外还必须做两件事（见 00-主题插件事实与边界.md §12 与 02 §6）：
 *   ① 覆盖 `--skeleton-shine`，否则暗底会被骨架屏扫过一道白光；
 *   ② 逐条覆盖组件里硬编码的浅色面，否则暗底会露出白块（内置「凝夜」只覆盖了 3 处）。
 *
 * 配色依据：`onethu-unofficial-thu-theme/05-配色方案与色板.md` §8.2；
 * `#660874` 是社区推导值（官方标准色 PANTONE 259C）。
 */

const THEME_ID = "onethu.theme.weizi";
const THEME_NAME = "魏紫";
const THEME_VERSION = "1.0.0";
/* 陈述句、含非官方声明、并写明本主题对语音遮罩的取舍；≤ 42 字 */
const DESCRIPTION = "深紫纸面，非官方创作，与清华大学无关；语音遮罩改为深色半透明。";
/* 本主题的发布仓库（仓库根目录即存放本文件，市场按仓库根找 plugin.js） */
const REPO = "https://github.com/lotus0moon/OneTHU-theme-weizi";

export const manifest = {
  id: THEME_ID,
  name: THEME_NAME,
  version: THEME_VERSION,
  author: "lotus0moon",
  category: "theme",
  description: DESCRIPTION,
  repo: REPO,
  permissions: [],
};

export const theme = {
  id: THEME_ID,
  name: THEME_NAME,
  version: THEME_VERSION,
  author: "lotus0moon",
  description: DESCRIPTION,
  /* 暗色主题：applyTheme 会写入 color-scheme: dark */
  dark: true,

  vars: {
    /* 面：明度步进 18.2% → 20.7% → 22.8% → 26.0% → 29.9%；--skeleton-shine 必须覆盖 */
    "--bg": "#141019",
    "--bg-soft": "#1a1520",
    "--surface": "#1e1a26",
    "--surface-2": "#262130",
    "--surface-3": "#302a3c",
    "--skeleton": "rgba(255, 255, 255, 0.06)",
    "--skeleton-shine": "rgba(255, 255, 255, 0.12)",
    /* 线：装饰用低 alpha 白，控件用第 500 阶（对 --surface 4.25:1） */
    "--border": "rgba(255, 255, 255, 0.10)",
    "--border-soft": "rgba(255, 255, 255, 0.05)",
    "--border-strong": "#be53c5",
    /* 文字：--text-1 对 --bg 16.62:1，--text-2 9.31:1，--text-3 5.90:1 */
    "--text-1": "#f2f0f7",
    "--text-2": "#b9b4c6",
    "--text-3": "#948da3",
    "--text-dim": "#4a4356",
    /* 品牌与强调：第 200 阶作主按钮底，深紫字在其上 12.82:1；--accent 第 300 阶对 --bg 9.79:1 */
    "--primary": "#f4c6f0",
    "--primary-hover": "#e6a6e4",
    "--on-primary": "#1a0a1e",
    "--accent": "#e6a6e4",
    "--accent-soft": "rgba(230, 166, 228, 0.16)",
    "--accent-border": "rgba(230, 166, 228, 0.55)",
    /* 功能色一律提亮；焦点环 3px（对 --bg 3.28:1）；阴影只用于浮层；圆角与浅色主题一致 */
    "--red": "#ff8a80",
    "--red-soft": "rgba(194, 38, 31, 0.18)",
    "--amber": "#fbbf24",
    "--amber-soft": "rgba(180, 83, 9, 0.18)",
    "--green": "#4ade80",
    "--green-soft": "rgba(27, 127, 75, 0.18)",
    "--hover": "rgba(230, 166, 228, 0.08)",
    "--active": "rgba(230, 166, 228, 0.14)",
    "--ring": "0 0 0 3px rgba(230, 166, 228, 0.50)",
    "--shadow-1": "0 2px 4px rgba(0, 0, 0, 0.4)",
    "--shadow-2": "0 2px 8px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.2)",
    "--shadow-3": "0 0 1px rgba(0, 0, 0, 0.6), 0 12px 32px rgba(0, 0, 0, 0.45)",
    "--r-sm": "4px",
    "--r-md": "6px",
    "--r-lg": "10px",
  },

  /* 品牌标识：与亮色主题同一枚「工」字形几何（工字厅母题，参数照 04 §4 第 157 行：
   * 上下两横各长 16、中间一竖高 12），尺寸由 svg 属性给出 */
  logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1.3em" height="1.3em" fill="currentColor" aria-hidden="true"><path d="M4 6H20V9H4ZM10 6H14V18H10ZM4 15H20V18H4Z"/></svg>`,

  /* 附加 CSS：20 条规则，每条各带一次 `:root[data-theme="…"]` 前缀。
   * 分两类：① 把「白字压亮点强调铺底」的硬编码对改成 `--on-primary` 深紫字；
   *         ② 把硬编码的浅色面/底图改成主题面。不写布局属性。 */
  css: `
:root[data-theme="${THEME_ID}"] .brand-logo-themed { color: var(--accent); }
:root[data-theme="${THEME_ID}"] .brand-logo-themed svg { transition: color 100ms cubic-bezier(0.4, 0, 0.2, 1); }
:root[data-theme="${THEME_ID}"] .method-item.is-selected .method-radio { background: var(--surface); }
:root[data-theme="${THEME_ID}"] .switch::after { background: var(--text-1); }
:root[data-theme="${THEME_ID}"] .switch.on::after { background: var(--on-primary); }
:root[data-theme="${THEME_ID}"] .home-modal-mask { background: rgba(20, 16, 25, 0.62); }
:root[data-theme="${THEME_ID}"] .filter-dd-opt input:checked::before { background: var(--on-primary); }
:root[data-theme="${THEME_ID}"] .slot-cell.picked { color: var(--on-primary); }
:root[data-theme="${THEME_ID}"] .dock-voice-mask { background: rgba(20, 16, 25, 0.88); }
:root[data-theme="${THEME_ID}"] .dock-voice-live { color: var(--text-1); }
:root[data-theme="${THEME_ID}"] .dock-voice-hint { color: var(--text-3); }
:root[data-theme="${THEME_ID}"] .dock-badge { color: var(--on-primary); }
:root[data-theme="${THEME_ID}"] .trace-map { background: var(--surface-2); }
:root[data-theme="${THEME_ID}"] .mail-toolbar .tab-count { color: var(--on-primary); }
:root[data-theme="${THEME_ID}"] .update-badge { color: var(--on-primary); }
:root[data-theme="${THEME_ID}"] .thos-tabs button.is-active { color: var(--on-primary); }
:root[data-theme="${THEME_ID}"] .plugin-toast { background: var(--surface-3); color: var(--text-1); }
:root[data-theme="${THEME_ID}"] .plg-pin.is-oh { background: var(--surface-2); color: var(--text-1); border-color: var(--border-strong); }
:root[data-theme="${THEME_ID}"] .plg-switch i { background: var(--text-1); }
:root[data-theme="${THEME_ID}"] .plg-switch.is-on i { background: var(--on-primary); }
`,
};
