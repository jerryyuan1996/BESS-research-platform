# Plan — Global Energy Monitor and OpenInfraMap as map layers

Draft for review. **Nothing in this plan is implemented.**

Question asked: can globalenergymonitor.org and openinframap.org improve the
platform — specifically, can they put HV lines and large BESS or renewable
projects on the map in each market?

Short answer: **one of them can, the other is not what it looks like, and
neither should be allowed near the economics.**

---

## 1 · What the two sources actually are

### OpenInfraMap is a renderer, not a dataset

Every layer on openinframap.org is drawn from **OpenStreetMap**. Open Infra Map
adds styling and analysis, not data. There is therefore nothing to integrate
*from* Open Infra Map — the integration is with OSM, and Open Infra Map is best
treated as the reference rendering that proves the OSM tags are usable.

Consequences:

| | |
|---|---|
| Licence | **ODbL** (© OpenStreetMap contributors) — attribution **and share-alike on derived databases** |
| Access for small extracts | Overpass API (free, public, no key) |
| Access for bulk | raw OSM extracts, or paid Shapefile/GeoPackage from Infrageomatics |
| Their tile server | Tegola-based, **no published usage policy or SLA** |

**Do not hotlink openinframap.org tiles.** There is no stated permission or rate
limit for third-party use, and the platform would acquire a hard runtime
dependency on someone else's unfunded server.

**ODbL share-alike is the open legal question** and it is a decision for you, not
for me. Publishing a derived geographic database under ODbL is a different
commitment from the CC BY 4.0 terms the rest of the platform's public data
carries. Section 6 sets out the narrow-use option that most likely avoids it.

### Global Energy Monitor is generation-side only

GEM has **no transmission tracker**. Their trackers cover power plants. The
relevant one is the **Global Integrated Power Tracker** — 182,400 facilities,
22,296 GW, 200 countries/areas, unit-level, most recent release **August 2026**.
It covers coal, oil, gas, nuclear, geothermal, bioenergy, solar, wind and hydro.

**GEM does not have a standalone BESS tracker.** It tracks storage *associated
with* wind and solar plants — currently 2,144 solar farms and 822 wind farms
globally with associated storage. Chile has a separate BESS addendum. So GEM can
answer "where are the big renewable projects, and which of them have storage
attached", and cannot answer "where are the merchant BESS projects".

| | |
|---|---|
| Licence | **CC BY 4.0** for most trackers — but *some are CC BY-NC-SA* (e.g. Global Coal Public Finance Tracker) |
| Access | download form → Excel. **No API.** |
| Cadence | periodic releases, not continuous |
| Citation | "Global Integrated Power Tracker, Global Energy Monitor, August 2026 release." |

**Gate before any work starts:** confirm in writing which licence attaches to the
Integrated Power Tracker release we actually download. CC BY 4.0 is compatible
with this platform; CC BY-NC-SA is not, because the platform is commercial
research. This is a blocking check, not a formality.

---

## 2 · Measured coverage — not assumed

I ran live Overpass queries on 2026-08-08 rather than trusting the tag
documentation. Counts are for the market's bounding box.

| Area | BESS plants | HV line ways ≥200 kV | Substations ≥200 kV |
|---|---|---|---|
| Germany | 173 | 14,435 | — |
| Italy | 15 | 5,232 | 662 |
| Romania | **1** | 927 | 128 |
| Texas (ERCOT) | 174 | 6,360 | 855 |
| California (CAISO) | 71 | 7,670 | 572 |
| PJM footprint | 25 | 15,026 | 1,697 |
| Western Australia | 7 | 122 | 34 |

GB, IE, PL, JP and the NEM were rate-limited (HTTP 429/504) and must be
re-measured before sign-off.

Sample records are genuinely good where they exist — Irish BESS returns named
assets with power, energy and operator:

```
Lumcloon 100MW BESS   100 MW / 25 MWh   Lumcloon Energy Limited
Southwall BESS         30 MW / 60 MWh   ESB Generation and Wholesale Markets
Kelwin-2 BESS          26 MW / 26.6 MWh Statkraft
```

### The conclusion that follows

**HV network geometry: dense and usable in every market probed.** This is the
part worth building.

**BESS project inventory: not publishable.** Romania returns *one* mapped
battery against Germany's 173. Romania is a market this platform underwrites on
a merchant thesis; a map that shows one battery there would not read as
"OpenStreetMap is incomplete in Romania", it would read as "Romania has no
storage". The variance is a property of who maps, not of who builds. Publishing
it would be the platform asserting something it has no evidence for — which is
the specific failure the governance model exists to prevent.

---

## 3 · What to build

### Adopt

1. **HV transmission lines and substations from OSM/Overpass**, as a new layer
   on the existing per-market grid maps. Geography, observed, deterministic.
2. **GEM Integrated Power Tracker renewable projects** (solar/wind ≥ a size
   threshold, operating and construction status) as *market context* on the same
   maps — a manually approved snapshot per GEM release, never a cron feed.
3. **GEM's co-located storage flag**, labelled exactly as what it is: "storage
   attached to this solar/wind project", never aggregated into a storage
   pipeline figure.

### Do not adopt

4. **OSM as a BESS pipeline source** — coverage variance, above.
5. **Open Infra Map tiles** — no usage policy, no SLA.
6. **Any path from either source into `comparison.economics`.** These are map
   layers. They do not touch capex, revenue, scores, IRR or the thesis.

---

## 4 · Governance classification

Required by `docs/governance.md` before either source ships. Each output is
classified before it is written, and the classification narrows what the machine
may do with it.

| Output | Class | Machine may | Machine may never |
|---|---|---|---|
| OSM HV lines / substations geometry | observed | publish after validation | alter voltage or operator by inference |
| GEM project records | observed, release-gated | **propose only** — open a PR against a new release | auto-merge, or publish an unreviewed release |
| Anything derived from either | derived | recompute under approved methodology | become an input to economics or scoring |

GEM is proposal-only rather than publish-after-validation because a GEM release
is an editorial event, not a data tick — a new release can restate history, and
that is a change an analyst signs off, not a cron job.

Automation grade for both is **B/C**, not A: Overpass is a shared public
endpoint with no SLA (I hit 429 and 504 during a handful of probe queries), and
GEM is a manual form download.

---

## 4a · Resolved — HV definitions per market

Researched against each system operator's own published definition and declared
in `src/governance/transmissionVoltage.js`. `bulk` is the backbone shown at
market zoom; `detail` is the operator's full transmission definition, revealed on
zoom-in.

| Market | Bulk | Detail | Whose definition | Why the detail cut sits there |
|---|---|---|---|---|
| GB | 275 | **132** | NESO / NGET / SPT / SSEN-T | 132 kV is transmission in the two Scottish licence areas, distribution in England & Wales. A 275 kV cut erases the Scottish network. |
| IE | 220 | **110** | EirGrid | 110 kV is transmission in Ireland, and most Irish batteries connect at it. |
| DE | 380 | **220** | 50Hertz / Amprion / TenneT / TransnetBW | The Übertragungsnetz is 380/220 kV; 110 kV belongs to the DSOs. |
| IT | 380 | **132** | Terna | The RTN itself runs 380 kV down to 132 kV — lower than most European definitions. |
| RO | 400 | **220** | Transelectrica | 750/400/220 kV is the transmission system; the 750 kV line is largely out of service. |
| PL | 400 | **220** | PSE | PSE's own description: 295 EHV lines at 220 and 400 kV. No sub-transmission tier. |
| JP ×3 | 500 | **154** | OCCTO / GTDUs | 500 kV trunk, 275/187 kV sub-transmission, 154 kV beneath; 66/77 kV is distribution. |
| WA | 330 | **132** | Western Power | SWIS transmission is 330/220/132 kV. At 220 kV the whole network is ~122 segments. |
| NEM | 330 | **132** | AEMO + TNSPs | Backbone is 500–220 kV by state; 132/110 kV is transmission in TAS and parts of SA. |
| PJM | 345 | **230** | PJM under NERC BES | NERC's BES floor is 100 kV, which returns tens of thousands of segments here. 230 kV is PJM's bulk planning level. |
| ERCOT | 345 | **138** | ERCOT | ERCOT names 765/500/345 kV as EHV and 230/161/138 kV as HV — an unusually explicit two-tier definition. |
| CAISO | 500 | **230** | CAISO under NERC BES | The controlled grid is mostly 500/230 kV; 230 kV is where utility-scale storage interconnects. |

## 4b · Resolved — BESS pipeline sources per market

Declared in `src/governance/projectPipelineSources.js`. `verified` means the
publisher and the fields were checked; `candidate` means the dataset is
identified but its fields are **not** confirmed and nothing may be built against
it yet; `none` means no adequate public source was found and the market renders
no storage layer.

| Market | Status | Source | Carries |
|---|---|---|---|
| DE | **verified** | Marktstammdatenregister, Bundesnetzagentur (DL-DE-BY-2.0) | power, energy, operator, coordinates, status, COD |
| PJM / ERCOT / CAISO | **verified** | EIA-860M (US public domain), joined to annual EIA-860 | power, operator, status, COD; energy + coordinates via join |
| NEM / WA | **verified** | AEMO Generation Information | power, energy, operator, status, COD; coordinates via DUID join |
| GB | **verified** | NESO TEC Register — *already wired into the ETL* | power, operator, status, COD. **No MWh, no duration** — the register has neither and the existing connector deliberately synthesises neither. |
| IE | **verified** | OpenStreetMap (ODbL), boundary-clipped | 26 plants / **1,039 MW** vs ESB Networks' ~1 GW available — effectively the whole fleet. Operator on 25/26, energy on 14/26. EirGrid's own lists are PDFs with no storage flag and no coordinates. |
| IT | **none** | — | MACSE publishes awards by *zone*, not project — no coordinates. OSM gives 11 plants / 543 MW against a fleet MACSE alone is adding 1,491 MW to. |
| PL | **none** | — | URE publishes unit lists without coordinates. OSM gives **4** plants once clipped to Poland. |
| JP ×3 | **none** | — | OSM returns one 50 MW plant in Kyushu and zero in Tokyo and Hokkaido, against gigawatts of LTDA awards. OCCTO publishes awards but not coordinates. |
| RO | **none** | — | One mapped battery for the whole country. Romania is the market this platform ranks *first* on merchant returns, so an empty-looking layer would be actively misleading. |

**Verification outcome (2026-08-09): one of the four candidates passed.** Storage
renders for **8 of 14** markets; the other six render no storage layer and say
why. The HV grid layer is unaffected and covers all 14.

**A bug this found.** Bounding boxes bleed across borders. Poland's unclipped box
returned 13 battery plants of which **nine were German** — BigBattery Lausitz,
Neuhardenberg, EnBW units in Brandenburg — a 69% contamination rate that would
have put 599 MW of German storage on Poland's map. `etl/lib/geo.mjs` now clips
every fetched feature to the market's own boundary at ingest, before anything is
written. Italy loses 5 of 16 and Ireland loses none, which is why Ireland's
coverage figure can be trusted.

Coverage is recorded as a **measurement**, not a claim: `coverage.measuredOn`,
`plants`, `mappedMW` and the published total it was compared against are stored
with the source, because OSM improves and degrades and a source that is complete
today may not be next year.

Two rules fall out of this and are enforced by `tests/map-sources.test.js`:

- **Interconnection queues are not pipeline.** Only `operating` and
  `construction` render. AEMO's proposed category alone is 18.6 GW.
- **A candidate declares no fields**, so building against an unchecked source is
  impossible by accident rather than by discipline.

## 5 · Implementation phases

Each phase is independently reviewable and independently revertible.

**Phase 0 — licence gate.** ✅ *cleared 2026-08-09*
The platform is non-commercial personal study, so **ODbL share-alike is accepted**
and **CC BY-NC-SA trackers are usable**. Both obligations still attach to the
published Cloudflare Pages site: ODbL attribution must be visible wherever the
layer is drawn, and the page must not be commercialised. `LICENCE` in
`etl/sources/osm-grid.mjs` travels with the data so the renderer cannot lose it.

**Phase 1 — source registration.** ✅ *done*
`src/governance/transmissionVoltage.js` and
`src/governance/projectPipelineSources.js` declare, for all fourteen allocation
markets, what counts as transmission and where the pipeline comes from.
`tests/map-sources.test.js` holds both against the registry, so a newly
registered market cannot reach a map without a declaration.

Still to do here: fold these into `sourceCatalog` entries so
`validateGridMapData()` sees them, and add `checkedAt` stamps.

**Phase 2 — ETL fetchers.** 🟡 *OSM done, GEM outstanding*

`etl/sources/osm-grid.mjs` is built and verified against the live endpoint:
Ireland returns **2,646 lines and 181 substations**, correctly attributed to
EirGrid, and the retry absorbed a real 504 on the first attempt. 1,937 of those
lines are 110 kV — 73% of the network — which is the evidence that the
per-market threshold decision was the right one rather than a nicety.

Two bugs were found and fixed in the building:
- the shared `httpGet` was GET-only and silently dropped a POST body, so every
  Overpass request would have failed. It now supports POST while keeping the
  timeout, backoff and user agent.
- the first voltage filter discriminated only on the leading digit, so 110, 132,
  138 and 154 kV produced an identical regex. It would have pulled 110 kV
  distribution into GB's 132 kV layer. The filter is now an explicit **superset**
  and the exact cut is applied after transfer, where multi-voltage lines can be
  judged on their highest level. `tests/osm-grid.test.js` pins both halves.

Still to build here:
- `etl/sources/osm-grid.mjs` — one Overpass query per market bbox, filtered by
  voltage threshold, simplified with the existing routine in
  `scripts/refresh-grid-boundaries.mjs`, written to `public/data/public/`.
  Must carry a descriptive `User-Agent` (Overpass returns 406 without one),
  back off on 429, and **fail the run rather than publish a partial network** —
  a half-fetched grid is worse than no grid.
- `etl/sources/gem-power.mjs` — parses a manually downloaded release file from
  `local-data/`, not a fetch. Records the release name in the envelope.

Extend `npm run etl:verify:grid-maps` to cover both.

**Phase 3 — render, at two levels of detail.** 🟡 *clustering done, wiring outstanding*

`src/projects/clusters.js` implements the clustering rules below and
`tests/project-clusters.test.js` holds them. Radius-based, not grid-based: the
first version used a fixed grid and its cell boundaries split projects three
pixels apart into separate markers, which is exactly the dense case clustering
exists for. `src/projects/schema.js` gained nullable coordinates and a
technology field, so the map and the pipeline table read one record.

Outstanding: the pan/zoom interaction and the layer drawing in
`src/components/geographicGridMap.js`, which is currently a fixed-extent
projection with no zoom.


The overview tab of each market dashboard keeps the map it has now — current
status, no new layers. Everything added here lands on the **grid** tab only,
which becomes the detailed map: drag to pan, zoom in and out, layers toggleable.

Clustering is the mechanism that makes density survivable. Where projects
overlap at the current zoom they collapse into one marker carrying the **project
count and the summed power and energy**, operating and under-construction
counted together and broken out in the tooltip. Individual projects resolve only
as the reader zooms in. Concretely:

- cluster on a grid in projected space, re-computed per zoom level, so the rule
  is the same in every market and no market needs a hand-tuned radius;
- a cluster label reads e.g. `12 projects · 940 MW / 2,180 MWh`;
- a cluster whose members lack energy data — every GB project, since the TEC
  register has no MWh — must show power only and say the energy is unpublished,
  never sum a partial set into a number that looks complete;
- clusters never merge across status, so an operating fleet is never visually
  padded by construction.

**Phase 3b — pipeline section.**
The same normalized project records feed each market's existing `pipeline` tab,
so the map and the pipeline table cannot disagree — one dataset, two renderers.

**Phase 4 — home globe.** Deferred, and probably not worth doing: at globe zoom
even a clustered project layer is noise. Revisit only after Phase 3 ships.

**Phase 5 — tests.**
- Every new source validates against `validateGridMapData`.
- Voltage filters actually exclude sub-threshold lines.
- **A coverage-floor test**: a market whose fetched feature count falls below a
  declared floor fails the build rather than publishing a sparse map. This is
  the mechanical guard against the Romania problem, and it is the test that
  matters most in this plan.
- Snapshot sizes stay within the repo budget (PJM alone returned 15,026 line
  ways — these need aggressive simplification, and the size ceiling should be
  asserted).

---

## 6 · Open questions for you

1. **ODbL share-alike.** Does the platform accept it? The narrow option is to
   render OSM-derived geometry without publishing a derived database — display
   only, attribution shown, no bulk download offered. That most likely keeps the
   share-alike obligation from attaching, but it is a legal call and should have
   a legal answer before Phase 2, not after.
2. **GEM licence per release** — blocking, per §4.
3. ~~Voltage threshold per market.~~ **Resolved** — see §4a.
4. **Is the renewable layer worth it at all?** GEM solar/wind gives context for
   a co-location or cannibalisation argument. If the maps are read for
   congestion and connection, HV lines and substations may be the whole value
   and GEM adds weight for little return. Phase 1–3 can ship without GEM.
5. **The four candidate markets.** IE, IT, PL and JP have identified but
   unchecked sources. Each needs an endpoint check before it can be built
   against; if a check fails, that market joins Romania at `none` rather than
   getting a lower-quality substitute.

---

## 7 · Recommendation

Build the **OSM HV network layer**. It is well covered everywhere measured, it
answers a question the platform already asks (where is the constraint, where is
the connection), and it slots into the existing grid-map architecture without
touching the model.

Treat **GEM as a periodic analyst-approved context layer**, not a feed, and only
after its licence is confirmed.

**Do not put a BESS pipeline on the map from either source.** Neither one knows
where the batteries are — GEM only sees storage bolted to a solar or wind farm,
and OSM's coverage varies by two orders of magnitude between markets that this
platform treats as comparable.

---

## 8 · Delivery constraints transform data, they never discard it

Italy forced this rule into the pipeline. Terna's RTN reaches 132 kV, comes back
as 15,079 segments, and an earlier version of the refresh script responded to the
resulting 4.4 MB file by **deleting it** — silently removing the largest
transmission network on the platform because a file was inconvenient.

The pipeline now, for every market:

1. **keeps the raw fetch** unsimplified in `local-data/raw/grid/` (gitignored) —
   the ingest of record, so a representation decision can be revisited without
   re-querying a volunteer-funded endpoint;
2. **splits by the market's declared voltage bands** — Italy: 380 kV · 220 kV ·
   132–150 kV, which are Terna's own classes;
3. **escalates simplification per band** only where a band needs it, so the
   backbone keeps full fidelity while the detail class is coarsened;
4. **chunks a band that still will not fit**, and
5. **writes every band regardless.** Over budget is reported as needing tiles.
   Nothing is deleted for being large. The only failure that drops data is an
   incomplete fetch, because a partial network is a wrong network.

Italy delivers as four files, all inside budget, with the full RTN intact:

| Band | Segments | Size | Tolerance |
|---|---|---|---|
| 380 kV+ | 1,913 | 0.58 MB | 0.004 (full) |
| 220–379 kV | 1,900 | 0.53 MB | 0.004 (full) |
| 132–219 kV | 11,266 | 1.49 + 0.84 MB | 0.013 (coarsened, 2 parts) |

The 380 and 220 kV classes load with the map; the 132–150 kV class arrives on
zoom past 2× or through an explicit **Detailed grid — 132–219 kV (2.4 MB)**
toggle that states its own cost. Verified in the browser: 3,813 backbone
segments at load, 15,079 after the detail band arrives. MACSE zones are
independent of all of it — a procurement geography is not a voltage class.

## 9 · The spreadsheet dependency

`exceljs` (MIT) is a **devDependency**, scoped to the data pipeline.
`etl/lib/workbook.mjs` is the only file that imports it, and
`tests/etl-boundary.test.js` fails the build if anything under `src/` reaches for
either. The bundle is unchanged at 3,370 kB.

It is exceljs rather than SheetJS's `xlsx` deliberately: the `xlsx` package on
npm is a stale 0.18.x with known advisories and SheetJS now distributes from its
own registry — a supply-chain shape not worth taking on for a data-ingest
convenience. No licensing or deployment constraint arises; nothing ships to the
browser.

---

## 10 · The ingestion pipeline

Three workbook sources now normalize into one schema, and publication is atomic.

| Source | Authority | Carries | Does not carry |
|---|---|---|---|
| **MaStR** (DE) | statutory | MW, MWh, operator, coordinates, COD, unit id | — |
| **EIA-860M** (PJM/ERCOT/CAISO) | statutory | MW, operator, status, COD | MWh; coordinates until the annual join |
| **EIA-860 annual** (enrichment) | statutory | coordinates, county, utility, BA | never MWh or duration |
| **AEMO GI** (NEM/WA) | operator | MW, MWh, owner, DUID, COD | coordinates in this vintage |

Every record carries provenance: authority, dataset, publisher, source record id,
publication date and ingestion timestamp. `authority` distinguishes a statutory
filing from an operator survey from volunteer mapping — the same fact from three
sources is three different claims, and the record says which.

**The enrichment join** keys on EIA's own plant code (`exact`). A fallback
matches normalised name within a single state (`name-state`), is switchable off,
and refuses to resolve a name that occurs twice in one state rather than picking
one. Zero-coordinate rows are rejected: 0°,0° is the Gulf of Guinea and the
signature of an empty cell read as a number.

**Reconciliation** runs after schema validation and asks the harder question —
is this dataset plausible *given the last one we accepted*. It catches the class
of failure where every record is individually valid: a register that halves
overnight, a 1,000× capacity jump (named as a likely unit-conversion slip), a
status map that stopped matching, a column that vanished into null rates,
duplicate ids, impossible dates.

**Publication is atomic and defensive.** `download → parse → normalize →
validate → reconcile → publish`. A failure at any stage leaves the last
known-good artifact byte-identical and writes a diagnostic beside it saying why.
Drift warnings block by default and require `--accept-drift`, because the cost of
a false stop is a re-run and the cost of a false publish is silently wrong
published data. The previous version is kept as `.previous.json` so a bad
acceptance can be reversed without a re-fetch.

Writes go through `etl/lib/boundary.mjs`, which confines them to
`public/data/public/`. The first version of the publisher called `renameSync`
directly and `tests/governance.test.js` caught it — the atomic primitives now
live inside the boundary, so policy and mechanism are separated and the wall has
one door.

**The dashboard reads `src/projects/registry.js`** — one interface over all four
sources. It reports `hasSource` separately from record count, so a market with no
verified source (Romania, Italy, Poland, Japan) renders differently from one that
has a source and nothing in it, and `coverage()` reports `energyUnknown` so a
caption can never imply a fleet has no energy when the source simply does not
publish one. No `exceljs` and no workbook parsing under `src/`; the bundle is
unchanged at 3,370 kB.
