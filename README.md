# 365 — A Daily Reflection

This is the GitHub-repository edition of the 365-day poem / essay / art app.

It is a normal React + Vite source project. Upload these files to the root of a GitHub repository and connect that repository to the hosting platform you want to use.

## Production content

The app is powered by:

`src/data/daily_content.json`

That file contains the final production-QA dataset for all 365 days:

- 365 poem selections
- 365 day-specific essay selections
- 365 artworks
- all five 73-day narrative parts
- final source URLs and QA metadata

The UI reads that dataset through `src/lib/content.js`.

## Repository structure

```text
.
├── .github/
│   └── workflows/
│       └── validate.yml
├── public/
│   └── favicon.svg
├── scripts/
│   └── check-data.mjs
├── src/
│   ├── components/
│   │   ├── DayNavigator.jsx
│   │   ├── DayScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── MediaCard.jsx
│   │   └── SourceLink.jsx
│   ├── data/
│   │   └── daily_content.json
│   ├── lib/
│   │   └── content.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run check:data
npm run build
```

Vite outputs the deployable build to:

`dist/`

## GitHub workflow

Every push or pull request runs:

1. `npm install`
2. the 365-day production-data validation
3. a full Vite build

So GitHub itself will flag a broken dataset or broken app build.

## Navigation

The app uses shareable query-string URLs:

```text
/?day=1
/?day=42
/?day=365
```

This keeps the project easy to deploy on static or server-backed hosts without adding a routing dependency.

## Current features

- complete 365-day dataset
- start / continue experience
- remembers last opened day
- poem / essay / art cards
- verified source links
- five-part progress
- year progress
- previous and next day
- jump to any day
- responsive mobile-first layout
