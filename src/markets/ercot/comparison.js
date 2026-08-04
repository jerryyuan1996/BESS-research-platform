/* ---------------------------------------------------------------------------
   ERCOT. Comparison interface.
   Economics are per MW per year, in USD.

   THE PLATFORM'S SECOND US MARKET, AND PJM'S OPPOSITE ON EVERY AXIS.

   PJM pays a published capacity price and makes a project wait eight years to
   connect. ERCOT pays nothing for capacity and connects in about four years at
   minimal cost. One publishes both halves of its contracted revenue; the other
   has no contracted revenue to publish and answers with private tolls whose
   prices are, in the words of the market itself, almost universally confidential.

   THIS ARCHETYPE IS TWO HOURS, AND THAT IS THE MOST CONSEQUENTIAL LINE HERE.

   Every other market on this platform is modelled at four hours or more. ERCOT
   is modelled at two because two hours is what ERCOT actually builds: the fleet
   averages about 1.6 hours, roughly 97% of the storage in ERCOT's own 2026
   planning scenario is one- and two-hour systems, and two-hour remains the
   merchant default. Modelling a four-hour ERCOT battery would produce a market
   that does not exist, which is the same reasoning that puts Japan at six hours.

   The consequence runs through everything below. Capex is re-assembled at two
   hours rather than quoted at four; the revenue index is scaled from a 1.6-hour
   fleet rather than a 2.4-hour one; and the duration tab carries the 2h-to-4h
   transition as the live question it is, with named four-hour projects — Eolian's
   Ferdinand at 200 MW / 800 MWh and Padua 2 at 150 MW / 600 MWh — arriving in
   2026 against a fleet that is still overwhelmingly shorter.

   THE MERCHANT LEG HAS COLLAPSED, AND THE TOLL MARKET DISAGREES WITH IT.

   Modo's ME BESS ERCOT index ran $193/kW/yr in 2023, $56/kW in 2024 and about
   $29.4/kW in 2025 — a fall of roughly 85% in two years, driven by a fleet that
   went from 5.3 GW to 14 GW and by ancillary services saturating out from 84% of
   battery revenue to 48%.

   And yet published two-hour toll values sat at $7.52/kW-month in August 2025,
   which annualises to about $90,240/MW/yr — roughly three times the realised
   index. A toll must clear BELOW risk-adjusted expected merchant revenue, so the
   offtakers signing those contracts expect substantially more than 2025
   delivered. This model does not resolve that disagreement. It seeds from the
   realised index, carries the toll value as the merchant band ceiling because it
   is a lower bound on somebody's expected merchant revenue, and says so.

   BASE STRATEGY IS THE TOLL, NOT MERCHANT.

   The engine would default to merchant here, because ERCOT has no capacity
   market. That default would be wrong for the same reason it is wrong in the
   NEM: it is not how an ERCOT battery reaching financial close in 2026 is
   actually contracted. Ten tolling agreements covering about 1.6 GW had been
   announced by September 2025, twelve tolled batteries are known, five are
   operating and seven more were expected online by the end of 2026. The merchant
   case remains one click away on the frontier and in the Lab.
   --------------------------------------------------------------------------- */
import { band, limits } from '../../comparison/ranges.js';
import { stackFrom } from '../../comparison/capex.js';
import { merchantVintage } from '../../comparison/vintage.js';
import { COMPOSITE, CONNECTION_RISK } from './scores.js';

/* ---------------------------------------------------------------------------
   CAPEX AT TWO HOURS, FROM A FOUR-HOUR BENCHMARK.

   NREL publishes $334/kWh installed for a utility-scale FOUR-hour system, and no
   two-hour US figure was located. Quoting the four-hour rate at two hours would
   understate the cost badly, because the power-scaling half of a battery — PCS,
   transformer, balance of plant — does not shrink when the energy does.

   So the published total is decomposed on the platform's own capex-stack shares
   (56% energy-scaling, 44% power-scaling, src/comparison/capex.js) and
   re-assembled at two hours:

     energy   0.56 × $1,336,000 / 4,000 kWh = $187.04/kWh
     power    0.44 × $1,336,000            = $587,840/MW
     2h total 2,000 × 187.04 + 587,840     = $961,920/MW  ($480.96/kWh)

   That implies a 44% per-kWh premium for halving the duration, which is the same
   order as the two published two-versus-four pairs on this platform: CSIRO's
   GenCost gives 36% and Modo's German figures give 50%. The derivation is stated
   rather than buried because every ERCOT return depends on it. */
const CAPEX_4H_PER_KWH = 334;
const CAPEX_4H_PER_MW = CAPEX_4H_PER_KWH * 4 * 1000;      // $1,336,000
const ENERGY_SHARE = 0.56, POWER_SHARE = 0.44;
const ENERGY_PER_KWH = CAPEX_4H_PER_MW * ENERGY_SHARE / 4000;   // $187.04
const POWER_PER_MW = CAPEX_4H_PER_MW * POWER_SHARE;             // $587,840

const HOURS = 2;
const capexAt = (hours, per4hKWh) => {
  const total4h = per4hKWh * 4 * 1000;
  return Math.round(hours * 1000 * (total4h * ENERGY_SHARE / 4000) + total4h * POWER_SHARE);
};
const CAPEX_TOTAL_PER_MW = capexAt(HOURS, CAPEX_4H_PER_KWH);    // $961,920

/* The floor applies the identical decomposition to the low end of reported US
   EPC pricing for four-hour LFP front-of-meter, $230/kWh post-tariff. */
const CAPEX_FLOOR_PER_MW = capexAt(HOURS, 230);                 // $662,400

/* ---------------------------------------------------------------------------
   THE MERCHANT VINTAGE — year 8, and why both legs are priced there.

   ERCOT is tolled for seven years, so years 1-7 pay the owner a fixed fee and no
   merchant revenue at all. The first year the merchant assumption actually
   reaches the owner is year 8, and both legs are therefore stated at year 8
   rather than one at CY2025 actual and the other at a 2030 projection. See
   src/comparison/vintage.js for the rule; this market is the reason it exists.

   The three cases below are built on one common set of forward assumptions:

     cannibalisation  the fleet goes from 14 GW entering 2026 to about 40 GW by
                      end-2030 and is still growing into the vintage year
     demand           a large-load queue of about 238.6 GW, 77.5% data centres,
                      is the only thing that can push the other way — and it is a
                      queue, not a commitment
     market design    RTC+B has been live since December 2025; dispatch improves,
                      and the shortened duration requirements widen the ancillary
                      competition
     scarcity         the ORDC is unchanged and the offer cap is where Uri left
                      it, so the scarcity ceiling is a policy constant

   CY2025 IS THE DOWNSIDE, NOT THE BASE. The observed calendar year is preserved
   as the trough-repeating case. The multi-year record — $193k in 2023, $56k in
   2024, $29.4k in 2025 — is a validation band: a case outside it needs revisiting
   rather than publishing.
   --------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
   THE REVENUE INDEX, READ APART.

   Modo's ME BESS ERCOT index is a single blended number across a fleet averaging
   about 1.6 hours, and its two halves behave completely differently — the same
   split PJM needs, for a different reason. In PJM the saturating leg is
   Regulation. Here it is the whole ancillary stack, and it is further along:
   ERCOT ancillary revenue has fallen about 90% since 2023 and its share of
   battery income went from 84% to 48% over the same period.

   CY2025 is the seed year. It is the most recent complete calendar year and the
   platform's rule is that a fifteen-year model takes a full year rather than a
   month — but it should be read knowing 2025 was a documented trough, with none
   of the extreme weather that produces ERCOT scarcity pricing. */
const INDEX_2025 = 29400;          // $/MW/yr, Modo ME BESS ERCOT, CY2025
const INDEX_2024 = 56000;
const AS_SHARE_2025 = 0.48;        // fell from 0.84 in 2023

const AS_2025 = Math.round(INDEX_2025 * AS_SHARE_2025);            // 14,112
const ENERGY_2025 = INDEX_2025 - AS_2025;                          // 15,288

/* Scaling the energy leg from the 1.6-hour fleet the index measures to the
   two-hour archetype. The 0.95 capture penalty is the same one the NEM applies
   when it scales its own fleet index to a longer duration: a longer asset
   reaches further into a shallower part of the price stack. */
const FLEET_HOURS = 1.6;
const DURATION_CAPTURE = 0.95;
/* CY2025 at the two-hour archetype. This is the DOWNSIDE case — the observed
   trough repeating — not the seed. */
const ENERGY_2H_OBSERVED = Math.round(ENERGY_2025 * (HOURS / FLEET_HOURS) * DURATION_CAPTURE);   // 18,155

/* ---------------------------------------------------------------------------
   THE UPSIDE, AND THE CROSS-CHECK THAT MAKES IT MORE THAN AN OPINION.

   An energy-only market has one long-run attractor: revenue tends toward the
   level that supports new entry, because below it entry stops and above it entry
   resumes. ERCOT buildout is already decelerating, which is that mechanism
   working. So the entry-supporting revenue is the right upside anchor.

     capex $961,920/MW, 20-year life at 8% (annuity factor 0.101852)
       = $97,973/yr, plus $20,000 opex          = $117,973/yr with no tax credit
     the same at the §48E credit net of transfer (30% × 0.93 = 27.9%)
       capex $693,745 → $70,660/yr, plus opex   = $90,660/yr

   The published two-hour TB2 toll value is $90,240/MW/yr. It lands within 0.5%
   of the entry-supporting revenue for an ITC-BEARING project, from a completely
   independent direction — one is a transacted contract price, the other is an
   annuity on a laboratory capex benchmark.

   Two things follow, and both matter more than the number itself. The toll value
   is corroborated rather than merely quoted. And the transacted price plainly
   assumes the tax credit, which is why a model that seeds `grantPct` at zero
   shows this asset failing to return its capital: the market is not pricing the
   same project this dashboard publishes. */
const ANNUITY_20Y_8PCT = 0.101852;
const ENTRY_SUPPORTING_NO_ITC = Math.round(CAPEX_TOTAL_PER_MW * ANNUITY_20Y_8PCT) + 20000;
const ENTRY_SUPPORTING_WITH_ITC =
  Math.round(CAPEX_TOTAL_PER_MW * (1 - 0.279) * ANNUITY_20Y_8PCT) + 20000;

/* ---------------------------------------------------------------------------
   THE THREE CASES, ALL AT YEAR 8.

   Ancillary first, because it is the more constrained leg and it sets what is
   left for arbitrage to be.

     downside  the fleet overshoots to 50 GW against a fixed requirement
     base      the published ~40 GW by end-2030, still growing into year 8
     upside    the 2025 level persists — which requires ERCOT to RAISE the
               ancillary quantity, and the methodology does allow that because
               the quantity follows system need, and system need rises with
               renewable penetration

   Arbitrage takes the residual against the upside anchor, and the base is the
   GEOMETRIC mean of its own downside and upside rather than the arithmetic one.
   That is deliberate: this series moved 85% in two years, which is a
   multiplicative process, and an arithmetic midpoint of a variable that behaves
   multiplicatively sits too close to the top. Gate G32 — it is the weakest
   input on this page and the one most worth arguing with. */
const geo = (a, b) => Math.round(Math.sqrt(a * b));

const AS_UPSIDE = AS_2025;                                            // 14,112
const AS_DOWNSIDE = Math.round(AS_2025 * 14000 / 50000);              // 3,951
const AS_BASE = geo(AS_DOWNSIDE, AS_UPSIDE);                          // 7,467

const ENERGY_UPSIDE = ENTRY_SUPPORTING_WITH_ITC - AS_UPSIDE;          // ≈ 76,548
const ENERGY_DOWNSIDE = ENERGY_2H_OBSERVED;                           // 18,155
const ENERGY_BASE = geo(ENERGY_DOWNSIDE, ENERGY_UPSIDE);

/* ---------------------------------------------------------------------------
   ANCILLARY SERVICES, FORWARD — the same construction PJM uses.

   ERCOT sets its ancillary quantities through an annual methodology driven by
   system need, not by how much storage exists. The quantity does not grow with
   the fleet, and the fleet is growing fast: 14 GW entering 2026 against a
   projection of about 40 GW operating by the end of 2030.

   RTC+B makes this worse rather than better for an incumbent. Since 5 December
   2025 ancillary services clear in real time alongside energy, and the duration
   requirements fell — ECRS from two hours to one, RRS and Regulation from one
   hour to thirty minutes. A shorter requirement means MORE of the fleet
   qualifies, so the fleet ratios below are if anything generous. */
const FLEET_2026_MW = 14000;
const FLEET_2030_MW = 40000;

/* ---------------------------------------------------------------------------
   THE TOLL — a real market with no published price.

   Ten tolling agreements covering about 1.6 GW had been announced by September
   2025; twelve tolled batteries are known, five operating and seven more due by
   the end of 2026. Named deals include Jupiter Power's Crossett 1 with
   Equilibrium Energy, Eolian's Padua 1, Padua 2 and Ferdinand with CPS Energy,
   Energy Vault's Cross Trails, and Ormat's Lower Rio.

   None of them published a price. The only two-hour-specific published figure is
   a TB2 toll value of $7.52/kW-month in August 2025, down 10% from $8.34 as the
   arbitrage window narrowed — $90,240/MW/yr. The broader US band of $8-20/kW-month
   is quoted for FOUR-hour systems and is not directly comparable. */
const TOLL_PER_MW_YR = Math.round(7.52 * 12 * 1000);        // 90,240
const TOLL_CEILING = Math.round(8.34 * 12 * 1000);          // 100,080
const TOLL_FLOOR = Math.round(6.00 * 12 * 1000);            // 72,000

const economics = {
  capexPerMW: CAPEX_TOTAL_PER_MW,
  capexStack: stackFrom(CAPEX_TOTAL_PER_MW, HOURS),

  /* No US value-added tax. Texas exempts most equipment used in electricity
     generation from sales tax, but the treatment of standalone storage is not
     settled in a source this platform could cite, so nothing is modelled here
     and the Data & Methodology tab says so. Gate G29. */
  vatPct: 0, vatRecoverable: true, vatLagMonths: 0,
  devCostPct: 0, rtbPremiumPct: 0,
  constructionMonths: 12,

  /* Held equal to PJM and the NEM so that a cross-market comparison is not
     driven by an unobserved input. The Texas-specific line inside it is property
     tax, which changed materially when Chapter 313 school-district abatements
     lapsed at the end of 2022 — see notPublished on the dashboard. */
  opexPerMW: 20000,

  /* ERCOT is energy-only. There is no capacity mechanism, no forward capacity
     auction and no scarcity payment other than the ORDC adder inside the energy
     price itself — which is already in the merchant line. This is a genuine
     zero, declared the same way Romania and the NEM declare theirs. */
  contracted: 0,
  contractYears: 0,
  postFactor: 0,

  /* Both legs at the year-8 vintage. See the merchant-vintage note above and
     src/comparison/vintage.js.

     Degradation is NOT already inside these figures. The vintage year fixes the
     MARKET conditions being priced; the engine then applies the asset's own
     fade, so year 8 settles at these levels × 0.98^7. Market ageing and asset
     ageing are different things and the model keeps them apart. */
  merchGross: ENERGY_BASE,
  feePct: 5,
  services: AS_BASE,

  /* Seeded at zero and editable in the home-page Investment Lab, exactly as PJM
     does it. See ranges.grantPct for the §48E derivation and the FEOC cliff. */
  grantPct: 0,
  degr: 2,

  toll: TOLL_PER_MW_YR,
  /* Crossett 1, the first known ERCOT toll (Jupiter Power / Equilibrium Energy),
     ran seven years. Reported ERCOT toll terms span 7-20 years. Seven against a
     fifteen-year window leaves an eight-year merchant tail, and that tail is
     where this market's risk actually sits. */
  tollYears: 7,
  tollRevertsToMerchant: true,

  capNote: [
    'ERCOT has no capacity mechanism. It is energy-only with scarcity pricing through the ORDC, and the Public Utility Commission has repeatedly declined to build one.',
    'ERCOT没有容量机制。它是纯电能量市场，通过运行备用需求曲线（ORDC）实现稀缺定价，且公用事业委员会多次拒绝建立容量机制。',
  ],
  tollNote: [
    '7-yr precedent tenor (Jupiter Power / Equilibrium Energy, Crossett 1); reported ERCOT terms run 7-20 years and no ERCOT toll price has been disclosed',
    '先例期限7年（Jupiter Power与Equilibrium Energy，Crossett 1项目）；已报道的ERCOT期限为7–20年，且从未披露过任何ERCOT租赁价格',
  ],
};

/* ---------------------------------------------------------------------------
   Bounds for the Investment Lab. Rules in src/comparison/ranges.js.

   The merchant band here is the widest on the platform relative to its seed, and
   unlike the NEM's — which is wide because realised revenue moved five-fold — it
   is wide because two credible sources disagree about the same asset today. The
   realised index says $18k; the transacted toll market prices the same two-hour
   arbitrage at $90k. Both ends are observations.
   --------------------------------------------------------------------------- */
const ranges = {
  capexPerMW: band(economics.capexPerMW, CAPEX_FLOOR_PER_MW, null, {
    basis: [
      'NREL\'s 2025 cost update publishes $334/kWh installed for a utility-scale FOUR-hour system and no two-hour US figure was located, so the total is decomposed on the platform\'s capex-stack shares — 56% energy-scaling, 44% power-scaling — and re-assembled at two hours: 2,000 kWh × $187.04 + $587,840 = $961,920/MW, or $480.96/kWh. The floor applies the identical decomposition to the low end of reported US EPC pricing for four-hour LFP front-of-meter, $230/kWh post-tariff. The implied 44% per-kWh premium for halving duration sits between the two published two-versus-four pairs on this platform: GenCost gives 36% and Modo\'s German figures give 50%.',
      'NREL 2025年成本更新公布的是公用事业级四小时系统每kWh $334的安装成本，且未找到美国两小时系统的数据，因此按本平台资本开支结构占比 — 能量型56%、功率型44% — 拆解总额并在两小时口径下重组：2,000kWh × $187.04 + $587,840 = 每MW $961,920，即每kWh $480.96。下限对美国四小时LFP电网侧EPC报价低端（计入关税后每kWh $230）采用完全相同的拆解方式。时长减半所隐含的每kWh 44%溢价，介于本平台两组已公布的二对四小时数据之间：GenCost为36%，Modo的德国数据为50%。',
    ],
    source: 'NREL, Cost Projections for Utility-Scale Battery Storage: 2025 Update (4h basis); reported US EPC pricing for 4h LFP front-of-meter',
    gate: 'G15',
  }),

  opexPerMW: band(economics.opexPerMW, null, null, {
    basis: [
      'No US operator, ISO or laboratory publishes a fixed opex figure for grid-scale storage. $20,000/MW/yr is held equal to PJM and the NEM so that cross-market comparison is not driven by an unobserved input. The Texas-specific component inside it is property tax: Chapter 313 school-district value-limitation agreements lapsed at the end of 2022 and the successor programme does not cover standalone storage on the same terms, so a Texas project commissioning now carries a property-tax burden that pre-2023 comparables did not.',
      '美国无任何运营商、独立系统运营机构或实验室公布电网级储能的固定运维成本。每MW每年$20,000与PJM及NEM保持一致，以避免跨市场比较被未观测输入所驱动。其中德州特有的成分是财产税：第313章学区估值限制协议已于2022年底失效，且后续项目未以同等条件覆盖独立储能，因此当前投运的德州项目所承担的财产税负担高于2023年前的可比项目。',
    ],
    source: 'No published series; Texas Chapter 313 expiry, 31 December 2022',
    gate: 'G13',
  }),

  merchGross: band(economics.merchGross, ENERGY_DOWNSIDE, ENERGY_UPSIDE, {
    basis: [
      'Three cases, all priced at year 8 — the first year the toll stops paying and merchant revenue reaches the owner. DOWNSIDE is calendar 2025 repeating: the energy half of Modo\'s ME BESS ERCOT index, $29,400/MW/yr less the 48% ancillary share, scaled from the 1.6-hour fleet the index measures to the two-hour archetype at a 0.95 capture penalty — 15,288 × (2 / 1.6) × 0.95 = $18,155. UPSIDE is the entry-supporting revenue an energy-only market tends toward, less the ancillary upside: capex $961,920 annuitised over twenty years at 8% with the §48E credit at 27.9% net of transfer, plus $20,000 opex, is $90,660/yr — which lands within 0.5% of the published two-hour TB2 toll value of $90,240/MW/yr from a completely independent direction. BASE is the geometric mean of the two, because a series that moved 85% in two years behaves multiplicatively and an arithmetic midpoint would sit too close to the top. Validation band, not cases: the index was $56,000 in 2024 and $193,000 in 2023, and Enverus independently puts 2025 at $17,000 against Modo\'s $29,400.',
      '三种情形均按第8年定价 — 即租赁停止支付、市场化收入开始归属业主的首个年度。下行情形为2025日历年重现：取Modo ME BESS ERCOT指数的电能量部分（每MW每年$29,400减去48%辅助服务占比），并按0.95捕获折减从该指数所测量的1.6小时机组折算至两小时原型 — 15,288 × (2 ÷ 1.6) × 0.95 = $18,155。上行情形为纯电能量市场所趋向的支持新增进入的收入水平，扣除辅助服务上行部分：造价$961,920按二十年8%年金化，并计入按转让净额计算的27.9% §48E抵免，加上$20,000运维成本，得每年$90,660 — 该数值与已公布的两小时TB2租赁价值每MW每年$90,240相差不到0.5%，而两者来自完全独立的推导方向。基准情形取二者的几何平均，因为一个两年内变动85%的序列呈乘性变化，算术中值将过于接近上限。作为验证区间而非情形：该指数2024年为$56,000，2023年为$193,000；Enverus独立测算2025年为$17,000，而Modo为$29,400。',
    ],
    source: 'Modo Energy ME BESS ERCOT Index CY2023-CY2025; published TB2 toll value August 2025; NREL capex annuitised; Enverus ERCOT revenue estimate',
    gate: 'G32',
  }),

  feePct: limits(economics.feePct, 3, 10, {
    kind: 'part-sourced',
    basis: [
      'No US optimiser fee is disclosed. ERCOT has the deepest third-party optimisation market in the US — Gridmatic, Habitat Energy, Equilibrium Energy and Tesla all optimise named assets — and not one fee percentage has been published. The band is the generic 3-10% revenue-share range and 5% is the midpoint, held equal to PJM and the NEM.',
      '美国未披露任何优化商费率。ERCOT拥有美国最深的第三方优化服务市场 — Gridmatic、Habitat Energy、Equilibrium Energy与特斯拉均为具名资产提供优化服务 — 但无一费率被公布。该区间采用通用的3–10%收益分成范围，5%为中值，并与PJM及NEM保持一致。',
    ],
    source: 'Generic third-party optimisation revenue-share band; no ERCOT disclosure',
  }),

  services: band(economics.services, AS_DOWNSIDE, AS_UPSIDE, {
    basis: [
      'A saturation band built the same way PJM\'s is, and priced at the same year-8 vintage as the arbitrage leg beside it. The UPSIDE is what the fleet earned in calendar 2025 — 48% of the $29,400 index, $14,112/MW/yr — and it is an upside rather than a given, because holding it requires ERCOT to RAISE the ancillary quantity; the methodology permits that, since quantities follow system need and system need rises with renewable penetration. The DOWNSIDE takes a 50 GW fleet against the same fixed requirement and the BASE the published ~40 GW by end-2030, both scaled from the 14 GW entering 2026. RTC+B makes the ratio generous rather than harsh: since 5 December 2025 ancillary services clear in real time alongside energy and the duration requirements fell — ECRS from two hours to one, RRS and Regulation from one hour to thirty minutes — so a larger share of a shorter-duration fleet can now compete for the same quantity. For scale, the ancillary share of ERCOT battery revenue was 84% in 2023 and ancillary revenue has fallen about 90% since; this line is late in a decline, not at the start of one.',
      '该饱和区间的构建方式与PJM相同：由系统需求确定的辅助服务量，除以不受其影响而持续增长的机组规模。上限为机组在2025日历年的实际收入 — $29,400指数的48%，即每MW每年$14,112。种子值按2026年初的14GW与2030年底预计在运约40GW折算；下限按50GW计。RTC+B使该比率偏于宽松而非严苛：自2025年12月5日起，辅助服务与电能量在实时市场同时出清，且时长要求下调 — ECRS由两小时降至一小时，RRS与调频由一小时降至三十分钟 — 因此更大比例的短时长机组现可参与同一采购量的竞争。作为参照，2023年辅助服务占ERCOT储能收入的84%，其后辅助服务收入已下跌约90%；该收入项处于下行的后段，而非起点。',
    ],
    source: 'Modo Energy ME BESS ERCOT Index; ERCOT 2026 Ancillary Service Methodology; ERCOT RTC+B go-live 5 December 2025; Modo ERCOT buildout projection to 2030',
    gate: 'G30',
  }),

  toll: band(economics.toll, TOLL_FLOOR, TOLL_CEILING, {
    basis: [
      'No ERCOT toll price has ever been disclosed — not for Crossett 1, the Padua or Ferdinand assets, Cross Trails, Lower Rio, or any of the ten agreements announced by September 2025. The seed is the only two-hour-specific published figure found: a TB2 toll value of $7.52/kW-month in August 2025, $90,240/MW/yr. The ceiling is the same series three months earlier at $8.34/kW-month, before a 10% fall driven by a narrowing arbitrage window; the floor extends that rate of decline for a further year. The broader US toll band of $8-20/kW-month is quoted for FOUR-hour systems and is deliberately not used here.',
      'ERCOT从未披露过任何租赁价格 — Crossett 1、Padua与Ferdinand项目、Cross Trails、Lower Rio，以及截至2025年9月公布的十份协议，均无价格披露。种子值为所找到的唯一两小时口径公开数据：2025年8月的TB2租赁价值每kW每月$7.52，即每MW每年$90,240。上限为同一序列三个月前的每kW每月$8.34，此后因套利窗口收窄而下跌10%；下限则将该跌幅速率再延续一年。更宽泛的美国租赁区间每kW每月$8–20系针对四小时系统的报价，此处刻意不予采用。',
    ],
    source: 'Published TB2 toll value, May and August 2025; ten announced ERCOT tolling agreements (prices undisclosed)',
    gate: 'G16',
  }),

  tollYears: limits(economics.tollYears, 7, 20, {
    kind: 'part-sourced',
    basis: [
      'The low end is observed: Crossett 1, the first known tolled battery in ERCOT, runs seven years under an offtake with Equilibrium Energy. The high end is the top of the reported range for ERCOT toll terms. No individual term other than Crossett 1\'s has been confirmed, so the band is one observation and a reported range rather than two observations.',
      '下限为实测值：ERCOT首个已知的租赁储能项目Crossett 1，在与Equilibrium Energy的承购协议下期限为七年。上限为已报道的ERCOT租赁期限范围顶端。除Crossett 1外，没有任何单笔期限得到确认，因此该区间由一个观测值与一个报道区间构成，而非两个观测值。',
    ],
    source: 'Jupiter Power / Equilibrium Energy, Crossett 1; reported ERCOT toll term range',
    gate: 'G16',
  }),

  grantPct: limits(economics.grantPct, 0, 37, {
    kind: 'part-sourced',
    basis: [
      'The §48E investment tax credit, seeded at zero and editable here. Standalone storage qualifies at 30% of eligible basis on construction start through 2033; transferred credits clear at roughly 93 cents, so a sponsor monetising through the transfer market realises about 27.9%. The 37% ceiling adds the 10-point domestic-content adder on the same basis. The floor is zero and it is not a soft floor: from 2026 the One Big Beautiful Bill Act\'s material-assistance rules deny the credit entirely to a project that fails the Material Assistance Cost Ratio, and IRS Notice 2026-15 left both the prohibited-entity definition and the ratio calculation to proposed regulations that had not issued at the seed date. This is federal and is identical across every US market on this platform.',
      '§48E投资税收抵免，种子值设为零并可在此编辑。独立储能在2033年前开工可享受合格投资基础30%的抵免；转让市场成交价约为93美分，因此通过转让变现的投资人实际实现约27.9%。37%的上限在同一基础上叠加10个百分点的本土含量加成。下限为零，且并非软下限：自2026年起，《大而美法案》的实质协助规则对未通过实质协助成本比率的项目完全否定该抵免，且美国国税局2026-15号公告将受禁实体定义与比率计算方式均留待拟议法规解决，而截至种子日期该法规尚未发布。该项属联邦层面规定，在本平台所有美国市场中完全一致。',
    ],
    source: 'IRC §48E; One Big Beautiful Bill Act material-assistance provisions; IRS Notice 2026-15',
    gate: 'G31',
  }),

  devCostPct: limits(economics.devCostPct, 0, 15, {
    basis: [
      'Development cost as a share of build capex — land, permitting, interconnection studies and legal. Zero-seeded because published installed-cost benchmarks are EPC scope and already exclude it. The ceiling is the upper end of what developers describe for a consented storage project, and ERCOT sits at the low end of it in practice: interconnection studies are faster and cheaper here than anywhere else in the US.',
      '开发成本占建设造价的比例 — 土地、许可、并网研究及法务。种子值为零，因为公开的安装成本基准属EPC范围、本就不含开发成本。上限为开发商对已获许可储能项目所述的上端水平，而ERCOT在实践中处于该区间低端：此处的并网研究比美国其他任何地区都更快、更便宜。',
    ],
    source: 'No published series; bound set from developer commentary',
    gate: 'G25',
  }),

  rtbPremiumPct: limits(economics.rtbPremiumPct, 0, 200, {
    basis: [
      'The margin an RTB seller takes over its development cost. An RTB trade is a private bilateral and no market publishes either leg. ERCOT should sit toward the LOW end of this range for the same reason its connection risk is the lowest on the platform: a queue position is not scarce here, so it commands less of a premium than the equivalent position in PJM.',
      'RTB卖方在其开发成本之上收取的margin。RTB交易属私下双边交易，且没有市场公布其中任一部分。ERCOT应处于该区间低端，其原因与其并网风险为本平台最低相同：此处的排队位置并不稀缺，因而其溢价低于PJM同等位置。',
    ],
    source: 'Never published, in any market',
    gate: 'G25',
  }),

  constructionMonths: limits(economics.constructionMonths, 9, 60, {
    basis: [
      'Notice to proceed through to commercial operation. Twelve months is one spend period and reproduces the single up-front outflow the model has always used. The ceiling is set by transformer supply rather than by construction: tier-1 HV power transformer lead times ran 2.5-5 years through 2026. Note that this field starts at NTP and excludes the interconnection process, which in ERCOT runs about 4.2 years — the fastest in the US and roughly half PJM\'s.',
      '自开工令至商业运行。12个月为单一支出期，可复现模型一贯采用的单笔前置支出。上限由变压器供应而非施工决定：2026年一线高压电力变压器交付周期为2.5–5年。请注意本字段自开工令起算，不含并网流程 — ERCOT的并网流程约为4.2年，为美国最快，约为PJM的一半。',
    ],
    source: 'Transformer lead-time reporting, 2026; ERCOT interconnection timelines reported at ~4.2 years',
    gate: 'G26',
  }),

  degr: limits(economics.degr, 1, 4, {
    kind: 'dispersed',
    basis: [
      'No US operator or OEM publishes a measured degradation series. 2%/yr is the platform seed held constant across every market so that cross-market comparison is not driven by an unobserved input. ERCOT is the market where the assumption is least conservative: a two-hour asset chasing ancillary services and intraday spreads cycles harder per MWh of installed energy than a four-hour asset does, and the fleet\'s 1.6-hour average means most ERCOT batteries are in that position.',
      '美国无任何运营商或设备商公布实测衰减序列。每年2%为各市场统一的平台种子值，以避免跨市场比较被未观测输入所驱动。ERCOT是该假设最不保守的市场：追逐辅助服务与日内价差的两小时资产，其单位装机电量的循环强度高于四小时资产，而该市场1.6小时的机组平均时长意味着多数ERCOT储能正处于这一状态。',
    ],
    source: 'Platform seed; no US measured series',
    gate: 'G13',
  }),
};

export const comparison = {
  /* The toll, not merchant. Without an explicit base the engine would fall back
     to merchant because ERCOT has no capacity market — and merchant is not how
     an ERCOT battery reaching financial close in 2026 is actually contracted.
     Twelve tolled batteries are known, five operating and seven more due by the
     end of 2026. Same reasoning, and the same override, as the NEM. */
  baseStrategy: 'toll',

  archetype: {
    /* A modelling convention, stated as one — no published average ERCOT
       grid-scale project size was located. For scale, the named four-hour builds
       arriving in 2026 are larger: Ferdinand at 200 MW and Padua 2 at 150 MW. */
    powerMW: 100,
    durationHours: HOURS,
  },

  score: {
    composite: COMPOSITE,
    connectionRisk: CONNECTION_RISK,
  },

  capabilities: {
    /* The flag that defines this market. ERCOT is energy-only, prices scarcity
       through the ORDC rather than through a capacity product, and the Public
       Utility Commission has repeatedly declined to build a mechanism. */
    capacityMarket: false,
    merchant: true,
    ancillaryServices: true,
    tolling: true,
    longTermAward: false,
  },

  economics,
  ranges,

  /* Both merchant legs priced at year 8. This market is the reason the rule
     exists — see src/comparison/vintage.js. */
  merchantVintage: merchantVintage(economics.tollYears + 1, economics, ranges, [
    'Year 8, the first year the seven-year toll stops paying and merchant revenue reaches the owner. Pricing either leg at calendar 2025 would price a cash flow that goes to the offtaker, not the owner. Both legs move together on one set of forward assumptions: a fleet going from 14 GW to about 40 GW by end-2030 and still growing, a large-load queue of about 238.6 GW that is applied for rather than committed, RTC+B live since December 2025, and an ORDC left where Uri put it.',
    '第8年，即七年租赁停止支付、市场化收入开始归属业主的首个年度。若按2025日历年为任一收入项定价，所定价的现金流实际归承购方而非业主所有。两个收入项基于同一套前瞻假设同步变动：机组规模由14GW增至2030年底约40GW且仍在增长，约238.6GW的大负荷仅处于申请而非承诺状态，RTC+B自2025年12月起运行，以及Uri风暴后未再变动的ORDC。',
  ]),

  narrative: {
    archetype: ['100 MW · 2h · toll-led', '100MW · 2小时 · 租赁主导'],
    thesis: [
      'The fastest market in the US to build in and the hardest to get paid in. ERCOT connects a project in about four years at minimal cost, against eight years and $240/kW of upgrades in PJM — and then offers no capacity payment at all, on a merchant index that has fallen roughly 85% in two years as the fleet went from 5.3 GW to 14 GW. The answer the market has reached for is the private toll, and no ERCOT toll price has ever been disclosed. The unresolved question is that transacted tolls price this asset at roughly five times what the realised index delivered in 2025; one of those two numbers is wrong and this model does not know which.',
      '这是美国建设最快、却最难获得回报的市场。ERCOT约四年即可完成并网且成本极低，而PJM需八年并承担每kW $240的升级费用 — 但ERCOT完全不支付容量费用，且其市场化收入指数在两年内随装机由5.3GW增至14GW而下跌约85%。市场所采取的应对之策是私下租赁，而ERCOT从未披露过任何租赁价格。悬而未决的问题在于：实际成交的租赁价格对该资产的定价，约为2025年已实现指数的五倍；这两个数字必有其一是错的，而本模型无从判断是哪一个。',
    ],
    /* 14 GW entering 2026 against roughly 40 GW projected operating by end-2030. */
    pipelineRatio: '~2.9×',
  },
};

export default comparison;
