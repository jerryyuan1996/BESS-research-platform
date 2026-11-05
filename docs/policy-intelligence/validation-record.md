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

## Resumed local checkpoint, 5 November 2026

After the requested stop, remote head `5d9eca5` remained draft and its run 42051263151 was confirmed cancelled. No cancelled check is counted as green. Prior head `e9a7c45` separately passed run 42049872493.

The resumed consolidated source passed 1,490 complete local unit tests with zero failures/skips (231 seconds), plus 113 focused Policy tests as the manual-command and transport safeguards were added. Desktop/mobile Policy E2E passed 16/16 on the built site, including nine distinct scene templates, table fallbacks, sourced waterfall components and unchanged investment content. Financial baselines (84), bundle budgets (30), all ETL snapshots and the original required bundle guard (7) also passed. A sandbox browser-cache startup failure was not counted; the existing installed Chromium was used without downloading a browser. The final complete browser suite and new exact-head GitHub CI remain to be recorded on the PR after the consolidated push.

Local comparative diagnostic, Chromium 156.0.8078.4, 1440×1000, three cold samples each, only loopback built assets: Home task CPU median 262→257 ms; GB 401→412 ms; NEM 703→773 ms. CLS was identical before/after (Home 0.0417; GB/NEM 0.00391); SVG counts were unchanged (23/180/180); each route added one navigation element and loaded zero Policy page/map resources. The NEM timing difference was investigated rather than dismissed: seven further paired visits, with pre-navigation task time subtracted, gave 1,356→1,324 ms task CPU and 335→335 ms long tasks, with identical CLS and SVG counts. Host timing varied materially between runs; these are local diagnostic samples, not production guarantees or a new budget. Reports retain the samples outside tracked files. The diagnostic's first static-server version incorrectly served HTML for missing JS assets; that harness error was corrected and those parsing-error samples were excluded.

Private source review now records the later GB timetable letters, explicit WA Gazette licence exclusion and DE document/translation rights questions. Two new GB PDF downloads were incomplete and were not accepted as original-byte evidence. No source allowlist, rights approval or human content sign-off was granted.
