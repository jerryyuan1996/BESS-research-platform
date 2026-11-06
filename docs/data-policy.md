# Data policy

## This is a completely public website

> **Hiding a value in JavaScript or the UI does not make it private. Anything included in the
> frontend production bundle is public.**

There is no login, no account management, no permissions, no investor authentication, no private API
and no user database. There is no backend and no server-side logic of any kind. `dist/` is a folder
of static files served to anyone who asks.

Concretely, **all of the following are public** and must be treated as published the moment they are
deployed:

- everything under `src/` — including every `data/` module inside every market
- everything under `public/`
- every value in every `comparison.js`
- every source URL, date and status in every `sources.js`
- every string in the bundle, whether or not any code path renders it — and its comments too, if
  source maps are ever re-enabled (`vite.config.js` sets `sourcemap: false`; see step 3 of the
  release checklist below for why that is decided rather than default)

A value that is never displayed is still in the bundle. A tab a user never opens still downloaded its
data. "Not linked from anywhere" is not access control.

## What belongs in the public bundle

Suitable:

- market statistics
- regulations and market rules
- public market prices
- public project pipelines
- public source metadata
- non-confidential research conclusions

Every *assumption* in this repository is seed-derived and carries the quality badges of its source
dashboard. Observed market data is now ingested automatically, validated and published with a
provenance envelope — see [`live-data.md`](live-data.md). The two are kept visibly apart on screen
and are never merged.

### Automatically published data

`public/data/public/` is written by the ETL on a schedule and is public by the same rule as
everything else. Three constraints apply to it specifically:

- **Licence before publication.** Each dataset declares `republishable` in
  `src/governance/datasets.js`. Where it is false the raw series must not be written at all — only
  whatever derived statistic the licence permits, or nothing. `buildSnapshot()` throws rather than
  letting a licensed series into the bundle.
- **Attribution travels with the data.** Every snapshot carries its source name, URL, licence and
  attribution string, and `/data` renders them.
- **Observed data is not hand-editable.** Each snapshot carries a checksum over its payload and
  `npm run etl:verify` fails CI on a mismatch. A tuned "observed" value is worse than an honest
  assumption — it carries more authority and attracts less scrutiny.

### Credentials

`ENTSOE_TOKEN` is a GitHub Actions secret. It is used only by the ETL in CI, never at build time and
never in the browser. No credential of any kind reaches `dist/`.

## What does not belong in the public bundle

- confidential project data
- third-party reports under NDA or licence restriction
- counterparty names, terms or pricing that are not public
- internal financial models
- anything a data-room agreement covers

### Resolved: the confidential WA layer is now behind `local-data/`

Both items previously flagged below have been moved out of the public tree. What
the exercise taught is worth more than the fix:

**Moving the values was not enough.** The section *prose* carried the project
name, the site address, the capital structure and the financial model's own audit
exception as string literals. A `dist/` scan found every one of them after the
data modules were already clean.

**Gating the render was not enough either.** A bundler ships a function's string
literals whether or not the function is ever called. `renderPortfolio` returned
early in production and its entire confidential text still shipped.

**Nor was gating the CSV export.** The row labels named the project and its
financial model.

**Nor was a clean JS bundle.** Sourcemaps publish readable original source,
including comments — and explanatory comments naming the project and the
consultant were reachable through the `.map` long after the code was clean.
`vite.config.js` now sets `sourcemap: false`.

So the rule is:

> If a whole section is confidential, move the **module**. If a value inside a
> publishable section is confidential, move the **value**. Gating a render
> protects nothing.

Five mechanisms enforce it:

| | |
|---|---|
| `vite-plugin-local-data.js` | replaces two public stubs (`src/local/payload.js`, `src/local/portfolioSection.js`) with real content in dev; in a build they stay stubs, unconditionally |
| `tests/bundle-confidentiality.test.js` | scans the built artefact **and the tracked tree** for markers, and fails the build |
| `scripts/lib/markers.mjs` | loads the marker set and proves it has not been altered |
| `scripts/scan-staged.mjs` | pre-commit hook: scans staged blobs before a commit exists |
| `.gitignore` | `local-data/*` is never committed |

The stubs are real files rather than Vite `virtual:` modules on purpose: the test
suite imports the market registry in plain Node, and a virtual specifier breaks
every test that reaches it.

### Where the marker set lives, and why not here

The markers themselves are **not in this repository**. They come from the
`GUARD_MARKER_SET` secret in CI, or `local-data/markers.json` locally, and
`scripts/lib/markers.mjs` carries a committed hash of the set so that a change to
it is a visible diff and an unintended change is a red build.

This replaced a plaintext list inside the test file that exempted itself from its
own scan — which meant the detection rule was also a published copy of every
confidential value it protected. Tracked source now holds only the scanner, the
fingerprint, and two structural patterns that carry no confidential content
(a link to the document store, and the prototype's redaction-placeholder naming
convention).

There are **no path exemptions left**: every tracked *text* file is scanned,
including the guard's own source and this document. An exemption is a hole with a
comment over it, and the previous design needed two.

"Text" is the honest qualifier. Files containing a NUL byte are skipped — a
marker inside a compressed container is not plaintext and a substring scan reads
straight past it. That limit is why the pre-commit hook **refuses** staged
document containers (PDF, Office, archive formats) outright rather than skipping
them, with a narrow allowlist for the five ETL parser fixtures. A confidential
report committed whole is a leak this repository has already had once, in a
different wrapper.

One judgement that decides what belongs in the set at all: the place name
"Kemerton" is deliberately **not** a marker. It is a real WA location — the
Kemerton Strategic Industrial Area, Kemerton Terminal, the KEM–MRR constraint —
and that geography is public and discussed throughout the grid and RCM tabs. What
is confidential is a particular fund's asset at that location. A marker list that
banned the place name would either fail constantly or push someone into deleting
legitimate public analysis.

### The original flags — both resolved

Two blocks were migrated out of the prototype carrying confidential content, and for a period they
shipped in the public bundle. Both are now behind `local-data/`, and this section records what
happened rather than what is outstanding.

`src/markets/wa/data/optimizer.js` held a scenario layer chart-reconstructed from a confidential
third-party consultant report, flagged in the prototype with a *"Do not expose in a public
deployment"* comment that the refactor carried across without acting on. The public
co-optimisation configuration stays in the module; the reconstructed layer moved to
`local-data/wa-mja2026.json` and callers branch on `hasMjaData`.

`src/markets/wa/data/kemerton.js` held market-level WEM capacity data — AEMO ESOO, ERA
determinations, duration thresholds, the CRC calendar — mixed with a project underwriting layer
naming a site, its technical specification, developer-reported trading assumptions and
financial-model capex. The public half stayed; the project layer moved to
`local-data/wa-kemerton-project.json` and callers branch on `hasProjectData`.

The lesson worth keeping is in the second one. The prototype's own comment asserted that all
project content was confined to the Portfolio tab. That had stopped being true — it had reached
the duration, grid, FCESS and export layers as well — and nobody noticed, because the assertion
was a comment rather than a test. That is why the guard scans artefacts and not intentions.

## Local / confidential data

`local-data/` exists for data that must never reach the repository or the bundle. It is git-ignored
except for its README:

```gitignore
local-data/*
!local-data/README.md

.env
.env.*

*.xlsx
*.xlsm
*.xls
```

`src/local/` holds the loader interface for that data, and **it is implemented**. Files placed in
`local-data/` are read at *development* time only; `vite-plugin-local-data.js` substitutes the real
content into two public stub modules when the dev server resolves them, and leaves those stubs
untouched on `vite build`, unconditionally. The build path never has the data to begin with, so
there is no branch for tree-shaking to get wrong.

`loadLocal(key)` returns `null` for every key in a production build. The contract callers must
respect is that **absence is the normal case** — a section renders its public layer and shows a
withheld card, rather than leaving a hole where confidential content would have been.

That still is not security. It keeps confidential data out of the public artefact, which is a
different and more achievable goal. Anyone holding the repository and `local-data/` holds the data.

**What is explicitly not being built:** authentication, a server, cloud storage, a database, or any
scheme that pretends client-side code can keep a secret. If confidential material must reach
someone who does not hold the repository, that needs a private deployment with server-side
authorization — a different project, not an extension of this one.

## Before deploying

0. `npm test` — includes the governance suite, which asserts that automation cannot write outside
   `public/data/` and that every comparison field is classified.
1. `git status` — confirm nothing from `local-data/` is staged.
2. Search the bundle for anything that should not be there:

   ```bash
   npm run build
   grep -ril "confidential" dist/
   ```

3. Leave source maps off. `vite.config.js` sets `sourcemap: false`, and that is **decided rather
   than default**: a `dist/` scan once found confidential names reachable through a `.map` long
   after the bundle itself was clean. The guard still filters `.map` files even though none are
   emitted, so that turning them back on puts them under the scan rather than creating an
   unscanned publication channel.
4. Confirm the disclaimer still renders. Every page carries it, and it is not decoration — these are
   illustrative figures presented to investors.

5. Before the repository's visibility changes or anyone is added to it: a history rewrite is not
   enough. GitHub keeps each pull request's commits as they were when it was opened, and content
   redaction (`git filter-repo --replace-text`) rewrites file contents but not commit messages.
   Scan old commit messages against the marker set, and have GitHub Support purge old
   pull-request references and unreachable objects first. Commit messages, pull-request text and
   branch names are not covered by the staged-file guard, so check them with `scanText` from
   `scripts/lib/markers.mjs` before pushing.

## Source register

Each market keeps its own source register in `markets/<id>/sources.js`, next to the market rather
than in a central file. Each entry preserves name, status, source date, coverage period, URL and
quality classification.

Rendering is shared (`components/sourceDrawer.js`) and must stay ignorant of which market it is
showing — no source name, URL, date or status may be hardcoded in a presentation component.
