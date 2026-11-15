# Architecture

Implementation at base commit `06ec0cc530473ff98347ed8853644d1fc5381fb4`, checked 15 November 2026. Static Vite, native ES modules, DOM/SVG, D3 geography, CSS tokens and bilingual content; no application backend, database or authentication layer.

## Entry and the single shell

`index.html` loads `src/main.js`, styles and `src/app/app.js`. The application renderer owns route changes, stale-load guards, document language/title, focus and route announcements. `src/app/router.js` parses History API paths and story-position parameters.

`src/experience/chrome.js` supplies the common shell. `src/experience/pages.js` renders home, global opportunities and bare market URLs. Resource pages and research dashboards use this same shell rather than installing another site header/footer.

| Routes | Owner and behavior |
| --- | --- |
| `/`, `/returns`, `/markets/:slug` | Lazy experience pages: investor brief, global matrix/table and market investment case |
| Market grid/entry/revenue, capacity/RCM, energy, services/FCESS and duration links | `app.js` opens grid or revenue research within the market experience, preserving the subsection |
| Other market tab/section URLs | `src/markets/marketPage.js` selects the dashboard; `tabGroups.js` resolves grouped tabs and older links |
| `/policy`, `/policy/compare`, `/policy/dossiers/:id`, `/policy/stories/:id` | Lazy policy page, with version selection; market `/policy` routes filter it |
| `/news` | Rewritten to `/policy` with the news filter; the headlines fragment maps to radar |
| `/investment-lab` | Lazy lab resource: current acquisition calculator and disclosed operating-model lab |
| `/data` | Dataset status |
| `/changes`, `/scout`, `/desk` | Lazy history, scouting and review resources |
| `/projects/:slug[/:tab]` | Lazy dossier shell; all production slugs show not found because the index is empty |

`/markets` resolves to home; unknown paths/slugs show not found. Japan's regional URLs stay distinct; `?region=compare` selects their shared dashboard's comparison lens. Story location uses `view`, `chapter` and `shot`; changing only the reading position does not rebuild the entire page.

## Market and presentation ownership

`src/markets/registry.js` joins manifests, comparison inputs, sources, tabs and lazy dashboard loaders. It contains **18 allocation markets and 16 dashboard owners**. Tokyo, Kyushu and Hokkaido share Japan's research implementation. Allocation and dashboard counts serve different purposes.

WA uses hand-written sections. The other dashboard lineage uses `src/markets/_shared/engine.js`, formatting/calculation helpers and declarative `blocks.js`. Several markets lazy-load sections individually. Public history/research adapters reuse market-owned data through lazy entry points.

`src/experience/story/` contains the story shell, shared SVG kit, public reader and market sequences. Research disclosures/dialogs load original research content when requested. `src/components/` supplies cards, maps, sources and controls. `src/charts/` supplies line, grouped/stacked bar, waterfall, band and scatter charts; exposure curves have a separate entry used by entry analysis. Investment risk figures use `src/experience/riskChart.js` and `riskCharts.js`.

`src/app/state.js` owns language, theme and investor lens. `L()` resolves bilingual arrays/objects. Market state owns section inputs; language changes re-render through the application. `src/styles/tokens.css` owns shared colors, typography and layout tokens.

## Two return models and their consumers

| Model | Implementation | Feeds today |
| --- | --- | --- |
| Comparison/design operating model | `src/comparison/engine.js`, assumptions, capex, strategies, design-fit and refinement | Route/duration screens, research, older lab, briefing design economics and acquisition input adaptation |
| Headline investment model | `src/opportunities/investment.js` with `src/acquisition/reference.js`, `cashflows.js`, `valuation.js`, `leverage.js` | Investor summaries, home priorities, global matrix/table, market investment case, conventional/special comparisons and acquisition calculator |

The comparison engine works per MW in USD over 15 operating years, with explicit secured, auction-renewal and merchant streams, construction/VAT timing, operating costs and optional lifecycle costs. Its results are not automatically the headline return.

The investment reference starts at RTB closing and defaults to 20 operating years. It applies dated construction/acquisition flows, nominal escalation, project tax, sale policy, purchase-price assumptions and optional project financing. Headline fields read `holdIRR`; sale, lower-of-hold-and-sale and levered equity fields remain distinct. `src/opportunities/summary.js` produces investor summaries. `src/experience/model.js` reads those summaries and retains comparison-engine scenarios for research. The older debt layer is `src/economics/projectDebt.js`; headline leverage is `src/acquisition/leverage.js`.

The return-grade basis is under a pending sign-off plan.

[Comparison methodology](comparison-methodology.md) explains the boundary. Site monetary results come from model fields.

## Observation and judgement flow

The dataset catalogue is `src/governance/datasets.js`. ETL adapters fetch public sources; validation, rights checks and snapshot construction determine what may be saved. `etl/run.mjs` writes permitted observations/summaries and their index under `public/data/public/`, retaining provenance and checksums. Browser live-data loaders consume these snapshots; `/data` exposes status and provenance.

`etl.yml` schedules refresh and deterministic policy discovery at 06:17 UTC daily, weekly briefing at 23:07 UTC Sunday and monthly digest at 06:07 UTC on day 3. Agent/scout analysis requires explicit dispatch and remains report-only. Ordinary refresh excludes policy model execution/publication. Changed validated snapshots are committed to main; refresh calls the release workflow on that exact commit because a workflow-token push does not itself trigger another workflow.

The view store contains public analyst judgements, scouting records and append-only history. `etl/lib/viewWriter.mjs` is the controlled writer; `scripts/view/writer.mjs` is its analyst interface. Automation uses read-only capabilities and reports potential changes. Only the analyst applies live judgement/strategy changes. Browser controls do not write the store. Registries/build projections consume public records; private reasons stay outside the public bundle.

## Build plugins

| Installed plugin | Current purpose |
| --- | --- |
| `vite-plugin-local-data.js` | Development-only substitution of payload, portfolio-section and dossier stubs; production keeps empty/public stubs |
| `vite-plugin-view-changes.js` | Recent-history projection plus lazy full history |
| `vite-plugin-scout.js` | Compact scouting summaries and separate full cards |
| `vite-plugin-view-board.js` | Public grades/calls/ledger amounts without full market prose |
| `vite-plugin-briefing.js` | Briefing/design projections and per-investor opportunity data |

These plugins read inputs; they do not authorize changes to decisions. Production source maps are disabled. Named chunks/manual groups identify charts, dashboards, lazy sections, owner history, stories, policy and experience resources. The public directory is copied into the artifact: an unlinked file is still public.

`vercel.json` supplies SPA routing and disables Git-triggered deployments. GitHub Actions builds, scans `dist/` and the exact `.vercel/output`, and deploys with `--prebuilt`. Only built previews may be shared; the dev server can expose confidential local inputs.

## Tests and budgets

Use [README](../README.md) for commands and preview setup. `npm test` uses explicit Node test globs in `tests/` and `etl/tests/`, excluding archived worktrees. `npm run test:current` checks both the frozen historical engine fixture and today's published-model expectations. The baseline generator rewrites a fixture and is not a check.

Unit/contracts cover registry, models, governance, sources, snapshots, presentation, lazy ownership and release behavior. Playwright tests desktop/mobile behavior on built output; `PLATFORM_TEST_BASE_URL` selects an externally started preview. A separately configured smoke suite serves PR/live-release checks. Confidentiality scans require real marker/fingerprint material; skipped scans must be reported.

`tests/bundle-budget.test.js` enforces gzip caps for entry, shared graphs, features, market-owned data/history, stories and policy, including complete import closures where specified. It also checks that lazy content stays out of eager graphs. These assertions are separate from Vite's large-chunk warning. [CI performance](ci-performance.md) records the 2,000-minute monthly budget: ready PRs run fast gates/smoke; main and `full-check` PRs run the full browser suite.

This describes the base implementation, not a new investment approval or production release.
