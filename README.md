# 夜酌 Night Pour

按基酒大类查阅经典鸡尾酒：材料精确到毫升，步骤只保留手法。可收藏、换算份量与盎司、按家里已有的材料筛酒。

纯前端静态站（React 19 + Vite 8 + Tailwind 4），**没有后端、没有数据库、不需要登录**：酒谱写在 `src/lib/cocktails.ts`，收藏、份量与吧台库存存在浏览器 `localStorage`。构建产物是 `dist/` 里的静态文件，任何静态托管都能直接部署。

## 环境

- Node.js 20.19+（Vite 8 要求；建议 22+）

## 本地运行

```bash
npm install
npm run dev      # http://localhost:8080
```

```bash
npm run build    # 数据自检 + tsc 类型检查 + 产出 dist/
npm run preview  # 本地预览构建产物
```

```bash
npm run verify   # 只跑酒谱数据自检（scripts/verify-data.mjs）
npm run typecheck
npm run lint
```

`verify` 会检查：每杯酒的 `abv`/`sweet`/`category` 是否合法、id 是否重复、配料别名表是否自洽、
盎司换算是否退化、吧台匹配对经典组合是否零缺口。改完 `cocktails.ts` 单独跑它最省事。

## 部署

`npm run build` 产出 `dist/`，整目录上传即可（GitHub Pages / Netlify / Vercel / 任意静态托管）。

- **Vercel**：导入仓库，Framework 选 **Vite**，Build Command `npm run build`，Output Directory `dist`。
- **GitHub Pages**（项目页在子路径下时）：构建前把 `vite.config.ts` 的 `base` 设为 `/Grok-drink/`，否则资源会 404。
- 没有 history 路由回退问题：视图状态放在 URL hash（`#/gin/negroni`），刷新与分享都能还原，不需要服务端 rewrite 规则。

## 目录说明

```
index.html            唯一的页面入口
src/
  main.tsx            挂载 React（单页应用，无路由库，视图状态走 hash）
  components/
    app-shell.tsx     三栏骨架、状态编排、键盘快捷键
    category-rail.tsx 左侧大类栏（含“我的吧台”“收藏”入口）
    toolbar.tsx       搜索框 + 排序 + 缺口阈值
    cocktail-list.tsx 酒单卡片、分组标题、命中高亮
    recipe-panel.tsx  配方详情：份量、盎司/ml、步骤打勾、复制
    pantry-panel.tsx  材料勾选面板
    glass-mark.tsx    杯型 SVG，酒液按大类着色
  lib/
    cocktails.ts      全部酒谱与派生逻辑（改配方改这里）
    category-copy.ts  各视图的标题与说明文案
    favorites.ts      localStorage：收藏 / 吧台库存 / 份量与单位
  styles.css          设计 token 与动效
scripts/
  verify-data.mjs     酒谱数据自检（build 前自动跑）
public/               分享图、图标
```

单页应用没有 `src/routes/`：视图状态放在 URL hash（`#/<大类>/<酒>`，如 `#/gin/negroni`），
刷新、分享、浏览器前进后退都能还原，且不需要服务端的 rewrite 配置。

## 改数据

编辑 `src/lib/cocktails.ts` 的 `COCKTAILS` 数组即可，每杯酒字段：

| 字段 | 说明 |
| --- | --- |
| `category` | 大类 id，决定分组与酒液颜色 |
| `abv` | 成品近似酒精度（%vol），无酒精填 0 |
| `sweet` | 甜度 1~5，用于排序 |
| `level` | 入门 / 进阶 / 讲究 |
| `ingredients[]` | `optional: true` 的材料不计入吧台缺口 |

配料名会自动归一（`伦敦干金酒 → 金酒`、`银龙舌兰 → 龙舌兰`、`干苦艾酒 → 干味美辛` 等），别名表在 `INGREDIENT_ALIAS`。
注意 `苦艾酒`（absinthe）与 `干/甜苦艾酒`（vermouth）是两种原料，不能合并。

## 交互速查

- `/` 聚焦搜索，`↑` `↓` 在酒单间移动，`Enter` 打开，`Esc` 关闭配方
- 列表卡片右上角心形可直接收藏，不必先进详情
- 「我的吧台」勾选家里有的材料，按「最多缺 N 样」筛酒
- 详情页可切 ml / oz（按 ¼ oz 刻度取整），份量 1~6 杯
- 步骤序号可点击打勾，方便边做边对进度
- 尊重 `prefers-reduced-motion`：系统开启减弱动效后自动关闭入场动画
