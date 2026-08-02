/* ---------------------------------------------------------------------------
   Germany — interactive grid map.

   Representative national orientation only: approximate locality centroids, no
   spare capacity, no queue position, no investable connection.

   The three periods are the German energy transition read as a transmission
   problem. 2010 is a system where generation and load sat together — Ruhr coal
   beside Ruhr industry, Bavarian nuclear beside Bavarian industry. 2026 is the
   gap that opened when the nuclear fleet closed in the south and the wind fleet
   grew in the north, with four HVDC corridors under construction to close it.
   2035 is the system after they land, if they land on time; all four are
   reported as running late.
   --------------------------------------------------------------------------- */
import boundary from './de-boundary.json' with { type:'json' };

const URL = {
  bnetza: 'https://www.bundesnetzagentur.de/EN/Areas/Energy/Companies/GridDevelopment/start.html',
  suedlink: 'https://www.tennet.eu/de/projekte/suedlink',
  suedostlink: 'https://www.bundesnetzagentur.de/SharedDocs/Pressemitteilungen/EN/2025/20250725_SOL.html',
  ultranet: 'https://www.bundesnetzagentur.de/SharedDocs/Pressemitteilungen/EN/2025/20251031_Ultranet.html',
  smard: 'https://www.smard.de/en',
  atlas: 'https://github.com/topojson/world-atlas',
};

const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1, ...extra,
});

const points = [
  /* ---- connection nodes ------------------------------------------------- */
  point('brunsbuettel', ['Brunsbüttel / Wilster', '布伦斯比特尔 / 维尔斯特'], [9.13, 53.90], 'node', ['HVDC converter', '高压直流换流站'], ['current','future'],
    ['Northern terminal of SuedLink, in the Schleswig-Holstein wind belt where curtailment concentrates.',
     'SuedLink北端，位于石勒苏益格-荷尔斯泰因风电带，限电集中于此。'],
    ['A northern battery sees the surplus but pays to move it south. The corridor it depends on commissions at the end of 2028.',
     '北部储能可获取过剩电量，但南送需付出代价。其所依赖的走廊将于2028年底投运。'],
    'TenneT SuedLink', URL.suedlink),

  point('wolmirstedt', ['Wolmirstedt', '沃尔米尔施泰特'], [11.63, 52.25], 'node', ['HVDC converter', '高压直流换流站'], ['current','future'],
    ['Northern terminal of SuedOstLink, whose final section the Bundesnetzagentur approved in July 2025.',
     'SuedOstLink北端，其最后一段已于2025年7月获联邦网络管理局批准。'],
    ['An approved route is not an energised one. Confirm which construction tranche a connection offer assumes.',
     '获批路径不等于已送电路径。须确认并网要约所假设的具体施工批次。'],
    'Bundesnetzagentur', URL.suedostlink),

  point('osterath', ['Osterath', '奥斯特拉特'], [6.65, 51.26], 'node', ['HVDC converter', '高压直流换流站'], ['current','future'],
    ['Junction of A-Nord and Ultranet in the Rhine industrial belt — the point where northern wind meets western load.',
     'A-Nord与Ultranet在莱茵工业带的交汇点 — 北部风电与西部负荷的衔接处。'],
    ['Ultranet was fully approved on 31 October 2025 with commissioning at the end of 2026, the nearest relief date in Germany.',
     'Ultranet已于2025年10月31日全面获批，2026年底投运，是德国最近的一个缓解时点。'],
    'Bundesnetzagentur Ultranet', URL.ultranet),

  point('isar', ['Isar', '伊萨尔'], [12.29, 48.60], 'node', ['HVDC converter', '高压直流换流站'], ['current','future'],
    ['Southern terminal of SuedOstLink in Bavaria, the area carrying most of Germany\'s PV curtailment.',
     'SuedOstLink位于巴伐利亚的南端，该地区承担了德国大部分光伏限电。'],
    ['Bavaria is where the cheap charging is and where the capacity route is priced against you — a €16,000/MW bid deduction applies to southern projects.',
     '巴伐利亚既是低价充电所在地，也是容量路径对你不利之处 — 南部项目须扣减每MW €16,000后方予评估。'],
    'Bundesnetzagentur', URL.suedostlink),

  point('grafenrheinfeld', ['Grafenrheinfeld', '格拉芬赖恩费尔德'], [10.19, 49.98], 'node', ['HVDC converter / former nuclear', '高压直流换流站 / 原核电站'], ['past','current','future'],
    ['A retired nuclear site now serving as SuedLink\'s southern terminal — the transition in one location.',
     '已退役的核电站厂址，现作为SuedLink南端 — 能源转型在单一地点的缩影。'],
    ['Retired generation frees network capability at a known node. It is the clearest siting signal Germany offers.',
     '退役机组在已知节点释放网络能力，这是德国所能提供的最明确选址信号。'],
    'TenneT SuedLink', URL.suedlink),

  /* ---- generation -------------------------------------------------------- */
  point('north-wind', ['North German wind', '德国北部风电'], [9.50, 54.20], 'generation', ['Onshore and offshore wind', '陆上与海上风电'], ['current','future'],
    ['The wind fleet whose output the north–south corridors exist to move; offshore curtailment ran 4,562 GWh in 2024.',
     '南北走廊正是为输送该风电群出力而建；2024年海上风电限电达4,562GWh。'],
    ['Curtailment here is compensated to the generator, not to a battery that absorbs it. The battery earns the price, not the payment.',
     '此处限电补偿支付给发电方，而非吸纳电量的储能。储能赚取的是价格，而非补偿。'],
    'Bundesnetzagentur', URL.bnetza,
    { operatingCapacity:['Offshore curtailment 4,562 GWh in 2024, −20% year on year','2024年海上风电限电4,562GWh，同比下降20%'], size:1.25 }),

  point('bavaria-pv', ['Bavarian solar', '巴伐利亚光伏'], [11.50, 48.80], 'generation', ['Solar PV', '光伏发电'], ['current','future'],
    ['986 GWh of curtailment in 2024 — 71% of the national PV total on a base of 1,389 GWh.',
     '2024年限电986GWh — 占全国光伏限电总量1,389GWh的71%。'],
    ['A daily, seasonal and predictable midday charging window. It is the shape a four-hour asset is built for, and it is already inside the merchant seed.',
     '每日、季节性且可预测的午间充电窗口。这正是四小时资产的设计场景，且已包含在市场化收入种子值之中。'],
    'Bundesnetzagentur / pv magazine', URL.bnetza,
    { operatingCapacity:['986 GWh curtailed in 2024, 71% of the national PV total','2024年限电986GWh，占全国光伏限电的71%'], size:1.2 }),

  point('rhine-coal', ['Rhenish lignite', '莱茵褐煤'], [6.60, 50.95], 'generation', ['Lignite', '褐煤发电'], ['past','current'],
    ['The western lignite cluster that anchored the 2010 system, now retiring.',
     '支撑2010年电力系统的西部褐煤集群，现正陆续退役。'],
    ['Retirement changes fault level, inertia and local flows — which is what the Momentanreserve product now pays for.',
     '退役将改变短路水平、惯量与本地潮流 — 这正是Momentanreserve产品目前所支付的内容。'],
    'Bundesnetzagentur', URL.bnetza,
    { operatingCapacity:['Lignite fleet retiring through the late 2020s','褐煤机组将于2020年代末陆续退役'] }),

  /* ---- demand ------------------------------------------------------------ */
  point('ruhr', ['Rhine-Ruhr', '莱茵-鲁尔'], [7.00, 51.40], 'load', ['Industrial and metropolitan load', '工业与大都市负荷'], ['past','current','future'],
    ['Germany\'s largest industrial and population cluster, served by A-Nord and Ultranet.',
     '德国最大的工业与人口集群，由A-Nord与Ultranet供电。'],
    ['Western load is reached by two corridors landing at Osterath. Both are dependencies, not headroom.',
     '西部负荷由两条走廊经Osterath接入。二者均属依赖项，而非可用容量。'],
    'Bundesnetzagentur', URL.bnetza,
    { companies:['Amprion', 'RWE', 'Westnetz', 'thyssenkrupp'],
      demandScale:['Largest industrial load cluster in Germany','德国最大的工业负荷集群'] }),

  point('munich', ['Munich / southern Bavaria', '慕尼黑 / 巴伐利亚南部'], [11.58, 48.14], 'load', ['Metropolitan and industrial load', '大都市与工业负荷'], ['past','current','future'],
    ['Southern load centre, structurally short since the nuclear closures and the destination of SuedOstLink.',
     '南部负荷中心，自核电关停以来结构性电力短缺，也是SuedOstLink的终点。'],
    ['Munich is where the highest reported Baukostenzuschuss was levied — about €165,000/MW at SWM Infrastruktur.',
     '慕尼黑是已报告并网工程费分摊最高之处 — SWM Infrastruktur约为每MW €165,000。'],
    'White & Case / energy-storage.news', URL.bnetza,
    { companies:['SWM Infrastruktur', 'TenneT', 'Bayernwerk'],
      demandScale:['Southern load centre, short since the nuclear closures','南部负荷中心，自核电关停以来持续短缺'] }),
];

const route = (id, name, coords, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coords, kind:'route', periods, note, investor, source, sourceUrl, ...extra,
});

const routes = [
  route('ultranet', ['Ultranet', 'Ultranet输电工程'],
    [[6.65, 51.26], [7.50, 50.30], [8.44, 49.25]], ['future'],
    ['2 GW HVDC from Osterath to Philippsburg, fully approved by the Bundesnetzagentur on 31 October 2025.',
     '2GW高压直流，自Osterath至Philippsburg，已于2025年10月31日获联邦网络管理局全面批准。'],
    ['The nearest German relief date — end of 2026. A congestion case in the west has the shortest runway on this map.',
     '德国最近的缓解时点 — 2026年底。西部拥塞投资逻辑在本图中剩余期最短。'],
    'Bundesnetzagentur', URL.ultranet,
    { endpoints:['Osterath – Philippsburg','Osterath至Philippsburg'],
      plannedCapacity:['2 GW, commissioning end 2026','2GW，2026年底投运'] }),

  route('a-nord', ['A-Nord', 'A-Nord输电工程'],
    [[7.21, 53.37], [7.00, 52.30], [6.65, 51.26]], ['future'],
    ['About 2 GW of HVDC from Emden on the North Sea coast to Osterath in the Rhine industrial belt.',
     '约2GW高压直流，自北海沿岸Emden至莱茵工业带Osterath。'],
    ['Pairs with Ultranet at Osterath: together they carry northern wind into the western load centre.',
     '与Ultranet在Osterath衔接：两者共同将北部风电输送至西部负荷中心。'],
    'Amprion', URL.bnetza,
    { endpoints:['Emden – Osterath','Emden至Osterath'],
      plannedCapacity:['~2 GW, commissioning 2027','约2GW，2027年投运'] }),

  route('suedostlink', ['SuedOstLink', 'SuedOstLink输电工程'],
    [[11.63, 52.25], [12.00, 50.40], [12.29, 48.60]], ['future'],
    ['2 GW at 525 kV from Wolmirstedt to Isar; the final section was approved in July 2025.',
     '2GW、525千伏，自Wolmirstedt至Isar；最后一段已于2025年7月获批。'],
    ['This is the corridor that relieves Bavarian PV curtailment, which is the most locational opportunity in Germany.',
     '该走廊将缓解巴伐利亚光伏限电，而后者是德国区位属性最强的机会。'],
    'Bundesnetzagentur', URL.suedostlink,
    { endpoints:['Wolmirstedt – Isar','Wolmirstedt至Isar'],
      plannedCapacity:['2 GW, commissioning 2027','2GW，2027年投运'] }),

  route('suedlink', ['SuedLink', 'SuedLink输电工程'],
    [[9.13, 53.90], [10.00, 51.80], [10.19, 49.98]], ['future'],
    ['About 4 GW over roughly 700 km, Brunsbüttel and Wilster to Grafenrheinfeld; the largest of the four corridors.',
     '约4GW、约700公里，自Brunsbüttel与Wilster至Grafenrheinfeld；四条走廊中规模最大。'],
    ['The largest single piece of German congestion relief, and the latest — end of 2028, with the first underground cable section completed in 2026.',
     '德国规模最大的单项拥塞缓解工程，也是最晚投运的一项 — 2028年底，首段地下电缆已于2026年完工。'],
    'TenneT / TransnetBW', URL.suedlink,
    { endpoints:['Brunsbüttel and Wilster – Grafenrheinfeld','Brunsbüttel与Wilster至Grafenrheinfeld'],
      plannedCapacity:['~4 GW, commissioning end 2028','约4GW，2028年底投运'] }),
];

const sourceCatalog = [
  { id:'de-map-bnetza', owner:'Bundesnetzagentur', title:'Grid development and congestion management', url:URL.bnetza, format:'HTML + PDF', cadence:'Annual with quarterly updates', licence:'Federal authority reuse terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'de-map-suedlink', owner:'TenneT', title:'SuedLink', url:URL.suedlink, format:'HTML', cadence:'Project milestones', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'de-map-suedostlink', owner:'Bundesnetzagentur', title:'SuedOstLink final section approved', url:URL.suedostlink, format:'HTML', cadence:'Project milestones', licence:'Federal authority reuse terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'de-map-ultranet', owner:'Bundesnetzagentur', title:'Ultranet fully approved', url:URL.ultranet, format:'HTML', cadence:'Project milestones', licence:'Federal authority reuse terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'de-map-smard', owner:'Bundesnetzagentur', title:'SMARD electricity market data', url:URL.smard, format:'HTML + CSV', cadence:'Continuous', licence:'Federal authority reuse terms', automation:'B', checkedAt:'2026-08-01' },
  { id:'de-map-boundary', owner:'Natural Earth via world-atlas', title:'Countries 110m', url:URL.atlas, format:'TopoJSON', cadence:'Periodic', licence:'Public domain (Natural Earth)', automation:'B', checkedAt:'2026-08-01' },
];

export const DE_GRID_MAP = {
  id:'de-grid-map',
  ariaLabel:['Interactive Germany electricity map','德国电力交互地图'],
  title:['Germany grid structure by period','德国不同时期电网结构'],
  defaultPeriod:'current',
  defaultSelectedId:'bavaria-pv',
  boundary,
  boundarySource: {
    label: ['Natural Earth 110m via world-atlas', 'Natural Earth 110m（经world-atlas）'],
    url: URL.atlas,
  },
  periodOrder: ['past','current','future'],
  periods: {
    past: {
      label: ['Past · 2010', '过去 · 2010'],
      kicker: ['Generation beside load', '电源与负荷同处一地'],
      thesis: ['Rhenish lignite sat beside Ruhr industry and Bavarian nuclear beside Bavarian industry, so the transmission system moved relatively little power over long distances.','莱茵褐煤紧邻鲁尔工业区，巴伐利亚核电紧邻巴伐利亚工业区，因此输电系统的长距离输送量相对有限。'],
      implication: ['Congestion was a local matter. The national north–south transfer problem had not yet been created.','拥塞属于本地问题，全国性的南北输送难题尚未形成。'],
    },
    current: {
      label: ['Current · 2026', '当前 · 2026'],
      kicker: ['Wind north, load south, one price', '风电在北、负荷在南、单一价格'],
      thesis: ['Nuclear closed in the south while wind grew in the north, and the wires between them have not caught up: congestion management cost about €3.1bn in 2025 on 15.5 TWh of downward redispatch.','南部核电关停而北部风电增长，两者之间的电网未能跟上：2025年拥塞管理成本约31亿欧元，下调再调度电量达15.5太瓦时。'],
      implication: ['Germany rejected the bidding-zone split in December 2025, so none of that reaches a locational price. Congestion is socialised, and a battery captures it only as cheap charging.','德国已于2025年12月否决报价区拆分，因此上述成本均未转化为区位价格。拥塞被社会化分摊，储能仅能以低价充电的形式获取其价值。'],
    },
    future: {
      label: ['Planned · 2035', '规划 · 2035'],
      kicker: ['Ten gigawatts of HVDC', '十吉瓦高压直流'],
      thesis: ['Ultranet, A-Nord, SuedOstLink and SuedLink together carry roughly 10 GW and land between the end of 2026 and the end of 2028.','Ultranet、A-Nord、SuedOstLink与SuedLink合计约10GW，将于2026年底至2028年底之间陆续投运。'],
      implication: ['All four are reported as running late, which is the only reason a German congestion thesis has a runway. Underwrite the named corridor, never the programme.','四条走廊均有延期报道，这也是德国拥塞投资逻辑尚有窗口期的唯一原因。承销依据应为具名走廊，绝不可依据整体计划。'],
    },
  },
  layers: {
    node: { label:['Connection nodes','并网节点'] },
    generation: { label:['Generation','发电'] },
    load: { label:['Demand centres','负荷中心'] },
    route: { label:['Network paths','网络路径'] },
  },
  points,
  routes,
  sourceCatalog,
  scope: [
    'Representative national orientation only. Markers use approximate locality centroids and do not show spare capacity, queue position, curtailment probability or an investable connection.',
    '仅用于代表性全国方位展示。标记采用近似地点中心坐标，不显示可用容量、队列位置、限电概率或可投资并网权利。',
  ],
};

export default DE_GRID_MAP;
