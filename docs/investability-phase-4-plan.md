# Investability Phase 4 — the scouting tier: the plan, for sign-off

**Status: awaiting Jerry's sign-off. Nothing is built.** Written 2026-10-11 against
`docs/investment-view-revision-plan-2026-10-10.md` §6.4, §7.2, §7.3, §8 (phase 4 row) and §9 rows
10 and 12, on a branch that contains the merge of Phase 3 (PR #14, `8ea13b2`).

This phase makes the agent a live author for the first time. Until now it could prepare a change
and never apply one. After it, **the agent may write scout cards, and only scout cards**. Core
markets stay closed to it exactly as they are today, and the rule the store lives under does not
change: judgement publishes automatically after validation; methodology never does.

## 0. What needs your answer

Nine decisions. The first is a dependency only you can clear.

| | Decision | My recommendation |
|---|---|---|
| Q1 | **The agent has never called the model, and it needs a repository secret, `ANTHROPIC_API_KEY`, that only you can add.** I will not add, ask for or use a key, and the agent refuses to run outside CI. So this pull request cannot contain nine agent-written cards | Merge the mechanism with the agent **dry on both tiers**. You add the secret. I read the first dry reports against the list in §6.2. Making the agent live on scout cards is then a second, two-line pull request that you merge (§2.3) |
| Q2 | A scout card is graded on **twelve dimensions, not fourteen**, and has **no fit score** (§1.2) | Accept. The two Return dimensions are defined on the engine, and a card has no engine |
| Q3 | Your standing decision is that a human sets each verdict and the score checks it. On a scout card the agent sets the first verdict and there is no score to check it (§3.3) | Accept for this tier only, as §6.4 says, with the three limits in §3.3: a first call is `avoid`, `wait` or `opportunistic`; a knock-out caps it at `wait`; you spot-check every one |
| Q4 | Guardrail C assumes a previous value. A created grade has none (§3.2) | A created grade may be any of 1 to 5, because the anchor decides and a forced middle grade would be a false one. A created **1 or 5** needs the evidence a verdict needs: one official source or two independent ones |
| Q5 | Guardrail E caps a run at 3 machine changes. One new card is up to 18 records (§3.4) | Keep the 3 for **replacing** a record. Add one constant: a scout run touches at most **3 cards**. So the monthly review becomes three runs a month, one region each |
| Q6 | The exit condition (§5) | **Six consecutive clean passes**: every card created once and reviewed once, about two months. A pass is clean when **no** proposal was rejected, which is stricter than the plan's "rejected for evidence" |
| Q7 | Whether `/scout` says, once, at the top of the page, that cards are written by the agent from public pages and spot-checked | Yes, one sentence about the tier, as `/data` states the rule. No mark on any card or verdict, per §7.5 |
| Q8 | The source list (§4). The agent reads only pages on a list you approve. I could verify terms of use for three of nine primary publishers today; two refused an automated fetch outright | Approve the publishers in §4.2 as candidates. The list is settled per source after the first dry run shows which pages CI can read at all |
| Q9 | Your spot-check is recorded in the changelog as your own line. Whether the card also shows "spot-checked on …" | Record it, show nothing on the card. `/changes` has it |

## 1. The scout card

### 1.1 Where each part lives

A card is split by who may decide each part. What a machine may never decide is in `src/`, which
no machine can write.

| Part | Where | Who writes it |
|---|---|---|
| Which markets are scouted: id, name, region | `src/governance/scout.js` | You. Behind the `src/` wall, and named in `METHODOLOGY_SURFACES` |
| Which pages the agent may read for each, and each page's terms | `src/scout/sources.js` | You. Same wall |
| The graduation rule, the tier's limits (§3), the exit streak | `src/governance/scout.js` | You |
| Facts, grades, verdicts, triggers, the return signal | `view/scout/<id>.json` | You, and the agent once live |
| One line per scout run | `view/scout/passes.jsonl` | The writer, on each live run |
| The card schema and the scout rights table | `view/schema/scout.mjs` | Code. Not writable by either writer |

The agent therefore cannot add a market, rename one, or read a page you did not list. A card for
an id that is not in the roster has no file name the writer will accept.

### 1.2 The shape

```javascript
{
  id: 'se', tier: 'scout',
  facts: [ { text: [en, zh], evidence: [ { publisher, url, class, quote, retrievedAt, sha256 } ] } ],  // at most ten
  grades: { foreignEntry: { …the core grade record… } },      // twelve dimensions at most
  verdicts: { strategic: { …the core verdict record… } },     // the same four archetypes
  triggers: [ …plain triggers, no effect… ],
  returnSignal: null | { kind: 'third-party-index', note: [en, zh], evidence: [ … ] },
}
```

- **Grades and verdicts are the core records**, checked by the same `validateGrade` and
  `validateVerdict`. Nothing about a verdict is weaker on a card. A grade's `evidence` holds keys
  from that market's list in `src/scout/sources.js`.
- **Twelve dimensions.** `assetReturn` is the quintile of the engine's IRR and
  `revenueCertainty` is read from the engine's reference project. A card has neither, so neither
  path parses for a card. The Return pillar is the signal or nothing.
- **No fit.** The archetype arithmetic already blanks a pillar with a dimension missing, and blanks
  the fit with a pillar missing. A card shows three pillar strips and no single number. Knock-outs
  still compute, from your `reads` tables, and a card leads with the barrier as the board does.
  Limits on cheque and capital at risk read "not checked": there is no ledger.
- **A card may be partial.** A dimension with no page that can be quoted stays ungraded and the
  card says so. The alternative is a grade with no source, which guardrail A exists to prevent.
- **No held layer and no rule on a card.** `grades.<d>.held` does not parse for a card, and a
  trigger with an effect is refused there for every author. Both belong to a market you know.

Paths on a card: `grades.<dimension>`, `verdicts.<archetype>`, `triggers.<id>`, `facts`,
`returnSignal`. Whole records, as in the core store.

### 1.3 How the writer grows, and how it is kept from widening anything else

`assertViewWritable` today accepts `markets/<id>.json`, `index.json` and `changelog.jsonl`. It
gains exactly two patterns:

- `scout/<id>.json`, where `<id>` **is in the roster**. Not any well-formed id.
- `scout/passes.jsonl`.

What keeps the two tiers apart:

1. **The tier is decided by the id, never by the caller.** A change names a market. If the id is
   in the roster the change is a scout change, read against the scout schema, the scout rights
   and the scout live list. Otherwise it is a core change, exactly as today. No flag on a change
   can route a core market through scout rights.
2. **The two id sets are disjoint, by test.** No roster id is a registered market, and none
   matches a file in `view/markets/`.
3. **The core tables are not edited.** `AUTHOR_RIGHTS`, `LIVE_AUTHORS`, `parsePath` and
   `machineProblems` keep their current text for core markets. The scout tier gets its own
   `SCOUT_RIGHTS`, `SCOUT_LIVE_AUTHORS` and `parseScoutPath`. A test asserts the core exports are
   unchanged value for value.
4. **`index.json` is not touched by a scout write.** The home board gets its nine rows from a
   digest made at build (§7), so the file core verdicts are checked against stays theirs.
5. **One changelog.** Scout lines go in `view/changelog.jsonl` with `tier: 'scout'`, so `/changes`,
   the weekly digest and revert cover them with no second mechanism. The replay test replays each
   tier into its own files.

## 2. What the agent may write, and how it goes live

### 2.1 Rights on a scout card

| | `analyst` | `agent` | `rule` |
|---|---|---|---|
| A grade | create, replace, remove | create; replace `grade`, `trend`, `trendCause`, `reason`, `evidence`, `basis` | nothing |
| A verdict | create, replace, remove | create; replace `call`, `because`, `despite`, `reviewBy`, `changesIf` | nothing |
| A trigger, with no effect | yes | create, replace | nothing |
| The facts, the return signal | yes | create, replace | nothing |
| Remove anything | yes | no | no |
| Pin a record, or write one that is pinned | yes | no | no |
| A practitioner grade | yes | no | no |
| The roster, the source list, any constant | yes, in `src/` | **no path exists** | no path exists |

**What the agent still may not write, anywhere:** a weight, an anchor, a limit, a score band, a
discount rate or any constant in `src/governance/`; the roster or the source list; a held view; a
pinned record; a practitioner grade; a trigger with an effect; `not-accessible`; a removal. And
in this phase, **any record of a core market**: its changes there still prepare and are refused
on apply.

### 2.2 Scoping the live list

`LIVE_AUTHORS` stays `['analyst', 'rule']`, and from now on means the core tier. A second list is
added beside it:

```javascript
export const SCOUT_LIVE_AUTHORS = ['analyst'];            // as merged: the agent is dry on scout cards too
export const SCOUT_LIVE_AUTHORS = ['analyst', 'agent'];   // after the flip in §2.3
```

The writer's `assertLive` picks the list by the tier of the change's id. The agent gets one
writing method, `applyScoutRun`, which throws on any change whose id is not in the roster before
it prepares anything. `agent/core.mjs`, the daily pass over core markets, is not edited and still
calls `prepare` only.

### 2.3 The flip

A separate pull request, after the checks in §6.2, changing two lines: the list above, and
`contents: read` to `contents: write` on the scout job. The commit step is already in the
workflow and has been running as a no-op. Its pinned test changes in the same commit. You merge
it; that merge is the decision §8 of the main plan reserves to you.

### 2.4 Pinned tests that change, and what each asserts afterwards

`tests/baseline.test.js` and `tests/current-model.test.js` are not touched.

| Test | Asserts today | Will assert |
|---|---|---|
| `view.test.js` "every machine-written line in the committed store is accounted for" | Three exact author lists; every entry's author is live; no agent line | The same three lists, unchanged, plus `SCOUT_LIVE_AUTHORS` exactly. Entries are split by tier. **No core entry is the agent's, ever.** A scout entry's author is in the scout list, and an agent line there carries a run, a model, a prompt version and evidence with a hash and a quotation |
| `view.test.js` "the changelog accounts for the committed store, line by line" | Replay arrives at `view/markets/` | Core lines replay to `view/markets/` and scout lines to `view/scout/`, each exactly. A line with no `tier` is core |
| `governance.test.js` "the view writer accepts the three kinds of store file and nothing else" | Three kinds | Five. Refused in addition: `scout/<an id not in the roster>.json`, `scout/wa.json`, `scout/../markets/wa.json`, `scout/index.json`, `scout/passes.jsonl.bak`, `scout/schema.mjs` |
| `governance.test.js` "methodology is unwritable by every author, machine or not, through the view" | Each surface is under `src/` or is `view/schema/view.mjs`; no methodology spelling parses | The schema allowance becomes the two files in `view/schema/`. Three surfaces are added: the roster, the source list, the scout schema. Every spelling is also run through `parseScoutPath`. A card holding `weights`, `anchors`, `limits`, `bands`, `comparison`, `economics` or `irr` is invalid |
| `view-automation.test.js` "the agent has no tools, no shell and no way to the view but the gate" | No file in `agent/` calls `.apply(`, `applyBatch` or `.revert(` | Still true of every file but one. `agent/scout.mjs` may call `applyScoutRun` and no other writing method, and the writer refuses a core id through it. The scout answer schema is asserted closed, as the core one is |
| `view-automation.test.js` "the agent is a permitted author and not a live one" | Prepares, never applies | Unchanged for a core market, and kept. At the flip, a scout twin changes from "refused on apply" to "applied, with one changelog line per record" |
| `tests/bundle-budget.test.js` | Entry 222, home 268 | Both budgets unchanged. Adds a named `scout` chunk with its own budget, and that no card text is in the entry chunk or the home view |
| `tests/routes.test.js` | The route table | Adds `/scout` |

Expected to pass unedited, which is itself the check: "a machine author has rights narrower than
the analyst's" (it reads the core table), "the view has one writer and two doors" (the scout pass
is handed the store by `agent/run.mjs`), every guardrail test A to J, "the scheduled workflow
never enables auto-merge", and `held-grade.test.js`.

## 3. Guardrails A to I on a card the agent creates

Today a machine may not create a grade or a verdict, and C compares with a previous value. On the
scout tier creation is the point, so each guardrail is restated for it. The new constants go in
`src/governance/scout.js`.

| | On a core market, today | On a scout card |
|---|---|---|
| A | A source fetched in that run, the quotation in the page | **Unchanged, and applied to every created record.** Each grade, verdict, fact, trigger and signal carries a quotation found character for character in a page fetched in that run. In addition the page must be one on that market's source list |
| B | No assumption path exists | None exists on a card either |
| C | A grade moves one step, a call one place | §3.2 and §3.3 |
| D | A pinned record is yours | Unchanged. A machine cannot create a record with `lockedUntil` set |
| E | 3 changes a run | §3.4 |
| F | Seasonality and staleness | Does not arise: no feed bears on a card |
| G | A verdict needs one official source or two independent | Unchanged, applied to a created verdict, and to a created grade of 1 or 5 |
| H | Weekly digest | Unchanged. Scout lines are in the same changelog |
| I | One command reverts a change by id | Unchanged, and one more: `scout-remove <id>` removes a whole card as you, one changelog line per record |

### 3.2 C for a created grade

There is no previous value, so "one step" has nothing to measure from. Three options: force a
first grade of 3; allow any grade; allow any grade with more evidence at the extremes. A forced 3
is a grade the anchors do not support, written to satisfy a rule. I recommend the third: the
anchor decides, and a 1 or a 5, the grades that trip a knock-out or headline a card, need G's
evidence. **Once a grade exists, C applies as written:** one step a run.

### 3.3 C for a created verdict

The check your decision relies on, the score, does not exist on a card. Three limits stand in:

1. **A first call is `avoid`, `wait` or `opportunistic`**: within one place of `wait`, the
   neutral word. `build-position` and `enter-now` are reached one place a run afterwards, each
   move with G's evidence. So the earliest a card can read Build position is its second pass.
2. **A knock-out caps a machine's call at `wait`.** If a grade on the card is one that archetype
   cannot accept, the agent may not write a call above `wait`. It still may not write
   `not-accessible`; the card shows the barrier from the grade.
3. **A verdict is created only when every dimension that archetype can be knocked out on is
   graded**, and every dimension its `because` cites. A barrier cannot be hidden by leaving its
   dimension blank.

A `wait` names a trigger and a review date, as everywhere. That is why a card carries triggers,
which §6.4's sketch does not show.

### 3.4 E for a run that creates

The cap exists to stop one bad source rewriting many markets. Creation overwrites nothing, and a
card is at most 12 grades, 4 verdicts, the facts and the signal. So:

- a scout run touches **at most 3 cards** (`MAX_SCOUT_CARDS_PER_RUN`, new);
- across the run, **at most 3 existing records are replaced** (`MAX_MACHINE_CHANGES_PER_RUN`,
  unchanged in value and meaning);
- over either, the run writes nothing.

`MAX_MACHINE_CHANGES_PER_RUN` is not edited. The new constant is methodology and yours to set.

## 4. "No return is modelled", and the sources

### 4.1 How a card is kept from printing an IRR or entering the engine

| Layer | Mechanism |
|---|---|
| Schema | A card has no numeric return field and no `comparison` or `economics` key; an unknown key is invalid. `grades.assetReturn` and `grades.revenueCertainty` do not parse for a card. `returnSignal` is a kind from a fixed list, a note and evidence |
| Text | The validator refuses a card on which any text names a modelled return: IRR, MOIC, payback, 内部收益率, 回收期, or a percentage beside "return" or "yield". It runs on facts, reasons, verdict text, trigger labels and the signal. A third party's revenue index, attributed, is allowed **in `returnSignal` only** |
| Engine | No roster id is in the market registry, by test. A test walks the import graph: nothing under `src/comparison/`, the league table, the frontier, `/returns` or the Investment Lab imports `src/scout/` or `view/scout/`, and nothing under `src/scout/` imports the engine or `fmtIRR` |
| Page | `src/scout/scoutModel.js` is DOM-free and returns the Return pillar as the signal's text or "No return is modelled". There is no code path from a card to a number |

### 4.2 Sources and the licence check

**The agent reads only the pages in `src/scout/sources.js`.** It follows no links and has no
search. This is narrower than §7.3 ("what it fetches from the web") and I think it is right for a
first live author: the model has no tools, so something else must choose the pages, and that
should be you.

A page is admitted to the list when all four hold, and the entry records each:

1. it is public, with no login and no paywall;
2. the site's `robots.txt` does not disallow the path. The fetcher checks this at run time and
   skips a disallowed page;
3. a person has read the publisher's terms page, and the entry records its address, the date and
   one of `permits` (reuse with attribution), `silent` (no terms stated) or `refused`. `silent` is
   admitted on the personal-study posture and marked. `refused` is not admitted;
4. what is kept is a quotation of at most 300 characters, the publisher, the link and a hash.
   Never the page.

A commercial index (Clean Horizon, Modo, Aurora) is admitted only from the publisher's own public
page, for one attributed figure, in `returnSignal`. Never from a report behind a paywall. This
holds only while the purpose is personal study (§9 row 12, and your licence posture).

Candidate publishers, and what I could establish today. "Opened" means I fetched and read the
page on 2026-10-11. A guessed address that returned 404 is "not found", not a finding about the
publisher.

| Market | Official candidates | Terms, as checked today |
|---|---|---|
| Sweden | Svenska kraftnät (grid operator); Energimarknadsinspektionen (regulator); Inspektionen för strategiska produkter (investment screening) | Svenska kraftnät "about the website": **opened**. States no reuse terms; invites linking. `silent` |
| Estonia | Elering; Konkurentsiamet; the consumer protection and technical regulatory authority (investment screening) | Elering: **not found** |
| Lithuania | Litgrid; VERT (regulator); Ministry of Energy | Litgrid: **not found** |
| Spain | Red Eléctrica; MITECO; CNMC | Red Eléctrica legal notice: **not found** |
| Netherlands | TenneT; ACM; RVO; Bureau Toetsing Investeringen | TenneT disclaimer: **refused an automated fetch (403)** |
| Bulgaria | ESO; the energy and water regulator; Ministry of Energy | ESO home page: **opened**. No terms stated; a bare "ESO EAD 2021" footer. `silent` |
| Chile | Coordinador Eléctrico Nacional; CNE; Ministerio de Energía | Coordinador terms: **refused an automated fetch (403)** |
| Ontario | IESO; Ontario Energy Board; Ontario Ministry of Energy | IESO Terms of Use: **opened**. All rights reserved, with a limited licence to use and reproduce content on condition of a copyright and attribution notice. `permits` |
| Saudi Arabia | Saudi Power Procurement Company; Ministry of Energy; the electricity regulator; Ministry of Investment | SPPC: **not found** |

So three of nine are checked and none is `refused`. **Two refused a plain fetch, which matters
more than their terms:** a page that refuses me will probably refuse the agent in CI, and a
market with no readable official page cannot have a verdict (G). The first dry run answers this
for every page on the list, which is why the list is settled after it, not before.

**What "spot-checked" means for you.** After a pass, the run's summary lists each card with every
record, the anchor line for the grade given, the quotation and the link. It marks a sample: every
verdict, every grade of 1 or 5, every grade an archetype can be knocked out on, and three other
grades chosen from the run id, so the sample is not the agent's choice. For each marked record
you open the link and answer three things: is the quotation there and does it say what the reason
claims; is this the anchor line you would have picked; is the source what the list says it is.
Then `node scripts/view/writer.mjs scout-check <id>` records the check as your own changelog
line, with a note if you disagreed, and you correct a record with the ordinary `apply`. About ten
records a card.

## 5. The exit condition

- **A pass** is one scheduled scout run: one region, three cards.
- **A pass is clean** when it ran to the end, at least one page was fetched for each card, the
  model answered for each card (no refusal, no cut-off), and **no proposal was rejected**, for
  evidence or anything else. A proposal dropped because nothing would change is not a rejection.
  The plan says "rejected for evidence"; a proposal refused for reaching at a pin or for two
  steps tells you as much about whether the agent can be trusted with a core market, so I count
  all of them. Yours to loosen (Q6).
- **Six consecutive clean live passes.** Three create the nine cards, which is where almost all
  the quotations are checked: up to about 150. Three review each card once, which is the first
  time C and the temptation to overwrite apply. A review pass counts only if at least 25 days have
  passed since that card's previous pass, so the six cannot be run in an afternoon.
- **Dry passes do not count.** They write nothing, by construction.
- **Where it is recorded.** `view/scout/passes.jsonl`, one line per live run, written by the
  writer in the same call as the cards: the run, the model, the prompt version, the cards, the
  pages fetched and failed, the counts proposed, written and rejected, each rejection with its
  reason, and `clean`. The streak is a pure function of that file's tail, tested, shown on
  `/scout` and printed by `node scripts/view/scout-status.mjs`.
- **Nothing happens automatically when the streak reaches six.** Pointing the agent at core
  markets is a later change with its own plan and your sign-off. It also needs all nine cards
  spot-checked, which the status command reports beside the streak.

## 6. The dependency, and the order of work around it

### 6.1 Built and tested now, with a stubbed model

Everything except the model's answers: the schema and rights; the writer's two new files and
`applyScoutRun`; the scout pass in `agent/scout.mjs` with its prompt and answer schema; the
fetcher's `robots.txt` check and a cap on page text; the pass log and the streak; the workflow
job; `/scout`; the home rows; the documents. Tests use hand-written fixture cards in `tests/`,
never in `view/scout/`. **`view/scout/` is empty at merge**, and the page and the board say "no
card written yet" for each of the nine.

### 6.2 What waits for the first real run, and what I check in its report

You add the secret and dispatch the scout job by hand, once per region, dry. Before I propose the
flip I will read the three reports for:

1. **The call itself.** `agent/model.mjs` has never run. That the request is accepted, including
   the structured-output format and the fallback beta flag; the stop reason; the model id that
   answered; that the answer parses against the schema.
2. **Fetching.** Each listed page fetched or not, with the status. A market needs at least two
   readable pages, one official. Pages that refuse CI are replaced and the run repeated.
3. **Quotations.** How many were proposed and how many were not in the page. The flip waits for
   three dry runs with none.
4. **The gate.** Every rejection and its reason. None for authority.
5. **The return rule.** No proposal tripped the text check in §4.1.
6. **Hostile pages.** Any note from the model that a page addressed it.
7. **The Chinese.** I read all of it; you should read some.
8. **Cost.** Tokens per pass, which I cannot estimate honestly before a run.

You then spot-check the dry cards from the report. Only after that: the flip (§2.3), three live
creation passes, and the count starts.

### 6.3 Order after sign-off

1. `src/governance/scout.js`, `src/scout/sources.js`, `view/schema/scout.mjs`; the authority
   surfaces; rewrite the pinned tests of §2.4 and add the scout ones.
2. The writer: two file patterns, tier by id, `applyScoutRun`, the pass log.
3. `agent/scout.mjs`, its prompt, the `--scout <region>` mode of `agent/run.mjs`, the fetcher.
4. The workflow job: three times a month, one region each, and by hand. Read-only, with the wall
   check (only `view/scout/` and `view/changelog.jsonl` may change; `view/markets/` and
   `view/index.json` may not), the confidentiality scan before the commit, and the commit step.
5. `/scout` as its own chunk; the build-time digest; the home rows below a second divider.
6. `scout-status`, `scout-check`, `scout-remove`.
7. README, `docs/governance.md`, `docs/architecture.md`, the `/data` page.
8. Build, tests with the confidentiality scans against the marker set, browser checks at desktop
   and phone widths in both languages, the pull request.

## 7. The pages

- **`/scout`**, loaded on demand in a chunk named `scout`. Nine cards in three regions: the
  verdict for each archetype by word and shape, three pillar strips, the Return pillar as the
  signal or "No return is modelled", up to ten facts each with its source, what is not graded,
  progress to graduation, and the clean-pass count. Every string an `[en, zh]` pair.
- **The home board** gains a second divider below "Not yet graded", then one row per roster
  market: name, region, the four calls or "no card written yet", and a link to its card. No
  return column and no IRR. The rows come from a digest the build makes of each card's calls,
  the way the changelog reaches the home page today, so the home view grows by the digest and
  nine names. Entry stays under 222 kB and home under 268 kB; I will report both before and after.
- **`/changes`** shows scout lines with no new code beyond resolving a roster name. The home
  page's "what changed" panel will show them too, and the first live passes will fill its last
  ten lines with scout records. I would leave that: they are changes.

## 8. What in §6.4 and §7 I will not build as written

1. **"The same anchors as a full market."** Twelve of fourteen, and no fit (§1.2).
2. **`graduatesWhen` on the card.** The rule is the same for every card and it is yours, so it
   is one constant in `src/governance/scout.js`, and the card shows computed progress: an
   archetype at Build position or Enter now across two consecutive passes. "The inputs a
   comparison file needs exist" is your judgement and is not computed.
3. **`name`, `region` and `tier` in the card file.** They are in the roster, where a machine
   cannot write them. The three regions are the three you chose, not the four in `regions.js`.
4. **"Scout cards monthly."** Each card monthly, as three runs of one region, because of E.
5. **§7.3's reading list.** The scout pass reads the source list and nothing else: no news feed,
   no drift report, no search (§4.2).
6. **A core market demoted to a card.** Not built. The two id sets are disjoint by test, and a
   demotion would need its own change.
7. **Triggers on a card**, which §6.4 does not show and a `wait` requires (§3.3).
8. **A third file kind, `scout/passes.jsonl`**, which §7.2 does not list (§5).
9. **"Nine cards, written by the agent"** is not in this pull request (Q1). The phase's exit
   condition is therefore not met at merge, and cannot be for about two months after the flip.
