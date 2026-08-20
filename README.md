# 365 Project V2.1

Day 1 is August 19, 2026.

## What's new
- Poetry button opens an official Poetry Foundation search for the exact poem + poet.
- Essays use the curated reading URL from the curriculum (Project Gutenberg where available).
- Art now attempts a live lookup against the Art Institute of Chicago public API, restricted to public-domain works.
- When an AIC public-domain match has an image_id, the app builds the museum's IIIF image URL and displays the artwork directly in the app.
- If no verified open-access image is found, the app provides a museum-record fallback instead of inventing an image URL.
- Completion tracking, reflections, shared calendar, and automatic date rotation remain intact.

The Art Institute documents its public API and IIIF image service and recommends filtering to public-domain works for reuse.
