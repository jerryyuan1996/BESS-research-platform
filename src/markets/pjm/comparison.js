/* ---------------------------------------------------------------------------
   PJM Interconnection. Comparison interface.
   Economics are per MW per year, in USD.

   THE PLATFORM'S FIRST US MARKET, AND THE ONE THAT INVERTS ITS USUAL PROBLEM.

   Every other market on this platform is hard to model because the contracted
   revenue is confidential — no NEM toll price has ever been disclosed, no German
   toll fee has ever been published, no Japanese LTDA clearing price exists. PJM
   is the opposite. Its contracted line is the most completely published number
   in the entire set: PJM posts the auction clearing price and the storage
   accreditation factor as two separate public documents, and the product of them
   is what a four-hour battery is paid. There is nothing to estimate.

   What is hard here is the MERCHANT line, and it is hard in a way no other market
   on the platform is. The observed revenue is enormous — Modo benchmarks the PJM
   battery fleet at $24/kW-month through September 2025, and $62/kW-month after
   the October 2025 Regulation redesign, peaking at $104.5/kW-month in February
   2026. FERC's Electric Quarterly Reports put 19 batteries at $832/MW-day in Q1
   2025 with 86% of it from Regulation.

   Those numbers are real and this model does not publish them, because the fleet
   earning them is about 400 MW against a Regulation requirement of about 750 MW.
   PJM's storage queue is 67 GW. Modo projects up to 7 GW operating by 2030. The
   revenue above is what a resource earns when it is scarce relative to a fixed
   requirement, and it closes as the queue arrives — before an asset underwritten
   today would commission. Publishing it as a base case would be publishing the
   single most misleading number this platform could produce.

   So the merchant stack is split in two, and the two halves behave differently:

     merchGross   ENERGY ARBITRAGE. Derived from PJM's published TB4 spread, and
                  the leg that scales with duration and with volatility. Growing.
     services     REGULATION. Power-based, does not scale with duration, and
                  bounded above by a system requirement that does not grow.
                  Derived forward from requirement ÷ competing fleet, NOT from
                  the observed index — which is carried as the band ceiling.

   THE 86/14 SPLIT IS ESTIMATED. FERC's EQR filing gives 86% of battery revenue
   from Regulation for Q1 2025 across 19 reporting units, and Modo's April 2026
   fleet stack independently decomposes to about 78% Regulation / 15% arbitrage /
   7% capacity. Neither is a granular per-unit split and no source publishes one,
   so the decomposition is labelled estimated wherever it is used. It is used only
   to read the HISTORICAL index apart. Neither forward leg is derived from it.
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';
import { stackFrom } from '../../comparison/capex.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { COMPOSITE, CONNECTION_RISK } from './scores.js';

/* NREL, "Cost Projections for Utility-Scale Battery Storage: 2025 Update" — the
   US counterpart to CSIRO's GenCost, and the same role it plays for the NEM.
   $334/kWh installed for a utility-scale four-hour system.

   US installed cost is NOT the global cost and the gap is policy, not equipment:
   Section 301 duties on non-EV lithium-ion cells, reciprocal tariffs, and the
   domestic-content premium a project pays to qualify for the ITC adder. Reported
   US EPC pricing for four-hour LFP front-of-meter runs $230-320/kWh post-tariff
   against roughly $90-130/kWh in China. */
const CAPEX_PER_KWH = 334;
const HOURS = 4;
const CAPEX_TOTAL_PER_MW = CAPEX_PER_KWH * HOURS * 1000;   // $1,336,000

/* ---------------------------------------------------------------------------
   THE CONTRACTED LINE, AND WHY IT IS AN AUCTION-RENEWAL RATHER THAN A CONTRACT.

   A PJM Base Residual Auction procures capacity for ONE delivery year. It is not
   a contract with a tenor; it is a clearing event that repeats. Modelling it as
   `contracted` with a fifteen-year life would assert fourteen years of revenue
   nobody has bid for, which is exactly the error the auction-renewal risk class
   exists to prevent — the same reason Japan carries it.

   Both inputs are published, separately, by PJM:

     $325.00/MW-day   2028/2029 Base Residual Auction, cleared 14 July 2026 at
                      the FERC-approved cap for the entire RTO footprint. Down
                      2.5% from the 2027/2028 cap of $333.44/MW-day.
     59%              4-hr Storage ELCC class rating for the 2028/2029 BRA.
                      (2027/2028 was 58%; 6-hr is 68% and 10-hr is 78%.)

     325.00 × 365 × 0.59 = $69,988.75/MW/yr
   --------------------------------------------------------------------------- */
const DAYS = 365;
const BRA_2829_PRICE = 325.00;      // $/MW-day (UCAP), RTO-wide
const BRA_2829_ELCC = 0.59;         // 4-hr Storage class rating
const SECURED = Math.round(BRA_2829_PRICE * DAYS * BRA_2829_ELCC);   // 69,994

/* The previous auction, for the band. 2027/2028 cleared at $333.44/MW-day with a
   58% 4-hr rating: 333.44 × 365 × 0.58 = $70,589. */
const BRA_2728 = Math.round(333.44 * DAYS * 0.58);                   // 70,589

/* ---------------------------------------------------------------------------
   THE RENEWAL PATH — fourteen years, each one declared rather than tapered.

   Two forces run in OPPOSITE directions here, which is why this market cannot
   use a single decline rule the way Japan does.

   PRICE rises. The price collar agreed with the thirteen PJM governors and
   approved by FERC covers four auctions and ends after 2029/2030; the last
   collared auction runs in December 2026. After it, the cap reverts to a Net
   CONE-based figure PJM estimates at about $550/MW-day. The uncapped 2027/2028
   simulation cleared at $529.80 RTO-wide, so the collar is currently suppressing
   the price by roughly 60%, and the shortfall that caused it has not closed —
   2027/2028 was about 6,500 MW short of the reliability requirement and
   2028/2029 was 6,831 MW short, the first two auctions in PJM history where the
   entire RTO fell short.

   ACCREDITATION falls. ELCC is a saturation measure by construction: as storage
   penetration rises the risk window lengthens and a four-hour asset covers less
   of it. PJM's own class table already prices this — 4-hr at 59% against 10-hr
   at 78% — and 67 GW of storage sits in the reopened queue.

   The result is a curve that RISES ABOVE the secured year before falling below
   it, peaking in 2030/31-2031/32 when the collar has gone and the queue has not
   yet arrived. That shape is the PJM investment case stated as a number, and it
   is why markets/schema.js does not require a renewal curve to decline.

   Everything below year 1 is an ANALYST SCENARIO. No auction has cleared for any
   of it. Gate G28 closes when the December 2026 auction prints. */
const RENEWAL = [
  // deliveryYear, $/MW-day, 4-hr ELCC
  ['2029/30', 325, 0.57],   // last collared auction — bids December 2026
  ['2030/31', 500, 0.54],   // collar gone; shortfall persists, clears near Net CONE
  ['2031/32', 520, 0.50],
  ['2032/33', 470, 0.46],   // Reliability Backstop and the reformed cycle land supply
  ['2033/34', 430, 0.42],
  ['2034/35', 400, 0.39],
  ['2035/36', 380, 0.36],   // balanced market: price settles, accreditation keeps eroding
  ['2036/37', 380, 0.34],
  ['2037/38', 380, 0.32],
  ['2038/39', 380, 0.30],
  ['2039/40', 380, 0.29],
  ['2040/41', 380, 0.28],
  ['2041/42', 380, 0.27],
  ['2042/43', 380, 0.26],
];

const renewalPayment = ([, price, elcc]) => Math.round(price * DAYS * elcc);
const auctionRenewalCurve = RENEWAL.map(renewalPayment);

/* ---------------------------------------------------------------------------
   ENERGY ARBITRAGE — the leg that grows.

   PJM publishes the TB4 spread, which is the sum of the four highest hourly
   prices less the four lowest: the perfect-foresight ceiling for a four-hour
   battery. The fleet average moved from $46,699/MW/yr in 2024 to $69,375/MW/yr
   in 2025, up 49%.

   A real asset does not capture the ceiling, and the three haircuts are the same
   ones Germany's spread bridge applies:

     × 0.88   round-trip efficiency
     × 0.97   availability and outages
     × 0.85   imperfect foresight — TB4 is computed after the fact

     69,375 × 0.88 × 0.97 × 0.85 = $50,336/MW/yr

   Two independent cross-checks, neither used as the seed. Reading the September
   2025 index apart on the estimated 86/14 split gives arbitrage of about
   $40,320/MW/yr. Modo's April 2026 fleet stack puts real-time arbitrage at
   $11/kW-month, which annualises to $132,000/MW/yr. The seed sits between them
   and is derived from a full calendar year of spread rather than from one month,
   which is the same basis rule the NEM uses.

   TB4 is intensely locational: 16 of the 20 highest-spread nodes are in northern
   Virginia and eastern Maryland, and 16 of the 20 lowest are in New Jersey. That
   dispersion is in the congestion register, not in a separate haircut — PJM
   settles at the node, so it is already inside this number rather than being a
   deduction from it. This market therefore declares no `naqFactor`; adding one
   would count the same locational risk twice. */
const TB4_2025 = 69375;
const TB4_2024 = 46699;
const CAPTURE = 0.88 * 0.97 * 0.85;                          // 0.72556
const ARBITRAGE = Math.round(TB4_2025 * CAPTURE);            // 50,336

/* ---------------------------------------------------------------------------
   REGULATION — the leg that closes, and the reason this market needed a rule.

   Regulation is power-based. A four-hour battery earns no more of it than a
   two-hour battery, so it must never be scaled by duration.

   The forward number is NOT the observed number. It is built from the requirement
   and the competition for it:

     requirement    ~750 MW after the October 2025 Phase 1 redesign, which
                    consolidated RegA and RegD into one bidirectional signal and
                    roughly doubled the market from ~320 MW. Requirements are
                    reported as "fairly stable" since. Phase 2 in October 2026
                    SPLITS the signal into RegUp and RegDown rather than growing
                    the pot.
     fleet today    ~400 MW of operating PJM battery
     fleet forward  ~5,000 MW expected operating by 2030 (Modo puts the ceiling
                    at 7 GW; 67 GW sits in the reopened queue)

   The observed per-MW level is taken at the PRE-SPIKE price deliberately. Modo's
   worked example gives a 1 MW battery running twelve hours a day $20/kW-month at
   June 2025's $55/MW/h, against $48/kW-month at October 2025's $129/MW/h. The
   October figure is a scarcity price against a 400 MW fleet and is not the level
   a saturated market clears at — Modo's own read is that batteries come to
   "dominate the Regulation market with low-cost bids".

     $20/kW-month × 12 = $240/kW/yr = $240,000/MW/yr at full assignment

   THE VINTAGE. That level is then divided by the fleet competing for it IN THE
   VINTAGE YEAR, which for PJM is year 1 — capacity revenue here is additive to
   merchant rather than a substitute for it, so merchant is exposed from
   commercial operation. See src/comparison/vintage.js.

   Year 1 is 2029 on this dashboard's COD window. The competing fleet then is the
   ~400 MW operating today plus the 1.9 GW that took interconnection agreements in
   Transition Cycle 1 — the only tranche with signed ISAs — plus early delivery
   from later cycles: about 3,000 MW.

     $240,000 × (400 ÷ 3,000) = $32,000/MW/yr

   What happens AFTER year 1 is not folded into that number. It is carried by
   `servicesCurve`, the mechanism Ireland and Romania have used since before the
   US markets existed, so the seed stays a level at a stated year and the curve
   stays a path. The previous build fused the two and published a 2030 figure in
   a year-1 slot; note that $32,000 × the curve's year-2 factor of 0.60 is
   $19,200, which is exactly what that fused number was. Nothing about the
   market's economics changed — only where the model says the number applies. */
const REG_REQUIREMENT_MW = 750;
const REG_FLEET_TODAY_MW = 400;
const REG_FLEET_YEAR1_MW = 3000;        // 2029: operating + Transition Cycle 1 ISAs
const REG_FLEET_2030_MW = 5000;
const REG_FLEET_PLATEAU_MW = 7000;
const REG_AT_FULL_ASSIGNMENT = 240000;                       // $/MW/yr, June 2025 prices
const REGULATION = Math.round(REG_AT_FULL_ASSIGNMENT * REG_FLEET_TODAY_MW / REG_FLEET_YEAR1_MW);
/* Downside: the queue arrives faster and year 1 already faces 4,000 MW. */
const REGULATION_FLOOR = Math.round(REG_AT_FULL_ASSIGNMENT * REG_FLEET_TODAY_MW / 4000);

/* The saturation path, as a per-year multiplier on the year-1 seed. Each factor
   is the year-1 competing fleet divided by that year's, so the curve is a fleet
   projection rather than a decay rate chosen for its shape:

     y1 3,000 · y2 5,000 · y3 5,600 · y4 6,200 · y5 6,600 · y6 6,900 · y7+ 7,000

   The plateau is Modo's 7 GW ceiling for 2030, held flat thereafter because
   nothing published extends the projection further and a curve that kept falling
   would be inventing evidence. */
const REG_FLEET_PATH = [3000, 5000, 5600, 6200, 6600, 6900, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000, 7000];
const REGULATION_CURVE = REG_FLEET_PATH.map(f => Math.round(REG_FLEET_YEAR1_MW / f * 100) / 100);

/* The estimated split, used ONLY to read the historical index apart. */
const OBSERVED_INDEX = 288000;        // $24/kW-month through September 2025
const REG_SHARE_ESTIMATED = 0.86;     // FERC EQR Q1 2025, 19 reporting batteries
const REGULATION_OBSERVED = Math.round(OBSERVED_INDEX * REG_SHARE_ESTIMATED);   // 247,680

const economics = {
  capexPerMW: CAPEX_TOTAL_PER_MW,
  capexStack: stackFrom(CAPEX_TOTAL_PER_MW, HOURS),

  /* No US value-added tax exists. State and local sales tax on equipment does,
     it varies by state across a thirteen-state footprint, and several PJM states
     exempt generation equipment outright — so a single footprint-wide rate would
     be a fabrication. Zero here means "not modelled", and the Data & Methodology
     tab says so rather than implying the cost is absent. Gate G29. */
  vatPct: 0, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  constructionMonths: 12,

  /* No published US fixed-opex series, the same gap DE and the NEM carry. 1.5%
     of installed cost, covering the long-term service agreement, insurance,
     land, property tax and PJM administrative charges. */
  opexPerMW: 20000,

  riskClass: 'auction-renewal',
  securedContracted: SECURED,
  /* One delivery year. Not a modelling choice — it is what a BRA procures. */
  securedContractYears: 1,
  auctionRenewalCurve,

  auctionRenewalScenario: {
    basis: [
      'A published clearing price and a published accreditation factor, projected separately because they move in opposite directions. The FERC-approved price collar covers four auctions and ends after 2029/2030, after which the cap reverts to a Net CONE-based figure PJM estimates at about $550/MW-day — the uncapped 2027/2028 simulation cleared at $529.80 RTO-wide. Against that, 4-hour ELCC erodes as storage penetration rises, which is what an ELCC rating measures. The curve therefore rises above its secured year before falling below it, and no single taper could express that.',
      '一个已公布的出清价格与一个已公布的核证系数，因二者走向相反而分别预测。经FERC批准的价格上下限机制覆盖四次拍卖、至2029/2030年度结束，其后价格上限将回归至PJM估算约每MW每日$550的净新增成本（Net CONE）基准 — 2027/2028年度无上限模拟的全RTO出清价为$529.80。与此相对，4小时储能的ELCC将随储能渗透率上升而下降，这正是ELCC所衡量的内容。因此该曲线先高于其已锁定年度、随后再降至其下，任何单一递减规则都无法表达这一形态。',
    ],
    source: 'PJM 2028/2029 and 2027/2028 Base Residual Auction results and ELCC class ratings (cleared years); price and accreditation paths beyond 2029/2030 are analyst scenarios',
    gate: 'G28',
    securedYear: {
      deliveryYear: '2028/29',
      price: BRA_2829_PRICE,
      priceUnit: 'USD/MW-day (UCAP)',
      accreditation: BRA_2829_ELCC,
      paymentPerMWYr: SECURED,
      cleared: true,
    },
    years: RENEWAL.map((row) => ({
      deliveryYear: row[0],
      price: row[1],
      priceUnit: 'USD/MW-day (UCAP)',
      accreditation: row[2],
      paymentPerMWYr: renewalPayment(row),
      cleared: false,
    })),
  },

  merchGross: ARBITRAGE,
  /* No US optimiser fee is disclosed. PJM assets are commonly self-scheduled or
     run under a shared-savings arrangement rather than a flat percentage. */
  feePct: 5,

  services: REGULATION,
  /* Saturation is a path, not a level. See REG_FLEET_PATH above. */
  servicesCurve: REGULATION_CURVE,
  servicesNote: [
    'Regulation is power-based and its requirement does not grow with the fleet. The curve is the year-1 competing fleet divided by each later year\'s, from ~3,000 MW in 2029 to Modo\'s 7 GW ceiling, held flat after 2034.',
    '调频为功率型服务，其需求不随机组规模增长。该曲线为第1年竞争机组规模除以其后各年度规模，自2029年约3,000MW至Modo预计的7GW上限，2034年后保持不变。',
  ],

  /* The §48E investment tax credit is NOT modelled here, and that is a decision
     rather than an omission. Standalone storage qualifies at 30% on construction
     start through 2033, and from 2026 the OBBBA material-assistance rules make it
     binary: fail the Material Assistance Cost Ratio and the whole credit is
     voided, not reduced. Transferred credits clear around 93 cents.

     Zero is the seed because the platform's market benchmarks exclude support
     that a specific project qualifies for, the same position Japan takes. What is
     different here is that the credit is available to essentially every compliant
     US project, so excluding it silently would understate the market rather than
     neutralise it. It is therefore declared as a RANGE — 0 to 37% — and appears
     as an editable field in the home-page Investment Lab, where a reader can put
     it back in and see what it does. The band, the derivation and the FEOC cliff
     are in `ranges.grantPct` below. */
  grantPct: 0,
  degr: 2,

  /* Deliberately absent: naqFactor. PJM settles at the nodal LMP, so locational
     basis is already inside the TB4 spread that merchGross is derived from.
     A network-access haircut on top would deduct it twice. */

  capNote: [
    'A Base Residual Auction procures ONE delivery year. 2028/29 cleared at the FERC cap for the third consecutive auction, 6,831 MW short of the reliability requirement; years 2-15 are re-auctioned and are analyst scenarios.',
    '基准剩余容量拍卖仅采购一个实需年度。2028/29年度连续第三次以FERC上限出清，且低于可靠性需求6,831MW；第2–15年须重新拍卖，属分析师情景假设。',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. Rules in src/comparison/ranges.js.

   The widest band on this platform is `services`, and it is the most important
   thing on this page. Thirteen-fold from seed to ceiling is not uncertainty about
   a measurement — both ends are known. It is the distance between what the PJM
   battery fleet earns today and what it earns once the queue behind it arrives.
   --------------------------------------------------------------------------- */
const ranges = {
  capexPerMW: band(economics.capexPerMW, 230 * HOURS * 1000, null, {
    basis: [
      'NREL\'s 2025 cost update puts a utility-scale four-hour system at $334/kWh installed, × 4,000 kWh/MW. The floor is the low end of reported US EPC pricing for four-hour LFP front-of-meter, $230/kWh post-tariff. The gap between US and global cost is policy rather than equipment — Section 301 duties on non-EV lithium-ion cells, reciprocal tariffs, and the domestic-content premium a project pays to qualify for the ITC adder — against roughly $90-130/kWh in China.',
      'NREL 2025年成本更新显示，公用事业级四小时系统安装成本为$334/kWh，乘以4,000 kWh/MW。下限取美国四小时LFP电网侧EPC报价区间的低端，即计入关税后的$230/kWh。美国与全球成本的差距源于政策而非设备 — 对非电动车用锂离子电池的301条款关税、对等关税，以及项目为符合ITC本土含量加成所支付的溢价 — 中国同类成本约为$90–130/kWh。',
    ],
    source: 'NREL, Cost Projections for Utility-Scale Battery Storage: 2025 Update; reported US EPC pricing for 4h LFP front-of-meter',
    gate: 'G15',
  }),

  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: [
      'No US operator, ISO or laboratory publishes a fixed opex figure for grid-scale storage — the same gap Germany and the NEM carry. $20,000/MW/yr is about 1.5% of the $1.336m installed cost and covers the long-term service agreement, insurance, land, property tax and PJM administrative charges. Property tax is the US-specific line inside it and varies by county across thirteen states, which is why no narrower claim is made.',
      '美国无任何运营商、独立系统运营机构或国家实验室公布电网级储能的固定运维成本 — 德国与NEM同样存在此缺口。每MW每年$20,000约为$133.6万安装成本的1.5%，涵盖长期服务协议、保险、土地、财产税及PJM管理费。其中财产税为美国特有项目，在十三个州内按县差异显著，故不作更精确的表述。',
    ],
    source: 'No published series; percentage-of-capex convention held constant with DE and the NEM',
    gate: 'G13',
  }),

  securedContracted: band(economics.securedContracted, economics.securedContracted, BRA_2728, {
    basis: [
      'The narrowest band on the platform, and narrow because this is the only capacity figure in the set that is a settled fact rather than an estimate. Both ends are cleared auctions with published storage accreditation: 2028/2029 at $325.00/MW-day × 59% and 2027/2028 at $333.44/MW-day × 58%, each × 365 days. Three consecutive auctions have cleared at the FERC-approved cap, so the band measures the cap\'s own step-down, not price discovery. What is uncertain about PJM capacity revenue is entirely in the years after this one.',
      '这是本平台最窄的区间，其原因在于：这是全样本中唯一属于既成事实而非估算的容量数值。两端均为已出清拍卖且储能核证系数均已公布：2028/2029年度为每MW每日$325.00×59%，2027/2028年度为$333.44×58%，各乘以365天。连续三次拍卖均以FERC批准的上限出清，因此该区间衡量的是上限本身的下调幅度，而非价格发现过程。PJM容量收入的不确定性完全存在于本年度之后的年份。',
    ],
    source: 'PJM 2028/2029 BRA (14 July 2026) and 2027/2028 BRA (December 2025) results; PJM ELCC class ratings for both delivery years',
  }),

  merchGross: band(economics.merchGross, Math.round(TB4_2024 * CAPTURE), 132000, {
    basis: [
      'PJM\'s published TB4 spread — the four highest hourly prices less the four lowest — captured at 0.88 round-trip efficiency × 0.97 availability × 0.85 imperfect foresight. The seed applies that to the 2025 fleet average of $69,375/MW/yr and the floor to 2024\'s $46,699/MW/yr, a year in which the spread was 49% lower. The ceiling is Modo\'s April 2026 fleet stack, which put real-time arbitrage at $11/kW-month; one month annualised is a ceiling rather than a basis, which is why the seed comes from a full calendar year of spread instead. Site matters more here than in any other market on this platform: 16 of the 20 highest-spread nodes are in northern Virginia and eastern Maryland, and 16 of the 20 lowest are in New Jersey.',
      '采用PJM公布的TB4价差 — 即最高四个小时电价减去最低四个小时 — 并按0.88往返效率×0.97可用率×0.85非完美预见性折算捕获率。种子值取2025年机组平均$69,375/MW/年，下限取2024年的$46,699/MW/年，当年价差低49%。上限取Modo 2026年4月机组收入结构中实时套利每kW每月$11的水平；单月年化只能作为上限而非基准，故种子值改用整个日历年的价差推导。此处选址的影响大于本平台任何其他市场：价差最高的20个节点中有16个位于弗吉尼亚北部与马里兰东部，最低的20个中有16个位于新泽西。',
    ],
    source: 'PJM TB4 spread, 2024 and 2025 fleet averages (Modo Energy); Modo PJM fleet revenue stack, April 2026',
  }),

  feePct: limits(economics.feePct, 3, 10, {
    kind: 'part-sourced',
    basis: [
      'No US optimiser fee is disclosed. PJM assets are more often self-scheduled by the owner or run under a shared-savings arrangement than on a flat percentage, so the band is the generic 3-10% revenue-share range reported for third-party optimisation rather than a US observation. 5% is the midpoint and is held equal to the NEM so that a cross-market comparison is not driven by an unobserved input.',
      '美国未披露任何优化商费率。PJM资产更多由业主自行调度或采用收益分成安排，而非固定百分比，因此该区间采用第三方优化服务公开的3–10%通用收益分成范围，而非美国实测值。5%为中值，并与NEM保持一致，以避免跨市场比较被未观测输入所驱动。',
    ],
    source: 'Generic third-party optimisation revenue-share band; no US disclosure',
  }),

  services: band(economics.services, REGULATION_FLOOR, REGULATION_OBSERVED, {
    basis: [
      'A saturation band, not a measurement band, and all three cases priced at the year-1 vintage the arbitrage leg beside it uses. BASE is $240,000/MW/yr at full assignment (Modo\'s twelve-hours-a-day worked example at June 2025\'s pre-spike $55/MW/h) divided by the ~3,000 MW competing in 2029 — the 400 MW operating today plus the 1.9 GW that took interconnection agreements in Transition Cycle 1. DOWNSIDE assumes the queue arrives faster and year 1 already faces 4,000 MW. UPSIDE is what the fleet earns TODAY — the observed $24/kW-month index read apart on the estimated 86% Regulation share, $247,680/MW/yr — which requires the queue to stall completely, and is here because it is the level a reader will have seen quoted elsewhere. What happens after year 1 is in `servicesCurve`, not in this band. The October 2025 redesign roughly doubled the requirement from 320 MW to 750 MW and that was a one-off; Phase 2 in October 2026 splits the signal into RegUp and RegDown rather than growing it. Regulation is power-based and must never be scaled by duration.',
      '这是饱和区间而非测量区间，且三种情形均按与其旁边套利收入项相同的第1年口径定价。基准情形为满额中标下每MW每年$240,000（取Modo每日十二小时示例，按2025年6月价格飙升前的$55/MW/h计），除以2029年约3,000MW的竞争机组 — 即当前在运的400MW加上过渡周期一中取得并网协议的1.9GW。下行情形假设排队产能到位更快、第1年即面对4,000MW。上行情形为机组当前的实际收入 — 按估算的86%调频占比拆解已观测的每kW每月$24指数，得每MW每年$247,680 — 该情形要求排队完全停滞，列出是因为读者可能在别处见过该数字。第1年之后的变化由`servicesCurve`承载，而非由本区间表达。2025年10月的市场重构将需求由320MW约增至750MW，属一次性调整；2026年10月的第二阶段是将信号拆分为上调与下调，而非扩大规模。调频为功率型服务，绝不可按时长放大。',
    ],
    source: 'PJM Regulation Redesign Phase 1 (1 October 2025) market size; Modo Energy PJM Regulation pricing and fleet build-out projections; FERC Electric Quarterly Reports Q1 2025 (86% share, estimated)',
    gate: 'G30',
  }),

  grantPct: limits(economics.grantPct, 0, 37, {
    kind: 'part-sourced',
    basis: [
      'The §48E investment tax credit, seeded at zero and editable here. Standalone storage qualifies at 30% of eligible basis on construction start through 2033; transferred credits clear at roughly 93 cents, so a sponsor monetising through the transfer market realises about 27.9%. The 37% ceiling adds the 10-point domestic-content adder on the same 0.93 basis. The floor is zero and it is not a soft floor: from 2026 the One Big Beautiful Bill Act\'s material-assistance rules deny the credit entirely to a project that fails the Material Assistance Cost Ratio, so FEOC exposure is a cliff rather than a reduction — and IRS Notice 2026-15 left the definition of a prohibited foreign entity and the ratio calculation to proposed regulations that had not issued at the seed date. The energy-community adder could stack a further 10 points and is deliberately not in this ceiling.',
      '§48E投资税收抵免，种子值设为零并可在此编辑。独立储能在2033年前开工可享受合格投资基础30%的抵免；转让市场成交价约为93美分，因此通过转让变现的投资人实际实现约27.9%。37%的上限在同一0.93基础上叠加10个百分点的本土含量加成。下限为零，且并非软下限：自2026年起，《大而美法案》的实质协助规则对未通过实质协助成本比率（MACR）的项目完全否定该抵免，因此FEOC敞口是断崖式而非递减式 — 且美国国税局2026-15号公告将受禁外国实体的定义与该比率的计算方式留待拟议法规解决，而截至种子日期该法规尚未发布。能源社区加成可再叠加10个百分点，已刻意不计入本上限。',
    ],
    source: 'IRC §48E; One Big Beautiful Bill Act material-assistance provisions; IRS Notice 2026-15',
    gate: 'G31',
  }),

  devCostPct: limits(economics.devCostPct, 0, 15, {
    basis: [
      'Development cost as a share of build capex — land, permitting, interconnection studies, legal and the queue deposit. Zero-seeded because published installed-cost benchmarks are EPC scope and already exclude it, so any non-zero value here is a new cost rather than a reallocation. The 15% ceiling is the upper end of what developers describe for a consented storage project.',
      '开发成本占建设造价的比例 — 土地、许可、并网研究、法务及排队保证金。种子值为零，因为公开的安装成本基准属EPC范围、本就不含开发成本，故此处任何非零值都是新增成本而非重新分配。15%上限为开发商对已获许可储能项目所述的上端水平。',
    ],
    source: 'No published series; bound set from developer commentary',
    gate: 'G25',
  }),

  rtbPremiumPct: limits(economics.rtbPremiumPct, 0, 200, {
    basis: [
      'The margin an RTB seller takes over its development cost. An RTB trade is a private bilateral and no market publishes either leg. The ceiling is deliberately wide, and wider still is defensible in PJM: a project holding Capacity Interconnection Rights and a completed cycle position is scarce against a 67 GW queue, and that scarcity is what the premium prices.',
      'RTB卖方在其开发成本之上收取的margin。RTB交易属私下双边交易，且没有市场公布其中任一部分。上限刻意设宽，在PJM甚至可以更宽：相对67GW的排队量，持有容量并网权且已完成周期流程的项目极为稀缺，而溢价所定价的正是这一稀缺性。',
    ],
    source: 'Never published, in any market',
    gate: 'G25',
  }),

  constructionMonths: limits(economics.constructionMonths, 9, 60, {
    basis: [
      'Notice to proceed through to commercial operation. Twelve months is one spend period and reproduces the single up-front outflow the model has always used. The ceiling is set by transformer supply rather than by construction: tier-1 HV power transformer lead times ran 2.5-5 years through 2026. Note that this field starts at NTP and therefore excludes the PJM interconnection queue entirely, which is the longer wait and is scored in the connection-risk table instead.',
      '自开工令至商业运行。12个月为单一支出期，可复现模型一贯采用的单笔前置支出。上限由变压器供应而非施工决定：2026年一线高压电力变压器交付周期为2.5–5年。请注意本字段自开工令起算，因此完全不含PJM并网排队时间 — 后者才是更漫长的等待，已在并网风险表中单独评分。',
    ],
    source: 'Transformer lead-time reporting, 2026; PJM interconnection timelines scored separately',
    gate: 'G26',
  }),

  degr: limits(economics.degr, 1, 4, {
    kind: 'dispersed',
    basis: [
      'No US operator or OEM publishes a measured degradation series. 2%/yr is the platform seed held constant across every market so that cross-market comparison is not driven by an unobserved input, and the band matches the NEM\'s. PJM is the market where the assumption bites hardest in an unusual direction: Regulation cycles a battery far harder than arbitrage does, so a PJM asset chasing the observed Regulation revenue degrades faster than this seed while earning it.',
      '美国无任何运营商或设备商公布实测衰减序列。每年2%为各市场统一的平台种子值，以避免跨市场比较被未观测输入所驱动，区间与NEM一致。PJM是该假设影响方式最特殊的市场：调频对电池的循环损耗远高于套利，因此追逐已观测调频收入的PJM资产，在赚取该收入的同时衰减速度将快于此种子值。',
    ],
    source: 'Platform seed; no US measured series',
    gate: 'G13',
  }),
};

export const comparison = {
  /* Capacity-backed, which is the default anyway — but PJM earns it. The
     2028/2029 auction paid $325.00/MW-day RTO-wide against a fleet whose merchant
     leg is a Regulation position that closes. The capacity line is the only part
     of this stack a lender can size against, and it lasts one year. */
  baseStrategy: 'cap',

  archetype: {
    /* PJM's reformed interconnection process, Transition Cycle 1: 21 battery
       projects took interconnection agreements totalling 1.9 GW. 1,900 ÷ 21 ≈ 90.
       A derived average of what actually cleared the queue, not a convention. */
    powerMW: 90,
    durationHours: HOURS,
  },

  score: {
    composite: COMPOSITE,
    connectionRisk: CONNECTION_RISK,
  },

  capabilities: {
    capacityMarket: true,       // RPM Base Residual Auction, one delivery year at a time
    merchant: true,             // nodal energy arbitrage
    ancillaryServices: true,    // Regulation, post-redesign single bidirectional signal
    /* No PJM battery tolling agreement has been located, at any price. ERCOT has
       ten announced tolls over 1.6 GW and PJM has no equivalent public market —
       PJM's own answer to long-term contracting is the bilateral large-load
       matching service it opened on 9 June 2026, which is not a toll. Declared
       false rather than zero: the route is absent, not worthless. */
    tolling: false,
    longTermAward: false,
  },

  economics,
  ranges,

  /* Both merchant legs priced at year 1: PJM capacity revenue is additive to
     merchant rather than a substitute for it, so merchant is exposed from
     commercial operation. See src/comparison/vintage.js. */
  merchantVintage: merchantVintage(1, economics, ranges, [
    'Year 1, because the capacity payment sits alongside merchant revenue rather than replacing it — unlike a toll, it leaves the merchant legs exposed from commercial operation. Both legs are stated at 2029 conditions on one set of forward assumptions: a Regulation requirement fixed at about 750 MW that Phase 2 splits rather than grows, a competing fleet of about 3,000 MW in 2029 rising to Modo\'s 7 GW ceiling, and a TB4 spread carried forward from calendar 2025 unchanged. That last one is deliberately conservative: PJM\'s spread rose 49% in a single year against a tightening reserve margin, so holding it flat understates the arbitrage leg rather than flattering it.',
    '第1年，因为容量收入与市场化收入并存而非取代后者 — 与租赁不同，它使市场化收入项自商业运行起即处于敞口状态。两个收入项均按2029年条件、基于同一套前瞻假设列示：调频需求固定在约750MW且第二阶段仅作拆分而非扩容，竞争机组由2029年约3,000MW升至Modo预计的7GW上限，TB4价差自2025日历年起保持不变延用。最后一项属刻意保守：PJM价差在备用率收紧的背景下一年内上涨49%，因此保持不变是低估而非高估套利收入项。',
  ]),

  narrative: {
    archetype: ['90 MW · 4h · RTO-wide capacity', '90MW · 4小时 · 全RTO容量'],
    thesis: [
      'The best-published contracted revenue on the platform, and it lasts one year. PJM prints both halves of the capacity payment — $325.00/MW-day at a 59% four-hour accreditation — so there is nothing to estimate about year one and nothing settled about years two to fifteen, where a price collar lifts and an accreditation factor erodes in opposite directions. The merchant leg is the trap: the observed fleet earns Regulation revenue an order of magnitude above what this model publishes, because 400 MW is competing for a 750 MW requirement and 67 GW is in the queue behind it.',
      '本平台披露最完整的合同化收入 — 而它只持续一年。PJM同时公布了容量收入的两个组成部分 — 每MW每日$325.00与四小时59%的核证系数 — 因此第一年没有任何需要估算之处，而第二至十五年则没有任何确定之处：价格上限将上移，核证系数将下降，二者方向相反。真正的陷阱在市场化收入端：已观测机组的调频收入比本模型所发布的高出一个数量级，因为当前仅400MW在争夺750MW的系统需求，而其身后还有67GW在排队。',
    ],
    /* 67 GW of storage in the reopened queue against ~400 MW operating. The ratio
       is quoted against the ~5 GW expected operating by 2030 rather than against
       today's fleet, which would give a meaningless ~168×. */
    pipelineRatio: '~13×',
  },
};

export default comparison;
