# CI and E2E — the P0-2 changes, measured

What changed in the pipeline, why, and what it is worth. The pre-optimisation numbers are in
[`docs/performance-baseline.md`](performance-baseline.md) (P0-1, commit `d02f26d`); this document
records the change and its evidence.

## The call

**The full browser suite still runs before every publish. The check after a publish is now a
six-route smoke suite instead of a second full run.** That single step was 8.40 min of a 9.7-minute
publish job, re-asserting 168 behaviours against the same artefact the test job had just passed.
Nothing else in the release path changed: the same gates run in the same order, the same
`.vercel/output` bytes are scanned, and the same release script decides whether a publish happened.

Three smaller changes: `actions/setup-node` now caches npm on `package-lock.json` in every job that
runs `npm ci`; each gate is timed and the job summary reports what it cost; and the Playwright worker
count is configurable from the environment, left at two because no measurement justified more.

**Selective testing for data-only commits was investigated and rejected.** The reasoning is in
§4, and it is a rejection on evidence rather than on principle.

Evidence marker: **Strong** for the smoke replacement — the suite is measured locally, and the test job of the pull
request that introduced it ran green in CI. **Fair** for the publish-side saving, because a pull
request cannot reach the deploy job: the 8.4-minute live step is replaced in §2 by a derived
estimate from the local smoke run. What would change it: the first merge, whose deploy summary
prints the `production smoke` line.

## 1. What changed

| File | Change |
|---|---|
| `.github/workflows/ci.yml` | npm cache; timed gates; `ci-timings` artifact; job summaries; the post-deploy step runs `npm run test:smoke` instead of `npm run test:e2e` |
| `.github/workflows/etl.yml` | npm cache in the five jobs that install; the ETL step is timed and its duration lands in the refresh job summary |
| `playwright.smoke.config.js` | Separate config: `e2e-smoke/`, three workers, desktop and mobile, base URL from `PLATFORM_TEST_BASE_URL` |
| `e2e-smoke/production.spec.js` | Five tests × two viewports: home, GB and WA dashboards, news, the cross-market view, a deep link, horizontal overflow |
| `scripts/ci/timed.mjs` | Runs one command, records label, duration and exit code, passes the exit code through |
| `scripts/ci/summary.mjs` | Renders those timings into the job summary, with the failing steps named and the evidence linked |
| `package.json` | `npm run test:smoke` |

## 2. What it costs now

The publish job's shape, before and after. The test-job column is now observed: the pull request that
introduced this change ran green (run `41815632247`).

| | P0-1 (observed) | This PR (observed) | Publish side after the change |
|---|---:|---:|---:|
| Test job | 10.3 min | **13.45 min** | unchanged — same gates |
| — `npm test` | 3.32 min | 4.5 min | — |
| — full E2E | 6.25 min | 8.1 min | unchanged, still pre-deploy |
| — build, scans, budgets, Chromium, `etl:verify` | 0.5 min | 0.7 min | — |
| Publish job | 9.7 min | not exercised from a PR | **~2.5–3.0 min estimated** |
| — live check: install Chromium | 0.23–0.37 min | — | 0.23–0.37 min |
| — live check: browser suite | **8.40 min** (168 tests) | — | **~1.0–1.5 min estimated** (10 tests) |
| **Push to `main`, both jobs** | **20.3 min** | — | **~15–16 min estimated** |

**The test job was three minutes slower than P0-1, and none of it is this change.** The untouched E2E
step went from 6.25 to 8.1 min and `npm test` from 3.32 to 4.5 in the same run — the runner was
slower that hour. The steps this change adds (the timing wrapper, the two artifact uploads, the
summary) total 0.1 min.

The local measurement behind the publish estimate: the smoke suite ran 10 tests (5 × desktop and
mobile) in **1.2–1.8 min** across two runs against `vite preview`, with three workers. CI runs the
browser suite 2–3× faster than this host (P0-1 measured 6.25 min in CI against 19.4 min locally), so
1.0–1.5 min is the honest range — and the live step is a production network away from the preview
server.

**The publish side is still derived.** A pull request cannot reach the deploy job by design, so the
only step this change actually removes has not been observed yet. The first merge replaces the
estimate with the deploy summary's `production smoke` line.

## 3. The live check: what it actually proves

The old step ran the whole suite against `https://globalbess.vercel.app`. That could not prove a
publish had happened — a green run against a *previous* deployment looks identical — and the release
script already proves it: deployment identity and readiness are checked, the `release.json` stamp
must carry the candidate SHA, and only then is the deployment promoted. A superseded candidate
records `published: false` and skips the live step entirely.

What the live step uniquely proves is narrower, and `e2e-smoke/production.spec.js` asserts exactly
that:

- the domain answers and the page renders — home, GB and WA dashboards, `/news`, `/returns`;
- a direct visit to `/markets/great-britain/grid` reaches the grid section, which is the only thing
  that exercises the production rewrite (`vercel.json`) — Vite handles that in development, so no
  local test can;
- the market renderer chunk (`marketPage-*.js`, deferred on the home page) is requested and served,
  so a deploy that dropped an asset fails here;
- no uncaught exception and no 4xx/5xx on `/assets/**` or `/data/**`;
- the layout does not overflow at 390 px or 1440 px.

No price, no headline, no count that moves with the data. A smoke test that fails because a market
cleared at a different number teaches the operator to ignore it.

**A note on what is *not* in the smoke suite.** It does not save an investment case, switch language,
or open a story — those are behaviours, and they ran in the test job against this build. If a future
change makes the live check carry weight it cannot bear, the fix is to add an assertion that would
mean "the publish is broken", not to re-run the behaviours.

## 4. Selective testing for data-only commits: rejected

The question was whether a commit that touches only `public/data/**` can skip the unit suite and run
a narrower path. It cannot, on the evidence available:

1. **"Data-only" is not a safe category here.** `tests/print-snapshot.test.js` and
   `tests/transmission-snapshots.test.js` read published snapshots directly, and `npm run etl:verify`
   hashes every file under `public/data/`. A data commit can therefore fail the unit suite, and it is
   the suite that says so.
2. **The dependency is not path-shaped.** `src/governance/datasets.js` is imported by both the site
   and the ETL; `src/markets/registry.js` is read by the drift detector and the renderer. A change to
   either is a data change *and* a product change, and no path prefix distinguishes them.
3. **A filter that is wrong fails open.** A path rule that misses a dependency skips a gate and
   reports green. The failure mode is silent, which is the one property the release path must not
   have.
4. **Governance and release-security checks are not path-scoped at all.** The confidentiality scan
   must see the exact artefact on every publish regardless of what changed, and the bundle budgets
   measure the artefact, not the diff.

So the pipeline keeps one full path for every change. What would change the decision: an explicit
ownership map — test file → the paths it reads — enforced by a test that fails when a new test file
has no owner, with unknown paths falling back to the full suite. That is a larger piece of work than
this optimisation, and it is listed in §7.

## 5. Workers

Playwright stays at two workers. The count is now an environment variable (`E2E_WORKERS`), so the
comparison can be repeated on a runner without editing the config.

Measured on `e2e/story.spec.js` — the slowest file, 29 tests × desktop and mobile — on this laptop,
against the same built output, twice each:

| Workers | Wall | Result |
|---:|---:|---|
| 2 (current default) | **456 s** | 58 passed |
| 4 | **544 s** | 58 passed |

Four workers was **19% slower**. This host has eight logical cores but throttles under sustained
load, and the story suite is render-bound rather than network-bound, so the extra workers compete for
the same cores instead of overlapping waits. A four-core runner has less headroom still. Peak memory
was not instrumented; the wall time is the observation, and the direction of the effect is the useful
part.

That is one host and one file, not the whole suite. It is enough to say the P0-1 suggestion ("run four
workers") is not supported by measurement here, so the default does not change. What would change it:
a repeatable result on the runner itself, measured through `E2E_WORKERS=4` and the job summary's
`end-to-end suite` line over several runs.

## 6. Diagnostics

Every gate runs through `scripts/ci/timed.mjs`, which appends `label`, `duration` and `exit code` to
`$CI_TIMINGS_FILE` (`${{ runner.temp }}`). `scripts/ci/summary.mjs` renders that file into the job
summary: one table per job, the failing steps named, and a link to the run and its artifacts.

The deploy job downloads the test job's timings and prints them as `pre-deploy · …`, so one summary
shows both halves of the workflow. A missing artifact leaves the table short; it does not fail the
job. Timing is a report, never a gate.

Artifacts are unchanged and still retained on failure: `page-check-evidence`, `ci-timings`,
`production-release-<sha>`, `live-page-check-evidence-<sha>`. The PR run confirmed the loop end to
end: `ci-timings` uploaded at 279 bytes beside a 13.2 MB `page-check-evidence`, and the summary step
finished green.

## 7. What is left

| # | Bottleneck | Evidence | Next step |
|---|---|---|---|
| 1 | `npm test` — 1,307 tests, 3.3–4.5 min in CI | P0-1 and the PR run; no per-file breakdown exists | Capture TAP and rank files before changing anything |
| 2 | `story.spec.js` — 6.1 min on desktop alone | P0-1 | Parallelise within the file (`test.describe.configure`), not more workers |
| 3 | Chromium download — 0.23–0.37 min per job, twice per publish | P0-1 | Done 7 Nov 2026: cached on the Playwright version (§9) |
| 4 | Deploy job setup — 0.66 min for checkout, `npm ci`, global CLI install | P0-1 | Vercel CLI cached 7 Nov 2026 (§9); `npm ci` is genuinely needed (`vercel build` runs Vite) |
| 5 | The live smoke run is serialised behind the deploy lock | This document | Fine at ~1 min; revisit if it grows past two |
| 6 | Data-only changes still pay for the full suite | §4 | The ownership map described there |

Two things deliberately not done. **Sharding the E2E suite across jobs** doubles runner minutes and
complicates the gate for a saving that the smoke replacement already delivered. **Raising the worker
count** without a repeatable measurement is the change most likely to produce a flaky suite, and a
flaky suite in the release path is worse than a slow one.

## 8. Files

| File | Change |
|---|---|
| `.github/workflows/ci.yml` | Cache, timing, summaries, smoke replacement |
| `.github/workflows/etl.yml` | Cache, ETL timing in the refresh summary |
| `playwright.smoke.config.js` | The smoke run's configuration |
| `e2e-smoke/production.spec.js` | The smoke suite |
| `scripts/ci/timed.mjs`, `scripts/ci/summary.mjs` | Timing and reporting |
| `package.json` | `test:smoke` |
| `docs/publishing.md` | The publish diagram and what runs after a deploy |
| `docs/ci-performance.md` | This document |

## 9. Cutting the monthly minutes (7 Nov 2026)

**The call: about 3,700 minutes a month comes down to an expected 1,900–2,100, with no published
number moved and the release chain unchanged.** Every publish still runs the full unit, governance
and browser suites first, scans the exact `.vercel/output` bytes, and goes through
`scripts/publish-production.mjs` inside the `vercel-production` lock. What changed is the work that
could never publish anything: browser checks on pull requests, tests of commits main had already
moved past, and three of every four data runs.

Evidence marker: **Fair.** The baseline is measured; the savings are projected from it.
What would change it: the Monday briefing's new "Automation minutes" line, which reports the real
7- and 30-day figures every week from job durations.

### Where the minutes went

Measured over the last 30 days to 7 Nov 2026 with `scripts/ci/minutes.mjs`: 4,090 minutes, 2,961
of them in the last week. Each job is rounded up to the minute, as GitHub bills it.

| Work | 30 days | What it bought |
|---|---:|---|
| Pull-request test jobs (288) | 1,771 | The full browser suite averaged 4.7 min a run in the last week, every push of every PR |
| Main test jobs on push (156) | 1,030 | 56 of them (456 min) overlapped a newer merge; the release script refused those anyway |
| Main deploy jobs (148) | 462 | Each superseded candidate still ran `npm ci` and `vercel build` before being refused |
| Scheduled data runs (101) | 733 | Four a day, each a full test and publish, for sources that mostly change daily |

### What changed

| Item | Change | Expected saving |
|---|---|---|
| A1 | The data refresh runs once a day, 06:17 UTC, instead of every six hours. Connectors fetch from the last point they hold, so a daily run misses nothing. Datasets now declare `refreshHours: 24`, so the freshness badge does not call a day-old snapshot "overdue". | ~500 min/month (about 70% of the data line) |
| A2 | Pull requests: drafts run nothing; a newer push cancels the PR's run in progress; the browser step is the 10-test smoke suite against the PR's own build. All other gates stay. Label a PR `full-check` to run the full suite on it (`full-check.yml`). | ~700–800 min/month at the current pull-request rate |
| A3 | A main run whose commit is no longer main's head skips its remaining gates and its deploy. Checked at the start and again before the browser suite. | ~300–450 min/month, depending on how often merges land minutes apart |
| A4 | The data bot rebases onto the latest main and retries when a merge lands during its run, instead of failing at "Commit published data". | Fewer red runs; no minutes |
| A5 | Tests that wrote two view changes in the same millisecond, and failed on the writer's duplicate-id guard, use a clock that always moves forward. | Fewer red runs and re-runs |
| A6 | The Playwright browser is cached on its version; the Vercel CLI is cached on its pinned version. | ~100 min/month |
| A7 | The weekly briefing issue gains an "Automation minutes" section. | Costs ~3 min a week |

### Why main is not simply cancelled

`concurrency: cancel-in-progress` on main would be the obvious tool, and it is unsafe here. GitHub
orders a concurrency group by arrival, not by commit. A run created late for an older commit would
cancel the newer commit's tests, and then the release script would refuse the older candidate as
superseded, so nothing would publish. The same shape is why the deploy lock is `queue: max` and never
cancels.

`scripts/ci/superseded.mjs` asks the question the release script asks, earlier: is this candidate
still the head of main? Main only moves forward, because force-pushing is forbidden, so a commit that
has been passed can never be published, and skipping its tests changes no outcome. The newer commit's
own run tests and publishes both. The check covers the `workflow_call` path too: when the data
workflow calls CI, `github.ref` and `github.event_name` are the caller's (`refs/heads/main`,
`schedule`), and the candidate is `inputs.ref`. A data commit can only be passed by a human merge,
because the `live-data` concurrency group runs one data run at a time, and a human merge has a run of
its own. Pull requests and branch runs are never skipped. If GitHub cannot be read, nothing is
skipped.

### Why the full-check label is its own workflow

A `labeled` trigger on `ci.yml` would start a run for every label. Filtering in the job leaves a
skipped "Tests and governance gates" check on the commit, which can sit over a red one and make the
pull request look green. `full-check.yml` owns the label instead: other labels start a run whose only
job is skipped, at no cost, under a check name that is not CI's. It reads no secret and cannot
publish.

### The failures investigated

| Run | Cause | Status |
|---|---|---|
| 41983792650 | GB section parity test read the live briefing design answer, which moved with an ECB rate | Fixed on 5 Nov, before this change: the design answer is pinned (`tests/helpers/pin-design.mjs`) |
| 41756859163, 41244741463 | Two view changes to one path in the same millisecond tripped the changelog's duplicate-id guard | Fixed here: `tests/helpers/steady-clock.mjs`, plus a test that the guard still refuses a real repeat |
| 41399142010 | The bot's push was rejected because main moved during the run | Fixed here: `scripts/ci/push-main.sh` |
| 41802717494, 41355538861, 41270054432 | The live release stamp was read once, before the alias switched | Fixed on 4 Nov, before this change: `waitForLiveStamp` polls |

`tests/print-snapshot.test.js` and `tests/transmission-snapshots.test.js` were checked and already
assert structure against fixtures and manifests, not live values. They needed no change.

### What it does not change

The deploy allowlist, the release lock, the scan of the uploaded bytes, the release script, the
REQUIRE_MARKERS pairing and the rule that nothing auto-merges. `tests/ci-workflow.test.js` pins the
new lines that keep them that way: every event the deploy job accepts runs the full browser suite;
only a pull request's own run is ever cancelled; every gate after the head-of-main check is skipped
together or not at all; the bot pushes only through `push-main.sh`, which never force-pushes.
