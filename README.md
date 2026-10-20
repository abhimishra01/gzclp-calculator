# GZCLP calculator

Free browser tool for gzclpcalculator.com. A planner for the GZCLP program: T1 (5x3+, 6x2+, 10x1+), T2 (3x10, 3x8, 3x6) and T3 (3x15+) with the pass and fail rules, plates per side, a session log kept in localStorage, and a printable four-day cycle. No backend.

- `src/lib/gzclp.js`: all program rules (pure functions). Source: r/Fitness Wiki, "GZCLP" (thefitness.wiki/routines/gzclp/).
- `src/lib/plates.js`: plate math (plates per side for the four barbell lifts).
- `src/lib/store.js`: load, check, log and undo for the saved data (pure functions).
- `tests/gzclp.test.mjs`: tests for the rules, plates and saved data. Run `npm test`.
- Skin: Retro print (`src/styles/skin-retro.css`).

Commands: `npm run dev`, `npm test`, `npm run build`.

## GitHub Pages
`.github/workflows/pages.yml` builds on every push to `main` and publishes to https://abhimishra01.github.io/gzclp-calculator/. Locally: `PAGES_BASE=/gzclp-calculator/ npx astro build --outDir dist-pages`. Canonical links always point to the real domain, and Pages builds are noindex.

## Rule choices that are ours
- After a T1 fail at 10 × 1+ the source says to test a new 5RM and restart at 85 percent. Without a test the tool uses 85 percent of the failed weight.
- After a T2 fail at 3 × 6 the source says add 15 to 20 lb. The tool adds 15 lb (7.5 kg).
- T3 jump: 5 lb (2.5 kg) at 25 or more reps on the last set.
- Kilogram jumps (5 and 2.5 kg) are the pound jumps converted. The wiki gives pounds only. T2 restart adds 7.5 kg.
- The wiki gives no starting weights and no warm-up sets. The page text says so.
- The weight limit is 1500 lb or 700 kg.
