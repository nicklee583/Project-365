# 365 Project V2.4

## Fixes
- Essays now resolve an actual Internet Archive item through its Advanced Search API and open the item record. If the API cannot resolve one, the app falls back to the Internet Archive search page.
- Artwork matching is stricter. The app will not display a merely related AIC/Met result unless the title/artist score is strong.
- Wikimedia Commons is now a true image fallback: the app calls the Commons API directly, checks the image metadata/license for public/open licensing, and displays the returned thumbnail URL inside the app. This fixes the prior behavior where the Commons search page worked but no image appeared in the app.
- Museum image sources remain preferred because AIC documents CORS-enabled IIIF image delivery and public-domain filtering; The Met provides public-domain `primaryImage` URLs through its Collection API.
- The app still has a source-page fallback if no verified image can be loaded.

## Note on duplicates
The current runtime matching prevents bad fuzzy matches from causing the same unrelated image to appear on many days. The underlying 365 art list still contains some works with generic titles such as "Self-Portrait"; the final editorial pass should assign a canonical museum object ID to every day to guarantee one unique work per day.
