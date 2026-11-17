# Tournament Detail Pages Design

## Intent

Make the dinner and post-tournament games pages feel like part of the same November 22 event site as `index.html`, with consistent styling and useful navigation.

## Approaches

- **Reuse the index page's visual pattern on each detail page (chosen):** Keep separate dinner and game pages, each using the same event-card, header, event-details, and navigation style. This preserves the existing destinations without duplicating unrelated event content.
- **Keep the minimal pages and only add shared links:** Smaller changes, but leaves the requested content and style inconsistent with the landing page.

## Design and constraints

Update only `dinner.html` and `game.html` in this folder. Use the same visual design as the landing page, show the known event date, main event time, venue, and address, and include navigation to the landing, tournament, games, and dinner pages. Keep the existing dinner-after-tournament and games-schedule descriptions. Do not invent a dinner time, menu, or games schedule; make clear those details are not yet provided. Add no dependencies.

## Acceptance

Both pages have a consistent responsive event-card appearance and navigation, and do not claim details absent from the source content.
