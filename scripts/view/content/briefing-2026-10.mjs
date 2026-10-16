/* ---------------------------------------------------------------------------
   BRIEFING CONTENT, OCTOBER 2026 — the first theses, plays and ruled calls.

   PR 2 of the guided-experience plan (docs/guided-experience-plan.md). Drafted
   by Claude from the house views already in the repository — each market's
   comparison.js thesis, its dashboard, its verdicts — and from the engine's
   figures on 2026-10-16. NOTHING HERE IS IN THE STORE until the analyst signs
   the sheet off and applies it:

     node scripts/view/draft-briefing-content.mjs --sheet      the sheet, for review
     node scripts/view/draft-briefing-content.mjs --changes <out.json>
     node scripts/view/writer.mjs apply <out.json>              the analyst's door to the store

   The figures quoted in the prose are the engine's on that date and are
   re-derived in the sheet; the pages never print these sentences' numbers as
   live values, they compute their own.

   Every string is an [en, zh] pair. Public sources only: no deal figure and no
   private reason appears here (docs/data-policy.md).
   --------------------------------------------------------------------------- */

export const AS_OF = '2026-10-16';

const stamp = { author: 'analyst', asOf: AS_OF, lockedUntil: null };
const action = (en, zh, due = null) => ({ text: [en, zh], due });

/* ---- theses: the brief's lead, conclusion first ------------------------------------ */

export const THESES = {
  wa: [
    'Capacity-led and closed to small cheques. The Reserve Capacity Mechanism pays for seven hours and capacity is about three-quarters of revenue, the best value per MW on the platform. A fund gets in only behind a strategic sponsor, once Capacity Credits are assigned; build seven hours, because the eighth is capex the market does not pay for.',
    '以容量收入为主，小额出资者难以进入。备用容量机制为七小时付费，容量收入约占总收入的四分之三，每MW价值为本平台最高。基金只能在容量信用分配之后跟随战略投资者进入；建七小时，因为第八小时是市场不付费的资本开支。',
  ],
  nem: [
    'The deepest storage build in the set on the thinnest secured revenue: no capacity market, a tender floor whose level is unpublished, and a merchant spread at a record low as the fleet passed 9,000 MW. At build cost the reference project returns about 3%, so the case is the entry price, not the build. Four hours, on a tender award or a toll.',
    '储能建设规模居各市场之首，锁定收入却最薄：没有容量市场，招标保底水平不公开，且随着储能规模突破9,000MW，市场化价差跌至历史低点。按建设成本测算参考项目回报约3%，因此关键在于进入价格而非新建。四小时，依托招标中标合同或租赁。',
  ],
  gb: [
    'Liquid, financeable and close to saturation. The reference project returns about 5% with a tenth of revenue secured; four hours wins de-rated capacity while two-hour assets still win connections. A fund buys operating assets that carry a toll, not new build.',
    '流动性好、易于融资，但已接近饱和。参考项目回报约5%，仅一成收入被锁定；四小时设计赢得折减后容量，两小时资产仍能拿到并网。基金应收购附带租赁合同的在运资产，而非新建。',
  ],
  de: [
    'Europe\'s most liquid storage market, with no capacity revenue for a four-hour battery. Merchant four hours is the best design at 14.6% hold, and a toll is how a fund secures it at 12.3%. The open risk is the storage grid-fee framework, still a draft.',
    '欧洲流动性最好的储能市场，但四小时电池没有容量收入。纯市场化四小时是最佳设计，持有期回报14.6%；基金可通过租赁锁定收入，回报12.3%。尚未落定的风险是仍为草案的储能电网费框架。',
  ],
  it: [
    'Four routes, and a real spread between them. The capacity market at four hours is the best design here, at 15.4% hold; MACSE\'s fifteen-year contract returns 3–4% unless the marginal MWh costs well under the turnkey price. Terna\'s proposed cut to the four-hour de-rating is the risk to watch.',
    '四条路径并存，且彼此之间差距真实存在。四小时容量市场是这里的最佳设计，持有期回报15.4%；MACSE的十五年合同回报仅3–4%，除非边际MWh成本远低于交钥匙价格。需要关注的风险是Terna拟下调四小时折减系数。',
  ],
  ie: [
    'Capacity-led: a capacity contract secures over half of revenue for ten years, and four hours is the best design. Underwrite capacity and wholesale and drop the system-services line, because DS3 ends at a September 2027 long-stop with no date for its successor.',
    '以容量收入为主：容量合同可在十年内锁定过半收入，四小时是最佳设计。按容量与批发收入承保，不计系统服务收入，因为DS3将于2027年9月的最终截止日结束，而后继机制尚无日期。',
  ],
  ro: [
    'The best raw spreads in the set and nothing contracted. Four hours is the best design and the second-highest value on the platform even at the merchant yield; a negotiated floor is how a fund holds it. Frequency reserves are saturating, so the premium on top fades.',
    '价差为各市场之最，但没有任何合同化收入。四小时是最佳设计，即便按市场化收益率测算，价值也在本平台排名第二；基金应通过谈定的保底持有资产。频率备用正趋于饱和，额外溢价将逐步消失。',
  ],
  pl: [
    'No new-entry route today: the December 2025 auction was the last main auction and no successor is legislated. An uncontracted project returns under 1%. Only an asset holding an earlier seventeen-year contract is worth pricing, and only below replacement cost.',
    '目前没有新进入的路径：2025年12月的拍卖是最后一次主拍卖，后继机制尚未立法。无合同项目回报不足1%。只有持有早期十七年合同的资产值得定价，且仅以低于重置成本的价格。',
  ],
  jp_tokyo: [
    'Financed on a 20-year long-term auction award that secures nearly all revenue, with most trading upside clawed back. The award\'s six-hour floor must hold to year 20, which takes a 9-hour build without augmentation, and at the engine\'s award that build does not pay. Tokyo\'s edge is price capture and connection quality.',
    '依托20年期长期脱碳电源拍卖中标合同融资，几乎锁定全部收入，但大部分交易收益须返还。中标合同的六小时下限须维持到第20年，在不扩容的前提下需9小时装机，而按引擎的中标价该设计无法回本。东京的优势在于价格捕获与并网质量。',
  ],
  jp_kyushu: [
    'The same national 20-year award as Tokyo, in Japan\'s renewable-surplus area: value turns on charging access, curtailment and interconnector capacity. The six-hour floor needs a 9-hour build to hold to year 20.',
    '与东京相同的全国性20年期中标合同，位于日本可再生能源过剩地区：价值取决于充电接入、弃电与联络线容量。六小时下限需9小时装机才能维持到第20年。',
  ],
  jp_hokkaido: [
    'The same national award in Japan\'s export-constrained area: underwrite charging-side headroom and the Hokkaido–Honshu reinforcement. The six-hour floor needs a 9-hour build to hold to year 20.',
    '同样的全国性中标合同，位于日本外送受限地区：承保时应关注充电侧裕度与北海道—本州联络线加强。六小时下限需9小时装机才能维持到第20年。',
  ],
  pjm: [
    'The best-published capacity price on the platform, secured one year at a time, on a reference return of 2.4%. Four hours is the best design as accreditation erodes. Wait for the 2029/30 auction in December 2026 before pricing anything.',
    '本平台公开最充分的容量价格，但只能逐年锁定，参考回报仅2.4%。随着认证系数下降，四小时仍是最佳设计。在2026年12月2029/30交付年拍卖之前，不对任何资产定价。',
  ],
  ercot: [
    'Fastest to connect, hardest to get paid: no capacity payment and a merchant index down about 85% in two years. The model loses money even with a toll, so only an executed toll at a known price makes a case.',
    '并网最快，回款最难：没有容量付费，市场化指数两年内下跌约85%。即便有租赁，模型仍然亏损，因此只有价格明确的已签署租赁才能成立。',
  ],
  caiso: [
    'Substantially a capacity contract with a trading option: resource adequacy carries most revenue and credits exactly four hours. At build cost the reference project returns 3.2%, so buy operating RA-contracted assets only at a price that clears the hurdle, after the 2027 foldback cut.',
    '本质上是附带交易选择权的容量合同：资源充裕度贡献大部分收入，且恰好按四小时计量。按建设成本测算参考项目回报为3.2%，因此只在2027年出力回落下调之后、以达到回报门槛的价格收购持有资源充裕度合同的在运资产。',
  ],
  fi: [
    'Europe\'s clearest fast-reserve market, and already oversupplied: connected storage exceeds the fast-reserve need, so the revenue line is withheld rather than assumed. No capacity contract exists; secured revenue is a floor negotiated project by project. Two hours.',
    '欧洲最清晰的快速备用市场，但已经供过于求：已并网储能超过快速备用需求，因此收入线暂不列示而非假设。没有容量合同；锁定收入只能逐个项目谈保底。两小时。',
  ],
};

/* ---- plays --------------------------------------------------------------------------- */

const play = (id, label, route, hours, stage, why, act, extra = {}) =>
  ({ id, label, route, hours, stage, why, action: act, ...extra, ...stamp });

export const PLAYS = {
  wa: [
    play('wa-cap-7h', ['Reserve Capacity Mechanism · 7h · co-investment', '备用容量机制 · 7小时 · 跟投'], 'cap', 7, 'co-invest',
      ['The mechanism prices a six-hour battery; the seventh hour defends the credit, and the eighth is capex the market does not pay for.',
       '该机制按六小时电池定价；第七小时用于守住容量信用，第八小时则是市场不付费的资本开支。'],
      action('Line up a minority stake behind a strategic sponsor now; commit once Capacity Credits for 2028-29 are assigned.',
        '现在就物色跟随战略投资者的少数股权机会；待2028-29容量年度的容量信用分配后再出资。')),
  ],
  nem: [
    play('nem-ltda-4h', ['Tender award · 4h · operating', '容量投资计划中标 · 4小时 · 在运资产'], 'ltda', 4, 'operating',
      ['A tender award secures most revenue for fifteen years at four hours; at build cost it returns 3.1%, so only a cheaper entry price works.',
       '中标合同可在四小时设计下锁定十五年的大部分收入；按建设成本测算回报仅3.1%，只有更低的进入价格才可行。'],
      action('Screen operating assets holding a tender award; bid only at a price that clears the hurdle, not at build cost.',
        '筛选持有招标中标合同的在运资产；仅以达到回报门槛的价格出价，而非按建设成本。')),
  ],
  gb: [
    play('gb-toll-4h', ['Toll · 4h · operating', '租赁 · 4小时 · 在运资产'], 'toll', 4, 'operating',
      ['A toll is the only way to secure most revenue in a market where the reference case secures a tenth.',
       '在参考情景只锁定一成收入的市场，租赁是锁定大部分收入的唯一途径。'],
      action('Buy only operating assets that carry a toll; read the Gate 2 policy before any greenfield exposure.',
        '只收购附带租赁合同的在运资产；涉足绿地项目前先看清Gate 2政策。')),
    play('gb-cap-4h', ['Capacity Market · 4h · greenfield', '容量市场 · 4小时 · 绿地开发'], 'cap', 4, 'greenfield',
      ['Four hours wins de-rated capacity at the T-4 auction; on the capacity route two to four hours sit within the engine\'s band.',
       '四小时设计在T-4拍卖中赢得折减后容量；在容量路径上，两至四小时均处于引擎的最优区间内。'],
      action('Hold connections that can carry four hours, and enter T-4 with a four-hour design.',
        '保有能承载四小时的并网容量，并以四小时设计参加T-4拍卖。')),
  ],
  de: [
    play('de-toll-4h', ['Toll · 4h · ready-to-build', '租赁 · 4小时 · 具备开工条件'], 'toll', 4, 'ready-to-build',
      ['No capacity revenue exists for a four-hour battery; a five-year toll secures it at 12.3% hold, against 14.6% merchant.',
       '四小时电池没有容量收入；五年期租赁可锁定收入，持有期回报12.3%，纯市场化为14.6%。'],
      action('Shortlist ready-to-build projects with a signed toll or floor; check the storage grid-fee draft before pricing.',
        '筛选已签租赁或保底合同、具备开工条件的项目；定价前核查储能电网费草案。')),
    play('de-mer-4h', ['Merchant · 4h · greenfield', '市场化 · 4小时 · 绿地开发'], 'mer', 4, 'greenfield',
      ['Merchant four hours is the best design in Germany: the fifth and sixth hours earn less than they cost.',
       '纯市场化四小时是德国的最佳设计：第五、第六小时的收益低于其成本。'],
      action('Develop four-hour merchant projects and keep the option to toll at ready-to-build.',
        '开发四小时纯市场化项目，并在具备开工条件时保留签订租赁的选择。')),
  ],
  it: [
    play('it-cap-4h', ['Capacity market · 4h · ready-to-build', '容量市场 · 4小时 · 具备开工条件'], 'cap', 4, 'ready-to-build',
      ['The best design in Italy: 15.4% hold, with a fifteen-year contract on a fifth of revenue.',
       '意大利的最佳设计：持有期回报15.4%，五分之一的收入有十五年合同。'],
      action('Screen ready-to-build capacity-market projects in the south and the islands; price them at a four-hour de-rating of 0.53 as well as 0.67.',
        '筛选南部及海岛地区具备开工条件的容量市场项目；同时按0.53与0.67两种四小时折减系数定价。')),
    play('it-ltda-6h', ['MACSE · 6–7h · awarded, ready-to-build', 'MACSE · 6–7小时 · 已中标、具备开工条件'], 'ltda', 6, 'ready-to-build',
      ['MACSE pays per MWh-year, so winners build long (the first auction\'s fleet averaged 6.68 hours), but on the published capex the design returns 3–4% hold.',
       'MACSE按每MWh每年付费，因此中标者倾向长时设计（首轮中标项目平均6.68小时），但按公开的资本开支测算，该设计持有期回报仅3–4%。'],
      action('Get an EPC price for a marginal MWh on a shared power block before the second auction; the MACSE design pays only well below the €220/kWh turnkey figure.',
        '在第二轮拍卖前向EPC询价共享功率模块上的边际MWh；只有远低于每kWh 220欧元的交钥匙价格，MACSE设计才划算。', '2026-11-24'),
      { calls: { infraFund: {
        archetype: 'infraFund', call: 'opportunistic', route: 'ready-to-build', where: null,
        because: [
          { dimension: 'assetReturn', text: ['On the published €220/kWh capex the MACSE design returns 3–4% hold at six to eight hours.',
            '按公开的每kWh 220欧元资本开支测算，MACSE设计在六至八小时下的持有期回报为3–4%。'] },
          { dimension: 'revenueCertainty', text: ['An award is a fifteen-year contract with the grid operator and secures about 70% of revenue.',
            '中标即获得与电网运营商的十五年合同，可锁定约70%的收入。'] },
        ],
        despite: ['The first auction\'s winners built 6.68 hours on average, so they price the marginal MWh below the published turnkey figure; at that cost the case changes.',
          '首轮中标项目平均为6.68小时，说明其边际MWh成本低于公开的交钥匙价格；按那样的成本，结论会改变。'],
        changesIf: ['it-macse-second-auction'], reviewBy: '2027-03-31', ...stamp,
      } } }),
  ],
  ie: [
    play('ie-cap-4h', ['Capacity market · 4h · ready-to-build', '容量市场 · 4小时 · 具备开工条件'], 'cap', 4, 'ready-to-build',
      ['De-rating rewards four hours, and a capacity contract secures over half of revenue for ten years.',
       '折减系数有利于四小时设计，容量合同可在十年内锁定过半收入。'],
      action('Shortlist projects holding a capacity contract; price them on capacity and wholesale only, with no system-services line after the DS3 long-stop.',
        '筛选持有容量合同的项目；仅按容量与批发收入定价，DS3截止日之后不计系统服务收入。')),
  ],
  ro: [
    play('ro-mer-4h', ['Merchant · 4h · operating, with an optimiser floor', '市场化 · 4小时 · 在运资产，附优化商保底'], 'mer', 4, 'operating',
      ['Four hours is the best design here (19.3% hold, 23.2% exit at the merchant yield); the modelled two hours gives up over a quarter of its value.',
       '四小时是这里的最佳设计（按市场化收益率测算持有期回报19.3%、退出回报23.2%）；模型中的两小时设计损失逾四分之一的价值。'],
      action('Find operating four-hour assets with an optimiser floor, or a seller who will put one in; after the grant call closes on 30 October, check which projects won.',
        '寻找附带优化商保底的四小时在运资产，或愿意补签保底的卖方；10月30日补贴申报截止后，核查哪些项目获得补贴。', '2026-11-30')),
  ],
  pl: [
    play('pl-cap-2h', ['Capacity market · 2h · ready-to-build', '容量市场 · 2小时 · 具备开工条件'], 'cap', 2, 'ready-to-build',
      ['No main auction is planned and the uncontracted reference returns under 1%; on the capacity route, two hours is the engine\'s best design.',
       '目前没有主拍卖计划，无合同的参考项目回报不足1%；在容量路径上，两小时是引擎的最佳设计。'],
      action('Wait for a successor to the main auctions; until then, price only assets holding an earlier seventeen-year contract, and only below replacement cost.',
        '等待主拍卖的后继机制；在此之前，只对持有早期十七年合同的资产定价，且仅以低于重置成本的价格。')),
  ],
  jp_tokyo: [
    play('jp-tokyo-ltda-6h', ['Long-term auction award · 9h installed, holding the 6h floor · awarded', '长期脱碳电源拍卖中标 · 9小时装机，维持6小时下限 · 已中标'], 'ltda', 9, 'ready-to-build',
      ['The long-term auction is how Japanese storage is financed, with 96% of revenue secured; its six-hour floor must still hold in year 20, which takes a 9-hour build.',
       '长期脱碳电源拍卖是日本储能的融资路径，可锁定96%的收入；其六小时下限须在第20年仍然满足，需9小时装机。'],
      action('Before Round 4 bids close on 3 February 2027, list awarded projects whose installed hours hold six hours to year 20.',
        '在2027年2月3日第四轮投标截止前，列出装机时长可在第20年维持六小时的已中标项目。', '2027-02-03')),
  ],
  jp_kyushu: [
    play('jp-kyushu-ltda-6h', ['Long-term auction award · 9h installed, holding the 6h floor · awarded', '长期脱碳电源拍卖中标 · 9小时装机，维持6小时下限 · 已中标'], 'ltda', 9, 'ready-to-build',
      ['The same national award as Tokyo; in Kyushu value turns on charging access and curtailment, and the six-hour floor needs a 9-hour build to hold to year 20.',
       '与东京相同的全国性中标合同；在九州，价值取决于充电接入与弃电情况，六小时下限需9小时装机才能维持到第20年。'],
      action('Before Round 4 bids close on 3 February 2027, list awarded Kyushu projects with firm charging access whose installed hours hold six hours to year 20.',
        '在2027年2月3日第四轮投标截止前，列出充电接入有保障、装机时长可在第20年维持六小时的九州已中标项目。', '2027-02-03')),
  ],
  jp_hokkaido: [
    play('jp-hokkaido-ltda-6h', ['Long-term auction award · 9h installed, holding the 6h floor · awarded', '长期脱碳电源拍卖中标 · 9小时装机，维持6小时下限 · 已中标'], 'ltda', 9, 'ready-to-build',
      ['The same national award; in Hokkaido value turns on charging-side headroom and the Hokkaido–Honshu reinforcement, and the six-hour floor needs a 9-hour build.',
       '同样的全国性中标合同；在北海道，价值取决于充电侧裕度与北海道—本州联络线加强，六小时下限需9小时装机。'],
      action('Before Round 4 bids close on 3 February 2027, list awarded Hokkaido projects with settled charging terms whose installed hours hold six hours to year 20.',
        '在2027年2月3日第四轮投标截止前，列出充电条款已落定、装机时长可在第20年维持六小时的北海道已中标项目。', '2027-02-03')),
  ],
  pjm: [
    play('pjm-cap-4h', ['Capacity auction · 4h · ready-to-build', '容量拍卖 · 4小时 · 具备开工条件'], 'cap', 4, 'ready-to-build',
      ['Four hours is the best capacity design as accreditation erodes; the reference project returns 2.4% on capacity revenue secured one year at a time.',
       '随着认证系数下降，四小时仍是最佳容量设计；参考项目依靠逐年锁定的容量收入，回报仅2.4%。'],
      action('Read the 2029/30 capacity auction in December 2026 for its price and four-hour accreditation; re-price nothing before it.',
        '关注2026年12月2029/30交付年容量拍卖的价格与四小时认证系数；在此之前不重新定价。', '2026-12-31')),
  ],
  ercot: [
    play('ercot-toll-2h', ['Toll · 2h · ready-to-build', '租赁 · 2小时 · 具备开工条件'], 'toll', 2, 'ready-to-build',
      ['No capacity payment exists and the merchant index fell about 85% in two years; a toll is the only secured route, and no ERCOT toll price has been disclosed.',
       '这里没有容量付费，市场化指数两年内下跌约85%；租赁是唯一的锁定收入途径，而ERCOT的租赁价格从未公开。'],
      action('Engage only with an executed toll: get its price and test it against the 2025 realised index before any bid.',
        '只考虑已签署租赁的项目：出价前取得租赁价格，并与2025年实际指数对比检验。')),
  ],
  caiso: [
    play('caiso-cap-4h', ['Resource adequacy · 4h · operating', '资源充裕度 · 4小时 · 在运资产'], 'cap', 4, 'operating',
      ['Resource adequacy credits exactly four hours and carries most revenue; at build cost the reference project returns 3.2%.',
       '资源充裕度恰好按四小时计量，并贡献大部分收入；按建设成本测算，参考项目回报为3.2%。'],
      action('After the January 2027 foldback cut, price operating assets with RA contracts; buy only where the price clears the hurdle.',
        '2027年1月出力回落下调生效后，再为持有资源充裕度合同的在运资产定价；只在价格达到回报门槛时买入。', '2027-01-31')),
  ],
  fi: [
    play('fi-mer-2h', ['Reserves and trading · 2h · ready-to-build, with a negotiated floor', '备用服务与交易 · 2小时 · 具备开工条件，谈定保底'], 'mer', 2, 'ready-to-build',
      ['Reserve markets pay for fast power, not hours, and connected storage already exceeds the fast-reserve need; a negotiated floor is the only secured revenue.',
       '备用市场为快速功率而非时长付费，而已并网储能已超过快速备用需求；谈定的保底是唯一的锁定收入。'],
      action('Price ready-to-build projects only with a negotiated floor in place; read the grid-priority bill due this autumn.',
        '只为已谈定保底的具备开工条件项目定价；关注今年秋季提出的并网优先法案。', '2026-11-30')),
  ],
};

/* ---- the fund's calls -----------------------------------------------------------------
   RULED: the six calls Jerry ruled on 2026-10-16, rewritten whole.
   POINTED: every other fund verdict, unchanged but for the play it names. */

const fund = (patch) => ({ archetype: 'infraFund', where: null, reviewBy: '2027-03-31', ...patch, ...stamp });

export const RULED_FUND_CALLS = {
  it: fund({
    call: 'enter-now', route: 'ready-to-build', play: 'it-cap-4h',
    because: [
      { dimension: 'assetReturn', text: ['Capacity market at four hours is the best design in Italy and the second-best return on the platform: 15.4% hold, 18.4% exit.',
        '四小时容量市场是意大利的最佳设计，回报在本平台排名第二：持有期15.4%，退出18.4%。'] },
      { dimension: 'revenueCertainty', text: ['A capacity-market contract secures a fifth of revenue for fifteen years.',
        '容量市场合同可锁定五分之一的收入，期限十五年。'] },
    ],
    despite: ['Terna proposes cutting the four-hour de-rating from 0.67 to 0.53 for 2028 delivery, a fifth off the capacity line, and four-fifths of revenue stays merchant.',
      'Terna拟将2028年交付的四小时折减系数从0.67下调至0.53，容量收入减少约五分之一，且五分之四的收入仍为市场化收入。'],
    changesIf: ['it-capacity-derating-dy2028'],
  }),
  jp_tokyo: fund({
    call: 'build-position', route: 'ready-to-build', play: 'jp-tokyo-ltda-6h', where: ['An awarded, ready-to-build asset', '已中标且具备开工条件的资产'],
    because: [
      { dimension: 'revenueCertainty', text: ['A long-term auction award secures nearly all revenue for its term, and only for a project that wins one.',
        '长期拍卖中标可在合同期内锁定几乎全部收入，但仅限于中标项目。'] },
      { dimension: 'debtAvailability', text: ['Domestic banks lend against an award.', '本土银行愿意以中标合同为基础提供贷款。'] },
    ],
    despite: ['A six-hour award must still deliver six hours in year 20, which takes a 9-hour build. At the engine\'s award of ¥37,000/kW-year that build loses value, and trade-press estimates put battery awards lower still, at ¥12,000–25,000.',
      '六小时中标合同须在第20年仍能提供六小时，这需要9小时装机。按引擎每千瓦每年37,000日元的中标价，该设计会损失价值；而行业媒体估计电池中标价更低，约为每千瓦12,000至25,000日元。'],
    changesIf: ['jp-tokyo-ltda-round-4-bids'],
  }),
  jp_kyushu: fund({
    call: 'build-position', route: 'ready-to-build', play: 'jp-kyushu-ltda-6h',
    because: [
      { dimension: 'revenueCertainty', text: ['A long-term auction award secures nearly all revenue for its term, and only for a project that wins one.',
        '长期拍卖中标可在合同期内锁定几乎全部收入，但仅限于中标项目。'] },
      { dimension: 'debtAvailability', text: ['Domestic banks lend against an award.', '本土银行愿意以中标合同为基础提供贷款。'] },
    ],
    despite: ['A six-hour award must still deliver six hours in year 20, which takes a 9-hour build. At the engine\'s award of ¥37,000/kW-year that build loses value, and trade-press estimates put battery awards lower still, at ¥12,000–25,000.',
      '六小时中标合同须在第20年仍能提供六小时，这需要9小时装机。按引擎每千瓦每年37,000日元的中标价，该设计会损失价值；而行业媒体估计电池中标价更低，约为每千瓦12,000至25,000日元。'],
    changesIf: ['jp-kyushu-ltda-round-4-bids'],
  }),
  jp_hokkaido: fund({
    call: 'build-position', route: 'ready-to-build', play: 'jp-hokkaido-ltda-6h',
    because: [
      { dimension: 'revenueCertainty', text: ['A long-term auction award secures nearly all revenue for its term, and only for a project that wins one.',
        '长期拍卖中标可在合同期内锁定几乎全部收入，但仅限于中标项目。'] },
      { dimension: 'debtAvailability', text: ['Domestic banks lend against an award.', '本土银行愿意以中标合同为基础提供贷款。'] },
    ],
    despite: ['A six-hour award must still deliver six hours in year 20, which takes a 9-hour build. At the engine\'s award of ¥37,000/kW-year that build loses value, and trade-press estimates put battery awards lower still, at ¥12,000–25,000.',
      '六小时中标合同须在第20年仍能提供六小时，这需要9小时装机。按引擎每千瓦每年37,000日元的中标价，该设计会损失价值；而行业媒体估计电池中标价更低，约为每千瓦12,000至25,000日元。'],
    changesIf: ['jp-hokkaido-ltda-round-4-bids'],
  }),
  nem: fund({
    call: 'opportunistic', route: 'operating', play: 'nem-ltda-4h',
    where: ['An operating asset with an executed tender award, bought at a price that clears the hurdle', '持有已签署招标中标合同的在运资产，且买入价格须达到回报门槛'],
    because: [
      { dimension: 'assetReturn', text: ['At build cost the reference project returns 3.1% hold, so only an entry price below build cost clears a fund\'s hurdle.',
        '按建设成本测算，参考项目持有期回报仅3.1%，只有低于建设成本的进入价格才能达到基金的回报门槛。'] },
      { dimension: 'revenueCertainty', text: ['A tender award secures most of a project\'s revenue for fifteen years, for the projects that win one.',
        '招标中标可为项目锁定十五年的大部分收入，但仅限于中标项目。'] },
      { dimension: 'exitLiquidity', text: ['Operating assets and platforms change hands regularly.', '在运资产与平台交易频繁。'] },
    ],
    despite: ['Lenders finance storage here without recourse and assets trade often, so a fund waiting for a cheap entry competes with many buyers.',
      '这里的贷款人提供无追索融资，资产交易频繁，等待低价进入的基金将面对众多竞争买家。'],
    changesIf: ['nem-successor-scheme-first-round'],
  }),
  caiso: fund({
    call: 'opportunistic', route: 'operating', play: 'caiso-cap-4h',
    where: ['An operating asset holding a resource adequacy contract, bought at a price that clears the hurdle', '持有资源充裕度合同的在运资产，且买入价格须达到回报门槛'],
    because: [
      { dimension: 'assetReturn', text: ['At build cost the reference project returns 3.2% hold, below a fund\'s hurdle.',
        '按建设成本测算，参考项目持有期回报为3.2%，低于基金的回报门槛。'] },
      { dimension: 'revenueCertainty', text: ['A resource adequacy contract secures most revenue for ten years, for a project that holds one.',
        '资源充裕度合同可在十年内锁定大部分收入，但前提是项目已持有该合同。'] },
    ],
    despite: ['The longest-established storage financing market on the platform: debt is available and assets trade.',
      '本平台历史最久的储能融资市场：债务融资可得，资产也有成交。'],
    changesIf: ['caiso-storage-capacity-foldback'],
  }),
  ro: fund({
    call: 'opportunistic', route: 'operating', play: 'ro-mer-4h', reviewBy: '2027-01-31',
    where: ['An operating four-hour asset with an optimiser floor', '附带优化商保底的四小时在运资产'],
    because: [
      { dimension: 'assetReturn', text: ['Four hours is the best design here and the second-highest value on the platform at the merchant yield: 19.3% hold, 23.2% exit.',
        '四小时是这里的最佳设计，按市场化收益率测算价值在本平台排名第二：持有期19.3%，退出23.2%。'] },
      { dimension: 'revenueCertainty', text: ['An optimiser has announced a five-year minimum revenue guarantee for a 127 MW battery, so a floor is a route a fund can buy into.',
        '已有优化商为一个127MW电池宣布五年期最低收入保障，基金可以通过保底路径进入。'] },
    ],
    despite: ['Beyond the floor nothing is secured, the four-hour figure rests on an estimated spread capture, and frequency-reserve revenue is saturating.',
      '保底之外没有任何锁定收入，四小时数据依赖估算的价差捕获率，且频率备用收入正趋于饱和。'],
    changesIf: ['ro-grant-call-close', 'ro-connection-guarantee-order'],
  }),
};

/** Fund verdicts that change only by naming their play. The record is otherwise the one in the store. */
export const POINTED_FUND_CALLS = {
  wa: 'wa-cap-7h', gb: 'gb-toll-4h', de: 'de-toll-4h', ie: 'ie-cap-4h', pl: 'pl-cap-2h',
  pjm: 'pjm-cap-4h', ercot: 'ercot-toll-2h', fi: 'fi-mer-2h',
};

/* ---- new triggers ------------------------------------------------------------------- */

const roundFour = (market) => ({
  id: `${market.replace('_', '-')}-ltda-round-4-bids`, kind: 'event', market,
  label: ['Long-term decarbonisation auction Round 4 bidding closes; a 9h build breaks even at about ¥46,500/kW-year',
    '长期脱碳电源拍卖第四轮投标截止；9小时设计约在每千瓦每年46,500日元的中标价下盈亏平衡'],
  expected: '2027-02-03', watches: ['revenueCertainty'], direction: 'either', source: 'decision-profile', effect: null,
});

export const NEW_TRIGGERS = {
  it: [{
    id: 'it-capacity-derating-dy2028', kind: 'event', market: 'it',
    label: ['Terna decides the four-hour de-rating for 2028 delivery; it has proposed cutting it from 0.67 to 0.53',
      'Terna裁定2028年交付的四小时折减系数；其已提议从0.67下调至0.53'],
    expected: null, watches: ['revenueCertainty', 'assetReturn'], direction: 'down', source: 'derating', effect: null,
  }],
  jp_tokyo: [roundFour('jp_tokyo')],
  jp_kyushu: [roundFour('jp_kyushu')],
  jp_hokkaido: [roundFour('jp_hokkaido')],
};

/* ---- the reasons the changelog will carry -------------------------------------------- */

const ruled = (en, zh) => [`Ruled by the analyst on 2026-10-16: ${en}`, `分析师于2026-10-16裁定：${zh}`];

export const REASONS = {
  thesis: ['Thesis written with the guided-experience plan of 2026-10-16, signed off by the analyst.', '依据2026-10-16的引导式体验方案撰写投资论点，经分析师签核。'],
  play: ['Play added with the guided-experience plan of 2026-10-16, signed off by the analyst.', '依据2026-10-16的引导式体验方案新增投资方案，经分析师签核。'],
  pointer: ['Names the play this call is about.', '注明本结论所针对的投资方案。'],
  trigger: {
    'it-capacity-derating-dy2028': ['Added with the ruling of 2026-10-16: the capacity-market play\'s main risk is Terna\'s proposed de-rating cut.', '随2026-10-16的裁定新增：容量市场方案的主要风险是Terna拟下调折减系数。'],
    'jp-tokyo-ltda-round-4-bids': ['Ruled on 2026-10-16 with the Japan floor plan: the trigger now says what a 9h build needs from the award.', '依2026-10-16日本下限方案裁定：触发事件现注明9小时设计所需的中标价。'],
    'jp-kyushu-ltda-round-4-bids': ['Added with the ruling of 2026-10-16: the auction is national, so each area carries its own copy of the trigger.', '随2026-10-16的裁定新增：该拍卖为全国性，每个区域各自保留一份触发事件。'],
    'jp-hokkaido-ltda-round-4-bids': ['Added with the ruling of 2026-10-16: the auction is national, so each area carries its own copy of the trigger.', '随2026-10-16的裁定新增：该拍卖为全国性，每个区域各自保留一份触发事件。'],
  },
  verdict: {
    it: ruled('the call\'s two reasons came from two routes that cannot be held together. The capacity-market play keeps Enter now; MACSE carries its own call.',
      '原结论的两条理由来自两条不能同时持有的路径。容量市场方案维持"现在进入"；MACSE单独给出结论。'),
    jp_tokyo: ruled('Enter now needs a design that clears the bar today, and the six-hour design fails its floor at year 20.',
      '"现在进入"要求设计今天就达到门槛，而六小时设计在第20年无法满足下限。'),
    jp_kyushu: ruled('the call stands. It now names its play, the Round 4 trigger and the floor the design must hold.',
      '结论维持不变，现注明其投资方案、第四轮拍卖触发事件，以及设计须满足的下限。'),
    jp_hokkaido: ruled('the call stands. It now names its play, the Round 4 trigger and the floor the design must hold.',
      '结论维持不变，现注明其投资方案、第四轮拍卖触发事件，以及设计须满足的下限。'),
    nem: ruled('at about 3% the reference case does not clear a fund\'s hurdle; only an operating asset bought below build cost does.',
      '参考情景回报约3%，达不到基金的回报门槛；只有低于建设成本买入的在运资产才可以。'),
    caiso: ruled('at about 3% the reference case does not clear a fund\'s hurdle; only an operating asset bought below build cost does.',
      '参考情景回报约3%，达不到基金的回报门槛；只有低于建设成本买入的在运资产才可以。'),
    ro: ruled('the second-highest value on the platform at the merchant yield, and an optimiser floor counts as secured revenue under the ruling of 2026-10-10.',
      '按市场化收益率测算价值在本平台排名第二，且根据2026-10-10的裁定，优化商保底计为锁定收入。'),
  },
};
