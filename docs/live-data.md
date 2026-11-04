# Live data — the pipeline

What is fetched, from where, how it is scheduled, and what to do when it breaks.

For *who is allowed to change what*, see [`governance.md`](governance.md). This document is the
operational half.

---

## Shape

```
   GitHub Actions cron (every 6h)
        │
        ├─ etl/run.mjs
        │    ├─ read the snapshot currently on disk
        │    ├─ fetch from the source            etl/sources/*.mjs
        │    ├─ merge into the trailing window   etl/lib/series.mjs
        │    ├─ validate                         etl/lib/validate.mjs
        │    ├─ write  ── boundary ──►  public/data/public/
        │    ├─ derive metrics                   src/derive/*.js
        │    └─ detect drift                     etl/drift/*.mjs
        │
        ├─ commit public/data/ → main → CI re-gates and redeploys
        │
        └─ if material drift:  etl/propose.mjs on a branch → pull request
```

The site is still completely static. There is no backend, no database, no runtime secret and no
server-side logic. Data changes are **git commits**, which is what makes the history an audit trail:
`git log public/data` shows when every number moved and what the run said about it.

---

## Sources

| Dataset | Market | Source | Cadence | Key |
|---|---|---|---|---|
| `fx-ecb` | global | ECB euro reference rates | daily | — |
| `gb-day-ahead` | GB | ENTSO-E Transparency | 12h | `ENTSOE_TOKEN` |
| `gb-dynamic-response` | GB | NESO Dynamic results, fixed 2020–2023 vintage; availability prices and cleared/technology MW | fixed after initial import | — |
| `gb-eac-response` | GB | NESO EAC response results; FY2023–FY2025 archives plus current results | read on the existing 6h run; source daily | — |
| `ie-day-ahead` | IE | ENTSO-E Transparency | 12h | `ENTSOE_TOKEN` |
| `ro-day-ahead` | RO | ENTSO-E Transparency | 12h | `ENTSOE_TOKEN` |
| `pl-day-ahead` | PL | PSE reporting API (`csdac-pln`) | 12h | — |
| `wa-wem-prices` | WA | AEMO WEM reference trading price | daily | — |
| `jp-tokyo-jepx` | JP-Tokyo | JEPX spot | daily | — |
| `jp-kyushu-jepx` | JP-Kyushu | JEPX spot | daily | — |
| `jp-hokkaido-jepx` | JP-Hokkaido | JEPX spot | daily | — |
| `fi-storage-capacity` | FI | Fingrid dataset 424, hourly network-model technical power (MW, CC BY 4.0); includes some units approaching operation | 24h | `FINGRID_API_KEY` |
| `fi-day-ahead` | FI | ENTSO-E Transparency | 12h | `ENTSOE_TOKEN` |
| `fi-fcr-n`, `fi-fcr-d-up`, `fi-fcr-d-down`, `fi-afrr-up`, `fi-afrr-down`, `fi-mfrr-up`, `fi-mfrr-down` | FI | Fingrid open data, hourly reserve capacity prices (EUR/MW/h, CC BY 4.0) | 12h | `FINGRID_API_KEY` |

The catalogue is [`src/governance/datasets.js`](../src/governance/datasets.js) — the only place the
platform learns a dataset exists, in the same way `markets/registry.js` is for markets.

### Getting the ENTSO-E token

Four of the eight markets need it. Register at
[transparency.entsoe.eu](https://transparency.entsoe.eu/), then **email the service desk to have API
access enabled** — it is not granted automatically on signup, which surprises most people once.

Add it as a repository secret named `ENTSOE_TOKEN`. It is used only in CI and never reaches the
bundle.

A missing token is not an error. The connector skips its dataset, the previous snapshot stays in
place, and `/data` shows the feed as unconfigured.

### The Fingrid key (Finland's reserve prices)

Register at [data.fingrid.fi](https://data.fingrid.fi/) for an *Open Data starter* subscription and
use its primary key. The repository secret is named **`FINGRID_API`**. The ETL workflow maps it to
`FINGRID_API_KEY`, which is what `etl/sources/fingrid.mjs` reads. The starter key allows about one
request every two seconds, so the connector spaces its requests and retries 429s.

These seven series bear on `economics.services` for the record, but no detector reads them. Spread
metrics and merchant drift run only for datasets that bear on `economics.merchGross`, so a reserve
price in EUR/MW/h is never read as an energy spread. Fingrid publishes no day-ahead price, so
Finland's comes from ENTSO-E (`fi-day-ahead`).

Locally: put `FINGRID_API_KEY=…` in the git-ignored `.env.fingrid` (not `.env.local`, which the
Vercel CLI rewrites). Then run `node --env-file=.env.fingrid etl/run.mjs --only fi-fcr-n`. Behind a
proxy, add `NODE_USE_ENV_PROXY=1`, because Node's fetch ignores `HTTPS_PROXY` without it.

### Why GB uses ENTSO-E rather than Elexon

Elexon BMRS is the better GB source — it carries imbalance and Balancing Mechanism data that ENTSO-E
does not, and those are a large part of a GB battery's revenue. Its gateway returned `403` to every
request during development, so it is not wired: a connector that cannot be verified against the live
service is one that fails its first unattended cron run.

ENTSO-E carries GB day-ahead, is already wired for three other markets, and is proven to respond.
Adding Elexon later is additive — a second dataset for the same market, not a replacement.

### Deliberately not automated

GB story response data uses `etl/sources/neso-response.mjs`, under the NESO Open Data Licence with attribution. These two datasets have `bearsOn: []`: response availability prices never become merchant revenue or a drift proposal. The cold import queries service-level summary records and technology totals, excluding participant and site identities. Fixed Dynamic history then skips before network access; loaded EAC archives are retained, while current EAC results refresh on the existing six-hour job. New results can add the two snapshot/summary pairs to its ordinary data commits; identical payloads create no timestamp-only commit. There is no schedule change. Each query uses stable bounded pagination and the existing failed-fetch retention policy.

The response summary carries a monthly table, with separate product/direction, GBP/MW/h and MW. It uses the connector's `summarize` hook instead of the generic energy-price daily/spread path. No arbitrage metric is produced. The initial data audit and source gates are recorded in [the GB data QA note](immersive-experience-plan/gb-data-qa-2026-11-01.md).

- **Capacity-market results** (NESO CM Register, OCCTO, SEMO, PSE, Transelectrica) — published as
  periodic auction outcomes rather than a feed, and each needs a de-rating factor applied before it
  becomes `contracted`. Worth adding; not as an unattended parse of a results PDF.
- **Japan EPRX balancing products** — no open programmatic endpoint. See
  [`japan-etl-gates.md`](japan-etl-gates.md).
- **Licensed third-party revenue indices** — present in several source registers and *not
  republishable*. A connector may read one to compute drift, but its values must never be written
  into `public/data/`. That is a licence constraint, not a preference.

---

## Two files per dataset

```
public/data/public/<id>.json           the full observed series — audit artefact
public/data/public/<id>.summary.json   what the site loads
```

A year of half-hourly Japanese prices is 1.2 MB; three Japanese areas alone are 3.6 MB. Loading that
into the browser to draw a chart with 365 visible points would cost four times the entire application
bundle. The summary carries envelope metadata, the derived metrics and one row per local trading day
— about 70 kB — and is a strict function of the full snapshot, so the two cannot disagree.

### The envelope

Every snapshot answers, without leaving the file: where it came from, when, what period it covers,
what units it is in, who was allowed to write it, and whether it has changed.

```json
{
  "schemaVersion": 1,
  "datasetId": "wa-wem-prices",
  "authority": "observed",
  "source": { "name": "AEMO WEM Data", "url": "…", "licence": "…" },
  "fetchedAt": "2026-07-29T00:26:44.422Z",
  "coverage": { "from": "…", "to": "…", "resolution": "PT30M", "points": 2112 },
  "units": { "price": "AUD/MWh" },
  "series": [ { "t": "…", "v": 129.35 } ],
  "contentChecksum": "sha256:…",
  "envelopeChecksum": "sha256:…"
}
```

Two checksums, and the split matters: `contentChecksum` covers the data only, so a six-hourly cron
that fetches identical data writes nothing instead of committing four near-identical files a day.

---

## Derived calculations

Pure functions in [`src/derive/`](../src/derive/), importable by both the browser and Node, and pinned
by tests.

| Metric | Notes |
|---|---|
| mean, median, stdev, p5, p95 | over the whole window |
| negative-hours share | charging value for a battery, not a problem |
| daily spread | mean of the best *n* hours minus the mean of the worst *n*, for the archetype's duration |
| charge / discharge levels | carried separately — efficiency acts on the charge leg |
| arbitrage index | annualised wholesale-arbitrage revenue per MW |

Three details that are easy to get wrong and expensive to get wrong:

**Spread is not max minus min.** A 2-hour battery cannot discharge its whole energy into a single
settlement period. Using `max − min` overstates the opportunity, and overstates it most in exactly
the volatile markets where the error matters.

**Efficiency acts on the charge leg.** The correct margin is
`duration × (dischargeMean − chargeMean / η)`, not `duration × spread × η`. The two differ more the
higher the absolute price level.

**Days are local.** Grouping a Japanese market by UTC days splits each trading day across two buckets
and understates every spread — silently, and by an amount that looks plausible.

Bridge parameters — efficiency, cycles, availability, realisation — are in
[`src/governance/derivation.js`](../src/governance/derivation.js) under `methodology` authority. They
are conventional industry mid-points, not this platform's research, and are meant to be replaced with
your own.

---

## Running it

```bash
npm run etl            # fetch, validate, publish, detect drift
```

```bash
npm run etl:dry        # fetch and validate, write nothing
```

```bash
npm run etl:verify     # confirm every published snapshot matches its checksum
```

```bash
npm run etl -- --only fx-ecb,wa-wem-prices
```

Outputs land in `etl/out/` (git-ignored): `drift-report.md`, `summary.json`, and — only when
something is material — `pr-body.md` and `proposals.json`.

---

## Operating it

### Failure policy

A dataset that fails does not fail the run and never publishes a bad snapshot. The previous file
stays exactly where it is.

The run exits non-zero only when the *pipeline* is broken — a boundary violation, an unhandled crash.
A source being down exits zero, because that is a normal Tuesday, and a red cron every time an
upstream regulator reboots trains everyone to ignore it.

### Concurrency

Datasets run through a small pool, not one at a time and not all at once. Two limits apply:

| Limit | Default | Set by |
|---|---:|---|
| Datasets in flight, overall | 3 | `ETL_CONCURRENCY` (1–8; above 8 is clamped and reported) |
| Datasets in flight, per provider | 1 | `ETL_PROVIDER_CONCURRENCY=jepx=2,entsoe=2` |

Per-provider defaults to one because a provider is the unit a rate limit is expressed in. Two
providers are declared in `etl/lib/concurrency.mjs` rather than defaulted:

- **`jepx` — 3.** Three area prices published as static CSV files: no key, no published rate limit.
  The three datasets read the same two fiscal-year archives, and the connector now fetches each file
  once per run and shares it, so running them together makes *fewer* requests than running them in
  sequence (two instead of six).
- **`fingrid` — pinned at 1, and not configurable.** The starter key allows about one request every
  two seconds and answers 429 beyond it; the connector spaces its own requests with a module-level
  clock that two concurrent datasets would race. `ETL_PROVIDER_CONCURRENCY=fingrid=…` is ignored with
  a warning.

A provider whose allowance is used up does not hold a global slot: the scheduler skips it and starts
the next dataset whose provider has capacity. That is the difference between a pool and a batch.

**Concurrency is an execution detail.** Results are assembled in catalogue order, the per-dataset
report is printed in catalogue order, and drift detection runs only after every selected dataset has
settled. A dataset that fails is recorded and the rest continue; a source being down cannot cancel an
unrelated one.

Each run writes what the pool was allowed to do and what it did:

```json
"concurrency": { "global": 3, "maxObserved": 3, "providers": { "jepx": 3, "fingrid": 1, "ecb": 1 } }
```

`maxObserved` below `global` means the provider limits are the binding constraint, not the pool. That
is the number to read before raising anything.

### Backfill is incremental

Several sources publish one file per trading day. Rebuilding a year of history every six hours would
mean roughly fifteen hundred requests per run against a public regulator, four times a day, forever.
That gets an IP blocked and deserves to.

So the window fills at most 45 days per run, newest first. A cold start takes about a week of cron
ticks to reach a full trailing year — and until it does, the seasonality guard stops the short window
from generating proposals.

### Where to look when something is wrong

1. **`/data` on the live site** — every feed, its coverage, its freshness, and whether a credential
   is missing. This is the page that answers "which source broke and since when" without anyone
   reading a CI log.
2. **The workflow job summary** — the drift report is written there on every run.
3. **`git log public/data`** — when each number actually moved.

### Common failures

| Symptom | Cause |
|---|---|
| Feed shows *credential may not be configured* | `ENTSOE_TOKEN` missing, or API access not yet enabled on the account |
| `refusing to publish; confirm the source's units` | Upstream changed units. This is the guard working — check the source before overriding |
| `series is empty — refusing to publish` | Source returned nothing. Previous snapshot retained |
| Window stays short | Backfill is capped per run; give it several ticks |
| `content checksum does not match` in CI | A snapshot was hand-edited. Re-run the ETL |

---

## Adding a dataset

1. Write `etl/sources/<connector>.mjs` exporting
   `fetchDataset({ dataset, previous, log, now })`. Return `{ snapshot }` from `buildSnapshot()`, or
   `{ skipped: true, reason }` when a credential is absent.
2. Register it in `CONNECTORS` in [`etl/run.mjs`](../etl/run.mjs).
3. Add a catalogue entry in [`src/governance/datasets.js`](../src/governance/datasets.js), including
   `bearsOn` and `republishable`.
4. If it bears on a field not yet classified, add it to `COMPARISON_AUTHORITY` and decide its class.

`npm test` will tell you if you skipped step 4 — that is what the exhaustiveness test is for.

---

## Related

- [`governance.md`](governance.md) — who may change what, and how it is enforced
- [`data-policy.md`](data-policy.md) — public vs confidential
- [`architecture.md`](architecture.md) — the application structure

### Finland story scale comparison

The story's storage feed, `fi-storage-capacity`, is dataset [424](https://data.fingrid.fi/en/datasets/424): hourly technical power in the network model, in MW. It includes systems over one MW and some units approaching operation. It is not an all-size connected or prequalified fleet; it has no `bearsOn` path and supplies no merchant or reserve earnings estimate. The existing seven price feeds retain EUR/MW/h.

The need side is a sourced, dated publication table in [storyNeed.js](../src/markets/fi/data/storyNeed.js), alongside the separate early-February connected estimate. Historical average procurement, the current gross product-obligation band and the later network-model series keep their different definitions. No feed is invented for publication tables and no line joins the two storage definitions.
