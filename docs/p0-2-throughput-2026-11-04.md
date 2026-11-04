# P0-2 — throughput, before and after

Two independent changes, measured against the P0-1 baseline
([`performance-baseline.md`](performance-baseline.md), commit `d02f26d`):

1. the ETL fetches datasets through a bounded, provider-aware pool instead of a sequential loop;
2. CI stops re-running the full browser suite against production after every publish, caches npm,
   and reports what each gate cost.

The reasoning for the CI decisions is in [`ci-performance.md`](ci-performance.md). This document is
the measurement record: what was run, what it produced, and what is left.

## Method

| | |
|---|---|
| Host | Windows, 8 × Intel i7-8650U @ 1.90 GHz, 15.9 GB RAM — the same laptop as P0-1 |
| Runtime | Node v22.22.2, Playwright 1.64.1, Chromium via `channel: chromium` |
| Date | 2026-11-04, 08:50–10:10 UTC |
| ETL command | `node etl/run.mjs --dry-run` (all 22 datasets, nothing written) |
| ETL comparison | **Paired**: base commit `c16a5f0` checked out in a separate worktree, run immediately before the branch, same network, same source state |
| CI comparison | The PR's test job was observed (run `41815632247`); the publish job is derived, because a pull request cannot reach it |

The ETL pairing matters. Three dry runs of the *unchanged* code on this host produced 158.4 s
(P0-1), 178.7 s and 175.0 s. The spread is the sources and the network, not the code, so an
unpaired before/after would have been noise dressed as a result. Dry runs still exercise fetch,
validation and drift, and write nothing.

## ETL

| | Base | Branch | Δ |
|---|---:|---:|---:|
| Full dry run, 22 datasets | **175.0 s** | **119.8 s** | **−55.2 s (−31.5%)** |
| Datasets in flight, observed | 1 | 3 | — |
| JEPX, three areas, wall time | 81.5 s | 78.6 s | −2.9 s |
| JEPX, three areas, summed task time | 81.5 s | 199.4 s | +118 s (overlapping) |
| `gb-eac-response` | 35.3 s | 35.9 s | unchanged |
| `wa-wem-prices` | 10.0 s | 15.0 s | +5.0 s (contention) |
| `pl-day-ahead` | 14.3 s | 7.9 s | −6.4 s |
| `industry-news` | 12.9 s | 9.6 s | −3.3 s |

The summed JEPX time going *up* while its wall time stays flat is the point: three tasks now overlap,
so each one's clock includes the others. What fell is the run — six datasets no longer queue behind
the three slowest.

Two effects are visible in the per-dataset numbers and worth naming rather than smoothing away:

- **Contention is real.** `wa-wem-prices` slowed from 10.0 s to 15.0 s and `industry-news`'s first
  concurrent run took 15.9 s against 5.6 s in P0-1. That is bandwidth shared with two other fetches.
  It is a fair trade for the total, and it is why the global limit is three and not eight.
- **The remaining critical path is the JEPX download**, not the scheduler. It runs concurrently and
  still accounts for ~66% of the branch's 119.8 s.

### The JEPX download, isolated

The three areas read the same two fiscal-year CSVs and differ only in which column they parse. Before
the connector coalesced those downloads, three concurrent areas made six requests for two files and
were slower than running them in sequence. Measured with `--only` on the three JEPX datasets:

| Configuration | Wall | Requests |
|---|---:|---:|
| One area alone | 40.9 s | 2 |
| Three areas, concurrency 3, no coalescing | 85.3 s | 6 |
| Three areas, concurrency 3, coalesced | **57.4 s** | 2 |

Indicative rather than paired — the first two were taken from full runs minutes apart, and the JEPX
host was slower during this session than during P0-1 (a single area took 22.5 s then). The request
count is the part that does not depend on the network.

Evidence marker: **Strong** for the direction and for the request count; **Fair** for the magnitude,
which moves with the source's response time.

## CI

The PR run ([#155](https://github.com/jerryyuan1996/BESS-research-platform/pull/155), run
`41815632247`) exercised the test job. A pull request cannot reach the publish job, so the post-deploy
half is still an estimate — the only step this change actually removes.

| | P0-1 (observed) | This PR run (observed) | After the change (publish side) |
|---|---:|---:|---:|
| Test job, whole | 10.3 min | **13.45 min** | unchanged gates |
| — `npm test` | 3.32 min | 4.5 min | — |
| — build | 0.22 min | 0.3 min | — |
| — scans and budgets | 0.07 min | 0.1 min | — |
| — install Chromium | 0.23 min | 0.2 min | — |
| — full E2E | 6.25 min | 8.1 min | unchanged |
| — `etl:verify`, evidence, summary | — | 0.1 min | — |
| Publish job | 9.7 min | not exercised | **~2.5–3.0 min (derived)** |
| — live browser step | **8.40 min** | not exercised | **1.0–1.5 min (derived)** |
| Push to `main`, total | **20.3 min** | — | **~15–16 min (derived)** |
| Smoke suite, 10 tests, local | — | — | **1.2–1.8 min** (two runs, `vite preview`) |
| `story.spec.js`, 2 workers | — | — | **456 s** (measured) |
| `story.spec.js`, 4 workers | — | — | **544 s** (measured) |

**The test job took 3 minutes longer than in P0-1, and none of it is this change.** The full E2E step
alone went from 6.25 to 8.1 min and `npm test` from 3.32 to 4.5, on gates that were not touched — the
runner was simply slower that hour. The comparison that matters is within this run: the pre-deploy
side is dominated by two steps, the unit suite and the browser suite, and both are unchanged.

**The publish side is still derived.** It replaces P0-1's measured 8.40-minute live step with the
locally measured smoke run (1.2–1.8 min) scaled by the 2–3× speed difference P0-1 observed between
this laptop and the runner. The first merge to `main` replaces the estimate with the job summary's own
number; the deploy job's `production smoke` line is the one to read.

The npm cache is not separately measurable: `npm ci` took 0.1 min with it. On the same run the cache
is keyed on the lockfile and either hits or misses; either way it cannot make an install slower.

## What did not help, and what was rejected

| Change | Outcome |
|---|---|
| Four Playwright workers | **19% slower** on `story.spec.js` (544 s against 456 s). The suite is render-bound; the default stays at two. |
| Raising ETL concurrency above 3 | Not attempted. Provider limits bind first (JEPX 3, everything else 1), and `wa`/`news` already showed contention at three. |
| Selective testing for data-only commits | Rejected on evidence — three of the four arguments are about correctness, not speed. See [`ci-performance.md`](ci-performance.md) §4. |
| Sharding the E2E suite across jobs | Rejected: doubles runner minutes and complicates the gate for a saving the smoke replacement already delivered. |

## Remaining bottlenecks

| # | Bottleneck | Measured | Next step |
|---|---|---|---|
| 1 | JEPX download | ~79 s of a 120 s ETL run | Conditional request (`If-Modified-Since`) or parse once into three columns; the archive changes daily at most |
| 2 | ETL post-processing (drift over 18 markets) | ~25–30 s of the run, single-threaded | Profile `detectDrift` before touching it; it is pure and could fan out |
| 3 | `gb-eac-response` | 35 s, unchanged by concurrency | The P0-1 suggestion stands: stop refetching an unchanged archive |
| 4 | Unit suite | 3.3–4.5 min in CI, 1,307 tests | Capture TAP and rank files; no per-file data exists |
| 5 | `story.spec.js` | 7.6 min local, 6.1 min desktop in CI | Parallelise within the file, not across workers |
| 6 | Chromium download | 0.23–0.37 min per job, twice per publish | Cache `~/.cache/ms-playwright` on the Playwright version |

## Risks and operational notes

- **The ETL pool changes timing, not semantics.** Validation, checksums, previous-snapshot retention,
  the write boundary and dry-run behaviour are the same code paths; the tests assert ordering and
  failure isolation. A published run has not been executed from this branch — only dry runs — so the
  first scheduled run is the first real publish through the pool. It writes to `public/data/` and
  nowhere else, and a failing dataset still leaves its previous snapshot in place.
- **Fingrid's rate limit is enforced twice**: by the pinned provider limit of one and by the
  connector's own request spacing. Raising the pin is not possible from the environment, which is
  deliberate.
- **Peak memory is higher, not measured.** Three datasets hold their responses at once instead of
  one, and the JEPX connector keeps both fiscal-year CSVs decoded for the life of the run because the
  three areas share them. That is two large strings rather than one, on a runner with 7 GB; it is
  noted rather than claimed safe, because nothing in this session measured it.
- **The smoke suite is the only live check now.** If production breaks in a way that is neither an
  uncaught exception nor a failed asset — a blank section, a wrong number — this suite will not see
  it. The trade is explicit: the full suite has already asserted those behaviours against the same
  artefact, and re-asserting them after promotion bought 8.4 minutes of nothing.
- **The first publish after this change is the proof.** The PR run proves the test job, the timing
  wrapper and the summary; the publish half stays derived until one merge to `main` exercises it.

## Next priorities

1. **JEPX conditional fetch.** It is now the single largest term in the ETL and needs no concurrency
   to fix. Check whether the server sends `Last-Modified` or `ETag` before designing anything.
2. **Per-file unit timings.** Rank before optimising; the suite is the largest pre-deploy cost and
   nothing is known about which files dominate.
3. **Parallelise `story.spec.js` internally**, then re-measure the whole suite at two workers.
4. **Cache the Chromium download and the Vercel CLI.** Together about 1.5 min per publish, both keyed
   on a version string.
5. **The test-ownership map**, if data-only commits are ever to skip anything. Until it exists, the
   full suite runs on every change, which is the correct default.
