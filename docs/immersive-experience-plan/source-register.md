# Verification and Source Register

Pack: BESS-IX-2026-10-30, version 1.1  
Check date: 30 October 2026, Australia/Perth  
Navigation: [Master plan](README.md) | [Evidence rules and templates](evidence-and-content-specification.md)

## Reading the verification labels

**Verified foundation** means the specific statement below was supported by inspected repository content or an official page/excerpt. It does not certify every statement on that website, all historical facts, a dataset's redistribution rights, or any project revenue. **Discovery only** means a source owner or document has been identified for later work. **Proposed interpretation** means an editorial or investment connection requiring review. All checks in this register are bounded to planning needs.

## Repository verification

After the user reported #72 merged, local `main` and the [GitHub main branch](https://api.github.com/repos/jerryyuan1996/BESS-research-platform/branches/main) matched [93c4a7e](https://github.com/jerryyuan1996/BESS-research-platform/commit/93c4a7e75cf050c5d9b01652bd84ace52f9a960d), merging [PR #72](https://github.com/jerryyuan1996/BESS-research-platform/pull/72). During writing, external updates added [PR #73](https://github.com/jerryyuan1996/BESS-research-platform/pull/73), commit `3a69353b4382e77873975267d241c7e82f73791a`, and the first Finland reserve snapshots. At approximately **14:45 AWST**, local and remote main matched [6ce1e035cace6e676167f904d511a3425a5be12d](https://github.com/jerryyuan1996/BESS-research-platform/commit/6ce1e035cace6e676167f904d511a3425a5be12d). The delta was limited to the ETL workflow's first-snapshot commit detection and 14 public snapshot/summary files. Application/model/package/CI-production configuration inspected after #72 was unchanged. References below are pinned to the final baseline. No synchronization action was performed by this task.

| ID | Exact reference at the baseline | Verified scope |
| --- | --- | --- |
| REPO-01 | [Market registry](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/markets/registry.js) | Canonical 18-entry allocation registry; Japan has regional entries and a shared research-dashboard arrangement |
| REPO-02 | [Package manifest](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/package.json) and [lockfile](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/package-lock.json) | Native ESM, Vite, available commands, current declared dependencies and engine range; no declared React/Three.js |
| REPO-03 | [Application renderer](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/app/app.js), [router](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/app/router.js), [global state](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/app/state.js) | Full application-container clearing; lazy render tokens; History API routes; global language/theme/investor state |
| REPO-04 | [Globe implementation](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/home/marketGlobe.js) | `d3-geo`, orthographic projection, TopoJSON and SVG; not an existing WebGL scene |
| REPO-05 | [Experience model](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/experience/model.js), [investment results](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/opportunities/investment.js), [monthly display](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/opportunities/monthlyCash.js) | Existing result paths; acquisition/hold/sale/debt metrics; monthly bucketing preserves dated payments and invents no seasonality |
| REPO-06 | [Case records](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/comparison/caseRecord.js), [stack feasibility](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/economics/revenueStackFeasibility.js) | Versioned saved comparison inputs and replay; missing physical stack constraints are unknown; no certification of project feasibility |
| REPO-07 | [Research dialog](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/experience/researchDialog.js), [experience pages](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/experience/pages.js), [tokens](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/styles/tokens.css) | Existing research entry, editorial surfaces, bilingual patterns and design tokens to reuse |
| REPO-08 | [CI workflow](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/.github/workflows/ci.yml), [Vercel configuration](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/vercel.json), [publishing guide](../publishing.md) | Node 20 in CI; PR tests without production publication; controlled main publication; Git-triggered Vercel deployment disabled in repository configuration |
| REPO-09 | [Bundle-budget tests](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/tests/bundle-budget.test.js), [browser configuration](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/playwright.config.js) | Entry/home caps 170/265 using bytes divided by 1024; desktop/mobile Chromium projects and built-site preview configuration |
| REPO-10 | [Data policy](../data-policy.md), [dataset catalogue](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/governance/datasets.js), [live-data guide](../live-data.md) | Public frontend boundary, licensing/provenance controls, Finland reserve-price registrations and separate day-ahead registration; no German price series is registered (checked for v1.1) |
| REPO-11 | [ETL commit step](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/.github/workflows/etl.yml#L199), [FCR-N snapshot example](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/public/data/public/fi-fcr-n.json) | #73 includes untracked first snapshots in change detection. All seven stored reserve-series envelopes were inspected: 8,776 hourly points each, unit EUR/MW/h, fetched around 06:20 UTC on 30 October. This was metadata review, not a new API fetch or full revenue backtest |
| REPO-12 | [Briefing content, October 2026](../briefing-content-2026-10.md); [plays and design economics](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/briefing/plays.js) | The theses, calls and plays the stories argue for: WA capacity-led at seven hours (`wa-cap-7h`), Germany a four-hour toll (`de-toll-4h`), Finland two hours with a negotiated floor (`fi-mer-2h`). The document's figures date from 16 October; stories bind live fields instead of copying them |
| REPO-13 | [Three-page design](../three-page-design.md); [market page](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/experience/pages.js); [research dialog](https://github.com/jerryyuan1996/BESS-research-platform/blob/6ce1e035cace6e676167f904d511a3425a5be12d/src/experience/researchDialog.js) | Market page sections and anchors (`#decision`, `#overview`, `#revenue-drivers`, `#bankable`, `#revenue`, `#execution`, `#opportunity-comparison`, `#downside`, `#sources`); the Overview's "Grid, history and full research context" button lazy-loads the research dialog |
| REPO-14 | [Investor review implementation](../investor-review-implementation-2026-10-30.md) | Home first view about 262.5 KiB against its 265 KiB budget at PR #69; experience chunk capped at 26 KiB; investor data split into four lazy chunks |

The initial #72 run check was in progress. At the final approximately **14:45 AWST** check, GitHub reported [#72 CI run 41012379408](https://github.com/jerryyuan1996/BESS-research-platform/actions/runs/41012379408), [#73 CI run 41013405200](https://github.com/jerryyuan1996/BESS-research-platform/actions/runs/41013405200), and [Live data run 41013441832](https://github.com/jerryyuan1996/BESS-research-platform/actions/runs/41013441832) completed successfully. The latest live-data run was started from #73 and produced the snapshot commit; a run's starting SHA and its generated data SHA are distinct. Recheck exact release identity before implementation/publication. No fresh live-page inspection or locally executed application tests are asserted by this documentation task.

## Market sources

### Western Australia

| ID | Primary source and locator | Supported planning foundation | Limits and remaining work |
| --- | --- | --- | --- |
| SRC-WA-01 | [AEMO WEM overview](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem) | WEM serves the SWIS in south-west Western Australia | Obtain authoritative boundary geometry and history; do not draw all WA as WEM |
| SRC-WA-02 | [AEMO rooftop-solar fact sheet, 2024, pp. 1-3](https://www.aemo.com.au/-/media/files/learn/fact-sheets/2024/fact-sheet-operating-electricity-grids-with-rooftop-solar-installations.pdf) | Shift from one-way distribution to distributed exports; low operational demand can create security issues | Historical explanatory document, not a 2026 installed-capacity or current-record dataset |
| SRC-WA-03 | [AEMO WEM reform announcement](https://www.aemo.com.au/newsroom/media-release/major-reform-implemented-to-wa-electricity-market-to-enable-the-energy-transition) | New WEM arrangements commenced on 1 October 2023 | Historical event; current product rules require current procedures |
| SRC-WA-04 | [AEMO WEM ESOO publication page, 2026 section](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wem-forecasting-and-planning/wem-electricity-statement-of-opportunities-wem-esoo) | Current annual planning source was available for 2026; page distinguishes reliability outlook and capacity parameters | Page states initial publication on 23 June and lists updated report/data files dated 15 July; pin the chosen file/version. No forecast value imported into this plan |
| SRC-WA-05 | [AEMO Certification of Reserve Capacity](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/certification-of-reserve-capacity) | Certification is a separate project qualification process | Retrieve applicable capacity-year requirements, ESR rules and clauses before numeric/payment copy approval |
| SRC-WA-06 | [AEMO Essential System Services](https://aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/system-operations/essential-system-services) | System services and accreditation have their own operational requirements | Landing-page review; not a completed review of every linked procedure |
| SRC-WA-07 | [AEMO WEM Procedures, Reserve Capacity section](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/procedures-policies-and-guides/procedures) | Current procedure register includes certification of Peak and Flexible CRC | Retrieve effective versions and transition dates; do not carry old capacity terminology forward without checking |

### Germany

| ID | Primary source and locator | Supported planning foundation | Limits and remaining work |
| --- | --- | --- | --- |
| SRC-DE-01 | [TransnetBW Redispatch, “How it comes to Redispatch”](https://www.transnetbw.de/en/energy-market/ancillary-services/redispatch) | Northern wind growth and network capacity can differ; operators redispatch around congestion | Explains a system issue, not a BESS revenue entitlement; check publication vintage before historical wording |
| SRC-DE-02 | [German TSOs' Netztransparenz redispatch publication](https://www.netztransparenz.de/en/Ancillary-Services/System-operations/Redispatch) | Operational redispatch definition and a source for measures | Obtain dated data, geography, rights and method; do not allocate aggregate redispatch costs to one battery |

### Finland

| ID | Primary source and locator | Supported planning foundation | Limits and remaining work |
| --- | --- | --- | --- |
| SRC-FI-01 | [Fingrid Power system reserves, product purposes and suitability](https://www.fingrid.fi/en/electricity-market/reserves/power-system-reserves/) | Different reserve products serve different purposes; technical/market eligibility is product-specific | Fetch each relevant technical requirement and market term before making duration, symmetry or revenue claims |
| SRC-FI-02 | [Fingrid Electricity system vision 2040, 2025 vision attachment](https://www.fingrid.fi/en/grid/development/electricity-system-vision-2040/) | Alternative future system development paths are scenarios | English landing page checked; Finnish attachment not fully reviewed/translated. Not a current generation mix or committed buildout |
| SRC-FI-03 | [Fingrid Open Data](https://data.fingrid.fi/) | Discovery entry for authoritative reserve series | Dataset IDs, effective products, missing hours, licence and update status must be recorded per series; repo registration is separately verified in REPO-10 |

### Italy

| ID | Primary source and locator | Supported planning foundation | Limits and remaining work |
| --- | --- | --- | --- |
| SRC-IT-01 | [Terna Capacity Market](https://www.terna.it/it/sistema-elettrico/mercato-capacita) | Competitive procurement links an annual premium to obligations and a strike-price repayment mechanism | Italian source; obtain applicable auction/contract rules. Not a project award |
| SRC-IT-02 | [Terna MACSE explanation](https://lightbox.terna.it/en/insight/m-for-macse) | Distinct storage procurement route with construction and availability obligations | Operator explanation, not the governing contract; retrieve applicable rules and commercial rights before stacking analysis |
| SRC-IT-03 | [ARERA opinion 92/2026/I/eel, 24 March 2026](https://www.arera.it/atti-e-provvedimenti/dettaglio/26/92-26) | A dated regulatory step concerning storage procurement requirements | An opinion and planning input, not evidence of a specific project's award or payment |
| SRC-IT-04 | [Terna 2025 Development Plan overview, storage procurement section](https://download.terna.it/terna/Terna_2025_Development_Plan_Overview_8dd62ef0043f220.pdf) | Historical planning context for locational storage needs | Relevant excerpt checked; no full-document re-audit. Keep its scenario year and refresh against later plans before publication |

All other markets' source owners in [the narrative cards](market-narratives.md) are collection targets. They were not exhaustively browsed or re-certified for this pack.

## Engineering sources

| ID | Official reference | Application and limit |
| --- | --- | --- |
| SRC-TECH-01 | [Node.js releases](https://nodejs.org/en/about/previous-releases) | On the check date, Node 20 was listed EOL and Node 24/26 LTS. Select and pin an exact supported runtime after compatibility testing; local `v26.2.0` is an observed environment value, not a recommendation of that patch |
| SRC-TECH-02 | [Three.js resource cleanup](https://threejs.org/manual/pages/cleanup.html) | Explicit disposal is needed for GPU-backed resources; proposed host must define ownership and cleanup |
| SRC-TECH-03 | [Three.js rendering on demand](https://threejs.org/manual/pages/rendering-on-demand.html) | Static explanatory scenes can render when inputs change instead of continuously; lifecycle design remains repository-specific |
| SRC-TECH-04 | [Google Web Vitals](https://web.dev/articles/vitals) | Use LCP, INP and CLS targets and distinguish lab evidence from field p75. This pack does not assert current compliance |

## Verified claim seeds

| Claim ID | Narrow supported statement | Evidence | Proposed use |
| --- | --- | --- | --- |
| CL-WA-01 | The WEM/SWIS scope differs from the whole state of Western Australia. | SRC-WA-01; REPO-01/04 | `wa-01`; confirm scene geometry separately |
| CL-WA-02 | Rooftop exports change distribution operation; low operational demand can create security challenges. | SRC-WA-02 | `wa-02`, `wa-05`; current daily traces still pending |
| CL-WA-03 | New WEM arrangements began on 1 October 2023. | SRC-WA-03 | `wa-04`; no inference of current project qualification |
| CL-WA-04 | The 2026 WEM ESOO is a planning outlook, not a record of all future assets being built. | SRC-WA-04 | Historical/scenario boundary and delivery context |
| CL-DE-01 | Congestion management changes generation around constrained transmission. | SRC-DE-01/02 | German spatial story; investment payment bridge remains research |
| CL-FI-01 | Reserve products have distinct purposes and eligibility requirements. | SRC-FI-01 | Finnish speed/qualification story; no income guarantee |
| CL-IT-01 | Capacity Market and MACSE are separate routes requiring separate obligation review. | SRC-IT-01/02 | Italian route fork; compatibility not presumed |

These seeds are not a complete claim ledger. Add exact clauses/pages, extract-level records, calculations and reviewer disposition using [the templates](evidence-and-content-specification.md#3-reusable-register-templates) before publishing detailed historical or quantitative scenes.

## Candidate claims added in v1.1

These are research targets, not verified statements. Each needs an exact locator and the user's review before it can carry a Fair or Strong marker.

| Claim ID | Proposed statement | Source to collect | Used by |
| --- | --- | --- | --- |
| CL-WA-05 | The SWIS has no electrical interconnection with the NEM | AEMO system description (locator to find) | `wa-01` |
| CL-WA-06 | The WEM began in 2006 with a Reserve Capacity Mechanism, while the NEM uses an energy-only design | WEM Rules history (ERA or Coordinator of Energy); AEMC for the NEM | `wa-00`, `wa-03` |
| CL-WA-07 | Storage capacity is certified against an obligation duration that sets the hours a battery must cover | WEM Rules and AEMO procedures for the relevant capacity years (SRC-WA-05/07) | `wa-06`, `wa-08` |
| CL-WA-08 | The state government decided to retire its coal generation by around 2030 | WA Government announcement (to locate) | `wa-03` |
| CL-DE-02 | No capacity payment is available to a four-hour battery in Germany today, and storage grid-fee rules are in draft | BNetzA and federal ministry documents (to locate); platform research | Germany story |
| CL-FI-02 | Connected battery storage exceeds Finland's fast-reserve need | Fingrid publications or data (to locate); platform research | Finland story |
| CL-FI-03 | Olkiluoto 3's regular operation from 2023 raised the largest single outage the reserves must cover | Fingrid or TVO publications (to locate) | Finland story |
| CL-GB-01 | Fast-frequency tenders drew Great Britain's first battery wave, and each service batteries entered later filled in turn | NESO service history and tender results (to locate) | `gb` card. Unverified; v1.3 |
| CL-GB-02 | The Capacity Market de-rates storage by duration, and the Gate 2 connection reform may limit progression for batteries with revenue support | NESO de-rating methodology; Ofgem Gate 2 decision (to locate) | `gb` card. Unverified; v1.3 |
| CL-IT-02 | The Capacity Market pays an annual premium for de-rated MW with strike-price repayment, and the trading margin stays with the owner | SRC-IT-01 and the applicable auction rules | `it` card, fork A. Unverified; v1.3 |
| CL-IT-03 | MACSE pays a long fixed premium per MWh-year and cedes the battery's time-shift to a central platform | SRC-IT-02/03 and the MACSE rules | `it` card, fork B. Unverified; v1.3 |
| CL-IE-01 | DS3 system services paid Ireland's first batteries, and DS3 ends at a long-stop with its successor procured competitively | EirGrid DS3 programme; SEM Committee decisions (to locate) | `ie` card. Unverified; v1.3 |
| CL-IE-02 | SEM capacity contracts are de-rated by duration and carry difference payments in scarcity | Capacity Market Code; SEM Committee (to locate) | `ie` card. Unverified; v1.3 |
| CL-RO-01 | Romania's battery fleet is doubling, while most of Bulgaria's battery output stays behind the border | Transelectrica and ENTSO-E data; platform research | `ro` card. Unverified; v1.3 |
| CL-RO-02 | Romanian connection capacity is allocated by auction with guarantees, under ANRE orders that keep changing | ANRE orders (to locate) | `ro` card. Unverified; v1.3 |
| CL-PL-01 | Storage won long capacity contracts in earlier Polish auctions, then its credit was cut, and no successor to the main auctions is legislated | PSE auction results; URE; the capacity market act (to locate) | `pl` card. Unverified; v1.3 |
| CL-PL-02 | A capital grant reduces the capacity payment of a project that holds both | Capacity market act; NFOŚiGW programme terms (to locate) | `pl` card, both forks. Unverified; v1.3 |
| CL-JP-01 | The long-term decarbonisation auction pays a twenty-year fixed award, requires most other-market earnings to be returned, caps battery bids at a regulated return, and from Round 4 limits lithium-ion to a smaller pool where certified cells clear first | METI and OCCTO auction guidelines (to locate) | National layer for `jp_tokyo`, `jp_kyushu`, `jp_hokkaido`. Unverified; v1.3 |
| CL-JP-02 | Tokyo sits on Japan's eastern frequency, linked to the west only through limited converter stations | OCCTO (to locate) | `jp_tokyo` card. Unverified; v1.3 |
| CL-JP-03 | Kyushu has Japan's deepest solar curtailment, with export limited by its link to Honshu | Kyushu network operator; OCCTO (to locate) | `jp_kyushu` card. Unverified; v1.3 |
| CL-JP-04 | Hokkaido offers early connection on charging-control terms, and its HVDC links to Honshu are being reinforced | Hokkaido network operator; OCCTO wide-area plan (to locate) | `jp_hokkaido` card. Unverified; v1.3 |
| CL-PJM-01 | PJM accredits storage by load-carrying capability, and four-hour accreditation has fallen across auctions while the price rose | PJM accreditation reports and auction results (to locate) | `pjm` card. Unverified; v1.3 |
| CL-ERCOT-01 | ERCOT is energy-only with scarcity pricing, runs largely apart from the rest of the US grid, and battery revenue came mostly from rare price events and services that the growing fleet competed away | ERCOT and PUCT; the published fleet revenue index (to locate) | `ercot` card. Unverified; v1.3 |
| CL-CAISO-01 | California's RA programme followed its energy crisis, credits four-hour storage, and cuts storage qualifying capacity for foldback | CPUC RA decisions (to locate) | `caiso` card. Unverified; v1.3 |
| CL-ON-01 | Ontario's early market froze prices, the province turned to contracted procurement, and Market Renewal later introduced a day-ahead market | IESO and Ontario government history (to locate) | `ca_on` card. Unverified; v1.3 |
| CL-SA-01 | SPPC is Saudi Arabia's single buyer and procures storage on build-own-operate availability contracts, with no price published | SPPC announcements (to locate) | `sa` card. Unverified; v1.3 |
| CL-ES-01 | Iberia is weakly interconnected with France, and Spain's capacity market exists in law with no auction yet | REE and ENTSO-E; BOE Order TED/966/2026 | `es` card. Unverified; v1.3 |
