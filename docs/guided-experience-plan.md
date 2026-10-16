# Guided investor experience — plan

Drafted and approved by the analyst on 2026-10-16, against `origin/main` after the duration-fit PRs
(#29, #30). The decisions came out of three rounds of questions on 2026-10-15/16; the rulings on
fund calls were made the same day from the engine figures quoted below. *As built*, at the end,
records what each PR delivered.

## Context

Opened as a first-time infrastructure investor, the site is a maze: GB's dashboard alone has 89 cards,
20 charts and 37 tables; the home page shows 60 verdicts; news sits two-thirds down `/returns`; "what
changed" counts 316 setup edits; GB states its duration as 2h, 4h and toll-4h on different tabs.
Conclusions exist but are scattered, and some contradict the engine. Goal: open the site and know in
30–60 s what's happening, what's coming, where to focus, what to build, what changed and what to do;
then 5 minutes per opportunity; then 30 minutes of evidence. Pages argue conclusion-first, in plain
calls, with no disclaimers or hedges.

## What was decided (2026-10-15/16)

| # | Decision |
|---|---|
| 1 | Default lens: **infrastructure fund**; other three investors one click away (`hub_lens` already persists; new visitors must land on the fund, not "All four") |
| 2 | Unit of opportunity: a **play** = market × revenue route × duration × entry stage |
| 3 | A play inherits the market verdict unless given **its own call** (full verdict record) |
| 4 | Shortlist order: **call, then risk-adjusted value** (design-fit value per MW at 7.5% secured / 11.5% merchant yields); call-vs-economics disagreements flagged and queued |
| 5 | Writing: **computed sentences** + analyst-owned thesis and action per play; Claude drafts the first set for sign-off; no AI in the weekly loop |
| 6 | **Bilingual** `[en, zh]` throughout, computed sentences templated in both |
| 7 | **Weekly digest** pushed as a GitHub issue (deterministic) |
| 8 | Two action lists kept apart: **investor actions** and an **analyst queue** |
| 9 | Deep layer: **brief becomes each market's landing tab**; deep tabs stay, contradictions fixed |
| 10 | **Guided layers first**; duration PRs 3–6 plug in later; PR 6's `/returns` table folds into the briefing |

**Rulings on fund calls** (engine: unlevered, exit year 5):
- **Italy split into two plays.** Capacity market · 4h · ready-to-build keeps **Enter now** (hold 15.4%,
  exit 18.4%, +$284k/MW; new trigger: Terna's proposed 4h de-rating cut 0.67→0.53 for DY2028).
  MACSE · 6–7h · awarded gets its own call, **Opportunistic** (hold 3.4%, exit 0.6%, −$268k/MW at 6h).
- **Japan:** Tokyo **Enter now → Build position**; Kyushu, Hokkaido stay Build position; each area gets
  its own copy of the Round 4 trigger (a trigger belongs to one market's view). Methodology PR to price
  the 8.8h floor-holding build (6h holds 4.1h at year 20 under the no-augmentation ruling).
- **NEM, CAISO: Build position → Opportunistic** (operating asset with an executed award / RA contract
  at a price that clears the hurdle); research gate on both markets' revenue and capex seeds.
- **Romania: Wait → Opportunistic**, play merchant · 4h · operating/co-invest with an optimiser floor
  (+$364k/MW, hold 19.3%, exit 23.2%).

## The experience

### 30 seconds — Briefing at `/` (fund lens)

Six blocks, conclusion first. What it would say on launch, from today's engine and the rulings:

1. **The call** (computed): "One play clears a fund's bar today: Italy, capacity market, 4h,
   ready-to-build — 18.4% exit IRR, +$284k/MW. Prepare in Ireland and Japan; Japan waits on pricing the
   8.8h build its auction floor requires. Nine plays are situational: act only on a named asset or
   seller; WA, Romania and Germany lead on value. Watch Poland and PJM. Next decisive date: Italy's second MACSE auction, 24 November."
2. **What changed since your last visit** (≤6 material items): call moves, play/design changes, trigger
   outcomes or dates passed, data moves past a threshold, news tagged to your markets.
3. **What's coming, 90 days:** RO grant call 30 Oct ↔ · WA benchmark-technology review Oct ↔ · FI
   grid-priority bill Nov ↔ · IT MACSE-2 24 Nov ↔ · PJM BRA Dec ↔ · CAISO foldback Jan ↘. Full
   12-month calendar collapsed below.
4. **Where to focus** — shortlist, grouped by action tier (Enter now → Pursue, Build position →
   Prepare, Opportunistic → Situational, Wait → Watch, Avoid/Not accessible → Park; "Selective" stays retired):

   | Tier | Play | Value/MW | Exit IRR | Secured |
   |---|---|---|---|---|
   | Pursue | IT · capacity market · 4h · RtB | +284k | 18.4% | 20% / 15y |
   | Prepare | IE · capacity market · 4h · RtB | +89k | 10.2% | 55% / 10y |
   | Prepare | JP Tokyo, Kyushu, Hokkaido · LTDA · 6h → 8.8h · awarded | not priced ⚑ | 8.0% at 6h | 96% / 15y |
   | Situational | WA · RCM · 7h · co-invest | +549k | 16.4% | 77% / 10y |
   | Situational | RO · merchant · 4h · operating, floored | +364k | 23.2% | floor |
   | Situational | DE · toll · 4h · RtB | +126k | 13.1% | 100% / 5y |
   | Situational | NEM · CIS 4h · GB · toll 4h · CAISO · RA 4h · IT · MACSE 6–7h · ERCOT · toll 2h | −203k to −462k | ≤ 0.8% | |
   | Situational | FI | not priced | | |
   | Watch | PL · capacity market · 2h · PJM · capacity · 4h | −259k / −464k | < 0 | |

   Each row also carries: evidence strength, one-line why, next catalyst. Click → play brief.
5. **What to build** (from `fitOf`, one line per market): WA RCM 7h (band 7–8h) · IT capacity market
   4h, MACSE flat from 2h to 10h · DE merchant 4h, toll 4h for a fund · RO merchant 4h (the modelled 2h
   gives up $106k/MW) · IE capacity market 4h · GB toll 4h, capacity route 2–4h · NEM toll 4h · CAISO RA
   4h · PJM 4h · ERCOT toll 2h · PL capacity market 2h · JP no compliant design yet (8.8h holds the floor).
6. **Your next actions:** the top investor actions with dates; one line "N calls need your review" →
   `/desk`.

The verdict board, return-vs-entry map and scout rows move below a "More" fold (loaded on demand).

### 5 minutes — Play brief, each market's landing tab

The call and play for the lens, with the thesis and the trigger that would change it. Then:
- **What to build and why:** the design-fit table by route, on all 13 dashboards (today only 6 have it).
- **Economics:** six numbers with a bear/base/bull range.
- **Risks:** the top three, computed from the verdict's "despite", the lowest grades weighted by the lens, any knock-outs, and down-pointing triggers.
- **Catalysts and what changed:** this market's dated events and its recent changes.
- **Next action.**
- **Other investors and alternative plays,** in compact form.
- **Go deeper:** links from each section to the tab that holds its evidence.

Italy shows two plays. Japan keeps its region selector. Finland shows "not priced", without a number.

### 30 minutes — deep layer
The existing tabs, the Investment Lab, `/returns`, `/changes`, `/news` and `/data`, with the contradictions removed (PR 7).

### Analyst desk `/desk` and weekly digest
The desk queue is computed:
- a trigger's date has passed and no outcome is recorded;
- a trigger falls due within 14 days;
- a review date has passed or falls within 30 days;
- a call and the economics disagree;
- a data rule is near its threshold or has crossed it;
- a feed is stale;
- a play has no action, or its action is overdue;
- a grade reason quotes an engine figure the engine no longer gives (e.g. GB's 4.7% where the engine now gives 5.1%).

Each item names the record path and the writer command that fixes it.

The digest is the same model rendered as Markdown and posted as one GitHub issue per week, at Monday 07:00 Perth time.

### Rules every new page follows
- **Bottom line first.**
- **Every claim is either computed or owned by the analyst.**
- **Evidence strength, one marker per play:** Strong, Fair or Thin, from the basis of the play's design inputs and the bases of its "because" grades.
  - It replaces "Illustrative — not official", "Evidence confidence N/10", "74%" and "Screening only".
- **No disclaimers.**
- **No hedging words:** a test lints the English templates.

## Data model (view store)

- `plays.<playId>`, a new section in `view/markets/<id>.json`, with fields:
  - `id`, `label[en,zh]`
  - `route`: an engine route id, one of cap / mer / toll / ltda
  - `hours`: a value on the market's duration grid
  - `stage`
  - `why[en,zh]`: one line
  - `action{text[en,zh], due}`
  - optional `calls{<archetype>: verdict record}`
  - `author`, `asOf`
- **This replaces** the approved but unbuilt `design` section of the duration plan. Part D's trend and cause fields attach to plays later.
- `verdicts.<archetype>.play`: optional, names the play the market call is about.
- `thesis`: the existing field, empty today, filled with 2–3 lines per market. It is the brief's lead.
- `triggers[].outcome{on, text[en,zh]}`: optional. Closes a trigger after its date passes.
- Economics are never stored. For each play, the model computes:
  - `marketAt` and `runCase` (value, hold and exit IRR, secured share);
  - eligibility, from the sweep point;
  - FX from the committed `fx-ecb` snapshot through `setObservedFxSummary`, the same rule the client uses.

## Build sequence

Each PR passes the full suite and is merged by you.

**PR 1 — Plays in the schema** (no content, no published number moves)
- `view/schema/view.mjs`:
  - add `'plays'` to `VIEW_SECTIONS`;
  - validate plays in `validateMarketView` (:83);
  - accept `plays.<id>` in `parsePath` and `writePath` (:146, :172);
  - add `AUTHOR_RIGHTS.analyst.plays`, with none for rule and agent (:264);
  - add the play pointer to `buildIndex`.
- `src/governance/investability.js`: an optional `play` on a verdict, and a new `validatePlay` that reuses `validateVerdict` for a play's own calls.
- `src/governance/triggers.js`: the `outcome` field. A trigger with an outcome is resolved for `overdue` and for the calendar.
- `src/governance/authority.js`: `VIEW_AUTHORITY.plays = AUTHORITY.VIEW` (:108).
- `src/markets/boardProjection.js`: project plays and the verdict's play pointer. Short text only.
- Tests: `tests/view.test.js` (plays validation; rule and agent refused), `tests/governance.test.js`, and `tests/verdict-board.test.js` (projection parity).

**PR 2 — Content: rulings, theses, plays, actions** (content sheet signed off first)
- Draft `docs/briefing-content-2026-10.md`, in EN and ZH:
  - 15 theses;
  - about 20 plays, each with its why and action;
  - the 5 changed fund calls, with their because / despite / changes-if / review-by;
  - the new triggers: `it-capacity-derating-dy2028`, citing register key `derating`, and the Kyushu and Hokkaido copies of Round 4.
- Sources for the drafts:
  - `comparison.js` `narrative.thesis`;
  - the dashboards' house-view blocks;
  - the existing verdicts.
- Before writing anything, check every term against `local-data/markers.json`.
- Apply through `node scripts/view/writer.mjs apply <change.json>`, so every change gets an analyst changelog line.
- Add the NEM and CAISO research gates to `docs/external-view.md`, at the next free G-numbers.
- `npm run test:current` must stay unchanged.

**PR 3 — Briefing model, shared by page, desk and digest**
- `src/briefing/model.js` (pure, Node-importable): shortlist, tiers, flags, computed sentences, changes with materiality classes, catalysts, what-to-build lines, actions and the queue. Two helpers:
  - `src/briefing/plays.js`, economics through `designFit.js` and `engine.js`;
  - `src/briefing/sentences.js`, the EN and ZH templates.
- `src/governance/briefing.js` (methodology) holds:
  - the tier map;
  - the disagreement rules;
  - the evidence-strength rule;
  - the thresholds: data move vs. trailing 90 days, catalyst window, due-soon window;
  - `SETUP_UNTIL = '2026-10-13'`, which excludes the 292 setup lines.
- `src/governance/newsTags.js` (methodology): per-market terms, for example Terna/MACSE → it, OCCTO/JEPX → jp_*, NESO/Elexon → gb.
  - Tagging runs in the model at build time. No ETL change is needed.
  - Untagged items never reach the briefing.
- `vite-plugin-briefing.js` with the stub `src/briefing/briefingData.js`. This copies the pattern of `vite-plugin-view-board.js` and `src/markets/viewBoardData.js`: the build writes a `BRIEFING` literal, and plain Node computes the same thing. Registered in `vite.config.js`.
- `tests/briefing.test.js` covers:
  - ordering: call, then value; ineligible plays last in their tier;
  - the disagreement fixtures;
  - setup and reason-only edits excluded from "changes";
  - every template is an `[en, zh]` pair;
  - the hedge-word lint;
  - tagging examples;
  - the projection equals the Node result.

**PR 4 — Briefing home**
- New `src/home/briefingHome.js`, mounted from `homePage.js`. `verdictHome.js` moves below the "More" fold, loaded on demand.
- `src/app/state.js`:
  - the default lens is `infraFund` when none is stored;
  - since-last-visit uses `hub_seen_at` and `hub_seen_prev`, rotating after 30 minutes away, with a 7-day fallback (through `src/utils/storage.js`).
- `src/components/navigation.js`:
  - the primary nav becomes Briefing · Markets · Returns · Changes · Desk;
  - the 15 market codes move to a compact second row;
  - Scouting is hidden until a card exists;
  - `/news` and `/data` are linked from the briefing and the footer.
- The "Release Gate" chip is removed from `homePage.js:66`.
- `tests/bundle-budget.test.js`: `home` measures 249.67 against a budget of 258. Re-measure; any budget change is stated with its measurement.

**PR 5 — Play brief landing tab**
- `src/markets/tabGroups.js`:
  - the first tab is relabelled "Brief / 要点" and keeps the id `case`, so URLs are stable;
  - the `home` section moves to the Story tab;
  - old addresses still resolve through `resolveSegment`.
- `src/components/investmentCase.js` and `investmentCaseLoader.js` become the brief renderer.
  - The four investor cards, the pillar table and the 14-grade table move into a collapsed "All investors and grades" block, and into the Evidence tab.
- Reuse:
  - `createDesignFitBlock` (`src/markets/_shared/designFitBlock.js`), now on all 13 dashboards, WA included;
  - `src/comparison/refinement.js` for bear/base/bull.
- Handle WA (`wa/sections/case.js`), the Japan regions, and Finland (withheld).
- Slim `refinementBanner.js` and the header meta row.

**PR 6 — Desk and weekly digest**
- `src/desk/deskPage.js` on `/desk` (router and `app.js`).
- `scripts/briefing/weekly.mjs`: Markdown, last 7 days, with a `--dry` option.
- `.github/workflows/etl.yml`, a new job `weekly-briefing`, placed after `digest`:
  - cron `7 23 * * 0`;
  - `permissions: contents: read, issues: write`;
  - one issue per ISO week: edit it if it exists, and close the previous week's;
  - add the cron to the refresh job's `if:` exclusions.
- Tests:
  - the job has no write access to contents;
  - no auto-merge appears;
  - the cron is excluded from refresh;
  - the digest's shortlist equals the page model's.

**PR 7 — Deep layer: contradictions out**
- **Disclaimers:** delete `renderDisclaimer` (`header.js`) and its 5 call sites (`_shared/engine.js`, `_template/dashboard.js`, `wa/dashboard.js`, `returnsPage.js`, `investmentLabPage.js`), plus the repeat in the footer.
- **Illustrative badges:** `badge('illus')` and `badgeIllus` have 303 uses. Change the renderer once, in `src/components/badge.js` (:89, :171), `_shared/text.js` and `wa/text.js`, rather than at every call site.
- **Retired vocabulary:** remove "Selective" from rendered prose. Card G on gb/wa/nem/ro is replaced by the brief's action. Also GB's `decisionProfiles` consensus.
- **Duration and IRR statements:** make them read the engine, or delete them where the brief now says it.
  - GB: the 2h bridge note, the Story before/after, the outlook, and the 2h lab seed, now labelled as a screening case.
  - WA: the "8h → 10h" passages, against the engine's 7h with a band of 7–8h.
  - Japan: "four hours is where they cross".
- **Grade reasons quoting old engine numbers** (GB 4.7% and 10%, now 5.1% and 11.7%): rewritten through the writer, with your sign-off.
- **`/returns` stale copy:**
  - "six markets" in the congestion copy;
  - "precedent only in GB";
  - the hardcoded review date;
  - Finland missing from the globe;
  - the $1M matrix silently dropping 4 markets: it now says so.
- **`pageEnhancements.js`:** delete the authored cards that are superseded at their source, then the enhancers that hid them.
- **Duplicates:** cut exact repeats only.

**PR 8 — Japan methodology** (its own plan: derivations first, sign-off before code)
- Extend Japan's duration grid past 8h.
- Check the LTDA payment basis for an oversized build against OCCTO's rules.
- Price the floor-holding design.
- Re-check the three calls.

**Later:** duration PRs 3–5 (paid-duration curves, fleet and award history, drivers and tipping points) attach their trend, cause and drivers to plays, and the briefing reads them.

## Decisions confirmed with the plan (2026-10-16)
1. `plays` replaces the duration plan's unbuilt `design` section.
2. Plays are written by the analyst only; rules and the agent get no rights on them for now.
3. `src/governance/briefing.js` and `newsTags.js` are methodology: human-only, and listed in `METHODOLOGY_SURFACES`.
4. One evidence-strength marker replaces the four confidence displays.
5. The digest posts Monday 07:00 Perth time.

## Verification
- **Every PR:**
  - `npm test`;
  - `npm run build`, then `npm run test:budget` and `npm run test:bundle`;
  - `npm run guard:staged` before each commit.
- **PR 2:** `npm run test:current` is unchanged, and `/changes` lists the analyst's ruling lines.
- **PR 3:** `node scripts/briefing/weekly.mjs --dry` prints the shortlist in the order shown above.
- **PRs 4–6:** preview with `bess-dev` (`.claude/launch.json`), then read the page:
  - the home page shows the six blocks under the fund lens, and they match the dry digest;
  - the since-mark rotates;
  - `/desk` lists the RO grant call, GB's stale reasons and the JP re-price;
  - the Italy brief shows two plays;
  - the Japan regions and Finland's withheld state render;
  - 中文 covers every new string;
  - the layout works at 375 px.
- **PR 6:** you dispatch the weekly job once by hand; a second run in the same week edits the issue rather than creating a new one.
- **PR 7:** greps find no `renderDisclaimer`, no rendered "Selective" and no "not official", and every GB duration statement traces to the engine.

## As built

**PR 1 — plays in the schema (2026-10-16).**
- `src/governance/plays.js`: `validatePlay`, `REVENUE_ROUTES` (asserted equal to the engine's route
  ids), `playsOf`, `playCall` (a play's own call, else the market's).
- `view/schema/view.mjs`: `plays` in `VIEW_SECTIONS`; `plays.<id>` paths; a verdict may name a play
  (it must exist and be entered at the play's stage); a play's own call is a full verdict on this
  market's triggers and never doubles a verdict that already names the play; the index carries the
  play a verdict names; `AUTHOR_RIGHTS.analyst.plays`, no row for rule or agent.
- `src/governance/triggers.js`: `outcome { on, text }` and `isResolved`; a resolved trigger is never
  overdue and leaves the calendar's lanes for a `resolved` group (`src/home/boardModel.js`).
- `src/governance/authority.js`: `VIEW_AUTHORITY.plays`. `docs/governance.md` updated.
- Projection, writer stamps, change labels; tests in `view.test.js`, `view-automation.test.js`,
  `verdict-board.test.js`. No published number moves and no view file changes.

**PR 2 — content for sign-off (2026-10-16).** `scripts/view/content/briefing-2026-10.mjs` holds 15 theses,
18 plays, the six ruled fund calls, eight fund calls naming their play and three triggers;
`scripts/view/draft-briefing-content.mjs` renders `docs/briefing-content-2026-10.md` for review,
checks all 51 changes against the writer's gate, and applies them in one batch after sign-off.
Research gates G40 (NEM seeds) and G41 (CAISO seeds) are in `docs/external-view.md`.

**PR 3 — the briefing model (2026-10-16).**
- `src/briefing/`: `model.js` assembles one object for the page, the desk and the digest;
  `plays.js` prices each play through the design-fit sweep and `runCase` and orders the shortlist
  (call, then value; an unpriced or non-compliant design last in its call, by fit);
  `sentences.js` writes every computed sentence in both languages; `changes.js` classes the
  changelog, passed trigger dates, week-on-90-day spread moves and tagged headlines;
  `queue.js` builds the analyst's queue; `markdown.js` renders the weekly digest; `disk.js` reads
  the inputs (Node only); `briefingData.js` is the stub `vite-plugin-briefing.js` replaces.
- Methodology, human-only, in `METHODOLOGY_SURFACES`: `src/governance/briefing.js` (tiers,
  disagreement and evidence rules, windows, `SETUP_UNTIL`) and `src/governance/newsTags.js`.
- `node scripts/briefing/weekly.mjs [--with-draft]` prints the digest.
- As found when first run: the next decisive date is the soonest trigger any acting call names,
  so for the fund it is Romania's grant call (30 October), not MACSE-2 (24 November); a market
  whose best design is negative reads "nothing clears the platform's yields" rather than naming
  the least-bad design as a recommendation.

**PR 4 — the briefing home (2026-10-16).** `src/home/briefingHome.js` renders the six answers from
`HOME_BRIEFING` (the briefing less the queue's words, `src/briefing/homeData.js`); the verdict board
moved behind a fold. The lens defaults to the infrastructure fund, and "All four" is remembered as a
choice (`hub_lens = 'all'`). "Since your last visit" keeps three marks in the browser
(`src/briefing/since.js`): a reload inside thirty minutes keeps the same window, a first visit reads
seven days. The navigation is two rows — Briefing · Returns · Changes · Desk (Scouting once a card
exists), then the market codes. `/desk` moved forward from PR 6 so the briefing's link to it is never
dead. The "Release Gate" chip and the home footer's disclaimer are gone. First view measured 247.6 kB
gzipped against the unchanged 258 budget; the board, behind the fold, is no longer part of it.

**PR 5 — the market brief (2026-10-16).** The landing tab is relabelled "Brief / 要点" (id `case`
kept, so every address works) and renders `src/components/marketBrief.js`: the call on each play
for the chosen investor with the thesis and what would change it; what to build, with the line and
the route × hours grid; the economics (value per MW, both IRRs, secured share, payback, MOIC, bear
and bull); the risks (barriers, the call's strongest counter-argument, the two grades this investor
reads lowest, catalysts that would close the market); catalysts and what changed here; the next
action; the other investors; links into each deep tab. The four investors' verdicts, the pillar
table and the fourteen grades are folded beneath. The overview ("Market at a glance") now leads the
Market Story tab; `/home` links land there. Figures come from the briefing (now also carrying each
play's payback, MOIC and bear/bull, and each market's design grid), so the brief, the home page and
the digest agree. The banner above the tabs is one dated line of the market's current update; the
"Screening only" chip, the consensus chip, the approval gate, "Evidence confidence N/10" and the
pipeline caveat are gone. Budgets: the shared `briefing-data` chunk 12.5 kB (budget 18); the
`investment-case` chunk 17.6 kB (budget raised 15 → 20).

**PR 6 — the weekly digest (2026-10-16).** `weekly-briefing` in `.github/workflows/etl.yml`: Sunday
23:07 UTC (Monday 07:07 in Perth), or by hand through the `weekly_briefing` dispatch input. It renders
`node scripts/briefing/weekly.mjs` and posts it as one issue per week with the label
`weekly-briefing`; a second run in the same week edits that issue, and last week's is closed. No
model, no key, `contents: read` and `issues: write` only; the data refresh does not run on its
schedule. `/desk` shipped in PR 4.

**PR 7 — the deep layer, contradictions out (2026-10-16).** The disclaimer band and its footer
repeat are gone from every page, with `renderDisclaimer` and the band's styles; the dossier footer's
disclaimer goes too, and `/returns` loses its "Release Gate: screening only" chip. A seed figure
reads "Basis: Seed estimate" beside the number instead of a warning chip. "Selective" has left the
source: the Card G panels on GB, WA, NEM and Romania are "Underwriting rules" whose conditions say
when they apply; the stance chips on Poland, Romania and Japan's economics tabs are gone, as are the
"Selective" labels in Ireland's and WA's opportunity logic and GB's consensus line; unrendered data
was reworded so a test can forbid the word. Durations now read the engine through
`src/markets/_shared/designAnswer.js`, which takes them from a 5 kB design projection of the
briefing (`src/briefing/designData.js`, a third stub the briefing plugin fills), so a deep tab says
what the Brief says: GB's Story table, Overview bridge, Duration tab and augmentation card (toll or
floor at 4h; capacity route 2–4h); WA's Card E, bridge, outlook and Duration tab (7h, band 7–8h,
where it said 8h → 10h); Japan's "four hours is where they cross", now the award floor and the
engine's line for each area. Duration-need bands that prescribed hours against the engine (WA
"8h+", Romania "2h core", Poland "4h+", Japan "4h is the reference") state the method instead.
GB's Capital & Exit is labelled the Lab's 100 MW · 2h screening case, its verdict is computed from
the Lab's own figures, and the engine's line sits beside it. `/returns` names the markets its $1M
matrix leaves out (no route clears: PL, PJM, ERCOT; not priced: FI), lists the toll markets from
their capabilities, takes its review dates from the manifests, says "these markets" for the
congestion register, and puts Finland on the globe. The cards `pageEnhancements.js` deleted at
runtime (every "Investment conclusion" and Bear / Base / Bull card, WA's official-evolution,
opportunity-logic, locational-case and three RCM cards, six "Recommended presentation order"
notes) are deleted at source, with the three enhancers that hid them. No exact duplicate passage
was found within a market, so none was cut. GB's two stale grade reasons (hold IRR 4.7% → 5.1%,
secured 10% → 12%; rank and grades unchanged) wait as `scripts/view/content/gb-grade-reasons-2026-10.json`
for sign-off. Budget: market-shared chunks raised 102 → 104 kB for the 1.63 kB design projection
(measured 102.2). `tests/deep-layer.test.js` holds the line.

**PR 8 — Japan's floor-holding build (2026-10-16).** `docs/japan-ltda-floor-plan.md` sets out
the derivations, printed by `node scripts/derive/japan-ltda-floor.mjs`. JEPX prices the 9th and 10th
hours at 0.61 and 0.48 of the 4h spread. A 9h build holds the six-hour floor to year 20 (6.13h). Re-bid
at its own cost (¥49,000/kW/yr) it earns +$152–160k/MW at 7.4–7.5% hold; it breaks even at
¥46,500/kW/yr. Approved the same day, except that gate G42 replaced the re-bid with the market
reading. Battery prices are confidential and trade-press estimates (¥12,000–25,000) sit below even
the 6h bid, so the award stays the 6h bid at every duration. Built: Japan's grid reaches 9h and
10h, and the award route prices 9h at −$554k to −$563k/MW. The drafted plays move to 9h, and the
Round 4 trigger carries the break-even award. The calls stay at Build position, flagged until gate
G43 re-sources Japan's capex and bid return.
