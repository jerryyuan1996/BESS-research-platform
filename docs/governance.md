# Governance — who may change what

This platform fetches public data automatically and recomputes its model automatically. It never
changes an analyst's judgement automatically. This document is the rule, the mechanism that enforces
it, and the reasoning behind both.

---

## The rule

| | |
|---|---|
| Observed public data | **Publishes automatically** after validation |
| Deterministic derived metrics | **Publishes automatically** after validation |
| Model outputs | **Recompute automatically** — using the currently *approved* methodology and assumptions |
| Analyst assumptions | Automation may **propose**. It may never apply. |
| Scoring methodology, qualitative conclusions, investment thesis, market status, house view | Automation may **not even propose** |

Material drift between observed data and an approved assumption opens an evidence-backed pull
request showing its downstream model impact. **It never auto-merges.** Non-material drift goes into
the drift report and nothing else.

---

## Five authority classes

Defined once, in [`src/governance/authority.js`](../src/governance/authority.js). Nothing else in the
codebase decides that a value is machine-writable — everything asks there.

| Class | What it covers | Automation may |
|---|---|---|
| `observed` | Fetched from a public source | write freely |
| `derived` | A fixed formula over observed data | write freely |
| `analyst` | An assumption a public observation bears on | **propose only** |
| `methodology` | Scoring, discount rates, thesis, status, house view | **nothing** |
| `config` | Ids, slugs, flags, colours, locales | nothing |

### Why `analyst` and `methodology` are separate

This is the distinction that does the real work, and it is worth stating plainly.

Automation may propose a change to `economics.merchGross` because a public price series is evidence
about merchant revenue. It may not propose a change to `EXIT_Y_MERCHANT`, because no feed anywhere
implies a discount rate. A discount rate is a position on risk. So is a composite score, so is a
thesis, so is calling a market "Selective".

A machine that proposed those would not be surfacing evidence — it would be inventing an opinion and
dressing it as a finding. Separating the two classes makes that impossible rather than merely
discouraged.

### Failing closed

An unclassified field resolves to `methodology`, the most restrictive class. Forgetting to classify
something makes it *untouchable*, never writable. `tests/governance.test.js` additionally asserts
that every field present in every market's comparison interface appears in the table, so a new field
cannot reach production unclassified in the first place.

---

## How the rule is enforced

Documentation does not enforce anything. Four mechanisms do.

### 1. A filesystem wall

[`etl/lib/boundary.mjs`](../etl/lib/boundary.mjs) is the only module in the ETL that writes to disk,
and it permits exactly one directory:

```
public/data/public/
```

Path containment is checked on the resolved real path, so `../` traversal and symlinks cannot escape.
A write anywhere else throws `BoundaryViolation` and stops the run.

A test asserts that no other file under `etl/` so much as imports a filesystem write API — because a
boundary is only a boundary if it is the sole exit.

### 2. Two programs with different powers

| | `etl/run.mjs` | `etl/propose.mjs` |
|---|---|---|
| Runs | unattended, on a schedule | only in the pull-request workflow |
| Branch | commits to `main` | refuses to run on `main` |
| May write | `public/data/` only | analyst files, on a throwaway branch |
| Output reaches the site | directly | only through a human merge |

The guarantee is not that no program can edit `src/`. It is that **no unattended program can**, and
that nothing an automated proposal touches reaches the published site without someone merging it.

A pull request containing only prose would be unreviewable — the reviewer would have to reconstruct
the change mentally and then make it by hand, which is worse and more error-prone than reading a
diff. So `propose.mjs` makes the edit, on a branch, and stops.

### 3. Checksums

Every snapshot carries a checksum over its payload. `npm run etl:verify` runs in CI on every push and
fails the build if a published file no longer matches its checksum.

The point is narrow and important: a hand-tuned "observed" value is worse than an honest assumption,
because it carries more authority and attracts less scrutiny. If a number is labelled as fetched from
ENTSO-E, it must actually be what ENTSO-E said.

### 4. No auto-merge, asserted

The live-data workflow has no auto-merge path, and a test greps the workflow for every mechanism that
could introduce one — `gh pr merge`, `--auto`, the marketplace action, the GraphQL mutation, a REST
`merge_method`. Adding one fails CI.

---

## Materiality — when drift is worth your attention

Defined in [`src/governance/materiality.js`](../src/governance/materiality.js). Three bands:

| Band | Meaning | Action |
|---|---|---|
| `noise` | Below the field's floor | none — not even reported |
| `reportable` | Real, but moves no published conclusion | drift report |
| `material` | Past a decision threshold | **pull request** |

`material` requires either:

- the input moved past the field's declared **floor** *and* recomputing the model moves a published
  output past its threshold (50 bps of IRR, 0.05× MOIC, 3 pp of secured share); or
- the input moved past its **always-material ceiling**, regardless of modelled impact.

### Why there is an impact gate at all

Input-space thresholds alone mislead here, and FX is the clean example. The comparison converts capex
and revenue at the same rate, so a 5% FX move barely touches IRR — it rescales the USD headline and
leaves the ordering intact. Filing a pull request every month that says *"GBP moved 5%, IRR
unchanged"* is how a governance process dies: the reader learns the alerts do not matter.

Conversely a modest merchant-revenue revision can move IRR by a full point, because it is net of opex
and lands entirely in the cash flow.

### The seasonality guard

Spreads in every market here are strongly seasonal. An arbitrage index over 44 winter days and one
over a full year are different measurements, and comparing them produces a confident proposal to move
merchant revenue by tens of percent for no reason but the calendar.

This bites hardest during a cold start, while backfill is still filling the window — exactly when
someone is most likely watching and least likely to question a number that looks precise. So a
window shorter than 300 days, or one that differs from its anchor's window by more than 60 days, is
**reported but never proposed**, with the reason stated.

---

## Anchors

Automation cannot verify `merchGross` directly. It bundles balancing and intraday revenue that a
day-ahead price series does not contain, so a pipeline that assigned a price-derived number to it
would be silently deleting revenue streams.

Instead, drift is measured as **movement against an anchor** — the arbitrage index computed at the
moment you approved the assumption. If the index has risen 18% since, the assumption is 18% stale in
the only dimension the data can speak to.

The ratio construction also cancels most of the parameter error. A wrong realisation factor or cycle
count scales the anchor and the current index by the same amount and largely divides out. An absolute
claim would carry the full error.

**Anchors start unset, and that is a safe state.** With no anchor, the platform reports observations
and proposes nothing. To set one:

```bash
npm run etl
```

It prints each market's current arbitrage index and its window length. When the window is full and
you are satisfied the assumption reflects your view, record both in
[`src/governance/anchors.js`](../src/governance/anchors.js) with a note saying what you were looking
at. Re-anchor whenever you deliberately revise the assumption — otherwise the pipeline will keep
proposing a change you have already made.

---

## The legacy baseline, and why a proposal is allowed to break it

`tests/fixtures/legacy-baseline.json` pins the original prototype's outputs, and
`tests/baseline.test.js` asserts the modular engine still reproduces them. That fixture verifies the
**migration**. It is not an ongoing invariant.

The moment an analyst deliberately revises an assumption, the platform has intentionally departed
from the prototype for that market — that is the entire point of revising it. So:

- `npm test` runs everything, including the baseline. Use it for ordinary work.
- `npm run test:structural` runs registry, governance and finance checks only. **This is what the
  proposal workflow runs**, because a proposal is supposed to move those numbers.
- When you accept an assumption change, regenerate the fixture in the same commit:

  ```bash
  npm run test:baseline
  ```

Running the full suite in the proposal job would fail every legitimate proposal and the mechanism
would never open a single pull request. That trap is easy to walk into — it was hit the first time
this workflow was exercised — and it is worth understanding rather than working around.

What the proposal job *does* still enforce is that the proposed value is a valid market input and
that automation stayed inside its authority. A proposal cannot smuggle in a malformed field or a
change to something it was never allowed to touch.

---

## Reviewing a proposal

Every automated pull request ends with this checklist:

- The source and window are the ones you would have used
- The proposed value is consistent with your view, not merely with the data
- The downstream impact is acceptable and does not misorder the league table
- If you accept a `merchGross` change, **re-anchor**

Rejecting one is just closing it. The pipeline will raise it again while the drift persists — adjust
the assumption, re-anchor, or widen the threshold. All three are analyst decisions and none of them
is automated.

---

## Related

- [`live-data.md`](live-data.md) — the pipeline: sources, connectors, scheduling, operations
- [`data-policy.md`](data-policy.md) — public vs confidential, and what may be republished
- [`comparison-methodology.md`](comparison-methodology.md) — the model the impact gate runs
