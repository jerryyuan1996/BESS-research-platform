/* ---------------------------------------------------------------------------
   WHERE EACH MARKET'S PROJECT PIPELINE COMES FROM.

   Two kinds of project go on the market maps: storage, and the large renewables
   that shape the price a battery captures. They do not share a source, and no
   single source covers every market — so this file names one per market and says
   how far it has been checked.

   `status` is the honest part:

     verified   the endpoint was checked and the fields below were seen in it
     candidate  the publisher and dataset are identified, the fields are NOT yet
                confirmed — do not build against this until it is checked
     none       no public source of adequate quality was found. The market maps
                render no pipeline layer at all, and the map says so.

   A `none` is a finding, not a gap to be filled with something worse. OSM was
   measured on 2026-08-08 and returns 173 mapped batteries in Germany against
   ONE in Romania; a map drawn from it would report that Romania has no storage
   rather than that nobody has mapped it. Publishing an empty layer is honest.
   Publishing a misleadingly sparse one is not.

   Nothing here feeds the economics. These are map and pipeline-section layers.
   --------------------------------------------------------------------------- */

/** Fields the platform wants for a storage project, in priority order. */
export const STORAGE_FIELDS = [
  'name', 'powerMW', 'energyMWh', 'operator', 'lat', 'lon', 'status', 'cod',
];

/* Statuses the platform renders. Anything a source calls "proposed",
   "application" or "queued" is deliberately NOT carried: an interconnection
   queue is not a pipeline, and most of it never gets built. */
export const RENDERED_STATUS = ['operating', 'construction'];

const CC_BY = 'CC BY 4.0';
const US_GOV = 'US Government work — public domain';
const DL_DE_BY = 'Data Licence Germany – attribution – v2.0 (DL-DE-BY-2.0)';

/** @type {Record<string, object>} */
export const PIPELINE_SOURCES = {
  de: {
    status: 'verified',
    storage: {
      id: 'de-mastr',
      owner: 'Bundesnetzagentur',
      title: 'Marktstammdatenregister (MaStR)',
      url: 'https://www.marktstammdatenregister.de/MaStR',
      licence: DL_DE_BY,
      cadence: 'continuous, registration-driven',
      fields: ['name', 'powerMW', 'energyMWh', 'operator', 'lat', 'lon', 'status', 'cod'],
      note: [
        'The statutory register of every German generation and storage unit, carrying location, capacity, commissioning date and operator. The most complete storage source on the platform by some distance, and the only one that is a legal filing rather than a survey.',
        '德国全部发电与储能单元的法定登记册，载有位置、容量、投运日期与运营方。为本平台迄今最完整的储能数据源，且是唯一以法定申报而非调查为基础的来源。',
      ],
    },
  },

  pjm: US_EIA('PJM'), ercot: US_EIA('ERCOT'), caiso: US_EIA('CAISO'),

  nem: AEMO_GI('NEM'), wa: AEMO_GI('WEM'),

  gb: {
    status: 'verified',
    storage: {
      id: 'gb-neso-tec',
      owner: 'NESO',
      title: 'Transmission Entry Capacity (TEC) Register',
      url: 'https://www.neso.energy/data-portal',
      licence: 'NESO Open Data Licence',
      cadence: 'monthly',
      /* Already connected — see etl/sources/neso-tec-register.mjs, which filters
         Plant Type "Energy Storage System" and carries capacity, project status,
         connection gate and effective-from date. */
      fields: ['name', 'powerMW', 'operator', 'status', 'cod'],
      missing: ['energyMWh', 'lat', 'lon'],
      note: [
        'Already wired into the ETL. The register carries no duration and no MWh, and the existing connector deliberately synthesises neither — so GB storage plots as power only until a second source supplies energy. Coordinates must come from the connection point, not from the register.',
        '已接入ETL。该登记册不含时长与MWh，现有连接器刻意不作合成 — 因此在第二数据源提供能量数据前，英国储能仅以功率呈现。坐标须取自并网点而非登记册本身。',
      ],
    },
  },

  /* ---- identified but unchecked. Do not build against these yet. ---------- */

  ie: CANDIDATE('EirGrid / ESB Networks connection offers and the ECP process',
    'https://www.eirgrid.ie/', [
      'EirGrid publishes connection offer and contracted-capacity information, and Ireland has a large contracted battery fleet. Whether any published file carries per-project MWh and coordinates has NOT been confirmed.',
      'EirGrid发布并网报价与已签约容量信息，且爱尔兰已签约储能规模较大。但尚未确认是否有公开文件载明各项目的MWh与坐标。',
    ]),

  it: CANDIDATE('Terna open data and the MACSE auction results',
    'https://dati.terna.it/en/transmission', [
      'MACSE awards identify storage capacity by zone and are the contracted spine of the Italian case. Whether awards are published at project level with coordinates has NOT been confirmed.',
      'MACSE中标结果按分区标明储能容量，构成意大利投资逻辑中的合同化主线。但尚未确认中标是否按项目层级公布并含坐标。',
    ]),

  pl: CANDIDATE('URE capacity market auction results and PSE registers',
    'https://www.ure.gov.pl/', [
      'Polish capacity auctions award storage units by name with a delivery year, which is a contracted pipeline rather than a queue. Coordinates and MWh have NOT been confirmed.',
      '波兰容量拍卖按名称与交付年份授予储能机组，属合同化管线而非排队清单。坐标与MWh尚未确认。',
    ]),

  jp_tokyo: JAPAN_CANDIDATE(), jp_kyushu: JAPAN_CANDIDATE(), jp_hokkaido: JAPAN_CANDIDATE(),

  /* ---- nothing adequate found ------------------------------------------- */

  ro: {
    status: 'none',
    storage: null,
    note: [
      'No public project-level storage register was found for Romania. OpenStreetMap returned a single mapped battery for the whole country on 2026-08-08, which is a mapping artefact and not a market fact — Romania is the market this platform ranks first on merchant returns. The map renders no storage layer here rather than one that implies an empty market.',
      '未找到罗马尼亚公开的项目级储能登记册。2026年8月8日OpenStreetMap全国仅返回一处已标注储能设施，此为测绘覆盖不足所致而非市场事实 — 罗马尼亚恰是本平台市场化回报排名第一的市场。因此该市场不渲染储能图层，以免呈现"市场空白"的误导。',
    ],
  },
};

/* EIA-860M is one dataset covering all three US markets, so it is written once.
   Prime mover code "BA" is battery storage; the monthly file carries operating
   status and planned operation date for units of 1 MW and above. Coordinates
   are on the annual EIA-860 and join on Plant ID. */
function US_EIA(market){
  return {
    status: 'verified',
    storage: {
      id: 'us-eia-860m',
      owner: 'U.S. Energy Information Administration',
      title: 'Form EIA-860M — Preliminary Monthly Electric Generator Inventory',
      url: 'https://www.eia.gov/electricity/data/eia860m/',
      licence: US_GOV,
      cadence: 'monthly',
      fields: ['name', 'powerMW', 'operator', 'status', 'cod'],
      joins: { coordinates: 'EIA-860 annual, on Plant ID', energyMWh: 'EIA-860 annual storage schedule' },
      filter: { market, primeMover: 'BA', minMW: 1 },
      note: [
        'Statutory monthly filing, so coverage is a legal obligation rather than a survey response. Nameplate MW and planned operation date are on the monthly file; energy capacity and coordinates require the annual EIA-860 join. EIA warns the monthly capacities are restated retroactively and are less reliable than the annual form.',
        '法定月度申报，其覆盖度源于法律义务而非调查回复。铭牌MW与计划投运日期见于月度文件；能量容量与坐标需关联年度EIA-860。EIA提示月度容量会被追溯修订，可靠性低于年度报表。',
      ],
    },
  };
}

/* AEMO collects Generation Information from participants and publishes existing,
   committed and proposed capacity with developer-estimated commissioning dates.
   One dataset, two markets — the NEM and the WEM are published separately but on
   the same instrument. */
function AEMO_GI(market){
  return {
    status: 'verified',
    storage: {
      id: 'au-aemo-generation-information',
      owner: 'AEMO',
      title: 'Generation Information — ' + market,
      url: 'https://www.aemo.com.au/energy-systems/electricity/national-electricity-market-nem/nem-forecasting-and-planning/forecasting-and-planning-data/generation-information',
      licence: 'AEMO terms of use — attribution',
      cadence: 'quarterly',
      fields: ['name', 'powerMW', 'energyMWh', 'operator', 'status', 'cod'],
      joins: { coordinates: 'AEMO NEM registration and exemption list, on DUID' },
      note: [
        'Existing, committed and proposed capacity with a developer-estimated commissioning date. "Committed" is the status worth plotting: AEMO applies published commitment criteria to it, so it is a filtered pipeline rather than a queue. Proposed capacity exceeds 18.6 GW and is not rendered.',
        '包含现有、已承诺与拟建容量，并附开发商预估投运日期。"已承诺"是值得绘制的状态：AEMO对其适用公开的承诺标准，因此属经筛选的管线而非排队清单。拟建容量超过18.6GW，不予渲染。',
      ],
    },
  };
}

function CANDIDATE(title, url, note){
  return { status: 'candidate', storage: { title, url, note, fields: [] } };
}

function JAPAN_CANDIDATE(){
  return CANDIDATE('OCCTO long-term decarbonisation auction (LTDA) award lists',
    'https://www.occto.or.jp/en/', [
      'LTDA rounds award storage capacity and the awards are the contracted basis of the Japanese case on this platform. Whether award lists carry project coordinates has NOT been confirmed.',
      'LTDA各轮次授予储能容量，该中标结果构成本平台日本投资逻辑的合同化基础。尚未确认中标名单是否包含项目坐标。',
    ]);
}

/** The pipeline source declaration for a market, or null where none exists. */
export function pipelineSourceFor(marketId){
  return PIPELINE_SOURCES[marketId] || null;
}

/** Markets whose storage layer may actually be built today. */
export const VERIFIED_STORAGE_MARKETS =
  Object.keys(PIPELINE_SOURCES).filter(id => PIPELINE_SOURCES[id].status === 'verified');

/** Markets that will render no storage layer, with the reason available. */
export const NO_STORAGE_SOURCE_MARKETS =
  Object.keys(PIPELINE_SOURCES).filter(id => PIPELINE_SOURCES[id].status === 'none');
