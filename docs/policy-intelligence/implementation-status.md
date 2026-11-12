# Policy Intelligence implementation status

The 7 November 2026 analyst source decision admits one fixed 23-document/47-binding historical facts-only release under proposal `a8c6d20fba8630e2e4c48b4bc4a134e550ee4c8a81fc821858c7d59bf937067f`. Separate independent content/date/projection review is complete. The approved static regression receipt covers 16 cases, 85 factual units and 170 bilingual expressions; model accuracy remains unmeasured. Exact release readiness is tracked in [release-readiness.md](release-readiness.md).

This historical release leaves all 27 investment cases pending and changes no approved investment conclusion. Current-law completeness remains unestablished. Model calls, paid evaluation and automatic policy publication remain OFF. The dated checkpoints below enable narrowly scoped factual metadata discovery; a source decision is not a rights waiver or permission to resume WA.gov.au acquisition. Older entries describe their dated preparation checkpoints and are retained as history.

## Source recovery and Chinese reader completion, 12 November 2026

The analyst explicitly requested completion of DE/NEM/WA source checks, permitted
public official alternatives, and requested Chinese titles and subtitles. The
local follow-up completed these source checks, with acquisition methods kept
distinct from policy-claim verification:

| Market | Result and scope | Access evidence |
| --- | --- | --- |
| DE | The original [AgNes register](https://www.bundesnetzagentur.de/1059162) is collected again. Three document-link observations were added. | 11:57 UTC; page SHA-256 `973b3fa3a7690208b8b6801a8ae195039f660670cba7cf9c183d2cf19909548a`. |
| GB | The successful 11:21 UTC check is retained without another GET; the existing 17 links are unchanged. | Same-day success is retained, not counted as a second collection. |
| NEM | [AEMO's independent technical documentation](https://tech-specs.docs.public.aemo.com.au/Content/TSP_EMMS_June2024/Integrating_Energy_Storage.htm) is directly accessible. The [IESS project timeline](https://www.aemo.com.au/initiatives/major-programs/nem-reform-program/nem-reform-program-initiatives/integrating-energy-storage-systems-project) was also checked through the web reader. | Technical page at 12:06 UTC: `edb80755f66630d0e16fb0df8aaa1d2ce71894679b37fb82a9273794f4b45bd7`. The main-site GET returned 403 and remains stopped. |
| WA | [ERA's capacity benchmark procedure directory](https://www.erawa.com.au/markets/wholesale-electricity-market/information-rule-participants/wem-procedures/wem-procedure-brcp) is directly accessible. The [AEMO WIC implementation consultation](https://www.aemo.com.au/consultations/current-and-closed-consultations/aepc_2025_21) was checked through the web reader. | ERA page at 12:06 UTC: `968a9c02ba6529eaacb44a3a0049308ecabe45578b7e680304288ec1396491b3`. AEMO's GET returned 403 and remains stopped. |

Germany's robots response is 36 bytes of valid plain rules, mislabeled
`text/html;charset=utf-8`; its SHA-256 is
`2eab7f8938d825df41c134d433916e7c8745143ce28c00396e406d7067e99fee`.
The parser now accepts that MIME mismatch only for a complete recognizable
plain rules document. HTML/challenge bodies and prose error responses still
fail closed. The new source-review version allows one same-day retry; the
previous denial is retained in `accessHistory`, including its time and scope.

Inventory v4 retains the original four source identities and adds separately
identified alternatives. The exact v2/v3 migrations validate the full former
report and journal before adding sources; partial history cannot seed a reset.
The two successful new official directories contributed 31 link observations.
The journal now contains 51 links: 17 retained, plus 34 first observed on this
date. The accepted alternative-source observations were merged without a
second network GET, preserving prior successful checks and all access stops.
There are successful checks for four markets, **not eight successful sources**:
two original sources remain pending, and the two main-site AEMO attempts remain
403. The operational report continues to say partial source coverage.

The [AEMO copyright notice](https://www.aemo.com.au/privacy-and-legal-notices/copyright-permissions)
was readable through the web reader; its direct GET was 403, not a raw-byte
receipt. Its general permission covers AEMO-owned public material with accurate
attribution and excludes confidential and other-owner material. The [ERA
terms](https://www.erawa.com.au/disclaimer) were reviewed for this metadata-only
directory check. ERA is a different publisher and capacity-price procedure
scope; it is not a replacement legal authority for every WIC rule. Both new
collectors are restricted to exact page URLs and topic link paths, with no
attachment downloads, body retention or public policy-claim publication.
Original AEMC/WA.gov.au restrictions are unchanged. No alternate-host request
was made to bypass the protected AEMO main-site pages.

The user-triggered web check corroborates the existing distinction between
the AgNes draft and adoption, and between NEM implementation milestones. The
WA implementation page identifies a final procedure report, with a proposed
commencement entry; ERA has its own procedure and dates. These are review leads,
not new independently validated legal claims. The historical snapshot and all
investment/model values are unchanged. The reader's source disclosure displays
the date, exact official links and direct-collection versus web-reading methods.

All 43 current news titles and 42 non-empty summaries now have Chinese editorial
translations, matched separately against their exact original strings and URL.
Changed source text cannot inherit a stale translation. Chinese text is searchable;
English text, source links, geographic tagging and original ETL checksums are
preserved. The same accessor covers the radar, preview, news cards, opportunity
watch and briefing links. All 23 distinct official policy-document titles have
Chinese display labels; canonical instrument/event/story titles and subtitles
already have bilingual content. Evidence snapshot bytes and hashes are unchanged.
Future unmatched feed text falls back to its original rather than inventing a
translation; this completion receipt covers the current snapshot only.

Local validation: `npm test` passed 1,911 checks with no skips; the policy suite
passed 226, the model baseline passed 84, and ETL snapshot verification passed.
The final built output passed 44 budget/confidentiality checks with no skips.
The final Chinese/shared-reader browser pass covered 14 desktop/mobile cases;
the six historical-policy browser cases also passed in the preceding combined
run. The last localization/source-recovery unit pass covered 12 cases. Current
translation coverage is explicitly 43/43 titles and 42/42 non-empty summaries.
The built preview remains local at port 4183; no commit, push or deployment was
performed for this follow-up.

## Unified intelligence reader and manual refresh, 12 November 2026

The local reader now combines policy evidence and industry news at `/policy`.
The former `/news` address opens its news filter. Both streams share market,
jurisdiction and text filters, map coverage and previews; policy-only filters
never relabel publisher headlines as verified policy. National news can have a
country pin without acquiring an investment-market tag. NEM and WA remain
separate, and Japan-wide headlines count once on the map. The existing
opportunity watch, risks and calendar remain available in the same reader.
Each stream loads independently so a missing policy snapshot does not suppress
news, and a failed news request does not hide policy evidence. Historical
policy verification dates remain unchanged.

The initial local manual cycle ran on 12 November: all four configured RSS
sources succeeded at 11:22 UTC; 43 items were retained, with 15 new items and
15 older items leaving the bounded feed. The policy collector restored the
latest trusted discovery artifact before running. GB checked successfully
with no document change; its 17-link rolling journal added no observations.
DE retained its `invalid_robots_document` stop from the previous cycle; NEM
retained its prior access-denial stop; WA acquisition remains prohibited by
the recorded source terms. Thus this is a completed attempt across the
registered sources, with one of four policy pages checked, not a claim of
complete current-policy coverage. No model call, policy snapshot publication,
investment judgement or model figure was changed.

The refreshed source headlines increased the shared briefing payload to
43.27 KiB gzip. Its individual allowance is 43.5 KiB (previously 43); the
entry, total-home and market-isolation limits remain unchanged. This keeps
the complete source-derived briefing rather than discarding longer articles
to fit a byte count. All work remains a local built preview pending the
analyst's separate commit/release instruction.

## Factual discovery and ETL checkpoint, 10 November 2026

The daily 06:17 UTC workflow already runs deterministic policy discovery alongside market ETL, independently of the disabled policy AI path. The analyst's latest instruction preserves factual collection and reserves analysis, publication decisions and strategy changes for an analyst-initiated review. No extra schedule, policy model call or investment write path is added.

The discovery JSON now includes actual coverage counts, and its job summary explicitly distinguishes successful page checks from pending source review, disabled checks, duplicates, same-day retained attempts and failures. DE and GB have narrowly reviewed `metadata_discovery_only` scopes. The ordinary broader source and rights flags remain false. AEMC remains stopped after denied access, and WA remains stopped under its automated-acquisition terms. No fallback host or access bypass is allowed.

The 10 November source review found both DE and GB robots and source pages accessible, with no applicable robots exclusion for these page paths. The inventory records the terms links and exact permitted GET paths: DE's original short URL and reviewed canonical AgNes page, and GB's original decision page. Other redirects are blocked. Link metadata is restricted to reviewed same-host topic paths (GB attachments must end in `.pdf`); attachment download hosts are an empty set. Only original anchor titles, URLs and the source page hash leave memory. The scope grants no original-body retention, translation, model transmission or policy-snapshot publication. These gates are independent of the AI switch; disabling AI does not disable otherwise approved deterministic discovery.

The collector compares registered page hashes and deterministically observes approved document links. It retains original link title/URL, source-page URL/hash and first/last observation times; publication and effective dates stay null. An observed link is not a verified new policy release. The rolling metadata index keeps at most 250 links, up to 100 per checked page, with explicit overflow counts; records not seen for 90 days expire. Existing records survive source failures within that retention window. Re-observation keeps the original first-observed time, which may be older than 90 days for links still visible. A restored same-day attempt is not fetched again, including a denied attempt. HTTP 401/403/429, robots denial and unapproved redirects are not retried; their reason and exact source-review version are persisted and block later days until a new relevant review version is explicitly configured. Only network failures and 5xx responses use the existing bounded retries.

The job restores metadata only from this repository's completed main-branch `etl.yml` scheduled/manual runs and fixed `policy-discovery` artifact, requiring the latest attempted policy-discovery job itself to have succeeded. Other market jobs may have failed. Genuinely skipped policy jobs can be passed over; a failed/cancelled policy attempt, missing/expired artifact or unavailable restoration stops collection rather than falling back to older state that could omit a denial. It has `actions: read` solely for this restore, with bounded downloads and fixed-member JSON reads rather than ZIP extraction. Artifacts retain 90 days and may be public: no page body, private notes or strategy enters them. Only a verified legacy report with all four sources pending and no success/denial can seed the initial empty journal. Missing history is never an automatic initialization; malformed restored metadata fails closed. Overflow, unavailable history and rolling expiry mean `historyComplete` is always false. This is a rolling link index, not a permanent version archive or a complete legal database. Daily cadence can lag by approximately 24 hours plus source latency, scheduler drift and failures; it is not real-time monitoring. Runtime collection and artifact recovery still require operational verification after deployment.

The final collector review caches the first valid robots response and tests its rules before every page GET, including each explicitly approved redirect target. Robots error HTML returned with HTTP 200 is rejected; there is no second unchecked robots fetch. Recovery requires the complete, unique source-report set even when a journal exists: a partial/missing report cannot erase a source's recorded denial. The only permitted first journal baseline is labelled `initial_seed`, not unavailable history. Existing first-observation evidence is not rewritten by this implementation change.

## Offline next-phase preparation, 7 November 2026

An isolated feature branch prepares the supported provider-schema projection and strict local model-output regression coverage. Mocked SDK requests and synthetic responses are the only model-transport inputs. No provider request, token-count call or credential access occurred. Provider grammar acceptance, injected token overhead and paid-model quality remain unmeasured.

The serialized request with current public prior metadata and empty evidence is 14,648 bytes including the local margin; the former raw schema also exceeded the old 12,000 gate. The input ceiling was explicitly increased to 16,000 (+4,000 / 33.3%) in both dormant configurations, preserving output, time, cost, source and activation constraints. Synthetic regressions check admission under the new ceiling and rejection of an insufficient reservation or daily budget. This is an offline sizing change, not paid-model approval or measured provider overhead.

The inactive source proposal now distinguishes four dynamic registrations from the exact historical validators, and records acquisition, factual use, protected reproduction, transmission, currentness and adapter gaps. The existing statutory/OGL/CIS/NSW grants must be applied within their scope; missing NEM rule and FCAS incorporation evidence and the WA acquisition stop remain explicit. No allowlist, profile approval, recurring collection or switch changes.

Ignored private preparation contains 27 clause-specific evidence packets (DE 5, GB 8, NEM 7, WA 7), exact EN/ZH clauses and public-record hashes, freshly rechecked historical original proofs and provisional keep/revise/needs-evidence recommendations. Twelve older specific proposals were reconciled; fifteen generic shells were filled. No proposal is accepted, all approval dates remain null, and published reviews/links and investment values remain unchanged. The private packet index and validation evidence are delivered locally, not committed or uploaded.

## Earlier implementation checkpoints (historical)

Integration branch: `feat/policy-intelligence-v4`, based on `494ce7b`. Draft PR #159 is an **incomplete v4 deliverable**. A passing software check does not accept missing source governance, content reviews or empirical model evaluation. Do not merge it as the full D0-D8 release.

| Phase | Implemented | Outstanding acceptance |
|---|---|---|
| Gate 0 / D0 | 30-day job audit; authority, architecture, dependency and permission design | Account billing/reset inaccessible; production policy runtime unmeasured |
| D1 | Policy-only contracts/writer; immutable history; original-locale calendar dates; separately scoped provision lifecycles; document-level quotation limits; read-only resolver | Real content and independent evidence/translation/rights/narrative acceptance |
| D2 | Deterministic discovery and proposed single daily ETL+policy workflow | All four source/rights inventory entries remain unapproved and inactive |
| D3 | Bounded tool-free shadow transport; fixed endpoint and independent credentials; hash-pinned manual corpus command; durable reservations/results; PDF raw/text receipts; quarantine and review packets | No paid model configured; zero actual calls or accepted historical gold cases; trusted PDF adapters and host/corpus approval absent |
| D4-D5 | Lazy Radar/map/feed/filters/preview; Dossier/history/provision branches; bilingual brief/guided/explorer; dedicated declarative timeline/graph/waterfall/matrix templates and evidence tables | Real published content and independent editorial/visual/release acceptance |
| D6 x 4 | Separate software fixtures and official-source review queue | Four source-backed deep pilots and independent analyst content reviews incomplete |
| D7 | Shared lazy market route, strict-basis comparison, read-only pending-review sidecar | Real comparative claims and four accepted pilots |
| D8 | Disabled live configuration; isolated read-only model; independent publisher and combined commit/CI; separate exact-hash manual static approval; strict public-store/index/history/rights gates | Source/content acceptance, offline validators, historical evaluation, operational release/rollback and production measurements; separate model/cost approval for model use |

No Policy snapshot exists in public/. Synthetic browser fixtures stay in tests and are intercepted at request time. Empty coverage is displayed honestly. Software tests are not empirical historical evaluation or model precision/recall. Both live model and policy publication remain OFF.

The workflow proposal replaces `17 */6 * * *` with `17 6 * * *`, preserves unrelated monthly/weekly schedules, and retains the original exact-SHA scanned-prebuilt release chain. It is not active on main. Existing deterministic rules retain their original authority. Policy AI cannot write investment views, model assumptions, methodology or signed-off Market Stories. No paid request, billing change, repository visibility change or production deployment occurred.

Original GB parity failed on the initial untouched main. During delivery, main advanced to `13dacf0` with a general design-projection pin at the same original `d85f172` public-data vintage. The branch adopts that upstream implementation and removes its redundant single-GB normalization fixture. Original pre-split content fingerprints remain unchanged; upstream pin/shape tests and existing live Brief/current-engine linkage remain asserted. No baseline generator was run. Main's unrelated Japan documentation is preserved.

See release-readiness.md, source-review-proposal.md and validation-record.md for actual evidence and blockers.

## Resumed research checkpoint, 6 November 2026

The previously existing four private pilots were reviewed before edits. An independent AI second pass examined 24 original EN/ZH chapter pairs; three pairs were revised to reflect complete GB bytes, the distinct NEM operator account and WA's known predecessor date/order. This is not independent human acceptance. Sixteen reference cases consolidate earlier proposals with complete original-byte provenance; all investment-review labels and evaluated outcomes remain null, with zero accepted gold cases.

The private scope supplement adds DE capacity-law distinctions, the GB capacity-rule commencement chain, the current NEM FCAS guide/CIS scope, and WA capacity-payment/ESS mechanisms and consultation positions. Thirty of 39 identified research resources have complete verified entity bytes, including 16 PDFs; failed and browser-only evidence remains separately identified. No canonical public pilot was approved or written. See [source-review-checkpoint-2026-11-06.md](source-review-checkpoint-2026-11-06.md). D6-D8 acceptance remains incomplete, and all activation decisions remain OFF.

## Offline pilot preparation, 6 November 2026

Four canonical-shaped, unapproved pilot candidates and one combined initial snapshot are now generated from 27 pinned public-original documents. The catalogue contains 31 reference cases, including the examined prior 16, current formal GB amendments, NEM support/FCAS distinctions, WA price/accreditation and sourced multi-year histories. Each pilot has six EN/ZH chapters, sourced mechanism distinctions and an explicitly not-quantifiable monetary exhibit. The author prepared 23 exact-template profile drafts; their reviewed/rights flags remain false and active quote caps zero. They are not in the trusted registry.

The concrete extractor now pins pypdf 6.21.4 and isolated AES dependencies, re-reads actual bounded PDF bytes and validates exact pages/ranges and unchanged full-page context. Copy-restricted/password-required documents fail closed. Ordinal legal dates and narrow formal wording normalize without inventing an instant or replacing semantic review. The final offline replay has no literal/structural failures; independent publication validation correctly refuses the unapproved candidates. Twenty-four PDF cases fit the existing request bound, which is admission rather than acceptance.

The master plan permits deterministic source regression for initial static acceptance. A recorded evaluation method now prevents that result from authorizing model operation: the automatic gate requires an independently approved `model_shadow` result for the configured model. No accepted evaluation, model identity, key, source/profile approval or public snapshot is added. Earlier references to mandatory human review of every routine fact or mandatory paid evaluation were too broad: a separate competent reviewer can perform independent routine source/bilingual review; the analyst owns gold-set, source/configuration, dependency and material-investment acceptance.

See [the exact decision packet](offline-review-decision-2026-11-06.md) for private hashes, the twelve-case shortlist, rights/current-source gaps and the zero-cost review route. Currentness, independent semantics/bilingual acceptance, actual reviewed historical results, read-only dependency baselines and exact publication authorization remain open. WA automated acquisition is stopped by its terms, and incomplete/denied resources are not evidence. This is concrete review preparation, not full v4 acceptance.

The final candidate answers include one proposed Thin evidence marker per language and their existing what-would-change conditions. Source citations now expose the canonical record’s safe use-terms URL in both languages; that link is evidence access, not a grant or approval. The exact final packet and still-blank independent form bind the successful isolated replay after a retained parser-timeout attempt. Current software verification and tree-specific browser counts are recorded in `validation-record.md` and on the PR.
