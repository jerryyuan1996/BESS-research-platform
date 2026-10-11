# Investability Phase 3 — automation: the plan, for sign-off

**Status: awaiting Jerry's sign-off. No code has changed.** Written 2026-10-11 against
`docs/investment-view-revision-plan-2026-10-10.md` §3.7, §7, §8 (phase 3 row) and §9 rows 5–7,
on a branch that contains the merge of the home inversion (PR #13).

This phase reverses an enforced rule. Today only the analyst may write the view store and
nothing under `etl/` can reach the writer. After it: **judgement publishes automatically after
validation; methodology never does.**

## 0. What needs your answer

Six decisions. Everything else below follows the main plan as you signed it.

| | Decision | My recommendation |
|---|---|---|
| Q1 | The first data rule (§5). No published feed bears on an anchored grade today, so the only honest rule a feed supports moves a **trend**, not a grade number or a verdict, and it will not fire today | Approve it as written, accept that the live exit condition is not met this phase, and treat the feed in §5.4 as the follow-up that meets it |
| Q2 | A rule is a trigger record with an `effect`, and it lives in `view/markets/wa.json`. Putting it there is an analyst-authored view write, which the brief for this phase did not allow for ("the only write to `view/` is the one a rule makes") | Let me write that one trigger record through the writer, authored `analyst`, with the text in §5. Without it there is no rule to run on a real refresh, only a fixture |
| Q3 | Guardrail E's cap on machine changes per run | 3 across all markets. Over the cap the run writes nothing |
| Q4 | Guardrail H's weekly digest: where the "one message a week" goes | A GitHub issue on this private repository, opened by the workflow each Monday, labelled `view-digest`. It needs `issues: write` on that one job |
| Q5 | Assumption overrides (§7.2 "assumptions are overrides", guardrail B) | **Not in this phase.** See §8.1. It moves published IRRs in several markets and deserves its own plan with derivations |
| Q6 | `narrative.thesis` and the manifest `status` chip still live in `src/` | Keep them `METHODOLOGY` in the authority tables. The machine-writable thesis is the view store's `thesis`. See §8.2 |

## 1. Authority classes

### 1.1 Who may write the view

Three author kinds, defined once in `view/schema/view.mjs` as a rights table and asked through
`authorMayWrite(path, kind, context)`. `PERMITTED_AUTHORS` becomes `['analyst', 'rule', 'agent']`.
`HELD_AUTHORS` stays `['analyst']` and is not derived from the first list.

| | `analyst` | `rule` | `agent` |
|---|---|---|---|
| `grades.<dimension>` | Create, replace, remove | Replace only, and only the fields `grade`, `trend`, `trendCause` named by the firing trigger's effect | Replace only; fields `grade`, `trend`, `trendCause`, `reason`, `evidence`, `basis` (never to or from `practitioner`) |
| `verdicts.<archetype>` | Create, replace, remove | Replace only, and only `call` (with `waitingFor` when the call is `wait`) as the effect names it | Replace only; `call`, `because`, `despite`, `waitingFor` |
| `thesis` | Yes | No | Yes |
| `triggers.<id>` | Yes, including an `effect` | No | Only with `effect: null`. An agent cannot write a rule |
| `grades.<dimension>.held` | Yes | No | No |
| A record whose `lockedUntil` is today or later | Yes | No | No |
| A grade whose `basis` is `practitioner` | Yes | No | No |
| Writes land today | Yes | Yes | **No.** `LIVE_AUTHORS = ['analyst', 'rule']`; an agent change can be prepared and reported, never applied, until phase 4 flips it |

Two rows are mine rather than the plan's, and are yours to strike. A **practitioner grade** has
no public evidence and its reason is in the private overlay, so a machine that cannot see the
reason should not be the one to replace the grade. And **only the analyst writes a trigger with
an effect**, because otherwise the agent could write itself a rule and the rule class would
inherit whatever the agent was persuaded of.

A rule change is checked against the rule: the writer loads the trigger named on the change,
confirms it is in that market's view, is `kind: 'data'`, carries an effect and was last written
by the analyst, and that the new record equals the current record with exactly the effect's
fields changed plus the stamps (`author: 'rule'`, `asOf`). A rule cannot do anything its
analyst-written effect does not say.

### 1.2 The class table in `src/governance/authority.js`

- Adds `AUTHORITY.VIEW` (`'view'`), labelled in both languages, with `VIEW_AUTHORITY` naming
  the four view sections. `canMachineWrite(VIEW)` is true, and the comment says where the real
  check is: the gate, not this flag.
- Adds `METHODOLOGY_SURFACES`: an explicit, human-readable list of what no machine author may
  ever write — archetype weights, pillar weights, reads tables, knock-outs, limits, grade
  anchors, score bands, discount rates and exit yields, the comparison window, risk classes, the
  drift thresholds, and the automation guardrail constants of §3. Each names the module that
  holds it. A test walks the list and asserts each module is under `src/` and that no view path
  resolves into it.
- `MACHINE_WRITABLE` gains `VIEW`. `MACHINE_PROPOSABLE` is unchanged. Every existing entry of
  `COMPARISON_AUTHORITY`, `MANIFEST_AUTHORITY` and `ASSUMPTION_AUTHORITY` is unchanged.
- The header's rule is rewritten to the new sentence.

## 2. The pinned tests that change

Nine existing tests change. Nothing in `tests/baseline.test.js` or `tests/current-model.test.js`
is touched.

| Test | Asserts today | Will assert |
|---|---|---|
| `view.test.js` — "nothing in the committed store was written by automation" | `PERMITTED_AUTHORS` is `['analyst']`; every entry and record is the analyst's; no trigger has an effect | Renamed "every machine-written line in the committed store is accounted for". `PERMITTED_AUTHORS` is exactly `['analyst','rule','agent']`, `LIVE_AUTHORS` exactly `['analyst','rule']`, `HELD_AUTHORS` exactly `['analyst']`. No committed entry is the agent's. Every `rule` entry names a trigger of that market that carries an effect, was last written by the analyst before the entry, and carries snapshot evidence with a checksum. Every record's `author` matches the author of the last changelog entry for its path. Every trigger with an effect was written by the analyst |
| `view.test.js` — "only the analyst may write the view" | `agent`, `rule`, `etl`, undefined are all refused | Renamed "each author writes only what its class allows". `etl`, undefined and any unknown kind are still refused everywhere. A rule is refused on `thesis`, `triggers.*`, a held path, a removal, a creation, a pinned record, a practitioner grade, a change naming no trigger, and a change that differs from its trigger's effect by one field. An agent change prepares and is refused on apply. Nothing is on disk after any refusal |
| `view.test.js` — "a refused change writes nothing at all" | Includes "a trigger with an effect is refused" | That line becomes: an analyst may store a well-formed effect; an effect naming a methodology path, a held path, a whole record, or a field outside the allowed list is refused. All other lines unchanged |
| `view.test.js` — "the ETL cannot reach the view writer, and nothing in the app writes the view" | No file under `etl/`, `src/`, `.github/` names the writer | Renamed "the view has one writer and two doors". Only `etl/rules.mjs`, `agent/run.mjs` and `scripts/view/writer.mjs` import `etl/lib/viewWriter.mjs`. Nothing under `src/` does. Nothing under `etl/` or `agent/` imports `scripts/view/writer.mjs` (the analyst's door, which reads the overlay), names `local-data`, or imports `src/local/` |
| `entry-ledger.test.js` — the trigger validator's "effect must be null" case | An effect is refused | A well-formed effect validates; a malformed one is refused with the reason; `kind: 'data'` requires a `when`, and an effect on a data trigger requires a `note` in both languages |
| `governance.test.js` — "the judgement fields the analyst reserved are methodology, not analyst" | Thesis and status cannot be proposed | Renamed "judgement is view-store content; methodology cannot be written or proposed". The view's `thesis`, `grades` and `verdicts` are class `VIEW`. `score.composite`, the renewal curve, every `METHODOLOGY_SURFACES` entry, and (per Q6) `narrative.thesis` and `status` in `src/` are `METHODOLOGY`, not writable, not proposable |
| `governance.test.js` — "nothing anywhere is machine-writable except observed and derived" | No configured field is machine-writable | Renamed "three things are machine-writable: observed, derived, view". The existing loop stays as it is: no comparison, manifest or assumption field is machine-writable. Added: `MACHINE_WRITABLE` is exactly the four data classes plus `VIEW`; no methodology spelling parses as a view path for any author (the existing refused list, run for all three kinds); a market view holding `weights`, `anchors`, `limits`, `bands` or `assumptions` is invalid |
| `governance.test.js` — "the ETL write boundary rejects every path outside public/data/public" | One root | Unchanged for the data boundary. Added beside it: the view writer's root accepts `markets/<id>.json`, `index.json` and `changelog.jsonl` and nothing else — it refuses `view/schema/view.mjs`, `src/…`, traversal, and an id that is not a market id |
| `governance.test.js` — "no ETL module writes to the filesystem except through the boundary" | Four exempt files | `lib/viewWriter.mjs` joins the exempt list as the second exit. `rules.mjs` is not exempt: it writes the view through the writer and its report through a helper that only resolves into `etl/out/` |

**Kept exactly as they are, deliberately:** "the scheduled workflow never enables auto-merge"
(machine changes go through the writer, never through a merged pull request); "a path names one
whole record, and no path spells methodology"; "a held view is written by the analyst alone" and
"the held gate does not move when the general gate is widened" in `held-grade.test.js` — the
second was written to survive this day and should pass without an edit, which is itself the
check.

**New tests**, in `tests/view-automation.test.js` and `tests/rules.test.js`: one per guardrail
(§3), the rule on a fixture snapshot, idempotence, the dry run, revert, and the agent's gate with
a stubbed model.

## 3. Guardrails A to I, and where each is enforced

Constants live in a new `src/governance/automation.js` — in `src/`, so no machine author can
reach them, and listed in `METHODOLOGY_SURFACES`.

| | Guardrail | Enforced in | Tested in |
|---|---|---|---|
| A | No change without a source fetched in that run | `etl/lib/viewWriter.mjs`: a machine change with no evidence record is rejected. A rule's evidence is the snapshot: dataset, publisher, URL, `retrievedAt`, the content checksum, the field, the observed value and the threshold. `etl/rules.mjs` evaluates a dataset only if `etl/run.mjs` fetched and validated it in the same run (`summary.json` gains a `fetched` list) and its checksum verifies. An agent's evidence must be a page the run itself fetched, hashed, and in which the quotation (300 characters at most) is found verbatim | `rules.test.js`, `view-automation.test.js` |
| B | Assumptions stay inside the declared band | By absence this phase: there is no `assumptions` section and no assumption path parses (Q5). The existing assertions that say so stay | `view.test.js`, `governance.test.js` |
| C | One step a run, unless a rule you wrote says otherwise | `viewWriter.mjs`: an agent grade moves by at most 1 and a verdict by one place on the ordered scale. A rule moves exactly what its effect says, which is the "unless". No machine author may write a call of `not-accessible` or move one away from it, since that call is a knock-out's reading and not a step on the scale | `view-automation.test.js` |
| D | Pins | `viewWriter.mjs`: a machine change to a record whose current `lockedUntil` is on or after the run date is rejected, and a machine author may not set or clear `lockedUntil` | `view-automation.test.js` |
| E | A cap per run; over it, nothing is written | `viewWriter.mjs` `applyBatch`: every change is prepared first; if the count exceeds `MAX_MACHINE_CHANGES_PER_RUN` (Q3) or any one fails the gate, nothing is written and the whole batch goes to the rejected file | `view-automation.test.js`, `rules.test.js` |
| F | Seasonality and materiality guards still apply | `etl/rules.mjs`: a price-derived field is tested only when the snapshot covers at least `MIN_WINDOW_DAYS` complete days (300, the figure `etl/run.mjs` already uses for the anchor warning, moved into `automation.js`) and the snapshot is inside its own `staleAfterHours`. A rule whose threshold is derived from a drift band reads that band from `materiality.js` at build of the rule, and the test recomputes it | `rules.test.js` |
| G | A verdict change needs one official source or two independent ones | `viewWriter.mjs`: for a machine change to `verdicts.*`, the evidence must hold one record of class `official`, or two whose publishers and hosts differ. A dataset's class comes from a hand-set `official` flag in `src/governance/datasets.js` | `view-automation.test.js` |
| H | A weekly digest of machine changes | `scripts/view/digest.mjs` reads the changelog and renders the last seven days of `rule` and `agent` lines; a weekly job in `.github/workflows/etl.yml` posts it (Q4). An empty week posts nothing | `view-automation.test.js` (the renderer) |
| I | One command reverts a change by id | `node scripts/view/writer.mjs revert <changelog-id>`: an analyst change restoring `from`, refused if the path has moved on since, recorded with `reverts: <id>`. A reverted rule does not fire again: a rule fires once per arming, and it is re-armed only when the analyst rewrites its trigger record | `view-automation.test.js`, `rules.test.js` |
| J | Held views are yours alone | Already enforced by `HELD_AUTHORS` and `writePath`; both untouched | `held-grade.test.js`, unchanged |

The gate of §7.4, line by line: schema and both languages (`validateMarketView`, existing);
changelog line agrees with the change (the writer builds the line from the change, and the
replay test proves it); evidence fetched and resolved (A); no methodology path, no pinned field
(`parsePath`, D); no held view (J); assumption band (B, by absence); confidentiality scan — the
workflow runs the staged scan against the marker set **before** the view commit, and a failure
discards the view change and fails the job. A rejected patch is written to
`etl/out/view-rejected.json`, uploaded with the drift report, and commits nothing.

## 4. The shape of a rule

A rule is a trigger with a `when` and an `effect`. `validateTrigger` in
`src/governance/triggers.js` learns both; `effect: null` stays valid and stays the norm.

```javascript
{
  id: 'wa-wem-spread-compression', kind: 'data', market: 'wa',
  label: [en, zh], expected: null, watches: ['assetReturn'], direction: 'down',
  source: { publisher: 'AEMO', url: 'https://data.wa.aemo.com.au/', access: 'opened' },
  when: {
    dataset: 'wa-wem-prices',                 // must be in the dataset catalogue
    field: 'derived.spreadMean',              // a dotted path into the published summary
    op: '<',                                  // < <= > >=
    value: 45.05,
    guard: [ { field: 'derived.spreadDays', op: '>=', value: 300 } ],
    basis: [en, zh],                          // where the number comes from, in words
  },
  effect: [                                   // field-level, inside one or more records
    { path: 'grades.assetReturn.trend', to: 'deteriorating' },
    { path: 'grades.assetReturn.trendCause', to: [en, zh] },
  ],
  note: [en, zh],                             // becomes the changelog reason when it fires
}
```

- **An effect path names one field inside a record**; the store still replaces whole records.
  The engine reads the current record, sets the effect's fields, stamps it, and submits the
  whole record. Allowed fields: `grades.<dimension>.{grade, trend, trendCause}` and
  `verdicts.<archetype>.{call, waitingFor}`. Nothing else parses, so `held`, `lockedUntil`,
  `basis`, `evidence` and every methodology spelling are refused by construction.
- **`kind: 'data'` requires `when`.** No committed trigger is `data` today, so nothing breaks.
  An `event` trigger may carry an effect for the agent to apply later; nothing executes it in
  this phase.
- **The changelog line** has `author: { kind: 'rule', rule: '<trigger id>' }`, `trigger`, the
  `note` as reason, and the snapshot evidence of guardrail A.
- **Idempotent, and one-shot.** A rule has fired if the changelog holds a `rule` entry for its
  trigger id later than the analyst's last write of the trigger record. A fired rule is skipped.
  So a second run on the same snapshot writes nothing, a series hovering at the threshold cannot
  flap, and your revert stands until you re-arm the rule by rewriting it.

`etl/rules.mjs`: `node etl/rules.mjs` after a refresh; `--dry-run` writes nothing and prints, per
rule, the observed value, the threshold, each guard, and the change it would make. It reads
`public/data/public/`, `view/` and `src/governance/`. It never reads `local-data/`.

## 5. The first data rule

### 5.1 What the feeds can and cannot say

Ten feeds are in the catalogue and six publish: ECB FX, the industry news feed, three JEPX area
prices, and WEM reference prices. The four ENTSO-E day-ahead feeds (Great Britain, Ireland,
Romania, Poland) need a token and have no published snapshot. Of the four graded markets, **only
Western Australia has a published feed**, and it is a price series.

No anchored dimension is written in terms of a price series. Saturation is anchored on storage
megawatts against a reserve requirement and system peak; revenue certainty on secured share and
tenor from the engine's approved inputs; asset return is a rank of engine IRRs, which move only
when an approved assumption does. So no feed published today can cross an anchor boundary, and I
will not write a rule that moves a grade number or a verdict on a price series: there is no
derivation for it that I could defend to you.

What a price series can honestly support is a **trend**: the grade record's "direction over the
last 24 months", which already exists, already requires a named cause, and is a change to a
grade record that goes through the same gate.

### 5.2 The rule

| | |
|---|---|
| Feed | `wa-wem-prices`, the published summary `public/data/public/wa-wem-prices.summary.json`. AEMO WEM data, an official source, refreshed daily by the workflow |
| Field | `derived.spreadMean`: the mean daily spread between the reference project's discharge and charge hours, over the trailing window, in AUD/MWh |
| Guard | `derived.spreadDays >= 300`, and the snapshot inside its `staleAfterHours` (guardrail F) |
| Threshold | `< 45.05` AUD/MWh |
| Moves | `grades.assetReturn` in Western Australia: `trend` from `stable` to `deteriorating`, with a cause in both languages. The grade stays 4. No verdict moves |
| Changelog reason | "The trailing-year wholesale spread has fallen a fifth below its level when the grade was set. The engine's merchant assumption has not been revised, so the rank is unchanged." |

### 5.3 The derivation

- **Baseline 56.31 AUD/MWh.** `derived.spreadMean` in the snapshot fetched 2026-10-10T21:50Z,
  over 353 complete days (content checksum `sha256:2193d81b…`). The asset-return grade is dated
  2026-10-10, so this is the spread on the day the grade was written.
- **Fraction 0.20.** The `ceiling` you declared for `economics.merchGross` in
  `src/governance/materiality.js`: the move at which drift in the assumption this dataset bears
  on is "material regardless of the modelled impact". The rule borrows your number and does not
  introduce one.
- **Threshold = 56.31 × (1 − 0.20) = 45.048, written 45.05.**
- **Why asset return and not saturation.** A narrowing spread is the saturation anchor's own
  marker, but Western Australia's saturation grade is a practitioner grade, which §1.1 keeps
  out of a machine's reach. Asset return is a derived grade with a public reason.

Today the field reads 56.31, so **the rule does not fire and the phase's live exit condition is
not met.** I will not move the threshold to make it fire.

### 5.4 What would meet the exit condition live

1. The trailing-year WEM spread falling 20%. Not something to wait for.
2. **A feed that reports a quantity an anchor is written in.** The cleanest is operating and
   committed storage capacity against system peak for a graded market: the saturation anchors
   are numeric (5%, 10%, 20%, 40% of peak), so the rule's threshold *is* the anchor boundary and
   needs no borrowed fraction. Great Britain's and Finland's saturation grades are both derived,
   at 2. That is a new connector and a rule you write, and I will propose it as a follow-up.
3. An ENTSO-E token as a repository secret, which would publish the Great Britain and Romania
   price feeds. It widens what trend rules can cover; it does not by itself give a grade rule.

In this phase the rule is demonstrated on a fixture snapshot in `tests/rules.test.js` (it fires,
writes the market file, the index and one changelog line, does not fire twice, and is reverted),
and the dry run against the real snapshot is shown in the PR.

## 6. The agent

Built, and run dry only.

| | |
|---|---|
| Where | `agent/run.mjs`, run by a scheduled job in `.github/workflows/etl.yml`. It refuses to start outside CI, and refuses if a `local-data/` directory exists beside it |
| Secret | The job needs a model API key as a repository secret. **I will not add or use one.** The step is gated on the secret being present, so it is inert until you add it; without it the run reports "no key, nothing evaluated" |
| Scope this phase | The daily pass only: markets with a trigger due within 30 days or overdue. The weekly deep review and the scout cards are phase 4 |
| Reads | The published snapshots, `etl/out/drift-report.md`, the news feed, the market's view file, its source register, and the pages it fetches |
| Cannot read | `local-data/` (absent in CI and refused if present), `src/local/`, or any file outside the list. A test scans `agent/` and `etl/` for both names |
| Web access | The run's own code fetches the URLs — register entries and trigger sources for the market — with plain HTTPS, hashes each page, and gives the model the text. The model has no tools and no shell. It returns a structured patch |
| Evidence | Each change cites pages from that fetch. The run checks that every quotation appears verbatim in the page whose hash it cites; a quotation that does not is a rejection (guardrail A, mechanically) |
| Output | `etl/out/agent-report.md` and `.json`: each change it would make, with from, to, reason, evidence, and whether the gate would have passed it and why not. The model id and prompt version are recorded. Uploaded as a workflow artifact |
| Writes | Nothing. It calls the writer's `prepare`, never `apply`, and `LIVE_AUTHORS` excludes it, so `apply` would refuse it even if called |

Fetched page text is data. The prompt says so, and the structure is what holds: whatever a page
says, the only thing the model can produce is a patch, and the gate decides the patch.

## 7. `/changes` and the changes panel

- `/changes` is a new lazy route with its own named chunk. The full changelog (86 kB raw today)
  is emitted at build as its own asset by `vite-plugin-view-changes.js` and fetched only by that
  route, so neither the entry chunk nor the home first view grows by more than the route entry
  and one link. Budgets stay 222 kB and 268 kB; I will report both before and after.
- Filters: market and author (analyst, a named rule, an agent run), in the URL. Each entry shows
  who, when, the field, before and after, the reason, and the evidence. No badge on any verdict
  (§7.5).
- The home panel's "what changed" links to `/changes`; the Investment Case tab links to
  `/changes?market=<id>`. Every string is an `[en, zh]` pair.

## 8. What in section 7 I will not build as written

1. **Assumption overrides (§7.2, guardrail B).** The view store has no `assumptions` section
   and a test asserts the path does not parse. Building it means applying overrides at market
   registration, which changes published IRRs across markets and touches how the comparison
   engine is fed. That is a multi-market model change under your standing preference, and it is
   not in the phase 3 row of §8. `etl/propose.mjs` therefore stays exactly as it is.
2. **Reclassifying `narrative.thesis` and `status` (§7.7 row 1).** The plan says they become
   view-store fields. They still live in `src/`, where no machine writes whatever the table
   says, and calling them `VIEW` would describe a move that has not happened. The view store's
   own `thesis` is `VIEW`. Moving the old fields is phase 5 work, with the tabs.
3. **The writer's location.** The plan puts one writer at `etl/lib/viewWriter.mjs`. It becomes
   that, with two doors: `etl/rules.mjs` and `agent/run.mjs` call it directly, and
   `scripts/view/writer.mjs` stays as the analyst's command line, wrapping it with the one check
   that needs the private overlay (a held view's reason). The core never reads `local-data/`.
4. **"Fetched in that run" for a rule** is read as: fetched and validated by the `etl/run.mjs`
   invocation the rules step follows. A dataset that was skipped or failed is not evaluated,
   even if a recent snapshot is on disk.
5. **The Evidence tab (§7.5's third place for authorship).** Not built; the Investment Case tab
   links to the market's filtered `/changes` instead. The tab arrives with the phase 5 merge.
6. **The `/data` page's statement of the rule** is rewritten with the README and the two
   governance documents. `src/governance/PILOT-FROZEN.md` is unchanged (§9 row 7).

## 9. Order of work after sign-off

1. `automation.js`, `authority.js`, `triggers.js`, the schema's rights table; rewrite the nine
   tests and add the new ones.
2. Move the writer core to `etl/lib/viewWriter.mjs`; `revert`; the batch gate and rejected file.
3. `etl/rules.mjs`, the `fetched` list in the run summary, the workflow steps and the widened
   wall check (only `public/data/`, `view/markets/`, `view/index.json`, `view/changelog.jsonl`).
4. If Q2 is yes: write the one trigger record through the analyst's door.
5. `/changes`, the panel link, bundle measurements.
6. The agent, dry, with a stubbed-model test; the inert workflow step; the digest.
7. README, `docs/governance.md`, `docs/architecture.md`, the `/data` page.
8. `npm run build`, `npm test` with the confidentiality scans against the marker set, browser
   checks at desktop and phone widths in both languages, PR against `main`.
