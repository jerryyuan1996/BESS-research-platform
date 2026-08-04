/* ---------------------------------------------------------------------------
   ERCOT — congestion register.

   ERCOT gives the register's central question — "how is a battery paid for
   congestion?" — the bluntest answer on the platform, and it is two answers at
   once.

   For being CONSTRAINED OFF: nothing. ERCOT has no firm transmission rights for
   generation and no compensation for curtailment. A resource behind a binding
   constraint is settled at its own node and that is the end of it. This is the
   NEM's answer, and the vocabulary already has a word for it.

   For TRADING the constraint: everything, and through two instruments rather
   than one. Nodal settlement puts the congestion component directly into the
   energy price at the resource node, and Congestion Revenue Rights are auctioned
   separately so the basis between two points can be hedged as a financial
   position. That second instrument is what ERCOT has and the NEM does not, and
   it is the reason a west Texas node is an investable proposition rather than
   merely a risky one.

   What this register does NOT carry is a relief pipeline in the sense every
   other market on this platform has one. Germany names four HVDC corridors with
   approval decisions; the NEM names Project EnergyConnect and its energisation
   month; PJM offers process reforms. ERCOT's answer to congestion is that the
   price already reflects it and the market may hedge it — so the relief entries
   below are load-side and market-design items, and the register says so rather
   than manufacturing a corridor list.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  queue: 'https://www.ercot.com/gridinfo/resource',
  rtcb: 'https://www.ercot.com/news/release/12052025-ercot-goes-live',
  ancillary: 'https://www.ercot.com/gridmktinfo/dashboards/ancillaryservices',
  markets: 'https://www.ercot.com/mktinfo',
};

export const ERCOT_CONGESTION = {
  marketId: 'ercot',
  summary: [
    'Two answers at once. A resource constrained off receives nothing — ERCOT generation holds no firm transmission rights and there is no curtailment compensation, which is the NEM\'s position. But the constraint itself is fully priced: nodal settlement puts the congestion component into the energy price at the resource node, and Congestion Revenue Rights are auctioned separately so basis can be hedged as a financial position. ERCOT is the only market on this platform where congestion is both uncompensated and tradeable.',
    '同时存在两个答案。受约束停机的资源得不到任何补偿 — ERCOT的发电侧不持有固定输电权，也不存在限电补偿，这与NEM的情况相同。但约束本身被完整定价：节点结算将拥塞分项计入资源节点的电能量价格，且拥塞收入权单独拍卖，使基差可作为金融头寸对冲。ERCOT是本平台唯一一个拥塞既无补偿、又可交易的市场。',
  ],
  gateNote: [
    'ERCOT publishes nodal prices, their congestion components and CRR auction results in full. What it does not publish is what congestion earns or costs a battery: no source decomposes an ERCOT battery\'s revenue into a congestion component, and the revenue index itself is a single fleet average with no nodal or duration breakdown. Gate G30.',
    'ERCOT完整公布节点价格、其拥塞分项及拥塞收入权拍卖结果。但它不公布拥塞给储能带来的收益或成本：无任何来源将ERCOT储能的收入拆解出拥塞分项，且收入指数本身为单一机组均值，无节点或时长拆分。研究缺口G30。',
  ],

  zones: [
    {
      id: 'ercot-west',
      bearsOn: 'merchGross',
      name: ['West Texas — the Permian and the wind belt', '西德州 — 二叠盆地与风电带'],
      shape: 'zone',
      coord: [-102.20, 31.90],
      direction: 'export',
      intensity: 1.0,
      metrics: [
        { label: ['Character of the constraint', '约束性质'],
          value: ['Wind and solar output far from load, against oilfield electrification demand',
                  '风光出力远离负荷，同时面对油田电气化需求'],
          period: ['current', '当前'] },
        { label: ['Compensation for being constrained off', '受约束停机的补偿'],
          value: ['None — no firm transmission rights exist', '无 — 不存在固定输电权'],
          period: ['current', '当前'] },
      ],
      capture: {
        mechanism: CAPTURE.ZONAL_PRICE,
        text: [
          'Paid through the nodal price and hedgeable through Congestion Revenue Rights, but never compensated. A battery west of a binding constraint charges into depressed and negative prices and discharges into them too — so the constraint is the opportunity and the risk in the same instrument. What ERCOT adds over the NEM is that the basis between the resource node and the hub can be bought or sold as a financial position, which converts an uncompensated exposure into a managed one.',
          '通过节点价格获得，并可通过拥塞收入权对冲，但从不获得补偿。位于约束送出侧的储能，既在受抑制乃至负值的价格下充电，也在同样的价格下放电 — 因此约束在同一工具中既是机会也是风险。ERCOT相较NEM的额外之处在于：资源节点与枢纽之间的基差可作为金融头寸买卖，从而将无补偿的敞口转化为可管理的敞口。',
        ],
      },
      relief: {
        project: ['None named — ERCOT prices congestion rather than scheduling relief for it', '无具名工程 — ERCOT对拥塞进行定价，而非为其安排缓解工程'],
        operator: 'ERCOT',
        scope: ['Transmission is planned and socialised rather than allocated to interconnecting generation, so there is no corridor list with commissioning dates of the kind the German or NEM registers carry',
                '输电投资采取规划并由全体分摊的方式，而非分摊给并网发电方，因此不存在德国或NEM登记表中那种附带投运日期的走廊工程清单'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'Diligence the resource node and its basis history, not the load zone. The West zone contains both the widest spreads in ERCOT and the deepest negative pricing, and a fleet-average index of about $29,400/MW/yr for 2025 describes neither. Price the CRR position alongside the asset: a west Texas node without a basis hedge is a different investment from the same node with one, and it is the only market on this platform where that choice exists.',
        '应尽调资源节点及其基差历史，而非负荷区。西部区域既有ERCOT最宽的价差，也有最深的负电价，而2025年约每MW每年$29,400的机组平均指数无法反映其中任何一者。应将拥塞收入权头寸与资产一并定价：无基差对冲的西德州节点，与有对冲的同一节点属于不同投资 — 这也是本平台唯一存在该选择的市场。',
      ],
      source: 'ERCOT nodal market information; Modo Energy ERCOT buildout report',
      sourceUrl: URL.markets,
    },

    {
      id: 'ercot-houston-import',
      bearsOn: 'merchGross',
      name: ['Houston — a coastal import-constrained load pocket', '休斯顿 — 沿海受入受限负荷孤岛'],
      shape: 'zone',
      coord: [-95.37, 29.76],
      direction: 'import',
      intensity: 0.7,
      metrics: [
        { label: ['Character of the constraint', '约束性质'],
          value: ['Dense industrial and urban load behind an import constraint',
                  '受入约束之后的密集工业与城市负荷'],
          period: ['current', '当前'] },
        { label: ['Battery siting', '储能选址'],
          value: ['The largest concentration of ERCOT battery capacity sits around it',
                  'ERCOT储能装机最集中的区域即环绕于此'],
          period: ['current', '当前'] },
      ],
      capture: {
        mechanism: CAPTURE.ZONAL_PRICE,
        text: [
          'The same nodal mechanism running the other way, and it is in the register to prevent the misreading EMAAC exists to prevent in PJM. An import constraint lifts the price LEVEL inside the pocket without necessarily widening the daily SPREAD, and a battery earns the spread rather than the level. Houston is a good battery location for reasons of load and gas-plant retirement, not automatically because it is constrained.',
          '同一节点机制的反向运行，列入本登记表是为防止与PJM中EMAAC所要防止的相同误读。受入约束抬高的是孤岛内部的价格水平，未必拉大日内价差，而储能赚取的是价差而非价格水平。休斯顿之所以是良好的储能选址，原因在于负荷与燃气机组退役，而非仅仅因为它受到约束。',
        ],
      },
      relief: {
        project: ['None named', '无具名工程'],
        operator: 'ERCOT',
        scope: ['Import constraints into the Houston zone are addressed through the planning process rather than through a named corridor with a commissioning date',
                '进入休斯顿区域的受入约束通过规划流程解决，而非通过附带投运日期的具名走廊工程'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'Screen on realised nodal spread history rather than on whether the zone is constrained. This is the same warning the PJM register attaches to EMAAC, and it matters more here because ERCOT has no capacity payment to fall back on if the spread thesis is wrong — in PJM a badly-sited asset still earns the RTO capacity price, and in ERCOT it earns nothing at all.',
        '应按实际节点价差历史筛选，而非按该区域是否受约束筛选。这与PJM登记表对EMAAC所附的警示相同，且在此处更为重要，因为若价差逻辑判断失误，ERCOT没有容量收入可作退路 — 在PJM，选址不当的资产仍可获得全RTO容量收入，而在ERCOT则一无所获。',
      ],
      source: 'ERCOT nodal market information',
      sourceUrl: URL.markets,
    },

    {
      id: 'ercot-large-load',
      bearsOn: 'merchGross',
      name: ['The large-load queue — 238.6 GW, mostly data centres', '大负荷排队 — 238.6GW，多为数据中心'],
      shape: 'zone',
      coord: [-97.00, 32.90],
      direction: 'import',
      intensity: 0.9,
      metrics: [
        { label: ['Large-load interconnection queue', '大负荷并网排队'],
          value: ['≈238.6 GW, 77.5% data centres', '约238.6GW，其中77.5%为数据中心'],
          period: ['March 2026', '2026年3月'] },
        { label: ['Applications in one quarter', '单季度申请量'],
          value: ['198 GW in Q1 2026 alone; 86 GW under review', '仅2026年第一季度即达198GW；86GW在审'],
          period: ['Q1 2026', '2026年第一季度'] },
      ],
      capture: {
        mechanism: CAPTURE.UNCOMPENSATED,
        text: [
          'Not a constraint yet, and entered in the register because it is the only credible path back to the spreads that made ERCOT attractive. A queue is not a commitment: how much of this load connects, how quickly, and on what curtailment terms are all being decided now, and none of it is settled. Nobody pays a battery for waiting to find out.',
          '目前尚不构成约束，之所以列入登记表，是因为它是回到当初使ERCOT具有吸引力的价差水平的唯一可信路径。排队并非承诺：这些负荷最终有多少接入、速度如何、在何种限电条件下接入，均在决策之中，且尚无定论。而在等待结果的过程中，无人为储能付费。',
        ],
      },
      relief: {
        project: ['Large-load interconnection rulemaking', '大负荷并网规则制定'],
        operator: 'ERCOT / Public Utility Commission of Texas',
        scope: ['Rules governing how quickly very large loads may connect and on what flexibility obligations. The scale involved is larger than ERCOT\'s entire generation fleet',
                '规范超大型负荷接入速度及其灵活性义务的规则。所涉规模大于ERCOT全部发电机组总量'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'This row is the whole bull case and it has no date on it. An ERCOT battery underwritten on spread recovery is underwritten on this queue converting, and the queue is about seventeen times the size of the operating battery fleet it would be paying. Treat any case that assumes the load arrives on a schedule as unsupported — the rules governing the schedule had not been written at the seed date.',
        '本行是全部看多逻辑之所在，却没有任何时间表。以价差回升为承销依据的ERCOT储能，实质上是以该排队量的兑现为依据 — 而该排队规模约为其所服务的在运储能机组的十七倍。任何假设负荷将按时间表到位的方案都应视为缺乏支撑 — 截至种子日期，规范该时间表的规则尚未出台。',
      ],
      source: 'ERCOT large-load interconnection queue, March 2026',
      sourceUrl: URL.queue,
    },

    {
      id: 'ercot-as-saturation',
      bearsOn: 'services',
      name: ['Ancillary saturation — a fixed quantity, a tripling fleet', '辅助服务饱和 — 固定采购量，三倍装机'],
      shape: 'zone',
      coord: [-99.50, 30.50],
      direction: 'both',
      intensity: 0.85,
      metrics: [
        { label: ['Ancillary share of battery revenue', '辅助服务占储能收入比重'],
          value: ['84% (2023) → 48% (2025)', '84%（2023）→ 48%（2025）'], period: ['2023–2025', '2023–2025年'] },
        { label: ['Ancillary revenue change since 2023', '辅助服务收入自2023年以来的变化'],
          value: ['≈−90%', '约−90%'], period: ['2023–2025', '2023–2025年'] },
        { label: ['Duration requirements after RTC+B', 'RTC+B后的时长要求'],
          value: ['ECRS 2h→1h; RRS and Regulation 1h→30min; Non-Spin unchanged at 4h',
                  'ECRS由2小时降至1小时；RRS与调频由1小时降至30分钟；非旋转备用维持4小时'],
          period: ['from 5 Dec 2025', '自2025年12月5日起'] },
      ],
      capture: {
        mechanism: CAPTURE.UNIT_COMMITMENT,
        text: [
          'Not a network constraint at all, and in the register because it constrains revenue harder than any wire in Texas does. The binding quantity is an operational rule — ERCOT buys what system need requires and no more — so relief here would be a rule change rather than a reinforcement. RTC+B was that rule change and it went the other way: shortening the duration requirements widened the pool of resources allowed to sell into a quantity that did not grow.',
          '这根本不是电网约束，列入本登记表是因为它对收入的约束强于德州任何一条输电线。起约束作用的采购量是一项运行规则 — ERCOT仅按系统需求采购，绝不超量 — 因此此处的缓解将是规则变更而非电网增容。RTC+B正是这样一次规则变更，但其作用方向相反：缩短时长要求扩大了可参与销售的资源范围，而采购量并未增长。',
        ],
      },
      relief: {
        project: ['RTC+B and the 2026 Ancillary Service Methodology', 'RTC+B与2026年辅助服务需求方法'],
        operator: 'ERCOT',
        scope: ['Energy and ancillary services clear together in real time from 5 December 2025; the 2026 methodology sets ECRS and Non-Spin quantities probabilistically, with RRS primary frequency response no lower than 1,377 MW',
                '自2025年12月5日起电能量与辅助服务在实时市场同时出清；2026年方法以概率方式确定ECRS与非旋转备用采购量，RRS一次调频响应不低于1,377MW'],
        expected: 2026,
        status: RELIEF_STATUS.OPERATIONAL,
      },
      investor: [
        'The only entry on this register whose relief has already landed, and it made the revenue position worse rather than better. Read it as the clearest available warning about ancillary revenue in any market: the quantity is set by system need and does not respond to how much storage exists, so every megawatt added competes for the same pot. Germany is forecasting this decline; ERCOT has completed most of it.',
        '这是本登记表中唯一缓解措施已经落地的条目，而它使收入状况变差而非变好。应将其视为关于任何市场辅助服务收入最明确的警示：采购量由系统需求确定，不随储能规模变化，因此每新增一兆瓦都在争夺同一收入池。德国仍在预测这一下滑；ERCOT已基本完成。',
      ],
      source: 'ERCOT RTC+B go-live; ERCOT 2026 Ancillary Service Methodology; Modo Energy',
      sourceUrl: URL.rtcb,
    },
  ],
};

export default ERCOT_CONGESTION;
