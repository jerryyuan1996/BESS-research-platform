/* Japan — the `grid` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { gridMapForMarket } from '../../gridMapRegistry.js';
import { congestionForDashboard } from '../../congestionRegistry.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const {
    h, L, M, SRC, T, state, GLOSS_CORE,
    fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX,
    liveScore, bandFor, durationAt, interp,
    lensRegions, isCompare, region,
  } = api;
  const { O, N, R, path, perRegion, regionTable, regionBadge, lensNote } = createShared(api);
  const SEC_B = {};

  SEC_B.grid = function (){
    return {
    head: ['Grid & Connection — export MW ≠ import MW', '并网与电网约束 — 放电MW ≠ 充电MW'],
    cap: ['A battery permitted to discharge 50 MW is not automatically permitted to charge 50 MW from the grid. The two are separately evidenced throughout.',
          '获准放电50MW的储能并不自动获准从电网充电50MW。全篇对二者分别取证。'],
    blocks: [
      lensNote(),
      { t: 'card', mt: false, title: ['Comparison strip', '对比条'], badges: ['official'], live: false, blocks: [
        regionTable(['Topic', '主题'], [
          { l: ['TSO', '电网运营商'], f: id => L(R(id).tso) },
          { l: ['Study cap from 1 Aug 2026', '2026年8月1日起检讨上限'], f: id => String(R(id).grid.studyCap) },
          { l: ['Core constraint', '核心约束'], f: id => L(R(id).grid.constraint) },
          { l: ['First construction-cost contribution', '首期工程费负担金'],
            f: id => R(id).grid.firstContributionPct ? '≥' + R(id).grid.firstContributionPct + '%' : L(['Verify current terms', '须核验现行条款']) },
          { l: ['Connection deposit', '并网保证金'],
            f: id => R(id).grid.depositPct ? R(id).grid.depositPct + '%' : L(['Not published', '未公布']) },
        ]),
        { t: 'why', text: ['Study caps are the cleanest cross-regional comparison in this whole dashboard because all three TSOs set them on the same date under the same policy direction. Eleven, eight and five is a direct statement about how much development optionality each region will allow one operator to hold.',
                           '并发检讨上限是本看板中最干净的跨区域对比，因为三家电网运营商在同一日期、依据同一政策方向设定。11、8、5三个数字直接说明了各区域允许单一业者持有多少开发选择权。'],
          sig: ['11 / 8 / 5 is an optionality ranking', '11/8/5即选择权排序'] } ] },

      perRegion(id => ({
        title: [L(R(id).short) + ' — physical grid, supply and demand', L(R(id).short) + ' — 物理电网、电源与负荷'],
        badges: [regionBadge(id), 'official'], live: false, blocks: [
          { t: 'geo-grid-map', data: gridMapForMarket('jp', id) },
          { t: 'congestion', data: congestionForDashboard('jp', id) },
        ],
      })),

      { t: 'card', title: ['How a Japanese BESS reaches energisation', '日本储能如何实现送电'], badges: ['official'], live: false,
        src: SRC.kyudenContribution, srcUse: ['Representative TSO connection and construction-contribution sequence; region-specific rules remain controlling', '代表性输电运营商并网及工程费负担流程；仍以各区域具体规则为准'], blocks: [
        { t: 'flow', items: [
          ['Site and separate import/export request', '选址并分别提出充电/放电申请'],
          ['TSO connection study', '输电运营商并网检讨'],
          ['Technical offer, works and cost allocation', '技术要约、增容工程及费用分摊'],
          ['Deposit and construction contributions', '保证金及工程费负担'],
          ['Protection, controls and performance tests', '保护、控制与性能试验'],
          ['Energisation and market qualification', '送电及市场准入'],
        ] },
        { t: 'warn', text: ['Non-firm or early connection means conditional operation under network controls. It is not evidence of firm import headroom, firm export headroom or an unconstrained commercial-operation date.',
                            '非保证型或早期并网意味着须在电网控制条件下运行，并不证明存在确定的充电余量、放电余量或不受约束的商业运行日期。'] },
      ] },

      { t: 'card', title: ['Who controls which gate', '各机构分别控制什么'], badges: ['official'], live: false, blocks: [
        { t: 'table',
          head: [['Institution', '机构'], ['Decision / responsibility', '决策 / 职责'], ['Investor evidence', '投资人应取得的证据']],
          rows: [
            [{ b: 'METI / ANRE' }, ['National energy policy, licences and technical-policy direction', '国家能源政策、许可及技术政策方向'], ['Applicable licence, safety and policy requirements', '适用许可、安全及政策要求']],
            [{ b: 'OCCTO' }, ['Cross-regional planning, capacity adequacy and national connection frameworks', '跨区规划、容量充裕度及全国并网框架'], ['Current planning case and applicable national rule vintage', '现行规划断面及适用全国规则版本']],
            [{ b: ['Regional TSO', '区域输电运营商'] }, ['Connection study, named constraints, works, cost and energisation', '并网检讨、具名约束、增容工程、费用及送电'], ['Binding import/export MW, N-1 case, cost and dated milestones', '具约束力的充/放电MW、N-1断面、费用及带日期里程碑']],
            [{ b: 'JEPX / EPRX / OCCTO CM' }, ['Energy, balancing and capacity-market qualification after the physical connection path', '物理并网路径完成后的电能量、调整力及容量市场准入'], ['Separate product qualification and metering evidence', '独立的品种准入及计量证据']],
          ] },
        { t: 'why', text: ['A grid study and a market qualification answer different questions. The former decides whether and under what controls power can flow; the latter decides whether the asset may earn from a product.',
                           '并网检讨与市场准入回答不同问题：前者决定电力能否流动以及受何种控制，后者决定资产能否通过某一品种获得收入。'],
          sig: ['Connection is physical; qualification is commercial', '并网是物理条件，准入是商业条件'] },
      ] },

      { t: 'card', title: ['Delay-prevention package for investment committee', '投委会延误防范清单'], badges: ['official'], live: false, blocks: [
        { t: 'list', items: [
          [['Separate import and export MW', '分列充电与放电MW'], ['Record normal and contingency rights at the actual connection point.', '记录实际并网点在正常及事故断面下的权利。']],
          [['Name the constraint and enabling work', '具名约束及解约工程'], ['Identify substation, circuit, protection, converter or control work — not a generic “grid upgrade”.', '明确变电站、线路、保护、换流或控制工程，而非笼统“电网升级”。']],
          [['Baseline and contingency COD', '基准及延误投运日'], ['Tie dates to land, equipment, outage and payment milestones.', '将日期与土地、设备、停电窗口及付款里程碑绑定。']],
          [['Version the commercial conditions', '对商业条件进行版本管理'], ['Preserve the study, offer, contribution schedule, curtailment protocol and every later amendment.', '保留检讨、要约、负担金计划、限电协议及全部后续修订。']],
          [['Model controls explicitly', '显式建模控制条件'], ['Non-firm dispatch, transfer-trip, charging control and intertie outages belong in revenue cases.', '非保证型调度、转移跳闸、充电控制及联络线停运均应进入收入情景。']],
        ] },
      ] },

      { t: 'card', title: ['Region-specific connection conditions', '区域特定并网条件'], badges: ['official'], live: false, blocks: [
        { t: 'sub', text: ['Tokyo — TEPCO Power Grid', '东京 — 东京电力电网'] },
        { t: 'list', items: [
          [['11 concurrent studies per operator from 1 Aug 2026', '自2026年8月1日起每家业者11项并发检讨'], null],
          [['10% connection deposit; first construction-cost contribution ≥50% for applications from 1 Apr 2026', '并网保证金10%；2026年4月1日起申请的首期工程费负担金≥50%'], null],
          [['Verified output control on 20 days, Mar–May 2026', '2026年3–5月已核验弃电20天'], null],
        ] },
        { t: 'sub', text: ['Kyushu — Kyushu Electric Power T&D', '九州 — 九州电力输配电'] },
        { t: 'list', items: [
          [['8 concurrent studies per operator from 1 Aug 2026', '自2026年8月1日起每家业者8项并发检讨'], null],
          [['Expanded transfer-trip system in operation from 1 Apr 2026 — raises Kanmon export, expected to reduce curtailment', '扩容转移跳闸系统自2026年4月1日投运 — 提升关门断面外送，预计减少弃电'], null],
          [['Verified output control on 50 days, Jan–Mar 2026', '2026年1–3月已核验弃电50天'], null],
        ] },
        { t: 'sub', text: ['Hokkaido — HEPCO Network', '北海道 — 北海道电力网络'] },
        { t: 'list', items: [
          [['5 concurrent studies per operator from 1 Aug 2026 — the tightest in the set', '自2026年8月1日起每家业者5项并发检讨 — 为样本中最严'], null],
          [['Charging-control early-connection scheme covered 27 specified systems as of 10 Apr 2026', '充电控制早期并网机制截至2026年4月10日覆盖27个指定系统'], null],
          [['Hokkaido–Honshu 0.9 GW today, approved 1.2 GW by FY2027-end', '北海道—本州现为0.9GW，已批准至2027财年末扩容至1.2GW'], null],
          [['Verified output control on 36 days, Mar–May 2026', '2026年3–5月已核验弃电36天'], null],
        ] },
        { t: 'why', text: ['Hokkaido is the only region where the network can restrict charging as an explicit condition of early connection. Every other market on this platform treats grid risk as an export question. A model that assumes unconstrained import will overstate Hokkaido specifically, which is why import evidence is weighted equally with export evidence in the shared connection score.',
                           '北海道是唯一将限制充电作为早期并网明确条件的区域。本平台其他市场均将电网风险视为外送问题。假设充电不受限的模型将专门高估北海道 — 因此在通用并网评分中，充电证据与放电证据权重相同。'],
          sig: ['Import restriction is a Hokkaido-specific risk', '充电限制是北海道特有风险'] } ] },

      { t: 'card', title: ['The interconnector build behind the curtailment — OCCTO planning stages', '弃电背后的联络线建设 — OCCTO规划阶段'], badges: ['official', 'forecast'], live: false, blocks: [
        { t: 'table',
          head: [['Reinforcement', '增容工程'], ['Between', '连接区域'], ['Delivery body', '交付主体'], ['Planning stage', '规划阶段'], ['Scope', '范围'], ['Target', '目标年份'], ['Status', '状态']],
          num: [5],
          rows: M.reinforcements.map(x => {
            const k = M.planClasses.find(c => c.id === x.cls);
            return [{ b: x.n }, x.region, [x.operator, x.operator], { chip: k.c, text: k.n }, x.scope, String(x.year), x.status];
          }) },
        { t: 'cap', text: ['Every intertie reinforcement that bears on the three regions in this dashboard, by OCCTO planning stage. National rather than regional, because each region\'s curtailment sits behind a different intertie: Hokkaido behind the Hokkaido–Honshu links, Kyushu behind Kanmon, Tokyo behind the 50/60 Hz frequency converters.',
          '按OCCTO规划阶段列出的、与本看板三个区域相关的全部联络线增容工程。之所以按全国而非区域组织，是因为各区域的弃电对应不同的联络线：北海道对应北海道—本州各线路，九州对应关门断面，东京对应50/60赫兹变频设备。'] },
        { t: 'table', head: [['Planning stage', '规划阶段'], ['What it does and does not confer', '其赋予与不赋予的内容']],
          rows: M.planClasses.map(k => [{ chip: k.c, text: k.n }, k.d]) },
        { t: 'why', text: ['Put this table next to the curtailment days and the regional ranking changes shape. Kyushu\'s ' + O.curtailKyushuDays + ' verified curtailment days are the worst in the set, and the reinforcement that would fix them — Kanmon — is planned for the end of FY2038, with an acceleration target of FY2036. That is beyond any reasonable holding period, so Kyushu curtailment should be modelled as a permanent feature of the asset rather than a window that closes. Hokkaido is the opposite case in the near term and the same case beyond it: the 0.9 to 1.2 GW uprate is approved and dated for FY2027, but the ~2 GW Japan Sea HVDC that would actually change Hokkaido economics has not even fixed its delivery entity. Tokyo is the least exposed, because the frequency-converter expansion is approved, dated and modest in what it changes. The ranking that matters is therefore not curtailment today but how far each region\'s relief sits from a date.',
          '将本表与弃电天数并置，区域排序的形态就会改变。九州已核验的' + O.curtailKyushuDays + '天弃电为样本中最差，而能够解决该问题的增容工程 — 关门断面 — 计划于2038财年末投运，加速目标为2036财年。这已超出任何合理的持有期，因此九州弃电应作为资产的永久特征建模，而非一个会关闭的窗口。北海道在近期属相反情形，而在更长期则属相同情形：0.9GW至1.2GW的扩容已批准并定于2027财年，但真正能改变北海道经济性的约2GW日本海高压直流线路甚至尚未确定交付主体。东京敞口最小，因为变频设备扩容已获批准、有明确日期，且其改变的幅度有限。因此真正重要的排序，不是当下的弃电水平，而是各区域的缓解措施距离一个确定日期还有多远。'],
          sig: ['Rank by distance to a date, not by curtailment', '按距离确定日期的远近排序，而非按弃电水平'] },
        { t: 'src', src: SRC.occtoMasterPlan, use: ['Interconnector reinforcements by planning stage and their published in-service targets', '按规划阶段列示的联络线增容工程及其公布的投运目标'] },
        { t: 'src', src: SRC.hokkaidoHonshu, use: ['The approved Hokkaido–Honshu uprate and its delivery year', '已批准的北海道—本州扩容工程及其交付年份'] },
      ] },
    ] };
  };

  // ============================== BENCHMARK ==============================

  return SEC_B.grid;
}
