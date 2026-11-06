# NESO EAC reserve: source contract and decisions

This is the single topic log for the NESO reserve dataset. Update it in place as coverage and parsing decisions evolve. Implementation checks and publication receipts are recorded in the associated pull request.

This phase adds one independent `gb-eac-reserve` dataset for EAC Balancing Reserve (BR), Quick Reserve (QR) and Slow Reserve (SR), with positive and negative directions kept separate. Existing DC/DM/DR observations, approved model inputs and every other dataset retain their identities and behaviour. This is a partial implementation of A11, following the Elexon phase in PR #170; it does not complete the original A01–A14 list.

Baseline: `main` / `4c1f1fe84bc72f9857ae68420ce246122a50ae81`, checked on 2026-11-06. Development uses the isolated `feat/neso-reserve-evidence` branch. Ontario is owned by a separate task. Before merge, the final branch must incorporate and validate the then-current main. PR #159 and its Policy controls are outside this phase.

## Source and rights

| Item | Contract checked on 2026-11-06 |
| --- | --- |
| Official dataset | [EAC auction results](https://www.neso.energy/data-portal/eac-auction-results); the portal explicitly assigns the NESO Open Data Licence |
| File and fields | [Daily Results Summary](https://www.neso.energy/data-portal/eac-auction-results/neso_response-reserve_daily_results_summary) |
| Download | [Official anonymous daily CSV](https://api.neso.energy/dataset/291e3c28-75f2-4a8f-b5f5-008bebaac368/resource/3c51a666-1c33-450e-a6eb-c9b4a0c91584/download/neso-response-reserve-daily-results-summary.csv) |
| Resource ID | `3c51a666-1c33-450e-a6eb-c9b4a0c91584` |
| Permission | [NESO Open Licence](https://www.neso.energy/data-portal/neso-open-licence): copying, adaptation and distribution for commercial and non-commercial uses, with attribution; third-party rights and endorsement exclusions remain applicable |
| Attribution in both public files | Supported by National Energy SO Open Data |
| Access conditions | No login, key or payment. Ordinary anonymous GET; no browser scraping or protection bypass |
| Access budget | One small CSV and one attempt per existing ETL run, no runtime DataStore query. [Official API guidance](https://www.neso.energy/data-portal/api-guidance) recommends CKAN at most 1 request/second and DataStore at most 2/minute; this connector adds no calls to either API |
| Failure handling | The entire response body has a 20-second deadline; accepted CSV is at most 1 MiB. The shared HTTP helper retains its own response-size checks. Any download, format or validation failure leaves last-good files unchanged and lets other providers run. 401/403/429 cause no retry or alternate URL |
| Update frequency | NESO updates the file daily with the latest auction only. This source follows the existing ETL cycle; it adds no cron, lock, direct writer or publisher. At the initial baseline the effective workflow was six-hourly; the approved daily 06:17 UTC target is documented separately. The workflow at the release commit determines the actual cadence |

The licence metadata API returned `license_id: ESO`, with its legacy `ngeso-open-licence` URL. The current portal and current licence page above were separately checked. No private source, participant identity, account credential, paid data or restricted fixture is used.

## Real download receipts

These are source checks, not a claim of production acceptance. Final test, merge and publication receipts belong in the phase PR.

| Check | Actual result |
| --- | --- |
| Recent CSV | 2026-11-06 15:11:28 UTC; HTTP 200; `application/octet-stream`; 23,358 bytes; SHA-256 `c0c2681c0ffb12bae6a1e0325ff967efa7fafaccf8503dd63e112f8920002cbe` |
| Actual file coverage | Auction 2972: 324 rows, including 36 DC/DM/DR rows and **288 reserve rows**. NBR/NQR/NSR/PBR/PQR/PSR each have 48 half-hours, 2026-11-06 23:00 to 2026-11-07 23:00 UTC (exclusive end), EFA day 2026-11-07 |
| Resource discovery | 2026-11-06 15:12:14 UTC; anonymous `package_show?id=eac-auction-results` succeeded, confirming the daily resource and FY2023/FY2024/FY2025 summary archives |
| Historical technical sample | 2026-11-06 15:15:15 UTC; one anonymous bounded DataStore query, HTTP 200, 40,381 bytes, 192 rows, from FY2025 resource `be55ee51-b79e-47da-b71e-a0f8865d9d66`. EFA day 2025-11-06 contains NBR/NQR/PBR/PQR, 48 rows each; **no SR rows in this sample** |
| Independent source/arithmetic audit | 2026-11-06 15:52:35 UTC; PowerShell `Import-Csv`, independent of the connector parser, matched all 288 source prices/MW/auction IDs/delivery intervals and all six mean-MW/weighted-price summaries against the governed seed. The input byte hash matched the CSV receipt above |
| Real clock-change sample | 2026-11-06 17:15:41 UTC; anonymous bounded DataStore query, HTTP 200, 62,036 bytes, 300 rows from current resource `596f29ac-0387-4ba4-a6d3-95c243140707`. All six products had exactly 50 unique half-hours for EFA day 2026-10-25, from 2026-10-24 22:00 to 2026-10-25 23:00 UTC. Every delivery interval and source service label matched the EFA calendar. This was a technical check, not a backfill |

The history query selected only the seven clearing fields, the six reserve codes, a single 24-hour UTC range and `LIMIT 301`. It was a technical check only. The raw source samples remain outside the repository and are not test fixtures. The public seed comes from the normal governed runner, not hand-edited observations.

## Schema and completeness

- Original fields: `auctionID`, `auctionProduct`, `serviceType`, `deliveryStart`, `deliveryEnd`, `clearedVolume` (MW), `clearingPrice` (GBP/MW/h), optional `linkedServiceWindowID`. The current file includes NBR/PBR although the resource field description's older example list omits those codes; the dataset overview explicitly covers BR, and the actual service label is `Balancing Reserve`.
- The portal explicitly says delivery instants are **UTC**, including suffix-less strings. The connector normalizes them to explicit UTC. It never interprets them as London wall time. A London EFA day ends at 23:00 and contains 46, 48 or 50 half-hours across clock changes.
- `v` is the capacity clearing price; `clearedMW` remains a separately validated MW field. Every point retains service, source service type, direction, auction ID, EFA day/period, exclusive end and linked-window ID. No MW is relabelled as MWh.
- A daily file must contain one complete auction day and all six current reserve products. Missing intervals/products fail the file; observed zero MW is retained. Duplicate identical records deduplicate, conflicting records and mixed auction versions fail. Unexpected products, bad numbers, invalid dates and changed interval lengths fail closed.
- The incoming day replaces the same stored day as a complete unit. A daily file for an earlier delivery day cannot replace the latest observed day. Auction IDs remain opaque identifiers: their numeric order is not a documented revision timestamp. For a same-day revision the official latest file is authoritative, and Git retains the prior observations. The file supplies no per-row revision timestamp; earlier revisions not present in it are not rediscovered by this connector.
- Existing 365-day retention stays unchanged globally. This dataset retains only complete EFA days starting within that window; it does not keep a partial oldest day. Historical Git snapshots remain the audit trail. The coverage audit lists missing whole EFA days **between observed endpoints**; it does not assert 365 days of coverage.

## What is implemented and what is still missing

| Item | Phase status |
| --- | --- |
| Latest BR/QR/SR clearing price and accepted MW, six products | Implemented in the existing runner, with an independent catalogue entry and custom summary |
| Incremental accumulation, revisions of the latest auction, completeness and last-good protection | Implemented; missing past days remain explicit, never zero-filled |
| Per-product monthly and latest-day summaries | Implemented: actual covered hours, mean accepted MW and MW-duration-weighted clearing price; zero accepted MW has a null weighted price |
| Existing DC/DM/DR history and technology split | Unchanged; its filters, outputs and consumers are preserved |
| FY2025 historical BR/QR | Technical sample succeeded, **not backfilled or scheduled** |
| Full multi-year archive coverage and product-era rules | Not implemented; metadata discovery is not a coverage claim. The historical sample's absent SR cannot be treated as zero or passed through the six-product current-era gate |
| Buy/sell orders, procurement requirement and offered/accepted ratios | Not implemented; accepted MW is not a requirement or offered supply |
| Battery share, activation, project capture or income | Not inferred. No unit-level participant data or assumed delivery/qualification is added |

## How this can enrich the platform

The existing `/data` catalogue gains an auditable source for reserve-service prices and cleared capacity. The small custom summary provides BR/QR/SR and direction comparisons, a distinction previously absent from the response-only DC/DM/DR feed. Prospective history can reveal changes in accepted capacity and clearing-price pressure; published coverage and missing days make short observation windows visible.

These facts can support a later British ancillary-service chart or documented market note. They cannot measure bid competition without orders data, establish battery-specific awards, or turn gross market clearing prices into project revenue. `bearsOn: []`, a custom summary with no energy spread/arbitrage output, and unchanged financial/model/view files keep these observations from automatically changing approved economics or investment judgements. Future delivery awards are labelled auction observations, not realised dispatch.

## Verification and rollback

The focused tests cover source parsing, UTC/BST/EFA calendars, units and bounds, duplicates and revisions, missing/partial days, zero versus missing, deterministic summaries, unchanged-content writes, timeouts, rights failures, last-good byte retention and independent-provider progress. Existing response and Elexon tests run alongside them. Repository-required full tests, model checks, build, confidentiality and budget scans, browsers and snapshot verification must pass before merge; final-head CI and actual production verification are recorded in the PR.

Rollback is independent: remove this new catalogue/connector registration and its two new public files from the current tree through the ordinary branch and CI process. All prior commits and snapshots stay in Git history; no existing source's snapshot is removed. Removing the new files together with their registration also avoids orphaned-snapshot verification failures. No old source, source licence, schedule, lock, Policy flag, financial parameter or governance right needs to change. Do not rewrite historical evidence or merge unrelated PRs.
