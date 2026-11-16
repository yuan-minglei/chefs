# Tournament Page Language Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the English/中文 switch and make English the initial language for the November 21 tournament page.

**Architecture:** Keep one HTML page and introduce a small translation dictionary in `app.js`. Mark static page text for translation and render all dynamic player labels and statistics based on the selected language.

**Tech Stack:** HTML, CSS, browser JavaScript, existing Wrangler dev server and browser tools.

**Spec:** `language-toggle-design.md`

## Global Constraints

- Limit changes to this `2026-11-21` folder.
- Make English the default and retain Chinese as the selectable alternative.
- Keep the existing layout and player records unchanged; player-entered names remain as supplied.
- Add no dependencies.

## Review Focus

- A fresh page load must show English labels and retain the same player totals from real `data.json`.
- Switching to Chinese must show Chinese labels and preserve the player records and totals.
- Switching back to English must restore English text without duplicate content or changed totals.

---

### Task 1: Set English as the default language

**Files:**
- Modify: `app.js`
- Modify: `language-toggle-design.md`
- Modify: `language-toggle-plan.md`
- Test: Browser assertions using the local Wrangler dev server

**Interfaces:**
- Consumes: Existing `tournament.players` and existing page layout.
- Produces: English content on a fresh page load, with the existing toggle still switching to Chinese and back.

- [x] **Step 1: Verify the current default in the browser**

Reload the page and assert that the current default is Chinese (`document.documentElement.lang === "zh-CN"`) and that the English/中文 control exists.

- [x] **Step 2: Change the initial language**

In `app.js`, initialize the existing language state to English. Keep the existing language-toggle behavior and all translations unchanged.

- [x] **Step 3: Verify the new default and Chinese toggle**

Use the browser with real `data.json` to assert that a fresh load displays English document language, title, labels, team counts (13/12/12), and 37 total players. Switch to Chinese and verify translated labels with unchanged names/counts; switch back to verify English returns.

- [x] **Step 4: Verify JavaScript syntax**

Run from the app directory: `node --check public\\tournament\\2026-11-21\\app.js`

Expected: exit code 0 with no syntax errors.
