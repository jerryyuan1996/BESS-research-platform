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
| GAP-IT-MACSE-MW | Detailed report, pp. 6–7: quantities and system count | Term remains unverified; hide the observed term. At integration, the verified MWh/MW ratio supplies the one-decimal awarded-duration label, with a direct report locator |
| GAP-IT-DY27 | Annex 4 §8.3 explicitly refers earlier awards to Annex 3; exact delivery-2027 annex not located | Label the repository's four-hour point as a repository record; no verified historical payment comparison |
| GAP-IT-STACK | Candidate MACSE rules Art. 7.1(c), pp. 18–19 excludes capacity post-auction nominations subject to a terminated-contract exception; cover approval date is a placeholder | Keep “never stacked”; verify applicable approved rules and asset contract rights at G-2 |

Chart-IT-FORK stays at the approved unscaled “Example: two contract shapes” until its source gates close. New-entry delivery-2028 capacity premiums remain null. No Italian wholesale-price series is registered, fetched or republished. Physical day-ahead zones and procurement groups remain distinct.

## Reuse and integration

The twelve-shot count follows the analyst's explicit clarification. The shared contract, shell, navigator, marker and kit are used unchanged. Existing `renderPlayChoices` from #107 supplies both market-page and story-opening opportunity cards. Each play keeps its own call; the existing selected capacity row alone owns the market-page case. Design returns are paired only with other design returns, with their basis label.

The story is an analyst preview (`released: false`), opened by the existing research button at `/markets/italy?story=preview`. Standard readers retain research until a separate G-2 release decision. A mismatch in either play's call or duration, the selected play, the number of opportunities or the lens returns to research. Story content, evidence, kit, scenes and styling have no path into the page before opening. The multi-opportunity cards themselves are the existing market-page feature.

| Part | Configuration and reuse | New local code | Approximate working time |
| --- | --- | --- | --- |
| Data | Publication-only record pattern, existing sources and snapshot verifier | Manual fixed-vintage tables, provenance, source-gap dispositions and gross-payment arithmetic | 12 minutes |
| Content | Approved bilingual tables, shared contract, live card and briefing fields | Tokens, availability states, two-play review guard and parity/binding checks | 11 minutes |
| Scenes/chart | Shared SVG symbols, stage, teaching controls and styles | Italy geography/configuration, scene compositions, unscaled fork Example, calendar evidence and local responsive styles | 12 minutes |
| Wiring and review | Existing research button, play-choice cards, shell, URLs, focus handling and investment exits | Lazy preview entry, two-row/lens guard, local opening composition, integration checks and source-link completion | 18 minutes through final integration |

Times are approximate active working estimates, excluding unattended full-suite runs. Phases overlapped and are not a sequential schedule. Integration opens CALC-IT-FORK's awarded-hours label because the report's quantities were verified; it does not infer a contract term or change a model input. The primary report opens directly from the first-auction evidence control.

Shared files changed by the wiring PR:

| File | Reason |
| --- | --- |
| `src/experience/story/registry.js` | One lazy, unreleased Italy entry for the existing button and story URL |
| `src/experience/marketPage.js` | Apply the existing multiple-opportunity pattern to Italy and pass the already-selected lens into the pack |
| `src/experience/storyRows.js` | Give that pattern both live Italian rows with their own calls; retain one selected investment summary |
| `tests/bundle-budget.test.js` | Assert lazy content and the complete additional Italy static graph, including required lazy styles, under the existing 40 KiB gzip cap |

Other changes in the wiring PR are local to Italy: pack, browser/unit coverage, this report, and completion of the verified awarded-hours binding and its report link. The shared kit, shell, navigator, marker, contract, global stylesheet and model files are unchanged. No fixture or existing snapshot is regenerated.

## Analyst G-2 walkthrough

On a built public preview, read all twelve shots in English and Simplified Chinese with keyboard, phone and desktop. Check both calls and durations, the earlier-awarded RTB restriction, two independent opportunity cards, one marker per shot, separate financial bases, seven physical zones versus procurement groups, the labelled repository factor and the unscaled Example. Verify source locators and vintages before upgrading an observed label.

Use Tab, Enter, chapter/shot navigation, Escape, Back, Forward, refresh and direct links; confirm focus returns to the research button. Check phone, tablet and desktop fit, readable chart scrolling/table text, both colour schemes and reduced motion. Teaching presets must preserve the investment case, URL and history. Check all four investment-section exits and the full research layer. The toll card remains a watch item.

Retain source gates for Annex 3, the applicable approved MACSE compatibility/term/margin-sharing clauses, strike/stress obligations, regional queue quantities, and the primary capacity-auction notice/date. Verify each actual award's price, credited MW, delivery, transferability and grid rights. Missing evidence keeps its labelled fallback; a changed call, play, duration or lens requires editorial review. G-2 sign-off and any later release/merge remain the analyst's decision.
