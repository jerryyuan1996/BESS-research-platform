/* ---------------------------------------------------------------------------
   ERCOT — interactive grid map.

   Representative regional orientation only: approximate locality centroids, no
   spare capacity, no queue position, no investable connection.

   Drawn on a Texas state outline rather than a cropped US one, for the same
   reason Western Australia gets its own polygon: ERCOT is a state grid that does
   not synchronously connect to either US interconnection, so borrowing the
   national outline would draw Oklahoma and Louisiana as if they were part of the
   market. The outline is Natural Earth's 50m admin-1 Texas feature; ERCOT covers
   about 90% of Texas load rather than the whole state, which the scope note says.

   What the three periods show, and how it differs from every other map here.
   Elsewhere the story is generation moving away from load and a corridor being
   built to close the gap. ERCOT's geography barely changed: wind was always in
   the west and load was always in the Dallas and Houston triangles. What changed
   is the DENSITY of what sits on that geography — 5.3 GW of battery in 2023 and
   14 GW entering 2026 — and what is about to change is the load, with a
   large-load queue of about 238.6 GW dominated by data centres.

   So this map has no relief corridor and does not pretend to. ERCOT does not
   schedule relief for congestion; it prices it at the node and lets the market
   hedge it through Congestion Revenue Rights. The plan layer therefore carries
   the large-load queue, which is the only thing on the horizon large enough to
   change the price.
   --------------------------------------------------------------------------- */
import boundary from './tx-boundary.json' with { type:'json' };

const URL = {
  queue: 'https://www.ercot.com/gridinfo/resource',
  rtcb: 'https://www.ercot.com/news/release/12052025-ercot-goes-live',
  ancillary: 'https://www.ercot.com/gridmktinfo/dashboards/ancillaryservices',
  markets: 'https://www.ercot.com/mktinfo',
  atlas: 'https://github.com/nvkelso/natural-earth-vector',
};

const LABEL_KINDS = new Set(['load','generation','node']);
const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1,
  label:LABEL_KINDS.has(kind), ...extra,
});

const points = [
  /* ---- demand centres --------------------------------------------------- */
  point('dfw', ['Dallas–Fort Worth — North zone', '达拉斯-沃斯堡 — 北部区'], [-97.00, 32.90], 'load', ['Urban and data-centre load', '城市与数据中心负荷'], ['past','current','future'],
    ['The North load zone, and where the large-load queue is growing fastest. ERCOT\'s large-load queue reached about 238.6 GW by March 2026, 77.5% of it data centres.',
     '北部负荷区，也是大负荷排队增长最快的区域。截至2026年3月，ERCOT大负荷排队量约达238.6GW，其中77.5%为数据中心。'],
    ['This is where the bull case has to land. Spread recovery in ERCOT depends on load arriving faster than generation, and the rules governing how fast very large loads may connect had not been written at the seed date.',
     '看多逻辑必须在此兑现。ERCOT的价差回升取决于负荷增速快于电源增速，而截至种子日期，规范超大型负荷接入速度的规则尚未出台。'],
    'ERCOT large-load interconnection queue', URL.queue,
    { labelAnchor:'end',
      companies:['Oncor service territory','Oncor供电区'],
      demandScale:['One of ERCOT\'s two largest load zones; the fastest-growing block of the large-load queue','ERCOT两大负荷区之一；大负荷排队中增长最快的部分'] }),

  point('houston', ['Houston — coastal industrial load', '休斯顿 — 沿海工业负荷'], [-95.37, 29.76], 'load', ['Industrial load pocket', '工业负荷孤岛'], ['past','current','future'],
    ['A dense import-constrained load pocket with heavy petrochemical demand. The largest concentration of ERCOT battery capacity sits around it.',
     '密集的受入受限负荷孤岛，石化需求集中。ERCOT储能装机最集中的区域即环绕于此。'],
    ['An import constraint lifts the price LEVEL without necessarily widening the daily SPREAD, and a battery earns the spread. Houston is a good location for load and retirement reasons, not automatically because it is constrained.',
     '受入约束抬高的是价格水平，未必拉大日内价差，而储能赚取的是价差。休斯顿之所以是良好选址，原因在于负荷与机组退役，而非仅因其受到约束。'],
    'ERCOT nodal market information', URL.markets,
    { companies:['CenterPoint Energy service territory','CenterPoint Energy供电区'],
      demandScale:['ERCOT\'s other large load zone; petrochemical and refining demand','ERCOT另一大负荷区；石化与炼油需求'] }),

  /* ---- generation ------------------------------------------------------- */
  point('permian', ['Permian Basin — West zone', '二叠盆地 — 西部区'], [-102.20, 31.90], 'generation', ['Wind, solar and oilfield load', '风电、光伏与油田负荷'], ['past','current','future'],
    ['Where ERCOT congestion concentrates: wind and solar output far from the load zones, against oilfield electrification demand growing on the same network. The most negative and most volatile prices in the market.',
     'ERCOT拥塞集中之处：风光出力远离负荷区，同时同一电网上的油田电气化需求持续增长。该区拥有全市场最负、也最波动的价格。'],
    ['The widest spreads in ERCOT and the deepest negative pricing, and a fleet-average index describes neither. Price the Congestion Revenue Right position alongside the asset — this is the only market on this platform where basis can be hedged as a financial position.',
     'ERCOT最宽的价差与最深的负电价均在此，而机组平均指数无法反映其中任何一者。应将拥塞收入权头寸与资产一并定价 — 这是本平台唯一可将基差作为金融头寸对冲的市场。'],
    'ERCOT nodal market information', URL.markets,
    { operatingCapacity:['ERCOT battery fleet 14 GW entering 2026, from 5.3 GW in 2023; fleet average duration ≈1.6h','ERCOT储能机组2026年初为14GW，2023年为5.3GW；机组平均时长约1.6小时'] }),

  point('southtx', ['South Texas — Rio Grande Valley and the coast', '南德州 — 格兰德河谷与沿海'], [-98.20, 27.20], 'generation', ['Solar-heavy generation', '光伏为主的电源'], ['current','future'],
    ['Solar-heavy and export-constrained toward the Houston and North load centres. Several of the named tolled batteries — Ferdinand, Padua 2, Lower Rio — sit in this zone.',
     '光伏占比高，向休斯顿与北部负荷中心送出受限。多个具名租赁储能项目 — Ferdinand、Padua 2、Lower Rio — 均位于该区域。'],
    ['A deep midday trough is what pays a two-hour battery here. It is also what a four-hour asset needs to extend into, and the named four-hour tolled builds are in this zone rather than the west.',
     '深度的午间低谷正是此处两小时储能的收入来源。它同时也是四小时资产需要延伸覆盖的时段，而具名的四小时租赁项目正位于该区域而非西部。'],
    'ERCOT nodal market information', URL.markets,
    { operatingCapacity:['Named four-hour tolled builds: Ferdinand 200 MW / 800 MWh and Padua 2 150 MW / 600 MWh, both 2026','具名四小时租赁项目：Ferdinand 200MW/800MWh与Padua 2 150MW/600MWh，均于2026年投运'] }),

  /* ---- the market design, as a place ------------------------------------ */
  point('rtcb', ['RTC+B — real-time co-optimization, market-wide', 'RTC+B — 实时联合优化，覆盖全市场'], [-99.90, 31.30], 'node', ['Market design', '市场机制'], ['current','future'],
    ['Live since 5 December 2025. Energy and ancillary services now clear together every five minutes, and the duration requirements fell — ECRS from two hours to one, RRS and Regulation from one hour to thirty minutes, Non-Spin unchanged at four.',
     '自2025年12月5日起上线。电能量与辅助服务现每五分钟同时出清，且时长要求下调 — ECRS由两小时降至一小时，RRS与调频由一小时降至三十分钟，非旋转备用维持四小时不变。'],
    ['Drawn as a point because it has no geography and applies everywhere. Better dispatch flexibility for an individual asset, and a larger qualifying pool competing for an ancillary quantity that did not grow.',
     '之所以绘制为一个点，是因为它没有地理位置且在全市场适用。对单个资产而言调度灵活性提升，但争夺同一未增长辅助服务采购量的合格资源池也随之扩大。'],
    'ERCOT RTC+B go-live', URL.rtcb),

  point('largeload', ['Large-load queue — 238.6 GW', '大负荷排队 — 238.6GW'], [-98.50, 33.60], 'node', ['Demand-side queue', '需求侧排队'], ['future'],
    ['About 238.6 GW of large load had applied by March 2026, 77.5% of it data centres, with 198 GW applying in Q1 2026 alone and 86 GW under review.',
     '截至2026年3月，已申请大负荷约238.6GW，其中77.5%为数据中心；仅2026年第一季度就有198GW提交申请，另有86GW在审。'],
    ['Larger than ERCOT\'s entire generation fleet, and the only credible path back to 2023-style spreads. A queue is not a commitment, and the rules governing how fast it connects were still being written at the seed date.',
     '其规模大于ERCOT全部发电机组总量，也是回到2023年式价差水平的唯一可信路径。但排队并非承诺，且截至种子日期，规范其接入速度的规则仍在制定之中。'],
    'ERCOT large-load interconnection queue', URL.queue,
    { layer:'plan', planClass:'load', planClassLabel:['Demand-side rulemaking','需求侧规则制定'], planYear:null,
      planStatus:['Applied, not committed; connection rules under development','已申请，未承诺；接入规则制定中'],
      plannedCapacity:['≈238.6 GW applied, 77.5% data centres','已申请约238.6GW，其中77.5%为数据中心'] }),
];

const routes = [
  { id: 'west-to-load', kind:'route', name:['West to load — the constraint that pays','由西部至负荷 — 带来收益的约束'],
    coords:[[-102.20, 31.90], [-99.90, 31.30], [-97.00, 32.90]],
    periods:['past','current','future'], source:'ERCOT nodal market information', sourceUrl:URL.markets,
    endpoints:['Permian Basin – Dallas–Fort Worth','二叠盆地 — 达拉斯-沃斯堡'],
    note:['The path that sets west Texas basis: wind and solar in the Permian, load in the north, and a network that has never fully closed the gap.',
          '决定西德州基差的路径：二叠盆地的风光电源、北部的负荷，以及从未完全弥合两者差距的电网。'],
    investor:['No named corridor project relieves this and none is scheduled. ERCOT prices congestion at the node and auctions Congestion Revenue Rights so the basis can be hedged, rather than planning relief against a commissioning date.',
              '没有任何具名走廊工程缓解该约束，也无相关计划。ERCOT在节点层面对拥塞定价，并通过拍卖拥塞收入权使基差可对冲，而非按投运日期规划缓解工程。'],
    operatingCapacity:['Fleet 14 GW entering 2026, projected to about 40 GW by end-2030','机组2026年初为14GW，预计2030年底约达40GW'] },

  { id: 'south-to-houston', kind:'route', name:['South Texas to Houston — the solar trough','南德州至休斯顿 — 光伏低谷'],
    coords:[[-98.20, 27.20], [-96.80, 28.60], [-95.37, 29.76]],
    periods:['current','future'], source:'ERCOT nodal market information', sourceUrl:URL.markets,
    endpoints:['Rio Grande Valley – Houston','格兰德河谷 — 休斯顿'],
    note:['Solar-heavy generation in the south serving the coastal industrial load, producing the midday trough a two-hour battery charges into.',
          '南部以光伏为主的电源为沿海工业负荷供电，形成两小时储能赖以充电的午间低谷。'],
    investor:['The named four-hour tolled builds sit on this path rather than in the west — Ferdinand and Padua 2, both commissioning in 2026. Duration and route to market are chosen together in ERCOT.',
              '具名的四小时租赁项目位于该路径而非西部 — Ferdinand与Padua 2，均于2026年投运。在ERCOT，时长与售电路径是一并选择的。'],
    operatingCapacity:['Ferdinand 200 MW / 800 MWh and Padua 2 150 MW / 600 MWh, both 2026','Ferdinand 200MW/800MWh与Padua 2 150MW/600MWh，均于2026年投运'] },

  { id: 'no-external-tie', kind:'route', name:['No synchronous tie — ERCOT is an island','无同步联络线 — ERCOT是一座孤岛'],
    coords:[[-100.00, 36.40], [-97.00, 33.80], [-94.20, 31.00]],
    periods:['past','current','future'], source:'ERCOT market information', sourceUrl:URL.markets,
    endpoints:['Northern and eastern boundary of the ERCOT interconnection','ERCOT互联电网的北部与东部边界'],
    note:['ERCOT does not synchronously connect to either the Eastern or the Western Interconnection. Transfers across this boundary run over a small number of DC ties and are immaterial to price formation.',
          'ERCOT与东部及西部互联电网均无同步连接。跨越该边界的输送仅通过少数直流联络线进行，对价格形成无实质影响。'],
    investor:['This is why ERCOT can run an energy-only market with its own scarcity pricing and its own regulator. It is also why there is no neighbouring market to import cheap energy from when scarcity does arrive — the price has nowhere to go but up, and nothing to cap it but the offer cap.',
              '这正是ERCOT能够运行拥有自身稀缺定价机制与独立监管机构的纯电能量市场的原因。这同时也意味着：稀缺真正来临时，没有相邻市场可供输入廉价电力 — 价格除上行外别无去处，除报价上限外亦无任何约束。'],
    operatingCapacity:['A small number of DC ties; no synchronous interconnection','少数直流联络线；无同步互联'] },
];

const sourceCatalog = [
  { id:'ercot-map-queue', owner:'ERCOT', title:'Generation interconnection status and large-load queue', url:URL.queue, format:'XLSX', cadence:'Monthly', licence:'Publisher reuse terms', automation:'B', checkedAt:'2026-08-04' },
  { id:'ercot-map-rtcb', owner:'ERCOT', title:'RTC+B go-live announcement', url:URL.rtcb, format:'HTML', cadence:'One-off market change', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-04' },
  { id:'ercot-map-ancillary', owner:'ERCOT', title:'Ancillary services dashboard', url:URL.ancillary, format:'HTML + CSV', cadence:'Continuous', licence:'Publisher reuse terms', automation:'B', checkedAt:'2026-08-04' },
  { id:'ercot-map-markets', owner:'ERCOT', title:'Nodal market information', url:URL.markets, format:'HTML + CSV', cadence:'Continuous', licence:'Publisher reuse terms', automation:'B', checkedAt:'2026-08-04' },
  { id:'ercot-map-boundary', owner:'Natural Earth', title:'Admin-1 states and provinces, 50m', url:URL.atlas, format:'GeoJSON', cadence:'Periodic', licence:'Public domain (Natural Earth)', automation:'B', checkedAt:'2026-08-04' },
];

export const ERCOT_GRID_MAP = {
  id:'ercot-grid-map',
  ariaLabel:['Interactive ERCOT electricity map','ERCOT电力交互地图'],
  title:['ERCOT grid structure by period','ERCOT不同时期电网结构'],
  defaultPeriod:'current',
  defaultSelectedId:'permian',
  boundary,
  boundarySource: {
    label: ['Natural Earth 50m admin-1', 'Natural Earth 50m一级行政区'],
    url: URL.atlas,
  },
  periodOrder: ['past','current','future'],
  periods: {
    past: {
      label: ['Past · 2021', '过去 · 2021'],
      kicker: ['Uri, and the case for storage', 'Uri风暴与储能的投资逻辑'],
      thesis: ['Winter Storm Uri established both the scarcity value an energy-only market can produce and the political limit on it. The ORDC was recalibrated and the offer cap lowered, but the design was kept. The battery fleet was negligible.','Uri冬季风暴既确立了纯电能量市场所能产生的稀缺价值，也确立了对该价值的政治约束。ORDC经重新校准、报价上限下调，但市场设计得以保留。当时储能装机规模微不足道。'],
      implication: ['A market that pays for scarcity also decides how much scarcity it will tolerate. That ceiling has bound every ERCOT revenue forecast since.','为稀缺付费的市场，同时也决定其愿意容忍多少稀缺。此后每一份ERCOT收入预测都受该上限约束。'],
    },
    current: {
      label: ['Current · 2026', '当前 · 2026'],
      kicker: ['The fleet arrived, and the margin left', '装机到位，margin离场'],
      thesis: ['Connect-and-manage interconnection at about 4.2 years took the battery fleet from 5.3 GW in 2023 to 14 GW entering 2026. Ancillary revenue fell about 90% and its share of battery income went from 84% to 48%. RTC+B went live on 5 December 2025.','约4.2年的“接入并管理”式并网，使储能机组由2023年的5.3GW增至2026年初的14GW。辅助服务收入下跌约90%，其占储能收入比重由84%降至48%。RTC+B于2025年12月5日上线。'],
      implication: ['Nothing in the design changed to cause this. The design worked, and the margin was the cost of it working.','市场设计中没有任何变化导致这一结果。设计奏效了，而margin的消失正是其奏效的代价。'],
    },
    future: {
      label: ['Planned · 2030', '规划 · 2030'],
      kicker: ['A load queue larger than the grid', '大于电网自身规模的负荷排队'],
      thesis: ['The battery fleet is projected at about 40 GW by end-2030 against 14 GW today, and the large-load queue reached about 238.6 GW by March 2026 — 77.5% data centres, and larger than ERCOT\'s entire generation fleet.','储能机组预计到2030年底约达40GW，而当前为14GW；同时截至2026年3月，大负荷排队量约达238.6GW — 其中77.5%为数据中心，且规模大于ERCOT全部发电机组总量。'],
      implication: ['Both queues are real and only one of them is committed. An ERCOT case rests on the load queue converting faster than the generation queue does, and no rule yet governs the speed of either.','两个排队都真实存在，但只有其中之一有实际承诺。ERCOT的投资逻辑取决于负荷排队的兑现速度快于电源排队，而目前尚无规则规范二者中任何一方的速度。'],
    },
  },
  layers: {
    node: { label:['Market design and queues','市场机制与排队'] },
    generation: { label:['Generation','发电'] },
    load: { label:['Demand centres','负荷中心'] },
    route: { label:['Network paths','网络路径'] },
    plan: { label:['Planned build','规划建设'] },
  },
  points,
  routes,
  sourceCatalog,
  scope: [
    'Representative regional orientation only. Markers use approximate locality centroids and do not show spare capacity, queue position, curtailment probability or an investable connection. The outline is the state of Texas; ERCOT covers about 90% of Texas load rather than the whole state, and does not synchronously connect to either US interconnection.',
    '仅用于代表性区域方位展示。标记采用近似地点中心坐标，不显示可用容量、队列位置、限电概率或可投资并网权利。底图轮廓为德克萨斯州；ERCOT覆盖约90%的德州负荷而非全州，且与美国东部及西部互联电网均无同步连接。',
  ],
};

export default ERCOT_GRID_MAP;
