# NEM story: G-2 checklist

For the analyst, 5 November 2026. The story is built and **unreleased** (`released: false`); it opens on `/markets/nem?story=preview` in the built preview (`npm run build`, then `npm run preview`). Details: [build evidence](nem-build-evidence.md), [reuse report](nem-story-reuse-report.md).

## Decisions — 5 November 2026

The analyst accepted all seven recommendations below and ruled that an over-cap result raises the cap. They are applied at code head `865f1d7` (build evidence §0).

| # | Question | Decision |
| --- | --- | --- |
| 1 | Rights switch for AEMO's observed layers (`nem-05`, `nem-06`, `nem-07`) | **On.** Cleared under AEMO's copyright permissions with attribution; the two spread sentences print |
| 2 | Remove "(to be confirmed)" from the 2016 node, CL-NEM-19 being sourced to QED Q4 2019 | **Accepted** |
| 3 | Register count in `nem-11`: register-wide 17 or NEM-only 15 | **NEM-only 15** ("NEM battery agreements") |
| 4 | Chinese zero count ("有无份已投运") | **Count carries its verb:** 尚无一份 when zero, 有N份 otherwise ("尚无一份已投运") |
| 5 | Bundle measure | **JavaScript-only measure accepted; over a cap, raise it.** `story-nem` raised from 40 to 41 KiB. A cross-story budget method is a separate PR |
| 6 | New Chinese node titles and `nem-12` step labels | **Approved** |
| 7 | `nem-00` "…CIS terms.. Beneath it" | **Fixed** (action bound without its final stop); the "The existing play card:" wording is left for a pass across all stories |

Not yet given: the G-2 sign-off itself and authority for the release PR.

## Checks on the exact head

Code head `865f1d729fa703eae946fa79fdc0a2cb7a1d8b90` (branch `claude/nem-story-g2-dc1e93`, not pushed). The first build, with the switch off, passed every check at `0ae7f1a` (1,392 unit, 84 current-model, 31 budget, 258 browser).

| Check | Result |
| --- | --- |
| `npm test` | 1,392 passed, 0 failed, 4 skipped (1,396) |
| `npm run test:current` | 84 passed, 0 failed |
| `npm run build` | Passed; `story-nem` chunk 29.0 KiB gzip |
| `npm run test:budget` | 31 passed, 0 failed; NEM additional JavaScript graph 40.59 KiB of 41 (45.57 with lazy styles) |
| `npm run test:e2e` | 258 passed, 0 failed (desktop and mobile; includes the 14 NEM tests), 13.5 min |
| `npm run guard:staged` (with the marker set) | Clean, 15 files |
| `npm run etl:verify` | Not run: no data or dataset outside the story module was touched |
| Built-preview walk | Not yet repeated after the decisions (the switch-off build was walked at both widths and in both languages) |

## Page-text changes from the script

Listed with before and after, both languages, in [build evidence §8](nem-build-evidence.md#8-page-text-changes-made-during-the-build): the 2016 label removal, the new Chinese node titles, the `nem-12` step labels, the compare link, and decisions 3, 4 and 7 in `nem-11` and `nem-00`.

## Anchor drift

None. Call `opportunistic`, play `nem-ltda-4h`, 4 h, operating, Fair, trigger `nem-successor-scheme-first-round`, all as reviewed.

## Open CF-NEM items

CF-NEM-01 to CF-NEM-07 stay open; none affects the page as built, because the story binds the live fields (build evidence §9).

## What `released: true` would change

The market page's research button would open the story for every reader on the infrastructure-fund lens without `?story=preview`, and story links (`?view=story`) would work publicly, with AEMO's observed layers. Other lenses keep the research dialog and the chunk stays lazy. Release is a separate PR (`nem-g2-release.md`) after your G-2 sign-off, published only through GitHub Actions.
