# 365 — A Daily Reflection · V3

V3 adds the personal ritual layer to the live 365-day poem / essay / art app while retaining the production dataset and GitHub Pages deployment.

## New in V3

- richer maroon + phthalo-green editorial design;
- redesigned home screen and five-movement visual strip;
- redesigned day hierarchy and media cards;
- private Daily Reflection on every day;
- reflections autosave to the current browser/device;
- opening a day marks it `In progress` until completed;
- `Reset this day` safely clears an unfinished day after confirmation;
- reset removes only that day's reflection, completion flag, and in-progress flag;
- completing a day still contributes to the 365-day progress count;
- artwork links remain the primary art experience; direct images remain optional.

## Local browser data

The app currently uses three localStorage records:

- `365:completed-days`
- `365:started-days`
- `365:reflections`

Nothing is sent to a server yet.

## Reset behavior

The app does **not** automatically erase an unfinished reflection when the user advances to a new day. That would risk losing writing.

Instead, unfinished days remain marked `In progress`. The user can return and press `Reset this day`, which asks for confirmation before deleting that day's saved reflection and state.

## GitHub Pages

The existing deployment workflow remains in `.github/workflows/deploy-pages.yml`.

Replace your current repository files with this V3 package and commit to `main`. GitHub Actions should rebuild and redeploy the site automatically.
