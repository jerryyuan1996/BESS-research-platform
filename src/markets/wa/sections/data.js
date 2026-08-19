/* ---------------------------------------------------------------------------
   Data & Methodology tab, verbatim from the prototype (lines 4075-4244).
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { why } from '../../../components/decisionLogic.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { T } from '../text.js';
import { SRC } from '../sources.js';
import { MJA2026, hasMjaData } from '../data/optimizer.js';
import { exportCsv, exportJson } from '../lib/exports.js';

// ---------------- DATA & METHODOLOGY ----------------
function renderData(main){
  sectionHead(main, ['Data & Methodology — source registry, formulas and quality badges', '数据与方法 — 数据源登记、公式与质量标识'],
    ['All sources below were verified accessible on 17 July 2026 (spec §15). Live ingestion must run server-side (CORS / large-file limits), discover the latest file from each directory, and drive the source-health badge automatically.',
     '下列来源已于2026年7月17日核验可访问（规范§15）。实时抓取须在服务端进行（CORS/大文件限制），从目录动态发现最新文件，并自动生成源健康标识。']);

  const gov = card(['Source hierarchy & version control — which source may answer which question', '来源层级与版本控制 — 何种来源可回答何种问题'], [badge('calc')]);
  const govRows = [
    [['Official — Final','官方 — 最终'],['2026 WEM ESOO; ERA BRCP final determination (13 Mar 2026); Reserve Capacity Cycle timetable; AEMO QED; ESM Rules','2026 WEM ESOO；ERA BRCP最终决定（2026-03-13）；容量周期时间表；AEMO QED；ESM规则'],['Primary market and rule facts; the only basis for scoring','主要市场与规则事实；唯一可用于评分的依据']],
    [['Official — Draft','官方 — 草案'],['Western Power Transmission System Plan 2025','Western Power 2025输电系统规划'],['Planning context only','仅作规划背景']],
    [['Public source','公开来源'],['Project and transaction announcements, CIS award releases, market-structure compilation','项目与交易公告、CIS中标发布、市场结构汇编'],['Market structure, players, exit routes; not a substitute for official data','市场结构、参与者、退出路径；不可替代官方数据']],
    [['NEM namespace','NEM命名空间'],['AEMO NEM Connection Scorecard, June 2026','AEMO NEM并网记分卡，2026年6月'],['Context only; never scored into WA','仅作背景参考；绝不计入西澳评分']],
    [['Supplementary source','补充来源'],['Third-party modelled long-run revenue shape and locational case study','第三方模型的长期收入形态与位置案例研究'],['Fills gaps official publications do not cover; display-only, never in returns','填补官方来源未覆盖的空白；仅供展示，不进入回报测算']],
    [['Project technical study','项目技术研究'],['GPS, steady-state report, grid input package','GPS、稳态报告、电网输入包'],['Asset-specific constraints and capability (Portfolio tab)','资产约束及能力（组合页）']],
    [['Developer-reported','开发商披露'],['Charge/discharge strategy and development schedule','充放电策略及开发计划'],['Commercial thesis; not contracted','商业逻辑；未签约']],
    [['Financial-model assumption','财务模型假设'],['Project financial model workbook','项目财务模型工作簿'],['Returns, capex and financing; audit required','回报、造价及融资；需审计']],
    [['Superseded','已被替代'],['Earlier project configurations and 2025 teaser material','早期项目配置及2025 teaser材料'],['Do not use without an explicit historical label','无明确历史标签不得使用']]
  ];
  const govBadge = i => [badge('final'), badge('draft'), badge('public'), badge('nem'), badge('supp'), badge('project'), badge('dev'), badge('model'), badge('superseded')][i];
  const govHead = h('thead',{},h('tr',{},
    h('th',{},L(['Status','状态'])),
    h('th',{},L(['Examples','示例'])),
    h('th',{},L(['Permitted use','允许用途']))));
  const govBody = h('tbody',{},govRows.map((r,i)=>h('tr',{},
    h('td',{},govBadge(i)),
    h('td',{},L(r[1])),
    h('td',{},L(r[2])))));
  gov.append(h('div',{class:'tbl-wrap'},h('table',{},govHead,govBody)));
  gov.append(h('div',{class:'warnbox'},L(['Do not use a file titled “electricity-statement-of-opportunities” without checking the market: the NEM and the WEM each publish an ESOO and they are not interchangeable. Every WA rule fact must come from a WEM-scoped publication.','使用名为“electricity-statement-of-opportunities”的文件前须先核对所属市场：NEM与WEM各自发布ESOO，两者不可互换。所有西澳规则事实必须来自WEM范围的发布物。'])));
  gov.append(why(['The hierarchy exists to stop one specific failure: a lower-tier number being carried into a decision as if it were official. In practice the three rules that matter are — score only on Official-Final; keep the NEM namespace out of every WA revenue and scoring input; and let supplementary third-party material fill only the gaps official publications genuinely leave (long-run revenue shape, sub-boundary NAQ logic) without ever being presented alongside official figures as an alternative view. If a number cannot be placed in one of these rows, it cannot be used.',
    '该层级的存在只为阻止一种特定失误：将较低层级的数字当作官方数据带入决策。实务上关键的三条规则是 — 仅以"官方—最终"层级用于评分；将NEM命名空间排除于所有西澳收入与评分输入之外；补充性第三方材料仅可填补官方来源确实未覆盖的空白（长期收入形态、子边界NAQ逻辑），且绝不与官方数据并列作为替代观点呈现。若某一数字无法归入上述任一行，则不得使用。'],
    ['If it has no tier, it has no use', '无法归层者不得使用']));
  main.append(gov);

  const src = [
    ['AEMO WEM market data portal', 'https://data.wa.aemo.com.au/', ['Continuous', '持续'], ['Top-level public-data portal', '公共数据总入口']],
    ['AEMO public datafiles index', 'https://data.wa.aemo.com.au/datafiles/', ['Varies', '不定'], ['Automated source discovery — never hard-code filenames', '自动发现数据文件 — 不得硬编码文件名']],
    ['Market clearing prices (CSV)', 'https://data.wa.aemo.com.au/public/public-data/datafiles/market-clearing-prices-csv/', ['Daily', '每日'], ['Energy & FCESS price series', '电能量与FCESS价格序列']],
    ['Reference Trading Price (CSV)', 'https://data.wa.aemo.com.au/public/public-data/datafiles/reference-trading-price-csv/', ['Daily', '每日'], ['Arbitrage & spread analysis', '套利与价差分析']],
    ['Market schedules (CSV)', 'https://data.wa.aemo.com.au/public/public-data/datafiles/market-schedule-csv/', ['Daily/monthly', '每日/每月'], ['Dispatch & post-reform demand — backend ingestion required', '调度与改革后需求 — 需后端抓取']],
    ['Market requirements (CSV)', 'https://data.wa.aemo.com.au/public/public-data/datafiles/market-requirements-csv/', ['Daily', '每日'], ['FCESS requirements', 'FCESS需求']],
    ['FCESS summary', 'https://data.wa.aemo.com.au/public/public-data/datafiles/fcess/', ['Regular', '定期'], ['Enablement, prices, volumes', '成交量、价格、量能']],
    ['Facilities registry', 'https://data.wa.aemo.com.au/public/public-data/datafiles/post-facilities/', ['Daily', '每日'], ['Facility & technology crosswalk', '设施与技术对照']],
    ['Facility SCADA', 'https://data.wa.aemo.com.au/public/public-data/datafiles/facility-scada/', ['Monthly', '每月'], ['Operating BESS MW, COD inference', '在运BESS出力、投运推断']],
    ['Distributed PV', 'https://data.wa.aemo.com.au/public/public-data/datafiles/distributed-pv/', ['Annual+', '每年+'], ['Solar trough & duck curve', '光伏低谷与鸭形曲线']],
    ['ESR obligation intervals', 'https://data.wa.aemo.com.au/public/public-data/datafiles/electric-storage-resource-obligation-intervals/', ['Annual', '每年'], ['Duration requirement & obligation windows', '时长要求与义务时段'], true],
    ['Peak Capacity Credit — component', 'https://data.wa.aemo.com.au/public/public-data/datafiles/peak-capacity-credit-component/', ['RCM cycle', 'RCM周期'], ['Official duration / accreditation analysis', '官方时长/认证分析'], true],
    ['Peak Capacity Credit — facility', 'https://data.wa.aemo.com.au/public/public-data/datafiles/peak-capacity-credit-facility/', ['RCM cycle', 'RCM周期'], ['Facility-level credits & derating', '设施级信用与折减'], true],
    ['Capacity Credits since market start', 'https://data.wa.aemo.com.au/public/public-data/datafiles/capacity-credits-since-market-start/', ['RCM cycle', 'RCM周期'], ['Historical capacity supply', '历史容量供给']],
    ['Peak RCR outcome', 'https://data.wa.aemo.com.au/public/public-data/datafiles/peak-reserve-capacity-requirement-outcome/', ['RCM cycle', 'RCM周期'], ['Peak capacity demand', '峰值容量需求'], true],
    ['Flexible RCR outcome', 'https://data.wa.aemo.com.au/public/public-data/datafiles/flexible-reserve-capacity-requirement-outcome/', ['RCM cycle', 'RCM周期'], ['Flexible capacity demand', '灵活容量需求']],
    ['Assigned NAQ', 'https://data.wa.aemo.com.au/public/public-data/datafiles/assigned-naq/', ['RCM cycle', 'RCM周期'], ['Network deliverability cap on credits', '容量信用的网络可交付上限'], true],
    ['Reserve Capacity Prices', 'https://data.wa.aemo.com.au/public/public-data/datafiles/reserve-capacity-prices/', ['RCM cycle', 'RCM周期'], ['Published RCP & shadow validation', '公布RCP与影子价格验证'], true],
    ['BRCP (AEMO / ERA)', 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/benchmark-reserve-capacity-price', ['Annual', '每年'], ['Capacity-price anchor & benchmark tech', '容量价格锚与基准技术'], true],
    ['Reserve Capacity Cycle timetable', 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/reserve-capacity-timetable', ['Annual', '每年'], ['Milestone countdown', '里程碑倒计时']],
    ['WEM ESOO', 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wem-forecasting-and-planning/wem-electricity-statement-of-opportunities-wem-esoo', ['Annual', '每年'], ['Demand, RCR, ESR duration, retirements', '需求、RCR、ESR时长、退役'], true],
    ['Quarterly Energy Dynamics (QED)', 'https://www.aemo.com.au/energy-systems/major-publications/quarterly-energy-dynamics-qed', ['Quarterly', '每季'], ['Official quarterly battery revenue cross-check', '官方季度电池收益核对'], true],
    ['Congestion Information Resource', 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/system-operations/congestion-information-resource/reports', ['Annual/qtr', '每年/季'], ['Constraint analysis', '阻塞约束分析']],
    ['AEMO NAQ page & procedure changes', 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wa-reserve-capacity-mechanism/network-access-quantities', ['On change', '变更时'], ['NAQ methodology & revenue-relevant procedure changes', 'NAQ方法及影响收入的程序变更'], true],
    ['AEMO WEM facility registration', 'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/participate-in-the-market/registration/register-a-facility-in-the-wem', ['On change', '变更时'], ['Candidate Facility → registration process', '候选设施至注册流程']],
    ['Western Power — large generator connection', 'https://www.westernpower.com.au/products-services/install-something-new/connect-my-home-or-business/transmission-connected-loads-generators/', ['Event-driven', '事件驱动'], ['Enquiry → close-out workflow', '问询至完结流程']],
    ['Western Power — Critical Projects Framework', 'https://www.westernpower.com.au/resources-education/industry-resources/large-industry-customers-and-generators/critical-project-framework/', ['Event-driven', '事件驱动'], ['Connection-ready priority framework', '并网就绪优先框架']],
    ['Western Power — GPS', 'https://www.westernpower.com.au/resources-education/technical-documentation/distribution-network-documentation/generator-performance-standards/', ['On change', '变更时'], ['GPS templates & tripartite assessment', 'GPS模板与三方评审']],
    ['Western Power — Clean Energy Link', 'https://www.westernpower.com.au/resources-education/our-network-the-grid/future-of-the-grid/clean-energy-link-program/', ['Quarterly', '每季'], ['Transmission upgrade dependency', '输电升级依赖']],
    ['WA ESM Rules', 'https://www.wa.gov.au/government/document-collections/electricity-system-and-market-rules', ['On gazettal', '颁布时'], ['Legal framework: GPS, RCM, NAQ', '法律框架：GPS、RCM、NAQ'], true],
    ['WA Domestic Gas Policy', 'https://www.wa.gov.au/government/wa-domestic-gas-policy', ['Annual/policy', '每年/政策'], ['Gas-peaker economics context', '燃气调峰经济性背景']],
    ['ABS state population', 'https://www.abs.gov.au/statistics/people/population/national-state-and-territory-population/latest-release', ['Quarterly', '每季'], ['Structural demand driver', '结构性需求驱动']],
    ['BloombergNEF battery price survey', 'https://about.bnef.com/insights/clean-transport/lithium-ion-battery-pack-prices-fall-to-108-per-kilowatt-hour-despite-rising-metal-prices-bloombergnef/', ['Annual', '每年'], ['Third-party cost benchmark — never overrides OEM quotes', '第三方成本基准 — 不得覆盖OEM报价']],
    ['ERA Benchmark Reserve Capacity Prices (determinations & WEM Procedure)', 'https://www.erawa.com.au/markets/wholesale-electricity-market/price-setting/benchmark-reserve-capacity-prices', ['Annual', '每年'], ['BRCP determinations and benchmark-technology history', 'BRCP决定及基准技术演变历史'], true],
    ['Energy Policy WA — RCM Review & WEM Investment Certainty Review', 'https://www.wa.gov.au/government/document-collections/reserve-capacity-mechanism-review', ['On review', '评审时'], ['RCM reform history, Peak/Flexible split, fixed-price election', 'RCM改革历史、峰值/灵活拆分、固定价选择权']],
    ['DCCEEW — Capacity Investment Scheme', 'https://www.dcceew.gov.au/energy/renewable/capacity-investment-scheme', ['Per tender', '按招标'], ['WA tender outcomes and contracted revenue floors', '西澳招标结果及合同化收入底线'], true],
    ['AEMO NEM Connection Scorecard', 'https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/participate-in-the-market/network-connections/connection-scorecard', ['Quarterly', '每季'], ['NEM context only; never scored into WA', '仅作NEM背景参考；绝不计入西澳评分']],
  ];
  const c1 = card(['Source registry (spec §15, verified 17 Jul 2026)', '数据源登记表（规范§15，2026-07-17核验）'], [statusBadge(false)]);
  c1.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Dataset / page', '数据集/页面'])), h('th', {}, L(['Refresh', '更新频率'])), h('th', {}, L(['Dashboard use', '看板用途'])), h('th', {}, L(['Status', '状态'])))),
    h('tbody', {}, src.map(s => h('tr', {},
      h('td', {}, h('a', { href: s[1], target: '_blank', rel: 'noopener' }, s[0])),
      h('td', {}, L(s[2])), h('td', {}, L(s[3])),
      h('td', {}, s[4] ? h('span', { class: 'badge etl' }, 'LIVE_ETL_REQUIRED') : h('span', { class: 'badge seed' }, 'SEED / ' + L(['reference', '参考'])))))))));
  c1.append(why(['The rows tagged LIVE_ETL_REQUIRED are the ones that change a decision when they move — ESR obligation intervals, Peak Capacity Credit components, assigned NAQ, Reserve Capacity Prices, the ESOO, the BRCP determination and the CIS awards. Those are the automation priority; everything else can stay on a manual refresh. Until that ingestion runs server-side and drives the source-health badge, treat every figure as of its stated snapshot date and re-verify the seven live-ETL rows before any external use.',
    '标注LIVE_ETL_REQUIRED的行是变动会改变决策的项目 — ESR义务时段、峰值容量信用分项、获配NAQ、备用容量价格、ESOO、BRCP决定及CIS中标。这些应为自动化优先项；其余可保持手动更新。在该抓取于服务端运行并驱动源健康标识之前，所有数值均应按其标注的快照日期理解，且在任何对外使用前须重新核验上述七类实时抓取项。'],
    ['Automate the seven decision-critical feeds', '优先自动化七类决策关键数据']));
  main.append(c1);

  /* Supplementary third-party source registry entry — confidential, gap-filling
     only. The entry names the report, its author and its vintage, so it is
     itself confidential metadata and is omitted from a public build along with
     the layer it describes. The formula and badge-legend cards below are public
     and continue regardless. */
  if (hasMjaData) renderMjaSourceEntry(main);

  const c2 = card(['Core formulas (spec §6.4, §8.4, §13.5)', '核心公式（规范§6.4、§8.4、§13.5）'], [statusBadge(false)]);
  c2.append(h('pre', { style: 'font-size:var(--fs-2xs);line-height:1.7;color:var(--ink2);overflow-x:auto;background:var(--bg);border:1px solid var(--border);border-radius:var(--r-md);padding:12px;margin-top:8px;' },
`capacity_supply_ratio        = assigned_peak_capacity_credits / peak_RCR          = 6,670 / 6,323 = 105.5%
upper_deadband_headroom_MW   = peak_RCR × 1.05 − expected_total_capacity_credits  = 6,639 − 6,670 = −31 MW
expected_capacity_credit_MW  = project_MW × stage_prob × on_time_prob × CRC_factor × NAQ_factor × availability_factor
unit_FCESS_price             = total_enablement_cost / enabled_MW_hours
FCESS_saturation_ratio       = accredited_FCESS_MW / average_FCESS_requirement_MW
captured_spread              = average_sell_price − average_buy_price / RTE   (explanatory only — use a dispatch optimiser)
adjusted_RCR_forecast        = base_ESOO_RCR + prob_wt_new_SWIS_industrial + prob_wt_data_centre − NWIS/off-grid reclassification
portfolio_blended_IRR        = Σ(capital_i × IRR_i) / Σ capital_i
shadow RCP                   = exact ESM Rules formula, validated against published RCPs (never inferred from a chart)`));
  c2.append(why(['Every headline figure in the dashboard traces to one of these lines, which is what makes the conclusions auditable rather than asserted. The two worth memorising are the first — the supply ratio, because it decides whether RCP sits at benchmark or on the declining slope — and the third, expected capacity credit MW, because it is the product of five independent haircuts and therefore the place where optimism compounds fastest. If a counterparty quotes a capacity revenue figure, ask them to write it as that third line and the disagreement will be visible immediately.',
    '看板中每一项主要数值均可追溯至上述某一公式，这使结论可审计而非仅是断言。其中值得记住的是第一条 — 供给比，因其决定RCP处于基准水平还是下行段；以及第三条 — 预期容量信用MW，因其为五个相互独立折减因子之积，是乐观假设累积最快之处。若交易对手报出某一容量收入数字，可请其按第三条公式写出，分歧将立即显现。'],
    ['Make counterparties write line three', '要求对手方写出第三条公式']));
  c2.style.marginTop = '14px';
  main.append(c2);

  renderDataTail(main);
}

/* Confidential: names the report, its author and its vintage. */
function renderMjaSourceEntry(main){
  const cMja = card(['Supplementary third-party source — used only where official publications are silent', '补充性第三方来源 — 仅用于官方来源缺失之处'], [badge('conf')]);
  const mjaMeta = [
    [['Source', '来源'], MJA2026.sourceName + ' — ' + MJA2026.reportTitle],
    [['Vintage', '版本'], MJA2026.reportDate],
    [['Gap it fills', '所填补的空白'], ['Long-run project revenue shape and price path; sub-boundary locational deliverability logic. No official publication covers either.', '长期项目收入形态与价格路径；子边界位置可交付性逻辑。两者均无官方来源覆盖。']],
    [['Status', '状态'], ['Confidential · modelled · chart-reconstructed · not official', '保密 · 模型 · 图表重构 · 非官方']],
    [['Price basis', '价格基准'], MJA2026.priceBasis],
    [['Permitted use', '允许用途'], ['Display-only, in the Energy and Grid tabs, clearly badged. Never fed into EBITDA, IRR, DSCR or any scoring input; never presented as an alternative to an official figure.', '仅在现货与并网页面展示并明确标注。绝不进入EBITDA、IRR、DSCR或任何评分输入；绝不作为官方数据的替代观点呈现。']],
  ];
  cMja.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('tbody', {}, mjaMeta.map(r => h('tr', {}, h('td', {}, h('b', {}, L(r[0]))), h('td', {}, Array.isArray(r[1]) ? L(r[1]) : r[1])))))));
  cMja.append(h('div', { class: 'warnbox' }, L(['Do not expose this document or its detailed project data in a public deployment without permission. Chart-reconstructed figures are tagged accordingly and cannot be exported as official.',
    '未经许可，不得在公开部署中暴露本文件或其详细项目数据。图表重构数值均相应标注，且不可作为官方数据导出。'])));
  cMja.append(why(['A supplementary source is only legitimate where an official one is silent, and only for the shape of a relationship rather than the level of a number. Both uses here meet that test: no regulator publishes a 30-year project revenue curve, and AEMO publishes assigned NAQ outcomes without the sub-boundary reasoning behind them. Keeping it to gap-filling avoids the trap of running a parallel set of numbers — there is one official figure for every official question, and the supplementary layer answers only the questions that have no official figure.',
    '补充来源只有在官方来源缺失时才具备正当性，且仅用于说明关系的形态而非数字的水平。此处两项用途均满足该检验：无监管机构发布30年项目收入曲线；AEMO发布获配NAQ结果但不披露其背后的子边界推理。将其严格限于填补空白，可避免维护一套平行数字的陷阱 — 每个官方问题只有一个官方数字，补充层仅回答那些没有官方数字的问题。'],
    ['Shape only, where nothing official exists', '仅在无官方数据处说明形态']));
  cMja.style.marginTop = '14px';
  main.append(cMja);
}

/* Public: badge legend, official-value summary and the export buttons. */
function renderDataTail(main){
  const c3 = card(['Data-quality badge legend & seed status', '数据质量标识说明与种子状态'], [statusBadge(false)]);
  c3.append(h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin:10px 0;' },
    badge('official'), badge('calc'), badge('illus'), badge('forecast'), badge('dev'), badge('public'),
    badge('supp'), badge('nem'), badge('conf'), badge('recon'), badge('final'), badge('draft'), badge('project'), badge('model'), badge('superseded')));
  c3.append(h('div', { class: 'cap' }, L(['Official values, refreshed July 2026: 2028-29 BRCP A$488,500/MW/yr for both Peak and Flexible Capacity (ERA final determination, 13 Mar 2026; 200 MW / 1,200 MWh six-hour benchmark at 330 kV) · 2027-28 Peak RCP A$360,700/MW/yr · 2028-29 Peak RCR 6,323 MW · existing + committed ≈ +347 MW vs RCR, of which 1,666 MW battery · ESR Duration Requirement 14 Trading Intervals (7 h) for 2028-29, 12 (6 h) for 2027-28, 8 (4 h) for cycles to 2024 · Q1 2026 fleet ~1,275 MW / 5,140 MWh · Q1 2026 spread ~A$13/MWh (from ~A$51) · Q1 2026 battery FCESS revenue ~A$4.2M (from ~A$8.6M) · Q1 2026 enablement cost ~A$5.1M (−75%) with batteries at 83% of contingency and regulation volume · storage supplied a record 37.2% of SWIS peak demand on 9 May 2026. Q1 2026 remains the latest published AEMO QED at the verification date. Everything else is calculated, public-source or illustrative and is labelled accordingly. Pre- and post-October-2023 WEM reform data must never be combined without adjustment.',
    '官方数值，2026年7月刷新：2028-29 BRCP峰值与灵活容量均为A$488,500/MW/年（ERA最终决定，2026-03-13；基准为330kV下200MW/1,200MWh六小时电池） · 2027-28峰值RCP A$360,700/MW/年 · 2028-29峰值RCR 6,323 MW · 现有+已承诺≈高于RCR 347 MW，其中电池1,666 MW · ESR时长要求：2028-29为14个交易时段（7小时）、2027-28为12个（6小时）、截至2024周期为8个（4小时） · 2026Q1装机约1,275 MW/5,140 MWh · 2026Q1价差约A$13/MWh（由约A$51） · 2026Q1电池FCESS收入约A$4.2M（由约A$8.6M） · 2026Q1成交成本约A$5.1M（−75%），电池占事故与调频成交量83% · 2026年5月9日储能创纪录供给SWIS峰值需求37.2%。截至核验日，2026Q1仍为AEMO最新发布的QED。其余内容均为计算、公开来源或示例数据并相应标注。2023年10月WEM改革前后的数据未经调整不得合并使用。'])));
  c3.append(h('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;' },
    h('button', { class: 'btn', onclick: exportCsv }, L(T.downloadCsv)),
    h('button', { class: 'btn', onclick: exportJson }, L(T.downloadJson))));
  c3.style.marginTop = '14px';
  main.append(c3);

  const gloss = [
    ['Reserve Capacity Mechanism (RCM)', '备用容量机制'], ['Benchmark Reserve Capacity Price (BRCP)', '基准备用容量价格'],
    ['Reserve Capacity Price (RCP)', '实际备用容量价格'], ['Reserve Capacity Requirement (RCR)', '备用容量需求'],
    ['Capacity Credits', '容量信用'], ['Certified Reserve Capacity (CRC)', '认证备用容量'],
    ['Network Access Quantity (NAQ)', '网络接入容量'], ['Energy arbitrage', '现货套利'],
    ['FCESS', '频率协同优化辅助服务'], ['Round-trip efficiency', '往返效率'], ['State of charge', '荷电状态'],
    ['Net load', '净负荷'], ['ESR Duration Requirement', '储能资源持续时长要求'], ['ESR Obligation Interval', '储能资源义务时段'],
    ['Peak / Flexible Capacity Credit', '峰值/灵活容量信用'], ['Duration-Need Index', '时长需求指数'],
    ['Residual peak', '剩余峰值'], ['Deadband', '价格不调整区间'], ['Merchant revenue', '市场化收入'],
    ['Access Offer', '接入报价/接入要约'], ['Electricity Transfer Access Contract (ETAC)', '电力输送接入合同'],
    ['Interconnection Works Contract (IWC)', '并网工程合同'], ['Generator Performance Standards (GPS)', '发电机性能标准'],
    ['Critical Projects Framework', '关键项目框架'], ['Augmentation optionality', '增容选择权'],
    ['Debt service coverage ratio (DSCR)', '偿债覆盖率'], ['Long-stop date', '最终截止日'], ['Scenario snapshot', '情景快照'],
    ['Remedial Action Scheme (RAS)', '补救行动方案'], ['Security-Constrained Economic Dispatch (SCED)', '安全约束经济调度'],
    ['Grid-forming (GFM)', '构网型'], ['Cost of New Entry (CONE)', '新进入成本'], ['NCESS', '非协同优化基本系统服务'],
    ['Trading Interval (30 minutes)', '交易时段（30分钟）'], ['Benchmark Capacity Provider', '基准容量提供者'],
    ['Reserve Capacity Cycle', '备用容量周期'], ['Rule vintage', '规则版本'],
    ['Fixed Reserve Capacity Price election (5 / 10 year)', '固定备用容量价格选择权（5/10年）'],
    ['Reserve Capacity Security', '备用容量保证金'], ['Capacity Investment Scheme (CIS)', '容量投资计划'],
    ['Long-Term Energy Service Agreement (LTESA)', '长期能源服务协议'], ['Sell-down / develop-and-sell', '开发后出售'],
    ['Platform stake sale', '平台股权出售'], ['Refinancing exit', '再融资退出'],
    ['Non-recourse debt', '无追索权债务'], ['Portfolio / platform facility', '组合/平台融资'],
    ['Unlevered IRR', '无杠杆内部收益率'], ['Terminal value', '终值'],
    ['NEM Connection Scorecard', 'NEM并网记分卡'], ['Conversion rate (connection stage)', '并网阶段转化率'],
    ['System strength impact assessment', '系统强度影响评估'], ['Full output achieved', '达到满出力'],
  ];
  const c4 = card(['Bilingual glossary (spec §18.2)', '双语术语表（规范§18.2）'], [statusBadge(false)]);
  c4.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('tbody', {}, gloss.map(g2 => h('tr', {}, h('td', {}, g2[0]), h('td', {}, g2[1])))))));
  c4.append(why(['Four terms carry disproportionate decision weight and are the ones most often used loosely in WA discussions: Trading Interval (the ESR requirement is set in intervals, not hours, and the conversion matters at the threshold), rule vintage (which cycle a credit was allocated in determines the duration it must meet), NAQ (a network cap on assigned credits, not a physical export limit), and the fixed Reserve Capacity Price election (a one-way choice between a decade-long floor and the annual administered price). Agreeing these four definitions with a counterparty before negotiating removes most of the scope for talking past each other.',
    '有四个术语在决策中的权重不成比例，且在西澳的讨论中最常被宽泛使用：交易时段（ESR要求以时段而非小时设定，在门槛附近换算至关重要）、规则版本（信用在哪一周期获配决定其须满足的时长）、NAQ（对获配信用的网络上限，而非物理送出限制），以及固定备用容量价格选择权（在十年收入底线与年度行政价格之间的单向选择）。在谈判前与交易对手就这四项定义达成一致，可消除大部分各说各话的空间。'],
    ['Agree four definitions before negotiating', '谈判前先统一四项定义']));
  c4.style.marginTop = '14px';
  main.append(c4);
}

export { renderData };
