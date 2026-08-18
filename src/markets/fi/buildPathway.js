/* ---------------------------------------------------------------------------
   Finland — how a BESS actually gets built.

   Reconstructed from Fingrid's published connection-agreement phases, its grid
   code specifications, and the connection restriction covering southern Finland.

   THE ORDER IS INVERTED RELATIVE TO WESTERN AUSTRALIA, and that is the single
   most useful thing this page says. In WA, connection and consent run in
   parallel: a sponsor can be negotiating an Access Offer while the environmental
   referral is still open. In Finland consent comes FIRST and is a prerequisite —
   a main grid connection agreement requires a legally valid land-use plan and
   building permits, and the letter of intent that precedes it requires the EIA
   programme published and rights to the project area secured.

   So the Finnish programme front-loads its risk. Everything expensive happens
   after the consenting authority has already said yes, which is slower to start
   and much less likely to strand capital. The WA programme parallelises, which
   is faster and puts real money at risk against an approval nobody has granted
   yet. Neither is better; they fail differently, and a sponsor moving between
   the two markets who assumes the order carries over will be wrong in an
   expensive direction.

   THE SECOND FINNISH FACT is that the answer to "can I connect" is currently
   geographic and binary. New grid energy storage connections in southern Finland
   are restricted until 2029; Ostrobothnia and the north have capacity available
   today. Because Finland is a single bidding zone, moving north costs nothing in
   modelled revenue — so the stage that decides a Finnish project is `site`, and
   it decides it before any application is made.

   There is a dedicated storage grid code. SJV2024 — Grid Code Specifications for
   Grid Energy Storage Systems — was adopted by the Energy Authority on 20 March
   2025 alongside VJV2024 for generating facilities, and applies from 0.8 kW.
   Storage is not being fitted into a generator code here; it has its own.
   --------------------------------------------------------------------------- */
import { OWNER, DURATION_BASIS } from '../../governance/buildPathway.js';

export const FI_BUILD_PATHWAY = {
  marketId: 'fi',

  summary: [
    'Consent first, then connection — the reverse of Western Australia. A main grid connection agreement requires a legally valid land-use plan and building permits, and the letter of intent preceding it requires the EIA programme published and project-area rights secured. Before any of that, the binding question is geographic: southern connections are restricted until 2029 while Ostrobothnia and the north have capacity today, and in a single bidding zone moving north costs nothing in modelled revenue.',
    '先许可、后并网 — 与西澳顺序相反。主网并网协议要求具备合法有效的土地利用规划与建筑许可，而在此之前的意向书则要求已发布环评方案并取得项目用地权利。而在这一切之前，决定性问题是地理性的：南部并网受限至2029年，博滕区与北部当前仍有容量；在单一报价区内，北移不会造成模型收入损失。',
  ],

  limit: [
    'The published framework, not a project plan. Fingrid documents its connection-agreement phases and its grid code specifications; it does not publish queue positions, study results or negotiated dates, and correspondence with a developer is not public. Durations here lean on convention more heavily than Western Australia\'s, because Finland has fewer dated public approvals for grid-scale storage to infer from.',
    '此为公开框架而非项目计划。Fingrid公布了并网协议各阶段及电网规范要求，但不公布队列位置、研究结果或协商日期，与开发商的往来函件亦不公开。相较西澳，此处各阶段耗时更多依赖行业惯例，因为芬兰可供推断的电网级储能公开许可记录较少。',
  ],

  stages: [
    {
      id: 'site',
      owner: OWNER.SPONSOR,
      instrument: ['Land lease or ownership; Fingrid connection capacity availability by region', '土地租赁或所有权；Fingrid分区域并网容量可用情况'],
      gate: ['Project-area rights secured at a location where connection is available', '在具备并网条件的区位取得项目用地权利'],
      months: [6, 18],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development', '开发成本'],
      sourceKey: 'connectionRestriction',
      note: [
        'THE STAGE THAT DECIDES A FINNISH PROJECT, and it decides it before an application exists. New grid storage connections in southern Finland are restricted until 2029 against more than 30,000 MW of requests; Ostrobothnia and the north have several thousand megawatts available. One bidding zone means the choice costs nothing in modelled revenue and everything in whether there is a project.',
        '这是决定芬兰项目成败的阶段，且在提出申请之前即已决定。芬兰南部新增电网侧储能并网受限至2029年，而申请量超过30,000MW；博滕区与北部尚有数千MW可用。单一报价区意味着该选择不会造成模型收入损失，却决定项目能否成立。',
      ],
    },
    {
      id: 'consent',
      owner: OWNER.GOVERNMENT,
      instrument: ['Environmental impact assessment programme; land-use plan; building permit', '环境影响评价方案；土地利用规划；建筑许可'],
      gate: ['Legally valid land-use plan and building permits', '取得合法有效的土地利用规划与建筑许可'],
      months: [12, 30],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development', '开发成本'],
      sourceKey: 'connectionPhases',
      note: [
        'Placed BEFORE the application rather than beside it, because Fingrid makes it a prerequisite: a legally valid land-use plan and building permits are conditions of the connection agreement, and a published EIA programme plus project-area rights are conditions of the letter of intent that precedes it. This single ordering difference is what makes the Finnish and Australian programmes different animals.',
        '该阶段置于申请之前而非与之并行，因为Fingrid将其设为前置条件：合法有效的土地利用规划与建筑许可是并网协议的成立条件，而已发布的环评方案与项目用地权利则是其前置意向书的条件。仅此一项顺序差异，就使芬兰与澳大利亚的开发流程成为两种不同的模式。',
      ],
    },
    {
      id: 'application',
      owner: OWNER.TSO,
      instrument: ['Letter of intent to Fingrid, or a distribution operator application below main grid voltage', '向Fingrid提交意向书；或在主网电压以下向配电运营商提交申请'],
      gate: ['Letter of intent signed, describing the route to a connection agreement', '签署意向书，明确通往并网协议的流程'],
      months: [2, 6],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development', '开发成本'],
      sourceKey: 'connectionPhases',
      note: [
        'There are two doors, and which one a project uses changes everything downstream. A main grid connection goes to Fingrid and begins with a letter of intent that itself describes the process leading to the connection agreement. Below main grid voltage the counterparty is a distribution operator instead, with its own process and its own timetable.',
        '存在两条路径，选择哪一条将改变后续全部流程。主网并网向Fingrid提出，以意向书开始，该意向书本身即说明通往并网协议的流程。若接入电压低于主网，则对手方变为配电运营商，其流程与时间表各不相同。',
      ],
    },
    {
      id: 'studies',
      owner: OWNER.TSO,
      instrument: ['Connection agreement and general connection terms', '并网协议与通用并网条款'],
      gate: ['Connection agreement executed', '签署并网协议'],
      months: [6, 18],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development, then capex', '先计入开发成本，后转入资本开支'],
      sourceKey: 'connectionPhases',
      note: [
        'The connection agreement is the instrument, and its prerequisites are the consents already obtained at the previous stage. A project arriving here without a valid land-use plan and building permit is not early — it is not eligible.',
        '并网协议是核心法律文件，其成立条件即为上一阶段已取得的各项许可。项目若在缺少有效土地利用规划与建筑许可的情况下推进至此，并非进度超前 — 而是不具备条件。',
      ],
    },
    {
      id: 'compliance',
      owner: OWNER.TSO,
      instrument: ['SJV2024 — Grid Code Specifications for Grid Energy Storage Systems', 'SJV2024 — 电网侧储能系统电网规范要求'],
      gate: ['Compliance demonstrated for the applicable type class', '按适用类别完成符合性验证'],
      months: [6, 15],
      durationBasis: DURATION_BASIS.PUBLISHED,
      cost: ['Capex', '资本开支'],
      sourceKey: 'gridCode',
      note: [
        'Storage has its own code here rather than being fitted into a generator one. The Energy Authority adopted SJV2024 alongside VJV2024 on 20 March 2025, applying from 0.8 kW, with requirements set by type class A to D according to capacity and connection voltage. A market with a dedicated storage code is a market that has stopped treating storage as an exception.',
        '此处储能拥有专属规范，而非套用发电机规范。能源局于2025年3月20日同时批准SJV2024与VJV2024，适用范围自0.8kW起，并按容量与并网电压划分A至D类分别设定要求。设有专属储能规范的市场，意味着已不再将储能视为特例。',
      ],
    },
    {
      id: 'revenue',
      owner: OWNER.TSO,
      instrument: ['Reserve market prequalification — FFR, FCR-N, FCR-D up and down, aFRR, mFRR', '备用市场预审 — FFR、FCR-N、FCR-D上调与下调、aFRR、mFRR'],
      gate: ['Prequalified, per product', '按品种通过预审'],
      months: [3, 9],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Development', '开发成本'],
      sourceKey: 'reserveObligations',
      note: [
        'PER PRODUCT, and that is the detail the revenue line turns on. Prequalification is not a single approval — each reserve product has its own, and a megawatt qualified for one is not thereby qualified for another. It is also continuous rather than calendar-bound, which is the opposite of the Reserve Capacity Cycle a WA project must hit. No cycle to miss, and no certified revenue to bank either.',
        '按品种分别进行，而这正是收入项的关键所在。预审并非一次性批准 — 每个备用品种各自设有预审，某一品种合格并不意味着其他品种亦合格。此外，预审为持续性而非按日历周期进行，与西澳项目必须赶上的备用容量周期恰好相反。既没有会错过的周期，也没有可锁定的认证收入。',
      ],
    },
    {
      id: 'procurement',
      owner: OWNER.COUNTERPARTY,
      instrument: ['EPC and equipment supply; optimisation or route-to-market agreement', 'EPC与设备供应；优化服务或售电路径协议'],
      gate: ['Notice to proceed', '开工令'],
      months: [3, 9],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'storageFleet',
      note: [
        'The Finnish pattern includes a third-party optimiser as a normal part of the structure rather than an afterthought — Statkraft contracted OX2\'s two sites on a seven-year agreement. In a market whose revenue is short-cycle and reserve-led, who trades the asset is a commercial decision of the same order as who builds it.',
        '芬兰的常见结构中，第三方优化商是标准组成部分而非事后安排 — Statkraft已就OX2的两处场址签署七年期协议。在收入以短周期、备用为主导的市场中，由谁负责资产交易，其重要性与由谁负责建设相当。',
      ],
    },
    {
      id: 'construction',
      owner: OWNER.SPONSOR,
      instrument: ['Construction and commissioning programme under the connection agreement', '并网协议项下的施工与调试计划'],
      gate: ['Plant constructed and commissioned', '设备建成并完成调试'],
      months: [10, 16],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'storageFleet',
      note: [
        'The announced Finnish fleet is two-hour and modular, which is the shorter end of the build spectrum. Winter is the local constraint on programme rather than the technology.',
        '已公布的芬兰机组为2小时时长且采用模块化设计，属建设周期较短的一类。当地对工期的制约来自冬季气候而非技术本身。',
      ],
    },
    {
      id: 'entry',
      owner: OWNER.MARKET,
      instrument: ['Balance responsibility and market participation; reserve market entry per product', '平衡责任与市场参与；按品种进入备用市场'],
      gate: ['Operating and delivering into the reserve and day-ahead markets', '投入运行并向备用市场与日前市场交付'],
      months: [1, 4],
      durationBasis: DURATION_BASIS.CONVENTION,
      cost: ['Capex', '资本开支'],
      sourceKey: 'reserveObligations',
      note: [
        'Shorter than Western Australia\'s equivalent because there is no capacity certification to clear and no annual cycle to land on — the asset begins earning when it is prequalified and delivering. The same fact that removes the certified revenue removes the calendar risk.',
        '较西澳同阶段更短，因为无需通过容量认证，也无需赶上年度周期 — 资产在通过预审并开始交付时即产生收入。消除了认证收入的同一事实，也消除了日历风险。',
      ],
    },
  ],
};

export default FI_BUILD_PATHWAY;
