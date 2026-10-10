# Investment view revision plan — 2026-10-10

**Status: proposal for sign-off. Nothing in this document is implemented.**

The platform prices a battery well and says almost nothing about whether a given investor can get
in, what it costs them before the first dollar of revenue, or whether the case will still stand in
five years. This plan turns it from a knowledge base into a tool that takes a position: a verdict
per market for each of four kinds of investor, resting on a visible score, kept current by rules
and by an AI agent.

Seven moves, in the order they are argued below:

1. **Grade every market on twelve non-return dimensions**, against written anchors that mean the
   same thing in every market (§3).
2. **Read those grades through four investor archetypes.** The same market can be right for one
   and closed to another, which is the Western Australia case (§3.4).
3. **Quantify entry where public sources allow**: capital at risk before financial close, the
   size of the cheque, months to first revenue (§4).
4. **Open on verdicts, not IRRs.** The home page becomes a verdict board; the league table and
   the $1M engine move to a Returns view (§6.1).
5. **Rebuild the market dashboard around the decision**: an Investment Case tab first, an Entry
   and Delivery tab, seven tabs instead of ten (§6.2).
6. **Add a scouting tier** of verdict cards for markets with no dashboard, so the platform can
   screen about thirty markets instead of going deep on fifteen (§6.4).
7. **Reverse the automation rule.** Rules and an AI agent may change verdicts, thesis text,
   grades and model assumptions directly, live, recorded in a changelog (§7).

The seventh is the largest change in the platform's history and the one most worth reading
slowly. It replaces a guarantee the test suite enforces today.

---

## 1. Decisions already taken

Settled in conversation on 2026-10-10. Recorded so this document stands on its own.

| Question | Decision |
|---|---|
| Who the advice is for | You, as a private decision tool. The personal-study licence posture is unchanged |
| Whose point of view | Four investor archetypes: large strategic balance sheet, infrastructure or PE fund, foreign first-time entrant, developer or early-stage capital |
| Point of entry | Tied to each archetype, not a separate axis |
| Form of the advice | A verdict, with a transparent dimension score beneath it |
| How a verdict relates to its score | You set the verdict; the score checks it and flags disagreement |
| How non-return factors enter | Graded ratings everywhere, plus hard numbers where public evidence supports them |
| Dimensions | Sunk cost, approval transparency, build time, policy stability, grid-connection scarcity, foreign-entry barriers, future demand, exit liquidity, debt availability, supply-chain and origin rules, scale and repeatability |
| Publication | Verdicts and publicly sourced grades publish. Experience-based reasons and deal-derived numbers stay in the local folder |
| Bold moves in scope | Verdict-first home page, restructured tabs, retiring the status chip and composite score, a scouting tier |
| Automation | Rules written in advance **and** an AI agent |
| What automation may change | Verdict and market status, thesis text, dimension grades, model assumptions |
| What stays yours alone | Scoring weights and discount rates |
| How a machine change is released | Live at once, changelog only, no marking on the page |
| First markets | Western Australia, Finland, Great Britain, Romania |
| Scouting regions | Nordics and Baltics, Southern and Eastern Europe, the Americas and Middle East |

---

## 2. Diagnosis — why the app cannot answer "should I enter?"

Every figure in this section comes from the repository as it stands on `main` today.

### 2.1 The verdict layer does not discriminate

Run the comparison engine at the default exit year and set the result beside the app's own
judgement fields:

| Market | Hold IRR | Exit IRR | Secured share / tenor | Status | Composite | Evidence |
|---|---|---|---|---|---|---|
| Romania | 20.8% | 25.2% | 0% / – | Selective | 61 | 4/10 |
| Italy | 15.4% | 18.4% | 20% / 15 yr | Selective | 63 | 8/10 |
| Germany | 14.6% | 16.4% | 0% / – | Selective | 62 | 6/10 |
| Western Australia | 13.1% | 16.4% | 77% / 10 yr | Selective | 59 | 7/10 |
| Ireland | 9.6% | 10.2% | 55% / 10 yr | Selective | 60 | 7/10 |
| Japan (three areas) | 7.4–7.5% | 8.0–8.1% | 0% / – | Selective | 49–60 | 4–5/10 |
| Great Britain | 4.7% | 1.3% | 10% / 15 yr | Selective | 57 | 8/10 |
| CAISO | 3.2% | 0.7% | 0% / – | Selective | 53 | 6/10 |
| NEM | 3.1% | 0.5% | 0% / – | Selective | 58 | 6/10 |
| PJM | 2.4% | −2.3% | 47% / 1 yr | Selective | 54 | 7/10 |
| Poland | 0.8% | −5.7% | 0% / – | Selective | 60 | 7/10 |
| ERCOT | −5.9% | −12.3% | 0% / – | Watch | 52 | 5/10 |
| Finland | withheld | – | – | Research | 48 | 3/10 |

Hold IRRs span 27 points. Thirteen of fifteen markets carry the same word, and the composite
scores sit between 48 and 63. `docs/comparison-methodology.md` already says why: each market
scores itself on its own basis, so the scores are not comparable and the league table hides the
row. A verdict that cannot separate Romania from Poland is not a verdict.

### 2.2 The ranking runs against where capital actually goes

The three deepest storage markets on the platform — Great Britain, the NEM and the United
States — account for five of the six lowest returns. `docs/external-view.md` §2.3 records investors
naming the US and UK as their preferred markets, and §2.4 records Great Britain leading
European debt deals by count. The engine is not wrong about what it measures. It measures one
thing, and capital is responding to several others.

### 2.3 Entry is modelled as identical everywhere

All fifteen comparison files carry the same three seeds:

```javascript
constructionMonths: 12,   devCostPct: 0,   rtbPremiumPct: 0,
```

The channel for a longer build already exists in `src/comparison/capex.js`. It is unused, so
the model says a seven-hour project behind an annual capacity calendar and a two-hour modular
project reach revenue on the same day, and that getting either to ready-to-build cost nothing.

### 2.4 The $1M engine removes the size barrier by construction

Normalising to one million dollars is what makes returns comparable, and it is also what erases
the difference between a market you can enter with a small cheque and one you cannot. Multiply
each archetype's size by its own cost and the difference is the largest spread on the platform:

| Market | Reference project | Project cost, USD |
|---|---|---|
| Western Australia | 200 MW · 7h | ≈ 432m |
| NEM | 280 MW · 4h | ≈ 256m |
| CAISO · PJM · Japan · Great Britain | 50–100 MW · 4–6h | ≈ 103–120m |
| Poland · Germany · ERCOT · Italy | 100 MW · 2–4h | ≈ 86–94m |
| Ireland | 50 MW · 4h | ≈ 56m |
| Romania | 50 MW · 2h | ≈ 31m |
| Finland | 50 MW · 2h | ≈ 21m |

Western Australia's reference project costs about twenty times Finland's. The archetype is a
modelling choice, not a measured minimum, but it follows what each market treats as normal: the
WA size is the regulator's own 200 MW benchmark facility, and the Finnish one sits inside the
announced two-hour fleet. Nothing on the home page shows this number.

### 2.5 The entry facts exist, in five shapes, in five places

| Market | What the repository already holds | Where |
|---|---|---|
| Romania | A full "capital at risk before financial close" card: €20,000/MW auction guarantee, €30/kW establishment guarantee, 20% of the connection tariff | `ro/sections.js`, grid tab |
| Japan | TEPCO's 10% connection deposit and a first contribution of at least 50% | `jp/regions.js`, noted as not modelled |
| Germany | Construction-cost contribution of €110–165k/MW and a realisation deposit | `de/data.js` |
| Poland | "Deposits, securities and release path" as one weighted line in a risk score | `pl/data.js` |
| Great Britain | Security caps discussed as a lesson from one delayed connection | `gb/gridSection.js` |
| Western Australia | Nothing on security or guarantees | – |
| Finland | Nothing on fees, security, foreign entry or data-centre demand | – |

The two markets you named are the two rows with nothing in them. The build-pathway model
added in round 4 is the right foundation: nine stages, who can stop you at each, and explicit
gating rules. It covers two of fifteen markets, sits at the foot of the Grid tab, labels cost
only as "Development" or "Capex", and deliberately publishes no elapsed total.

### 2.6 Nothing structured looks forward

Nine dated events that could still move a verdict are already written down, as prose inside
`decisionProfiles.js`: the Romanian grant call closing 30 October 2026, the second MACSE
auction on 24 November, the PJM auction in December, Japan's Round 4 bids ending 3 February
2027, the German capacity round in May 2027, the DS3 long-stop on 30 September 2027, and three
more. None is a field, so nothing can list them, sort them or act on them. Demand from data
centres is modelled in ERCOT and PJM, cited in Great Britain and Ireland, and absent from
Finland.

### 2.7 Four decision modules are written and not mounted

`refinementOverview.js` (an "IC decision surface"), `findings.js`, `valueDriverHeatmap.js` and
`regionalStrip.js` are exported from `src/home/` and imported by nothing. About 530 lines of
decision-facing work render nowhere. §6.1 either mounts or deletes each.

### 2.8 In one sentence

The app prices the asset. It does not price the entry, and it has no notion of who is asking.

---

## 3. The model — four questions, twelve grades, four investors

### 3.1 Four pillars

An entry decision asks four things. The engine answers the first.

| Pillar | Question | Dimension | A number, where one exists |
|---|---|---|---|
| **Return** | What does the asset pay? | Asset return | Hold and exit IRR, base and bull — existing engine |
| | | Revenue certainty | Secured share and tenor — existing engine |
| **Entry** | What does it take to get in? | 1 · Capital at risk before FID | USD per MW and per project; security posted, when, and how it is lost |
| | | 2 · Approval transparency | Share of pathway stages with a published timeframe; count of published gating rules |
| | | 3 · Time to first revenue | Months, as a critical-path range; calendar gates |
| | | 4 · Grid-connection scarcity | Queue against built; moratoria; connection auctions |
| | | 5 · Foreign-entry barriers | Screening thresholds, land rules, licensing |
| | | 6 · Supply-chain and origin rules | Rules restricting equipment or ownership by origin |
| **Durability** | Will the case still stand in year five? | 7 · Policy stability | Changes to the main revenue mechanism in five years; dated changes pending |
| | | 8 · Demand growth | Signed against enquired load, including data centres |
| | | 9 · Saturation | Competing storage against the demand it competes for — existing evidence |
| **Capital** | Can I finance it, grow it and sell it? | 10 · Debt availability | Deal count, gearing and tenor on offer |
| | | 11 · Exit liquidity | Assets and platforms actually traded |
| | | 12 · Scale and repeatability | Headroom for a second and tenth project |

Saturation is the one dimension you did not name. It is included because the platform already
measures it and because it is the counterweight to demand growth: Finland is where the two pull
hardest against each other (§5.3).

**The pillars are never blended into one market-level number.** That is the mistake §2.1
documents. They are shown side by side, and only an archetype turns them into a single score.

### 3.2 Anchored grades

Each dimension is graded 1 to 5 against anchors written once and applied to every market. The
anchors are what make a 2 in Romania mean the same as a 2 in Japan. Two drafts, to show the
intended precision:

**Capital at risk before FID** — non-refundable spend plus security posted, for the reference
project.

| Grade | Anchor |
|---|---|
| 5 | Under 0.5% of project cost, and nothing posted as security |
| 4 | 0.5–1.5%, refundable deposits only |
| 3 | 1.5–3%, or security posted only after consent is in hand |
| 2 | 3–6%, or security posted before consent or before capacity is certain |
| 1 | Over 6%, or security forfeitable on events the sponsor does not control |

**Approval transparency**

| Grade | Anchor |
|---|---|
| 5 | Process, gating rules and timeframes published by the operator; queue and available capacity public; outcomes appealable |
| 4 | Process and gating rules published; timeframes indicative; capacity published by region |
| 3 | Process published; timeframes and queue not; outcomes depend on bilateral negotiation |
| 2 | Process changes between rounds, or material discretion with no published criteria |
| 1 | No published process, or a moratorium with no stated end |

The other ten sets of anchors are Phase 0 work and are yours to write (§8). They are
methodology: no automation may change them.

### 3.3 What a grade is

```javascript
{
  dimension: 'capitalAtRisk',
  grade: 2,                          // 1–5 against the anchor
  metric: { perMW: 80600, perProject: 16100000, shareOfCost: 0.037, currency: 'USD' },
  trend: 'stable',                   // improving · stable · deteriorating, over 24 months
  trendCause: ['…', '…'],            // the named reason, bilingual
  basis: 'official',                 // official · third-party · derived · practitioner
  evidence: ['wa-aemo-rcs'],         // source-register ids, as claims already use
  reason: ['…', '…'],                // public, bilingual
  asOf: '2026-10-10',
  author: 'analyst',                 // analyst · rule · agent — recorded, not displayed
  lockedUntil: null,
}
```

Three things in that shape matter.

**The metric sits beside the grade, not inside it.** §5 shows why: Western Australia's security
is a smaller share of project cost than Romania's, and six times larger in dollars. A grade
alone would rank WA as the easier market. Both numbers are kept and the archetype decides which
one binds.

**`practitioner` is a legitimate basis.** A grade that rests on your deal experience is
published as a grade, with its basis shown as practitioner judgement. The reason and any
deal-derived number live in the private overlay (§6.5). This is how "public verdicts, private
notes" works at the level of one cell.

**The evidence format is the one the claim pilot froze.** Publisher, date, locator, what the
record establishes and what it does not. Nothing new is invented for sourcing.

### 3.4 Four archetypes

A grade describes the market. An archetype is how one kind of investor reads it. The values
below are **drafts for you to overwrite** — they are your judgement, classified as methodology,
and human-only by your decision.

| | Strategic | Infrastructure fund | Foreign first-timer | Developer |
|---|---|---|---|---|
| Who | Utility, major IPP, state-backed sponsor | Infrastructure or PE fund | First deal in the market, no local team | Early-stage capital that sells at ready-to-build |
| Enters at | Any stage | Ready-to-build or operating | Ready-to-build or operating, usually with a partner | Greenfield |
| Return it reads | Hold IRR | Exit IRR and a levered check | Exit IRR | Development multiple and time to ready-to-build |
| Cheque it writes, USD | 100m–1bn | 30–300m | 20–150m | Sells before the build |
| Capital it will risk before FID | Up to 50m | Up to 5m | Up to 3m | Up to 3m a project |
| What shuts it out | An origin or ownership rule it cannot meet | No debt market; no secured revenue route anywhere in the market | Foreign control barred or decided case by case; unpublished process; no partners | Security before consent above USD 3m; no obtainable connection; more than four years to ready-to-build |

**Scarcity reads in opposite directions.** A scarce grid connection is a barrier to the
first-timer, the thesis for the developer who can still secure one, and protection for the fund
that already owns one. So an archetype does not hold a weight per dimension; it holds a small
table that says what each grade is worth to it:

```javascript
reads: {
  gridScarcity: { 1: KNOCK_OUT, 2: 60, 3: 100, 4: 70, 5: 40 },   // developer: rationed but obtainable is best
  capitalAtRisk: { 1: 5, 2: 20, 3: 60, 4: 90, 5: 100 },          // scores only; the dollar limit shuts out
}
```

**Amended 2026-10-10, after the Phase 0 draft.** Three readings changed from the first version
of this section, and the code in `src/governance/archetypes.js` follows them.

- **The developer's capital-at-risk grade no longer knocks out.** §5.3 argues the barrier is
  absolute, not relative, and a knock-out on the grade contradicted that: Romania's share of
  cost grades 1 while its dollar figure sits inside the developer's limit. The grade now only
  scores and the limits in dollars do the shutting out. The cost is that grade 1 also covers
  security forfeitable on events the sponsor does not control, which no longer closes a market
  by itself.
- **The first-timer is knocked out by foreign-entry grade 1 only.** Grade 2, a screening with
  no statutory deadline or no published criteria, is common in mature markets. It is a delay
  risk and reads as a low score.
- **"No partners" is not a dimension.** No public fact exists that an anchor could be checked
  against. It surfaces through the "not accessible with no knock-out" flag in §3.6, with the
  reason kept in the private overlay.

**Limits belong to a route.** Capital risked before FID, security before consent and months to
ready-to-build bind an investor that originates a project. The cheque binds whoever funds a
whole project. Neither binds a co-investor. That is what lets Western Australia be closed to a
fund at origination and open to it behind a strategic (§5.2).

### 3.5 From grades to a score

```
utility(a, d)      = a.reads[d][ grade(d) ]                    0–100, or KNOCK_OUT
pillarScore(a, P)  = Σ a.weight[d] · utility(a, d) / Σ a.weight[d]     over dimensions in P
fit(a)             = Σ a.pillarWeight[P] · pillarScore(a, P)
ceiling(a, route)  = NOT_ACCESSIBLE  if any utility is KNOCK_OUT,
                                     or any metric breaches a limit that binds on that route
```

Three rules sit around the arithmetic, added on 2026-10-10 with the Phase 0 draft:

- **A knock-out counts as zero inside the score, and the score is then not the headline.** It
  is still shown, because it says how the rest of the market reads, but a page leads with the
  ceiling whenever one applies.
- **An ungraded dimension leaves its pillar and the fit unscored.** Nothing is rescaled around
  the gap. Where no public evidence exists, as for exit liquidity and foreign entry today, the
  dimension is filled with a practitioner grade.
- **A missing metric is "unchecked", which is neither a breach nor a pass.**

**A barrier is a threshold, not a weight.** This is the single most important design choice in
the plan. "Only large players can do this" cannot be expressed by a weighted average, because a
strong return will always average the barrier away. A knock-out cannot be outvoted.

`a.limits` applies to the metrics directly: the developer's limit on security posted before
consent is compared with the dollar figure, not with the grade.

**Return is graded by rank, for now.** `docs/external-view.md` §5.4 records that the engine's
absolute returns sit below published ones by design — a fifteen-year window with no residual —
and tells the reader to trust the ordering, not the level. A hurdle needs a level. Until gate
G12 (terminal value and augmentation) closes, asset return uses each market's quintile in the
set. Advice makes G12 necessary where research could leave it open; §8 brings it forward.

**Revenue certainty is not ranked.** Amended 2026-10-10: secured share and tenor are levels the
engine already trusts, so the dimension has absolute anchors like the other twelve. Grades 5 to
2 describe the reference project; grade 1 says no secured revenue route exists in the market at
all, and that is the fund's knock-out. A rank-graded dimension can never carry one, because the
bottom fifth exists in every set. Two rulings fix what "secured" means:

- an optimiser or offtaker floor is a secured route, as a toll or a capacity contract is;
- a floor counts at the level of the floor. Secured share is guaranteed revenue over expected
  base-case revenue, so a floor on every megawatt at half of expected revenue is a secured
  share of one half.

### 3.6 The verdict

Six words. "Selective" is retired because it is where everything went to hide.

| Verdict | Meaning |
|---|---|
| **Enter now** | Clears this archetype's bar today and the window is open |
| **Build position** | Attractive, but entry takes time: secure sites, capacity or partners now, commit capital on a named trigger |
| **Opportunistic** | Only specific situations: a named sub-region, a contracted asset, a motivated seller |
| **Wait** | Not now. Carries a named trigger and a date |
| **Avoid** | A structural mismatch with no trigger inside the horizon |
| **Not accessible** | A knock-out applies. The market may be good; it is not open to this investor |

"Not accessible" and "Avoid" are different statements and the page must keep them apart. The
first is the Western Australia answer for a small developer.

```javascript
{
  archetype: 'developer',
  call: 'not-accessible',
  route: 'greenfield',                 // greenfield · ready-to-build · operating · co-invest
  where: null,                         // a sub-region, when the call is regional
  because: [ { dimension: 'capitalAtRisk', text: ['…','…'] }, … ],   // at most three
  despite: ['…','…'],                  // the strongest argument against the call
  changesIf: [ 'wa-capacity-credits-2026', 'wa-clean-energy-link' ], // trigger ids
  reviewBy: '2027-01-31',
  author: 'analyst', asOf: '2026-10-10', lockedUntil: null,
}
```

**You set it, the score checks it.** Score bands map to verdicts (75 and above Enter now, 60–74
Build position, 45–59 Opportunistic, 30–44 Wait, below 30 Avoid). A verdict more than one band
from its score renders a short "verdict and score disagree" line that must carry a reason. The
band is a check on the author, never a rule that sets the call.

Three further disagreements are flagged, added on 2026-10-10 with the Phase 0 draft. A
knock-out is checked before any band and overrides any score.

| Flag | Fires when |
|---|---|
| Knock-out ignored | A knock-out or a breached limit applies and the verdict is anything but Not accessible |
| No knock-out | The verdict is Not accessible and nothing in the grades or metrics says why. The author knows a barrier the model does not hold, which is what to add next |
| Unchecked limit | The verdict is Enter now and a limit on its route has no figure to be compared with. Nobody has looked yet |

`despite` is required. A verdict with no counter-argument recorded is an assertion.

### 3.7 Triggers and trends

A trigger is a dated or measurable event that would move a verdict or a grade. It is a record,
not a sentence:

```javascript
{
  id: 'fi-fdi-act-in-force',
  kind: 'event',                       // event · data
  market: 'fi',
  expected: '2027-04',                 // month precision is enough
  watches: ['foreignEntry'],
  direction: 'down',
  source: 'fi-krogerus-fdi-2026',
  effect: null,                        // or a pre-written change — see §7.3
}
```

Triggers feed three things: the "changes if" line under each verdict, a cross-market calendar on
the home page, and the rules engine. The nine events in §2.6 are the first entries; migrating
them out of prose is a day's work and immediately useful.

---

## 4. Entry economics — the quantified half

A new layer, `src/entry/`, beside the comparison engine and never inside it. The frozen
formulas and `tests/baseline.test.js` are untouched by everything in this section.

### 4.1 The capital-at-risk ledger

One schema for what §2.5 found in five shapes:

```javascript
{
  marketId: 'ro',
  basis: { powerMW: 50, durationHours: 2 },     // the comparison archetype, always
  items: [
    { id: 'auction-guarantee', kind: 'security',        // fee · study · land · consent · security · deposit
      amount: { perMW: 20000, currency: 'EUR' },        // the one sourced value here; the rest shows shape
      postedAt: 'application',                          // a build-pathway stage id
      releasedAt: 'entry',
      form: ['…', '…'],
      lostIf: ['…', '…'],
      refundable: true,
      evidence: ['anre'], status: 'verify' },
  ],
}
```

From it the layer derives capital at risk per MW, per project and as a share of project cost;
the peak exposure and the stage at which it occurs; and the carrying cost of posted security.
`postedAt` and `releasedAt` are pathway stage ids, which ties the ledger to the timeline and
makes the exposure curve in §6.2 possible.

### 4.2 The size of the cheque

`projectCost = archetype.powerMW × capexPerMW × fx`, already computable (§2.4), shown on every
market card and compared against the archetype's range. Add one analyst field,
`minimumViableMW`, with evidence, for markets where a rule or a connection voltage step sets a
real floor below the archetype.

### 4.3 Time to first revenue

The pathway panel refuses to publish an elapsed total, and the reason it gives is correct: an
earlier version summed sequential stages and dropped parallel ones, which is not a critical
path. The objection is to the method. The fix is to do it properly:

- each stage declares `after: [stageId, …]` — finish-to-start edges, each labelled with its
  basis exactly as durations are;
- earliest-finish is computed as the longest path, giving a minimum and maximum in months;
- **calendar gates** are first-class. WA's capacity cycle is one: miss the date and the answer
  is twelve months, not a slip of weeks;
- the result is reported as a range, the weakest duration basis anywhere on the critical path,
  and the single stage that contributes most.

A total resting mostly on convention says so in the same breath. That keeps the honesty the
panel was protecting.

### 4.4 Entry-adjusted return

Shown **beside** the asset IRR, never replacing it:

| Line | What it adds |
|---|---|
| Asset IRR | Today's number: ready-to-build, twelve-month build, nothing spent beforehand |
| Entry-adjusted IRR | Real build months, development spend on its actual timing, the carrying cost of security, revenue delayed by the time to first revenue |
| Break-even attrition | The share of development attempts that can fail before the expected value turns negative |
| Implied ready-to-build value | What a buyer at its hurdle could pay for a consented, connected MW: the asset's value less its build cost |

Break-even attrition is reported because the true attrition rate is unpublished everywhere. The
rate at which a development programme stops paying is computable from what the platform has,
and a reader can judge whether real attrition is above or below it.

Implied ready-to-build value is the developer archetype's return and, as a by-product, a price
for connection scarcity in each market. It leans on the level of the asset IRR, so it inherits
the G12 caveat and should be read as an ordering until that gate closes.

### 4.5 What stays unquantified, as named gates

Following the platform's own convention. Proposed additions to `docs/external-view.md` §6:

| Gate | Closes | Where to get it |
|---|---|---|
| G34 | Security and guarantee amounts under each market's connection contract | Operator contribution and security policies; a proponent's disclosure |
| G35 | Development attrition by market: applications that reach operation | Queue registers with dated status changes; GB's TEC register is the nearest |
| G36 | Development cost to ready-to-build, per MW | Replaces the zero `devCostPct` seed. Related to G25 |
| G37 | Build programme by market and duration | Replaces the uniform twelve months. Related to G26 |
| G38 | Traded-asset and platform transactions by market | The evidence for exit liquidity |
| G39 | Investment-screening thresholds applying to storage, by market | Statute and regulator guidance |

---

## 5. Worked example — the four corners

**A draft to be overwritten.** Verdicts here are illustrations of the framework, not positions.
Provenance is marked on every fact: **R** repository, **W** checked on the web on 2026-10-10,
**D** derived in this document, **Y** your statement, still to be sourced.

### 5.1 Side by side

| | Western Australia | Finland | Great Britain | Romania |
|---|---|---|---|---|
| Hold / exit IRR | 13.1% / 16.4% **R** | Withheld **R** | 4.7% / 1.3% **R** | 20.8% / 25.2% **R** |
| Secured share / tenor | 77% / 10 yr **R** | None | 10% / 15 yr **R** | None **R** |
| Reference project | 200 MW · 7h, ≈ USD 432m **D** | 50 MW · 2h, ≈ USD 21m **D** | 100 MW · 4h, ≈ USD 103m **D** | 50 MW · 2h, ≈ USD 31m **D** |
| Security before revenue | Reserve Capacity Security: 25% of the peak benchmark price for each MW certified **W**. About A$122k/MW, or A$24m on the reference project **D**. Network-works security on top **Y** | None found. The connection application is free and names no deposit or security **W**. A fixed connection fee falls due at signing and is not refunded; amount not found **W** | Not sourced | €20,000/MW and €30/kW, about €2.5m on the reference project, plus 20% of the connection tariff **R** |
| Share of project cost | ≈ 3.7% **D** | ≈ 0% before the connection agreement **D** | – | ≈ 8.8% **D** |
| Published fees before an offer | A$5k application, A$25k options assessment, A$55k offer preparation; studies extra **W** | None **W** | Not sourced | Not sourced |
| Needed before the connection contract | No consent prerequisite; performance-standards submission only after the access-contract application **R** | Binding land-use plan and building permit before applying; the operator's reply lapses in two months **W** | Gate 2 readiness **R** | Winning a connection auction, for 5 MW and above **R** |
| Calendar gate | Annual capacity cycle; a missed cycle costs a year **R** | None; reserve prequalification per product **R** | Annual capacity auction **R** | Zonal capacity published each January **R** |
| Grid scarcity | Access quantities cap export; relief dated 2029 **R** | South closed to new storage until 2029, north open **R**. 32 GW of storage enquiries in twelve months; about 4 GW of storage agreements signed **W** against about 1.05 GW connected **R** | 177 GW forward against 3.6 GW built **R**. About 14.8 GW of batteries beyond the 2030 range already hold Gate 2 **W** | Constanța and Dobrogea full; access by auction **R** |
| Demand | An illustrative large-load watchlist **R** | Data centres with signed connections exceed 3 GW; about a third of some fifty new agreements **W** | A governed data-centre demand series **R** | – |
| Dated events ahead | Capacity Credit assignment; Clean Energy Link **R** | Grid-priority bill due autumn 2026; operator tariff decisions by end 2026; new screening act planned spring 2027 **W** | Possible limit on Gate 2 progression to revenue-supported batteries **W** | Grant call closes 30 October 2026 **R** |
| Foreign entry | Not sourced | Greenfield projects sit outside today's screening act. The draft act covers greenfield storage from 100 MW and treats EU investors as foreign **W** | Not sourced | Not sourced |
| Capital | Not sourced | Not sourced | Led European debt deals by count in Q3 2026; tolls are the most common revenue model behind European deals **R** | Not sourced |

### 5.2 Draft verdicts

| | Strategic | Infrastructure fund | Foreign first-timer | Developer |
|---|---|---|---|---|
| **Western Australia** | Build position — the one archetype that can carry both the security and the cheque, for the most secured revenue on the platform | Opportunistic — buy in after Capacity Credits are assigned, behind a strategic | Not accessible at origination — co-investment only | Not accessible — security before revenue exceeds its limit |
| **Finland** | Build position — a platform north of the restriction, alongside data-centre load | Opportunistic — no contracted line; needs an optimiser floor | Enter now — small cheque, no security, a published process; the door narrows in 2027 | Build position — connection capacity outside the south is the scarce asset |
| **Great Britain** | Build position — the long-duration cap-and-floor route | Opportunistic — operating assets with a toll; the deepest debt and exit market | Opportunistic — acquisitions only; the most standardised documents | Wait — queue rules tightening against new batteries |
| **Romania** | Opportunistic | Wait — nothing secured and little exit evidence | Wait — connection rules still moving | Opportunistic — auction entry, with guarantees near 9% of cost |

### 5.3 What the example shows

**Your Western Australia point falls out of the numbers.** The asset has the highest secured
share on the platform and the fourth-highest return. Three of four archetypes cannot originate
there. The app says "Selective" to all of them.

**The barrier is absolute, not relative.** WA's security is about 3.7% of project cost and
Romania's about 8.8%, so a percentage ranks WA as the easier market. In dollars WA asks for
roughly USD 16m against Romania's 2.7m, because the project is fourteen times larger. Both
figures must be kept, and the archetype's own limit must be compared with the dollar one.

**Your Finland point also falls out, with a date on it.** A cheque a twentieth the size of
WA's, a free application, no security found and a published process. But the draft screening act
planned for spring 2027 would cover greenfield storage from 100 MW and treat EU investors as
foreign, and a grid-priority bill is due this autumn. "Low barriers for foreign investors" is
true today and scheduled to change. A knowledge base records the first half. An advice tool
needs the trigger.

**Finland's weak pillar is durability, and data centres do not simply fix it.** About 4 GW of
storage connection agreements are signed against fast-reserve obligations the repository puts
at about 795 MW. More than 3 GW of signed data-centre load should raise system need and price
volatility. It also competes with storage for the same connection capacity, and the operator
has proposed that data centres themselves flex 30% of consumption in a fault — which would make
them a competitor in flexibility, not only a customer. The demand dimension has to hold both
readings.

**Great Britain explains the capital flow the IRR cannot.** The lowest modelled return of the
four with the strongest Capital pillar. For a fund that needs debt and an exit, that is a
coherent place to be, and the current home page cannot say so.

### 5.4 To source before any of this publishes

- The network-works security Western Power requires, and the current text of the security
  rule. AEMO's own page returned an access refusal to an automated fetch on 2026-10-10; under
  the claim pilot's rule a source that could not be opened establishes nothing, so the 25%
  figure rests on a search summary until someone opens it.
- Australian foreign-investment thresholds for storage.
- Fingrid's 2026 connection fee amounts.
- Great Britain's securities and commitments under a Gate 2 offer. The surplus figures come
  from a secondary summary.
- Release mechanics for the Romanian guarantees, which the dashboard already flags.
- Whether the Finnish draft act's 100 MW threshold survives Parliament.

---

## 6. Product changes

### 6.1 Home page — verdicts first

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Lens   [ Strategic ]  [ Infrastructure fund ]  [■ Foreign first-timer ]  [ Developer ]             │
│ As at 2026-10-10 · 3 changes this week                      (all values below are placeholders)    │
├────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ VERDICT BOARD — every market, for the chosen lens, ordered by verdict then fit                     │
│                                                                                                    │
│ Finland       Enter now       fit 71  Return  —     Entry ●●●●○  Durability ●●○○○  Capital ●●●○○   │
│               changes if: screening act in force (spring 2027)  ↘                                  │
│ W. Australia  Not accessible  fit  —  Return ●●●●○  Entry ●○○○○  Durability ●●●○○  Capital ●●○○○   │
│               shut out by: security before revenue ≈ USD 16m, against a limit of 3m                │
│ …                                                                                                  │
├────────────────────────────────┬──────────────────────────────┬────────────────────────────────────┤
│ RETURN × ENTRY MAP             │ WHAT CHANGED                 │ TRIGGER CALENDAR                   │
│ one point per market;          │ last ten changes, with       │ next twelve months,                │
│ marker shape = verdict;        │ author and evidence          │ one lane per market                │
│ whisker = base to bull         │                              │                                    │
└────────────────────────────────┴──────────────────────────────┴────────────────────────────────────┘
  Returns · Grid and congestion · Scouting · Investment Lab · Data · Changes
```

- **The lens is a persisted preference**, stored like language and theme. With no lens chosen
  the board shows all four columns.
- **The return-by-entry map is the hero chart.** Return on one axis, the chosen archetype's
  Entry score on the other. It is the picture that explains §2.2: rich-but-gated in one corner,
  open-but-thin in another.
- **Everything on today's home page moves to `/returns`** — league table, revenue stack, $1M
  engine, waterfall, certainty frontier. Nothing is deleted and no number moves. The router
  already names the extension point.
- **Markets not yet graded say so.** Until phase 5 the eleven ungraded markets appear on the
  board as "not yet graded", with their return shown. An empty cell is better than a guessed
  verdict.
- **Finland gets verdicts without a Return pillar.** The pillar shows "withheld". That is the
  case you raised: investors entering a market with no published IRR.
- **The four orphan modules.** `refinementOverview.js` becomes the body of `/returns`' evidence
  section. `findings.js` is kept there, as computed commentary on returns. `regionalStrip.js`
  and `valueDriverHeatmap.js` are superseded by the verdict board and the pillar strips and
  should be deleted, keeping `valueDriverData.js`, whose evidence records feed dimension 9.
- **"Screening only" appears once**, in the header, not on every card. A board of verdicts in
  which every card disclaims itself reads as a contradiction.

### 6.2 Market dashboard — seven tabs around the decision

| Today | Becomes | What changes |
|---|---|---|
| Overview | **Investment case** | New default. Verdicts by archetype, pillar strips, because and despite, triggers, this market's changelog |
| Market story | **Market story** | Unchanged |
| Capacity · Energy · Services · Duration | **Revenue and design** | One tab, four sections. Content unchanged |
| Grid connection | **Entry and delivery** | Pathway moves to the top; ledger, exposure curve, time to first revenue, foreign entry, origin rules, then the grid map |
| Project pipeline | **Competition and demand** | Adds saturation and the demand view |
| Portfolio | **Capital and exit** | Adds debt availability, traded assets, scale. The confidential WA section stays a local stub |
| Data and methodology | **Evidence** | Adds the changelog |

**The exposure curve** is the signature chart of the Entry tab: months from site control on one
axis, cumulative capital at risk on the other, with each security posting marked and labelled
with how it is lost. Drawn for two markets on shared axes it shows the WA and Finland contrast
without a sentence of explanation. It needs exactly the two structures §4 adds.

**Stage this, because it is expensive.** The ten-tab contract is asserted in
`tests/registry.test.js` and `tests/section-shape.test.js`, written into
`docs/adding-a-market.md`, and — the costly part — the claim pilot counts 150 sections as
fifteen markets by ten, keyed by section, which today means by tab. `PILOT-FROZEN.md` says a
market that does not fit brings its case there, so:

1. **First, add.** Investment Case and Entry and Delivery join the ten. Twelve tabs, no
   removals, claims untouched.
2. **Later, merge to seven**, in its own change, with an alias map so old deep links resolve
   and with the claim keys migrated and the frozen document amended.

### 6.3 Retiring the status chip and the composite

| Today | Replaced by | Migration |
|---|---|---|
| `manifest.status` — one chip a market | A verdict per archetype, in the view store | Drop from the UI; make the manifest field optional, then remove |
| `score.composite` — a 0–100 self-score | Pillar scores and archetype fit | The weighted component tables in each dashboard are real judgement. Use each line as seed evidence for the first grades, then delete the table |
| `score.connectionRisk` | Entry pillar, dimensions 3 and 4 | The per-market factor lists are project checklists. Move them to Entry and Delivery under that name |
| `confidenceScore` | Unchanged | Still the evidence axis; shown per grade as its basis |

### 6.4 The scouting tier

A market with no dashboard gets a card and nothing more:

```javascript
{
  id: 'se', name: ['Sweden', '瑞典'], region: 'nordics-baltics', tier: 'scout',
  facts: [ { text: ['…','…'], evidence: '…' } ],       // at most ten
  grades: { … },                                       // the same anchors as a full market
  verdicts: { … },                                     // the same four archetypes
  returnSignal: { kind: 'third-party-index', note: ['…','…'] },   // no engine economics
  graduatesWhen: ['…','…'],
}
```

- Scout cards live in the view store as data, load on demand at `/scout`, and appear on the
  home board below a divider. They never enter the engine, the league table or the frontier.
- **No return is modelled.** The Return pillar shows a third-party signal or nothing. A scout
  card that printed an IRR would be publishing the number §2 says is the least informative.
- **First batch, three per region you chose:** Sweden, Estonia, Lithuania · Spain, the
  Netherlands, Bulgaria · Chile, Ontario, Saudi Arabia. The Baltic states and Bulgaria already
  appear in `docs/external-view.md` §2.3.
- **Graduation.** A scout market earns a full dashboard when one archetype reads Enter now or
  Build position across two reviews and the inputs a comparison file needs exist. A core market
  whose evidence has gone a year without review can be demoted to a card.
- **This is where the agent starts** (§8). There is no prior judgement to overwrite and the
  cost of a wrong call is lowest.

### 6.5 The private overlay

`local-data/notes/<marketId>.json`, git-ignored, loaded through the substitution
`vite-plugin-local-data.js` already performs for dossiers. In a build the module is an empty
stub, so the notes are structurally absent rather than hidden.

- Per grade: a private reason and private metrics, such as a guarantee amount from a deal.
- Rendered only on the dev server, as a collapsed note under the public grade.
- File names use market ids, never project codenames. Some codenames are markers.
- The confidentiality scan is extended to cover the view store, so a deal-derived phrase cannot
  travel from a note into a public reason unnoticed.
- **Automation never sees this folder** (§7.3).

### 6.6 Presentation

Three rules for the redesign, consistent with the direction set in the August plan §5.2:

- **Four pillar strips, not a radar.** Four short horizontal bars a market, always in the same
  order. A reader can run an eye down a column of fifteen.
- **Verdict by shape and word, colour second.** The fifteenth market already forced a second
  visual channel. Six verdicts cannot rest on six colours.
- **One sentence above every chart saying what it argues**, which the claim pilot already
  requires of sections.

---

## 7. Governance — the new rule

### 7.1 What changes

| | Today | Proposed |
|---|---|---|
| Observed data, derived metrics | Publish after validation | Unchanged |
| Model assumptions | Automation may propose, by pull request | Automation may change, live, inside the band the market declares |
| Dimension grades | Do not exist | Automation may change, live, with a fetched source |
| Verdict, market status, thesis text | Automation may not even propose | Automation may change, live, with a fetched source |
| Weights, knock-outs, grade anchors, discount rates, exit yields, the comparison window, risk classes | Human only | Human only |
| Private notes | – | Invisible to automation |
| Marking on the page | – | None. The changelog is the record |

The old rule is one sentence in the README: *no judgement is automated*. The new one is:
**judgement publishes automatically after validation; methodology never does.**

### 7.2 The view store — redrawing the wall instead of removing it

Today's guarantee is a filesystem fact: unattended code can write to one directory. That idea
survives. What changes is that there are two directories, and judgement moves out of `src/`
into the second.

```
view/
├── markets/<id>.json     verdicts, thesis, grades, triggers, assumption overrides
├── scout/<id>.json       scouting cards
├── index.json            verdicts only, for the home board
├── changelog.jsonl       append-only, one line per change
└── schema/               the schemas the writer and the tests both use
```

- **Automation may write `public/data/public/` and `view/`. Never `src/`.** Archetypes, anchors
  and discount rates live in `src/governance/` and stay behind the old wall.
- **One writer.** `etl/lib/viewWriter.mjs` is the only module permitted to write `view/`, as
  `boundary.mjs` is for data today. It validates before it writes, so an invalid change is never
  committed.
- **You write to the same store.** A verdict you set by hand lands in the same file through the
  same writer and the same changelog. There is one current view, not a human copy and a machine
  copy.
- **Assumptions are overrides, not edits.** `comparison.js` keeps the seed; the view holds
  `{ 'economics.merchGross': { value, was, reason, evidence, author, at } }`, applied at
  registration the way `applySponsorAssumptions` already is. `tests/baseline.test.js` stays
  green untouched. `tests/current-model.test.js` goes on pinning the seeds.
- **Imported at build time.** Every data commit already runs CI and a deploy, so the store
  ships in the bundle: no flash on load, and the confidentiality scan sees the exact bytes.

### 7.3 Two machine authors

**Rules — your judgement, exercised in advance.** A trigger may carry a pre-written effect:

```javascript
{ id: 'ro-grant-call-result', kind: 'data', market: 'ro',
  when: { dataset: '…', field: '…', op: '<', value: … },
  effect: [ { path: 'verdicts.developer.call', to: 'wait' } ],
  note: ['…', '…'] }
```

`etl/rules.mjs` runs after each refresh, evaluates `data` triggers against the published
snapshots and applies the effect through the writer. An `event` trigger — an act passing, a
decision published — has no feed, so the agent establishes the fact with a source and the
rule's own pre-written effect is what applies.

**The agent — for prose and for what no rule anticipated.**

| | |
|---|---|
| Runs | In CI only, on a schedule. Never on your machine |
| Cadence | A daily pass over markets with a trigger due or new headlines; a weekly deep review of three markets, so each is reviewed about every five weeks; scout cards monthly |
| Reads | The public snapshots, the drift report, the news feed, the market's current view and its source register, and what it fetches from the web |
| Cannot read | `local-data/` — it does not exist in CI — or anything outside the list above |
| Writes | A structured patch against the view schema. Never free-form source. Each changed field carries old value, new value, a bilingual reason and evidence records |
| Cannot write | `src/`, methodology, a pinned field |
| Recorded each run | Model id and prompt version, in the changelog entry |

Evidence records use the claim pilot's format: publisher, date, locator, a quotation of at most
300 characters, the retrieval time and a content hash.

### 7.4 The validation gate

A patch is applied only if all of these hold. A patch that fails is written to a rejected file
with the reason and commits nothing.

- it matches the schema, and both languages are present;
- every changed field has a changelog line, and the two agree;
- every change carries evidence that was fetched in that run and resolved;
- no methodology path and no pinned field is touched;
- an assumption stays inside its market's declared band;
- the confidentiality scan passes on the result.

This is the existing grammar — *publishes automatically after validation* — applied to a new
kind of content.

### 7.5 The changelog is the only marking

Your decision, and the design follows it: no badge and no "machine-updated" chip anywhere on a
verdict. Authorship lives in three places instead — the `/changes` route, the "what changed"
panel on the home page, and each market's Evidence tab. Every entry shows who (you, a named
rule, or an agent run), when, the field, before and after, the reason and the evidence.

```json
{"id":"2026-10-12T06:17Z-fi-verdicts.foreignFirstTimer.call","market":"fi",
 "author":{"kind":"agent","run":"…","model":"…","prompt":"v3"},
 "path":"verdicts.foreignFirstTimer.call","from":"enter-now","to":"build-position",
 "reason":["…","…"],"trigger":"fi-fdi-act-in-force",
 "evidence":[{"url":"…","publisher":"…","date":"…","quote":"…","retrievedAt":"…","sha256":"…"}]}
```

### 7.6 Guardrails I recommend — each one yours to strike

You chose the most permissive setting at every step, and this plan implements that. These limit
how far a single bad run can move the page without adding any approval step. They are my
recommendation, not part of your decision.

| | Guardrail | What it prevents | Cost |
|---|---|---|---|
| A | No change without a source fetched in that run | A verdict moved by something the agent recalled | None worth naming |
| B | Assumptions stay inside the declared band | An IRR moving on a number the evidence does not bound | A real shift needs you to widen the band |
| C | A grade or verdict moves one step a run, unless a rule you wrote says otherwise | One article flipping Avoid to Enter now | A genuine shock takes two runs |
| D | **Pins.** `lockedUntil` on any field you set deliberately | The agent "correcting" a position you hold against consensus | You must remember to pin |
| E | A cap on changes per run; over the cap, the run writes nothing | A bad source rewriting ten markets | A busy week needs a second run |
| F | The existing seasonality and materiality guards still apply to data-driven changes | A proposal built on a partial-year window | None |
| G | Verdict changes need one official source or two independent ones | A single trade-press story setting a call | Slower on thinly covered markets |
| H | A weekly digest of machine changes | Changes you never happened to scroll past | One message a week |
| I | One command reverts a change by id | – | None |

**D is the one I would not strike.** `docs/external-view.md` §5 lists positions held deliberately
against consensus, with the note that they are recorded so a future reader does not fix them.
An agent reading consensus sources is that reader.

### 7.7 What breaks and must be rewritten

Replacing a guarantee is different from deleting it. Each of these is rewritten to assert the
new rule.

| Where | Today | Becomes |
|---|---|---|
| `tests/governance.test.js` — "the judgement fields the analyst reserved are methodology" | Thesis and status cannot be proposed | Thesis and status are view-store fields; weights, anchors and yields cannot be proposed |
| same — "nothing anywhere is machine-writable except observed and derived" | Two writable classes | Three: observed, derived, view. Methodology is asserted unwritable |
| same — the ETL write boundary | One directory | Two, each with its own writer and validator |
| same — "the scheduled workflow never enables auto-merge" | Asserted | **Keep as is.** Machine changes go through the view writer, not through merged pull requests |
| `src/governance/authority.js` | Judgement and methodology share one class | Adds `VIEW`; splits today's `METHODOLOGY` into view-store judgement and true methodology |
| `etl/propose.mjs` | Opens a pull request for a material drift | Retired for in-band changes; kept for out-of-band ones, which still need you |
| `README.md`, `docs/governance.md`, `docs/architecture.md`, the `/data` page | "No judgement is automated" | The new rule, and a plain statement of what a reader is looking at |
| `src/governance/PILOT-FROZEN.md` | Section claims are human-reviewed | **Recommend unchanged.** See below |

**Section claims should stay human-reviewed for now.** The pilot's standard is that a person
opened the source. An agent-written thesis sits on the Investment Case tab; the seven supported
claims sit on the sections beneath it. Two standards on one page is a real cost, and it is
smaller than dissolving the one layer whose every sentence a person has checked.

### 7.8 The risks, stated once

- **A wrong call is public until you notice it.** With no hold period and no page marking, the
  first reader of a machine error may be you, some days later. Guardrails C, E and H bound the
  size and the delay. They do not remove it.
- **The view stops being yours without your noticing.** The platform's stated value was the
  analyst's view. After a few months of unmarked changes, which verdicts you still hold becomes
  a question the page cannot answer. The changelog can. Pins are how you keep the ones that
  matter.
- **Web content can try to steer the agent.** It reads pages it does not control. It has no
  shell, writes only a validated patch and cannot touch methodology, so the worst case is a
  wrong in-band change with a real-looking citation. Guardrail G is the defence.
- **Model assumptions now move published IRRs without sign-off.** That is your decision. It
  supersedes, for in-band machine changes, the standing practice of approving multi-market
  number changes in advance. Out-of-band changes and all methodology changes keep it.

---

## 8. Delivery sequence

Six phases. Each ends at a state worth stopping in.

| Phase | Contents | Exit | Size |
|---|---|---|---|
| **0 — Method** | You write the twelve anchor sets and the four archetype tables. `src/governance/investability.js` and `archetypes.js`, pinned by tests. No UI | The anchors and tables are yours and are asserted | Small |
| **1 — Four corners, by hand** | The view store, its writer, schema and gate. Ledgers for WA, Finland, Great Britain and Romania, normalising what Romania, Japan and Germany already hold. Pathways for Great Britain and Romania. Sixteen verdicts. Investment Case and Entry tabs added to those four. The private overlay. Triggers migrated out of prose | The WA and Finland stories render from data; the mismatch flag works; no existing number moved | Large |
| **2 — Home inversion** | Verdict board, lens, return-by-entry map, trigger calendar, what-changed panel. Existing home content to `/returns`. Status chip and composite retired. Orphan modules mounted or deleted | The home page answers "where should this investor enter" for four markets and says "not yet graded" for eleven | Medium |
| **3 — Automation** | Governance rewrite: authority classes, tests, documents. Rules engine on data triggers. `/changes`. The agent, built and run dry | A rule fires on a real refresh and changes a verdict live, with a changelog line | Large |
| **4 — Scouting** | Nine cards, written by the agent and spot-checked. `/scout` | The agent completes a run of consecutive passes with no patch rejected for evidence, and only then is pointed at core markets | Medium |
| **5 — The rest** | The other eleven markets graded. Tabs merged to seven and claims re-keyed. Entry-adjusted return wired through. Gate G12 | Fifteen markets by four archetypes, all with ledgers | Large |

**Two orderings are deliberate.** The view store is built in phase 1, before any automation, so
hand-written verdicts land where machine ones will and nothing is migrated twice. And the agent
earns the core markets in steps: in phase 3 it runs dry, reporting what it would have changed;
in phase 4 it writes scout cards; only after a clean run there does it touch a core market.

---

## 9. Decisions still open

**All twelve recommendations below were accepted by Jerry on 2026-10-10**, including guardrails
A to I. Rows 1, 2 and 4 remain his to fill: Phase 0 produces drafts for him to overwrite.

| | Decision | Recommendation |
|---|---|---|
| 1 | Archetype parameters (§3.4) | Yours. The drafts are placeholders |
| 2 | Weights and `reads` tables for each archetype | Yours |
| 3 | The six verdict words (§3.6) | Adopt as drafted |
| 4 | Ten remaining anchor sets (§3.2) | Yours; I can draft from the component tables each dashboard already holds |
| 5 | Guardrails A to I (§7.6) | Keep all; D above all |
| 6 | Where the agent runs | CI with an API key held as a repository secret, so it cannot see `local-data/` |
| 7 | Whether section claims stay human-reviewed (§7.7) | Yes |
| 8 | Return by rank until G12 closes, or G12 first | Rank now; start G12 in phase 1 alongside the ledgers |
| 9 | Tabs: add two now and merge later, or merge at once | Add now, merge in phase 5 |
| 10 | First scouting batch (§6.4) | As listed |
| 11 | Whether Finland receives verdicts while its return is withheld | Yes |
| 12 | Licences for scouting sources | Re-check per source as each card is written; the personal-study posture covers them only while the purpose holds |

---

## 10. Not proposed

- **No change to the comparison engine's formulas.** Every new number sits beside the engine.
- **No login, backend or database.** The lens is a browser preference; the private overlay is
  the existing local-data mechanism.
- **No single blended market score**, at any level above an archetype.
- **No verdict on a project.** Verdicts are about markets. Dossiers stay local and separate.
- **No automated change to weights, anchors or discount rates.**

---

## Appendix A — where the changes land

| Area | New | Changed |
|---|---|---|
| Method | `src/governance/investability.js`, `archetypes.js`, `triggers.js` | `authority.js` |
| Entry layer | `src/entry/ledger.js`, `timeToRevenue.js`, `entryReturn.js`; `src/markets/<id>/entryLedger.js` | `governance/buildPathway.js` (`after` edges, calendar gates); `components/buildPathwayPanel.js` |
| View store | `view/**`, `etl/lib/viewWriter.mjs`, `etl/rules.mjs`, `agent/**`, `tests/view.test.js` | `etl/lib/boundary.mjs`, `.github/workflows/etl.yml`, `markets/registry.js` |
| Home | `src/home/verdictBoard.js`, `returnEntryMap.js`, `triggerCalendar.js`, `changesPanel.js`, `returnsPage.js` | `homePage.js`, `app/router.js`, `components/marketCard.js` |
| Dashboard | `src/components/investmentCase.js`, `exposureCurve.js`, `pillarStrip.js` | each market's `tabs.js` and `sections.js`; `markets/marketPage.js` |
| Scouting | `src/scout/scoutPage.js`, `view/scout/*.json` | `app/router.js` |
| Private overlay | `src/local/notes.js` (stub) | `vite-plugin-local-data.js`, `scripts/scan-staged.mjs` |
| Tests and documents | – | `tests/governance.test.js`, `registry.test.js`, `section-shape.test.js`; `README.md`, `docs/governance.md`, `architecture.md`, `adding-a-market.md`, `external-view.md` |

**Two stale statements noticed on the way**, both of which this work rewrites anyway.
`docs/comparison-methodology.md` gives the exit yields as 7.5%, 11.5% and 8.0%;
`src/comparison/assumptions.js` has carried 6.5%, 10.5% and 7.0% since the August revision. The
README's Markets section says eleven allocation markets and nine dashboards; fifteen are
registered.

## Appendix B — web sources checked on 2026-10-10

| Fact | Source | Access |
|---|---|---|
| Reserve Capacity Security is 25% of the peak benchmark price per MW certified; forms and return | [AEMO — Reserve Capacity Security](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/reserve-capacity-security) | Search summary only; the page refused an automated fetch |
| Western Power application, assessment and offer-preparation fees | [Western Power — contracts, costs and timeframes](https://www.westernpower.com.au/products-services/install-something-new/connect-my-home-or-business/transmission-connected-loads-generators/contracts-costs-and-timeframes/) | Search summary |
| Connection enquiries of 68, 13 and 32 GW; data centres over 3 GW signed; storage agreements about 4 GW | [Fingrid — half-year report, January to June 2026](https://www.fingrid.fi/en/news/news/2026/fingrid-groups-half-year-report-1.1.30.6.2026/) | Opened |
| Application threshold, prerequisites, two-month validity, no fee | [Fingrid — connection agreement application](https://www.fingrid.fi/en/grid/grid-connection-agreement-phases/uusi-liityntakysely/connection-agreement-application/) | Opened |
| Connection fee is a fixed, non-refundable lump sum; 2026 storage capacity fee | [Fingrid — main grid contract and service fees](https://www.fingrid.fi/en/grid/grid-connection-agreement-phases/main-grid-contract-and-service-fees/) | Search summary |
| Grid-priority amendments; 5 GW agreed; proposed 30% data-centre flexibility | [Borenius — legal alert, 26 August 2026](https://www.borenius.com/legal-alerts/2026/08/26/government-prepares-new-grid-connection-priority-rules-in-response-to-data-centre-boom/) | Opened |
| Draft screening act: spring 2027, greenfield storage from 100 MW, EU investors in scope | [Krogerus — 4 June 2026](https://www.krogerus.com/articles/news/towards-a-significant-reform-of-foreign-direct-investment-screening-in-finland-draft-government-proposal-on-new-fdi-act-published) | Opened; law-firm commentary on a draft |
| About 14.8 GW of batteries beyond the 2030 range hold Gate 2 | [S&P Global — April 2026](https://www.spglobal.com/market-intelligence/en/news-insights/articles/2026/4/uk-battery-storage-glut-prompts-review-of-queue-protections-100760930) | Search summary; secondary |

"Opened" means the page was fetched and read on that date. A search summary is not evidence
under the platform's own rule and is listed so the reader knows which facts still need a person
to open the source.
