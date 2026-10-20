# Fix summary (Bruce, 2026-10-20)

## Fixed (must)
- Print was blank: the print rule hid the tool wrapper. Wrapper now has `.tool-wrap` and is kept. Checked with print emulation (4 tables visible).
- Undo after a unit switch: the log snapshot now stores `unit`, and undo restores unit, day and weights (`src/lib/store.js`, tested).
- T2 reset hint: tier-specific text (`resetHint`). T2 restarts 3 × 10 at last 3 × 10 weight plus 15 lb (7.5 kg).
- T2 base: a "Base" field (last 3 × 10 weight) shows when T2 stage is 2 or 3. A base above the weight is ignored by the rules. Tests added.
- Corrupt log entry killed saving: entries are validated on load and bad ones dropped (`entryOk`). Test with `log: [{date:'x'}]`.
- Plates for Lat pulldown and Dumbbell row removed (screen and print).

## Fixed (should and cheap nice)
- Log logic moved to `src/lib/store.js` (load, validate, log, undo) with 12 new tests. Total 37 tests, all pass. Plate tests added.
- Weights clamped on load and input: 1 to 1500 lb or 700 kg. Invalid weight shows a red border and a message.
- "Miss" renamed "Fail" everywhere; "fewer than that" replaced.
- Empty T3 reps box resets to the number in use on blur; Log needs a valid number.
- Deep copy of undo snapshot. Opaque sticky Log bar. HTML-escape of log text.
- Print is the four-day cycle, "weights as of today".
- "Set my weights" button in the sample note near the top.
- Notation unified to "5 × 3+" (one "5x3+" search variant kept in the FAQ).
- Honest copy: kg jumps and the T3 +5 lb are ours; source link added; new section on starting weights and warm-ups (marked as not from the wiki); "GZCLP reset" heading.
- Dead code removed: warmups, convertWeight, convertTarget, describe, collar, duplicate STEP and fmt, `bumped`. Constants `LB_PER_KG` and `T1_RESET` reused. Manifest icon is `any` only. Header hides " Calculator" under 420 px. Footer links taller. README and site.config comments fixed.
- Unit switch note about rounding.

## Template items
Already in place and verified: specific README, US spelling, fixed Last updated (October 20, 2026), no new-tool.sh, screenshots/ and .playwright-cli/ ignored and untracked, deploy runs npm test first, privacy cookie wording, Tailwind `source(none)` plus `@source "../"`, Pages workflow, noindex on Pages builds, canonical on the real domain, no duplicate link block on home.
Sizes: dist 228 KB before, 236 KB after (added article text, store logic, new UI).
GitHub Pages: built with PAGES_BASE=/gzclp-calculator/, served under that path; home, About, Privacy, icons and manifest all returned 200. dist-pages deleted.

## Rejected or deferred
- Persistent aria-live element, `State` type instead of `any`, moving tool CSS into one file, wrangler as an optional dependency, desktop CLS 0.063 (below the 0.1 limit), Roboto Slab self-hosting, JSON-LD author: nice items, left for later.
- Warm-up set tracking, "last time" per lift, export, custom bar: would grow the tool; not done.
- Typed-then-blank T3 box with Log press: blur resets the box to the number in use, so the logged value matches what is shown.

## Status
npm test: 37 pass. npm run build: ok. Screenshots at 1280 and 390, light and dark, are in screenshots/ (ignored by git). Lighthouse not rerun; the previous run scored 99 to 100 and changes are small. 

## Phase 2 SEO pages (not built)
1. GZCLP spreadsheet alternative
2. GZCLP starting weights
3. GZCLP warm-up sets
4. GZCLP T1 reset
5. GZCLP T2 reset
6. GZCLP 3 day schedule
7. GZCLP vs Starting Strength
8. GZCLP vs 5/3/1
9. GZCLP in kg
10. GZCLP for women
11. GZCLP for beginners
12. What is AMRAP
13. GZCLP bench press progression
14. GZCLP squat progression
15. GZCLP deadlift progression
16. GZCLP overhead press progression
17. GZCLP printable template
18. GZCLP plate calculator
19. GZCLP T3 exercises
20. GZCLP 5 rep max test

## For the owner
Nothing blocking. Barney pushes.
