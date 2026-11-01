# Finland story data: initial ingestion

Checked 31 October 2026 for WP-09. G-1 covers the script and its definition break; the built story still awaits G-2.

- Feed: [Fingrid dataset 424](https://data.fingrid.fi/en/datasets/424), CC BY 4.0. Platform ID: `fi-storage-capacity`.
- Measure: hourly network-model technical power in MW, covering systems over one MW and some approaching operation. Distribution reporting is incomplete. It is neither an all-size connected fleet nor qualified reserve supply.
- Fetched: 2026-10-31T06:35:08.665Z. Coverage: 2026-03-11T12:00:00.000Z to 2026-10-31T05:00:00.000Z, labelled by UTC interval start.
- 5593 points; no duplicate starts in the stored series. 17 missing hours in 6 interior gaps; no zero fill or interpolation.
- First source hour is noon UTC on the catalogue's start date. The catalogue date does not establish earlier hourly coverage.
- Daily summaries use Europe/Helsinki; partial days retain their observation counts. MW summaries carry no price spreads, trading margin or arbitrage result.
- Source values range from 120 to 2084.81 MW, including downward changes in reported capacity. Values are retained as supplied; no monotone fleet curve is imposed.
- Content checksum: `sha256:f8c0415327eca8393952193a992f1abb8628aa4c4e735c23935e7c5bc8f538e5`.
- The dated connected estimate and reserve obligation/average-procurement publications are in [storyNeed.js](storyNeed.js), with source, date and locator per record. They are not fabricated feeds.

| Last hour before gap (UTC) | Next observed hour (UTC) |
| --- | --- |
| 2026-07-06T09:00:00.000Z | 2026-07-06T11:00:00.000Z |
| 2026-08-09T15:00:00.000Z | 2026-08-09T17:00:00.000Z |
| 2026-09-10T04:00:00.000Z | 2026-09-10T06:00:00.000Z |
| 2026-09-21T10:00:00.000Z | 2026-09-21T12:00:00.000Z |
| 2026-09-23T06:00:00.000Z | 2026-09-23T08:00:00.000Z |
| 2026-09-27T17:00:00.000Z | 2026-09-28T06:00:00.000Z |

The signature chart must mark the crossing as already passed by the early-February observation, with its exact date unknown. Do not join that connected estimate to dataset 424, or join annual average procurement to the current obligation band. Numerical observations are independent of the unchanged investment model.

The analyst accepted the 80-byte compressed entry-bundle increase from this feed's catalogue registration on 31 October 2026. Story content and scene code must remain lazy.
