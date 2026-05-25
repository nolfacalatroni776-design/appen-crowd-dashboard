# Demo Deployment

## Recommended Stable Deployment

Use GitHub Pages for frequent design and engineering review.

1. Create a GitHub repository.
2. Push this project to the repository `main` branch.
3. Open repository settings:
   - `Settings` -> `Pages`
   - `Build and deployment` -> `Source`
   - Select `GitHub Actions`
4. The included workflow builds and deploys automatically.

For a repository named `appen-crowd-dashboard` under user `theone752y-a11y`, the public URL will be:

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
