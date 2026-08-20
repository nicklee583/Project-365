# 365 Project V2.3

## Changes
### Essays
Project Gutenberg is no longer the primary button. The app now sends the reader to an Internet Archive search for the exact essay/author, with a general web-search fallback. Gutenberg remains only as a legacy field in the data.

Project Gutenberg is a strong archive for public-domain books, but it is not always the best direct destination for a particular essay. Its own site describes advanced/title/author search and its essay subject catalog, so it remains useful as a secondary archive rather than the sole source.

### Art
Artwork retrieval now has a broader strategy:
1. Art Institute of Chicago public-domain API + IIIF image.
2. Metropolitan Museum of Art public-domain API + primary image.
3. Wikimedia Commons open-image search as the fallback when a museum image isn't found.
4. Internet Archive / Europeana are retained as additional source paths in the data.

The app never claims an arbitrary web image is public domain. It only directly displays museum images when the museum API identifies them as public domain. For other sources it provides a source/search link.

### Repetition
The artwork curriculum remains one entry per day. Runtime source selection is designed to avoid treating a generic image-search result as a definitive artwork match. The next editorial pass should assign a canonical object ID to each day to guarantee zero repeats across the 365-day set.
