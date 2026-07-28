# `local-data/`

Confidential data goes here. **Nothing in this directory is committed** except this README.

```gitignore
local-data/*
!local-data/README.md
```

## Status: interface not yet built

This directory and `src/local/` are scaffolding for a later phase. `src/local/loader.js` is a
documented stub that returns nothing. Do not build against it yet.

## The rule that makes this directory meaningful

> Hiding a value in JavaScript or the UI does not make it private. Anything included in the frontend
> production bundle is public.

The point of `local-data/` is **not** access control — a static site cannot provide that. The point is
to keep confidential data out of the public artefact entirely: nothing here is ever bundled, copied
into `dist/`, or committed.

If a figure must be shown to someone who is not authorised to see the underlying data, the figure
itself is the disclosure. Aggregation is not anonymisation.

## What belongs here

- internal financial models
- third-party reports under NDA or licence restriction
- counterparty terms and pricing that are not public
- data-room material
- project documents that name sites, entities or equipment

## What does not

Anything you would be content to publish. That belongs in the market's own `data/` module under
`src/`, where it is versioned, reviewed and testable.

## Before you put a file here

1. Confirm `git check-ignore -v local-data/yourfile.xlsx` reports a match.
2. Confirm the file is not also sitting somewhere under `src/` or `public/`.
3. Remember that `.xlsx`, `.xlsm` and `.xls` are git-ignored repository-wide, not only here.

See [`../docs/data-policy.md`](../docs/data-policy.md) — including the two files currently under
`src/` that carry content the prototype marked confidential.
