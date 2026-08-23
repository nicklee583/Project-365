# Project 365 — App V4

V4 keeps the production 365-day poem / essay / art dataset and the V3 reflection/completion system, while adding a darker visual identity, a separate Calendar tab, and favorite days.

## New in V4

- **Calendar tab** — separate top-level view of all 365 days, grouped by the five movements.
- **Calendar filters** — All Days, Favorites, Completed, and In Progress.
- **Favorite a day** — use the star control on a Day page when the poem / essay / art combination is worth keeping.
- **Favorites persist locally** using browser `localStorage`.
- **Calendar status states** show completed, in-progress, and favorite days distinctly.
- **Mahogany Night visual system** — darker mahogany surfaces combined with maroon, phthalo green, cream typography, and muted gold favorite accents.
- Existing Daily Reflection, Reset Day, completion tracking, and GitHub Pages deployment are retained.

## Local storage keys

- `365:completed-days`
- `365:started-days`
- `365:reflections`
- `365:favorite-days`
- `365:last-day`

Resetting an unfinished day removes that day's reflection/completion/in-progress state but **does not remove its favorite status**.

## URLs

- Home: `/?`
- Calendar: `/?view=calendar`
- Day: `/?day=42`

The query-string approach remains compatible with GitHub Pages.

## GitHub Pages update

Replace the current app files with this repository version and commit to `main`. The existing `Deploy 365 App to GitHub Pages` workflow will rebuild and deploy the site automatically.

---

## V5 visual finish

V5 establishes the final dark-academia visual language:
- Baskerville-first literary typography;
- sharp editorial surfaces;
- antique-gold favorites;
- subtle archival texture and rules;
- manuscript-inspired Calendar styling.

All user-state storage and the 365-day content schema remain backward compatible.
