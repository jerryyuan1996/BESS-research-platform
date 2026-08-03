import prefectures from './jp-prefectures-lite.json' with { type:'json' };
import zoneSet from './jp-zones.json' with { type:'json' };

const URL = {
  geometry:'https://raw.githubusercontent.com/geolonia/prefecture-tiles/master/prefectures.geojson',
  occtoSupply:'https://www.occto.or.jp/assets/en/information_disclosure/supply_plan/files/2025_Aggregation_of_Electricity_Supply_Plan.pdf',
  occtoMaster:'https://www.occto.or.jp/news/kouikikeitou_chokihoushin_230329_choukihoushin_sakutei.html',
  occtoReinforcement:'https://www.occto.or.jp/assets/iinkai/kouikikeitouseibi/cost/2024/files/cost_40_01_01.pdf',
  occtoFutureCapacity:'https://www.occto.or.jp/assets/iinkai/chouseiryoku/jukyuchousei/2024/files/unyouyouryousagyoukai_2_05.pdf',
  occtoRole:'https://www.occto.or.jp/en/works/no5.html',

  tepcoSystem:'https://www.tepco.co.jp/pg/consignment/system/',
  tepcoPlan:'https://www.tepco.co.jp/pg/company/press-information/information/2024/1667328_8924.html',
  shinToyosu:'https://www.tepco.co.jp/cc/press/00112101-j.html',
  futtsu:'https://www.jera.co.jp/en/corporate/business/thermal-power/list/futtsu',
  kashiwazaki:'https://www.tepco.co.jp/en/hd/ourbusiness/nuclear/kashiwazaki-kariwa/overview/index-e.html',
  choshi:'https://www.tepco.co.jp/en/rp/ourbusiness/wind/choshi.html',
  isumi:'https://www.meti.go.jp/policy/safety_security/industrial_safety/sangyo/electric/detail/furyoku_chibakenisumishiokiniokeruyoujou_mitsubishisyouji.html',
  chibaIndustry:'https://www.pref.chiba.lg.jp/sanshin/keiyo-rinkai/gx-suishinkaigi/index.html',
  tepcoAccess:'https://www.tepco.co.jp/pg/consignment/workshop/information/renewable/adjustment/',

  kyushuHistory:'https://www.kyuden.co.jp/company/history/energy/powertransmission/powertransmission.html',
  kyushuSystem:'https://www.kyuden.co.jp/td/application/electric-power-generation-business/discount.html',
  kyushuDemand:'https://www.kyuden.co.jp/var/rev0/0846/7992/dkhdp0I8.pdf',
  kyushuAccess:'https://www.kyuden.co.jp/td/service/wheeling/outline/flow.html',
  kyushuCurtailment:'https://www.kyuden.co.jp/td/renewable-energy/purchase/control/implementation-method-after.html',
  genkai:'https://www.kyuden.co.jp/company/pamphlet/plant/nuclear/genkai-gaiyou-ei.html',
  sendai:'https://www.kyuden.co.jp/english/company/news/2023/h231025-1.html',
  matsuura:'https://www.jpower.co.jp/english/business/equipment/',
  buzen:'https://www.kyuden.co.jp/td/renewable-energy/purchase/control/implementation-method-present.html',
  jasm:'https://www.tsmc.com/static/japanese/careers/jasm/discover_jasm.html',

  hokkaidoSystem:'https://www.hepco.co.jp/network/con_service/public_document/bid_info.html',
  hokkaidoAccess:'https://www.hepco.co.jp/network/con_service/sys_access/',
  hokkaidoReport:'https://www.hepco.co.jp/english/ir/pdf/hepco_group_report_2025.pdf',
  hokkaidoPlan:'https://www.hepco.co.jp/english/ir/pdf/management_plan_fy2026.pdf',
  kitahon:'https://www.hepco.co.jp/network/stable_supply/efforts/north_reinforcement/index.html',
  kitahonTech:'https://www.hepco.co.jp/network/stable_supply/efforts/north_reinforcement/new_equipment_peculiarity.html',
  kitahonExpansion:'https://www.hepco.co.jp/network/info/2023/__icsFiles/afieldfile/2023/09/01/230901.pdf',
  tomari:'https://www.hepco.co.jp/energy/atomic/about/index.html',
  ishikariWind:'https://www.jera.co.jp/en/corporate/business/projects/ishikari-bay',
  ishikariDC:'https://www.city.ishikari.hokkaido.jp/sangyo/yuchi/1002892.html',
  rapidus:'https://www.pref.hokkaido.lg.jp/kz/zhs/',
  nttDataTokyo:'https://dc.jp.nttdata.com/english/',
  inzaiGoogle:'https://www.city.inzai.lg.jp/0000015951.html',
  kddiDC:'https://biz.kddi.com/english/service/data-center/',
  kitakyushuIndustry:'https://www.city.kitakyushu.lg.jp/tobata/file_0078.html',
  tomakomaiIndustry:'https://www.city.tomakomai.hokkaido.jp/group/group_178.html',
  jrHokkaido:'https://www.jrhokkaido.co.jp/global/english/policy/index.html',
};

const PERIODS = {
  past:{
    label:['Past · 2010','过去 · 2010年'],
    kicker:['Central supply before today’s queue pressure','当前排队压力形成前的集中式供电'],
    thesis:['Large thermal and nuclear fleets fed demand through regional AC backbones.','大型火电与核电机组经区域交流骨干网向负荷中心供电。'],
    implication:['Historic capacity explains inherited fault levels and corridors; it is not current deliverable output.','历史容量用于解释既有短路水平与输电走廊，并非当前可交付出力。'],
  },
  current:{
    label:['Current · 2026','当前 · 2026年'],
    kicker:['Operational topology and disclosed assets','在运拓扑与已披露资产'],
    thesis:['Interties, renewable variability and new industrial demand now shape both import and export constraints.','联络线、可再生能源波动及新增工业负荷共同塑造充电与送出约束。'],
    implication:['A project must evidence charging and discharging rights separately at its actual connection point.','项目必须在实际接入点分别证明充电与放电权利。'],
  },
  future:{
    label:['Future · 2034','未来 · 2034年'],
    kicker:['Committed projects separated from scenarios','区分已承诺项目与情景'],
    thesis:['Reinforcement and new supply arrive alongside data-centre, semiconductor and electrification demand.','电网增容及新增电源将与数据中心、半导体及电气化负荷同步增长。'],
    implication:['Do not treat a master-plan corridor, environmental-assessment ceiling or nameplate MW as funded, available headroom.','不得将总规走廊、环评上限或铭牌MW视为已融资、可用的并网余量。'],
  },
};

const LAYERS = {
  node:{ label:['Grid nodes','电网节点'] },
  generation:{ label:['Generation','发电'] },
  load:{ label:['Demand hubs','负荷枢纽'] },
  route:{ label:['Network paths','网络路径'] },
};

const featureCodes = codes => ({
  type:'FeatureCollection',
  features:prefectures.features.filter(feature => codes.includes(feature.properties.code)),
});

/* Standing map labels. Demand centres and generation zones always carry one —
   they are the geography that orients a reader against a published network
   plan. Nodes carry one only where the map is sparse enough to take it; on the
   denser maps they would bury the routes they sit on. Any point overrides with
   `label:false` or places its text with `labelAnchor` / `labelBelow`. */
const LABEL_KINDS = new Set(['load','generation','node']);
const point = (id, name, coord, kind, subtype, periods, fields) => ({
  id, name, coord, kind, subtype, periods, size:1, label:LABEL_KINDS.has(kind), ...fields,
});
const route = (id, name, coords, periods, fields) => ({
  id, name, coords, kind:'route', periods, ...fields,
});
const src = (id, owner, title, url, format = 'HTML', cadence = 'Event-driven', licence = 'Public website; publisher terms apply', automation = 'C') => ({
  id, owner, title, url, format, cadence, licence, automation, checkedAt:'2026-07-29',
});

const commonCatalog = [
  src('jp-boundary-geolonia','Geolonia / MLIT-derived community dataset','Japan prefecture polygons',URL.geometry,'GeoJSON','Repository updates','MIT; source data attribution applies','B'),
  src('occto-supply-2025','OCCTO','Aggregation of Electricity Supply Plans FY2025',URL.occtoSupply,'PDF / tables','Annual','Public official document','C'),
  src('occto-master-plan','OCCTO','Long-term cross-regional network master plan',URL.occtoMaster,'HTML + PDF/ZIP','Five-year review / policy change','Public official document','B'),
  src('occto-reinforcement','OCCTO','Cross-regional reinforcement status and ratings',URL.occtoReinforcement,'PDF','Committee updates','Public official document','C'),
  src('occto-future-capacity','OCCTO','Future operational capacity working-group material',URL.occtoFutureCapacity,'PDF','Committee updates','Public official document','C'),
  src('occto-role','OCCTO','Long-term network planning role',URL.occtoRole,'HTML','Policy updates','Public official page','C'),
];

const tokyoCatalog = [
  ...commonCatalog,
  src('tepco-system','TEPCO Power Grid','Published network information and prefectural network files',URL.tepcoSystem,'HTML / PDF / CSV','Periodic','Public official data','B'),
  src('tepco-plan','TEPCO Power Grid','Major substation investment plan',URL.tepcoPlan,'HTML','Annual','Public official page','C'),
  src('shin-toyosu','TEPCO','Shin-Toyosu 500kV substation and cable',URL.shinToyosu,'HTML','Static','Public official archive','C'),
  src('jera-futtsu','JERA','Futtsu Thermal Power Station',URL.futtsu,'HTML','Asset updates','Public company disclosure','C'),
  src('tepco-kashiwazaki','TEPCO Holdings','Kashiwazaki-Kariwa status and capacity',URL.kashiwazaki,'HTML','Operational updates','Public company disclosure','C'),
  src('tepco-choshi','TEPCO Renewable Power','Choshi offshore wind operating asset',URL.choshi,'HTML','Asset updates','Public company disclosure','C'),
  src('meti-isumi','METI','Isumi offshore wind environmental assessment',URL.isumi,'HTML + PDF','Assessment milestones','Public official record','C'),
  src('chiba-industry','Chiba Prefecture','Keiyo coastal industrial GX council',URL.chibaIndustry,'HTML','Council updates','Public official page','C'),
  src('tepco-access','TEPCO Power Grid','Grid-access and connection information',URL.tepcoAccess,'HTML / PDF','Rule updates','Public official page','C'),
  src('ntt-data-tokyo','NTT DATA','Otemachi and Tokyo data-centre locations',URL.nttDataTokyo,'HTML','Asset updates','Public company disclosure','C'),
  src('inzai-google','Inzai City','Google data-centre operation in Inzai',URL.inzaiGoogle,'HTML','Static / municipal updates','Public municipal page','C'),
];

const kyushuCatalog = [
  ...commonCatalog,
  src('kyushu-history','Kyushu Electric Power','History of the 500kV regional backbone',URL.kyushuHistory,'HTML','Static archive','Public company archive','C'),
  src('kyushu-system','Kyushu Electric Power T&D','Named substations and locational network discounts',URL.kyushuSystem,'HTML','Periodic','Public official data','C'),
  src('kyushu-demand','Kyushu Electric Power','FY2026 investor material: semiconductor and data-centre demand outlook',URL.kyushuDemand,'PDF','Quarterly / annual','Public company disclosure','C'),
  src('kyushu-access','Kyushu Electric Power T&D','Connection process and construction contribution flow',URL.kyushuAccess,'HTML / PDF','Rule updates','Public official page','C'),
  src('kyushu-curtailment','Kyushu Electric Power T&D','Output-control and transfer-trip operating method',URL.kyushuCurtailment,'HTML','Method updates','Public official page','C'),
  src('genkai','Kyushu Electric Power','Genkai Nuclear Power Station overview',URL.genkai,'HTML + PDF','Asset updates','Public company disclosure','C'),
  src('sendai','Kyushu Electric Power','Sendai Units 1 and 2 operating-life approval',URL.sendai,'HTML','Event-driven','Public company disclosure','C'),
  src('matsuura','J-POWER','J-POWER facilities and operating capacity',URL.matsuura,'HTML','Periodic','Public company disclosure','C'),
  src('buzen','Kyushu Electric Power T&D','Buzen 50MW storage demonstration and curtailment method',URL.buzen,'HTML','Method updates','Public official page','C'),
  src('jasm','TSMC / JASM','Kumamoto JASM ownership and production scale',URL.jasm,'HTML','Project updates','Public company disclosure','C'),
  src('kddi-dc','KDDI','Telehouse data-centre locations including Fukuoka',URL.kddiDC,'HTML','Asset updates','Public company disclosure','C'),
  src('kitakyushu-industry','Kitakyushu City','Nippon Steel Kyushu Works industrial-tourism profile',URL.kitakyushuIndustry,'HTML','Municipal updates','Public municipal page','C'),
];

const hokkaidoCatalog = [
  ...commonCatalog,
  src('hokkaido-system','Hokkaido Electric Power Network','Published congestion map and network datasets',URL.hokkaidoSystem,'HTML / PDF / CSV','Periodic','Public official data','B'),
  src('hokkaido-access','Hokkaido Electric Power Network','Grid-access, non-firm and battery early-connection rules',URL.hokkaidoAccess,'HTML / PDF','Rule updates','Public official page','C'),
  src('hokkaido-report','Hokkaido Electric Power','HEPCO Group Report 2025',URL.hokkaidoReport,'PDF','Annual','Public company disclosure','C'),
  src('hokkaido-plan','Hokkaido Electric Power','FY2026 management plan and demand/generation outlook',URL.hokkaidoPlan,'PDF','Annual','Public company disclosure','C'),
  src('kitahon','Hokkaido Electric Power Network','New Hokkaido-Honshu HVDC Link',URL.kitahon,'HTML','Asset updates','Public official page','C'),
  src('kitahon-tech','Hokkaido Electric Power Network','Voltage-source converter case study',URL.kitahonTech,'HTML','Static / asset updates','Public official page','C'),
  src('kitahon-expansion','Hokkaido Electric Power Network','New-New Kitahon 300MW expansion works',URL.kitahonExpansion,'PDF','Project updates','Public official document','C'),
  src('tomari','Hokkaido Electric Power','Tomari Nuclear Power Station capacity',URL.tomari,'HTML','Asset updates','Public company disclosure','C'),
  src('ishikari-wind','JERA','Ishikari Bay New Port offshore wind and battery',URL.ishikariWind,'HTML','Asset updates','Public company disclosure','C'),
  src('ishikari-dc','Ishikari City','Sakura Internet green-energy data centre',URL.ishikariDC,'HTML','Project updates','Public municipal page','C'),
  src('rapidus','Hokkaido Prefecture','Next-generation semiconductor location portal',URL.rapidus,'HTML','Project updates','Public prefectural page','C'),
  src('tomakomai-industry','Tomakomai City','Municipal company data book',URL.tomakomaiIndustry,'HTML','Municipal updates','Public municipal page','C'),
  src('jr-hokkaido-sapporo','Hokkaido Railway Company','Corporate address in Sapporo',URL.jrHokkaido,'HTML','Company updates','Public company disclosure','C'),
];

const tokyoPoints = [
  point('tokyo-shin-toyosu',['Shin-Toyosu','新丰洲'],[139.79,35.65],'node',['500/275/66kV urban substation','500/275/66千伏城市变电站'],['past','current','future'],{
    owner:['TEPCO Power Grid','东京电力电网'], operatingCapacity:['500kV underground receiving node; 2026 adds one 300MVA 275/66kV transformer','500千伏地下受电节点；2026年新增1台300MVA的275/66千伏变压器'],
    note:['The metropolitan terminal links Shin-Keiyo to central Tokyo through a roughly 40km underground 500kV cable.','该都市终端通过约40公里地下500千伏电缆连接新京叶与东京中心区。'],
    investor:['Urban proximity does not prove 66kV headroom; request the transformer, feeder and N-1 study case.','靠近城市并不证明66千伏侧有余量；应索取变压器、馈线及N-1研究断面。'],
    source:'TEPCO Shin-Toyosu / supply plan', sourceUrl:URL.shinToyosu,
  }),
  point('tokyo-shin-keiyo',['Shin-Keiyo','新京叶'],[140.10,35.71],'node',['500/275kV eastern ring node','500/275千伏东部环网节点'],['past','current','future'],{
    owner:['TEPCO Power Grid','东京电力电网'], capacityBasis:['Network node: no single transferable MW rating','网络节点：不存在单一可转移MW额定值'],
    note:['A principal eastern receiving node connecting the 500kV ring, Tokyo Bay generation and the Shin-Toyosu cable.','连接500千伏环网、东京湾电源及新丰洲电缆的东部主受电节点。'],
    investor:['Study local transformer and circuit constraints separately from the regional peak-demand outlook.','应将本地变压器与线路约束同区域峰值需求预测分开研究。'],
    source:'TEPCO published system information', sourceUrl:URL.tepcoSystem,
  }),
  point('tokyo-shin-fuji',['Shin-Fuji / 50–60Hz interface','新富士 / 50–60赫兹接口'],[138.93,35.35],'node',['500kV node / frequency-conversion corridor','500千伏节点 / 频率转换走廊'],['current','future'],{
    owner:['TEPCO Power Grid / inter-area operators','东京电力电网 / 跨区运营方'], plannedCapacity:['New 750MVA 500/154kV transformer planned for February 2027','计划于2027年2月投运一台750MVA的500/154千伏变压器'],
    note:['This western edge is part of the constrained 50Hz–60Hz exchange corridor with Chubu.','该西部边界属于与中部地区之间受限的50赫兹—60赫兹交换走廊。'],
    investor:['Frequency-converter expansion changes regional scarcity but does not reserve a Tokyo battery connection.','频率转换扩容会改变区域稀缺性，但不会为东京储能项目预留并网。'],
    source:'TEPCO major substation plan', sourceUrl:URL.tepcoPlan,
  }),
  point('tokyo-futtsu',['Futtsu LNG','富津LNG电站'],[139.87,35.34],'generation',['Gas / LNG','燃气 / LNG'],['past','current','future'],{
    owner:'JERA', operatingCapacity:['5,160MW maximum output; nameplate, not live production','最大出力5,160MW；为铭牌容量，并非实时发电量'], plannedCapacity:['No additional committed MW disclosed on the cited asset page','所引资产页面未披露新增已承诺容量'],
    note:['A large flexible Tokyo Bay fleet remains a major source of dispatchable power.','东京湾大型灵活电源群仍是重要可调度电源。'],
    investor:['Model correlated gas dispatch and bay-side network outages; nameplate is not annual availability.','应模拟燃气出力相关性及湾区网络停运；铭牌容量不等于全年可用率。'],
    source:'JERA Futtsu asset page', sourceUrl:URL.futtsu, size:1.2,
  }),
  point('tokyo-kashiwazaki',['Kashiwazaki-Kariwa','柏崎刈羽核电站'],[138.60,37.43],'generation',['Nuclear','核电'],['past','current','future'],{
    owner:['TEPCO Holdings','东京电力控股'], factsByPeriod:{
      past:{ operatingCapacity:['8,212MW station nameplate; all seven units had operated before the post-2011 shutdown','电站铭牌8,212MW；2011年后停运前七台机组均曾运行'] },
      current:{ operatingCapacity:['Unit 6: 1,356MW commercial operation from April 2026; remaining nameplate is not operating output','6号机1,356MW自2026年4月商业运行；其余铭牌容量并非在运出力'] },
      future:{ operatingCapacity:['Unit 6: 1,356MW operating at the map check date','地图核查日6号机1,356MW在运'], plannedCapacity:['Unit 7: 1,356MW potential restart; no assumed COD in this map','7号机1,356MW存在重启可能；本图不假定投运日期'] },
    },
    note:['The station’s role shifts from a historic 8.2GW fleet to unit-by-unit restart evidence.','该站角色由历史8.2GW机群转为按机组核验重启状态。'],
    investor:['Stress Tokyo prices and transmission flows both with and without Unit 7; do not count it until approvals and schedule are evidenced.','应分别在有无7号机情景下测试东京电价与潮流；取得审批与进度证据前不得计入。'],
    source:'TEPCO Kashiwazaki-Kariwa overview', sourceUrl:URL.kashiwazaki, size:1.2,
  }),
  point('tokyo-choshi',['Choshi offshore wind','铫子海上风电'],[140.93,35.69],'generation',['Offshore wind demonstrator','海上风电示范'],['current','future'],{
    owner:['TEPCO Renewable Power','东京电力可再生能源'], operatingCapacity:['2.4MW maximum; commercial since January 2019','最大2.4MW；自2019年1月商业运行'], capacityBasis:['Operating demonstration turbine, not a utility-scale pipeline proxy','在运示范风机，不代表公用事业规模管线'],
    note:['Japan’s first bottom-fixed offshore demonstrator provides operational learning, not material regional capacity.','日本首个着床式海上示范项目提供运营经验，但不构成显著区域容量。'],
    investor:['Separate demonstrator evidence from bankable large-project delivery evidence.','应将示范项目经验与可融资大型项目交付证据分开。'],
    source:'TEPCO Choshi asset page', sourceUrl:URL.choshi,
  }),
  point('tokyo-isumi',['Isumi offshore wind proposal','夷隅海上风电拟议项目'],[140.55,35.17],'generation',['Offshore wind / assessment','海上风电 / 环评'],['future'],{
    owner:['Mitsubishi Corporation Offshore Wind','三菱商事海上风电'], plannedCapacity:['Up to 520MW in METI environmental-assessment record','经产省环评记录中的上限为520MW'], status:['Assessment-stage ceiling; not operating or committed capacity','环评阶段上限；并非在运或已承诺容量'],
    note:['The marker shows the disclosed assessment envelope off Isumi.','该标记展示夷隅近海已披露的环评规模上限。'],
    investor:['Require award, grid agreement, final design and financing before assigning a COD or generation profile.','在设定投运日期或发电曲线前，应取得中标、并网协议、最终设计及融资证据。'],
    source:'METI environmental-assessment register', sourceUrl:URL.isumi,
  }),
  point('tokyo-core-load',['Central Tokyo demand hub','东京中心负荷枢纽'],[139.72,35.69],'load',['Residential / commercial / finance','居民 / 商业 / 金融'],['past','current','future'],{
    owner:['Multiple utilities and customers','多家公用事业与用户'], companies:['NTT DATA'],
    factsByPeriod:{
      current:{ demandScale:['Tokyo-area FY2025 peak forecast: 54.88GW; hub allocation is not publicly disaggregated','东京区域FY2025峰值预测54.88GW；未公开分拆到本枢纽'] },
      future:{ demandScale:['Tokyo-area FY2034 peak forecast: 58.80GW; scenario, not a connection reservation','东京区域FY2034峰值预测58.80GW；为预测情景，并非并网预留'] },
    },
    capacitySourceUrl:URL.occtoSupply,
    note:['Dense commercial, transport and residential demand is served through underground urban substations.','高密度商业、交通及居民负荷通过城市地下变电站供电。'],
    investor:['Use OCCTO regional demand for context only; obtain site-specific import MW and energisation phasing.','OCCTO区域需求仅作背景；仍须取得场址级受入MW及分期送电计划。'],
    source:'NTT DATA Otemachi; OCCTO regional demand', sourceUrl:URL.nttDataTokyo,
  }),
  point('tokyo-inzai',['Inzai digital-infrastructure hub','印西数字基础设施枢纽'],[140.15,35.83],'load',['Data centres / cloud','数据中心 / 云计算'],['current','future'],{
    owner:['Multiple disclosed operators','多家已披露运营商'], companies:['Google'],
    operatingCapacity:['TEPCO lists two 300MVA transformers at Chiba-Inzai for demand response; this is substation equipment, not contracted IT load','东京电力披露千叶印西两台300MVA变压器用于需求应对；该数字是变电设备而非已签约IT负荷'],
    plannedCapacity:['Further 300MVA transformer additions scheduled through February 2027','计划至2027年2月继续新增300MVA变压器'],
    demandScale:['Operator load is not public; TEPCO’s disclosed equipment response is two 300MVA transformers, not contracted IT MW','运营商负荷未公开；东京电力披露的设备应对为两台300MVA变压器，并非已签约IT MW'],
    capacitySourceUrl:URL.tepcoPlan,
    note:['Inzai’s data-centre concentration is visible in TEPCO’s demand-driven substation programme.','印西数据中心集聚反映在东京电力以需求为驱动的变电站建设计划中。'],
    investor:['Do not convert transformer MVA directly into available MW; request committed load, diversity and N-1 treatment.','不得将变压器MVA直接视为可用MW；应索取已承诺负荷、同时率及N-1处理方式。'],
    source:'Inzai City Google confirmation; TEPCO substation plan', sourceUrl:URL.inzaiGoogle,
  }),
  point('tokyo-keiyo-load',['Keiyo coastal industrial belt','京叶临海工业带'],[140.08,35.54],'load',['Steel / refining / chemicals','钢铁 / 炼化 / 化工'],['past','current','future'],{
    companies:['JFE Steel','JERA','Idemitsu Kosan','Cosmo Oil','Sumitomo Chemical','Mitsui Chemicals'],
    demandScale:['Company-level electricity demand is not public; the prefectural GX council confirms the operating industrial anchors','企业级用电量未公开；县级GX推进会议确认了在营产业主体'],
    note:['The bay-side corridor combines energy-intensive industry with some of Japan’s largest thermal stations.','湾岸走廊集聚高耗能工业及日本部分最大型火电站。'],
    investor:['Test both industrial electrification import growth and thermal-retirement changes to local export flows.','应同时测试工业电气化带来的受入增长及火电退役对本地送出潮流的改变。'],
    source:'Chiba Prefecture Keiyo GX council', sourceUrl:URL.chibaIndustry,
  }),
];

const tokyoRoutes = [
  route('tokyo-legacy-ring',['Legacy 500kV metropolitan outer ring','传统500千伏首都圈外环'],[[139.17,36.12],[139.60,36.16],[140.10,35.71],[139.87,35.34],[139.20,35.31],[138.93,35.35],[139.17,36.12]],['past'],{
    endpoints:['Representative outer-ring nodes around the metropolitan load','环绕首都圈负荷的代表性外环节点'], capacityBasis:['Meshed AC network; no single route MW rating','网状交流系统；无单一线路MW额定值'],
    operatingCapacity:['No single MW rating: meshed 500kV AC system','无单一MW额定值：网状500千伏交流系统'],
    note:['The historical structure moved bulk power from large peripheral stations toward Tokyo.','历史结构将外围大型电源的电力送往东京。'],
    investor:['Past topology is context only; modern connection studies use current outages, fault levels and demand.','历史拓扑仅供背景；现代并网研究采用当前停运、短路水平及需求。'],
    source:'TEPCO published system information', sourceUrl:URL.tepcoSystem,
  }),
  route('tokyo-current-backbone',['Current Tokyo 500/275kV backbone · schematic','当前东京500/275千伏骨干网 · 示意'],[[139.17,36.12],[139.60,36.16],[140.10,35.71],[139.79,35.65],[139.87,35.34],[139.20,35.31],[138.93,35.35]],['current','future'],{
    endpoints:['Higashi-Gunma / Shin-Keiyo / Shin-Toyosu / Shin-Fuji representative nodes','东群马 / 新京叶 / 新丰洲 / 新富士代表节点'], capacityBasis:['Multiple 500/275kV circuits; schematic, not a single asset or transfer limit','多回500/275千伏线路；为示意，非单一资产或输送上限'],
    operatingCapacity:['No single MW rating: meshed 500/275kV AC system','无单一MW额定值：网状500/275千伏交流系统'],
    note:['The meshed backbone remains the core system while specific urban substations and interties are reinforced.','网状骨干网仍是核心系统，同时对特定城市变电站及跨区联络线进行增容。'],
    investor:['Use TEPCO’s circuit-level files and the project study; the map does not imply spare capacity along the line.','应使用东京电力线路级文件及项目研究；本图不表示沿线存在空余容量。'],
    source:'TEPCO published system information', sourceUrl:URL.tepcoSystem,
  }),
  route('tokyo-tohoku-intertie',['Tohoku–Tokyo interconnection','东北—东京联络线'],[[140.93,37.70],[140.89,36.94],[140.55,36.30],[140.10,35.71]],['current','future'],{
    owner:['Tohoku Electric Power Network / TEPCO Power Grid','东北电力网络 / 东京电力电网'], endpoints:['Fukushima/Tohoku corridor ↔ Tokyo-area network','福岛/东北走廊 ↔ 东京区域电网'],
    factsByPeriod:{
      current:{ operatingCapacity:['5,730MW cited pre-reinforcement operational capacity','增容前引用运行容量5,730MW'] },
      future:{ plannedCapacity:['10,280MW after +4,550MW reinforcement, scheduled by end-FY2027','增加4,550MW后达到10,280MW，计划FY2027末完成'] },
    },
    note:['The reinforcement materially increases north-to-south transfer into the largest demand area.','该增容将显著提高向最大负荷区的南向输送能力。'],
    investor:['Higher intertie capacity can compress Tokyo scarcity spreads and alter curtailment elsewhere.','联络线扩容可能压缩东京稀缺价差，并改变其他地区弃电。'],
    source:'OCCTO reinforcement status', sourceUrl:URL.occtoReinforcement,
  }),
  route('tokyo-chubu-fc',['Tokyo–Chubu frequency converters','东京—中部频率转换设施'],[[138.18,36.22],[138.45,36.10],[138.93,35.35]],['current','future'],{
    layer:'plan', planClass:'approved', planClassLabel:['Approved, dated','已批准且有日期'], planYear:2027,
    planStatus:['Approved plan; completion targeted end of FY2027','规划已批准；目标2027财年末完工'],
    owner:['Regional TSOs / J-POWER Transmission','区域输电运营商 / 电源开发送变电网络'], endpoints:['Shin-Shinano / Sakuma / Higashi-Shimizu interface ↔ Tokyo 50Hz area','新信浓 / 佐久间 / 东清水接口 ↔ 东京50赫兹区域'],
    factsByPeriod:{
      current:{ operatingCapacity:['2,100MW aggregate frequency-conversion capacity','频率转换总容量2,100MW'] },
      future:{ plannedCapacity:['3,000MW by end-FY2027 (+900MW)','计划FY2027末达到3,000MW（增加900MW）'] },
    },
    note:['Frequency conversion is the binding technology between eastern 50Hz and western 60Hz systems.','频率转换是东部50赫兹与西部60赫兹系统互联的关键技术。'],
    investor:['Treat converter outages and directional availability as scenarios; aggregate nameplate is not hourly transfer.','应将换流站停运及方向性可用率纳入情景；总铭牌容量不等于逐小时输送能力。'],
    source:'OCCTO reinforcement status', sourceUrl:URL.occtoReinforcement,
  }),
];

const kyushuPoints = [
  point('kyushu-moji',['Moji / Kanmon landing','门司 / 关门登陆点'],[130.96,33.95],'node',['220kV inter-area gateway','220千伏跨区门户'],['past','current','future'],{
    owner:['Kyushu Electric Power T&D','九州电力送配电'], capacityBasis:['Interface rating is route- and direction-specific; not local substation headroom','接口容量具有线路与方向属性；并非本地变电站余量'],
    note:['Kyushu’s only existing land-grid gateway to the interconnected 60Hz system.','九州与60赫兹互联系统之间唯一既有陆上电网门户。'],
    investor:['A battery’s export value depends on Kanmon availability and local north-Kyushu constraints.','储能送出价值取决于关门可用率及北九州本地约束。'],
    source:'Kyushu Electric Power T&D locational network list', sourceUrl:URL.kyushuSystem,
  }),
  point('kyushu-sefuri',['Sefuri','脊振'],[130.29,33.44],'node',['500/220kV backbone node','500/220千伏骨干节点'],['past','current','future'],{
    owner:['Kyushu Electric Power T&D','九州电力送配电'], capacityBasis:['Meshed node; no single MW transfer rating','网状节点；无单一MW输送额定值'],
    note:['A central north-Kyushu node connecting the historic T-shaped 500kV backbone to Fukuoka and western Kyushu.','连接传统T形500千伏骨干网与福冈及九州西部的北九州中心节点。'],
    investor:['Check which 500/220/66kV transformation stage binds the connection.','核查并网受限于500/220/66千伏中的哪一级变换。'],
    source:'Kyushu 500kV network history', sourceUrl:URL.kyushuHistory,
  }),
  point('kyushu-central',['Chuo / central Kyushu','中央 / 九州中部'],[130.69,33.27],'node',['500/220kV backbone node','500/220千伏骨干节点'],['past','current','future'],{
    owner:['Kyushu Electric Power T&D','九州电力送配电'], capacityBasis:['Meshed node; no single MW transfer rating','网状节点；无单一MW输送额定值'],
    note:['A major junction between north-Kyushu demand and the island’s southern generation corridor.','连接北九州负荷与全岛南部电源走廊的重要枢纽。'],
    investor:['Import and export constraints can reverse between solar midday and evening peak.','受入与送出约束可能在光伏午间及晚高峰之间反转。'],
    source:'Kyushu 500kV network history', sourceUrl:URL.kyushuHistory,
  }),
  point('kyushu-n-kumamoto',['North Kumamoto','北熊本'],[130.70,32.92],'node',['220kV demand-facing node','220千伏负荷侧节点'],['current','future'],{
    owner:['Kyushu Electric Power T&D','九州电力送配电'], plannedCapacity:['Demand growth driven by semiconductor investment; node allocation not publicly disclosed','半导体投资推动需求增长；未公开分配到该节点的容量'],
    note:['The node sits near the fast-growing Kumamoto semiconductor corridor.','该节点邻近快速增长的熊本半导体走廊。'],
    investor:['Require staged energisation evidence; a regional demand forecast is not a project supply commitment.','须取得分期送电证据；区域需求预测不等于项目供电承诺。'],
    source:'Kyushu Electric Power demand outlook', sourceUrl:URL.kyushuDemand,
  }),
  point('kyushu-genkai',['Genkai Units 3–4','玄海3–4号机'],[129.84,33.52],'generation',['Nuclear','核电'],['past','current','future'],{
    owner:['Kyushu Electric Power','九州电力'], operatingCapacity:['2,360MW total nameplate: two 1,180MW units','总铭牌2,360MW：两台各1,180MW机组'], plannedCapacity:['No additional committed unit on the cited station overview','所引电站概况未披露新增已承诺机组'],
    note:['Genkai returned large low-carbon baseload to north-west Kyushu after the post-2011 shutdown period.','玄海在2011年后停运期结束后，为九州西北部恢复大型低碳基荷。'],
    investor:['Model unit outages and must-run conditions; nameplate does not equal continuous production.','应模拟机组停运及必开条件；铭牌不等于持续发电。'],
    source:'Kyushu Electric Genkai overview', sourceUrl:URL.genkai, size:1.15,
  }),
  point('kyushu-sendai',['Sendai Units 1–2','川内1–2号机'],[130.19,31.83],'generation',['Nuclear','核电'],['past','current','future'],{
    owner:['Kyushu Electric Power','九州电力'], operatingCapacity:['1,780MW total nameplate: two 890MW units','总铭牌1,780MW：两台各890MW机组'], status:['Operating-life extension approved; actual output varies with outage schedules','延寿已获批准；实际出力随检修计划变化'],
    note:['Southern nuclear generation feeds a region with large midday solar surpluses.','九州南部核电位于午间光伏富余显著的区域。'],
    investor:['Test nuclear outage and high-renewables cases separately when valuing charging windows.','评估充电窗口时，应分别测试核电检修与高可再生能源情景。'],
    source:'Kyushu Electric Sendai operating-life approval', sourceUrl:URL.sendai, size:1.1,
  }),
  point('kyushu-matsuura',['Matsuura thermal fleet','松浦火电机群'],[129.70,33.35],'generation',['Coal','煤电'],['past','current','future'],{
    owner:['J-POWER (mapped asset); adjacent Kyushu Electric units not aggregated','电源开发（图示资产）；不合并相邻九州电力机组'], operatingCapacity:['2,000MW J-POWER nameplate: two 1,000MW units','电源开发铭牌2,000MW：两台各1,000MW机组'],
    note:['A large dispatchable station near the western branch of the 500kV backbone.','邻近500千伏骨干网西支的大型可调度电站。'],
    investor:['Coal retirement and dispatch assumptions alter charging prices and local fault level.','煤电退役与调度假设会改变充电价格及本地短路水平。'],
    source:'J-POWER operating facilities', sourceUrl:URL.matsuura,
  }),
  point('kyushu-buzen-bess',['Buzen battery substation','丰前蓄电池变电站'],[131.13,33.61],'generation',['Grid battery','电网侧储能'],['current','future'],{
    owner:['Kyushu Electric Power T&D','九州电力送配电'], operatingCapacity:['50MW / 300MWh demonstration system','50MW / 300MWh示范系统'], capacityBasis:['Power and energy rating; not annual dispatched energy','功率与能量额定值；并非年度调度电量'],
    note:['A six-hour utility battery was deployed as a renewable-integration demonstration.','该六小时公用事业储能作为可再生能源消纳示范部署。'],
    investor:['The case proves technical integration, not merchant revenue or open connection capacity.','该案例证明技术集成能力，不证明市场化收入或开放并网容量。'],
    source:'Kyushu T&D output-control method archive', sourceUrl:URL.buzen,
  }),
  point('kyushu-fukuoka-load',['Fukuoka metropolitan demand','福冈都市圈负荷'],[130.40,33.59],'load',['Residential / commercial / digital','居民 / 商业 / 数字基础设施'],['past','current','future'],{
    companies:['KDDI Telehouse'],
    factsByPeriod:{
      current:{ demandScale:['Kyushu-area FY2025 peak forecast: 15.63GW; metropolitan allocation is not public','九州区域FY2025峰值预测15.63GW；未公开都市圈分配'] },
      future:{ demandScale:['Kyushu-area FY2034 peak forecast: 15.89GW before Kyuden’s higher-growth sensitivity','九州区域FY2034峰值预测15.89GW；低于九州电力高增长敏感性情景'] },
    },
    capacitySourceUrl:URL.occtoSupply,
    note:['The island’s deepest urban load anchors the northern end of the grid.','全岛最深的城市负荷锚定电网北端。'],
    investor:['Regional demand provides context; site import deliverability remains feeder-specific.','区域需求仅作背景；场址受入可交付性仍取决于具体馈线。'],
    source:'KDDI Telehouse Fukuoka; OCCTO regional demand', sourceUrl:URL.kddiDC,
  }),
  point('kyushu-kitakyushu-load',['Kitakyushu industrial hub','北九州工业枢纽'],[130.88,33.88],'load',['Steel / ceramics / logistics','钢铁 / 陶瓷 / 物流'],['past','current','future'],{
    companies:['Nippon Steel'],
    demandScale:['No public company-level MW aggregation; hub sits beside the Kanmon gateway and heavy-industry network','无公开企业级MW汇总；该枢纽邻近关门门户及重工业电网'],
    capacitySourceUrl:URL.kyushuDemand,
    note:['Industrial demand, generation and the inter-area gateway coexist in a compact northern corridor.','工业负荷、电源及跨区门户共处于紧凑的北部走廊。'],
    investor:['Model industrial electrification and Kanmon export separately; they affect opposite flow directions.','应分别模拟工业电气化与关门送出；二者影响相反潮流方向。'],
    source:'Kitakyushu City Nippon Steel profile; Kyuden demand outlook', sourceUrl:URL.kitakyushuIndustry,
  }),
  point('kyushu-kumamoto-load',['Kumamoto semiconductor cluster','熊本半导体集群'],[130.83,32.87],'load',['Semiconductor fabrication','半导体制造'],['current','future'],{
    companies:['JASM / TSMC','Sony Semiconductor','Tokyo Electron Kyushu','SUMCO'],
    operatingCapacity:['JASM first fab in mass production; electricity MW not publicly disclosed','JASM第一工厂已量产；未公开用电MW'],
    plannedCapacity:['JASM two-fab production expected above 100,000 300mm-equivalent wafers/month; Kyuden identifies about 800MW of disclosed extra-high-voltage projects region-wide','JASM两座工厂预计月产超过10万片300毫米等效晶圆；九州电力识别全区约800MW已披露超高压项目'],
    demandScale:['Kyuden identifies about 800MW of disclosed extra-high-voltage semiconductor/data-centre projects across Kyushu; no hub-level contracted MW is public','九州电力识别全区约800MW已披露超高压半导体/数据中心项目；未公开本枢纽已签约MW'],
    note:['Semiconductor investment is a material new load driver in a grid historically shaped by solar surplus.','半导体投资成为传统受光伏富余影响电网中的重要新增负荷驱动。'],
    investor:['Do not infer the fab’s MW from wafer capacity; obtain the TSO’s staged supply commitment.','不得从晶圆产能推算工厂MW；应取得输电运营商分期供电承诺。'],
    source:'Kyushu Electric Power demand outlook', sourceUrl:URL.kyushuDemand,
  }),
  point('kyushu-satsuma-dc',['Satsumasendai data-centre pipeline','萨摩川内数据中心管线'],[130.31,31.81],'load',['Future data centres','未来数据中心'],['future'],{
    companies:['CDIB Capital consortium','Digital Dynamic'],
    plannedCapacity:['Two disclosed projects: 350MW and 19MW; project capacities, not energised demand','两项已披露项目：350MW及19MW；为项目容量，并非已送电负荷'],
    status:['Pipeline / disclosed development','管线 / 已披露开发'],
    demandScale:['Disclosed pipeline totals 369MW; operating demand is 0MW until energisation is evidenced','已披露管线合计369MW；在送电获证前运行负荷按0MW处理'],
    note:['Large digital demand is proposed near southern generation and constrained export corridors.','大型数字负荷拟建于南部电源及受限送出走廊附近。'],
    investor:['Require land, construction, customer and grid milestones before counting load-led charging value.','在计入负荷带来的充电价值前，应取得土地、建设、客户及电网里程碑。'],
    source:'Kyushu Electric Power demand outlook', sourceUrl:URL.kyushuDemand,
  }),
];

const kyushuRoutes = [
  route('kyushu-legacy-t',['Legacy Kyushu 500kV T-backbone · schematic','传统九州500千伏T形骨干网 · 示意'],[[130.96,33.95],[130.70,33.88],[130.29,33.44],[129.70,33.35],[130.69,33.27],[130.70,32.92],[130.61,32.20],[130.19,31.83]],['past'],{
    endpoints:['Kanmon / Sefuri / Chuo / south-Kyushu corridor','关门 / 脊振 / 中央 / 九州南部走廊'], capacityBasis:['Meshed AC system; no single route MW rating','网状交流系统；无单一线路MW额定值'],
    operatingCapacity:['No single MW rating: meshed 500kV AC system','无单一MW额定值：网状500千伏交流系统'],
    note:['Kyushu’s 500kV network developed from a T-shaped backbone serving large central stations and urban demand.','九州500千伏电网由服务大型集中式电源与城市负荷的T形骨干发展而来。'],
    investor:['Historical topology explains present corridors but not current spare capacity.','历史拓扑解释现有走廊，但不代表当前余量。'],
    source:'Kyushu 500kV network history', sourceUrl:URL.kyushuHistory,
  }),
  route('kyushu-current-backbone',['Current Kyushu 500/220kV backbone · schematic','当前九州500/220千伏骨干网 · 示意'],[[130.96,33.95],[130.70,33.88],[130.29,33.44],[129.70,33.35],[130.69,33.27],[130.70,32.92],[131.00,32.50],[130.19,31.83]],['current','future'],{
    endpoints:['Moji / Sefuri / Chuo / North Kumamoto / southern corridor','门司 / 脊振 / 中央 / 北熊本 / 南部走廊'], capacityBasis:['Multiple circuits and substations; schematic, not a connection offer','多回线路与变电站；为示意，并非并网要约'],
    operatingCapacity:['No single MW rating: meshed 500/220kV AC system','无单一MW额定值：网状500/220千伏交流系统'],
    note:['The original backbone remains in service, now carrying bidirectional flows driven by solar, nuclear and new demand.','原有骨干网仍在役，目前受光伏、核电及新增负荷影响呈双向潮流。'],
    investor:['Separate midday export congestion from evening import conditions.','应区分午间送出拥塞与晚间受入条件。'],
    source:'Kyushu Electric Power T&D locational network list', sourceUrl:URL.kyushuSystem,
  }),
  route('kyushu-kanmon',['Kanmon interconnection','关门联络线'],[[131.00,34.05],[130.96,33.95],[130.88,33.88]],['past','current','future'],{
    owner:['Chugoku Electric Power Network / Kyushu Electric Power T&D','中国电力网络 / 九州电力送配电'], endpoints:['Shimonoseki, Chugoku ↔ Moji, Kyushu','中国地区下关 ↔ 九州门司'],
    operatingCapacity:['2,780MW thermal rating; operational transfer is direction/time-dependent','热稳定额定2,780MW；实际运行输送受方向与时段影响'], status:['Expanded transfer-trip scheme operating from April 2026','扩展转移跳闸系统自2026年4月运行'],
    note:['The AC gateway exports Kyushu surplus but can be constrained by frequency-security limits below thermal rating.','该交流门户可送出九州富余电力，但频率安全可能使运行上限低于热额定。'],
    investor:['Use hourly directional operational capacity, not the 2.78GW thermal ceiling, in revenue models.','收益模型应使用逐小时分方向运行容量，而非2.78GW热额定上限。'],
    source:'Kyushu T&D output-control method', sourceUrl:URL.kyushuCurtailment,
  }),
  route('kyushu-kanmon-reinforcement',['Chugoku–Kyushu reinforcement','中国—九州联络增容'],[[131.00,34.05],[130.96,33.95],[130.70,33.88]],['future'],{
    layer:'plan', planClass:'process', planClassLabel:['In planning process','计划制定流程中'], planYear:2038,
    planStatus:['In the planning process; operation planned for end of FY2038, with an acceleration target of FY2036','处于计划制定流程；计划2038财年末投运，加速目标为2036财年'],
    owner:['Regional TSOs under OCCTO plan','OCCTO规划下的区域输电运营商'], endpoints:['Chugoku area ↔ north Kyushu','中国地区 ↔ 九州北部'],
    plannedCapacity:['+1,000MW; 2,780MW → 3,780MW, targeted around 2030–2033','增加1,000MW；由2,780MW升至3,780MW，目标约2030—2033年'], status:['Basic requirements decided; not current capacity','基本要求已确定；并非当前容量'],
    note:['The committed planning process is narrower than the larger long-term master-plan scenarios.','已进入规划程序的增容规模小于更大规模的长期总规情景。'],
    investor:['Scenario timing and outage sequencing can materially change curtailment and charging value.','投运时间及停电施工顺序会显著改变弃电与充电价值。'],
    source:'OCCTO future operational capacity material', sourceUrl:URL.occtoFutureCapacity,
  }),
  route('kyushu-shikoku-scenario',['Kyushu–Shikoku HVDC scenario','九州—四国HVDC情景'],[[131.55,33.27],[132.10,33.45],[132.70,33.75]],['future'],{
    layer:'plan', planClass:'masterplan', planClassLabel:['Master plan only','仅列入总体规划'], planYear:null,
    planStatus:['Identified in the wide-area master plan only; no delivery entity, works or date','仅在广域总体规划中被识别；无交付主体、工程范围或日期'],
    owner:['Not assigned in the master-plan scenario','总规情景中尚未确定'], endpoints:['East Kyushu ↔ Shikoku','九州东部 ↔ 四国'],
    plannedCapacity:['Up to 2,800MW in the long-term master-plan scenario','长期总规情景最高2,800MW'], status:['Scenario / not a committed construction project','情景 / 非已承诺建设项目'],
    note:['The master plan tests a new offshore HVDC outlet for renewable export.','总规测试新增海上HVDC通道以送出可再生能源。'],
    investor:['Never include this corridor in a base case until route, owner, funding and schedule are approved.','在路线、业主、融资及工期获批前，不得将该走廊纳入基准情景。'],
    source:'OCCTO cross-regional master plan', sourceUrl:URL.occtoMaster,
  }),
];

const hokkaidoPoints = [
  point('hokkaido-nishi-tobetsu',['Nishi-Tobetsu','西当别'],[141.45,43.22],'node',['275/187kV central node','275/187千伏中部节点'],['past','current','future'],{
    owner:['Hokkaido Electric Power Network','北海道电力网络'], capacityBasis:['Meshed node; no single transferable MW rating','网状节点；无单一可转移MW额定值'],
    note:['A central junction linking Sapporo, Ishikari renewable supply and the wider island grid.','连接札幌、石狩可再生能源及全岛电网的中部枢纽。'],
    investor:['Check charging-side forward-flow headroom as well as export capability.','除送出能力外，还须核查充电侧顺潮流余量。'],
    source:'HEPN published network information', sourceUrl:URL.hokkaidoSystem,
  }),
  point('hokkaido-nishino',['Nishino / Sapporo','西野 / 札幌'],[141.24,43.06],'node',['275/187kV demand node','275/187千伏负荷节点'],['past','current','future'],{
    owner:['Hokkaido Electric Power Network','北海道电力网络'], capacityBasis:['Demand-facing node; local headroom requires a connection study','负荷侧节点；本地余量须通过并网研究确认'],
    note:['The node serves the island’s largest urban load and receives Ishikari offshore wind through the western network.','该节点服务全岛最大城市负荷，并通过西部电网接收石狩海上风电。'],
    investor:['Proximity to Sapporo demand can support charging, but feeder constraints remain site-specific.','靠近札幌负荷可能有利于充电，但馈线约束仍取决于具体场址。'],
    source:'HEPN published network information', sourceUrl:URL.hokkaidoSystem,
  }),
  point('hokkaido-minami-hayakita',['Minami-Hayakita','南早来'],[141.82,42.75],'node',['275/187kV south-central node','275/187千伏中南部节点'],['past','current','future'],{
    owner:['Hokkaido Electric Power Network','北海道电力网络'], capacityBasis:['Meshed node connecting Tomakomai, Hidaka and eastern corridors','连接苫小牧、日高及道东走廊的网状节点'],
    note:['A key junction between large thermal generation, the Sapporo load pocket and eastern Hokkaido.','大型火电、札幌负荷中心及道东之间的关键枢纽。'],
    investor:['Large nearby generation can worsen export constraints even where charging looks attractive.','邻近大型电源可能加剧送出约束，即使充电条件看似有利。'],
    source:'HEPN published network information', sourceUrl:URL.hokkaidoSystem,
  }),
  point('hokkaido-kita-shintoku',['Kita-Shintoku','北新得'],[142.84,43.10],'node',['275/187kV eastern gateway','275/187千伏道东门户'],['current','future'],{
    owner:['Hokkaido Electric Power Network','北海道电力网络'], capacityBasis:['275kV node opened in 2008; route capacity depends on multiple eastern circuits','2008年投运的275千伏节点；输送能力取决于多回道东线路'],
    note:['The node strengthened delivery into eastern Hokkaido but remains part of a long, lightly meshed system.','该节点增强了向道东供电，但仍属于长距离、弱网状系统。'],
    investor:['Study voltage stability, loss factors and outage combinations, not only thermal ratings.','除热额定外，还应研究电压稳定、损耗因子及停运组合。'],
    source:'HEPN published network information', sourceUrl:URL.hokkaidoSystem,
  }),
  point('hokkaido-hokuto',['Hokuto converter','北斗换流站'],[140.66,41.82],'node',['HVDC converter / Honshu gateway','HVDC换流站 / 本州门户'],['current','future'],{
    owner:['Hokkaido Electric Power Network','北海道电力网络'], operatingCapacity:['300MW voltage-source New Kitahon pole at present','当前新北本自励式直流极容量300MW'], plannedCapacity:['Additional 300MW by end-FY2027, lifting total Hokkaido–Honshu interconnection to 1,200MW','FY2027末新增300MW，使北海道—本州联络总容量升至1,200MW'],
    note:['The converter connects through the Seikan Tunnel cable and can exchange power without relying on a strong AC voltage source.','换流站通过青函隧道电缆互联，可在不依赖强交流电压源的情况下交换电力。'],
    investor:['Converter technology supports stability, but scheduled and forced outages still constrain export value.','换流技术提升稳定性，但计划及非计划停运仍会限制送出价值。'],
    source:'HEPN New Kitahon technical case', sourceUrl:URL.kitahonTech,
  }),
  point('hokkaido-tomato-atsuma',['Tomato-Atsuma thermal','苫东厚真火电站'],[141.82,42.61],'generation',['Coal','煤电'],['past','current','future'],{
    owner:['Hokkaido Electric Power','北海道电力'], operatingCapacity:['1,650MW station nameplate; actual output varies by unit availability','电站铭牌1,650MW；实际出力取决于机组可用率'], plannedCapacity:['Unit 4 decarbonisation investment references ammonia co-firing; no added MW counted','4号机脱碳投资涉及氨混烧；本图不计新增MW'],
    note:['The island’s largest thermal complex remains important for adequacy and system strength.','全岛最大火电基地仍对充裕度与系统强度至关重要。'],
    investor:['Single-site outage correlation is material in a small system; stress common-mode events.','在小系统中，单一场址停运相关性显著；应测试共因事件。'],
    source:'HEPCO Group Report 2025', sourceUrl:URL.hokkaidoReport, size:1.2,
  }),
  point('hokkaido-ishikari-lng',['Ishikariwan-Shinko LNG','石狩湾新港LNG电站'],[141.30,43.21],'generation',['Gas / LNG','燃气 / LNG'],['current','future'],{
    owner:['Hokkaido Electric Power','北海道电力'], operatingCapacity:['Unit 1: 569.4MW nameplate','1号机铭牌569.4MW'], plannedCapacity:['Unit 2: 569.4MW in FY2031; Unit 3: 569.4MW in FY2034','2号机569.4MW计划FY2031；3号机569.4MW计划FY2034'],
    status:['Units 2–3 won long-term decarbonisation auction support; still future capacity','2—3号机获长期脱碳电源拍卖支持；仍属未来容量'],
    note:['New LNG capacity is timed against rising industrial demand and retirement of older thermal units.','新增LNG容量与工业负荷增长及老旧火电退役相匹配。'],
    investor:['Separate firm auction-backed delivery from later hydrogen-conversion assumptions.','应区分拍卖支持的交付与后续氢燃料转换假设。'],
    source:'HEPCO FY2026 management plan', sourceUrl:URL.hokkaidoPlan, size:1.1,
  }),
  point('hokkaido-tomari',['Tomari nuclear','泊核电站'],[140.51,43.04],'generation',['Nuclear','核电'],['past','current','future'],{
    owner:['Hokkaido Electric Power','北海道电力'], factsByPeriod:{
      past:{ operatingCapacity:['2,070MW station nameplate across three units before shutdown','停运前三台机组总铭牌2,070MW'] },
      current:{ operatingCapacity:['0MW operating; all three units remain shut at the map check date','地图核查日运行0MW；三台机组仍停运'] },
      future:{ plannedCapacity:['Unit 3: 912MW restart pursued; approval and safety works remain gating evidence','推进3号机912MW重启；审批及安全工程仍是门槛证据'] },
    },
    note:['Tomari is a large latent supply change relative to Hokkaido’s roughly 5GW peak.','相较北海道约5GW峰值，泊核电重启将构成重大潜在供给变化。'],
    investor:['Run both restart and no-restart cases; never assign output from nameplate alone.','应同时运行重启与不重启情景；不得仅凭铭牌容量计入出力。'],
    source:'HEPCO Tomari overview', sourceUrl:URL.tomari, size:1.15,
  }),
  point('hokkaido-ishikari-wind',['Ishikari Bay offshore wind + battery','石狩湾海上风电 + 储能'],[141.20,43.25],'generation',['Offshore wind / co-located battery','海上风电 / 配套储能'],['current','future'],{
    owner:['JERA / GPI / Hokkaido Electric / Tohoku Electric','JERA / GPI / 北海道电力 / 东北电力'], operatingCapacity:['112MW wind nameplate; 99.99MW grid connection; 180MWh battery','风电铭牌112MW；并网99.99MW；配套180MWh储能'],
    note:['The project routes through its battery substation and HEPN’s Nishi-Sapporo node.','项目经自身储能变电站及北海道电力网络西札幌节点送出。'],
    investor:['The storage energy rating smooths export but is not disclosed as independent merchant power capacity.','储能能量容量用于平滑送出，但未披露为独立市场化功率容量。'],
    source:'JERA Ishikari Bay project page', sourceUrl:URL.ishikariWind,
  }),
  point('hokkaido-sapporo-load',['Sapporo metropolitan demand','札幌都市圈负荷'],[141.35,43.06],'load',['Residential / commercial / public services','居民 / 商业 / 公共服务'],['past','current','future'],{
    companies:['Hokkaido Railway Company (JR Hokkaido)'],
    factsByPeriod:{
      current:{ demandScale:['Hokkaido FY2025 peak forecast: 5.01GW; metropolitan allocation is not public','北海道FY2025峰值预测5.01GW；未公开都市圈分配'] },
      future:{ demandScale:['Hokkaido FY2034 peak forecast: 5.37GW','北海道FY2034峰值预测5.37GW'] },
    },
    capacitySourceUrl:URL.occtoSupply,
    note:['Sapporo anchors demand in an island system otherwise dominated by dispersed resource and long lines.','札幌是该岛电网的主要负荷锚点，其余地区资源分散、线路漫长。'],
    investor:['Urban demand improves charging logic but cannot substitute for a site-level import offer.','城市负荷改善充电逻辑，但不能替代场址级受入要约。'],
    source:'JR Hokkaido corporate address; OCCTO regional demand', sourceUrl:URL.jrHokkaido,
  }),
  point('hokkaido-ishikari-dc',['Ishikari green data-centre hub','石狩绿色数据中心枢纽'],[141.32,43.17],'load',['Data centres / digital infrastructure','数据中心 / 数字基础设施'],['current','future'],{
    companies:['Sakura Internet','Ishikari City'],
    demandScale:['Facility MW is not disclosed on the municipal page; location is confirmed, not a grid commitment','市政府页面未披露设施MW；仅确认落地，不构成电网承诺'],
    note:['Ishikari promotes renewable-linked data-centre development beside generation and Sapporo demand.','石狩在电源与札幌负荷之间推动可再生能源关联的数据中心发展。'],
    investor:['Require measured load, contracted expansion and charging coincidence before assuming a storage hedge.','在假定储能对冲价值前，应取得实测负荷、签约扩张及充电时段重合证据。'],
    source:'Ishikari City data-centre page', sourceUrl:URL.ishikariDC,
  }),
  point('hokkaido-chitose-load',['Chitose semiconductor cluster','千岁半导体集群'],[141.65,42.82],'load',['Advanced semiconductor fabrication','先进半导体制造'],['future'],{
    companies:['Rapidus'],
    plannedCapacity:['Rapidus manufacturing site confirmed; electricity MW is not publicly disclosed','Rapidus制造基地已确认；未公开用电MW'], status:['Project development; demand timing is a scenario until network milestones are evidenced','项目开发中；在电网里程碑获证前，需求时点仅为情景'],
    demandScale:['No public contracted MW; treat as unquantified future demand until HEPN energisation evidence is available','无公开已签约MW；在取得北海道电力网络送电证据前，作为未量化未来需求'],
    note:['A large new industrial load can materially change flows between Sapporo, Tomakomai and the eastern grid.','大型新增工业负荷可能显著改变札幌、苫小牧及道东之间潮流。'],
    investor:['Do not estimate MW from semiconductor process claims; use the TSO’s energisation schedule.','不得从制程信息推算MW；应采用输电运营商送电进度。'],
    source:'Hokkaido Prefecture semiconductor portal', sourceUrl:URL.rapidus,
  }),
  point('hokkaido-tomakomai-load',['Tomakomai industrial hub','苫小牧工业枢纽'],[141.60,42.63],'load',['Refining / paper / automotive / logistics','炼化 / 造纸 / 汽车 / 物流'],['past','current','future'],{
    companies:['Idemitsu Kosan','Oji Paper','Toyota Motor Hokkaido'],
    demandScale:['Company-level MW not publicly aggregated; Hokkaido end-use demand is projected to rise from 27.6TWh in 2024 to about 34TWh in 2035','未公开企业级MW汇总；北海道终端用电预计由2024年27.6TWh升至2035年约34TWh'],
    capacitySourceUrl:URL.hokkaidoPlan,
    note:['The industrial-port corridor sits beside large thermal supply and the south-central grid junction.','该工业港口走廊邻近大型火电及中南部电网枢纽。'],
    investor:['Electrification can absorb renewable output, while thermal outages can simultaneously tighten adequacy.','电气化可吸收可再生能源，同时火电停运可能收紧供电充裕度。'],
    source:'Tomakomai municipal company data book; HEPCO demand outlook', sourceUrl:URL.tomakomaiIndustry,
  }),
];

const hokkaidoRoutes = [
  route('hokkaido-legacy-backbone',['Legacy Hokkaido 275/187kV backbone · schematic','传统北海道275/187千伏骨干网 · 示意'],[[140.65,41.90],[141.82,42.75],[141.45,43.22],[141.24,43.06],[142.84,43.10],[144.20,43.05]],['past'],{
    endpoints:['Hakodate / Minami-Hayakita / Sapporo / eastern Hokkaido','函馆 / 南早来 / 札幌 / 道东'], capacityBasis:['Long meshed AC system; no single route MW rating','长距离网状交流系统；无单一线路MW额定值'],
    operatingCapacity:['No single MW rating: meshed 275/187kV AC system','无单一MW额定值：网状275/187千伏交流系统'],
    note:['A small island demand pool relied on long internal corridors and large central stations.','较小的岛内需求池依赖长距离内部走廊及大型集中式电站。'],
    investor:['Historic topology helps explain weak-grid exposure but not present connection rights.','历史拓扑有助解释弱网暴露，但不代表当前并网权利。'],
    source:'HEPN published network information', sourceUrl:URL.hokkaidoSystem,
  }),
  route('hokkaido-current-backbone',['Current Hokkaido 275/187kV backbone · schematic','当前北海道275/187千伏骨干网 · 示意'],[[140.66,41.82],[141.82,42.75],[141.45,43.22],[141.24,43.06],[142.84,43.10],[144.20,43.05]],['current','future'],{
    endpoints:['Hokuto / Minami-Hayakita / Nishi-Tobetsu / Nishino / Kita-Shintoku','北斗 / 南早来 / 西当别 / 西野 / 北新得'], capacityBasis:['Multiple 275/187kV circuits; schematic, not a connection offer','多回275/187千伏线路；为示意，并非并网要约'],
    operatingCapacity:['No single MW rating: meshed 275/187kV AC system','无单一MW额定值：网状275/187千伏交流系统'],
    note:['The original AC spine remains essential while renewable production and industrial demand move farther apart.','随着可再生能源与工业负荷空间分离，原有交流主干仍至关重要。'],
    investor:['Voltage, inertia and outage combinations matter alongside thermal headroom.','除热余量外，还需关注电压、惯量及停运组合。'],
    source:'HEPN published network information', sourceUrl:URL.hokkaidoSystem,
  }),
  route('hokkaido-kitahon-existing',['Hokkaido–Honshu HVDC links','北海道—本州HVDC联络'],[[140.66,41.82],[140.45,41.45],[140.52,41.18]],['past','current','future'],{
    owner:['J-POWER Transmission 600MW + HEPN 300MW','电源开发送变电网络600MW + 北海道电力网络300MW'], endpoints:['Hokuto / Hakodate area ↔ Imabetsu, Aomori','北斗 / 函馆地区 ↔ 青森今别'],
    factsByPeriod:{
      past:{ operatingCapacity:['600MW original Kitahon line before the 2019 addition','2019年扩容前原北本联络线600MW'] },
      current:{ operatingCapacity:['900MW aggregate: 600MW original + 300MW New Kitahon','总计900MW：原北本600MW + 新北本300MW'] },
      future:{ operatingCapacity:['Existing 900MW remains; expansion is shown separately','既有900MW保留；扩容另行展示'] },
    },
    note:['The link is small relative to renewable connection and demand swings, making direction and outage status material.','相较可再生能源接入及需求波动，该联络容量较小，因此方向与停运状态十分重要。'],
    investor:['Use available transfer after outages, not aggregate nameplate, when valuing export relief.','评估送出缓解价值时，应使用停运后的可用输送能力，而非总铭牌。'],
    source:'HEPN New Kitahon overview', sourceUrl:URL.kitahon,
  }),
  route('hokkaido-kitahon-expansion',['New-New Kitahon expansion','新新北本联络扩容'],[[140.66,41.82],[140.57,41.55],[140.52,41.18]],['future'],{
    layer:'plan', planClass:'approved', planClassLabel:['Approved, dated','已批准且有日期'], planYear:2027,
    planStatus:['Approved; delivery by end of FY2027','已批准；2027财年末前交付'],
    owner:['Hokkaido Electric Power Network','北海道电力网络'], endpoints:['Hokuto converter ↔ Imabetsu converter','北斗换流站 ↔ 今别换流站'],
    plannedCapacity:['+300MW; total Hokkaido–Honshu interconnection 900MW → 1,200MW by end-FY2027','新增300MW；北海道—本州联络总容量由900MW升至1,200MW，计划FY2027末完成'], status:['Under construction / official plan','在建 / 官方规划'],
    note:['The additional pole builds on the voltage-source converter and Seikan Tunnel route.','新增极基于自励式换流技术及青函隧道通道建设。'],
    investor:['Commissioning risk and construction outages should remain explicit until commercial operation.','商业运行前，应显式保留投运风险及施工停电情景。'],
    source:'HEPN expansion works summary', sourceUrl:URL.kitahonExpansion,
  }),
  route('hokkaido-sea-japan-hvdc',['Hokkaido–Honshu Sea-of-Japan HVDC','北海道—本州日本海HVDC'],[[141.05,44.20],[140.30,42.90],[139.90,41.30],[139.60,40.20]],['future'],{
    layer:'plan', planClass:'process', planClassLabel:['In planning process','计划制定流程中'], planYear:2030,
    planStatus:['Operator selection targeted for March 2026; completion indicated for the early 2030s','业主选定原定于2026年3月；完工时点指示为2030年代前期'],
    owner:['To be assigned through the eastern-region planning process','将通过东部区域规划程序确定'], endpoints:['Northern/western Hokkaido ↔ northern Honshu','北海道北部/西部 ↔ 本州北部'],
    plannedCapacity:['2,000MW new subsea HVDC in the official planning scenario','官方规划情景中的2,000MW新海底HVDC'], status:['Basic requirements / planning; target window around 2030–2034, not current capacity','基本要求 / 规划阶段；目标约2030—2034年，并非当前容量'],
    note:['The corridor is intended to unlock northern renewable resource and move it toward Honshu demand.','该走廊旨在释放北部可再生能源资源并向本州负荷输送。'],
    investor:['Base cases should exclude it until route, consent, funding and delivery milestones are firm.','在路线、许可、融资及交付里程碑确定前，基准情景应排除该项目。'],
    source:'OCCTO future operational capacity material', sourceUrl:URL.occtoFutureCapacity,
  }),
];

const baseMap = (id, ariaLabel, title, boundary, points, routes, sourceCatalog, defaultSelectedId, boundaryLabelValues, viewBounds) => ({
  id,
  ariaLabel,
  title,
  defaultPeriod:'current',
  defaultSelectedId,
  sourceCatalog,
  boundary,
  boundaryLabelProperty:['name:en','name'],
  boundaryLabelValues,
  viewBounds,
  boundarySource:{ label:['Geolonia prefecture GeoJSON · MLIT-derived','Geolonia都道府县GeoJSON · 源自国土交通省'], url:URL.geometry },
  /* All nine OCCTO areas, shared by the three area maps. A region's storage
     value is set partly by what its neighbours can send it, so the neighbours
     are drawn even on a map zoomed to one of them. */
  zoneSet:{ ...zoneSet, label:['OCCTO areas','广域机关区域'] },
  periodOrder:['past','current','future'],
  periods:PERIODS,
  layers:LAYERS,
  points,
  routes,
  scope:[
    'Investor-orientation map using approximate public locality coordinates and schematic network paths. Capacities are labelled as nameplate, operating, planned or scenario; this is not a connection study or live dispatch display.',
    '面向投资者的区域示意图，采用公开地点的近似坐标及示意网络路径。容量均标明为铭牌、在运、规划或情景；本图并非并网研究或实时调度画面。',
  ],
});

export const TOKYO_GRID_MAP = baseMap(
  'jp-tokyo-grid-map',
  ['Interactive Tokyo-area electricity system map','东京区域交互式电力系统地图'],
  ['Tokyo-area grid structure by period','东京区域不同时期电网结构'],
  featureCodes(['07','08','09','10','11','12','13','14','15','19','20','22']),
  tokyoPoints,
  tokyoRoutes,
  tokyoCatalog,
  'tokyo-shin-toyosu',
  ['Tokyo','Chiba','Kanagawa','Niigata','Fukushima','Shizuoka'],
  [[137.5,34.6],[141.6,38.2]],
);

export const KYUSHU_GRID_MAP = baseMap(
  'jp-kyushu-grid-map',
  ['Interactive Kyushu electricity system map','九州交互式电力系统地图'],
  ['Kyushu grid structure by period','九州不同时期电网结构'],
  featureCodes(['35','40','41','42','43','44','45','46']),
  kyushuPoints,
  kyushuRoutes,
  kyushuCatalog,
  'kyushu-kanmon',
  ['Yamaguchi','Fukuoka','Kumamoto','Oita','Kagoshima'],
  [[129.1,31.0],[133.2,34.5]],
);

export const HOKKAIDO_GRID_MAP = baseMap(
  'jp-hokkaido-grid-map',
  ['Interactive Hokkaido electricity system map','北海道交互式电力系统地图'],
  ['Hokkaido grid structure by period','北海道不同时期电网结构'],
  featureCodes(['01','02']),
  hokkaidoPoints,
  hokkaidoRoutes,
  hokkaidoCatalog,
  'hokkaido-kitahon-existing',
  ['Hokkaido','Aomori'],
  [[139.0,40.0],[145.5,45.7]],
);

export const JP_GRID_MAPS = {
  tokyo:TOKYO_GRID_MAP,
  kyushu:KYUSHU_GRID_MAP,
  hokkaido:HOKKAIDO_GRID_MAP,
};

export default JP_GRID_MAPS;
