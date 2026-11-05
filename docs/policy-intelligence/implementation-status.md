# Implementation checkpoint

Integration branch: `feat/policy-intelligence-v4`, based on `494ce7b`. This is an **incomplete draft**, not the complete D0–D8 release candidate. The existing platform remains available locally. No new Policy UI, pilot content, live model or policy auto-publication has been represented as complete.

| Phase | Status |
|---|---|
| Gate 0 / D0 | Actual 30-day job audit, design/authority/dependency/permission/acceptance documents prepared; account billing access limitation explicit |
| D1 | Policy-only contracts, semantic safety checks, external attestation boundary, immutable writer/replay, read-only resolver and synthetic adversarial tests implemented; full release acceptance pending integration gates |
| D2 | Offline-tested deterministic discovery and proposed single daily workflow; source inventory intentionally inactive pending source/rights approval; no claim publication |
| D3 | Not implemented; no paid model calls, tokens or measured model quality |
| D4–D5 | Not implemented; no Policy Radar/Dossier/Story routes shipped |
| D6 × 4 | Primary-source review queue prepared; no market pilot accepted |
| D7–D8 | Not implemented; no activation or production release |

Existing GB parity failure reproduced on untouched main: portfolio 6,155 bytes retained but hash changed when observed FX changed the live Brief sentence. The existing fingerprint and financial baselines are unchanged. A small historical projection fixture was reconstructed from the original fingerprint commit `d85f172`; only the exact current bilingual Brief sentence is normalized for static extraction comparison. The test also requires exactly one current Brief sentence per language; all remaining prose/numbers/functions remain under the original hash. Current runtime engine linkage remains covered by `tests/deep-layer.test.js`.

New policy tests are synthetic software safety cases. They are **not** 12 historically source-verified gold cases or empirical model precision/recall. Publication requires independent claim-digest-bound evidence/translation attestations in addition to source body hashes; candidate booleans cannot self-approve legal meaning.

Current release blockers: proposed source/rights list not approved; NEM source retrieval returned 403; downstream phases and four independent content reviews incomplete; no measured production policy cycle or model cost/configuration acceptance. The complete release cannot merge or deploy until these gates pass. Do not mark a draft as production-ready merely because code checks turn green.

No investment view, pricing input, discount rate, grade, signed market story, legacy baseline, existing source governance or repository visibility was changed. The only governance amendment implemented is the specifically authorized daily cadence and its documentation; the policy model exception remains a proposal.
