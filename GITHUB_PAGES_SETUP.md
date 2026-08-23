# GitHub Pages Setup — Important

This React/Vite repository must be **built before GitHub Pages serves it**.
Do not configure Pages to publish the raw repository root.

## Correct setup

1. Upload all of these files to your GitHub repository.
2. Commit/push them to the `main` branch.
3. Open the repository on GitHub.
4. Go to **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **GitHub Actions**.
6. Open the **Actions** tab.
7. The workflow named **Deploy 365 App to GitHub Pages** should run.
8. When it finishes successfully, GitHub will show the deployed Pages URL.

The workflow performs:

```text
npm install
npm run check:data
npm run build
upload ./dist
deploy ./dist to GitHub Pages
```

## Why the previous version showed a blank page

The previous repository had React/Vite source files but no Pages deployment workflow.
Publishing the repository root made GitHub serve the uncompiled source. Browsers cannot
directly execute the JSX source app as a production site.

## Repository project URLs

The Vite configuration automatically detects the GitHub repository name during Actions
and builds asset paths for:

```text
https://USERNAME.github.io/REPOSITORY/
```

Local development still works normally with:

```bash
npm install
npm run dev
```

## Day links

Days use query-string routes, for example:

```text
https://USERNAME.github.io/REPOSITORY/?day=1
https://USERNAME.github.io/REPOSITORY/?day=365
```

This avoids GitHub Pages SPA route/404 problems.
