# `_template` — documented empty market module

Copy this directory to create a new market. It is not registered and never ships:
`registry.js` does not import it, so Vite tree-shakes it out of the production bundle.

> **Before you build a dashboard here, read
> [`../_shared/README.md`](../_shared/README.md).**
>
> This template follows the hand-written lineage (WA's). Four of the five live markets instead
> describe their tabs as data and let the shared block engine draw them — no rendering code in the
> market at all. That is the better default. Copy `markets/gb/` rather than this directory unless
> your market needs something the block engine cannot express.
>
> `manifest.js`, `comparison.js` and `sources.js` below are correct either way.

```
_template/
├── index.js        the module's whole public surface — five keys
├── manifest.js     identity + freshness metadata
├── comparison.js   the ONLY thing the global comparison engine reads
├── sources.js      source register, kept next to the market
├── tabs.js         tab strip → URL segments
├── state.js        market-local state (never lang/theme)
├── dashboard.js    renderer: (container, { tabId, basePath }) => void
├── data/           raw market data modules
└── sections/       one file per tab
```

Full instructions: [`docs/adding-a-market.md`](../../../docs/adding-a-market.md).

The short version:

1. `cp -r src/markets/_template src/markets/jp`
2. Fill in `manifest.js` and `comparison.js`
3. Add two lines to `src/markets/registry.js`
4. Japan is now on the home page, in the nav, in the league table, in the $1M engine,
   in the certainty frontier and in the waterfall selector — with no other edits.
5. Build the dashboard at your own pace. Until `dashboard.js` is wired,
   `/markets/japan` shows a pending-migration page and everything else works.
