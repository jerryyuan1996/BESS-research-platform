# Japan story: G-2 build prompt (Tokyo, Kyushu, Hokkaido)

Prepared 5 November 2026, after G-1 sign-off of [the Japan storyboard](japan-storyboard.md) (§12). Paste everything below the line into a new session started from `main` once the storyboard branch is merged. It builds the story to a G-2 candidate; it does not release it.

---

## Task

Build the signed-off Japan market story for the three allocation markets `jp_tokyo`, `jp_kyushu` and `jp_hokkaido` as **one shared story pack**, and bring it to a G-2 candidate the analyst can walk through. Work in the established order and **stack the PRs, one per layer**:

0. **Build evidence:** `docs/immersive-experience-plan/jp-build-evidence.md`.
1. **Data:** fixed-vintage records with provenance.
2. **Content:** bilingual shot tables and bindings.
3. **Scenes and chart:** local compositions and Chart-JP-PRICE.
4. **Wiring:** pack, guards, registry entries, budget and browser tests.
5. **G-2 reuse report:** `docs/immersive-experience-plan/jp-g2-reuse-report.md`.

Every story stays **`released: false`**. Setting `released` on all three ids is a separate G-2 release PR, after the analyst's walkthrough; the analyst ruled that the three areas release together, in one PR. Do not merge, deploy or publish anything.

## Read first

- `AGENTS.md`, and every rule in it. In particular: confidentiality, no regenerated fixtures, analyst-only weights and rates, no model figure typed into prose, and English and Simplified Chinese everywhere.
- The **authority:** `docs/immersive-experience-plan/japan-storyboard.md`, all of it.
  - §1, the shared-pack design.
  - §2, the anchors.
  - §4–§7, the shots.
  - §8, the bindings.
  - §9, the chart and calculations.
  - §12, the analyst decisions.
  Where this prompt and the storyboard disagree, the storyboard wins. Where the storyboard is silent, follow the released packs.
- Evidence: `source-register.md#g1-jp-evidence`, covering SRC-JP-01 to 18, CL-JP-05 to 29, the H-JP nodes, CALC-JP-FADE and CALC-JP-PRICE, CF-JP-01 to 09, the GAP-JP gaps and BUILD-JP-02.
- Plan documents: `README.md`, `evidence-and-content-specification.md`, `experience-and-page-design.md` and `engineering-work-packages.md`.
- **Patterns to copy, not fork:**
  - Poland: `src/markets/pl/storyPack.js`, `story.js`, `storyBindings.js`, `story/`, `data/`, and `tests/pl-story-*.test.js`.
  - GB: `src/markets/gb/` and `tests/gb-story-*.test.js`.
  - CAISO: `tests/caiso-story-*.test.js`.
  - Reports: `pl-build-evidence.md`, `gb-g2-reuse-report-2026-11-01.md`, `caiso-reuse-report.md` and `pjm-story-reuse-report.md`.
- **Japan code:**
  - `src/markets/jp/`: `regions.js`, `national.js`, `sources.js`, `gridMapData.js` and `jp-zones.json`.
  - `src/markets/jp-*/index.js`: `economics.ltda`, `dashboardId: 'jp'` and `region`.
  - `view/markets/jp_*.json`.
  - Briefing and acquisition code: `src/briefing/homeData.js`, `src/briefing/model.js` and `src/acquisition/opportunities.js`.
  - `src/experience/story/`: `registry.js`, `contract.js`, `shell.js` and `place.js`.
  - `vite.config.*`, for the `story-<dir>` chunk naming.
  - `tests/bundle-budget.test.js`.

## Step 0: rule-11 check and build evidence (first PR, Markdown only)

1. **Re-read the anchors live** from `main` for all three ids: lens `infraFund`, call `opportunistic`, play `jp-<area>-ltda-6h`, route `ltda`, stage `operating`, play hours 9, `economics.ltda.minDurationHours` 6, `economics.ltda.years` 20, evidence and trigger. Compare each with storyboard §2.
   - If **any** area's call, play, hours, route or stage moved, stop and report to the analyst (rule 11). Do not adapt the script yourself.
   - If the three areas no longer share one call and route, the shared pack's fallback condition (§1.6) applies. Report it before writing code.
2. **Write `jp-build-evidence.md`** in the shape of `pl-build-evidence.md`:
   - §1, the rule-11 verdict, with the commit and date read.
   - §2, the gaps, each stating how the build treats it.
   - §3, the complete field list for every evidence token in storyboard §8, with each value's primary locator, unit, date semantics (fiscal year, effective date or event date) and check date.
   - §4, the bound-field map. For each financial token: exact owner, formatter, missing-state behaviour, and the at-check value for all three areas.
   - §5, the Chart-JP-PRICE contract.
   - §6, the reuse extract.
   - §7, judgement calls for the analyst.
3. **Resolve BUILD-JP-02:** find the field that gives the play design's build cost per MW in JPY, in `designEconomics` or the acquisition reference. Record the exact path and the at-check values. If no such field exists, **do not compute one in the story**. Propose the smallest model-side exposure as a judgement call, and leave the chart's build-cost bar withheld.
4. **Reopen the repository-cited sources** before they support Strong or Fair page text: SRC-JP-03, 12, 13, 14, 15 and 17.
   - Record each opened locator and date.
   - A source that cannot be opened keeps its claim's marker as signed off, and its value stays withheld.
   - METI 006_s02_00 has returned HTTP 403 twice. Try METI's meeting index page for the same material before giving up (GAP-JP-RETURN).
5. **Work the gaps where public sources allow it, and do not block on them.**

   | Gap | What to try | Treatment if still open |
   | --- | --- | --- |
   | GAP-JP-FUNDING | OCCTO 容量拠出金 rules | jp-11's funding leg stays dashed |
   | GAP-JP-FC2011 | Converter transfers in March 2011 | jp-02 stays qualitative |
   | GAP-JP-CHARGECTRL | HEPCO attachment | The Hokkaido strip stays an unscaled Example |
   | GAP-JP-REFORM-WHY | METI's reform page or the 2013 Cabinet decision | Leave as is |
   | GAP-JP-CERT | METI's certification list | If the supplier now appears, record it, but keep it unnamed on the page per §12 unless the analyst says otherwise |

   - **Never** close GAP-JP-HOLDERS by naming or counting award holders.
   - **Do not** open GAP-JP-CURTAIL's workbook for page use. The analyst ruled anchored days only.

## Step 1: data (second PR)

- **Files:** `src/markets/jp/data/` (national records once) plus a regional records module keyed `tokyo | kyushu | hokkaido`, on the pattern of `src/markets/pl/data/` and `src/markets/pjm/data/storyEvidence*.js`. Split values and provenance, so per-value locators load only when a reader opens a source disclosure, as PJM does.
- **Records:** every evidence token in storyboard §8.
  - Dates: H-JP-01 to 06, the regional nodes, the reform steps, the capacity-market and LTDA fiscal years, the Round 4 bid close, the FIT, suspension and first-curtailment dates, the transfer-trip date, the blackout date and month, and the New Kitahon year.
  - Rules: obligation hours from SRC-JP-01 p. 13, and the clawback share as the bilingual word pair "nine-tenths" / "九成" (not a model value). The copy already supplies "about" / "约" around the token.
  - Pool and round: the lithium-ion pool and the round name.
  - Regional: the study caps and effective date, and the charging-control system count and notice date.
  - Grid: east and west frequency, converter year and link year.
  - Output control: each area's anchored output-control days by month, **with its own window**.
- **Per value:** source ID, primary URL, page or section locator, unit, date semantics, check date, statement type (observed, official plan, rule or interpretation) and the public-reuse basis.
- **No new datasets:** do not register anything in `src/governance/datasets.js`, add any ETL feed, or touch view files or the model. These are analyst-entered fixed-vintage records, like Poland's auction rows.
- **Consistency test:** the SRC-JP-01 obligation hours must equal `economics.ltda.minDurationHours` in all three areas, and the twenty-year term must equal `economics.ltda.years`. A mismatch fails the build. It never adjusts either side.
- **Tests:** `tests/jp-story-data.test.js`.
  - Every record has a locator and check date.
  - No value is zero or NaN in place of missing.
  - Output-control windows differ, and no ranking helper exists (CF-JP-04).
  - No company, holder or project string appears in the data modules.
- Run `npm run etl:verify` because a data layer changed, even though no snapshot changes.

## Step 2: content (third PR)

- **Files:**
  - `src/markets/jp/story.js`: shared shots `jp-00` to `jp-06`, `jp-08`, `jp-09`, `jp-11` and `jp-12`.
  - `src/markets/jp/storyRegions.js`, or a section of `story.js`: `jp-tokyo-07|10|13`, `jp-kyushu-07|10|13`, `jp-hokkaido-07|10|13`, the §5.1 regional sentences, and the §5.2 timeline nodes with the region's own node highlighted.
  - `src/markets/jp/storyBindings.js`: values, `reviewed()`, the source envelope and missing-state handling.
- **Copy:** transcribe storyboard §4–§7 and §8's remaining visible text **exactly**: Question, Copy, Meaning, Marker, Controls, Labels and Caption, in both languages. Any wording change goes back to the analyst; do not improve copy silently.
- **Composition:** `composeStory(regionId)` returns one ordinary contract story per area. It has:
  - `marketId` = the area id;
  - `playRef` = that area's play;
  - its own `reviewedAgainst` from storyboard §2 (`on: '2026-11-05'`);
  - the eleven shared shots, plus the area's three regional shots in their chapter positions (07 in tensions after jp-06; 10 in battery after jp-09; 13 as the investment chapter).

  Fourteen shots per area.
- **Bindings:** exactly the owners in storyboard §8.
  - `CALLS`, `playTitle`, the decision-panel metrics, `row.play.action.text`, `row.evidence`, `m.manifest.name/slug`, `row.play.hours`, `economics.ltda.minDurationHours/years` and `JP_LTDA_MERCHANT_RETENTION`.
  - `HOME_BRIEFING.plays[...].econ.value/secured/securedYears`.
  - `HOME_BRIEFING.acquisitions.infraFund[...].referenceCases` (keys `cautious`, `base`, `favourable`).
  - The BUILD-JP-02 field.

  Design value is labelled USD per MW at the platform's yields. Acquisition prices are JPY per MW. Never put both on one axis, and never relabel them. A missing value hides its sentence; it never prints zero.
- **Never copy** the thesis, `why`, `because`, `despite` or the trigger label: they carry the 4.5% return and a trade-press range. The trigger binds by its date only.
- **Markers:** as approved. Strong on jp-03, jp-04, jp-05, jp-06 and jp-kyushu-07; Fair elsewhere; jp-00 keeps the play's marker (level `'play'`).
- **The supplier** is "a certified maker" on the page; its record stays authoring-only.
- **Tests:** `tests/jp-story-content.test.js`.
  - `validateStory()` passes for all three compositions with `complete: true`.
  - The eleven shared shots are **byte-identical** across compositions.
  - Each composition has exactly its own region's three regional shots.
  - Shot ids match the contract pattern and the approved scheme.
  - en/zh token parity, no typed figure, and every token declared.
  - All links point at the area's own slug.
  - Each area's `reviewedAgainst` matches §2.
  - No page string names the supplier, a holder or a project.

## Step 3: scenes and signature chart (fourth PR)

- **Files:** `src/markets/jp/story/scenes.js`, `chart.js`, `geo.js` and `ui.js`, plus `jp-story.css`. Use only the shared kit (`kit/svg.js`, `kit/symbols.js`, `kit/controls.js`) and design tokens. **Do not change** the kit, shell, navigator, marker, contract or `src/styles/story.css`.
- **Map:** from `src/markets/jp/jp-zones.json` (Natural Earth, public domain). Record the file's Git blob identity and a screen-space simplification as PJM does.
  - Areas are prefecture groups. Draw the 50/60 Hz boundary as a labelled **band**, not a line, and caption it as approximate.
  - The reader's area is outlined.
  - Draw no plant, project or holder site anywhere. Hokkaido's charging-control systems are hatched schematic areas that imply no holder.
- **One scene per shot, following each shot's Scene and Feedback rows.**

  | Shot | Scene |
  | --- | --- |
  | jp-01 | Frequency and regulated-recovery toggle |
  | jp-02 | Rotating-outage pattern; static under reduced motion |
  | jp-03 | Three reform layers |
  | jp-04 | Three payback bars |
  | jp-05 | Four-clause contract card over a cutaway |
  | jp-06 | Capped-pool queue with the certified-first toggle |
  | jp-09 | Fade Example with the two presets |
  | jp-11 | Payment chain, with the funding leg dashed while GAP-JP-FUNDING is open |
  | jp-12 | Revenue bar with area comparison |
  | Regional 07, 10, 13 | As specified per area |

  The Kyushu jp-10 panel keeps physical and revenue panels **separate** and plots only anchored monthly days with their window. The Hokkaido jp-10 strip is an unscaled Example. Every teaching state is local and never writes the case, URL or history.
- **Chart-JP-PRICE** (storyboard §9), one parameterised module.
  - For the reader's area: a build-cost bar, three purchase-price ticks (cautious, reference, favourable), and the "discount the call needs" band, computed at render from bound fields.
  - The design value is a separate USD label.
  - The "Compare areas" toggle shows the other two muted on the same JPY axis.
  - Every value is in an accessible table.
  - No award price, trade-press figure or observed transaction is plotted.
  - If BUILD-JP-02 is unresolved, withhold the bar and the band, and show the missing-state copy.
- **Limits:** at most about 1,500 SVG nodes per scene. Reduced motion is respected. The mobile layouts follow each shot's Mobile row.
- **Tests:** `tests/jp-story-scenes.test.js`.
  - Every shot id has a scene in all three compositions.
  - Node counts are under the limit.
  - Labels come from the content's keyed `labels`.
  - Example tags are present where specified.
  - Planned items are dashed.
  - The chart table equals the bound values, and there is no cross-axis mixing of USD and JPY.
  - Teaching controls leave the case untouched.

## Step 4: wiring (fifth PR)

- **Pack:** `src/markets/jp/storyPack.js`.
  - `open(ctx)` resolves the area from `ctx.row.id` (`jp_tokyo` → `tokyo`, and so on). Any other id returns `null`.
  - It applies Poland's four guards **per area**: market id, lens `infraFund`, call/play/stale via `isStale()` and `storyMatches()`, and play hours.
  - It composes that area's story and calls `openStory()`.
  - A stale or mismatched area returns `null` and the page opens the research dialog. **The other two areas are unaffected.**
- **Registry:** `src/experience/story/registry.js`. Add one shared loader constant and three entries, `jp_tokyo`, `jp_kyushu` and `jp_hokkaido`, each `released: false`, with a comment citing the G-1 sign-off. `storyFor()` is unchanged.
- **Chunk:** confirm the build emits a **single** `story-jp-*.js` used by all three ids, with no per-id copies.
- **Budget:** `tests/bundle-budget.test.js`.
  - Add `'story-jp': 40` to the feature caps.
  - Add one test on the GB/CAISO pattern measuring the complete additional static JS graph of `story-jp`, plus its lazy CSS, against 40 KiB gzip.
  - Assert no Japan story content or styles are in the home or market first-load graph.
  - The existing `story-${id}-` assertion keys Japan as `jp`; keep it passing.
  - Do not loosen any other market's cap.
- **Tests:** `tests/jp-story-wiring.test.js`.
  - Three ids, one loader and one chunk.
  - `storyFor` returns null for each id without `?story=preview`, and returns the entry with it.
  - Each area opens on its own row and refuses the other two rows.
  - A stale tuple or wrong hours in one area does not block the others.
  - `?view=story&chapter=…&shot=jp-tokyo-07` opened on `/markets/japan-kyushu` falls back to the chapter's first shot.
  - Back, refresh and language switching restore the place.
  - `?region=compare` is ignored by the story.
- **Browser checks** (Playwright, as for the GB, CAISO and Poland stories), on desktop and mobile, for each of `/markets/japan-tokyo`, `/markets/japan-kyushu` and `/markets/japan-hokkaido` with `?story=preview`:
  - no story request before opening;
  - the pack opens from the research button;
  - all fourteen shots render in both languages, with their markers;
  - the chart's area toggle works;
  - section hand-offs (`#bankable`, `#revenue`, `#execution`, `#downside`) go to the area's own page;
  - focus is managed correctly, and the fallback works.

## Rules throughout

- **Confidentiality.**
  - Check every name against `local-data/markers.json` before writing it anywhere, including commit messages, PR titles and bodies, and branch names.
  - Never copy anything from `local-data/` into tracked files.
  - Name no award holder, developer, project or site.
  - The reference supplier stays unnamed on the page.
  - The OCCTO Round 3 award list (SRC-JP-02) contains company and unit names: none may enter code, tests, fixtures or text.
  - On a new worktree, restore the guard inputs as `AGENTS.md` describes, and confirm `npm run guard:staged` scans before the first commit.
- **Numbers.** No model, view, weight, rate, fixture or snapshot change. Never regenerate a fixture. Every page figure is bound. Changing a bound owner's value is out of scope; report it as a judgement call.
- **Scope.** No change to the story kit, shell, place, router, contract or shared marker. If one seems necessary, stop and ask; the storyboard says none is needed. Shared files may change only as listed above (registry, budget test), with the reason recorded in the reuse report.
- **Language.** Use the storyboard's English and Chinese exactly. Source titles keep their original language.
- **Evidence semantics.** Observations are solid, plans dashed, teaching values tagged Example. Event and interpretation stay separate (CL-JP-18 and CL-JP-28 are labelled interpretations). Curtailment is never drawn as revenue. A study cap is never shown as capacity. There is no cross-area curtailment ranking.

## Checks before each PR

Run `npm test`, `npm run test:current`, `npm run build`, `npm run test:budget` and `npm run test:e2e`, plus `npm run etl:verify` on the data PR. Record exact-head counts and timings in each PR body, as earlier stacks did. Preview only built output (`npm run build`, then `npm run preview` on loopback); never share the dev server. Commit on a feature branch per layer and open PRs **only when the analyst asks**; end PR bodies with the attribution line in force.

## Step 5: G-2 reuse report and handoff

Write `jp-g2-reuse-report.md` on the GB report's pattern.

- **Entry:** the baseline commit and the three reviewed tuples.
- **Reuse by layer**, and the time spent on each.
- **The shared-pack outcome:** one chunk, measured gzip bytes for the chunk, the extra graph and the CSS against the cap, and whether the copy weight matched the storyboard's estimate.
- **Shared files changed, and why.**
- **The gaps and fallbacks still active:** BUILD-JP-02, FUNDING, CHARGECTRL, FC2011, HOLDERS, CURTAIL, TERM and CERT.
- **The analyst's G-2 walkthrough list**, for each area in both languages:
  - the anchor and fallback;
  - all fourteen shots and markers;
  - the shared shots identical across areas;
  - the Chart-JP-PRICE bases and toggle;
  - the approximate map and frequency band;
  - Examples and dashed plans;
  - no names anywhere;
  - focus, history, language and mobile behaviour;
  - the measured budget.

**Done:** five layer PRs (evidence, data, content, scenes, wiring) stacked and green at exact head, all three ids `released: false`, and the reuse report ready for the analyst's G-2. Report back with:

- the PR links;
- any rule-11 or judgement-call findings;
- the BUILD-JP-02 resolution;
- the measured budget;
- the walkthrough URLs for the three areas.
