# Release readiness: incomplete draft

PR: https://github.com/jerryyuan1996/BESS-research-platform/pull/159

Previously pushed head `18b55ffb79a9c27d13e401e55e0cf13fda5a4b8a` passed [CI run 42025983107](https://github.com/jerryyuan1996/BESS-research-platform/actions/runs/42025983107). Deployment was correctly skipped for a draft PR. Later changes require fresh exact-head CI. The built loopback preview at http://127.0.0.1:4176/ is local review, not production verification.

| Activation setting | Current value |
|---|---|
| Shared workflow | .github/workflows/etl.yml, proposed daily `17 6 * * *` |
| Existing market sources/rules | Catalogue retained; original deterministic view writer unchanged |
| Policy source inventory | Four proposed official registers; every reviewed/rights flag false |
| Provider/model | Anthropic structured-JSON transport supported; no named live model approved/configured |
| Cost/token/time limits | Daily USD cap/prices unset; token proposal 12,000 input / 3,000 output, 120-second request bound; no paid measurements |
| Model/publication | Both OFF; historical evaluation unapproved with zero accepted cases |
| Model credentials | Read-only repository/actions; checkout credential not persisted; model key only in call step; no publisher token |
| Publisher | Existing daily refresh job; independent guard, body/hash/semantics/translation/rights/full-record checks, policy-only atomic writer, ETL verification and staged scan |
| Public namespace | Only policy index and immutable hash snapshots; disabled public-store gate rejects drafts and orphan assets |
| Material investment changes | Read-only links, pending review and visible sidecar; approved call/story/model unchanged; analyst decision required to resolve |
| Kill switches | POLICY_DISCOVERY_DISABLED=1, POLICY_AI_DISABLED=1, committed activation/publication flags |
| Repeat protection | Workflow concurrency; ledger plus durable run/job audit; an uncertain prior model job consumes the day |

Normal collection changes from six-hour to daily. Scheduling drift, outages and upstream latency can make data older than approximately 24 hours. Checked, effective, created and published timestamps are distinct. No exact-clock guarantee is made.

## Release blockers

1. Four D6 pilots and independent content reviews are incomplete. Public policy pages have no verified content; D7 real comparisons and the complete product definition of done are unsatisfied.
2. Source authority/robots/redistribution/quotation limits and source-specific legal/translation parsers need approval. TRUSTED_POLICY_PROFILES is empty. Public stored assertions require trusted offline source validators as well as checksums; index booleans cannot approve themselves.
3. At least 12 actual source-reviewed historical cases across four markets remain unevaluated. Synthetic tests cannot establish factual precision, false-positive/negative rates, legal accuracy or model costs. Those empirical metrics remain unavailable.
4. A named model, current reviewed pricing, daily USD ceiling and concrete activation permissions require acceptance. No credential or billing setting was created or changed.
5. Final-head CI, complete performance measurements, production exact-artifact scan/deployment, rollback rehearsal and production smoke remain release gates. There is no production release URL for this change.
6. Account-wide Actions balance/reset cannot be verified with current billing access. The documented 1,512-minute P90-plus-contingency planning scenario is not measured steady-state usage or a spending guarantee. Preserve the long-term 400-minute reserve.
7. Dedicated timeline/lifecycle, before-after, sourced causal/stakeholder graph, additive scenario waterfall, compatible-value and market-scope matrix renderers are implemented with accessible evidence tables. Data and browser share the reference/basis/arithmetic safety contract. Comprehensive visual/a11y review, actual pilot storytelling and independent bilingual editorial acceptance remain incomplete; template safety is not content acceptance.

## Rollback procedure requiring rehearsal

Disable policy processing first. Prepare an analyst-reviewed feature-branch rollback/correction through the existing PR and full CI path, retaining immutable policy history. Never erase an old revision or rewrite an approved investment conclusion. Deploy only through the exact-artifact scan and Vercel --prebuilt workflow, then run production smoke. A failed policy stream retains last-known-good content while verified market data continues normally. This is a documented procedure, not a claim that production rollback was tested.
