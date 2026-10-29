/* ---------------------------------------------------------------------------
   Saudi Arabia — declarative section specs for the shared block engine.

   Written 2026-10-29 on the analyst's sign-off of
   docs/saudi-registration-plan.md. The order of the argument: SPPC buys
   storage on the contract an infrastructure fund wants, the cost of building
   it is published, and the fee is not — so the dashboard shows the structure,
   the cost and the break-even, and no return.
   --------------------------------------------------------------------------- */

import { comparison } from './comparison.js';
import { gridMapById } from '../gridMapRegistry.js';
import { congestionFor } from '../congestionRegistry.js';

/** @param {object} api  supplied by src/markets/_shared/engine.js */
export function buildSections(api){
  const { L, M, SRC, fmtN, fmtC, fmtCM, fmtPct } = api;
  const E = comparison.economics;
  const G1 = M.group1, G2 = M.group2, K = M.capex;

  const SEC_B = {};
  function SECTIONS(){
    const o = {};
    Object.keys(SEC_B).forEach(k => Object.defineProperty(o, k, { get: () => SEC_B[k](), enumerable: true }));
    return o;
  }

  const usdKWh = (sarPerMW) => '$' + (sarPerMW / K.sarPerUsd / 4000).toFixed(0) + '/kWh';
  const sarM = (v) => 'SAR ' + (v / 1e6).toFixed(2) + 'm';

  // ---------------- Overview -----------------------------------------------
  SEC_B.home = () => ({ head: ['Saudi Arabia at a glance', '沙特概览'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'band-story', b: ['Core storyline', '核心叙事'], text: [
        'SPPC buys four-hour storage on fifteen-year build-own-operate contracts: a state buyer, a fee for availability and no merchant leg — the structure an infrastructure fund wants. It signed 2 GW / 8 GWh in August 2026 for SAR 4.35bn and closes bids for 3 GW / 12 GWh more on 12 November. It has not published the fee, so this dashboard shows the structure, the cost and the break-even, and no return.',
        'SPPC以十五年建设-拥有-运营合同采购四小时储能：国有买方、可用性付费且无市场化收入 — 正是基础设施基金所需的结构。2026年8月签署2GW/8GWh、投资43.5亿里亚尔，并将于11月12日截标另外3GW/12GWh。付费水平未公布，因此本看板展示结构、成本与盈亏平衡点，而不展示回报。',
      ] },
      { t: 'kpis', items: [
        { l: ['Group 1 signed', '第一组已签约'], v: '2 GW / 8 GWh', d: ['four 500 MW sites, Aug 2026', '四个500MW场址，2026年8月'], b: ['official'] },
        { l: ['Contract term', '合同期限'], v: G1.termYears + '<small> yr</small>', d: ['from each COD', '自各项目投运起'], b: ['official'] },
        { l: ['Investment per MW', '每MW投资'], v: sarM(E.capexPerMW), d: [usdKWh(E.capexPerMW) + ' all-in at the peg', '按联系汇率全包' + usdKWh(E.capexPerMW)], b: ['official'] },
        { l: ['SSA fee', '储能服务协议付费'], v: L(['Unpublished', '未公布']), d: ['gate SA-1', '研究缺口SA-1'], cls: 'warn', b: ['public'] },
        { l: ['Group 2 bids due', '第二组截标'], v: '12 Nov 2026', d: ['3 GW / 12 GWh, 27 prequalified', '3GW/12GWh，27家通过预审'], b: ['public'] },
        { l: ['Break-even fee at 7%', '7%下盈亏平衡付费'], v: sarM(M.breakEven[1].fee) + '<small>/MW/yr</small>', d: ['on SPPC\'s own investment', '基于SPPC自身投资'], b: ['calc'] },
      ] },
      { t: 'warn', text: M.seedWarn },
      { t: 'walk', items: [
        ['01', ['Overview', '总览'], ['What is the house view today?', '当前总体判断是什么？'], 'home'],
        ['02', ['Market evolution', '市场演进'], ['How did Saudi Arabia start buying storage?', '沙特如何开始采购储能？'], 'story'],
        ['03', ['Revenue stack', '收入结构'], ['What does the SSA say, and what does it not?', '储能服务协议规定了什么、未规定什么？'], 'capacity'],
        ['04', ['Asset design', '资产设计'], ['Why four hours?', '为何四小时？'], 'duration'],
        ['05', ['Underwriting', '项目承销'], ['Who builds the connection?', '谁建设并网？'], 'grid'],
        ['06', ['Portfolio application', '组合应用'], ['What must the fee be?', '付费须达到多少？'], 'portfolio'],
      ] },
      { t: 'why', text: [
        'For a fund the question is not whether the structure is right — it is — but whether the fee clears its cost of capital on a US$145/kWh build. At 7% that takes about SAR 270k/MW a year. When a fee is published, this market enters the engine the same day.',
        '对基金而言，问题不在于结构是否合适 — 结构合适 — 而在于在每kWh 145美元的造价下，付费能否覆盖其资本成本。按7%计约需每MW每年27万里亚尔。一旦付费公布，本市场当日即进入引擎。',
      ], sig: [['Structure right, price unknown', '结构合适，价格未知']] },
      { t: 'src', src: SRC.group1Award, use: ['The Group 1 award', '第一组授标'] },
    ] },
  ] });

  // ---------------- Market story -------------------------------------------
  SEC_B.story = () => ({ head: ['How Saudi Arabia got here — storage bought like solar', '沙特的演进 — 像采购光伏一样采购储能'], blocks: [
    { t: 'card', mt: false, title: ['How the market got here', '市场如何演变至此'], badges: ['official'], blocks: [
      { t: 'timeline', items: M.timeline },
      { t: 'why', text: [
        'SPPC runs storage the way it runs its solar rounds: it picks the sites, prequalifies bidders and signs a long contract with the winner. A national target of ' + M.target2030GWh + ' GWh by 2030 against 20 GWh in SPPC\'s two groups says more rounds follow.',
        'SPPC按光伏轮次的方式采购储能：自行选址、资格预审并与中标方签订长期合同。2030年全国目标' + M.target2030GWh + 'GWh，而SPPC两组仅20GWh，意味着后续还有更多轮次。',
      ] },
      { t: 'src', src: SRC.renewableVision, use: ['The national ledger', '全国储能台账'] },
    ] },
  ] });

  // ---------------- The SSA ---------------------------------------------------
  SEC_B.capacity = () => ({ head: ['The Storage Services Agreement — what is known', '储能服务协议 — 已知内容'], blocks: [
    { t: 'card', mt: false, title: ['The terms', '条款'], badges: ['official', 'public'], live: false, blocks: [
      { t: 'table', head: [['Term', '条款'], ['What is known', '已知内容'], ['Source', '来源']], rows: [
        [{ b: ['Buyer', '买方'] }, ['SPPC, the Principal Buyer, under the Ministry of Energy', 'SPPC（主买方），隶属能源部'], 'SPPC'],
        [{ b: ['Model', '模式'] }, ['Build-own-operate; the winner develops, finances, builds, owns and runs it', '建设-拥有-运营；中标方负责开发、融资、建设、拥有与运营'], 'SPPC'],
        [{ b: ['Term', '期限'] }, ['15 years from each project\'s COD', '自各项目投运起15年'], 'ACWA / Saudi Energy'],
        [{ b: ['Payment', '付费'] }, ['A fee for availability, as reported; the formula is not public', '据报道为可用性付费；公式未公开'], 'gate SA-1'],
        [{ b: ['Price', '价格'] }, ['Not disclosed for any Group 1 project', '第一组各项目均未披露'], 'gate SA-1'],
        [{ b: ['Indexation', '指数化'] }, ['Not disclosed', '未披露'], 'gate SA-2'],
        [{ b: ['Market revenue', '市场收入'] }, ['None: no wholesale market; SPPC is the single buyer', '无：不存在批发市场；SPPC为单一买方'], ['Market structure', '市场结构']],
      ] },
      { t: 'why', text: [
        'Everything a lender needs is here except the number: a state counterparty for fifteen years, no merchant exposure, and the buyer choosing and connecting the site. Under the platform\'s financing conventions that is debt at 1.20x cover — once the fee is known.',
        '除价格外，贷款人所需的一切均已具备：十五年国有交易对手、无市场化敞口，且由买方选址并负责并网。按本平台融资惯例，一旦付费已知，可按1.20倍覆盖率举债。',
      ], sig: [['Everything but the number', '万事俱备，只欠价格']] },
      { t: 'src', src: SRC.acwaDisclosure, use: ['Term, stakes, value', '期限、股权与金额'] },
      { t: 'src', src: SRC.group1Summary, use: ['Model and investment', '模式与投资'] },
      { t: 'src', src: SRC.priceGap, use: ['The missing price', '缺失的价格'] },
    ] },
    { t: 'card', title: ['Group 1 awards', '第一组授标'], badges: ['official', 'project'], live: false, blocks: [
      { t: 'table', head: [['Site', '场址'], ['Region', '地区'], ['Consortium', '联合体'], ['Size', '规模']], rows:
        G1.sites.map(s => [{ b: s.name }, s.region, s.owners, s.mw + ' MW / ' + fmtN(s.mwh) + ' MWh']) },
      { t: 'p', text: [
        'SPPC\'s SAR 4.35bn over 2,000 MW is SAR ' + fmtN(E.capexPerMW) + '/MW. The ACWA consortium\'s SAR 3.25bn for its three sites is SAR ' + fmtN(Math.round(G1.acwaThreeSar / 1500)) + '/MW, within 0.4%, which shows the figures are investment, not contract value. ENGIE puts Al Khushaybi at about US$220m.',
        'SPPC的43.5亿里亚尔对应2,000MW，即每MW ' + fmtN(E.capexPerMW) + '里亚尔。ACWA联合体三个场址32.5亿里亚尔，即每MW ' + fmtN(Math.round(G1.acwaThreeSar / 1500)) + '里亚尔，相差0.4%以内，说明这些数字是投资额而非合同金额。ENGIE称Al Khushaybi约2.2亿美元。',
      ] },
      { t: 'src', src: SRC.engineKhushaybi, use: ['Al Khushaybi', 'Al Khushaybi'] },
    ] },
  ] });

  // ---------------- No market -------------------------------------------------
  SEC_B.energy = () => ({ head: ['No wholesale market', '无批发市场'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'p', text: [
        'Saudi Arabia has no wholesale electricity market a battery can trade: SPPC buys, the system operator dispatches, and the storage provider is paid for being available. The merchant line is zero because there is no merchant revenue, not because it is unknown.',
        '沙特不存在储能可参与交易的批发电力市场：SPPC采购、系统运营商调度，储能供应商按可用性获得付费。市场化收入为零是因为不存在市场化收入，而非未知。',
      ] },
      { t: 'why', text: [
        'This is what makes the case all contract: no spread to forecast, no fleet to cannibalise it. The risk moves from price to counterparty and to the fee itself.',
        '这使本案例完全依赖合同：无需预测价差，也无机组蚕食价差。风险由价格转向交易对手及付费本身。',
      ], sig: [['All contract', '完全依赖合同']] },
      { t: 'src', src: SRC.group1Summary, use: ['The buyer and the model', '买方与模式'] },
    ] },
  ] });

  // ---------------- Ancillary --------------------------------------------------
  SEC_B.services = () => ({ head: ['Ancillary services — none open to storage', '辅助服务 — 未向储能开放'], blocks: [
    { t: 'card', badges: ['public'], live: false, blocks: [
      { t: 'p', text: [
        'No ancillary-service market open to independent storage was found. Whatever frequency or reserve service a site provides is inside the availability fee SPPC pays, so the line is zero.',
        '未找到向独立储能开放的辅助服务市场。场址提供的任何调频或备用服务均包含在SPPC支付的可用性付费中，因此该项为零。',
      ] },
    ] },
  ] });

  // ---------------- Duration -------------------------------------------------
  SEC_B.duration = () => ({ head: ['Duration — four hours, because SPPC asks for four', '储能时长 — 四小时，因SPPC要求四小时'], blocks: [
    { t: 'card', badges: ['official'], live: false, blocks: [
      { t: 'p', text: [
        'Every Group 1 and Group 2 site is 500 MW for four hours, 2,000 MWh. The buyer sets the duration, so there is no design choice to sweep: a bidder\'s choices are its block, its oversizing for fade over fifteen years, and its price.',
        '第一组与第二组所有场址均为500MW、四小时、2,000MWh。时长由买方设定，因此不存在可扫描的设计选择：投标方的选择在于电池舱、为十五年衰减而超配的幅度，以及报价。',
      ] },
      { t: 'why', text: [
        'At 2%/yr a four-hour build tests at about 3.0 hours by year fifteen with no augmentation. How the SSA measures availability against that fade is unpublished, and it decides how much a winner oversizes.',
        '按每年2%衰减且不扩容，四小时项目到第十五年约测得3.0小时。储能服务协议如何就此衰减考核可用性尚未公布，而这决定中标方的超配幅度。',
      ], sig: [['Fade against an unpublished test', '衰减对应未公布的考核']] },
      { t: 'src', src: SRC.group2Prequal, use: ['The Group 2 sites', '第二组场址'] },
    ] },
  ] });

  // ---------------- Pipeline -------------------------------------------------
  SEC_B.pipeline = () => ({ head: ['Project pipeline — two groups and a 48 GWh target', '项目管线 — 两组采购与48GWh目标'], blocks: [
    { t: 'card', mt: false, title: ['Group 2', '第二组'], badges: ['public'], live: false, blocks: [
      { t: 'table', head: [['Site', '场址'], ['Region', '地区']], rows: G2.sites.map(s => [{ b: s.name }, s.region]) },
      { t: 'p', text: [
        G2.prequalified + ' prequalified: ' + G2.bidders + '. Bids are due on ' + G2.bidsDue + '.',
        '共' + G2.prequalified + '家通过资格预审：' + G2.bidders + '。截标日期' + G2.bidsDue + '。',
      ] },
      { t: 'why', text: [
        'A first-time entrant reaches this market through a consortium in a round like this one, usually beside a Saudi partner, as ENGIE did with Haji Abdullah Alireza. Group 2 closes in two weeks, so the realistic entry is the next round or a stake in an awarded SPV.',
        '首次进入者通常通过此类轮次的联合体进入本市场，一般与沙特合作方结伴，如ENGIE与Haji Abdullah Alireza。第二组两周后截标，因此现实的进入方式是下一轮次或收购已中标项目公司的股权。',
      ], sig: [['Enter through a consortium', '通过联合体进入']] },
      { t: 'src', src: SRC.group2Prequal, use: ['Sites and bidders', '场址与投标人'] },
      { t: 'src', src: SRC.group2Deadline, use: ['The deadline', '截标时间'] },
    ] },
  ] });

  // ---------------- Grid -----------------------------------------------------
  SEC_B.grid = () => ({ head: ['Grid connection — the buyer picks the site', '并网 — 由买方选址'], blocks: [
    { t: 'card', mt: false, title: ['Interactive Saudi storage map', '沙特储能交互地图'], badges: ['official', 'public'], blocks: [
      { t: 'geo-grid-map', data: gridMapById('sa-grid-map') },
    ] },
    { t: 'congestion', data: congestionFor('sa') },
    { t: 'card', title: ['The transmission system', '输电系统'], badges: ['public'], live: false, blocks: [
      { t: 'p', text: [
        'National Grid SA, part of the Saudi Electricity Company, runs about 93,000 circuit-km from 132 to 380 kV; 380 kV is the backbone. SPPC names each storage site, so a bidder takes the connection the procurement gives it rather than queueing for one.',
        '沙特国家电网公司（隶属沙特电力公司）运营132至380kV线路约93,000回路公里；380kV为主干网。SPPC指定每个储能场址，因此投标方采用采购提供的并网条件，而无需排队申请。',
      ] },
      { t: 'src', src: SRC.transmission, use: ['The grid', '电网'] },
    ] },
  ] });

  // ---------------- Portfolio ------------------------------------------------
  SEC_B.portfolio = () => ({
    head: ['Portfolio / Fund View — what the fee must be', '组合与基金视图 — 付费须达到多少'],
    cap: ['No Lab case: the Lab prices a contract line and this market\'s is unpublished. The break-even below is what an SSA must pay to return a given cost of capital on SPPC\'s own investment.',
          '无测算情景：投资测算对合同收入定价，而本市场的合同价格未公布。下表为储能服务协议须支付多少，方能在SPPC自身投资上回报给定的资本成本。'],
    blocks: [
      { t: 'card', mt: false, title: ['Break-even fee', '盈亏平衡付费'], badges: ['calc'], live: false, blocks: [
        { t: 'table', head: [['Cost of capital, nominal', '名义资本成本'], ['Fee, SAR/MW-yr', '付费（里亚尔/MW/年）'], ['US$/kW-month', '美元/kW/月']], num: [1, 2], rows:
          M.breakEven.map(b => [fmtPct(b.rate * 100, 0), fmtN(Math.round(b.fee)), (b.fee / K.sarPerUsd / 1000 / 12).toFixed(2)]) },
        { t: 'p', text: [
          'Capital recovery of SAR ' + fmtN(E.capexPerMW) + '/MW over fifteen years at each rate, plus SAR ' + fmtN(E.opexPerMW) + '/MW opex. Against ENGIE\'s lower figure the 7% fee would be SAR ' + fmtN(Math.round(K.low * 0.1098 + E.opexPerMW)) + '.',
          '每MW ' + fmtN(E.capexPerMW) + '里亚尔在十五年内按各利率回收，另加每MW ' + fmtN(E.opexPerMW) + '里亚尔运维。若按ENGIE较低的投资额，7%下的付费为' + fmtN(Math.round(K.low * 0.1098 + E.opexPerMW)) + '里亚尔。',
        ] },
        { t: 'ic', b: ['Screening conclusion: ', '筛选结论：'], text: [
          'A Saudi decision turns on one document, the fee. With it the case is a fifteen-year state contract with no merchant leg, lent against at 1.20x. Without it there is nothing to rank, which is why the market is registered but not in the engine.',
          '沙特的投资决策取决于一份文件，即付费水平。有了它，本案例就是十五年国有合同、无市场化收入，可按1.20倍覆盖率融资。没有它则无从排名，这正是本市场已登记但未进入引擎的原因。',
        ] },
      ] },
      { t: 'card', title: ['Investment Committee gates — what must be true before capital is released', '投委会门槛 — 资金拨付前必须成立的条件'], badges: ['calc'], live: false, blocks: [
        { t: 'gates', items: [
          { n: ['Gate 1 — The fee', '门槛1 — 付费水平'], d: ['An SSA price from an award, a financial-close filing or the agreement itself.', '来自授标、融资关闭披露或协议本身的储能服务协议价格。'], c: 'critical', s: ['Gate SA-1', '研究缺口SA-1'] },
          { n: ['Gate 2 — Indexation and the availability test', '门槛2 — 指数化与可用性考核'], d: ['Whether the fee is nominal, and how fade over fifteen years is measured.', '付费是否为名义值，以及十五年衰减如何考核。'], c: 'serious', s: ['Gate SA-2', '研究缺口SA-2'] },
          { n: ['Gate 3 — A consortium seat', '门槛3 — 联合体席位'], d: ['Prequalification in the next round beside a Saudi partner, or a stake in an awarded SPV.', '与沙特合作方在下一轮次通过资格预审，或收购已中标项目公司股权。'], c: 'serious', s: ['Route in', '进入路径'] },
          { n: ['Gate 4 — Tax on the way out', '门槛4 — 退出税负'], d: ['Dividend withholding and treaty relief for a foreign owner.', '外资业主的股息预提税与税收协定减免。'], c: 'warn', s: ['Gate SA-5', '研究缺口SA-5'] },
        ] },
      ] },
    ] });

  // ---------------- Data & methodology ---------------------------------------
  SEC_B.data = () => ({ head: ['Data and methodology', '数据与方法'], blocks: [
    { t: 'card', mt: false, title: ['Open gates', '待关闭的研究缺口'], badges: ['official'], live: false, blocks: [
      { t: 'table', head: ['Gate', 'What it decides', 'What closes it'], rows: [
        [{ b: ['SA-1', 'SA-1'] }, ['Whether the market enters the engine', '本市场能否进入引擎'], ['An SSA price', '储能服务协议价格']],
        [{ b: ['SA-2', 'SA-2'] }, ['Indexation and the payment formula', '指数化与付费公式'], ['The SSA text', '储能服务协议文本']],
        [{ b: ['SA-3', 'SA-3'] }, ['Import duty on the block', '电池舱进口关税'], ['ZATCA\'s schedule for 8507.60', 'ZATCA 8507.60税目']],
        [{ b: ['SA-4', 'SA-4'] }, ['Opex', '运维成本'], ['A Saudi operating benchmark', '沙特运维基准']],
        [{ b: ['SA-5', 'SA-5'] }, ['Tax on dividends', '股息税'], ['Withholding and treaty relief', '预提税与协定减免']],
        [{ b: ['SA-6', 'SA-6'] }, ['Primary SPPC pages', 'SPPC一手页面'], ['SPPC\'s site, read from another network', '从其他网络读取SPPC官网']],
        [{ b: ['SA-7', 'SA-7'] }, ['Voltage levels', '电压等级'], ['National Grid SA', '沙特国家电网公司']],
        [{ b: ['SA-8', 'SA-8'] }, ['Local content', '本地化要求'], ['SPPC tender rules', 'SPPC招标规则']],
      ] },
    ] },
    { t: 'card', title: ['Core formulas', '核心公式'], badges: ['calc'], live: false, blocks: [
      { t: 'table', head: [['Quantity', '指标'], ['Formula', '公式']], rows: [
        [{ b: ['Capex', '资本开支'] }, 'SAR 4.35bn ÷ 2,000 MW = ' + fmtC(E.capexPerMW) + '/MW = US$145/kWh at 3.75'],
        [{ b: ['Quoted block, landed', '报价电池舱到岸'] }, '(73.45 × 1.05 + 0.768 + 1.5) × 81.25/70 × 4.203 = SAR ' + K.quoteBlockKWh.toFixed(2) + '/kWh — ' + fmtPct(K.quoteBlockKWh * 4000 / E.capexPerMW * 100, 0) + ' of SPPC\'s total, so not used'],
        [{ b: ['Break-even fee', '盈亏平衡付费'] }, 'capex × r ÷ (1 − (1 + r)^−15) + opex'],
      ] },
      { t: 'src', src: SRC.peg, use: ['The peg', '联系汇率'] },
      { t: 'src', src: SRC.incomeTax, use: ['Income tax and zakat', '所得税与天课'] },
    ] },
    { t: 'card', title: ['Bilingual glossary', '双语术语表'], badges: ['calc'], live: false, blocks: [
      { t: 'glossary' },
    ] },
  ] });

  return SECTIONS;
}
