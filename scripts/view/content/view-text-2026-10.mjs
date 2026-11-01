/* ---------------------------------------------------------------------------
   The analyst changes that go with docs/view-text-plan-2026-10-31.md, ruled
   by the analyst on 2026-10-31 (option A on all four questions):

     - 1A: no model result (return, value, payback, secured share) in analyst
       prose. Theses, play reasons, verdict text, score notes and actions say
       what the card's target test or the design grid's ranking says, in words;
     - 2A: grade reasons keep their figures, with the basis and date added;
     - 3A: ten weak-source and stale items (ERCOT, GB, Romania, Poland, PJM,
       CAISO), including a dated trigger for PJM's 2030/31 rating;
     - 4A: the guard is tests/view-prose.test.js, not this script.

   Italy waits for the ruling on its call (CF-IT-01) and is not touched.
   No model figure, grade, call or rank moves.

     node scripts/view/content/view-text-2026-10.mjs --check | --apply
   --------------------------------------------------------------------------- */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createViewStore } from '../writer.mjs';

const analyst = { kind: 'analyst' };
const AS_OF = '2026-10-31';
const ruled = (en, zh) => [`Ruled by the analyst on ${AS_OF} with the view-text plan: ${en}`, `分析师于${AS_OF}依观点文本方案裁定：${zh}`];
const NO_RESULTS = ruled('model results leave analyst prose; the text says what the card\'s target test or the design grid\'s ranking says (1A).',
  '模型结果不再写入分析师文字；文字只陈述卡片目标回报检验或设计表排名的结论（1A）。');
const DATED = ruled('the grade reason keeps its figure, with its basis and date (2A).', '评级理由保留原数字，并注明口径与日期（2A）。');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dateEn = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const dateZh = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${y}年${m}月${d}日`; };

/* Replace every [en, zh] pair whose English is `oldEn`. Refuses if none is found,
   so a stale script never writes over text the analyst has since changed. */
function swap(record, oldEn, pair, where){
  let found = 0;
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    for (const key of Object.keys(node)){
      const v = node[key];
      if (Array.isArray(v) && v.length === 2 && v[0] === oldEn && typeof v[1] === 'string'){ node[key] = [...pair]; found++; }
      else visit(v);
    }
  };
  visit(record);
  if (!found) throw new Error(`${where}: text not found — ${oldEn.slice(0, 70)}…`);
  return record;
}

/* Replace a fragment inside both sides of a pair, refusing if either is missing. */
function frag(pair, [oldEn, newEn], [oldZh, newZh], where){
  if (!pair[0].includes(oldEn)) throw new Error(`${where}: English fragment not found — ${oldEn.slice(0, 60)}`);
  if (!pair[1].includes(oldZh)) throw new Error(`${where}: Chinese fragment not found — ${oldZh.slice(0, 30)}`);
  return [pair[0].replace(oldEn, newEn), pair[1].replace(oldZh, newZh)];
}

/* ---- 1A: theses, written in full in the plan ------------------------------ */
const THESES = {
  caiso: ['Substantially a capacity contract with a trading option: resource adequacy carries most revenue and credits exactly four hours. At build cost the reference project falls short of the fund\'s target, so buy operating RA-contracted assets only at a price that clears it, once the 2027 foldback cut is sized.',
    '本质上是附带交易选择权的容量合同：资源充裕度贡献大部分收入，且恰好按四小时计量。按建设成本测算，参考项目达不到基金目标回报，因此须待2027年出力回落下调的幅度明确后，以达到目标回报的价格收购持有资源充裕度合同的在运资产。'],
  de: ['Europe\'s most liquid storage market, with no capacity revenue for a four-hour battery. Merchant four hours is the best design, and a toll is how a fund secures it, giving up some return for certainty; at build cost the toll case falls short of the fund\'s target. The open risk is the storage grid-fee framework, still a draft.',
    '欧洲流动性最好的储能市场，但四小时电池没有容量收入。纯市场化四小时是最佳设计；基金可通过租赁锁定收入，以部分回报换取确定性；按建设成本测算，租赁情形达不到基金目标回报。尚未落定的风险是仍为草案的储能电网费框架。'],
  ercot: ['Fastest to connect, hardest to get paid: no capacity payment, and battery revenue has fallen steeply as the fleet grew, on the market monitor\'s figures. Even with a toll the model falls short of the fund\'s target, so only an executed toll at a known price makes a case.',
    '并网最快，回款最难：没有容量付费，且据市场监测机构数据，随着储能规模扩大，电池收入大幅下滑。即便有租赁，模型测算仍达不到基金目标回报，因此只有价格明确的已签署租赁才能成立。'],
  gb: ['Liquid, financeable and close to saturation. The reference project falls short of the fund\'s target, with little of its revenue secured; four hours wins de-rated capacity while two-hour assets still win connections. A fund buys operating assets that carry a toll, not new build.',
    '流动性好、易于融资，但已接近饱和。参考项目达不到基金目标回报，且锁定的收入很少；四小时设计赢得折减后容量，两小时资产仍能拿到并网。基金应收购附带租赁合同的在运资产，而非新建。'],
  pjm: ['The best-published capacity price on the platform, secured one year at a time, and the reference project falls short of the fund\'s target. Four hours is the best design as accreditation erodes. Wait for the 2029/30 auction in December 2026 before pricing anything.',
    '本平台公开最充分的容量价格，但只能逐年锁定，参考项目达不到基金目标回报。随着认证系数下降，四小时仍是最佳设计。在2026年12月2029/30交付年拍卖之前，不对任何资产定价。'],
  ro: ['Wide day-ahead spreads and nothing contracted, with a home fleet that doubles this year; Romania\'s own build is the main risk to the two-hour value. Two hours is the best design on merchant revenue alone; a fund enters only with a negotiated optimiser floor, whose terms are not yet priced here.',
    '日前价差宽但没有任何合同化收入，且本国储能规模今年翻倍；罗马尼亚自身的建设是两小时价值的主要风险。仅按市场化收入测算，两小时是最佳设计；基金只有在谈定优化商保底后才进入，而该保底条款尚未在此定价。'],
};

/* Theses where only one clause changes. */
const THESIS_FRAGMENTS = {
  fi: [['Two hours, 14.6% hold at build cost.', 'Two hours is the best design, and at build cost it clears the fund\'s target.'],
    ['两小时，按建设成本持有期IRR为14.6%。', '两小时是最佳设计，按建设成本测算可达到基金目标回报。']],
  ie: [['a capacity contract secures over half of revenue for ten years, and four hours is the best design.', 'a capacity contract secures most of its revenue for ten years, and four hours is the best design on the model.'],
    ['容量合同可在十年内锁定过半收入，四小时是最佳设计。', '容量合同可在十年内锁定大部分收入，按模型测算四小时是最佳设计。']],
  nem: [['At build cost the reference project returns 8.2% hold, a thin margin over a fund\'s yields that rests on modelled CIS floor-and-ceiling terms no award publishes.',
    'At build cost the reference project only just clears the platform\'s yields, on modelled CIS floor-and-ceiling terms no award publishes, and falls short of the fund\'s target.'],
  ['按建设成本测算参考项目持有期回报8.2%，仅略高于基金收益率要求，且依赖于平台建模、而任何中标合同均未公开的CIS上下限条款。',
    '按建设成本测算，参考项目仅勉强达到本平台收益率要求，且依赖于平台建模、任何中标合同均未公开的CIS上下限条款，达不到基金目标回报。']],
  wa: [['Capacity is roughly three-quarters of year-one revenue.', 'Capacity carries most of year-one revenue.'],
    ['容量收入约占首年收入的四分之三。', '容量收入占首年收入的大部分。']],
};

/* ---- 1A: play reasons and actions; 3A items inside plays ----------------- */
const PLAY_TEXT = {
  caiso: { 'caiso-cap-4h': [
    ['Resource adequacy credits exactly four hours and carries most revenue; at build cost the reference project returns 3.2%.',
      ['Resource adequacy credits exactly four hours and carries most revenue; at build cost the reference project falls short of the fund\'s target.',
        '资源充裕度恰好按四小时计量，并贡献大部分收入；按建设成本测算，参考项目达不到基金目标回报。']],
    ['After the January 2027 foldback cut, price operating assets with RA contracts; buy only where the price clears the hurdle.',
      ['Once the 2027 foldback cut is sized, price operating assets with RA contracts; buy only where the price clears the hurdle.',
        '待2027年出力回落下调的幅度明确后，再为持有资源充裕度合同的在运资产定价；只在价格达到回报门槛时买入。']],
  ] },
  de: { 'de-toll-4h': [
    ['No capacity revenue exists for a four-hour battery; a five-year toll secures it at 11.7% hold, against 13.9% merchant.',
      ['No capacity revenue exists for a four-hour battery; a five-year toll secures it, at a lower hold return than merchant.',
        '四小时电池没有容量收入；五年期租赁可锁定收入，持有期回报低于纯市场化。']],
  ] },
  ercot: { 'ercot-toll-2h': [
    ['No capacity payment exists and the merchant index fell about 85% in two years; a toll is the only secured route, and no ERCOT toll price has been disclosed.',
      ['No capacity payment exists and battery revenue has fallen steeply as the fleet grew; a toll is the only secured route, and no ERCOT toll price has been disclosed.',
        '这里没有容量付费，且随着储能规模扩大，电池收入大幅下滑；租赁是唯一的锁定收入途径，而ERCOT的租赁价格从未公开。']],
  ] },
  gb: { 'gb-toll-4h': [
    ['A toll is the only way to secure most revenue in a market where the reference case secures a tenth.',
      ['A toll is the only way to secure most revenue in a market where the reference case secures little.',
        '在参考情景锁定收入很少的市场，租赁是锁定大部分收入的唯一途径。']],
  ] },
  ie: { 'ie-cap-4h': [
    ['De-rating rewards four hours, and a capacity contract secures over half of revenue for ten years.',
      ['De-rating rewards four hours, and a capacity contract secures most of its revenue for ten years.',
        '折减系数有利于四小时设计，容量合同可在十年内锁定大部分收入。']],
  ] },
  nem: { 'nem-ltda-4h': [
    ['A tender award secures most revenue for fifteen years at four hours; at build cost it returns 8.2% hold and only just clears a fund\'s yields, on CIS terms the platform assumes.',
      ['A tender award secures most revenue for fifteen years at four hours; at build cost it only just clears the platform\'s yields, on CIS terms the platform assumes, and falls short of the fund\'s target.',
        '中标合同可在四小时设计下锁定十五年的大部分收入；按建设成本测算，仅勉强达到本平台收益率要求，依赖于平台假设的CIS条款，且达不到基金目标回报。']],
  ] },
  pjm: { 'pjm-cap-4h': [
    ['Four hours is the best capacity design as accreditation erodes; the reference project returns 2.4% on capacity revenue secured one year at a time.',
      ['Four hours is the best capacity design as accreditation erodes; on capacity revenue secured one year at a time, the reference project falls short of the fund\'s target.',
        '随着认证系数下降，四小时仍是最佳容量设计；依靠逐年锁定的容量收入，参考项目达不到基金目标回报。']],
    ['Read the 2029/30 capacity auction in December 2026 for its price and four-hour accreditation; re-price nothing before it.',
      ['Read the 2029/30 capacity auction in December 2026 for its price, and the 2030/31 four-hour rating due 11 January 2027; re-price nothing before both.',
        '关注2026年12月2029/30交付年容量拍卖的价格，以及2027年1月11日公布的2030/31交付年四小时认证系数；两者公布之前不重新定价。']],
  ] },
  pl: {
    'pl-cap-4h': [
      ['Four hours on an earlier seventeen-year capacity contract is the engine\'s best design at 9.8% hold, and it still loses value at the platform\'s yields; an uncontracted four-hour project returns 7.4%.',
        ['Four hours on an earlier seventeen-year capacity contract is the engine\'s best design, and it still loses value at the platform\'s yields; an uncontracted four-hour project does worse.',
          '持有早期十七年容量合同的四小时设计是引擎的最佳设计，但按本平台收益率仍损失价值；无合同的四小时项目更差。']],
    ],
    'pl-grant-4h': [
      ['The 169 projects in NFOŚiGW\'s 2025 storage cohort carry a 37.9% average grant (PLN 3.735bn of grants on PLN 9.847bn of cost); merchant four hours with that grant returns 17.1% hold.',
        ['Projects in NFOŚiGW\'s 2025 storage cohort receive grants covering about 38% of cost on average; with that grant, merchant four hours is the engine\'s best Polish design, but at build cost it falls short of the fund\'s target.',
          '国家环保基金2025年储能批次项目的补贴平均约占成本的38%；按此补贴，四小时市场化设计是引擎在波兰的最佳设计，但按建设成本测算达不到基金目标回报。']],
      ['With the cohort\'s 37.9% grant, merchant four hours returns 17.1% hold and is worth about $200k per MW at the platform\'s yields.',
        ['With the cohort\'s grant of about 38% of cost, merchant four hours clears the platform\'s yields on the model, but at build cost it falls short of the fund\'s target.',
          '按该批次约占成本38%的补贴，四小时市场化设计按模型测算可达到本平台收益率要求，但按建设成本测算达不到基金目标回报。']],
    ],
  },
  ro: { 'ro-mer-2h': [
    ['Two hours is the best design here on merchant revenue alone, and the figures shown price no floor; four hours gives up about 30% of its value as Romania\'s own fleet doubles.',
      ['Two hours is the best design here on merchant revenue alone, and the figures shown price no floor; Romania\'s own fleet growth compresses every duration\'s value.',
        '仅按市场化收入测算，两小时是这里的最佳设计，所示数据未计入任何保底；罗马尼亚自身储能规模的增长会压缩各时长设计的价值。']],
  ] },
};

/* Play text where only a fragment changes. */
const PLAY_FRAGMENTS = {
  fi: { 'fi-toll-2h': { field: 'why',
    en: [' On the engine this is the best design here, 14.6% hold with half of year-one revenue secured.', ' On the engine this is the best design here.'],
    zh: ['在引擎测算中这是本市场的最佳设计，持有期IRR 14.6%，第一年收入的一半被锁定。', '在引擎测算中这是本市场的最佳设计。'] } },
  ercot: { 'ercot-toll-2h': { field: 'action',
    en: ['test it against the 2025 realised index before any bid.', 'test it against the market monitor\'s 2025 battery revenue before any bid.'],
    zh: ['并与2025年实际指数对比检验。', '并与市场监测机构公布的2025年电池收入对比检验。'] } },
};

/* ---- 1A: verdict text in every lens ---------------------------------------- */
const SHORT_OF_TARGET = ['On the model the reference project falls short of this investor\'s target.', '按模型测算，参考项目达不到该类投资者的目标回报。'];
const VERDICT_TEXT = {
  caiso: {
    strategic: [['The reference project returns 3.2% on the model.', SHORT_OF_TARGET]],
    foreignFirstTimer: [['The reference project returns 3.2% on the model.', SHORT_OF_TARGET]],
    infraFund: [['At build cost the reference project returns 3.2% hold, below a fund\'s hurdle.',
      ['At build cost the reference project falls short of a fund\'s target.', '按建设成本测算，参考项目达不到基金的目标回报。']]],
  },
  gb: {
    infraFund: [['Only a tenth of revenue is secured in the reference case, so only assets that carry a toll.',
      ['Little revenue is secured in the reference case, so only assets that carry a toll.', '参考情景下锁定的收入很少，因此只做带租赁合同的资产。']]],
    developer: [['In the transmission register 177 GW is queued against 3.6 GW built, and the rules protecting queued batteries are under review.',
      ['In the transmission register, as cited when graded on 23 October 2026, 177 GW is queued against 3.6 GW built, and the rules protecting queued batteries are under review.',
        '输电登记册中（按2026年10月23日评级时引用），排队容量177GW而已建成仅3.6GW，对排队电池项目的保护规则正在复议。']]],
  },
  ie: Object.fromEntries(['strategic', 'infraFund', 'foreignFirstTimer'].map(lens => [lens, [[
    'A capacity contract secures over half of revenue for ten years, for a project that holds one.',
    ['A capacity contract secures most of a project\'s revenue for ten years, if the project holds one.', '容量合同可在十年内锁定大部分收入，但前提是项目已取得该合同。']]]])),
  nem: {
    ...Object.fromEntries(['strategic', 'foreignFirstTimer', 'developer'].map(lens => [lens, [[
      'The modelled return on the reference project is 8.2%, on CIS terms no award publishes, so the price paid and the contract actually held decide the case.',
      ['The reference project\'s modelled return rests on CIS terms no award publishes, so the price paid and the contract actually held decide the case.',
        '参考项目的模型回报所依据的CIS条款未见于任何公开的中标合同，因此成败取决于买入价格与实际持有的合同。']]]])),
    infraFund: [['At build cost the reference project returns 8.2% hold, worth about +$34k per MW at a fund\'s yields: a thin margin that rests on assumed CIS terms.',
      ['At build cost the reference project only just clears a fund\'s yields, a thin margin that rests on assumed CIS terms, and it falls short of the fund\'s target.',
        '按建设成本测算，参考项目仅勉强达到基金收益率要求，利润空间很薄且依赖于假设的CIS条款，达不到基金目标回报。']]],
  },
  pjm: {
    strategic: [['The reference project returns 2.4% on the model.', SHORT_OF_TARGET]],
    foreignFirstTimer: [['The reference project returns 2.4% on the model.', SHORT_OF_TARGET]],
    infraFund: [['The reference project returns 2.4% on the model.',
      ['On the model the reference project falls short of the fund\'s target.', '按模型测算，参考项目达不到基金目标回报。']]],
  },
  pl: Object.fromEntries(['strategic', 'infraFund'].map(lens => [lens, [[
    'An uncontracted four-hour project returns 7.4% on the model, below the platform\'s yields.',
    ['An uncontracted four-hour project loses value on the model at the platform\'s yields.', '未签约的四小时项目按模型测算、按本平台收益率会损失价值。']]]])),
  wa: {
    strategic: [['About three-quarters of revenue comes from the capacity mechanism, with a floor at half the benchmark price: the most secured revenue of the four markets.',
      ['Most revenue comes from the capacity mechanism, with a floor at half the benchmark price: the most secured revenue of the four markets.',
        '大部分收入来自容量机制，并有基准价一半的保底：在四个市场中锁定收入最高。']]],
  },
};

/* Score notes where one clause changes. */
const SCORE_NOTES = {
  gb: { lens: 'infraFund', en: ['the toll 4h play is still about −$238k/MW at a fund\'s yields', 'the toll 4h play still loses value at a fund\'s yields'],
    zh: ['按基金收益率，租赁4小时方案每MW仍约为−23.8万美元', '按基金收益率，租赁4小时方案仍然损失价值'] },
  nem: { lens: 'infraFund', en: [' and hold IRR went from 3.1% to 4.5%;', ', which raised the hold return;'],
    zh: ['，持有期IRR由3.1%升至4.5%；', '，持有期回报随之上升；'] },
  jp_tokyo: { lens: 'infraFund', en: ['and it is: 96% of revenue for twenty years.', 'and it is: nearly all revenue for twenty years.'],
    zh: ['二十年内锁定96%的收入。', '二十年内锁定几乎全部收入。'] },
};

/* ---- 2A: grade reasons keep the figure, with basis and date ---------------- */
const ASSET_RETURN = ['caiso', 'de', 'ercot', 'gb', 'ie', 'jp_hokkaido', 'jp_kyushu', 'jp_tokyo', 'nem', 'pjm', 'pl', 'ro', 'wa'];
const REVENUE_CERTAINTY = ['caiso', 'gb', 'ie', 'jp_hokkaido', 'jp_kyushu', 'jp_tokyo', 'nem', 'pjm', 'wa'];

function datedAssetReturn(reason, asOf, where){
  const en = reason[0].replace(/on hold IRR, (−?[\d.]+%)\.$/, (_, x) => `on the design grid's hold IRR, ${x} (${dateEn(asOf)}).`);
  const zh = reason[1].replace(/^持有期IRR为(−?[\d.]+%)，/, (_, x) => `按设计表测算的持有期IRR为${x}（${dateZh(asOf)}），`);
  if (en === reason[0] || zh === reason[1]) throw new Error(`${where}: asset-return reason not in the expected form`);
  return [en, zh];
}
function datedRevenueCertainty(reason, asOf){
  const lower = reason[0].replace(/^([A-Z])(?=[a-z])/, (c) => c.toLowerCase());
  return [`On the design grid (${dateEn(asOf)}), ${lower}`, `按设计表测算（${dateZh(asOf)}），${reason[1]}`];
}

/* ---- 3A: grade reasons and triggers ---------------------------------------- */
const GRADE_EDITS = {
  ercot: { policyStability: (r) => frag(r,
    [', and data-centre interconnections have been paused for audit since August 2026;', ';'],
    ['；数据中心并网自2026年8月起因审计而暂停。', '。'], 'ercot policyStability') },
  gb: { gridScarcity: () => ['In the transmission register, as cited when graded on 23 October 2026, 177 GW is queued against 3.6 GW built; Ofgem\'s September 2026 figures count prioritised projects instead. The rules protecting queued batteries are under review.',
    '输电登记册中（按2026年10月23日评级时引用），排队储能容量177GW，而已建成仅3.6GW；Ofgem 2026年9月的数据统计的是获优先安排的项目，口径不同。对排队电池项目的保护规则正在复议。'] },
  pjm: { gridScarcity: () => ['PJM accepted 60.0 GW of storage into Cycle 1 of its reformed interconnection process (3 August 2026), against 1.9 GW of batteries awarded agreements in the first transition cycle.',
    'PJM于2026年8月3日将60.0GW储能纳入其改革后并网流程的第一周期，而首个过渡周期中获得并网协议的电池项目仅1.9GW。'] },
  caiso: { policyStability: (r) => {
    if (!r[1].endsWith('条款不变。')) throw new Error('caiso policyStability: Chinese reason not in the expected form');
    return frag(r, ['contracts already signed are bilateral and keep their terms.', 'contracts already signed are bilateral and keep their terms, but the 2027 change applies to all storage, so the capacity a signed contract can sell may fall.'],
      ['条款不变。', '条款不变；但2027年的调整适用于所有储能，因此已签合同可出售的容量仍可能下降。'], 'caiso policyStability');
  } },
};

const PJM_RATING = 'pjm-elcc-2030-31-rating';

export async function viewTextChanges(store){
  const changes = [];

  for (const [market, to] of Object.entries(THESES)){
    changes.push({ market, path: 'thesis', author: analyst, reason: NO_RESULTS, to });
  }
  for (const [market, [en, zh]] of Object.entries(THESIS_FRAGMENTS)){
    const view = await store.read(market);
    changes.push({ market, path: 'thesis', author: analyst, reason: NO_RESULTS, to: frag(view.thesis, en, zh, `${market} thesis`) });
  }

  const playIds = new Set([...Object.entries(PLAY_TEXT), ...Object.entries(PLAY_FRAGMENTS)].flatMap(([m, plays]) => Object.keys(plays).map(id => `${m}/${id}`)));
  for (const key of playIds){
    const [market, id] = key.split('/');
    const view = await store.read(market);
    let play = structuredClone(view.plays[id]);
    for (const [oldEn, pair] of PLAY_TEXT[market]?.[id] || []) swap(play, oldEn, pair, `${market} ${id}`);
    const f = PLAY_FRAGMENTS[market]?.[id];
    if (f){
      const target = f.field === 'action' ? play.action.text : play.why;
      const next = frag(target, f.en, f.zh, `${market} ${id} ${f.field}`);
      if (f.field === 'action') play.action = { ...play.action, text: next }; else play.why = next;
    }
    changes.push({ market, path: `plays.${id}`, author: analyst, reason: NO_RESULTS, to: { ...play, asOf: AS_OF } });
  }

  const verdictKeys = new Set([...Object.entries(VERDICT_TEXT).flatMap(([m, lenses]) => Object.keys(lenses).map(l => `${m}/${l}`)),
    ...Object.entries(SCORE_NOTES).map(([m, s]) => `${m}/${s.lens}`), `pjm/infraFund`]);
  for (const key of verdictKeys){
    const [market, lens] = key.split('/');
    const view = await store.read(market);
    let verdict = structuredClone(view.verdicts[lens]);
    for (const [oldEn, pair] of VERDICT_TEXT[market]?.[lens] || []) swap(verdict, oldEn, pair, `${market} ${lens}`);
    const note = SCORE_NOTES[market];
    if (note && note.lens === lens) verdict.scoreNote = frag(verdict.scoreNote, note.en, note.zh, `${market} scoreNote`);
    let reason = NO_RESULTS;
    if (market === 'pjm' && lens === 'infraFund'){
      verdict.changesIf = [...verdict.changesIf.filter(id => id !== PJM_RATING), PJM_RATING];
      reason = ruled('model results leave the verdict text (1A), and the 2030/31 four-hour rating joins the changes-if (3A).',
        '结论文字不再写入模型结果（1A），2030/31交付年四小时认证系数加入变化条件（3A）。');
    }
    changes.push({ market, path: `verdicts.${lens}`, author: analyst, reason, to: { ...verdict, asOf: AS_OF } });
  }

  const gradeEdits = new Map();
  const editGrade = (market, dimension, fn) => {
    const key = `${market}/${dimension}`;
    const prior = gradeEdits.get(key) || [];
    gradeEdits.set(key, [...prior, fn]);
  };
  for (const market of ASSET_RETURN) editGrade(market, 'assetReturn', (r, g) => datedAssetReturn(r, g.asOf, `${market} assetReturn`));
  for (const market of REVENUE_CERTAINTY) editGrade(market, 'revenueCertainty', (r, g) => datedRevenueCertainty(r, g.asOf));
  for (const [market, dims] of Object.entries(GRADE_EDITS)) for (const [dimension, fn] of Object.entries(dims)) editGrade(market, dimension, (r) => fn(r));
  for (const [key, fns] of gradeEdits){
    const [market, dimension] = key.split('/');
    const view = await store.read(market);
    const grade = view.grades[dimension];
    const reasonText = fns.reduce((r, fn) => fn(r, grade), grade.reason);
    const sourceFix = (market === 'gb' || market === 'pjm') && dimension === 'gridScarcity' || dimension === 'policyStability';
    changes.push({ market, path: `grades.${dimension}`, author: analyst,
      reason: sourceFix ? ruled('the reason is corrected against its primary source (3A).', '评级理由已按一手来源更正（3A）。') : DATED,
      to: { ...grade, reason: reasonText } });
  }

  /* 3A: GB's Gate 2 trigger, repointed to the primary records. */
  const gb = await store.read('gb');
  const gate = gb.triggers.find(t => t.id === 'gb-gate-2-battery-progression-limit');
  if (!gate) throw new Error('gb: the Gate 2 trigger is missing');
  changes.push({ market: 'gb', path: `triggers.${gate.id}`, author: analyst,
    reason: ruled('the trigger cites the government and regulator records, not a subscription article (3A).', '触发事件改为引用政府与监管机构的原始文件，而非订阅类文章（3A）。'),
    to: { ...gate,
      source: { publisher: 'DESNZ and Ofgem — open letter, 16 April 2026', url: 'https://www.gov.uk/government/publications/connections-reform-delivery-update-and-battery-capacity/open-letter-from-desnz-and-ofgem-on-connections-reform-delivery', access: 'opened' },
      note: ['Ofgem\'s CMP470 minded-to consultation of 17 September 2026 proposes a commitment fee for oversubscribed technologies; the decision is pending.',
        'Ofgem于2026年9月17日发布CMP470倾向性咨询，拟对超额申请的技术类别收取承诺费；决定尚未作出。'] } });

  /* 3A: PJM's next four-hour rating, a dated event. */
  changes.push({ market: 'pjm', path: `triggers.${PJM_RATING}`, author: analyst,
    reason: ruled('the 2029/30 four-hour rating was published in August, so the auction reveals the price only; the next new rating is due on 11 January 2027 (3A).',
      '2029/30交付年四小时认证系数已于8月公布，拍卖只会揭示价格；下一次新的认证系数将于2027年1月11日公布（3A）。'),
    to: { id: PJM_RATING, kind: 'event', market: 'pjm',
      label: ['2030/31 ELCC class ratings posted: the next four-hour storage accreditation', '2030/31交付年ELCC分类评级公布：下一次四小时储能认证系数'],
      expected: '2027-01-11', watches: ['assetReturn', 'revenueCertainty'], direction: 'either',
      source: { publisher: 'PJM — RPM auction schedule', url: 'https://www.pjm.com/-/media/DotCom/markets-ops/rpm/rpm-auction-info/rpm-auction-schedule.xlsx', access: 'opened' },
      note: ['PJM publishes preliminary ELCC class ratings before each Base Residual Auction. The 2029/30 ratings were posted on 6–7 August 2026; the 2030/31 posting is scheduled for 11 January 2027.',
        'PJM在每次基础剩余容量拍卖前公布初步ELCC分类评级。2029/30交付年评级已于2026年8月6–7日公布；2030/31交付年评级计划于2027年1月11日公布。'],
      effect: null } });

  // A verdict may name a trigger only once it exists, so triggers are written first.
  const isTrigger = (c) => c.path.startsWith('triggers.');
  return [...changes.filter(isTrigger), ...changes.filter(c => !isTrigger(c))];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const store = createViewStore();
  const changes = await viewTextChanges(store);
  if (process.argv[2] === '--apply'){
    const done = await store.applyBatch(changes, new Date());
    console.log(`Applied ${done.length} changes. See view/changelog.jsonl.`);
  } else {
    const prepared = await store.prepareBatch(changes, new Date());
    console.log(`${prepared.length} changes pass the writer's gate. Nothing was written.`);
  }
}
