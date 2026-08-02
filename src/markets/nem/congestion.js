/* ---------------------------------------------------------------------------
   National Electricity Market — congestion register.

   The NEM is the market that forced this register to grow a third answer to the
   question "how is a battery paid for congestion?"

   IT IS NOT. Generators and storage in the NEM hold NO FIRM TRANSMISSION RIGHTS.
   A unit constrained off receives nothing — access can change whenever new
   generation, storage or network conditions do, and there is no compensation for
   losing it. The mechanism that would have changed this, the AEMC's Congestion
   Relief Market, was recommended NOT to proceed, and energy ministers noted that
   recommendation at the December 2025 ECMC. The AEMC's own finding is that a
   battery relieving a constraint "may be under-compensated for the role it plays
   in alleviating congestion by being settled at the regional reference price".

   So every other market on this platform pays somebody, or charges somebody. The
   NEM does neither, and the register says so rather than forcing it into a
   category that implies otherwise.

   WHAT DOES REACH THE BATTERY is a permanent settlement haircut. Marginal loss
   factors scale every megawatt-hour at the connection point: an asset with an MLF
   of 0.90 receives ninety cents for every dollar earned at the regional reference
   node, compounding over the life of the project and reset annually on 1 April.
   That is a charge, continuously applied, rather than an event.

   The relief here is the most concrete on the platform — AEMO's Integrated System
   Plan names the projects, their capacities and their commissioning years — and
   one of them has already landed: Project EnergyConnect was fully energised in
   June 2026, which is why this register carries a constraint whose relief status
   is OPERATIONAL rather than a promise.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  isp: 'https://www.aemo.com.au/energy-systems/major-publications/integrated-system-plan-isp',
  mlf: 'https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/data-nem/network-data/marginal-loss-factors',
  humelink: 'https://www.transgrid.com.au/projects-innovation/humelink',
  cwo: 'https://www.energyco.nsw.gov.au/our-projects/central-west-orana-renewable-energy-zone/transmission-project',
  aemc: 'https://www.aemc.gov.au/market-reviews-advice/transmission-access-reform',
};

export const NEM_CONGESTION = {
  marketId: 'nem',
  summary: [
    'The only market in the set where nobody is paid for congestion at all: NEM generators and storage hold no firm transmission rights, a constrained unit receives no compensation, and the Congestion Relief Market that would have changed that was recommended not to proceed. What does reach the battery is a marginal loss factor — a permanent settlement haircut, reset every 1 April.',
    '本样本中唯一完全无人因拥塞获得补偿的市场：NEM的发电与储能不持有固定输电权，受约束机组得不到任何补偿，而本可改变这一状况的拥塞缓解市场已被建议不予推行。真正传导至储能的是边际损耗系数 — 一项每年4月1日重置的永久性结算折扣。',
  ],
  gateNote: [
    'AEMO publishes marginal loss factors and the ISP project list; neither it nor the AER publishes what congestion costs or earns a battery. Fleet-wide network curtailment is reported in MWh by third parties, but not against a published fleet discharge total — gate G14.',
    'AEMO公布边际损耗系数及ISP项目清单，但AEMO与AER均不公布拥塞给储能带来的成本或收益。全行业网络限电量由第三方以MWh报告，但缺少公开的行业放电总量作为分母 — 研究缺口G14。',
  ],

  zones: [
    {
      id: 'nem-mlf-haircut',
      bearsOn: 'naqFactor',
      name: ['Marginal loss factors', '边际损耗系数'],
      shape: 'zone',
      coord: [148.90, -33.60],
      direction: 'both',
      intensity: 1.0,
      metrics: [
        { label: ['Average MLF cost to NEM batteries', 'NEM储能平均MLF成本'],
          value: ['A$3.2k/MW/yr, with some assets 5–10× higher', '每MW每年A$3,200，部分资产高出5–10倍'],
          period: ['2024', '2024年'] },
        { label: ['Reset cadence', '重置周期'],
          value: ['Published by AEMO every 1 April for the coming financial year',
                  'AEMO于每年4月1日公布下一财年数值'],
          period: ['annual', '每年'] },
      ],
      capture: {
        mechanism: CAPTURE.LOSS_FACTOR,
        text: [
          'Not an event but a multiplier: settlement scales every megawatt-hour by the connection point\'s loss factor, so an MLF of 0.90 means ninety cents on the dollar for the life of the asset. It is a charge rather than a payment, it compounds, and because AEMO republishes it annually it is a live revenue risk rather than a fixed discount agreed at financial close.',
          '这并非事件，而是一个乘数：结算时每一兆瓦时都会按并网点的损耗系数缩放，因此0.90的MLF意味着在资产整个寿命期内每一元只能收到九角。它是费用而非收入，会持续累积，且由于AEMO每年重新公布，它属于动态收入风险，而非在融资交割时锁定的固定折扣。',
        ],
      },
      relief: {
        project: ['None — MLFs are structural', '无 — MLF属结构性因素'],
        operator: 'AEMO',
        scope: ['Loss factors follow network topology and flow patterns; new transmission changes them but does not remove them, and can move an individual asset either way',
                '损耗系数取决于电网拓扑与潮流分布；新建输电工程会改变但不会消除它，且对单个资产可能产生正向或负向影响'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'Diligence the connection point\'s MLF history, not the region\'s average, and model it as a variable rather than a constant. Batteries fare better than solar or wind because they site near load — the battery median sits much closer to 1.0 — but AEMO\'s draft 2026-27 factors show several NSW and Queensland assets facing meaningful declines. Modo separately finds that location alone moves IRRs by up to 1.8 percentage points across otherwise identical assets.',
        '应尽调并网点的MLF历史数据而非区域平均值，并将其作为变量而非常数建模。储能表现优于光伏和风电，因其选址靠近负荷 — 储能中位数更接近1.0 — 但AEMO 2026–27年度初稿显示，新南威尔士与昆士兰的多个资产面临明显下滑。Modo另发现，仅选址一项就可使其他条件相同资产的内部收益率相差最多1.8个百分点。',
      ],
      source: 'AEMO Marginal Loss Factors; Modo Energy NEM MLF analysis',
      sourceUrl: URL.mlf,
    },

    {
      id: 'nem-network-curtailment',
      bearsOn: 'naqFactor',
      name: ['Uncompensated network curtailment', '无补偿网络限电'],
      shape: 'zone',
      coord: [149.35, -32.15],
      direction: 'export',
      intensity: 0.9,
      metrics: [
        { label: ['Network curtailment within the battery fleet', '储能行业内网络限电量'],
          value: ['≈90,929 MWh', '约90,929MWh'], period: ['2025', '2025年'] },
        { label: ['Compensation for being constrained off', '受约束停机的补偿'],
          value: ['None — no firm access rights exist', '无 — 不存在固定接入权'],
          period: ['current', '当前'] },
      ],
      capture: {
        mechanism: CAPTURE.UNCOMPENSATED,
        text: [
          'Nobody pays for this. The AEMC\'s Congestion Relief Market, which would have paid resources for relieving congestion, was recommended not to proceed and ministers noted that at the December 2025 ECMC. Compensation exists only where AEMO directs a unit — for instance to hold a state of charge for system security — not where it is simply constrained off. The only monetisation is indirect: charging into the negative and suppressed prices the constraint creates.',
          '无人为此付费。AEMC提出的拥塞缓解市场本可为缓解拥塞的资源付费，但已被建议不予推行，能源部长会议于2025年12月予以采纳。仅在AEMO直接调度机组时才存在补偿 — 例如要求为系统安全维持特定荷电状态 — 单纯受约束停机则无补偿。唯一的变现途径是间接的：在该约束所形成的负价与低价时段充电。',
        ],
      },
      relief: {
        project: ['Central-West Orana REZ Transmission Project', '中西部奥拉纳可再生能源区输电工程'],
        operator: 'EnergyCo NSW, delivered by ACEREZ',
        scope: ['90 km of 500 kV plus 150 km of 330 kV, Elong Elong to Barigan Creek via Merotherie; at least 4.5 GW of new network capacity to connect 7.7 GW of wind and solar',
                '90公里500千伏线路及150公里330千伏线路，自Elong Elong经Merotherie至Barigan Creek；新增至少4.5GW网络容量，用于接入7.7GW风电与光伏'],
        expected: 2028,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'Curtailment concentrates in western New South Wales and north-west Victoria, where large volumes of new generation connect to networks designed to serve local demand rather than export at scale. Utility-scale renewable curtailment across the NEM passed 7 TWh in 2025, up more than 60% year on year. For a battery this cuts both ways and the register cannot net it: the same congestion that curtails your export creates the cheap charging your merchant case depends on.',
        '限电集中于新南威尔士西部与维多利亚西北部，这些地区大量新增发电接入的电网原本是为服务本地负荷而非大规模外送而设计的。2025年全NEM公用事业级可再生能源限电量突破7TWh，同比增长超过60%。对储能而言这具有双向影响，本登记表无法将其净额化：限制你送出的同一拥塞，也创造了市场化投资逻辑所依赖的低价充电机会。',
      ],
      source: 'WattClarity 2025 NEM battery fleet review; EnergyCo NSW Central-West Orana REZ',
      sourceUrl: URL.cwo,
    },

    {
      id: 'nem-southern-nsw',
      bearsOn: 'merchGross',
      name: ['Southern NSW — Snowy to load', '新南威尔士南部 — 雪山至负荷中心'],
      shape: 'interface',
      coords: [[147.37, -35.12], [148.60, -34.60], [149.95, -34.10]],
      direction: 'export',
      intensity: 0.8,
      metrics: [
        { label: ['Dispatchable capacity behind the constraint', '受约束的可调度容量'],
          value: ['2,200 MW of Snowy 2.0, within 3 GW of renewables to be unlocked',
                  '雪山2.0的2,200MW，属待释放的3GW可再生能源之内'],
          period: ['2026', '2026年'] },
        { label: ['NSW battery revenue change', '新南威尔士储能收入变化'],
          value: ['−51%', '−51%'], period: ['Oct 2025 – Mar 2026', '2025年10月–2026年3月'] },
      ],
      capture: {
        mechanism: CAPTURE.UNCOMPENSATED,
        text: [
          'The junction of three interconnector-scale flows — Project EnergyConnect from South Australia, HumeLink from the Snowy scheme, and VNI West from Victoria. A battery here is exposed to all three commissioning schedules at once, and is compensated for none of the constraint they collectively relieve.',
          '这里是三条互联规模潮流的交汇点 — 来自南澳的Project EnergyConnect、来自雪山工程的HumeLink，以及来自维多利亚的VNI West。此处的储能同时暴露于三项工程的投运进度之下，而对它们共同缓解的约束却得不到任何补偿。',
        ],
      },
      relief: {
        project: ['HumeLink', 'HumeLink输电工程'],
        operator: 'Transgrid',
        scope: ['365 km of 500 kV double-circuit line, Wagga Wagga – Bannaby – Maragle, unlocking 3 GW of renewables including 2,200 MW of Snowy 2.0',
                '365公里500千伏双回路线路，自Wagga Wagga经Bannaby至Maragle，释放3GW可再生能源，其中包括雪山2.0的2,200MW'],
        expected: 2027,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'The shortest relief runway on this register and the one most likely to hold, because construction is under way and the partners are contracted. Read it as a warning rather than an opportunity: a battery underwritten on southern NSW congestion has roughly one year of it at full width, and behind the relief sits 2,200 MW of pumped hydro that competes directly for the same arbitrage.',
        '这是本登记表中缓解期最短、也最可能如期实现的项目，因为工程已开工且合作方均已签约。应将其视为警示而非机会：以新南威尔士南部拥塞为承销依据的储能，大约仅有一年时间可享受完整的约束宽度，而缓解之后还有2,200MW抽水蓄能直接争夺同一套利空间。',
      ],
      source: 'Transgrid HumeLink; Modo Energy NEM BESS six-month revenue review',
      sourceUrl: URL.humelink,
    },

    {
      id: 'nem-sa-interconnection',
      bearsOn: 'merchGross',
      name: ['South Australia export — relieved 2026', '南澳送出 — 已于2026年缓解'],
      shape: 'zone',
      coord: [138.49, -33.85],
      direction: 'export',
      intensity: 0.7,
      metrics: [
        { label: ['SA utility-scale solar curtailed', '南澳公用事业级光伏限电比例'],
          value: ['38% — the most in the NEM', '38% — NEM中最高'], period: ['2025', '2025年'] },
        { label: ['SA intervals at negative prices', '南澳负电价时段占比'],
          value: ['48.4%', '48.4%'], period: ['Q4 2025', '2025年第四季度'] },
      ],
      capture: {
        mechanism: CAPTURE.UNCOMPENSATED,
        text: [
          'The clearest illustration on this platform of what relief does to a congestion thesis. South Australia was the most curtailed region in the NEM through 2025; Project EnergyConnect was fully energised in June 2026, adding 800 MW of transfer capability and linking three state grids for the first time.',
          '这是本平台上关于“缓解如何终结拥塞投资逻辑”最清晰的例证。南澳在2025年全年是NEM中限电最严重的区域；Project EnergyConnect已于2026年6月全面送电，新增800MW输送能力，首次实现三个州电网互联。',
        ],
      },
      relief: {
        project: ['Project EnergyConnect', 'Project EnergyConnect互联工程'],
        operator: 'ElectraNet (SA) / Transgrid (NSW)',
        scope: ['900 km interconnector, Robertstown SA to Wagga Wagga NSW with a spur to Red Cliffs VIC, adding 800 MW of transfer capability',
                '900公里互联线路，自南澳Robertstown至新南威尔士Wagga Wagga，并延伸至维多利亚Red Cliffs，新增800MW输送能力'],
        expected: 2026,
        status: RELIEF_STATUS.OPERATIONAL,
      },
      investor: [
        'This row is here precisely because its relief has already landed. A congestion case written on South Australian export constraints in 2024 was correct and is now substantially spent — the constraint was real, the relief was named and funded, and it arrived on schedule in June 2026. It is the empirical answer to whether these commissioning dates should be believed, and it argues that they should.',
        '本行之所以列出，正是因为其缓解措施已经落地。2024年以南澳送出约束为依据撰写的拥塞投资逻辑当时是正确的，如今已大体兑现 — 约束真实存在，缓解工程具名且已获资金，并如期于2026年6月投运。这为“这些投运日期是否可信”提供了实证答案，且答案是肯定的。',
      ],
      source: 'ElectraNet / Transgrid Project EnergyConnect; WattClarity 2025 curtailment review',
      sourceUrl: URL.isp,
    },
  ],
};

export default NEM_CONGESTION;
