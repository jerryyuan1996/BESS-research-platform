/* ---------------------------------------------------------------------------
   PJM — congestion register.

   PJM answers the register's central question — "how is a battery paid for
   congestion?" — more directly than any other market on this platform, and the
   answer is the one the vocabulary was least prepared for: through the ordinary
   energy price, continuously, with no congestion product at all.

   PJM settles at the nodal locational marginal price. Congestion is not an event
   that triggers a payment or a curtailment instruction; it is a term inside the
   price at every node in every five-minute interval. A battery in a constrained
   area is paid more for discharging into it and pays less to charge behind it,
   and neither transaction is labelled congestion revenue anywhere. That is why
   this register carries no `naqFactor` row and why comparison.js declares no
   network-access haircut: the locational effect is already inside the TB4 spread
   the merchant leg is derived from, and deducting it again would count it twice.

   The second thing this register has to say is about the capacity market, and it
   is a negative. The last three Base Residual Auctions cleared at ONE price for
   the entire RTO. No Locational Deliverability Area separated. So in the market
   where congestion is most finely priced in energy, it is priced at exactly zero
   in capacity — an asymmetry no other market on this platform reproduces, and
   the reason a PJM site selection is an energy decision made alone.

   The third is that relief here is not a wire. Every other register on this
   platform can name a corridor, its capacity and its commissioning year. PJM's
   shortfall is a supply-demand imbalance rather than a constrained corridor, so
   the relief entries are procedural — a Reliability Backstop, a reformed
   interconnection cycle, Connect and Manage. Those are weaker evidence than a
   funded transmission project, and the register says so rather than borrowing the
   confidence of one.
   --------------------------------------------------------------------------- */
import { CAPTURE, RELIEF_STATUS } from '../../governance/congestion.js';

const URL = {
  rpm: 'https://www.pjm.com/markets-and-operations/rpm',
  queue: 'https://www.pjm.com/planning/service-requests/services-request-status',
  markets: 'https://www.pjm.com/markets-and-operations',
  elcc: 'https://www.pjm.com/planning/resource-adequacy-planning/effective-load-carrying-capability',
};

export const PJM_CONGESTION = {
  marketId: 'pjm',
  summary: [
    'The market where congestion is most finely priced and least separately paid. PJM settles at the nodal LMP, so congestion is a term inside the ordinary energy price rather than a product — 16 of the 20 highest-spread nodes are in northern Virginia and eastern Maryland and 16 of the 20 lowest are in New Jersey. In capacity it is priced at zero: the last three Base Residual Auctions cleared at one price for the entire RTO.',
    '这是拥塞定价最精细、却最少单独付费的市场。PJM按节点边际电价结算，因此拥塞是普通电能量价格中的一个分项而非独立产品 — 价差最高的20个节点中有16个位于弗吉尼亚北部与马里兰东部，最低的20个中有16个位于新泽西。而在容量端，拥塞定价为零：最近三届基准剩余容量拍卖均以单一价格覆盖整个RTO出清。',
  ],
  gateNote: [
    'PJM publishes nodal LMPs and their congestion components in full, and publishes the auction clearing price and storage accreditation for every delivery year. What it does not publish is what congestion earns or costs a battery — no source decomposes a PJM battery\'s revenue into a congestion component, and the Regulation/arbitrage split itself rests on 19 FERC filings from one quarter. Gate G30.',
    'PJM完整公布节点边际电价及其拥塞分项，并公布每个实需年度的拍卖出清价格与储能核证系数。但它不公布拥塞给储能带来的收益或成本 — 无任何来源将PJM储能的收入拆解出拥塞分项，而调频与套利的拆分本身也仅依据某一季度的19份FERC申报。研究缺口G30。',
  ],

  zones: [
    {
      id: 'pjm-nova-dc',
      bearsOn: 'merchGross',
      name: ['Northern Virginia — data-centre load', '弗吉尼亚北部 — 数据中心负荷'],
      shape: 'zone',
      coord: [-77.45, 39.02],
      direction: 'import',
      intensity: 1.0,
      metrics: [
        { label: ['Share of the 20 highest-spread nodes, with eastern Maryland', '与马里兰东部合计占价差最高20个节点的比例'],
          value: ['16 of 20', '20个中的16个'], period: ['2024–2025', '2024–2025年'] },
        { label: ['RPM forecast peak, 2028/29 vs 2027/28', 'RPM预测峰值，2028/29对2027/28年度'],
          value: ['≈2,000 MW higher', '高约2,000MW'], period: ['2028/2029', '2028/2029年度'] },
      ],
      capture: {
        mechanism: CAPTURE.ZONAL_PRICE,
        text: [
          'Paid through the ordinary energy price, at the node, continuously. There is no congestion product to register for and no instruction to respond to — the constraint is a term inside the locational marginal price at every five-minute interval, so a battery captures it simply by trading the spread its node happens to have. This is the cleanest capture mechanism on the platform and the hardest to verify after the fact, because no settlement line is ever labelled congestion.',
          '通过节点上的普通电能量价格持续获得。既无需注册的拥塞产品，也无需响应的调度指令 — 该约束是每五分钟结算时点节点边际电价中的一个分项，因此储能只需交易其所在节点的价差即可捕获其价值。这是本平台最直接的捕获机制，也是事后最难核验的一种，因为任何结算项目都不会标注为拥塞收入。',
        ],
      },
      relief: {
        project: ['Connect and Manage for large loads', '大负荷“接入并管理”框架'],
        operator: 'PJM',
        scope: ['A framework allowing large new loads such as data centres to connect but operate flexibly when needed, attacking the demand side of the shortfall rather than building transmission',
                '一项允许数据中心等大型新增负荷接入、但在必要时须灵活运行的框架，从需求侧而非通过新建输电来应对缺口'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'Diligence the node, not the RTO. This dashboard seeds arbitrage from the fleet-average TB4 spread of $69,375/MW/yr for 2025, and the node distribution behind that average is wide enough that a site in the wrong pocket will not reach it. The relief here is unusual in that it targets the load rather than the network — Connect and Manage would let data-centre load connect faster while curtailing it under stress, which relieves the capacity shortfall without necessarily narrowing the daily spread a battery trades. Do not assume the two move together.',
        '应尽调节点而非全RTO。本看板以2025年机组平均TB4价差每MW每年$69,375为套利收入种子值，而该平均值背后的节点分布足够宽，以至于选址不当的项目根本无法达到该水平。此处的缓解措施颇为特殊，其针对的是负荷而非电网 — “接入并管理”将允许数据中心负荷更快接入，但在系统紧张时对其限电，这在缓解容量缺口的同时未必会收窄储能所交易的日内价差。不应假定二者同步变动。',
      ],
      source: 'PJM 2028/2029 Base Residual Auction report; Modo Energy PJM TB4 node analysis',
      sourceUrl: URL.rpm,
    },

    {
      id: 'pjm-emaac-import',
      bearsOn: 'merchGross',
      name: ['EMAAC — a load pocket with the lowest spreads', 'EMAAC — 价差最低的负荷孤岛'],
      shape: 'zone',
      coord: [-74.60, 40.10],
      direction: 'import',
      intensity: 0.6,
      metrics: [
        { label: ['Share of the 20 lowest-spread nodes', '占价差最低20个节点的比例'],
          value: ['16 of 20, in New Jersey', '20个中的16个，位于新泽西'], period: ['2024–2025', '2024–2025年'] },
        { label: ['Capacity price relative to the rest of the RTO', '相对RTO其余地区的容量价格'],
          value: ['Identical — the auction cleared RTO-wide', '完全相同 — 拍卖按全RTO统一出清'], period: ['2028/2029', '2028/2029年度'] },
      ],
      capture: {
        mechanism: CAPTURE.ZONAL_PRICE,
        text: [
          'The same mechanism as northern Virginia, running the other way, and it is here to prevent a specific misreading. EMAAC is the longest-standing Locational Deliverability Area in PJM and is genuinely import-constrained — which lifts the price LEVEL without widening the daily SPREAD. A battery earns the spread, not the level. This is the row that says a load pocket is not automatically a good battery site.',
          '与弗吉尼亚北部机制相同但方向相反，此处列出正是为防止一种具体的误读。EMAAC是PJM历史最久的区位可交付区，且确实受入受限 — 这抬高了价格水平，但并未拉大日内价差。储能赚取的是价差而非价格水平。本行所要说明的是：负荷孤岛并不自动等同于优质储能场址。',
        ],
      },
      relief: {
        project: ['None — this is a structural price-level effect', '无 — 这是结构性的价格水平效应'],
        operator: 'PJM',
        scope: ['Import constraints into EMAAC raise the level rather than the spread; no relief project changes that relationship',
                '进入EMAAC的受入约束抬高的是价格水平而非价差；任何缓解工程都不会改变这一关系'],
        expected: null,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'The most useful negative on this register. An investor screening PJM sites on constraint severity would rank EMAAC highly and be wrong: the twenty worst TB4 nodes in the RTO are concentrated in exactly the area with the longest-running deliverability constraint. Screen on realised nodal spread history, not on whether the zone is constrained.',
        '这是本登记表中最有价值的反面结论。若投资人按约束严重程度筛选PJM场址，会将EMAAC排在前列，而这是错误的：全RTO TB4表现最差的二十个节点，恰恰集中于可交付性约束历时最久的区域。应按实际节点价差历史筛选，而非按该区域是否受限筛选。',
      ],
      source: 'Modo Energy PJM TB4 node analysis; PJM Locational Deliverability Area definitions',
      sourceUrl: URL.markets,
    },

    {
      id: 'pjm-rto-capacity-flat',
      bearsOn: 'securedContracted',
      name: ['One capacity price, the whole footprint', '单一容量价格，覆盖全区域'],
      shape: 'zone',
      coord: [-79.60, 39.30],
      direction: 'both',
      intensity: 0.4,
      metrics: [
        { label: ['2028/2029 clearing price', '2028/2029年度出清价格'],
          value: ['$325.00/MW-day, RTO-wide, at the FERC cap', '每MW每日$325.00，全RTO统一，以FERC上限成交'], period: ['2028/2029', '2028/2029年度'] },
        { label: ['Locational separation', '区位价差分离'],
          value: ['None in the last three auctions', '最近三届拍卖均无'], period: ['2026/27 – 2028/29', '2026/27–2028/29年度'] },
      ],
      capture: {
        mechanism: CAPTURE.CAPACITY_ACCREDITATION,
        text: [
          'What congestion does to a PJM capacity payment is nothing to the price and everything to the eligibility. The clearing price has not separated by area for three delivery years, so location is worth zero on this line — but a resource must hold Capacity Interconnection Rights and pass a deliverability test to offer at all. So the locational risk is binary rather than priced: an asset either can sell capacity at the RTO price or cannot sell it.',
          '拥塞对PJM容量收入的影响，在价格上为零，在资格上却是全部。出清价格已连续三个实需年度未按区域分化，因此在这条收入线上区位价值为零 — 但资源必须持有容量并网权并通过可交付性检验才能参与报价。因此区位风险是非此即彼的，而非被定价的：资产要么能按全RTO价格出售容量，要么根本无法出售。',
        ],
      },
      relief: {
        project: ['Reformed interconnection cycle', '改革后的并网周期流程'],
        operator: 'PJM',
        scope: ['Transition Cycle 1 issued interconnection agreements to 21 battery projects totalling 1.9 GW; the reopened queue holds 67 GW of storage',
                '过渡周期一向21个储能项目签发并网协议，合计1.9GW；重开的排队队列中有67GW储能'],
        expected: 2030,
        status: RELIEF_STATUS.UNDER_CONSTRUCTION,
      },
      investor: [
        'Read this against Italy and the contrast is the whole locational argument. Terna buys storage by zone and Sicily cleared 30% above Sud e Calabria for the same product, so an Italian site decision is a capacity decision. PJM clears one price everywhere, so a PJM site decision is an energy decision and the capacity question reduces to whether the asset holds CIRs at all. Two markets, one constraint problem, opposite conclusions about where siting effort belongs.',
        '将本条与意大利对照，其反差正是区位论证的全部。Terna按区域采购储能，西西里同一产品出清价高出南部及卡拉布里亚30%，因此意大利的选址决策是容量决策。PJM各处以单一价格出清，因此PJM的选址决策是电能量决策，而容量问题简化为该资产是否持有容量并网权。两个市场、同一约束问题，关于选址功夫该花在何处却得出相反结论。',
      ],
      source: 'PJM 2028/2029 Base Residual Auction report; PJM ELCC class ratings',
      sourceUrl: URL.elcc,
    },

    {
      id: 'pjm-queue',
      bearsOn: 'services',
      name: ['The queue — 67 GW against a 750 MW requirement', '排队队列 — 67GW对应750MW系统需求'],
      shape: 'zone',
      coord: [-80.20, 40.60],
      direction: 'both',
      intensity: 0.9,
      metrics: [
        { label: ['Storage in the reopened queue', '重开队列中的储能规模'],
          value: ['67 GW', '67GW'], period: ['April 2026', '2026年4月'] },
        { label: ['Operating battery fleet', '在运储能机组'],
          value: ['≈400 MW', '约400MW'], period: ['2026', '2026年'] },
        { label: ['Regulation requirement it competes for', '其所竞争的调频需求'],
          value: ['≈750 MW, RTO-wide', '全RTO约750MW'], period: ['post-October 2025', '2025年10月之后'] },
      ],
      capture: {
        mechanism: CAPTURE.UNCOMPENSATED,
        text: [
          'Nobody pays for this and it is not a constraint in the usual sense — it is the queue itself, entered in the register because it bears on a revenue line more heavily than any physical constraint in PJM does. A resource waiting in the queue earns nothing, and the resources ahead of it are what close the Regulation market that the operating fleet is currently paid so well by. The cost is borne entirely by the developer, as time.',
          '无人为此付费，且它并非通常意义上的约束 — 它就是排队队列本身，之所以列入登记表，是因为它对某条收入线的影响大于PJM任何物理约束。在队列中等待的资源没有任何收入，而排在其前面的资源正是将关闭当前令在运机组获利丰厚的调频市场的力量。这一成本完全由开发商以时间的形式承担。',
        ],
      },
      relief: {
        project: ['Expedited Interconnection Track and the Reliability Backstop Procurement', '快速并网通道与可靠性兜底采购'],
        operator: 'PJM, subject to FERC approval',
        scope: ['A temporary track for up to 10 state-sponsored shovel-ready projects, plus a special procurement whose filing FERC suspended on 29 September 2026 to 28 February 2027',
                '为最多10个由州政府支持、可立即开工的项目设立的临时通道，以及一项特别采购，其申请已于2026年9月29日被FERC中止至2027年2月28日'],
        expected: 2026,
        status: RELIEF_STATUS.PROPOSED,
      },
      investor: [
        'This row is the reason the Regulation seed on this platform is $19,200/MW/yr rather than the $247,680 the fleet earns today. It is also why a PJM investor is not straightforwardly rooting for a fast queue: the same arrivals that close Regulation also relieve the shortage holding the capacity price at its cap and compress the TB4 spread. Both relief items here are proposed rather than in force, and neither has a megawatt attached — treat any assumption that the queue clears on a schedule as unsupported.',
        '本行正是本平台调频收入种子值取每MW每年$19,200、而非机组当前所赚$247,680的原因。它同时也说明PJM投资人并非简单地希望排队加快：同一批到位产能在关闭调频市场的同时，也缓解了使容量价格维持在上限的短缺状态，并压缩TB4价差。此处两项缓解措施均为提议阶段而非已生效，且均无对应兆瓦数 — 任何关于队列将按时间表清理的假设都应视为缺乏支撑。',
      ],
      source: 'PJM interconnection queue; PJM Regulation Redesign Phase 1',
      sourceUrl: URL.queue,
    },
  ],
};

export default PJM_CONGESTION;
