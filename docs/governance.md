# Governance — who may change what

**Judgement publishes automatically after validation; methodology never does.**

This platform fetches public data automatically and recomputes its model automatically. Since
2026-10-11 it may also change a grade or a verdict automatically, when a rule the analyst wrote in
advance fires, and the change passes a validation gate. It never changes methodology: a scoring
weight, a grade anchor, a limit, a score band or a discount rate. This document is the rule, the
mechanism that enforces it, and the reasoning behind both.

Until 2026-10-11 the rule was "no judgement is automated". The analyst reversed it on 2026-10-10
(`investment-view-revision-plan-2026-10-10.md` §7) and the change was built to
`investability-phase-3-plan.md`, which lists every test that was rewritten and why.

**What a reader is looking at.** A grade or a verdict on this site was set by the analyst, or was
changed by one of his rules when a published figure crossed the line he set. Nothing on the page
marks which. The changelog does: `/changes` shows every change with who made it, when, what it held
before and after, the reason and the evidence.

---

## The rule

| | |
|---|---|
| Observed public data | **Publishes automatically** after validation |
| Deterministic derived metrics | **Publishes automatically** after validation |
| Model outputs | **Recompute automatically** — using the currently *approved* methodology and assumptions |
| Judgement in the view store: grades, verdicts, the thesis, triggers | **Publishes automatically** after validation, within the rights of the author that wrote it — see *The view store* below |
| Analyst assumptions in the model | Automation may **propose**. It may never apply. |
| Methodology: scoring weights, grade anchors, knock-outs and limits, score bands, discount rates and exit yields, the comparison window | Automation may **not change one and may not even propose it** |
| The analyst's held view, and any record he has pinned | His alone |
| The analyst's private notes | Invisible to automation |

Material drift between observed data and an approved assumption opens an evidence-backed pull
request showing its downstream model impact. **It never auto-merges.** Non-material drift goes into
the drift report and nothing else.

---

## The authority classes

Defined once, in [`src/governance/authority.js`](../src/governance/authority.js). Nothing else in the
codebase decides that a value is machine-writable — everything asks there.

| Class | What it covers | Automation may |
|---|---|---|
| `observed` | Fetched from a public source | write freely |
| `derived` | A fixed formula over observed data | write freely |
| `view` | Judgement in the view store: a grade, a verdict, the thesis, a trigger | write **through the view writer's gate**, within its author's rights |
| `analyst` | An assumption a public observation bears on | **propose only** |
| `methodology` | Scoring weights, anchors, limits, score bands, discount rates | **nothing** |
| `config` | Ids, slugs, flags, colours, locales | nothing |

`METHODOLOGY_SURFACES` in the same file names every piece of methodology and the module that holds
it. A test walks the list and asserts that each module is behind both walls and that no spelling of
one parses as a view-store path, for any author.

The old `narrative.thesis` and manifest `status` fields still live in `src/` and stay `methodology`.
The thesis a machine may write is the view store's own.

### Why `view` and `methodology` are separate

A grade is a reading against an anchor, and readings change when the world does: a source or a
published figure can bear on one. An anchor, a weight or a discount rate is a position. No
observation implies it, and a machine has no standing to argue one. The two used to share a class
and a wall. They now share neither: judgement lives in `view/`, behind its own writer and gate, and
methodology stays in `src/`, which nothing unattended can write.

### Why `analyst` and `methodology` are separate

This is the distinction that does the real work, and it is worth stating plainly.

Automation may propose a change to `economics.merchGross` because a public price series is evidence
about merchant revenue. It may not propose a change to `EXIT_Y_MERCHANT`, because no feed anywhere
implies a discount rate. A discount rate is a position on risk. So is a composite score, so is a
thesis, so is calling a market "Selective".

A machine that proposed those would not be surfacing evidence — it would be inventing an opinion and
dressing it as a finding. Separating the two classes makes that impossible rather than merely
discouraged.

### Failing closed

An unclassified field resolves to `methodology`, the most restrictive class. Forgetting to classify
something makes it *untouchable*, never writable. `tests/governance.test.js` additionally asserts
that every field present in every market's comparison interface appears in the table, so a new field
cannot reach production unclassified in the first place.

---

## The view store — three authors

`view/markets/<id>.json` holds a market's grades, verdicts, triggers and thesis. `view/index.json`
is the verdicts alone. `view/changelog.jsonl` is every change, one line each, append-only. The
schema, [`view/schema/view.mjs`](../view/schema/view.mjs), holds a rights table per author.

| | `analyst` | `rule` | `agent` |
|---|---|---|---|
| A grade | create, replace, remove | replace: only `grade`, `trend`, `trendCause`, and only as its trigger's effect says | replace: those, and `reason`, `evidence`, `basis` |
| A verdict | create, replace, remove | replace: only `call`, `reviewBy`, `changesIf`, as its effect says | replace: `call`, `because`, `despite`, `reviewBy`, `changesIf` |
| The thesis | yes | no | yes |
| A trigger | yes, including one with an effect | no | only with no effect: an agent cannot write a rule, or change one |
| A held view | yes | no | no |
| A pinned record | yes | no | no |
| A practitioner grade | yes | no | no |
| Changes are applied | yes | yes | **no** — the agent runs dry |

`LIVE_AUTHORS` is `['analyst', 'rule']`. The agent is a permitted author and not a live one: its
change can be prepared and reported, and the writer refuses to apply it. Adding it to that list is
the analyst's decision, planned for after it has earned it on scout cards.

### Rules

A rule is a trigger with a `when` and an `effect`, written by the analyst: *when this published
figure crosses this line, make this change*.

```javascript
{ id: 'wa-wem-spread-compression', kind: 'data', market: 'wa',
  when: { dataset: 'wa-wem-prices', field: 'derived.spreadMean', op: '<', value: 45.05,
          guard: [{ field: 'derived.spreadDays', op: '>=', value: 300 }],
          basis: ['…where the number comes from…', '…'] },
  effect: [ { path: 'grades.assetReturn.trend', to: 'deteriorating' },
            { path: 'grades.assetReturn.trendCause', to: ['…', '…'] } ],
  note: ['…the reason recorded when it fires…', '…'] }
```

[`etl/rules.mjs`](../etl/rules.mjs) runs after each refresh. It reads the dataset's published
summary, tests the `when`, and hands the effect to the view writer. It decides nothing: the line,
the figure and the change were all written in advance, and the writer checks that the change is
exactly the rule's effect. `node etl/rules.mjs --dry-run` tests every rule and writes nothing.

- **An effect names fields, and few of them**: a grade's number, trend and trend cause; a verdict's
  call, review date and triggers. No spelling reaches a held view, a pin, a basis, evidence, the
  thesis, another trigger or methodology.
- **A rule fires once.** It is armed when the analyst writes its trigger record and stays fired until
  he writes that record again. A second run on the same snapshot does nothing, a figure hovering at
  the line cannot flap, and a change he reverted stays reverted.
- **A rule is not tested on a snapshot it cannot trust**: one this run did not fetch and validate,
  one past its own staleness limit, one whose checksum does not verify, or a price-derived figure
  over fewer than 300 days.

The first rule is the one above. Its line is the trailing-year spread on the day the grade was set,
less the 20% at which `materiality.js` treats drift in merchant revenue as material. It moves a
trend and not a grade number, because no feed published today reports a quantity an anchor is
written in. A test fails if the threshold stops matching that derivation.

### The agent

[`agent/`](../agent/) is for what no rule anticipated: an event trigger has no feed, so somebody has
to establish from a source that the event happened. It runs **in CI only, and dry**.

- It looks at markets with a trigger due inside 30 days, or overdue.
- Its own code fetches the pages those triggers cite and hashes them. The model is given the text
  and has no tools: it can only return a proposal in a fixed shape.
- Every quotation is checked, character for character, against the page it cites. One that is not
  there discards the proposal.
- Each surviving change is put to the writer's `prepare`. The report says what would have changed
  and what the gate said. Nothing is written.
- It needs a model key as a repository secret, `ANTHROPIC_API_KEY`. Without one the job does
  nothing. It cannot see `local-data/`: the folder is not in a CI checkout, the job checks that
  before it starts, and nothing under `agent/` or `etl/` names it.

### The guardrails

Each bounds what one bad run can do without adding an approval step. The constants are in
[`src/governance/automation.js`](../src/governance/automation.js), which is methodology.

| | Guardrail | Enforced in | Tested in |
|---|---|---|---|
| A | No change without a source fetched in that run | `view.mjs` `evidenceProblems`; `etl/rules.mjs` (the run's `fetched` list, checksum); `agent/core.mjs` (quotation in the page) | `view-automation`, `rules` |
| B | Assumptions stay inside the declared band | No assumption path exists in the view store. Overrides are not built | `view-automation`, `governance` |
| C | One step a run, unless a rule says otherwise | `view.mjs` `machineProblems` | `view-automation` |
| D | Pins | `view.mjs` `machineProblems`: `lockedUntil` on or after the run date | `view-automation`, `rules` |
| E | A cap of 3 changes a run; over it, nothing is written | `etl/lib/viewWriter.mjs` `prepareBatch` | `view-automation`, `rules` |
| F | Seasonality and staleness guards | `etl/rules.mjs` | `rules` |
| G | A verdict needs one official source or two independent ones | `view.mjs` `verdictEvidenceSuffices` | `view-automation` |
| H | A weekly digest of machine changes | `scripts/view/digest.mjs`, posted as an issue by the workflow | `view-automation` |
| I | One command reverts a change by id | `node scripts/view/writer.mjs revert <id>` | `view-automation`, `rules` |
| J | Held views are the analyst's alone | `HELD_AUTHORS`, a list that did not widen | `held-grade` |

### Operating it

```bash
node etl/rules.mjs --dry-run --any-snapshot      # what every rule reads today, writing nothing
node scripts/view/writer.mjs apply change.json   # write to the view, as the analyst
node scripts/view/writer.mjs revert <id>         # undo one change; the id is on /changes and in the digest
node scripts/view/digest.mjs --days 30           # machine changes over a period
```

To pin a record against machine changes, set its `lockedUntil` to a date. To re-arm a rule that has
fired, write its trigger record again. To start the agent's dry runs, add the repository secret.

---

## How the rule is enforced

Documentation does not enforce anything. Five mechanisms do.

### 1. Two filesystem walls

[`etl/lib/boundary.mjs`](../etl/lib/boundary.mjs) writes published data and permits exactly one
directory:

```
public/data/public/
```

Path containment is checked on the resolved real path, so `../` traversal and symlinks cannot escape.
A write anywhere else throws `BoundaryViolation` and stops the run.

[`etl/lib/viewWriter.mjs`](../etl/lib/viewWriter.mjs) writes the view and permits three kinds of
file under `view/`: `markets/<id>.json`, `index.json` and `changelog.jsonl`. Not `view/schema/`,
which says who may write what, and not `src/`. It validates before it writes, and appends the
changelog in the same call. A batch that fails anywhere, or exceeds the cap, writes nothing.

A test asserts that no other file under `etl/` or `agent/` so much as imports a filesystem write API,
and that the view writer is imported from exactly three files: `etl/rules.mjs`, `agent/run.mjs` and
the analyst's command line. The workflow checks both walls again after every run, and scans a view
change against the confidentiality marker set before committing it.

### 1a. The analyst's door

`scripts/view/writer.mjs` is the command line a person runs. It wraps the same writer with the one
check that needs the private overlay: a held view cannot be written without a private reason.
Automation has no path to that folder, so through any other door a held view cannot be written at
all.

### 2. Two programs with different powers

| | `etl/run.mjs` | `etl/propose.mjs` |
|---|---|---|
| Runs | unattended, on a schedule | only in the pull-request workflow |
| Branch | commits to `main` | refuses to run on `main` |
| May write | `public/data/` only | analyst files, on a throwaway branch |
| Output reaches the site | directly | only through a human merge |

`etl/rules.mjs` is a third, and belongs with the first: unattended, commits to `main`, and may write
only the view store through its writer.

The guarantee is not that no program can edit `src/`. It is that **no unattended program can**, and
that nothing an automated proposal touches reaches the published site without someone merging it.
Model assumptions still move this way and only this way.

A pull request containing only prose would be unreviewable — the reviewer would have to reconstruct
the change mentally and then make it by hand, which is worse and more error-prone than reading a
diff. So `propose.mjs` makes the edit, on a branch, and stops.

### 3. Checksums

Every snapshot carries a checksum over its payload. `npm run etl:verify` runs in CI on every push and
fails the build if a published file no longer matches its checksum.

The point is narrow and important: a hand-tuned "observed" value is worse than an honest assumption,
because it carries more authority and attracts less scrutiny. If a number is labelled as fetched from
ENTSO-E, it must actually be what ENTSO-E said.

### 4. No auto-merge, asserted

The live-data workflow has no auto-merge path, and a test greps the workflow for every mechanism that
could introduce one — `gh pr merge`, `--auto`, the marketplace action, the GraphQL mutation, a REST
`merge_method`. Adding one fails CI. A rule's change does not need one: it is not a pull request but
a validated write, like the data.

---

## Materiality — when drift is worth your attention

Defined in [`src/governance/materiality.js`](../src/governance/materiality.js). Three bands:

| Band | Meaning | Action |
|---|---|---|
| `noise` | Below the field's floor | none — not even reported |
| `reportable` | Real, but moves no published conclusion | drift report |
| `material` | Past a decision threshold | **pull request** |

`material` requires either:

- the input moved past the field's declared **floor** *and* recomputing the model moves a published
  output past its threshold (50 bps of IRR, 0.05× MOIC, 3 pp of secured share); or
- the input moved past its **always-material ceiling**, regardless of modelled impact.

### Why there is an impact gate at all

Input-space thresholds alone mislead here, and FX is the clean example. The comparison converts capex
and revenue at the same rate, so a 5% FX move barely touches IRR — it rescales the USD headline and
leaves the ordering intact. Filing a pull request every month that says *"GBP moved 5%, IRR
unchanged"* is how a governance process dies: the reader learns the alerts do not matter.

Conversely a modest merchant-revenue revision can move IRR by a full point, because it is net of opex
and lands entirely in the cash flow.

### The seasonality guard

Spreads in every market here are strongly seasonal. An arbitrage index over 44 winter days and one
over a full year are different measurements, and comparing them produces a confident proposal to move
merchant revenue by tens of percent for no reason but the calendar.

This bites hardest during a cold start, while backfill is still filling the window — exactly when
someone is most likely watching and least likely to question a number that looks precise. So a
window shorter than 300 days, or one that differs from its anchor's window by more than 60 days, is
**reported but never proposed**, with the reason stated.

---

## Anchors

Automation cannot verify `merchGross` directly. It bundles balancing and intraday revenue that a
day-ahead price series does not contain, so a pipeline that assigned a price-derived number to it
would be silently deleting revenue streams.

Instead, drift is measured as **movement against an anchor** — the arbitrage index computed at the
moment you approved the assumption. If the index has risen 18% since, the assumption is 18% stale in
the only dimension the data can speak to.

The ratio construction also cancels most of the parameter error. A wrong realisation factor or cycle
count scales the anchor and the current index by the same amount and largely divides out. An absolute
claim would carry the full error.

**Anchors start unset, and that is a safe state.** With no anchor, the platform reports observations
and proposes nothing. To set one:

```bash
npm run etl
```

It prints each market's current arbitrage index and its window length. When the window is full and
you are satisfied the assumption reflects your view, record both in
[`src/governance/anchors.js`](../src/governance/anchors.js) with a note saying what you were looking
at. Re-anchor whenever you deliberately revise the assumption — otherwise the pipeline will keep
proposing a change you have already made.

---

## The legacy baseline, and why a proposal is allowed to break it

`tests/fixtures/legacy-baseline.json` pins the original prototype's outputs, and
`tests/baseline.test.js` asserts the modular engine still reproduces them. That fixture verifies the
**migration**. It is not an ongoing invariant.

The moment an analyst deliberately revises an assumption, the platform has intentionally departed
from the prototype for that market — that is the entire point of revising it. So:

- `npm test` runs everything, including the baseline. Use it for ordinary work.
- `npm run test:structural` runs registry, governance and finance checks only. **This is what the
  proposal workflow runs**, because a proposal is supposed to move those numbers.
- When you accept an assumption change, regenerate the fixture in the same commit:

  ```bash
  npm run test:baseline
  ```

Running the full suite in the proposal job would fail every legitimate proposal and the mechanism
would never open a single pull request. That trap is easy to walk into — it was hit the first time
this workflow was exercised — and it is worth understanding rather than working around.

What the proposal job *does* still enforce is that the proposed value is a valid market input and
that automation stayed inside its authority. A proposal cannot smuggle in a malformed field or a
change to something it was never allowed to touch.

---

## Reviewing a proposal

Every automated pull request ends with this checklist:

- The source and window are the ones you would have used
- The proposed value is consistent with your view, not merely with the data
- The downstream impact is acceptable and does not misorder the league table
- If you accept a `merchGross` change, **re-anchor**

Rejecting one is just closing it. The pipeline will raise it again while the drift persists — adjust
the assumption, re-anchor, or widen the threshold. All three are analyst decisions and none of them
is automated.

---

## Related

- [`live-data.md`](live-data.md) — the pipeline: sources, connectors, scheduling, operations
- [`data-policy.md`](data-policy.md) — public vs confidential, and what may be republished
- [`comparison-methodology.md`](comparison-methodology.md) — the model the impact gate runs
