/* ---------------------------------------------------------------------------
   Italy — interactive grid map.

   Representative national orientation only: approximate locality centroids, no
   spare capacity, no queue position, no investable connection.

   Italy is the one map on this platform where the constraint layer and the
   procurement layer are the same thing. Terna set the first MACSE auction
   requirement at zero GWh for the North and Centre-North and put the whole
   10 GWh in the south and the islands, so the zonal split below is not an
   analyst's reading of where congestion binds — it is where the TSO chose to buy
   storage, published by zone with a clearing price attached.

   The three periods: 2010 is a peninsula supplied by thermal generation near its
   northern load; 2026 is renewable generation concentrated in the south and the
   islands with the demand still in the north; 2035 is the system after four
   named submarine links land between 2028 and 2030.
   --------------------------------------------------------------------------- */
import boundary from './it-boundary.json' with { type:'json' };

const URL = {
  macse: 'https://www.terna.it/en/media/press-releases/detail/completed-first-macse-auction',
  plan: 'https://www.terna.it/en/electric-system/grid/national-electricity-transmission-grid-development-plan',
  tyrrhenian: 'https://www.terna.it/en/projects/public-engagement/tyrrhenian-link',
  adriatic: 'https://www.terna.it/en/projects/public-engagement/adriatic-link',
  elmed: 'https://www.terna.it/en/projects/public-engagement/elmed',
  atlas: 'https://github.com/topojson/world-atlas',
};

const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1, ...extra,
});

const points = [
  /* ---- connection nodes ------------------------------------------------- */
  point('battipaglia', ['Battipaglia / Salerno', '巴蒂帕利亚 / 萨莱诺'], [14.97, 40.60], 'node', ['HVDC landing', '高压直流登陆点'], ['current','future'],
    ['Campania landing point of the Tyrrhenian Link east branch, the mainland end of the Sicilian constraint.',
     '第勒尼安互联东段在坎帕尼亚的登陆点，也是西西里约束的大陆侧终点。'],
    ['The mainland side of a constraint whose island side clears MACSE 30% higher. The spread is the constraint, priced.',
     '该约束的大陆侧；其岛屿侧MACSE出清价高出30%。这一价差正是被定价的约束本身。'],
    'Terna Tyrrhenian Link', URL.tyrrhenian),

  point('termini', ['Termini Imerese', '泰尔米尼伊梅雷塞'], [13.70, 37.99], 'node', ['HVDC landing', '高压直流登陆点'], ['current','future'],
    ['Sicilian landing point of the Tyrrhenian Link, in the zone that cleared the highest MACSE price in the country.',
     '第勒尼安互联在西西里的登陆点，位于全国MACSE出清价最高的区域。'],
    ['A MACSE award here runs fifteen years from 2028; the link that relieves the constraint commissions the same year.',
     '此处的MACSE中标合同自2028年起为期十五年；缓解该约束的联络线亦于同年投运。'],
    'Terna MACSE / Tyrrhenian Link', URL.macse),

  point('terramala', ['Terra Mala / Quartu Sant\'Elena', '特拉马拉 / 夸尔图圣埃莱娜'], [9.25, 39.18], 'node', ['HVDC landing', '高压直流登陆点'], ['current','future'],
    ['Sardinian landing of the Tyrrhenian Link west branch; SA.CO.I.3 renews the Corsica–Tuscany route alongside it.',
     '第勒尼安互联西段在撒丁岛的登陆点；SA.CO.I.3工程同步更新科西嘉—托斯卡纳线路。'],
    ['Two interconnectors land here in 2028 into an island already holding close to half the national battery fleet.',
     '两条互联线将于2028年在此登陆，而该岛已持有接近全国半数的储能装机。'],
    'Terna Tyrrhenian Link / SA.CO.I.3', URL.tyrrhenian),

  point('fano', ['Fano', '法诺'], [13.02, 43.84], 'node', ['HVDC landing', '高压直流登陆点'], ['current','future'],
    ['Marche landing of the Adriatic Link, the northern end of the eastern corridor.',
     '亚得里亚海互联在马尔凯大区的登陆点，为东部走廊北端。'],
    ['Cable laying concludes in the first half of 2028 with commissioning in 2029 — a dated relief on the eastern spine.',
     '电缆敷设于2028年上半年完成，2029年投运 — 东部主干线上一项有明确日期的缓解工程。'],
    'Terna Adriatic Link', URL.adriatic),

  point('partanna', ['Partanna', '帕尔坦纳'], [12.89, 37.72], 'node', ['HVDC landing', '高压直流登陆点'], ['future'],
    ['Sicilian landing of ELMED, the 600 MW Italy–Tunisia interconnector.',
     'ELMED在西西里的登陆点，为600MW的意大利—突尼斯互联线。'],
    ['An import corridor rather than an export one. It changes the Sicilian price stack without relieving the export constraint.',
     '这是受入通道而非送出通道。它改变西西里的价格结构，但不缓解送出约束。'],
    'Terna ELMED', URL.elmed),

  /* ---- generation -------------------------------------------------------- */
  point('south-renewables', ['Southern renewables', '南部新能源'], [16.20, 40.70], 'generation', ['Wind and solar', '风电与光伏'], ['current','future'],
    ['The generation concentration that MACSE was zoned around: Terna put the whole first auction requirement here and in the islands.',
     'MACSE分区所围绕的发电集中区：Terna将首次拍卖的全部需求配置于此及岛屿地区。'],
    ['Being where the generation is matters more than being near load in Italy, because the TSO buys storage by zone.',
     '在意大利，靠近发电侧比靠近负荷更重要，因为电网运营商按区域采购储能。'],
    'Terna MACSE zonal requirements', URL.macse,
    { operatingCapacity:['Renewables covered 41% of national demand in 2025','2025年新能源满足全国需求的41%'], size:1.25 }),

  point('sardinia-bess', ['Sardinian storage cluster', '撒丁岛储能集群'], [9.10, 39.90], 'generation', ['BESS', '电池储能'], ['current','future'],
    ['About 800 MW of Italy\'s 1.9 GW operational fleet sits on Sardinia — close to half the national total on a fraction of national load.',
     '意大利1.9GW已投运装机中约800MW位于撒丁岛 — 以占全国一小部分的负荷承载接近半数的全国总量。'],
    ['That concentration is the constraint and the competition at once: MSD depth is being contested by assets already built.',
     '这种集中同时构成约束与竞争：辅助服务市场深度正被已建成资产所争夺。'],
    'Modo Energy Italy Buildout Report', URL.macse,
    { operatingCapacity:['≈800 MW of 1.9 GW national operational fleet','全国1.9GW已投运装机中约800MW'], size:1.15 }),

  point('north-thermal', ['Po Valley thermal', '波河谷火电'], [9.60, 45.30], 'generation', ['Gas', '燃气发电'], ['past','current','future'],
    ['The gas fleet that supplies the northern industrial load and sets the marginal price in the northern zone.',
     '为北部工业负荷供电并决定北部区域边际电价的燃气机组群。'],
    ['Terna\'s DY2028 de-rating proposal shifts capacity market value from batteries back toward gas. Watch it.',
     'Terna针对2028实需年度的折减系数提案将容量市场价值由储能重新转向燃气。需密切关注。'],
    'Terna capacity market', URL.plan,
    { operatingCapacity:['Northern marginal price-setting fleet','北部边际定价机组群'] }),

  /* ---- demand ------------------------------------------------------------ */
  point('milan', ['Milan / Po Valley', '米兰 / 波河谷'], [9.19, 45.46], 'load', ['Industrial and metropolitan load', '工业与大都市负荷'], ['past','current','future'],
    ['Italy\'s industrial core and the destination of the north–south transfer, in the zone with no MACSE route at all.',
     '意大利的工业核心，也是南北输送的目的地，而该区域完全没有MACSE路径。'],
    ['A northern developer has two contracted options, not four: the capacity market or a bilateral toll.',
     '北部开发商只有两种合同化选择而非四种：容量市场或双边租赁。'],
    'Terna / Modo Energy', URL.plan,
    { companies:['Terna', 'Enel Distribuzione', 'A2A', 'Edison'],
      demandScale:['Italy\'s largest industrial and metropolitan load','意大利最大的工业与大都市负荷'] }),

  point('rome', ['Rome / Centre', '罗马 / 中部'], [12.50, 41.90], 'load', ['Metropolitan load', '大都市负荷'], ['past','current','future'],
    ['Central demand centre, on the boundary between the MACSE-eligible south and the ineligible Centre-North.',
     '中部需求中心，位于符合MACSE条件的南部与不符合条件的中北部之间的分界处。'],
    ['Zone eligibility is a hard line in Italy, not a gradient. Confirm which side of it a site sits on before anything else.',
     '在意大利，区域资格是一条硬性界线而非渐变。在其他工作之前，应先确认场址位于界线哪一侧。'],
    'Terna MACSE zonal requirements', URL.macse,
    { companies:['Terna', 'Acea', 'Enel'],
      demandScale:['Central metropolitan load','中部大都市负荷'] }),
];

const route = (id, name, coords, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coords, kind:'route', periods, note, investor, source, sourceUrl, ...extra,
});

const routes = [
  route('tyrrhenian', ['Tyrrhenian Link', '第勒尼安互联'],
    [[13.70, 37.99], [14.30, 39.40], [14.97, 40.60]], ['future'],
    ['Part of a 1,000 MW, 970 km, €3.7bn double 500 kV HVDC submarine scheme connecting Sicily to Campania and to Sardinia.',
     '1,000MW、970公里、37亿欧元双回500千伏海底高压直流工程的一部分，连接西西里与坎帕尼亚及撒丁岛。'],
    ['Under construction since January 2025 with the western branch cable already installed. The most advanced relief on this map.',
     '自2025年1月起施工，西段电缆已敷设完成。本图中进展最快的缓解工程。'],
    'Terna', URL.tyrrhenian,
    { layer:'plan', planClass:'construction', planClassLabel:['In construction','在建'], planYear:2028,
      planStatus:['Under construction since January 2025','自2025年1月起施工'],
      endpoints:['Sicily – Campania, with a western branch to Sardinia','西西里至坎帕尼亚，西段延伸至撒丁岛'],
      plannedCapacity:['1,000 MW, commissioning 2028','1,000MW，2028年投运'] }),

  route('tyrrhenian-west', ['Tyrrhenian Link — West branch', '第勒尼安互联 — 西段'],
    [[9.25, 39.18], [11.00, 39.00], [13.70, 37.99]], ['future'],
    ['The Sardinia arm of the same scheme, landing at Terra Mala near Quartu Sant\'Elena.',
     '同一工程的撒丁岛支线，在夸尔图圣埃莱娜附近的特拉马拉登陆。'],
    ['Sardinia gains two interconnectors in 2028 while already holding close to half the national battery fleet.',
     '撒丁岛将于2028年新增两条互联线，而其已持有接近全国半数的储能装机。'],
    'Terna', URL.tyrrhenian,
    { layer:'plan', planClass:'construction', planClassLabel:['In construction','在建'], planYear:2028,
      planStatus:['Under construction; western branch cable installed','在建；西段电缆已敷设'],
      endpoints:['Sardinia – Sicily','撒丁岛至西西里'],
      plannedCapacity:['Part of the 1,000 MW scheme, commissioning 2028','属1,000MW工程的一部分，2028年投运'] }),

  route('adriatic', ['Adriatic Link', '亚得里亚海互联'],
    [[13.02, 43.84], [13.60, 43.10], [14.13, 42.35]], ['future'],
    ['1,000 MW HVDC over 250 km, of which 210 km submarine, from Fano in Marche to the Cepagatti area in Abruzzo.',
     '1,000MW高压直流，全长250公里，其中海底段210公里，自马尔凯大区法诺至阿布鲁佐大区切帕加蒂地区。'],
    ['Cable supply and installation contracted at about €630m; laying concludes in the first half of 2028.',
     '电缆供应与敷设合同金额约6.3亿欧元；敷设于2028年上半年完成。'],
    'Terna / Prysmian', URL.adriatic,
    { layer:'plan', planClass:'construction', planClassLabel:['In construction','在建'], planYear:2029,
      planStatus:['Under construction, cable contracted; laying concludes in the first half of 2028','在建，电缆已签约；敷设于2028年上半年完成'],
      endpoints:['Fano, Marche – Cepagatti, Abruzzo','马尔凯大区法诺至阿布鲁佐大区切帕加蒂'],
      plannedCapacity:['1,000 MW, commissioning 2029','1,000MW，2029年投运'] }),

  route('elmed', ['ELMED', 'ELMED互联'],
    [[12.89, 37.72], [11.50, 36.50], [10.50, 36.00]], ['future'],
    ['600 MW over roughly 200 km of HVDC submarine cable between Sicily and Tunisia, EU PCI-supported.',
     '西西里与突尼斯之间约200公里的600MW海底高压直流电缆，获欧盟共同利益项目支持。'],
    ['An import corridor. It changes the Sicilian price stack without relieving the export constraint a battery is sited for.',
     '这是受入通道。它改变西西里的价格结构，但不缓解储能选址所依据的送出约束。'],
    'Terna / STEG', URL.elmed,
    { layer:'plan', planClass:'delivery', planClassLabel:['In delivery','交付中'], planYear:2028,
      planStatus:['In delivery under an EU-supported programme','在欧盟支持的计划下交付中'],
      endpoints:['Partanna, Sicily – Tunisia','西西里帕尔坦纳至突尼斯'],
      plannedCapacity:['600 MW, commissioning 2028','600MW，2028年投运'] }),
];

const sourceCatalog = [
  { id:'it-map-macse', owner:'Terna', title:'MACSE first auction results', url:URL.macse, format:'HTML + PDF', cadence:'Per auction round', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-02' },
  { id:'it-map-plan', owner:'Terna', title:'Development Plan 2025–2034', url:URL.plan, format:'PDF', cadence:'Annual planning cycle', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-02' },
  { id:'it-map-tyrrhenian', owner:'Terna', title:'Tyrrhenian Link', url:URL.tyrrhenian, format:'HTML', cadence:'Project milestones', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-02' },
  { id:'it-map-adriatic', owner:'Terna', title:'Adriatic Link', url:URL.adriatic, format:'HTML', cadence:'Project milestones', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-02' },
  { id:'it-map-elmed', owner:'Terna', title:'ELMED Italy–Tunisia interconnector', url:URL.elmed, format:'HTML', cadence:'Project milestones', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-02' },
  { id:'it-map-boundary', owner:'Natural Earth via world-atlas', title:'Countries 110m', url:URL.atlas, format:'TopoJSON', cadence:'Periodic', licence:'Public domain (Natural Earth)', automation:'B', checkedAt:'2026-08-02' },
];

export const IT_GRID_MAP = {
  id:'it-grid-map',
  ariaLabel:['Interactive Italy electricity map','意大利电力交互地图'],
  title:['Italy grid structure by period','意大利不同时期电网结构'],
  defaultPeriod:'current',
  defaultSelectedId:'termini',
  boundary,
  boundarySource: {
    label: ['Natural Earth 110m via world-atlas', 'Natural Earth 110m（经world-atlas）'],
    url: URL.atlas,
  },
  periodOrder: ['past','current','future'],
  periods: {
    past: {
      label: ['Past · 2010', '过去 · 2010'],
      kicker: ['Thermal near the load', '火电紧邻负荷'],
      thesis: ['A peninsula supplied largely by gas generation sited near the northern industrial load, with the islands running as weakly connected systems of their own.','半岛主要由靠近北部工业负荷的燃气机组供电，岛屿则作为弱联网的独立系统运行。'],
      implication: ['Zonal prices existed but the constraint that now defines the market — southern renewables against northern demand — had not yet formed.','当时已有分区电价，但如今定义该市场的约束 — 南部新能源与北部需求之间的矛盾 — 尚未形成。'],
    },
    current: {
      label: ['Current · 2026', '当前 · 2026'],
      kicker: ['Generation south, demand north, storage bought by zone', '发电在南、需求在北、储能按区域采购'],
      thesis: ['Renewables covered 41% of national demand in 2025 and are concentrated in the south and the islands, while industrial demand stays in the Po Valley. Terna answered with MACSE, buying 10 GWh of storage exclusively in the south and the islands.','2025年新能源满足全国需求的41%，且集中于南部与岛屿地区，而工业需求仍位于波河谷。Terna以MACSE作为应对，专门在南部与岛屿采购10GWh储能。'],
      implication: ['Italy keeps zonal pricing and runs a zonal procurement on top of it. Sicily cleared 30% above Sud e Calabria for the same product — the clearest published locational signal on this platform.','意大利保留分区电价，并在其之上叠加分区采购。西西里同一产品出清价高出南部及卡拉布里亚30% — 这是本平台最清晰的公开区位信号。'],
    },
    future: {
      label: ['Planned · 2035', '规划 · 2035'],
      kicker: ['Four submarine links', '四条海底联络线'],
      thesis: ['The Tyrrhenian Link, Adriatic Link, SA.CO.I.3 and ELMED land between 2028 and 2030, inside a Development Plan committing more than €23bn over ten years.','第勒尼安互联、亚得里亚海互联、SA.CO.I.3与ELMED将于2028至2030年间陆续投运，纳入十年投资超过230亿欧元的发展规划。'],
      implication: ['A MACSE award runs fifteen years from 2028 and the links that relieve the constraints behind it commission in the same window. Underwrite the contract, not the scarcity.','MACSE中标合同自2028年起为期十五年，而缓解其背后约束的联络线在同一窗口期内投运。承销依据应为合同本身，而非稀缺性。'],
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

export default IT_GRID_MAP;
