# BESS Research Platform

A personal, non-commercial battery-storage investment research site. The public site is a static Vite application using native JavaScript ES modules, SVG/D3 geography, English and Simplified Chinese.

Implementation baseline: `06ec0cc530473ff98347ed8853644d1fc5381fb4`, checked 15 November 2026. There are **18 allocation markets and 16 research dashboard owners**; Japan's three regional exposures share one dashboard.

## Routes and experience

One experience shell supplies navigation, language controls, header, footer and resource-page framing.

| Address | Current behavior |
| --- | --- |
| `/` | Investment brief and priorities for the selected investor |
| `/returns` | Global opportunity matrix and comparison table |
| `/markets/:slug` | Investment case, narrative, revenue, execution, downside and research |
| `/markets/:slug/:tab[/:section]` | Research routes; grid/entry and revenue-related links open the corresponding research dialog |
| `/investment-lab` | Current investment calculator and a disclosure containing the older operating-model lab |
| `/policy`, `/policy/compare`, `/policy/dossiers/:id`, `/policy/stories/:id` | Policy and industry intelligence and its evidence |
| `/news` | Compatibility address rewritten to the intelligence radar's news filter |
| `/data` | Dataset status and provenance |
| `/changes`, `/scout`, `/desk` | Published decision history, scouting and analyst review resources |
| `/projects/:slug[/:tab]` | Local dossier route; production contains no dossiers and shows not found |

The parser is [src/app/router.js](src/app/router.js); [src/app/app.js](src/app/app.js) owns rendering and compatibility routing. [src/experience/](src/experience/) supplies the public investment experience. Research uses the market modules and shared block renderer.

## Two models

- **Comparison/design engine:** [src/comparison/engine.js](src/comparison/engine.js) builds a 15-operating-year, per-MW USD operating case. It feeds route/duration screens, research calculations, the older lab and inputs adapted into acquisition underwriting.
- **Headline investment model:** [src/opportunities/investment.js](src/opportunities/investment.js) coordinates [src/acquisition/](src/acquisition/): RTB closing, construction timing, 20 operating years, nominal cash flows, project tax, purchase-price valuation and a separate levered equity case. Its summaries feed home priorities, the global matrix, market investment figures and conventional/special opportunity comparisons. The headline is the all-equity hold return; sale, lower-of-hold-and-sale and levered returns are separate fields.

The return-grade basis is under a pending sign-off plan.

See [comparison methodology](docs/comparison-methodology.md). Presentation and documentation do not authorize changes to financial assumptions.

## Data and decisions

[src/governance/datasets.js](src/governance/datasets.js) declares datasets and publication rights. [etl/run.mjs](etl/run.mjs) fetches and validates public observations, then writes permitted snapshots and summaries under `public/data/public/` with provenance and checksums. Browser loaders consume these snapshots.

The view store holds public analyst judgements and append-only history. `etl/lib/viewWriter.mjs` is the controlled writer; live changes are analyst-only. Rules report crossings. Agent/scout analysis requires explicit dispatch and remains report-only. Build plugins read public records and emit page-specific projections.

Public refresh and deterministic policy discovery run daily at **06:17 UTC**; existing weekly briefing and monthly digest schedules remain. Policy model calls/publication are outside the ordinary refresh. See [governance](docs/governance.md), [live data](docs/live-data.md) and [data policy](docs/data-policy.md).

## Run and check

Use Node **22.12 or newer**, as specified in `package.json`.

```sh
npm ci
npx playwright install chromium
npm run build
npm run preview -- --host 127.0.0.1 --port 4475 --strictPort
```

Show people the built preview. `npm run dev` is local authoring only: its plugin can expose confidential local material.

```sh
npm test
npm run test:current
npm run build
npm run test:budget
npm run test:e2e
```

For the separately started preview, set the browser-test URL in PowerShell:

```powershell
$env:PLATFORM_TEST_BASE_URL = 'http://127.0.0.1:4475'
npm run test:e2e
```

Stop that preview afterwards. Without this variable, Playwright starts its own built preview on port 4175. Run `npm run etl:verify` after data/dataset changes. `npm run test:baseline` **rewrites** the historical fixture; it is not a check or a way to fix failing tests.

The scoped Node suites cover models, governance, snapshot integrity, source boundaries, confidentiality and presentation contracts. Playwright covers built-site routes and interactions. [Bundle budgets](tests/bundle-budget.test.js) measure gzip sizes and dependency/ownership boundaries. Confidentiality checks require the analyst-held marker and fingerprint files described in [AGENTS.md](AGENTS.md); a skipped scan is not a pass.

## Build and release

[vite.config.js](vite.config.js) installs the local-data, view-changes, scout, view-board and briefing plugins. Production keeps confidential stubs, disables source maps and splits research, stories, policy and investor data into lazy chunks.

Work on a branch; preserve other work; commit/push only when requested. Ready PRs run fast checks and smoke. Main runs the full browser suite before deployment; PRs run it when labelled `full-check`. Draft PRs do not run those checks. The Actions budget is 2,000 minutes per month.

GitHub Actions builds and scans the exact output, then deploys to Vercel with `--prebuilt`. `vercel.json` disables Git-triggered deployment. Follow [AGENTS.md](AGENTS.md), [publishing](docs/publishing.md) and [CI performance](docs/ci-performance.md).

[Architecture](docs/architecture.md) describes module ownership and loading. [Adding a market](docs/adding-a-market.md) documents registration.
