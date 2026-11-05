# Scoped policy permission proposal — inactive

Owner approved one daily market ETL + policy discovery cycle. Exact default cron: `17 6 * * *` UTC, replacing `17 */6 * * *`. Monthly agent/scout/digest and weekly briefing retain their existing expressions. This cadence change does not authorize live model calls.

Proposed amendment: “Policy Intelligence is a separately scoped daily model stage of the single daily data cycle. It receives approved public source records and emits only untrusted policy candidates. It has read-only repository permission, checkout credentials are not persisted, and it receives no publisher token. It cannot write investment views, assumptions, signed stories, source governance or rules. The existing monthly model jobs retain their cadence and authority. Independent validation and a separate single publisher own all public writes.”

Activation remains OFF. No model provider/model/cost is silently selected or billed. Proposed operational ceilings for later review: one logical pass/day, changed documents only, 120-second wall time, bounded input/output tokens and an explicit USD ceiling enforced before each call using a reviewed versioned price table. Actual model version, prices, budget and source terms need evidence and owner acceptance; zero paid calls have measured zero tokens, not proven live extraction accuracy. Missing configuration fails closed. Kill switch must override activation and retry; no-change skips; timeouts quarantine the policy stream and preserve market publication.

Read paths: approved public source artifacts and policy snapshots only. Future write target: validated `public/data/public/policy/**` through its own boundary; private reports in ignored operational artifacts. No `local-data`, `view`, `src`, `.github`, governance lists or writer code accessible through candidate fields. Source allowlist is versioned analyst-reviewed configuration, never model-controlled.

Rollback: disable policy model flag immediately, stop discretionary cycles if budget threatened, retain last-known-good index, publish a reviewed rollback/correction through the same exact-SHA CI chain. Preserve historical versions and audit records. Do not rewrite git history or deploy directly around the publisher.

Decision sheet: keep policy LLM OFF (recommended until source review, named model/cost and measured gold evaluation are accepted). Deterministic pipeline and static UI can be tested independently. User's conditional merge/deploy authorization does not waive the specification's factual, licensing, performance or release gates.
