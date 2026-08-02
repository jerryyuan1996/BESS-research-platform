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
  ispA5: 'https://www.aemo.com.au/-/media/files/major-publications/isp/2026/appendices/a5-network-investments.pdf',
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
    ['South Australian terminal of Project EnergyConnect. Stage 1 completed in late 2024 at 150 MW; the full 800 MW waits on Stage 2 in November 2027.',
     'Project EnergyConnect的南澳端站。一期已于2024年底完成，输送能力150MW；完整的800MW须待2027年11月二期投运。'],
    ['This is the platform\'s worked example of relief arriving in stages rather than on a date. A 2024 congestion case written here is not yet spent — it expires with Stage 2, not with Stage 1.',
     '这是本平台关于缓解措施分期到位而非按单一日期到位的实证案例。2024年在此撰写的拥塞投资逻辑尚未兑现 — 其到期日对应二期而非一期。'],
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
    ['900 km SA–NSW interconnector with a spur to Red Cliffs in Victoria. Stage 1 completed in late 2024 at 150 MW; Stage 2 lifts transfer to 800 MW in service November 2027.',
     '900公里南澳至新南威尔士互联线路，并延伸至维多利亚Red Cliffs。一期已于2024年底完成，输送能力150MW；二期将输送能力提升至800MW，2027年11月投运。'],
    ['The only relief project on this map that is partly delivered — and it still slipped about a year. Use it to calibrate how much to trust the others, in both directions.',
     '本图中唯一已部分交付的缓解工程 — 且仍延期约一年。可据此双向校准对其余工程的信任程度。'],
    'ElectraNet / Transgrid', URL.pec,
    { endpoints:['Robertstown SA – Wagga Wagga NSW, spur to Red Cliffs VIC','南澳Robertstown至新南威尔士Wagga Wagga，延伸至维多利亚Red Cliffs'],
      operatingCapacity:['150 MW in service from Stage 1','一期已投运150MW'],
      plannedCapacity:['800 MW once Stage 2 is in service, November 2027','二期投运后达800MW，2027年11月'] }),

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

/* ---- planned-build layer: the 2026 ISP register, drawn ---------------------
   Every feature below is one row of the register on the grid tab, carrying that
   row's status class so the map and the table cannot say different things.

   Two deliberate limits. Coordinates are approximate locality centroids for the
   named terminals, in the same convention as the rest of this file — an ISP
   corridor has no published alignment at this stage and drawing one would be
   false precision. And the register's programme-level rows (the ODP totals) are
   not here, because they have no geography; the card carries them instead.

   `planYear` is the proponent-advised or Step Change in-service year, null where
   AEMO publishes none. */
const plan = (id, name, coords, planClass, planClassLabel, planYear, note, investor, endpoints, plannedCapacity, planStatus, sourceUrl = URL.ispA5) => ({
  id, name, coords, kind:'route', layer:'plan', periods:['future'],
  note, investor, source:'AEMO 2026 ISP Appendix A5', sourceUrl,
  endpoints, plannedCapacity, planClass, planClassLabel, planYear, planStatus,
});

const CL = {
  committed:      ['Committed','已承诺'],
  anticipated:    ['Anticipated','预期'],
  actionable:     ['Actionable ISP','可行动ISP'],
  'actionable-nsw':['Actionable NSW','可行动（新州）'],
  'actionable-qld':['Actionable Qld','可行动（昆州）'],
  'actionable-vic':['Actionable Vic','可行动（维州）'],
  future:         ['Future ISP','未来ISP'],
};

const planRoutes = [
  plan('nem-plan-cwo-nip', ['Central-West Orana REZ Network Infrastructure','中西部奥拉纳REZ网络基础设施'],
    [[149.35, -32.15], [149.90, -32.30], [150.89, -32.34]], 'committed', CL.committed, 2028,
    ['4,500 MW of REZ network capacity from Merotherie through Elong Elong to the Hunter, with 7.15 GW of access rights already awarded.',
     '自Merotherie经Elong Elong至猎人谷的4,500MW可再生能源区网络容量，已授出7.15GW接入权。'],
    ['Committed and under construction since June 2025, so the date is real — but access rights are already awarded against it, which is the competition a new project joins.',
     '自2025年6月起已承诺并施工，因此日期真实 — 但接入权已就该容量授出，这正是新项目将面对的竞争。'],
    ['Merotherie – Elong Elong – Bayswater','Merotherie至Elong Elong至Bayswater'],
    ['4,500 MW of REZ network capacity, energisation December 2028','4,500MW可再生能源区网络容量，2028年12月送电'],
    ['Committed; construction began June 2025','已承诺；2025年6月开工'], URL.cwo),

  plan('nem-plan-hcc-nip', ['Hunter-Central Coast REZ Network Infrastructure','猎人—中央海岸REZ网络基础设施'],
    [[150.89, -32.34], [151.20, -32.70], [151.45, -33.02]], 'committed', CL.committed, 2028,
    ['132 kV upgrades from Muswellbrook to Kurri in three portions, supporting up to 1,800 MW of generation and storage projects.',
     '自Muswellbrook至Kurri的132千伏升级，分三部分实施，支持最多1,800MW发电与储能项目。'],
    ['Actionable NSW in the 2024 ISP and committed for 2026 — an example of the register moving in the investor\'s favour rather than against it.',
     '在2024年ISP中为新州可行动项目，2026年转为已承诺 — 这是登记表向有利于投资者方向变化的例子。'],
    ['Muswellbrook – Singleton – Kurri','Muswellbrook至Singleton至Kurri'],
    ['600 MW of added REZ transfer, July 2028','新增600MW可再生能源区输送能力，2028年7月'],
    ['Committed for the final 2026 ISP','2026年终版ISP中列为已承诺']),

  plan('nem-plan-ne-rez', ['New England REZ Network Infrastructure','新英格兰REZ网络基础设施'],
    [[151.67, -30.51], [151.30, -31.40], [150.89, -32.34]], 'anticipated', CL.anticipated, 2034,
    ['500 kV and 330 kV between central and northern New South Wales, adding 6,000 MW in both directions.',
     '新州中部至北部的500千伏与330千伏线路，双向增加6,000MW。'],
    ['Anticipated rather than committed, and dated January 2034 — far enough out that it shapes terminal value, not the operating case.',
     '属预期而非已承诺，日期为2034年1月 — 时点足够遥远，影响的是终值而非运营期测算。'],
    ['Armidale – Tamworth – Bayswater','Armidale至Tamworth至Bayswater'],
    ['6,000 MW both directions, delivery January 2034','双向6,000MW，2034年1月交付'],
    ['Anticipated; progressed from actionable in the 2024 ISP','预期项目；由2024年ISP的可行动项目升级']),

  plan('nem-plan-sydney-ring-north', ['Sydney Ring North (Hunter Transmission Project)','悉尼环网北段（猎人输电项目）'],
    [[150.89, -32.34], [151.20, -32.75], [151.45, -33.02]], 'actionable-nsw', CL['actionable-nsw'], 2029,
    ['500 kV double-circuit from Olney to Bayswater, adding 5,000 MW into the Sydney, Newcastle and Wollongong load area.',
     '自Olney至Bayswater的500千伏双回线路，向悉尼、纽卡斯尔与卧龙岗负荷区增加5,000MW。'],
    ['This is the project Central-West Orana depends on to exceed 3 GW. A CWO-area battery is exposed to its date whether or not it appears in the offer.',
     '这是中西部奥拉纳突破3GW所依赖的项目。位于CWO区域的储能无论要约中是否提及，都暴露于其日期风险。'],
    ['Olney – Bayswater – Sydney load area','Olney至Bayswater至悉尼负荷区'],
    ['5,000 MW forward, November 2029','正向5,000MW，2029年11月'],
    ['Actionable NSW; A$1,364m estimate','新州可行动项目；估算A$13.64亿']),

  plan('nem-plan-sydney-ring-south', ['Sydney Ring South','悉尼环网南段'],
    [[149.80, -34.50], [150.30, -34.10], [150.70, -33.77]], 'actionable', CL.actionable, 2033,
    ['Both a power flow control package and a 500 kV line are now actionable, adding 3,600 MW forward into Sydney.',
     '潮流控制方案与500千伏线路方案现均列为可行动，向悉尼正向增加3,600MW。'],
    ['The 500 kV option moved from future to actionable between the draft and final 2026 ISP — a reminder that classes move in both directions within a single ISP cycle.',
     '500千伏方案在2026年ISP草案与终版之间由未来项目转为可行动 — 提示状态类别可在单一ISP周期内双向变动。'],
    ['Bannaby – Sydney West / Regentville','Bannaby至Sydney West / Regentville'],
    ['3,600 MW forward, July 2033','正向3,600MW，2033年7月'],
    ['Actionable ISP; both options now in scope','可行动ISP项目；两个方案现均纳入范围']),

  plan('nem-plan-wrl', ['Western Renewables Link','西部可再生能源联络线'],
    [[142.90, -37.05], [143.85, -37.45], [144.77, -37.68]], 'anticipated', CL.anticipated, 2029,
    ['500 kV double-circuit from Bulgana to Sydenham, harnessing 1,460 MW after the rescope.',
     '自Bulgana至Sydenham的500千伏双回线路，调整范围后可承载1,460MW。'],
    ['The western half of the Victorian build, and a prerequisite for VNI West carrying its full value.',
     '维多利亚建设的西半部，也是VNI West发挥完整价值的前提。'],
    ['Bulgana – Ballarat – Sydenham','Bulgana至Ballarat至Sydenham'],
    ['1,460 MW harnessed, completion November 2029','承载1,460MW，2029年11月完工'],
    ['Anticipated; expected completion November 2029','预期项目；预计2029年11月完工']),

  plan('nem-plan-gippsland-offshore', ['Gippsland Offshore Wind Transmission','吉普斯兰海上风电输电工程'],
    [[146.88, -38.52], [146.70, -38.35], [146.57, -38.25]], 'actionable-vic', CL['actionable-vic'], 2031,
    ['500 kV radial lines from a new terminal station near Woodside, adding 2,000 MW at the Gippsland REZ in three stages.',
     '自Woodside附近新终端站引出的500千伏放射状线路，分三期在吉普斯兰可再生能源区增加2,000MW。'],
    ['Staged 2031, 2033 and 2038. A single project name covering seven years of delivery is three different underwriting cases.',
     '分2031、2033、2038三期。单一项目名称覆盖七年交付期，实为三种不同的承销情景。'],
    ['Woodside terminal – Latrobe Valley','Woodside终端至拉筹伯谷'],
    ['+2,000 MW at REZ V8, first stage July 2031','V8可再生能源区增加2,000MW，首期2031年7月'],
    ['Actionable Victoria; new in this ISP','维州可行动项目；本次ISP新增']),

  plan('nem-plan-marinus-2', ['Project Marinus Stage 2','Marinus项目二期'],
    [[146.60, -41.10], [146.30, -39.60], [146.57, -38.25]], 'actionable', CL.actionable, 2034,
    ['A second 750 MW HVDC monopole between Burnie and the Latrobe Valley, doubling the Marinus link.',
     'Burnie与拉筹伯谷之间的第二条750MW高压直流单极，使Marinus输送能力翻倍。'],
    ['Stage 1 took from the 2022 ISP to a 2025 final investment decision. Stage 2 is actionable, which is where Stage 1 started.',
     '一期自2022年ISP起历经至2025年才作出最终投资决策。二期现为可行动 — 正是一期当年的起点。'],
    ['Burnie TAS – Hazelwood VIC','塔斯马尼亚Burnie至维多利亚Hazelwood'],
    ['750 MW both directions, December 2034','双向750MW，2034年12月'],
    ['Actionable ISP; A$2,485m estimate','可行动ISP项目；估算A$24.85亿'], URL.marinus),

  plan('nem-plan-tas-rez', ['Tasmania REZ Expansion','塔斯马尼亚REZ扩容'],
    [[145.91, -41.06], [145.88, -41.18], [146.60, -41.10]], 'actionable', CL.actionable, 2030,
    ['Burnie to Hampshire Hills 220 kV double-circuit, 800 MW to support the Tasmanian Renewable Energy Target after Marinus.',
     'Burnie至Hampshire Hills的220千伏双回线路，800MW，用于在Marinus之后支撑塔州可再生能源目标。'],
    ['Newly actionable, replacing a different Tasmanian project that was actionable in 2024. The need persisted; the project did not.',
     '本次新列为可行动，取代2024年另一个塔州可行动项目。需求延续，项目本身则未延续。'],
    ['Burnie – Hampshire Hills','Burnie至Hampshire Hills'],
    ['800 MW, July 2030','800MW，2030年7月'],
    ['Actionable ISP; replaces the Second Tasmania REZ Expansion','可行动ISP项目；取代塔州第二REZ扩容']),

  plan('nem-plan-gladstone', ['Gladstone Project','Gladstone项目'],
    [[150.50, -24.10], [150.95, -23.95], [151.26, -23.84]], 'actionable-qld', CL['actionable-qld'], 2029,
    ['New Gladstone West 275 kV switching station and a Calvale–Calliope River double-circuit line, adding 2,600 MW forward.',
     '新建Gladstone West 275千伏开关站及Calvale—Calliope River双回线路，正向增加2,600MW。'],
    ['Driven by the Gladstone Power Station closure and industrial electrification, not by renewable transfer — a demand-side reinforcement in a generation-side plan.',
     '其驱动因素是Gladstone电厂关停与工业电气化，而非可再生能源送出 — 这是发电侧规划中的一项负荷侧增容。'],
    ['Calvale – Gladstone West – Calliope River','Calvale至Gladstone West至Calliope River'],
    ['2,600 MW forward, line March 2029','正向2,600MW，线路2029年3月'],
    ['Actionable Queensland; A$2,367m estimate','昆州可行动项目；估算A$23.67亿']),

  plan('nem-plan-cq-nq-1', ['Central to North Queensland Reinforcement (Stage 1)','中昆士兰至北昆士兰加强工程（一期）'],
    [[150.32, -23.53], [149.60, -22.90], [148.90, -22.30]], 'actionable', CL.actionable, 2031,
    ['Second Stanwell–Broadsound 275 kV circuit, adding 350 MW forward and 500 MW reverse.',
     'Stanwell—Broadsound第二回275千伏线路，正向增加350MW、反向500MW。'],
    ['A much smaller expansion than the Queensland SuperGrid North it replaces. The 2024 ISP\'s headline corridor became a A$209m circuit.',
     '规模远小于其所取代的昆士兰超级电网北段。2024年ISP的标志性走廊变成了一条A$2.09亿的线路。'],
    ['Stanwell – Broadsound','Stanwell至Broadsound'],
    ['350 MW forward / 500 MW reverse, July 2031','正向350MW/反向500MW，2031年7月'],
    ['Actionable ISP; replaces Queensland SuperGrid North','可行动ISP项目；取代昆士兰超级电网北段']),

  plan('nem-plan-qni-connect', ['QNI Connect','QNI Connect'],
    [[151.67, -30.51], [151.40, -29.00], [151.20, -27.30]], 'future', CL.future, 2041,
    ['1,260 MW forward on the northern NSW to southern Queensland flow path, connecting into the New England REZ project.',
     '新州北部至昆士兰南部潮流通道正向1,260MW，接入新英格兰可再生能源区项目。'],
    ['The clearest warning on this map: actionable in the 2024 ISP, deferred almost a decade to the mid-2040s in 2026 because AEMO recalculated the need. Nothing physical failed.',
     '本图中最明确的警示：在2024年ISP中属可行动项目，2026年因AEMO重新计算需求而推迟近十年至2040年代中期。没有任何实体环节失败。'],
    ['Armidale NSW – Braemar QLD','新州Armidale至昆州Braemar'],
    ['1,260 MW forward, Step Change 2040-41','正向1,260MW，阶跃变革情景2040-41年'],
    ['Future ISP project; was actionable in 2024','未来ISP项目；2024年时为可行动']),

  plan('nem-plan-ntx', ['Northern Transmission Project','北部输电项目'],
    [[139.30, -34.10], [138.90, -34.45], [138.57, -34.79]], 'future', CL.future, 2041,
    ['275 kV double-circuit from Bundey toward Bolivar/Dry Creek, adding 1,200 MW into the Adelaide load area.',
     '自Bundey至Bolivar/Dry Creek的275千伏双回线路，向阿德莱德负荷区增加1,200MW。'],
    ['Deferred from actionable to future, but ElectraNet has an active RIT-T that AEMO says should still conclude — the one row where the register and the proponent disagree about urgency.',
     '由可行动推迟为未来项目，但ElectraNet仍有在办RIT-T，且AEMO认为应予完成 — 这是登记表与项目方对紧迫性看法不一致的唯一一行。'],
    ['Bundey – Bolivar / Dry Creek','Bundey至Bolivar / Dry Creek'],
    ['1,200 MW, Accelerated Transition 2041-42','1,200MW，加速转型情景2041-42年'],
    ['Future ISP project; RIT-T still underway','未来ISP项目；RIT-T仍在进行']),

  plan('nem-plan-sw-vic', ['South West Victoria Expansion','西南维多利亚扩容'],
    [[144.20, -37.75], [144.50, -37.72], [144.77, -37.68]], 'future', CL.future, 2045,
    ['500 kV from Moorabool through Truganina to Sydenham, adding 2,000 MW of reverse transfer.',
     '自Moorabool经Truganina至Sydenham的500千伏线路，增加2,000MW反向输送能力。'],
    ['Step Change timing of 2045-46 puts it beyond any current underwriting horizon. It is on the map because its absence is what constrains western Victoria until then.',
     '阶跃变革情景下的2045-46年时点已超出当前任何承销期。将其列入地图，是因为在此之前它的缺失正是维州西部的约束所在。'],
    ['Moorabool – Truganina – Sydenham','Moorabool至Truganina至Sydenham'],
    ['2,000 MW reverse, Step Change 2045-46','反向2,000MW，阶跃变革情景2045-46年'],
    ['Future ISP project','未来ISP项目']),
];

const sourceCatalog = [
  { id:'nem-map-isp', owner:'AEMO', title:'2026 Integrated System Plan', url:URL.isp, format:'PDF + appendices', cadence:'Biennial', licence:'AEMO public publication terms', automation:'C', checkedAt:'2026-08-01' },
  { id:'nem-map-isp-a5', owner:'AEMO', title:'2026 ISP Appendix A5: Network Investments', url:URL.ispA5, format:'PDF', cadence:'Biennial', licence:'AEMO public publication terms', automation:'C', checkedAt:'2026-08-02' },
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
  routes: [...routes, ...planRoutes],
  sourceCatalog,
  scope: [
    'Representative national orientation only, covering the NEM regions and excluding Western Australia, which is a separate market on this platform. Markers use approximate locality centroids and do not show spare capacity, queue position, curtailment probability or an investable connection.',
    '仅用于代表性全国方位展示，覆盖NEM各区域，不含西澳（在本平台中属独立市场）。标记采用近似地点中心坐标，不显示可用容量、队列位置、限电概率或可投资并网权利。',
  ],
};

export default NEM_GRID_MAP;
