# 365 Project V2.5 — Scrubbed

This version addresses the two recurring failures by fixing the underlying architecture rather than adding another fallback link.

## Essay fix
The previous versions called `window.open()` only after an asynchronous API request. Mobile Safari can block that as a popup. V2.5 opens a tab synchronously, then navigates it once the source is resolved.

Source order:
1. Wikisource — search the exact essay/author and open a direct page when found.
2. Internet Archive — open a real item when the API returns a matching identifier.
3. Otherwise show the archive search.

MediaWiki supports anonymous CORS with `origin=*`, so the Wikisource resolver is designed for a browser app.

## Art fix
The previous Commons resolver rejected many valid images because it required a score of 12 even when an exact artwork title scored only 10. It also did not use the Commons `Artist` metadata in matching.

V2.5:
1. Art Institute of Chicago public-domain image.
2. The Met public-domain image.
3. Wikimedia Commons API with `origin=*`, actual image URL, license metadata, and artist metadata.
4. Openverse openly licensed image API.

Openverse is specifically an index of openly licensed media and exposes the media URL, thumbnail, license, creator, and source/landing metadata. It is used only as a fallback and its documentation cautions that license information should still be verified for a particular work.

## Important final-product note
The current app still resolves images at runtime. The true final version should replace runtime fuzzy matching with a scrubbed 365-row art manifest containing one canonical object/image per day. That eliminates duplicates and external API dependence.
