import boundary from './ro-boundary-2024.json' with { type:'json' };

const URL = {
  boundary:'https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_RG_10M_2024_4326.geojson',
  plan:'https://www.transelectrica.ro/documents/10179/20107575/01_Nota%2BPD%2BRET%2B2026-2035%2Binclusiv%2Banexe_EN.pdf/2ff26066-2f3a-4401-91d6-863abec723ed?version=1.0',
  capacityMap:'https://web.transelectrica.ro/harti_crd_tel/index.html',
  anreReform:'https://anre.ro/24931-2/',
  anreAuction:'https://anre.ro/informare-de-presa-30-07-2024-anre-aproba-reguli-noi-privind-racordarea-pe-baza-de-licitatie-a-locurilor-de-producere-a-energiei-electrice-la-retelele-de-interes-public/',
  anreProjects:'https://anre.ro/wp-content/uploads/2026/04/Informare-proiecte-RES_1-martie-2026-1.pdf',
  cernavoda:'https://nuclearelectrica.ro/ir/wp-content/uploads/sites/3/2026/03/CR-2025-Annual-Report-integrated-ENG-1.pdf',
  hydro:'https://cdn.hidroelectrica.ro/cdn/ipo/prospect/Eng_Prospectus.pdf',
  brazi:'https://www.omvpetrom.com/en/about-us/what-we-do/gas-and-power/brazi-power-plant',
  petrobrazi:'https://www.omvpetrom.com/en/about-us/what-we-do/refining-and-marketing/petrobrazi-refinery',
  craiova:'https://www.research.gov.ro/solutii-digitale-de-ultima-ora-la-craiova-7254/',
  libertyGalati:'https://libertysteelgroup.com/ro/news/liberty-galati-steel-part-of-the-new-railway-route-connecting-the-north-station-to-otopeni-airport/?lang=en',
  continentalTimisoara:'https://www.continental.com/en/press/press-releases/20250626-timisoara-iscc-plus/',
  cloud:'https://www.adr.gov.ro/en/cpg',
  smardan:'https://www.transelectrica.ro/ro/-/press-release-the-national-power-grid-co-transelectrica-sa-has-accomplished-the-studies-on-the-new-400-kv-double-circuit-overhead-line-ohl-between-the',
};

/* Standing map labels. Demand centres and generation zones always carry one —
   they are the geography that orients a reader against a published network
   plan. Nodes carry one only where the map is sparse enough to take it; on the
   denser maps they would bury the routes they sit on. Any point overrides with
   `label:false` or places its text with `labelAnchor` / `labelBelow`. */
const LABEL_KINDS = new Set(['load','generation','node']);
const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1,
  label:LABEL_KINDS.has(kind), ...extra,
});

/*
 * National-orientation locations. Coordinates are approximate locality
 * centroids. Transmission topology and project status follow the cited public
 * documents; neither marker size nor proximity represents spare capacity.
 */
const points = [
  point('cernavoda-node', ['Cernavodă', '切尔纳沃德'], [28.04,44.34], 'node', ['400 kV nuclear / renewable-export node','400千伏核电及新能源送出节点'], ['past','current','future'],
    ['A south-east system anchor linking the nuclear station and Dobrogea generation to the national grid.','东南部系统枢纽，将核电站及多布罗加发电接入全国电网。'],
    ['Separate the power-station connection from each downstream reinforcement dependency.','须将电站并网与各项下游增容依赖分别核查。'], 'Transelectrica RET Development Plan 2026–2035', URL.plan),
  point('stalpu', ['Stâlpu', '斯特尔普'], [26.72,45.00], 'node', ['400 kV reinforcement node','400千伏增容节点'], ['current','future'],
    ['The planned Cernavodă–Stâlpu corridor closes part of the south-east-to-centre transfer path.','规划切尔纳沃德—斯特尔普走廊补强东南至中部送电路径。'],
    ['A planned line is not present headroom; identify the exact section and commissioning milestone in the ATR study.','规划线路并非当前可用空间；须在ATR研究中明确具体区段及投运里程碑。'], 'Transelectrica RET Development Plan 2026–2035', URL.plan),
  point('smardan', ['Smârdan / Galați', '斯默尔丹 / 加拉茨'], [27.93,45.48], 'node', ['400 kV eastern node','400千伏东部节点'], ['past','current','future'],
    ['Eastern transmission node serving Moldova-region supply and the Galați industrial corridor.','服务摩尔达维亚地区供电及加拉茨工业走廊的东部输电节点。'],
    ['Test Gutinaș–Smârdan dependency and industrial-load sensitivities together.','应同时测试古蒂纳什—斯默尔丹依赖及工业负荷敏感性。'], 'Transelectrica RET Development Plan 2026–2035', URL.plan),
  point('gutinas', ['Gutinaș', '古蒂纳什'], [26.82,46.21], 'node', ['400/220 kV node','400/220千伏节点'], ['current','future'],
    ['A central-eastern node in the planned double-circuit reinforcement toward Smârdan.','规划通往斯默尔丹双回路增容线路上的中东部节点。'],
    ['Confirm whether the offer assumes the new line, an interim operating arrangement or curtailment.','确认要约是否依赖新线路、临时运行方案或限发安排。'], 'Transelectrica Gutinaș–Smârdan study', URL.smardan),
  point('bucharest-south', ['București Sud', '布加勒斯特南'], [26.17,44.36], 'node', ['400/220 kV metropolitan node','400/220千伏都市节点'], ['past','current','future'],
    ['A major supply point for Romania’s largest metropolitan demand centre.','罗马尼亚最大都市负荷中心的主要供电点。'],
    ['Import capacity, fault level and local distribution works must be evidenced separately.','受入容量、短路水平及本地配电工程须分别证明。'], 'Transelectrica RET Development Plan 2026–2035', URL.plan),
  point('brazi-node', ['Brazi / Ploiești', '布拉兹 / 普洛耶什蒂'], [25.95,44.87], 'node', ['400 kV generation / industrial node','400千伏发电及工业节点'], ['past','current','future'],
    ['Generation, refining and metropolitan demand meet on the north-Bucharest corridor.','发电、炼化及都市负荷在布加勒斯特北部走廊交汇。'],
    ['Do not infer battery export headroom from nearby thermal generation or industrial demand.','不可因邻近火电或工业负荷推断电池送出空间。'], 'Transelectrica RET Development Plan 2026–2035', URL.plan),
  point('sibiu-south', ['Sibiu Sud', '锡比乌南'], [24.16,45.72], 'node', ['400 kV Transylvania node','400千伏特兰西瓦尼亚节点'], ['past','current','future'],
    ['Central node on the Transylvania-to-southern-system transfer axis.','特兰西瓦尼亚至南部系统输送轴线上的中部节点。'],
    ['Model outages and the Iernut–Sibiu reinforcement programme explicitly.','须明确建模停电检修及耶尔努特—锡比乌增容计划。'], 'Transelectrica RET Development Plan 2026–2035', URL.plan),
  point('portile-fier-node', ['Porțile de Fier', '铁门'], [22.66,44.67], 'node', ['400 kV hydro / interconnection node','400千伏水电及互联节点'], ['past','current','future'],
    ['Large Danube hydropower and Serbia-border flows meet at Romania’s south-western edge.','大型多瑙河水电与塞尔维亚跨境潮流在罗马尼亚西南边缘交汇。'],
    ['Hydrology, cross-border schedules and internal transfer constraints are distinct sensitivities.','水文、跨境计划及国内输送约束属于不同敏感因素。'], 'Transelectrica RET Development Plan 2026–2035', URL.plan),
  point('resita', ['Reșița', '雷希察'], [21.89,45.30], 'node', ['400 kV south-west node','400千伏西南节点'], ['current','future'],
    ['A node in the Romania–Serbia reinforcement group and western 400 kV ring completion.','罗马尼亚—塞尔维亚增容工程组及西部400千伏环网补全节点。'],
    ['Cross-border project status does not substitute for a Romanian connection agreement.','跨境项目状态不能替代罗马尼亚境内并网合同。'], 'Transelectrica RET Development Plan 2026–2035', URL.plan),
  point('arad', ['Arad', '阿拉德'], [21.31,46.17], 'node', ['400 kV western node','400千伏西部节点'], ['past','current','future'],
    ['Western industrial and interconnection node linking the Timișoara–Arad corridor.','连接蒂米什瓦拉—阿拉德走廊的西部工业及互联节点。'],
    ['Include border-flow and local industrial-demand cases in the study background.','研究背景应纳入跨境潮流及本地工业负荷情景。'], 'Transelectrica RET Development Plan 2026–2035', URL.plan),

  point('cernavoda-generation', ['Cernavodă nuclear', '切尔纳沃德核电'], [28.06,44.31], 'generation', ['Nuclear','核电'], ['past','current','future'],
    ['Two operating CANDU units anchor low-carbon generation; Units 3 and 4 remain a development programme.','两台在运CANDU机组构成低碳发电支柱；3、4号机组仍处于开发阶段。'],
    ['Treat operating, refurbishment and new-build schedules as separate grid-study cases.','应将现有运行、翻新及新建计划作为不同电网研究情景。'], 'Nuclearelectrica', URL.cernavoda, {
      owner:['Nuclearelectrica / Energonuclear','Nuclearelectrica / Energonuclear'],
      operatingCapacity:['1,411.3 MWe nameplate: Unit 1 706.5 + Unit 2 704.8','铭牌容量1,411.3MWe：1号机706.5 + 2号机704.8'],
      plannedCapacity:['1,400 MW: Units 3 and 4, 700 MW each; development, not operating','1,400MW：3、4号机各700MW；处于开发阶段，尚未投运'],
      capacityBasis:['Nameplate/project capacity—not live output','铭牌/项目容量，并非实时出力'],
      status:['Units 1 and 2 operating reference plus Units 3 and 4 development programme, evidenced in the 2025 integrated annual report','2025年综合年报证明1、2号机组在运，以及3、4号机组开发计划'],
    }),
  point('iron-gates-generation', ['Iron Gates hydro cascade', '铁门水电梯级'], [22.65,44.69], 'generation', ['Hydropower','水电'], ['past','current','future'],
    ['Major dispatchable hydropower on the Danube at the Serbian border.','位于塞尔维亚边境多瑙河上的大型可调度水电。'],
    ['Available output depends on hydrology and unit availability; use nameplate only as a ceiling.','可用出力取决于水文及机组可用率；铭牌仅是上限。'], 'Hidroelectrica prospectus', URL.hydro, {
      owner:['Hidroelectrica (Romanian assets)','Hidroelectrica（罗马尼亚侧资产）'],
      operatingCapacity:['1,386.2 MW named plants: Iron Gates I 1,166.4 + Iron Gates II 219.8','具名电站合计1,386.2MW：铁门I 1,166.4 + 铁门II 219.8'],
      plannedCapacity:['No additional MW assigned to this marker in the cited source','所引来源未向本标记分配新增MW'],
      capacityBasis:['Installed capacity—not contemporaneous production','装机容量，并非同期发电量'],
    }),
  point('brazi-generation', ['Brazi CCGT', '布拉兹联合循环电站'], [25.92,44.86], 'generation', ['Gas CCGT','燃气联合循环'], ['current','future'],
    ['Fast-response gas generation supports security and renewable balancing.','快速响应燃气发电支撑供电安全及新能源平衡。'],
    ['Nameplate capacity does not prove dispatch, fuel availability or local connection headroom.','铭牌容量不证明实际调度、燃料可用性或本地并网空间。'], 'OMV Petrom', URL.brazi, {
      owner:['OMV Petrom','OMV Petrom'],
      operatingCapacity:['860 MW installed; 2025 generation disclosed at about 4.7 TWh','装机860MW；披露2025年发电量约4.7TWh'],
      plannedCapacity:['No additional Brazi MW committed on the cited asset page','所引资产页面未承诺布拉兹新增MW'],
      capacityBasis:['Installed capacity plus annual energy; not live output','装机容量及年度电量，并非实时出力'],
    }),
  point('dobrogea-renewables', ['Dobrogea renewable zone', '多布罗加新能源区'], [28.55,44.80], 'generation', ['Wind / solar aggregation','风电 / 光伏聚合区'], ['current','future'],
    ['A regional cluster rather than one plant; it is a core driver of south-east reinforcement.','此为区域集群而非单一电站，是东南部增容的核心驱动因素。'],
    ['Do not sum applications as operating capacity; reconcile each project against ATR, contract, permits and energisation.','不可将申请容量相加作为在运容量；须逐项目核对ATR、合同、许可及送电。'], 'ANRE renewable-project status, 1 March 2026', URL.anreProjects, {
      owner:['Multiple disclosed developers; no single operator','多家公开开发商；无单一运营方'],
      operatingCapacity:['No single operating MW: this marker is a geographic aggregation','无单一在运MW：本标记为地理聚合区'],
      plannedCapacity:['National evidence: 81,322 MW held valid ATRs, but only 8,944 MW also had connection contracts, construction permits and ANRE establishment authorisations','全国证据：有效ATR合计81,322MW，但仅8,944MW同时具备并网合同、建设许可及ANRE设立许可'],
      capacityBasis:['National pipeline-stage evidence—not capacity allocated to Dobrogea','全国管线阶段证据，并非分配给多布罗加的容量'],
      plannedCapacity:['No Dobrogea-specific planned MW is assigned by the cited national status register','所引全国项目状态清单未向多布罗加标记分配特定规划MW'],
      capacityBasis:['National context only: 81,322 MW held valid ATRs and 8,944 MW also had connection contracts, construction permits and establishment authorisations; not allocated to this marker','仅为全国背景：81,322MW持有效ATR，其中8,944MW还具备并网合同、建设许可及设立许可；并非分配至本标记'],
      status:['Regional aggregation; reconcile each project against the ANRE stage register','区域聚合标记；须逐项目对照ANRE阶段清单核验'],
    }),

  point('bucharest-demand', ['Bucharest–Ilfov demand', '布加勒斯特—伊尔福夫负荷'], [26.06,44.45], 'load', ['Residential / services / digital','居民 / 服务业 / 数字基础设施'], ['past','current','future'],
    ['Romania’s largest metropolitan load, with new public digital infrastructure added to conventional urban demand.','罗马尼亚最大都市负荷，公共数字基础设施正在叠加传统城市需求。'],
    ['Obtain the actual requested MW, ramp profile and DSO/transmission split; a city marker is not a connection commitment.','须取得实际申请MW、爬坡曲线及配电/输电划分；城市标记并非并网承诺。'], 'Romanian Digitalisation Authority — Government Private Cloud', URL.cloud, {
      companies:['Romanian Digitalisation Authority','Government Private Cloud'],
      demandScale:['Public cloud data centres are identified in Bucharest, Timișoara, Brașov and Sibiu; no consolidated MW is published on the cited page','公开资料指出私有云数据中心位于布加勒斯特、蒂米什瓦拉、布拉索夫及锡比乌；所引页面未公布合计MW'],
    }),
  point('ploiesti-demand', ['Ploiești–Brazi industrial hub', '普洛耶什蒂—布拉兹工业枢纽'], [25.98,44.94], 'load', ['Refining / chemicals / manufacturing','炼化 / 化工 / 制造'], ['past','current','future'],
    ['A concentrated industrial corridor co-located with major flexible generation.','与大型灵活发电同址的集中工业走廊。'],
    ['Co-location can change local flows but does not net generation and load automatically in a connection study.','同址会改变本地潮流，但并网研究不会自动抵消发电与负荷。'], 'OMV Petrom Brazi asset disclosure', URL.brazi, {
      companies:['OMV Petrom / Petrobrazi'],
      demandScale:['Industrial cluster; no public consolidated electrical peak in the cited asset disclosure','工业集群；所引资产披露未公布公共合计用电峰值'],
      source:['OMV Petrom — Petrobrazi refinery asset','OMV Petrom—Petrobrazi炼油厂资产'],
      sourceUrl:URL.petrobrazi,
      companies:['OMV Petrom — Petrobrazi Refinery'],
      demandScale:['4.5 million tonnes annual refining capacity; process throughput, not electrical MW','年炼油能力450万吨；这是工艺吞吐量，并非用电MW'],
    }),
  point('craiova-demand', ['Craiova digital / automotive hub', '克拉约瓦数字及汽车枢纽'], [23.80,44.32], 'load', ['Data centre / automotive','数据中心 / 汽车'], ['current','future'],
    ['A hyperscale-data-centre investment and automotive manufacturing create different load shapes at one regional hub.','超大规模数据中心投资与汽车制造在同一区域形成不同负荷曲线。'],
    ['Model continuous computing load and production-shift load separately.','应分别建模连续计算负荷及制造轮班负荷。'], 'Romanian Research Authority — ClusterPower visit', URL.craiova, {
      companies:['ClusterPower'],
      demandScale:['ClusterPower disclosed an initial RON 172 million investment and a direct Transelectrica connection; the cited public page does not state electrical MW','ClusterPower披露初始投资1.72亿RON并直接接入Transelectrica；所引公共页面未说明电力MW'],
    }),
  point('galati-demand', ['Galați–Brăila industrial corridor', '加拉茨—布勒伊拉工业走廊'], [28.02,45.42], 'load', ['Steel / ports / shipbuilding','钢铁 / 港口 / 造船'], ['past','current','future'],
    ['Heavy industry and port loads sit close to the eastern transmission reinforcement corridor.','重工业及港口负荷邻近东部输电增容走廊。'],
    ['Electrification announcements require a project FID, load request and connection agreement before entering a base case.','电气化公告须具备项目FID、负荷申请及并网合同后方可进入基准情景。'], 'LIBERTY Steel Romania — Galați plant', URL.libertyGalati, {
      companies:['LIBERTY Galați'],
      demandScale:['Public company evidence confirms the integrated steel plant; no electrical MW peak is disclosed on the cited page','公司公开资料确认一体化钢厂；所引页面未披露用电MW峰值'],
    }),
  point('west-demand', ['Timișoara–Arad manufacturing belt', '蒂米什瓦拉—阿拉德制造业带'], [21.55,45.90], 'load', ['Automotive / electronics / logistics','汽车 / 电子 / 物流'], ['past','current','future'],
    ['Western export manufacturing and urban demand interact with interconnection flows.','西部出口制造业及城市负荷与跨境潮流相互作用。'],
    ['Use contracted demand and coincidence factors, not company headcount or industrial-floor area, in the grid case.','电网案例须采用合同负荷及同时率，而非公司人数或厂房面积。'], 'Continental — Timișoara plant', URL.continentalTimisoara, {
      companies:['Continental Timișoara'],
      demandScale:['The public asset page states around 16 million tyres of annual production; it does not publish an electrical MW peak','公共资产页面披露年产约1,600万条轮胎，但未公布用电MW峰值'],
    }),
];

const routes = [
  {
    id:'ro-legacy-backbone', kind:'route', periods:['past'],
    name:['Legacy 220/400 kV backbone (schematic)','传统220/400千伏骨干网（示意）'],
    coords:[[22.66,44.67],[24.16,45.72],[25.95,44.87],[26.17,44.36],[28.04,44.34]],
    note:['Large hydro, coal, gas and nuclear stations fed urban and industrial load through a meshed AC system.','大型水电、煤电、燃气及核电通过网状交流系统向城市和工业负荷供电。'],
    investor:['Historical topology explains inherited nodes, not current headroom.','历史拓扑解释既有节点，但不代表当前可用空间。'],
    source:'Transelectrica RET Development Plan', sourceUrl:URL.plan,
    endpoints:['Iron Gates → Transylvania → Brazi / Bucharest → Cernavodă','铁门 → 特兰西瓦尼亚 → 布拉兹/布加勒斯特 → 切尔纳沃德'],
    operatingCapacity:['No single MW rating: schematic meshed AC network','无单一MW额定值：网状交流网络示意'],
    status:['Historical structural view; constituent circuits continue in the present system','历史结构视图；相关回路继续存在于现有系统'],
  },
  {
    id:'ro-current-backbone', kind:'route', periods:['current','future'],
    name:['Existing Romanian 400 kV backbone (schematic)','现有罗马尼亚400千伏骨干网（示意）'],
    coords:[[22.66,44.67],[21.89,45.30],[21.31,46.17],[24.16,45.72],[25.95,44.87],[26.17,44.36],[28.04,44.34],[27.93,45.48]],
    note:['The existing meshed 400 kV system remains the core network while new ring sections and eastern corridors are added.','现有网状400千伏系统仍为核心网络，同时新增环网区段及东部走廊。'],
    investor:['Use Transelectrica study cases and outage assumptions; the drawn line is not one asset.','须采用Transelectrica研究情景及停电假设；图示线路并非单一资产。'],
    source:'Transelectrica RET Development Plan 2026–2035', sourceUrl:URL.plan,
    endpoints:['Western border / Iron Gates ↔ centre ↔ Bucharest / Dobrogea / Moldova region','西部边境/铁门 ↔ 中部 ↔ 布加勒斯特/多布罗加/摩尔达维亚地区'],
    operatingCapacity:['No single MW rating: meshed AC system','无单一MW额定值：网状交流系统'],
    status:['Existing network; national-orientation schematic','现有网络；全国方位示意'],
    capacityBasis:['Boundary capability varies with outages, dispatch and cross-border flow','断面能力随检修、调度及跨境潮流变化'],
  },
  {
    id:'cernavoda-stalpu', kind:'route', periods:['future'], layer:'plan',
    planClass:'renewables', planClassLabel:['Renewable integration','新能源接入'], planYear:2030,
    planStatus:['Named work in the adopted RET plan; no published construction start','已列入通过的RET规划的具名工程；未公布开工时间'],
    name:['Cernavodă–Stâlpu 400 kV corridor','切尔纳沃德—斯特尔普400千伏走廊'],
    coords:[[28.04,44.34],[27.45,44.55],[26.72,45.00]],
    note:['A named reinforcement for evacuating nuclear and renewable generation from the south-east.','用于送出东南部核电及新能源的具名增容工程。'],
    investor:['Tie any project value to the specific section, permit and commissioning date—not the plan headline.','项目价值须与具体区段、许可及投运日期挂钩，而非规划标题。'],
    source:'Transelectrica RET Development Plan 2026–2035', sourceUrl:URL.plan,
    endpoints:['Cernavodă ↔ Stâlpu','切尔纳沃德 ↔ 斯特尔普'],
    owner:['Transelectrica','Transelectrica'],
    plannedCapacity:['400 kV AC reinforcement; no single public transfer-MW rating','400千伏交流增容；无公开单一输送MW额定值'],
    status:['Development-plan programme; section-by-section delivery must be checked','发展规划工程；须逐区段核查交付状态'],
  },
  {
    id:'gutinas-smardan', kind:'route', periods:['future'], layer:'plan',
    planClass:'renewables', planClassLabel:['Renewable integration','新能源接入'], planYear:2030,
    planStatus:['Named work in the adopted RET plan; no published construction start','已列入通过的RET规划的具名工程；未公布开工时间'],
    name:['Gutinaș–Smârdan 400 kV double circuit','古蒂纳什—斯默尔丹400千伏双回路'],
    coords:[[26.82,46.21],[27.40,45.85],[27.93,45.48]],
    note:['Planned eastern double-circuit reinforcement studied for renewable and conventional connections.','面向新能源及常规电源并网研究的规划东部双回路增容线路。'],
    investor:['Study completion is not construction completion; evidence land, permits, procurement and energisation separately.','研究完成不等于建设完成；须分别证明土地、许可、采购及送电。'],
    source:'Transelectrica Gutinaș–Smârdan study', sourceUrl:URL.smardan,
    endpoints:['Gutinaș ↔ Smârdan','古蒂纳什 ↔ 斯默尔丹'],
    owner:['Transelectrica','Transelectrica'],
    plannedCapacity:['400 kV double-circuit AC; no single public transfer-MW rating','400千伏双回交流；无公开单一输送MW额定值'],
    status:['Planned; public studies completed, delivery remains a project milestone','规划中；公共研究已完成，交付仍属项目里程碑'],
  },
  {
    id:'western-ring', kind:'route', periods:['future'], layer:'plan',
    planClass:'interconnection', planClassLabel:['Interconnection','跨境互联'], planYear:2030,
    planStatus:['Named work group in the adopted RET plan; transfer capability is scenario-dependent','已列入通过的RET规划的具名工程组；输送能力取决于情景'],
    name:['Western 400 kV ring / Serbia reinforcement group','西部400千伏环网及塞尔维亚增容工程组'],
    coords:[[22.66,44.67],[21.89,45.30],[21.31,46.17]],
    note:['Porțile de Fier–Reșița and Timișoara–Arad works strengthen the western ring and border interface.','铁门—雷希察及蒂米什瓦拉—阿拉德工程增强西部环网及边境接口。'],
    investor:['Interconnector capability and a local connection right are different products.','互联输送能力与本地并网权利是不同产品。'],
    source:'Transelectrica RET Development Plan 2026–2035', sourceUrl:URL.plan,
    endpoints:['Porțile de Fier ↔ Reșița ↔ Timișoara / Arad','铁门 ↔ 雷希察 ↔ 蒂米什瓦拉/阿拉德'],
    owner:['Transelectrica with cross-border counterparties where applicable','Transelectrica及适用的跨境对手方'],
    plannedCapacity:['400 kV AC programme; transfer capability is scenario-dependent','400千伏交流工程；输送能力取决于情景'],
    status:['Multi-project development programme, not one commissioned line','多项目发展计划，并非单一已投运线路'],
  },
];

const sourceCatalog = [
  { id:'ro-gisco-boundary', owner:'Eurostat GISCO', title:'Countries 2024, 1:10m, EPSG:4326', url:URL.boundary, format:'GeoJSON', cadence:'periodic', licence:'Eurostat reuse policy', automation:'B', checkedAt:'2026-07-29' },
  { id:'ro-transelectrica-plan', owner:'Transelectrica', title:'RET Development Plan 2026–2035', url:URL.plan, format:'PDF', cadence:'biennial / plan updates', licence:'public information terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-transelectrica-capacity', owner:'Transelectrica', title:'Indicative available connection capacity map', url:URL.capacityMap, format:'public interactive map', cadence:'operator updates', licence:'public information terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-anre-project-status', owner:'ANRE', title:'Renewable-project connection status at 1 March 2026', url:URL.anreProjects, format:'PDF table', cadence:'monthly', licence:'Romanian public-sector information terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-anre-reform', owner:'ANRE', title:'Connection and licensing reform, 21 May 2026', url:URL.anreReform, format:'HTML', cadence:'event-driven', licence:'Romanian public-sector information terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-transelectrica-smardan', owner:'Transelectrica', title:'Gutinaș–Smârdan 400 kV study', url:URL.smardan, format:'HTML', cadence:'project milestones', licence:'public information terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-snn-cernavoda', owner:'Nuclearelectrica', title:'Cernavodă Units 3 and 4', url:URL.cernavoda, format:'HTML', cadence:'project milestones', licence:'publisher terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-hidroelectrica-assets', owner:'Hidroelectrica', title:'Asset prospectus', url:URL.hydro, format:'PDF', cadence:'issuer updates', licence:'publisher terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-omv-brazi', owner:'OMV Petrom', title:'Brazi power plant', url:URL.brazi, format:'HTML', cadence:'asset updates', licence:'publisher terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-adr-cloud', owner:'Romanian Digitalisation Authority', title:'Government Private Cloud', url:URL.cloud, format:'HTML', cadence:'project updates', licence:'Romanian public-sector information terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-research-craiova', owner:'Romanian Research Authority', title:'ClusterPower Craiova', url:URL.craiova, format:'HTML', cadence:'event-driven', licence:'Romanian public-sector information terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-liberty-galati', owner:'LIBERTY Steel Romania', title:'LIBERTY Galați plant disclosure', url:URL.libertyGalati, format:'HTML', cadence:'company updates', licence:'publisher terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-continental-timisoara', owner:'Continental AG', title:'Timișoara plant disclosure', url:URL.continentalTimisoara, format:'HTML', cadence:'company updates', licence:'publisher terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-anre-auction', owner:'ANRE', title:'Auction-based connection allocation rules, 30 July 2024', url:URL.anreAuction, format:'HTML', cadence:'rule updates', licence:'Romanian public-sector information terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-snn-cernavoda-integrated-report', owner:'Nuclearelectrica', title:'2025 integrated annual report: operating Units 1 and 2 and Units 3 and 4 programme', url:URL.cernavoda, format:'PDF', cadence:'annual', licence:'publisher terms', automation:'C', checkedAt:'2026-07-29' },
  { id:'ro-omv-petrobrazi', owner:'OMV Petrom', title:'Petrobrazi refinery asset', url:URL.petrobrazi, format:'HTML', cadence:'asset updates', licence:'publisher terms', automation:'C', checkedAt:'2026-07-29' },
];

export const RO_GRID_MAP = {
  id:'ro-grid-map',
  ariaLabel:['Interactive Romania electricity-system map','罗马尼亚电力系统交互地图'],
  title:['Romania grid structure by period','罗马尼亚不同时期电网结构'],
  defaultPeriod:'current',
  defaultSelectedId:'cernavoda-generation',
  boundary,
  boundarySource:{ label:['Eurostat GISCO Countries 2024','Eurostat GISCO 2024年国家边界'], url:URL.boundary },
  periodOrder:['past','current','future'],
  periods:{
    past:{ label:['Past · 2010','过去 · 2010'], kicker:['Central generation and inherited corridors','集中式发电与既有走廊'], thesis:['Hydro, coal, nuclear and urban demand were linked by an inherited 220/400 kV AC system.','水电、煤电、核电及城市负荷由既有220/400千伏交流系统连接。'], implication:['History explains node strength, but cannot evidence present spare capacity.','历史可解释节点强度，但不能证明当前可用容量。'] },
    current:{ label:['Current · 2026','当前 · 2026'], kicker:['Large paper queue, limited mature capacity','庞大纸面队列，成熟容量有限'], thesis:['South-east renewables and new storage compete for constrained transfer while load remains concentrated around Bucharest and industrial corridors.','东南部新能源及新增储能竞争有限输送空间，而负荷仍集中于布加勒斯特及工业走廊。'], implication:['An indicative map or ATR headline is insufficient: reconcile the exact project through contract, permits and energisation evidence.','示意地图或ATR标题不足为证：须按合同、许可及送电证据逐项核对具体项目。'] },
    future:{ label:['Planned · 2035','规划 · 2035'], kicker:['Ring completion and eastern reinforcement','环网补全与东部增容'], thesis:['Named 400 kV corridors, nuclear expansion and digital/industrial loads reshape flows, subject to section-by-section delivery.','具名400千伏走廊、核电扩建及数字/工业负荷将重塑潮流，但取决于逐区段交付。'], implication:['Underwrite only the named reinforcement and milestone written into the connection study and agreement.','仅承销并网研究及合同中写明的具名增容工程与里程碑。'] },
  },
  layers:{
    node:{label:['Connection nodes','并网节点']},
    generation:{label:['Generation','发电']},
    load:{label:['Demand hubs','负荷集群']},
    route:{label:['Network paths','网络路径']},
  },
  points,
  routes,
  /* Fetched at runtime from public/, never imported — see
     scripts/refresh-grid-networks.mjs and
     src/governance/transmissionVoltage.js for the voltage floor. */
  transmissionManifest: '/data/grid/ro-transmission.manifest.json',
  sourceCatalog,
  scope:['National orientation only. Coordinates are approximate locality centroids; the map does not show spare capacity, queue priority, live output or an investable connection right.','仅用于全国方位展示。坐标为近似地点中心；地图不显示可用容量、队列优先级、实时出力或可投资并网权利。'],
};
