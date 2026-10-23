/* ---------------------------------------------------------------------------
   Japan — source register.

   National sources first, then one block per regional lens. Rendered by the
   shared components/sourceDrawer.js; nothing here is hardcoded into a
   presentation component.

   Source hierarchy used throughout this dashboard:
     Tier 1  official market / regulator / TSO data          → badge 'official' | 'final'
     Tier 2  public company / lender / offtaker / OEM        → badge 'public' | 'dev'
     Tier 3  reputable third-party research                  → badge 'tp'
     Tier 4  developer assumption / illustrative model seed  → badge 'illus'
   Tier 3 and 4 are never promoted to 'official'.
   --------------------------------------------------------------------------- */
import { QUOTE_SOURCES } from '../../comparison/supplierQuote.js';

export const SRC = {
  /* The supplier quotation and its MSA — capex DC block and the service package (2026-10-17). */
  ...QUOTE_SOURCES,
  // ---- national ----------------------------------------------------------
  jepx: {
    file: 'JEPX — Day-Ahead (spot) market data',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '28 Jul 2026', cy: 'Rolling 30-minute Area Price',
    url: 'https://www.jepx.jp/en/electricpower/market-data/spot/',
  },
  jepxMonthly: {
    file: 'JEPX — monthly average market data',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '28 Jul 2026', cy: 'Monthly averages by area',
    url: 'https://www.jepx.jp/en/electricpower/market-data/spot/ave_month.html',
  },
  eprx: {
    file: 'EPRX — Balancing Market trading rules and guides',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: 'Effective 1 Jul 2026', cy: 'Current rule vintage',
    url: 'https://www.eprx.or.jp/outline/announcement.html',
  },
  eprxRules18: {
    file: 'EPRX — Trading Rules v18',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: 'Effective 1 Jul 2026', cy: 'Articles 26, 32 and 39',
    url: 'https://www.eprx.or.jp/outline/docs/kitei_ver.18_260701.pdf',
    automation: 'C', format: 'Versioned PDF',
  },
  eprxGuide10: {
    file: 'EPRX — Trading Guide v10',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: 'Effective 1 Jul 2026', cy: 'Current operating guide',
    url: 'https://www.eprx.or.jp/outline/docs/guide_ver.10_260701.pdf',
    automation: 'C', format: 'Versioned PDF',
  },
  eprxBatteryGuide: {
    file: 'EPRX — Battery and pumped-storage participation guide v3',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '14 Mar 2026', cy: 'Connection, metering and participation pathways',
    url: 'https://www.eprx.or.jp/outline/docs/yousuichikudenchi_guide_260314.pdf',
    automation: 'C', format: 'Versioned PDF',
  },
  eprxComms: {
    file: 'EPRX — communications-system application and capacity status',
    status: ['Official — Current', '官方 — 现行'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '29 Jul 2026', cy: 'Current application process',
    url: 'https://www.eprx.or.jp/outline/system_construction.html',
    automation: 'B', format: 'HTML and linked files',
  },
  occtoCm2029: {
    file: 'OCCTO — 2029 Capacity Market main auction materials and results',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026', cy: 'Delivery year 2029',
    url: 'https://www.occto.or.jp/various/capacity-market/jitsujukyukanren/2029_jitsujukyu_kanren.html',
  },
  /* REVISED 2026-10-23: the URL was the July 2026 consultation page for the
     Round 4 guidelines; it now points at the Round 3 results annex it names. */
  occtoLtda2026: {
    file: 'OCCTO — Long-Term Decarbonization Power Source Auction Round 3 (FY2025 bidding) results, award list annex',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '13 May 2026', cy: 'Round 3 / FY2026 reviewed vintage',
    url: 'https://www.occto.or.jp/assets/various/capacity-market/jitsujukyukanren/2025_boshuyoukou_long/260513_longauction_youryouyakujokekka_kouhyou_besshi_ousatsu2025.pdf',
    quality: 'final',
  },
  /* The cell-origin rule (docs/japan-cell-origin-plan.md, signed off 2026-10-23). */
  occtoLtdaRound4Guidelines: {
    file: 'OCCTO — Long-Term Decarbonization Power Source Auction guidelines (FY2026 bidding, Round 4)',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2 Sep 2026', cy: 'Lithium-ion capped at 400 MW with no award beyond it (p. 10, p. 36); certified-cell lithium-ion projects clear before all others (pp. 35–36); cells only from the certified maker\'s own plants, one maker per unit (p. 28, form 4)',
    url: 'https://www.occto.or.jp/assets/260902_boshuyoukou_long_2026.pdf',
    automation: 'C', format: 'PDF',
  },
  meti006s02: {
    file: 'METI — 電力安定供給WG reference 2, "長期脱炭素電源オークションの第4回募集に向けて"',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: 'Aug 2026', cy: 'Round 4 battery caps (p. 11); priority for cells from makers certified under the Economic Security Promotion Act, replacing the 30% per-country limit for lithium-ion (p. 36); bid return, ceiling and cost inputs (tables 17, 29–31)',
    url: 'https://www.meti.go.jp/shingikai/enecho/denryoku_gas/jisedai_kiban/stable_power_supply_wg/pdf/006_s02_00.pdf',
    automation: 'C', format: 'PDF',
  },
  /* Practitioner evidence, on the same footing as the supplier quotation. Not on
     METI's public list on 2026-10-23: register the official entry once it appears. */
  hithiumEspaCertification: {
    file: 'HiTHIUM — battery supply-assurance plan certification under the Economic Security Promotion Act, covering the plant that makes the quoted cells',
    status: ['Practitioner evidence', '从业者证据'],
    provenance:{authority:'counterparty-reported',publication:'final',availability:'restricted',verification:'requires-reverification'},
    date: 'Reported 23 Oct 2026', cy: 'Supplied by the analyst; METI\'s public list did not yet show it on 23 Oct 2026',
    url: '',
    automation: 'D — analyst-supplied evidence', lastChecked: '2026-10-23',
  },
  /* The balancing market since day-ahead trading began. */
  eprxPriceCap: {
    file: 'EPRX — 需給調整市場のΔkW上限価格について (ΔkW price caps)',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '30 Jul 2026', cy: 'Primary, secondary-1 and composite product: ¥19.51 to 13 Mar 2026, ¥15.00 from 14 Mar, ¥10.00 from 1 Sep 2026 per ΔkW per 30 min; secondary-2 and tertiary-1 ¥7.21; tertiary-2 uncapped',
    url: 'https://www.eprx.or.jp/information/docs/14b85fbe8942da7d3bdddda80243e7e170f64d9e.pdf',
    automation: 'C', format: 'PDF',
  },
  metiBalancing202605: {
    file: 'METI — 電力安定供給WG material 8, "需給調整市場について"',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '13 May 2026', cy: 'Day-ahead trading and 30-minute units for primary to tertiary-1 from 14 Mar 2026; primary and secondary-1 procured at 1σ, was 3σ (pp. 3–4)',
    url: 'https://www.meti.go.jp/shingikai/enecho/denryoku_gas/jisedai_kiban/stable_power_supply_wg/pdf/001_08_00.pdf',
    automation: 'C', format: 'PDF',
  },
  occtoSupplyPlan2025: {
    file: 'OCCTO — Aggregation of Electricity Supply Plans FY2025',
    status: ['Official — Forecast', '官方 — 预测'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '30 Jun 2025', cy: 'FY2025–FY2034; source years preserved',
    url: 'https://www.occto.or.jp/en/assets/information_disclosure/supply_plan/files/2025_Aggregation_of_Electricity_Supply_Plan.pdf',
    automation: 'B', format: 'PDF with structured appendix tables',
  },
  eprxProductRequirements: {
    file: 'EPRX — Balancing Market product requirements and schedule, v6',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '13 Mar 2026', cy: 'Current product requirements',
    url: 'https://www.eprx.or.jp/outline/docs/shouhin_ver.6_20260313.pdf',
    automation: 'C', format: 'PDF',
  },
  eprxFaq: {
    file: 'EPRX — participation, control-line and offline-FCR clarifications',
    status: ['Official — Current', '官方 — 现行'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '29 Jul 2026', cy: 'Current FAQ; monitor rule changes',
    url: 'https://www.eprx.or.jp/contact/jukyuchoseishijo/faq.html',
    automation: 'C', format: 'HTML',
  },


  // ---- Tokyo -------------------------------------------------------------
  tepcoStudyCap: {
    file: 'TEPCO Power Grid — concurrent connection-study cap (11 per operator)',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '24 Jul 2026', cy: 'Effective 1 Aug 2026',
    url: 'https://www.tepco.co.jp/pg/consignment/workshop/information/renewable/adjustment/20260724_01.html',
  },
  tepcoDeposit: {
    file: 'TEPCO Power Grid — battery connection deposit and construction-cost contribution',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '1 Apr 2026', cy: 'Applications from 1 Apr 2026',
    url: 'https://www.tepco.co.jp/pg/consignment/workshop/information/renewable/adjustment/20260401_02.html',
  },
  tepcoOutputControl: {
    file: 'TEPCO Power Grid — renewable output control',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026', cy: 'Rolling',
    url: 'https://www.tepco.co.jp/pg/consignment/access/outputcontrol.html',
  },
  occtoTokyoCurtail: {
    file: 'OCCTO — verified Tokyo-area output control, Mar / Apr / May 2026',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: 'Mar–May 2026', cy: '5 + 6 + 9 days',
    url: 'https://www.occto.or.jp/news/012583.html',
  },
  tokyoSupport: {
    file: 'Tokyo Metropolitan Government — utility-scale BESS support, FY2026',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '30 Mar 2026', cy: 'FY2026 programme',
    url: 'https://www.metro.tokyo.lg.jp/information/press/2026/03/2026033013',
  },
  ekuNaganohara: {
    file: 'Eku Energy — Naganohara BESS, Gunma',
    status: ['Developer-reported', '开发商披露'], provenance:{authority:'developer-reported',publication:'final',availability:'public',verification:'verified'},
    date: '2026', cy: 'Project announcement',
    url: 'https://www.ekuenergy.com/en/news-and-blogs/media-release-naganohara',
  },

  // ---- Kyushu ------------------------------------------------------------
  kyudenStudyCap: {
    file: 'Kyushu Electric Power T&D — connection applications and study cap (8 per operator)',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026', cy: 'Effective 1 Aug 2026',
    url: 'https://www.kyuden.co.jp/td/application/electric-power-generation-business/application.html',
  },
  kyudenTransferTrip: {
    file: 'Kyushu Electric Power T&D — expanded transfer-trip system in operation',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '1 Apr 2026', cy: 'Kanmon export headroom',
    url: 'https://www.kyuden.co.jp/td/news/notice/260401.html',
  },
  kyudenContribution: {
    file: 'Kyushu Electric Power T&D — construction-cost contribution process flow',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026', cy: 'Current process',
    url: 'https://www.kyuden.co.jp/td/service/wheeling/outline/flow.html',
  },
  occtoKyushuCurtail: {
    file: 'OCCTO — verified Kyushu-area output control, Jan–Mar 2026',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: 'Jan–Mar 2026', cy: '12 + 14 + 24 = 50 days',
    url: 'https://www.occto.or.jp/news/012277.html',
  },
  ekuHirohara: {
    file: 'Eku Energy — Hirohara BESS',
    status: ['Developer-reported', '开发商披露'], provenance:{authority:'developer-reported',publication:'final',availability:'public',verification:'verified'},
    date: '2026', cy: 'Project page',
    url: 'https://www.ekuenergy.com/en-gb/projects/hirohara-bess',
  },
  ekuKamiTonno: {
    file: 'Eku Energy — Kami-Tonno BESS',
    status: ['Developer-reported', '开发商披露'], provenance:{authority:'developer-reported',publication:'final',availability:'public',verification:'verified'},
    date: '2026', cy: 'Project page',
    url: 'https://www.ekuenergy.com/en-gb/projects/kami-tonno',
  },
  itochuChikuzen: {
    file: 'ITOCHU / Mitsubishi Estate / Tokyo Century — Chikuzen-machi BESS',
    status: ['Developer-reported', '开发商披露'], provenance:{authority:'developer-reported',publication:'final',availability:'public',verification:'verified'},
    date: '1 Jun 2026', cy: 'Press release',
    url: 'https://www.itochu.co.jp/en/news/press/2026/260601.html',
  },

  // ---- Hokkaido ----------------------------------------------------------
  hepcoStudyCap: {
    file: 'HEPCO Network — utility-scale BESS connection-study cap (5 per operator)',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '24 Jul 2026', cy: 'Effective 1 Aug 2026',
    url: 'https://www.hepco.co.jp/network/info/info2026/1253145_2078.html',
  },
  hepcoAccess: {
    file: 'HEPCO Network — system access and BESS early-connection framework',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026', cy: 'Current process',
    url: 'https://www.hepco.co.jp/network/con_service/sys_access/',
  },
  hepcoChargeControl: {
    file: 'HEPCO Network — charging-control early connection (27 specified systems)',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '10 Apr 2026', cy: '27 systems specified',
    url: 'https://www.hepco.co.jp/network/info/info2026/1253068_2078.html',
  },
  occtoHokkaidoCurtail: {
    file: 'OCCTO — verified Hokkaido-area output control, Mar / Apr / May 2026',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: 'Mar–May 2026', cy: '7 + 11 + 18 = 36 days',
    url: 'https://www.occto.or.jp/news/012578.html',
  },
  hokkaidoHonshu: {
    file: 'OCCTO — Hokkaido–Honshu interconnection reinforcement (0.9 → 1.2 GW)',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026', cy: 'Approved to FY2027-end',
    url: 'https://www.occto.or.jp/',
  },
  /* Project-level authority for the interconnector register. OCCTO publishes the
     master plan and, separately, the grid-development planning process for each
     intertie — the two carry very different evidential weight, which is what the
     register's class column records. */
  occtoMasterPlan: {
    file: 'OCCTO — wide-area grid master plan and grid-development planning processes',
    status: ['Official — Public', '官方 — 公开'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '2026', cy: 'Interconnector reinforcements by planning stage, with in-service targets where published',
    url: 'https://www.occto.or.jp/institution/kouikikeitou/seibikeikaku/',
    authority: 'official-forecast',
    historical: 'Approved grid-development plans and their delivery years',
    forecast: 'Long-term wide-area scenario to the 2040s; targets for interties in the planning process',
    frequency: 'Master plan periodically; planning-committee papers continuously',
    format: 'PDF (Japanese)',
    machineReadable: 'No',
    automation: 'C — fetchable; Japanese-language extraction requires review',
    lastChecked: '2026-08-02',
    freshness: 'Current planning-committee round',
  },
  hepcoBalancing: {
    file: 'Hokkaido Electric Power Network — BESS balancing registration and connection-contract pipeline',
    status: ['Official — Final', '官方 — 最终'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'},
    date: '30 Mar 2026', cy: 'FY2026 outlook',
    url: 'https://www.hepco.co.jp/network/con_service/sys_access/',
  },

  // ---- model -------------------------------------------------------------
  /* Opened on 2026-10-12 for the capital-at-risk ledger and the first grades.
     Each `cy` says what the document establishes and stops there. */
  fefetaOutline: { file:'Ministry of Finance — Outline of the inward direct investment system under the Foreign Exchange and Foreign Trade Act (for investee companies)', status:['Official — Public','官方 — 公开'], provenance:{authority:'official',publication:'final',availability:'public',verification:'verified'}, date:'May 2023', cy:'A foreign investor must submit a prior notification before acquiring any share of an unlisted Japanese company, or 1% or more of a listed one, operating in a designated business sector; infrastructure including electricity is one, and so are storage batteries and their materials. An exemption exists for investors who take no part in management, and not for state-owned enterprises. The page states no review period', url:'https://www.mof.go.jp/english/policy/international_policy/fdi/Overview/outline1.pdf' },

  modelSeed: {
    file: 'Normalized economics — illustrative seed pending ETL (see Data & Methodology)',
    status: ['Financial-model assumption', '财务模型假设'], provenance:{authority:'internal',publication:'final',availability:'restricted',verification:'verified'},
    date: '28 Jul 2026', cy: 'Reference 50 MW / 4h',
    url: '',
    quality: 'illus',
  },
};

export const sources = SRC;
export default SRC;
