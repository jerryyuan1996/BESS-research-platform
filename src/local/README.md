# `src/local/`

Interface for confidential data held in `local-data/`.

**Status, 2026-10-11: built.** The text below the line was written when this was a stub and is
kept for the reasoning. What exists now:

- `loader.js` reads `local-data/<key>.json` on the development server and returns `null` in any
  build. See `local-data/README.md`.
- `notes.js` is the private overlay for the investment view: the analyst's reasons behind
  practitioner grades and held views, notes on verdicts, and deal-derived figures for limit
  checks, all from `local-data/view-notes.json`. A held view must have a reason there.

---

## Why it is a stub

The brief defers the local-data interface, and there is a good reason not to guess at it now: the
mechanism depends on a decision that has not been made.

A static public site has exactly one honest option — confidential data is loaded at **development
time only** and never enters `dist/`. Anything else (fetching it at runtime, embedding it and gating
on a flag, obfuscating it) puts the data in the public bundle and is security theatre.

So the shape of this module depends on how the confidential view is meant to be used:

| If the goal is… | Then… |
|---|---|
| Look at confidential figures locally, publish only public ones | A dev-only Vite import of `local-data/`, excluded from the production build |
| Share a confidential view with a named person | That is a different artefact, not this site — and it needs a server |
| Keep confidential inputs but publish derived aggregates | The aggregate is the disclosure; compute it offline and commit the result as public data |

Guessing wrong here would create an interface that looks like access control and is not.

## What `loader.js` does today

Returns `null` and, in dev, explains why. Callers must handle absence — which they must anyway, since
in production the data will never be there.

## When it is built

- Loading must be dev-only, gated on `import.meta.env.DEV`, so the production bundle cannot contain it.
- Schemas go in `schemas/`, alongside a validator, so a malformed local file fails loudly.
- The UI must make it obvious when a confidential value is on screen, using the existing
  `badge('conf')` vocabulary.
- No authentication, no server, no cloud storage.

See [`../../docs/data-policy.md`](../../docs/data-policy.md).
