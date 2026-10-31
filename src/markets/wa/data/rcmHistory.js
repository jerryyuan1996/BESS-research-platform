/* ---------------------------------------------------------------------------
   RCM evolution, verbatim from the prototype (lines 653-702).
   --------------------------------------------------------------------------- */


// ============================================================================
//  RCM EVOLUTION — how the Reserve Capacity Mechanism changed with the market
//  and with the marginal technology. Verified against ERA / Energy Policy WA /
//  AEMO publications (public sources, refreshed July 2026).
// ============================================================================
import { ESR_REQUIREMENT } from './esrRequirement.js';

const RCM_HISTORY = {
  // Benchmark Capacity Provider (the technology whose fixed cost sets the BRCP)
  benchTech: [
    { p:'2006–2020',  t:['Least-cost new-entrant peaking plant (OCGT lineage)','最低成本新进入调峰机组（OCGT谱系）'], v:'—' },
    { p:'2021-22 → 2026-27', t:['160 MW open-cycle gas turbine, incl. 14 h distillate fuel storage','160MW开式燃气轮机，含14小时柴油储备'], v:'OCGT' },
    { p:'2027-28',   t:['200 MW / 800 MWh (4 h) lithium-ion BESS — Coordinator of Energy re-determination','200MW/800MWh（4小时）锂电池 — 能源协调官重新认定'], v:'BESS 4h' },
    { p:'2028-29',   t:['200 MW / 1,200 MWh (6 h) lithium-ion BESS, 330 kV, Clean Energy Link – North','200MW/1,200MWh（6小时）锂电池，330kV，清洁能源链路北'], v:'BESS 6h' },
  ],
  // ESR Duration Requirement, expressed in the Rules as Trading Intervals (30 min each)
  esr: ESR_REQUIREMENT,
  milestones: [
    { y:'2006', t:['RCM starts with the WEM','RCM随WEM启动'],
      p:['The market opened in September 2006 for the SWIS with an administered Reserve Capacity Mechanism: AEMO certifies capacity, assigns Capacity Credits and the ERA sets an annual Benchmark Reserve Capacity Price from the fixed cost of a hypothetical least-cost new entrant. Capacity was the reliability product; energy trading was secondary.',
         '市场于2006年9月在SWIS启动，配套行政化的备用容量机制：AEMO认证容量并分配容量信用，ERA按假设的最低成本新进入者固定成本每年确定基准备用容量价格。容量是可靠性产品，电能量交易为辅。'],
      i:['The marginal technology sets the price. For 15 years that technology was a gas peaker, so the RCM paid for MW of availability and was indifferent to MWh.','边际技术决定价格。此后15年该技术是燃气调峰机组，因此RCM为可用MW付费，对MWh无差别。'] },
    { y:'2016', t:['Surplus forces a price curve','盈余迫使引入价格曲线'],
      p:['The Electricity Market Review found the SWIS carrying roughly 1,000 MW (~23%) of surplus capacity in 2016-17 at an estimated A$116m annual consumer cost. The RCP formula was reformed so the price falls as excess capacity grows, instead of paying near-benchmark prices into a glut.',
         '电力市场评审发现2016-17年度SWIS盈余容量约1,000MW（约23%），估计每年消费者成本A$116m。RCP公式随之改革，使价格随盈余扩大而下降，而非在过剩状态下继续支付接近基准的价格。'],
      i:['This is the origin of today’s supply-ratio sensitivity: the RCM is explicitly designed to cut price when the market over-builds. Volume risk and price risk are the same risk.','这正是今天供给比敏感性的来源：RCM被明确设计为在市场超建时压价。数量风险与价格风险实为同一风险。'] },
    { y:'2019–2021', t:['Renewables re-define what capacity must do','新能源重新定义容量的职能'],
      p:['The Energy Transformation Strategy responded to rooftop PV, DER and large-scale renewables. Whole-of-system planning and constrained network access were introduced, creating the Network Access Quantity concept and the framework for Electric Storage Resources.',
         '能源转型战略回应屋顶光伏、分布式能源与大型新能源，引入全系统规划及受约束网络接入，形成网络接入容量（NAQ）概念与储能资源（ESR）框架。'],
      i:['From here, capacity value stops being purely a plant attribute and becomes a network-and-duration attribute. Two new haircuts appear between nameplate and revenue.','自此，容量价值不再纯属机组属性，而成为网络与时长属性。铭牌与收入之间新增两道折减。'] },
    { y:'1 Oct 2023', t:['New WEM: capacity splits into Peak and Flexible','新WEM：容量拆分为峰值与灵活'],
      p:['Security-constrained economic dispatch, five co-optimised FCESS markets and the reformed RCM went live together. Certified Reserve Capacity split into Peak CRC and Flexible CRC (maximum output achievable within four hours from a cold state, capped at Peak CRC), Network Access Quantities became binding on assigned credits, and Reserve Capacity Security was required from new entrants.',
         '安全约束经济调度、五类协同优化FCESS市场与改革后的RCM同步上线。认证备用容量拆分为峰值CRC与灵活CRC（自冷态起四小时内可达最大出力，上限为峰值CRC），网络接入容量对获配信用形成约束，新进入者须提供容量保证金。'],
      i:['The revenue chain becomes DSOC → CRC → NAQ → assigned Capacity Credits × RCP. Every link can cut value without the asset changing at all.','收入链变为 DSOC→CRC→NAQ→获配容量信用×RCP。资产不变的情况下，每一环节都可能削减价值。'] },
    { y:'2024', t:['The benchmark technology becomes a battery','基准技术改为电池'],
      p:['Following the Coordinator of Energy’s review, the Benchmark Capacity Provider changed from the 160 MW OCGT (which had set the BRCP for 2021-22 to 2026-27) to a 200 MW / 800 MWh lithium-ion BESS — no fuel cost, but a higher required return and a cost base that scales with MWh, not MW.',
         '经能源协调官评审，基准容量提供者由160MW开式燃气轮机（曾为2021-22至2026-27年度设定BRCP）改为200MW/800MWh锂电池 — 无燃料成本，但要求回报更高，且成本基础随MWh而非MW变化。'],
      i:['This is the single most important structural change for storage investors: the capacity price now inherits battery cost curves and battery duration, so BRCP and duration policy move together.','这是对储能投资人最重要的结构性变化：容量价格自此继承电池成本曲线与电池时长，因此BRCP与时长政策同向变动。'] },
    { y:'2024–2025', t:['Investment certainty: a 10-year fixed price for long duration','投资确定性：长时储能可锁定10年固定价'],
      p:['The WEM Investment Certainty Review added a fixed Reserve Capacity Price election alongside the floating administered price, including a 10-year guarantee aimed at Flexible Capacity and new technologies such as long-duration storage, benchmarked against the forecast ESR Duration Requirement. A facility must elect fixed or floating; it cannot hold both.',
         'WEM投资确定性评审在浮动行政价格之外增设固定备用容量价格选择权，其中面向灵活容量及长时储能等新技术提供10年保障，并以预测ESR时长要求为基准。设施须在固定与浮动之间择一，不可兼得。'],
      i:['Duration stops being an engineering choice and becomes the gate to a contract-like revenue floor. Hours above the threshold are worth far more than hours below it.','时长不再只是工程选择，而成为取得类合约收入底线的门槛。高于门槛的小时数价值远高于低于门槛者。'] },
    { y:'2025–2026', t:['Duration requirement ratchets 4 h → 6 h → 7 h','时长要求由4→6→7小时逐级抬升'],
      p:['The ESR Duration Requirement moved from eight Trading Intervals (4 h, grandfathered for credits allocated up to the 2024 cycle) to twelve (6 h) for 2027-28 and fourteen (7 h) for 2028-29, while the 2028-29 BRCP was set at A$488,500/MW/yr for both Peak and Flexible Capacity on a 200 MW / 1,200 MWh six-hour benchmark — up from A$360,700 for 2027-28.',
         'ESR时长要求由8个交易时段（4小时，截至2024周期获配信用适用祖父条款）提高至2027-28的12个时段（6小时）及2028-29的14个时段（7小时）；同时2028-29 BRCP以200MW/1,200MWh六小时基准确定为峰值与灵活容量均A$488,500/MW/年，高于2027-28的A$360,700。'],
      i:['A 4-hour asset built for the old rule keeps its grandfathered credits but cannot win new ones at full value. Rule vintage, not technology age, is what depreciates.','按旧规则建设的4小时资产保留祖父信用，但无法以足额价值获得新增信用。真正折旧的是规则版本，而非技术年限。'] },
  ],
};

export { RCM_HISTORY };
