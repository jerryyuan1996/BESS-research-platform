# Ontario day-ahead zonal price: source contract and decisions

This is the single topic log for ca-on-da-zonal. Test, commit, merge and publication receipts belong in the associated pull request. This phase implements only the first Ontario report in A08, independently of NESO PR #173 and Policy PR #159.

## Source and reproduction conditions

- [IESO public report directory](https://reports-public.ieso.ca/public/DAHourlyOntarioZonalPrice/) and [official data directory](https://www.ieso.ca/Power-Data/Data-Directory).
- [Report field description](https://reports-public.ieso.ca/docrefs/helpfile/DAHourlyOntarioZonalPrice.pdf): public, daily, hourly Ontario zone prices with capped loss and congestion components.
- [IESO Terms of Use](https://www.ieso.ca/Terms-of-Use), checked in full on 2026-11-06: a limited, non-exclusive, non-sublicensable, non-transferrable permission to use and reproduce content with its complete prescribed copyright/Terms statement. This is not CC/OGL or a new sublicense. Trademark, third-party and supplemental conditions remain applicable. No logos, website code, stylesheets or reports/schema documents are republished.
- The exact prescribed statement is maintained in src/governance/dataNotices.js, included in the raw snapshot and summary, and displayed with the catalogue row. Reuse is limited to the numerical public report and necessary provenance; the connector rejects non-public documents and unreviewed header additions rather than passing additional conditions or arbitrary text through to publication.
- The normal anonymous desktop check of www.ieso.ca/robots.txt returned HTTP 200; its exclusions do not cover the report/data/Terms paths used here. reports-public.ieso.ca/robots.txt returned HTTP 404. These checks do not grant unlimited access. There is no account, key, payment, identity/UA rotation, proxy change, protection bypass or automatic retry after denial.

Baseline: main / 6469ce0262042c04f04865277582135649a312ed. Its existing daily 06:17 UTC data cycle, live-data lock, cancel-in-progress:false, single writer and scanned-artifact publisher remain unchanged. This work does not implement the separate Policy proposal or merge any other task.

## Actual technical verification

Native anonymous checks on 2026-11-06 UTC succeeded:

| Item | Result |
| --- | --- |
| Directory, 20:37:07 | HTTP 200, 40,120 bytes; 184 dated links comprising 92 aliases and 92 versioned files; 92 distinct delivery dates, 2026-08-08 through 2026-11-07 |
| Current XML, 20:37:09 | HTTP 200, 6,064 bytes, delivery date 2026-11-07; SHA-256 4c4ba449a3ddf0a8a0a435b2caa1e3d423a4a12efe6ade01ce997bb98af52956 |
| Earliest listed version | HTTP 200, 6,086 bytes, 2026-08-08 v1; SHA-256 6be3dd19254f4c806a13b433b04a07d026b5de17b94543a92a1e254f88700076 |
| Civil clock-change day | HTTP 200, 6,011 bytes, 2026-11-01 v1; exactly 24 unique hour-ending records; SHA-256 014b4135926aec3c46ae504b1c97980577a43f3cceb0cfb0893f3064710197b7 |
| Revised historical report | HTTP 200, 6,033 bytes, 2026-09-24 v3 while XML DocRevision remains 1; SHA-256 1625cbb65ee77236e72841e37fc083fba9bb8a9a7c54415c55035a41321a814a |
| Schema reference | HTTP 200, 3,245 bytes. Its fields and revision were reviewed; this is not a claim that a general XSD validator has been incorporated |
| Independent sample audit | A .NET XML reader with DTD prohibited and external resolution disabled verified the four reports, 96 hourly records, three decimal price fields, public class, report dates, versions and exact input hashes. All sample flags were DSO-RD |

The raw probes, XSD and independent audit remain outside Git; they are not fixtures or public artifacts. Tests use synthetic XML. A directory listing is not a download-completeness claim. The observed directory has v1/v2/v3 across dates but only one versioned file per date; vanished older revisions cannot be reconstructed. The connector retains every version it actually acquires from now on.

## Fields, units and clocks

Each acquired report retains its exact versioned filename, delivery date, numeric version, schema revision, original offset-less CreatedAt text, UTC acquisition-cycle timestamp and source byte hash. DocRevision is the XML schema revision, not the report revision. The latter comes from the filename suffix, as described in [IESO Automated Documents standard](https://www.ieso.ca/-/media/Files/IESO/technical-interfaces/xml-automated-docs/STD-2.pdf).

Each hour retains ZonalPrice, LossPriceCapped, CongestionPriceCapped and Flag; all prices are CAD/MWh. Zero is retained only when explicitly supplied; blank is not zero. Source flags remain verbatim codes, without inferring battery awards or a new quality classification. The [official monthly report](https://ieso.ca/Power-Data/Monthly-Market-Report) identifies these currency statistics as CAD and identifies DA-OZP separately from Ontario Price and real-time prices.

The report's PricingHour is hour-ending 1–24. Under the [current market rules, Chapter 11](https://www.ieso.ca/-/media/Files/IESO/Document-Library/Renewed-Market-Rules-and-Manuals/market-rules/ieso-mr-chapter0-11.pdf), a dispatch day runs midnight EST to the next midnight EST. Therefore HE1 starts at 05:00 UTC; each delivery day has 24 hours, including civil clock-change days. The source's delivery clock is fixed UTC-05:00; America/Toronto wall time would be wrong in summer.

The [current DAM manual](https://www.ieso.ca/-/media/Files/IESO/Document-Library/Renewed-Market-Rules-and-Manuals/market-manuals/market-operations/ieso-mo-operation-dam.pdf) uses EPT for submission/execution/publication deadlines. That does not redefine delivery hours. XML CreatedAt has no explicit offset; it stays as source text without a claimed UTC conversion. fetchedAt/retrievedAt use the shared, injected UTC clock of the acquisition cycle; they do not claim a separate per-response completion time.

## Acquisition, archive and failure contract

- One directory read and at most **12 XML reads per existing run**, separated by one second; one attempt per URL. Newest version first, then the earliest missing files so the sliding directory does not discard them while a bounded backfill advances.
- Only exact, local dated/versioned XML links from this one directory are accepted. Current aliases and other report types are not fetched. A directory is limited to 1 MiB and 128 versioned links; each XML is limited to 64 KiB while streaming. Each complete response has a 20-second deadline; the entire source run including waits is limited to 90 seconds. Redirects are rejected. There are no new API/cache services.
- Previously archived filenames are the cache. Only the newest discovered version is rechecked; other unchanged versions are not downloaded again. Whitespace-only source changes do not create a version or timestamp-only write. A numerically changed file without a new version fails closed instead of silently overwriting its history.
- A batch is accepted only if all selected documents pass. Empty/partial days, duplicate hours, bad numbers, wrong schema/class, unreviewed conditions, malformed XML, timeout, rights failure or rate limit retain the last-good pair; independent providers continue. No zero-fill, interpolation, automatic alternate URL, host or credential is used.
- Normalized observations and provenance for every acquired version live in the raw snapshot's archive field. This archive is independent of the existing **365-day** series, which selects only the latest known version per day and keeps complete days starting inside that window. No global retention constant is expanded. The source-specific verifier binds the archive hash to the ordinary content checksum and recomputes the rolling view; CI verifies this in addition to the existing checksums.
- The compact summary excludes the archive payload. It contains actual coverage/gaps/pending filenames, daily mean/min/max and flag counts. Its generic derived and arbitrage fields are null, so this contextual feed cannot enter a wholesale-spread table or change financial inputs.
- The archive safety budget is 6,000 acquired versions / 16 MiB. It fails closed at the limit and never silently truncates historical versions. A later archive migration would need its own review; no new storage system is created here.
- Fetch/check time alone is excluded from write decisions. Original retrieval timestamps and byte hashes remain attached to cached records, and no-content-change runs do not publish.

## What this adds and what remains missing

The catalogue gains auditable post-renewal Ontario day-ahead zonal evidence and prospectively retained revisions. Accumulated hourly levels, negative prices, seasonality and loss/congestion components can support a later documented energy-market chart or independent backtest. Coverage and pending files distinguish a running task from a complete historical window.

This is not node-specific settlement, OEMP/Ontario Price, old HOEP, operating reserve, guaranteed arbitrage, project revenue or an automatic update to approved merchant assumptions. Empty bearsOn, unchanged model/view files and a custom summary preserve those boundaries. Future-delivery day-ahead prices are observed auction results, not realised dispatch.

DA/RT Energy LMP and OR LMP, history outside the available directory and missing old revisions are deferred. The first bounded seed cannot be represented as the full 92-day directory or a complete year. Additional acquisitions use the same bounded daily source path, not a new cron.

## Checks and rollback

Focused checks cover parsing, units, fixed EST/civil clock changes, complete days, zero/missing, duplicates, revisions, archive integrity and retention, access/timeout/size budgets, deterministic writes, last-good bytes and independent-provider progress. The catalogue page checks both languages and viewports, loaded points and the full reproduction notice. Its unchanged governance explanation loads only when the data route opens, with stale-render and visible reload handling, to preserve the initial bundle budget as feed evidence grows. Repository-required tests, frozen-model checks, build, confidentiality, budgets, snapshot verification and final-head CI are recorded in the PR.

Rollback removes only this new catalogue/connector entry, its raw/summary pair, source-specific verifier integration and optional notice display through the ordinary branch/CI path. Prior commits and archives remain in Git history. No old dataset, market input, approved method, source right, Policy switch, schedule, lock or publication authority needs to change.
