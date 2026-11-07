import {HISTORY_DATA} from './historyData.js';
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
  asOf: HISTORY_DATA.asOf,
  dataDate: HISTORY_DATA.dataDate,
  modelVersion: HISTORY_DATA.modelVersion,
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
  target2030GWh: HISTORY_DATA.target2030GWh,

  /* ---- capex --------------------------------------------------------------- */
  capex: {
    seed: CAPEX_PER_MW, low: ENGIE_PER_MW, high: REBUILT_PER_MW, sarPerUsd: SAR_PER_USD,
    quoteBlockKWh: landedDcPerKWh('SAR'), dutyPct: 5,
    secOwnUsdKWh: [120, 123],
  },
  breakEven: [0.06, 0.07, 0.08, 0.09].map(r => ({ rate: r, fee: breakEvenFee(r) })),

  timeline: HISTORY_DATA.timeline,

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
