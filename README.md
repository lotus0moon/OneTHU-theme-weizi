# 魏紫 · OneTHU 暗色主题包

> **非官方声明**：非官方社区创作，与清华大学无关，未经授权或认可。图形为自绘几何母题（工字厅「工」字形），不含校徽、不用校名标准字、不描摹二校门商标图形。

## 一、包信息

| 字段 | 值 |
| --- | --- |
| `manifest.id` / `theme.id` | `onethu.theme.weizi` |
| `name` | 魏紫 |
| `version` | 1.0.0 |
| `author` | lotus0moon |
| `category` | `theme` |
| `permissions` | `[]`（空数组） |
| `dark` | `true`（深色外观，注入 `color-scheme: dark`） |
| `description` | 深紫纸面，非官方创作，与清华大学无关；语音遮罩改为深色半透明。（31 字，上限 42） |
| `repo` | `https://github.com/lotus0moon/OneTHU-theme-weizi`（仓库根即本目录，市场按仓库根找 `plugin.js`） |
| 入口文件 | `plugin.js`（6017B / 114 行，单文件 ES 模块） |

与亮色主题同一枚 logo、同一套圆角，只有令牌取值与附加 CSS 数量不同。

## 二、安装

见族说明 [../README.md](../README.md) 第二节：插件市场填仓库地址（仓库根需有 `plugin.js`），或把 `plugin.js` 全文粘进插件页的代码安装框；装好后在「设置 → 外观」选择「魏紫」。
**建议与「桔梗紫」成对安装**：亮暗两套的色相、明度阶梯、圆角一致，切换时不跳。

## 三、色板（`plugin.js:42-83`，35 项，逐字取自材料 `05-配色方案与色板.md` §8.2）

| 令牌 | 值 | 令牌 | 值 |
| --- | --- | --- | --- |
| `--bg` | `#141019` | `--text-1` | `#f2f0f7` |
| `--bg-soft` | `#1a1520` | `--text-2` | `#b9b4c6` |
| `--surface` | `#1e1a26` | `--text-3` | `#948da3` |
| `--surface-2` | `#262130` | `--text-dim` | `#4a4356` |
| `--surface-3` | `#302a3c` | `--primary` | `#f4c6f0` |
| `--skeleton` | `rgba(255,255,255,0.06)` | `--primary-hover` | `#e6a6e4` |
| `--skeleton-shine` | `rgba(255,255,255,0.12)` | `--on-primary` | `#1a0a1e` |
| `--border` | `rgba(255,255,255,0.10)` | `--accent` | `#e6a6e4` |
| `--border-soft` | `rgba(255,255,255,0.05)` | `--accent-soft` | `rgba(230,166,228,0.16)` |
| `--border-strong` | `#be53c5` | `--accent-border` | `rgba(230,166,228,0.55)` |
| `--red` / `--red-soft` | `#ff8a80` / `rgba(194,38,31,0.18)` | `--hover` | `rgba(230,166,228,0.08)` |
| `--amber` / `--amber-soft` | `#fbbf24` / `rgba(180,83,9,0.18)` | `--active` | `rgba(230,166,228,0.14)` |
| `--green` / `--green-soft` | `#4ade80` / `rgba(27,127,75,0.18)` | `--ring` | `0 0 0 3px rgba(230,166,228,0.50)` |
| `--shadow-1` | `0 2px 4px rgba(0,0,0,0.4)` | `--shadow-2` | `0 2px 8px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.2)` |
| `--shadow-3` | `0 0 1px rgba(0,0,0,0.6), 0 12px 32px rgba(0,0,0,0.45)` | `--r-sm/md/lg` | `4px` / `6px` / `10px` |

**色值来源**：亮色档的 `--primary #660874` 是公开校色（PANTONE 259C；颜色本身不受著作权保护），本档在其色相上向亮侧展开到 `--primary #f4c6f0` / `--accent #e6a6e4`，色阶为社区推导，非任何官方发布的色板。

**不是把亮色反相**，三条设计约束都有实测支撑：

- **面**按 OKLab 明度步进 `18.2% → 20.7% → 22.8% → 26.0% → 29.9%`（`--bg` → `--bg-soft` → `--surface` → `--surface-2` → `--surface-3`），彩度 0.019→0.033、色相锁在 299.7–305.2°，因此深紫纸面的层次来自明度差而不是色相漂移。
- **文字**：`--text-1` 对 `--bg` 16.62:1、`--text-2` 9.31:1、`--text-3` 5.90:1；**主按钮**用亮粉底 `--primary #f4c6f0` 配深紫字 `--on-primary #1a0a1e`（12.82:1），而不是白字压亮底。
- **功能色一律提亮**（`--red #ff8a80`、`--amber #fbbf24`、`--green #4ade80`），阴影改为纯黑浮层，焦点环 `--ring` 合成后对 `--bg` 3.28:1。
- **不撞车**：`--accent #e6a6e4` 色相 327.6°，与内置 violet (`#7c3aed`) 距离 34.6°（要求 ≥20°）。
- **必须覆盖 `--skeleton-shine`**：`rgba(255,255,255,0.12)`；否则骨架屏会扫过一道白光。

## 四、附加 CSS（`plugin.js:92-112`，20 条）

20 条 = 2 条品牌签名 + 18 条硬编码修补。每条都以 `:root[data-theme="onethu.theme.weizi"]` 开头且恰好一次，无 `!important`、无布局属性、过渡只用 100ms。

**为什么暗色必须补规则**：`global.css` 里有 16 处颜色**不走令牌**（写死的 `#fff`/`#1f2328`/`#eef1f4`），它们与主题令牌无关，只改 `vars` 修不掉，暗底上会露出白块或出现白字压亮粉（约 1.9:1）。逐条覆盖如下（行号为 `OneTHU/apps/desktop/src/styles/global.css` 实测原值所在行）：

| 选择器 | 原值（行号） | 魏紫覆盖值 |
| --- | --- | --- |
| `.method-item.is-selected .method-radio` | `background: #fff`（594-596） | `background: var(--surface)` |
| `.switch::after` | `background: #fff`（801-812） | `background: var(--text-1)` |
| `.switch.on::after` | 同上的白旋钮 | `background: var(--on-primary)` |
| `.home-modal-mask` | `rgba(15,23,42,0.45)`（1659-1663） | `rgba(20,16,25,0.62)` |
| `.filter-dd-opt input:checked::before` | `background: #fff`（2346-2351） | `background: var(--on-primary)` |
| `.slot-cell.picked` | `color: #fff`（2384） | `color: var(--on-primary)` |
| `.plugin-toast` | `#1f2329` + 白字（3056） | `background: var(--surface-3); color: var(--text-1)` |
| `.plg-pin.is-oh` | `background: #fff; color: #000`（2954） | `background: var(--surface-2); color: var(--text-1); border-color: var(--border-strong)` |
| `.plg-switch i` | `background: #fff`（2973） | `background: var(--text-1)` |
| `.dock-voice-mask` | `rgba(244,245,247,0.78)`（3163-3176） | `rgba(20,16,25,0.88)`（**产品决策改写，见下**） |
| `.dock-voice-live` | `color: #1f2328`（3184-3190） | `color: var(--text-1)` |
| `.dock-voice-hint` | `color: #6b7280`（3193） | `color: var(--text-3)` |
| `.dock-badge` | `color: #fff`（3195-3204） | `color: var(--on-primary)` |
| `.trace-map` | `background: #eef1f4`（3599） | `background: var(--surface-2)` |
| `.mail-toolbar .tab-count` | `color: #fff`（3873） | `color: var(--on-primary)` |
| `.update-badge` | `background: var(--primary); color: #fff`（4357-4365） | `color: var(--on-primary)` |
| `.thos-tabs button.is-active` | `background: var(--primary); color: #fff`（4385-4388） | `color: var(--on-primary)` |

品牌签名 2 条与亮色同形（logo 染色 + 侧栏选中项用浅紫底强调色字），使亮暗切换时导航选中态不跳。

**刻意不改的地方**：`.mail-avatar`（背景来自 `MailPage.tsx:51`/`:158` 的内联 `hsl(...)`，白字恒成立）、`.ykt-editor` Quill 图标（`global.css:4821-4822` 已是 `var(--text-2)`，`:4820` 只是过期注释）、`.trace-pin-*`/`.trace-me i`（压在跨主题恒定的饱和紧迫度色上，白字/白描边两外观都成立）、以及内置「凝夜」的第三条 `img { opacity: .92 }`（SKILL 点名的反模式，不照抄）。

## 五、logo 与自检

logo 与 `logo/logo.svg`（187B，「工」字形几何）逐字一致，单色 `currentColor` 由主题染成 `--accent`。

```bash
(cd .. && bash tools/run-all-checks.sh)   # 全量 19 条命令，退出码 0 = 全通过（含只读哈希自断言）
node test.mjs                              # 本包自检：130 通过 / 0 失败
```

## 六、已知取舍与注意

1. **改写了「雾白遮罩 + 永远深字」的产品决策**：`.dock-voice-mask` 源码注释写明这是用户拍板、两种主题都偏白雾的选择；在暗色主题下白雾遮罩会整块闪白，故改为 `rgba(20,16,25,0.88)` 并把字幕改为 `--text-1`。取舍已写进主题描述（对应 OQ-3）；若要恢复原决策，删掉 `plugin.js:100-101` 两条即可。
2. `--text-3` 对 `--surface-3` 4.33:1、对 `--accent-soft` 3.84:1，未达 4.5:1 软目标（高于 3:1 硬门槛）。
3. 未做真机走查（环境无桌面端），静态证据与残留风险见 `reports/04-验证报告.md` §6 与 `reports/02-暗色硬编码点覆盖报告.md` §6。
4. `REPO` 为占位地址，发布前替换；若两个主题放同一个仓库，请按「单仓库 + 子目录」填写（见根 `README.md` §二），两种形态已由 `node tools/check-install.mjs` 验证。
5. **开关类控件按状态分别给值**：开态轨道是 `--accent`/`--green`，上游白色滑钮压上去只有 1.92:1 / 1.74:1，故开态滑钮统一改用 `--on-primary`（9.89:1 / 10.90:1）；关态本来就是纯白（13.80:1），改成 `--text-1`（12.21:1）属观感统一。此缺陷由独立复核发现（S1），修复与断言强化见 `reports/06` §5.2。
6. 17 处 `box-shadow: rgba(0,0,0,α)` 不走令牌，暗色下浮层层次略弱（不露白块、不影响可读性），登记为已知限制。
