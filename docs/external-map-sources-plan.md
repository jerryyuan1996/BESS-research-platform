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
| IE | candidate | EirGrid connection offers / ECP | unconfirmed |
| IT | candidate | Terna open data + MACSE awards | unconfirmed |
| PL | candidate | URE capacity auction results + PSE | unconfirmed |
| JP ×3 | candidate | OCCTO LTDA award lists | unconfirmed |
| RO | **none** | — | Nothing adequate found. OSM has one mapped battery for the whole country. Romania is the market this platform ranks *first* on merchant returns, so an empty-looking layer would be actively misleading. It renders nothing, and says why. |

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
