# 365 — Daily Reflection App

A mobile-first Next.js app powered by the final 365-day poem / essay / art production dataset.

## What is implemented

- Landing screen with local "Continue" memory
- 365 statically generated Day routes
- Day progress and five-part narrative progress
- Guiding question
- Poem, essay, and art cards using the production master
- One-click verified source links
- Previous / next navigation
- Jump-to-day control
- JSON API: `GET /api/days/:day`
- PWA manifest
- Responsive mobile-first UI
- No third-party UI dependencies

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Data

`data/daily_content.json` is copied directly from the app import package generated from the final production master.

The app reads that source through `lib/content.ts`, which keeps the UI isolated from the storage implementation. That makes it straightforward to replace JSON with Supabase/PostgreSQL later without rewriting the screens.

## API

```http
GET /api/days/1
GET /api/days/365
```

## Recommended next build

1. Add user accounts and a configurable start date.
2. Track completed days / streaks.
3. Add favorites, notes, and private journaling.
4. Move content storage to Supabase.
5. Add artwork thumbnails only where licensing/source rules allow.
6. Wrap as a native mobile app with Capacitor or ship as an installable PWA first.
