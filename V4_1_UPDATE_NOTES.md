# Project 365 — V4.1

## Calendar navigation fix

Two navigation issues were corrected:

1. The decorative circular pseudo-element in the Home card could overlap the top-right tab area. It now has `pointer-events: none` and sits below interactive content.
2. The Day screen previously hid the Daily / Calendar tab bar below 900px. The tab bar now becomes a full-width second navigation row on tablets and phones instead of disappearing.

Calendar should now be reachable from:
- Home
- Any Day screen
- Tablet/mobile layouts

## Phthalo green rebalance

Phthalo green now has a stronger role in:
- primary navigation;
- the Calendar active tab;
- primary CTA buttons;
- progress bars;
- completion controls;
- reflection surfaces;
- calendar header and filters;
- calendar day states;
- hover/focus feedback.

Mahogany remains the dark structural base, maroon remains a literary accent, and muted gold remains reserved for favorites.

## Deployment

No database or dataset migration is required. Existing local completion, reflection, started-day, and favorites storage keys are unchanged.

Replace the app source files and let the existing GitHub Pages workflow redeploy.
