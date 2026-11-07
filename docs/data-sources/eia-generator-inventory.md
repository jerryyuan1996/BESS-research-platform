# EIA generator inventory and storage evidence

## Scope and implementation plan

This source adds public generator-level supply evidence for PJM, ERCOT and CAISO.
It does not change an investment assumption, a view, a financial fixture or the
existing daily 06:17 UTC cycle, write boundary, lock or publisher. The ongoing
data-channel task authorises these observed facts across the three markets.

The implementation follows the existing governed ETL catalogue, runner and
`public/data/public/` boundary. A separate `projects` payload schema, source
validation and custom summary prevent project MW/MWh being interpreted as prices.
No independent cron, publisher or private storage is introduced. Existing map
facts remain; the actual interactive map receives an additional inventory layer
and the same records feed its adjacent bilingual table. The dormant central
project registry alone is not a browser integration.

## Current official verification (7 November 2026 UTC)

Sources:

- [Monthly inventory](https://www.eia.gov/electricity/data/eia860m/): September
  2026, published 23 October 2026. The next publication is listed as 24 November.
- [Annual inventory](https://www.eia.gov/electricity/data/eia860/): reporting year
  2025; the download's HTTP Last-Modified is 10 September 2026. Last-Modified is
  retained as file metadata, not invented as a publication date.
- [Copyright and reuse](https://www.eia.gov/about/copyrights_reuse.php): EIA's own
  statistics may be reused and distributed with source/publication attribution.
  Third-party material, photographs and trademarks are excluded. No original
  workbook, ZIP, logo or third-party attachment is published by this connector.
- [Robots](https://www.eia.gov/robots.txt): the two target electricity paths are
  allowed. No login, key, payment or new permission is used.

Fresh ordinary anonymous local GETs, 04:37 UTC:

| Input | HTTP / bytes | SHA-256 |
| --- | --- | --- |
| `september_generator2026.xlsx` | 200 / 14,013,970 | `bcef74e1af991680731aeecfda967f5950db4ce739bb584edd8b8774c7e6da17` |
| `eia8602025.zip` | 200 / 23,622,347 | `2b27929d26cc1da9ad6a530da1cac6718cd8496098ee560c4d47cfffd96d08ba` |
| Storage member | 457,955 bytes | `22e93d60ba46c7c878bffb225d625a3ac52538687ccccb09059ad5e4945f2a8e` |
| Plant member | 4,629,134 bytes | `3c338f5e9d2647bb487dee8b3f4ed5c3fdd3e82db3b1bc5fdf206cee5470e059` |

The monthly index contains future placeholder file links. Discovery must check
the stated release date and actual published table, rather than selecting the
largest filename. An initial unfiltered probe reached a redirect, downloaded no
workbook and stopped. Inspection of the published September URL returned 200;
the corrected, release-bounded discovery downloaded the files above. No redirect
around an access refusal, alternative hostname, identity or proxy was used.

An independent offline audit of the actual files found:

| Balancing authority | Eligible units | Monthly MWh | Monthly locations | Exact annual energy/discharge evidence | No annual key |
| --- | ---: | ---: | ---: | ---: | ---: |
| PJM | 60 | 41 | 60 | 39 | 21 |
| ERCO (ERCOT) | 322 | 264 | 322 | 202 | 120 |
| CISO (CAISO) | 360 | 306 | 360 | 277 | 83 |

Eligibility is battery prime mover, positive nameplate MW, valid compound ID and
the already-supported OP/SB/V/U/TS states. Other proposed/queued/out-of-service
states are not relabelled operating or under construction. Counts are generators,
not distinct sites. The audit found 1,003 BA batteries on annual Operable, no
duplicate compound keys, and 161 annual nameplate/discharge-power differences.
The implemented identity/date checks confirm these counts: 742 units, comprising
612 operating and 130 under construction; monthly MWh for 611 and exact annual
energy/discharge evidence for 518. Among those matches, 75 have different monthly
nameplate MW and annual maximum discharge MW. The other 224 retain missing annual
evidence, rather than inheriting another generator's quantities.

## Quantities and compatibility

Current monthly Operating actually includes `Nameplate Energy Capacity (MWh)`
and latitude/longitude, contrary to the old parser comments. Preserve those
observations with September 2026 provenance; do not pretend annual 2025 values
are monthly measurements. The map may use a validated monthly location and MWh.
Plant-table coordinate enrichment remains separately identifiable and is a
fallback only where the monthly position is unavailable. Its existing exact and
weaker name/state identities are preserved; neither can grant an energy match.

Annual storage joins only on exact Plant Code plus Generator ID, retaining
leading-zero meaning. Duplicate, missing, inconsistent technology/status/date,
incompatible year or ambiguous keys leave annual quantities null with a reason.
Annual MWh, maximum charge MW, maximum discharge MW and reporting year remain
separate from monthly nameplate MW/status. The annual duration is explicitly
`annual nameplate MWh / annual maximum discharge MW`; it is not installed in the
legacy `durationHours` field. In particular, `monthly MW * annual discharge hours`
is never used to manufacture energy. Missing energy/duration is null, not zero.
Existing non-EIA records retain their prior power-times-duration behaviour.

## Persistence and acquisition contract

One registered raw snapshot and one small summary carry versions, original
input/member hashes, units, matching/coverage counts and observation periods.
Observed version/revision metadata and field-change identifiers are retained in
the snapshot; complete previously accepted snapshots persist in Git history.
No rolling 365-day filter applies to this inventory, and no existing price
window or history meaning changes. Only acquired revisions are claimed; neither
unseen upstream edits nor older monthly releases are represented as archived.

Daily execution checks the two small official indices. Download new releases;
check same-release monthly revisions weekly and annual revisions monthly, using
conditional requests where previous content is sufficient. A changed monthly
workbook may require one bounded annual download to join newly appearing IDs.
Unchanged content retains the original acquisition timestamps and files.

Downloads use one attempt, full-response deadlines, streaming byte limits and
strict official-origin/path checks. Authentication/access/rate-limit refusals
are not retried. ZIP central-directory, member count, compressed/expanded size,
CRC, exact filename and nested XLSX limits are checked before workbook loading.
Bad downloads, units, missing sheets/columns, partial candidates or ambiguous
identities keep last-good data; other sources continue. The existing
confidentiality guards remain mandatory and are not reconfigured.

Each index is capped at 512 KiB / 20 seconds, the monthly workbook at 24 MiB /
45 seconds, and the annual ZIP at 40 MiB / 60 seconds, within a 180-second
acquisition budget. The annual archive allows at most 100 members / 64 MiB
expanded; only the exact two required workbooks, at most 8 MiB each, are loaded.
Nested XLSX archives have at most 500 members and expansion caps of 192 MiB
(monthly), 64 MiB (Plant) and 16 MiB (storage). Every loaded member's CRC is
verified. Normalized output is capped at 5,000 generators / 12 MiB, with at most
240 observed revisions; exceeding a bound fails closed and retains last-good.

Inventory months and annual years are reporting periods, not trading intervals;
no hourly timezone, DST conversion or interpolated price points are invented.
Acquisition timestamps use UTC. The small summary's freshness uses the monthly
publication date and monthly cadence, not a fresh daily check timestamp. Annual
evidence older than 18 months after its year-end is left unusable and labelled
with its reason until a compatible annual version appears.

Explicit dry verification deliberately downloads both workbooks, bypassing the
routine binary cache; unchanged input still retains all accepted timestamps and
bytes. There is at most one successful full body per workbook per cycle; a 304
may precede a required body when a different input revision needs re-parsing.
Complete historical workbook backfill, unseen revisions and Proposed annual
storage are outside this first stage. No original workbook is mirrored.

## Verification and rollback

Tests must cover exact/ambiguous/leading-zero joins, technology/status/reporting
years, distinct power denominators, current monthly fields, old parser and weak
coordinate behaviour, OP precedence, missing/corrupt sheets, ZIP/body limits,
conditional/revision/cache/no-change behaviour, last-good retention, integrity,
real map/table parity and bilingual desktop/mobile failure states. Financial
fixtures are verified, never regenerated. Final test/release results belong in
the PR record, not a new per-release document.

Disable only this catalogue/loader integration to roll back. Existing sources,
snapshots, map facts, rules, Policy controls and financial assumptions remain.
