/* ---------------------------------------------------------------------------
   PJM — interactive grid map.

   Representative regional orientation only: approximate locality centroids, no
   spare capacity, no queue position, no investable connection.

   The map is drawn on the US outline but `viewBounds` narrows it to the PJM
   footprint — thirteen states and the District of Columbia across the
   mid-Atlantic and the eastern Midwest. A US map framed on the whole country
   would put PJM in one corner and Alaska in the other.

   What the three periods show, and why PJM's is a different shape from every
   other map on this platform. Elsewhere the story is generation moving away from
   load: German wind went north while the nuclear went off in the south, NEM
   generation left the coalfields, Italian renewables concentrated in the south.
   In PJM the GENERATION barely moved geographically — the coal that retired was
   in the Ohio Valley and the gas that replaced it largely was too. What moved was
   the LOAD, and it moved fast: data-centre interconnection in northern Virginia
   turned a structurally long system into one that has now cleared two consecutive
   capacity auctions short of its own reliability requirement.

   That is why this map has no named relief corridor. There is no PJM equivalent
   of SuedLink or Project EnergyConnect to point at, because the constraint is not
   a single wire — it is a supply-demand imbalance inside one capacity price. The
   plan layer therefore carries process reforms rather than transmission, and the
   congestion register says so rather than borrowing the confidence of a funded
   project with a commissioning date.
   --------------------------------------------------------------------------- */
import boundary from './us-boundary.json' with { type:'json' };

const URL = {
  rpm: 'https://www.pjm.com/markets-and-operations/rpm',
  queue: 'https://www.pjm.com/planning/service-requests/services-request-status',
  elcc: 'https://www.pjm.com/planning/resource-adequacy-planning/effective-load-carrying-capability',
  ancillary: 'https://www.pjm.com/markets-and-operations/ancillary-services',
  atlas: 'https://github.com/topojson/world-atlas',
};

/* Standing map labels. Demand centres and generation zones always carry one —
   they are the geography that orients a reader against a published network
   plan. Nodes carry one only where the map is sparse enough to take it. */
const LABEL_KINDS = new Set(['load','generation','node']);
const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1,
  label:LABEL_KINDS.has(kind), ...extra,
});

const points = [
  /* ---- demand centres --------------------------------------------------- */
  point('novadc', ['Northern Virginia — Data Center Alley', '弗吉尼亚北部 — 数据中心走廊'], [-77.45, 39.02], 'load', ['Data-centre load centre', '数据中心负荷中心'], ['current','future'],
    ['The load growth that turned PJM from long to short. Data-centre interconnection is the reason the RPM forecast peak for the 2028/2029 delivery year sits about 2,000 MW above the 2027/2028 forecast.',
     '正是这里的负荷增长使PJM由容量富余转为短缺。数据中心并网是2028/2029实需年度RPM预测峰值较2027/2028年度高出约2,000MW的原因。'],
    ['The highest TB4 spreads in the RTO sit here and in eastern Maryland — 16 of the top 20 nodes. Capacity revenue is identical everywhere in PJM; this is where the energy leg is won.',
     '全RTO最高的TB4价差位于此处及马里兰东部 — 前20个节点中有16个。PJM各处容量收入完全相同；电能量收入的胜负在此决出。'],
    'PJM interconnection queue and load forecast', URL.queue,
    { companies:['Dominion Energy service territory','Dominion Energy供电区'],
      demandScale:['PJM serves 67 million people across 13 states and DC; this zone carries the fastest-growing block of it','PJM为13个州及华盛顿特区的6,700万人供电；本区承载其中增长最快的负荷'] }),

  point('chicago', ['Chicago — ComEd', '芝加哥 — ComEd'], [-87.65, 41.85], 'load', ['Industrial and urban load', '工业与城市负荷'], ['past','current','future'],
    ['Northern Illinois, nuclear-heavy and separately constrained from the eastern RTO. ComEd joined PJM in 2004 and remains an electrically distinct pocket within it.',
     '伊利诺伊州北部，核电占比高，与RTO东部之间存在独立约束。ComEd于2004年加入PJM，至今在电气上仍是其中一个独立区域。'],
    ['A distinct price region inside a single RTO-wide capacity price. Read its nodal TB4 history separately; the RTO average does not describe it.',
     '在全RTO统一容量价格之下的一个独立价格区域。应单独查阅其节点TB4历史；全RTO平均值无法反映该区情况。'],
    'PJM interconnection queue', URL.queue,
    { companies:['Commonwealth Edison service territory','Commonwealth Edison供电区'],
      demandScale:['One of the two largest load pockets in the RTO','RTO内两大负荷集中区之一'] }),

  point('baltdc', ['Baltimore–Washington — SWMAAC', '巴尔的摩—华盛顿 — SWMAAC'], [-76.70, 39.15], 'load', ['Urban load pocket', '城市负荷孤岛'], ['past','current','future'],
    ['The BGE and Pepco zones. With northern Virginia this area holds most of the twenty highest-spread nodes in the RTO.',
     'BGE与Pepco区域。与弗吉尼亚北部共同占据全RTO价差最高的二十个节点中的大部分。'],
    ['A constrained import area with high nodal spreads. The capacity auction pays the same here as in the surplus zones, so the entire locational premium accrues to the energy leg.',
     '这是一个受限的受入区域，节点价差较高。此处容量拍卖价格与富余区域相同，因此全部区位溢价均归于电能量收入。'],
    'PJM interconnection queue', URL.queue,
    /* Three demand centres sit within a few degrees of each other on the
       eastern seaboard, which is more crowding than the label resolver's default
       ring can clear. These two ask for the left-and-below side first so that
       northern Virginia — the label that orients the reader — keeps the space
       above the cluster. */
    { labelAnchor:'end', labelBelow:true,
      companies:['Baltimore Gas & Electric; Potomac Electric Power','巴尔的摩燃气电力公司；波托马克电力公司'],
      demandScale:['Dense urban and federal load, historically import-constrained','密集的城市与联邦机构负荷，历史上受入受限'] }),

  point('njload', ['New Jersey and eastern Pennsylvania — EMAAC', '新泽西与宾州东部 — EMAAC'], [-74.60, 40.10], 'load', ['Coastal load pocket', '沿海负荷孤岛'], ['past','current','future'],
    ['The PSEG, PECO, AECO and DPL zones. Historically the most import-constrained part of PJM, and today the location of most of the twenty LOWEST-spread nodes.',
     'PSEG、PECO、AECO与DPL区域。历史上是PJM受入约束最严重的地区，而如今价差最低的二十个节点中大部分位于此处。'],
    ['The clearest warning on this map. A load pocket is not automatically a high-spread node: EMAAC is constrained on IMPORT, which lifts the price level without widening the daily spread a battery trades.',
     '本图最清晰的警示。负荷孤岛并不自动等同于高价差节点：EMAAC受限于受入方向，这抬高了价格水平，但并未拉大储能所交易的日内价差。'],
    'PJM interconnection queue', URL.queue,
    // Easternmost point on the map; anchor the text to its left or it runs off.
    { labelAnchor:'end',
      companies:['Public Service Electric & Gas; PECO; Atlantic City Electric; Delmarva','公共服务电力燃气公司；PECO；大西洋城电力；Delmarva'],
      demandScale:['Long-standing Locational Deliverability Area with its own reliability requirement','长期设有独立可靠性需求的区位可交付区'] }),

  /* ---- generation ------------------------------------------------------- */
  point('ohiovalley', ['Ohio Valley — the retiring coal fleet', '俄亥俄河谷 — 退役中的燃煤机组'], [-81.60, 39.80], 'generation', ['Coal and gas conversion', '燃煤及燃气改造机组'], ['past','current'],
    ['Where PJM\'s thermal retirement concentrates. Coal fell 2,941 MW UCAP into the 2028/2029 auction alone, from retirements and conversions to natural gas, while gas rose 5,639 MW.',
     'PJM火电退役集中于此。仅在2028/2029年度拍卖中，燃煤UCAP即因退役与燃气改造减少2,941MW，同期燃气增加5,639MW。'],
    ['This is the supply side of the shortfall. It is also where the surplus zones are, which is why a battery sited here earns the same capacity payment as one in northern Virginia and a materially lower spread.',
     '这是缺口的供给侧成因，同时也是容量富余区域所在。因此，选址于此的储能所获容量收入与位于弗吉尼亚北部者相同，而价差则明显更低。'],
    'PJM 2028/2029 Base Residual Auction report', URL.rpm,
    { operatingCapacity:['Supply mix at 2028/2029: 46% gas, 20% nuclear, 18% coal, 5% demand response','2028/2029年度电源结构：燃气46%、核电20%、燃煤18%、需求响应5%'] }),

  point('appalachia', ['Allegheny and West Virginia — APS', '阿勒格尼与西弗吉尼亚 — APS'], [-79.60, 39.30], 'generation', ['Generation-heavy zone', '发电富余区'], ['past','current','future'],
    ['Generation-rich and export-constrained toward the eastern load pockets. The physical middle of PJM\'s west-to-east transfer problem.',
     '发电资源丰富，向东部负荷孤岛送出受限。这是PJM自西向东输送问题的物理中枢。'],
    ['A transfer constraint that never becomes a locational capacity price, because the auction clears RTO-wide. It shows up in nodal energy and in deliverability tests instead.',
     '这是一项从不转化为区位性容量价格的输送约束，因为拍卖按全RTO统一出清。它转而体现在节点电能量与可交付性检验之中。'],
    'PJM 2028/2029 Base Residual Auction report', URL.rpm,
    { operatingCapacity:['Part of the 202,288 MW ICAP total in the PJM service area','属PJM服务区202,288MW铭牌容量总量的一部分'] }),

  /* ---- the queue, as a place ------------------------------------------- */
  point('queue', ['The interconnection queue — 67 GW of storage', '并网排队队列 — 67GW储能'], [-80.20, 40.60], 'node', ['Queue position', '排队位置'], ['future'],
    ['The reopened queue holds 67 GW of storage and 14 GW of solar against an operating battery fleet of roughly 400 MW. Transition Cycle 1 issued interconnection agreements to 21 battery projects totalling 1.9 GW.',
     '重开的排队队列中有67GW储能与14GW光伏，而在运储能机组仅约400MW。过渡周期一向21个储能项目签发并网协议，合计1.9GW。'],
    ['Drawn as a point because it has no geography and every consequence. It is what closes the Regulation market, relieves the capacity shortage and compresses the TB4 spread — all three at once.',
     '之所以绘制为一个点，是因为它没有地理位置，却影响一切。它将同时关闭调频市场、缓解容量缺口并压缩TB4价差 — 三者同时发生。'],
    'PJM interconnection queue and Transition Cycle 1', URL.queue,
    { layer:'plan', planClass:'process', planClassLabel:['Market or process reform','市场或流程改革'], planYear:2030,
      planStatus:['Reformed cycle operating; queue reopened April 2026','改革后的周期流程已运行；队列于2026年4月重开'],
      plannedCapacity:['67 GW of storage queued; ~5,000 MW expected operating by 2030','排队储能67GW；预计2030年在运约5,000MW'] }),
];

const routes = [
  { id:'west-east', kind:'route', name:['West-to-east transfer — generation to load','自西向东输送 — 由电源至负荷'],
    coords:[[-83.50, 39.90], [-80.20, 39.70], [-77.45, 39.02], [-74.60, 40.10]],
    periods:['current','future'], source:'PJM 2028/2029 Base Residual Auction report', sourceUrl:URL.rpm,
    endpoints:['Ohio Valley – northern Virginia – New Jersey','俄亥俄河谷 — 弗吉尼亚北部 — 新泽西'],
    note:['The path the system actually runs on: surplus generation in the west and the fastest-growing load in the east, with the retiring coal fleet at the western end.',
          '系统实际运行的路径：西部电源富余，东部负荷增长最快，退役中的燃煤机组位于西端。'],
    investor:['There is no named corridor project relieving this. PJM\'s answer is procedural — a Reliability Backstop, a reformed interconnection cycle and Connect and Manage for large loads — so it has no commissioning date to underwrite against.',
              '目前没有任何具名走廊工程缓解该问题。PJM的应对是程序性的 — 可靠性兜底采购、改革后的并网周期流程以及针对大负荷的“接入并管理”框架 — 因此不存在可供承销的投运日期。'],
    operatingCapacity:['138,318 MW UCAP procured for 2028/2029, 6,831 MW short of the reliability requirement','2028/2029年度采购138,318MW UCAP，低于可靠性需求6,831MW'] },

  { id:'rto-capacity', kind:'route', name:['One capacity price, the whole footprint','单一容量价格，覆盖全区域'],
    coords:[[-88.20, 41.60], [-83.50, 39.90], [-79.60, 39.30], [-76.70, 39.15], [-74.60, 40.10]],
    periods:['current'], source:'PJM 2028/2029 Base Residual Auction report', sourceUrl:URL.rpm,
    endpoints:['ComEd – Ohio Valley – APS – SWMAAC – EMAAC','ComEd — 俄亥俄河谷 — APS — SWMAAC — EMAAC'],
    note:['The last three Base Residual Auctions cleared at a single price for the entire RTO — $325.00/MW-day for 2028/2029 and $333.44 for 2027/2028 — with no Locational Deliverability Area separating.',
          '最近三届基准剩余容量拍卖均以单一价格覆盖整个RTO出清 — 2028/2029年度为每MW每日$325.00，2027/2028年度为$333.44 — 各区位可交付区之间无价差。'],
    investor:['Draw the consequence for siting: capacity revenue is identical wherever the asset sits, so the entire locational decision is an energy decision. That is the opposite of Italy, where the TSO buys storage by zone.',
              '由此得出选址结论：无论资产位于何处，容量收入完全相同，因此选址决策完全是电能量决策。这与意大利恰好相反 — 后者由输电运营商按区域采购储能。'],
    operatingCapacity:['$325.00/MW-day RTO-wide for the 2028/2029 delivery year','2028/2029实需年度全RTO每MW每日$325.00'] },

  { id:'reg-footprint', kind:'route', name:['Regulation — one RTO-wide requirement','调频 — 全RTO单一系统需求'],
    coords:[[-87.65, 41.85], [-81.60, 39.80], [-77.45, 39.02]],
    periods:['current','future'], source:'PJM Regulation Redesign Phase 1', sourceUrl:URL.ancillary,
    endpoints:['ComEd – Ohio Valley – northern Virginia','ComEd — 俄亥俄河谷 — 弗吉尼亚北部'],
    note:['The October 2025 Phase 1 redesign consolidated RegA and RegD into a single bidirectional signal and roughly doubled the market from about 320 MW to about 750 MW. Phase 2 in October 2026 splits it into RegUp and RegDown.',
          '2025年10月的第一阶段重构将RegA与RegD合并为单一双向信号，市场规模由约320MW约增至750MW。2026年10月的第二阶段将其拆分为RegUp与RegDown。'],
    investor:['A requirement of about 750 MW is procured across the whole RTO, so every battery in the footprint competes for the same pot. With 67 GW queued behind roughly 400 MW operating, that pot is the binding constraint on the largest observed revenue line.',
              '约750MW的需求在整个RTO范围内采购，因此区域内每一台储能都在争夺同一收入池。在约400MW在运机组身后有67GW排队的情况下，该收入池构成了已观测最大收入项的约束性瓶颈。'],
    operatingCapacity:['≈750 MW of Regulation requirement, RTO-wide','全RTO调频需求约750MW'] },
];

const sourceCatalog = [
  { id:'pjm-map-rpm', owner:'PJM Interconnection', title:'Reliability Pricing Model auction results', url:URL.rpm, format:'HTML + PDF', cadence:'Per auction', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-03' },
  { id:'pjm-map-queue', owner:'PJM Interconnection', title:'Interconnection service request status', url:URL.queue, format:'HTML + XLSX', cadence:'Per cycle', licence:'Publisher reuse terms', automation:'B', checkedAt:'2026-08-03' },
  { id:'pjm-map-elcc', owner:'PJM Interconnection', title:'Effective Load Carrying Capability class ratings', url:URL.elcc, format:'PDF', cadence:'Per delivery year', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-03' },
  { id:'pjm-map-ancillary', owner:'PJM Interconnection', title:'Ancillary services and the Regulation redesign', url:URL.ancillary, format:'HTML + PDF', cadence:'Continuous', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-03' },
  { id:'pjm-map-boundary', owner:'Natural Earth via world-atlas', title:'Countries 110m', url:URL.atlas, format:'TopoJSON', cadence:'Periodic', licence:'Public domain (Natural Earth)', automation:'B', checkedAt:'2026-08-03' },
];

export const PJM_GRID_MAP = {
  id:'pjm-grid-map',
  ariaLabel:['Interactive PJM electricity map','PJM电力交互地图'],
  title:['PJM grid structure by period','PJM不同时期电网结构'],
  defaultPeriod:'current',
  defaultSelectedId:'novadc',
  boundary,
  boundarySource: {
    label: ['Natural Earth 110m via world-atlas', 'Natural Earth 110m（经world-atlas）'],
    url: URL.atlas,
  },
  /* The US outline includes Alaska and Hawaii; these bounds crop to the PJM
     footprint the same way the NEM's crop Australia to its eastern states. */
  viewBounds: [[-90.5, 35.0], [-72.0, 43.5]],
  periodOrder: ['past','current','future'],
  periods: {
    past: {
      label: ['Past · 2010s', '过去 · 2010年代'],
      kicker: ['Structurally long', '结构性容量富余'],
      thesis: ['PJM cleared its capacity auctions comfortably above the reliability requirement for most of the decade, on a thermal fleet sited in the Ohio Valley and Appalachia serving load that was growing slowly.','在该十年的大部分时间里，PJM容量拍卖出清水平明显高于可靠性需求，其火电机组位于俄亥俄河谷与阿巴拉契亚地区，所服务的负荷增长缓慢。'],
      implication: ['Capacity prices were low enough that storage had no contracted route worth modelling. There was no PJM capacity thesis to underwrite.','容量价格之低，使储能不存在值得建模的合同化路径。当时不存在可供承销的PJM容量投资逻辑。'],
    },
    current: {
      label: ['Current · 2026', '当前 · 2026'],
      kicker: ['Load moved, generation did not', '负荷迁移，电源未动'],
      thesis: ['Thermal retirement in the Ohio Valley met data-centre load growth in northern Virginia. The 2027/2028 and 2028/2029 auctions were the first in PJM history where the entire RTO cleared short of its reliability requirement, both at the FERC-approved price cap.','俄亥俄河谷的火电退役遭遇弗吉尼亚北部数据中心负荷增长。2027/2028与2028/2029年度拍卖是PJM历史上首次整个RTO出清低于可靠性需求，且两次均以FERC批准的价格上限成交。'],
      implication: ['A four-hour battery is paid $325.00/MW-day at a 59% accreditation — the best-published capacity payment on this platform, for exactly one delivery year.','四小时储能按59%核证系数获得每MW每日$325.00 — 这是本平台披露最完整的容量收入，而期限恰为一个实需年度。'],
    },
    future: {
      label: ['Planned · 2030', '规划 · 2030'],
      kicker: ['The queue arrives, and the collar does not', '排队产能到位，而价格上下限机制不再'],
      thesis: ['The price collar ends after the 2029/2030 auction and the cap reverts toward a Net CONE-based figure PJM estimates near $550/MW-day, while 67 GW of queued storage begins arriving against a fleet of roughly 400 MW today.','价格上下限机制在2029/2030年度拍卖后终止，上限将回归至PJM估算约每MW每日$550的净新增成本基准；与此同时，排队中的67GW储能将陆续到位，而当前在运规模约为400MW。'],
      implication: ['The two move in opposite directions, which is why the renewal curve in comparison.js rises above its secured year before falling below it. Underwrite the shape, not an average.','二者方向相反，这正是comparison.js中续期曲线先升至已锁定年度之上、随后再降至其下的原因。承销依据应为该形态，而非平均值。'],
    },
  },
  layers: {
    node: { label:['Connection nodes','并网节点'] },
    generation: { label:['Generation','发电'] },
    load: { label:['Demand centres','负荷中心'] },
    route: { label:['Network paths','网络路径'] },
    plan: { label:['Planned build','规划建设'] },
  },
  points,
  routes,
  sourceCatalog,
  scope: [
    'Representative regional orientation only. Markers use approximate locality centroids and do not show spare capacity, queue position, curtailment probability or an investable connection. PJM covers thirteen states and the District of Columbia; the outline is the United States, cropped by view bounds.',
    '仅用于代表性区域方位展示。标记采用近似地点中心坐标，不显示可用容量、队列位置、限电概率或可投资并网权利。PJM覆盖13个州及华盛顿特区；底图轮廓为美国，并按视图范围裁剪。',
  ],
};

export default PJM_GRID_MAP;
