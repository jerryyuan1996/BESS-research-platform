/* ---------------------------------------------------------------------------
   Ontario — market dataset. Every number is traceable to sources.js and to
   docs/ontario-registration-plan.md, signed off 2026-10-23.
   --------------------------------------------------------------------------- */
import { landedDcPerKWh } from '../../comparison/supplierQuote.js';

const DC = landedDcPerKWh('CAD');   // C$149.445/kWh at the meter

const M = {
  asOf: '2026-10-23',
  dataDate: 'LT2(c-1) final results, 13 Jul 2026; day-ahead prices 24 Jul – 23 Oct 2026',
  modelVersion: 'ca_on-1.0-lt2-contract',
  title: ['Ontario Battery Investment Dashboard', '安大略储能投资看板'],
  sub: ['A twenty-year capacity contract from the system operator with every market revenue left to the owner: what LT2 pays, what trading adds, and what an eight-hour battery costs.',
        '由系统运营商提供、市场收入全部归业主的二十年容量合同：LT2支付多少、交易增加多少，以及八小时储能的造价。'],
  nextMilestone: ['Next milestone: IESO\'s final LT2 window 2 RFP with its target MW and dates, and a full year of day-ahead prices (gate ON-1b)',
                  '下一里程碑：IESO发布含目标容量与日程的LT2窗口2最终招标文件，以及满一年的日前电价（研究缺口ON-1b）'],
  footerNote: ['Public sources read 23 October 2026: IESO\'s final LT2(c-1) contract and RFP, its results table, its public price reports, and Oneida\'s published final cost.',
               '公开来源于2026年10月23日核阅：IESO最终版LT2(c-1)合同与招标文件、结果表、公开电价报告，以及Oneida公布的最终成本。'],
  seedWarn: ['The trading line rests on 90 days of day-ahead prices annualised with the old market\'s seasonal shape; a full year will move it. A contract price is never a delivered payment: it scales with tested capacity and falls into default below 85%.',
             '交易收入基于90天日前电价，并以旧市场的季节形态年化；满一年数据后将调整。合同价格不等于实收款项：付款随测试容量调整，低于85%即构成违约。'],

  /* ---- the contract ------------------------------------------------------ */
  lt2: {
    priceWeighted: 563.48, priceLow: 527.20, priceHigh: 614.47,
    businessDays: 251, businessDaysMean: 250.90,
    contractedMW: 640, targetMW: 600,
    milestoneCod: '2030-05-01', expiry: '2050-04-30',
    window2Milestone: '2032-05-01', window2Expiry: '2052-04-30', window2DraftsPosted: '2026-10-09',
    indexedSharePct: 20,
    proposalDeadline: '2025-12-18',
    winners: [
      { name: ['Napanee BESS Phase 2', 'Napanee储能二期'], owner: 'Atura Power (OPG)', zone: ['East', '东部'], mw: 300, build: ['300 MW, up to 8 h', '300MW，最长8小时'], price: 527.20, src: 'napaneeOpg' },
      { name: ['Eagle Lake Power Reserve', 'Eagle Lake储能'], owner: 'Neoen / Eagle Lake First Nation', zone: ['Northwest', '西北'], mw: 190, build: ['200 MW / 1,600 MWh', '200MW/1,600MWh'], price: 580.50, src: 'eagleLakeNeoen' },
      { name: ['Simcoe Battery Project', 'Simcoe储能项目'], owner: 'Six Nations Group, MCBC, Aecon, Sitka Power, NRStor', zone: ['Southwest', '西南'], mw: 150, build: ['150 MW / 1,200 MWh', '150MW/1,200MWh'], price: 614.47, src: 'simcoeNrstor' },
    ],
  },

  /* ---- trading (gate ON-1) ----------------------------------------------- */
  trading: {
    windowDays: 90, windowFrom: '2026-07-24', windowTo: '2026-10-23',
    meanPrice: 56.55, tb8PerDay: 325.63, seasonalRatio: 0.86719, tb8Annual: 103070,
    hoep2023Annual: 58835, hoep2024Annual: 70081, hoep2024Window: 218.83, hoep2024MeanPrice: 32.19,
    weekday: 363.92, weekend: 226.08, dispatchCheckPerDay: 264.76,
    zones: [
      { name: ['East', '东部'], tb8: 337.70 }, { name: ['Southwest', '西南'], tb8: 324.21 }, { name: ['Northwest', '西北'], tb8: 294.01 },
    ],
    capture: [{ h: 8, tb: 325.63, c: 1.000 }, { h: 10, tb: 354.39, c: 0.871 }, { h: 12, tb: 364.17, c: 0.746 }],
    reserve2024: { spin10: 4.57, nonSpin10: 4.20, r30: 2.07 },
  },

  /* ---- capex observation ------------------------------------------------- */
  oneida: { mw: 250, mwh: 1000, finalCostCad: 700000000, estimateAtCloseCad: 800000000, cod: '2025-05' },
  dutyPct: 7,

  /* The dashboard Investment Lab. Reconciles to the comparison archetype to the
     cent: energy at the quoted block landed in Canada, power at Oneida's 44%
     power side, 0.44 × 2,800,000 = C$1,232/kW. The spread is set so the Lab's
     trading line reproduces the C$74,783 seed: 8 h × 365 × 97% × C$26.40.
     The contract enters as C$141.433/kW-yr for twenty years. Debt terms are the
     platform's convention for a contracted asset, not an Ontario observation. */
  lab: {
    vatPct: 13, vatRecoverable: 1,
    devCostPct: 0, rtbPremiumPct: 0, constructionMonths: 12,
    mw: 50, hours: 8, capexKWh: DC, dcQuoteKWh: DC, capexKW: 1232, opexKW: 28,
    rte: 88, avail: 97, degr: 2.0, cycles: 1, spread: 26.40, optFee: 10,
    capPrice: 141.433, capYrs: 20, servicesKW: 0, grantPct: 30,
    life: 15, disc: 8, debtPct: 65, rate: 6, tenor: 15,
  },
  /* The capacity channel is the contract at full rating; a shorter battery
     does not qualify, so the curve only says that eight and twelve are paid
     the same per MW. */
  deratingCurve: { 8: 1, 10: 1, 12: 1 },
  futureCapFactor: 0,
  /* Observed capture relative to eight hours, IESO day-ahead, 2026 window. */
  durSpreadFactor: { 8: 1.000, 10: 0.871, 12: 0.746 },
  usableFraction: 1,

  /* How the market got here, dated. */
  timeline: [
    { y: '2023', t: ['The first storage procurements', '首批储能采购'],
      p: ['IESO announced seven storage projects totalling 739 MW; Napanee Phase 1, 250 MW, was 35% of it. Oneida reached financial close at an estimated C$800m.', 'IESO宣布七个储能项目，共739MW；Napanee一期250MW占35%。Oneida完成融资关闭，估算成本8亿加元。'],
      i: ['Four-hour batteries on capacity contracts.', '签有容量合同的四小时储能。'] },
    { y: 'May 2025', t: ['Market Renewal and Oneida', '电力市场改革与Oneida'],
      p: ['A day-ahead market with locational prices replaced the uniform HOEP on 1 May 2025; Oneida entered service the same month at about C$700m, below its estimate.', '2025年5月1日，含节点电价的日前市场取代统一的HOEP；Oneida于同月投运，成本约7亿加元，低于估算。'],
      i: ['Trading and location start to matter.', '交易与区位开始变得重要。'] },
    { y: 'Dec 2025', t: ['LT2 window 1 bids', 'LT2窗口1投标'],
      p: ['Bids closed on 18 December 2025 for up to 600 MW of eight-hour-or-longer capacity on a contract to 2050.', '2025年12月18日截标，采购最多600MW、至少八小时、合同至2050年的容量。'],
      i: ['The duration bar moves from four hours to eight.', '时长门槛由四小时升至八小时。'] },
    { y: '2026', t: ['Three eight-hour winners', '三个八小时中标项目'],
      p: ['640 MW awarded at C$527–614/MW-Business Day, weighted C$563.48; Napanee Phase 1 entered service in April. Day-ahead eight-hour spreads ran about half above the same months of 2024.', '以每MW工作日527–614加元授予640MW，加权563.48加元；Napanee一期于4月投运。日前八小时价差较2024年同期高约一半。'],
      i: ['About C$141k/MW a year contracted, plus trading.', '约每MW每年14.1万加元的合同收入，另加交易收入。'] },
    { y: '2032', t: ['Window 2', '窗口2'],
      p: ['Drafts posted 9 October 2026 move the milestone to 1 May 2032 and the expiry to 2052, with the same eight- and twelve-hour options.', '2026年10月9日发布的草案将里程碑推至2032年5月1日、到期日推至2052年，保留八小时与十二小时选项。'],
      i: ['The entry point for a new investor.', '新投资者的进入点。'] },
  ],

  glossary: [
    ['IESO — Independent Electricity System Operator, Ontario\'s system operator and buyer', 'IESO — 安大略独立电力系统运营商，兼采购方'],
    ['LT2 — the second long-term procurement; (c) capacity stream, (e) energy stream', 'LT2 — 第二轮长期采购；(c)为容量类，(e)为电量类'],
    ['MW-Business Day — the unit the capacity price is paid in', 'MW工作日 — 容量价格的计价单位'],
    ['Qualifying Hours — 07:00–23:00 EST on Business Days, when the must-offer applies', '合格时段 — 工作日东部标准时间7:00–23:00，须申报出力'],
    ['Ontario Zonal Price — the day-ahead price load pays since Market Renewal', '安大略分区电价 — 电力市场改革后负荷支付的日前价格'],
    ['HOEP — the uniform real-time price before May 2025', 'HOEP — 2025年5月前的统一实时电价'],
    ['Global Adjustment — Ontario\'s charge for contracted and regulated supply; reimbursed to LT2 storage on charging', '全球调整费 — 安大略用于合同与受管制电源的费用；LT2储能充电时可获返还'],
    ['Clean Technology ITC — Canada\'s 30% refundable investment tax credit', '清洁技术投资税收抵免 — 加拿大30%可退还投资税收抵免'],
  ],
};

export { M };
export default M;
