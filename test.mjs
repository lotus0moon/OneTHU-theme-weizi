/**
 * 主题插件离线自检 —— 令牌名合法性、必覆盖项、WCAG 对比度、logo 规范、CSS 作用域。
 * 跑法：`node test.mjs`（退出码非 0 即不通过）。
 *
 * 自检的意义是把主题的边界契约钉成断言：令牌名写错会静默失效、CSS 漏加作用域会
 * 污染其他主题、配色靠肉眼判断最容易在「深色底上的次要字」这一环失守。
 *
 * 令牌白名单对应 OneTHU 仓库 packages/ui/src/tokens.css，并补入后加的 --skeleton-shine
 * （barbie 示例的自检表早于该令牌，直接照抄会漏）。
 */
import { manifest, theme } from "./plugin.js";

let pass = 0;
let fail = 0;
const eq = (name, a, b) => {
  if (JSON.stringify(a) === JSON.stringify(b)) pass++;
  else { fail++; console.error(`✗ ${name}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`); }
};
const ok = (name, cond) => eq(name, !!cond, true);
/** 软目标：不达标只提示，不算失败。用于比内置主题更严的那几项。 */
const warn = [];
const soft = (name, cond) => { if (!cond) warn.push(name); };

/* ── 令牌白名单（tokens.css 全集） ── */
const TOKENS = new Set([
  "bg", "bg-soft", "surface", "surface-2", "surface-3", "skeleton", "skeleton-shine",
  "border", "border-soft", "border-strong",
  "text-1", "text-2", "text-3", "text-dim",
  "primary", "primary-hover", "on-primary", "accent", "accent-soft", "accent-border",
  "red", "red-soft", "amber", "amber-soft", "green", "green-soft",
  "hover", "active", "ring", "shadow-1", "shadow-2", "shadow-3",
  "font-ui", "font-mono",
  "text-xxs", "text-xs", "text-sm", "text-base", "text-md", "text-lg", "text-xl",
  "gap-1", "gap-2", "gap-3", "gap-4", "gap-5", "gap-6",
  "r-sm", "r-md", "r-lg", "r-pill", "sidebar-w",
].map((k) => `--${k}`));

/* ── WCAG 2.1 对比度（仅不透明 hex；半透明值跳过） ── */
function luminance(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
const ratio = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
const isHex = (v) => /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(v);
/** 硬门槛：不达标即失败。 */
const contrastOk = (name, fg, bg, min) => {
  if (!isHex(fg) || !isHex(bg)) { ok(`${name}（非纯色，跳过）`, true); return; }
  const r = ratio(fg, bg);
  ok(`${name} 对比度 ${r.toFixed(2)}:1 ≥ ${min}:1`, r >= min);
};
/** 软目标：达不到就写进提示，不判失败。 */
const contrastSoft = (name, fg, bg, min) => {
  if (!isHex(fg) || !isHex(bg)) return;
  const r = ratio(fg, bg);
  soft(`${name} 对比度 ${r.toFixed(2)}:1（目标 ≥ ${min}:1）`, r >= min);
};

/* ── 清单 ── */
ok("manifest.category === theme", manifest.category === "theme");
eq("不申请权限", manifest.permissions, []);
ok("语义化版本号", /^\d+\.\d+\.\d+$/.test(manifest.version));
ok("有仓库地址", typeof manifest.repo === "string" && manifest.repo.includes("github.com"));
ok("id 形如 onethu.theme.<名称>", /^onethu\.theme\.[a-z0-9.-]+$/.test(manifest.id));

/* ── 一致性 ── */
eq("theme.id 与清单一致", theme.id, manifest.id);
eq("theme.name 与清单一致", theme.name, manifest.name);
eq("theme.version 与清单一致", theme.version, manifest.version);
ok("有描述", typeof theme.description === "string" && theme.description.length > 8);
ok("描述不用第一/第二人称", !/[你您我咱]/.test(theme.description || ""));

/* ── 令牌 ── */
const keys = Object.keys(theme.vars);
ok("令牌覆盖数量 ≥ 20", keys.length >= 20);
for (const k of keys) ok(`令牌名合法 ${k}`, TOKENS.has(k));
for (const k of keys) ok(`令牌值非空 ${k}`, typeof theme.vars[k] === "string" && theme.vars[k].trim() !== "");

const REQUIRED = [
  "--bg", "--surface", "--text-1", "--text-2", "--primary", "--on-primary",
  "--accent", "--accent-soft", "--accent-border", "--border", "--hover", "--ring",
];
for (const k of REQUIRED) ok(`必覆盖 ${k}`, k in theme.vars);
if (theme.dark === true) ok("暗色主题必覆盖 --skeleton-shine", "--skeleton-shine" in theme.vars);
ok("主按钮不是白底白字", theme.vars["--primary"] !== theme.vars["--on-primary"]);

/* ── 对比度阈值 ──
 * 硬门槛对齐 WCAG 2.1 AA 与 OneTHU 内置主题的实际水准：
 *   正文与次要文字 ≥ 4.5:1；三级字与强调色按「非文本 / 大字号」档 ≥ 3:1。
 * 之所以不把三级字和强调色也钉在 4.5:1：内置主题本身就达不到
 *   —— --text-3 #81858c 对白 3.71:1、--accent #4176e6 对白 4.23:1、
 *      暖沙强调色 #c2740a 对白 3.62:1 —— 门槛高过产品自身的基准会让主题无法如实还原。
 * 更严的一档（正文字号也按 7:1、三级字与强调色按 4.5:1）列在软目标里，只提示不判失败。
 */
const v = theme.vars;
contrastOk("正文 / 底色", v["--text-1"], v["--bg"], 4.5);
contrastOk("正文 / 卡片面", v["--text-1"], v["--surface"], 4.5);
contrastOk("次要字 / 底色", v["--text-2"], v["--bg"], 4.5);
contrastOk("三级字 / 底色", v["--text-3"], v["--bg"], 3);
contrastOk("链接强调 / 底色", v["--accent"], v["--bg"], 3);
contrastOk("强调色 / 卡片面", v["--accent"], v["--surface"], 3);
contrastOk("按钮字 / 主按钮", v["--on-primary"], v["--primary"], 4.5);
contrastOk("按钮字 / hover", v["--on-primary"], v["--primary-hover"], 4.5);

contrastSoft("正文 / 底色", v["--text-1"], v["--bg"], 7);
contrastSoft("三级字 / 底色", v["--text-3"], v["--bg"], 4.5);
contrastSoft("链接强调 / 底色", v["--accent"], v["--bg"], 4.5);

/* 附加 CSS 里的渐变按钮：两端都得留住白字 */
const grads = [...(theme.css || "").matchAll(/linear-gradient\(135deg,\s*(#[0-9a-f]{3,6})\s+0%,\s*(#[0-9a-f]{3,6})\s+100%\)/gi)];
for (const [, a, b] of grads) {
  contrastOk(`渐变起点 ${a} / 白字`, "#ffffff", a, 4.5);
  contrastOk(`渐变终点 ${b} / 白字`, "#ffffff", b, 4.5);
}

/* ── 品牌 logo ── */
ok("logo 是 inline SVG", theme.logo.includes("<svg") && theme.logo.includes("</svg>"));
ok("logo viewBox 24×24", theme.logo.includes('viewBox="0 0 24 24"'));
ok("logo 跟随 currentColor", theme.logo.includes("currentColor"));
ok("logo 无脚本 / 外链", !/<script|href=|xlink:href/i.test(theme.logo));

/* ── 附加 CSS 的作用域 ── */
const SCOPE = `:root[data-theme="${theme.id}"]`;
const rules = [...(theme.css || "").matchAll(/([^{}]+)\{([^{}]*)\}/g)];
ok("CSS 规则数 ≥ 3", rules.length >= 3);
for (const [, selector] of rules) {
  ok(`作用域限定 ${selector.trim().slice(0, 48)}`, selector.trim().startsWith(SCOPE));
}
const scoped = (theme.css || "").split(SCOPE).length - 1;
eq("每条规则各带一次作用域前缀", scoped, rules.length);
ok("附加 CSS 不改布局（无 padding/margin/height/width/grid）",
  !/(^|[;{\s])(padding|margin|height|width|display|grid-template|position|flex)\s*:/i.test(theme.css || ""));

console.log(`\n结果：${pass} 通过 / ${fail} 失败`);
if (warn.length) {
  console.log(`\n软目标未达成（不判失败，供取舍参考）：`);
  for (const w of warn) console.log(`· ${w}`);
}
process.exit(fail === 0 ? 0 : 1);
