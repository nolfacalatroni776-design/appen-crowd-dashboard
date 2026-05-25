# Demo Deployment

## Current GitHub Push

The demo has been pushed to the existing GitHub repository:

```text
git@github.com:theone752y-a11y/demo.git
```

Branches:

- `appen-crowd-dashboard-source`: source code for this dashboard demo.
- `gh-pages`: built static files from `dist/`, with Vite `BASE_PATH=/demo/`.

The existing `main` branch in that repository was not overwritten.

To enable the public site, open the repository settings:

1. `Settings` -> `Pages`
2. `Build and deployment` -> `Source`
3. Select `Deploy from a branch`
4. Branch: `gh-pages`
5. Folder: `/ (root)`
6. Save

After GitHub finishes publishing, the URL should be:

```text
https://theone752y-a11y.github.io/demo/
```

## New Repository Option

If you create a new empty repository, this project also includes a GitHub Actions Pages workflow.

1. Create a GitHub repository.
2. Push this project to the repository `main` branch.
3. Open repository settings:
   - `Settings` -> `Pages`
   - `Build and deployment` -> `Source`
   - Select `GitHub Actions`
4. The included workflow builds and deploys automatically.

For a repository named `appen-crowd-dashboard` under user `theone752y-a11y`, the public URL would be:

```text
https://theone752y-a11y.github.io/appen-crowd-dashboard/
```

## Local Production Preview

```bash
npm run build
npm run preview:public
```

Then open:

```text
http://localhost:4173/
```

## Temporary Tunnel Preview

Use this only for quick one-off review. It is not stable enough for frequent access.

```bash
npm run build
npm run preview:public
npx localtunnel --port 4173 --local-host 127.0.0.1
```
