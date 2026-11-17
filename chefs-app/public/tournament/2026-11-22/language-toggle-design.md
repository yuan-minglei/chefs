# Tournament Page Language Toggle Design

## Intent

Let visitors read the November 21 tournament page in either Chinese or English without maintaining two copies of the page.

## Approaches

- **In-page language toggle (chosen):** Keep one layout and switch all page copy between Chinese and English. This avoids duplicated markup and helps keep both languages consistent.
- **Separate English page:** Make a second page. This is straightforward, but requires duplicating and maintaining the page separately and does not provide the requested same-page toggle.

## Design and constraints

Add a visible English/中文 toggle on the existing page. Localize fixed headings, schedule and grouping content, as well as dynamic player summaries, labels, and team names. Keep the existing layout and player records unchanged; player-entered names remain as supplied. Make English the default and retain the Chinese toggle option. Limit changes to this `2026-11-21` folder and add no dependencies.

## Acceptance

Switching languages updates every user-facing label without reloading or changing the loaded player data. Both language states show the same player counts, rosters, and tournament details.
