# Local validation: 2026-11-05

Connected Windows worktree `feat/policy-intelligence-v4`, base `494ce7b`. Locked dependencies installed with npm ci. Original ignored marker/key restored locally without printing values, expected fingerprint matched and original hooks enabled. No Cloud partial diff imported. No model key created or paid request made.

| Check | Actual evidence |
|---|---|
| Original checkpoint complete unit suite | 1,437 passed, zero failed/skipped on previously pushed D0-D2 source |
| Original checkpoint complete E2E rerun | 244/244 passed in 13.2 minutes; this superseded the earlier full command with a local ECONNRESET |
| Expanded Node 26 complete suite | CSS token violations fixed; two budget reads collided with a concurrent build, then serial checks used instead. Another serial run hit the Node 26 test-runner deserialization error; original affected ETL file passed 17/17 independently |
| Project-matching runtime | Portable Node 22.23.4 from official nodejs.org archive; official SHA-256 verified; system installation untouched |
| Expanded Node 22 complete unit suite | 1,464 passed, zero failed/skipped; 203.1 seconds before the final two preflight/history tests |
| Latest focused Policy suite | 89 passed, zero failed/skipped, including the final activation and retained-history safeguards |
| Final staged-source complete unit suite | 1,466/1,466 passed, zero failed/skipped; 215.3 seconds, serially after map checks |
| Financial baseline | 84/84 passed; original approved baselines not regenerated |
| Stable build | Passed; Policy page/map remain lazy |
| Existing bundle budgets | 30/30 passed; no cap increased |
| Existing ETL verification | All snapshots verified, no dataset changed |
| Required original bundle guard | 7/7 passed, REQUIRE_MARKERS=1, REQUIRE_OUTPUT=1, SCAN_DIR=dist |
| Original staged guard | 54-file checkpoint clean; final report/test changes rescanned by the unchanged original staged guard before commit |
| Syntax / YAML | 35 new/current policy modules syntax-checked; CI 2 jobs and ETL 10 jobs parsed |
| Targeted desktop/mobile Policy E2E | 14/14 passed in 24.9 seconds; fixtures intercepted only, never public content |
| Expanded complete E2E | 257 passed, 1 failed in 15.9 minutes: original mobile Italy network test inspected a stable-but-incomplete async band. Exact-manifest polling added without changing expected segments, budgets or application geometry; focused desktop/mobile map rerun 16/16 passed in 1.2 minutes. A new complete exact-head CI run is still required |
| Operational OFF-state run | Authorization false; research disabled without a model request; publisher disabled; policy store unpublished with zero versions |
| Visible built preview | Local http://127.0.0.1:4176/policy visibly shows honest empty Policy coverage |

Static graph measurements, baseline-dist versus current dist (gzip bytes): entry 172,040 -> 172,574; home experience closure 247,436 -> 247,964; GB market closure 352,561 -> 353,149; NEM closure 312,690 -> 313,275. Closures include already-shared entry dependencies, so they are not incremental transfer sizes. Current Policy page closure is 187,970 and map closure 221,080; neither is in the entry closure. These bundle measurements do not measure CPU, CLS, long tasks or production timing.

Previously pushed exact head `18b55ffb79a9c27d13e401e55e0cf13fda5a4b8a` passed CI run 42025983107: test job 12:18:17-12:27:14 UTC, 537 seconds / 9 rounded runner minutes; deployment skipped without a runner. This is workload, not verified account billing. A new push needs fresh exact-head CI.

Zero accepted historical gold cases, zero measured model precision/recall, zero paid usage and zero production policy runs. New local software checks and synthetic callback counts are not production deployment proof. No merge, production deployment or schedule activation occurred. See release-readiness.md for incomplete content, permissions, source, evaluation, visual and release gates.
