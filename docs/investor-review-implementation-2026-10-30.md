# Investor review implementation — 30 October 2026

Current follow-up: [user-confirmed layout and cash-flow changes](修改建议.md) supersedes the earlier margin-axis and early-downside placement described below. The matrix now plots actual IRR; monthly cash charts and plan switching use the original hold cash flows; research details open in a native modal. The historical-frequency display is explicitly a single price-proxy observation, not a joint downside probability. The validation counts below describe PR #69; follow-up checks are recorded in its own PR.

Base: PR #68, main cfe29c5fe4bba956c8d6ccddfe5247bbc75143bc. The local reference snapshot was verified against tree 90035a9277b6819a3175cf5572df05d483a801fc.

The current investment narrative now uses the same 20-year after-tax RTB case as the headline and comparison table. The decision summary exposes downside, target headroom, peak construction equity, the project-rights price assumption and the pricing ceiling. Modelled income and project contract evidence are distinct.

The comparison matrix plots return minus the applicable investor/market target. Size has a fixed USD capex scale. Mobile comparisons use cards. Research, contract terms, timing and special-route NPV attribution remain expandable. Calendar month bounds are no longer shown as deadlines; same-market headlines are accurately labelled. Saudi Arabia remains unpriced, and Spain identifies its perfect-foresight and transferred-curve limitations.

Validation:

- 977 Node tests: 973 passed, 4 skipped because local confidential markers or fingerprint credentials were absent.
- 48 browser tests passed across desktop and mobile, including both new markets, route links, fixed-debt downside, contract tails, lazy investor data, bilingual calendar precision and acquisition workflows.
- All 72 investor/market combinations were compared against the exact PR #68 source snapshot: calls, ordering, stages, headline returns, leverage returns, target returns and construction capex are unchanged.
- Production build succeeded; targeted budget, design-token and investor review tests passed.
- Local confidentiality scanning cannot complete without repository credentials. The existing CI confidentiality and fingerprint gates must pass before merging; their enforcement is unchanged.

Performance:

- PR #68 baseline measured in the same environment: 254.88 KiB gzip for the homepage.
- Investor data is now split into four lazy chunks; only the active investor is awaited and cached.
- The budget test includes the largest awaited investor chunk, rather than excluding it as a dynamic import.
- Final first view is approximately 262.5 KiB; the explicit budget is 265 KiB. The experience chunk budget is 26 KiB and each investor-data chunk is capped at 17 KiB.

Research dependencies remain explicit: actual project contracts, Saudi fees and shareholder-specific tax/cash repatriation, Spanish execution capture and capacity/balancing eligibility, and officially verified catalyst records for newly registered markets. These inputs are not fabricated or silently inserted into approved economics.

The detailed Chinese review and PR #68 supplement are in [investor-review-2026-10-30.md](investor-review-2026-10-30.md). CI, merge and deployment status are recorded on the associated GitHub pull request and release workflow.
