# PJM story reuse report

Authority: `pjm-build-evidence.md`, including the corrected indicative-source vintage binding. The story is unreleased. This report describes the implementation stack. G-2 approval remains separate.

## Reused infrastructure

The existing research button, lazy story registry, shared shell, navigator, content contract, evidence marker, localisation, history/focus handling, SVG factory, isometric symbols and toggle controls are reused. No kit, shell, navigator, marker or contract file is changed. Market-local teaching controls read existing evidence and model results; they do not invoke the engine or write the investment case.

## Shared files changed

| File | Reason |
| --- | --- |
| `tests/bundle-budget.test.js` | Enforce the PJM static graph, lazy style and locator-loading budget in the dedicated budget command. Existing market budgets are preserved. |
| `src/experience/story/registry.js` | Add the lazy PJM pack with `released: false`. Existing market entries are preserved. Ordinary readers retain the research dialog; the candidate opens through the existing preview route. |

## Market-local work

| Layer | Files and purpose |
| --- | --- |
| Data | `src/markets/pjm/data/storyEvidence.js` joins `storyEvidenceValues.js` and `storyEvidenceProvenance.js`: fixed-vintage BRA/indicative evidence and per-field provenance; source-vintage dates remain distinct from posting/result dates. No catalogue, scheduled feed or model input is added. |
| Content | `story.js`, `storyBindings.js`: all thirteen bilingual table imports, source/claim references, current case bindings, and the authority's section-7 reconciliations. |
| Scenes | `story/scenes.js`: thirteen local compositions using the shared kit; teaching choices remain local. |
| Chart | `story/chart.js`: equal-height unscaled price Examples, pending band, empty later price slots, solid official BRA ratings, dashed non-binding indicative values, and an accessible table. No price-derived geometry or future revenue curve. |
| Footprint | `story/geo.js`: Natural Earth admin-1 v5.1.2, 110m, pinned source URL and Git blob identity, fourteen approved whole-state/DC shapes. Whole-state shading and zone labels are explicitly approximate/schematic. |
| Styling / pack | `story/pjm-story.css`, `storyPack.js`: local styles and configuration for the unchanged shell. Call, play, duration and lens are checked before opening; a mismatch returns control to the research-dialog fallback. |

## Open evidence and fallbacks

- **B-PJM-RIGHTS:** numeric price, collar, simulation and derived-price payloads stay null. The upper panel remains an unscaled Example.
- **B-PJM-BASIS:** the unmatched requirement/procurement pair stays null. The scene uses qualitative comparison and separately sourced reported shortfalls.
- **B-PJM-TERMS:** the copied energy/Regulation routes retain their pending-clause labels and the single Fair marker.
- Historical and actual posting dates retain their own source semantics. Indicative source creation vintage is a source label, never an auction or posting date.

## Validation and G-2

The runtime imports the value module. The full authoring registry still exposes every per-value locator, unit, arithmetic and source identity. Locator expansion loads only when a reader opens a source disclosure; it is not in the story's initial static closure. This separates source disclosure from rendering without changing any registered value or locator. The whole-state footprint uses documented screen-space simplification and transparent integer path deltas.

The wiring tests measure the complete additional static JavaScript closure and lazy styles against 40 KiB gzip, excluding only assets already loaded by the market page. Browser checks cover the initial request graph, first-open pack request, demand-loaded locators, thirteen bilingual shots and markers, focus, fallback and local controls on desktop and mobile. Each PR records its exact-head build, unit, current-model, budget and browser results; the data PR also records ETL verification. No fixture or snapshot is regenerated.

At G-2 the analyst checks the call/play/duration/lens anchor, all thirteen bilingual shots and markers, the credit-refresh binding reconciliation, the source-vintage distinction, price rights and null payloads, comparison/settlement fallbacks, solid/dashed/Example semantics, the approximate footprint, local-only controls, focus/history/language/mobile behaviour, and the measured lazy graph budget. Setting `released` belongs to the separate G-2 release PR. The stack does not merge or publish the story.
