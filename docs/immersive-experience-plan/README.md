# Immersive Visual Experience Plan

Pack ID: BESS-IX-2026-10-30  
Version: 1.2.1, 31 October 2026: synced with the WA scenes as built in `WP-07` (v1.2 is the script signed off at `G-1`; v1.1 is commit `3f1101f`, v1.0 is `db158b9`)  
Prepared: 30 October 2026, Australia/Perth  
Repository baseline: `6ce1e035cace6e676167f904d511a3425a5be12d`, including PRs #72/#73 and the first Finland reserve snapshots  
Delivery scope: English Markdown planning documents; no application, data, model or CI changes

## 1. Product direction

Explain, market by market, why the platform's investment call is what it is. Each story opens with the market's published call and play. It then takes about five minutes to show the grid's history, today's tension, what a battery does there and who pays for it. The reader is mainly the user, reading markets they know less well, and the copy stays plain enough for any investment-literate newcomer.

One causal chain runs through every market:

**Geography and historical choices -> today's tension -> what a battery does, and its limits -> who pays, on what conditions -> the call and the play.**

The six chapters remain **Origins, Historical choices, Today's tensions, Add a battery, Who pays, and The investment**. The last chapter is now a short bridge: what could weaken the value, then links into the market page's Bankable case, Revenue, Execution and Downside sections. The story does not rebuild those sections.

Keep the off-white and deep-green research identity. Scenes are fixed-view isometric SVG, drawn from one shared symbol kit on the existing D3/SVG stack. Day and night change through colour tokens, and the station cutaway is a set of exploded layers. Each market gets one signature chart: the single picture that explains its call. All other figures stay in the market page's existing 2D charts.

| Reader time | Outcome |
| --- | --- |
| 30 seconds | Know the call, the play and the main reason behind it |
| 3 minutes | Explain the historical choice and today's tension that create the opportunity |
| 5 minutes | Explain what the battery does here, who pays, and why the play has its duration and entry route |
| Then | Continue into the market page's investment sections, or open a claim's source |

Comprehension check: after reading the story, the user can say why the play is what it is without opening the research tabs. For WA that means an eight-hour capacity battery, seven hours for the rule and one for the fade, bought behind a sponsor; for Germany, a four-hour toll; for Finland, two hours with a negotiated floor.

## 2. Reading order and document ownership

The plan is split because evidence, scripts, page design, code work and migration change at different speeds. This index owns scope, priorities, decisions and the revision record. The companion files own execution detail.

| Order | Document | Owns |
| --- | --- | --- |
| 1 | [This master plan](README.md) | Objective, scope, sequencing, decisions, revisions |
| 2 | [Market narratives](market-narratives.md) | 18 story cards anchored to calls; WA, Germany and Finland theses and briefs |
| 3 | [Western Australia storyboard](western-australia-storyboard.md) | Shots `wa-00` to `wa-14` (`wa-12` and `wa-13` retired) |
| 4 | [Evidence and content specification](evidence-and-content-specification.md) | Internal status vocabulary, the reader-facing marker, templates, content contract |
| 5 | [Experience and page design](experience-and-page-design.md) | Entry from the market page, layouts, isometric visual system, components |
| 6 | [Engineering work packages](engineering-work-packages.md) | Repository integration, symbol kit, story URLs, budgets, deferred WebGL option |
| 7 | [Preparation, migration and acceptance](preparation-migration-and-acceptance.md) | Sequence, three gates, self-review, laptop handoff checklist |
| Ref | [Source register](source-register.md) | Repository and official sources; verified and candidate claims |

Stable identifiers: `SRC-*` external sources, `REPO-*` repository evidence, `CL-*` claims, `GAP-*` evidence gaps, `wa-00` to `wa-14` shots (`wa-12` and `wa-13` retired and not reused), `WP-*` work packages (`WP-05` retired, `WP-08` folded into `WP-06`) and `G-1` to `G-3` gates, which replace v1.0's `G-0` to `G-7`. Chapter IDs are `origins`, `choices`, `tensions`, `battery`, `payment` and `investment`.

Keep one owner per specification. When something changes, update its owner and every reference in the same revision, and record the change below.

### Revision record

| Version | Date | Change | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-10-30 | Expanded and translated the original Chinese plan; verification through #73 | Committed as `db158b9`; superseded |
| 1.1 | 2026-10-30 | Review against the platform's calls, the three-page market page and the 16 October rulings; decisions D1 to D10 | Merged in PR #74 |
| 1.2 | 2026-10-30 | WA hinge claims sourced from AEMO, the ERA, Energy Policy WA, the ESM Rules and the AEMC; the WA script revised for the published eight-hour play, with markers and Chinese drafts; decisions D11 and D12 | Script signed off by the user at `G-1` on 30 Oct 2026 |
| 1.2.1 | 2026-10-31 | Synced with the `WP-07` build: the SWIS extent (SRC-WA-16) and coastline (SRC-NE-01) sources; the `wa-01` map redrawn from them (ASSET-SWIS-BOUNDARY); scene words owned by each shot's `labels` in the content file; page text the build changed: a `wa-01` caption, `wa-08` without its charge controls, `wa-10` with three terms and its route steps | Page-text changes go to the user at `G-2` |
| 1.3 | 2026-10-31 | Story-card check: the 14 cards v1.1 did not rebuild now lead to the infrastructure-fund call and play published in the view store at `bd62af1`; Italy and Poland fork between their two plays; Japan shares one national layer; Ontario, Saudi Arabia and Spain follow their comparison theses because no view is published; candidate claims CL-GB-01 to CL-ES-01 added, unverified | Markdown only; the user signs off by merging |

| ID | v1.1 decision | Affects | Basis | Impact |
| --- | --- | --- | --- | --- |
| D1 | Every story argues for the market's published call and opens with its play card | `wa-00` (new); narratives §1 to §3 | 16 Oct guided-experience ruling | Conclusion first; story text must agree with the briefing |
| D2 | WA, Germany and Finland rebuilt on the briefing theses | `wa-01`, `wa-03`, `wa-04`, `wa-06`, `wa-08`, `wa-10`, `wa-14`; narratives §3, §5, §6 | Review: v1.0 never referred to a call or play | WA becomes capacity-led seven hours; Germany merchant versus toll; Finland an oversupplied reserve market |
| D3 | The story stops where the market page's investment sections begin | `wa-12`, `wa-13` and `WP-05` retired | Review: those shots duplicated Bankable case, Revenue and Execution | No second financial view to reconcile |
| D4 | Readers see one Strong, Fair or Thin marker plus "what would change it" | Evidence specification §1; every shot | 16 Oct no-disclaimers ruling | Status dimensions and boundaries stay in authoring records |
| D5 | Isometric SVG; WebGL deferred to an optional experiment | `WP-06` to `WP-08`, `WP-11`; page design §4 and §5 | User, 30 Oct | No Three.js, GPU lifecycle or asset-licence work in the pilot |
| D6 | One signature chart per market | Narratives §4 to §6; `wa-06`; `WP-06` | Review | Each call gets one data-backed picture |
| D7 | The story opens from the market page's research button; home unchanged | Page design §1 and §2; `WP-03` | 26 Oct three-page design; home budget | No new bytes on the home page |
| D8 | The reader is mainly the user | Acceptance §5 | User, 30 Oct | Recruited tests replaced by self-review |
| D9 | Three gates | Acceptance §3 | Review | Replaces `G-0` to `G-7` |
| D10 | Concrete laptop handoff checklist | Acceptance §6 | Workstation check, 30 Oct | Lists the items that exist only on the current machine |
| D11 | The WA story argues for the published play, `wa-cap-8h`, not v1.1's seven hours | WA storyboard; narratives §3; acceptance §5; source register CF-WA-01 | D1, and the analyst's play change of 17 Oct (commit `df36abb`) | wa-06, wa-08 and wa-14 explain eight hours as the seven-hour rule plus an hour that holds the credit as the battery fades |
| D12 | The day trace is the median business day of the 2025-26 Hot Season, from AEMO's unscheduled operational demand and rooftop PV (CALC-WA-DAY) | wa-05, wa-06; source register; evidence specification gap queue | GAP-WA-DAY; AEMO's copyright permissions | Signed off at `G-1`, 30 Oct; a fixed-vintage profile refreshed after each Hot Season, not a live feed |

## 3. What was verified

**v1.0.** Local and remote `main` matched `6ce1e035cace6e676167f904d511a3425a5be12d` at about 14:45 AWST, after #72, #73 and the first Finland reserve snapshots. The stack is native ES modules, Vite and D3/SVG, with no React or Three.js. The registry holds 18 allocation markets. Seven Finland reserve-price snapshots exist; they are stored price observations, not a capture strategy. Official sources were checked for a small set of pilot foundations. Details are in [the engineering baseline](engineering-work-packages.md#1-verified-repository-baseline) and [the source register](source-register.md#repository-verification).

**v1.1.** The pack was read against the briefing theses (REPO-12), the market page and its research dialog (REPO-13), the home budget measured at PR #69 (REPO-14), the dataset catalogue (REPO-10) and this workstation's local-only state ([handoff checklist](preparation-migration-and-acceptance.md#6-laptop-handoff-checklist)). Across eight files, v1.0 never referred to a market's call or play, the three-page market page or the Bankable case. Its WA, Germany and Finland stories did not lead to their published plays. v1.0 was committed unchanged before this revision; no application code, data or model changed.

**v1.2.** The four WA hinge items were checked against primary sources on 30 October 2026, from `main` at `1fbdff5`: the 2026 WEM ESOO, the ESM Rules consolidated to 1 October 2026, the 2014 Electricity Market Review options paper, AEMO's, the ERA's and Energy Policy WA's WEM pages, AEMO's WEM data and copyright permissions, and the AEMC's NEM page and 2026 reliability review. Details and locators are in [the source register](source-register.md#western-australia). The check found that the published WA play has been eight hours since 17 October (CF-WA-01), that one window in AEMO's Table 28 is printed an interval early (CF-WA-02), and that AEMO assigned the 2028-29 Capacity Credits on 20 October, which the play's next action waits for (CF-WA-03). Only Markdown in this folder changed.

## 4. Priorities and release shape

| Sequence | Scope | Exit |
| --- | --- | --- |
| Preparation | WA script anchored to the call; its hinge claims sourced; DE and FI briefs; all 18 cards checked against their theses | `G-1` for WA |
| WA pilot | Six chapters in isometric SVG with the signature chart, opened from the market page | `G-2` |
| Reuse | Germany, then Finland: different arguments on the same kit | `G-1` and `G-2` per market |
| Mechanism | Italy: the fork between its two published plays (capacity market and MACSE) | `G-1` and `G-2` |
| Expansion | Remaining markets in batches of three or four, sized by the measured WA effort | Per market |
| Optional | WebGL for one shot that SVG cannot explain | `G-3` |

Narrative order is not an investment ranking. A market with a withheld return can still have a story; Saudi Arabia keeps its card.

The v1.0 estimate of four to six weeks for a WA pilot assumed a team that included 3D production. It no longer applies. Re-estimate after the WA story ships, and record the actual time per market to size later batches.

## 5. Decisions and open items

| Topic | Working decision | Status |
| --- | --- | --- |
| Audience | Mainly the user, reading markets they know less well; plain enough for an investment-literate newcomer | Confirmed 30 Oct |
| Story anchor | Each story argues for the published call and play | Follows the 16 Oct ruling |
| Causal chain | Six shared chapters with local histories, ending at the call | Confirmed in v1.0; ending revised |
| Visual identity | Off-white and deep green; isometric SVG scenes; one signature chart per market; finance in existing charts | Confirmed 30 Oct |
| Market sequence | WA, then Germany and Finland, then Italy | Confirmed in v1.0; stories revised |
| Language | English and Simplified Chinese on the site; this pack in English | Confirmed |
| Framework | Native ES modules, Vite, D3/SVG; no new rendering dependency in the pilot | Confirmed 30 Oct |
| Entry | The market page's "Grid, history and full research context" button | Follows the 26 Oct three-page design |
| Uncertainty on the page | One Strong, Fair or Thin marker plus "what would change it" | Follows the 16 Oct ruling |
| Preview | Local built-public preview; never share the dev server | Proposed |
| Runtime | Pin one Node LTS for local, CI and ETL; CI still uses Node 20, which is past end of life | Proposed; independent small change |
| New computer | Nothing in the pilot depends on it; see the handoff checklist | Open: record the hardware at handoff |
| Model changes | Separate work, separate evidence, separate sign-off | Scope boundary |

Ask the user again only when a finding changes the audience, scope, public boundary, spending or visual direction.

## 6. Rules

1. Draw observed history, official plans, scenarios and teaching examples differently: scenarios dashed, examples tagged "Example", observations solid. A moving arrow is not a solved power flow.
2. Keep a physical need, a participation mechanism, the model's assumed route, an awarded contract and verified cash flow apart in authoring records. On the page, the evidence marker and plain wording carry the distinction.
3. Show one battery's power, energy and limits before stacking revenue. The teaching battery uses the play's duration.
4. Never type a figure into story copy. Calls, durations and shares come through `‹bound›` fields that the existing play card and market sections already read.
5. Teaching controls never change the investment case. The story has no underwriting controls; the market page owns the handoff to the Investment Lab.
6. Keep energisation, commercial operation, qualification and first settlement distinct in the copy. The market page's Execution section shows the timing.
7. Wherever the story mentions secured revenue, name its tenor and what follows it.
8. Everything shipped to the browser is public. Check every project name against `local-data/markers.json` before writing it anywhere, including commit messages, PR bodies and branch names, which no guard scans.
9. Preserve model verification. Never regenerate a fixture to hide a numeric change.
10. Uncertainty reaches the reader as one marker and one "what would change it" line, never as caveat paragraphs.
11. When the briefing changes a market's call, play or thesis, that market's story is due for review.

## 7. Scope of this pack

This pack plans; it does not implement, publish, or change data, models, CI or dependencies. The pilot excludes WebGL (deferred under D5), free camera movement, VR, digital twins, power-flow calculation, live dispatch, photorealistic assets, narration, automatic recommendations, a second financial view inside the story and new home-page content.

Main risks and their controls:

- Story text drifting from the briefing after a re-grade: rule 11 and the `reviewedAgainst` field in the content contract.
- Drawings implying geographic or engineering precision: generic symbols, labelled boundaries, dashed scenarios.
- Chinese and English drifting apart: both languages reviewed at each sign-off.
- A polished scene hiding a weak argument: the script is signed off before anything is drawn.

The controls sit in the [work packages](engineering-work-packages.md) and the [gates](preparation-migration-and-acceptance.md#3-gates).

## 8. Preservation of the original plan

This pack expands the original Chinese plan of 30 October 2026, which stays unchanged in the external archive outside this repository. Its SHA-256 when read was `A3325111528004DF6C915DFA58078D5B4646B008AF4E460B5E3390A1FCF88EF7`.

| Original section | Where it lives now |
| --- | --- |
| 1. Direction and user outcomes | Sections 1, 4 and 6 |
| 2. Existing foundation | Engineering baseline; source register |
| 3. Architecture and access paths | Page design §1 and §2; `WP-03` and `WP-04` |
| 4. Art direction, desktop and mobile | Page design §3 and §4 (isometric SVG in v1.1) |
| 5. Six shared chapters | Narratives §1; WA storyboard |
| 6. Market differences | Narratives §3 and §5 to §7 |
| 7. Interaction priorities and 3D/2D division | Page design §5; WA shots; `WP-11` for WebGL |
| 8. Asset, service, payment and cash-flow explanation | Shots `wa-08` to `wa-11`; investment detail stays on the market page |
| 9. Evidence, content and current case | Evidence specification; `WP-02` |
| 10. Incremental implementation, lifecycle, performance | Engineering §2 to §5 |
| 11. Phases, resourcing and scope | Sections 4 to 7; acceptance §4 |
| 12. Understanding, visual and numeric acceptance | Acceptance §3 and §5 |
| 13. Risks | Section 7; package risks |
| 14. Startup checklist and repository references | Acceptance §6; source register |

Start the next session from this index, `git status` and the next unmet gate. Recheck the source commit and data vintages first.

## 9. Documentation checks

v1.1 checks, 30 October 2026:

- All eight files carry version 1.1.
- All 92 local links and anchors resolve.
- Each of the 13 active shots has all eleven fields.
- The 18 card IDs match the market sources.
- No retired gate, field name or anchor remains outside a retirement note.
- A scan against `local-data/markers.json` found no confidential markers.

The pack shrank from about 181 KiB to about 141 KiB. No application tests, build or deployment were run, because nothing outside this folder changed.

v1.2 checks, 30 October 2026:

- All eight files carry version 1.2.
- All 98 local links and anchors resolve.
- Each of the 13 active shots has its specification rows (scene, feedback, evidence and chart, authoring check, mobile, status) and its page-text rows (question, copy, meaning, marker, controls) in English and Simplified Chinese. `wa-00` has no meaning line, because it is the conclusion.
- Page text carries no figure outside a ‹bound› token except dates, source table numbers and values tagged Example.
- A scan against `local-data/markers.json` found no confidential markers.

The pack grew to about 179 KiB, mostly the Chinese drafts and the source records. Only Markdown in this folder changed, so no application tests, build or deployment were run.

### Four investor perspectives

The home briefing presents four comparable investor cards before the lead opportunity. Audience and typical entry stages are projected from `ARCHETYPES`; the current lead uses the same `featuredOpportunity(opportunities(lens), lens)` selection as the hero. Priority labels explain the perspective, not new scoring rules. Selection uses the existing persisted `hub_lens` preference and updates the existing page, with focus restored to the selected card. A stored preference collapses to four compact choices with a reversible comparison disclosure. Small screens use stacked details, while desktop compares all four cards. No capital thresholds, model numbers, ranking weights or entry criteria change.

### Research in context and step-through scenes

Built first for the NEM and Japan; the other markets follow in the next release.

**Research in context.** Each chapter of a placed market's page, and the System tensions and Market mechanism chapters of its market-background reading, carries one closed disclosure, "Research behind this section". Nothing is copied: `src/experience/researchMap.js` names which research card is read under which chapter, and the market's own engine draws the same card its research tab draws (`researchExcerpt` in `src/markets/_shared/engine.js`). Nothing loads until a disclosure is opened, and then only that market's research and the sections asked for. The research tabs, the research dialog and every deep link stay. `tests/research-map.test.js` fails unless every card of every routed section is placed or listed for the analyst, and `node scripts/research/coverage.mjs` prints that list. No card is deleted or retired without the analyst's line-by-line answer.

**Step-through scenes.** The System, Plant cutaway and Payment chain views of the explanatory scene share one scenario. A market's sequences (`src/experience/story/public/sequences/`) are ordered steps; each declares a scenario and a caption and answers one of six questions. The player (`story/kit/sequence.js`) never starts by itself, advances one step at a time, and stops when out of view. Four layers never share a line style: power, control signals, contract obligations, and payments on a settlement rail whose three gates (qualified, awarded, performed) show that delivering a service does not by itself earn a payment. The reader's switches change the drawing and the words under it, never the investment case, which the scene does not hold. A phone gets a compact frame, so the drawing no longer scrolls sideways.

**Content rules, tested** (`tests/public-sequences.test.js`): every step restates the market's existing research and cites source ids already in that market's public content, and for Japan in that area's own pool; no step types a figure other than a year; a contracted-revenue sequence is the shared six stages in order. No grade, call, assumption or model result is read or changed.
