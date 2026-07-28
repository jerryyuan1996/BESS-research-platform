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
├── sections.js    buildSections(api) — one declarative block spec per tab
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
| `lab.js` | the Investment Lab — one model, four markets |
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

## What does NOT live here

`h()`, `L()`, the charts, `card`/`badge`/`chip`/`kpi`/`why`, the source drawer, the header, the
navigation, theme and language. Those are in `src/` and are shared with WA too. This directory holds
only what is specific to *this lineage's* way of describing a dashboard.
