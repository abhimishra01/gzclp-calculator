# Code review, lens: maintainer (Kim)

Verdict: GOOD LIB, FRAGILE UI. The rules module is small, pure and tested. All state handling lives untested inside one 359 line component, and that is where the real bugs are. 1 must-fix, 6 should-fix, 3 nice.

Template leftovers (README, new-tool.sh, screenshots, build-date "Last updated", etc.): known, not repeated here. This site's README is already specific.

| Sev | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| must | src/components/Tool.astro:149, 241 | Saved log entries are not validated. `DAYS[e.prevDay].id` throws on a bad entry. Repro: set `log: [{date:'x'}]` in localStorage and reload. renderAll stops after the session renders, so the log never shows and `save()` never runs: nothing is saved again until the user clears site data. | One bad entry (older version, manual edit, quota cut) silently kills saving for good. | Validate each entry (prevDay 0..3, items array, before.slots) when loading and drop bad ones. Wrap renderLog in the same try/catch or filter. |
| should | src/components/Tool.astro:120-359 | About 240 lines of state, validation, undo, unit conversion and DOM code with `any` types in one `<script>`, and no test touches it. The undo-after-unit bug and the T2 base bug both sit here. | Next change will break something unseen. | Move load/validate/save, `logSession`, `undo`, `switchUnit` into `src/lib/store.js` as pure functions and test them (unit switch then undo, corrupt storage, stage edit then miss). |
| should | tests/gzclp.test.mjs | No test for: T1 floor (`Math.max(step...)`), T2 reset in kg (27.5 from 20), `convertState` lb direction and round trip, missing results default (pass, 15 reps), 5RM in kg, `plates.js` at all. | The copied plate code has no test in this repo. | Add 6 to 8 short tests; copy the plate tests from the barbell tool. |
| should | Tool.astro:142-144 | Loaded state is accepted with only `isNum` checks. Weights like 0.001 or non-step values pass; `s.prefs.plates` empty gives "Turn on a plate size" forever with no hint where. | Edge input from old storage. | Clamp weights to a sane range on load. |
| should | Tool.astro:182, 232 | Everything is built with `innerHTML` and template strings. Today all values come from our own constants or numbers, but `e.date` and `x.name` in the log come from localStorage. | Self-XSS only, but one future free-text field (notes) makes it real. | Escape in one helper or build with DOM nodes. |
| should | Tool.astro:106 and index.astro:48 | The print CSS depends on the DOM shape of the page that wraps the tool (`main > section:first-child > :not(#tool)`). That already broke printing (see regression report). | Fragile coupling between a component and its parent page. | Hide by class (`.no-print` on the wrapper) or print the week in its own iframe/window. |
| should | Tool.astro:277, 291 | The undo snapshot lacks `unit` (see regression). Log entries store `unit` but the undo path ignores it. | Same data model gap. | Put the whole `{unit, day, slots}` in the snapshot. |
| nice | Tool.astro:166-171 | `aria-live` regions (`.g-next`) are replaced on each render, so screen readers rarely announce them. | Weak announcement. | Keep one persistent status element. |
| nice | package.json | `wrangler` (large) is a dev dependency just for the deploy script. | Install weight. | Use `npx wrangler` on demand. |
| nice | Tool.astro:121 | `STEP` imported and never used. | Dead import. | Remove. |

Checked and fine: weights cannot go NaN (isNum guards); a non-number state falls back to defaults; huge numbers are capped; localStorage failures are caught (page still works); focus is restored after re-render; keyboard use works; no network calls.
