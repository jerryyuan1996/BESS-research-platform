# Fifteen-market public Overview and narrative edition

Implementation baseline: `c0229820ff609e38f45b259c3abf9a948aaee51c` (latest `origin/main` when this isolated worktree was created). Date-accuracy patch baseline: `966ce1af673590620518bfae5ee163621eab3369` (#171 already merged and published). Public edition: `2026-11-06.2`.

Jerry selected the narrower first delivery: “A 先把15个市场已有的脚本做成所有投资人共用的新版本”. The authorised implementation and normal PR/CI/merge flow therefore cover **15 markets**, with reorganised or new public interpretations explicitly pending content confirmation. This does not create a new content sign-off.

| Market | ID | This delivery | Original Story state |
|---|---|---|---|
| Western Australia | wa | Public summary, six chapters, local mechanism SVG | Existing G-2 entry retained |
| NEM | nem | Public summary, six chapters, local mechanism SVG; visual pilot | Existing scoped G-2 entry retained |
| Great Britain | gb | Public summary, six chapters, local mechanism SVG | Existing G-2 entry retained |
| Germany | de | Public summary, six chapters, local mechanism SVG | Existing G-2 entry retained |
| Italy | it | Public summary, six chapters, local mechanism SVG | Existing scoped route choices retained |
| Ireland | ie | Public summary, six chapters, local mechanism SVG | Existing G-2 entry retained |
| Romania | ro | Public summary, six chapters, local mechanism SVG | Existing G-2 entry retained |
| Poland | pl | Public summary, six chapters, local mechanism SVG | Existing scoped cohorts retained |
| Japan Tokyo / Kanto | jp_tokyo | Shared national background, independent regional context / evidence / URLs | Original lens, route and operating-stage checks retained |
| Japan Kyushu | jp_kyushu | Shared national background, independent regional context / evidence / URLs | Original lens, route and operating-stage checks retained |
| Japan Hokkaido | jp_hokkaido | Shared national background, independent regional context / evidence / URLs | Original lens, route and operating-stage checks retained |
| PJM | pjm | Public summary, six chapters, local mechanism SVG | Existing G-2 entry retained |
| ERCOT | ercot | New public entry from G-1 script / fixed evidence; no new quantitative chart | Original G-2 remains unreleased |
| CAISO | caiso | Public summary, six chapters, local mechanism SVG | Existing G-2 entry retained |
| Finland | fi | Public summary, six chapters, local mechanism SVG | Existing G-2 entry retained |
| Ontario | ca_on | **Outside this delivery; existing functionality retained** | Public content gap remains |
| Saudi Arabia | sa | **Outside this delivery; existing functionality retained** | Public content gap remains |
| Spain | es | **Outside this delivery; existing functionality retained** | Public content gap remains |

## Content boundary

All fifteen public editions are `pending-public-review`. A dated source-script review is distinct from public editorial approval. Verbatim, token-free excerpts retain their questions, claim IDs and original source provenance. New summaries, mechanisms, conditions, timelines and diagrams are public-review drafts. No original G-1/G-2 record is changed, no investor-specific financial conclusion is promoted to a public approval, and no model/financial/dataset/fixture input is changed.

External primary evidence and internal research/model links are separate. Japan's internal links resolve the actual regional slug; no `{areaSlug}` link is rendered. Original rights and withholding gates remain in the research modules. ERCOT's gated price charts are not recreated. Diagrams are original qualitative schematics, with no vendor specifications, simulated dispatch or observed quantitative curves.

See [the bilingual content review](content-review.md) for each market's draft, original approval scope and source register. Remaining confirmation: Jerry's new public-content review for all fifteen editions. The authorised engineering delivery can merge while these interpretations remain visibly pending.

## Implementation

`marketPage.js` places a lightweight public summary before decisions, strategy choices and financial cards in both DOM and visual reading order. It also removes the previous financial-card relocation for these fifteen markets. The three other markets retain their previous path.

The public registry has a separate scope from the original `STORIES` release flags. Overview/card data, modal shell, market content, chapter renderer and SVG scene load across separate dynamic boundaries. Successful content promises are cached; rejected content promises are evicted. A failed module can be retried by reloading the same versioned chapter URL, with readable summary/research fallbacks. A later `checkedOn` is a later source check; it does not establish changed content or approval. Missing check dates remain unknown. The [fifteen-market date audit](approval-date-audit.md) distinguishes original G-1, supplementary content approvals, original scoped G-2, content-module versions and binding-anchor dates.

The native modal retains the existing story-place router and its three whitelisted parameters. Public shot IDs encode locale and edition, e.g. `?view=story&chapter=storage&shot=public-zh-2026-11-06-2-storage`. Market/region is the pathname. Old shot IDs and original scoped-story/research entrances remain valid. Japan's region selector carries the chapter, locale and edition to the selected regional path.

The shared SVG uses the existing 2:1 projection and symbol vocabulary, with a new cutaway battery, rack modules, cooling details, PCS cabinets, transformer fins and bushings, protected busbar, metering, cable routes and energy-flow arrows. Each market configures local constraints and payment causality. Scene steps, equipment focus and charging direction use keyboard/touch controls; annotations also exist as readable HTML. Small screens can pan the scene. Reduced-motion reading requires no animation.

## Verification and evidence

The browser matrix covers every scoped market, all four investor entries, both languages, desktop, iPad and phone. Interaction checks include native keyboard access, touch annotations, scroll/focus restoration, repeated opening, Back/Forward, regional switching, versioned chapter URLs, loading failures/retry and reduced motion. Original scoped Story tests remain in the full regression suite.

An early cache diagnostic identified Chromium's automatic `/favicon.ico` lookup on History-API chapter navigation, rather than an extra content or SVG module. The document now declares an original inline SVG icon, avoiding that fallback HTTP lookup. The cache check retains its zero-additional-resource assertion and records repeated URLs as a multiset, so a same-URL repeat cannot disappear from the diagnostic.

`scripts/public-story-diagnostics.mjs` serves only a production build, writes screenshots and Performance API records, and checks first-screen button bounds. The cached-transition check settles unrelated initial-page requests, then still requires **zero additional resources of any kind**. It records the intervening background completions and the complete cached-transition resource delta; no budget or zero-request assertion is relaxed.

The baseline is a separate preserved build. Baseline browser measurements use the old research/Story trigger; new measurements use the public summary/Story trigger. They measure reader-visible readiness, not a synthetic claim that all route resources completed. Raw body bytes and gzip chunk bytes are separately labelled. See [acceptance](acceptance.md), [performance](performance.md), and [release notes](release-notes.md) for final results.

## Reproducing

Use the locked dependencies and repository confidentiality setup. `node scripts/author-public-stories.mjs` is a deliberate text migration from the signed scripts, not ETL or fixture generation. It scans authored output before writing and never imports investor pricing bindings. Review content diffs after running it.

Run the normal `npm test`, `npm run test:current`, `npm run build`, `npm run test:budget`, and `npm run test:e2e` gates, plus the staged and exact-built-output confidentiality scans. `npm run etl:verify` is also recorded as an extra integrity check even though no dataset changes are intended. Never share a dev server or deploy around the existing GitHub Actions publication pipeline.
