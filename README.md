# 澳鹏众包运营数据看板

一个用于研发、设计和运营评审的众包运营数据看板前端 demo。

## 本地运行

```bash
npm install
npm run dev
```

## 本地验证

```bash
npm run lint
npm run build
```

## 当前发布

当前 demo 通过 GitHub Actions 发布到：

```text
https://nolfacalatroni776-design.github.io/appen-crowd-dashboard/
```

源码仓库：

```text
https://github.com/nolfacalatroni776-design/appen-crowd-dashboard
```

推送到 `main` 分支后会自动构建并更新 GitHub Pages。

## 编辑固化

页面编辑模式会先把改动保存在当前浏览器的 localStorage 中。要让研发、设计打开线上链接也看到同一份内容，需要把浏览器编辑态固化进源码并推送：

```bash
npm run persist:edits
npm run lint
npm run build
git add src/data/defaultDashboardState.ts
git commit -m "Persist dashboard edits"
git push github-pages main
```

`persist:edits` 会读取 Chrome 中线上域名对应的 dashboard 编辑态，并写入 `src/data/defaultDashboardState.ts`。静态 GitHub Pages 页面不会直接持有 GitHub 写权限；如果要实现前端点击保存后自动提交源码，需要新增安全后端、GitHub App 或受控 GitHub Action 入口。
