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

## 当前 GitHub 推送

当前 demo 已推送到：

```text
git@github.com:theone752y-a11y/demo.git
```

分支：

- `appen-crowd-dashboard-source`：当前看板源码
- `gh-pages`：已构建的静态发布产物

没有覆盖该仓库原有 `main` 分支。

要启用公开访问，需要在 GitHub 仓库设置中确认：

- `Settings` -> `Pages`
- `Build and deployment` -> `Source` 选择 `Deploy from a branch`
- Branch 选择 `gh-pages`
- Folder 选择 `/ (root)`

启用后访问：

```text
https://theone752y-a11y.github.io/demo/
```

## 新仓库自动部署

如果后续创建一个新的空仓库，本项目也内置 GitHub Actions 工作流。推送到 `main` 分支后可自动构建并发布 `dist/` 到 GitHub Pages。

新仓库创建后，需要在 GitHub 仓库设置中确认：

- `Settings` -> `Pages`
- `Build and deployment` -> `Source` 选择 `GitHub Actions`

如果仓库名不是用户主页仓库，发布路径会自动使用 `/<repo-name>/`。
