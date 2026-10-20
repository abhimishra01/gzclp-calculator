# Code review, lens: minimalism (Kim)

Verdict: LEAN OVERALL. About 45 lines can go, mostly unused plate helpers copied from the barbell tool. 0 must-fix, 3 should-fix, 5 nice.

Known template leftovers: not repeated. Built JS is 15 KB, CSS 31 KB, whole site 228 KB. No leftover demo code, no unused dependency in `dependencies`.

| Sev | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/lib/plates.js:93-100, 102-108, 121-125 | `warmups`, `convertWeight`, `convertTarget`, `describe` are never imported anywhere on this site. | About 25 dead lines plus their STEP constant. | Delete. |
| should | src/lib/plates.js:14, 17-19 and gzclp.js:31, 36 | `STEP` and `fmt` exist twice (plates.js and gzclp.js); Tool.astro imports `fmt` from one and `STEP` from the other (unused). | Two sources of truth for the rounding step. | Keep one in gzclp.js; plates.js imports it or loses it. |
| should | plates.js:65, 93 | `collar` parameter and collar maths in `solve` are never used by this tool (no collar field). | Dead branch with its own variables. | Remove `collar`, `collarPair`. |
| nice | gzclp.js:66, 92-95 | `bumped` is never read. `base` is stored for T1 and T3 slots but only T2 reads it. | Three fields per slot where one tier needs the third. | Keep `base` for T2 slots only. |
| nice | gzclp.js:29, 115, 119 | 0.85 and 0.45359237 repeated. | One constant each. | Name them once. |
| nice | site.config.ts:18 | Comment lists four skins; only retro CSS exists and `data-skin` selectors are retro only. | Stale option. | Remove the choice, or keep and say retro only. |
| nice | public/icon-512.png | Marked `any maskable` in one entry. A maskable icon needs padding; this one is the plain logo. | Wrong purpose, may crop on Android. | Split into `any` and `maskable` entries or drop maskable. |
| nice | Tool.astro:63-100 | About 38 lines of global CSS in the component, partly duplicated by skin-retro.css overrides (borders, radius, background set twice). | Two places per control. | Move tool CSS to one file and let the skin set only tokens. |

Could the JS be smaller? Not by much. The 15 KB bundle includes full plate solver tables for all plates; dropping dead functions saves about 1 KB.
