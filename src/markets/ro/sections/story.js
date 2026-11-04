/* Romania — the `story` section.
   Cut by line range from the single-file sections.js; the body below is verbatim.
   See docs/p1-sections-rollout.md and scripts/split-market-sections.mjs. */
import { buildROPlanningBlocks } from '../planningSection.js';
import { buildROEconomicsBlocks } from '../economicsSection.js';
import { createShared } from './shared.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function create(api){
  const { h, L, MKT, M, SRC, state, bandFor, NF2, fmtN, fmt1, fmtC, fmtCk, fmtCM, fmtPct, fmtIRR, fmtX, liveScore, dilutionAt, labInputs, labModel, pipelineByYear } = api;
  const { O, eur, fmtRON } = createShared(api);
  const SEC_B = {};

SEC_B.story = function (){
  return {
  head: ['Romania Market Evolution — from a coal-and-hydro system to a solar-driven arbitrage market',
         '罗马尼亚市场演进 — 从煤电与水电系统到光伏驱动的套利市场'],
  cap: ['This section is the narrative bridge between the Overview and the detailed underwriting tabs. It separates historical facts, observed market outcomes and the forward investment conclusion.',
        '本节连接“总览”与后续承销分析，明确区分历史事实、已观察市场结果及前瞻投资结论。'],
  blocks: [
    { t:'card', mt:false, title:['One-minute orientation for a new institutional investor','机构投资人的一分钟市场定位'], badges:['official','public'], live:false, blocks:[
      { t:'kpis', items:[
        { l:['Market design','市场设计'], v:L(['Energy-only','单一电能量']), d:['no capacity mechanism; coupled to the EU day-ahead market','无容量机制；与欧盟日前市场耦合'], b:['official'] },
        { l:['DAM average price 2025','2025年日前市场均价'], v:fmtC(eur(O.dam2025Wap)) + '<small>/MWh</small>', d:[fmtRON(O.dam2025Wap) + ' · ' + fmt1(O.dam2025TWh) + ' TWh traded', fmtRON(O.dam2025Wap) + ' · 成交' + fmt1(O.dam2025TWh) + 'TWh'], b:['official'] },
        { l:['DAM share of consumption','日前市场占消费比重'], v:O.dam2025SharePct + '<small>%</small>', d:['the rest is bilateral or intraday','其余为双边或日内'], b:['official'] },
        { l:['State-aid scheme for standalone storage','独立储能国家援助计划'], v:fmtCM(O.schemeBudgetEurM * 1e6), d:['capital support, not revenue support','资本支持，非收入支持'], b:['official'] },
        { l:['Operating storage fleet','在运储能规模'], v:fmtN(O.fleetMW) + '<small> MW</small>', d:[fmtN(O.fleetMWh) + ' MWh, 1 Aug 2026 — doubling by year-end','' + fmtN(O.fleetMWh) + 'MWh，2026年8月1日 — 年底前翻倍'], b:['official'] },
        { l:['Authorisations in one Feb 2026 meeting','2026年2月单次会议许可'], v:fmtN(O.authFeb2026MW) + '<small> MW</small>', d:['interest is abundant; delivery is not','兴趣充足，交付不足'], b:['official'] },
      ] },
      { t:'reco', b:['Institutional conclusion: ','机构投资结论：'],
        text:['Romania offers among the best raw arbitrage economics in the comparison set and the weakest revenue de-risking. High and volatile day-ahead prices, a deepening solar trough and a steep evening ramp create a genuine merchant opportunity; the absence of any capacity mechanism means none of it is contracted. The winning project is the one that clears the administrative gates early and negotiates a bilateral floor, not the one with the best price forecast.',
              '罗马尼亚在本对比样本中拥有最好的原始套利经济性之一，以及最弱的收入去风险机制。日前电价高且波动、光伏低谷加深、晚间爬坡陡峭，构成真实的市场化机会；而完全没有容量机制意味着这些收入均未被合同化。优质项目是那些尽早跨越行政门槛并谈成双边保底的项目，而非价格预测最好的项目。'] },
      { t:'why', text:['Two facts do the work. The June 2026 DAM average of ' + fmtRON(O.damJun2026Wap) + '/MWh sits ' + fmtPct((O.damJun2026Wap / O.dam2025Wap - 1) * 100, 0) + '% above the 2025 annual average, so price levels and volatility are genuinely supportive. But ' + fmtN(O.authFeb2026MW) + ' MW of storage authorisations approved in a single regulatory meeting shows how much competing interest exists at the paper stage. The Romanian investment problem is therefore conversion, not opportunity: the returns are available to whoever actually connects, and most of the announced pipeline will not.',
        '此处两项事实最为关键。2026年6月日前市场均价' + fmtRON(O.damJun2026Wap) + '/MWh，较2025年年均高出' + fmtPct((O.damJun2026Wap / O.dam2025Wap - 1) * 100, 0) + '%，价格水平与波动性确实具有支撑性。但单次监管会议即核准' + fmtN(O.authFeb2026MW) + 'MW储能许可，显示在纸面阶段存在多少竞争性兴趣。因此罗马尼亚的投资难题在于转化率而非机会：收益属于真正并网者，而已公告管线中的大部分不会实现。'],
        sig:['Conversion risk, not opportunity risk','转化风险而非机会风险'] },
    ] },

    ...buildROPlanningBlocks({ SRC }),

    ...buildROEconomicsBlocks(),
    { t:'card', title:['How the Romanian storage case was built — four changes in five years','罗马尼亚储能逻辑的形成 — 五年内四次变化'], badges:['official','public'], blocks:[
      { t:'band-story', b:['Why this history is underwriting-relevant','这段历史为何与承销相关'],
        text:['Romania did not design a storage market; it acquired one as a by-product of solar growth, EU market coupling and state-aid availability. Each of the four changes below improved the case, and none of them created a contracted revenue line. That is why the diligence emphasis here is documentary rather than analytical.',
              '罗马尼亚并未设计储能市场；它是光伏增长、欧盟市场耦合与国家援助可得性的副产品。以下四项变化均改善了投资逻辑，但没有一项创造出合同化收入线。这正是当地尽调侧重文件而非分析的原因。'] },
      { t:'timeline', items:[
        { y:'2019–2022', t:['Market coupling and price convergence','市场耦合与价格趋同'],
          p:['Romania coupled to the wider European day-ahead market, which imported both liquidity and volatility. Prices became a European rather than a domestic variable.',
             '罗马尼亚与更广泛的欧洲日前市场耦合，同时引入了流动性与波动性。电价由本国变量变为欧洲变量。'],
          i:['Any Romanian price forecast is now partly a forecast of continental gas and coupling flows, which is why a domestic fundamentals model alone is insufficient.',
             '如今任何罗马尼亚价格预测都部分是对欧陆燃气与耦合潮流的预测，这正是仅靠本国基本面模型不足以支撑判断的原因。'] },
        { y:'2022–2024', t:['Solar build-out creates the midday trough','光伏扩张形成午间低谷'],
          p:['Rapid utility and rooftop solar deployment deepened the midday price trough and steepened the evening ramp. Negative-price intervals appeared and then multiplied.',
             '大型与屋顶光伏快速部署加深了午间价格低谷、抬升了晚间爬坡陡度。负电价时段开始出现并迅速增加。'],
          i:['This is the arbitrage opportunity in one sentence: solar creates the spread that storage monetises, and continued solar growth both widens it and eventually competes it away.',
             '这是套利机会的一句话概括：光伏创造了储能所变现的价差，而光伏的持续增长既扩大该价差，最终也会将其竞争消解。'] },
        { y:'2024–2025', t:['Tariff treatment of stored energy is corrected','储能电量的电价待遇获得纠正'],
          p:['The regulator moved to remove the double-charging of network tariffs on energy that is stored and returned to the grid — a structural cost that had made standalone storage uneconomic on paper.',
             '监管机构着手取消对“储存后再送回电网”电量的网络费双重计费 — 这项结构性成本曾使独立储能在纸面上不具经济性。'],
          i:['A cost removal, not a revenue addition. It is nonetheless the single change that made standalone Romanian storage modellable at all, and it should be verified as implemented in tariff practice rather than assumed from the announcement.',
             '这是成本的移除而非收入的增加。但它仍是使罗马尼亚独立储能首次具备可建模性的关键变化，且应核验其在电价实践中的落地情况，而非仅凭公告推定。'] },
        { y:'2026', t:['State aid and the first financings','国家援助与首批融资'],
          p:['A ' + fmtCM(O.schemeBudgetEurM * 1e6) + ' state-aid scheme for standalone storage was approved, alongside development-bank-supported project financings that established a bankability precedent.',
             '一项' + fmtCM(O.schemeBudgetEurM * 1e6) + '的独立储能国家援助计划获批，同时开发性银行支持的项目融资确立了可融资性先例。'],
          i:['The scheme reduces capital at risk and the financings prove lenders will lend. Neither creates a contracted revenue line, so gearing remains lower than in a capacity-market jurisdiction for the same asset.',
             '该计划降低风险资本，融资案例证明贷款人愿意放贷。但两者均未创造合同化收入线，因此对同一资产而言，杠杆水平仍低于设有容量市场的司法辖区。'] },
      ] },
      { t:'why', text:['Four changes, all favourable, none of them contractual. Romania has removed cost barriers and added capital support without ever creating a revenue floor — which is a coherent policy choice for an energy-only market but leaves the entire revenue risk with the investor. The base rate to underwrite against is therefore: expect the policy environment to keep improving on cost and capital, and do not expect it to improve on revenue certainty.',
        '四项变化均属有利，但没有一项属于合同性质。罗马尼亚移除了成本障碍并增加了资本支持，却始终未创造收入下限 — 对单一电能量市场而言这是自洽的政策选择，但全部收入风险留给了投资人。因此承销时应参照的基准判断是：预期政策环境在成本与资本层面持续改善，但不应预期其在收入确定性上有所改善。'],
        sig:['Cost and capital improve; revenue risk does not','成本与资本改善，收入风险不变'] },
      { t:'g2', cards:[
        { title:['Day-ahead and intraday price path','日前与日内价格轨迹'], badges:['official','illus'], blocks:[
          { t:'line', cfg:{ xs: M.pxLabels, yfmt: v => fmtN(v), h: 220, ymin: 0,
            series:[
              { name:['DAM (RON/MWh)','日前市场（RON/MWh）'], color:'var(--s1)', vals: M.damSeries },
              { name:['IDM (RON/MWh)','日内市场（RON/MWh）'], color:'var(--s3)', vals: M.idmSeries, dash: true },
            ] } },
          { t:'why', text:['Only the 2025 annual weighted averages and the June 2026 monthly figure are official anchors; the intra-year shape is an illustrative seed. What is real is the persistent discount of intraday to day-ahead, which is roughly ' + fmtPct((1 - O.idm2025Wap / O.dam2025Wap) * 100, 0) + '% on the 2025 averages — that discount is the cost of correcting a position late, and it belongs in the executable-spread bridge rather than in an upside case.',
            '只有2025年年度加权均价与2026年6月的月度数值是官方锚点；年内形态为示例种子。真实存在的是日内相对日前的持续折价，按2025年均值约为' + fmtPct((1 - O.idm2025Wap / O.dam2025Wap) * 100, 0) + ' — 该折价是事后修正头寸的成本，应计入可执行价差桥，而非计入上行情景。'],
            sig:['Intraday discount is a cost, not an upside','日内折价是成本，而非上行'] },
        ] },
        { title:['Negative-price and high-price intervals','负电价与高电价时段'], badges:['illus'], blocks:[
          { t:'bar', cfg:{ xs: M.qLabels, mode:'group', bw: 20, yfmt: v => fmtN(v) + ' h', h: 220,
            series:[
              { name:['Negative-price intervals','负电价时段'], color:'var(--s6)', vals: M.negHoursSeries },
              { name:['Intervals above 1,000 RON/MWh','高于1,000 RON/MWh的时段'], color:'var(--s3)', vals: M.highHoursSeries },
            ] } },
          { t:'why', text:['The two series are the storage business model drawn as a chart: negative intervals are when the asset is paid to charge, high intervals are when it is paid to discharge. Both are growing, which widens the spread today. But negative intervals are growing faster, and that asymmetry is the signal that solar saturation is arriving ahead of storage — good for a 2027 COD, progressively less good after.',
            '这两条序列就是储能商业模式的图形表达：负电价时段是资产因充电而获付费之时，高电价时段是其因放电而获付费之时。两者均在增长，当下扩大了价差。但负电价时段增长更快，这一不对称正是光伏饱和先于储能到来的信号 — 对2027年投运有利，其后逐步减弱。'],
            sig:['Negative hours are growing faster','负电价小时数增长更快'] },
        ] },
      ] },
      { t:'src', src: SRC.opcom, use:['Annual and monthly weighted-average prices and traded volumes','年度与月度加权均价及成交量'] },
    ] },

    { t:'card', title:['Who is building Romanian storage — four strategies, one bottleneck','谁在建设罗马尼亚储能 — 四类策略，一个瓶颈'], badges:['public','illus'], live:false, blocks:[
      { t:'players', items:[
        { type:['Utility / incumbent generator','公用事业与在位发电企业'], n:['State and private generators with existing grid positions','拥有既有电网地位的国有及私营发电企业'], met:'existing connections',
          p:['Reuse or extend existing connection points, which is the fastest route past the binding constraint. Their advantage is regulatory position rather than cost of capital.',
             '复用或扩展既有并网点，是绕过关键约束的最快路径。其优势在于监管地位而非资本成本。'] },
        { type:['Renewable developer adding storage','加建储能的新能源开发商'], n:['Solar and wind developers co-locating batteries','在光伏与风电场共址加建电池的开发商'], met:'shared ATR',
          p:['Add storage behind an existing or applied-for connection, monetising the same solar trough their own generation creates. Structurally the strongest position in Romania.',
             '在既有或已申请的并网点后加建储能，将自身发电所造成的光伏低谷变现。这是罗马尼亚结构上最强的地位。'] },
        { type:['International infra fund','国际基础设施基金'], n:['Development-bank-supported platform investors','由开发性银行支持的平台型投资人'], met:'grant + debt',
          p:['Combine state aid with development-bank debt to build a first-mover portfolio. They accept merchant risk that commercial lenders will not, in exchange for scale and early position.',
             '将国家援助与开发性银行债务结合，构建先发组合。其接受商业银行不愿承担的市场化风险，以换取规模与先发地位。'] },
        { type:['Trading house / optimiser','贸易机构与优化商'], n:['Route-to-market providers and balancing aggregators','售电路径提供方与平衡市场聚合商'], met:'fee + share',
          p:['Balancing qualification and reproducible dispatch performance are scarce in Romania, so the optimiser is a genuine differentiator rather than a commodity service.',
             '在罗马尼亚，平衡市场资格与可复现的调度业绩较为稀缺，因此优化商是真正的差异化因素，而非通用服务。'] },
      ] },
      { t:'note', text:['Concentration read: Romania is fragmented on ownership and concentrated on connection. Whoever holds an ATR with adequate capacity at a location with a real price spread holds the scarce asset — which is why co-location behind an existing renewable connection is structurally advantaged.',
        '集中度解读：罗马尼亚在所有权上分散，在并网上集中。谁在具备真实价差的位置持有容量充足的ATR，谁就持有稀缺资产 — 这正是在既有新能源并网点后共址具备结构性优势的原因。'] },
      { t:'why', text:['For a new entrant this determines strategy before it determines price. Buying an ATR-secured, authorised project costs more per MW but removes the risk that actually kills Romanian projects. Developing from an authorisation is cheaper and is a real business, but it is a permitting business rather than an energy business and should carry development-stage return requirements.',
        '对新进入者而言，这一点在决定价格之前先决定策略。收购已锁定ATR并取得许可的项目，每MW成本更高，但消除了真正导致罗马尼亚项目失败的风险。从设立许可自行开发成本更低且是真实业务，但那是许可业务而非能源业务，应按开发阶段的收益要求承担。'],
        sig:['Buy the ATR, not the megawatts','买的是ATR，而非兆瓦'] },
    ] },

    { t:'g2', cards:[
      { title:['Near-term outlook — 2026 to 2029: convert or lose the window','近期展望 — 2026至2029：抓住窗口或错失'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2026–2027','2026–2027'], h:['First awards and first closings','首批授予与首批交割'], p:['Formal awards under the state-aid scheme and the first commercial financings establish pricing and documentation precedent for everyone that follows.','国家援助计划下的正式授予与首批商业融资，为后续所有参与者确立定价与文本先例。'] },
          { yr:['2027–2028','2027–2028'], h:['Spread peak','价差高点'], p:['Solar saturation has widened the trough but competing storage has not yet arrived at scale. This is the best captured-spread window in the model.','光伏饱和已加深低谷，而竞争性储能尚未规模化到场。这是模型中捕获价差最佳的窗口。'] },
          { yr:['2028–2029','2028–2029'], h:['Competition arrives','竞争到场'], p:['Probability-weighted pipeline begins to connect and the captured spread falls from ' + fmtC(M.codCases[2027].central) + ' to ' + fmtC(M.codCases[2029].central) + '/MWh in the central case.','概率加权管线开始并网，中性情景下捕获价差由' + fmtC(M.codCases[2027].central) + '降至' + fmtC(M.codCases[2029].central) + '/MWh。'] },
        ] },
        { t:'why', text:['The central case loses ' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '% of captured spread between a 2027 and a 2029 COD. In a market with no capacity payment to cushion that decline, COD year is the single most valuable variable a sponsor controls — worth more than a better site, a cheaper cell price or a sharper optimiser. Every month of connection delay is directly priced.',
          '中性情景下，2027年与2029年投运之间捕获价差损失' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '%。在没有容量付费缓冲该下滑的市场中，投运年度是发起人可控的最有价值变量 — 其价值高于更好的场址、更低的电芯价格或更优秀的优化商。并网每延迟一个月都会被直接定价。'],
          sig:['COD year is the most valuable variable','投运年度是最有价值的变量'] },
      ] },
      { title:['Long-term outlook — 2030 to 2035: coal exit and the second window','长期展望 — 2030至2035：煤电退出与第二个窗口'], badges:['official','forecast'], blocks:[
        { t:'phases', items:[
          { yr:['2030','2030'], h:['Scheme minimum reached','达到计划最低目标'], p:['The policy minimum of ' + fmtN(O.schemeMinMWh) + ' MWh plus roughly ' + fmtN(O.policyExtraMW) + ' MW of further expectation, against a much smaller operating base today.','政策最低目标' + fmtN(O.schemeMinMWh) + 'MWh，另加约' + fmtN(O.policyExtraMW) + 'MW的进一步预期，而当前在运基数远小于此。'] },
          { yr:['2031–2033','2031–2033'], h:['Thermal retirement','火电退役'], p:['Coal and older gas retirement removes flexible capacity, steepening ramps and re-widening the spread that new storage had compressed.','煤电与老旧燃气机组退役移除灵活容量，使爬坡更陡，并重新扩大新增储能此前压缩的价差。'] },
          { yr:['2033–2035','2033–2035'], h:['Augmentation cycle','增容周期'], p:['The 2027–2029 2-hour cohort reaches the point where adding MWh is cheaper than new-build, and augmentation-ready sites capture that cycle.','2027–2029年建设的2小时批次将到达“增配MWh比新建更便宜”的时点，具备增容条件的场址将获得该周期机会。'] },
        ] },
        { t:'why', text:['The long-run case is a second window rather than a continuous trend: spreads compress as storage arrives, then re-widen as thermal retires. A 2-hour asset built for the first window with a documented augmentation path can participate in both — which is a stronger argument for augmentation optionality than the marginal-hour NPV alone suggests, because the option is exercised into a different market than the one that priced it.',
          '长期逻辑是第二个窗口，而非持续趋势：价差随储能到场而压缩，随后又因火电退役而重新扩大。为第一个窗口建设的、具备有据可查增容路径的2小时资产可以同时参与两个窗口 — 这比单纯的边际小时NPV更有力地论证了增容选择权的价值，因为该选择权行使时所面对的市场，已不同于当初为其定价的市场。'],
          sig:['Two windows, one augmentable asset','两个窗口，一个可增容资产'] },
      ] },
    ] },

    { t:'card', title:['What breaks this storyline — three monitored uncertainties','哪些因素会打破该叙事 — 三项须持续监测的不确定性'], badges:['public','calc'], blocks:[
      { t:'table', head:[['Uncertainty','不确定性'],['Why it matters','影响机理'],['Monitoring trigger','监测触发条件']], rows:[
        [{b:['Tariff treatment of stored energy','储能电量的电价待遇']},
         ['Removal of double-charging is what makes standalone storage modellable. If implementation in tariff practice lags the announcement, the operating cost base changes materially.','取消双重计费是独立储能得以建模的前提。若电价实践中的落地滞后于公告，运营成本基础将发生实质变化。'],
         ['Publication of the applicable tariff methodology','适用电价方法的正式发布']],
        [{b:['Connection allocation and guarantee mechanics','并网分配与保函机制']},
         ['Auction, guarantee and release rules are still evolving. Capital posted against guarantees is at risk until release conditions are documented.','拍卖、保函与释放规则仍在演变。在释放条件形成书面约定前，为保函缴付的资金处于风险状态。'],
         ['Any new regulatory order on connection or guarantees','任何关于并网或保函的新监管法令']],
        [{b:['Pace of competing storage delivery','竞争性储能的交付节奏']},
         ['The captured spread falls ' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '% between 2027 and 2029 in the central case. Faster delivery compresses it further; slower delivery extends the window.','中性情景下，捕获价差在2027至2029年间下降' + fmtPct((1 - M.codCases[2029].central / M.codCases[2027].central) * 100, 0) + '%。交付更快则进一步压缩，更慢则延长窗口。'],
         ['Quarterly count of storage projects reaching energisation','季度内达到送电的储能项目数量']],
      ] },
      { t:'why', text:['All three are administrative rather than market variables, and none is diversifiable within Romania. That is the argument for structuring rather than forecasting: a change-in-law allocation on tariff treatment, documented guarantee release mechanics, and a bilateral floor or tolling arrangement together convert three unforecastable policy variables into three negotiated positions. In a market with no capacity payment, this structuring is not optional refinement — it is what makes the project financeable.',
        '三者均为行政变量而非市场变量，且在罗马尼亚境内均不可分散。这正是“以结构应对而非以预测应对”的理由：关于电价待遇的法律变更风险分担、书面化的保函释放机制、以及双边保底或代工安排，三者结合可将三个无法预测的政策变量转化为三项经过谈判的立场。在没有容量付费的市场中，这种结构安排不是可选的精细化 — 它是项目得以融资的前提。'],
        sig:['Structuring is what makes it financeable','结构安排是可融资的前提'] },
    ] },

    { t:'card', title:['Bridge to the detailed dashboard — the investor’s question map','进入详细看板 — 投资人的问题地图'], badges:['calc'], blocks:[
      { t:'walk', items:[
        ['03', ['Support & Adequacy','支持机制与充裕度'], ['What does the state actually pay for?','国家究竟为什么付费？'], 'capacity'],
        ['04', ['Wholesale & Intraday','批发与日内'], ['How much of the spread is executable?','价差中有多少可执行？'], 'energy'],
        ['05', ['Balancing & Reserves','平衡与备用'], ['What evidence tier has this project reached?','该项目达到了哪一证据层级？'], 'services'],
        ['06', ['Storage Duration','储能时长'], ['Is 2h or 4h right for this price shape?','对当前价格形态，2小时还是4小时正确？'], 'duration'],
        ['07', ['Pipeline','项目管线'], ['Who else arrives in my COD year?','投运年度还有谁会到场？'], 'pipeline'],
        ['08', ['Grid & Permitting','并网与许可'], ['Is there an ATR and an executed connection agreement?','是否具备ATR及已签并网合同？'], 'grid'],
      ] },
    ] },
  ] };
};

// ============================== SUPPORT & ADEQUACY ==============================

  return SEC_B.story;
}
