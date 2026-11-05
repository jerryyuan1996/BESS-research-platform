# NEM story: G-2 checklist

For the analyst, 5 November 2026. The story is built and **unreleased** (`released: false`); it opens on `/markets/nem?story=preview` in the built preview (`npm run build`, then `npm run preview`). Details: [build evidence](nem-build-evidence.md), [reuse report](nem-story-reuse-report.md).

## Checks on the exact head

Code head `0ae7f1a3935bece73f5df56770d8544ff1fe830a` (branch `claude/nem-story-g2-dc1e93`, not pushed).

| Check | Result |
| --- | --- |
| `npm test` | 1,392 passed, 0 failed, 4 skipped (1,396) |
| `npm run test:current` | 84 passed, 0 failed |
| `npm run build` | Passed; `story-nem` chunk 27.4 KiB gzip |
| `npm run test:budget` | 31 passed, 0 failed; NEM additional JavaScript graph 39.00 KiB of 40 |
| `npm run test:e2e` | 258 passed, 0 failed (desktop and mobile; includes the 14 NEM tests), 14.3 min |
| `npm run guard:staged` (with the marker set) | Clean, 23 files |
| `npm run etl:verify` | Not run: no data or dataset outside the story module was touched |
| Built-preview walk | Desktop and phone width, English and Chinese: thirteen shots, one marker each, no sideways scroll, no stray text. Two scene bugs found and fixed (a blank slot printed "null"; nem-08's route rows were hidden); the scenes test now catches both |

## Decisions for the analyst

1. **Rights switch (off).** Turn on AEMO's observed layers for `nem-05`, `nem-06` and `nem-07` after the price-data review? While off, the charts draw the unscaled Example, and two copy sentences that would print a spread are hidden (nem-06's two-year spread fall, nem-07's NSW spread). Turning on is one reviewed change (build evidence §5) and restores the script text exactly.
2. **CL-NEM-19 (sourced).** AEMO's QED Q4 2019 (§1.4.6, p. 19) shows battery revenue driven by FCAS in 2019, with energy arbitrage 12% of battery revenue in Q4 2019. The build removed "(to be confirmed)" / "（待核实）" from the 2016 node. Accept, or keep the label because the source covers 2019, not 2017–18?
3. **Register count.** `nem-11` says none of the **17** battery agreements on the register is operating, as signed. Two of the 17 are in WA's WEM; the NEM count is 15. Keep 17 (register-wide) or bind the NEM-only 15?
4. **Chinese for a zero count.** The signed rule renders zero as 无, which makes `nem-11` read "17份电池协议中，有无份已投运". Proposed: "其中尚无一份已投运" (or render 零). Approve a wording?
5. **Bundle measure.** The NEM graph fits 40 KiB on the Romania/Finland measure (JavaScript, 39.00) but not on the CAISO/PJM measure that adds lazy styles (43.97). Accept the JavaScript measure, raise the NEM cap, or ask for content cuts?
6. **New Chinese text.** The script has English-only node titles for `nem-02`; the build added Chinese titles (build evidence §8, item 2), and scene labels for `nem-12`'s dated strip (item 5). Approve?
7. **Opening line.** `nem-00` transcribes "The existing play card: …" literally, as PJM and CAISO did; with the bound action it renders "…CIS terms.. Beneath it". Keep, or trim the authoring wording in a later pass?

## Page-text changes from the script

Listed with before and after, both languages, in [build evidence §8](nem-build-evidence.md#8-page-text-changes-made-during-the-build). No approved question, copy, meaning, marker, control or caption was reworded; the content test compares each against the script.

## Anchor drift

None. Call `opportunistic`, play `nem-ltda-4h`, 4 h, operating, Fair, trigger `nem-successor-scheme-first-round`, all as reviewed.

## Open CF-NEM items

CF-NEM-01 to CF-NEM-07 stay open; none affects the page as built, because the story binds the live fields (build evidence §9).

## What `released: true` would change

The market page's research button would open the story for every reader on the infrastructure-fund lens without `?story=preview`; story links (`?view=story`) would work publicly. Nothing else: the rights switch stays as set, the chunk stays lazy, and other lenses keep the research dialog. Release is a separate PR (`nem-g2-release.md`) after your G-2 sign-off, published only through GitHub Actions.
