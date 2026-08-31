# 变更说明 · 2026-09-02（互动反馈升级）

按"每个动作都有回声"原则补齐操作反馈（克制档，不动版式）：

1. **Toast 小纸条**（`src/lib/toast.ts` + `src/components/toaster.tsx`）：
   复制配方/链接、完成全部步骤时底部浮出提示，1.8s 自动消失，aria-live 播报。
2. **调酒进度线**：配方页顶栏下沿细线随已完成步数生长；勾满全部步骤触发
   "倒酒"动画（酒杯液面上涨加深）+ toast「这杯成了」+ 双击震动。
3. **触感反馈**（`src/lib/haptics.ts`）：收藏、勾选材料、完成步骤、复制成功
   时 navigator.vibrate 轻震；桌面/iOS Safari 静默跳过，不报错。
4. 列表心形补 heart-pop（原来只有配方页有）；吧台勾选对勾加 check-pop 弹性。
5. 新动画全部纳入 prefers-reduced-motion 降级名单。

---

# 变更说明 · 2026-09-02（手机使用反馈修复）

1. **我的吧台整页滑不动**：材料面板和酒单分属两个区域，52 个标签把酒单挤出
   视口，两边都滚不动。现把面板整体移入主滚动区，材料区 → 分组酒单成为
   一条连续滚动流。第一版"只给标签列表加内部滚动"的方案已回退——
   同屏两个滚动区，用户很难感知（感谢反馈指出）。
2. **苦精永远算缺口（逻辑自相矛盾）**：苦精类被排除在可勾选材料之外，
   却仍计入"还缺几样"，导致古典鸡尾酒、曼哈顿等永远进不了"现在就能调"。
   `matchByPantry` 现在与 `PANTRY_OPTIONS` 同源：苦精/调味料不计缺口。
   `verify-data.mjs` 增补回归断言。
3. 勾 1 个基酒看不到酒属正常（默认"最多缺 1"，多数经典配方需 2~3 样材料），
   工具栏"最多缺 0-3"可放宽，空列表提示已有引导文案，未再改动。

验证：数据自检 / tsc / eslint / 构建全绿；jsdom 吧台交互专项 11/11 通过。

---

# 变更说明 · 2026-08-31

对 `Sukiya777/Grok-drink` 的一次重构，两条主线：**工程瘦身** 与 **体验/视觉优化**。

## 一、工程瘦身

原仓库只有一个 `Grok-drink.zip`，解压后是 Grok App Builder 生成的 TanStack Start 全栈脚手架。
承载这个调酒站的代码是 1,427 行酒谱数据加约 1,170 行界面与样式，其余都是模板自带的、
本项目根本不会执行的部分。

### 删除

| 内容 | 说明 |
| --- | --- |
| `src/lib/auth/`（13 个文件，2,057 行） | better-auth 登录体系：邮箱密码、OAuth popup、session gate、PG 隔离 |
| `src/lib/app-data/`（6 个文件，910 行） | Google Drive / Gmail / Outlook / MCP 连接器调用层 |
| `src/lib/multiplayer/`（579 行） | WebRTC 多人联机，无任何入口调用 |
| `src/lib/db.ts`（238 行）、`migrations/`（67 行） | PGLite + Kysely + Postgres 与建表 SQL |
| `src/lib/preview-host-bridge.ts` 等（365 行） | Grok 沙箱预览 postMessage 桥、embedder 白名单 |
| `src/routes/`、`src/router.tsx`、`routeTree.gen.ts`（131 行） | TanStack Router/Start 路由层，改为单入口挂载 |
| `server/`（124 行）、`scripts/`（4,900 行） | Grok PWA 安装页、品牌校验、浏览器冒烟、预览守护、签名计划 |
| `public/__grok/`（990 行）、`.grok/`、`startup.sh` | Grok 平台安装引导与容器启动脚本 |

合计约 10,400 行死代码与死资源。

### 依赖 70 → 22 个（运行时 51 → 5）

保留 `react` / `react-dom` / `lucide-react` / `clsx` / `tailwind-merge`。
移除全部 21 个 Radix 包、TanStack 全家桶（router/start/query/table）、better-auth、pglite、pg、
kysely、jose、recharts、react-hook-form、zod、zustand、date-fns、cmdk、vaul、sonner、
`react-day-picker`、`tw-animate-css`、`class-variance-authority`（Button 的 cva 已手写为变体表）；
构建期只留 vite / tailwind 4 / eslint / prettier / typescript 所需最小集，移除 `nitro`、`playwright`。

### 构建方式

`@tanstack/react-start` + `nitro`（Vercel 函数）→ 纯 `vite build` 静态产物。
现在冷构建约 0.5 秒（原方案在此环境未能完成依赖安装，故不做耗时对比）；
产物 `dist/` 直接可托管，无 SSR、无服务端运行时。

`vite.config.ts` 183 行 → 16 行：删除 dev 阶段的 OAuth popup 中间件、PGlite 引导钩子、
thumbnail/OG 注入与 `/__grok/install` 路由。
`package.json` 的 `build` 改为 `tsc --noEmit && vite build`，类型不过就不出包；
`db:migrate`、`check:auth`、`preview:*` 等脚本随之移除。

> 原 README 写着「本项目不需要数据库和登录」，但工程里确实带着完整的登录与数据库层，
> 且 `npm run build` 会顺带跑一次 `db:migrate`。业务代码从未 import 它们
> （唯一引用是 `__root.tsx` 里一个直接 return children 的透传 `AuthProvider`），所以移除是安全的。

## 二、顺手修掉的问题

逐项说明。其中第 3 条是我改动过程中自己引入、被冒烟测试捕获的，不是原仓库的缺陷。

1. **搜索时整列表卸载重建**：原 `CocktailList` 挂着 `key={rail + query}`，每敲一个字 React 就把
   全部卡片销毁重建，配合未做延迟的搜索输入，掉帧明显。已去掉该 key，改用
   `useDeferredValue` + 稳定 key。
2. **复制配方在非安全上下文静默失败**：原实现只走 `navigator.clipboard.writeText`，在 `file://`
   或 http 内网下该 API 不可用，点了没反应也不报错。已补 `execCommand` 兜底，再失败退化为 `window.prompt`。
3. **`scrollTo` 未兜底导致整树崩溃（我引入的）**：详情区滚回顶部原写成 `panel?.scrollTo({...})`，
   在缺少该方法的环境抛错且未捕获，会让 React 卸载整棵树直接白屏。jsdom 冒烟第一时间炸了出来，
   已加类型判断与 `scrollTop` 回退。
4. **份量在切换酒时丢失**：`servings` 原存在 `RecipePanel` 内部并被 `key={selected.id}` 重置，
   连看几杯就要反复点加号。提升到 shell 状态并持久化（属行为改进，原逻辑本身不算错）。
5. **未使用的样式 token**：`--shadow-panel` 在 `styles.css` 声明后全站零引用，已删；
   另有 `gates.tsx` 里一处 `dark:bg-white/20` 随 auth 层一起移除（全站只有深色配色，该分支永不生效）。

## 三、体验与视觉

### 新增「我的吧台」

侧栏新入口。勾选家里已有的材料（52 种，常用置顶、已选置顶、可按名称筛），
酒单按「现在就能调 / 只缺 1 样 / 只缺 2 样…」分组，并可设「最多缺 N 样」阈值。
卡片上直接写明还缺哪几样；详情页里缺的材料置灰划线，齐了给「吧台材料齐了」徽标。
配料名做了同义归一（`伦敦干金酒→金酒`、`银龙舌兰→龙舌兰`、`陈年/深色/牙买加朗姆→黑朗姆`、
`苏打水→气泡水`、`橙汁→新鲜橙汁`、`蛋白或 aquafaba→蛋白` 等，见 `INGREDIENT_ALIAS`），
避免同一种原料因叫法不同而漏匹配。
**注意**：`苦艾酒`（absinthe）与 `干/甜苦艾酒`（vermouth）是两种原料，刻意不合并。
苦精、盐、伍斯特酱等调味/装饰料不进库存清单，也不计入缺口；`optional: true` 的材料同样不算缺口。

### 数据补全

50 杯酒全部补 `abv`（成品近似酒精度）与 `sweet`（甜度 1~5），
用于详情页「度数/甜度」规格块、列表卡片的度数档位标签，以及新增的排序维度。

### 搜索与排序

搜索命中处高亮；`/` 聚焦搜索、`↑` `↓` 在酒单间移动、`Enter` 打开、`Esc` 关闭；
空态文案按当前视图区分（吧台 / 收藏 / 大类各说各的话）。
新增排序：默认 / 度数高→低 / 度数低→高 / 偏甜→偏干 / 省时优先。

### 配方页

- ml ↔ oz 切换（按 ¼ oz 刻度取整：7.5→¼、22.5→¾；不足 ¼ oz 回退 ml）
- 份量 1~6 杯，跨酒保留、刷新保留
- 步骤序号可点击打勾，方便边做边对进度，可重置
- 新增「复制这杯酒的链接」，配合 hash 深链（`#/gin/negroni`）刷新与分享都能还原视图
- 切大类时酒单回到顶部，换酒时详情区回到顶部
- 「今日特调」卡片从「全部」视图提到所有视图

### 视觉与无障碍

- 列表杯型里的酒液按大类着色（新增 `CATEGORY_COLOR`），卡片左侧加同色细条，侧栏大类方块同步取色
- 收藏按钮下沉到列表卡片右上角（hover / 键盘聚焦显形），不必进详情
- 加「跳到酒单」skip link、统一 `:focus-visible` 轮廓、补齐 `aria-pressed` / `aria-current` / `aria-label`
- 移动端详情区底部用 `env(safe-area-inset-bottom)` 避让手势条
- `prefers-reduced-motion` 下把原本仅 hover 显示的指示符常驻，避免关掉动效后丢线索
- 字体（Noto Sans/Serif SC）从模板注入改回 `index.html` 里的 Google Fonts 直连，删掉品牌探测脚本
- favicon 内联为 data URI，分享图 `og:image` 与 apple-touch-icon 补进 head

## 四、验证

沙箱内执行的检查（无浏览器，故用 jsdom 跑**生产构建产物**，不是源码）：

- `tsc --noEmit`：0 错误（并新增 `noUnusedLocals` / `noUnusedParameters`）
- `eslint .`：0 错误 0 警告
- `vite build`：成功；`index.js` 285.08 KB（gzip 89.60 KB）、`index.css` 29.70 KB（gzip 6.78 KB）
- 纯函数用例：别名归一、absinthe 与 vermouth 不合并、ml→oz 换算、份数叠加、
  空库存/别名库存的吧台匹配、排序单调性、50 杯酒字段完整性 —— 全通过
- jsdom 冒烟 16 项：首屏渲染 43 KB、深链选中内格罗尼、吧台勾选、
  勾「金酒+汤力水」命中「现在就能调 · 金汤力」等 —— 全通过（过程中捕获上面第 3 条崩溃）
- `vite dev` 本地起服：HTTP 200，模块正常编译
- **数据无损比对**：把 50 杯酒逐条与原版 diff，确认除新增的 `abv`/`sweet` 两字段与
  17 处刻意的配料改名外，其余字段（材料/步骤/装饰/备注）与原版逐字节一致；
  `CATEGORIES`、`GLASS_LABEL`、`METHOD_LABEL` 未改动

### 新增数据自检脚本

`scripts/verify-data.mjs`（`npm run verify`，已挂在 `npm run build` 最前面）：
校验 abv/sweet 取值范围、大类合法、id 唯一、别名表自洽（含禁止链式别名）、
absinthe 与 vermouth 不得合并、盎司换算不退化成 NaN、经典组合的吧台匹配、
库存清单不混入调料装饰、排序单调。以后你直接编辑 `cocktails.ts` 加酒，跑一下就能兜住低级错误。
为此把 `INGREDIENT_ALIAS` 改为具名导出。

## 五、没做的事

- **未扩充酒谱数量**（仍是 50 杯）：本次方向不含数据补全，且批量加酒需逐条核对配比。
- **未做浅色主题**：全站配色是深色酒馆设计，反色工作量不小、收益一般。
- **手机详情仍是整屏替换 + 返回箭头**（沿用原交互），没改成底部抽屉：当前实现已可用，
  且少一套手势状态。想要真抽屉我再单独加。
- 真机 iOS Safari / Android Chrome 的触控与键盘导航回归，需要你本地跑一次确认。
