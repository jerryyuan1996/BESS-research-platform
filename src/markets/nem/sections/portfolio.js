// ============================== PORTFOLIO / FUND VIEW ==============================

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { L, M, state, fmtN, fmtC, fmtCM, fmtIRR, fmtX, labInputs, labModel } = api;

  return function (){
    const inp = labInputs(), r = labModel(inp);
    const cis = M.official.cis;
    return {
    head: ['Portfolio / Fund View — applying the NEM thesis to a screened opportunity',
           '组合与基金视图 — 将NEM逻辑应用于所筛选机会'],
    cap: ['A worked screening example on this dashboard\'s own assumptions. All project-specific content is confined to this tab and is illustrative — it demonstrates the gate sequence an investment committee should apply in an energy-only market, not a real transaction.',
          '基于本看板自身假设的筛选示例。所有项目层面内容均限于本页且为示例性质 — 用于演示投委会在单一电能量市场中应遵循的门槛顺序，而非真实交易。'],
    blocks: [
      { t:'card', mt:false, title:['Screened opportunity — institutional screening snapshot','所筛选机会 — 机构筛选快照'], badges:['illus'], live:false, blocks:[
        { t:'kpis', items:[
          { l:['Configuration','配置'], v:fmtN(inp.mw) + ' MW / ' + fmtN(inp.mw * inp.hours) + '<small> MWh</small>',
            d:[inp.hours + '-hour design, the NEM reference archetype', inp.hours + '小时设计，NEM参考原型'] },
          { l:['Target COD','目标投运'], v:state.codYear,
            d:['CIS Tender 8 storage must be operational by 31 Dec 2029','CIS第8轮招标储能须于2029年12月31日前投运'] },
          { l:['Total capex','总资本开支'], v:fmtCM(r.capex),
            d:[fmtC(inp.capexKWh) + '/kWh energy, of which ' + fmtC(inp.dcQuoteKWh) + ' is the quoted DC block', fmtC(inp.capexKWh) + '/kWh能量段，其中' + fmtC(inp.dcQuoteKWh) + '为报价直流电池舱'], b:['model'] },
          { l:['Year-1 EBITDA','第1年EBITDA'], v:fmtCM(r.ebitda1),
            d:['unlevered IRR ' + fmtIRR(r.unlevIRR), '无杠杆IRR ' + fmtIRR(r.unlevIRR)], b:['calc'] },
          { l:['Min DSCR','最低偿债覆盖率'], v:fmtX(r.minDSCR),
            d:['lender floor typically 1.30x','贷款人下限通常1.30倍'],
            cls: r.minDSCR != null && r.minDSCR < 1.3 ? 'down' : '', b:['calc'] },
          { l:['Simple payback','简单回收期'], v: r.payback ? r.payback + L([' yr',' 年']) : '—', b:['calc'] },
        ] },
        { t:'ic', b:['Screening conclusion: ','筛选结论：'],
          text:['In an energy-only market the screening question is not whether the returns clear a hurdle — it is which of the three routes the returns are being measured on, because they are not the same asset. A merchant case is a view on spreads that fell 85% year on year in Q2 2026. A CIS case is a view on a floor nobody publishes. A toll case is a view on a price nobody discloses. State which one before the model, not after.',
                '在单一电能量市场中，筛选问题不在于回报是否跨过门槛，而在于回报是按三条路径中的哪一条衡量的 — 因为它们并非同一资产。市场化方案是对2026年第二季度同比下跌85%的价差的判断；CIS方案是对无人公布的保底价的判断；租赁方案是对无人披露的价格的判断。应在建模之前而非之后明确选择哪一条。'] },
      ] },

      { t:'card', title:['Route selection — the same asset under three contracts','路径选择 — 同一资产的三种合同形态'], badges:['calc','illus'], live:false, blocks:[
        { t:'table', head:[['Route','路径'],['What it fixes','锁定的内容'],['What it leaves open','未锁定的内容'],['Evidence status','证据状态']], rows:[
          [{b:['Merchant','纯市场化']},
           ['Nothing. Full exposure to spot and FCAS.','不锁定任何内容。完全暴露于现货与FCAS。'],
           ['Everything. Energy arbitrage drives more than 95% of forecast merchant revenue over asset life.','全部。电量套利占全寿命期预测市场化收入的95%以上。'],
           {chip:'good', text:['Index published monthly','指数按月公布']}],
          [{b:['CIS long-term award','CIS长期中标']},
           ['A revenue floor, at 90% of the shortfall, for 10–15 years.','以补足缺口90%的方式锁定收入下限，期限10–15年。'],
           ['The floor level itself, plus 50% of everything above the ceiling.','下限水平本身，以及超出上限部分的50%。'],
           {chip:'serious', text:['Floor never published','保底价从未公布']}],
          [{b:['Virtual toll','虚拟租赁']},
           ['A fixed fee for 12–15 years; the offtaker takes dispatch and market risk.','12–15年固定费用；承购方承担调度与市场风险。'],
           ['Whether the fee clears above your merchant expectation. Six announced deals, zero disclosed prices.','该费用是否高于你的市场化预期。已公告六笔交易，零价格披露。'],
           {chip:'serious', text:['Tenor disclosed, price not','期限已披露，价格未披露']}],
        ] },
        { t:'why', text:['Two of the three routes cannot be priced from public information, which is unusual for a market this large and this well instrumented — AEMO publishes quarterly dispatch, annual loss factors and a biennial system plan, and none of it reaches contract prices. The practical consequence for a fund is that route selection in the NEM cannot be desk-researched. It requires being in the tender or in the negotiation, and a screening model should carry the merchant case as the only one it can independently verify.',
          '三条路径中有两条无法依据公开信息定价，这对一个规模如此之大、数据如此完备的市场而言并不寻常 — AEMO公布季度调度数据、年度损耗系数及两年一度的系统规划，却没有一项触及合同价格。对基金而言的现实结果是：NEM的路径选择无法通过案头研究完成，必须进入招标或谈判之中；筛选模型应将市场化方案作为唯一可独立验证的情形。'],
          sig:['Only the merchant route can be desk-verified','仅市场化路径可通过案头验证'] },
      ] },

      { t:'card', title:['Investment Committee gates — what must be true before capital is released','投委会门槛 — 资金拨付前必须成立的条件'], badges:['calc'], live:false, blocks:[
        { t:'gates', items:[
          { n:['Gate 1 — Connection point and loss factor','门槛1 — 并网点与损耗系数'],
            d:['A named connection point with its marginal loss factor history, modelled as a variable. AEMO republishes factors every 1 April, so this is a live revenue risk rather than a discount fixed at financial close.',
               '具名并网点及其边际损耗系数历史数据，并按变量建模。AEMO每年4月1日重新公布系数，因此这属于动态收入风险，而非融资交割时锁定的折扣。'],
            c:'warn', s:['Evidence required','需提供证据'] },
          { n:['Gate 2 — Route to market declared','门槛2 — 售电路径已确定'],
            d:['Merchant, CIS or toll, chosen and evidenced before the model is built. Only 28% of battery capacity awarded a CISA before Tender 3 had reached FID at that round — a contract is not a project.',
               '在建模之前确定并证明采用市场化、CIS或租赁路径。第3轮招标之前获得CIS协议的储能容量中，当时仅28%达成最终投资决定 — 合同不等于项目。'],
            c:'serious', s:['Decides the asset','决定资产性质'] },
          { n:['Gate 3 — Duration','门槛3 — 时长'],
            d:['Four hours or the case does not clear. Modo puts 4h at 9.4% IRR against 5.5% for 2h, and the 4h capex premium has fallen to about 1.5× two hours.',
               '须为四小时，否则方案无法成立。Modo测算4小时IRR为9.4%，2小时为5.5%，且4小时相对2小时的造价溢价已降至约1.5倍。'],
            c:'good', s:['Settled by the archetype','已由原型确定'] },
          { n:['Gate 4 — Congestion is not compensated','门槛4 — 拥塞无补偿'],
            d:['Confirm the case does not assume any payment for being constrained off. There is none in the NEM, and the Congestion Relief Market that would have created one was recommended not to proceed.',
               '确认方案未假设因受约束停机可获得任何补偿。NEM不存在此类补偿，而本可创设该机制的拥塞缓解市场已被建议不予推行。'],
            c:'critical', s:['Model it as zero','应按零建模'] },
          { n:['Gate 5 — Saturation','门槛5 — 饱和度'],
            d:['The connections pipeline holds around 45 GW of batteries against an ISP requirement of 33 GW by 2030. Test the case at the compressed spread, not the historical one.',
               '并网排队中约有45GW储能，而ISP要求2030年前建成33GW。应按压缩后的价差而非历史价差检验方案。'],
            c:'critical', s:['Pipeline exceeds the target','管线已超出目标'] },
        ] },
        { t:'why', text:['Gate 5 is the one that has changed most since 2024 and it is ordered last only because it is the most expensive to answer properly. Queensland is the worked example: it went from the NEM\'s highest-earning battery region to its worst in a single year, on saturation rather than on any change to the network or the rules. A pipeline that already exceeds the 2030 requirement is not a growth signal for an incumbent — it is the mechanism that removes the spread the incumbent was underwritten on.',
          '第5道门槛是自2024年以来变化最大的一项，将其排在最后仅因其正确回答的成本最高。昆士兰即为实证案例：它在一年之内从NEM储能收益最高的区域跌至最低，原因是饱和，而非电网或规则的任何变化。已超出2030年需求的管线对既有资产而言并非增长信号 — 而是移除其承销所依赖价差的机制。'],
          sig:['Saturation, not policy, is the NEM risk','NEM的风险是饱和而非政策'] },
      ] },
    ] };
  };
}
