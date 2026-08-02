/* ---------------------------------------------------------------------------
   NEM — interactive grid map.

   Representative national orientation only, on the same terms as every other map
   on this platform: approximate locality centroids, no spare capacity, no queue
   position, no investable connection.

   The map is drawn on the Australian outline but `viewBounds` narrows it to the
   NEM's eastern and southern footprint, because the NEM does not include Western
   Australia — that is the WEM, and it is a separate market on this platform with
   its own map. The two together are the reason the home-page globe now routes
   the Australian polygon to the NEM and the WA state outline on top of it to the
   WEM.

   What the three periods show. 2010 is a coal-anchored system: generation sits on
   the coalfields — Hunter Valley, Latrobe Valley, Central Queensland — and flows
   toward the coastal capitals. 2026 is the transition mid-point, with renewable
   energy zones inland and the first interconnector-scale reinforcements
   energising. 2035 is the ISP's optimal development path, by which point the
   named projects below have either landed or slipped.
   --------------------------------------------------------------------------- */
import boundary from './au-boundary.json' with { type:'json' };

const URL = {
  isp: 'https://www.aemo.com.au/energy-systems/major-publications/integrated-system-plan-isp',
  humelink: 'https://www.transgrid.com.au/projects-innovation/humelink',
  cwo: 'https://www.energyco.nsw.gov.au/our-projects/central-west-orana-renewable-energy-zone/transmission-project',
  pec: 'https://www.electranet.com.au/projects/project-energyconnect/',
  marinus: 'https://www.marinuslink.com.au/',
  copperstring: 'https://www.powerlink.com.au/projects/copperstring',
  snowy: 'https://www.snowyhydro.com.au/snowy-20/about/',
  atlas: 'https://github.com/topojson/world-atlas',
};

const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1, ...extra,
});

const points = [
  /* ---- connection nodes ------------------------------------------------- */
  point('wagga', ['Wagga Wagga', '瓦加瓦加'], [147.37, -35.12], 'node', ['500 kV junction node', '500千伏枢纽节点'], ['past','current','future'],
    ['Where three interconnector-scale flows meet: Project EnergyConnect from South Australia, HumeLink from the Snowy scheme and VNI West from Victoria.',
     '三条互联规模潮流的交汇点：来自南澳的Project EnergyConnect、来自雪山工程的HumeLink，以及来自维多利亚的VNI West。'],
    ['A project here is exposed to three commissioning schedules at once. Ask which of the three the connection offer assumes, and what happens to the study if one slips.',
     '此处的项目同时暴露于三项工程的投运进度。应追问并网要约假设了其中哪一项，以及若其中一项延期，研究结论将如何变化。'],
    'AEMO 2026 ISP', URL.isp),

  point('merotherie', ['Merotherie / Central-West Orana', 'Merotherie / 中西部奥拉纳'], [149.35, -32.15], 'node', ['REZ energy hub', '可再生能源区枢纽'], ['current','future'],
    ['The NSW Central-West Orana renewable energy zone hub, under construction to connect 7.7 GW of wind and solar.',
     '新南威尔士中西部奥拉纳可再生能源区枢纽，正在建设中，用于接入7.7GW风电与光伏。'],
    ['A REZ access scheme rations connection by a published headroom decision. Being inside the zone is not access — confirm the scheme round and the allocated MW.',
     '可再生能源区接入机制依据公开的容量裕度决定进行配给。位于区内并不等于获得接入权 — 须确认接入机制的轮次及所分配的MW。'],
    'EnergyCo NSW', URL.cwo),

  point('robertstown', ['Robertstown', '罗伯茨敦'], [139.08, -33.98], 'node', ['Interconnector terminal', '互联线路端站'], ['current','future'],
    ['South Australian terminal of Project EnergyConnect, fully energised in June 2026.',
     'Project EnergyConnect的南澳端站，已于2026年6月全面送电。'],
    ['This is the platform\'s worked example of relief arriving on schedule. A 2024 congestion case written here is now substantially spent.',
     '这是本平台关于缓解措施如期到位的实证案例。2024年在此撰写的拥塞投资逻辑，如今已大体兑现。'],
    'ElectraNet / Transgrid', URL.pec),

  point('kerang', ['Kerang', '克朗'], [143.92, -35.73], 'node', ['Transmission node', '输电节点'], ['current','future'],
    ['North-west Victorian node on the VNI West corridor, in the area with the NEM\'s highest negative-price incidence.',
     'VNI West走廊上的维多利亚西北部节点，位于NEM负电价发生率最高的区域。'],
    ['High negative-price incidence is a charging opportunity and an export constraint at the same time. Model both legs separately before netting them.',
     '高负电价发生率同时意味着充电机会与送出约束。在轧差之前，应分别对两侧建模。'],
    'AEMO 2026 ISP', URL.isp),

  point('bannaby', ['Bannaby', '班纳比'], [149.80, -34.50], 'node', ['500 kV node', '500千伏节点'], ['past','current','future'],
    ['Southern NSW node on the HumeLink corridor, feeding the Sydney load centre.',
     'HumeLink走廊上的新南威尔士南部节点，向悉尼负荷中心供电。'],
    ['Proximity to Sydney load improves the marginal loss factor but does not confer export headroom — the two are settled separately.',
     '靠近悉尼负荷有助于改善边际损耗系数，但不带来送出容量 — 二者分别结算。'],
    'Transgrid HumeLink', URL.humelink),

  point('townsville', ['Townsville / Hughenden', '汤斯维尔 / 休恩登'], [146.20, -20.10], 'node', ['CopperString corridor', 'CopperString走廊'], ['future'],
    ['North Queensland node on the CopperString corridor, with major construction from 2028 and operations from 2032.',
     'CopperString走廊上的北昆士兰节点，2028年起大规模施工，2032年投运。'],
    ['A 2032 commissioning is outside a fifteen-year window opened today only at the far end. Treat it as optionality, not as a modelled connection.',
     '2032年投运仅处于今日开启的十五年窗口的末端。应视为选择权，而非已建模的并网条件。'],
    'Powerlink CopperString', URL.copperstring),

  /* ---- generation -------------------------------------------------------- */
  point('hunter', ['Hunter Valley thermal', '猎人谷火电群'], [150.90, -32.40], 'generation', ['Coal', '煤电'], ['past','current'],
    ['The largest coal cluster in the NEM and the anchor of the 2010 system; retiring through the late 2020s and early 2030s.',
     'NEM中最大的煤电集群，也是2010年电力系统的支点；将于2020年代末至2030年代初陆续退役。'],
    ['A retiring coal node frees network capability at a known place on a known date, which is the clearest siting signal in the NEM.',
     '退役煤电节点将在已知地点、已知时间释放网络能力，这是NEM中最明确的选址信号。'],
    'AEMO 2026 ISP', URL.isp, { operatingCapacity:['Multi-GW coal cluster, retiring through the late 2020s','数GW煤电集群，将于2020年代末陆续退役'] }),

  point('latrobe', ['Latrobe Valley thermal', '拉筹伯谷火电群'], [146.57, -38.25], 'generation', ['Brown coal', '褐煤发电'], ['past','current'],
    ['Victoria\'s brown-coal generation centre, feeding Melbourne and the Victorian industrial load.',
     '维多利亚褐煤发电中心，向墨尔本及维多利亚工业负荷供电。'],
    ['Victorian retirement dates set the pace of the spread bulge the merchant case depends on. Underwrite the announced dates, not the ambition.',
     '维多利亚的退役时间表决定了市场化投资逻辑所依赖的价差扩大节奏。应以已公布日期而非目标为承销依据。'],
    'AEMO 2026 ISP', URL.isp, { operatingCapacity:['Brown-coal fleet, closure dates published by owners','褐煤机组，业主已公布关停日期'] }),

  point('snowy', ['Snowy 2.0', '雪山2.0'], [148.40, -35.90], 'generation', ['Pumped hydro', '抽水蓄能'], ['future'],
    ['2,200 MW of pumped hydro currently stranded behind the southern NSW constraint that HumeLink is built to relieve.',
     '2,200MW抽水蓄能目前受困于新南威尔士南部约束之后，而HumeLink正是为缓解该约束而建。'],
    ['This is the competitor a southern NSW battery inherits when the constraint clears. Relief and new competition arrive on the same date.',
     '这是约束解除后新南威尔士南部储能将面对的竞争者。缓解与新增竞争在同一天到来。'],
    'Snowy Hydro', URL.snowy, { plannedCapacity:['2,200 MW, unlocked by HumeLink','2,200MW，由HumeLink释放'], size:1.2 }),

  point('cwo-renewables', ['Central-West Orana wind and solar', '中西部奥拉纳风电与光伏'], [149.10, -32.40], 'generation', ['Wind and solar', '风电与光伏'], ['current','future'],
    ['7.7 GW of wind and solar to be connected by the Central-West Orana REZ transmission project.',
     '将由中西部奥拉纳可再生能源区输电工程接入的7.7GW风电与光伏。'],
    ['Curtailment concentrates where large new generation connects to networks built for local demand. This is that place in NSW.',
     '限电集中于大量新增发电接入原本为本地负荷设计的电网之处。这里正是新南威尔士的此类区域。'],
    'EnergyCo NSW', URL.cwo, { plannedCapacity:['7.7 GW connecting via the REZ','通过可再生能源区接入7.7GW'], size:1.25 }),

  point('sa-wind', ['South Australian wind and solar', '南澳风电与光伏'], [138.30, -33.20], 'generation', ['Wind and solar', '风电与光伏'], ['past','current','future'],
    ['The most renewable-dominated region in the NEM; 38% of utility-scale solar was curtailed in 2025.',
     'NEM中可再生能源占比最高的区域；2025年公用事业级光伏限电比例达38%。'],
    ['Project EnergyConnect materially changed this in June 2026. Any curtailment history before that date is a different system.',
     'Project EnergyConnect已于2026年6月对此产生实质改变。该日期之前的任何限电历史均属另一个系统。'],
    'WattClarity / AEMO', URL.isp, { operatingCapacity:['38% of utility-scale solar curtailed in 2025','2025年公用事业级光伏限电比例38%'], size:1.15 }),

  /* ---- demand ------------------------------------------------------------ */
  point('sydney', ['Sydney', '悉尼'], [151.21, -33.87], 'load', ['Metropolitan load centre', '大都市负荷中心'], ['past','current','future'],
    ['The largest load centre in the NEM and the destination of the southern and western NSW corridors.',
     'NEM中最大的负荷中心，也是新南威尔士南部与西部走廊的终点。'],
    ['Siting near load improves the loss factor, which is a permanent settlement multiplier rather than a one-off.',
     '靠近负荷选址可改善损耗系数，而该系数是永久性的结算乘数而非一次性因素。'],
    'AEMO 2026 ISP', URL.isp,
    { companies:['Transgrid', 'Ausgrid', 'EnergyAustralia', 'AGL'],
      demandScale:['Largest single load centre in the NEM','NEM中最大的单一负荷中心'] }),

  point('melbourne', ['Melbourne', '墨尔本'], [144.96, -37.81], 'load', ['Metropolitan load centre', '大都市负荷中心'], ['past','current','future'],
    ['Victorian load centre served by the Latrobe Valley and, increasingly, by western Victorian renewables.',
     '维多利亚负荷中心，由拉筹伯谷供电，并日益依赖维多利亚西部可再生能源。'],
    ['Victoria has the NEM\'s only legislated storage targets — 2.6 GW by 2030 and 6.3 GW by 2035 — which is competition as much as it is policy support.',
     '维多利亚拥有NEM中唯一以立法确立的储能目标 — 2030年2.6GW、2035年6.3GW — 这既是政策支持，也意味着竞争。'],
    'AEMO 2026 ISP', URL.isp,
    { companies:['AusNet Services', 'CitiPower', 'Powercor', 'SEC Victoria'],
      demandScale:['Second-largest NEM load centre','NEM第二大负荷中心'] }),

  point('brisbane', ['Brisbane / South East Queensland', '布里斯班 / 东南昆士兰'], [153.03, -27.47], 'load', ['Metropolitan and industrial load', '大都市与工业负荷'], ['past','current','future'],
    ['Queensland load centre at the southern end of a long, thin state network with limited southward export.',
     '昆士兰负荷中心，位于狭长州级电网的南端，向南送出能力有限。'],
    ['Queensland went from the NEM\'s top battery earner to its worst in a single year as storage saturated. Read regional revenue history with its build-out.',
     '昆士兰在一年之内从NEM储能收益最高的区域跌至最低，原因是储能饱和。解读区域收入历史时必须结合其装机进程。'],
    'AEMO Quarterly Energy Dynamics', URL.isp,
    { companies:['Powerlink', 'Energex', 'Stanwell', 'CS Energy'],
      demandScale:['Queensland metropolitan and industrial load','昆士兰大都市与工业负荷'] }),
];

const route = (id, name, coords, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coords, kind:'route', periods, note, investor, source, sourceUrl, ...extra,
});

const routes = [
  route('pec', ['Project EnergyConnect', 'Project EnergyConnect互联工程'],
    [[139.08, -33.98], [142.19, -34.31], [147.37, -35.12]], ['current','future'],
    ['900 km SA–NSW interconnector with a spur to Red Cliffs in Victoria, fully energised June 2026.',
     '900公里南澳至新南威尔士互联线路，并延伸至维多利亚Red Cliffs，已于2026年6月全面送电。'],
    ['The one relief project on this map that has already landed. Use it to calibrate how much to trust the others.',
     '本图中唯一已经落地的缓解工程。可据此校准对其余工程的信任程度。'],
    'ElectraNet / Transgrid', URL.pec,
    { endpoints:['Robertstown SA – Wagga Wagga NSW, spur to Red Cliffs VIC','南澳Robertstown至新南威尔士Wagga Wagga，延伸至维多利亚Red Cliffs'],
      operatingCapacity:['800 MW of added transfer capability','新增800MW输送能力'] }),

  route('humelink', ['HumeLink', 'HumeLink输电工程'],
    [[147.37, -35.12], [148.40, -35.90], [149.80, -34.50]], ['future'],
    ['365 km of 500 kV double-circuit line unlocking 3 GW of renewables including 2,200 MW of Snowy 2.0.',
     '365公里500千伏双回路线路，释放3GW可再生能源，其中包括雪山2.0的2,200MW。'],
    ['Under construction with partners contracted, so this is the most likely date on the map — and the shortest congestion runway.',
     '工程已开工且合作方均已签约，因此这是本图中最可能如期实现的日期 — 也是最短的拥塞剩余期。'],
    'Transgrid', URL.humelink,
    { endpoints:['Wagga Wagga – Maragle – Bannaby','Wagga Wagga至Maragle至Bannaby'],
      plannedCapacity:['3 GW of renewables unlocked, commissioning 2027','释放3GW可再生能源，2027年投运'] }),

  route('vni-west', ['VNI West', 'VNI West互联工程'],
    [[143.92, -35.73], [145.50, -35.60], [147.37, -35.12]], ['future'],
    ['500 kV double-circuit line connecting the Western Renewables Link to Project EnergyConnect and HumeLink.',
     '500千伏双回路线路，将西部可再生能源联络线接入Project EnergyConnect与HumeLink。'],
    ['Actionable in the 2026 ISP with a developer selected, but completion moved from 2028 to late 2030 — a worked example of why a package date is weaker than a construction date.',
     '在2026年ISP中列为可实施项目且已选定开发方，但完工时间已从2028年推迟至2030年底 — 这正是“工程包日期弱于施工日期”的实证案例。'],
    'Transgrid / VicGrid', URL.isp,
    { endpoints:['Kerang VIC – Wagga Wagga NSW','维多利亚Kerang至新南威尔士Wagga Wagga'],
      plannedCapacity:['Up to 3.5 GW of bidirectional transfer, completion late 2030','双向输送能力最高3.5GW，2030年底完工'] }),

  route('marinus', ['Marinus Link Stage 1', 'Marinus Link一期'],
    [[146.60, -41.10], [146.30, -39.60], [146.57, -38.25]], ['future'],
    ['750 MW HVDC link between Tasmania and Victoria; final investment decision August 2025, services from late 2030.',
     '塔斯马尼亚与维多利亚之间750MW高压直流线路；2025年8月作出最终投资决定，2030年底起投运。'],
    ['Tasmanian hydro storage competing into the Victorian evening peak is a direct competitor to a Victorian battery, not a complement.',
     '塔斯马尼亚水电储能参与维多利亚晚高峰竞争，对维多利亚储能而言是直接竞争者而非互补者。'],
    'Marinus Link / AER', URL.marinus,
    { endpoints:['Tasmania – Latrobe Valley VIC','塔斯马尼亚至维多利亚拉筹伯谷'],
      plannedCapacity:['750 MW HVDC, services from late 2030','750MW高压直流，2030年底起投运'] }),

  route('copperstring', ['CopperString', 'CopperString输电工程'],
    [[144.20, -20.85], [145.50, -20.40], [146.20, -20.10]], ['future'],
    ['330 kV Hughenden–Townsville eastern link, 1.7 GW transfer and 2.9 GW hosting capacity.',
     '330千伏休恩登至汤斯维尔东部联络线，输送能力1.7GW，承载能力2.9GW。'],
    ['Commercial operations in 2032 sit at the far edge of a fifteen-year window. It shapes the terminal value, not the operating case.',
     '2032年商业运营处于十五年窗口的边缘。它影响的是终值，而非运营期测算。'],
    'Powerlink', URL.copperstring,
    { endpoints:['Hughenden – Townsville QLD','昆士兰休恩登至汤斯维尔'],
      plannedCapacity:['1.7 GW transfer / 2.9 GW hosting, operations 2032','输送1.7GW/承载2.9GW，2032年运营'] }),
];

const sourceCatalog = [
  { id:'nem-map-isp', owner:'AEMO', title:'2026 Integrated System Plan', url:URL.isp, format:'PDF + appendices', cadence:'Biennial', licence:'AEMO public publication terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'nem-map-humelink', owner:'Transgrid', title:'HumeLink project', url:URL.humelink, format:'HTML', cadence:'Project milestones', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'nem-map-cwo', owner:'EnergyCo NSW', title:'Central-West Orana REZ Transmission Project', url:URL.cwo, format:'HTML', cadence:'Project milestones', licence:'NSW Government reuse terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'nem-map-pec', owner:'ElectraNet', title:'Project EnergyConnect', url:URL.pec, format:'HTML', cadence:'Project milestones', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'nem-map-marinus', owner:'Marinus Link Pty Ltd', title:'Marinus Link', url:URL.marinus, format:'HTML', cadence:'Project milestones', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'nem-map-copperstring', owner:'Powerlink Queensland', title:'CopperString', url:URL.copperstring, format:'HTML', cadence:'Project milestones', licence:'Queensland Government reuse terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'nem-map-snowy', owner:'Snowy Hydro', title:'Snowy 2.0', url:URL.snowy, format:'HTML', cadence:'Project milestones', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'nem-map-boundary', owner:'Natural Earth via world-atlas', title:'Countries 110m', url:URL.atlas, format:'TopoJSON', cadence:'Periodic', licence:'Public domain (Natural Earth)', automation:'B', checkedAt:'2026-08-01' },
];

export const NEM_GRID_MAP = {
  id:'nem-grid-map',
  ariaLabel:['Interactive National Electricity Market map','澳大利亚国家电力市场交互地图'],
  title:['NEM grid structure by period','NEM不同时期电网结构'],
  defaultPeriod:'current',
  defaultSelectedId:'wagga',
  boundary,
  boundarySource: {
    label: ['Natural Earth 110m via world-atlas', 'Natural Earth 110m（经world-atlas）'],
    url: URL.atlas,
  },
  /* The NEM is the eastern and southern states. Western Australia is deliberately
     outside the frame — it is the WEM, and it has its own map. */
  viewBounds: [[128.0, -44.0], [154.5, -15.0]],
  periodOrder: ['past','current','future'],
  periods: {
    past: {
      label: ['Past · 2010', '过去 · 2010'],
      kicker: ['Coal on the coalfields', '煤电位于煤田'],
      thesis: ['Generation sat on the Hunter Valley, Latrobe Valley and Central Queensland coalfields and flowed toward the coastal capitals over long radial networks.','发电集中于猎人谷、拉筹伯谷及昆士兰中部煤田，通过长距离辐射状电网流向沿海首府城市。'],
      implication: ['Interconnection was thin and each state was close to self-sufficient; locational risk meant fuel supply, not network access.','当时互联能力薄弱，各州基本自给自足；区位风险指的是燃料供应，而非电网接入。'],
    },
    current: {
      label: ['Current · 2026', '当前 · 2026'],
      kicker: ['Renewable energy zones, thin wires', '可再生能源区，电网薄弱'],
      thesis: ['Generation is moving inland to renewable energy zones while load stays coastal, and the networks in between were built to serve local demand rather than export at scale.','发电正向内陆可再生能源区转移，而负荷仍集中于沿海，中间的电网原本是为服务本地负荷而非大规模外送而建。'],
      implication: ['Utility-scale renewable curtailment passed 7 TWh in 2025, up more than 60% year on year — and no NEM generator or battery is compensated for being constrained off.','2025年公用事业级可再生能源限电量突破7TWh，同比增长超过60% — 而NEM中任何发电或储能因受约束停机均得不到补偿。'],
    },
    future: {
      label: ['Planned · 2035', '规划 · 2035'],
      kicker: ['The ISP development path', 'ISP发展路径'],
      thesis: ['HumeLink, VNI West, Marinus Link and CopperString reshape the transfer map, and AEMO\'s optimal development path requires 33 GW of grid-scale storage by 2030.','HumeLink、VNI West、Marinus Link及CopperString将重塑输电格局，而AEMO的最优发展路径要求2030年前建成33GW电网级储能。'],
      implication: ['The connections pipeline already holds around 45 GW of batteries, which exceeds the 2030 requirement — the relief and the competition arrive together.','并网排队中已有约45GW储能，超出2030年需求 — 缓解与竞争将同时到来。'],
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
    'Representative national orientation only, covering the NEM regions and excluding Western Australia, which is a separate market on this platform. Markers use approximate locality centroids and do not show spare capacity, queue position, curtailment probability or an investable connection.',
    '仅用于代表性全国方位展示，覆盖NEM各区域，不含西澳（在本平台中属独立市场）。标记采用近似地点中心坐标，不显示可用容量、队列位置、限电概率或可投资并网权利。',
  ],
};

export default NEM_GRID_MAP;
