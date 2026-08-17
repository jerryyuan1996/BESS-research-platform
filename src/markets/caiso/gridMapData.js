/* ---------------------------------------------------------------------------
   CAISO — interactive grid map.

   Representative regional orientation only: approximate locality centroids, no
   spare capacity, no queue position, no investable connection.

   Drawn on the California state outline, for the same reason ERCOT uses Texas
   and Western Australia uses its own state polygon. CAISO is not the whole of
   California — the municipal utilities, LADWP and SMUD among them, sit outside
   the balancing authority — which the scope note says rather than leaving the
   outline to imply otherwise.

   What the three periods show. Unlike Germany or the NEM, the story here is not
   generation moving away from load and a corridor being built to close the gap.
   California's generation and load did not move much; what changed is the SHAPE
   of the day. Solar drove midday prices toward and through zero while the evening
   ramp steepened, and the storage fleet was built to trade the difference. Then
   the constraint moved again — not to a wire, but to the interconnection queue.

   So the plan layer carries the queue rather than a transmission project. There
   is no CAISO equivalent of SuedLink to point at, because the thing standing
   between a developer and this market is a study process rather than a line.
   --------------------------------------------------------------------------- */
import { registerGridMap } from '../gridMapRegistry.js';
import boundary from './ca-boundary.json' with { type:'json' };

const URL = {
  nqc: 'https://www.caiso.com/notices/2026-net-qualifying-capacity-values-for-resource-adequacy-resources',
  sod: 'https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-power-procurement/resource-adequacy-homepage',
  storage: 'https://www.caiso.com/documents/2024-special-report-on-battery-storage-may-29-2025.pdf',
  summer: 'https://www.caiso.com/documents/2026-summer-loads-and-resources-assessment.pdf',
  atlas: 'https://github.com/nvkelso/natural-earth-vector',
};

const LABEL_KINDS = new Set(['load','generation','node']);
const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1,
  label:LABEL_KINDS.has(kind), ...extra,
});

const points = [
  /* ---- demand centres --------------------------------------------------- */
  point('la', ['Los Angeles basin — SP15', '洛杉矶盆地 — SP15'], [-118.24, 34.05], 'load', ['Urban load and local capacity area', '城市负荷与本地容量区'], ['past','current','future'],
    ['The largest load region in CAISO and a local capacity area, which supports Resource Adequacy prices above the unconstrained range. Note that LADWP sits outside the CAISO balancing authority.',
     'CAISO最大的负荷区域，同时也是本地容量区，这使其容量充裕度价格高于非受限区间。请注意洛杉矶水电局（LADWP）不在CAISO平衡区之内。'],
    ['A local capacity requirement is the one thing that reliably lifts an RA price above the benchmark. Diligence whether the site qualifies for one before accepting the unconstrained range as the expectation.',
     '本地容量需求是唯一能可靠地使容量充裕度价格高于基准的因素。在以非受限区间作为预期之前，应先核实场址是否符合该资格。'],
    'CPUC Resource Adequacy framework', URL.sod,
    { labelAnchor:'end',
      companies:['Southern California Edison; San Diego Gas & Electric','南加州爱迪生；圣地亚哥燃气电力'],
      demandScale:['CAISO\'s largest load region; a local capacity area with its own requirement','CAISO最大的负荷区域；设有独立需求的本地容量区'] }),

  point('bayarea', ['Bay Area — NP15', '湾区 — NP15'], [-122.20, 37.70], 'load', ['Urban and industrial load', '城市与工业负荷'], ['past','current','future'],
    ['Northern California load, hydro-influenced and less solar-saturated than the south. A different spread shape and a different RA position from SP15.',
     '北加州负荷区，受水电影响，光伏饱和程度低于南部。其价差形态与容量充裕度状况均不同于SP15。'],
    ['Read NP15 and SP15 as separate markets for both legs. The midday trough is shallower here and the RA position differs; a state-wide average describes neither.',
     '应将NP15与SP15视为两个独立市场，对两项收入均是如此。此处午间低谷较浅，容量充裕度状况亦不相同；全州平均值无法反映其中任何一者。'],
    'CAISO nodal market data', URL.storage,
    { companies:['Pacific Gas & Electric','太平洋燃气电力'],
      demandScale:['Northern California load centre; SMUD sits outside the CAISO balancing authority','北加州负荷中心；萨克拉门托市政公用事业区（SMUD）不在CAISO平衡区之内'] }),

  /* ---- generation ------------------------------------------------------- */
  point('centralvalley', ['Central Valley — ZP26', '中央谷地 — ZP26'], [-119.40, 36.20], 'generation', ['Utility-scale solar', '公用事业级光伏'], ['current','future'],
    ['Where much of the solar that creates the midday trough is sited. Prices here go toward and through zero for several hours a day, which is what a battery charges into.',
     '造就午间低谷的大量光伏位于此。此处电价每日有数小时趋近并跌破零，正是储能充电的时段。'],
    ['The trough is a policy artefact rather than a weather one, so it does not go away — the solar that creates it is not being removed. What compresses it is other batteries, and the queue is what limits how fast they arrive.',
     '该低谷是政策的产物而非天气的产物，因此不会消失 — 造就它的光伏不会被移除。压缩它的是其他储能，而排队限制了它们到位的速度。'],
    'CAISO Special Report on Battery Storage', URL.storage,
    { operatingCapacity:['CAISO battery fleet 16.7 GW in the July 2026 reliability outlook','2026年7月可靠性展望显示CAISO储能机组为16.7GW'] }),

  point('desertsouth', ['Desert Southwest — Riverside and Imperial', '西南沙漠区 — 里弗赛德与因皮里尔'], [-116.20, 33.60], 'generation', ['Solar and storage cluster', '光伏与储能集群'], ['current','future'],
    ['Where much of the CAISO storage fleet has been built, alongside the solar it charges from, and inside reach of the Los Angeles basin local capacity area.',
     'CAISO大部分储能机组建于此处，与其充电所依托的光伏毗邻，且处于洛杉矶盆地本地容量区的辐射范围内。'],
    ['Co-location with solar and proximity to a local capacity area are the two things that most reliably improve a CAISO project, and they are both siting decisions rather than modelling ones.',
     '与光伏同址布置、以及邻近本地容量区，是最能可靠改善CAISO项目的两项因素，且二者均属选址决策而非建模决策。'],
    'CAISO Special Report on Battery Storage', URL.storage,
    { operatingCapacity:['The densest storage cluster in the balancing authority','该平衡区内储能最密集的集群'] }),

  /* ---- the framework and the queue, as places --------------------------- */
  point('nqc', ['Four-hour NQC test — state-wide', '四小时净合格容量测试 — 全州'], [-120.20, 35.40], 'node', ['Accreditation rule', '核证规则'], ['current','future'],
    ['The CPUC determines net qualifying capacity from tested sustained output over four hours, and gives no additional credit for longer duration. This is the rule that makes four hours a ceiling in California rather than a floor.',
     'CPUC依据四小时持续出力测试结果确定净合格容量，更长时长不予额外计入。正是该规则使四小时在加州构成上限而非下限。'],
    ['Drawn as a point because it applies everywhere and has no geography. It is also the most stable input in this market: nothing published proposes changing it, so the duration ceiling can be underwritten as a constant.',
     '之所以绘制为一个点，是因为它在全州适用且没有地理属性。它同时也是本市场最稳定的输入：没有任何公开信息提议对其作出修改，因此该时长上限可作为常量进行承销。'],
    'CAISO 2026 NQC values', URL.nqc),

  point('queue', ['Interconnection queue — ~500 GW', '并网排队 — 约500GW'], [-120.90, 39.40], 'node', ['Access constraint', '准入约束'], ['future'],
    ['Roughly 500 GW of generation and storage sits in the CAISO interconnection queue, with batteries about 46% of it, against an operating battery fleet of 16.7 GW.',
     'CAISO并网排队中的发电与储能项目约500GW，其中储能约占46%，而在运储能机组为16.7GW。'],
    ['Interconnection has overtaken technology cost as the binding constraint on deployment here. For a developer that is the obstacle; for an incumbent it is what protects the Resource Adequacy price.',
     '在此处，并网已取代技术成本成为建设的约束性瓶颈。对开发方而言这是障碍；对在运方而言，它正是保护容量充裕度价格的因素。'],
    'CAISO Summer Loads and Resources Assessment', URL.summer,
    { layer:'plan', planClass:'process', planClassLabel:['Process reform, ongoing','流程改革，持续进行'], planYear:null,
      planStatus:['Ongoing reform with no published completion date','持续进行中的改革，无公布的完成日期'],
      plannedCapacity:['≈500 GW queued, batteries ≈46% of it','排队约500GW，其中储能约占46%'] }),
];

const routes = [
  { id: 'solar-to-load', kind:'route', name:['Solar to load — the shape that pays','光伏至负荷 — 带来收益的形态'],
    coords:[[-119.40, 36.20], [-118.90, 35.20], [-118.24, 34.05]],
    periods:['current','future'], source:'CAISO Special Report on Battery Storage', sourceUrl:URL.storage,
    endpoints:['Central Valley – Los Angeles basin','中央谷地 — 洛杉矶盆地'],
    note:['Utility-scale solar in the Central Valley and the desert south serving coastal load, producing a midday trough deep enough that prices go negative for hours a day.',
          '中央谷地与南部沙漠的公用事业级光伏为沿海负荷供电，形成足够深的午间低谷，使电价每日有数小时为负。'],
    investor:['This is the merchant opportunity and it is durable, because it is created by policy rather than weather. It is also the smaller half of the revenue — the whole merchant band on this dashboard is narrower than the reported Resource Adequacy range.',
              '这是市场化收入的机会所在，且具有持续性，因为它由政策而非天气造就。但它同时也是收入中较小的一半 — 本看板整个市场化收入区间都窄于已报告的容量充裕度区间。'],
    operatingCapacity:['Battery fleet 16.7 GW in the July 2026 reliability outlook','2026年7月可靠性展望显示储能机组为16.7GW'] },

  { id: 'north-south', kind:'route', name:['NP15 to SP15 — two price regions, one state','NP15至SP15 — 一州之内的两个价格区'],
    coords:[[-122.20, 37.70], [-120.50, 36.50], [-118.24, 34.05]],
    periods:['past','current','future'], source:'CAISO nodal market data', sourceUrl:URL.storage,
    endpoints:['Bay Area – Central Valley – Los Angeles basin','湾区 — 中央谷地 — 洛杉矶盆地'],
    note:['Northern California is hydro-influenced and less solar-saturated; the southern regions carry the deeper midday trough and the local capacity requirements that lift RA prices.',
          '北加州受水电影响、光伏饱和度较低；南部区域则拥有更深的午间低谷，以及推高容量充裕度价格的本地容量需求。'],
    investor:['Both legs differ between the two regions — the spread shape and the RA position. A state-wide average describes neither, and the RA difference matters more than the spread difference.',
              '两项收入在两个区域间均有差异 — 价差形态与容量充裕度状况皆然。全州平均值无法反映其中任何一者，且容量充裕度的差异比价差的差异更为重要。'],
    operatingCapacity:['SP15, NP15 and ZP26 settle separately','SP15、NP15与ZP26分别结算'] },
];

const sourceCatalog = [
  { id:'caiso-map-nqc', owner:'CAISO', title:'Net Qualifying Capacity values for Resource Adequacy Resources', url:URL.nqc, format:'XLSX', cadence:'Annual', licence:'Publisher reuse terms', automation:'B', checkedAt:'2026-08-04' },
  { id:'caiso-map-sod', owner:'CPUC', title:'Resource Adequacy and Slice of Day framework', url:URL.sod, format:'HTML + PDF', cadence:'Annual', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-04' },
  { id:'caiso-map-storage', owner:'CAISO', title:'Special Report on Battery Storage', url:URL.storage, format:'PDF', cadence:'Annual', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-04' },
  { id:'caiso-map-summer', owner:'CAISO', title:'Summer Loads and Resources Assessment', url:URL.summer, format:'PDF', cadence:'Annual', licence:'Publisher reuse terms', automation:'C', checkedAt:'2026-08-04' },
  { id:'caiso-map-boundary', owner:'Natural Earth', title:'Admin-1 states and provinces, 50m', url:URL.atlas, format:'GeoJSON', cadence:'Periodic', licence:'Public domain (Natural Earth)', automation:'B', checkedAt:'2026-08-04' },
];

export const CAISO_GRID_MAP = {
  id:'caiso-grid-map',
  ariaLabel:['Interactive CAISO electricity map','CAISO电力交互地图'],
  title:['CAISO grid structure by period','CAISO不同时期电网结构'],
  defaultPeriod:'current',
  defaultSelectedId:'centralvalley',
  boundary,
  boundarySource: {
    label: ['Natural Earth 50m admin-1', 'Natural Earth 50m一级行政区'],
    url: URL.atlas,
  },
  periodOrder: ['past','current','future'],
  periods: {
    past: {
      label: ['Past · 2015', '过去 · 2015'],
      kicker: ['The duck curve appears', '鸭形曲线出现'],
      thesis: ['Utility-scale and behind-the-meter solar drove midday prices down while the evening ramp steepened. The shape that made storage necessary was created by policy rather than by weather.','公用事业级与用户侧光伏压低午间电价，同时晚间爬坡愈发陡峭。使储能成为必需的这一形态源于政策而非天气。'],
      implication: ['The arbitrage opportunity was manufactured, and it is durable for the same reason it was created.','套利机会是被创造出来的，且因其被创造的同一原因而具有持续性。'],
    },
    current: {
      label: ['Current · 2026', '当前 · 2026'],
      kicker: ['A capacity contract with a trading option', '一份附带交易期权的容量合约'],
      thesis: ['The fleet reached 16.7 GW and Resource Adequacy became most of the revenue — $8.77/kW-month against merchant nearer $2.5–3. Slice of Day redefined RA obligations across 24 hourly slices, and the four-hour NQC test caps duration credit.','机组规模达到16.7GW，容量充裕度成为收入主体 — 每kW每月$8.77，而市场化收入约为$2.5–3。分时段机制将容量充裕度义务按24个小时时段重新定义，四小时净合格容量测试则为时长信用设定了上限。'],
      implication: ['Underwrite the counterparty, the tenor and the deliverability status. The spread is the small part.','承销依据应为交易对手、合约期限与可交付性状态。价差只是较小的部分。'],
    },
    future: {
      label: ['Planned · 2030s', '规划 · 2030年代'],
      kicker: ['The constraint is the queue', '约束在于排队'],
      thesis: ['Roughly 500 GW sits in the interconnection queue with batteries about 46% of it. Interconnection has overtaken technology cost as the binding constraint on deployment, and the reform has no published completion date.','并网排队量约500GW，其中储能约占46%。并网已取代技术成本成为建设的约束性瓶颈，且相关改革没有公布的完成日期。'],
      implication: ['For a developer the queue is the obstacle; for an incumbent it is what protects the RA price. A queue position with deliverability is the scarce asset in this market.','对开发方而言排队是障碍；对在运方而言，它正是保护容量充裕度价格的因素。具备可交付性的排队位置，是本市场的稀缺资产。'],
    },
  },
  layers: {
    node: { label:['Framework and queues','制度框架与排队'] },
    generation: { label:['Generation','发电'] },
    load: { label:['Demand centres','负荷中心'] },
    route: { label:['Network paths','网络路径'] },
    plan: { label:['Planned build','规划建设'] },
  },
  points,
  routes,
  sourceCatalog,
  scope: [
    'Representative regional orientation only. Markers use approximate locality centroids and do not show spare capacity, queue position, curtailment probability or an investable connection. The outline is the state of California; CAISO is the balancing authority for most but not all of it — LADWP and SMUD among others sit outside it.',
    '仅用于代表性区域方位展示。标记采用近似地点中心坐标，不显示可用容量、队列位置、限电概率或可投资并网权利。底图轮廓为加利福尼亚州；CAISO是该州大部分（但非全部）区域的平衡机构 — 洛杉矶水电局与萨克拉门托市政公用事业区等不在其范围内。',
  ],
};

export default CAISO_GRID_MAP;

/* Self-registration. The registry no longer imports the map modules — it would
   have pulled all twelve into every visitor's first download — so each map
   announces itself as its market's chunk loads. See gridMapRegistry.js. */
registerGridMap(CAISO_GRID_MAP, 'caiso');
