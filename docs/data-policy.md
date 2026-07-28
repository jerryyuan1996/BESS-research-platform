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
- every string in the bundle, whether or not any code path renders it
- `dist/assets/*.js.map` — source maps ship by default, so the unminified source is readable

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

Currently every figure in this repository is seed-derived and carries the quality badges of its source
dashboard. Nothing is production-complete until its live ingestion, validation and source-health check
are operational.

## What does not belong in the public bundle

- confidential project data
- third-party reports under NDA or licence restriction
- counterparty names, terms or pricing that are not public
- internal financial models
- anything a data-room agreement covers

### One item currently in breach of that rule, flagged rather than removed

`src/markets/wa/data/optimizer.js` contains `MJA2026` — a scenario layer marked
`[REDACTED-REPORT]` in the prototype, chart-reconstructed from a [REDACTED-ADVISER] Associates
report. The prototype's own comment says *"Do not expose in a public deployment."*

It was migrated as-is because this phase preserves behaviour and does not change content. **It ships
in the public bundle today.** Resolving it is a task for the confidential-data phase, and the options
are: remove it, replace it with a public-source equivalent, or move it behind the `local-data/`
mechanism below. Until then, treat any deployment of this site as a disclosure of that content.

The same applies to `KEMERTON` in `src/markets/wa/data/kemerton.js`, which carries `CONFIDENTIAL`
badges on individual fields (capex intensity, financial-model assumptions) and a named project,
site address and counterparty equipment list.

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

`src/local/` holds the loader interface and schemas for that data. **The loader is a stub.** The
local-data interface is a later phase and is deliberately not implemented.

The intended shape: files placed in `local-data/` are read at *development* time only, and a
local-only build variant can render them. Nothing in `local-data/` is ever copied into `dist/`. That
still is not security — it keeps confidential data out of the public artefact, which is a different
and more achievable goal.

**What is explicitly not being built:** authentication, a server, cloud storage, a database, or any
scheme that pretends client-side code can keep a secret.

## Before deploying

1. `git status` — confirm nothing from `local-data/` is staged.
2. Search the bundle for anything that should not be there:

   ```bash
   npm run build
   grep -ril "confidential" dist/
   ```

3. Decide about source maps. `vite.config.js` sets `sourcemap: true`, which publishes readable
   source. That is a reasonable default for a research site with nothing to hide; set it to `false`
   if that changes.
4. Confirm the disclaimer still renders. Every page carries it, and it is not decoration — these are
   illustrative figures presented to investors.

## Source register

Each market keeps its own source register in `markets/<id>/sources.js`, next to the market rather
than in a central file. Each entry preserves name, status, source date, coverage period, URL and
quality classification.

Rendering is shared (`components/sourceDrawer.js`) and must stay ignorant of which market it is
showing — no source name, URL, date or status may be hardcoded in a presentation component.
