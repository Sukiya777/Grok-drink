# 夜酌 Night Pour

按基酒大类查阅经典鸡尾酒：材料精确到毫升，步骤只保留手法。

这不是一堆单独的 `.html` 文件，而是完整的 **React + TanStack Start** 全栈项目（前端 UI + Node 构建/服务端渲染）。解压后即可在本地运行，也可部署到 Vercel。

目标仓库：[Sukiya777/Grok-drink](https://github.com/Sukiya777/Grok-drink)

## 环境

- Node.js 22+
- npm 10+

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端里提示的地址（默认 `http://localhost:8080`）。

## 生产构建

```bash
npm run build
npm run preview
```

`npm run build` 会产出 Vercel 可用的 `.vercel/output`。

## 部署到 Vercel

1. 把本仓库推到 GitHub（例如 `Sukiya777/Grok-drink`）
2. 在 [Vercel](https://vercel.com) 导入该仓库
3. Framework 选 Vite / Other，构建命令用 `npm run build`
4. 部署后即可公网访问

本项目**不需要**数据库和登录（配方数据在 `src/lib/cocktails.ts`，收藏存在浏览器 `localStorage`）。

## 目录说明

```
src/
  routes/           页面路由（首页）
  components/       界面：大类栏、酒单板块、配方面板
  lib/cocktails.ts  全部酒谱数据（改配方改这里）
  lib/favorites.ts  本地收藏
  styles.css        设计 token 与动效
public/             图标、分享图
scripts/            开发/构建辅助
server/             服务端中间件
vite.config.ts      构建配置（端口 8080，Vercel preset）
```

改酒谱：编辑 `src/lib/cocktails.ts`。  
改界面：编辑 `src/components/`。

## 上传到 GitHub

解压本压缩包，在文件夹里：

```bash
git init
git add .
git commit -m "夜酌：调酒手册"
git branch -M main
git remote add origin https://github.com/Sukiya777/Grok-drink.git
git push -u origin main
```

若仓库里已有 README，用 `git push -u origin main --force` 覆盖，或先把压缩包内文件拖进仓库网页的 Upload files。
