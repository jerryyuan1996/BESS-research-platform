# `_shared/` — the declarative block engine

The dashboard engine that GB, IE, RO and PL are built on. Extracted **once** from the prototype
rather than copied four times.

## Why this exists

The four prototype payloads were generated from a common engine. Diffing them proved it: the same
**1,039 lines appear byte-identically in all four**, and the only difference is a five-line
`srcHealth` override that GB carries and the others do not.

So the four dashboards were never four programs. They were one engine plus four datasets, flattened
into four standalone HTML files by a build step. This directory restores that structure.

## What a market in this lineage actually contains

```
markets/gb/
├── mkt.js         identity for the engine: locale, currency, timezone, COD years, seed tag
├── tabs.js        [[id, [en, zh]], …]
├── sources.js     source register
├── data.js        M — the entire market dataset
├── sections.js    buildSections(api) — a declarative block spec per tab, or a
│                  synchronous facade when the market loads sections on demand
├── sections/      optional: one module per domain, plus shared.js and registry.js
│                  (see below). Present for nem, gb, ie, pl and ro since P1-C.
├── text.js        optional overrides to the shared strings (GB only)
└── dashboard.js   ~20 lines of wiring
```

No rendering code. No charts. No components. A section is described, not drawn:

```javascript
{ t:'card', title:['Revenue stack','收入结构'], badges:['calc'], live:false, blocks:[
  { t:'kpis', items:[ … ] },
  { t:'bar', cfg:{ … } },
  { t:'why', text:[ … ], sig:[ … ] },
]}
```

`B()` in `blocks.js` draws it. Adding a section to one of these markets is a data edit.

## Files

| | |
|---|---|
| `engine.js` | `createMarketEngine(cfg)` — binds everything to one market, returns its `dashboard` |
| `blocks.js` | `B()`, the block renderer, plus the engine-owned interactive blocks |
| `lab.js` | the duration-NPV sweep and the portfolio screening model. Named for the Investment Lab tab it used to render; that tab moved to the home page, and what remains here is the market-level analysis the cross-market Lab does not do |
| `compute.js` | weighted scores, de-rating interpolation, duration path, stage probabilities |
| `format.js` | currency- and locale-bound formatters, derived from `MKT` |
| `exports.js` | CSV / JSON download |
| `text.js` | the shared bilingual UI strings |
| `glossary.js` | the shared bilingual glossary |

## Block types

Layout `card` `g2` `g3` · Content `kpis` `table` `note` `reco` `warn` `proto` `band-story` `p`
`cap` `sub` `chip` `why` `flow` `meter` `scores` `list` `badges` · Narrative `timeline` `phases`
`players` `exits` `cmp` `gates` `ladder` `wfrows` `ic` · Charts `line` `bar` `wf` `band` ·
Interactive `scorecard` `aug` `stageProb` `pipeChart` `projTable` `labInputs` `labOut` `labDur`
`labSnaps` · Meta `src` `walk` `exports` `glossary`

An unknown `t` renders nothing rather than throwing.

## Two things worth knowing before you change this

**1. `irrOf` here brackets `[-0.9, 1.5]`.** The home cockpit and WA bracket `[-0.9, 2.0]`. That is a
real divergence in the prototype, not a transcription slip, so `lab.js` keeps its own copy rather
than importing `utils/finance.js`. Unifying them would change published IRRs.

**2. `state.tab` is an accessor, deliberately.** Migrated section code does
`state.tab = 'grid'; render();`. With a plain field that would mutate state the router knows nothing
about, and the next render would overwrite it from the URL. The setter records the intent and
`render()` turns it into a navigation — so deep links and the back button work without editing a
line of the migrated code.

## A market that fetches its sections on demand

`sections.js` may instead be a small facade over `sections/`, one module per
domain, with a loader in front of it. `buildSections(api)` stays **synchronous**
and returns a map of whichever sections the current route has loaded; a market
that wants that declares a second key:

```javascript
const engine = createMarketEngine({
  MKT, TABS, SRC, M, buildSections,
  prepareSections: (api, ids) => loadSections(api, ids),   // the ids this route draws
});
```

`dashboard()` then draws the chrome first, awaits `prepareSections`, and draws
the sections — with a skeleton that appears only after 120 ms, a panel for a
chunk that 404s, and a token that discards a resolve which arrives after the
reader has moved on. A market that omits the key takes no await and behaves
exactly as before; that is the whole compatibility story.

Three rules make it a split rather than a story: every loader entry is a thunk
around a literal specifier (`() => import('./grid.js')`), nothing in the market
imports a section statically, and a section module imports neither another
section, the market dataset nor the independently lazy-loaded story pack.
`tests/market-sections-lazy.test.js` asserts all three for every market that
uses the contract, and `tests/bundle-budget.test.js` holds the bytes.

**The final contract (P1-C).** Five markets use it now: the NEM pilot plus
Great Britain, Ireland, Poland and Romania. The shape is generated once by
`scripts/split-market-sections.mjs`; only the `LOADERS` map in each
`sections/registry.js` and the prelude helpers in `sections/shared.js` are
market-specific. A market's research and economic logic stays in its own
modules — nothing was normalised into a shared schema to make the loader fit.

`docs/p1-sections-pilot.md` is the pilot's measurement and recommendation;
`docs/p1-sections-rollout.md` is the final contract, the per-market results
and the chunk-composition decisions. The engine gained exactly one optional
cfg key and no change to any market that omits it.

## What does NOT live here

`h()`, `L()`, the charts, `card`/`badge`/`chip`/`kpi`/`why`, the source drawer, the header, the
navigation, theme and language. Those are in `src/` and are shared with WA too. This directory holds
only what is specific to *this lineage's* way of describing a dashboard.
