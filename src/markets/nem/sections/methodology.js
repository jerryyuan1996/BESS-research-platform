// ============================== DATA & METHODOLOGY ==============================

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { M, SRC } = api;

  return function (){
    return {
    head: ['Data & Methodology — what is published, what is not, and what this dashboard does about it',
           '数据与方法 — 哪些已公开、哪些未公开，以及本看板如何处理'],
    cap: ['The NEM is one of the best-instrumented electricity markets in the world and one of the least transparent on contract prices. Both halves of that sentence shape every number on this dashboard, so both are set out here.',
          'NEM是全球数据最完备的电力市场之一，同时也是合同价格最不透明的市场之一。这句话的两个部分共同决定了本看板上的每一个数字，因此在此一并说明。'],
    blocks: [
      { t:'card', mt:false, title:['What is not published — and what this dashboard uses instead','未公开的内容 — 以及本看板的替代做法'], badges:['official'], blocks:[
        { t:'table', head:[['Item','项目'],['Publication status','公开状态'],['Why','原因'],['What is used instead','替代做法']],
          rows: M.notPublished.map(x => [{b:x.item}, {chip:'serious', text:x.status}, x.why, x.instead]) },
        { t:'why', text:['This table is the most important one on the dashboard and it is deliberately first. Two of the NEM\'s three routes to market cannot be priced from public information at all, so any figure this platform publishes for a CIS floor or a toll fee is a bracket between two anchors rather than an observation. The Nelson Review\'s recommendation that the successor ESEM should publish its auction clearing prices is worth watching for exactly this reason: it would convert the largest assumption in this market into a number.',
          '本表是看板上最重要的一张，且刻意置于首位。NEM三条售电路径中有两条完全无法依据公开信息定价，因此本平台就CIS保底价或租赁费用发布的任何数字，都是两个锚点之间的区间估计，而非实测观察值。Nelson评估建议后继的ESEM应公布其拍卖出清价格 — 正因如此，这一点值得密切关注：它将把本市场中最大的假设转化为一个数字。'],
          sig:['Two of three routes are unpriceable from public data','三条路径中有两条无法依据公开数据定价'] },
        { t:'src', src:SRC.contractPriceGap, use:['The coverage gap this table describes','本表所述的数据覆盖缺口'] },
      ] },

      { t:'card', title:['Source register','来源登记册'], badges:['official'], blocks:[
        { t:'table', head:[['Source','来源'],['Status','状态'],['Vintage','数据时点'],['Coverage','覆盖范围']], rows:[
          [{b:['AEMO — Quarterly Energy Dynamics','AEMO — 季度市场动态']}, {chip:'good', text:SRC.qed.status}, SRC.qed.date, SRC.qed.cy],
          [{b:['AEMO — 2026 Integrated System Plan','AEMO — 2026年综合系统规划']}, {chip:'good', text:SRC.isp.status}, SRC.isp.date, SRC.isp.cy],
          [{b:['AEMO — Marginal Loss Factors','AEMO — 边际损耗系数']}, {chip:'good', text:SRC.mlf.status}, SRC.mlf.date, SRC.mlf.cy],
          [{b:['DCCEEW — Capacity Investment Scheme','DCCEEW — 容量投资计划']}, {chip:'good', text:SRC.cis.status}, SRC.cis.date, SRC.cis.cy],
          [{b:['CSIRO — GenCost 2025-26','CSIRO — GenCost 2025-26']}, {chip:'good', text:SRC.gencost.status}, SRC.gencost.date, SRC.gencost.cy],
          [{b:['AEMC — Transmission access reform','AEMC — 输电接入改革']}, {chip:'good', text:SRC.aemc.status}, SRC.aemc.date, SRC.aemc.cy],
          [{b:['Nelson Review — final report','Nelson评估 — 最终报告']}, {chip:'good', text:SRC.nelson.status}, SRC.nelson.date, SRC.nelson.cy],
          [{b:['NSW Roadmap — LTESA tenders','新南威尔士路线图 — LTESA招标']}, {chip:'good', text:SRC.ltesa.status}, SRC.ltesa.date, SRC.ltesa.cy],
        ] },
        { t:'src', src:SRC.isp, use:['Named transmission projects, capacities and commissioning years used by the map and the congestion register','地图与拥塞登记表所采用的具名输电工程、容量及投运年份'] },
        { t:'src', src:SRC.mlf, use:['The loss-factor haircut carried on market revenue','作用于市场化收入的损耗系数折扣'] },
        { t:'src', src:SRC.gencost, use:['Capital cost by duration','按时长划分的资本成本'] },
      ] },

      { t:'card', title:['Methodology — how this market is normalised','方法论 — 本市场的归一化方式'], badges:['calc'], blocks:[
        { t:'table', head:[['Decision','决策'],['What this dashboard does','本看板的处理'],['Why','原因']], rows:[
          [{b:['Reference region','参考区域']},
           ['NSW1, with regional spread shown rather than averaged.','采用NSW1，并展示区域差异而非取平均。'],
           ['The NEM is five regions with genuinely different prices. A national average produces a market that does not exist; NSW is the largest fleet and sits between Queensland\'s collapse and South Australia\'s growth.','NEM由五个价格差异显著的区域组成。全国平均会产生一个并不存在的市场；新南威尔士装机规模最大，且介于昆士兰的下滑与南澳的增长之间。']],
          [{b:['No capacity route','无容量路径']},
           ['`capacityMarket` is declared false and the capacity-backed route returns "not applicable" rather than zero.','`capacityMarket`声明为false，容量支撑路径返回"不适用"而非零值。'],
           ['The NEM is energy-only and the Nelson Review kept it that way in December 2025. A zero would imply a mechanism that pays nothing; "not applicable" states that no mechanism exists.','NEM为单一电能量市场，Nelson评估于2025年12月维持了这一设计。取零意味着存在但不付费的机制；"不适用"则表明该机制根本不存在。']],
          [{b:['CIS as a long-term award','将CIS建模为长期中标']},
           ['Modelled as a fixed payment of 90% of an estimated floor, plus 10% retention of market revenue.','按估算保底价90%的固定支付，加上市场化收入10%的留存比例建模。'],
           ['While the floor binds, owner receipts are R + 0.9(floor − R), which is exactly a fixed payment plus a 10% retention. The linearisation is exact only in the floor-binding regime, which is where today\'s merchant levels sit.','当保底条款生效时，业主所得为R + 0.9(保底 − R)，恰好等于固定支付加10%留存。该线性化仅在保底生效区间内精确成立，而当前市场化收入水平正处于该区间。']],
          [{b:['Congestion','拥塞']},
           ['Carried in the congestion register and in `naqFactor`, never as a revenue line.','计入拥塞登记表及`naqFactor`，绝不作为收入项。'],
           ['NEM generators and storage hold no firm transmission rights and receive no compensation for being constrained off. A congestion revenue line would be modelling a payment that does not exist.','NEM的发电与储能不持有固定输电权，受约束停机亦无补偿。设置拥塞收入项等于对一项并不存在的付款进行建模。']],
          [{b:['FCAS and duration','FCAS与时长']},
           ['FCAS is not scaled when the archetype duration changes.','原型时长变化时，FCAS不作缩放。'],
           ['FCAS is a power-based service. Scaling it with energy capacity would overstate a four-hour asset against a two-hour one on a line where duration is irrelevant.','FCAS属功率型服务。若随能量容量缩放，会在一个与时长无关的收入项上高估四小时资产相对于两小时资产的表现。']],
        ] },
        { t:'note', b:['Currency: ','货币：'],
          text:['All figures on this dashboard are in Australian dollars. The cross-market comparison converts at the platform\'s seeded AUD rate; see the home page FX row for the rate and its date.',
                '本看板所有数字均以澳元计。跨市场对比按本平台设定的澳元汇率换算；汇率及其日期见首页汇率栏。'] },
      ] },

      { t:'card', title:['Glossary','术语表'], badges:['official'], blocks:[
        { t:'glossary' },
      ] },

      { t:'card', title:['Export','数据导出'], badges:['calc'], blocks:[
        { t:'cap', text:['Exports the KPI set carried by this dashboard, with its seed tag and vintage. Contract prices are absent because they are not published — see the first card on this tab.',
                         '导出本看板所载KPI集合及其种子标签与数据时点。合同价格因未公开而缺失 — 详见本页首张卡片。'] },
        { t:'exports' },
      ] },
    ] };
  };
}
