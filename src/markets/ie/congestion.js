/* ---------------------------------------------------------------------------
   Ireland (SEM) — congestion register.

   Ireland is the market where the congestion analysis most needs to be read
   carefully, because the headline number is large and the part of it a battery
   can address is small.

   Wind dispatch-down in the Republic was 11.3% of available energy in 2025.
   That splits into two things with different causes and different cures:

       constraints   6.6%   a network limit — a wire, locally binding
       curtailment   4.7%   a SYSTEM-WIDE limit, and not a wire at all

   And the curtailment half decomposes again: 83% of it is the minimum
   conventional generation requirement, with the SNSP ceiling responsible for
   only 17%. That is the sentence that decides the investment case. A minimum
   number of synchronous units must run for inertia, fault level and reserve, so
   when wind is abundant it is wind that gets turned down — and no amount of new
   transmission changes that. Relief is a rule change: synchronous condensers,
   grid-forming inverters and a higher permitted SNSP limit.

   The practical consequence is that an Irish battery buys cheap energy from
   curtailment but cannot relieve the constraint causing it unless it is
   providing the system services the minimum-generation rule exists to procure.
   Which is exactly the revenue line DS3 used to pay for and FASS is replacing —
   so Ireland's congestion case and its system-services case are the same case.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  report: 'https://cms.eirgrid.ie/taxonomy/term/27',
  operations: 'https://www.eirgrid.ie/grid/how-grid-works',
};

export const IE_CONGESTION = {
  marketId: 'ie',
  summary: [
    'The highest renewable dispatch-down rate in the set — 11.3% of available wind in 2025 — but 83% of the curtailment half is caused by a minimum conventional generation rule rather than by a network limit. Relief is a rule change and a system-services procurement, not a reinforcement.',
    '本样本中新能源压减比例最高 — 2025年可用风电的11.3% — 但其中限发部分的83%源于最低常规机组开机要求，而非网络限制。其缓解方式是规则变更与系统服务采购，而非电网增容。',
  ],
  gateNote: [
    'EirGrid publishes dispatch-down volumes and causes, not the revenue a battery earns from them. The register reports the system-level split; it does not model a share of it — gate G14.',
    'EirGrid公布压减电量及其成因，但不公布储能由此获得的收入。本登记表仅呈现系统层面的构成拆分，不对其份额建模 — 研究缺口G14。',
  ],

  zones: [
    {
      id: 'ie-min-generation',
      bearsOn: 'services',
      name: ['Minimum conventional generation', '最低常规机组开机要求'],
      shape: 'zone',
      coord: [-7.90, 53.20],
      direction: 'both',
      intensity: 0.9,
      metrics: [
        { label: ['Share of Republic curtailment', '占爱尔兰共和国限发比例'],
          value: ['83%', '83%'], period: ['2025', '2025年'] },
        { label: ['Wind dispatch-down, Republic', '爱尔兰共和国风电压减率'],
          value: ['11.3% of available energy', '占可用电量11.3%'], period: ['2025', '2025年'] },
      ],
      capture: {
        mechanism: CAPTURE.UNIT_COMMITMENT,
        text: [
          'A battery does not relieve this by being near it. The constraint exists because synchronous units must run for inertia, fault level and reserve; it is relieved by a battery that supplies those services, which is a system-services contract rather than an energy position.',
          '储能无法通过就近选址缓解该约束。该约束源于同步机组必须运行以提供惯量、短路容量及备用；只有提供这些服务的储能才能缓解它 — 这属于系统服务合同，而非电量头寸。',
        ],
      },
      relief: {
        project: ['FASS system services auctions and grid-forming procurement', 'FASS系统服务拍卖及构网型能力采购'],
        operator: 'EirGrid / SONI, SEM Committee',
        scope: ['Replaces the DS3 fixed tariff with competitive auctions; go-live date not set after the May 2027 target was withdrawn in June 2026 (DS3 long-stop 30 September 2027); the products are what would let fewer synchronous units run',
                '以竞争性拍卖取代DS3固定电价；2027年5月目标已于2026年6月撤回，上线日期未定（DS3最终截止2027年9月30日）；相关产品正是可减少同步机组开机数量的关键'],
        expected: 2027,
        status: RELIEF_STATUS.RULE_CHANGE,
      },
      investor: [
        'The one market where congestion and system services are the same trade, and where the platform\'s own services assumption is therefore doing double duty. If the FASS auctions clear low, both the services line AND the curtailment-arbitrage case weaken together — they are not independent risks, and a model that treats them as such double-counts the diversification.',
        '这是拥塞与系统服务属于同一笔交易的唯一市场，本平台的系统服务假设因而承担双重作用。若FASS拍卖出清价偏低，系统服务收入与限发套利逻辑将同时走弱 — 二者并非独立风险，将其视为独立风险的模型会高估分散化效果。',
      ],
      source: 'EirGrid Annual Renewable Energy Constraint and Curtailment Report',
      sourceUrl: URL.report,
    },

    {
      id: 'ie-snsp',
      bearsOn: 'merchGross',
      name: ['SNSP ceiling', '非同步电源渗透率上限'],
      shape: 'zone',
      coord: [-6.90, 52.60],
      direction: 'both',
      intensity: 0.45,
      metrics: [
        { label: ['Operational limit', '运行上限'],
          value: ['75% system non-synchronous penetration', '系统非同步电源渗透率75%'], period: ['current', '当前'] },
        { label: ['Share of Republic curtailment', '占爱尔兰共和国限发比例'],
          value: ['17%', '17%'], period: ['2025', '2025年'] },
      ],
      capture: {
        mechanism: CAPTURE.UNIT_COMMITMENT,
        text: [
          'Charging during a high-SNSP hour absorbs non-synchronous output and helps directly — but the ceiling causes only a sixth of curtailment, so sizing a case on the SNSP story overstates the addressable volume by roughly six times.',
          '在高渗透率时段充电可直接吸纳非同步出力 — 但该上限仅造成约六分之一的限发量，因此以渗透率论证投资规模，会将可获取电量高估约六倍。',
        ],
      },
      relief: {
        project: ['Progressive SNSP limit increases', '渗透率上限逐步提高'],
        operator: 'EirGrid / SONI',
        scope: ['Raised in steps as inertia, fault level and control capability are procured; no committed date for the next step',
                '随惯量、短路容量及控制能力采购到位而分步提高；下一档提升尚无确定日期'],
        expected: null,
        status: RELIEF_STATUS.RULE_CHANGE,
      },
      investor: [
        'A constraint with no committed relief date is not automatically a good thing to own: it is also a constraint nobody has committed to solving, which is a signal about how much the system values solving it. Read the absence of a date alongside the 17% share, not instead of it.',
        '没有确定缓解日期的约束未必是值得持有的资产：它同样意味着无人承诺解决该问题，这本身反映了系统对解决该问题的重视程度。缺少日期这一事实应与17%的占比一并解读，而非取而代之。',
      ],
      source: 'EirGrid system operations and curtailment reporting',
      sourceUrl: URL.operations,
    },

    {
      id: 'ie-network-constraints',
      bearsOn: 'merchGross',
      name: ['Local network constraints', '本地网络约束'],
      shape: 'zone',
      coord: [-9.05, 53.75],
      direction: 'export',
      intensity: 0.6,
      metrics: [
        { label: ['Constraint share of wind dispatch-down', '网络约束占风电压减比例'],
          value: ['6.6 of 11.3 percentage points', '11.3个百分点中的6.6个'], period: ['2025', '2025年'] },
      ],
      capture: {
        mechanism: CAPTURE.UNIT_COMMITMENT,
        text: [
          'This is the half a wire can fix, and the half that is genuinely locational — it binds on specific circuits in the west and north-west rather than system-wide. It is also the half whose location EirGrid does not publish at project granularity.',
          '这是电网工程可以解决的部分，也是真正具有区位属性的部分 — 它约束西部及西北部的特定线路，而非全系统。同时，EirGrid并未按项目粒度公布该部分的具体位置。',
        ],
      },
      relief: {
        project: ['EirGrid network development programme', 'EirGrid电网发展计划'],
        operator: 'EirGrid / ESB Networks',
        scope: ['Circuit-level reinforcement in the west and north-west; delivery is per-project rather than a single dated package',
                '西部及西北部的线路级增容；按项目逐一交付，而非单一带日期的工程包'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'Ask for the constraint group your node sits in and its dispatch-down history, not the national 6.6%. Both the requirement and the Irish distinctive — MEC for export and MIC for import must both be documented — are settled at the same connection agreement, so this diligence is already on the critical path.',
        '应索取所在节点对应的约束组及其历史压减数据，而非套用全国6.6%的平均值。该要求与爱尔兰特有的规定 — 送出MEC与受入MIC须在同一协议中同时载明 — 在同一份并网协议中确定，因此该尽调本就位于关键路径上。',
      ],
      source: 'EirGrid Annual Renewable Energy Constraint and Curtailment Report',
      sourceUrl: URL.report,
    },
  ],
};

export default IE_CONGESTION;
