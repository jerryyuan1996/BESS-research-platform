# Actions budget audit — 2026-11-05

Baseline: `494ce7b52e505b80b184ea9f7beb057dceea17c2`. REST inspection covered 2026-10-06 through execution on 2026-11-05: 531 workflow records, every run's jobs including reruns, paginated at 100. Durations below sum `ceil((completed_at-started_at)/60)` per acquired runner job; skipped jobs and records without a runner are excluded. Reusable CI jobs are charged to the caller's workload, not counted twice. Raw authenticated retrieval remains outside the repository.

| Workflow / event | Runs | Acquired jobs | Rounded minutes | Job P50 / P90 minutes |
|---|---:|---:|---:|---:|
| Live data / schedule | 104 | 270 | 718 | 1.22 / 3.72 |
| Live data / dispatch | 24 | 31 | 79 | 1.40 / 3.60 |
| CI / push | 139 | 278 | 1,344 | 3.13 / 10.15 |
| CI / pull_request | 262 | 264 | 1,533 | 5.03 / 11.62 |
| Invalid workflow / push | 2 | 0 | 0 | no runner |
| Total | 531 | 843 | 3,674 | not workflow wall time |

All observed labels are `ubuntu-latest`. These are workload minutes, **not verified billed minutes**: historical visibility, account-wide usage and credits are not derivable from job records. Account usage API returned 404 and the account API requires unavailable `user` scope; no scope or billing setting was changed. Billing cycle/reset date and remaining balance are unverified. Owner states Pro allowance 3,000 this month and long-term planning ceiling 2,000; preserve 400 for incidents and target at most 1,600 recurring minutes.

The repository is currently **public by owner choice**. Do not change visibility. Current [GitHub billing documentation](https://docs.github.com/en/billing/concepts/product-billing/github-actions) says standard hosted runners in public repositories are free; larger runners, storage and other private repositories are different. Pro included compute is currently expressed as $18 rather than a guaranteed fixed account-wide minute balance. This audit does not assert a paid budget, a free-storage guarantee or a verified account balance.

Pre-change: `17 */6 * * *` fetches all market catalogue datasets including news, applies independently approved deterministic rules, pushes data/view updates, then explicitly invokes reusable CI at that SHA. CI runs full tests, build, dist scan, budgets, browser suite and dataset verification; deploy rebuilds the prebuilt Vercel output, stamps it, scans those exact bytes and promotes only through the existing release script. A bot push alone cannot trigger Actions. PR updates and subsequent main merges both run CI; deployment is main-only. 262 PR runs and 139 main push runs explain substantial development churn; the two invalid workflows acquired no runner. Attempts are included rather than silently discarded.

Post-change planning: one 06:17 UTC daily market+policy cycle, at most one combined content commit and one reusable CI invocation when validated content changes. No-change days do neither. Cadence may lag a newly issued source by roughly 24 hours, plus upstream latency/failures and scheduler drift. Last collection, verification and publication remain distinct.

Measured job distributions above do not measure a new policy pipeline. Conservative cycle forecast (not a billing guarantee): P50 20 minutes, P90 30; 30 changed days gives 600/900. Deterministic discovery allowance 90; 4 development PR/main pairs at 30 each 120; unrelated jobs/maintenance 150; subtotal P90 1,260; 20% contingency 252 => **1,512**, leaving 488 under the 2,000 planning ceiling. Model cost and real first-run/steady-state durations remain unmeasured and are a release gate. Reforecast before any additional CI push. Local checks consume zero GitHub runner minutes. Stop discretionary CI if rolling measured demand exceeds 1,600; never omit mandatory release checks.

| Action | Decision |
|---|---|
| Local design, implementation and offline tests | Proceed |
| Standard ubuntu CI on this currently public repository | Proceed within workload forecast; no paid-runner change |
| Single daily cadence, existing data sources and rule semantics | Owner approved; reviewable implementation |
| Policy model calls or automatic publication | OFF pending concrete authorization/evaluation |
| New paid model/billing budget, source governance changes | Blocked pending specific owner decision |
| Merge/deploy | Only after every technical/content release gate; user authorized final release conditionally |

First production cycle and steady-state forecast cannot be measured before deployment. Record them without representing synthetic tests as production evidence. Keep the original confidentiality guard and full release gates even on a public repository.
