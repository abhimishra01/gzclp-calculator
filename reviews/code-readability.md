# Code review, lens: readability (Kim)

Verdict: READABLE. Names are clear, `gzclp.js` is easy to follow and well commented, and no placeholder text is left on the site. A few stale or mixed terms. 0 must-fix, 4 should-fix, 5 nice.

Known template leftovers: not repeated. Site text scan: no placeholder, lorem or TODO text in About, Contact, Privacy, Terms, 404, FAQ or the article; no British spelling, em dashes, vendor or AI mentions in src, README or headers.

| Sev | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/components/Tool.astro:60-65 (UI) | "Miss / fewer than that" is vague. "That" points to the line above in Pass. The source says "fail". The page mixes "miss" (tool), "fail" (article headings, FAQ) and "reset". | A newcomer will not know that Miss and fail are the same thing. | Use "Pass" and "Fail" in the tool, or say once "Miss (fail)". Use one word in the article. |
| should | Tool.astro:174 | The reset hint says "test a new 5-rep max" for T2 too. | Wrong text, see regression. | Per tier text. |
| should | Article.astro, faq.ts vs Tool.astro | Notation differs: tool shows "5 × 3+", article and FAQ show "5x3+" in some places and "5 × 3+" in tables. | Search users type 5x3; the page should be consistent. | Pick "5 × 3+" everywhere (keep "5x3+" once as a search variant). |
| should | site.config.ts:18, README.md | Config says skins "minimal, swiss, clay or retro" but only retro exists. README says plate math is "copied from the barbell plate calculator" while plates.js still has `warmups`, `describe`, `collar` from that tool. | A reader hunts for code paths that are dead. | See minimalism. |
| nice | gzclp.js:60 | `progress` returns `{weight, stage, base, reset}` and the comment says "plus a flag when the cycle reset" but the T3 branch also returns `bumped`. | Comment and shape differ. | Update the comment. |
| nice | gzclp.js:93 | `base` is never explained. A new reader cannot tell it means "last Stage 1 weight (T2)". | Core to the T2 reset rule. | Rename `stage1Weight` and comment. |
| nice | Tool.astro:124-130 | `state: any`, `log: any[]`, 12 more `any`. | Types would have shown the missing `unit` in the undo snapshot. | Add a `State` type. |
| nice | Tool.astro:215, 297 | `lifts`, `dayLine`, `rows` are one-line helpers with dense inline template strings (lines up to 600 characters). | Hard to diff. | Break the long template literals over lines. |
| nice | README.md | The README is accurate for commands and Pages. It does not list the kg jump choice or the "5 lb T3" choice under "Rule choices that are ours". | Incomplete. | Add both. |
