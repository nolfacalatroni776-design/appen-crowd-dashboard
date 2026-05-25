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

## GitHub Pages 部署

本仓库内置 GitHub Actions 工作流。推送到 `main` 分支后会自动构建并发布 `dist/` 到 GitHub Pages。

仓库创建后，需要在 GitHub 仓库设置中确认：

- `Settings` -> `Pages`
- `Build and deployment` -> `Source` 选择 `GitHub Actions`

如果仓库名不是用户主页仓库，发布路径会自动使用 `/<repo-name>/`。
