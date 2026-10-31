# Evidence and Content Specification

Pack: BESS-IX-2026-10-30, version 1.2  
Status: authoring and validation contract, revised in v1.1 (reader-facing marker, call anchor, bound fields); no executable schema added  
Navigation: [Master plan](README.md) | [Source register](source-register.md) | [Market narratives](market-narratives.md) | [WA storyboard](western-australia-storyboard.md)

## 1. Keep evidence dimensions separate

A plausible story, a current price series, an eligible technology and a signed contract answer different questions. Keep these dimensions separate in authoring records. Readers never see them; they see one marker derived from them (below).

| Dimension | Allowed working values | Meaning |
| --- | --- | --- |
| Statement type | `historical-fact`, `observed-data`, `official-plan`, `analyst-scenario`, `teaching-example`, `research-hypothesis` | What kind of assertion the reader is seeing |
| Editorial status | `proposed`, `sourced`, `reviewed`, `approved-for-publication`, `blocked`, `retired` | Progress through the review workflow |
| Evidence scope | `market-rule`, `market-observation`, `model-assumption`, `project-document` | What the evidence can establish |
| Revenue status | `mechanism-exists`, `eligibility-unverified`, `model-assumes-route`, `award-verified`, `contract-verified`, `performance-verified` | How far the project/payment chain has actually been evidenced |
| Freshness | `current-at-check`, `refresh-due`, `stale`, `superseded`, `missing` | Whether a source or series remains usable for its intended claim |
| Publication boundary | `public-and-reusable`, `public-link-only`, `internal`, `confidential`, `rights-unresolved` | What may reach a public bundle, asset or evidence drawer |

Revenue statuses are evidence descriptions, not an automatic ladder to bankability. An award can have conditions precedent; a verified contract can still have counterparty, availability and termination risk. An unknown field remains unknown, rather than being converted to zero, false, a passing gate, or a demonstration return.

Use explicit labels and line/pattern differences as well as color. An official forecast should retain its scenario name and forecast origin even when its horizon date later passes. A forecast becomes an observed outcome only when a separate observation is obtained.

### Reader-facing marker

Each shot shows one marker and one line, as the 16 October ruling requires. The dimensions above decide which marker applies; they never appear on the page.

| Marker | When it applies | Example |
| --- | --- | --- |
| Strong | The central claim rests on a primary document or observed data that is current at check, and the user has reviewed it | `wa-04` once the certification clauses are extracted |
| Fair | The mechanism is sourced, but a locator, dataset or review is still pending, or the claim rests on the platform's own model | `wa-08`, whose duration comes from the platform's design-fit result |
| Thin | A research hypothesis, a scenario, or a hinge claim not yet sourced | A German shot resting on the draft storage grid-fee rules (CL-DE-02); `wa-03` was Thin until CL-WA-06 was sourced in v1.2 |

The "What would change it" line names the evidence that would move the marker, for example "an AEMO locator for the obligation duration would make this Fair". It replaces boundary text. A claim blocked by rights, confidentiality or a contradiction is withheld, not marked Thin. The Authoring check row on each shot is for writers and reviewers and never becomes page copy.

## 2. Source collection and research workflow

1. Read the market's current repository research, sources, governance records and model limitations. Reuse relevant work without treating its age or existing label as proof of current accuracy.
2. Start from the market's published thesis and call in the briefing. Write the causal chain that leads to them and list what would falsify it, including an alternative explanation or competing resource.
3. Collect primary system-operator, regulator, government, network and procurement sources. Use a secondary source as a discovery aid or explicit interpretation, not an unmarked substitute for governing rules.
4. Build 4-6 historical nodes: **constraint at the time -> choice -> inherited asset or institution -> present effect**. Record support for both the event and the causal interpretation; they may require different evidence.
5. Separate historical sources, current observations, current rules, official plans and analyst scenarios into distinct records. Mark the timeline boundary before the first future item.
6. Map every proposed shot to claims, sources, a diagram or chart, investment meaning, and a likely misreading. Exact financial labels bind to a result field rather than a prose constant.
7. The user reviews electricity mechanics and investment meaning in two separate passes, then signs off the script.
8. Clear asset rights and publication scope, then approve copy for implementation. Unresolved material is withheld or replaced with a qualitative explanation that its evidence supports.
9. Translate the approved meaning into both site languages; the user checks both at sign-off. A translation that changes an obligation returns to mechanism review.

Use the official [source register](source-register.md) as the initial collection index. The remaining markets' named source owners are research targets, not a completed evidence pack.

## 3. Reusable register templates

These templates are intended for later market authoring. Placeholder rows are deliberately unpopulated and are not evidence of completed research. Production content may use structured modules after `WP-02`; Markdown registers are sufficient during preparation.

### Source record

| Field | Required entry |
| --- | --- |
| Source ID and market scope | Stable ID; country, system/zone and allocation-market IDs; shared/national source relationships |
| Publisher and authority | Official owner, publication type, and whether this is a rule, operator explanation, dataset, project document or interpretation |
| Title and exact locator | Canonical URL; page/table/figure/clause; document version; dataset identifier and API definition if applicable |
| Dates | Publication, revision, effective date, observation period, retrieval date and next review trigger |
| Original language | Source language; translation author/method; any unresolved translation ambiguity |
| Evidence extract | Short supported proposition and precise locator; quotation only where rights permit; do not copy entire reports |
| Units and boundaries | Geography, installed/available/dispatchable capacity, gross/net, nominal/real, currency, time interval and denominator |
| Access and reuse | Public link versus licensed dataset; licence URL/version, permitted derivative use, attribution and redistribution constraints |
| Stored material | Public metadata location; any permitted restricted extract stored outside public assets; checksum/version when lawful and useful |
| Coverage and limits | Missing periods, exclusions, revisions, methodology and what this source cannot establish |
| Review | Researcher, reviewer, decision date, editorial status, unresolved issue IDs |

### Claim ledger

| Claim ID | Exact proposed claim | Type / scope | Source and locator | Supported inference / limit | Shots and UI labels | Owner / status / next check |
| --- | --- | --- | --- | --- | --- | --- |
| CL-MARKET-001 | Fill with one falsifiable statement | Select separate type and scope | SRC-ID, clause/page/table | Explain what the evidence does and does not support | Shot IDs; chart/label IDs | Named role, status, date/trigger |

Compound claims should be split. A source showing curtailment does not establish a particular battery's right to charge, eligible capacity, profitability, financing terms, or cost of capital. A historical event and “this caused today's opportunity” may need separate ledger entries.

### Calculation record

| Field | Required entry |
| --- | --- |
| Calculation ID and question | What derived number is needed and which user decision it supports |
| Inputs | Source/version, field, units, observation window, timezone, exclusions and quality flag for every input |
| Method | Formula, aggregation, weighting, interval treatment, rounding, handling of missing/duplicate values and negative prices |
| Economic interpretation | Gross revenue, captured margin, operating cash, all-equity cash, levered equity cash, or price/valuation; tax and financing treatment |
| Financial conventions | Currency and FX direction/date, real/nominal base year, inflation/indexation, per-MW/per-MWh/whole-project scale, cash-flow clock |
| Outputs and reconciliation | Unrounded value, formatted label, compared result field, tolerances and a reproducible check |
| Limits and approval | What is excluded, whether hindsight is used, review decision and affected shots |

Do not create a new dispatch or investment model inside a scene. If a desired explanatory calculation needs a new model assumption, register it as separate model work and use qualitative teaching content until approved.

### Source-to-shot mapping

| Shot | Claim IDs | Source IDs and locators | Data/chart/calculation IDs | Scene meaning | Financial binding | Misreading control | Review disposition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| wa-05 | CL-WA-02 | SRC-WA-02, p. 1; SRC-WA-13 | Chart-WA-DAY from CALC-WA-DAY | Rooftop supply, unscheduled operational demand and their sum on a typical summer business day | None | A median day, labelled as such; operational demand is not total consumption | Proposed in v1.2; quantitative once CALC-WA-DAY is signed off at `G-1` |
| wa-00 | Play card fields | View store via the briefing model (REPO-12, corrected in v1.2) | None | The conclusion, first | Existing play card component | Call and figures never restated in prose | Uses an existing component |
| wa-06 | CL-WA-07, CL-WA-10 | SRC-WA-08, p. 78 and Table 28; SRC-WA-09 (4.11.3, Peak ESROD definition); SRC-WA-13 | Chart-WA-EVENING (signature chart) from CALC-WA-DAY and the printed window | Why credits need the whole evening window, and why the play adds an hour for fade | Duration requirement and play duration (bound) | No guaranteed evening premium; the window is AEMO's, the trace a median day | Unblocked in v1.2; GAP-WA-RCM closed for 2028-29, GAP-WA-DAY closed on sign-off, CF-WA-02 recorded |

Traceability must also work in reverse: **source -> affected claims -> historical nodes -> shots -> 2D evidence -> published labels**. A superseded source should produce a finite review queue, not a manual search through prose.

### Asset register

| Asset ID | Purpose / shots | Creator / original URL | Licence / proof / attribution | Geography or engineering precision | Public scope | Size / decoded estimate | Fallback / owner / status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ASSET-SVG-KIT | Isometric symbol kit for every scene | Drawn in-house for this project | Own work; no third-party licence | Generic symbols, not site or engineering geometry | Public | Target under 60 KiB uncompressed | Plain diagrams; user review |
| ASSET-SWIS-BOUNDARY | `wa-01` map | `src/markets/wa/story/geo.js`, generated once in `WP-07`: Natural Earth's 1:50m coastline (SRC-NE-01) for Australia, split into WA, the NT and the NEM's states with Tasmania; the SWIS area is the coast from Kalbarri to Albany, closed inland through Kalgoorlie, the three places Energy Policy WA names (SRC-WA-16) (v1.2.1; replaces v1.2's reuse of the Landgate/ABS context boundary, which at 25 KB gzip was too large) | Natural Earth is public domain; the extent is a fact from a government page. The caption credits both | Approximate: three named places joined, not a surveyed boundary; labelled "SWIS area (approximate)" | Public | About 6 KB raw, under 3 KB gzip, inside the story chunk | Schematic outline; user review at `G-2` |

Include terrain, boundary data, map tiles, reference photos, fonts, textures, station models, icons, posters and audio. Record modified/derived status, attribution placement, distribution rights and any share-alike conditions. Public visibility does not imply permission to redistribute a model or image. AI-generated assets still need generation provenance and review for misleading equipment/geography; do not invent a third-party licence for them.

### Gap and review queue

| Issue ID | Missing evidence or conflict | Affected claim / shot | Severity | Temporary treatment | Owner / next action | Gate blocked |
| --- | --- | --- | --- | --- | --- | --- |
| GAP-WA-DAY | Closed at `G-1` (30 Oct): CALC-WA-DAY, the median business day of the 2025-26 Hot Season from AEMO's unscheduled operational demand and rooftop PV, AWST, reused under AEMO's copyright permissions | wa-05/06/08 | None once signed off | Until `G-1`, the chart stays tagged "Example" | User: accept the method at `G-1`; `WP-07` commits the 48-point profile with its record | None after `G-1` |
| GAP-FI-PRODUCT | Product-specific technical and commercial clauses not yet extracted | Finnish payment/qualification script | Blocks route-specific obligations | Product purposes only | Research: inspect governing terms | Finnish complete story |
| GAP-WA-RCM | Closed for 2028-29 in v1.2: 14 Trading Intervals (seven hours) for storage first credited in the 2026 cycle, held for ten years, over the window in Table 28 (CL-WA-07, CL-WA-10) | `wa-06`, `wa-08`, `wa-14` | None | Not needed | Reopen when an ESOO or rule change alters the requirement for the cycle the play enters | None |
| GAP-WA-ESROD | Table 28 of the 2026 ESOO prints the new-storage window one interval earlier than the Peak ESROD rule gives (CF-WA-02) | `wa-06` | Low: the window's position by half an hour | Draw the window as printed, captioned as AEMO's, with "AEMO sets the exact intervals each day" | Research: compare with AEMO's published daily obligation intervals once 2028-29 data exist | None |
| GAP-DE-PRICES | No German day-ahead series is registered; among Germany and Finland only `fi-day-ahead` uses the ENTSO-E connector | German signature chart | Blocks the spread band | Qualitative band tagged Example | Register the DE-LU day-ahead series through the existing ENTSO-E connector | German story |
| GAP-FI-NEED | Fast-reserve need and connected-storage volumes over time not yet sourced | Finnish signature chart | Blocks the crossing chart | Qualitative chart tagged Example | Research: identify Fingrid series or publications | Finnish story |

Resolve conflicting official sources by version, effective date and scope. Record the disagreement and disposition. Do not average incompatible definitions or silently choose the most attractive investment implication.

## 4. Time, units and calculation conventions

| Topic | Required treatment |
| --- | --- |
| Dates and geography | Store the source's observation timezone and effective period. Use AWST for this project's schedule; do not apply the workstation timezone to electricity intervals. |
| DST and intervals | Preserve local timezone and UTC linkage where available; account for 23/25-hour days, duplicates, missing intervals and interval-start/end conventions. |
| Historical prices | Display date range, product and interval. An ex-post perfect-foresight illustration is not realizable trading performance. |
| Publication versus delivery | A cleared price can be observed before its delivery hour. Record publication/auction time separately from delivery period; do not treat a known forward-delivery price as completed dispatch, cash received or a forecast merely because delivery is later. |
| Power and energy | MW is delivery/absorption rate; MWh is energy. A nominal 100 MW / 400 MWh example gives 4 hours by division, before usable-window, losses, degradation and contract limits. |
| Reserve and energy prices | EUR/MW/h capacity remuneration and EUR/MWh energy prices have different denominators. A reserve-price series is not an energy arbitrage spread. |
| Aggregation | Explain capacity weighting, dispatch/availability assumptions, missing intervals, hours, fees and whether gross or net. Do not multiply an annual average by all hours as a guaranteed capture estimate. |
| Currency and inflation | Label local currency versus USD, FX date/direction and nominal versus real values; retain stored-case FX when replaying a saved case. |
| Revenue to equity | Separate service revenue, charging costs, optimizer/service costs, operating costs, augmentation, tax, capital contributions, debt service and distributions according to the existing model's definitions. |
| Duration and clocks | Distinguish equipment duration, contract tenor, economic life, construction period, qualification lag and exit clock. Do not compare IRRs with different starting dates as if identical. |
| Cash-flow frequency | Monthly display buckets preserve original dated payments. They must not fabricate seasonal dispatch or smooth annual payments into twelve realizable monthly receipts. |
| Precision | Round only at presentation; use tabular numbers, visible units and bounded chart axes. Unknown values use a labelled gap. |
| Numeric lineage | Each published financial label identifies result type/field, case fingerprint, model commit, data vintage and formatting convention. |

The teaching battery uses a 100 MW teaching unit and the play's duration, read from the briefing. It illustrates the case and never changes it.

## 5. Proposed story content contract

The contract is a future structured interface, not a module introduced by this delivery. Keep executable code out of prose and keep financial calculations out of editorial configuration.

| Group | Required fields and invariants |
| --- | --- |
| Identity | `storySchemaVersion`, `contentVersion`, `marketId`, `allocationId`, `systemBoundary`, `researchDashboardId`, `supportedLocales`, reviewer status |
| Call anchor | `playRef` (for example `wa-cap-8h`) and the briefing fields the opening card reads; `reviewedAgainst`, the call and thesis version the story was signed off against, so a re-grade flags the story for review |
| Thesis | Reference to the briefing thesis it explains; market distinction; historical cause; dominant tension; service; payment pathway; value-weakening condition; next diligence question |
| Chapters | Six stable IDs in agreed order; explicit unavailable sections if research is incomplete; chapters independently addressable |
| Historical nodes | 4-6 IDs, dates or bounded periods, constraint, choice, inheritance, present implication, fact/inference classification, source/claim IDs |
| Shot | Stable ID, chapter, user question, short copy, objects/camera, control, feedback, evidence, investment meaning, warning boundary and mobile/2D equivalent |
| Time and truth | Statement type, source effective date, observation window, scenario name and forecast origin; no future infrastructure styled as observed fact |
| Evidence | Claim and source references, exact locators, calculation/data IDs, freshness, permission status and review disposition |
| Payment | Service, buyer/settlement chain, eligibility, award/contract evidence, performance obligations, duration, deductions and termination/expiry conditions |
| Result binding | Only fields that the existing play card and market sections already read; `‹bound›` tokens in copy resolve to them; unavailable-state copy; no new adapter, typed figures or model execution in content files |
| Scene | Symbol-kit IDs, isometric layout anchors, labelled precision, teaching presets, text labels from the shot's keyed `labels` pairs in the content file, and an accessibility description |
| Localization | Meaning-equivalent English/Chinese strings, translation status, localized labels/units, retained original source titles |
| Validation | Every reference and `‹bound›` token resolves; chapters and shots unique; one marker per shot; public assets cleared; no unreviewed quantitative claim marked approved; `reviewedAgainst` matches the current call, or the story is flagged |

The story holds no investment-case state; teaching state stays local, as defined in [the state work package](engineering-work-packages.md#wp-04-route-navigation-and-state-restoration). Market content must not import a heavy renderer or confidential document. Story loading must remain lazy and must not pull all market narratives into the home entry bundle.

## 6. Worked interpretation boundaries

### WA history to present

`CL-WA-02` is supported by an operator explanation of rooftop exports and low-demand operation. It can support an illustrative transition from centralized supply to distributed rooftops. It cannot establish a current noon MW value, exact site connection capacity, or the return of a 4-hour battery. Those need separate datasets, rights, calculations and current-case evidence. In v1.2 the noon and evening values come from CALC-WA-DAY, a median day of observed data with its own record; the return still comes only from the market page.

### Finland after PR #72

The final checked repository includes seven hourly reserve-capacity price snapshots, each with 8,776 points, after #73 fixed first-snapshot commit detection. Metadata identifies the price unit and retrieval/coverage period; this is not evidence that a battery could win every hour or collect the displayed price. Future checks must record production freshness, publication versus delivery time, product direction, eligible MW, market/technical obligations, availability, SOC costs and fees. The source and method for an actual capture model remain separate from the observed-price feed. See [REPO-10/11](source-register.md#repository-verification) and [the Finland sources](source-register.md#finland).

### Italy's two procurement routes

Create separate records for Capacity Market and MACSE terms, relevant auction vintages and project awards. An operator's mechanism explainer supports a route explanation. Only governing terms and the actual project's rights can support statements about simultaneous revenue, settlement deductions, contract tenure or bankable coverage. Do not sum standalone route maxima.

## 7. Dynamic update and review policy

| Change | Review trigger | Required response |
| --- | --- | --- |
| Public observed-data update | Dataset catalogue cadence, quality/staleness envelope and material drift | Recompute only approved derived displays; retain provenance; queue affected claims for review where interpretation changes |
| Rules or procurement terms | New effective version, consultation decision, auction/contract update | Compare clauses; revise eligibility/payment copy and affected model assumptions through their own process |
| Official annual plan | New publication or corrected file | Preserve prior vintage; compare changed scenarios; update scenario scenes without rewriting history |
| Historical research correction | Better primary evidence or changed interpretation | Retain revision history; update historical node and its source-to-shot links |
| Model or FX revision | Approved model commit/data vintage | Reconcile displayed results; distinguish live-current and saved-frozen case; do not silently reprice a shared saved case |
| Call, play or thesis change | A re-grade, new play or edited thesis in the briefing | The play card updates itself; the story is flagged through `reviewedAgainst`; the user re-signs the narrative |
| Translation or asset change | Meaning, rights, attribution or geometry changes | Repeat the relevant content, legal-use, layout or precision review |

Use the existing dataset registry and governance pipeline for automated observed data. This plan does not grant automation authority to edit analyst conclusions, story claims, contracts, model assumptions or rights records. If evidence becomes stale or inaccessible, keep the last valid vintage with its date or withhold the affected claim; do not refresh its date merely because the page was viewed again.

## 8. Public and confidential boundaries

The existing [data policy](../data-policy.md) applies to source metadata, file names, screenshots, asset textures, comments, exports, source maps, URLs and embedded model values as well as visible copy. Everything shipped to a browser is public. An unlinked or feature-gated frontend asset is still downloadable.

Keep restricted project evidence outside public source and asset trees. Check every project name against `local-data/markers.json` before writing it into a tracked file, commit message, PR body or branch name. Public evidence drawers may describe the missing evidence category without naming a confidential project, counterparty, address or term. Do not embed an NDA design drawing into a station model or texture. Preview builds must use public/sanitized inputs; do not share a development server that can expose the existing local confidential layer.

Credentials belong in the approved credential/secret mechanism, not registers, handoff documents, screenshots, command examples with real values, Git or public assets. Migration records should state whether access has been re-established without containing credential values.

Publication requires the relevant source, calculation, engineering-meaning, investment-meaning, translation and rights reviews. Where that review is not available, the honest outcome is an explicitly limited draft or a blocked claim, not a simulated sign-off.
