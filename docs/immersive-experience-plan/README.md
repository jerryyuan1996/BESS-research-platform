# Immersive Visual and 3D Experience Upgrade Plan

Pack ID: BESS-IX-2026-10-30  
Version: 1.0, planning draft for implementation review  
Prepared: 30 October 2026, Australia/Perth  
Repository baseline: `6ce1e035cace6e676167f904d511a3425a5be12d`, including PRs #72/#73 and the first Finland reserve snapshots  
Delivery scope: English Markdown planning documents and bounded, read-only verification

## 1. Product direction

Turn the platform into an explorable account of how electricity systems developed and how a battery investment earns, retains, and can lose value. The intended reader understands investment but has little electricity-sector knowledge.

Use one causal chain across markets:

**Geography and historical choices -> today's system tensions and inherited constraints -> BESS services and physical limits -> payer, qualification and performance obligations -> construction to first revenue -> investment cash flow, financing, downside and exit.**

The six chapters remain **Origins, Historical choices, Today's tensions, Add a battery, Who pays, and The investment**. Construction and first settlement form an explicit bridge within the final chapter, rather than being hidden behind a single commercial-operation date. Every market needs its own historical path, dominant tension, payment mechanism, and conditions under which storage value weakens.

Preserve the off-white and deep-green research identity. Use isometric grid scenes, controlled day/night changes, and a station cutaway to explain geography, equipment, sequence, and physical services. Keep amounts, contractual coverage, cash flows, risks, sensitivities, and comparisons in auditable two-dimensional charts. The purpose of 3D is better understanding and recall.

| Reader time | Desired outcome |
| --- | --- |
| 30 seconds | Identify this market's distinguishing feature and a reason to investigate it. |
| 3 minutes | Explain a historical cause and today's main system tension. |
| 5 minutes | Explain what a battery does, who might pay, and why revenue can fall. |
| 10 minutes | Identify the investment object, capital exposure, waiting period, downside, and next diligence question. |
| Extended research | Trace a claim or number to evidence, assumptions, calculations, and missing project information. |

These are proposed user-task targets. No new experience or understanding test has been completed in this documentation task.

## 2. Reading order and document ownership

The plan is split because research evidence, scene scripts, page design, code work packages, and device migration change at different speeds and have different review gates. A single file would obscure dependencies and encourage duplicate specifications. This index owns scope, priorities, and decisions; the companion files own execution details.

| Order | Document | Authoritative content | Primary reader |
| --- | --- | --- | --- |
| 1 | [This master plan](README.md) | Product objective, scope, sequencing, decisions, preservation of the original plan | User, ChatGPT, Codex |
| 2 | [Market narrative preparation](market-narratives.md) | All 18 candidate story cards, research method, Germany/Finland script briefs | Research and editorial work |
| 3 | [Western Australia storyboard](western-australia-storyboard.md) | Fourteen proposed shots across six chapters; interaction and interpretation boundaries | Research, design, implementation |
| 4 | [Evidence and content specification](evidence-and-content-specification.md) | Status vocabulary, source/claim/calculation/asset templates, content contract, review workflow | Research and implementation |
| 5 | [Experience and page design](experience-and-page-design.md) | Information architecture, layouts, components, explanation system, bilingual requirements | Product and design |
| 6 | [Engineering work packages](engineering-work-packages.md) | Actual repository integration, work dependencies, numeric adapters, host lifecycle, budgets, rollback | Codex and technical review |
| 7 | [Preparation, migration and acceptance](preparation-migration-and-acceptance.md) | Suggested 8-10 day preparation schedule, responsibilities, handoff, understanding and release gates | User and execution coordination |
| Reference | [Verification and source register](source-register.md) | Exact repository/official links, check scope, dates, and verified claim limits | Every reviewer |

Use stable identifiers across the pack: `SRC-*` for external sources, `REPO-*` for repository evidence, `CL-*` for claims, `wa-01` through `wa-14` for shots, `WP-*` for engineering work, and `G-*` for acceptance gates. Chapter IDs are `origins`, `choices`, `tensions`, `battery`, `payment`, and `investment`.

Do not maintain a second copy of a specification in another document. Summaries link to their owner. When a claim, scene, interface, or acceptance gate changes, update its owner and affected mappings in the same document revision. All files in this initial pack share version 1.0; future revisions record date, affected IDs, decision, owner, and impact in this index. A later executable content schema should validate references and versions rather than relying on filename dates.

### Revision record

| Version | Date | Change | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-10-30 | Expand and translate the original plan; refresh verification through #73 and the first Finland reserve snapshots; add research, scene, design, engineering and migration specifications | Planning deliverable; implementation not started |

## 3. What was verified and what was produced

The local checkout was initially on a Finland feed branch. After the user's update that #72 had merged, local `main` and GitHub `main` matched `93c4a7e75cf050c5d9b01652bd84ace52f9a960d`. During writing, the repository was updated externally again. The final check at approximately 14:45 AWST found local and remote `main` aligned at `6ce1e035cace6e676167f904d511a3425a5be12d`, after #73 and the first Finland reserve snapshots. The intervening changes affect the ETL commit step and public data, not the inspected application/model modules. The working tree was clean before creating this pack. No `AGENTS.md` was found in the checked ancestor locations or repository inventory. No branch switch, pull, merge, commit, push, dependency installation, code edit, data edit, or deployment was performed by this task.

The repository still uses native ES modules, Vite, DOM/SVG, and a D3 orthographic SVG globe. It does not currently declare React or Three.js dependencies. The canonical registry contains 18 allocation markets, including three Japanese regions sharing research infrastructure. The investment, monthly cash-flow, downside, research-dialog, and saved-case capabilities should be retained. Precise integration points and qualifications appear in [the engineering baseline](engineering-work-packages.md#1-verified-repository-baseline).

PR #72 adds Finland reserve-price feed infrastructure; #73 fixes first-snapshot detection. Seven reserve-price snapshots now exist in the checked repository, and their metadata was inspected. That establishes stored price observations, not a realizable trading strategy, a verified project contract, or a fresh direct inspection of production. Reserve capacity prices must not be treated as energy-price spreads. The final GitHub run check reported successful #72/#73 CI runs and the latest live-data run; this task did not perform a new production-page acceptance test. See [the verification register](source-register.md#repository-verification).

Official sources were checked to support a small set of pilot-story foundations and engineering requirements. This is not a refreshed factual audit of every market, a new visual audit of the running website, or a market-revenue forecast. The 18 story cards are **proposed research themes**, and the WA storyboard is a **detailed editorial and interaction draft**. Missing historical dates, datasets, contract clauses, translations, and review evidence remain explicit work.

## 4. Priorities and release shape

| Sequence | Scope | Why this order | Exit condition |
| --- | --- | --- | --- |
| Preparation | All 18 short cards; WA detailed script; DE/FI differentiation scripts; evidence, design and engineering contracts | Establish breadth without pretending that all markets are research-complete | Preparation gate `G-1` |
| First complete pilot | Western Australia WEM/SWIS, all six chapters and the investment loop | Time shifting, reliability, qualification, delivery, and cash flow can be connected in one bounded example | WA evidence, numeric, understanding, accessibility and stability gates |
| Reuse validation | Germany, then Finland | Test spatial congestion and reserve competition instead of repeating the WA solar story | Distinct stories fit the shared contract without compromising local mechanisms |
| Mechanism validation | Italy | Separate Capacity Market and MACSE routes and their obligations | Route-specific source and compatibility review |
| Expansion | Remaining markets, in batches of roughly 3-4 after measured reuse effort is known | Reuse components while retaining market-specific causal arguments | Independent market sign-off; no automatic approval by template inheritance |

Narrative priority is not an investment ranking. A market can have a useful story while its return remains withheld or its project evidence remains incomplete.

### Proposed delivery stages

| Stage | Reviewable result | Dependency |
| --- | --- | --- |
| Script and design | Source-backed pilot script, annotated layouts, content/state contracts, baseline and device matrix | Repository and evidence verification |
| Runnable 2D story | Full reading path with diagrams, navigation and current-case handoff | Future coding authorization; no new-computer dependency |
| WA greybox | Historical scene, day/night scene and add-battery comparison, with equivalent diagrams | Host lifecycle and asynchronous cleanup tests |
| Complete WA experience | Cutaway, payment path, delivery timeline, model-connected cash flow/downside, bilingual and mobile coverage | Evidence, numeric and user-task review |
| Reuse and expansion | DE/FI story validation, then Italian route validation and wider rollout | Measured pilot results |

The original estimate of about 4-6 weeks for a complete WA pilot, or 6-8 weeks including Germany reuse, assumed product, design, front-end/3D and part-time research/model capacity. Retain it only as a conditional planning reference. The user's actual working model is primarily user + ChatGPT + Codex, with review availability and daily effort unconfirmed. AI assistance does not replace source verification or investment judgment. Re-estimate after the runnable 2D slice and initial host experiment. Do not promise a full pilot within the 8-10 day preparation window or estimate all-market cost by multiplying a fixed number of days.

## 5. Decisions and unresolved items

| Topic | Working decision | Classification |
| --- | --- | --- |
| Audience and causal chain | Investment-literate, electricity-novice reader; six shared chapters with local histories | Confirmed product direction |
| Visual identity | Serious off-white/deep-green research environment; spatial scenes plus auditable 2D finance | Confirmed product direction |
| Market sequence | WA first; Germany and Finland test different causal stories; Italy tests mechanism separation | Confirmed product direction |
| Website language | English and Simplified Chinese in the implemented site; this planning pack entirely English | Confirmed requirement |
| Framework | Keep native ESM/Vite; evaluate a lazy native Three.js module in an isolated work package | Proposed engineering choice |
| Preview | Local built-public preview first; a separate controlled remote preview only if needed later | Proposed workflow; not configured |
| Runtime | Validate a supported LTS baseline separately; Node 24 is a conservative candidate, Node 26 is also currently LTS | Proposed maintenance work, not performed |
| New computer | User described an AMD AI 9 H365 system with 32 GB RAM; exact CPU/GPU and graphics configuration unverified | Open inventory item; does not block research or 2D work |
| Asset production | Start with simple procedural/shared geometry; build polished licensed assets after greybox understanding tests | Proposed production approach |
| Staffing and dates | Relative 8-10 day plan and gate-based sequencing; no confirmed staffing or fixed delivery date | Planning assumption |
| Model improvements | Separate changes, separate evidence, separate numeric approval | Scope boundary |

A different exact processor model does not change the objective. Record it during handoff/device inventory instead of making basic coding dependent on the new machine. Seek user input only when a new finding changes the intended audience, scope, public information boundary, spending, or visual preference.

## 6. Non-negotiable interpretation rules

1. Label conceptual animation, observed history, official forecasts, and analyst scenarios differently. A moving arrow is not a solved power flow.
2. Distinguish a physical need, a participation mechanism, an assumed model route, an awarded contract, and verified project cash flow.
3. Show one battery's power, energy, state-of-charge, availability and contractual constraints before describing revenue stacking. Missing project constraints remain unknown.
4. Read displayed investment figures from existing defined result paths. Do not manually copy financial headlines into story prose.
5. Separate teaching controls from underwriting inputs. A daylight or battery toggle must not silently revise the investment case.
6. Separate energization, commercial operation, revenue qualification, dispatch/availability performance, and first settlement.
7. Preserve the original dates of model payments. A monthly display is not proof of monthly revenue seasonality.
8. Show contract expiry, renewal/merchant assumptions, financing limits and downside alongside the first-year revenue mix.
9. Keep public assets, sources, metadata and examples within the existing public/confidential boundary. A hidden frontend object is public.
10. Preserve existing model verification. Do not regenerate a frozen fixture to conceal an unintended numeric change.

## 7. Scope of this delivery and subsequent work

This task produces the linked Markdown pack and checks its consistency, English coverage, links, and scope. It does not implement the website, create production 3D assets, alter financial assumptions, refresh data snapshots, modify CI/Vercel, install packages, or publish anything. Future work packages are instructions for a later authorized implementation task.

The first version excludes free roaming, VR, a digital twin, arbitrary-node power-flow calculation, live dispatch optimization, large bespoke photorealistic libraries, voice interaction, and automatic investment recommendations from scene placement. Optional narration must have transcripts and remains a later enhancement. A visually richer global map and side-by-side story comparison follow the WA learning loop; they do not delay its first useful 2D version.

The main delivery risks are weak explanation despite expensive visuals, unsupported geographic precision, stale narrative after data updates, loss of case state, competing numeric paths, 3D lifecycle leaks, mobile thermal/load problems, and asset-rights mistakes. Their controls are assigned to concrete [engineering packages](engineering-work-packages.md) and [acceptance gates](preparation-migration-and-acceptance.md#4-acceptance-gates).

## 8. Preservation of the original plan

This pack expands the original Chinese-language plan dated 30 October 2026. The original remains unchanged in the external read-only project archive. Its SHA-256 when read was `A3325111528004DF6C915DFA58078D5B4646B008AF4E460B5E3390A1FCF88EF7`. The archive is outside this Git repository; its synchronized `sources` directory is not an editable project workspace. No original source material was copied into public website assets.

| Original section | Preserved and expanded here |
| --- | --- |
| 1. Direction and user outcomes | Sections 1, 4 and 6 of this index |
| 2. Existing foundation | Engineering baseline and dated source register; refreshed through #73 and the first Finland snapshots |
| 3. Architecture and access paths | Experience/page design; route/state work package |
| 4. Art direction, desktop and mobile | Experience/page design; engineering asset budgets |
| 5. Six shared chapters | Narrative method and WA storyboard |
| 6. Market differences | All-market candidate cards; DE/FI scripts; Italy route gate |
| 7. Interaction priorities and 3D/2D division | Component inventory, WA shots, staged engineering work |
| 8. Asset, service, payment and cash-flow explanation | Shared explanations, WA shots 08-14, model adapter requirements |
| 9. Evidence, content and current case | Evidence specification and state/model work packages |
| 10. Incremental implementation, lifecycle, performance | Engineering work packages and technical acceptance |
| 11. Phases, resourcing and scope | Sections 4-7; preparation and migration plan |
| 12. Understanding, visual and numeric acceptance | Acceptance tasks, gate matrix and technical evidence records |
| 13. Risks | Package-level risks/rollback and release gates |
| 14. Startup checklist and repository references | Work-package order, handoff template, exact source register |

Start a later execution session from this index, the current Git status, and the next unmet gate. Recheck the source commit and moving data vintages before implementing; do not assume the baseline recorded here is perpetually current.

## 9. Documentation delivery validation

On 30 October 2026, the completed pack passed checks for eight English-named Markdown files, English-text coverage, consistent pack/version markers, 92 local file/anchor references, balanced code fences and table structure. The 18 market IDs match the canonical registry; all 14 WA shots contain the required interaction/evidence/meaning/fallback fields; all 11 work packages contain objective, modules, inputs/outputs, dependencies, acceptance, verification, risk and rollback. The original plan's checksum was unchanged. Git status showed only the eight new documentation files as this task's uncommitted additions. No application tests, build, 3D benchmark or deployment were run for this documentation delivery.
