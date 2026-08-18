/* ---------------------------------------------------------------------------
   Energy Arbitrage tab + the Kemerton charging card, verbatim from the
   prototype (lines 2172-2348).
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { chip } from '../../../components/chip.js';
import { why } from '../../../components/decisionLogic.js';
import { kpi } from '../../../components/metricCard.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { sourceDrawer } from '../../../components/sourceDrawer.js';
import { lineChart, barChart } from '../../../charts/index.js';
import { NF1, fmtN, fmtAM } from '../ui.js';
import { T } from '../text.js';
import { SEED } from '../data/seed.js';
import { KEMERTON } from '../data/kemerton.js';
import { MJA2026, hasMjaData } from '../data/optimizer.js';
import { hasProjectData } from '../data/kemerton.js';
import { withheldCard } from '../../../components/withheld.js';
import { mjaReconcile, mjaSeries } from '../lib/optimizer.js';

// ---------------- ENERGY ----------------
function renderEnergy(main){
  sectionHead(main, ['Energy Arbitrage — is the spread surviving battery entry?', '现货套利 — 价差能否承受电池集中投运？'],
    ['Official Q1 2026 evidence: the energy price spread fell to ~A$13/MWh from ~A$51/MWh a year earlier while battery capacity reached ~1,275 MW / 5,140 MWh — strong cannibalisation of short-duration arbitrage.',
     '官方2026Q1证据：现货价差由约A$51/MWh降至约A$13/MWh，同期电池装机达约1,275 MW / 5,140 MWh — 短时套利收益被显著侵蚀。']);
  main.append(h('div', { class: 'kpis' },
    kpi(L(['Q1 2026 price spread', '2026Q1价差']), 'A$13<small>/MWh</small>', { text: '−75% ' + L(T.yoy), cls: 'down' }, [badge('official'), statusBadge(true)]),
    kpi(L(['Fleet MW / MWh (Q1 2026)', '装机MW/MWh（2026Q1）']), '1,275 / 5,140', null, [badge('official')]),
    kpi(L(['Fleet average duration', '平均储能时长']), NF1.format(SEED.fleetAvgHours) + '<small> h</small>', null, [badge('calc')]),
    kpi(L(['Negative-price hours (Q1 2026)', '负电价小时（2026Q1）']), '~350<small> h</small>', null, [badge('illus')])));

  const g = h('div', { class: 'grid g2' });

  const cME = card(['Merchant unit economics — Q1 2026 annualised (A$/MW/yr)','市场化单位经济性 — 2026Q1年化（A$/MW/年）'], [badge('official'), statusBadge(true)]);
  cME.append(h('div', { class:'kpis' },
    kpi(L(['Net real-time market revenue','净实时市场收入']), fmtAM(8.3e6), { text: '−34% ' + L(T.yoy) + ' · Q1 2026', cls:'down' }, [badge('official')]),
    kpi(L(['Energy arbitrage','现货套利']), fmtAM(4.0e6), { text: '+4.3% ' + L(T.yoy) + ' · ~A$12.5k/MW/yr' }, [badge('official')]),
    kpi(L(['FCESS','辅助服务']), fmtAM(4.2e6), { text: '−51% ' + L(T.yoy) + ' · ~A$13.2k/MW/yr', cls:'down' }, [badge('official')]),
    kpi(L(['Merchant total','市场化合计']), '~A$26<small>k/MW/yr</small>', { text: L(['annualised on Q1-26 1,275 MW','按1,275MW年化']) }, [badge('calc')])));
  cME.append(h('div', { class:'note' }, L(['Discharge spread collapsed A$51 → A$13/MWh (−74%) as the fleet grew 250 → 1,275 MW / 1,025 → 5,140 MWh (+410%) year-on-year. For 2028-29 assets, anchor on RCM, use conservative FCESS and do not extrapolate historical spreads. (Infra fund / AEMO, Q1 2026.)','放电价差A$51→A$13/MWh（−74%），同期装机250→1,275MW/1,025→5,140MWh（+410%）。2028-29项目应以RCM为锚、FCESS取保守值、套利不宜沿用历史高价差。（基础设施基金/AEMO，2026Q1。）'])));
  cME.append(why(['~A$26k/MW/yr of total merchant revenue is the single most important reality check on this dashboard. At that level merchant income covers opex and little else — it cannot service debt, and it is roughly a twentieth of the administered capacity price per MW. Note also that arbitrage held up (+4.3%) while FCESS halved: the durable merchant component is energy, not system services. Underwrite merchant as a variable overlay on a capacity-anchored base case, and require the model to still clear DSCR with merchant set to zero.',
    '约A$26k/MW/年的市场化收入合计，是本看板最重要的现实校验。在该水平下，市场化收入仅能覆盖运维，几乎无余 — 无法支撑偿债，且约为每MW行政容量价格的二十分之一。另需注意套利收入基本持平（+4.3%）而FCESS减半：市场化中较为持久的部分是电能量，而非系统服务。应将市场化收入作为容量锚基准情景之上的可变叠加，并要求在市场化收入置零时模型仍能通过DSCR。'],
    ['Must clear DSCR at zero merchant', '市场化置零时仍须过DSCR']));
  g.append(cME);

  const c1 = card(['Optimised gross revenue by duration (A$k/MW/yr)', '按时长优化的毛收入（A$k/MW/年）'], [badge('illus'), statusBadge(true)]);
  lineChart(c1, {
    xs: SEED.quarters, yfmt: v => 'A$' + fmtN(v) + 'k',
    series: [
      { name: ['2h', '2小时'], color: 'var(--s1)', vals: SEED.tbSeries['2h'], dash: true },
      { name: ['4h', '4小时'], color: 'var(--s2)', vals: SEED.tbSeries['4h'], dash: true },
      { name: ['6h', '6小时'], color: 'var(--s3)', vals: SEED.tbSeries['6h'], dash: true },
      { name: ['8h', '8小时'], color: 'var(--s5)', vals: SEED.tbSeries['8h'], dash: true },
      { name: ['10h', '10小时'], color: 'var(--s6)', vals: SEED.tbSeries['10h'], dash: true },
    ], h: 270,
  });
  c1.append(h('div', { class: 'cap' }, L(['Short-duration revenue compresses fastest; the increment from added hours widens — the duration signal. Investment use requires a dispatch optimiser (spec §7.4).',
    '短时收益压缩最快；新增小时的增量收益扩大 — 即时长信号。投资测算须使用调度优化器（规范§7.4）。'])));
  c1.append(why(['The lines fan apart rather than falling together: 2h lost roughly two-thirds of its trailing revenue while 10h lost around a third. That divergence — not the level of any single line — is the merchant-side case for duration, and it is independent of the RCM case. It happens because short-duration assets all compete for the same narrow evening window, while longer assets can also serve the shoulders that remain uncontested. Use the gaps between lines, not the absolute values, when comparing designs.',
    '各线呈发散而非同步下降：2小时资产损失约三分之二滚动收入，10小时资产损失约三分之一。这种分化 — 而非任何单一线的水平 — 构成时长在市场化侧的论据，且独立于RCM论据。原因在于短时资产共同争夺同一狭窄晚峰窗口，而更长资产还可服务尚无竞争的肩部时段。比较方案时应使用线间差距，而非绝对值。'],
    ['Use the gaps, not the levels', '看线间差距而非绝对水平']));
  g.append(c1);

  const c2 = card(['Cannibalisation: spread vs fleet MWh (aligned panels)', '收益侵蚀：价差与装机MWh（对齐面板）'], [badge('official'), badge('illus'), statusBadge(true)]);
  lineChart(c2, {
    xs: SEED.quarters, yfmt: v => 'A$' + fmtN(v),
    series: [{ name: ['Price spread A$/MWh', '价差 A$/MWh'], color: 'var(--s1)', vals: SEED.spreadSeries, dash: true }],
    ann: [{ si: 0, i: 0, text: 'A$51 (official)' }, { si: 0, i: 4, text: 'A$13 (official)' }], h: 190,
  });
  barChart(c2, {
    xs: SEED.quarters, yfmt: v => fmtN(v),
    series: [{ name: ['Fleet MWh', '装机MWh'], color: 'var(--s2)', vals: SEED.fleetMWhSeries }], h: 170, labels: true,
  });
  c2.append(h('div', { class: 'cap' }, L(['Two aligned panels, one axis each — correlation shown here does not prove causation (spec §7.4 / §14).', '两个对齐面板、各自单轴 — 相关性不构成因果证明（规范§7.4/§14）。'])));
  c2.append(why(['Deliberately two panels, not a dual axis, because the honest claim is weaker than the visual: MWh entry is the most plausible driver of spread compression but weather, gas price and outages also moved. The decision rule that survives either reading is the same — treat every announced competitor MWh as a downward revision to your merchant assumption, because you are exposed whether or not causation is proven. Then re-run the case after each ≥100 MW COD rather than annually.',
    '刻意采用两个面板而非双轴，因为诚实的结论弱于视觉印象：MWh集中投运是价差压缩最可能的驱动，但气象、气价与停机同样在变动。无论采用哪种解读，成立的决策规则相同 — 应将每一个公布的竞争者MWh视为对自身市场化假设的下调，因为无论因果是否被证明，风险敞口都存在。随后应在每个≥100MW项目投运后重算，而非按年重算。'],
    ['Exposure regardless of causation', '无论因果均有敞口']));
  g.append(c2);

  const c3 = card(['High-price event duration distribution', '高电价事件时长分布'], [badge('illus'), statusBadge(true)]);
  barChart(c3, {
    xs: SEED.eventDurBuckets, yfmt: fmtN, labels: true,
    series: [{ name: ['Events (TTM)', '事件数（滚动12个月）'], color: 'var(--s1)', vals: SEED.eventDurCounts }], h: 230,
  });
  c3.append(h('div', { class: 'cap' }, L(['P90 event duration and the shape of the residual peak drive economic duration selection — see the Storage Duration tab.', 'P90事件时长及剩余峰值形态决定经济性时长选择 — 见“储能时长”页。'])));
  c3.append(why(['Most high-price events are short, but the revenue is in the tail — and the tail is exactly what a 2-hour asset cannot serve and a competitor’s 2-hour asset cannot take from you. Read the distribution as two separate answers: the mode tells you where competition is fiercest, the P90 tells you the duration you must physically hold to capture the uncontested events. Size hours off the tail, and expect the distribution itself to lengthen as more short-duration MW enters and flattens the sharp peak.',
    '多数高电价事件持续时间较短，但收入集中于尾部 — 而尾部恰是2小时资产无法覆盖、竞争者的2小时资产也无法从你手中夺走的部分。应将该分布读作两个独立答案：众数说明竞争最激烈之处，P90说明为捕捉无竞争事件所须实际具备的时长。时长配置应依据尾部；并预期随更多短时MW进入削平尖峰，该分布本身将进一步拉长。'],
    ['Size hours off the P90 tail', '按P90尾部配置时长']));
  g.append(c3);

  const c4 = card(['Contracted vs merchant revenue structure', '合同与市场化收入结构'], [badge('illus'), statusBadge(true)]);
  barChart(c4, {
    xs: [L(['Operating fleet MW', '已投运MW']), L(['Committed pipeline MW', '已承诺管线MW'])], mode: 'stack', bw: 48, yfmt: fmtN,
    series: [
      { name: ['Contracted / tolling', '合同/代工'], color: 'var(--s1)', vals: [570, 620] },
      { name: ['Partially contracted', '部分合同'], color: 'var(--s3)', vals: [180, 250] },
      { name: ['Merchant', '市场化'], color: 'var(--s5)', vals: [525, 380] },
    ], h: 250,
  });
  c4.append(h('div', { class: 'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Disclosed structure', '披露结构'])), h('th', {}, L(['Counterparty type', '交易对手类型'])), h('th', {}, L(['Tenor', '期限'])), h('th', {}, L(['Pricing', '价格'])), h('th', {}, L(['Disclosure quality', '披露质量'])))),
    h('tbody', {},
      h('tr', {}, h('td', {}, h('b', {}, 'Seed example — tolling')), h('td', {}, L(['State utility', '州属公用事业'])), h('td', {}, '10y'), h('td', {}, 'n.d.'), h('td', {}, chip('info', 'OFFICIAL'))),
      h('tr', {}, h('td', {}, h('b', {}, 'Seed example — offtake')), h('td', {}, L(['Industrial load', '工业负荷'])), h('td', {}, '7y'), h('td', {}, 'n.d.'), h('td', {}, chip('warn', 'DEVELOPER'))),
      h('tr', {}, h('td', {}, h('b', {}, 'Seed example — PPA')), h('td', {}, L(['Retailer', '售电商'])), h('td', {}, '5y'), h('td', {}, 'n.d.'), h('td', {}, chip('warn', 'INCOMPLETE')))))));
  c4.append(h('div', { class: 'note' }, L(['Most bilateral terms are confidential. "n.d." = not disclosed — the dashboard never interpolates or reverse-engineers undisclosed contract pricing (spec §7.5.4).',
    '多数双边合同条款保密。“n.d.”=未披露 — 看板绝不推算或反推未披露合同价格（规范§7.5.4）。'])));
  c4.append(why(['Roughly half of operating MW and a larger share of the committed pipeline carries some contracted or tolling structure — which tells you what the market clears at, not just what it hopes for. Two uses: it sets the negotiating benchmark for your own floor or toll, and it explains why the merchant-only cohort is the most exposed to further entry. Since pricing is undisclosed across the board, negotiate on structure (tenor, floor level, availability definition, who keeps the upside) rather than trying to benchmark a price that is not observable.',
    '约半数在运MW、以及已承诺管线中更高比例带有某种合同或代工结构 — 这反映市场实际成交的形态，而非仅是期望。两项用途：为自身保底或代工设定谈判基准；解释纯市场化项目群为何对后续进入最为脆弱。由于价格普遍未披露，谈判应围绕结构展开（期限、保底水平、可用率定义、上行归属），而非试图对标一个不可观察的价格。'],
    ['Negotiate structure, not price', '谈结构而非价格']));
  g.append(c4);
  main.append(g);

  /* ---- Supplementary long-run view: fills the forward-revenue gap official
          publications do not cover (AEMO/ERA publish no 30-year project revenue
          path).

     Both supplementary cards below are built entirely from the confidential
     third-party layer, so they are omitted rather than emptied when it is
     absent. The public content of this tab — the WEM spread history, the FCESS
     interaction and the merchant curve — is above and unaffected.

     Nothing is stated in place of them here: unlike the Portfolio tab, whose
     absence would be conspicuous, these are supplementary by construction and a
     reader who never saw them is not missing part of an argument. */
  if (!hasMjaData) return;

  const S = mjaSeries();
  const fyL = S.years.map(y => "'" + String(y).slice(2));
  const rc = mjaReconcile(MJA2026.recon2035);
  const cSup = card(['Supplementary long-run revenue shape — filling the gap official sources leave', '补充性长期收入形态 — 填补官方来源未覆盖的空白'], [badge('supp'), badge('conf'), badge('recon'), badge('gross')]);
  cSup.append(h('div', { class: 'note' }, h('b', {}, L(['Why this section exists: ', '本节存在的理由：'])),
    L(['AEMO and the ERA publish nothing on forward project-level revenue beyond the capacity-price determination. This third-party modelled layer is used only to fill that one gap — the shape of a storage revenue curve over an asset life. It is confidential, chart-reconstructed, gross-basis and expressed in June 2025 real dollars. It is display-only and is never fed into the Investment Lab.',
      'AEMO与ERA除容量价格决定外未发布任何项目层面的前瞻收入。此第三方模型层仅用于填补这一空白 — 即资产全生命周期内储能收入曲线的形态。其为保密、图表重构、毛值口径、以2025年6月不变价表示，仅供展示，绝不进入投资测算。'])));
  barChart(cSup, {
    xs: fyL, mode: 'stack', rotX: true, yfmt: v => 'A$' + fmtN(v / 1e6) + 'M',
    series: [
      { name: ['Capacity revenue', '容量收入'], color: 'var(--s1)', vals: S.capRev },
      { name: ['Gross energy sales', '毛现货销售'], color: 'var(--s5)', vals: S.energyGross },
      { name: ['ESS / RoCoF', '辅助/RoCoF'], color: 'var(--s3)', vals: S.essRocof },
    ], h: 260,
  });
  lineChart(cSup, {
    xs: fyL, yfmt: v => 'A$' + fmtN(v / 1e6) + 'M',
    series: [
      { name: ['Gross discharge sales', '毛放电销售'], color: 'var(--s5)', vals: S.energyGross, dash: true },
      { name: ['Net energy margin (after charging + losses)', '净现货收益（扣充电与损耗）'], color: 'var(--s2)', vals: S.netEnergy, dash: true },
    ], h: 180,
  });
  cSup.append(h('div', { class: 'cap' }, L(['Plateau of ~A$140–160M/yr while duration protection holds, a step down to ~A$95–105M as protection expires into a longer requirement and the cell degrades, then a reset after the year-15 refurbishment (FY' + S.refurbFY + '). Capacity is ~52% of the gross stack; the gap between the two lines is charging cost plus round-trip loss — roughly two-thirds of gross discharge sales.',
    '在时长保护有效期内维持约A$140–160M/年平台；随保护到期进入更长时长要求且电芯衰减，降至约A$95–105M；第15年大修（FY' + S.refurbFY + '）后重置。容量约占毛值栈的52%；两线差额为充电成本加往返损耗 — 约为毛放电销售额的三分之二。'])));
  cSup.append(h('div', { class: 'kpis' },
    kpi(L(['Gross discharge sales (sample year)', '毛放电销售（示例年）']), fmtAM(rc.grossSales), { text: 'DWP A$' + MJA2026.recon2035.dwp + '/MWh × ' + MJA2026.recon2035.cfPct + '% CF' }, [badge('gross')]),
    kpi(L(['− Charging cost', '− 充电成本']), fmtAM(rc.chargeCost), { text: 'LWP A$' + MJA2026.recon2035.lwp + '/MWh ÷ ' + MJA2026.recon2035.rte + '% RTE', cls: 'down' }),
    kpi(L(['Net energy margin', '净现货收益']), fmtAM(rc.netMargin), { text: L(['before degradation, fees, outages', '未计衰减、费用、停运']) }, [badge('calc')]),
    kpi(L(['Charge–discharge price spread', '充放电价差']), 'A$' + MJA2026.assumptions.spreadEarly + ' → A$' + MJA2026.assumptions.spreadLate + '<small>/MWh</small>', { text: L(['widens over asset life', '全生命期内扩大']) }, [badge('recon')]),
    kpi(L(['Discharge capacity factor', '放电容量系数']), '~' + MJA2026.assumptions.capacityFactorPct + '<small>% of DSOC</small>', { text: L(['resets at year-15 refurbishment', '第15年大修后重置']) }, [badge('recon')])));
  cSup.append(why(['Three structural features of the revenue curve matter, and none of them is visible in a single-year model. First, capacity is roughly half of gross revenue for the whole life, so the asset is a capacity asset that also trades — not the reverse. Second, charging cost and round-trip loss consume around two-thirds of gross discharge sales, so any figure labelled "arbitrage revenue" must be converted to net before it touches EBITDA, IRR or DSCR. Third, the step down when duration protection expires into a longer requirement is the largest single event in the curve — which is the strongest argument for buying augmentation optionality up front rather than more MWh now.',
    '收入曲线中有三项结构性特征，且均无法在单年模型中体现。第一，容量在全生命周期内约占毛收入一半，因此该资产本质是"兼做交易的容量资产"，而非相反。第二，充电成本与往返损耗吞噬约三分之二的毛放电销售额，因此任何标注为"套利收入"的数字，在进入EBITDA、IRR或DSCR之前必须换算为净值。第三，时长保护到期进入更长要求时的阶跃下降是曲线中最大的单一事件 — 这也是应优先购买增容选择权、而非当下直接增加MWh的最有力论据。'],
    ['Capacity asset that also trades', '兼做交易的容量资产']));
  cSup.append(sourceDrawer({ file: MJA2026.sourceName + ' — ' + MJA2026.reportTitle, status: ['Third-party modelled · confidential','第三方模型 · 保密'], date: MJA2026.reportDate, cy: 'Supplementary — forward revenue shape only', url: '' },
    ['Used only where official sources publish nothing: long-run revenue shape, price path and locational deliverability case','仅用于官方来源未发布之处：长期收入形态、价格路径及位置可交付性案例']));
  cSup.style.marginTop = '14px';
  main.append(cSup);

  const cOp2 = card(['Supplementary price path — dispatch-weighted vs charging price', '补充性价格路径 — 调度加权价与充电价'], [badge('supp'), badge('conf'), badge('recon')]);
  lineChart(cOp2, {
    xs: fyL, yfmt: v => 'A$' + fmtN(v),
    series: [
      { name: ['Dispatch-weighted price (DWP)', '调度加权价格(DWP)'], color: 'var(--s8)', vals: S.dwp, dash: true },
      { name: ['Load-weighted charging price (LWP)', '负荷加权充电价(LWP)'], color: 'var(--s1)', vals: S.lwp, dash: true },
    ], h: 200,
  });
  cOp2.append(h('div', { class: 'cap' }, L(['Both prices rise with delivered gas cost because storage shadow-bids gas generation; the spread between them widens from ~A$47 to ~A$75/MWh over the asset life. Chart-reconstructed, confidential, June 2025 real A$.',
    '两个价格均随交付天然气成本上升，因储能对燃气机组进行影子报价；两者价差在全生命期内由约A$47扩大至约A$75/MWh。图表重构、保密、2025年6月不变价。'])));
  cOp2.append(why(['The mechanism, not the numbers, is the transferable insight: as long as gas sets the marginal price in the evening peak, a storage asset’s discharge price is anchored to delivered gas cost — so WA gas policy and domestic gas pricing are a direct input to storage merchant revenue, not background context. It also means the widening spread is driven by rising gas cost rather than by improving scarcity, so it does not survive a shift to gas displacement. Track WA domestic gas reservation policy as a merchant-revenue variable.',
    '可迁移的洞见在于机制而非数字：只要燃气在晚峰设定边际价格，储能的放电价格即锚定于交付天然气成本 — 因此西澳天然气政策与本地气价是储能市场化收入的直接输入，而非背景信息。这也意味着价差扩大源于气价上升而非稀缺性改善，因此在燃气被替代的情形下不成立。应将西澳本地天然气保留政策作为市场化收入变量跟踪。'],
    ['Gas policy is a revenue input', '天然气政策是收入输入']));
  cOp2.style.marginTop = '14px';
  main.append(cOp2);
}

// Project-specific charging / offtake strategy — Portfolio tab only.
function kemertonChargingCard(){
  // Reachable only from the gated Portfolio tab; guarded because it is exported.
  if (!hasProjectData) return withheldCard(['Commercial charging & offtake strategy', '充电与售电策略']);
  const kcs = card(['Commercial charging & offtake strategy', '充电与售电策略'], [badge('dev'), badge('model')]);
  kcs.append(h('div',{class:'kpis'},
    kpi(L(['Renewable charging cost','新能源充电成本']),'A$'+KEMERTON.merchant.renewableChargeCost+'<small>/MWh</small>',null,[badge('dev')]),
    kpi(L(['Renewable-linked discharge','新能源对应放电价']),'A$'+KEMERTON.merchant.renewableDischargePrice+'<small>/MWh</small>',null,[badge('dev')]),
    kpi(L(['Target gross spread','目标毛价差']),'A$'+KEMERTON.merchant.grossSpread+'<small>/MWh</small>',{text:L(KEMERTON.merchant.status)},[badge('model')]),
    kpi(L(['Initial contemplated contract','初始拟议合同']),'2–3<small> years</small>',{text:L(['PPA / combined offtake; not signed','PPA/综合售电；尚未签署'])},[badge('draft')])));
  kcs.append(h('div',{class:'flow'},
    h('span',{class:'fbox'},L(['Wind charging ~22:00–06:00','风电充电约22:00–06:00'])),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox'},L(['Solar fallback ~10:00–14:00','光伏补充约10:00–14:00'])),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox'},L(['Gas fallback if required','必要时燃气补能'])),h('span',{class:'farr'},'→'),
    h('span',{class:'fbox'},L(['Preserve afternoon/evening obligation availability','保留午后/晚峰义务可用率']))));
  kcs.append(h('div',{class:'tbl-wrap'},h('table',{},h('tbody',{},[
    [['OCGT charging assumption','OCGT充电假设'],'A$'+KEMERTON.merchant.ocgtChargeCost+'/MWh',L(['Developer-reported','开发商披露'])],
    [['OCGT-linked discharge bid','OCGT对应放电报价'],'A$'+KEMERTON.merchant.ocgtDischargeBid+'/MWh',L(['Developer-reported','开发商披露'])],
    [['Third-party PPA/offtake','第三方PPA/售电'],L(['Planned, not signed','计划中，未签署']),L(['Uncontracted','未签约'])],
    [['Long-term Auzvolt portfolio','长期Auzvolt组合'],L(['Development thesis','开发逻辑']),L(['Not current protection','非当前保护'])]
  ].map(r=>h('tr',{},h('td',{},h('b',{},L(r[0]))),h('td',{},r[1]),h('td',{},r[2])))))));
  kcs.append(h('div',{class:'warnbox'},L(['The A$60/MWh spread is a developer commercial assumption, not an observed WEM spread or independent forecast. Keep it separate from market-observed data and require a signed PPA, toll, floor or independently validated forecast before treating it as protected value.','A$60/MWh价差是开发商商业假设，而非已观察WEM价差或独立预测。必须与市场数据分开；在纳入受保护价值前，应取得已签PPA、代工协议、保底或独立验证预测。'])));
  kcs.append(why(['The A$60/MWh target spread is an uncontracted developer assumption sitting on top of an observed market spread of A$13/MWh. That is not a reason to reject it — a bilateral renewable charging arrangement can genuinely beat the pool — but it is a reason to give it zero weight in the base case and zero weight in debt sizing until a document exists. The charging sequence matters more than the spread: wind-first overnight charging with a solar fallback is what preserves availability through the evening obligation window, and availability is what the capacity revenue is actually paid for.',
    'A$60/MWh的目标价差是未签约的开发商假设，而市场实际观察价差为A$13/MWh。这并非否定其可行性 — 双边新能源充电安排确实可能优于市场池 — 但在取得文件之前，基准情景与债务规模测算中应给予零权重。充电顺序比价差更重要：以夜间风电为主、光伏为补充的充电策略，才能在晚峰义务窗口保持可用率，而容量收入实际支付的正是可用率。'],
    ['Zero weight until documented', '未成文前给予零权重']));
  kcs.append(sourceDrawer(KEMERTON.sources.trading, ['Developer charging, dispatch and proposed offtake strategy','开发商充电、调度及拟议售电策略']));
  kcs.style.marginTop = '14px';
  return kcs;
}

export { renderEnergy, kemertonChargingCard };
