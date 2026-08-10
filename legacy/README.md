# `legacy/`

## The prototype is no longer in this repository

`global-cockpit-0727-v1.html` — the original 16,000-line consolidated prototype —
was removed from the working tree **and from all Git history** on 10 August 2026,
along with the `reference/` copy it was taken from.

It had to go. The prototype predates the split between public research and
confidential project material, so it carried the fund's WA asset inline: the deal
name, the site, the third-party report and its figures, and links to the document
store. `local-data/` and the production-bundle guard were both introduced later
and neither applied to it — the guard scans `dist/`, and this file was never part
of a build, so it sat tracked and unscanned in every clone of the repository.

Jerry keeps a local copy outside Git, under `local-data/`. It is not obtainable
from this repository by anyone else, by design.

## What this means for the baseline test

Nothing. Both `npm test` and `npm run test:baseline` pass without the file,
because nothing in the suite ever read it:

- `tests/fixtures/generate.mjs` holds lines 683–811 of the prototype — the
  normalization layer, FX, `MARKETS`, `runCase` — **transcribed verbatim into the
  generator**. It executes that copy. It never opened the HTML, and it names
  `legacy/global-cockpit-0727-v1.html` only as a `generatedFrom` provenance
  string.
- `tests/fixtures/legacy-baseline.json` holds the resulting 45 pinned outputs.
- `tests/baseline.test.js` reads that JSON and asserts the modular engine still
  reproduces them.

So the baseline remains fully re-derivable from a clean clone. The comparison
still comes from the prototype's own code rather than from a restatement of it —
that code just lives in the generator now instead of inside a 16,000-line
document that could not be published.

Verified after the removal: 401 tests pass, and `npm run test:baseline` produces
a fixture identical to the committed one.
