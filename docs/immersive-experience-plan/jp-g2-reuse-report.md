# Japan: G-2 build and reuse report

This local stack implements the signed Japan story for Tokyo, Kyushu and Hokkaido. All three registry entries stay **`released: false`**. Engineering validation and the analyst's bilingual G-2 walkthrough are separate gates. The bundle gate is still open at the integration measurement below; this report does not declare the candidate green.

本地分层实现覆盖东京、九州和北海道，三个故事均保持 **`released: false`**。工程验证与分析师的双语 G-2 走查是两道独立关口。下列集成测量的体积关口仍未通过，本报告不代表候选版本已经验收。

## Entry and reviewed tuples

Baseline `main`: **`13dacf0e1e3874bd888452f694fc7c90240a97aa`**, merged G-1 PR #160. The [build evidence](jp-build-evidence.md) records the live rule-11 read on 5 November 2026, the primary sources reopened, every fixed-vintage field and every financial owner. No stop-rule field moved.

| Area | Reviewed call / lens | Play / hours | Route / stage | Obligation / term |
| --- | --- | --- | --- | --- |
| `jp_tokyo` | `opportunistic` / `infraFund` | `jp-tokyo-ltda-6h` / 9 | `ltda` / `operating` | 6 hours / 20 years |
| `jp_kyushu` | `opportunistic` / `infraFund` | `jp-kyushu-ltda-6h` / 9 | `ltda` / `operating` | 6 hours / 20 years |
| `jp_hokkaido` | `opportunistic` / `infraFund` | `jp-hokkaido-ltda-6h` / 9 | `ltda` / `operating` | 6 hours / 20 years |

Each composition retains its own tuple, `on: '2026-11-05'`, market id, play id and section links. Eleven shared shot objects have identical serialized bytes across all three compositions. Each adds only its own regional 07, 10 and 13 in the signed chapter positions. A stale area fails independently and falls back to research.

## Reuse by layer and time

The implementation uses an independent clone at `task-4/japan-g2`, with its own Git directory, index and hooks. No existing worktree was switched or edited. Confidentiality inputs were restored only to ignored `local-data/`; staged scans ran before the first commit and on subsequent commits.

| Layer | Reuse | New Japan work | Recorded work window / validation |
| --- | --- | --- | --- |
| Evidence | Poland build-evidence format, G-1 claim register and signed bindings | Live tuple check, source reopening, gap treatments and build-cost owner audit | Finished 16:07 UTC; less than 32 minutes after baseline merge, including setup and checks. Baseline unit run: 1,379 total, 1,344 passed, 35 skipped, zero failed, 266.83 s; current-model checks 84/84, 1.72 s |
| Data | Poland fixed-vintage records and PJM value/provenance separation | National values once, three regional records, 76 per-value provenance entries, light source envelopes | 16:07–16:19 UTC, about 13 minutes between commits. Data tests 6/6; `etl:verify` verified all 17 existing snapshots without regeneration |
| Content | Ordinary story contract, Poland guards, existing decision-panel and acquisition formatters | Twenty exact bilingual shot tables, nine timeline nodes, regional composition and read-only owner bindings | 16:19–16:28 UTC, about 9 minutes. Initial data/content run 18/18, 40.73 s; later content coverage includes missing compact-reference data |
| Scenes/chart | Shared SVG, isometric symbols and toggle controls; existing design tokens | Twenty local scene functions, one map derivative, local teaching state, one parameterised JPY chart and accessible tables | 16:28–16:55 UTC, about 27 minutes. Data/content/scenes 31/31, 6.72 s; current-model checks 84/84, 0.48 s |
| Wiring and review | Existing research entry, shell, navigator, place/history, language switching, source disclosures and four section exits | Shared loader, independent preview guards, complete graph budget, desktop/mobile checks and this report | Began 16:55 UTC. Japan unit checks 37/37; browser integration 32/32, 1.7 min; repeated history checks 12/12, 52.4 s; responsive/chart-focus checks 6/6, 35.9 s. Final validation belongs to the exact-head ledger |

These are observed wall windows, including source reads, tool waits and checks, rather than measured active-authoring hours. The evidence window is an upper bound from the baseline merge, not an invented start time. The final local validation ledger records command start/end, exit status, counts and the actual head; no intermediate branch is represented as having passed unrun full-suite checks.

Local layer branches are stacked in order: `codex/jp-g2-evidence` (`84b1f2e`), `codex/jp-story-data` (`fdedc6f`), `codex/jp-story-content` (`95a7a96`), `codex/jp-story-scenes` (`c3384ca`), and `codex/jp-story-wiring`. There are no PR links because the analyst has not asked to open PRs. Nothing has been pushed, merged, deployed or published.

## Shared files changed

| File | Reason |
| --- | --- |
| `src/experience/story/registry.js` | One shared Japan loader, three preview-only entries, and the G-1 sign-off comment; `storyFor()` is unchanged |
| `tests/bundle-budget.test.js` | Add only the Japan 40 KiB cap and a full additional-static-JS plus lazy-CSS assertion, including content/style isolation and one shared pack |

All other product additions are Japan-local. The kit, shell, navigator, router, place, contract, marker and global story CSS are unchanged. No model, view, dataset registration, ETL feed, rate, weight, fixture, snapshot or package dependency is changed.

The Japan stylesheet supplies a one-pixel negative shot scroll margin: browser tracing found a fractional 0.015625-pixel intersection with the preceding shot during language restoration. Keeping that edge outside the reading viewport addresses the local composition without changing the shared observer or history code. New disclosure/table UI labels are bilingual; the signed Question, Copy, Meaning, Marker, Controls, Labels and Caption wording remains exact.

## Shared-pack result and budget

One `story-jp-*.js` is emitted and shared by all three ids. Browser checks find no Japan pack request before opening, and no per-value provenance request before opening Sources. The geography is a derivative of the existing Natural Earth prefecture groups, Git blob **`4cc02e4a64fa89174a33e1e2dfe093e8b0ec1d74`**, not a new geographic dataset. Mercator fits all exterior vertices into a 600 × 420 frame; Douglas–Peucker uses 1.5-pixel tolerance, coordinates round to 0.5 pixels, and rings below 1.5 square pixels are omitted. This reduces 11,138 vertices to 695, omitting 17 tiny rings. A portrait viewport crops unused horizontal frame space at x=140–460; retained geometry spans x=170–429, so no retained ring is clipped. The reader's area is outlined and the frequency boundary is a labelled approximate band. No site, project or holder is mapped.

Integration measurement after map simplification and responsive corrections, before the final wiring commit:

| Item | Gzip bytes |
| --- | ---: |
| Japan pack | 33,264 |
| Complete additional static JavaScript, including the pack | 43,598 |
| Lazy Japan and shared story CSS | 5,522 |
| Total | **49,120 / 47.97 KiB** |
| Required cap | **40,960 / 40 KiB** |

This integration measurement fails by 8,160 bytes. The first measurement was 51,296 bytes / 50.09 KiB; local screen-space map simplification removed roughly 3.2 KiB before the mobile corrections. All 30 other budget checks passed, with no other cap changed. Final exact-head bytes may differ with the build hash and are recorded in the validation ledger.

The storyboard's copy-weight forecast was an estimate. The eleven shared and nine regional shot tables serialize to 18,720 and 17,846 UTF-8 bytes respectively; concatenated they gzip to 13,148 bytes, before the extra timeline/UI text, bindings, scenes, map, shell, kit and CSS. A separate read-only review found no duplicated full pack: pair deduplication increased gzip by 34 bytes; keeping source envelopes to title/URL alone saved only 672 bytes in its built-output probe. This is not proof that a compliant implementation is impossible; a substantial Japan-local refactor remains necessary. The built initial graph must fit the unchanged cap before this stack can be called a green G-2 candidate. No wording was cut, regional story sub-chunks added or budget assertion weakened to conceal this finding.

## Numeric and teaching boundaries

The opening card reads the existing decision-panel investment result. The separate design-value label reads `HOME_BRIEFING.plays[market/play].econ.value` in USD per MW at the platform's yields. Purchase ticks decode the existing infrastructure-fund acquisition reference pool, with each case's own JPY per MW price, target return and return basis. There is no currency conversion and no shared USD/JPY axis. Trigger binding reads only its expected date; thesis, reason, press range and trigger label are not copied.

**BUILD-JP-02 remains unresolved.** No allowed public gross design build-cost result in JPY exists in `designEconomics` or the operating acquisition reference. The RTB reference budget at `row.investment.capexPerMW` has a different basis and is not substituted. The chart therefore withholds the build-cost bar and discount band, removes the sentence containing the missing field, and displays the signed missing-financial text. A separate model-owner exposure with currency and basis is the smallest proposed follow-up; no model change is made here.

The revenue scene uses each area's own net secured share and term. It places the gross other-market-profit clawback in a separate strip rather than adding returned profit to the net-revenue denominator. This is a rendering judgement for the analyst to inspect, with no new model result. The fade curve uses the existing play's hours, floor, term and fade assumption and is tagged Example. Tokyo's day/night teaching and Hokkaido's unscaled charging strip are also tagged Example. Kyushu keeps physical output-control days and revenue mechanisms in separate panels. Its monthly day chart uses only its own anchored window, with no conversion into hours or revenue and no regional ranking. Phone layouts use a vertical queue/payment chain, timeline-first reform, static outage pattern, one selected price/revenue plot followed by comparison tables, contained keyboard-focusable price-table scrolling, and the signed investment checklist. Case focus/hover exposes price, target and return basis; the table includes the same basis.

Plans are dashed, observations solid, and CL-JP-18 / CL-JP-28 are labelled interpretations. All controls store only local teaching state; they do not write the case, address or history. The local state survives the shell's language redraw. Sources load per-value locators only on disclosure and expose the approved bilingual failure/retry state.

## Gaps and fallbacks carried into G-2

| Gate | Current treatment / next evidence |
| --- | --- |
| BUILD-JP-02 | Missing build-cost bar/band; analyst chooses whether to commission the separate model-side gross design-cost exposure |
| FUNDING | Public mechanism located in OCCTO's explanation and contribution briefing; funding leg can be solid. Keep Fair and distinguish the consultation draft from final rules |
| CHARGECTRL | Original attachment located; restriction hours/rates belong to the individual connection-study answer. Hokkaido stays an unscaled Example |
| FC2011 | No reopened quantified March 2011 converter-transfer record; jp-02 stays qualitative |
| HOLDERS | Deliberately open; no holder names, project names, counts, sites or award-list payload |
| CURTAIL | Anchored monthly days only, each area's own window; daily workbook not opened for page use |
| TERM | Twenty years in principle; the actual acquired award's contract remains diligence |
| CERT | Certification index could not be opened; supplier remains unnamed and authoring-only |
| RETURN / REFORM-WHY | Cited METI PDF and meeting index returned 403; no numeric regulated return, new rationale or marker upgrade |
| Tokyo demand wording | Opened primary results rank contracted capacity, rather than a demand time series; signed wording is retained with this evidence limit documented |
| Bundle | Initial graph exceeds the unchanged 40 KiB cap at this measurement; engineering gate remains open |

Exact opened locators and dates are in [the build evidence](jp-build-evidence.md). None of these gaps authorises a model change, identity disclosure or release.

## Analyst's bilingual walkthrough

Use only built output: `npm run build`, then `npm run preview -- --host 127.0.0.1 --port 4197 --strictPort`. The isolated test preview uses loopback; it is not a deployment. Each URL requires the preview gate. Without it the existing research dialog remains the entry.

| Area / 区域 | Walkthrough URL / 走查地址 | Regional checks / 区域核查 |
| --- | --- | --- |
| Tokyo / 东京 | `http://127.0.0.1:4197/markets/japan-tokyo?story=preview` | Connection-study count is not capacity; day/night is an Example. / 并网研究数量不是容量；昼夜切换属于示例。 |
| Kyushu / 九州 | `http://127.0.0.1:4197/markets/japan-kyushu?story=preview` | Anchored monthly days retain their own window; physical and revenue panels stay separate. / 锚定的月度弃电天数保留自己的观察窗口，物理与收入面板分开。 |
| Hokkaido / 北海道 | `http://127.0.0.1:4197/markets/japan-hokkaido?story=preview` | Charging-control strip is unscaled; link reinforcement is planned and dashed. / 充电限制条带不设数值比例；联络线加固属于规划，使用虚线。 |

Apply every check below separately to all three URLs, in English and Simplified Chinese:

1. Read the opening call, play, nine-hour design, operating LTDA route and next action. Try a wrong lens or stale tuple and confirm independent research fallback. / 核对开篇判断、方案、九小时设计、已投运 LTDA 路径和下一步动作；用错误投资者视角或过期元组验证各区域独立回退至研究窗口。
2. Read all fourteen shots and their single markers: Strong on 03/04/05/06 and Kyushu 07, Fair elsewhere, and the opening's own play marker. Compare all eleven shared shots across areas for identical copy. / 阅读十四节及每节唯一的证据标记：03/04/05/06 和九州 07 为充分，其余为尚可，开篇采用方案本身标记；跨区域比较十一节共用文字完全一致。
3. Check all three acquisition cases and targets in the accessible table, the local area highlight and comparison toggle, JPY axis, separate USD design value and missing build-cost state. / 核对无障碍表格中的三种收购情景及目标回报、本区域高亮和比较开关、日元坐标、独立美元设计价值以及建设成本缺失状态。
4. Inspect the approximate prefecture-group map, highlighted area and labelled frequency band. Confirm no plant, holder, project or site identity. / 检查近似都道府县分组地图、区域高亮与已标注的频率分界带，确认没有电厂、持有人、项目或站址身份。
5. Inspect Examples, observed dates, dashed plans, local timeline selection and the separate interpretation labels. Confirm no cross-area curtailment ranking or curtailment-to-revenue inference. / 检查示例、实测日期、虚线规划、局部时间线选择及单独的解读标签，确认没有跨区域弃电排名或将弃电直接推导成收入。
6. Use Enter/Space, check focus return, switch language without losing teaching state or place, and exercise Back, refresh, invalid regional-shot fallback and all four section handoffs on the area's own page. / 使用回车和空格，检查焦点返回、切换语言时保留教学选择及阅读位置，验证返回、刷新、错误区域节号回退和四个跳转均落到本区域页面。
7. Repeat on desktop and phone; inspect every table, unit, source disclosure and failed-source retry. Confirm no story request before opening or provenance request before disclosure. / 在桌面与手机重复检查表格、单位、来源展开和来源失败重试，确认打开前不请求故事，展开来源前不请求逐值出处。
8. Review the measured complete graph against 40 KiB and resolve the engineering gate before recording G-2 disposition. The analyst's later release PR must change all three released flags together. / 对照 40 KiB 上限审核完整新增依赖图，解决工程关口后再记录 G-2 结论；后续发布 PR 必须同时修改三个区域的发布标记。

Screenshots, command logs and the exact-head validation ledger are local review evidence. The five layer PRs remain unopened until the analyst asks; G-2 sign-off and joint release are not inferred from engineering checks.
