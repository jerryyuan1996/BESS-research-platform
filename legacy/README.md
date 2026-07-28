# `legacy/`

`global-cockpit-0727-v1.html` — the original consolidated prototype, copied verbatim from
`reference/Global BESS Dashboard Cockpit_0727_v1.html` (1,461,482 chars / 16,000 lines).

## This is not production code

It exists only for:

- behaviour comparison
- calculation comparison
- visual comparison
- migration verification

It is not imported by the application, not part of the build, and must not be linked from the site.

## It is load-bearing for the test suite

`tests/fixtures/generate.mjs` extracts lines 683–811 of this file — the normalization layer — and
executes them in Node to produce `tests/fixtures/legacy-baseline.json`. `tests/baseline.test.js` then
asserts the modular engine reproduces all 45 outputs.

**Do not edit or move this file.** The generator addresses it by line range, and the whole point of
the baseline is that it comes from the original rather than from the new code. Regenerate with:

```bash
npm run test:baseline
```

## Where things are in it

| Lines | Contents |
|---|---|
| 1–314 | `<head>` + the entire 307-line design system |
| 315–317 | `<body>`: `#app`, `#tip` |
| 318–1212 | the global cockpit — home page |
| 366–644 | the SVG chart library (one of six identical copies) |
| 683–811 | the normalization layer — FX, MARKETS, `runCase` |
| 1213–5570 | `<script type="text/plain" id="dash-wa">` — full HTML document |
| 5571–8308 | `#dash-gb` |
| 8309–10994 | `#dash-ie` |
| 10995–13482 | `#dash-ro` |
| 13483–15998 | `#dash-pl` |

Each dashboard payload is a complete standalone HTML document stored as escaped text: every `</` was
rewritten to `<\/` at build time so the embedded HTML could not terminate its own `<script>` element.
To read one as HTML, extract the block and reverse that substitution.

All five dashboards are now migrated into `src/markets/`. This file remains the authority for
verifying them — and the source of `tests/fixtures/legacy-baseline.json`. See
[`../docs/adding-a-market.md`](../docs/adding-a-market.md) for the extraction procedure that was
used, and [`../docs/migration-notes.md`](../docs/migration-notes.md) §11 for what the diff of the
four later payloads revealed.

## Why it was built this way

The prototype's own comment explains the iframe:

> every JS context stays isolated (the dashboards all declare top-level `state`, `M`, `render`
> and would collide if concatenated into one document)

That was a workaround for six programs sharing global names, not a design choice — and it is what ES
module scope removed. Background: [`../docs/migration-notes.md`](../docs/migration-notes.md).
