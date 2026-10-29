/* ---------------------------------------------------------------------------
   Saudi Arabia — market dataset. Every number is traceable to sources.js and
   to docs/saudi-registration-plan.md, signed off 2026-10-29.

   No Investment Lab seed. The Lab prices a contract line, and this market's
   is unpublished; a Lab run on a guessed fee would publish the one number the
   engine withholds. The portfolio tab shows break-even fees instead: what an
   SSA must pay to return a given cost of capital on SPPC's own investment.
   --------------------------------------------------------------------------- */
import { landedDcPerKWh } from '../../comparison/supplierQuote.js';
import { CAPEX_PER_MW, ENGIE_PER_MW, REBUILT_PER_MW, SAR_PER_USD, breakEvenFee } from './comparison.js';

const M = {
  asOf: '2026-10-29',
  dataDate: 'SPPC Group 1 award, 20–21 Aug 2026; Group 2 bid deadline 12 Nov 2026',
  modelVersion: 'sa-1.0-sppc-ssa',
  title: ['Saudi Arabia Battery Investment Dashboard', '沙特储能投资看板'],
  sub: ['A state buyer, fifteen-year availability contracts and no merchant leg: what SPPC has procured, what it costs to build, and the one number — the fee — that has not been published.',
        '国有买方、十五年可用性合同且无市场化收入：SPPC已采购什么、建设成本多少，以及唯一尚未公布的数字 — 付费水平。'],
  nextMilestone: ['Next milestone: Group 2 bids close on 12 November 2026; an award or a financial-close filing that states the fee (gate SA-1)',
                  '下一里程碑：第二组于2026年11月12日截标；公布付费水平的授标或融资关闭披露（研究缺口SA-1）'],
  footerNote: ['Public sources read 29 October 2026: SPPC\'s Group 1 award as reported, the consortia\'s disclosures, the Group 2 prequalification and deadline, SAMA on the peg and ZATCA on tax.',
               '公开来源于2026年10月29日核阅：经报道的SPPC第一组授标、各联合体披露、第二组资格预审与截标时间、SAMA关于联系汇率的声明，以及ZATCA税务规定。'],
  seedWarn: ['No return is shown. The contract is the whole revenue and its price is unpublished, so this market stays out of the engine until gate SA-1 closes.',
             '不展示回报。合同即全部收入且价格未公布，因此在研究缺口SA-1关闭前本市场不进入引擎。'],

  /* ---- the procurement ---------------------------------------------------- */
  group1: {
    signed: '2026-08-21', mw: 2000, mwh: 8000, investmentSar: 4.35e9, investmentUsd: 1.16e9, termYears: 15,
    sites: [
      { name: ['Al Muwayh', 'Al Muwayh'], region: ['Makkah', '麦加省'], owners: 'Saudi Energy, ACWA Power, Al Sharif', mw: 500, mwh: 2000 },
      { name: ['Haden', 'Haden'], region: ['Makkah', '麦加省'], owners: 'Saudi Energy, ACWA Power, Al Sharif', mw: 500, mwh: 2000 },
      { name: ['Al Kahfah', 'Al Kahfah'], region: ['Hail', '哈伊勒省'], owners: 'Saudi Energy, ACWA Power, Al Sharif', mw: 500, mwh: 2000 },
      { name: ['Al Khushaybi', 'Al Khushaybi'], region: ['Qassim', '卡西姆省'], owners: 'ENGIE, Haji Abdullah Alireza', mw: 500, mwh: 2000 },
    ],
    acwaThreeSar: 3.25e9, acwaStakePct: 34.9, saudiEnergyStakePct: 35.1, engieUsd: 220e6,
  },
  group2: {
    mw: 3000, mwh: 12000, prequalified: 27, bidsDue: '2026-11-12',
    sites: [
      { name: ['Samha', 'Samha'], region: ['Qassim', '卡西姆省'] },
      { name: ['Al-Leeth', 'Al-Leeth'], region: ['Makkah', '麦加省'] },
      { name: ['Al-Henakiyah', 'Al-Henakiyah'], region: ['Madinah', '麦地那省'] },
      { name: ['Khulais', 'Khulais'], region: ['Makkah', '麦加省'] },
      { name: ['Sadawi', 'Sadawi'], region: ['Eastern Province', '东部省'] },
      { name: ['Ashyrah', 'Ashyrah'], region: ['Makkah', '麦加省'] },
    ],
    bidders: 'Masdar, ACWA Power, EDF, TotalEnergies, Marubeni, KEPCO, Korea Western Power, Sumitomo, SPIC, PowerChina, China Southern Power Grid, TNB, Tesla, Saudi Electricity',
  },
  target2030GWh: 48,

  /* ---- capex --------------------------------------------------------------- */
  capex: {
    seed: CAPEX_PER_MW, low: ENGIE_PER_MW, high: REBUILT_PER_MW, sarPerUsd: SAR_PER_USD,
    quoteBlockKWh: landedDcPerKWh('SAR'), dutyPct: 5,
    secOwnUsdKWh: [120, 123],
  },
  breakEven: [0.06, 0.07, 0.08, 0.09].map(r => ({ rate: r, fee: breakEvenFee(r) })),

  timeline: [
    { y: 'Nov 2024', t: ['SPPC opens Group 1', 'SPPC启动第一组'], p: ['SPPC launched qualification for 2 GW / 8 GWh of four-hour storage on build-own-operate terms; 33 were prequalified in December.', 'SPPC启动2GW/8GWh四小时储能（建设-拥有-运营）资格预审；12月共33家通过。'], i: ['Storage procured like the solar rounds.', '储能按光伏轮次方式采购。'] },
    { y: 'Jul 2026', t: ['Group 2 prequalified', '第二组资格预审'], p: ['27 developers and technology providers prequalified for 3 GW / 12 GWh at six sites, many of them foreign.', '六个场址共3GW/12GWh，27家开发商与技术提供商通过资格预审，其中不少为外资。'], i: ['The door is open to foreign developers.', '向外资开发商开放。'] },
    { y: 'Aug 2026', t: ['Group 1 signed', '第一组签约'], p: ['Four 15-year Storage Services Agreements for SAR 4.35bn of investment: three to Saudi Energy and ACWA Power, one to ENGIE. No fee was published.', '签署四份15年储能服务协议，投资43.5亿里亚尔：三份归Saudi Energy与ACWA Power，一份归ENGIE。未公布付费水平。'], i: ['US$145/kWh all-in, price unknown.', '全包每kWh 145美元，价格未知。'] },
    { y: 'Nov 2026', t: ['Group 2 bids', '第二组投标'], p: ['Bids close on 12 November after an extension; no award date is published.', '延期后于11月12日截标；授标日期未公布。'], i: ['The likeliest place a price is published.', '最可能公布价格之处。'] },
    { y: '2030', t: ['48 GWh target', '48GWh目标'], p: ['The national target for battery storage by 2030; SPPC\'s two groups are 20 GWh of it.', '2030年全国电池储能目标；SPPC两组合计占20GWh。'], i: ['More rounds to come.', '后续还有更多轮次。'] },
  ],

  glossary: [
    ['SPPC — Saudi Power Procurement Company, the Principal Buyer', 'SPPC — 沙特电力采购公司，即主买方'],
    ['SSA — Storage Services Agreement, the 15-year contract SPPC signs with each winner', 'SSA — 储能服务协议，SPPC与各中标方签署的15年合同'],
    ['ISP — Independent Storage Provider, the winner\'s role under the SSA', 'ISP — 独立储能供应商，即中标方在SSA下的角色'],
    ['BOO — build-own-operate: the winner develops, finances, builds, owns and runs the plant', 'BOO — 建设-拥有-运营：中标方负责开发、融资、建设、拥有与运营'],
    ['National Grid SA — the transmission company of the Saudi Electricity Company', '沙特国家电网公司 — 沙特电力公司下属输电公司'],
    ['Zakat — 2.5% levy on the Saudi share of a company, in place of income tax', '天课 — 对公司沙特股东份额征收的2.5%税费，取代所得税'],
  ],
};

export { M };
export default M;
