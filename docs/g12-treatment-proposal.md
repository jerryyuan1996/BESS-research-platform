# Gate G12 — a terminal-value and augmentation treatment: proposal for sign-off

Drafted 2026-10-12. **Nothing here is built and nothing here is decided.** You asked for this
separately from phase 5 (plan decision 8): the gate stays open in this phase, rank grading stays,
and this is the proposal for the treatment itself. Every parameter below is methodology, of the
same class as `LIFE` and the exit yields, so each is yours to set.

## 1. What the gate is

`docs/external-view.md` §5, item 4: the engine prices fifteen years, assigns nothing at year 15
and carries no augmentation. Published unlevered returns (Great Britain at 10–12%, Germany
four-hour at 13.7%) are quoted on a 20 to 25 year life with augmentation and a residual. So the
engine's ordering is trusted and its level is not, and asset return is graded by rank.

## 2. What I propose to build, if you approve it

A **long-life view beside the engine**: a module that takes the engine's result for a market
and extends it. `LIFE` stays 15. No formula in `src/comparison/` changes and no number in
`tests/baseline.test.js` or `tests/current-model.test.js` moves; a test would assert a base case
is identical before and after the module loads.

It reports one extra figure, the long-life hold IRR, next to the fifteen-year one on `/returns`
and the Entry tab. It does not replace it, feed a score, or change a grade.

## 3. The four decisions, with a derivation for each

All per MW in USD on yearly periods, from the engine's own vectors: `F` the capital flows, and
for each year `y` the secured line `capY[y]`, the market line `mchY[y]` and the cost line.

### 3.1 Life, `N`

Years 16 to `N` are appended. Cost continues at its year-15 level.

**Recommendation: 25 years, with 20 shown beside it.** The external view quotes consensus on
"20–25"; showing both ends says how much of the answer is the choice of window.

### 3.2 The market line after year 15, and augmentation

Without augmentation the market line goes on fading at the market's own degradation rate `g`:

```
mchY[y] = mchY[15] · (1 − g)^(y − 15)                         y = 16 … N
```

With augmentation in year `a`, costing a share `k` of gross capex, the faded capacity is
restored and the fade restarts:

```
flow[a]   −= k · capexG
mchY[y]    = mchY[y, engine] · (1 − g)^(y − a − 1) ÷ (1 − g)^(y − 1)     y = a+1 … 15
mchY[y]    = (undegraded market line) · (1 − g)^(y − a − 1)               y = 16 … N
```

The engine already reads an `augmentationSchedule` that no market sets, with the cost as a share
of capex, so `k` and `a` have a home and a precedent.

**What I need from you:** `a` and `k`. I have no sourced figure for either, and I will not
supply one from memory. Gate G13 records that no market-specific degradation series exists, so
`g` stays at each market's seed. Two candidates are shown in §4 to size the lever, not to
recommend them: year 12 at 20% and at 35% of gross capex.

### 3.3 The secured line after its term

The engine already steps a contract down by its market's own `postFactor`, or follows the
auction-renewal curve, inside the window. **Recommendation: nothing new.** Years 16 to `N` carry
whatever the secured line is in year 15. Inventing a re-contracting assumption for year 16 would
be a second forecast nobody has written down.

### 3.4 The residual at year `N`

Three bases, in order of how much they assume:

| Basis | What it adds at year `N` | What it assumes |
|---|---|---|
| None | Nothing | The asset is worth nothing at the end of the window. Conservative, and needs no number |
| Site and connection | A stated value per MW for the grid connection and the land rights | That the connection outlives the battery, which is the developer's whole thesis. Needs a figure, and §4.4 of the main plan's implied ready-to-build value is the nearest thing the platform will hold to one |
| Going concern | The engine's exit valuation taken at year `N` on a further window | A second life, re-powered. The most generous, and circular |

**Recommendation: none, to begin with.** A 25-year window with no residual is a defensible
floor; adding a residual on top is the step most likely to be read as reaching for the published
number.

## 4. What the levers are worth, on the engine's own cash flows

An illustration, not a model. Columns two and three are exact for the rule in §3.2 with no
augmentation. The last two use the two candidate augmentations and a simplified in-window
restoration, so read them as the direction and rough size.

| Market | Engine, 15 yr | 20 yr | 25 yr | 25 yr, augment yr 12 at 20% | 25 yr, augment yr 12 at 35% |
|---|---|---|---|---|---|
| ro | 20.8% | 21.5% | 21.7% | 21.6% | 21.1% |
| it | 15.4% | 16.5% | 17.0% | 16.7% | 16.2% |
| de | 14.6% | 15.7% | 16.1% | 16.1% | 15.6% |
| wa | 13.1% | 14.3% | 14.9% | 14.3% | 13.8% |
| ie | 9.6% | 10.9% | 11.5% | 11.0% | 10.3% |
| jp_kyushu | 7.5% | 9.5% | 10.4% | 9.5% | 8.9% |
| jp_tokyo | 7.4% | 9.4% | 10.3% | 9.5% | 8.8% |
| jp_hokkaido | 7.4% | 9.4% | 10.3% | 9.5% | 8.8% |
| gb | 4.7% | 6.7% | 7.6% | 7.5% | 6.7% |
| caiso | 3.2% | 5.3% | 6.4% | 5.4% | 4.5% |
| nem | 3.1% | 5.6% | 6.8% | 5.8% | 5.0% |
| pjm | 2.4% | 4.4% | 5.4% | 4.7% | 3.6% |
| pl | 0.8% | 3.2% | 4.4% | 4.2% | 3.3% |
| ercot | −5.9% | −3.8% | −2.7% | not computed | not computed |

ERCOT's base route is a toll with no market line in the tolled years, so the restoration rule has
nothing to act on; it needs its own handling.

Three things this shows, and they are the reason to decide the treatment before building it:

1. **The window is worth two to three points on a low-return market and under one on a
   high-return one.** The ordering barely moves: between the first and third columns the only
   change is that the NEM passes CAISO, tenth and eleventh, and no market changes fifth.
2. **It does not close the gap for Great Britain.** Twenty-five years takes 4.7% to 7.6%, against
   a published 10–12%. More than half the gap is somewhere else: revenue level, capex, or a
   residual. G12 alone will not reconcile it.
3. **Germany is already above its published figure.** The engine has 14.6% on fifteen years
   against Modo's 13.7% on a longer life, and a longer window takes it to 16%. Whatever
   explains that is not the window, and a treatment tuned to lift Great Britain would push
   Germany further out.

## 5. What it would be reconciled against

From the repository, all to be re-opened at the time:

| Published figure | Source as the repository records it | Engine today |
|---|---|---|
| Great Britain, 10–12% unlevered | "Consensus", `external-view.md` §5 — no single document is named there, so this one needs a source before it can be a reconciliation target | 4.7% |
| Germany four-hour, 13.7% unlevered at 2026 COD; two-hour 12.2% | Modo, German BESS outlook Q2 2026 (`external-view.md` line 81) | 14.6% |

Two targets is thin, and one of them has no named document. **I would add, before building:** a
published unlevered return with its stated life and augmentation assumption for at least one
market in each of the other regions, opened and recorded like any source. A treatment
reconciled against one market is fitted to it.

Closing the gate would mean a written table: for each target, the published figure, its stated
assumptions, the long-life figure on the same assumptions as far as they can be matched, and the
remaining gap with its cause named or marked unknown.

## 6. What stays open after this, deliberately

Whether asset return moves from rank to a level read against anchors. That needs a new anchor
set, which you write, and regrades asset return in all fifteen markets including the four
corners. It is a separate decision with its own plan, and nothing here presumes it.

## 7. Decisions this needs from you

1. Build the long-life view beside the engine as §2 describes, or leave the gate as it is.
2. Life: 25 with 20 beside it, or another.
3. Augmentation: the year and the share of capex, or a source you want me to open for them.
4. The secured line after its term: nothing new, as recommended.
5. Residual: none to begin with, as recommended.
6. Whether I source more reconciliation targets before anything is built, as §5 proposes.

## 8. What was sourced and built (2026-10-12)

The analyst's answers to §7: source more reconciliation targets first; then build the long-life
view; life 25 with 20 beside it; for augmentation do not pick numbers, open a source, starting
with the NREL cost report already in the US registers; nothing new on the secured line after its
term; no residual to begin with.

### 8.1 Augmentation: what the source says

NREL, *Cost Projections for Utility-Scale Battery Storage: 2025 Update* (NREL/TP-6A40-93281, June
2025), opened and read on 2026-10-12, pages 11 and 12:

- It gives **no augmentation year and no lump cost.** It treats augmentation as a yearly operating
  cost. Low published figures for fixed O&M cover simple maintenance; high ones include capacity
  additions or replacements that address degradation.
- It selects a figure from the high end, **4% of the $/kW capital cost a year for a four-hour
  battery**, and assumes that this holds the system at rated capacity for life. It attributes the
  figure to a more detailed analysis by Newell et al. (2022), which was not opened.
- It assumes about one cycle a day and says the figure may not be enough at much higher cycling.
- It selects a **lifetime of fifteen years**, calling that the lower end of published values and a
  conservative choice, because no four-hour system has yet reached fifteen years.

So the two candidates in §4 (year 12 at 20% and at 35%) have no source and are dropped. What is
built is the form the source gives: a "capacity maintained" case, beside the "capacity fades" case
that is the engine's own treatment carried on. The 4% is held in `comparison/assumptions.js` as
`MAINTAINED_FOM_SHARE`, with the passage. **Using it past fifteen years, or outside the United
States, goes beyond what the source says, and that is the analyst's to confirm or replace.**

Two things this shows about the engine as it stands:

1. The engine's fifteen-year life is the same as the laboratory's. On life alone it is not out of
   line with a public source; the published investor returns use longer ones.
2. The engine's US opex of $20,000 a MW a year is about 1.5% of capex, the low, maintenance-only
   end, and the engine degrades the market line. That pairing is consistent. But the US registers
   say no laboratory publishes a fixed opex figure, and this report does. That note is corrected;
   see §8.5.

### 8.2 Reconciliation targets: what was opened

Each page below was opened on 2026-10-12. All are previews of paywalled reports. **None states
its asset life, augmentation, degradation or residual value in the text that can be read**, so no
target can yet be matched assumption for assumption.

| Market | Published figure | Document | What the engine prices | Engine, 15 / 20 / 25 yr fading |
|---|---|---|---|---|
| Germany | 13.7% unlevered, four-hour, 2026 COD, capex €935k/MW; two-hour 12.2% at €700k/MW; "12–14%" central and 5.5% in the most adverse scenario. Says a merchant battery is exposed to the market "for 20 years" | Modo Energy, *German BESS investment outlook: Executive summary*, 16 March 2026 | Four-hour at €841.5k/MW | 14.6% / 15.7% / 16.1% |
| Great Britain | 11.2% unlevered, two-hour, capex about £600k/MW; a hurdle rate of 10 to 12% "is typically required" | Modo Energy, *GB BESS Outlook Q3 2024*, 5 August 2024 | Four-hour at £810k/MW | 4.7% / 6.7% / 7.6% |
| Great Britain | 10.7% average, two-hour, capex about £550k/MW; basis not stated on the page | Modo Energy, *GB BESS Outlook Q4 2024*, 20 November 2024 | as above | as above |
| ERCOT | 18.3% pre-tax unlevered, four-hour, 2027 COD; two-hour 11.3%; one-hour 4.9% | Modo Energy, *ERCOT BESS Investment Outlook Report — Q1 2026*, 21 May 2026 | Two-hour on a toll, at $866k/MW | −5.9% / −3.8% / −2.7% |
| NEM | "Similar forecast IRRs" for six and eight hours, commissioning 2029; no figure and no basis on the page | Modo Energy, *NEM BESS Outlook July 2026*, 13 July 2026 | — | not a target |

What this settles and does not:

- **The Great Britain "10–12%" now has a named document, and it is a hurdle rate, not a return.**
  The return beside it is 11.2% for a two-hour battery in 2024. The engine prices a four-hour
  battery at a third more capex per MW, two years later. They are not the same asset, so the
  distance between 4.7% and 11.2% is not a measure of the engine's error.
- **Germany is just above the published range on fifteen years and further above on
  twenty-five.** The engine's capex is 10% below the published one, which works the same way.
- **ERCOT is not comparable as priced.** The engine's base route is a toll on a two-hour battery;
  the published two-hour figure is a merchant central case. The gap is a route and revenue
  question, not a life question.
- **No target was found for Italy, Poland, Romania, Ireland, Japan, CAISO, PJM, WA or Finland.**

**The gate stays open.** Closing it needs at least one target whose life and augmentation are
stated, which means the full reports and not their previews. The long-life view is built so that
when one is opened the engine can be put on the same window.

### 8.3 What was built

`src/longlife/longLife.js`, beside the engine, with `tests/long-life.test.js`. It is shown on
`/returns` and on each market's Entry & Delivery tab. `LIFE` is 15 and no pinned number moves.

| Market | Fades: 15 yr | 20 yr | 25 yr | Maintained: 15 yr | 20 yr | 25 yr |
|---|---|---|---|---|---|---|
| ro | 20.8% | 21.5% | 21.7% | 19.1% | 20.0% | 20.3% |
| it | 15.4% | 16.5% | 17.0% | 13.4% | 14.8% | 15.4% |
| de | 14.6% | 15.7% | 16.1% | 14.4% | 15.7% | 16.2% |
| wa | 13.1% | 14.3% | 14.9% | 8.9% | 10.6% | 11.3% |
| ie | 9.6% | 10.9% | 11.5% | 5.9% | 7.7% | 8.6% |
| jp_kyushu | 7.5% | 9.5% | 10.4% | 2.3% | 4.9% | 6.2% |
| jp_tokyo | 7.4% | 9.4% | 10.3% | 2.2% | 4.8% | 6.1% |
| jp_hokkaido | 7.4% | 9.4% | 10.3% | 2.2% | 4.8% | 6.1% |
| gb | 4.7% | 6.7% | 7.6% | 2.9% | 5.4% | 6.7% |
| caiso | 3.2% | 5.3% | 6.4% | −0.7% | 1.9% | 3.3% |
| nem | 3.1% | 5.6% | 6.8% | −1.2% | 1.9% | 3.5% |
| pjm | 2.4% | 4.4% | 5.4% | −1.2% | 1.4% | 2.8% |
| pl | 0.8% | 3.2% | 4.4% | −2.8% | 0.5% | 2.3% |
| ercot | −5.9% | −3.8% | −2.7% | −10.5% | −7.4% | −5.3% |

**Paying to hold capacity lowers the return in every market but Germany**, where it is a wash. At
4% of capex a year the upkeep costs more than the faded capacity would have earned. That is a
finding about the 4% applied to these revenue lines, and one more reason the figure needs the
analyst's eye before anything is read from the right-hand columns.

### 8.4 The analyst's ruling on augmentation (2026-10-12, after §8.1 to §8.3)

A practitioner input, recorded as his and without its basis, as practitioner grades are:

- **The default is the supplier's warranty extension and a long-term service agreement, taken
  together and paid yearly.** The round-trip-efficiency and availability guarantees come with that
  pair at no charge.
- **With both in place there is no further cost for augmentation.** So there is no augmentation
  year and no lump cost, and the question in §3.2 is closed: neither `a` nor `k` is set.

What follows for the view:

- **"Capacity fades" is the default case.** It is the engine's own treatment carried on, which is
  what a project with a capacity warranty and no augmentation does.
- **"Capacity maintained" stays as a comparison**, labelled as NREL's convention. It is not the
  analyst's case and nothing should be read from it as a forecast.
- **The yearly cost of the warranty and service package is taken to sit inside each market's opex
  seed.** No seed was itemised to confirm that. It is the one assumption the default now rests
  on, and gate G13 (no per-market opex series) is where it would be settled.
- **Whether a capacity warranty can be bought for years 16 to 25, and at what price, is not
  sourced.** The twenty and twenty-five year columns carry the year-15 cost forward unchanged.

The NREL figure was cross-checked against a supplier quotation the analyst holds. The quotation and
every figure from it stay outside the repository.

### 8.5 The US opex note, corrected

The US registers said no operator, ISO or laboratory publishes a fixed opex figure. NREL does: 4%
of capital cost a year, including the capacity additions that hold a system at its rating. The
note is corrected in the three US markets' comparison interface, coverage-gap table and source
register. **The seed of $20,000 a MW a year is not changed.** NREL's figure is a different
measure: it buys undegraded capacity, and the engine degrades the market line. Replacing the seed
with 4% of capex while keeping the degradation would count the fade twice, and it would move the
pinned base case for three markets, which needs its own derivation and sign-off.
