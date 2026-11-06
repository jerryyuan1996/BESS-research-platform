# NEM story: reuse report

Built 5 November 2026 from the signed-off G-1 script, to G-2 (unreleased). Details: [build evidence](nem-build-evidence.md); review list: [G-2 checklist](nem-g2-checklist.md).

## Effort

One build session: source re-reads in the browser (AEMO workbook and three reports, the tender guidelines, two DCCEEW pages and the 40-entry register), the data module, content transcription, thirteen scenes and three charts, four unit-test files, one browser spec, the budget entry and these documents. The shared story code needed no change.

## What was reused

| Piece | Source | How |
| --- | --- | --- |
| Content contract, shell, place, registry | `src/experience/story/` | Unchanged; one registry line (`nem`, `released: false`) |
| Kit: `isoStage`, `toggleGroup`, `s`, map styles | `src/experience/story/kit/`, `src/styles/story.css` | Unchanged |
| Australia map: coast, WA, NT, SWIS, anchors | `src/markets/wa/story/geo.js` (`WA_ISLAND_MAP`) | Imported as is; NEM regions drawn in its frame |
| WA 2006 node text | `src/markets/wa/story.js` | Copied verbatim for "WA in 2006" |
| Pack shape, staleness and lens guard, lazy provenance drawer | PJM (`storyPack.js`, `storyBindings.js`, `story/evidence.js`) | Same pattern |
| Price-panel gating | PJM (`pricePublication`, null price fields) | Same rule; the price records sit in their own file behind one switch field, turned on after the analyst cleared them |
| Operating-asset fields | CAISO precedent, `projectFacts` wording | Bound the same fields |
| Test patterns | PJM content, data, scenes and wiring tests; CAISO browser spec | Adapted |

## What was new

- **ASSET-NEM-REGIONS** (`src/markets/nem/story/geo.js`): five regions from Natural Earth 1:50m admin-1 (public domain, v5.1.2, pinned by sha256), projected into the WA frame using the projection recovered from the WA map's town anchors; schematic interconnectors; 2 KB of paths.
- **Rights switch**: values, lazy provenance and the observed records in separate files, so the price layers can be switched by one field. Switched on by the analyst on 5 November 2026 (build evidence §0 and §5).
- **Sentence-level hiding**: a withheld value removes the sentence that would print it in both languages, rather than replacing the whole paragraph.
- **Charts**: Chart-NEM-SPREAD (two panels, shared axis, WA switch, table view), Chart-NEM-DAY, and the nem-09 collar.

## Measured size

From the exact-head build (`npm run build`):

| Measure | KiB gzip | Cap |
| --- | --- | --- |
| `story-nem` chunk alone | 29.0 | 41 (`story-nem` in `BUDGET.features`) |
| Additional JavaScript graph on opening (pack, shell, kit symbols, WA geo, playTitle) | 40.59 | 41 (raised from 40; Romania and Finland method) |
| The same plus lazy story styles (CAISO and PJM method) | 45.57 | not enforced (analyst decision 5) |

Before the analyst cleared the observed layers the graph was 39.00 KiB (43.97 with styles). The observed records add 1.6 KiB; under the analyst's rule the cap was raised from 40 to 41 rather than loading them lazily.

The NEM chunk is now the largest of the eleven story chunks (Romania 28.0, Finland 25.5, PJM 23.5). Its text is about 17% longer than PJM's, and it carries a second Australian map layer. Trimming done during the build: source locators moved to the lazy provenance file, claim metadata dropped from the runtime copy, region geometry rounded to whole units.
