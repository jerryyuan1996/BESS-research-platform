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

Evidence marker: **Strong** for the smoke replacement and the cache — both are mechanical, and the
smoke suite is measured locally. **Fair** for the CI time saved, because no Actions run has been
executed from the authoring environment; the before/after workflow totals in §2 are arithmetic on
P0-1's step timings and this session's local smoke run, not an observed CI run. What would change
it: the first push, whose job summary prints the real numbers.

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

The publish job's shape, before and after:

| Publish job step | P0-1 CI | Now |
|---|---:|---:|
| checkout, `npm ci`, Vercel CLI, env pull | 0.66 min | 0.66 min (the cache trims the `npm ci` part) |
| `vercel build` + scan + deploy | 0.64 min | 0.64 min |
| live check: install Chromium | 0.23–0.37 min | 0.23–0.37 min |
| live check: browser suite | **8.40 min** (168 tests) | **~1.0–1.5 min estimated** (10 tests) |
| **Publish job** | **9.7 min** | **~2.5–3.0 min estimated** |
| **Push to `main`, both jobs** | **20.3 min** | **~12.5–13.5 min estimated** |

The local measurement behind the estimate: the smoke suite ran 10 tests (5 × desktop and mobile)
in **1.8 min** against `vite preview` on this laptop, with three workers. CI runs the browser suite
2–3× faster than this host (P0-1 measured 6.25 min in CI against 19.4 min locally), so 1.0–1.5 min
is the honest range — and the live step is a production network away from the preview server.

**No CI run was executed from this environment.** The GitHub connector required authorisation, so
the workflow totals above are derived, not observed. Each job now prints its own measured table;
the first push replaces the estimate with a fact.

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
`production-release-<sha>`, `live-page-check-evidence-<sha>`.

## 7. What is left

| # | Bottleneck | Evidence | Next step |
|---|---|---|---|
| 1 | `npm test` — 1,307 tests, 3.3–4.4 min in CI | P0-1; no per-file breakdown exists | Capture TAP and rank files before changing anything |
| 2 | `story.spec.js` — 6.1 min on desktop alone | P0-1 | Parallelise within the file (`test.describe.configure`), not more workers |
| 3 | Chromium download — 0.23–0.37 min per job, twice per publish | P0-1 | Cache `~/.cache/ms-playwright` keyed on the Playwright version |
| 4 | Deploy job setup — 0.66 min for checkout, `npm ci`, global CLI install | P0-1 | Cache the Vercel CLI; `npm ci` is genuinely needed (`vercel build` runs Vite) |
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
