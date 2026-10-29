/* ---------------------------------------------------------------------------
   Spain — interactive grid map.

   A THEMATIC MAP, not a network map. Spain publishes no project-level storage
   register with locations (src/governance/projectPipelineSources.js), so the
   map carries the two references the case rests on — the single day-ahead
   price and the access queue — and no project markers. REE's grid, about
   22,000 km at 400 kV and 20,200 km at 220 kV, is not drawn.
   --------------------------------------------------------------------------- */
import { registerGridMap } from '../gridMapRegistry.js';
import boundary from './es-boundary.json' with { type: 'json' };

const URL = {
  omie: 'https://www.omie.es/es/file-download?parents=marginalpdbc&filename=marginalpdbc_20251231.1',
  guarantee: 'https://ficheiros-web.xunta.gal/cei/enerxia/guia-garantias-redes-enerxia-electrica-cas.pdf',
  ree: 'https://www.ree.es/en/press-release-type/transmission',
  pinalm: 'https://www.miteco.gob.es/content/dam/miteco/es/prensa/20251230_NdP.%20El%20MITECO%20asigna%20818%20millones%20a%20126%20proyectos%20que%20reforzar%C3%A1n%20el%20almacenamiento%20energ%C3%A9tico%20a%20gran%20escala%20en%20todo%20el%20pa%C3%ADs.pdf',
  ne: 'https://github.com/topojson/world-atlas',
};

const point = (id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, extra = {}) => ({
  id, name, coord, kind, subtype, periods, note, investor, source, sourceUrl, size: 1,
  label: true, ...extra,
});

const points = [
  point('omie-price', ['Spanish day-ahead price — the trading reference', '西班牙日前电价 — 交易参照'], [-3.70, 40.42], 'node',
    ['Price reference', '价格参照'], ['past', 'current', 'future'],
    ['One price for the peninsula, shared with Portugal in most hours. A 1 MW / 4 h battery earned €304.89/MW a day on it in 2025 — €111.3k a year — at a €65.2/MWh mean price.',
     '半岛统一电价，多数时段与葡萄牙同价。2025年1MW/4小时储能每MW每日收入€304.89 — 每年11.13万欧元 — 均价€65.2/MWh。'],
    ['The merchant seed is built on this price: €103k/MW a year at a 2028 start, the whole of the modelled revenue.',
     '市场化收入种子值基于此价格：2028年投运时每MW每年10.3万欧元，即模型全部收入。'],
    'OMIE — day-ahead marginal prices', URL.omie),

  point('access-queue', ['Access and connection — the queue', '接入与并网 — 排队'], [-4.75, 38.90], 'node',
    ['Connection mechanism', '并网机制'], ['current', 'future'],
    ['Storage that exports applies like a generator and posts €40/kW, returned at operation; saturated nodes are allocated by tender. 7.6 GW of storage was in permitting at the end of 2025.',
     '可向电网送电的储能按发电设施申请并缴每kW €40担保，投运后退还；饱和节点通过招标分配。2025年底审批中的储能达7.6GW。'],
    ['One price means siting costs nothing in the model; the connection decides whether there is a project. The marker is a reference, not a node.',
     '单一价格意味着选址在模型中无成本；并网决定项目能否存在。该标记为参照而非具体节点。'],
    'Xunta de Galicia — guide to access and connection guarantees', URL.guarantee),

  point('pinalm', ['PINALM — the grant cohort', 'PINALM — 受资助机组'], [-2.50, 38.00], 'node',
    ['Grant programme', '补贴项目'], ['future'],
    ['€818m to 126 projects for 2.2 GW / 9.4 GWh, to be built by the end of 2029; awarded by region with more for less-developed ones.',
     '8.18亿欧元资助126个项目共2.2GW/9.4GWh，须于2029年底前建成；按地区分配，欠发达地区额度更高。'],
    ['The largest dated piece of the fleet path. Located by region, not by site, so it is drawn as one reference.',
     '机组路径中最大的有日期部分。按地区而非场址确定，因此绘为单一参照。'],
    'MITECO — PINALM final award', URL.pinalm),
];

const sourceCatalog = [
  { id: 'es-map-omie', owner: 'OMIE', title: 'Day-ahead marginal prices (marginalpdbc)', url: URL.omie, format: 'CSV', cadence: 'Daily', licence: 'Free use with the source cited', automation: 'A', checkedAt: '2026-10-29' },
  { id: 'es-map-guarantee', owner: 'Xunta de Galicia', title: 'Guide to grid access and connection guarantees', url: URL.guarantee, format: 'PDF', cadence: 'As revised', licence: 'Public official guidance', automation: 'C', checkedAt: '2026-10-29' },
  { id: 'es-map-ree', owner: 'Red Eléctrica', title: 'Transmission', url: URL.ree, format: 'HTML', cadence: 'As revised', licence: 'Publisher reuse terms', automation: 'C', checkedAt: '2026-10-29' },
  { id: 'es-map-pinalm', owner: 'MITECO', title: 'PINALM final award', url: URL.pinalm, format: 'PDF', cadence: 'One-off', licence: 'May be used without citing (stated on the release)', automation: 'C', checkedAt: '2026-10-29' },
  { id: 'es-map-boundary', owner: 'Natural Earth via world-atlas', title: 'Countries, 110m', url: URL.ne, format: 'TopoJSON', cadence: 'Periodic', licence: 'Public domain (Natural Earth)', automation: 'B', checkedAt: '2026-10-29' },
];

export const ES_GRID_MAP = {
  id: 'es-grid-map',
  ariaLabel: ['Interactive Spain storage map', '西班牙储能交互地图'],
  title: ['Spain: the price, the queue and the grant fleet', '西班牙：电价、排队与受资助机组'],
  defaultPeriod: 'current',
  defaultSelectedId: 'omie-price',
  boundary,
  boundarySource: {
    label: ['Natural Earth 110m via world-atlas', 'Natural Earth 110m（world-atlas）'],
    url: URL.ne,
  },
  periodOrder: ['past', 'current', 'future'],
  periods: {
    past: {
      label: ['Past · 2023–24', '过去 · 2023–24'],
      kicker: ['A spread with nobody to trade it', '有价差无人交易'],
      thesis: ['A four-hour battery would have earned about €76.5k/MW a year on day-ahead prices in both years, and Spain\'s storage was pumped hydro.',
               '两年间四小时储能按日前电价每MW每年约可得7.65万欧元，而西班牙的储能以抽水蓄能为主。'],
      implication: ['The spread was there before the batteries.', '价差先于储能存在。'],
    },
    current: {
      label: ['Current · 2025–26', '当前 · 2025–26'],
      kicker: ['Solar troughs, a capacity market in law', '光伏低谷，容量市场立法'],
      thesis: ['The four-hour value rose to €111.3k in 2025 and higher in 2026, batteries reached 193 MW, and the capacity market was created in September 2026.',
               '四小时价值2025年升至11.13万欧元、2026年更高，电池达193MW，容量市场于2026年9月设立。'],
      implication: ['A tiny fleet against a wide spread.', '小规模机组面对宽价差。'],
    },
    future: {
      label: ['Building · 2027–30', '建设期 · 2027–30'],
      kicker: ['The grant fleet and the first auctions', '受资助机组与首批拍卖'],
      thesis: ['PINALM\'s 2.2 GW built by 2029 and a fleet of about 7.5 GW by 2030 on the path; the first capacity auction expected in Q1 2027.',
               '按路径，PINALM的2.2GW于2029年前建成，2030年机组约7.5GW；首次容量拍卖预计于2027年一季度举行。'],
      implication: ['The fleet takes 7% of the value by 2028 and 13% by 2030.', '机组到2028年收回7%的价值，到2030年收回13%。'],
    },
  },
  layers: {
    node: { label: ['Prices and mechanisms', '价格与机制'] },
    generation: { label: ['Storage', '储能'] },
    load: { label: ['Demand centres', '负荷中心'] },
    route: { label: ['Network paths', '网络路径'] },
    plan: { label: ['Planned build', '规划建设'] },
  },
  points,
  routes: [],
  sourceCatalog,
  scope: [
    'A THEMATIC MAP, not a network map. Markers are references for a price, a mechanism and a grant programme, not project or substation positions, and show no spare capacity, queue position or investable connection. REE\'s 400 and 220 kV grid is not drawn.',
    '这是一张主题地图，而非电网结构图。标记为价格、机制与补贴项目的参照，并非项目或变电站位置，且不显示可用容量、队列位置或可投资并网权利。REE的400与220kV电网未予绘制。',
  ],
};

registerGridMap(ES_GRID_MAP, 'es');

export default ES_GRID_MAP;
