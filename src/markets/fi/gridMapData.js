/* ---------------------------------------------------------------------------
   Finland — interactive grid map.

   Representative national orientation only: approximate locality centroids, no
   spare capacity, no queue position, no investable connection. Same convention
   and same limits as every other map on this platform, stated again in `scope`
   because a map invites more trust than a table does.

   THIS IS A THEMATIC CONSTRAINT MAP, NOT A NETWORK MAP, and that is a change of
   scope rather than a limitation of one.

   §1.2 of the round 3 plan specified "Fingrid 400/110 kV nodes + the constraint
   corridor" — real substations. That is not what this is. Fingrid operates about
   138 substations and roughly 14,900 km of line, 5,400 km of it at 400 kV, and
   plotting that faithfully needs the operator's own geodata under its own
   licence. Plotting a dozen substations from memory would have been worse than
   plotting none.

   So the acceptance criterion was revised, deliberately and in writing: the
   markers are municipal and regional centroids standing for the places the
   ARGUMENT is about — where the load is, where the wind is, where the transfer
   limit runs, where connections are closed. Each names what it stands for.

   The two are not equivalent and the difference matters to a reader deciding
   whether a site is connectable. Building the real network layer stays on the
   list; see docs/adding-a-market.md and the round 3 notes in the plan.

   WHAT THE THREE PERIODS SHOW, and it is not the usual story. In Germany the
   generation moved away from the load and a corridor is being built to close the
   gap. In Finland the generation moved too — 5,000 MW of wind onto the west
   coast, 1,900 MW north of Cut P1 — but the interesting change is what the
   system chose to do about it: keep ONE price area, and pay for the wires that
   make that possible. Every other market on this platform would have let a
   boundary form and priced it.

   That choice is why the plan layer carries a transmission reinforcement rather
   than a market reform, and why the constraint a battery actually meets is a
   connection restriction rather than a spread.
   --------------------------------------------------------------------------- */
import { registerGridMap } from '../gridMapRegistry.js';
import boundary from './fi-boundary.json' with { type: 'json' };

const URL = {
  storageRestriction: 'https://www.fingrid.fi/en/news/news/2025/fingrid-secures-transmission-capacity-for-growth-in-electricity-consumption-and-new-industrial-investments--restrictions-on-new-energy-storage-facility-connections-continued-in-southern-finland/',
  cutP1: 'https://www.fingrid.fi/en/electricity-market-information/history-data-from-cut-p1/',
  grid: 'https://www.fingrid.fi/en/grid/development/power-transmission-grid-of-fingrid/',
  reserves: 'https://www.fingrid.fi/en/electricity-market/reserves/power-system-reserves/',
  atlas: 'https://github.com/nvkelso/natural-earth-vector',
};

const LABEL_KINDS = new Set(['load', 'generation', 'node']);
const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1,
  label: LABEL_KINDS.has(kind), ...extra,
});

const points = [
  /* ---- demand ------------------------------------------------------------ */
  point('helsinki', ['Helsinki region — southern load', '赫尔辛基地区 — 南部负荷'], [24.94, 60.17], 'load',
    ['Consumption centre', '消费中心'], ['past', 'current', 'future'],
    ['Finland\'s consumption is concentrated in the south while its wind is on the west coast and in the north. That mismatch is what Cut P1 measures and what the reinforcement programme is being built to close.',
     '芬兰的电力消费集中于南部，而风电位于西海岸与北部。这一错配正是断面P1所度量的对象，也是加强工程所要解决的问题。'],
    ['This is where a battery would most want to sit and where it currently cannot: new grid storage connections in southern Finland are restricted until 2029. A contracted connection here is the scarce asset in this market.',
     '这是储能最希望布局、但当前无法进入的区域：芬兰南部新增电网侧储能并网受限至2029年。此处已签约的并网容量是本市场的稀缺资产。'],
    'Fingrid — southern Finland connection restrictions', URL.storageRestriction,
    { labelAnchor: 'start',
      companies: ['Fingrid main grid; Caruna and Helen Sähköverkko distribution',
                  'Fingrid主网；Caruna与Helen Sähköverkko配电网'],
      demandScale: ['The consumption centre of a single-price country, and the reason connection capacity here is rationed rather than priced',
                    '单一电价国家的消费中心，也是此处并网容量采取配给而非定价的原因'] }),

  /* ---- generation -------------------------------------------------------- */
  point('ostrobothnia', ['Ostrobothnia — west coast wind', '博滕区 — 西海岸风电'], [21.61, 63.10], 'generation',
    ['Wind cluster', '风电集群'], ['current', 'future'],
    ['About 5,000 MW of wind has been built on the west coast, making wind the swing producer in the Finnish system and the source of the short-cycle volatility a battery trades.',
     '西海岸已建成约5,000MW风电，使风电成为芬兰系统的边际调节电源，也是储能所交易的短周期波动的来源。'],
    ['Connection capacity remains available here and in the north while the south is closed. Because Finland is one price area, siting here costs nothing in modelled revenue — the whole locational question is whether you can connect, not what you earn.',
     '在南部关闭并网的同时，此处与北部仍有并网容量可用。由于芬兰为单一报价区，在此选址不会造成模型收入损失 — 选址问题的全部在于能否并网，而非收益高低。'],
    'Fingrid — main grid development', URL.grid,
    { operatingCapacity: ['About 5,000 MW of wind built on the west coast', '西海岸已建成风电约5,000MW'] }),

  point('olkiluoto', ['Olkiluoto — nuclear', 'Olkiluoto — 核电'], [21.48, 61.24], 'generation',
    ['Baseload', '基荷'], ['past', 'current', 'future'],
    ['Olkiluoto 3 entering service is the reason Finland\'s adequacy position changed. National assessments have since shown no concern against the LOLE 2.1 h/yr standard, and no capacity has been held in the strategic reserve since July 2022.',
     'Olkiluoto 3投运是芬兰充裕度状况改变的原因。此后的全国评估显示，对照2.1小时/年的失负荷期望标准不存在充裕度问题，且自2022年7月起战略备用未持有任何容量。'],
    ['This is why capacityMarket is false for Finland. The mechanism exists in law and is dormant, because the system does not presently need it — which is a stronger statement than an absent mechanism and a more fragile one, since it depends on the adequacy position holding.',
     '这正是芬兰capacityMarket标记为false的原因。该机制在法律上存在但处于休眠状态，因为系统当前并不需要它 — 这一表述比"不存在该机制"更有力，但也更脆弱，因其取决于充裕度状况能否持续。'],
    'Energy Authority — national resource adequacy assessment', URL.grid,
    { operatingCapacity: ['Olkiluoto 3 in service; the unit that removed the adequacy problem',
                          'Olkiluoto 3已投运；该机组消除了充裕度问题'] }),

  /* ---- nodes: the constraint story --------------------------------------- */
  point('cut-p1', ['Cut P1 — north–south transfer limit', '断面P1 — 南北输电限制'], [25.60, 63.40], 'node',
    ['Internal constraint', '内部约束'], ['past', 'current', 'future'],
    ['The transfer limit between the wind-heavy north and the consumption-heavy south. Fingrid publishes the measured flow and the planned capacity in each direction weekly, and is adding roughly 1,500 MW of north-to-south capacity.',
     '风电密集的北部与消费密集的南部之间的输电限制。Fingrid每周发布实测潮流与两方向计划输电能力，并正在新增约1,500MW由北向南的输电能力。'],
    ['Read the reinforcement as what it is: Fingrid states it is undertaken so that Finland can REMAIN a single price area. A Finnish battery\'s merchant case assumes no locational basis risk, so the programme is underwriting that assumption on the sponsor\'s behalf.',
     '应如实理解该加强工程：Fingrid明确表示其目的是使芬兰得以"维持"单一报价区。芬兰储能的市场化收入逻辑假设不存在地域基差风险，因此该工程实际上是在代投资人承担这一假设。'],
    'Fingrid — Cut P1 history data', URL.cutP1,
    { labelAnchor: 'start' }),

  point('reserve-market', ['National reserve markets', '全国备用市场'], [26.50, 61.60], 'node',
    ['Revenue mechanism', '收入机制'], ['current', 'future'],
    ['FFR, FCR-N, FCR-D up and down, aFRR and mFRR are procured nationally, not by location. The fast products a battery wins total under 800 MW of obligation for 2026.',
     'FFR、FCR-N、FCR-D上调与下调、aFRR及mFRR均按全国而非按区域采购。2026年储能可参与的快速品种需求合计不足800MW。'],
    ['This is the revenue line and the risk in the same sentence. Against about 795 MW of fast-reserve obligation, connected storage passed 1,050 MW in February 2026 — an acute saturation warning, though the obligation is a sum across separately procured products and the fleet includes capacity not prequalified for all of them. It is why this dashboard withholds a reserve revenue level rather than publishing one.',
     '收入与风险同在于此。面对约795MW的快速备用需求，已并网储能于2026年2月已超过1,050MW — 这构成强烈的饱和预警，但需求方为多个独立采购品种的合计，机组方亦包含未通过全部品种预审的容量。这正是本看板暂缓发布备用收入水平的原因。'],
    'Fingrid — power system reserves', URL.reserves),

  /* ---- plan -------------------------------------------------------------- */
  point('hikia-toivila', ['Hikiä–Toivila reinforcement', 'Hikiä–Toivila加强工程'], [25.40, 61.55], 'node',
    ['Committed transmission', '已确定输电工程'], ['future'],
    ['The 400 kV north–south reinforcement on which the southern storage connection restriction depends. Completion is stated as 2029.',
     '南部储能并网限制解除所依赖的400kV南北加强工程，公布的完工时间为2029年。'],
    ['The date has already moved once — the restriction previously ran to early 2027 — and it moved because connection demand grew, not because the works slipped. Treat 2029 as a forecast with a demonstrated direction of error.',
     '该时间点已推迟过一次 — 此前限制期至2027年初 — 且推迟原因是并网需求增长而非工程延误。应将2029年视为一个已显现出偏差方向的预测。'],
    'Fingrid — southern Finland connection restrictions', URL.storageRestriction),
];

const routes = [
  { id: 'north-south', kind: 'route',
    name: ['North to south — the flow the system is built around', '由北向南 — 系统所围绕的潮流方向'],
    coords: [[25.47, 65.01], [25.60, 63.40], [25.40, 61.55], [24.94, 60.17]],
    periods: ['current', 'future'],
    source: 'Fingrid — Cut P1 history data', sourceUrl: URL.cutP1,
    endpoints: ['Northern Finland – Helsinki region', '芬兰北部 — 赫尔辛基地区'],
    note: ['Wind in the north and on the west coast serving load in the south, across the transfer limit Cut P1 measures.',
           '北部与西海岸的风电向南部负荷送电，跨越断面P1所度量的输电限制。'],
    investor: ['The corridor is the reason the connection queue is where it is. A project north of the cut can connect today; one south of it generally cannot until the reinforcement completes.',
               '该走廊决定了并网排队的分布。断面以北的项目当前即可并网；以南的项目通常须等待加强工程完工。'],
    operatingCapacity: ['About 1,500 MW of additional north-to-south capacity in the reinforcement programme',
                        '加强工程新增由北向南输电能力约1,500MW'] },
];

const sourceCatalog = [
  { id: 'fi-map-restriction', owner: 'Fingrid', title: 'Restrictions on new energy storage facility connections in southern Finland', url: URL.storageRestriction, format: 'HTML', cadence: 'As revised', licence: 'Publisher reuse terms', automation: 'B', checkedAt: '2026-08-18' },
  { id: 'fi-map-cutp1', owner: 'Fingrid', title: 'North–South cut in Finland (Cut P1) — history data', url: URL.cutP1, format: 'HTML + open data', cadence: 'Weekly', licence: 'Fingrid open data terms — see gate FI-2', automation: 'B', checkedAt: '2026-08-18' },
  { id: 'fi-map-grid', owner: 'Fingrid', title: 'Fingrid electricity transmission network', url: URL.grid, format: 'HTML', cadence: 'Periodic', licence: 'Publisher reuse terms', automation: 'C', checkedAt: '2026-08-18' },
  { id: 'fi-map-reserves', owner: 'Fingrid', title: 'Power system reserves', url: URL.reserves, format: 'HTML', cadence: 'Annual', licence: 'Publisher reuse terms', automation: 'B', checkedAt: '2026-08-18' },
  { id: 'fi-map-boundary', owner: 'Natural Earth', title: 'Admin-0 countries, 110m, via world-atlas', url: URL.atlas, format: 'GeoJSON', cadence: 'Periodic', licence: 'Public domain (Natural Earth)', automation: 'B', checkedAt: '2026-08-18' },
];

export const FI_GRID_MAP = {
  id: 'fi-grid-map',
  ariaLabel: ['Interactive Finland electricity map', '芬兰电力交互地图'],
  title: ['Finnish grid structure by period', '芬兰不同时期电网结构'],
  defaultPeriod: 'current',
  defaultSelectedId: 'cut-p1',
  boundary,
  boundarySource: {
    label: ['Natural Earth 110m admin-0, via world-atlas', 'Natural Earth 110m国家边界，经world-atlas'],
    url: URL.atlas,
  },
  periodOrder: ['past', 'current', 'future'],
  periods: {
    past: {
      label: ['Past · 2021', '过去 · 2021'],
      kicker: ['An importing system', '进口型系统'],
      thesis: ['Finland ran as a net importer with a strategic reserve standing behind it, and adequacy was the live question.',
               '芬兰当时为净进口国，背后由战略备用支撑，充裕度是当时的核心议题。'],
      implication: ['Adequacy risk was the thing a capacity mechanism existed to price. It has not been priced since 2022.',
                    '充裕度风险正是容量机制存在的定价对象。自2022年起该风险已不再被定价。'],
    },
    current: {
      label: ['Current · 2026', '当前 · 2026'],
      kicker: ['One price, and a closed door in the south', '单一电价，南部大门关闭'],
      thesis: ['Wind became the swing producer, the day-ahead market moved to 15-minute settlement in October 2025, and Fingrid restricted new storage connections in southern Finland until 2029 against more than 30 GW of requests.',
               '风电成为边际调节电源，日前市场已于2025年10月转为15分钟结算，且Fingrid在超过30GW并网申请的情况下，将芬兰南部新增储能并网限制延至2029年。'],
      implication: ['The revenue question is reserve depth; the access question is the queue. They are separate, and only one of them has a published number.',
                    '收入问题在于备用市场深度，准入问题在于并网排队。二者相互独立，且只有其中之一有公开数据。'],
    },
    future: {
      label: ['Planned · 2029', '规划 · 2029'],
      kicker: ['The reinforcement, and what it protects', '加强工程及其所维护的目标'],
      thesis: ['Hikiä–Toivila and the wider north–south programme add roughly 1,500 MW of transfer capacity, undertaken explicitly so Finland can remain a single price area.',
               'Hikiä–Toivila及更广泛的南北工程新增约1,500MW输电能力，其明确目的是使芬兰得以维持单一报价区。'],
      implication: ['Two things change together when it completes: the south reopens to storage connections, and the scarcity protecting the incumbent fleet ends.',
                    '工程完工时有两件事同时发生：南部重新开放储能并网，同时保护在运机组的稀缺性随之消失。'],
    },
  },
  layers: {
    node: { label: ['Constraints and mechanisms', '约束与机制'] },
    generation: { label: ['Generation', '发电'] },
    load: { label: ['Demand centres', '负荷中心'] },
    route: { label: ['Network paths', '网络路径'] },
    plan: { label: ['Planned build', '规划建设'] },
  },
  points,
  routes,
  sourceCatalog,
  scope: [
    'A THEMATIC CONSTRAINT MAP, not a network map. Markers are approximate municipal and regional centroids standing for the places the analysis is about, not substation positions, and show no spare capacity, queue position, curtailment probability or investable connection. Fingrid operates roughly 14,900 km of line and about 138 substations; none of that network is drawn here. The outline is the Republic of Finland, which is also the bidding zone — unlike most maps on this platform, the country and the market are the same shape.',
    '这是一张主题性约束地图，而非电网结构图。标记为近似的市镇及区域中心坐标，代表分析所涉及的区位，并非变电站位置，且不显示可用容量、队列位置、限电概率或可投资并网权利。Fingrid运营约14,900公里线路及约138座变电站，本图未绘制该电网。底图轮廓为芬兰共和国，同时也是其报价区 — 与本平台多数地图不同，此处国家与市场范围一致。',
  ],
};

/* Self-registration. See gridMapRegistry.js — the registry no longer imports the
   map modules, so each announces itself as its market's chunk loads. */
registerGridMap(FI_GRID_MAP, 'fi');

export default FI_GRID_MAP;
