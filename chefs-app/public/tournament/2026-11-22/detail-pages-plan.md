# Tournament Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the dinner and games pages in line with the November 22 landing page’s content style and visual design.

**Architecture:** Keep `dinner.html` and `game.html` as separate destinations, each using the landing page’s inline event-card design, shared event details, and navigation. State only known dinner/game information and do not invent missing logistics.

**Tech Stack:** Static HTML and inline CSS; browser verification.

**Spec:** `detail-pages-design.md`

## Global Constraints

- Update only `dinner.html` and `game.html` in this folder.
- Use only event details already present in `index.html`, `dinner.html`, and `game.html`.
- Do not invent a dinner time, menu, or games schedule.
- Add no dependencies.

## Review Focus

- Detail pages retain their distinct dinner and game purpose; verify each has page-specific heading and copy.
- Shared event date, main event time, venue, and address match `index.html`; compare rendered page text.
- All four page links work and point to sibling files; inspect destinations in browser.

---

### Task 1: Align dinner and games pages with the landing page

**Files:**
- Modify: `dinner.html`
- Modify: `game.html`
- Reference: `index.html`
- Test: Browser assertions using the local Wrangler dev server

**Interfaces:**
- Consumes: Event title, date/time, venue/address, design, and navigation destinations from `index.html`.
- Produces: Two standalone detail pages with the shared event shell and their existing page-specific information.

- [ ] **Step 1: Verify the current pages are inconsistent**

Open `dinner.html` and `game.html` and verify their minimal layout and content differ from `index.html`’s event-card design and shared details.

- [ ] **Step 2: Update `dinner.html`**

Use the landing page’s inline visual style and event-card structure. Include the known event date (Sunday, November 22, 2026), main event time (2:00 PM–5:00 PM), venue, and address. Preserve that dinner is after the tournament, but state that dinner timing/details have not been provided. Add links to the landing, tournament, game, and dinner pages.

- [ ] **Step 3: Update `game.html`**

Use the same visual style and shared event details. Preserve the post-tournament games purpose, but state that the games schedule has not been provided. Add links to the landing, tournament, game, and dinner pages.

- [ ] **Step 4: Verify both pages in the browser**

Assert both pages render the shared event-card style and matching event details, retain their correct headings/purpose, disclose unspecified details rather than inventing them, and have navigation links to all four valid sibling pages.
