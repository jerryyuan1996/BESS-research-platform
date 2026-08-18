# Platform update plan — 2026-08-17

Six workstreams: a Finland market, two project dossiers, wider reuse of the shared engine, a
"how a BESS actually gets built" section per market, a UI and vocabulary pass, and a set of
further proposals.

**Status: proposal. Nothing here is built.** Per the change-review convention, the derivations
and the numbers each decision rests on are written out below so they can be argued with before
any code lands.

---

## 0. Read this first — two constraints that shape everything else

### 0.1 The project material is confidential, and the repository actively enforces that

`tests/bundle-confidentiality.test.js` runs two scans:

| Scan | What it asserts | When |
|---|---|---|
| Bundle | no marker in `dist/` or `.vercel/output` | CI, post-build, `REQUIRE_OUTPUT=1` |
| Tracked tree | no marker in **any file `git ls-files` returns** | CI, every run |

The WA fund asset's name is item 1 on the `FORBIDDEN` list. Its site name, the third-party
report, the technical specification and three financial-model figures are also on it. So a WA
project page written as a tracked source file under `src/` **cannot exist** — it fails the
tracked-tree scan before it ever reaches a build.

The Finland project is not yet on that list, but it is the same class of material. Read against
`docs/data-policy.md` ("counterparty names, terms or pricing that are not public", "internal
financial models"), the attached dashboard contains at least:

- the GP and fund entity, the LP peak capital call
- the developer/EPC counterparty and the offtake counterparty, both named
- the floor price per MW-year, the tenor, and the JV's above-floor share
- the ready-to-build consideration and the developer's equity carry
- the two SPV entities, their sites, and the full financial model with scenarios and sensitivities

None of that belongs in a public bundle. **Workstream 2 is therefore planned as a private layer
by default**, using the seam that already exists for exactly this case, with a public redacted
variant offered as an explicit option requiring sign-off (§2.5).

> **This document is itself subject to the tracked-tree scan.** It is why no project name, site,
> counterparty or deal figure appears anywhere in it.

**The marker mechanism itself is the problem, and §2.6 redesigns it.** `FORBIDDEN` is a plaintext
list in a tracked file that is *exempt from its own scan*. Every marker on it is therefore
published into the repository in order to be banned everywhere else. That trade was made once,
under duress, for an incident already in progress. Extending it to a second live deal — which is
what the first draft of this plan proposed — would have written the Finland counterparties and
deal figures into tracked source to protect them. That is backwards, and it is corrected below.

### 0.2 The bundle is one 4.0 MB JavaScript file

```
dist/assets/index-*.js    4,003,980 bytes
dist/assets/index-*.css      54,889 bytes
dist/                            20 MB total
```

`src/markets/registry.js` statically imports all fourteen markets, so every visitor to the home
page downloads Great Britain's 184 KB `sections.js`, Japan's 69 KB `gridMapData.js`, WA's 147 KB
SWIS boundary polygon and eleven other markets they did not ask for. Finland plus two dossiers
adds to that without changing the shape.

This is the single largest efficiency item on the list and it is addressed in §3.4, because
"use as much shared engine as possible" and "ship less code" are the same workstream seen from
two sides.

---

## 1. Finland

### 1.1 Why it fits the platform's thesis

The platform's comparison engine cares most about **how a market pays for capacity**. The
registry comment says so explicitly, and it is why the three US markets were added as three
entries. Finland gives a fourth distinct answer:

| Market | Capacity paid by |
|---|---|
| WA (WEM) | RCM certified capacity |
| PJM | capacity auction |
| CAISO | bilateral Resource Adequacy |
| ERCOT | nothing |
| **Finland** | **no resource-adequacy revenue open to merchant storage — revenue is operating reserves and spread** |

Three corrections to how the first draft of this stated it, because the loose version would have
been wrong on the page:

- **"Finland has nothing" is too broad.** Finland has a statutory peak-load capacity arrangement,
  and the TSO itself describes its FFR/FCR/aFRR/mFRR procurement as capacity markets that storage
  can participate in. What Finland does not have is the thing this platform's engine actually
  measures: payment for accredited availability or resource adequacy, as distinct from operating
  reserves. The flag stays `false`; the *label* has to change (§1.4).
- **Delete the HVDC-frequency claim.** The first draft said the interconnectors "carry energy but
  not frequency". That is wrong twice over: Finland sits inside the Nordic synchronous area and
  shares its frequency, and HVDC links can and do provide frequency support. The volatility
  argument stands on wind being the swing producer and on the short-cycle price record; it does
  not need — and is damaged by — a false claim about the physics.
- **Reserve demand growth is product-specific, not general.** The TSO's own forecast has several
  aFRR/mFRR and FCR-D products growing strongly, FCR-N *declining* over part of the horizon, and
  FFR broadly flat. The page must say which products, over what horizon, or it is telling a
  growth story the source does not support.

Finland is still not a second ERCOT, but the reason has to be evidenced rather than asserted —
which is what the saturation gate in §1.5 is for.

### 1.2 Module shape — copy `gb/`, not `_template/`

`src/markets/_template/README.md` says this itself: the template follows the hand-written
lineage, and eleven of twelve live dashboards instead describe their tabs as data. Finland should
be born in the shared lineage.

```
src/markets/fi/
├── mkt.js         locale fi-FI, cur €/EUR, tz Europe/Helsinki, COD years, base-case tag
├── manifest.js    identity + freshness
├── comparison.js  the only thing the comparison engine reads
├── tabs.js        tab strip
├── sources.js     source register
├── data.js        the market dataset
├── sections.js    buildSections(api) — declarative blocks
├── congestion.js  north–south constraint (see §3.2 on the shared shape)
├── gridMapData.js Fingrid 400/110 kV nodes + the constraint corridor
└── dashboard.js   ~20 lines of engine wiring
```

Registration is two lines in `src/markets/registry.js`, **appended** — registry order is the
tie-break for best/worst highlighting in the league table, so appending moves the fewest already
published outputs.

### 1.3 Manifest — the two values that need a decision

`currency: 'EUR'` needs no work: DE, IT and IE already carry it, so the FX rate in
`src/comparison/assumptions.js` exists and no frozen assumption is touched.

`color` is the problem. `docs/adding-a-market.md` states the ramp is `--s1 … --s14` and that
**fourteen is the practical ceiling for a categorical palette**; there are exactly fourteen
registered markets. Finland is the fifteenth. Three options, in preference order:

1. **Second visual channel** (recommended) — keep fourteen hues, add dash pattern / marker shape
   as the fifteenth discriminator in the grouped charts. This is what the doc already advises and
   it is the only option that still works at market twenty.
2. Add `--s15`. Cheapest edit, defers the problem by one market, and measurably degrades the
   grouped bar charts.
3. Group by region and colour by region with per-market shading. Largest change; best long-run
   legibility. Worth considering as part of §5 rather than as a Finland-specific fix.

Also required, and easy to miss: `COUNTRY_FLAGS` in `src/components/navigation.js` **and**
`src/styles/flags.css`. Miss either and Finland silently renders the UN placeholder — which is
what DE, IT and the NEM did for a full release cycle.

### 1.4 `comparison.js` — proposed capability flags

```javascript
capabilities: {
  capacityMarket:    false,  // no long-term adequacy payment open to merchant storage
  merchant:          true,   // day-ahead + intraday spread
  ancillaryServices: true,   // FFR, FCR-N, FCR-D up/down, aFRR, mFRR — the primary leg
  tolling:           false,  // until a repeatable PUBLIC precedent exists — see below
}
```

**The field name is doing work it cannot support.** `capacityMarket` reads as "does this market
have a capacity market", and for Finland the honest answer is *yes, of several kinds*.

Reader-facing label: **Resource adequacy revenue**, defined as

> Payment for accredited availability or resource adequacy, excluding operating-reserve markets.
> Contract duration is reported separately.

Internal key `capacityMarket` unchanged, so no market module, test or fixture moves.

An earlier draft proposed *long-term adequacy payment*. That is wrong: **PJM's Base Residual
Auction clears one delivery year at a time** — PJM's own module says so in the comment beside the
flag — so "long-term" would have mislabelled the largest capacity market on the platform. Moving
duration out of the label and reporting it separately is what makes the category hold.

Checked against the registry, the definition partitions the existing markets cleanly:

| | Markets |
|---|---|
| `true` — accredited availability payment | WA (RCM), GB (CM), IE (CRM), IT, PL, PJM (RPM), CAISO (RA), JP (LTDA) |
| `false` — none | NEM, DE, RO, ERCOT, **FI** |

Finland's FCR/aFRR/mFRR procurement stays under operating reserves and out of this field, which
is the outcome the definition is designed to produce.

**One implementation detail the exclusion clause surfaces.** "Contract duration is reported
separately" has to read from the right field per risk class. Most markets carry
`economics.contractYears` (WA 10, IE 10, CAISO 10, GB 15, IT 15, PL 17). **PJM carries no
`contractYears` at all** — it declares `riskClass: 'auction-renewal'` with
`securedContractYears: 1`, and `strategies.js` reads the latter for that class. Verified: this
produces no non-finite output, so it is not a defect — but a duration label that read
`contractYears` alone would render PJM's one-year commitment as blank, indistinguishable from
ERCOT's genuine zero. The label must resolve duration the same way the engine does.

Whether storage can hold peak-load-reserve capacity, and on what terms, is a **factual question
for the evidence pack** (§1.5), not something to assert here. It does not change the flag either
way: a strategic reserve held outside the market is not a bankable merchant revenue line.

`tolling` starts **`false`**. A floor-plus-share structure exists in the private transaction, but
one deal the platform cannot cite is not market precedent. It flips to `true` when two or more
independent public sources evidence the structure, cited in `sources.js`. Until then the tolling
route is excluded from the $1M engine for Finland — an honest gap is worth more than a flag
propped up by material that cannot be published.

Every economics value is per MW, per year, in EUR; the engine converts.

### 1.5 Live data — the cheap feed and the one worth paying attention for

| Feed | Credential | Effort |
|---|---|---|
| **ENTSO-E FI day-ahead** (`10YFI-1--------U`) | **none new** — the existing `ENTSOE_TOKEN` already serves GB/IE/RO/PL | one dataset entry in `src/governance/datasets.js`, one domain constant |
| **Fingrid open data** — reserve market prices and volumes | free API key, needs registration | new connector in `etl/`, new repo secret |

The first is nearly free and should land with the market. The second is the one that matters:
reserve prices *are* the Finnish revenue story, and without them the market's headline number
stays an assumption while GB's is observed. It is proposed as a follow-on, not a blocker.

Both carry **reuse and attribution terms that must be recorded explicitly** in
`src/governance/datasets.js` before a byte is written — ENTSO-E's transparency-platform reuse
policy and the TSO's API terms are both conditional, not public-domain. `buildSnapshot()` throws
rather than letting a licence-restricted series into the bundle; that is the correct behaviour
and the point is to set `republishable` from the actual terms rather than let the throw be the
first time anyone reads them.

Per the governance model: the anchors for Finland start **unset** and stay unset until the
trailing window fills. A partial-year window is seasonally biased, and in Finland that bias is
extreme — proposing off a summer window would be actively misleading.

**Finland registers with `engineReady: false`.** `engineReadyMarkets()` already filters on it, so
Finland can appear in the nav, the cards and its own dashboard while staying out of the $1M
engine and the certainty frontier until its assumptions have passed their gates. This is the
existing mechanism for exactly this state and it should be used rather than rushing the numbers.

#### The saturation gate

Growing procurement is not the same as durable margin, and this platform has already written the
counter-example: ERCOT's ancillary market was 84% of battery revenue and its collapse took the
market with it — the CAISO module cites it explicitly. Finland must carry the same test rather
than inheriting the growth story uncritically.

Proposed metric, per product, per year: **eligible/prequalified storage MW against procured MW**.
Publish it beside the revenue assumption, not buried in methodology. Where the ratio is already
tight, the reserve revenue line is a decaying asset regardless of what the requirement forecast
does, and the page should say so.

### 1.6 Alignment with the other markets

Tab strip mirroring the lineage, with the one substitution the market forces:

| GB | Finland |
|---|---|
| Overview | Overview |
| GB Market Story | Finnish Market Story |
| Capacity Market | **Reserve Markets** (FCR / aFRR / mFRR) |
| Wholesale & BM | Wholesale & Intraday |
| System Services | *(folded into Reserve Markets)* |
| Duration & LDES | Duration |
| Project Pipeline | Project Pipeline |
| Grid Connection | Grid Connection |
| — | **Build Pathway** (new — §4) |
| Portfolio | Portfolio |
| Data & Methodology | Data & Methodology |

`REVENUE_IDS` in `src/components/navigation.js` groups revenue tabs under one nav entry; the
Finnish reserve tab id must be in that set or the nav grouping silently drops it.

### 1.7 Change surface — the actual list

The "one directory plus two lines" claim in `docs/adding-a-market.md` is true of the *registry*
and false of this workstream, which also adds a feed, a palette channel and a new tab. Stating it
loosely would set an acceptance bar the work is guaranteed to breach. The real surface:

| File | Change |
|---|---|
| `src/markets/fi/**` | new module (§1.2) |
| `src/markets/registry.js` | import + append to array |
| `src/markets/congestionRegistry.js` | Finnish constraint register |
| `src/markets/gridMapRegistry.js` | Finnish map join |
| `src/components/navigation.js` | `COUNTRY_FLAGS.fi`, reserve tab id in `REVENUE_IDS` |
| `src/styles/flags.css` | vendor the FI flag |
| `src/styles/tokens.css` | second visual channel (§1.3) |
| `src/governance/datasets.js` | `fi-day-ahead`, licence and `republishable` |
| `etl/` | ENTSO-E domain constant; later, the TSO reserve connector |
| `tests/` | registry validation is automatic; add feed and gate coverage |
| `docs/` | methodology entry for the renamed adequacy field (§1.4) |

**Definition of done:** `npm test` green, Finland present on the home cards, in the nav and the
league table, its dashboard rendering, its day-ahead feed validating — and **explicitly excluded**
from the $1M engine and certainty frontier by `engineReady: false` until §1.5's gates pass.

---

## 2. The two project dossiers

### 2.1 What exists already

More than expected. The seam is built and working:

- `vite-plugin-local-data.js` substitutes two stub modules at dev-server resolve time and
  **leaves them as public stubs on `vite build`, unconditionally**. There is no branch to
  tree-shake and nothing to get wrong.
- `src/local/loader.js` — `loadLocal(key)`, `hasLocal(key)`, `WITHHELD_NOTICE`. Contract:
  *absence is the normal case*.
- `src/components/withheld.js` — one shared card so every withheld block reads identically.
- `src/markets/wa/sections/portfolio.js` — the public shim that renders the withheld card when
  the confidential section module is not present.
- `local-data/` already holds the WA project dataset, the third-party report dataset and the
  confidential portfolio section module.

So the WA project is already ingested. What is missing is (a) a generalisation from one hardcoded
section to N project dossiers, (b) a route, and (c) the Finland project.

### 2.2 Generalise the seam: one module → a dossier registry

Today `vite-plugin-local-data.js` substitutes exactly one section module by path. Two projects
across two markets need a registry, mirroring how `src/projects/registry.js` already accumulates
project datasets per market.

```
src/projects/dossier/
├── registry.js    registerDossier(marketId, dossier) — same shape as projects/registry.js
├── page.js        public shell: chrome, tab strip, withheld fallback
└── blocks.js      dossier block vocabulary (reuses _shared/blocks.js — see §2.4)

src/local/dossiers.js          NEW public stub — exports []
local-data/dossiers/*.js       the real dossiers, git-ignored, dev only
```

The plugin gains one more substitution: `src/local/dossiers.js` → an index built from
`local-data/dossiers/`. Same mechanism, same guarantee, no new failure mode.

### 2.3 Route and navigation

`src/app/router.js` already names `/portfolio` as a future route. Add:

```
/projects/:slug            a project dossier, default tab
/projects/:slug/:tab       deep-linked tab
```

**Unknown slug → 404.** The first draft had it render the withheld page instead, on the reasoning
that a 404 looks broken. That reasoning is wrong on both counts. There are no public links to
dossiers — the public list is empty by construction — so nothing legitimate ever reaches such a
URL, and treating every random slug as valid turns typos and stale links into silent
non-errors.

It is also a leak. A withheld page that renders only for *real* slugs is an oracle: it confirms
which deal codenames exist to anyone who guesses one. A 404 for everything the public build does
not know about says less and is more honest. Render "withheld" only where a deliberately
published, non-confidential descriptor exists to attach it to.

The market Portfolio tab becomes a list of dossier cards for that market. In a public build the
list is empty and the existing withheld card renders — exactly today's behaviour, unchanged. In
a local build, cards appear and click through to `/projects/<slug>`.

### 2.4 Dossier structure, derived from the two attached files

Both attachments already agree on a structure, which is a good sign it is the right one:

| Dossier tab | WA source | Finland source |
|---|---|---|
| **Overview** | thesis, siting rationale, three system-change drivers | thesis, six-point investment logic, two assets |
| **Grid & siting** | network expansion context | Fingrid map, node placement, north–south constraint |
| **Build pathway** | four-phase development → operations timeline | path to commercial operation |
| **Transaction** | capital structure | structure, counterparties, commercial terms |
| **Model** | — | drivers, scenarios, two sensitivity grids, annual cash flow |
| **Evidence** | "evidence you can follow" | sources |

Render these through `_shared/blocks.js` rather than porting the attachments' bespoke HTML. The
block vocabulary already covers most of it — `kpis` `table` `timeline` `phases` `gates` `wf`
`line` `bar` `why` `src` — so a dossier becomes a data file, and the two attached HTML files
become **inputs to a transcription step, not code to import**. This matters: the Finland
attachment carries its own CSS, its own SVG structure diagram and its own chart code, none of
which should enter the platform as a second rendering lineage after §3 spends effort deleting
the first one.

Two blocks are genuinely new and belong in the dossier vocabulary:

- `structure` — the ownership/contract diagram (boxes, roles, edges). Data-driven, so it works
  for both projects and every future one.
- `sensGrid` — the two-axis sensitivity grid with a highlighted base cell.

The interactive model (input sliders, scenario carry, reset) maps onto the existing
`labInputs` / `labOut` / `labSnaps` blocks that already drive the market Investment Lab. Reuse
them rather than porting a second slider implementation.

### 2.5 The publication decision — needs sign-off

**First, the right word. These dossiers are *local-only*, not *private*.** `src/local/loader.js`
says it in its own header: this is not security. It keeps confidential data out of the public
artefact — a different and achievable goal — and anyone holding the repository and the
`local-data/` directory holds the data. Calling it "private" invites a use it cannot support.

So there is a product decision underneath the publication decision:

| Need | Mechanism | Available here? |
|---|---|---|
| One analyst reads dossiers on their own workstation | `local-data/` + dev server | **yes — this is Option A** |
| Colleagues read dossiers without holding the repo | authenticated server-side delivery, confidential storage, authorization | **no.** Out of scope for a static site, and `docs/data-policy.md` explicitly rules it out |
| Anyone reads a non-confidential descriptor | tracked, redacted page | **Option B** |

**Settled: local-only.** Dossiers stay on the analyst workstation through `local-data/`. The
middle row — authenticated colleague access — is **out of scope for this plan** and is a separate
future project requiring a private deployment with server-side authorization. It is not a
follow-up task on this workstream, because nothing built here advances it: a static site cannot
be extended into it, and attempting to would produce exactly the "scheme that pretends
client-side code can keep a secret" that `docs/data-policy.md` rules out by name.

| | Option A — local-only (recommended) | Option B — redacted public page |
|---|---|---|
| Where | `local-data/dossiers/` | tracked `src/`, with a private layer for the withheld parts |
| WA project | **only viable option** — its name is a `FORBIDDEN` marker | not available |
| Finland project | full dossier, dev only | capacity, technology, COD, connection voltage, TSO/DSO, stage, and public grid context — **no** counterparties, pricing, capital structure or model outputs |
| Guard changes | none | `FORBIDDEN` gains the Finland deal's markers |
| Risk | none new | every future edit to that page is one careless paste from a permanent leak |

**Recommendation: A for both, now.** Option B for Finland is defensible later *if* the sites,
capacities and connection status are independently confirmed to be in a public register — the
attachment states a signed grid connection agreement and a named DSO area, which suggests some
of it is public, but that must be verified against the register itself, not inferred from the
deal document. That verification is a prerequisite, not a detail.

Under **either** option the Finland deal's markers must be protected — the attachment sits on the
same machine as this repository — but they go into the **ignored local marker file and the CI
secret** described in §2.6.1, never into tracked source. That is the correction that makes the
rest of this workstream safe to start.

### 2.6 Redesigning the marker mechanism

Two defects, both of which must be fixed before any new deal is protected.

#### 2.6.1 The marker list publishes what it protects

`FORBIDDEN` is a plaintext array in `tests/bundle-confidentiality.test.js`, and that file is the
first entry in `MARKER_DECLARATION_SITES` — exempt from the scan it defines. So the guard's
detection rule is also a published copy of the confidential values.

Proposed split: **generic logic tracked, specific values not.**

| | Where | Tracked |
|---|---|---|
| Scanner logic, walk, assertions, failure messages | `tests/bundle-confidentiality.test.js` | yes |
| Structural patterns with no confidential content (document-store URLs, `CONFIDENTIAL_*` prefixes) | same file | yes |
| Deal-specific markers | `local-data/markers.json`, git-ignored | **no** |
| Same set, for CI | repository secret, e.g. `GUARD_MARKER_SET` | **no** |

**Fail closed.** In CI the marker set must be present or the run fails, in exactly the register
the existing `REQUIRE_OUTPUT` flag already uses: an absent marker set means nothing was scanned,
and a skip is what let this guard sit inert through every CI run once already.

**One addition to the proposal, because absence is not the only failure.** Fail-closed catches a
*missing* secret; it does not catch a secret that has been quietly edited down — which is the
exact failure the guard's own final test (`the marker list itself has not been redacted away`)
exists for, and which actually happened during the history purge. So the tracked file should
carry a **committed marker-set fingerprint** — the count and a salted hash of the sorted set —
and CI should assert the supplied set matches it. That keeps the set reviewable through code
review (a changed fingerprint is a visible diff requiring justification) without publishing a
single value.

**Scope note, so this is not oversold.** Removing the sixteen existing markers from HEAD does not
un-publish them: they are in history, and history was already rewritten once at real cost. The
value of this redesign is almost entirely in *not adding the seventeenth through twenty-fifth*.
Retrofitting the existing list is optional, cosmetic at HEAD, and only meaningful if it is ever
combined with another purge — which is not proposed here.

#### 2.6.2 The tracked-tree scan reads the wrong bytes

The scan enumerates paths with `git ls-files` but then reads each file **from the working tree**.
Those are different contents whenever the index and the working tree disagree. Staging a
confidential file and then reverting the working copy leaves the guard reading a clean file while
the confidential blob sits in the index, ready to commit.

Two consequences:

- The **pre-commit hook must read staged blobs**, not paths — `git diff --cached --name-only -z`
  to enumerate, `git show :<path>` to read. Anything else inspects a file the commit will not
  contain.
- The **CI test should do the same**, or at minimum scan `HEAD` contents rather than the
  checkout. In CI the two usually agree, which is why the defect is invisible there — but "usually
  agrees" is the standard this file's own header rejects.

The hook is an addition to CI, not a replacement: it catches the leak at the moment it becomes
committable, and CI remains the thing that cannot be bypassed with `--no-verify`.

---

## 3. Wider reuse of the shared engine

### 3.1 Where reuse already stands

Eleven of twelve dashboards are already on `_shared/engine.js`:

```
gb ie ro pl de it nem pjm ercot caiso jp   →  block engine, ~20-line dashboard.js
wa                                          →  hand-written, 807 KB, 13 section files, own lib/
```

So "use as much shared engine as possible" is, concretely, **one migration**: WA. It is also the
largest, oldest and most heavily linked market on the platform, which is why it was left alone.

### 3.2 What WA has that the engine does not

Migrating WA is not a transcription job, because WA carries four capabilities the block engine
never needed:

| WA module | Size | Disposition |
|---|---|---|
| `lib/optimizer.js` + `sections/optimizer.js` | 49 KB | extract to `_shared/optimizer.js`, capability-flagged |
| `lib/brcpEngine.js` + `sections/brcp.js` | 34 KB | WA-specific (RCM benchmark price) — keep local, expose as a block type |
| `officialPlanning.js` + section | 12 KB | **already shared with IE** (`tests/wa-ie-official-planning.test.js`) — promote to `_shared/` |
| `economicsP0.js` + `economicsP0Section.js` | 18 KB | **three copies exist** — WA, GB, IE. Promote to `_shared/`, one implementation |
| `congestion.js` | 9 KB | **twelve copies**, one per market. See below |
| `lib/exports.js`, `lib/scores.js`, `lib/lab.js` | 13 KB | superseded by `_shared/exports.js`, `compute.js`, `lab.js` |

Two of these are real duplication findings independent of WA:

- **`economicsP0` exists three times.** GB's and WA's differ by market specifics wrapped around
  the same calculation. `tests/p0-economics-wa-gb-ie.test.js` and `tests/shared-p0.test.js`
  already assert across them, so the tests to prove a merge safe are written.
- **`congestion.js` exists twelve times**, one per market, joined by `congestionRegistry.js`.
  That may be correct — congestion genuinely differs per market — but twelve files averaging
  11 KB deserve a diff before that is accepted. If they share the shape the way the original four
  dashboards did, the same argument applies: one engine, twelve datasets.

### 3.3 The one thing that must not be quietly unified

`_shared/lab.js` brackets `irrOf` at `[-0.9, 1.5]`. The home cockpit and WA bracket
`[-0.9, 2.0]`. This is documented as a real divergence in the prototype, not a transcription
slip, and `lab.js` keeps its own copy deliberately.

**Unifying them changes published IRRs.** That is a methodology change, which under the
governance model is analyst-controlled and cannot ride along inside a refactor. It needs its own
proposal, its own before/after table across all fifteen markets, and its own sign-off. The WA
migration must preserve the divergence exactly, and `tests/baseline.test.js` plus the fixture
generator are the instruments that prove it did.

### 3.4 Route-level code splitting — the efficiency item

Independent of WA, and larger in effect than all of the above. **But splitting the market registry
alone achieves almost nothing**, and the first draft of this plan said otherwise. There are four
static import graphs that each pull in every market, and every one of them has to be cut:

| Module | What it statically imports | Effect if left alone |
|---|---|---|
| `markets/registry.js` | all 14 market modules | the one everybody notices |
| `markets/gridMapRegistry.js` | **all 12 `gridMapData.js` modules** (17–69 KB each) | first market visit still loads every map |
| `markets/congestionRegistry.js` | all 12 congestion registers | same, for constraint data |
| each market `index.js` | its own tabs + sources + data | pulled in by the above regardless |

The grid registry is the one that would have quietly defeated the whole exercise: the shared
engine imports it, so a split registry plus an unsplit map registry still ships ~460 KB of map
geometry to every visitor. It needs the same treatment — a per-market lazy join, with the home
globe taking a **summary** projection rather than the full geometry, and detailed congestion data
loading only on the grid tab.

**Japan is the case that breaks a naive split.** Three allocation points share one dashboard via
`dashboardId`, and `dashboardOwner()` resolves it. The loader must key on the *owner's* module so
three market entries share one chunk rather than triggering three loads or three copies.

#### The API, stated honestly

`src/utils/validation.js:218` requires `dashboard` to be a function, `src/app/app.js`'s `render()`
is synchronous, and several tests assert both. A "lazy accessor" that returns a promise while
keeping the name `dashboard` would satisfy none of them and would disguise an async boundary as a
property read. Do it explicitly instead:

```javascript
{ manifest, comparison, loadDashboard: () => import('./gb/dashboard.js') }
```

`dashboard` stays synchronous where it exists; `loadDashboard` is the new, obviously-async surface.
`dashboardMarkets()` filters on the presence of `loadDashboard`, and validation gains a rule for
it rather than having its existing rule loosened. `render()` grows a small async path that must
handle three states the current code has never needed:

- **loading** — a skeleton, not a blank `#app`
- **failure** — a chunk that 404s after a redeploy is a real production case; it needs a retry, not a white screen
- **stale navigation** — a resolved chunk whose route is no longer current must not render

#### Measuring it

Raw source size and the 4.0 MB figure are diagnostics, not targets. The acceptance metrics are
**compressed bytes on first paint of the home page** and **compressed bytes added by the first
market visit**, with Japan measured separately because of the shared-dashboard case. Set both as
a committed budget with a test that fails when exceeded — the same enforcement style the rest of
this repository already uses. `vite.config.js` has no `manualChunks` today, so chunk boundaries
are worth asserting rather than hoping for.

The confidentiality bundle scan already walks every `.js` in the output directory recursively, so
extra chunks are scanned exactly as the single file was — no weakening of the guard. Worth
re-confirming once real chunks exist, since it is the assumption that matters most here.

### 3.5 Suggested order

1. Route-level code splitting (independent, largest win, no methodology risk)
2. Promote `economicsP0` and `officialPlanning` to `_shared/` (tests already exist)
3. Diff the twelve `congestion.js` files; unify only what the diff justifies
4. Extract the optimizer to `_shared/`, capability-flagged
5. Migrate WA's remaining sections to block specs, IRR bracket preserved

Steps 1–3 are worth doing whether or not step 5 ever happens.

---

## 4. "How a BESS actually gets built here" — a new section per market

### 4.1 The gap, stated precisely

The platform answers *what the market pays* and *why the thesis holds*. It does not answer *what
a sponsor actually does, in what order, with whom, and how long each step takes*. That is the
question that separates a research dashboard from a development playbook.

### 4.2 It is a data edit, not a feature

The block engine already has every primitive this needs: `phases`, `timeline`, `gates`, `ladder`,
`flow`, `wfrows`, `table`, `src`. So the section is a `buildSections()` entry per market plus one
new tab id — and in the eleven shared-lineage markets, that is the entire implementation cost.

One canonical stage schema, so the tab is comparable across markets the way the league table is:

```javascript
{
  stage:      ['Connection application', '并网申请'],
  owner:      'sponsor → TSO',
  instrument: 'the rule, code or statute that governs it',
  duration:   [minMonths, maxMonths],
  gate:       ['what decision ends this stage', '…'],
  cost:       ['which cost bucket it lands in', '…'],
  evidence:   ['sourceId', …],   // resolves through the market's own sources.js
}
```

Nine stages, common across every market on the platform:

1. Site control and land 2. Connection application 3. Studies and connection offer
4. Planning / environmental consent 5. Grid code compliance and performance standards
6. Revenue qualification (capacity certification or reserve prequalification)
7. Procurement and EPC 8. Construction 9. Commissioning, registration, market entry

Stage 6 is the one that varies most and is exactly what the platform already measures — so the
build pathway and the revenue tabs cross-reference each other rather than repeat.

### 4.3 The WA worked example, and its honest limits

WA is the right example because the platform's deepest analysis is already there and the
attachment's development narrative provides the spine. The stages can be evidenced entirely from
public material:

- WEM Rules and the Reserve Capacity Cycle timetable
- the operator's applications-to-connect process and access offer stages
- generator performance standards
- the network operator's published connection process and fee schedule
- environmental and planning approval pathways
- listed-company announcements and regulator decisions for observed real-world durations

**State the limit on the page itself.** Correspondence between a developer and the network
operator is not public. What is reconstructible is the *framework* — the statutory steps, their
sequence, their gates and their published timeframes — plus observed durations inferred from
announcements. A page that implied more than that would be the same failure mode the platform's
badge vocabulary exists to prevent. The section should carry a `verify` badge and say plainly
that stage durations are inferred from public announcements rather than disclosed.

Use the WA project as the illustrative track through the framework **without naming it** — "a
long-duration project in the industrial strip" is enough to make the sequence concrete, and it
keeps the page on the public side of the line.

### 4.4 Finland as the second example

Finland is the natural second because the attached project runs the pathway twice at different
voltages — TSO main-grid connection with a signed agreement, and a DSO 20 kV connection with
prequalification pending. That contrast is the clearest illustration on the platform of why
connection level drives timeline and cost, and both halves can be described from the TSO's
published connection process and grid code.

### 4.5 Governance classification

This content is **qualitative conclusion and analyst-controlled**. Under the governance model no
ETL job and no automated agent may write or amend it. Observed durations, if ever ingested,
enter as a separate observed series shown beside the framework — never merged into it.

---

## 5. UI unification and de-jargoning

### 5.1 Vocabulary — what changes and what does not

`seed` appears 676 times in `src/`. Nearly all of those are identifiers, keys, dataset names and
comments. **Roughly thirty are user-visible strings**, and those are what should change.

| Now (visible) | Proposed | Where |
|---|---|---|
| `SEED_JSON_V1`, `GB_SEED_V1`, … chips | removed from the page; folded into "As at ‹date›" | `components/badge.js` `statusBadge()` |
| `LIVE_ETL_REQUIRED` | "Live feed pending" | same |
| "Illustrative seed — not official" | "Illustrative — not official" | `BADGE_LABELS.illus` |
| "Illustrative seed — excluded from investment metrics" | "Illustrative — excluded from investment metrics" | `governance/authority.js` |
| "Reset to seeds" | "Reset to base case" | `home/investmentLab.js` |
| "All inputs at seed" | "All inputs at base case" | same |
| "n inputs moved off seed" | "n inputs changed" | same |
| "seed ‹value›" chip | "base ‹value›" | same |
| "Dated approved seed fallback is used" | "Using the last approved exchange rates" | `home/allocationMatrix.js` |
| "normalize / normalized" | "like-for-like" | home page copy |
| "ETL" in reader-facing copy | "data refresh" | `/data` page, captions |
| "P0 economics" | "headline economics" | section titles |
| "Seed snapshot verified" | "Verified" | `markets/marketPage.js` |
| "dashed = illustrative seed series" | "dashed = illustrative" | `charts/lineChart.js` |

Kept as-is because they are precise and a professional reader expects them: `merchant`,
`capacity market`, `tolling`, `ancillary services`, `de-rating`, `IRR`, `capex`, `curtailment`.
De-jargoning is not dumbing down — it is removing *implementation* vocabulary, not *domain*
vocabulary.

Three implementation notes:

- Every string is a `[en, zh]` pair. Each row above is two edits, and the Chinese must be
  re-read by someone who reads it — `种子值` is as odd in Chinese as "seed" is in English.
- `BADGE_LABELS` and `authority.js` are single dictionaries, so those rows change every market at
  once. That is most of the table for very little work.
- **No number may move**, and the first draft named the wrong command for proving it.
  `npm run test:baseline` is not a verification step — it is
  `node tests/fixtures/generate.mjs > tests/fixtures/legacy-baseline.json`, which **overwrites the
  frozen baseline with current output**. Running it "before and after" would launder a regression
  into the expected data. The correct check is to run the tests that read the fixture without
  regenerating it:

  ```bash
  node --test tests/baseline.test.js tests/current-model.test.js
  ```

  Regenerating the fixture is a deliberate, separately justified act for when a number is *meant*
  to move. It belongs in the same category as a methodology change, not in a refactor's checklist.

### 5.2 Visual direction

The reference is a top-tier PE or consulting document: quiet, dense, confident, and legible when
printed. Concretely, against what is on the page now:

**Typography.** One serif or high-contrast sans for headings, one neutral sans for body, tabular
lining figures for every number in every table and KPI. Establish a real modular scale in
`src/styles/tokens.css` and delete ad-hoc `font-size` declarations across the nine stylesheets.

**Colour.** The palette currently works hardest at distinguishing fifteen markets. Invert the
emphasis: a near-monochrome page, with the categorical ramp confined to charts, and exactly one
accent colour used for the reader's current position and nothing else. Semantic colours (positive,
caution, withheld) become tokens rather than per-component choices.

**Badge density.** Blocks currently carry stacked provenance badges. Keep **one** quality badge
visible per block; move the rest into the source drawer, which already exists and is
under-used. A page that labels everything labels nothing.

**Section rhythm.** Every section opens with a one-sentence editorial statement of what it
argues — the PE-memo convention — then the evidence. `sectionHeader.js` already takes a
bilingual sub-line; the discipline is to always fill it and to make it a claim, not a
description.

**Grid.** One layout grid across home, market and dossier pages. Today `layout.css`,
`market.css`, `cockpit.css` and `components.css` each solve this separately.

**Print.** A print stylesheet that turns any market or dossier page into a clean PDF. For the
intended audience this is a feature, not a nicety.

**Chrome.** Nine CSS files totalling 66 KB with overlapping responsibilities. The consolidation
is worth doing in the same pass, because otherwise the new tokens become a tenth layer.

### 5.3 Scope control — settled

This is the workstream most likely to sprawl, so the boundary is drawn tightly:

| Round 1 | With Finland (round 3) | Round 6 |
|---|---|---|
| **Vocabulary only** (§5.1) | **The second visual channel** (§1.3) — dash pattern / marker shape in the grouped charts | Typography, grid, badge density, print, CSS consolidation, colour-by-region |

The visual channel is pulled forward deliberately and is **not** an exception to the boundary:
without it the fifteenth market has no discriminator, so it is a Finland dependency rather than a
design improvement. It ships as the minimum needed to keep the charts readable at fifteen
series — the channel and nothing else. The palette itself is not touched until round 6.

This also means the accessibility benefit in §6.6 arrives with Finland rather than at the end,
which is the right order: colour has been the sole carrier of meaning in those charts for
fourteen markets already.

---

## 6. Further proposals

**6.0 Documentation is stale in two places that matter, and both are load-bearing.**
`docs/data-policy.md` still states *"The loader is a stub"* and *"the local-data interface is a
later phase and is deliberately not implemented"* — it is implemented, and §2 builds on it. The
same document lists `dist/assets/*.js.map` as public because *"source maps ship by default"*;
`vite.config.js` sets `sourcemap: false` precisely because a `dist/` scan once found confidential
names reachable through a map. A policy document that misdescribes the safeguards is worse than
one that is merely out of date: it is the document someone will reach for during the next
incident. This moves into round 1.

**6.1 Build the two routes the router already names.** `/compare` and `/methodology` are
documented as "not built — a single entry in the table". A methodology page is also where the
"seed" vocabulary can be explained once, properly, instead of leaking into every caption.

**6.2 Pre-commit confidentiality hook reading staged blobs.** §2.6.2. Cheap, and it moves the
guard from after-the-push to before-the-commit — provided it reads the index rather than the
working tree, which is the defect the current scan has.

**6.3 Revisit Elexon BMRS.** Deliberately not wired because its gateway 403s. It carries
imbalance and BM data, which is the better GB source; it would be a second GB dataset, not a
replacement.

**6.4 Track the anchor windows.** Anchors start unset and must stay unset until each market's
trailing window fills. Nothing currently surfaces *how full* each window is, so "still unset" and
"forgotten" look identical. A row on `/data` showing window fill per market closes that.

**6.5 A dossier is a reusable primitive.** Built as proposed in §2, the third project is a data
file. That is the same argument the market registry won, applied to deals.

**6.6 Accessibility pass.** Colour is currently the sole carrier of meaning in several charts;
the second visual channel from §1.3 fixes the fifteen-market problem and the colour-blind
problem with one change.

**6.7 A "what changed" feed.** The ETL commits to `main` every six hours and the history is the
audit trail — but a reader cannot see it. A dated list of what moved, generated from the commits
that already exist, turns the audit trail into a feature.

---

## Sequencing

Revised. The confidentiality redesign moves to the front — it is a prerequisite for the dossiers
rather than a companion to them — and code splitting becomes a proof on two markets before it
becomes a migration of fourteen.

| Round | Contents | Rationale |
|---|---|---|
| **1 — DONE 2026-08-18** | §2.6 marker redesign + staged-blob scanner · §6.0 documentation cleanup · §5.1 vocabulary | Nothing touching project material is safe to start until the marker mechanism stops publishing what it protects. The doc cleanup belongs here because the policy document is what the next incident gets read against. Vocabulary rides along: no numbers, no new content. **See the delivery note at the foot of this document.** |
| **2** | §3.4 code-splitting **proof** — one ordinary market plus Japan | Establish `loadDashboard()`, the async render path, chunk boundaries and the compressed-bytes budget on two markets. Prove it before migrating twelve, and before Finland and the dossiers land into the structure. |
| **3** | §1 Finland — evidence pack first, then comparison interface and feeds · **§1.3 second visual channel** | Registered with `engineReady: false`. The saturation gate and the licence terms are part of the evidence pack, not follow-ups. The chart discriminator ships here because the fifteenth market has no other way to be legible. |
| **4** | §4 build pathway — Finland and WA together | Building both at once stops the schema being WA-shaped. |
| **5** | §2 dossiers, Option A, on the stabilised block vocabulary | Depends on round 1 for safety and round 4 for the block types it reuses. |
| **6** | §5.2 visual redesign (typography, grid, badge density, print, CSS) · §3.2/§3.5 WA engine migration | Two separate projects, each large enough to deserve its own plan. The IRR bracket (§3.3) is a third. |

## Decisions — all closed

| | Decision | Note |
|---|---|---|
| 1 | §2.5 — dossiers **local-only** for both projects | Authenticated colleague access is **out of scope**: separate project, private deployment, server-side authorization |
| 2 | §1.3 — **second visual channel**, shipping **with Finland in round 3** | A Finland dependency, not a design improvement |
| 3 | §1.4 — reader-facing **"Resource adequacy revenue"**; internal `capacityMarket` unchanged | *Not* "long-term adequacy payment" — PJM's auction clears one delivery year at a time. Duration reported separately, resolved per risk class |
| 4 | §1.4 — Finland `tolling: false` until repeatable public evidence | Two independent public sources, cited in `sources.js`, to flip it |
| 5 | §3.3 — **preserve** the IRR bracket divergence | Unifying it is a methodology change with its own proposal and sign-off |
| 6 | §2.6 — **marker mechanism redesigned** before any project work | Prerequisite for rounds 3–5 |
| 7 | §5.3 — **vocabulary only** in round 1; full visuals in round 6 | |

No open items. Round 1 — marker redesign, staged-blob scanner, documentation cleanup,
vocabulary — is ready to start.

---

# Round 1 — delivery note, 2026-08-18

All four workstreams are implemented. `npm test` is 411/411; the build is clean; the artefact scan
passes with `REQUIRE_OUTPUT=1 REQUIRE_MARKERS=1`.

## What was built

**Marker redesign (§2.6.1).** The fourteen deal-specific markers moved out of
`tests/bundle-confidentiality.test.js` into git-ignored `local-data/markers.json`, supplied to CI as
the `GUARD_MARKER_SET` secret. Tracked source now holds only the scanner, two structural patterns
that carry no confidential content, and a committed fingerprint (`scripts/lib/markers.mjs`).

**There are now no path exemptions at all.** `MARKER_DECLARATION_SITES` is gone: the guard's own
source and `docs/data-policy.md` no longer name a marker, so every tracked *text* file is scanned
with nothing carved out. Files containing a NUL byte are still skipped — a marker inside a
compressed container is not plaintext — which is why the hook refuses staged document containers
rather than skipping them. A new test, `no marker is readable in tracked source`, asserts that the
guard has not gone back to publishing what it protects.

The secret is called `GUARD_MARKER_SET` rather than anything beginning `CONFIDENTIAL_` because
`CONFIDENTIAL_[A-Z_]+` is one of the structural patterns. The first draft used the obvious name and
failed its own scan — which is the removal of the exemptions working, on its first run.

**Staged-blob scanning (§2.6.2).** `scripts/scan-staged.mjs` reads `git show :<path>`, wired as
`.githooks/pre-commit` and installed with `npm run guard:install`. The tracked-tree test gained a
second pass over staged blobs, so `npm test` with a dirty index no longer reads different bytes from
the ones about to be committed.

**Documentation (§6.0).** `docs/data-policy.md` no longer says the loader is a stub or that source
maps ship by default; the "original flags, kept for the record" section describes two resolved
problems rather than two outstanding ones, and does so without naming the third-party firm.
`local-data/README.md` no longer says the interface is unbuilt.

**Vocabulary (§5.1).** The plan's table is applied and verified in the browser across all twelve
dashboards. `SEED_JSON_V1` / `GB_SEED_V1` / `LIVE_ETL_REQUIRED` no longer appear anywhere a reader
can see: the status chip reads *Base case* or *Live feed pending*, the warning banner on every
market page opens "an approved base-case snapshot", source health reads "base case", and the
freshness label is "Verified".

## Verified, not asserted

- **Fail-closed and skip both work.** With no marker set: 4 skips and a green run locally, 4
  failures under `REQUIRE_MARKERS=1`.
- **Tamper detection works.** A shortened set fails the fingerprint test with a message naming the
  expected count.
- **The staged-blob gap is really closed.** Staging a marker and then reverting the working copy —
  the exact case the old scan missed — is caught by both the hook and the test. A real
  `git commit` was blocked and `HEAD` did not move.
- **No published number moved.** Regenerating the baseline fixture immediately before the
  relabelling was byte-identical to the committed one: 0 numeric and 0 textual diffs.

## Two judgement calls worth reviewing

**The baseline fixture was not regenerated.** Relabelling `No capacity mechanism` →
`No resource adequacy revenue` broke three baseline cases, because the fixture pins the prototype's
*wording* for an unavailable route. The fixture says "do not hand-edit" and means it — it is a
verbatim dump of the prototype's normalization layer, and rewriting it to match today's engine
destroys the migration's central proof. So `tests/baseline.test.js` translates the one changed label
through an explicit `NA_RELABELLED` map. The reason for each unavailable route is still asserted;
only its current spelling lives in the test. The alternative — asserting merely *that* a case is
unavailable — would have thrown away the distinction between "no adequacy revenue" and "no toll
precedent", which is the part worth checking.

**`modelVersion` was left alone**, so `Model version: caiso-seed-1.0-…` still renders on eleven
market pages. It is not chrome: it is classified `METHODOLOGY` in `src/governance/authority.js` and
is stamped into every CSV and JSON export as a provenance identifier. Renaming those values changes
what published exports claim about their own vintage, which is a methodology change and not a label
change. GB already reads `gb-governed-2.0-fes-tec`, so "seed" there is *meaningful* — it says that
market is still on base-case assumptions. Worth resolving by moving the string off the header strip
rather than by renaming it.

## What remains, and why it was not swept

Two classes of `seed` survive in reader-facing text. Both are market analysis rather than chrome, so
they sit outside §5.1's scope and need a decision before a sweep:

| | Example | Scale |
|---|---|---|
| Table row qualifiers | `Capacity clearing price (seed)` | ~8 rows, Poland only |
| Analytic prose | `A single seed is indefensible`, `it is already inside the merchant seed`, `economics are illustrative seed pending the ETL` | Germany, ERCOT, Japan, Poland |

The prose case is the one to think about: in "a single seed is indefensible" the word carries an
argument — *a single point estimate* — and replacing it mechanically would flatten the sentence.
Each is a bilingual pair in a market's own data module, so this is a per-market copy edit rather
than a dictionary change. Recommend folding it into round 6 with the rest of the editorial pass.

---

# Round 3 — Finland, stage 1 of 2. 2026-08-18

**Stage 1 delivered the evidence pack and comparison interface. Stage 2, below,
completed the grid layer and Finland is now registered — fifteen allocation
points, `engineReady: false`.**

## The correction to §1.7

`docs/adding-a-market.md` says registering a market is a new directory and two
lines, and that the dashboard can follow later. The first half is true and the
second half is true, but between them sits something neither the doc nor §1.7 of
this plan accounted for: **the grid layer is a hard gate, not an optional
surface.**

Adding `fi` to `registeredMarkets` fails seventeen assertions:

| Missing | Test |
|---|---|
| congestion register | `fi: no congestion register — it would be absent from the home comparison` |
| grid map | `fi: no grid map resolves for this market` |
| transmission voltage row | `fi: no transmission voltage definition` |
| pipeline source declaration | `fi: no pipeline source declaration` |
| dashboard, eager or lazy | `fi: no dashboard, eager or lazy` |
| non-null `modelVersion` | `fi: manifest.modelVersion is still null` |
| `COMPARISON_AUTHORITY` entries | authority.js ownership |
| `source` on every range, symmetric dispersed bands | ranges validation |

Those tests are right and the plan was wrong. A registered market is one the
home page can draw a map for and compare constraints across; a market without
that is not "partially registered", it is a market whose home-page surfaces
would silently render empty.

**So Finland is built and deliberately not registered.** `src/markets/fi/` is
complete as far as evidence allows and `registry.js` carries a comment saying
why the import is absent. Nothing imports the module, so Vite tree-shakes it out
— the entry chunk is unchanged at 296.53 kB gzip, verified.

## What the evidence established

Read on 2026-08-18 and recorded in `src/markets/fi/sources.js`.

**`capacityMarket: false` is now evidenced rather than assumed, and the reason is
better than "storage cannot participate".** Finland *has* a capacity mechanism —
peak load capacity under act 117/2011, administered by Finextra. The Energy
Authority procured **no capacity at all** for 1 Nov 2025 – 31 Oct 2026, and
nothing has been held in the strategic reserve since July 2022, because after
Olkiluoto 3 the national adequacy assessments show no concern against the
LOLE 2.1 h/yr standard adopted in March 2022. A dormant strategic reserve held
outside the market is not resource adequacy revenue on either count.

**The saturation gate is not a hypothetical, and it is the headline.** Fingrid's
2026 obligations against the announced battery fleet:

| Product | 2026 obligation |
|---|---|
| FCR-D up | 309 MW |
| FCR-D down | 298 MW |
| FCR-N | 128 MW |
| FFR | 0–60 MW |
| aFRR | ~50 MW |
| mFRR up / down | 880–1,300 MW / 575 MW |

The fast products a battery actually wins total under 800 MW. Finland had about
250 MW of BESS operational in mid-2025, with Statkraft/OX2's 235 MW, Nivala's
70 MW and Uusikaupunki's 50 MW announced or under construction on top.

And Fingrid's own 2026–2036 forecast does not rescue it, because **the growth is
in the wrong products**: mFRR down rises 567 → 1,100 MW and mFRR up 290 → 530 MW,
while **FCR-N declines 128 → 105 MW**. Growth sits in slower products where a
battery competes with demand response and thermal plant on cost.

**So the services leg is published as zero, and says so.** That is not an
estimate — it is a refusal, recorded in `servicesNote` and gated as FI-1. It
understates the asset substantially, which is the intended direction: a market
held out of the ranking with a visibly incomplete revenue line invites scrutiny;
a plausible number inside the ranking does not.

**Licence gates the Fingrid feed, not the connector.** The open-data API is free
but needs a registered key, and the licence text sits behind that registration —
so redistribution terms are not established and no Fingrid series may be
republished yet. Gate FI-2. The ENTSO-E day-ahead feed has no such problem and
its domain code is wired: `fi: '10YFI-1--------U'`.

## Corrections to earlier drafts of this plan

- The §1.1 table said Finland pays for capacity through "nothing". It has a
  mechanism; it is dormant. The distinction is the interesting part.
- §1.4's `tolling: false` holds — no repeatable public precedent was found.
- The fifteenth-colour decision is implemented as `manifest.pattern: 'hatch'`
  with Finland reusing `--s2`, per decision 2.

## Stage 2 — what registration needs

1. `fi/congestion.js` — Finland's constraint zones. The north–south transfer
   limit is the obvious candidate and is publicly documented by Fingrid.
2. `fi/gridMapData.js` — 400/110 kV substations with **real coordinates** from
   Fingrid's published network, plus the constraint corridor.
3. The transmission voltage row, and a pipeline source declaration.
4. `modelVersion`, once there is a model to version.
5. `COMPARISON_AUTHORITY` entries and `source` on every range.
6. Then the two-line registration, and the dashboard at leisure.

None of that is blocked on anything except research time. It is separated
because placeholder coordinates would satisfy every test and publish geography
nobody checked — which is the failure this platform is built to make impossible.


---

# Round 3, stage 2 — Finland registered. 2026-08-18

Fifteen allocation points. `npm test` 418/418, confidentiality 7/7, budget 5/5,
all with zero skips.

## What registration actually required

Stage 1 listed eight blocking assertions. All are closed:

| Was missing | Now |
|---|---|
| congestion register | `fi/congestion.js` — two zones |
| grid map | `fi/gridMapData.js` + a generated boundary |
| transmission voltage row | 400/220/110 kV, Fingrid |
| pipeline source declaration | `NO_SOURCE`, with the reason |
| dashboard | ten tabs on the shared block engine, loaded on demand |
| `modelVersion` | `fi-1.0-reserve-led-services-withheld` |
| authority classification | `manifest.pattern` → CONFIG |
| ranges | `source` on every one; the `services` band removed entirely |

## Three things worth reviewing

**A new congestion capture mechanism.** Finland fits none of the existing ones.
Romania charges for congestion, Italy pays for it, the NEM does neither but the
asset still runs. Fingrid simply refuses to connect: new grid storage
connections in southern Finland are restricted until 2029, against more than
30 GW of requests and about 1.8 GW contracted, with capacity still available in
Ostrobothnia and the north. Nothing is auctioned and nothing is compensated, so
`CAPTURE.CONNECTION_MORATORIUM` was added — money flow `neither`, the same
answer `UNCOMPENSATED` gives for a different reason. Forcing it into either
existing value would have implied a transaction that is not on offer.

That constraint is also the whole locational signal, because Finland is one
bidding zone: siting north or south changes no revenue line in the model, only
whether the project exists.

**No `services` band, deliberately.** Every other range lets a reader move a
value inside evidenced bounds. This one has no value to move — a zero-width band
fails the Lab's own rule, and a band with width would invite a reader to type in
the number this market declines to publish and then read the output as sourced.

**A latent bug Finland was the first to trigger.** `home/normalizationView.js`
indexed `runBaseCase(...).capY[0]` for every market it was handed. For an
`engineReady: false` market that call returns `{ na }`, so the stacked chart did
not render a short bar — it threw and took the whole home page with it. The flag
has existed since the registry was written and nothing had ever exercised it.
The chart now filters to engine-ready markets and states how many it held out,
rather than quietly drawing fewer bars than its caption claims.

Worth noting how it was found: dev rendered perfectly and the built artefact
failed, because the error surfaced through the lazy chunk's load path. A
temporary sourcemap build located it; sourcemaps are back off and zero `.map`
files are emitted.

## The map is honest about what it is not

Fingrid operates about 138 substations and 14,900 km of line, 5,400 km of it at
400 kV. None of that network is drawn. The markers are municipal and regional
centroids — the same convention every other map here uses — and `scope` says so.
Plotting a dozen substations from memory would have been worse than plotting
none.

## Cost of the fifteenth market

| | gzip |
|---|---|
| home before Finland | 296.52 kB |
| home after Finland | 304.56 kB |
| Finland's own chunk | 15.15 kB |

**About 8 kB on the home page for a whole new market**, against the ~100 kB it
would have cost before round 2. That is the clearest single measure of what the
split bought.

## Gates carried forward

FI-1 reserve saturation · FI-2 the Fingrid open-data licence · FI-3
Finland-specific capex, opex and fees · FI-4 a captured-spread backtest on
15-minute settlement · FI-5 the north/south split of the connection queue.

FI-1 and FI-2 are what `engineReady: false` waits on.


---

# Round 3, stage 2 — corrections after review. 2026-08-18

Six issues raised on the stage 2 commit. All applied.

## 1. The fleet number was stale, and the correction strengthens the thesis

The saturation argument used ~250 MW operational (mid-2025) plus 355 MW announced. The current
figure is **about 1,050 MW connected as of early February 2026** — 261 systems of 1 MW and above
totalling ~980 MW, plus ~70 MW of smaller batteries tracked through the reserve markets.

That changes the conclusion's force, not its direction. Connected storage no longer *approaches*
the ~795 MW fast-reserve obligation; it **exceeds** it. `pipelineRatio` moves from `~0.8x` to
`~1.3x`.

Two qualifications now travel with the number everywhere it appears, because dropping them would
be the same error inverted: it counts **all** storage of 1 MW and above rather than batteries
alone, and **56% is distribution-connected** against 44% on transmission. Distribution-connected
storage does reach the reserve markets, but not every megawatt is prequalified for every product —
so this is an upper bound on the competing fleet, not a measured one.

## 2. FI-2 conflated two different things

The gate said redistribution rights were unknown. They are not: the datasets publicly declare
**Creative Commons Attribution**, with downloads in JSON, CSV, XLSX and XML. What actually requires
action is narrower and specific to the API path — provision a key, accept and record the terms
presented at registration, and implement the attribution. FI-2 is reworded to that, and
`sources.js` now records the licence as observed rather than unread.

## 3. `services: 0` was the wrong machine representation

Corrected, and this was the most important of the six. Prose said "withheld"; the object said
`0`; every consumer reads the object. Zero is a **claim** — that a Finnish battery earns nothing
from reserves — and it is the kind of false that survives being copied into an export.

Finland now carries `services: null` with a machine-readable reason in `economics.unavailable`.
Supporting changes:

- `markets/schema.js` documents the contract (`UNAVAILABLE_REQUIRES_UNREADY`).
- `utils/validation.js` accepts a null required field **only** when the market is
  `engineReady: false` **and** the field is declared in `unavailable` — and rejects a declaration
  whose field is not actually null, so the two cannot drift apart.
- `comparison/vintage.js` no longer demands a number for a leg declared unavailable, and requires
  it to be null in all three cases rather than one.
- `governance/authority.js` classifies `economics.unavailable.services` as METHODOLOGY, so
  automation can never close the gap by supplying a number.
- **A new test**, `an unready market publishes no number anything can compute on`, asserts the
  representation directly: every declared field is null and not zero, every engine route returns
  `na` rather than a computed case, and the market is absent from `engineReadyMarkets()`.

## 4. Fleet evidence split into three sources

One citation covered an operator statistic and two press reports, which made them look like the
same class of evidence. Now: `storageFleet` (Fingrid, the aggregate), `statkraftOx2` (the named
235 MW agreement), and `tradePress` (Nivala and Uusikaupunki) — the last labelled in its own entry
and on the pipeline tab as **the weakest citations on the page**, shown because omitting known
projects would understate the fleet, not because the sourcing is strong.

## 5. The grid map is a scope change, now stated as one

§1.2 specified "Fingrid 400/110 kV nodes". What was built is municipal and regional centroids
standing for the places the argument is about. Those are not equivalent, and the difference matters
to a reader deciding whether a site is connectable.

The acceptance criterion is therefore **revised in writing rather than quietly met**: this is a
**thematic constraint map**, and both the module header and the reader-facing `scope` note now say
so in those words. Building the real network layer — which needs Fingrid's geodata under its own
licence — stays on the list.

## 6. `docs/adding-a-market.md` corrected

It promised "one new directory and two lines". That is true of *wiring* a market and false of
*registering* one. It now separates the two, and a new **Step 6 — the registration contract**
tabulates all eleven requirements with the assertion each one fails, plus the hardcoded lists that
need appending.

The claim that the dashboard "is optional and can come later" is also removed: the tests require a
dashboard and the standard ten tabs. The weaker true statement — that a market can be built before
it is registered — replaces it.


---

# Round 3, stage 2 — second review pass. 2026-08-18

Three findings, all applied.

## 1. `pipelineRatio` was carrying the wrong quantity, and the claim was too strong

`narrative.pipelineRatio` renders in the league table as **"Pipeline / operating ratio (own
basis)"** and every other market puts pipeline-to-operating there. Finland's `~1.3x` was connected
storage divided by summed fast-reserve obligations — a different quantity in a shared column, which
would have made one cell mean something different from the other fourteen. It even used a lowercase
`x` where the rest use `×`, which was the tell.

- `pipelineRatio` is now **`~29×`** — more than 30,000 MW of connection requests against about
  1,050 MW connected, which is what the field means, on Finland's own basis.
- The saturation comparison moved to `data.js` under `saturation`, with its caveats attached to it
  rather than left in prose elsewhere.

**And the claim itself was overstated.** "Already failed on volume" and "the competing fleet
exceeds the demand it competes for" are not supported by that comparison, because:

- the 795 MW is a **sum across distinct products** — FFR, FCR-D up, FCR-D down, FCR-N — procured
  separately with their own prequalification and clearing, so a megawatt is not fungible across
  them and the sum is an accounting convenience rather than one market to be filled;
- the 1,050 MW counts **all storage of 1 MW and above**, 56% of it distribution-connected, so not
  every megawatt is prequalified for every product.

Everywhere it appears — comparison header and thesis, `economics.unavailable`, the dashboard's
overview, reserve and pipeline tabs, the grid map, the congestion register and the decision
profile — this now reads **"an acute saturation warning rather than a measured oversupply"**, with
the two reasons stated where there is room for them.

That is still enough to justify the withheld line: the margin for an assumed level to persist is
thin enough that publishing one would be a forecast rather than an observation. It is not enough to
assert oversupply, and the earlier wording did.

## 2. Stale FI-2 statements

Four remained after the licence was corrected — `data.js`'s next milestone, `comparison.js`'s
"needs its licence read first", `sources.js`'s "once its licence is confirmed", and
`projectPipelineSources.js`'s "cannot yet be republished". All now reference provisioning the API
key, recording the terms accepted at registration, and implementing CC Attribution.

The pipeline declaration also gained the point that matters there: even with the licence resolved,
Fingrid publishes an **aggregate**, so FI-2 unlocks a series and not coordinates. There is still
nothing project-level to plot.

## 3. `schema.js` contradicted the corrected registration contract

Its module-surface comment marked `sources`, `tabs` and `dashboard` **optional**. They are optional
to the *type* — a module missing them parses, and a market can sit built-but-unregistered — and not
optional to a *registered* market. The comment now says so, lists what else a registered market
needs that does not appear in the export at all, and points at Step 6 of
`docs/adding-a-market.md`.
