/* ---------------------------------------------------------------------------
   The analyst changes that go with docs/japan-ltda-repricing-plan.md, signed off
   by the analyst on 2026-10-16 with the plan's eight decisions:

     - Japan's three fund calls: Build position → Opportunistic, on an operating,
       awarded asset bought at a price that clears the hurdle (decision 6);
     - the three plays move to the operating stage that call is about;
     - the three Round 4 triggers quote the battery line trade press reports,
       not the old break-even (decision 7);
     - the asset-return grades the engine's ranking moved, and their reasons:
       Great Britain is sixth of fourteen (grade 3), Hokkaido ninth (grade 2),
       Tokyo and Kyushu re-quote; Great Britain's revenue-certainty reason
       re-quotes 12% (the change file of PR 7, folded in here).

     node scripts/view/content/japan-repricing-2026-10.mjs --check | --apply
   --------------------------------------------------------------------------- */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createViewStore } from '../writer.mjs';

const analyst = { kind: 'analyst' };
const AS_OF = '2026-10-16';
const AREAS = { jp_tokyo: ['Tokyo', '东京'], jp_kyushu: ['Kyushu', '九州'], jp_hokkaido: ['Hokkaido', '北海道'] };
const ruled = (en, zh) => [`Ruled by the analyst on ${AS_OF} with the Japan re-pricing plan: ${en}`, `分析师于${AS_OF}依日本重新定价方案裁定：${zh}`];

/* Hold IRR rank among the fourteen priced markets, seed FX (the ranking the
   view test checks). */
const RANK = { gb: ['Sixth', 3, '5.1%', '第六'], jp_tokyo: ['Seventh', 3, '3.6%', '第七'], jp_kyushu: ['Eighth', 3, '3.5%', '第八'], jp_hokkaido: ['Ninth', 2, '3.4%', '第九'] };

export async function repricingChanges(store){
  const changes = [];
  for (const [market, name] of Object.entries(AREAS)){
    const view = await store.read(market);
    const playId = `${market.replace('_', '-')}-ltda-6h`;
    const play = view.plays[playId];
    const verdict = view.verdicts.infraFund;
    /* The writer validates after every change, and a call must enter at its
       play's stage, so the pointer is lifted while the play moves. */
    const { play: _pointer, ...unpointed } = verdict;
    changes.push({ market, path: 'verdicts.infraFund', author: analyst, to: { ...unpointed, asOf: AS_OF },
      reason: ruled('the play pointer is lifted while the play moves to the operating stage.', '投资方案改为已投运阶段期间，暂时解除结论与方案的关联。') });
    changes.push({ market, path: `plays.${playId}`, author: analyst,
      reason: ruled('the fund call is about an operating, awarded asset, so the play is too.', '基金结论针对已投运的中标资产，因此投资方案亦然。'),
      to: { ...play, stage: 'operating', asOf: AS_OF,
        label: ['Long-term auction award · 9h · operating, awarded', '长期脱碳电源拍卖中标 · 9小时 · 已投运、已中标'],
        why: ['The award is a regulated return: a battery bid may price at most 4.5% pre-tax, which an unlevered fund cannot hold at its yields. It pays only bought at a discount.',
          '中标合同属受监管回报：蓄电池报价可计入的税前回报上限为4.5%，无杠杆基金按其收益率无法持有，仅在折价收购时才有价值。'],
        action: { text: [`Before Round 4 bids close on 3 February 2027, list ${name[0]} award holders that might sell an operating asset, and the price at which each clears a 7.5% secured yield.`,
          `在2027年2月3日第四轮投标截止前，列出可能出售已投运资产的${name[1]}中标方，以及各资产达到7.5%锁定收益率的价格。`], due: '2027-02-03' } } });

    changes.push({ market, path: 'verdicts.infraFund', author: analyst,
      reason: ruled('on METI\'s 4.5% cap on a battery bid\'s return the nine-hour award is worth −$466k to −$510k/MW to an unlevered fund, so the fund buys operating awarded assets at a price that clears, or not at all.',
        '按经产省对蓄电池报价回报4.5%的上限，九小时中标合同对无杠杆基金的价值为每MW −46.6万至−51.0万美元，因此基金仅以达标价格收购已投运的中标资产，否则不投。'),
      to: { ...verdict, call: 'opportunistic', route: 'operating', asOf: AS_OF,
        where: ['An operating, awarded asset bought at a price that clears the hurdle', '以达到门槛收益的价格收购已投运的中标资产'],
        despite: ['The award is bid at a regulated return: METI caps what a battery bid may price at 4.5% pre-tax, so a new nine-hour build loses value at a fund\'s yields, and trade-press estimates put battery awards at ¥12,000–25,000 per awarded kW.',
          '中标合同按受监管回报报价：经产省规定蓄电池报价可计入的税前回报上限为4.5%，因此新建九小时设计按基金收益率会损失价值；行业媒体估计蓄电池中标价为每中标千瓦¥12,000–25,000。'] } });

    const trigger = view.triggers.find(t => t.id === `${market.replace('_', '-')}-ltda-round-4-bids`);
    changes.push({ market, path: `triggers.${trigger.id}`, author: analyst,
      reason: ruled('the trigger quotes the battery line, not a break-even no sponsor can bid.', '触发事件改为引用蓄电池中标线，而非任何发起人都无法报出的盈亏平衡价。'),
      to: { ...trigger, label: ['Long-term decarbonisation auction Round 4 bidding closes; battery awards have cleared at about ¥13,000–25,000 per awarded kW (trade press)',
        '长期脱碳电源拍卖第四轮投标截止；据行业媒体，蓄电池中标价约为每中标千瓦¥13,000–25,000'] } });
  }

  for (const [market, [ordinal, grade, irr, zhOrdinal]] of Object.entries(RANK)){
    const view = await store.read(market);
    const record = view.grades.assetReturn;
    const reason = [`${ordinal} of fourteen markets on hold IRR, ${irr}.`, `持有期IRR为${irr}，在十四个市场中排${zhOrdinal}。`];
    if (record.grade === grade && record.reason[0] === reason[0]) continue;
    changes.push({ market, path: 'grades.assetReturn', author: analyst,
      reason: ruled(`the engine's ranking moved with Japan's re-pricing: ${ordinal.toLowerCase()} of fourteen at ${irr}, grade ${grade}.`, `日本重新定价后引擎排名变动：十四个市场中${zhOrdinal}，持有期IRR ${irr}，评级${grade}。`),
      to: { ...record, grade, reason, asOf: AS_OF } });
  }
  const gb = (await store.read('gb')).grades.revenueCertainty;
  changes.push({ market: 'gb', path: 'grades.revenueCertainty', author: analyst,
    reason: ['The engine now secures 12% of revenue where the reason quoted 10%. Still under 20% for fifteen years, so the grade stands.', '引擎目前锁定12%的收入，而理由引用的是10%。仍属不足20%且锁定十五年，评级不变。'],
    to: { ...gb, reason: ['12% of revenue is secured, for fifteen years.', '12%的收入已锁定，期限十五年。'], asOf: AS_OF } });
  return changes;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  /* Two batches, a moment apart: the writer refuses two changes to one path in
     the same instant, and the calls change twice (pointer lifted, then ruled). */
  const store = createViewStore();
  const all = await repricingChanges(store);
  const lift = all.filter(c => c.path === 'verdicts.infraFund' && !c.to.play);
  const rest = all.filter(c => !lift.includes(c));
  if (process.argv[2] === '--apply'){
    const a = await store.applyBatch(lift, new Date());
    const b = await store.applyBatch(rest, new Date(Date.now() + 1000));
    console.log(`Applied ${a.length + b.length} changes. See view/changelog.jsonl.`);
  } else {
    const prepared = await store.prepareBatch(lift, new Date());
    console.log(`The first ${prepared.length} changes pass the writer's gate; the other ${rest.length} are checked against them when applied. Nothing was written.`);
  }
}
