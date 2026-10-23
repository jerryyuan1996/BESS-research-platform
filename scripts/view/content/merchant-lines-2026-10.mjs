/* ---------------------------------------------------------------------------
   The analyst changes that go with docs/merchant-lines-plan-2026-10.md, signed
   off by the analyst on 2026-10-23 ("accept all four recommendations"):

     - Romania: the best design moves from four hours to two, so `ro-mer-4h`
       becomes `ro-mer-2h`; the fund call re-quotes it; the thesis names
       Romania's own build as the risk;
     - Poland: the best design moves from one hour to four, so `pl-cap-1h`
       becomes `pl-cap-4h`; the grant awardees become `pl-grant-4h`, priced
       with the cohort's 37.9% grant and carrying the fund's own call
       (decision 4); the calls and thesis re-quote the re-seeded merchant line;
     - Italy: no toll play; the trigger `it-first-toll-price` joins the fund
       call's changes-if (decision 3);
     - the asset-return grades the engine's ranking moved, and every rank quote.

     node scripts/view/content/merchant-lines-2026-10.mjs --check | --apply
   --------------------------------------------------------------------------- */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createViewStore } from '../writer.mjs';

const analyst = { kind: 'analyst' };
const AS_OF = '2026-10-23';
const ruled = (en, zh) => [`Ruled by the analyst on ${AS_OF} with the merchant-lines plan: ${en}`, `分析师于${AS_OF}依市场化收入方案裁定：${zh}`];

/* Hold IRR rank among the fifteen priced markets after the re-seed, and the
   grade the view test derives from it: 6 − ceil(rank × 5 / 15). */
const RANK = {
  wa: ['First', '第一', 5, '19.8%'],
  it: ['Second', '第二', 5, '14.6%'],
  de: ['Fourth', '第四', 4, '13.9%'],
  ro: ['Fifth', '第五', 4, '13.7%'],
  ie: ['Sixth', '第六', 4, '9.0%'],
  pl: ['Seventh', '第七', 3, '7.4%'],
  gb: ['Eighth', '第八', 3, '4.5%'],
  nem: ['Ninth', '第九', 3, '4.5%'],
  caiso: ['Tenth', '第十', 2, '3.2%'],
  jp_kyushu: ['Eleventh', '第十一', 2, '2.9%'],
  jp_tokyo: ['Twelfth', '第十二', 2, '2.8%'],
  jp_hokkaido: ['Thirteenth', '第十三', 1, '2.5%'],
  pjm: ['Fourteenth', '第十四', 1, '2.4%'],
};

const unpoint = ({ play: _p, ...rest }) => rest;

export async function merchantLineChanges(store){
  const lift = [], rest = [];
  const ro = await store.read('ro'), pl = await store.read('pl'), it = await store.read('it');

  /* ---- Romania ---- */
  lift.push({ market: 'ro', path: 'verdicts.infraFund', author: analyst, to: { ...unpoint(ro.verdicts.infraFund), asOf: AS_OF },
    reason: ruled('the play pointer is lifted while the play moves from four hours to two.', '投资方案由四小时改为两小时期间，暂时解除结论与方案的关联。') });
  const roOld = ro.plays['ro-mer-4h'];
  rest.push({ market: 'ro', path: 'plays.ro-mer-4h', author: analyst, to: null,
    reason: ruled('four hours is no longer the best design.', '四小时已不再是最佳设计。') });
  rest.push({ market: 'ro', path: 'plays.ro-mer-2h', author: analyst,
    reason: ruled('re-seeded on observed day-ahead value with Romania\'s own fleet path, two hours is the best design.', '按实际日前价值及罗马尼亚自身储能增长路径重新设定后，两小时是最佳设计。'),
    to: { ...roOld, id: 'ro-mer-2h', hours: 2, asOf: AS_OF,
      label: ['Merchant · 2h · operating, with an optimiser floor', '市场化 · 2小时 · 在运资产，附优化商保底'],
      why: ['Two hours is the best design here (13.7% hold, 14.9% exit at the merchant yield); four hours gives up about 30% of its value as Romania\'s own fleet doubles.',
        '两小时是这里的最佳设计（按市场化收益率测算持有期回报13.7%、退出回报14.9%）；随着罗马尼亚自身储能规模翻倍，四小时设计损失约30%的价值。'],
      action: { text: ['Find operating two-hour assets with an optimiser floor, or a seller who will put one in; after the grant call closes on 30 October, check which projects won.',
        '寻找附带优化商保底的两小时在运资产，或愿意补签保底的卖方；10月30日补贴申报截止后，核查哪些项目获得补贴。'], due: roOld.action.due } } });
  const roFund = ro.verdicts.infraFund;
  rest.push({ market: 'ro', path: 'verdicts.infraFund', author: analyst,
    reason: ruled('the merchant line comes down a fifth on Romania\'s own build; the call stands on the two-hour play.', '受罗马尼亚自身建设影响，市场化收入下调五分之一；结论维持，改为针对两小时方案。'),
    to: { ...roFund, play: 'ro-mer-2h', asOf: AS_OF,
      where: ['An operating two-hour asset with an optimiser floor', '附带优化商保底的两小时在运资产'],
      because: [
        { dimension: 'assetReturn', text: ['Two hours is the best design here at the merchant yield: 13.7% hold, 14.9% exit.', '两小时是这里的最佳设计，按市场化收益率测算：持有期13.7%，退出14.9%。'] },
        roFund.because[1],
      ],
      despite: ['Beyond the floor nothing is secured, Romania\'s own fleet doubles this year and compresses the spread, and frequency-reserve revenue is saturating.',
        '保底之外没有任何锁定收入，罗马尼亚自身储能规模今年翻倍并压缩价差，且频率备用收入正趋于饱和。'] } });
  rest.push({ market: 'ro', path: 'thesis', author: analyst,
    reason: ruled('the thesis names Romania\'s own build as the risk and re-quotes the best design.', '投资逻辑点明罗马尼亚自身建设是风险，并重新引用最佳设计。'),
    to: ['Wide day-ahead spreads and nothing contracted, with a home fleet that doubles this year. Bulgaria\'s batteries mostly stay behind the border; Romania\'s own build takes about 17% off the two-hour value by 2027. Two hours is the best design, at 13.7% hold, and a negotiated floor is how a fund holds it.',
      '日前价差宽但没有任何合同化收入，且本国储能规模今年翻倍。保加利亚的电池大多被边境阻隔；罗马尼亚自身的建设到2027年将使两小时价值减少约17%。两小时是最佳设计，持有期回报13.7%；基金应通过谈定的保底持有资产。'] });

  /* ---- Poland ---- */
  lift.push({ market: 'pl', path: 'verdicts.infraFund', author: analyst, to: { ...unpoint(pl.verdicts.infraFund), asOf: AS_OF },
    reason: ruled('the play pointer is lifted while the play moves from one hour to four.', '投资方案由一小时改为四小时期间，暂时解除结论与方案的关联。') });
  const plOld = pl.plays['pl-cap-1h'];
  rest.push({ market: 'pl', path: 'plays.pl-cap-1h', author: analyst, to: null,
    reason: ruled('one hour is no longer the best design.', '一小时已不再是最佳设计。') });
  rest.push({ market: 'pl', path: 'plays.pl-cap-4h', author: analyst,
    reason: ruled('re-seeded on PSE\'s own day-ahead prices, capacity at four hours is the best design.', '按PSE自身日前价格重新设定后，四小时容量市场是最佳设计。'),
    to: { ...plOld, id: 'pl-cap-4h', hours: 4, asOf: AS_OF,
      label: ['Capacity market · 4h · ready-to-build', '容量市场 · 4小时 · 具备开工条件'],
      why: ['Four hours on an earlier seventeen-year capacity contract is the engine\'s best design at 9.8% hold, and it still loses value at the platform\'s yields; an uncontracted four-hour project returns 7.4%.',
        '持有早期十七年容量合同的四小时设计是引擎的最佳设计，持有期回报9.8%，但按本平台收益率仍损失价值；无合同的四小时项目回报7.4%。'] } });
  rest.push({ market: 'pl', path: 'plays.pl-grant-4h', author: analyst,
    reason: ruled('the NFOŚiGW awardees are a cohort a fund can buy, priced with the cohort\'s 37.9% average grant (decision 4).', '国家环保基金补贴获得者是基金可收购的批次，按该批次37.9%的平均补贴比例定价（决定4）。'),
    to: { id: 'pl-grant-4h', label: ['Grant-funded merchant · 4h · ready-to-build', '获补贴市场化 · 4小时 · 具备开工条件'],
      route: 'mer', hours: 4, stage: 'ready-to-build', grantPct: 37.9,
      why: ['The 169 projects in NFOŚiGW\'s 2025 storage cohort carry a 37.9% average grant (PLN 3.735bn of grants on PLN 9.847bn of cost); merchant four hours with that grant returns 17.1% hold.',
        '国家环保基金2025年储能批次的169个项目平均补贴比例为37.9%（总成本PLN 98.47亿、补贴PLN 37.35亿）；按此补贴，四小时市场化设计持有期回报17.1%。'],
      action: { text: ['List cohort projects from the NFOŚiGW ranking list of 12 December 2025 whose owners might sell before the end-2028 completion deadline, and check which also hold a capacity contract, since a grant reduces that payment.',
        '从国家环保基金2025年12月12日排名清单中，列出业主可能在2028年底完工期限前出售的批次项目，并核查哪些同时持有容量合同，因为补贴会减少该项付费。'], due: null },
      calls: { infraFund: {
        archetype: 'infraFund', call: 'opportunistic', route: 'ready-to-build',
        where: ['A project in NFOŚiGW\'s 2025 grant cohort', '国家环保基金2025年补贴批次中的项目'],
        because: [
          { dimension: 'assetReturn', text: ['With the cohort\'s 37.9% grant, merchant four hours returns 17.1% hold and is worth about $200k per MW at the platform\'s yields.', '按该批次37.9%的补贴，四小时市场化设计持有期回报17.1%，按本平台收益率每MW价值约20万美元。'] },
          { dimension: 'policyStability', text: ['The round is awarded and the grants are signed; completion is due by the end of 2028.', '本轮补贴已授予并签约；须于2028年底前完工。'] },
        ],
        despite: ['Merchant revenue carries the whole case, and the curve that compresses it is fitted on Bulgaria, not Poland.', '整个投资逻辑由市场化收入支撑，而压缩该收入的曲线是依据保加利亚而非波兰拟合的。'],
        changesIf: ['pl-capacity-successor-framework'],
        reviewBy: '2027-03-31', author: 'analyst', asOf: AS_OF, lockedUntil: null,
      } },
      author: 'analyst', asOf: AS_OF, lockedUntil: null } });
  const quote7 = ['An uncontracted four-hour project returns 7.4% on the model, below the platform\'s yields.', '未签约的四小时项目模型回报为7.4%，低于本平台收益率。'];
  const plFund = pl.verdicts.infraFund;
  rest.push({ market: 'pl', path: 'verdicts.infraFund', author: analyst,
    reason: ruled('the merchant line is re-seeded from PSE\'s prices; the call stands, on the four-hour capacity play.', '市场化收入按PSE价格重新设定；结论维持，改为针对四小时容量方案。'),
    to: { ...plFund, play: 'pl-cap-4h', asOf: AS_OF,
      because: [{ ...plFund.because[0], text: quote7 }, ...plFund.because.slice(1)] } });
  const plStrat = pl.verdicts.strategic;
  rest.push({ market: 'pl', path: 'verdicts.strategic', author: analyst,
    reason: ruled('the return quote follows the re-seeded merchant line.', '回报引用随重新设定的市场化收入更新。'),
    to: { ...plStrat, asOf: AS_OF, because: [{ ...plStrat.because[0], text: quote7 }, ...plStrat.because.slice(1)] } });
  rest.push({ market: 'pl', path: 'thesis', author: analyst,
    reason: ruled('the thesis follows the re-seeded merchant line and names the grant cohort.', '投资逻辑随重新设定的市场化收入更新，并点明补贴批次。'),
    to: ['No new-entry capacity route, but the day-ahead market pays almost twice what the platform carried. An uncontracted four-hour project returns 7.4%, and every design still sits below the platform\'s yields. A project in the 2025 grant cohort returns 17.1%; an asset holding an earlier seventeen-year contract is worth pricing only below replacement cost.',
      '没有新进入的容量路径，但日前市场的收益几乎是本平台此前所采用水平的两倍。无合同的四小时项目回报7.4%，所有设计仍低于本平台收益率。2025年补贴批次中的项目回报17.1%；持有早期十七年合同的资产，只值得以低于重置成本的价格定价。'] });

  /* ---- Italy ---- */
  rest.push({ market: 'it', path: 'triggers.it-first-toll-price', author: analyst,
    reason: ruled('no toll play; the first disclosed Italian toll price is what would change that (decision 3).', '不设租赁方案；首个公开的意大利租赁价格才会改变这一判断（决定3）。'),
    to: { id: 'it-first-toll-price', kind: 'event', market: 'it',
      label: ['An Italian toll\'s price, or a priced tenor, is disclosed; at the €87k seed a toll returns 5.1% and needs about €158k to match the capacity play',
        '意大利租赁协议的价格或附价格的期限被公开；按€87k的种子值租赁回报为5.1%，需约€158k才能与容量市场方案持平'],
      expected: null, watches: ['assetReturn', 'revenueCertainty'], direction: 'either', source: 'tollPriceGap', effect: null } });
  const itFund = it.verdicts.infraFund;
  rest.push({ market: 'it', path: 'verdicts.infraFund', author: analyst,
    reason: ruled('the toll trigger joins the changes-if, and the rank quote follows the engine.', '租赁触发事件加入变化条件，排名引用随引擎更新。'),
    to: { ...itFund, asOf: AS_OF, changesIf: [...itFund.changesIf, 'it-first-toll-price'],
      because: [{ ...itFund.because[0], text: ['Capacity market at four hours is the best design in Italy and the second-best return on the platform: 14.6% hold, 17.2% exit.',
        '四小时容量市场是意大利的最佳设计，回报在本平台排名第二：持有期14.6%，退出17.2%。'] }, ...itFund.because.slice(1)] } });

  /* ---- the ranking ---- */
  for (const [market, [ordinal, zhOrdinal, grade, irr]] of Object.entries(RANK)){
    const record = (await store.read(market)).grades.assetReturn;
    const reason = [`${ordinal} of fifteen markets on hold IRR, ${irr}.`, `持有期IRR为${irr}，在十五个市场中排${zhOrdinal}。`];
    if (record.grade === grade && record.reason?.[0] === reason[0]) continue;
    rest.push({ market, path: 'grades.assetReturn', author: analyst,
      reason: ruled(`the engine's ranking moved with the Romanian and Polish re-seeds: ${ordinal.toLowerCase()} of fifteen at ${irr}, grade ${grade}.`, `罗马尼亚与波兰重新设定后引擎排名变动：十五个市场中${zhOrdinal}，持有期IRR ${irr}，评级${grade}。`),
      to: { ...record, grade, reason, asOf: AS_OF } });
  }
  return { lift, rest };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const store = createViewStore();
  const { lift, rest } = await merchantLineChanges(store);
  if (process.argv[2] === '--apply'){
    const a = await store.applyBatch(lift, new Date());
    const b = await store.applyBatch(rest, new Date(Date.now() + 1000));
    console.log(`Applied ${a.length + b.length} changes. See view/changelog.jsonl.`);
  } else {
    const prepared = await store.prepareBatch(lift, new Date());
    console.log(`The first ${prepared.length} changes pass the writer's gate; the other ${rest.length} are checked against them when applied. Nothing was written.`);
  }
}
