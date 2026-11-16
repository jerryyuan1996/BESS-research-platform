/* ---------------------------------------------------------------------------
   The analyst changes that go with docs/return-model-alignment-plan-2026-11-15.md,
   signed off by the analyst on 2026-11-16:

     - REGRADE (decisions 1–8, 12): the asset-return grade is ranked on the
       investment model — the all-equity hold return of the case on the
       investor's card, among the priced markets. The fourteen derived grade
       records take the grade that ranking gives, a dated reason that types no
       model figure, and "The investment model" as their evidence. Five grades
       move: Poland 3→4, Ireland 1→2, Germany 5→4, the NEM 4→3, Tokyo 2→1.
       Finland's practitioner grade is not touched.
     - SCORE NOTES: Germany's fund note explained a flag the regrade clears and
       is retired; CAISO's fund note is brought up to the new basis.
     - ERCOT (F4, S4, N4): the fund, the strategic investor and the new
       entrant move to Pass on the current reference new-build case, with a
       scope, a reopening condition and a score note. The developer call is
       deferred and is not touched.
     - PJM: the December 2026 capacity auction stays named on the three Watch
       calls approved on 15 November, as the event that can lower the case.
     - JAPAN: the Round 4 bid close is corrected to 26 January 2027 from the
       organiser's schedule; 3 February is the close of a later registration.

   The grade written is the one the model computes when this runs, so the
   script cannot write a grade the site would not show. No model input, weight,
   financing rule or fixture is changed here, and no figure is typed into prose.

     node scripts/view/content/return-model-2026-11.mjs --check | --apply [--only <text>]
   --------------------------------------------------------------------------- */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createViewStore } from '../writer.mjs';
import { briefingFromDisk } from '../../../src/briefing/disk.js';
import { commonGrade } from '../../../src/opportunities/returnGrades.js';

const analyst = { kind: 'analyst' };
const AS_OF = '2026-11-16';
const signed = (en, zh) => [`Signed off by the analyst on ${AS_OF} with the return-model alignment plan: ${en}`, `分析师于${AS_OF}依回报模型对齐方案签批：${zh}`];
const instructed = (en, zh) => [`Applied on the analyst's instruction of ${AS_OF}, from the review of the 15 November Watch decisions: ${en}`, `按分析师${AS_OF}的指示、依据对11月15日Watch决定的复核落实：${zh}`];

const GRADED = ['wa', 'nem', 'gb', 'de', 'it', 'ie', 'ro', 'pl', 'jp_tokyo', 'jp_kyushu', 'jp_hokkaido', 'pjm', 'ercot', 'caiso'];

const BASE = [
  `${AS_OF}: Graded on the investment model: the all-equity hold return of the recommended play, priced ready-to-build, ranked among the priced markets and graded by fifths. The return and rank are shown from the model on this page; the earlier dated rationale remains in history.`,
  `${AS_OF}：按投资模型评级：以推荐方案按可开工阶段定价的全股权长持回报，在已定价市场中排序并按五分位评级。回报与排名由本页模型结果给出；原有日期的依据保留在历史中。`,
];
const moved = (from, to) => [
  ` On this basis the grade moves from ${from} to ${to}; the market's own inputs did not change.`,
  `按此口径，评级由${from}调整为${to}；本市场自身输入未变。`,
];
const POLAND = [
  ' The case graded is the grant-funded cohort for the fund, the strategic investor and the developer, and the capacity-contract case for the new entrant; both sit in the same fifth.',
  '所评情景：基金、战略投资者与开发商为已获补贴批次，首次进入者为容量合同情景；两者处于同一五分位。',
];

const ERCOT_TERMS = 'ercot-executable-terms';
const ERCOT_SCOPE = ['The current reference new-build case, at modelled terms', '当前参考新建情景（按模型条款）'];
const ERCOT_RETURN = [
  'At build cost the reference toll case falls well short of this investor\'s target on both tests.',
  '按建设成本测算，参考租赁情景在全股权与加杠杆两种口径下均明显达不到该类投资者的目标回报。',
];
const ERCOT_NOTE = [
  'The composite score describes market fit across several dimensions. Pass applies to the current reference new-build case: at build cost it falls short of this investor\'s return tests, with or without a toll. The adequacy outlook does not establish executable toll pricing. Verified contract, cost or acquisition terms reopen the case for a fresh target test.',
  '综合评分描述市场在多个维度的适配程度。“暂缓投入”适用于当前参考新建情景：按建设成本测算，无论是否签订租赁，该情景均未达到该类投资者的回报检验要求。供需充裕度展望不能证明可执行的租赁价格。取得可核验的合同、成本或收购条件后，可重新测算是否达标。',
];

export async function returnModelChanges(store, now = new Date()){
  const changes = [];
  const briefing = await briefingFromDisk({ now });

  /* ---- the regrade ---- */
  for (const market of GRADED){
    const view = await store.read(market);
    const record = view.grades.assetReturn;
    if (record.basis !== 'derived') throw new Error(`${market}: the asset-return grade is not derived; this script does not touch it`);
    const grade = commonGrade(briefing.returnGrades[market]);
    if (grade === null) throw new Error(`${market}: the four investors' cards do not give one grade; the analyst rules on it first`);
    const change = grade === record.grade ? ['', ''] : moved(record.grade, grade);
    const extra = market === 'pl' ? POLAND : ['', ''];
    changes.push({ market, path: 'grades.assetReturn', author: analyst,
      reason: signed(
        grade === record.grade ? 'the grade is re-based on the investment model and is unchanged.'
          : `the grade is re-based on the investment model and moves from ${record.grade} to ${grade}${market === 'de' ? ', reversing the 30 October regrade, which rested on the comparison engine\'s ranking' : ''}.`,
        grade === record.grade ? '评级改按投资模型计算，评级不变。'
          : `评级改按投资模型计算，由${record.grade}调整为${grade}${market === 'de' ? '，并撤回10月30日基于比较引擎排名的调整' : ''}。`),
      to: { ...record, grade, evidence: ['investment-model'], asOf: AS_OF,
        reason: [BASE[0] + change[0] + extra[0], BASE[1] + change[1] + extra[1]] } });
  }

  /* ---- score notes the regrade makes stale ---- */
  const de = await store.read('de');
  const { scoreNote: retired, ...deFund } = de.verdicts.infraFund;
  if (retired){
    changes.push({ market: 'de', path: 'verdicts.infraFund', author: analyst,
      reason: signed('the score note explained a disagreement the regrade removes; it is retired and stays in history.', '该评分说明所解释的不一致已随重新评级消除；予以撤下，并保留在历史中。'),
      to: { ...deFund, asOf: AS_OF } });
  }
  const caiso = await store.read('caiso');
  changes.push({ market: 'caiso', path: 'verdicts.infraFund', author: analyst,
    reason: signed('the score note now names the basis that moved the score; the call and its ruling are unchanged.', '评分说明改为注明导致评分变化的口径；结论及其裁定不变。'),
    to: { ...caiso.verdicts.infraFund, asOf: AS_OF, scoreNote: [
      'The call stays at Opportunistic on the analyst\'s ruling of 16 October, which holds it there until the research gate on CAISO\'s seeds closes. The score reads one band higher since the asset-return grade moved to the investment model on 16 November 2026; CAISO\'s own inputs did not change.',
      '根据分析师10月16日的裁定，在CAISO种子数据的研究关口关闭之前，结论维持“机会型”。自2026年11月16日资产回报评级改按投资模型计算后，评分高出一档；CAISO自身输入未变。'] } });

  /* ---- ERCOT: Pass for the fund, the strategic investor and the new entrant ---- */
  const ercot = await store.read('ercot');
  changes.push({ market: 'ercot', path: `triggers.${ERCOT_TERMS}`, author: analyst,
    reason: signed('a Pass states what reopens it: verified, executable terms.', '“暂缓投入”须写明重新开启的条件：可核验、可执行的条款。'),
    to: { id: ERCOT_TERMS, kind: 'event', market: 'ercot',
      label: ['Verified executable toll, cost or acquisition terms that justify a fresh target test', '取得可核验、可执行的租赁、成本或收购条件，足以支持重新测算是否达标'],
      expected: null, watches: ['assetReturn', 'revenueCertainty'], direction: 'up', source: 'decision-profile', effect: null } });
  for (const lens of ['infraFund', 'strategic', 'foreignFirstTimer']){
    const v = ercot.verdicts[lens];
    /* The fund keeps the adequacy outlook named beside the reopening condition:
       it is still read for demand and saturation, and the market story cites it. */
    const kept = lens === 'infraFund' ? v.changesIf.filter(id => id !== ERCOT_TERMS) : [];
    changes.push({ market: 'ercot', path: `verdicts.${lens}`, author: analyst,
      reason: signed('Pass on the current reference new-build case; it reopens on verified executable terms. This is not a ruling on every operating asset or development right in the market.',
        '对当前参考新建情景“暂缓投入”；取得可核验、可执行的条款后重新开启。这并非对该市场所有在运资产或开发权的裁定。'),
      to: { ...v, call: 'avoid', where: ERCOT_SCOPE, asOf: AS_OF,
        because: v.because.map(b => (b.dimension === 'assetReturn' ? { ...b, text: ERCOT_RETURN } : b)),
        changesIf: [ERCOT_TERMS, ...kept], scoreNote: ERCOT_NOTE } });
  }

  /* ---- PJM: the December auction stays named ---- */
  const pjm = await store.read('pjm');
  const auction = 'pjm-capacity-auction-2029-30';
  for (const lens of ['infraFund', 'strategic', 'foreignFirstTimer']){
    const v = pjm.verdicts[lens];
    if (v.changesIf.includes(auction)) continue;
    changes.push({ market: 'pjm', path: `verdicts.${lens}`, author: analyst,
      reason: instructed('the December 2026 capacity auction is already priced at its cap, so it can only lower the case; it stays named as the event that would.',
        '2026年12月容量拍卖已按上限计入测算，只可能降低该情景；因此继续列为可能改变判断的事件。'),
      to: { ...v, changesIf: [auction, ...v.changesIf] } });
  }

  /* ---- Japan: the Round 4 dates ---- */
  for (const market of ['jp_tokyo', 'jp_kyushu', 'jp_hokkaido']){
    const view = await store.read(market);
    const t = view.triggers.find(x => /-ltda-round-4-bids$/.test(x.id));
    changes.push({ market, path: `triggers.${t.id}`, author: analyst,
      reason: instructed('the organiser\'s schedule sets the bidding period at 19–26 January 2027; 3 February closes the later registration of capacity-calculation particulars, not the bidding.',
        '主办机构日程将投标期定为2027年1月19日至26日；2月3日是其后容量计算参数登记的截止日，而非投标截止日。'),
      to: { ...t, expected: '2027-01-26',
        label: [t.label[0].replace('Round 4 bidding closes;', 'Round 4 bidding closes (results targeted about three months later);'),
          t.label[1].replace('第四轮投标截止；', '第四轮投标截止（结果预计约三个月后公布）；')],
        source: { publisher: 'OCCTO', url: 'https://www.occto.or.jp/news/013615.html', access: 'opened' },
        note: ['OCCTO\'s schedule of 9 October 2026: bidding 19–26 January 2027; registration of capacity-calculation particulars 27 January–3 February 2027; results targeted about three months after bidding ends, which may shift.',
          '电力广域的运营推进机关2026年10月9日日程：投标期为2027年1月19日至26日；容量计算参数登记期为2027年1月27日至2月3日；结果预计在投标结束约三个月后公布，时间可能调整。'] } });
    /* The play's action named the same wrong day. */
    for (const play of Object.values(view.plays || {})){
      if (!play.action || !/3 February 2027/.test(play.action.text[0])) continue;
      changes.push({ market, path: `plays.${play.id}`, author: analyst,
        reason: instructed('the action follows the corrected bid close, 26 January 2027.', '行动日期随更正后的投标截止日（2027年1月26日）调整。'),
        to: { ...play, action: { ...play.action, due: '2027-01-26',
          text: [play.action.text[0].replace('3 February 2027', '26 January 2027'), play.action.text[1].replace('2027年2月3日', '2027年1月26日')] } } });
    }
  }
  return changes;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const store = createViewStore();
  const now = new Date();
  /* `--only <text>` keeps the changes whose "<market> <path>" contains it: a
     later addition to this file is applied without replaying the rest. */
  const only = process.argv.indexOf('--only') > -1 ? process.argv[process.argv.indexOf('--only') + 1] : null;
  const changes = (await returnModelChanges(store, now)).filter(c => !only || `${c.market} ${c.path}`.includes(only));
  if (process.argv[2] === '--apply'){
    const done = await store.applyBatch(changes, now);
    console.log(`Applied ${done.length} changes. See view/changelog.jsonl.`);
  } else {
    const prepared = await store.prepareBatch(changes, now);
    console.log(`${prepared.length} changes pass the writer's gate. Nothing was written.`);
    for (const c of changes) console.log(`  ${c.market}  ${c.path}`);
  }
}
