# Local validation — 2026-11-05

Environment: connected Windows computer, Node 26.2.0, locked dependencies installed with `npm ci`; isolated feature worktree based on `494ce7b`. Original ignored marker and fingerprint-key files restored locally without printing their contents. Their fingerprint matches the committed expected value; original hooks installed. No Cloud partial diff was imported.

| Check | Actual result |
|---|---|
| Final complete `npm test` | 1,437 passed, 0 failed, 0 skipped; 213.6 s |
| `npm run test:policy` | 60 passed, covering contracts, source/translation attestation, immutable history, discovery and workflow isolation |
| Affected governance/scout/briefing checks | 184 passed before the final two additional policy rights cases; final full suite includes them |
| `npm run test:current` | 84 passed; approved fixtures untouched |
| `npm run build` | Passed; no Policy code imported by any browser route |
| `npm run test:budget` | 30 passed; no budget raised |
| `npm run etl:verify` | All existing snapshots verified; no dataset modified |
| Original bundle confidentiality check | 7 passed with `REQUIRE_MARKERS=1`, `REQUIRE_OUTPUT=1`, `SCAN_DIR=dist` |
| Original staged guard | Passed on every checkpoint; no scanner/fingerprint exemptions or weakening |
| YAML parse | Parsed 9 jobs successfully |
| Full `npm run test:e2e` | **243 passed, 1 failed** in 15.2 min; original desktop map test hit `ECONNRESET` while requesting the local Italy manifest |
| Exact failed E2E case, isolated rerun | 1 passed in 16.8 s, no test or application change; this does not turn the full command's failed result into a pass |
| Shadow discovery operational invocation | 0 changed documents, 4 sources pending review, 0 policy claims published |
| Local built preview | Opened and visibly verified at `http://127.0.0.1:4176/`; existing platform, not a completed Policy UI |

The GB extraction fingerprint failed on untouched main and now passes against the **unchanged** original hashes after normalizing only its exact live Brief sentence to the original public-data vintage. Runtime sentence presence and existing current-engine linkage remain asserted. No baseline generation command was run.

GitHub checks must run freshly on the pushed PR head; local results are not GitHub statuses. This record is not production verification. No merge, production deployment, model invocation or cron activation has occurred. No historical gold-case/model-accuracy claim is made for synthetic fixtures. Full D0–D8 release gates remain unsatisfied as listed in `implementation-status.md`.
