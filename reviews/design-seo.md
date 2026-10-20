# Design and SEO review (Kim)

Scores (Google Chrome headless, local `serve`, no CDN): mobile Performance 100, Accessibility 100, Best practices 100, SEO 100. Desktop 99, 100, 100, 100. Mobile LCP 1.1 s, TBT 10 ms, CLS 0.005; desktop CLS 0.063 (set-up panel is built by JS after load, below the 0.1 limit). The only failed audits are cache lifetime and render-blocking CSS; the `serve` test server does not apply `_headers`, so the cache item is a test artifact.

Verdict: strong. The Retro print skin is clean and consistent, contrast is high, targets are 44 px or more, and the layout works at 390 px. Print is broken (blank) and the plate lines for lat pulldown and dumbbell row are wrong. 1 must-fix, 7 should-fix, 5 nice.

Viewed at 1280 and 390, light and dark. Colour checks (computed): muted text on card 7.2:1, on paper 6.3:1; white on brand 5.9:1; brand ink on card 5.4:1; input and button edges use the ink colour (the edge-contrast fix is in). Focus ring 3 px. Radios and checkboxes are real inputs with visible focus on their faces.

SEO facts: title "GZCLP Calculator: Weights, Stages & Next Session" (48 chars); description 136 chars; one H1 equal to the keyword; H2s: Today's session, Session log, Your program, then the article outline (what is, three tiers, four workouts, how to use, worked example, what happens when you fail, common weight jumps, why use this one, FAQ). JSON-LD parses: WebApplication, BreadcrumbList, FAQPage (8 questions, match the page). Canonical, OG and Twitter tags present; og.png is 1200x630 and on brand; favicon svg, 32 px, 180 px and manifest present. Article is 695 words. Sitemap has 5 URLs, robots.txt points to it.

Better than the competitors in the research? Research found no dedicated English GZCLP calculator, only a German trainer page and apps. Against apps and spreadsheets, this page wins on speed, no sign-up, plates, print. It loses on warm-up sets, a long history and an export.

| Sev | Area | Finding | Fix |
|---|---|---|---|
| must | Print | Print shows a blank page (print CSS hides the wrapper of the tool). See regression report. | Fix the selector; check with print emulation and a PDF. |
| should | Tool | Plates per side is shown for Lat pulldown and Dumbbell row ("Each side: 10 + 2.5", "Lighter than the 45 lb bar" on Day 2 and 4 by default, also in print). | Show plates only for the four barbell lifts. |
| should | Forms | Invalid weight: border stays normal (retro rule overrides the red) and there is no message. `aria-invalid` only. | Fix specificity; add short text "Enter a weight above 0". |
| should | Mobile | The sticky Log bar uses a 94 percent translucent fill; text shows through its edge ("Next time..." behind the button). | Use an opaque fill. |
| should | Mobile | Your program sits below three session cards and the log. A new user must scroll about 2.5 screens to enter weights; only a small link in the sample note points there. | Add a visible "Set my weights" button near the top, or open Your program first on first visit. |
| should | SEO content | The article names the r/Fitness Wiki and Cody LeFever but has no link to the source. No outbound citation for a rules page. | Link thefitness.wiki/routines/gzclp/ with a Sources line. |
| should | SEO content | Missing sections for common searches: starting weights, warm-up sets, "what is AMRAP", 3 days a week schedule, "GZCLP reset". Config keywords "workout tracker", "weights", "reset" are barely used. | Add 150 to 250 words on starting weights and warm-ups, and use the reset phrase in a heading. |
| should | Print | Print is "next 3 sessions"; the spec says a week; a cycle is 4 sessions. | Print 4 days. |
| nice | Layout shift | Desktop CLS 0.063 from JS-built panels. | Reserve height for Your program (about 70 rem). |
| nice | Type | Retro slab headings fall back to Georgia on Android (known in the design study). | Accept, or self-host Roboto Slab for headings. |
| nice | Header | On 390 px the name wraps to two lines. | Hide " Calculator" under 420 px or reduce padding. |
| nice | Footer | Footer links have about 36 px height. | py-3. |
| nice | JSON-LD | WebApplication has no `author` or `dateModified`. | Optional. |
