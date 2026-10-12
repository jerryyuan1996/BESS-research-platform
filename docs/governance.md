# Governance — who may change what

**Judgement publishes automatically after validation; methodology never does.**

This platform fetches public data automatically and recomputes its model automatically. Since
2026-10-11 it may also change a grade or a verdict automatically, when a rule the analyst wrote in
advance fires, and the change passes a validation gate. It never changes methodology: a scoring
weight, a grade anchor, a limit, a score band or a discount rate. This document is the rule, the
mechanism that enforces it, and the reasoning behind both.

Until 2026-10-11 the rule was "no judgement is automated". The analyst reversed it on 2026-10-10
(`investment-view-revision-plan-2026-10-10.md` §7) and the change was built to
`investability-phase-3-plan.md`, which lists every test that was rewritten and why. The scouting
tier, where an AI agent is an author, was built to `investability-phase-4-plan.md`.

**What a reader is looking at.** A grade or a verdict on a market dashboard was set by the analyst,
or was changed by one of his rules when a published figure crossed the line he set. A scouting
card, for a market with no dashboard, is written by an AI agent from public pages the analyst
listed, and spot-checked by him; `/scout` says so once, at the top. Nothing on any page marks an
individual change. The changelog does: `/changes` shows every change with who made it, when, what
it held before and after, the reason and the evidence.

**Where the agent stands today.** It writes nothing. It is built to write scout cards and is dry on
them until the analyst adds it to one list, and it is dry on every core market with no date set for
that to change. See *The scouting tier* below.

---

## The rule

| | |
|---|---|
| Observed public data | **Publishes automatically** after validation |
| Deterministic derived metrics | **Publishes automatically** after validation |
| Model outputs | **Recompute automatically** — using the currently *approved* methodology and assumptions |
| Judgement in the view store: grades, verdicts, the thesis, triggers | **Publishes automatically** after validation, within the rights of the author that wrote it — see *The view store* below |
| A scout card: facts, grades, verdicts, triggers, a return signal | **Publishes automatically** after validation, written by the agent once it is live on cards — see *The scouting tier* below |
| Analyst assumptions in the model | Automation may **propose**. It may never apply. |
| Methodology: scoring weights, grade anchors, knock-outs and limits, score bands, discount rates and exit yields, the comparison window, the limits on a machine run, **which markets are scouted and which pages the agent may read** | Automation may **not change one and may not even propose it** |
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
it, the scout roster and the agent's reading list among them. A test walks the list and asserts that each module is behind both walls and that no spelling of
one parses as a view-store path, for any author.

The old `narrative.thesis` field still lives in `src/` and stays `methodology`. The manifest `status`
field and the composite score were retired on 2026-10-12.
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

`LIVE_AUTHORS` is `['analyst', 'rule']`, and it is the list for core markets. On a market the agent
is a permitted author and not a live one: its change can be prepared and reported, and the writer
refuses to apply it. Adding it to that list is the analyst's decision, to be considered only after
it has earned it on scout cards. Scout cards have their own list, their own rights and their own
gate; nothing in this table was widened for them.

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
to establish from a source that the event happened. On core markets, which this section describes,
it runs **in CI only, and dry**. Its other pass, over scout cards, is the next section.

- It looks at markets with a trigger due inside 30 days, or overdue.
- Its own code fetches the pages those triggers cite and hashes them. The model is given the text
  and has no tools: it can only return a proposal in a fixed shape.
- Every quotation is checked, character for character, against the page it cites. One that is not
  there discards the proposal.
- Each surviving change is put to the writer's `prepare`. The report says what would have changed
  and what the gate said. Nothing is written.
- It needs a model key as a repository secret, `ANTHROPIC_API_KEY`. Without one the job does
  nothing. It cannot see `local-data/`: in a CI checkout the folder holds only its committed
  README, the job checks that nothing else is there before it starts, and nothing under `agent/` or `etl/` names it.

### The scouting tier

Nine markets with no dashboard have a **card** each: Sweden, Estonia, Lithuania; Spain, the
Netherlands, Bulgaria; Chile, Ontario, Saudi Arabia. A card is a first screen and nothing more: at
most ten sourced facts, a grade on each dimension a public page can be quoted for, a verdict for
each investor, and no return. **This is where the agent is an author**, because there is no prior
judgement to overwrite and a wrong call costs least.

**What is the analyst's, and where it is kept from a machine.**

| | Where | A machine may |
|---|---|---|
| Which markets have a card: id, name, region | [`src/governance/scout.js`](../src/governance/scout.js) | nothing: `src/` |
| Which pages the agent may read, and what each page's terms say | [`src/scout/sources.js`](../src/scout/sources.js) | nothing: `src/` |
| The limits on a card and on a scout run; the exit streak; the graduation rule | `src/governance/scout.js` | nothing: `src/` |
| The card schema, the rights below, the gate | [`view/schema/scout.mjs`](../view/schema/scout.mjs) | nothing: neither writer can write `view/schema/` |
| The card | `view/scout/<id>.json` | write it, through the gate, once live |
| One line per live scout run | `view/scout/passes.jsonl` | append it, in the same call as the cards |

**The tier of a change is decided by its id, never by the caller.** An id in the roster is a card's
change, read against the card schema, rights and live list. Any other id is a market's. The two
sets share no id, by test, so nothing a caller passes can route a core market through card rights.

**Rights on a card.**

| | `analyst` | `agent` | `rule` |
|---|---|---|---|
| A grade | create, replace, remove | **create**; replace `grade`, `trend`, `trendCause`, `reason`, `evidence`, `basis` | nothing |
| A verdict | create, replace, remove | **create**; replace `call`, `because`, `despite`, `reviewBy`, `changesIf` | nothing |
| A trigger | yes, never with an effect | create, replace, never with an effect | nothing |
| The facts, the return signal | yes | create, replace | nothing |
| The record of a spot-check | yes | no | no |
| Remove anything; pin a record or write a pinned one; a practitioner grade | yes | no | no |
| A held view, a rule | does not exist on a card | | |

**No return is modelled.** A card is graded on twelve dimensions, not fourteen: asset return is a
rank of engine IRRs and revenue certainty is read from the engine's reference project, and a scout
market has no engine. So a card has three pillar scores, no fit, and no single number. Four layers
keep a return off it:

- the schema has no field for one, the two Return dimensions do not parse, and an unknown key
  (`comparison`, `economics`, `irr`) makes a card invalid;
- no text on a card may name an IRR, a multiple, a payback or a percentage return, in either
  language, a quotation included. A third party's revenue index may be quoted in the return signal
  and nowhere else;
- no roster id is a registered market, and a test walks the imports: nothing that prices, ranks or
  plots a return imports the tier, and the tier imports no engine;
- the page shows the signal in its publisher's words, or "No return is modelled".

One consequence is worth knowing: the infrastructure fund is shut out by a revenue-certainty grade
of 1, and a card cannot grade revenue certainty. That barrier is not checked on a card.

**The guardrails, for a record that is created.** On a market a machine may not create a grade or
a verdict, and guardrail C compares with a previous value. On a card creation is the point:

| | On a card |
|---|---|
| A | Every record quotes a page fetched in that run, and the page must be on that market's source list with its terms read. What a source is — official or not — is the list's to say |
| C, a first grade | Whatever the anchor says. A first **1 or 5** needs one official source or two independent ones |
| C, a first verdict | `avoid`, `wait` or `opportunistic`. The two stronger calls are reached one place a run |
| C, afterwards | As on a market: a grade one step, a call one place |
| Knock-outs | A verdict is not created until every dimension that can shut that investor out is graded. Where a grade does shut it out, the most a machine calls is `wait`. It never writes `not-accessible`; the card shows the barrier from the grade |
| D | A pinned record is the analyst's, and a machine cannot create one pinned |
| E | A run touches at most 3 cards and replaces at most 3 existing records. Over either, it writes nothing |
| G | Every verdict, created or moved, needs one official source or two independent ones |
| H, I | The same digest and the same `revert`, plus `scout-remove` for a whole card |

**The scout pass** ([`agent/scout.mjs`](../agent/scout.mjs)) covers one region a run, on the 1st,
11th and 21st, so each card is reviewed monthly. For each market it fetches the listed pages,
gives the model the card as it stands with the anchors and the page text, and turns the answer
into whole-record changes. The model has no tools, no search and follows no links.

- A page whose terms nobody has read is **probed**: fetched for its status and thrown away, never
  shown to the model. A page its site's `robots.txt` disallows is not fetched.
- Each quotation is checked character for character against the page. Each change is put to the
  gate in order. One that fails is dropped, recorded with its reason, and counted.
- What survives is written: a card may be partial, and a dimension with no quotable source stays
  ungraded and is listed as ungraded.

**Dry, and how it goes live.** `SCOUT_LIVE_AUTHORS` in `view/schema/scout.mjs` is `['analyst']`.
While the agent is not in it the pass prepares, reports and writes nothing, and the workflow job
holds `contents: read`. Making it live is one pull request the analyst merges, changing those two
lines together; a test fails if they disagree. `LIVE_AUTHORS`, the list for core markets, does not
move. Before that pull request, the first dry reports are read for: that the model call works at
all; which listed pages CI can fetch; that no quotation failed; every gate rejection; and the
Chinese.

**The exit condition.** A pass is **clean** when a page was read and the model answered for every
card in it and **no proposal was rejected**, for evidence or anything else. The agent is considered
for core markets only after **six consecutive clean live passes** — every card created once and
reviewed once — with every card spot-checked. A repeat pass inside 25 days is not a review and
does not count. The streak is a function of `view/scout/passes.jsonl`, shown on `/scout` and by
`npm run view:scout-status`. Reaching it changes nothing by itself.

**Spot-checking.** A pass's report lists every record with the anchor line for its grade, the
quotation and the link, and marks a sample: every verdict, every grade of 1 or 5, every grade an
investor can be shut out on, and three others chosen from the run id. For each: is the quotation
on the page and does it say what the reason claims; is this the anchor line you would have picked;
is the source what the list says. `scout-check` records the check as the analyst's own changelog
line, and a correction is an ordinary `apply`.

**The source list is not finished.** Since 2026-10-11, 33 of 35 listed pages have terms somebody
read, and eight of nine markets have at least one such page; Saudi Arabia has none. Most pages are
an official body's, so the list speaks mostly to entry. Ten are a third party's, for what official
pages do not say: debt, sales, and how much storage is already built.

**Seven of those are admitted on one ground, and it is the analyst's.** A trade paper's or a
development bank's terms allow private, non-commercial use and reserve the rest. Such a page has
the status `private-use`, apart from `permits`, and is on the list by the analyst's ruling of
2026-10-11 that this platform is for his private use and nobody else's. If the platform is ever
shown to anyone else, every `private-use` page comes off the list, and so does every record on a
card that quotes one. A market with none cannot have a card,
and a region with such a market cannot have a clean pass. Each page's terms are re-checked as its
card is written; the whole list holds only while the purpose is personal study.

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
| H | A monthly digest of machine changes | `scripts/view/digest.mjs`, posted as an issue by the workflow | `view-automation` |
| I | One command reverts a change by id | `node scripts/view/writer.mjs revert <id>` | `view-automation`, `rules` |
| J | Held views are the analyst's alone | `HELD_AUTHORS`, a list that did not widen | `held-grade` |

### Operating it

```bash
node etl/rules.mjs --dry-run --any-snapshot      # what every rule reads today, writing nothing
node scripts/view/writer.mjs apply change.json   # write to the view, as the analyst
node scripts/view/writer.mjs revert <id>         # undo one change; the id is on /changes and in the digest
node scripts/view/digest.mjs --days 30           # machine changes over a period
npm run view:scout-status                        # the streak of clean passes, and each card
node scripts/view/writer.mjs scout-check <id>    # record that you spot-checked a card
node scripts/view/writer.mjs scout-remove <id>   # take a whole card away, one line per record
```

To pin a record against machine changes, set its `lockedUntil` to a date. To re-arm a rule that has
fired, write its trigger record again. To start the agent's dry runs, add the repository secret
`ANTHROPIC_API_KEY`. To run one scout pass by hand, dispatch the *Live data* workflow with a
`scout_region`, and wait for it to finish before dispatching the next: the workflow keeps one run
waiting at a time, and a third dispatch cancels the second. To admit a page to the agent's reading list, read its publisher's terms and record
what they say in `src/scout/sources.js`.

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

[`etl/lib/viewWriter.mjs`](../etl/lib/viewWriter.mjs) writes the view and permits five kinds of
file under `view/`: `markets/<id>.json`, `index.json` and `changelog.jsonl` for the markets, and
`scout/<id>.json` and `scout/passes.jsonl` for the scouting tier, where `<id>` must be in the
roster. Not `view/schema/`, which says who may write what, and not `src/`. It validates before it
writes, and appends the changelog in the same call. A batch that fails anywhere, or exceeds the
cap, writes nothing. A scout write never touches a market's file or the index of their verdicts.

A test asserts that no other file under `etl/` or `agent/` so much as imports a filesystem write API,
and that the view writer is imported from exactly three files: `etl/rules.mjs`, `agent/run.mjs` and
the analyst's command line. Within `agent/`, only the scout pass names the writer's one writing
method for cards, and that method refuses an id outside the roster before it prepares anything.
The workflow checks the walls again after every run — a rules run may change `view/markets/`,
`view/index.json` and the changelog; a scout run may change `view/scout/` and the changelog — and
scans a view change against the confidentiality marker set before committing it.

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
