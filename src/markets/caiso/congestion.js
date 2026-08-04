/* ---------------------------------------------------------------------------
   CAISO — congestion register.

   CAISO answers the register's central question in a way no other market here
   does, and the answer is that the most valuable constraint is not a constraint
   at all.

   California's defining feature is a midday trough manufactured by policy: solar
   drives prices toward and through zero for several hours a day, and a battery is
   paid to absorb it. That is not congestion — nothing is constrained, the energy
   is simply worth less than nothing — but it is the single largest locational
   value in this market and a register that only recorded network constraints
   would miss it entirely. It is entered here as a ZONAL_PRICE row, because that
   is exactly how a battery captures it: through the nodal price, continuously,
   with no product to register for.

   What IS a constraint here is the queue. Roughly 500 GW of generation and
   storage sits in the CAISO interconnection queue with batteries about 46% of it,
   and interconnection has overtaken technology cost as the binding limit on
   deployment. Like ERCOT's large-load queue it is uncompensated — nobody pays a
   developer for waiting — but unlike ERCOT's it protects the incumbent, because
   the Resource Adequacy price the operating fleet earns is supported by exactly
   the scarcity the queue creates.

   And the third row is the one with no equivalent anywhere else on this platform:
   a constraint on the CONTRACTED line rather than the merchant one. An
   energy-only interconnection cannot sell Resource Adequacy at all, so
   deliverability status is a binary gate on most of the revenue on this
   dashboard.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  nqc: 'https://www.caiso.com/notices/2026-net-qualifying-capacity-values-for-resource-adequacy-resources',
  sod: 'https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-power-procurement/resource-adequacy-homepage',
  storage: 'https://www.caiso.com/documents/2024-special-report-on-battery-storage-may-29-2025.pdf',
  summer: 'https://www.caiso.com/documents/2026-summer-loads-and-resources-assessment.pdf',
};

export const CAISO_CONGESTION = {
  marketId: 'caiso',
  summary: [
    'The market where the most valuable locational feature is not a constraint. California manufactured a midday trough deep enough that prices go negative for hours a day, and a battery captures it through the nodal price with no product to register for. What is genuinely constrained is access: roughly 500 GW sits in the interconnection queue with batteries about 46% of it, and an energy-only interconnection cannot sell Resource Adequacy at all — which removes most of the revenue on this dashboard rather than reducing it.',
    '在这个市场中，最具价值的区位特征并非约束。加州人为造就了足够深的午间低谷，使电价每日有数小时为负，而储能通过节点价格即可捕获该价值，无需注册任何产品。真正受约束的是准入：并网排队量约500GW，其中储能约占46%；且仅电能量并网的项目完全无法出售容量充裕度 — 这将移除本看板大部分收入，而非仅使其减少。',
  ],
  gateNote: [
    'CAISO publishes nodal prices, curtailment volumes and NQC values by resource in full, and the CPUC publishes the Slice of Day framework. What no source publishes is what a specific project is paid for Resource Adequacy, because RA is negotiated bilaterally and no auction clears it. Gate G33.',
    'CAISO完整公布节点价格、限电电量及按资源列示的净合格容量数值，CPUC则公布分时段机制框架。但没有任何来源公布特定项目所获得的容量充裕度报酬，因为容量充裕度采取双边协商，不存在集中出清的拍卖。研究缺口G33。',
  ],

  zones: [
    {
      id: 'caiso-midday-trough',
      bearsOn: 'merchGross',
      name: ['The midday trough — a manufactured opportunity', '午间低谷 — 人为造就的机会'],
      shape: 'zone',
      coord: [-119.40, 36.20],
      direction: 'import',
      intensity: 1.0,
      metrics: [
        { label: ['Cause', '成因'],
          value: ['Utility-scale and behind-the-meter solar against weak midday load', '公用事业级与用户侧光伏叠加午间负荷疲弱'],
          period: ['current', '当前'] },
        { label: ['What a battery does with it', '储能如何利用'],
          value: ['Charges into negative and near-zero prices, discharges into the evening ramp', '在负电价与近零电价时段充电，在晚间爬坡时段放电'],
          period: ['current', '当前'] },
      ],
      capture: {
        mechanism: CAPTURE.ZONAL_PRICE,
        text: [
          'Captured through the nodal price, continuously, with nothing to register for. It is in a congestion register despite not being congestion because it is the largest locational value in this market and a register that only recorded network constraints would miss it. The important property is that it is a POLICY artefact rather than a weather one — the solar that creates it is not going away, and neither is the shape.',
          '通过节点价格持续捕获，无需注册任何产品。之所以将其列入拥塞登记表（尽管它并非拥塞），是因为它是本市场最大的区位价值，而仅记录电网约束的登记表将会遗漏它。其重要特性在于：它是政策的产物而非天气的产物 — 造就它的光伏不会消失，这一形态也不会消失。',
        ],
      },
      relief: {
        project: ['None — and none is wanted', '无 — 且并不需要'],
        operator: 'CAISO',
        scope: ['The trough is the revenue opportunity rather than a problem to be relieved. What erodes it is other batteries arriving, not a network reinforcement',
                '该低谷是收入机会而非有待缓解的问题。侵蚀它的是其他储能的进入，而非电网增容'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'This is the one entry on any register in this platform where relief would be bad news and none is coming. What compresses the trough is more storage, and the queue that would deliver it is the binding constraint — so the merchant opportunity is protected by the same thing that makes the market hard to enter. Do not, however, over-weight it: the entire CAISO merchant band on this dashboard is smaller than the gap between the reported ends of the Resource Adequacy range.',
        '这是本平台所有登记表中唯一一个“缓解措施反而是坏消息、且不会到来”的条目。压缩该低谷的是更多储能的进入，而能够带来这些储能的排队队列正是约束性瓶颈 — 因此市场化机会恰恰受到使该市场难以进入的同一因素的保护。但不应对此过度加权：本看板整个CAISO市场化收入区间，都小于容量充裕度已报告区间两端之间的差距。',
      ],
      source: 'CAISO Special Report on Battery Storage; CAISO nodal market data',
      sourceUrl: URL.storage,
    },

    {
      id: 'caiso-deliverability',
      bearsOn: 'contracted',
      name: ['Deliverability — a constraint on the contracted line', '可交付性 — 对合同化收入的约束'],
      shape: 'zone',
      coord: [-118.24, 34.05],
      direction: 'export',
      intensity: 0.95,
      metrics: [
        { label: ['Energy-only interconnection', '仅电能量并网'],
          value: ['Cannot sell Resource Adequacy at all', '完全无法出售容量充裕度'],
          period: ['current', '当前'] },
        { label: ['Share of revenue at stake', '所涉收入占比'],
          value: ['Most of it — RA is the majority of a CAISO battery\'s income', '大部分 — 容量充裕度是CAISO储能收入的主体'],
          period: ['current', '当前'] },
      ],
      capture: {
        mechanism: CAPTURE.CAPACITY_ACCREDITATION,
        text: [
          'The only row on any register here that constrains the CONTRACTED leg rather than the merchant one. Full-capacity deliverability is what allows a resource to be counted toward a load-serving entity\'s Resource Adequacy obligation; without it the asset can still trade energy and ancillary services and cannot sell capacity at all. So this is not a haircut, it is a gate — and the thing it gates is most of the revenue on this dashboard.',
          '这是本平台所有登记表中唯一一条约束合同化收入而非市场化收入的条目。全容量可交付性使资源得以计入负荷服务实体的容量充裕度义务；若不具备该资格，资产仍可交易电能量与辅助服务，但完全无法出售容量。因此这并非折减，而是一道门槛 — 且其所把控的正是本看板的大部分收入。',
        ],
      },
      relief: {
        project: ['Deliverability allocation through the interconnection process', '通过并网流程分配可交付性'],
        operator: 'CAISO',
        scope: ['Deliverability is awarded through the interconnection study process, so relief here is the same reform as the queue row below and carries the same absence of a completion date',
                '可交付性通过并网研究流程授予，因此此处的缓解与下方排队条目属同一改革，同样没有完成日期'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'Diligence this before the RA price, not after it. A negotiated RA price inside the reported $4.29–14.67/kW-month range is a commercial outcome worth arguing over; deliverability is binary and decides whether there is anything to argue about. It is the reason `contracted` and not `merchGross` is the field this row bears on, and the reason the connection scorecard weights it second only to the queue.',
        '应在评估容量充裕度价格之前而非之后对此进行尽调。在已报告的每kW每月$4.29–14.67区间内协商得出的容量充裕度价格，是值得争取的商业结果；而可交付性是非此即彼的，它决定了是否存在可争取的对象。这正是本条目所指向的字段是`contracted`而非`merchGross`的原因，也是并网记分卡将其权重列为仅次于排队的原因。',
      ],
      source: 'CPUC Resource Adequacy framework; CAISO NQC values',
      sourceUrl: URL.sod,
    },

    {
      id: 'caiso-queue',
      bearsOn: 'contracted',
      name: ['The interconnection queue — 500 GW, and it protects the incumbent', '并网排队 — 500GW，且它保护在运资产'],
      shape: 'zone',
      coord: [-120.50, 38.60],
      direction: 'both',
      intensity: 0.9,
      metrics: [
        { label: ['Generation and storage in the queue', '排队中的发电与储能'],
          value: ['≈500 GW', '约500GW'], period: ['2025–2026', '2025–2026年'] },
        { label: ['Battery share of the queue', '储能占排队量比重'],
          value: ['≈46%', '约46%'], period: ['2025', '2025年'] },
        { label: ['Operating battery fleet', '在运储能机组'],
          value: ['≈15 GW', '约15GW'], period: ['early 2026', '2026年初'] },
      ],
      capture: {
        mechanism: CAPTURE.UNCOMPENSATED,
        text: [
          'Nobody pays for waiting. A project in the queue earns nothing and carries development cost until it clears, and interconnection has overtaken technology cost as the binding constraint on CAISO deployment. But the effect on an operating asset is the opposite of a cost: the Resource Adequacy price the existing fleet earns is supported by exactly the scarcity the queue creates, so an incumbent benefits from the same congestion a developer pays for.',
          '无人为等待付费。排队中的项目没有任何收入，并须承担开发成本直至通过排队，而并网已取代技术成本成为CAISO建设的约束性瓶颈。但其对在运资产的影响恰恰相反、并非成本：现有机组所获得的容量充裕度价格，正是由排队所造成的稀缺性所支撑，因此在运方从开发方所付出代价的同一拥堵中获益。',
        ],
      },
      relief: {
        project: ['Interconnection queue reform', '并网排队改革'],
        operator: 'CAISO',
        scope: ['Ongoing process reform with no published completion date. It is the only relief item on this market\'s register without a year attached, and it is the binding one',
                '持续进行中的流程改革，无公布的完成日期。这是本市场登记表中唯一没有年份的缓解事项，同时也是起约束作用的那一项'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'Read this against ERCOT and the two markets invert. In Texas connection is nearly free and the margin was competed away; here connection is the scarce thing and the contracted revenue survives because of it. A CAISO investor holding a queue position with deliverability is holding the asset the market is actually short of — which is also why development-stage entry prices in California should be expected at the high end of the RTB premium band rather than the low.',
        '将本条与ERCOT对照，两个市场恰好相反。在德州，并网几乎免费，而margin被竞争消解；在此处，并网才是稀缺资源，合同化收入也因此得以存续。持有具备可交付性的排队位置的CAISO投资人，所持有的正是该市场真正短缺的资产 — 这也是为何加州开发阶段的进入价格应预期处于RTB溢价区间的高端而非低端。',
      ],
      source: 'CAISO interconnection queue; Modo Energy buildout analysis',
      sourceUrl: URL.summer,
    },

    {
      id: 'caiso-as-saturation',
      bearsOn: 'services',
      name: ['Ancillary saturation against a 15 GW fleet', '面对15GW机组规模的辅助服务饱和'],
      shape: 'zone',
      coord: [-121.50, 37.30],
      direction: 'both',
      intensity: 0.6,
      metrics: [
        { label: ['Ancillary share of the merchant benchmark', '辅助服务占市场化收入基准比重'],
          value: ['≈20%, estimated — no published decomposition', '约20%，估算值 — 无公开拆解数据'],
          period: ['CY2025', '2025日历年'] },
        { label: ['Fleet against a requirement that does not grow with it', '机组规模相对不随其增长的系统需求'],
          value: ['≈15 GW operating, batteries ≈46% of a ~500 GW queue', '在运约15GW，储能约占约500GW排队量的46%'],
          period: ['2026', '2026年'] },
      ],
      capture: {
        mechanism: CAPTURE.UNIT_COMMITMENT,
        text: [
          'Not a network constraint. Ancillary quantities follow system need and do not grow with the storage fleet, so every megawatt added competes for the same procurement — the same mechanism that has already run its course in ERCOT, where the ancillary share of battery revenue fell from 84% to 48% in two years.',
          '这并非电网约束。辅助服务采购量取决于系统需求，不随储能机组规模增长，因此每新增一兆瓦都在争夺同一采购量 — 这与ERCOT已经完整经历的机制相同，在那里辅助服务占储能收入的比重两年内由84%降至48%。',
        ],
      },
      relief: {
        project: ['None — the quantity is set by system need', '无 — 采购量由系统需求确定'],
        operator: 'CAISO',
        scope: ['No reform increases ancillary procurement to match a growing fleet; the requirement is a reliability quantity rather than a market-sizing one',
                '没有任何改革会为匹配增长中的机组规模而增加辅助服务采购；该需求是可靠性数量而非市场规模指标'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'The smallest leg on this dashboard and the one most confidently heading down, which is why it is carried by a services curve rather than a flat seed. It matters less here than in ERCOT for a simple reason: in Texas ancillary was 84% of battery revenue and its collapse took the market with it, while in California it is about a fifth of a merchant line that is itself about a quarter of total revenue.',
        '这是本看板最小的收入项，也是最确定处于下行的一项，因此由服务曲线而非固定种子值承载。它在此处的重要性低于ERCOT，原因很简单：在德州，辅助服务曾占储能收入的84%，其崩塌拖垮了整个市场；而在加州，它约占市场化收入的五分之一，而市场化收入本身仅约占总收入的四分之一。',
      ],
      source: 'Modo Energy CAISO merchant benchmark; CAISO ancillary procurement',
      sourceUrl: URL.storage,
    },
  ],
};

export default CAISO_CONGESTION;
