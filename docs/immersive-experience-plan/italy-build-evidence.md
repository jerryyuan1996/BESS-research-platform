# Italy story build evidence

## Preconditions — 1 November 2026

Base `main`: `7effd37`. An isolated clone preserves the earlier checkout.
PR #108, `codex/ie-six-hour-review-20261101` (`9289f321`) and script PR #92 are ancestors of this base.
The new `codex/it-story-data` branch was clean before edits. The live briefing, dated 1 November, still matches the script: `infraFund`, `it-cap-4h`, `enter-now`, four hours; alternative `it-ltda-6h`, `opportunistic`, six hours.
The analyst confirmed retaining the twelve signed-off shots, `it-00`–`it-11`, in this build chat. No additional shot is invented.

## Data disposition

`src/markets/it/data/auctionResults.js` registers the static `it-auction-results` record in a market-local manual-table catalogue. Like Finland's publication-only need records, it is not a fabricated time series in the six-hour ETL catalogue. It has no model-assumption bindings and is loaded only with the story. Existing snapshots remain byte-for-byte unchanged.

Manual extraction uses the capacity report's printed/PDF p. 4 (the script's p. 3 locator referred to the preliminary material), decree 327/2026 Annex 4 Table 11 p. 33 and scope §8.3 p. 32, and the updated MACSE report pp. 6–7. Numeric rows retain primary URL, locator, units, check date and arithmetic. Annex 4 was downloaded from its primary URL and visually checked after the web reader returned 403. ARERA 370/2026 confirms the limited delivery-2028 applicability.

The detailed MACSE report gives 9,968 MWh, maximum selected power 1,491.392 MW and fourteen selected systems. It revises the South/Calabria weighted-average premium to EUR12,137/MWh/year, against EUR12,146 in the earlier release. These fixed-vintage chart records do not update the investment model. The report has no contract-term field.

All three required gaps were opened before the data PR:

| Gap | Evidence found | Retained fallback |
| --- | --- | --- |
| GAP-IT-MACSE-MW | Detailed report, pp. 6–7: quantities and system count | Term remains unverified; hide observed term and awarded-duration labels while this gate is incomplete |
| GAP-IT-DY27 | Annex 4 §8.3 explicitly refers earlier awards to Annex 3; exact delivery-2027 annex not located | Label the repository's four-hour point as a repository record; no verified historical payment comparison |
| GAP-IT-STACK | Candidate MACSE rules Art. 7.1(c), pp. 18–19 excludes capacity post-auction nominations subject to a terminated-contract exception; cover approval date is a placeholder | Keep “never stacked”; verify applicable approved rules and asset contract rights at G-2 |

Chart-IT-FORK stays at the approved unscaled “Example: two contract shapes” until its source gates close. New-entry delivery-2028 capacity premiums remain null. No Italian wholesale-price series is registered, fetched or republished. Physical day-ahead zones and procurement groups remain distinct.
