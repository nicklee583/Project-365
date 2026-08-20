# 365 Project V2.2

Day 1: August 19, 2026.

## Fixes from V2.1
1. The Art Institute query in V2.1 used the wrong search parameter structure. V2.2 uses the documented `q=` full-text search plus `query[term][is_public_domain]=true` filter. The AIC docs also document the IIIF image URL pattern used here.
2. V2.2 uses a second source: The Metropolitan Museum of Art's Collection API. The Met API exposes `isPublicDomain`, `primaryImage`, and `objectURL`, so a matched public-domain work can be displayed directly and the source button can go to the canonical object record.
3. The app no longer sends the user to the old AIC collection search URL as its default. When a museum match is found, the button uses that object's canonical record.
4. If neither museum produces a verified image, the app shows a clear fallback instead of a broken image or blocked URL.

## Important
The runtime matching is intentionally conservative. It will not claim a museum match unless title/artist metadata and public-domain/image fields support it. The long-term V2.3 editorial pass should assign a specific museum/object ID to each of the 365 artworks for near-100% coverage.
