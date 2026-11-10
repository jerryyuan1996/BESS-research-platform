# Policy source review checkpoint: 6 November 2026

**Keep PR #159 draft.** The resumed source review resolves several evidence gaps and prepares 16 historical reference cases, four per market. It does not accept the four D6 pilots, approve a source profile, establish empirical model accuracy or authorize publication.

**维持 PR #159 草稿状态。** 本轮复核补齐了部分来源证据，并整理每市场四例、合计十六例历史参考材料；尚不构成四个 D6 试点验收、来源配置批准、模型准确率证明或发布授权。

The existing branch was clean at `f45891d14a654736924b1fe5c6b224541c2e1851`. Its [exact-head CI](https://github.com/jerryyuan1996/BESS-research-platform/actions/runs/42075680345) passed; deployment was skipped for the draft. This checkpoint changes research documentation and ignored review packets only. It does not change a model input, approved investment view, signed Market Story, dataset, workflow or activation switch.

## Evidence and corrections

| Market | Source-backed result | Boundary remaining |
|---|---|---|
| DE | The [AgNes register](https://www.bundesnetzagentur.de/1059162), consultation and FID clarification sections, still describes a draft; its page status is 21 September 2026. The draft's Tenor 2 Nr.1 is on PDF p.3, with explanatory paragraphs 499-500 on pp.186-187. The regulator's [BKZ FAQ](https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/Speicher/_faq/faq_table4.html) distinguishes the reported judgment, connection conditions and project-specific calculation. | No final adoption or private-project entitlement inferred. Current capacity-market developments and document-specific reuse/translation approval remain incomplete. |
| GB | The [3 June letter](https://www.ofgem.gov.uk/sites/default/files/2026-06/OFGEM-E12.14-decision-letter-FINAL.pdf), p.3, separates NESO issuance deadlines from distribution completion expectations. The [2 October letter](https://www.ofgem.gov.uk/sites/default/files/2026-10/Ofgem-agreement-for-revision-to-G2TWQ-timetable.pdf), pp.1-3, moves only Phase 1 issuance to 31 October and asks for subsequent completion confirmation. Complete original bytes now match independent prior hashes. | No actual issuance, offer acceptance, energisation or revenue start inferred from an elapsed deadline. Later methodology amendments and exact operative Capacity Market instruments still need reconciliation. |
| NEM | The original government-hosted [2021 rule](https://oia.pmc.gov.au/sites/default/files/posts/2021/12/National%20Electricity%20Amendment%20Rule%202021%20No.%2013.pdf), p.2 clause 2, and [determination](https://oia.pmc.gov.au/sites/default/files/posts/2021/12/Final%20determination.pdf), pp.3 and 8, support historical design, staged dates and non-energy cost allocation. [AEMO's implementation timeline](https://www.aemo.com.au/initiatives/major-programs/nem-reform-program/nem-reform-program-initiatives/integrating-energy-storage-systems-project), Background/Timeline, is browser-readable and distinguishes settlement, BDU and transition milestones. | Direct AEMO retrieval remains HTTP 403; no original-byte receipt is claimed for its implementation page. No access denial was bypassed. Later legal amendments and complete FCAS/CIS/LTESA applicability remain open. |
| WA | The [2026 Gazette](https://www.wa.gov.au/system/files/2026-01/gg2026_006.pdf), PDF p.3/printed p.141, states schedule 5's April 2026 commencement. Schedule 6 follows immediately after Tranche 8 schedule 5, whose stated time is 8:00 AM WST on 1 October 2027. The [official register](https://www.wa.gov.au/government/document-collections/wholesale-electricity-market-amendment-rcm-reviews-sequencing-rules-2025), Event/Date table, corroborates the separate schedules. | The predecessor date is known; retain the relative ordering instead of substituting an invented simultaneous instant. Schedule 7 still needs its own notice. Capacity credit/price and ESS accreditation evidence are not a universal battery income entitlement. |

The government's [GB Capacity Market consultation record](https://www.gov.uk/government/consultations/capacity-market-proposed-changes-for-prequalification-2026), update of 16 February 2026, states that the Multiple Price Capacity Market proposals would not proceed. The subsequent May response must not be read as adopting every original proposal. The [July 2026 consolidation](https://www.gov.uk/government/publications/capacity-market-rules) is expressly informal; it is a research aid, not a substitute for the operative amending instruments.

英国两份延期信函的完整原件现已核验；德国仍须区分草案与正式决定；NEM 运营机构时间表与发布时法律文本分别保留；WA 附表 6 的前置日期已知，但必须保留紧接其后生效的顺序。英国容量市场原征询中的多价格方案后来决定不再推进，不能把征询清单当成最终全部实施。

### Newly completed original-byte verification

| Official PDF | Bytes | SHA-256 |
|---|---:|---|
| GB 3 June 2026 letter | 119,401 | `143a9a30c0f4d64ec118f91220d53fdf63b87702e959b64c0eb639373bcbcf3b` |
| GB 2 October 2026 letter | 94,911 | `79e98c8a21b6d2381d521cf6fcc6c1226956b9a05c7dd72fac3b83bb3ebddf0c` |

The private intake records complete entity bytes for 30 of 39 identified research resources, including 16 PDFs. Hashes were checked against saved original bytes; selected legal pages were rendered and inspected. PDF extraction uses pypdf 6.21.4, with page-text hashes recorded separately. These research receipts are not trusted manual-evaluator extraction adapters or process-local evaluation receipts. Some large PDFs produced parser warnings; no warning is treated as independent semantic acceptance.

The remaining nine raw retrievals are AEMO's IESS/ESS/price and permissions pages (HTTP 403), the CIS process page (timeout), and four incomplete PDFs: the final WA benchmark-price determination, GB Capacity Market amendments No.3 and No.4, and CIS Tender 10 guidelines. Failed PDF retries retain attempt metadata. Browser-readable evidence is identified separately; no incomplete PDF is admitted. Complete draft benchmark-price bytes cannot establish the final price. Full source bodies and rendered pages remain outside tracked and public paths.

### Additional pilot scope researched

The private scope supplement now includes the government-hosted [StromVKG text](https://www.gesetze-im-internet.de/stromvkg/), sections 2-6, 12-13 and 87. Different tender classes and technical conditions must be distinguished; the statute is not a categorical storage ban or proof of current income for the approved four-hour reference battery. Its ISO-8859-1 HTML also needs an appropriate source adapter rather than an invented identical UTF-8 text hash.

For GB, the formal [No.2 amending rules](https://assets.publishing.service.gov.uk/media/6a3bf038da47783d877239d9/The_Capacity_Market__Amendment___No._2__Rules_2026.pdf), PDF pp.3 and 6, were reconciled with [SI 2026/850](https://www.legislation.gov.uk/uksi/2026/850/pdfs/uksi_20260850_en.pdf), p.1. This establishes the source chain for the battery connection-capacity nomination provision; complete later-amendment reconciliation remains open.

The current [NEM BESS FCAS guide v5.0](https://www.aemo.com.au/-/media/files/stakeholder_consultation/consultations/nem-consultations/2026/fcas-registration-guides-consultation/bess-guide-for-contingency-fcas-registration-v50.pdf?rev=ae32400a98d44de6b204ba33e2837546&sc_lang=en), pp.1-4 and 13-14, records its September 2026 effective date, testing/post-fault simulation changes and earlier guidance versions. Guidance revision is not statutory repeal or a facility's accreditation. [CIS Tender 10](https://asl.org.au/tenders/cis-tender-10-nem-dispatchable), At a glance/Preparing your bid, separately identifies closed bidding and tender-specific criteria; its incomplete raw guidelines remain unadmitted.

For WA, the complete [current ESM Rules](https://www.wa.gov.au/system/files/2026-09/electricity_system_and_market_rules_-_1_october_2026.pdf), PDF p.556 clause 4.29.1F, support the flexible-payment mechanism rather than adding two full capacity prices. The source-backed [consultation response](https://www.wa.gov.au/system/files/2025-01/response_to_stakeholder_submissions_exposure_draft_of_wem_investment_certainty_and_rcm_review_amending_rules.pdf), PDF pp.19-20/printed pp.14-15, supplies actual competing positions on network-access priority and facility variants. [FCESS accreditation](https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/system-operations/essential-system-services/summary-of-frequency-co-optimised-essential-system-services/seeking-accreditation-for-fcess) remains facility-specific; its browser-readable page is not a raw-byte receipt.

新增范围材料已涉及德国容量机制、英国容量市场正式修订链、NEM 当前 FCAS 指南与 CIS 招标、西澳容量价格机制和 ESS 认证；均仍是私有待验收研究，不改变已批准投资观点或模型。

## Rights review findings, without activation

| Source family | Evidence | Required decision |
|---|---|---|
| DE | [Imprint](https://www.bundesnetzagentur.de/DE/Service/Impressum/start.html), legal notices and Copyright, includes restrictions and a default CC BY-ND notice. | Determine document-specific permission for adapted/translated excerpts and provider transmission; do not treat public access or a robots allowance as permission. |
| GB | [Ofgem copyright](https://www.ofgem.gov.uk/c-ofgem-2026) permits Crown material under OGL with exclusions. Gate 2 decision PDF p.2 requires Crown attribution and document title. | Approve the exact texts, attribution, quotation limits and third-party exclusions before a profile is enabled. |
| NEM | Final determination PDF p.2 describes selected reproduction for the named research/review purposes with acknowledgement. | Decide the proposed public excerpt/translation and any provider use separately; the notice is not a blanket licence to republish a document. |
| AEMO-owned public material | The specific [Copyright Permissions](https://www.aemo.com.au/privacy-and-legal-notices/copyright-permissions) notice grants general use with accurate, appropriate attribution and excludes confidential/other-owner commissioned material. The FCAS guide's own p.2 refers to that notice. | Check authorship, attribution and exclusions for each exact source. No additional copyright-owner permission is required where the stated grant applies; source-profile acceptance and provider-transmission approval remain separate. |
| WA | [Legislation licence](https://www.legislation.wa.gov.au/legislation/statutes.nsf/copyright.html), exclusions, excludes Gazettes; the Gazette's own p.2 carries a separate notice. [WA.gov.au terms](https://www.wa.gov.au/terms-of-use), Intellectual property rights, distinguish stated non-commercial uses and other rights. | Resolve the exact Gazette/rule/source use; do not transfer a licence between hosts, document types or third-party material. |

Robots files were retrieved and hashed for the four principal hosts. The sampled register/PDF paths were allowed for `PolicyEvidenceReview/1.0`; this is a path-specific finding, not a crawler-source approval. The committed source inventory and trusted-profile list remain inactive/empty.

上述使用权核查仅记录原条款及待决范围，不授予翻译、转载或模型传输权限；来源目录与可信校验配置仍未启用。

## Existing drafts and historical reference cases

All four existing private packets were examined before revisions. The independent AI second pass examined 24 existing English/Chinese chapter pairs. It found source/completeness work rather than a cross-language numerical disagreement. Three chapter pairs were revised: GB complete-byte/timetable wording, NEM current operator-account distinction, and WA's known predecessor date/order. GB Chinese terminology now distinguishes a connection offer as a 并网要约. Those new revisions still require acceptance; this AI pass is not human or analyst sign-off.

The ignored `historical-reference-review-2026-11-06.json` consolidates the earlier draft reference proposals into 16 source-backed reference cases with original byte hashes, locators, equivalent English/Chinese reference facts and explicitly rejected overreach:

| Market | Four reference cases |
|---|---|
| DE | BKZ judgment/contract scope; draft versus adoption; draft FID qualification; correction of the universal-threshold reading |
| GB | Methodology approval boundary; June phased deadlines; October limited postponement; abandoned multiple-price proposal |
| NEM | Historical IRP design decision; original schedule split; gross non-energy cost basis; territorial/ancillary-service scope |
| WA | Gazettal versus commencement; later schedule 5 notice; schedule 6 relative ordering; current/future/unknown schedules |

**Accepted gold cases: 0. Model responses: 0. Empirical precision/false-review measurements: unavailable.** Investment-review labels and actual outputs remain null. A reviewed repeal/supersession example and the remaining acceptance matrix are still needed. These are reference-evidence packets, not paid shadow results or automatically admitted gold fixtures.

**已验收金标准案例为零，模型实际输出为零，经验准确率及误报／漏报指标仍不可用。** 十六例材料均保留待人工标签、使用权与后续验收状态。

## Concrete remaining release decisions

1. Complete the missing market themes and map their exact claims, scope, historical changes and public investment dependencies. Prepare canonical snapshot candidates; none exists in public output today.
2. Obtain source-specific rights and offline-validator acceptance, then independent human bilingual/content review of the exact four pilot candidates and historical reference labels. Do not manufacture approval flags or broaden the automated source list.
3. Establish actual historical evaluation outcomes under the approved method. A paid model needs separate named model/cost/transmission/credential/audit authorization; static manual publication cannot inherit that authority and still needs its own exact snapshot/ancestry approval.
4. Preserve all existing release gates, exact-head CI, exact production-artifact scan, rollback rehearsal and production smoke. Japan's separate checkout is not part of this checkpoint.

The existing model, manual evaluation and manual/static publication switches remain OFF. No paid API call, persistent credential, live policy publication, merge or deployment occurred.

## Subsequent offline preparation

A later bounded intake reached 39 complete resources / 20 PDFs from 50 identified resources. Newly complete originals include the formal GB No.3/No.4 rules, CIS Tender 10 and NSW LTESA Tender 9 guidelines. Three further official NEM reports timed out and are not admitted. The WA website terms prohibit automated access; no new automated request follows that finding. Statutory DE text under UrhG §5(1), other official works under §5(2), source-specific permissions and Gazette-specific restrictions are distinguished.

The examined historical references now form 31 proposed cases and four concrete six-chapter bilingual, canonical-shaped drafts. There are zero accepted gold cases, zero model calls and zero public versions. The new [offline review decision packet](offline-review-decision-2026-11-06.md) records exact private manifest/snapshot hashes, rights scopes, proposed dependencies and a twelve-case zero-cost static review route. Independent factual/bilingual acceptance and analyst-owned configuration/gold-set/material decisions remain separate; paid model evaluation is not mandatory for static source review.


The three later NEM PDFs were subsequently readable through the official web PDF text service. A single bounded 55-second direct retry still timed out for each, so the 39 complete original-byte receipts / 20 PDFs count is unchanged and the pinned catalogue is unchanged. A separate ignored `nem-web-context-2026-11-06.json` records dated EN/ZH research: the [December 2025 final review](https://www.energy.gov.au/sites/default/files/2025-12/national-electricity-market-wholesale-market-settings-review-final-report.pdf) is a recommendation; the [March 2026 pathways](https://www.energy.gov.au/sites/default/files/2026-03/national-electricity-market-wholesale-market-settings-review-nem-review-recommendations-implementation.pdf) distinguish agreement from agreement in principle, qualify jurisdictional agreement as excluding Queensland, and leave ESEM detailed design/legislation and the aimed first tender as future work at that date; the [AER submission](https://www.aer.gov.au/system/files/2026-01/AER%20submission%20to%20DCCEEW%20%E2%80%93%20NEM%20wholesale%20market%20settings%20review%20draft%20report.pdf) is attributed consultation evidence. Neither an energy-only short-term design nor a proposed longer-term contract mechanism supplies an executed project entitlement. This closes a reading gap without claiming original-byte admission, current legislative completeness or independent acceptance.


## Metadata-only source activation review — 10 November 2026 / 仅元数据来源启用核对

The analyst requested objective policy collection with daily ETL, leaving impact analysis and strategy publication to an analyst-initiated Codex review. That request supports low-frequency acquisition of public factual metadata. It does not require a complete project/legal-chain review before reading a permitted public register, nor does it authorize translation, body republication, model transmission or a new policy snapshot.

用户要求客观政策采集跟随每日ETL，影响分析及策略发布仍由其主动发起Codex复核。该指示支持低频读取允许访问的公开事实元数据，不以先核完项目资格或全部法律修改链为条件；不授权译文、正文转载、模型外发或新政策快照。

### Two permitted acquisition scopes / 两项可用获取范围

- DE: `https://www.bundesnetzagentur.de/1059162`, plus the exact same-host canonical path `/DE/Beschlusskammern/GBK/Ebene1_Rahmen/AgNes/start.html`. On 10 November, ordinary HTTP returned 200 for the selected page (111,918 bytes) and robots. Robots excluded `/SiteGlobals`, not these paths. [Impressum](https://www.bundesnetzagentur.de/DE/Service/Impressum/start.html), item 5, limits disruptive reading; its copyright terms do not prohibit this bounded original-language metadata use. Preserve attribution and the distinction between the website/draft and statutory text.
- GB: `https://www.ofgem.gov.uk/decision/decision-connections-reform-package-tm04`. Ordinary HTTP returned 200 for the selected page (211,079 bytes) and robots. The robots exclusions did not cover this decision path. [Ofgem copyright](https://www.ofgem.gov.uk/c-ofgem-2026) provides OGL terms for Crown information and permits hyperlinks, subject to logo/third-party exclusions. No third-party attachment content is copied.

德国所选页与robots均200，不在禁止路径内；仅低频读取，不影响其他访客，保留署名并区分网页/草案与法条。英国所选决定页与robots亦200；OGL和超链接依据不外推至标志、第三方附件或正文转载。上述为本次访问结果，不声称新政策原始字节已获发布接纳。

No complete redirect chain was captured in that HTTP check. The implementation must therefore follow only separately enumerated exact page URLs, not every same-host path. Attachment-download hosts are an empty set: retain relevant source-bound link metadata without fetching the targets. A direct 200 response does not justify broadening redirects.

本次未取得完整重定向链；实现只能跟随精确列举的页面，不能开放同站任意跳转。附件下载白名单为空，只保留来源范围内链接元数据，不请求目标文件。

### Collection, accumulation and public-access boundary / 采集、累计与公开访问边界

The permitted record is the original link title, URL, source-page hash and first/last observation time. Publication and effective dates stay unknown unless separately verified; first observation must never become a purported publication date. Bodies are parsed only in memory. No confidential files, private project documents, policy analysis or investment strategy belong in the journal.

仅记录原文链接标题、URL、来源页哈希与首次/最近观察时间；首次观察不等于发布日期，未经单独核验的发布/生效日期仍未知。正文仅在内存解析，累计记录不含保密文件、私有项目资料、政策分析或投资策略。

A bounded 90-day Actions metadata artifact can carry the rolling journal, restored only from this repository's successful main-branch ETL run. The repository is currently public; this artifact may therefore be accessible to other GitHub users and must not be called private. It is not published to the platform website or committed as a policy snapshot. Missing/expired restoration or truncation must be visible as incomplete history; this is not a permanent or exhaustive archive.

累计记录采用有界90日Actions元数据附件，仅从本仓库main成功ETL恢复。本仓库当前公开，附件可能被其他GitHub用户取得，不能称为私有。它不进入网站或提交为政策快照。恢复缺失、过期或截断须明确显示历史不完整，不称永久或完整数据库。

### Sources still stopped / 仍停止的来源

- AEMC NEM registration: existing 403 observations remain unresolved. Do not automatically retry or use another route to bypass them. A later permitted source/route needs its own exact scope.
- WA.gov.au: automated-access prohibition remains binding. The analyst cannot waive it. Continue existing offline research only until a rights-holder-permitted official acquisition route is established.
- DE/GB metadata scope is separate from source profiles for translated/excerpted public policy content. Those broader permissions remain inactive. Daily cadence remains 06:17 UTC, not real-time.

AEMC既有403未解决，西澳自动访问禁止仍有效；不得绕过，也不因其他网站许可而继承权限。德国/英国仅元数据配置不启用翻译/选段政策来源配置。保持06:17 UTC日频，不承诺实时。

### Local operational receipt / 本地运行凭证

At 2026-11-10T14:19:06.134Z, the actual metadata collector successfully checked both permitted source pages. It observed 22 bounded links: 4 DE and 18 GB, with zero overflow. All publication/effective dates remained null. AEMC and WA returned pending records with their explicit access/terms stop reasons and were not requested. This is a local collector receipt, not evidence that the scheduled deployed workflow or artifact recovery has already run.

实际collector于上述UTC时间成功检查两项已审来源，记录德国4项、英国18项链接，无溢出，发布/生效日期保持未知。AEMC与西澳未请求，保留明确停止原因。这是本地采集凭证，不证明部署后的定时任务或附件恢复已运行。
The deployed legacy bootstrap was also checked: [main ETL run 42655983426](https://github.com/jerryyuan1996/BESS-research-platform/actions/runs/42655983426), successful Policy discovery job, artifact 13693190097. Its ZIP SHA-256 matches GitHub's digest (`cb0dcab6a4ceb5b5c51e9c3aed29deb90609789b5f637644b188fa182339d8fc`). The actual archived report passes both restore and metadata validators: four pending sources, no successful fetch or stop state, and no journal. This supports the narrow first-cycle legacy migration without resetting an attempted collector. No ETL was dispatched; the next scheduled runtime restore remains to be verified.

另已核实际远端旧版附件：上述main ETL的政策作业成功，附件哈希与GitHub一致；真实报告通过恢复与元数据校验，四源均待审、无成功/拒绝状态且无journal，可作首次安全迁移。未dispatch ETL；下一次定时任务的实际恢复仍须核验。
Final quality check excludes source-page navigation: the initial 22 raw observations included two self-links (DE content navigation and GB skip-to-content). The deterministic cleanup retained 20 document links, DE 3 and GB 17. A same-day CLI replay made zero network calls, pruned only those two navigation records and preserved every retained firstObservedAt at 2026-11-10T14:19:06.134Z. The initial receipt remains an audit of the earlier QA output, not a claim of 22 policy releases.

最终质量核对排除来源页导航：原始22条中有两个自链接，清理后有效文档线索为20条（德国3、英国17）。同日CLI重放0次联网，仅清理两项导航，保留其余首次观察时间；原凭证保留为QA历史，不是22项政策发布的证明。