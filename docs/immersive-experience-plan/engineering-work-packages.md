# Engineering Work Packages

Pack: BESS-IX-2026-10-30, version 1.2  
Status: implementation proposal; no application, dependency, model, CI or deployment changes made  
Navigation: [Master plan](README.md) | [Content contract](evidence-and-content-specification.md#5-proposed-story-content-contract) | [Page design](experience-and-page-design.md) | [Preparation and acceptance](preparation-migration-and-acceptance.md)

## 1. Verified repository baseline

Local and remote `main` matched `6ce1e035cace6e676167f904d511a3425a5be12d` on 30 October 2026, including #72, #73 and the first Finland reserve snapshots. The v1.1 review rechecked the market page, the briefing, the dataset catalogue and the CI runtime at the same baseline. Preserve unrelated local work in any later task; never reset or clean the checkout to reproduce this snapshot.

| Concern | Current location and behaviour | Consequence for the story |
| --- | --- | --- |
| App architecture | [package.json](../../package.json), [Vite configuration](../../vite.config.js); native ES modules, DOM and SVG | Add one lazy story chunk; no framework migration |
| Dependencies | Vite `^7.3.6`, Playwright `1.64.1`, lockfile present; no React or Three.js | The pilot adds no rendering dependency |
| Runtime | Local Node `v26.2.0` and npm `11.13.0`; engines `^20.19.0 \|\| >=22.12.0`; CI and ETL pin Node 20 in eight places; no `.nvmrc` | `WP-01` pins one LTS |
| Registry and routes | [registry.js](../../src/markets/registry.js), [router.js](../../src/app/router.js) | Canonical IDs and slugs (`western-australia`); preserve `region` and tab paths |
| Market page | [pages.js](../../src/experience/pages.js) renders Decision, Overview, Revenue drivers, Bankable case (`#bankable`), Revenue (`#revenue`), Execution (`#execution`), Special opportunity, Downside (`#downside`) and Sources. The Overview's "Grid, history and full research context" button lazy-loads [researchDialog.js](../../src/experience/researchDialog.js) and checks the button is still connected before opening | The story opens from that button, and its chapters link to these anchors |
| Briefing | [src/briefing/](../../src/briefing/plays.js) (model, plays, sentences); [briefing content](../briefing-content-2026-10.md) | The play card and every bound value read from here |
| Financial outputs | [investment.js](../../src/opportunities/investment.js), [model.js](../../src/opportunities/model.js), [monthlyCash.js](../../src/opportunities/monthlyCash.js); [comparison engine](../../src/comparison/engine.js), [case records](../../src/comparison/caseRecord.js), [Lab](../../src/home/investmentLab.js) | Unchanged; the story binds no new result path |
| Downside and stacking | [downsideNarrative.js](../../src/experience/downsideNarrative.js), [downsideHistory.js](../../src/experience/downsideHistory.js), [revenueStackFeasibility.js](../../src/economics/revenueStackFeasibility.js) | `wa-11` and `wa-14` reuse the defined states |
| Rerendering | [app.js](../../src/app/app.js) calls `invalidateMarketRender()` and clears `#app` with `innerHTML` | SVG needs no GPU teardown, but observers and document listeners must be released first |
| Global preferences | [state.js](../../src/app/state.js): language, theme, investor | Story state stays inside the story |
| Globe and style | [marketGlobe.js](../../src/home/marketGlobe.js) (D3 orthographic SVG); [tokens.css](../../src/styles/tokens.css) | The kit reuses D3 and the tokens |
| Datasets | [datasets.js](../../src/governance/datasets.js): Fingrid reserve series and `fi-day-ahead` through ENTSO-E; no German price series | `GAP-DE-PRICES` before the German chart |
| Publication | [ci.yml](../../.github/workflows/ci.yml), [vercel.json](../../vercel.json), [publishing guide](../publishing.md), [release library](../../scripts/lib/production-release.mjs) | The controlled release stays as it is |
| Existing checks | [bundle budgets](../../tests/bundle-budget.test.js) (entry 170 KiB, home 265 KiB; home about 262.5 KiB at PR #69; experience chunk 26 KiB), [Playwright configuration](../../playwright.config.js), [e2e suite](../../e2e/platform.spec.js) | Story checks add to these |

## 2. Execution principles and dependency order

All packages are **not started**. They become executable in a later, explicitly authorised task.

```text
WP-00 Baseline
WP-01 Runtime pin and local preview            (independent, small)
WP-02 Content contract -> WP-03 WA story shell -> WP-04 Story URLs
WP-06 Symbol kit and charts -> WP-07 WA scenes
WP-03 + WP-04 + WP-07 + G-1 -> WP-10 WA release (G-2)
WP-10 -> WP-09 Germany and Finland
Deferred: WP-11 WebGL experiment (G-3)
Retired: WP-05; WP-08 folded into WP-06
```

Keep each change small, with a visible result. No framework migration, global-store rewrite, model change, CMS or broad dependency refresh. Never regenerate `tests/fixtures/legacy-baseline.json` to make a change pass. Nothing here waits for the new laptop.

## 3. Work packages

### WP-00: Record a trustworthy baseline

| Field | Specification |
| --- | --- |
| Objective | Know which source, data vintages and test results the story must preserve |
| Modules | Git status and history; package, lock and configuration files; existing tests; no application edits |
| Inputs -> outputs | Current checkout -> a baseline note: branch and SHA, lockfile hash, Node, npm and browser versions, data vintages, test results and known issues |
| Dependencies | None |
| Acceptance | The note records the state without discarding any local work |
| Verification | `npm test`, `npm run test:current`, `npm run build`, `npm run test:budget` and `npm run test:e2e` on the recorded SHA, with skips reported as skips |
| Risk | Moving ETL data can look like a code difference; record the data vintages |
| Rollback | None needed; nothing reaches production |

### WP-01: Pin the runtime and preview locally

| Field | Specification |
| --- | --- |
| Objective | One Node LTS for local work, CI and the ETL, and a local preview of the built public site |
| Modules | `.nvmrc`; `package.json` engines; `node-version` in [ci.yml](../../.github/workflows/ci.yml) (two places) and [etl.yml](../../.github/workflows/etl.yml) (six places) |
| Inputs -> outputs | WP-00 results -> pinned version, clean-install recipe and preview recipe |
| Dependencies | WP-00. Independent of the story, and worth landing before the laptop move so the new machine installs one known version |
| Acceptance | Existing tests, build and browser checks pass on the pinned version, and CI reads the same file through `node-version-file` |
| Verification | `npm ci` and the full checks on the old and new versions; compare the results |
| Risk | A runtime change can alter test behaviour. The dev server can load the local confidential layer, so preview only the built public output, on loopback |
| Rollback | Revert the pin on its own |

### WP-02: Establish the story content and evidence contract

| Field | Specification |
| --- | --- |
| Objective | Content that text, scenes and charts can all use, without duplicating facts or figures |
| Modules | Proposed `src/experience/story/` schema and validation; proposed `src/markets/wa/story.js` |
| Inputs -> outputs | Signed-off script and registers -> validated six-chapter content with `playRef`, `reviewedAgainst`, `‹bound›` tokens, claim and source references, markers and locale strings |
| Dependencies | WP-00; the WA script at `G-1` for final content, though a draft is enough to start |
| Acceptance | Every reference and token resolves; no typed figures; content imports no drawing code; incomplete DE and FI drafts validate as incomplete |
| Verification | Unit tests for a missing reference, a duplicate ID, an unresolved token, a stale `reviewedAgainst` and a missing locale string |
| Risk | A schema shaped by WA alone that cannot carry Germany or Finland |
| Rollback | Keep the content as Markdown; the research dialog stays as it is |

### WP-03: Build the WA story shell

| Field | Specification |
| --- | --- |
| Objective | Read the WA story end to end from the market page, in both languages |
| Modules | Proposed `src/experience/story/` shell, chapter navigator, marker component and play-card reuse. The research button in `pages.js` opens the story for markets that have one; `researchDialog.js` becomes its deepest layer |
| Inputs -> outputs | WP-02 content -> a runnable story with text and placeholder diagrams |
| Dependencies | WP-02 |
| Acceptance | All 13 active shots readable; links into `#bankable`, `#revenue`, `#execution` and `#downside` work; no new bytes in the entry or home closure; the experience chunk stays within 26 KiB because the story is its own lazy chunk; markets without a story are unchanged |
| Verification | Keyboard-only and mobile walkthroughs in both languages; an e2e test for opening, closing and returning focus to the button; the budget tests |
| Risk | Story code creeping into the experience chunk |
| Rollback | The button reverts to the research dialog |

### WP-04: Route, navigation and state restoration

| Field | Specification |
| --- | --- |
| Objective | Shareable chapter and shot links, working Back and Forward, and a language switch that keeps the reader's place |
| Modules | [router.js](../../src/app/router.js) with whitelisted `view`, `chapter` and `shot` parameters, preserving `region` and the existing tab paths; a story-local state owner |
| Inputs -> outputs | Router behaviour and content IDs -> a URL policy and navigation tests |
| Dependencies | WP-03 |
| Acceptance | Refresh, direct entry and Back restore the chapter and shot; an invalid shot falls back to its chapter; teaching presets never enter history; the story carries no investment-case state |
| Verification | e2e tests for direct links, Back and Forward, language and investor switches, and invalid IDs |
| Risk | Parameter collisions with existing routes |
| Rollback | Drop the parameters; the story opens at `wa-00` |

Proposed URL: `/markets/western-australia?view=story&chapter=tensions&shot=wa-06`. It is not implemented. Chapter and shot changes add history entries; teaching changes do not. The market page's existing handoff carries the case to the Investment Lab, so the story needs no case envelope.

### WP-05: Retired in v1.1

The story shows no new financial figures. Its opening play card is an existing component, its `‹bound›` tokens read fields that the component and the market sections already read, and its investment detail is a set of links. Reopen this package only if a later story needs a figure the market page does not show. The v1.0 requirements (field-by-field reconciliation, dated payments, per-MW scaling) are in commit `db158b9`.

### WP-06: Build the isometric symbol kit and signature charts

| Field | Specification |
| --- | --- |
| Objective | One isometric SVG kit and one chart pattern that every market can reuse |
| Modules | Proposed `src/experience/story/kit/`: about 20 symbols as SVG builders, an isometric layout helper on a 2:1 projection, day, dusk and night colour tokens, and a chart helper on the existing D3 setup |
| Inputs -> outputs | Shot list and design sheets -> kit sheet, layout helper and signature-chart component |
| Dependencies | Design deliverables ([page design §9](experience-and-page-design.md#9-design-deliverables)); can run alongside WP-02 and WP-03 |
| Acceptance | Kit under about 60 KiB uncompressed and loaded only with a story; labels are text from the [en, zh] pairs the content passes in; works in both themes and under reduced motion; titles and roles for screen readers |
| Verification | Visual review at the four widths; the story-chunk budget test; an accessibility pass |
| Risk | Symbols that imply engineering precision; keep them generic and labelled |
| Rollback | Plain 2D diagrams with the same text |

### WP-07: Draw the WA scenes

| Field | Specification |
| --- | --- |
| Objective | Scenes for `wa-01` to `wa-11` and the `wa-06` signature chart, drawn from the kit |
| Modules | `src/markets/wa/story/scenes.js` with layouts and teaching presets, and `src/markets/wa/story/geo.js` for the `wa-01` map; every word comes from the shot's `labels` and `controls` in `src/markets/wa/story.js` |
| Inputs -> outputs | Signed-off script and the kit -> scenes wired into the shell |
| Dependencies | WP-06; `G-1` for final copy |
| Acceptance | Each scene answers its shot's question without interaction; teaching controls never touch case state; quantitative labels appear only once their gaps close (`GAP-WA-RCM`, `GAP-WA-DAY`) |
| Verification | The user's walkthrough against the comprehension check; mobile and keyboard passes |
| Risk | A handsome scene carrying a weak argument; the script is signed off first |
| Rollback | Replace any scene with its plain diagram |

### WP-08: Folded into WP-06 in v1.1

In-house SVG removes the licensing and GPU-budget work this package covered. Asset records stay in the [asset register](evidence-and-content-specification.md#asset-register), and the remaining budget checks are in §5.

### WP-09: Validate reuse with Germany and Finland

| Field | Specification |
| --- | --- |
| Objective | Show that the kit and shell carry two different arguments |
| Modules | Proposed `src/markets/de/story.js` and `src/markets/fi/story.js`; a DE-LU day-ahead registration in `src/governance/datasets.js` and the ETL (`GAP-DE-PRICES`); Finnish need and storage series (`GAP-FI-NEED`) |
| Inputs -> outputs | Signed-off German and Finnish scripts -> two stories and a reuse note separating configuration from new code |
| Dependencies | WP-10 for WA; the research can start earlier |
| Acceptance | From the stories alone, the user can explain the German toll play and the Finnish floor play; no congestion income; reserve prices never shown as energy spreads |
| Verification | The WA checks, repeated; `npm run etl:verify` after any registration |
| Risk | WA assumptions leaking into other markets |
| Rollback | Keep a market on the research dialog |

### WP-10: Assemble and validate the WA release

| Field | Specification |
| --- | --- |
| Objective | Ship the WA story through the existing controlled pipeline |
| Modules | The story, plus the existing checks and release process |
| Inputs -> outputs | Completed packages -> a PR with its candidate SHA, test record and screenshots |
| Dependencies | WP-02 to WP-07 and `G-1` |
| Acceptance | `G-2`: the existing full suite, build, confidentiality scan, budgets and e2e pass on the exact SHA; no fixture regenerated |
| Verification | CI on the PR; a built-public preview |
| Risk | A green run on a different commit; check the SHA |
| Rollback | Revert the button to the research dialog; the existing release rollback covers the rest |

### WP-11: Optional WebGL experiment (deferred)

Open this package only when a named shot fails to explain in SVG (`G-3`). It then needs:

- a pinned Three.js dependency in its own reviewed change, loaded lazily;
- at most one active scene, with idempotent teardown before `app.js` clears `#app`;
- generation checks, so a late load never attaches to a detached host;
- rendering on demand and explicit disposal of geometries, materials, textures and the renderer, following the Three.js guidance on [cleanup](https://threejs.org/manual/pages/cleanup.html) and [rendering on demand](https://threejs.org/manual/pages/rendering-on-demand.html);
- the budgets in §5.2, and a test of at least 100 mixed transitions that shows no growing canvas or resource count.

The SVG version remains the fallback.

## 4. SVG scene lifecycle

SVG scenes are ordinary DOM, so most of v1.0's GPU lifecycle disappears. These rules remain:

- Build each scene from content and teaching state, and update it by changing attributes and classes. No animation loop.
- Release observers, timers and document-level listeners when the story closes, and before `app.js` clears `#app` on a rerender.
- Load the story chunk lazily, once per session. When it arrives, check that its host is still connected, as the research button already does.
- Keep text in the DOM so that screen readers, translation and printing work.

## 5. Asset and performance budgets

### 5.1 Pilot (SVG)

These are proposed targets, not measurements. Record the device, browser, viewport and cache state with each measurement.

| Measure | Target | How to verify |
| --- | --- | --- |
| Entry and home JavaScript | Keep the 170 and 265 KiB gzip caps; home had about 2.5 KiB left at PR #69 | Existing budget tests; the story adds nothing to either |
| Experience chunk | Keep the 26 KiB cap | Existing budget test |
| Story chunk | At most about 40 KiB gzip for the shell, WA content and kit | Add to the budget test |
| Scene size | At most about 1,500 SVG nodes per scene | Count in a unit test |
| Interaction | INP at most 200 ms for any teaching control on a midrange phone | Lab measurement |
| Layout shift | CLS at most 0.1 while a scene fills in | Lab measurement |

The page-experience targets follow [Google Web Vitals](https://web.dev/articles/vitals). Lab results are not field data.

### 5.2 Deferred WebGL budgets (WP-11 only)

| Measure | Target |
| --- | --- |
| First-scene transfer | 2 MiB target and a 4 MiB hard limit, engine and assets included |
| Ready time | Operable within about 3 seconds at 10 Mbps and 100 ms latency |
| Geometry | About 60k triangles and 80 draw calls on mobile; 120k and 120 on desktop |
| Textures and pixel ratio | 1024 px on mobile and 2048 px on desktop; DPR caps of 1.5 and 2; no real-time shadows on mobile |
| GPU allocation | Planning caps of 64 MiB on mobile and 128 MiB on desktop |
| Frame time | p95 at most 33.3 ms on mobile and 16.7 ms on desktop while moving; idle when static |
| Scenes | One active canvas; at most two market packs cached |

## 6. Verification commands and release isolation

These are checks for later execution, not commands run for this pack.

| Command | Purpose |
| --- | --- |
| `npm ci` | Recreate dependencies from the lockfile on the pinned runtime; never copy `node_modules` between machines |
| `npm run test:current` | Check current financial outputs; never substitute `test:baseline`, which regenerates a fixture |
| `npm test` | Model, governance, unit and structural checks; report skips |
| `npm run build` | Build the candidate on the exact SHA |
| `npm run test:bundle` | Scan the built output for confidential markers; a skip is not a pass |
| `npm run test:budget` | Enforce bundle budgets, including the new story chunk |
| `npm run test:e2e` | Desktop, mobile and bilingual browser checks, extended for the story |
| `npm run etl:verify` | Check snapshot integrity after any dataset registration |
| `npm run guard:staged` | The pre-commit marker scan; run it once on a new machine to confirm the hook works |

At release, the scanned artefact, candidate SHA and data vintages must match. This plan adds no deploy trigger and no bypass.
