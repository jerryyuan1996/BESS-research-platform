# Investability phase 5 — "the rest" — plan for sign-off

Drafted 2026-10-11 against `origin/main` at `798d03a`. **Nothing here is built.** This is the
written plan that the main plan's phase 5 row
([investment-view-revision-plan-2026-10-10.md](investment-view-revision-plan-2026-10-10.md) §8)
needs before a governance or multi-market change lands. Section 9 lists the decisions it needs.

The phase's row: *the other eleven markets graded; tabs merged to seven and claims re-keyed;
entry-adjusted return wired through; Gate G12.* Exit: *fifteen markets by four archetypes, all
with ledgers.*

**The short version.** Four of the five pieces can be built as the main plan describes, with
changes I set out below. One cannot be finished by building: the exit condition needs about
sixty grades that only you can give, because the anchors for them ask for facts the repository
does not hold. And the home page's bundle fails at the second market graded, so that is fixed
first.

---

## 0. What I measured before writing

All read-only, on the branch as it stands.

**The engine, base case, five-year exit.** Fourteen markets are ranked; Finland is withheld.
Every market still carries `devCostPct` 0 and `constructionMonths` 12.

| Market | Route | Hold IRR | Rank | Exit IRR | Secured share / tenor | Reference project |
|---|---|---|---|---|---|---|
| ro | merchant | 20.8% | 1 | 25.2% | 0% | 50 MW · 2h, USD 31m |
| it | capacity | 15.4% | 2 | 18.4% | 20% / 15 yr | 100 MW · 4h, USD 86m |
| de | merchant | 14.6% | 3 | 16.4% | 0% | 100 MW · 4h, USD 91m |
| wa | capacity | 13.1% | 4 | 16.4% | 77% / 10 yr | 200 MW · 7h, USD 432m |
| ie | capacity | 9.6% | 5 | 10.2% | 55% / 10 yr | 50 MW · 4h, USD 56m |
| jp_kyushu | long-term award | 7.5% | 6 | 8.1% | 96% / 15 yr | 50 MW · 6h, USD 104m |
| jp_tokyo | long-term award | 7.4% | 7 | 8.0% | 96% / 15 yr | 50 MW · 6h, USD 104m |
| jp_hokkaido | long-term award | 7.4% | 8 | 8.0% | 96% / 15 yr | 50 MW · 6h, USD 104m |
| gb | capacity | 4.7% | 9 | 1.3% | 10% / 15 yr | 100 MW · 4h, USD 103m |
| caiso | capacity | 3.2% | 10 | 0.7% | 78% / 10 yr | 100 MW · 4h, USD 120m |
| nem | long-term award | 3.1% | 11 | 0.5% | 87% / 15 yr | 280 MW · 4h, USD 256m |
| pjm | capacity | 2.4% | 12 | −2.3% | 47% / 1 yr | 90 MW · 4h, USD 108m |
| pl | merchant | 0.8% | 13 | −5.7% | 0% | 100 MW · 4h, USD 94m |
| ercot | toll | −5.9% | 14 | −12.3% | 100% / 7 yr | 100 MW · 2h, USD 87m |

The hold and exit orderings are the same, so one asset-return grade serves both readings today.

**What is not there.** Three things the main plan describes as built or assumes:

- **No function computes the asset-return quintile.** The three stored grades (wa 4, gb 2, ro 5)
  were entered by hand. Great Britain's reason, "ninth of fourteen", with grade 2, fixes the
  convention: fifth = ⌈rank × 5 ÷ 14⌉, grade = 6 − fifth. Ranks 1–2 are grade 5, 3–5 grade 4,
  6–8 grade 3, 9–11 grade 2, 12–14 grade 1.
- **No critical path.** `src/entry/timeToRevenue.js` does not exist and no pathway stage carries
  an `after` edge (plan §4.3). So no market has a computed time to first revenue, the developer's
  48-month limit is unchecked in every market, and the exposure curve of §6.2 cannot be drawn.
- **No entry return.** `src/entry/entryReturn.js` does not exist (plan §4.4, Appendix A).

**What the eleven markets hold as seed evidence.** Every one has a weighted component table and
a connection-factor table (in `data.js`, `scores.js` or `jp/regions.js`), a decision profile, a
congestion register and a source register of 12 to 33 entries. None has a build pathway or a
ledger. None of the eleven registers holds a foreign-investment source, a transaction, or a count
of financings.

---

## 1. Grading the eleven markets

### 1.1 What I draft and what you decide

| | I draft | You decide |
|---|---|---|
| A sourced grade | The grade the anchor text supports, its basis, the register ids, one public reason in two languages, the trend | Whether it stands, or the number you put instead |
| A practitioner grade | **Nothing.** No evidence, no public reason, and the private reason is yours and is never mine to read or write | The number, or that the dimension waits |
| A held view | Nothing | Everything |
| A verdict | The arithmetic: fit, band, ceiling, knock-outs, unchecked limits; a candidate `because` (the three dimensions that move that archetype's score most) and `despite` (the strongest one against); the triggers it could name | The call, the route, `where`, the wording, the review date, the score note where the call sits two bands from the score |

A draft is a file of proposed changes and a sheet rendered from it. Nothing reaches `view/`
until you have answered the sheet, and then only through `scripts/view/writer.mjs`, as the
analyst, with your values. The changelog reason on each line will say the record was graded by
the analyst on that date. It will not say or imply that the draft was the decision.

### 1.2 Where a draft grade would come from, by dimension

The honest answer is the same in most markets, so it is given by dimension first and the
exceptions follow.

| Dimension | Source of a draft | State across the eleven |
|---|---|---|
| Asset return | The engine's rank, by the convention in §0. Basis derived, evidence `comparison-engine` | Mechanical for all eleven: it 5 · de 4 · ie 4 · jp_kyushu 3 · jp_tokyo 3 · jp_hokkaido 3 · caiso 2 · nem 2 · pjm 1 · pl 1 · ercot 1 |
| Revenue certainty | The engine's secured share and tenor read against the anchor | Mechanical where something is secured: nem 5 · ie 5 · caiso 5 · jp ×3 5 · it 4 · ercot 4 · pjm 2. **Two need a fact:** de and pl secure nothing in the base case, so the grade is 2 if any storage project in the market has signed a secured route and 1 if none has. See §1.3 |
| Capital at risk | The market's ledger (§2): share of project cost, and whether security is posted before consent | Only as good as the ledger. Where an item is unquantified the share is a lower bound and I draft "at least" with the grade the bound already forces, or nothing |
| Approval transparency | The connection-factor table's process lines, the grid section, operator pages already in the register | Draftable in all eleven as derived; official where the operator's own page is in the register and I can open it |
| Time to first revenue | **Nothing computed** (§0). Seed lines exist: "queue and delivery timetable" (pjm 35, caiso 25), "interconnection speed" (ercot 92) | Not draftable against the anchor, which is in months on a critical path. Yours as a practitioner grade, or wait for the stated ranges of §4.2, from which I can draft |
| Grid scarcity | The congestion register (access auction, moratorium), the queue lines of the connection table | Draftable in all eleven as derived |
| Foreign entry | **Nothing in any register.** Statutes and regulator pages exist publicly for every one of these markets | I propose to source them (gate G39): open each screening regime's own page, add it to the register, draft against the anchor. Where I cannot open a primary page the dimension is yours |
| Supply-chain and origin | The three US tables carry a FEOC line scored as a cliff, which is anchor grade 2. Japan's investment gates name "sourcing compliance" with no rule behind it in the register | US: draftable. Japan, the four EU markets and the NEM: nothing held; sourced with foreign entry, or yours |
| Policy stability | The decision profile's dated events and the triggers already migrated | Draftable in all eleven as derived |
| Demand growth | The anchor wants signed new load as a share of peak and the operator's five-year forecast | Held for pjm and ercot only, as a large-load queue, which is enquiries and not signed load. Elsewhere nothing. Sourceable from operator forecasts; otherwise yours |
| Saturation | A "pipeline saturation" line in nem, ie and pl; `valueDriverData.js` holds a named numerator and denominator for some markets | Draftable where both halves of the ratio are held; a seed line alone is a score, not a ratio |
| Debt availability | A "financing" line in every table (de 95, nem 90, caiso 80, ercot 76, pjm 71, pl 70, ie 55). The anchor counts disclosed non-recourse financings in 24 months, and no register holds a count | Not draftable against the anchor. The seed line goes on the sheet as context. Yours, unless a public deal count is sourced |
| Exit liquidity | **Nothing anywhere** (gate G38) | Yours |
| Scale and repeatability | Connection headroom against the reference project; no market publishes it in that form | Practitioner in three of the four corners. Mostly yours |

**So, of 154 grades:** about 22 are mechanical (the Return pillar), about 45 are draftable from
what the repository holds (approval transparency, grid scarcity, policy stability, some
saturation and capital at risk), about 25 become draftable if I source foreign entry, origin
rules and demand from primary pages, and **about 60 have no public basis I can cite and are
yours as practitioner grades**: time to first revenue, debt availability, exit liquidity, scale,
and whatever of the others will not source. The four corners went the same way: 5, 6, 6 and 6 of
14 are practitioner grades there.

### 1.3 Facts I need from a source before two grades can be drafted

Germany and Poland have no secured revenue in the base case. Grade 2 against grade 1 is the
difference between a low score and the infrastructure fund's knock-out. Germany's own table
says "contracted revenue availability (tolling only)", so a route is described; whether a project
has **signed** one needs a source I can open. Poland's capacity market has awarded storage
contracts, which is a signed route if the register entry says so. I will open both before
drafting and put the locator on the sheet.

### 1.4 How you review it

Not one diff. **One sheet per market, answered in this session, a few markets at a time.**

A sheet is one page generated from the draft file by a small script, so the sheet and what would
be written cannot differ:

- **Fourteen rows.** Dimension · the anchor line for the drafted grade and the lines either side
  of it · draft grade · basis and evidence · the seed line it started from, with its weight and
  score · the one-sentence public reason · an empty column for you. Rows with no draft say
  "yours" and show only the anchors and any seed line.
- **Four verdict rows**, computed from the grades as they stand on the sheet: fit, the band it
  falls in, ceiling, knock-outs, limits breached and unchecked, candidate because and despite.
  No call is pre-filled in the call column.
- **One line of what the sheet cannot know**: the ledger's limit, and which of the developer's
  limits are unchecked.

You answer in short form: "de: accept 1–4, 6, 9; grid 2; debt 5; exit 4; scale 4; time waits;
strategic build-position greenfield, …". I turn the answer into the change file, show you the
final sheet once, and only then run the writer. Sheets and draft files live under
`docs/grading/` on the wave's branch and are deleted in the commit that writes the view, so no
draft outlives the decision it led to.

### 1.5 Order

| Wave | Markets | Why here |
|---|---|---|
| 0 | de | One market first, to prove the sheet before ten more are written in its shape. Germany has the richest tables and the sharpest open question (§1.3) |
| 1 | it, pl, ie | The rest of Europe: the same dashboard lineage as Romania, and the natural comparison set for the three European corners |
| 2 | nem, pjm, ercot, caiso | Western Australia's sister market, then the three US markets, which share one origin rule and one screening regime |
| 3 | jp_tokyo, jp_kyushu, jp_hokkaido | Last because it is the awkward one: three allocation points, one dashboard, one register. National dimensions (foreign entry, origin, policy, debt, exit) are drafted once and written three times; regional ones (grid scarcity, saturation, demand, time) are drafted per area |

### 1.6 The fourteen-dimension test

`tests/view.test.js` holds a graded market to all fourteen, and I propose it stays exactly as it
is. A market lands when you have given the grades I cannot draft. If you leave a dimension, that
market **waits**: its file keeps triggers only, it stays off the graded list, and the board goes
on saying "not yet graded" for it. I considered a "partly graded" state and recommend against it:
an ungraded dimension already leaves the pillar and the fit unscored (§3.5), so a partial market
would show four verdicts that nothing checks.

That is also the plain statement about the exit condition: **fifteen by four is reached when you
have answered eleven sheets, and not before.** Building cannot reach it.

---

## 2. Ledgers for the eleven

A ledger is facts, not judgement, so I write these in full for review. Each item is opened at
its source before it is marked `verified`; anything I reach only through a search summary is
`verify`; anything known to exist with no figure is listed with `amount: null`, which makes the
total a lower bound. **The table below is what I expect to look for. Nothing in it is a finding
until the page has been opened**, and the amounts are deliberately not written here.

| Market | Items I expect to find a public source for | What will read "not yet checked" |
|---|---|---|
| nem | Operator connection application and registration fees; renewable-zone access fees where a scheme publishes them; bid security under the federal and state tender rules | Network-operator connection charges and security, negotiated per project |
| de | The connection cost contribution, already in the dashboard as a published range from two operators' tariff sheets; the realisation deposit credited against it | Whether the contribution falls before the investment decision. It is paid at connection, so it may not be capital at risk at all. That flag is stated, not derived, and I will ask you |
| it | The connection-quote fee under the regulator's connection code; the participation guarantee in the storage auction rules; the capacity-market guarantee | Regional authorisation costs |
| ie | Published application fees; the first-stage payment and capacity bond on a connection offer; capacity-auction performance security | Reinforcement cost and its cap, which the dashboard already scores as uncertain |
| pl | The statutory advance on the connection fee; the capacity-auction bid security set each year | Reinforcement cost allocation |
| jp ×3 | The connection study fee; the deposit and first contribution toward grid works, which the dashboard holds as anchored for Tokyo and as unknown for the other two; the long-term auction's bid security | The grid-works cost the deposit is a percentage of, so the deposit is a rule with no amount in all three |
| pjm | Study and readiness deposits under the reformed cycle process, in the tariff; the capacity auction's credit requirement | Network upgrade cost allocation |
| ercot | Interconnection study fees | Security under the interconnection agreement, set by each transmission provider. Texas may come out as an honest near-empty ledger |
| caiso | Study deposit and the staged financial security postings in the tariff; site-exclusivity deposit | Network upgrade cost responsibility |

**Limits.** In every one of the eleven I expect at least one unquantified item on network works,
so capital risked before the decision will be a lower bound: a breach where the bound already
exceeds an archetype's limit, unchecked otherwise, never a pass. The developer's months limit is
unchecked everywhere until §4.2 lands. The cheque is checked everywhere today, from the engine.

**New register entries.** Each fee or security source that is not already in a market's register
is added to it, with the fields the register requires. The foreign-entry and origin-rule pages
of §1.2 go in the same way. The link audit and `tests/source-urls.test.js` will cover them.

**Japan.** Three ledgers, one per allocation point, because the store and the registry are keyed
by market id. National items are written once in `jp/` and shared by the three.

**No pathways.** The four corners have a build pathway each; the eleven do not, and the phase's
row does not ask for them. A ledger does not need one: `postedAt` is a stage id from the fixed
vocabulary. The Entry tab renders without a pathway panel where there is none.

---

## 3. Twelve tabs to seven

### 3.1 The target

| Tab id | Label | Holds these sections | Was |
|---|---|---|---|
| `case` | Investment case | case, then home | Overview and Investment Case |
| `story` | Market story | story | unchanged |
| `revenue` | Revenue and design | capacity, energy, services, duration | four tabs, already grouped in the strip |
| `entry` | Entry and delivery | entry, then grid | Entry and Grid connection |
| `competition` | Competition and demand | pipeline | Project pipeline |
| `capital` | Capital and exit | portfolio | Portfolio |
| `evidence` | Evidence | data, then this market's changelog | Data and methodology |

`case` becomes the landing tab. What survives of the old Overview (the headline figures and the
market's own summary cards) follows the verdicts under a heading of its own.

### 3.2 A tab stops being a section. Sections keep their ids

This is the one place I recommend departing from the main plan's wording. §6.2 says the claim
keys are migrated. I recommend **they are not**, and that the thing that changes is the
assumption that a tab is one section.

Today `tabs.js` lists ids and `sections.js` returns one spec per id; the two are the same list.
After the merge a tab is a **container** that lists the section ids it shows, and the ten
analytical sections keep the ids they have now, each rendered with its own heading and its own
`.sect` wrapper inside the tab.

What that buys:

- **No claim is re-keyed.** `claims.js` and `dispositions.js` in wa, pjm and fi stay keyed by
  section id, byte for byte. The seven supported claims, their evidence reviews and the 150-section
  count (fifteen markets by ten analytical sections) are untouched. A re-keying would have meant
  merging four reviewed dispositions into one for `revenue`, and a merged claim is a new claim
  that nobody reviewed.
- **The frozen review checklist still means what it says.** "Read the section's complete rendered
  argument" keeps a section to read.
- **The alias map is a table of two columns** and not a migration.

What it costs: the renderer must draw several sections in one tab and `placeSectionClaim` must
find each section's wrapper by id instead of the page's first `.sect`. That is the defect class
`tests/section-shape.test.js` was written for, so it is tested and then checked in a browser.

### 3.3 The alias map

One shared table, plus per-market additions for ids that differ.

| Old segment | Resolves to | Scrolls to section |
|---|---|---|
| `home` | `case` | home |
| `case` | `case` | – |
| `capacity`, `energy`, `services`, `duration` | `revenue` | the same id |
| `grid` | `entry` | grid |
| `pipeline` | `competition` | pipeline |
| `portfolio` | `capital` | portfolio |
| `data` | `evidence` | data |
| wa only: `rcm`, `fcess` | `revenue` | the same id |

The router already falls back to the default tab for an id it does not know. The alias is
resolved before that fallback and the address is rewritten in place, so an old link lands on the
right section and a reader who copies the address copies the new one. An unknown id still falls
back; nothing 404s.

**Revenue is the one tab I would not stack.** Four heavy sections with charts on one scrolling
page is slow and long on a phone. The strip already shows them as one "Revenue Mechanisms" entry
with a sub-strip, one section visible at a time; I propose the merged tab keeps exactly that,
addressed as `/revenue/<section>`. The two-section tabs stack.

### 3.4 Retiring the score tables (plan §6.3)

Each market's component table is the seed for its first grades, "then delete the table". I
propose the tables are deleted **in the merge change and not before**, market by market, only for
a market whose fourteen grades are written. A market that is waiting (§1.6) keeps its table,
because it is still the only judgement on the page. The connection-factor lists move to Entry and
delivery as a project checklist, under that name, with their scores removed. `manifest.status`
becomes optional and is dropped from the manifests of graded markets.

### 3.5 The amendment to PILOT-FROZEN.md

Added as a dated section at the end; nothing above it is edited.

> **Amended 2026-10: a section is no longer a tab.** The pilot counted 150 sections as fifteen
> markets by ten tabs. Dashboards now carry seven tabs, and a tab may hold several sections. The
> ten analytical section ids are unchanged, claims and dispositions remain keyed by section id,
> and the count remains 150. A claim is placed on its own section's heading inside whichever tab
> holds it. Investment Case and Entry are not analytical sections and carry no claim: their
> content is governed by the view store. Nothing in §1 to §5 changes.

It is your document and a frozen one, so this text is a decision for you (§9).

### 3.6 Tests that pin shape and claims, and what each asserts afterwards

| Test | Today | Afterwards |
|---|---|---|
| `registry.test.js` — tab count | Ten tabs, twelve where the market has a view; `home` first | Seven tabs with exactly the ids of §3.1 in every market; `case` first; every analytical section id belongs to exactly one tab; no `benchmark`, `debt` or `lab` |
| `section-shape.test.js` | No card-shaped spec; ≥ 10 sections a market; Finland builds twelve, all headed | Unchanged in substance, since sections are unchanged. Added: every section a tab lists exists, and every section has a heading once it shares a tab, because a headless section inside a stacked tab has no wrapper for its claim. Four markets give `home` no heading today and will gain one |
| `section-claim.test.js`, `wa-claims.test.js`, `claims.test.js`, `claim-evidence-resolution.test.js`, `source-review.test.js` | Keyed by section | Unchanged. That they do not change is the evidence for §3.2 |
| `claim-coverage.test.js` | Governed count out of 150 | Unchanged: it must count sections, and I will make it say so instead of counting `tabs` |
| `claim-registration.test.js` | Per-market registration | Unchanged |
| `routes.test.js` | Unknown tab falls back | Added: every row of §3.3 resolves, for every market, and the fallback still holds |
| `governance.test.js` | Reads the frozen document's counts | Whatever it pins about "ten" is restated as sections |

`docs/adding-a-market.md`, `docs/architecture.md` and the `_template` market are rewritten to the
seven-tab contract in the same change.

### 3.7 Where it sits in the order

After grading. Making `case` the landing tab in every market needs every market to have a case
to land on. For a market that is still waiting, the tab renders its triggers, a plain "not yet
graded" line and the old Overview content, so the seven-tab contract holds without inventing a
verdict.

---

## 4. Entry-adjusted return, and Gate G12

Everything here sits in `src/entry/`, beside the engine. It **calls** the engine and reads its
result; it changes no formula, no assumption and no number in `tests/baseline.test.js` or
`tests/current-model.test.js`, and a test will assert that a base case run before and after
loading the new module is identical.

### 4.1 What plan §4.4 asks for, and what can be computed

Four lines beside the asset IRR. Two of them need inputs nobody has: real build months and time
to first revenue (§0), and development cost to ready-to-build, which is gate G36 and is zero in
every market. So the plan's second line cannot be built as written. What can be built is the
same line **on stated inputs**, with the gap shown.

### 4.2 Inputs, and where each comes from

| Symbol | Meaning | Source |
|---|---|---|
| `F[0..]`, `eb[1..15]`, `net` | The engine's own capital flows, yearly operating cash and net capital, per MW in USD | `runCase`, unchanged |
| `capY`, `mchY`, `opex` | Secured, market and cost lines by year | `runCase` |
| `yC`, `yM`, `yO` | The exit yields, 6.5%, 10.5% and 7.0% | `assumptions.js`, unchanged |
| `S` | Non-refundable spend before the decision, per MW | The ledger: fee, study, land and consent items with `beforeFid` |
| `G` | Security and deposits pledged before the decision, per MW | The ledger: pledged items with `beforeFid` |
| `D` | Months from site control to ready-to-build, as a range | **New, stated per market**: a `timing` block on the ledger, `{ monthsToRtb: [min, max], buildMonths: [min, max] }`, each with a basis (published, observed, convention) and evidence, exactly as pathway durations are labelled. For the four corners I can draft it from their pathways' stage durations; for the eleven it is a stated range or it is absent |
| `B` | Build months, as a range | The same block. Replaces the uniform twelve for this calculation only |

A market with no `timing` block shows "not yet checked" on the lines that need it. It never
shows a number built on the seed.

### 4.3 The derivation

All per MW, in USD, on yearly periods, which is the engine's own grid. Let `d = round(D_mid ÷ 12)`
be whole years of development.

**Line 1 — asset IRR.** The engine's figure, as today.

**Line 2 — entry-adjusted IRR.** The IRR of one vector that starts at site control:

```
t = −d … −1     −S ÷ d                      development spend, spread evenly
t = −d          −G                           security posted at the start: the worst case
t = release     +G                           returned at the stage the ledger names
t = 0 …         the engine's vector for the same market with constructionMonths = B_mid
```

The last row is the engine run on a copy of the market with one input changed, through the
override path the Investment Lab already uses. So a longer build is priced by the engine's own
spend curve and start of operations, not by a second model. Reported for `[D_min, B_min]` and
`[D_max, B_max]` as a range, with the weakest basis among `D` and `B` named beside it.

Three things it deliberately does not do, each stated on the page:

- **It treats security as cash.** A bank guarantee costs a fee and not the principal, so this
  overstates the drag. The alternative is a guarantee fee rate, which is a methodology number
  you would have to give. I recommend cash, labelled "upper bound on the cost of security".
- **It spreads spend evenly** and posts security on day one, because there is no stage timing to
  place either (§0). Where a market has a critical path later, the same function takes dated
  flows.
- **`S` is only what the ledger holds.** Development cost in full is gate G36. So where the
  ledger has an unquantified item or the market has no development-cost source, the line reads
  "at most", because the true return can only be lower.

**Line 4 — implied ready-to-build value** (before line 3, which uses it). What a buyer pricing
on the engine's own exit yields could pay at the investment decision for a consented, connected
megawatt:

```
V_rtb = Σ capY[y] ÷ (1+yC)^y  +  Σ mchY[y] ÷ (1+yM)^y  −  Σ opex ÷ (1+yO)^y  −  net       y = 1…15
```

This is the engine's exit valuation taken at year 0, so it introduces no new rate. The
alternative is a hurdle rate per archetype, which is a discount rate and yours alone to write; I
recommend the yields until you want that. It inherits the fifteen-year window, so it is an
ordering until G12 closes, and a negative value is shown as negative: it says a buyer at those
yields would not pay for the project at all.

**Line 3 — break-even attrition.** A developer pays `S` and risks `G` on each attempt, and sells a
success at `V_rtb`. With `p` the share of attempts that fail and `f` the share of `G` forfeited on
failure:

```
expected value of one attempt = (1 − p) · (V_rtb − S)  −  p · (S + f·G)
break-even:                p* = (V_rtb − S) ÷ (V_rtb + f·G)
```

A check you can do by hand: with `V_rtb` = 100, `S` = 10, `G` = 30 and everything forfeited,
`p*` = 90 ÷ 130 = 69%. At that failure rate, of thirteen attempts four succeed and earn
4 × 90 = 360, and nine fail and lose 9 × 40 = 360. With no
security at all `p*` = 90%; with `V_rtb` at or below `S` it is zero and the page says the
programme does not pay even if nothing fails.

`f` is taken as 1 where the ledger's `lostIf` describes forfeiture on failure to proceed and is
shown as an assumption. Time value inside the development period is ignored in this line and
the page says so; it would lower `p*` slightly.

### 4.4 Where it is shown

- **Entry and delivery tab**: the four lines as a table, each with its inputs, the range and
  the "at most" and "not yet checked" markers. This is the only place the full table appears.
- **Investment case, developer verdict**: `V_rtb` and `p*` as two figures under "the return it
  reads". They are shown and they score nothing: making them score would be a change to
  `archetypes.js`, which is methodology and not proposed.
- **Finland**: withheld, like its asset return.

Not on the home page in this phase. The return-by-entry map keeps the asset IRR.

### 4.5 Gate G12 — what it is and what closing it requires

`docs/external-view.md` §5.5 and row G12: the engine prices fifteen years with no residual and no
augmentation, which is the largest single reason its absolute returns sit below published ones
(Great Britain at 10–12% and Germany four-hour at 13.7% are quoted on a 20 to 25 year life with
augmentation and a residual). The gate is "a terminal-value and augmentation treatment: a design
decision, not a data fetch". The main plan leans on it twice: asset return is graded by rank
"until G12 closes" (§3.5), and the implied ready-to-build value is "an ordering until that gate
closes" (§4.4).

Closing it takes four things, and only the second is engineering:

1. **A treatment, written by you.** The life (20 or 25 years), when augmentation falls and what
   it costs as a share of the battery block at that year's price, what happens to a contracted
   line after its term, and the basis for a residual. Each is a methodology number of the same
   class as `LIFE` and the exit yields.
2. **A long-life view beside the engine.** A module that takes the engine's result and extends
   it by that treatment, reporting a long-life hold IRR next to the fifteen-year one. `LIFE` does
   not move and no pinned number moves. The engine already reads an augmentation schedule that
   no market sets, so the extension follows its conventions.
3. **A reconciliation.** The long-life figures set against the published ones the external view
   quotes, with the remaining gap explained. Without this the gate is not closed, it is replaced
   by a second unvalidated number.
4. **The decision the gate exists for.** Whether asset return moves from rank to a level read
   against anchors. That means a new anchor set, which you write, and regrading asset return in
   all fifteen markets, **including the four corners**. I am not to change an existing grade
   there, and this is the reason I would not want to: it is a methodology change with a
   multi-market effect and it needs its own plan.

**What I propose for phase 5:** build item 2 as a parameterised module with your numbers from
item 1, show the long-life IRR beside the asset IRR on `/returns` and the Entry tab, and write
item 3. Leave rank grading as it is. G12 is then **part-closed**: the level is no longer
unexplained, and the choice to grade on it stays open and is yours. If you would sooner not set
the treatment now, the entry return ships without it and G12 stays open, with nothing blocked.

---

## 5. The bundle

**Where it stands.** Home first view 259.05 kB gzipped against 268; the `investment-method`
chunk 33.93 against 37. Both carry every graded market's whole view and whole ledger, because
the board calls `assessMarket` on the full records.

**What eleven more would cost.** A graded view file is 2.8 to 5.2 kB gzipped alone (3.0 for
Romania and Great Britain, 3.4 for Finland, 5.2 for Western Australia with its rule and held
layer) and a ledger file is 1.9 to 4.3 kB gzipped with its comments, so about 2 kB once
minified. That is an estimate of about 5 to 6 kB a market, not a measurement of a build; the
first thing PR 1 does is measure it. Eleven more is **+55 to +65 kB**: home at about 315 to 325 against 268, and the
method chunk at about 90 to 100 against 37. The method chunk's budget fails on the **first**
market graded and the home budget on the **second**.

Raising the budgets would be the thing the test's own header warns against. The bytes are
bilingual reasons, forfeiture terms and evidence lists that the board never prints.

**What I would do, before any market is graded.** The same move the scouting tier and the
changelog already made:

1. **A board projection, made at build time.** A Vite plugin reads `view/markets/` and the
   ledgers and emits only what the board computes with: for each market, the fourteen grades as
   numbers with any held grade and its review date; each verdict's call, route, review date,
   `changesIf` and score note; the triggers' ids, labels and dates; and each ledger item reduced
   to kind, amount and its two flags. About 0.7 to 1.0 kB a market. In plain Node, for the test
   suite, the same module computes the projection from the real files, and a test asserts the
   plugin's output equals it, so the board's tests go on running against real data.
2. **The whole view and the whole ledger travel in the market's own chunk**, registered when the
   dashboard loads, as claims and pathways already do. The Investment Case and Entry tabs read
   them from there.

**Expected result.** Home falls by about 18 kB for the four corners and rises by about 11 for
fifteen projections: roughly 250 with all fifteen graded, under today's figure. The method chunk
falls to the method alone. Each market chunk grows by 5 to 6 kB, so each market budget
is raised once by that amount, with the reason written beside it, and the home and method budgets
are **lowered** to about 12% above the new measurement. If a measurement comes out materially
worse than this I will stop and say so before grading anything.

`/changes` grows by design, about 0.2 kB a line. Eleven markets is roughly 200 lines and 40 kB,
so its budget rises from 27 to about 70, as its own note anticipates. It is fetched only on that
route.

---

## 6. Pull requests

Each ends at a state worth stopping in. "Sign-off" means before it is built, beyond approving
this plan.

| # | Contents | Stops at | Sign-off needed |
|---|---|---|---|
| 1 | The board projection and per-market registration of views and ledgers (§5). The quintile check of §8. No content changes | Same pages, smaller home, budgets lowered | None beyond this plan |
| 2 | Wave 0: Germany. Its ledger, its new register entries, the sheet tooling, then its view records, Investment Case and Entry tabs | Five markets graded; the sheet format proven | **Your answers to Germany's sheet**, before the writer runs |
| 3 | Wave 1: it, pl, ie, the same way | Eight graded | **Three sheets** |
| 4 | Wave 2: nem, pjm, ercot, caiso | Twelve graded | **Four sheets** |
| 5 | Wave 3: the three Japanese areas | Fifteen graded, if every sheet was answered in full | **Three sheets** |
| 6 | Entry-adjusted return (§4.1 to §4.4): the `timing` block, the module, the Entry tab table | Four lines beside the asset IRR wherever inputs exist | **The derivation in §4.3 and its three choices** (§9) |
| 7 | Tabs to seven: containers, alias map, score tables retired, PILOT-FROZEN amended, documents rewritten (§3) | Seven tabs everywhere; old links resolve; claims untouched | **The amendment text and the decision not to re-key** (§9) |
| 8 | G12 long-life view and its reconciliation (§4.5) | G12 part-closed | **The treatment**: your numbers. Without them this PR is not opened |

PRs 6 and 7 do not depend on each other; 6 can go any time after 1. A wave whose sheet is only
partly answered still merges for the markets that are complete.

---

## 7. Pinned tests I expect to change, and why

| Test | Change | Why |
|---|---|---|
| `bundle-budget.test.js` | `home` and `investment-method` lowered; each market budget raised by 5–6 kB; `changes` raised; the new projection asserted absent of reasons and forfeiture text | §5 |
| `verdict-board.test.js` | "four of them are graded" becomes the count on the graded list, wave by wave; "a market that has not been graded shows its return and no verdict" moves to a fixture once no real market is ungraded; a new test that the projection equals the full record on every field the board reads | §1, §5 |
| `view.test.js` | The registry list checks follow the new registration. **The fourteen-dimension test, the Western Australia case and the one-writer test are not touched** | §1.6, §5 |
| `registry.test.js` | Tab count: twelve for each market as it is graded (the test already says so and needs no edit until PR 7), then seven for all | §3 |
| `section-shape.test.js` | Additions only, as §3.6 | §3 |
| `routes.test.js` | Alias rows added | §3.3 |
| `entry-ledger.test.js` | Ledger list grows; new tests for the `timing` block and for the entry return, including that the engine's base case is unmoved | §2, §4 |
| `claim-coverage.test.js` | Counts sections instead of tabs; the number does not change | §3.2 |
| `governance.test.js` | The new methodology files (the G12 treatment, and any rate in §4) are added to `METHODOLOGY_SURFACES`. That edits `authority.js` by adding a protected surface. It widens what automation may not touch and changes no right, but it is governance code, so it is named here | §4.5 |
| Any test reading a market's `score.composite` or its component table | Follows the table's retirement in PR 7, for graded markets only | §3.4 |

**Not changed by anything in this plan:** `baseline.test.js`, `current-model.test.js`,
`scout.test.js`, `rules.test.js`, `view-automation.test.js`, `etl-boundary.test.js`,
`held-grade.test.js`, `private-notes.test.js`, the claim tests named in §3.6, both live lists,
every rights table, the gates, `agent/`, and the workflow's permissions.

## 8. What I believe cannot be built as written

1. **§8's exit condition cannot be met by building.** About sixty grades have no public basis
   (§1.2). It is met when you answer the sheets.
2. **§4.4 line 2 as written** ("real build months… revenue delayed by the time to first
   revenue") needs §4.3's critical path, which was not built in phase 1, and gates G36 and G37.
   Built on stated ranges instead (§4.2), marked where it is a bound.
3. **§6.2's exposure curve** needs stage timing for the same reason. Not proposed in this phase.
4. **§3.5, "until G12 closes"**: closing it in the sense that sentence means regrades asset
   return in the four corners and needs a new anchor set. Part-closed here (§4.5).
5. **§6.2, "claim keys migrated"**: I recommend they are not (§3.2).
6. **§3.5's rank grade has no code behind it.** I propose a test, in PR 1, that every stored
   asset-return grade with a derived basis equals the engine's quintile by the convention in §0.
   It passes today for wa, gb and ro. It would turn a silent drift into a red build whenever an
   assumption change reorders the markets, which is when you would want to know. It reports; it
   writes nothing.
7. **"All with ledgers"** is met in form. Several ledgers will be lower bounds and one or two
   nearly empty, and each will say so in its `limit`. A full ledger for most of these markets is
   gate G34 and needs a proponent's disclosure.
8. **Japan's Investment Case tab** has to switch by area inside one dashboard. Buildable, and
   different from every other market.

---

## 9. Decisions this plan needs from you

1. **The review method** (§1.4): one sheet per market answered in session, in the waves of §1.5,
   Germany first. And that a market with an unanswered dimension waits (§1.6).
2. **Whether I source foreign entry, origin rules and demand from primary pages** (§1.2), adding
   them to the registers, or whether you would sooner grade those as practitioner judgement.
3. **Germany's connection contribution** (§2): capital at risk before the decision, or a cost of
   connecting that falls after it.
4. **Claims are not re-keyed; a tab becomes a container of sections** (§3.2), and the amendment
   text for PILOT-FROZEN.md (§3.5).
5. **Revenue keeps its sub-strip** instead of stacking four sections (§3.3).
6. **Score tables are deleted at the merge, for graded markets only** (§3.4).
7. **Entry return, three choices** (§4.3): security treated as cash; the buyer priced on the
   engine's exit yields and not on a hurdle rate; forfeiture taken as total where the ledger
   describes it.
8. **G12** (§4.5): give the treatment now and I build the long-life view in PR 8, or leave the
   gate open and ship without it. Either way rank grading stays.
9. **The bundle remedy and the PR split** (§5, §6), including lowering the two budgets.
10. **The quintile test** (§8 item 6).
