/* ---------------------------------------------------------------------------
   Romania — congestion register.

   Romania is the market where congestion is charged rather than paid, and that
   inverts the whole analysis.

   From the beginning of 2026, production, consumption and storage facilities of
   5 MW and above can obtain grid access ONLY through auction. Transelectrica
   publishes the available capacity for each zone by 15 January each year and
   sets the starting price from the cost of the grid development that capacity
   requires. So congestion in Romania does not appear as a constraint payment or
   a depressed price a battery can charge into. It appears as a competitive
   entry cost, paid once, before the project exists.

   Three consequences follow, and all three are unusual enough to be worth
   stating plainly:

     1. THE CONGESTION SIGNAL IS PUBLIC AND DATED. A zone's available capacity
        and reserve price are published annually. That is a better locational
        signal than Great Britain has, in the market with the weakest revenue
        contracting on this platform.

     2. THE COST IS CAPITALISED, NOT OPERATIONAL. It lands in capex, which is
        the input the Investment Lab bounds most tightly — and Romania's capex
        band does not currently carry it.

     3. WINNING IS NOT A REVENUE. An auction clears a queue; it does not create
        headroom. The grid works the reserve price is calculated from still have
        to be built.

   Transelectrica separately estimates that integrating the planned renewable
   build needs 10-20 GWh of storage by 2030, against roughly 2 GWh installed
   (989 MW / 1,975 MWh at 1 August 2026, Transelectrica; ~1 GWh in April) —
   which is the demand-side argument for the same congestion.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  transelectrica: 'https://www.transelectrica.ro/en/web/tel/home',
  anre: 'https://www.anre.ro/',
};

export const RO_CONGESTION = {
  marketId: 'ro',
  summary: [
    'The only market in the set where congestion is charged to the developer rather than paid to the operator: from 2026 all connections of 5 MW and above are allocated by auction, with zonal available capacity published by 15 January and a reserve price set from the cost of the required grid works.',
    '本样本中唯一由开发商承担而非向运营商支付拥塞成本的市场：自2026年起，5MW及以上的并网容量一律通过拍卖分配，各区域可用容量须于每年1月15日前公布，起拍价按所需电网工程成本确定。',
  ],
  gateNote: [
    'The auction is new for 2026 and no clearing prices have been published. The register reports the mechanism and the published timetable, not an expected clearing level — gate G14.',
    '该拍卖机制自2026年起实施，尚无出清价格公布。本登记表仅呈现机制及已公布的时间表，不预测出清水平 — 研究缺口G14。',
  ],

  zones: [
    {
      id: 'ro-dobrogea',
      bearsOn: 'capexPerMW',
      name: ['Dobrogea / Constanța export constraint', '多布罗加 / 康斯坦察送出约束'],
      shape: 'zone',
      coord: [28.55, 44.35],
      direction: 'export',
      intensity: 0.95,
      metrics: [
        { label: ['Role', '区域定位'],
          value: ['Romania\'s main wind hub and the densest storage pipeline', '罗马尼亚主要风电枢纽，储能管线最密集'],
          period: ['2026', '2026年'] },
        { label: ['Network position', '电网状态'],
          value: ['Existing lines and substations cannot carry additional flows', '现有线路及变电站已无法承载新增潮流'],
          period: ['2026', '2026年'] },
      ],
      capture: {
        mechanism: CAPTURE.ACCESS_AUCTION,
        text: [
          'Congestion here is competed for at the connection auction, not earned in dispatch. Winning capacity in a congested zone costs more precisely because the zone is congested — the developer pays the congestion, and then owns an asset in a zone where spreads are wide.',
          '此处的拥塞在并网拍卖阶段被竞价，而非在调度中获取。正因区域拥塞，在该区域中标容量的成本更高 — 开发商先支付拥塞成本，之后持有一项位于价差较宽区域的资产。',
        ],
      },
      relief: {
        project: ['Transelectrica grid development for the south-east', 'Transelectrica东南部电网发展工程'],
        operator: 'Transelectrica',
        scope: ['The reserve price of each zonal auction is set from the cost of the grid development that zone requires, so the works are named in the auction rather than in a separate plan',
                '各区域拍卖的起拍价按该区域所需电网工程成本确定，因此相关工程在拍卖文件中列明，而非另行规划'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'Take the auction result as the market\'s own price for this congestion — it is the only market on the platform that produces one. Two diligence items follow: the reserve price is a floor rather than a cost estimate, and winning the auction transfers a queue position, not headroom. Ask for the works programme behind the reserve price before treating a win as a connection.',
        '应将拍卖结果视为市场对该拥塞的自身定价 — 这是本平台唯一能产生该价格的市场。由此产生两项尽调要点：起拍价是价格下限而非成本估算；中标转移的是队列位置，而非可用容量。在将中标视同并网之前，应索取起拍价背后的工程计划。',
      ],
      source: 'Transelectrica grid capacity allocation rules for 2026',
      sourceUrl: URL.transelectrica,
    },

    {
      id: 'ro-storage-requirement',
      /* No bearsOn. The 10-20 GWh requirement is the system's demand for storage,
         not a congestion value already sitting inside one of this market's priced
         assumptions — and the mechanism charges rather than pays, so warning that
         a services line 'is relieved' would be exactly backwards. */
      name: ['System storage requirement', '系统储能需求'],
      shape: 'zone',
      coord: [25.20, 45.30],
      direction: 'both',
      intensity: 0.7,
      metrics: [
        { label: ['Storage needed to integrate planned renewables', '整合规划新能源所需储能'],
          value: ['10–20 GWh by 2030', '2030年前10–20GWh'], period: ['Transelectrica estimate', 'Transelectrica估算'] },
        { label: ['Installed today', '当前已装机'],
          value: ['≈2 GWh (989 MW / 1,975 MWh)', '约2GWh（989MW／1,975MWh）'], period: ['1 August 2026', '2026年8月1日'] },
      ],
      capture: {
        mechanism: CAPTURE.ACCESS_AUCTION,
        text: [
          'A ten- to twenty-fold gap between what the operator says the system needs and what exists. That is the demand-side case for Romanian storage, and it is the operator\'s own number rather than a developer\'s.',
          '运营商所述系统需求与现有装机之间存在十至二十倍的缺口。这构成罗马尼亚储能的需求侧论据，且该数字来自运营商本身而非开发商。',
        ],
      },
      relief: {
        project: ['Storage build-out itself', '储能建设本身'],
        operator: 'Market',
        scope: ['The requirement is met by the assets being invested in, so the constraint closes as the opportunity is taken — the relief is the competition',
                '该需求由所投资的资产本身满足，因此约束随机会被把握而收敛 — 缓解方式即为竞争'],
        expected: 2030,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'Read this one against Romania\'s own services curve rather than as standalone upside. The platform already decays the ancillary leg to roughly a third by year five on a >9 GW pipeline; a 10–20 GWh storage requirement is the same buildout seen from the system\'s side. The requirement and the saturation are one forecast, not two, and only the saturation is currently priced.',
        '应将该数据与罗马尼亚自身的系统服务衰减曲线对照阅读，而非视为独立的上行空间。本平台已基于超过9GW的管线，将辅助服务收入在第五年衰减至约三分之一；10–20GWh的储能需求正是同一建设浪潮的系统侧视角。需求与饱和属同一预测的两面，而当前仅对饱和进行了定价。',
      ],
      source: 'Transelectrica storage integration assessment',
      sourceUrl: URL.anre,
    },
  ],
};

export default RO_CONGESTION;
