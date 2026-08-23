# 365 — A Daily Reflection · App V2

This version keeps the final 365-day poem / essay / art production dataset and adds the first user-state and visual-design layer.

## New in V2

- completed-day tracking stored in browser `localStorage`;
- completed count and progress bar on the home screen;
- "Next unfinished day" shortcut;
- mark / unmark a day as complete;
- completed status on the Day screen;
- maroon + phthalo-green visual system over warm paper tones;
- artwork card now supports direct in-app images through `art.image_url`;
- graceful artwork placeholder until a vetted image URL is supplied.

## Important: completion data

Completion is currently **local to the browser/device**. It does not require login and is not synced across devices yet.

The storage key is:

`365:completed-days`

A later Supabase/account version can move the same completed-day model to the cloud.

## Artwork image support

Each day now supports:

```json
"art": {
  "title": "...",
  "artist_or_culture": "...",
  "source": {
    "name": "...",
    "url": "..."
  },
  "image_url": null
}
```

When `image_url` contains a vetted HTTP(S) image URL, the artwork appears directly in the app. When it is `null`, the app keeps the current source link and shows a designed placeholder.

This is intentional: do not use museum page URLs as image URLs, and do not hotlink arbitrary images without checking source reliability and usage rights.

## GitHub Pages

The existing GitHub Pages deployment workflow is retained.

Upload/replace the project files in the repo and commit to `main`; the Pages workflow will rebuild and redeploy automatically.
