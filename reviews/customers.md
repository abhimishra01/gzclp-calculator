# Mock-customer test (Kim)

Five US personas each used the live build (local preview) for a real task, with real typing and clicks in playwright-cli at the persona's viewport. They are simulated people; the problems below are real, reproduced in the page. Verdict: they would use it and bookmark it, once print, plates for machine lifts and the T2 reset are fixed. 3 must, 6 should, 4 nice.

## Stories

**Tyler, 22, college student, iPhone 390 px, 3 weeks into lifting.** Googled "gzclp calculator", clicked the first result because the title promised "next session". Saw sample weights and the note "set your own under Your program". Tapped the link, typed 95 for squat T1 and 65 for T2, went back up. Session showed 5 x 3+ at 95 lb, "Each side: 25", Next time 105 lb. Done in about 40 seconds, slower than he wanted because he scrolled a long way to find where to type. Confused: "Miss: fewer than that, fewer than what?" and "Lighter than the 45 lb bar" under Dumbbell row. Trust: yes, the pass and miss lines show what happens next. Would come back: yes, if the log stays. It did after a reload. Missing for a bookmark: what weights to start with for T2 and T3.

**Maria, 34, nurse, Android 412 px, 8 months into GZCLP, stalled on squat.** Set squat T1 to 215 and stage 3 (10 x 1+) in Your program, pressed Miss. The tool says 185 lb, 5 x 3+ (85 percent of 215 is 182.75, rounded to 5 lb), "test a new 5-rep max if you can". She likes that it follows the wiki. Then she set bench T2 to stage 3 at 120 lb and pressed Miss: "Next time: 80 lb, 3 x 10" and the same "test a new 5-rep max" text. She knows that is wrong (T2 does not test a 5RM and 80 lb is a 40 lb drop). She could not find where to enter her last 3 x 10 weight. Trust dropped sharply. Would come back: not until fixed.

**Dave, 41, software engineer, desktop 1280 px, powerlifter, uses kg.** Switched to kg: his 135 lb sample became 60 kg, which he expected to round. He logged a session, switched back to lb by mistake and then pressed Undo: the squat read 135 kg. He wrote the bug off as "data loss", then re-entered everything. He also wanted warm-up sets, microplate support (it has 1.25), and the source link. He printed the page for his gym binder: the print preview was blank. He would not bookmark it until print works. Trust in the rules: yes (he knows the wiki), but he found the FAQ line "standard jumps in the published program" for kg wrong.

**Priya, 29, teacher, Android 360 px in a busy gym, chalky thumbs.** Used the page standing at the rack. Big Pass and Miss buttons, 48 px minus and plus for T3 reps, and the sticky "Log this session" bar all worked with one thumb. Entered 27 on lat pulldown: "Next time: 75 lb". Logged, closed Chrome, came back the next day: the log and Day 2 were still there. She noted that the sticky bar hides the text behind it a little. She cleared the T3 reps box by accident and pressed Log: lat pulldown moved up as if she did 27 reps. Wants a "last time" line per lift. Would come back: yes, daily.

**Bob, 58, retired machinist, iPad 820 px, home gym with a 35 lb bar and no 1.25 plates.** Chose the 35 lb bar and switched off the 1.25 plate. For squat 135 lb he got "Each side: 45 + 5" (50 per side), correct. He liked the plate lines most. He asked why a dumbbell row shows plates and bar weight, and why Lat pulldown has plates at all. He tried to print for the garage wall and got a blank page. Wants a larger print with all four days. Would bookmark: yes once print works.

## Ranked change list

| Rank | Sev | Change | Personas |
|---|---|---|---|
| 1 | must | Fix print (blank page) and print all four days | 2 of 5 (Dave, Bob) plus spec |
| 2 | must | T2 reset: correct text and a field for the last 3 x 10 weight | 2 of 5 (Maria, and anyone starting mid-program) |
| 3 | must | Hide plates and bar text for lat pulldown and dumbbell row | 3 of 5 (Tyler, Bob, Priya noticed) |
| 4 | must | Undo after unit switch must not change weights | 1 of 5 (Dave), data loss |
| 5 | should | Make where to enter weights obvious on a phone (button at the top) | 2 of 5 (Tyler, Priya) |
| 6 | should | Use "Fail" or explain "Miss"; fix "fewer than that" | 2 of 5 |
| 7 | should | Empty T3 reps box must not silently log the old number | 1 of 5 |
| 8 | should | Opaque sticky Log bar | 1 of 5 |
| 9 | should | Starting weight guidance for T2 and T3, and warm-up sets | 3 of 5 |
| 10 | should | Fix FAQ claim about kg and T3 jumps | 1 of 5 |
| 11 | nice | "Last time" per lift and a longer log with export | 2 of 5 |
| 12 | nice | Custom bar weight | 1 of 5 |
| 13 | nice | Sample note stays until all weights are set | 1 of 5 |
| 14 | nice | Unit switch should warn about rounding | 1 of 5 |

Top 5: (1) print blank, (2) T2 reset text and base, (3) plates on machine lifts, (4) undo after unit switch, (5) find the weight inputs on a phone.
