# Engineering Work Packages

Pack: BESS-IX-2026-10-30, version 1.0  
Status: implementation proposal; no application, dependency, model, CI or deployment changes made  
Navigation: [Master plan](README.md) | [Content contract](evidence-and-content-specification.md#5-proposed-story-content-contract) | [Page design](experience-and-page-design.md) | [Preparation and acceptance](preparation-migration-and-acceptance.md)

## 1. Verified repository baseline

The final local and remote `main` baseline was `6ce1e035cace6e676167f904d511a3425a5be12d` on 30 October 2026, including #72, #73 and the first Finland reserve snapshots. Application/model modules inspected after #72 were unchanged by the intervening ETL workflow/data updates; the #73 workflow delta and snapshot metadata were also checked. The working tree was clean before this pack was added. No applicable `AGENTS.md` was found in the inspected ancestors or repository inventory. Preserve unrelated work if the checkout changes during a later task; never reset or clean it to reproduce this snapshot.

| Concern | Actual current location / behavior | Planning consequence |
| --- | --- | --- |
| App architecture | [package.json](../../package.json), [Vite configuration](../../vite.config.js), native ESM/DOM/SVG | Add a bounded lazy renderer; no framework migration, backend or global rewrite required |
| Dependencies | Vite declared `^7.3.6`; Playwright `1.64.1`; lockfile present; no React/Three.js declared | Select and lock any future 3D dependency in its own reviewed change; do not install it for documentation |
| Runtime | Local `node --version` returned `v26.2.0`; npm `11.13.0`; package engine range accepts `^20.19.0` or `>=22.12.0`; CI names Node `20` | Local, declared and CI environments are different. An engines range is not a reproducibility record or supported-runtime policy |
| Registry and routes | [registry.js](../../src/markets/registry.js), [router.js](../../src/app/router.js) | Use canonical IDs/slugs; preserve Japan regional allocation identity, `region`, existing tab/subsection paths and comparison behavior |
| Current experience | [pages.js](../../src/experience/pages.js), [model.js](../../src/experience/model.js), [researchDialog.js](../../src/experience/researchDialog.js) | Reuse entry, labels and research access; do not create a second independently priced story page |
| Financial outputs | [investment.js](../../src/opportunities/investment.js), [model.js](../../src/opportunities/model.js), [monthlyCash.js](../../src/opportunities/monthlyCash.js), [monthlyCashUI.js](../../src/opportunities/monthlyCashUI.js) | Acquisition/hold/sale/debt and monthly displays already exist; discover exact caller conventions before binding new labels |
| Other numeric paths | [comparison engine](../../src/comparison/engine.js), [saved-case records](../../src/comparison/caseRecord.js), [Lab](../../src/home/investmentLab.js) | Existing comparison-case replay is not automatically a complete saved acquisition/opportunity case. Adapter and persistence coverage must be tested |
| Downside and project constraints | [downside narrative](../../src/experience/downsideNarrative.js), [downside history](../../src/experience/downsideHistory.js), [stack feasibility](../../src/economics/revenueStackFeasibility.js) | Reuse defined stresses and unknown states; no new probability model or invented stack feasibility |
| Renderer replacement | [app.js](../../src/app/app.js) calls `invalidateMarketRender()` and clears `#app` with `innerHTML`; lazy paths already use tokens | Destroy a scene before its DOM host is removed; extend lifecycle narrowly instead of refactoring every route |
| Global preferences | [state.js](../../src/app/state.js) owns language/theme/investor and rerender hook | Chapter/teaching/case state needs bounded ownership; do not expand global state with every market's scene internals |
| Globe and style | [marketGlobe.js](../../src/home/marketGlobe.js) uses D3 orthographic SVG; [tokens.css](../../src/styles/tokens.css) contains research/editorial tokens | Retain useful SVG/list fallback and existing style; WebGL is a new optional capability |
| Data feed #72 and snapshot fix #73 | [datasets.js](../../src/governance/datasets.js), [fingrid.mjs](../../etl/sources/fingrid.mjs), [ETL workflow](../../.github/workflows/etl.yml), [live-data guide](../live-data.md) | Seven stored reserve-capacity price snapshots, separate Finland day-ahead path, product-aware drift handling and first-snapshot commit detection. Verify production freshness and capture interpretation separately |
| Publication | [ci.yml](../../.github/workflows/ci.yml), [vercel.json](../../vercel.json), [publishing guide](../publishing.md), [production release library](../../scripts/lib/production-release.mjs) | PR tests do not create an assumed automatic preview; preserve controlled, scanned main publication and its release/rollback records |
| Existing checks | [bundle budgets](../../tests/bundle-budget.test.js), [Playwright config](../../playwright.config.js), [e2e suite](../../e2e/platform.spec.js) | Existing entry/home budgets and desktop/mobile bilingual checks remain gates; new story checks supplement them |

Exact remote references and the bounded CI observation are in [the source register](source-register.md#repository-verification). This task inspected source and metadata; it did not run application tests, build the site or assert live performance/production success.

## 2. Execution principles and dependency order

All packages below are **NOT STARTED** unless their output is explicitly identified as this Markdown pack. They become executable in a later authorized implementation task. Preparing a design is not permission to change a model, publish, or alter CI/Vercel today.

```text
WP-00 Baseline
  -> WP-01 Runtime and isolated preview
  -> WP-02 Content contract and evidence references
WP-02 -> WP-03 Runnable 2D story -> WP-04 Navigation/state
WP-03 + WP-04 -> WP-05 Existing-model adapters
WP-03 + WP-04 + preview -> WP-06 Scene host
WP-06 + reviewed WA script -> WP-07 Greybox scenes
WP-06 + WP-07 -> WP-08 Assets and measured budgets
WA evidence + WP-03..08 gates -> WP-09 Germany/Finland reuse
WP-00..08 + acceptance evidence -> WP-10 WA release candidate
WP-09 -> later Italy route validation and expansion candidates
```

Runtime evaluation and content preparation can proceed independently. A Node migration need not block text/diagram design. A 2D vertical slice and simple host experiment need not wait for the new computer if the current device can run them. Final visual quality and device-performance claims require the designated hardware matrix, not a processor-name assumption.

Prefer small changes with a demonstrable output per package. Avoid a framework migration, global store rewrite, model consolidation project, new CMS, arbitrary-node simulation or broad dependency refresh. Keep model changes in a separately justified workstream. Never regenerate `tests/fixtures/legacy-baseline.json` merely to make a visual change pass.

## 3. Work packages

### WP-00: Record a trustworthy baseline

| Field | Execution specification |
| --- | --- |
| Objective | Know what source, numbers, data vintages, layouts and test results the story must preserve. |
| Modules | Git status/history; package/lock/config files; existing investment/model tests; representative home/market/Lab/monthly/downside views; no application edits. |
| Inputs -> outputs | Current checkout and public fixtures -> dated baseline manifest, lockfile hash, environment record, representative result export, screenshots, test outcomes and pre-existing issues. |
| Dependencies | None; re-read applicable rules and user changes at execution time. |
| Acceptance | Record branch/SHA, clean or dirty state without discarding work, Node/npm/browser/OS, data vintages, supported case definitions and selected devices. Include a WA case, DE/FI checks, a withheld case and a saved-case replay. |
| Verification | Run applicable existing model/current-result, page-consistency and cash-flow checks; create a built-public preview and compare representative raw results and labels. Record skips/failures honestly. |
| Risk | A pre-existing issue can be mistaken for a visual regression; moving ETL data can masquerade as a code difference. Freeze input vintages for the comparison. |
| Rollback | No production change. Retain baseline evidence and stop numeric integration if the starting result cannot be explained. |

### WP-01: Validate runtime and isolate preview

| Field | Execution specification |
| --- | --- |
| Objective | Provide a reproducible local review environment and a separately controlled optional remote preview. |
| Modules | `package.json`, lockfile, Vite/Playwright configuration and existing CI/publishing documentation; runtime/CI edits only in a separately scoped future maintenance change. |
| Inputs -> outputs | WP-00 environment and official runtime support -> exact tested Node/npm/browser versions, clean-install procedure, local preview recipe and remote-preview decision record. |
| Dependencies | WP-00; credentials are not required to review a local built-public site. |
| Acceptance | Test a supported LTS candidate against the unchanged lockfile. Node 24 is a conservative candidate; Node 26 is also LTS on the check date. Pin the selected exact version after tests; reconcile local/CI/hosting runtime through a separate reviewed change. |
| Verification | On a clean future checkout, run locked installation, existing tests, build and browser checks. Report old-versus-candidate behavior. Do not combine a runtime change with scene or model changes. |
| Risk | CI's current Node 20 is EOL according to the checked official release table; an untested runtime/dependency upgrade could change behavior. A shared dev server can expose local confidential content. |
| Rollback | Revert only the isolated runtime/configuration change if it regresses behavior; retain content planning and 2D work. Use the tested local public build when remote preview is unavailable. |

Preview policy: `npm run dev` is an individual development tool and may load the repository's local confidential layer. The review baseline is a **built, scanned public-output preview** on loopback using the existing build/preview commands. Do not expose the dev server publicly. If remote review is needed later, use a separate preview project/environment or an explicitly isolated preview deployment with public inputs, exact artifact scanning, correct rewrites, identifiable SHA and no production alias/promotion. Establish it as a concrete scoped task; do not assume a PR creates it. Do not reuse a production-publishing script as an improvised preview uploader or copy production credentials into frontend configuration.

### WP-02: Establish the story content and evidence contract

| Field | Execution specification |
| --- | --- |
| Objective | Make reviewed content usable by text, diagrams and scenes without duplicating facts or calculations. |
| Modules | Proposed `src/experience/story/` schema/validation; proposed `src/markets/wa/story.js`; existing registry/governance/source references; later equivalent DE/FI content modules. |
| Inputs -> outputs | Narrative cards, WA shots and evidence registers -> validated six-chapter content, stable IDs, source/claim/asset references, locale readiness and explicit unavailable states. |
| Dependencies | WP-00; central WA claims and scope selected. |
| Acceptance | Required fields in the content specification resolve; future/observed types differ; every shot has an equivalent diagram/text path; no private material, financial literals or renderer imports in public editorial content. |
| Verification | Meaningful validation cases cover missing claim/asset references, duplicate IDs, omitted fallback, unreviewed quantitative label, stale evidence and unsupported locale. Validate one complete WA configuration plus incomplete DE/FI drafts. |
| Risk | A permissive schema can mark a polished but unsupported story ready; a rigid WA-only schema can flatten other markets. |
| Rollback | Keep draft registers as Markdown and render the existing research/summary page if content validation fails. Do not publish an incomplete story as complete. |

### WP-03: Build a runnable 2D WA story

| Field | Execution specification |
| --- | --- |
| Objective | Let an investor complete all six chapters and reach the existing investment tools before adding WebGL. |
| Modules | Proposed `src/experience/story/` shell and diagram components; `src/experience/pages.js`, research dialog/chrome, scoped story styles and shared explanation components. |
| Inputs -> outputs | WP-02 content and annotated desktop/mobile layouts -> runnable public 2D story, evidence links and investment-summary access. |
| Dependencies | WP-02; local preview from WP-01 or the existing compatible development environment. |
| Acceptance | All 14 shots have usable text/diagram form, question/meaning/boundary and accessible controls; no invented numeric chart fills a data gap; existing direct investment entry remains. |
| Verification | Complete the WA user tasks with graphics disabled and keyboard only; review both languages, mobile stacking and source-return behavior. Run relevant existing route/page tests. |
| Risk | Overbuilding a generic scene framework before testing the explanation; a diagram can still imply false precision. |
| Rollback | Disable only the story entry/mode and retain existing market summary/research routes. Keep approved content independent of the UI implementation. |

### WP-04: Route, navigation and state restoration

| Field | Execution specification |
| --- | --- |
| Objective | Make chapter links, sharing, Back/Forward, evidence return, language changes and Lab handoff reliable. |
| Modules | `src/app/router.js`, `src/app/state.js` at narrow integration points; story state owner; existing market region/tab routing and Lab case persistence. |
| Inputs -> outputs | Existing route behavior + content IDs -> versioned URL/state policy, explicit case envelope and navigation tests. |
| Dependencies | WP-03; compare current persisted-case capabilities before choosing the serialization format. |
| Acceptance | Refresh/direct entry/share/Back restore a valid chapter and public case context; stale or incompatible fields are visible; language/theme/investor rerenders do not reset semantic position or leave a scene attached. |
| Verification | Open a shared link in a fresh browser; repeat Back/Forward, locale/investor/market switches, invalid IDs, obsolete schema, missing case and evidence open/close. Inspect both UI context and resulting financial case identity. |
| Risk | A browser-local ID can look shareable while failing elsewhere; query parameters may collide or leak user/private overrides. |
| Rollback | Fall back to a valid market summary and labelled current case; preserve legacy routes and saved records. Revert only new state handlers. |

Proposed chapter URL: `/markets/western-australia?view=story&chapter=tensions&shot=wa-05`. This syntax is **not currently implemented**. Extend the parser with whitelisted story fields while preserving the existing `region` and route/tab/subsection behavior. Chapter/shot changes use History API entries where Back should retrace reading; high-frequency camera/SOC teaching changes stay local and do not flood history. Invalid shots fall back within the requested valid chapter with a clear state, not a broken page.

| State owner | Contents and transfer rules |
| --- | --- |
| Global existing preferences | Language, theme and investor perspective; retain current preference behavior |
| Story reading state | Market/chapter/shot, origin anchor, evidence trigger and selected teaching preset; restore semantically across layout/language changes |
| Teaching state | Era/daylight/battery/hotspot; local and resettable; no authoritative financial mutation |
| Current investment case | Versioned market/allocation, investor, route, duration, stage, scale, currency/FX, supported overrides, entry price/target, financing conventions, model/data vintage and project-evidence status |
| Public share context | Whitelisted public input IDs/values plus expected version/vintage; validate in a fresh browser. Do not put private project evidence or identifiers in a URL. |
| Frozen case transport | Use/extend a versioned saved-case file only after replay coverage is verified for the selected result path. A local storage ID alone cannot reproduce a case on another device. |

A shared chapter URL may open a **current-data** case. If its expected vintage differs, disclose the change and offer the recorded case where available. Do not claim a link freezes results unless the inputs and model needed for replay are actually preserved. Existing comparison-case records must remain readable; a new acquisition-result envelope requires explicit versioning and compatibility tests. Closing evidence or returning from research restores focus and the originating shot. Entering a new market must validate transferable fields rather than carrying incompatible contractual rights.

### WP-05: Bind existing investment results and reconcile numbers

| Field | Execution specification |
| --- | --- |
| Objective | Present one defined case consistently across story, summary, comparison, Lab, cash flow and export without changing economics. |
| Modules | `src/experience/model.js`; `src/opportunities/investment.js`, `model.js`, `monthlyCash.js`, `monthlyCashUI.js`; relevant acquisition/comparison adapters, Lab and case records; existing downside modules. |
| Inputs -> outputs | Case envelope + actual existing result paths -> thin read-only story adapter, field-definition map, unavailable states and reconciliation report. |
| Dependencies | WP-03/04; WP-00 frozen inputs and approved financial label definitions. |
| Acceptance | Same supported input case yields the same raw fields and formatted financial meaning in all views. Unsupported fields stay absent/labelled. No new financial formula, stacking assumption or silent price/clock/FX change. |
| Verification | Use WA baseline/downside, changed duration/entry stage where supported, DE/FI cases, an unpriced market and a saved-case round trip. Compare dated flows, total/peak equity, qualification timing, hold/sale/levered returns, coverage period, FX and debt maturity contributions. |
| Risk | The existing legacy comparison path and newer acquisition/opportunity path have different conventions; a thin adapter cannot simply declare them identical. Scaling per-MW cash twice or smoothing months can misstate cash. |
| Rollback | Remove the story financial binding and link to the existing authoritative financial view. Open a separate model-consistency issue rather than rewriting formulas or regenerating fixtures in the visual branch. |

| Display area | Binding and interpretation check |
| --- | --- |
| Headline return | Retain the current all-equity hold headline and separately labelled sale/lower-of and levered metrics as appropriate to the existing view. Do not substitute an operating-years comparison result. |
| Revenue bridge | Respect the selected adapter's definitions. In `src/experience/model.js`, trading already includes ancillary services and `svcY` is a service cost; it is not another revenue line. |
| Newer investment metrics | `referenceInvestment`, `evaluateInvestment` and `investmentMetrics` expose existing acquisition-stage results; reuse the actual supported fields, costs/tax and conventions. Do not infer extra detail from an aggregated bridge. |
| Timing | Distinguish modeled COD months, qualification months and dated receipts; actual contractual first settlement may still require evidence. |
| Monthly chart | Preserve original dated payments through `monthlyCashSeries`; check whether inputs are per MW before applying power scaling once. No new monthly seasonality. |
| Downside and debt | Reuse defined downside and the chosen financing conventions; do not resize the original debt in a stress merely to hide a funding gap. Preserve modeled maturity equity requirements. |
| Evidence and tenure | Model-fixed/renewal/merchant fields are financial categories, not proof of signed coverage. Display project evidence and expiry/tail separately. |

Raw deterministic fields should match their originating adapter for identical frozen inputs. Where floating-point or formatting comparisons need tolerance, define and justify it by field; never use a broad percentage tolerance to hide a changed result. Existing model fixtures are verification inputs. The `test:baseline` script regenerates a fixture and is not a regression check.

### WP-06: Add a bounded optional 3D host

| Field | Execution specification |
| --- | --- |
| Objective | Make scene mount/update/pause/destroy safe under the application's full rerender model. |
| Modules | Proposed `src/experience/scenes/` host, resource owner and loader; narrow teardown integration before `app.js` clears the container; story visual wrapper. |
| Inputs -> outputs | WP-03/04 reading/teaching state + pinned future Three.js experiment -> lazy host API, failure/diagram path and lifecycle diagnostics/tests. |
| Dependencies | Working 2D equivalent and state contract; no polished assets required. |
| Acceptance | At most one active scene; idempotent teardown; obsolete async completion cannot attach; no continuing animation/listener/observer after exit; failure leaves story and investment paths usable. |
| Verification | Simulate slow/failed loads, rapid market/locale/investor changes, route exit during decode, double destroy, hidden/offscreen page, resize and context loss. Observe canvas/loop/resource counts. |
| Risk | A detached host receives late data; shared materials are freed while still in use; an animation loop survives DOM removal. |
| Rollback | Disable lazy scene enhancement and use the existing text/diagram path. Do not make the whole market experience depend on renderer initialization. |

### WP-07: Produce WA greybox scenes

| Field | Execution specification |
| --- | --- |
| Objective | Test whether spatial explanation improves the first useful learning loop. |
| Modules | Proposed shared grid-history, day/night, add-battery renderers; WA configuration; shared station cutaway begins as a simple diagram/geometry set. |
| Inputs -> outputs | Reviewed shot intent and WP-06 host -> simple, low-cost scenes for history, today's tension and battery limits; matched 2D diagrams. |
| Dependencies | WP-06; sufficient evidence for the selected qualitative/quantitative labels; no new-computer requirement for a small experiment. |
| Acceptance | User can explain cause, service and limit without coaching; 3D does not add unsupported precision or change financial assumptions. |
| Verification | First novice-investor task round; compare misunderstanding with the diagram version; run mobile/fallback and lifecycle checks before material polish. |
| Risk | Attractive motion hides a weak causal argument or extra cognitive load. |
| Rollback | Keep the better diagram/shortened script and remove an unhelpful scene; reuse only approved components. |

### WP-08: Clear assets and enforce measured budgets

| Field | Execution specification |
| --- | --- |
| Objective | Obtain a coherent visual kit with reviewable rights, transfer, decoding and runtime costs. |
| Modules | Proposed `public/experience/` public asset directory and asset manifest; lazy scene/decoder chunks; existing bundle-budget checks plus separate scene measurement. |
| Inputs -> outputs | Greybox needs, asset register and target devices -> licensed/shared asset kit, posters/SVG alternatives, compressed versions and measured budget report. |
| Dependencies | WP-06/07; begin rights/style preparation earlier, polish and device measurements after migration. |
| Acceptance | Every shipped asset has permitted public use and attribution; all engine/decoder/model/texture costs counted; scene assets do not become eager home imports. |
| Verification | Clean network-cache transfer capture, import-graph/bundle check, decode/first-interaction timing, frame-time and resource inventory on designated devices. Review rights and geometry precision. |
| Risk | Small downloads decode into large GPU memory; an attribution-only public link is mistaken for redistribution permission. |
| Rollback | Replace with simpler procedural geometry/poster/SVG, smaller textures or diagram mode; withhold rights-uncertain assets. |

### WP-09: Validate reuse with Germany and Finland

| Field | Execution specification |
| --- | --- |
| Objective | Prove the shared system supports distinct causal and commercial stories. |
| Modules | Shared story/scene/diagram components; proposed DE/FI story modules; existing local research, reserve/price evidence and result adapters. |
| Inputs -> outputs | Reviewed DE/FI scripts and successful WA gates -> two distinct story implementations and an actual reuse-effort report. |
| Dependencies | WA learning loop, model/state integration and bounded host. Detailed research can run earlier. |
| Acceptance | Germany explains spatial congestion without invented congestion income; Finland explains product eligibility/competition without treating reserve prices as energy spreads. Each has an independent value-weakening conclusion. |
| Verification | Repeat core understanding, numeric, fallback, bilingual and stability tasks; inspect configuration versus special-purpose code and record unavoidable additions. |
| Risk | WA-specific assumptions leak into all markets or a generic renderer dictates the explanation. |
| Rollback | Keep unsupported markets on 2D/research; add only a clearly scoped local explanation instead of rewriting the whole platform. |

### WP-10: Assemble and validate the release candidate

| Field | Execution specification |
| --- | --- |
| Objective | Produce a concrete reviewable WA candidate with evidence of preserved finance and usable fallback. |
| Modules | Story plus existing app; unit/model/governance/browser/budget/confidentiality checks; existing release verification and rollback process. |
| Inputs -> outputs | Completed applicable work packages -> candidate SHA/artifact, acceptance report, screenshots, outstanding limitations and known-good rollback record. |
| Dependencies | WA evidence and technical/understanding gates; Germany/Finland reuse may follow WA release, but global expansion cannot claim their validation early. |
| Acceptance | The gate matrix passes or explicitly withholds the affected feature; no critical misreading or numeric regression; full direct investment path remains usable. |
| Verification | Existing full tests, build, exact-output confidentiality scan, budgets, browser suite, ETL integrity plus story-specific tests and real-device evidence. Preview and candidate source/vintage must match. |
| Risk | A green test run on a different commit, missing scan output, skipped secret-backed guard or wrong production alias gives false assurance. |
| Rollback | Use the existing recorded known-good release/artifact and feature disable path. Never overwrite model baselines to force green. Production publication remains a later explicitly scoped action through the existing pipeline. |

## 4. Scene lifecycle and asynchronous ownership

The proposed API has `mount`, `update`, `pause`, `resume` and idempotent `destroy` responsibilities. It may be implemented as an object rather than those exact public function names. Keep the contract stable and renderer details private.

| Transition | Required behavior |
| --- | --- |
| Idle -> loading | Show poster/diagram; create host generation ID and cancellation scope; request only the chosen renderer/assets |
| Loading -> ready | Before attaching, check generation, route/scene identity, connected host and destroyed status. Dispose an obsolete result even when a loader could not be aborted |
| Ready -> update | Apply current teaching state; schedule one frame for static changes; do not restart the entire host for a text-label change where unnecessary |
| Ready -> paused | Cancel continuous animation when hidden/offscreen or paused; retain readable DOM and semantic state |
| Paused -> ready | Revalidate host generation and render the current state, without advancing chapters or replaying missed time |
| Any -> failed | Catch initialization/load/decode/context errors, report a simple diagram path and bounded retry; no unhandled promise or infinite recovery loop |
| Any -> destroyed | Mark destroyed first; invalidate generation; cancel/ignore pending work; stop frame/timers; remove listeners/observers; dispose owned resources; remove canvas/references |

Use cancellation where supported and generation checks everywhere. Dynamic imports or some decode operations may complete after cancellation; their results still require stale-generation disposal. Teardown must run **before** `#app` is cleared and on page/mode replacement, including language/investor rerenders. Existing lazy-render tokens provide a useful pattern but do not release new GPU resources by themselves.

Track ownership for geometries, materials, textures, render targets, controls, renderer/context, workers/decoders, image bitmaps, observers and event handlers. A per-host resource cannot be disposed by another host. Shared resources use explicit reference ownership and a bounded cache with eviction; avoid both double disposal and indefinite market caching. Do not retain GPU allocations for every visited market. Resource counts must return to the defined warm baseline after disposal.

Render on demand for static explanatory scenes, using a single scheduled frame for multiple changes. A continuous loop exists only during a visible requested animation. These responsibilities follow the official [cleanup](https://threejs.org/manual/pages/cleanup.html) and [on-demand rendering](https://threejs.org/manual/pages/rendering-on-demand.html) guidance; the host's tests must demonstrate them in this application.

## 5. Asset and performance budgets

These are **proposed targets**, not measurements. Record the exact device, browser, viewport, power mode, thermal state, network/latency, cache state and selected story for every measurement. Test realistic baseline devices as well as the new computer.

| Measure | Proposed budget / target | How to verify |
| --- | --- | --- |
| Existing entry/home JS | Preserve existing caps: 170 / 265 KiB gzip as implemented by bytes/1024; keep current other market/shared/feature budgets | Existing built-output budget tests; do not silently raise caps for 3D |
| Lazy boundary | No engine, scene, decoder, market asset or scene-only CSS in normal home first-load closure | Import graph and network capture before scene request |
| First-market scene transfer | Target <=2 MiB incremental transfer including engine/decoder/model/texture requests; any proposal above target needs a measured design tradeoff and remains <=4 MiB for the first pilot budget | Cold scene request, report all transferred bytes; distinguish compressed transfer from decoded size |
| Requested-scene readiness | Target an operable simple scene within about 3 seconds at 10 Mbps and 100 ms latency, cold scene cache | Click-to-ready measurement; diagram/text stays usable throughout |
| Geometry / draw calls | Initial caps: roughly 60k visible triangles / 80 draw calls mobile; 120k / 120 desktop | Renderer instrumentation; relax only with measured benefit and device evidence |
| Textures / pixel ratio | Mobile textures normally <=1024 px, desktop <=2048 px; initial DPR caps 1.5 mobile / 2 desktop; no mobile real-time shadows or post-processing in the baseline | Asset manifest, decoded estimates and actual rendered resolution |
| Estimated GPU asset allocation | Initial planning caps 64 MiB mobile / 128 MiB desktop, including textures and targets | Resource inventory and estimates; browser portability limits mean this is not a claimed direct VRAM reading |
| Frame timing | During motion, target p95 frame time <=33.3 ms mobile and <=16.7 ms designated desktop in a defined run | Capture frame-time distribution, dropped frames and thermal behavior; static scenes should idle |
| Active scenes | <=1 active 3D canvas/animation owner; background/offscreen paused | Host counters and lifecycle tests |
| Cache | Small bounded CPU cache, initially no more than two market asset packs; inactive GPU resources released under ownership policy | Inventory before/after repeated market switches; track retained bytes |
| Page experience | Target LCP <=2.5 s, INP <=200 ms, CLS <=0.1, with field p75 segmented mobile/desktop after release | Lab regression before release, then real-user evidence when sufficient traffic exists |

The page-experience targets and lab/field distinction follow [Google Web Vitals](https://web.dev/articles/vitals). Do not substitute a Lighthouse proxy for measured field INP or claim field compliance with insufficient traffic. Scene transfer, decode, frame time, GPU-resource estimates and thermal behavior need their own measurements; gzip JS budgets do not cover them.

Quality tiers should move from simple diagram/poster to low-detail scene to optional higher-detail scene. Use capability/preferences and sustained performance evidence, not an assumed high-end GPU based on the CPU brand. A slow or failed scene must preserve the same text, evidence, case and investment route. Keep retry optional and avoid repeatedly forcing a device back into an unsuitable mode.

## 6. Verification commands and release isolation

The following are **future execution checks**, not commands run for this documentation delivery:

| Existing command/check | Purpose and qualification |
| --- | --- |
| `npm ci` | Recreate dependencies from the committed lockfile on the selected runtime; never migrate `node_modules` as the reproducibility mechanism |
| `npm run test:current` | Verify existing frozen/current financial outputs; do not substitute `test:baseline` |
| `npm test` | Existing broad model, governance, unit and structural checks; report skips and required guard configuration |
| `npm run build` | Generate the public candidate artifact on the exact recorded SHA |
| `npm run test:bundle` | Scan the actual built output using required output/marker/fingerprint settings from the current workflow; a skip is not a successful public-artifact scan |
| `npm run test:budget` | Enforce current split/bundle budgets on the built output |
| `npm run test:e2e` | Existing desktop/mobile/bilingual/case browser coverage; extend with meaningful story-state/fallback cases |
| `npm run etl:verify` | Verify existing observed-snapshot integrity; do not regenerate snapshots for a visual change |
| Story-specific harness | Late-load races, teardown, context loss, no-graphics/reduced-motion, case reconciliation, sharing and long switching tests |

Follow the current workflow's exact requirements when executed; this table is not a replacement CI configuration. Review local confidentiality-test skips honestly and use the approved configured environment for a definitive artifact scan without printing secrets. For final publication, the exact scanned artifact, candidate SHA, data vintages, preview evidence and rollback target must correspond. Retain the existing controlled production mechanism; this document adds no deploy trigger or bypass.
