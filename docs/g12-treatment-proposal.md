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
