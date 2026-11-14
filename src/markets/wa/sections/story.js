import {researchHistory} from '../history.js';
import {researchHistoryTimeline} from '../../../components/researchHistoryTimeline.js';
/* ---------------------------------------------------------------------------
   WA Market Story tab, verbatim from the prototype (lines 1624-1867).
   --------------------------------------------------------------------------- */
import { h } from '../../../utils/dom.js';
import { L } from '../../../app/i18n.js';
import { card } from '../../../components/card.js';
import { badge, statusBadge } from '../../../components/badge.js';
import { chip } from '../../../components/chip.js';
import { why } from '../../../components/decisionLogic.js';
import { kpi } from '../../../components/metricCard.js';
import { sectionHead } from '../../../components/sectionHeader.js';
import { sourceDrawer } from '../../../components/sourceDrawer.js';
import { lineChart } from '../../../charts/index.js';
import { navigate } from '../../../app/router.js';
import { NF1, fmtN, fmtA } from '../ui.js';
import { SRC } from '../sources.js';
import { SEED } from '../data/seed.js';
import { RCM_HISTORY } from '../data/rcmHistory.js';
import { WEM_MARKET } from '../data/wemMarket.js';
import { ESOO_BAL } from '../data/kemerton.js';
import { renderWaEconomicsP0 } from '../economicsP0Section.js';
import { waDesignText } from '../lib/design.js';

// ---------------- WA MARKET STORY ----------------
function renderStory(main, { summaryOnly = false } = {}){
  const fullHistory=researchHistory({fmtN,fmtA,NF1});
  sectionHead(main, fullHistory.head,
    fullHistory.cap);


  if (!summaryOnly) renderWaEconomicsP0(main);

  const R = WEM_MARKET.records, CIS = WEM_MARKET.cis;
  const orient = card(['One-minute orientation for a new institutional investor', '机构投资人的一分钟市场定位'], [badge('official'), badge('public'), statusBadge(false)]);
  orient.append(h('div', { class: 'kpis' },
    kpi(L(['WEM market start', 'WEM市场启动']), '2006', { text: L(['SWIS-specific market design with an administered RCM', '针对SWIS的独立市场设计，配套行政化RCM']) }),
    kpi(L(['New WEM go-live', '新WEM上线']), '1 Oct 2023', { text: L(['SCED + five FCESS markets + NAQ', '安全约束经济调度+五类FCESS市场+NAQ']) }),
    kpi(L(['Operating BESS — Q1 2026', '在运储能 — 2026Q1']), fmtN(SEED.fleetMW) + '<small> MW</small>', { text: fmtN(SEED.fleetMWh) + ' MWh (AEMO)' }, [badge('official')]),
    kpi(L(['Storage share of peak demand', '储能占峰值需求份额']), R.peakSharePct + '<small>%</small>',
      { text: L(['record, ' + R.peakShareDate + '; renewables ' + R.renewShareThatDayPct + '% that day', '创纪录，' + R.peakShareDate + '；当日新能源占' + R.renewShareThatDayPct + '%']) }, [badge('public')]),
    kpi(L(['2028-29 capacity balance', '2028-29容量平衡']), '+' + fmtN(SEED.surplusAboveRcr) + '<small> MW</small>', { text: L(['existing + committed vs Peak RCT', '现有+已承诺对峰值RCT']) }, [badge('official')]),
    kpi(L(['2035-36 existing/committed gap', '2035-36现有/已承诺缺口']), fmtN(ESOO_BAL.ecGap3536MW) + '<small> MW</small>', { text: L(['before anticipated projects', '未计预期项目']) }, [badge('official')])));
  orient.append(h('div', { class: 'reco' }, h('b', {}, L(['Institutional conclusion: ', '机构投资结论：'])),
    L(['WA is not a simple merchant-arbitrage market. It is a capacity-backed, isolated system with growing renewable integration needs. Near-term capacity is in surplus and competitive; long-term demand growth and thermal retirement are supportive. The winning project must bridge those two periods without relying on temporary FCESS or price-spread scarcity.',
      '西澳并非单纯的现货套利市场，而是一个由容量机制支撑、孤立运行且可再生能源消纳需求持续增长的系统。近期容量处于盈余且竞争加剧，长期需求增长与火电退役则提供支撑。优质项目必须跨越这两个阶段，而不能依赖暂时性的FCESS或价差稀缺。'])));
  orient.append(why(['Two facts here do the work. Storage already met ' + R.peakSharePct + '% of peak demand on an islanded grid with no interconnector to lean on — so system need is proven, not forecast. But the same grid shows a +' + fmtN(SEED.surplusAboveRcr) + ' MW capacity surplus in 2028-29 turning into a ' + fmtN(Math.abs(ESOO_BAL.ecGap3536MW)) + ' MW deficit by 2035-36. The investment problem in WA is therefore timing, not thesis: an asset must be cheap enough to survive the surplus window and long enough to still be compliant when the deficit arrives.',
    '此处两项事实最为关键。在没有联络线可依赖的孤立电网上，储能已满足峰值需求的' + R.peakSharePct + '% — 系统需求已被证实，而非预测。但同一电网在2028-29呈现+' + fmtN(SEED.surplusAboveRcr) + 'MW容量盈余，至2035-36转为' + fmtN(Math.abs(ESOO_BAL.ecGap3536MW)) + 'MW缺口。因此西澳的投资难题在于时点而非逻辑：资产成本须低到足以穿越盈余窗口，时长须长到缺口到来时仍然合规。'],
    ['Timing risk, not thesis risk', '时点风险而非逻辑风险']));
  main.append(orient);

  // ---- RCM evolution: how the mechanism changed with the market and the technology ----
  const rh = card(fullHistory.cards[0].title, [badge('official'), badge('public')]);
  rh.append(h('div', { class:'story-band' }, h('b', {}, L(fullHistory.cards[0].blocks[0].b)),
    h('p', {}, L(fullHistory.cards[0].blocks[0].text))));
  rh.append(researchHistoryTimeline(RCM_HISTORY.milestones,{owner:'wa',axis:'rcm'}));
  rh.append(why(fullHistory.cards[0].blocks[2].text,
    fullHistory.cards[0].blocks[2].sig));
  /* The front page carries the history inside the orientation: the story band,
     the milestones and their reading, without the supporting charts. */
  if (summaryOnly) {
    rh.querySelector('h3, .ct, .card-title')?.replaceChildren(L(['How the market developed', '市场发展历程']));
    rh.style.marginTop = '14px';
    orient.append(rh);
    return;
  }
  const rhg = h('div', { class:'grid g2', style:'margin-top:12px;' });
  const rhT = card(fullHistory.cards[0].blocks[3].cards[0].title, [badge('final')]);
  rhT.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Capacity years','容量年度'])), h('th', {}, L(['Benchmark technology','基准技术'])), h('th', {}, L(['Class','类别'])))),
    h('tbody', {}, RCM_HISTORY.benchTech.map(r => h('tr', {},
      h('td', {}, h('b', {}, r.p)), h('td', {}, L(r.t)),
      h('td', {}, r.v === 'OCGT' ? chip('warn','OCGT') : r.v === '—' ? '—' : chip('good', r.v))))))));
  rhT.append(h('div', { class:'flow' },
    h('span', { class:'fbox' }, L(['160 MW OCGT + 14 h fuel','160MW OCGT+14小时燃料'])), h('span', { class:'farr' }, '→'),
    h('span', { class:'fbox' }, '200 MW / 800 MWh · 4h'), h('span', { class:'farr' }, '→'),
    h('span', { class:'fbox', style:'border-color:var(--s1);font-weight:var(--fw-medium);' }, '200 MW / 1,200 MWh · 6h · 330 kV')));
  rhT.append(why(fullHistory.cards[0].blocks[3].cards[0].blocks[2].text,
    fullHistory.cards[0].blocks[3].cards[0].blocks[2].sig));
  rhg.append(rhT);
  const rhE = card(fullHistory.cards[0].blocks[3].cards[1].title, [badge('final')]);
  rhE.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Reserve Capacity Cycle','容量周期'])), h('th', { class:'num' }, L(['Trading intervals','交易时段'])), h('th', { class:'num' }, L(['Hours','小时'])), h('th', {}, L(['Effect','影响'])))),
    h('tbody', {}, RCM_HISTORY.esr.map(r => h('tr', {},
      h('td', {}, h('b', {}, L(r.cyc))), h('td', { class:'num' }, r.ti), h('td', { class:'num' }, h('b', {}, r.h + 'h')), h('td', {}, L(r.note))))))));
  lineChart(rhE, { xs: SEED.esrYears, yfmt: v => v + 'h', ymin: 0,
    series: [{ name: ['ESR duration requirement', 'ESR时长要求'], color: 'var(--s1)', vals: SEED.esrPath, step: true }], h: 175 });
  rhE.append(why(fullHistory.cards[0].blocks[3].cards[1].blocks[2].text,
    fullHistory.cards[0].blocks[3].cards[1].blocks[2].sig));
  rhg.append(rhE);
  rh.append(rhg);
  rh.append(sourceDrawer(SRC.rules, ['RCM reform, ESR framework, Peak/Flexible split and the fixed-price election','RCM改革、ESR框架、峰值/灵活拆分及固定价选择权']));
  rh.style.marginTop = '14px';
  main.append(rh);

  const tl = card(fullHistory.cards[1].title, [badge('official')]);
  const events = fullHistory.cards[1].blocks[0].items;
  tl.append(researchHistoryTimeline(events,{owner:'wa',axis:'market'}));
  tl.append(why(fullHistory.cards[1].blocks[1].text,
    fullHistory.cards[1].blocks[1].sig));
  main.append(tl);

  const beforeAfter = card(fullHistory.cards[2].title, [badge('calc')]);
  const ba = fullHistory.cards[2].blocks[0].rows;
  beforeAfter.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Dimension','维度'])), h('th', {}, L(['Before scaled BESS','规模化储能前'])), h('th', {}, L(['After scaled BESS','规模化储能后'])))),
    h('tbody', {}, ba.map(r => h('tr', {}, h('td', {}, h('b', {}, L(r[0]))), h('td', {}, L(r[1])), h('td', {}, L(r[2]))))))));
  beforeAfter.append(why(fullHistory.cards[2].blocks[1].text,
    fullHistory.cards[2].blocks[1].sig));
  main.append(beforeAfter);

  // ---- Who owns WA storage: ownership and strategy taxonomy ----
  const pl = card(['Who owns WA storage — five strategies competing for the same Capacity Credits', '谁持有西澳储能 — 五类策略争夺同一批容量信用'], [badge('public'), statusBadge(false)]);
  pl.append(h('div', { class:'player-grid' }, WEM_MARKET.players.map(p => h('div', { class:'player' },
    h('div', { class:'ptype' }, L(p.type)),
    h('h4', {}, Array.isArray(p.n) ? L(p.n) : p.n),
    h('div', { class:'pmet' }, p.met),
    h('p', {}, L(p.p))))));
  pl.append(h('div', { class:'story-band' }, h('b', {}, L(['Market concentration', '市场集中度'])), h('p', {}, L(WEM_MARKET.concentration))));
  pl.append(why(['Each strategy has a different cost of capital and a different reason to bid, and they all compete for one scarce administered product. A state utility bids to retire coal and can accept a public-service return; a global IPP bids off portfolio debt priced across many assets; an infra platform bids for an operating yield it can refinance. A single-asset sponsor has the highest marginal cost of capital of the group, so it cannot win on price — it has to win on duration compliance, node quality and a contracted floor that the incumbents’ existing 4-hour fleet cannot replicate.',
    '每类策略的资本成本与出价动因各不相同，却都在争夺同一种稀缺的行政化产品。国有电力为退出煤电而出价，可接受公共服务型回报；国际IPP依托跨多资产定价的组合债务出价；基础设施平台为可再融资的运营收益出价。单资产发起人在其中的边际资本成本最高，因此无法在价格上取胜 — 只能靠时长合规、节点质量以及既有4小时机组无法复制的合同保底取胜。'],
    ['You cannot win on cost of capital', '难以在资本成本上取胜']));
  pl.append(sourceDrawer(SRC.mkt, ['Ownership, portfolio scale and strategy positioning from public project and transaction disclosures','所有权、组合规模与策略定位，来自公开项目及交易披露']));
  pl.style.marginTop = '14px';
  main.append(pl);

  // ---- Exit channels and capital recycling ----
  const ex = card(['Exit channels — how capital actually recycles out of Australian storage', '退出渠道 — 资本如何真实从澳洲储能中回收'], [badge('public'), statusBadge(false)]);
  ex.append(h('div', {}, WEM_MARKET.exits.map(e => h('div', { class:'exit' },
    h('div', {}, h('div', { class:'ename' }, L(e.n)), chip('info', L(e.w))),
    h('div', {}, L(e.d), h('div', { class:'ecase' }, h('b', {}, L(['Observed: ','已观察：'])), L(e.c)))))));
  const px = WEM_MARKET.pricing;
  ex.append(h('div', { class:'kpis' },
    kpi(L(['Operating-asset valuation range','已运营资产估值区间']), 'A$' + px.opSystemLo + '–' + px.opSystemHi + '<small>/kWh</small>', { text: L(['system level (DC), from disclosed transactions','系统级（DC），依据已披露交易']) }, [badge('public')]),
    kpi(L(['Fully installed cost (AC), 2025-26','全安装成本（AC），2025-26']), 'A$' + px.acInstalledLo + '–' + px.acInstalledHi + '<small>/kWh</small>', null, [badge('public')]),
    kpi(L(['Battery cost decline, trailing 12 months','电池成本降幅，滚动12个月']), '−' + px.cellDeclinePct + '<small>%</small>', { text: L(['re-prices every unbuilt project','对所有未建项目重新定价']), cls:'down' }, [badge('public')])));
  ex.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Disclosed transaction / build','已披露交易或建设'])), h('th', { class:'num' }, L(['Implied unit price','隐含单价'])), h('th', {}, L(['Stage and caveat','阶段与说明'])))),
    h('tbody', {}, px.points.map(p => h('tr', {}, h('td', {}, L(p.d)), h('td', { class:'num' }, h('b', {}, p.v)), h('td', {}, L(p.s))))))));
  ex.append(why(['The exit specification, not the entry price, is what constrains a WA development today. Every observed route pays for de-risked, contracted, operating or near-operating cash flow — sell-downs are priced off contracted revenue plus a development premium, platform stake sales need seed operating assets, and refinancings need a track record. So the development plan has to be built backwards from that buyer: secure a contracted or floor-supported revenue line and deliverable capacity first, because those are the two things the exit is actually priced on. Note also the spread in implied A$/kWh (~A$350 to ~A$920) is mostly stage and duration, not asset quality — never read a single unit price as a valuation benchmark.',
    '限制当今西澳开发的是退出规格，而非进入价格。所有已观察的路径都为已去风险、已签约、已运营或接近运营的现金流付费 — 出售定价基于合同化收入加开发溢价，平台股权出售需要种子运营资产，再融资需要业绩记录。因此开发计划须从该买方倒推：先锁定合同或保底支撑的收入与可交付容量，因为退出实际就按这两项定价。另需注意隐含A$/kWh的区间（约A$350至约A$920）主要反映阶段与时长差异，而非资产质量 — 切勿将单一单价当作估值基准。'],
    ['Build backwards from the buyer', '从买方倒推开发计划']));
  ex.append(sourceDrawer(SRC.mkt, ['Transaction structures, disclosed consideration and financing packages from public announcements','交易结构、已披露对价及融资包，来自公开公告']));
  ex.style.marginTop = '14px';
  main.append(ex);

  // ---- Long-term holders ----
  const hd = card(['Long-term holders — hold periods, return requirements and what they will buy', '长期持有方 — 持有周期、回报要求与其买入标准'], [badge('public'), statusBadge(false)]);
  hd.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Holder type','持有方类型'])), h('th', {}, L(['Who','代表'])), h('th', {}, L(['Hold period','持有周期'])), h('th', {}, L(['Return requirement','回报要求'])), h('th', {}, L(['Risk appetite','风险偏好'])), h('th', {}, L(['Buys what','买入标准'])))),
    h('tbody', {}, WEM_MARKET.holders.map(r => h('tr', {},
      h('td', {}, h('b', {}, L(r.k))), h('td', {}, L(r.who)), h('td', {}, L(r.hold)),
      h('td', {}, L(r.ret)), h('td', {}, L(r.risk)), h('td', {}, L(r.pref))))))));
  hd.append(h('div', { class:'reco' }, h('b', {}, L(['Where the money ultimately sits: ', '资金的最终归属：'])), L(WEM_MARKET.superFundNote)));
  hd.append(why(['The gap between a 6–10% unlevered IRR for operating contracted assets and the 12–15%+ demanded on development risk is the development margin — and it is only realised by crossing a specific set of gates: capacity credits assigned, NAQ confirmed, connection contracted, COD credible. Each gate cleared moves the asset toward the lower discount rate. This reframes the milestone plan as a valuation plan: sequence spend so that de-risking events land before large non-refundable payments, because the value created is the discount-rate compression, not the construction.',
    '已运营且已签约资产6–10%的无杠杆IRR与开发风险所要求的12–15%以上之间的差额即开发利润 — 且只有跨越一组特定门槛才能实现：容量信用获配、NAQ确认、并网合同签署、COD可信。每跨越一道门槛，资产便向更低折现率靠近。这使里程碑计划实质上成为估值计划：应安排支出节奏，使去风险事件先于大额不可退还付款发生，因为创造价值的是折现率压缩，而非施工本身。'],
    ['Development margin = rate compression', '开发利润=折现率压缩']));
  hd.style.marginTop = '14px';
  main.append(hd);

  const outlook = h('div', { class:'grid g2', style:'margin-top:14px;' });
  const dText = waDesignText();
  const near = card(['Near-term outlook — 2026 to 2029: deliverability decides', '近期展望 — 2026至2029：可交付性决定成败'], [badge('official'), badge('forecast')]);
  near.append(h('div', { class:'kpis' },
    kpi(L(['2028-29 Peak RCT','2028-29峰值RCT']), '6,323<small> MW</small>'),
    kpi(L(['Existing + committed','现有+已承诺']), '6,670<small> MW</small>'),
    kpi(L(['ESR duration','ESR时长']), '7<small> h</small>')));
  near.append(h('div', { class:'story-band' }, h('b', {}, L(['What the market is pricing', '市场正在定价什么'])),
    h('p', {}, L(['Project-delivery timing, NAQ and duration compliance matter more than generic scarcity. New assets compete against operating batteries, committed projects and anticipated projects before the structural deficit arrives.',
      '在结构性缺口出现前，新项目需与在运、已承诺及预期项目竞争，因此项目交付时点、NAQ及时长合规比笼统的稀缺性更重要。']))));
  near.append(h('div', { class:'reco' }, h('b', {}, L(['Underwriting stance: ', '承销立场：'])), L(['Proceed only where Capacity Credits are deliverable, COD is credible and the revenue stack survives lower merchant/FCESS outcomes. Build the engine’s design, ' + dText[0] + ', and take explicit floors or tolls where pricing is acceptable.',
    '仅在容量信用可交付、COD可信且收入结构能承受较低现货/FCESS结果时推进。按引擎设计（' + dText[1] + '）建设，并在价格合理时锁定保底或代工协议。'])));
  near.append(why(['Existing plus committed capacity already exceeds the Peak RCT, and ' + fmtN(ESOO_BAL.existingCommittedBessMW) + ' MW of that is battery. So in the COD window a new asset is not filling a gap — it is displacing a competitor, and only wins credits if it is more compliant (duration) or more deliverable (NAQ) than the marginal alternative. The corollary is that COD date is a pricing input, not a schedule detail: arriving one cycle early or late changes which cohort you are ranked against.',
    '现有加已承诺容量已超过峰值RCT，其中' + fmtN(ESOO_BAL.existingCommittedBessMW) + 'MW为电池。因此在投运窗口内，新资产并非填补缺口，而是替代竞争者，只有在时长更合规或NAQ更可交付时才能取得信用。推论是：投运日期是定价输入而非进度细节 — 提前或延后一个周期，将改变你所被对比的项目批次。'],
    ['Displacement, not gap-filling', '替代而非填补缺口']));

  const long = card(['Long-term outlook — 2030 to 2036: structural need, execution-dependent value', '长期展望 — 2030至2036：结构性需求，但价值取决于执行'], [badge('official'), badge('forecast')]);
  long.append(h('div', { class:'kpis' },
    kpi(L(['2035-36 consumption','2035-36用电量']), '32.1<small> TWh</small>'),
    kpi(L(['2035-36 Peak RCT','2035-36峰值RCT']), '7,454<small> MW</small>'),
    kpi(L(['Thermal exits by 2035-36','截至2035-36火电退出']), '1,661<small> MW</small>')));
  long.append(h('div', { class:'story-band' }, h('b', {}, L(['What creates the opportunity', '机会来源'])),
    h('p', {}, L(['Industrial and electrification demand growth, coal/gas retirement, longer evening peaks and renewable drought coverage create a durable role for long-duration storage.',
      '工业及电气化需求增长、煤气机组退役、更长的晚峰及新能源低出力时段保障，为长时储能创造持续角色。']))));
  long.append(h('div', { class:'reco' }, h('b', {}, L(['Underwriting stance: ', '承销立场：'])), L(['Do not capitalise the full long-term deficit into today’s valuation. Treat it as terminal strategic support, while current value must still be justified by contracted capacity, location, capex and execution.',
    '不应将全部长期缺口直接资本化进当前估值。可将其视为终值层面的战略支撑，但当前价值仍须由已锁定容量、区位、造价及执行能力证明。'])));
  long.append(why(['A ' + fmtN(Math.abs(ESOO_BAL.ecGap3536MW)) + ' MW existing-and-committed shortfall by 2035-36 with ' + fmtN(ESOO_BAL.thermalExit3536MW) + ' MW of thermal exiting is the reason the asset class has a terminal value at all — but it arrives 6–7 years after a 2028-29 COD, which is beyond most debt tenors and well beyond any contracted floor. Underwrite it as terminal value and refinancing capacity, not as base-case revenue: it supports a residual and an exit multiple, and it is the reason to buy augmentation optionality now rather than more MWh now.',
    '至2035-36年' + fmtN(Math.abs(ESOO_BAL.ecGap3536MW)) + 'MW的现有及已承诺缺口，叠加' + fmtN(ESOO_BAL.thermalExit3536MW) + 'MW火电退出，是该资产类别具备终值的根本原因 — 但其出现时点在2028-29投运后6–7年，超出多数债务期限，也远超任何合同保底期。应将其作为终值与再融资能力承销，而非基准情景收入：它支撑残值与退出倍数，也是当下应购买增容选择权而非直接增加MWh的原因。'],
    ['Terminal value, not base case', '终值而非基准情景']));
  outlook.append(near,long); main.append(outlook);

  // ---- Key uncertainties that break the storyline ----
  const unc = card(['What breaks this storyline — three monitored uncertainties', '哪些因素会打破该叙事 — 三项须持续监测的不确定性'], [badge('public'), badge('calc')]);
  unc.append(h('div', { class:'tbl-wrap' }, h('table', {},
    h('thead', {}, h('tr', {}, h('th', {}, L(['Uncertainty','不确定性'])), h('th', {}, L(['Why it matters','影响机制'])))),
    h('tbody', {}, WEM_MARKET.uncertainties.map(u => h('tr', {},
      h('td', {}, h('b', {}, L([u[0], u[1]]))), h('td', {}, L([u[2], u[3]]))))))));
  unc.append(why(['These three are listed together because each one attacks a different leg of the case and none of them is diversifiable inside a single WA asset. Coal-exit slippage extends the surplus (hits capacity revenue), revenue-mix migration to arbitrage raises earnings volatility (hits DSCR headroom), and supplier concentration is a 20-year warranty and augmentation dependency (hits the option value you are paying for). Practical response: contract the floor, size debt off capacity only, and put augmentation and LTSA obligations in the OEM contract rather than the model.',
    '将这三项并列，是因为它们各自攻击方案的不同支柱，且在单一西澳资产内均无法分散。煤电退出延后会延长盈余（打击容量收入）；收入结构向套利迁移会提高盈利波动（挤压DSCR裕度）；供应链集中构成20年期的质保与增容依赖（削弱所支付的期权价值）。实务应对：锁定合同保底、仅以容量收入安排债务规模、并将增容与长期服务义务写入OEM合同而非模型。'],
    ['None of the three is diversifiable', '三者均不可分散']));
  unc.style.marginTop = '14px';
  main.append(unc);

  const bridge = card(['Bridge to the detailed dashboard — the investor’s question map', '进入详细看板 — 投资人的问题地图'], [badge('calc')]);
  const map = [
    ['RCM & Capacity', '容量机制', 'Is the Capacity Year short, balanced or surplus — and what is a realistic RCP?', 'rcm'],
    ['Energy Arbitrage', '现货套利', 'What remains after charging cost, losses, degradation and cannibalisation?', 'energy'],
    ['FCESS', '辅助服务', 'Is system-service revenue scarce, saturated or contracted?', 'fcess'],
    ['Storage Duration', '储能时长', 'What duration is accredited, economic and expandable?', 'duration'],
    ['Project Pipeline', '项目管线', 'Which competing projects are real and likely to reach COD?', 'pipeline'],
    ['Grid Connection', '并网与电网约束', 'Can nameplate MW become registered, deliverable and revenue-producing MW?', 'grid'],
    ['Portfolio', '组合与基金视图', 'Which screened opportunity clears every gate at asset level?', 'portfolio'],
  ];
  bridge.append(h('div', { class:'walk' }, map.map(x => h('button', { class:'walk-step', onclick:()=>{navigate('/markets/western-australia/'+x[3]);window.scrollTo(0,0);} },
    h('span', { class:'n' }, L([x[0],x[1]])), h('b', {}, L([x[2], ({'容量机制':'容量年度是短缺、均衡还是过剩，合理RCP是多少？','现货套利':'扣除充电成本、损耗、衰减及收益蚕食后还剩多少？','辅助服务':'系统服务收入处于稀缺、饱和还是已合约化状态？','储能时长':'什么时长可认证、具经济性且可扩展？','项目管线':'哪些竞争项目真实且可能按期投运？','并网与电网约束':'铭牌MW能否转化为已注册、可交付及产生收入的MW？','投资测算':'项目能否承受综合下行情景及融资约束？','组合与基金视图':'所筛选机会中哪一个在资产层面通过全部门槛？'})[x[1]]]))))));
  bridge.append(h('div', { class:'cap', style:'margin-top:10px;' }, L(['Official history / outlook sources: Energy Policy WA, ERA (BRCP determinations and WEM Procedures), AEMO WEM ESOO and Quarterly Energy Dynamics. Market-structure, transaction and holder observations are compiled from public project and transaction disclosures and are badged as public-source, not official.',
    '官方历史及展望来源：西澳能源政策部门、ERA（BRCP决定及WEM程序）、AEMO WEM ESOO及季度能源动态。市场结构、交易及持有方信息汇编自公开项目与交易披露，标注为公开来源而非官方数据。'])));
  bridge.append(h('div', { class:'flow' },
    h('a', { class:'fbox', href:'https://www.wa.gov.au/organisation/energy-policy-wa/wholesale-electricity-market', target:'_blank', rel:'noopener' }, 'WA WEM'),
    h('a', { class:'fbox', href:'https://www.wa.gov.au/organisation/energy-policy-wa/energy-transformation-strategy', target:'_blank', rel:'noopener' }, 'Energy Transformation Strategy'),
    h('a', { class:'fbox', href:'https://www.wa.gov.au/organisation/energy-policy-wa/new-market-implementation', target:'_blank', rel:'noopener' }, 'New WEM'),
    h('a', { class:'fbox', href:'https://www.aemo.com.au/energy-systems/electricity/wholesale-electricity-market-wem/wem-forecasting-and-planning/wem-electricity-statement-of-opportunities-wem-esoo', target:'_blank', rel:'noopener' }, '2026 WEM ESOO'),
    h('a', { class:'fbox', href:'https://www.aemo.com.au/energy-systems/major-publications/quarterly-energy-dynamics-qed', target:'_blank', rel:'noopener' }, 'AEMO QED')));
  bridge.append(why(['The eight questions are ordered by how much each one can move the answer, and the first four are all about revenue durability rather than project quality. That ordering is the argument for the sequence itself: there is no point diligencing a site before establishing that the revenue stack survives to its COD. Work the map top-down and stop at the first question the project cannot answer — that is the cheapest possible diligence outcome.',
    '这八个问题按各自对结论的影响程度排序，且前四个均关乎收入的持续性而非项目质量。这一排序正是该顺序本身的论据：在确认收入结构能延续至投运之前，对场址进行尽调并无意义。应自上而下推进，并在项目无法回答的第一个问题处停止 — 这是成本最低的尽调结果。'],
    ['Stop at the first unanswered question', '在首个无法回答处停止']));
  main.append(bridge);
}

export { renderStory };
