/* ---------------------------------------------------------------------------
   The analyst changes that go with docs/open-calls-plan-2026-10-31.md, ruled
   by the analyst on 2026-10-31 (option A on all four questions):

     - Poland (2A): both calls stand; the thesis limits "every design loses
       value" to ungranted designs and names the grant cohort as the exception;
     - Romania (3A): the play is labelled as the merchant case it is priced on,
       the floor stays a condition of entry, and `ro-grant-status-review`
       (2 November) joins every verdict that watches the grant call;
     - Japan (4A): the `-6h` play IDs stay (they name the obligation); labels,
       reasons and theses say nine-hour build, six-hour obligation, and lead
       with buying an operating award holder;
     - ERCOT (5A): `ercot-january-2027-mora` (6 November) gives the fund call
       its next event.

   Ontario, Saudi Arabia and Spain stay ungraded (1A): nothing here.
   No model figure moves, and no new figure is typed into prose.

     node scripts/view/content/open-calls-2026-10.mjs --check | --apply
   --------------------------------------------------------------------------- */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createViewStore } from '../writer.mjs';

const analyst = { kind: 'analyst' };
const AS_OF = '2026-10-31';
const ruled = (en, zh) => [`Ruled by the analyst on ${AS_OF} with the open-calls plan: ${en}`, `分析师于${AS_OF}依待决事项方案裁定：${zh}`];

const JAPAN = {
  jp_tokyo: {
    edge: ['Tokyo\'s edge is price capture and connection quality.', '东京的优势在于价格捕获与并网质量。'],
  },
  jp_kyushu: {
    edge: ['In Kyushu, Japan\'s renewable-surplus area, the upside left after clawback turns on charging access in curtailed hours and interconnector capacity.',
      '九州位于日本可再生能源过剩地区，返还后剩余的收益取决于弃电时段的充电接入与联络线容量。'],
  },
  jp_hokkaido: {
    edge: ['In Hokkaido, Japan\'s export-constrained area, underwrite charging-side headroom and the Hokkaido–Honshu reinforcement.',
      '北海道位于日本外送受限地区，承保时应关注充电侧裕度与北海道—本州联络线加强。'],
  },
};

export async function openCallChanges(store){
  const changes = [];

  /* ---- Poland (2A) ---- */
  changes.push({ market: 'pl', path: 'thesis', author: analyst,
    reason: ruled('both calls stand; "every design" covered the grant cohort, which has its own call, so the thesis now says ungranted designs.',
      '两项结论均维持；"所有设计"原本涵盖了有独立结论的补贴批次，因此投资逻辑改为无补贴设计。'),
    to: ['No new-entry capacity route, so new entrants rely on day-ahead revenue while the capacity framework is unsettled, and every ungranted design loses value at the platform\'s yields. Two cohorts are separate investments: a project in the 2025 grant cohort is the exception and carries its own call, and an asset holding an earlier seventeen-year contract is worth pricing only below replacement cost.',
      '没有新进入的容量路径，因此在容量机制尚未确定时，新进入者依靠日前市场收入，所有无补贴设计按本平台收益率均损失价值。两个批次属于不同投资：2025年补贴批次中的项目是例外，并有其独立结论；持有早期十七年合同的资产，只值得以低于重置成本的价格定价。'] });

  /* ---- Romania (3A) ---- */
  const ro = await store.read('ro');
  const review = 'ro-grant-status-review';
  changes.push({ market: 'ro', path: `triggers.${review}`, author: analyst,
    reason: ruled('the grant call\'s expected close has passed with no verified outcome; the analyst reviews the ministry\'s timetable and any published result on 2 November.',
      '补贴申报预计截止日已过，结果尚未核实；分析师于11月2日复核能源部时间表及已公布结果。'),
    to: { id: review, kind: 'event', market: 'ro',
      label: ['Verify the ministry\'s stand-alone storage-call timetable and any published outcome', '核验能源部独立储能申报时间表及已公布结果'],
      expected: '2026-11-02', watches: ['assetReturn', 'policyStability'], direction: 'either',
      source: { publisher: 'Ministry of Energy', url: 'https://energie.gov.ro/lansare-apel-sprijinirea-investitiilor-in-dezvoltarea-instalatiilor-autonome-stand-alone-de-stocare-in-baterii-a-energiei-electrice-cu-finantare-din-fondul-pentru-modernizare-p/', access: 'search-summary' },
      note: ['The call was expected to close on 30 October 2026. The ministry\'s call page could not be opened on 31 October; a reported extension to 15 November is not verified. This is the analyst\'s review date, not a published closing date.',
        '该申报预计于2026年10月30日截止。10月31日无法打开能源部申报页面；有报道称截止日延至11月15日，但尚未核实。此为分析师复核日期，并非公布的截止日期。'],
      effect: null } });

  const watchesGrant = (v) => Array.isArray(v?.changesIf) && v.changesIf.includes('ro-grant-call-close') && !v.changesIf.includes(review);
  for (const [archetype, verdict] of Object.entries(ro.verdicts)){
    if (archetype === 'infraFund' || !watchesGrant(verdict)) continue;
    changes.push({ market: 'ro', path: `verdicts.${archetype}`, author: analyst,
      reason: ruled('the grant-status review joins the changes-if beside the grant call.', '补贴进展复核加入变化条件，与补贴申报并列。'),
      to: { ...verdict, asOf: AS_OF, changesIf: [...verdict.changesIf, review] } });
  }

  const roFund = ro.verdicts.infraFund;
  changes.push({ market: 'ro', path: 'verdicts.infraFund', author: analyst,
    reason: ruled('the call stands on the merchant case it is priced on; the optimiser floor stays a condition of entry, and the grant-status review joins the changes-if.',
      '结论维持，并以其定价所依据的市场化情形为准；优化商保底仍是进入条件，补贴进展复核加入变化条件。'),
    to: { ...roFund, asOf: AS_OF,
      changesIf: watchesGrant(roFund) ? [...roFund.changesIf, review] : roFund.changesIf,
      because: [
        { dimension: 'assetReturn', text: ['Two hours is the best design here on merchant revenue alone; the return shown prices no floor.', '仅按市场化收入测算，两小时是这里的最佳设计；所示回报未计入任何保底。'] },
        ...roFund.because.slice(1),
      ],
      despite: ['The floor is a condition of entry, not part of the price: until its terms are in hand nothing is secured, Romania\'s own fleet doubles this year and compresses the spread, and frequency-reserve revenue is saturating.',
        '保底是进入条件，而非定价的一部分：在取得其条款之前没有任何锁定收入，罗马尼亚自身储能规模今年翻倍并压缩价差，且频率备用收入正趋于饱和。'] } });

  const roPlay = ro.plays['ro-mer-2h'];
  changes.push({ market: 'ro', path: 'plays.ro-mer-2h', author: analyst,
    reason: ruled('the label names the merchant case the play is priced on; the floor is a diligence condition, not a priced route.', '标签点明该方案定价所依据的市场化情形；保底属尽调条件，而非已定价的路径。'),
    to: { ...roPlay, asOf: AS_OF,
      label: ['Merchant · 2h', '市场化 · 2小时'],
      why: ['Two hours is the best design here on merchant revenue alone, and the figures shown price no floor; four hours gives up about 30% of its value as Romania\'s own fleet doubles.',
        '仅按市场化收入测算，两小时是这里的最佳设计，所示数据未计入任何保底；随着罗马尼亚自身储能规模翻倍，四小时设计损失约30%的价值。'],
      action: { ...roPlay.action,
        text: ['Find operating two-hour assets whose seller has, or will sign, an optimiser floor, and get its full terms before any bid: payment, tenor, indexation, share above the floor and credit support. Check the ministry\'s stand-alone storage-call timetable and any published outcome.',
          '寻找卖方已签或愿意签订优化商保底的两小时在运资产，并在出价前取得其完整条款：付费、期限、指数化、保底以上收益分成及信用支持。核查能源部独立储能申报时间表及已公布结果。'] } } });

  changes.push({ market: 'ro', path: 'thesis', author: analyst,
    reason: ruled('the thesis separates the priced merchant case from the floor a fund needs to enter.', '投资逻辑将已定价的市场化情形与基金进入所需的保底区分开来。'),
    to: ['Wide day-ahead spreads and nothing contracted, with a home fleet that doubles this year. Bulgaria\'s batteries mostly stay behind the border; Romania\'s own build takes about 17% off the two-hour value by 2027. Two hours is the best design on merchant revenue alone; a fund enters only with a negotiated optimiser floor, whose terms are not yet priced here.',
      '日前价差宽但没有任何合同化收入，且本国储能规模今年翻倍。保加利亚的电池大多被边境阻隔；罗马尼亚自身的建设到2027年将使两小时价值减少约17%。仅按市场化收入测算，两小时是最佳设计；基金只有在谈定优化商保底后才进入，而该保底条款尚未在此定价。'] });

  /* ---- Japan (4A) ---- */
  for (const [market, { edge }] of Object.entries(JAPAN)){
    const view = await store.read(market);
    const playId = view.verdicts.infraFund.play;
    const play = view.plays[playId];
    changes.push({ market, path: `plays.${playId}`, author: analyst,
      reason: ruled('the play ID names the six-hour obligation; the label and reason now say the build is nine hours.', '方案编号指六小时义务；标签与理由现注明装机为九小时。'),
      to: { ...play, asOf: AS_OF,
        label: ['Long-term auction award · 9h build / 6h obligation', '长期脱碳电源拍卖中标 · 9小时装机／6小时义务'],
        why: ['The award obliges six hours of delivery for twenty years; without augmentation that takes a nine-hour build. The award is a regulated return: a battery bid may price at most 4.5% pre-tax, which an unlevered fund cannot hold at its yields. It pays only bought at a discount.',
          '中标合同要求二十年内提供六小时供电；在不扩容的前提下需九小时装机。中标合同属受监管回报：蓄电池报价可计入的税前回报上限为4.5%，无杠杆基金按其收益率无法持有，仅在折价收购时才有价值。'] } });
    changes.push({ market, path: 'thesis', author: analyst,
      reason: ruled('the thesis leads with the fund call, buying an operating award holder, and the capped bid return that drives it.', '投资逻辑以基金结论（收购已投运的中标方）及驱动该结论的报价回报上限开篇。'),
      to: [`Buy an operating award holder at a price that clears the fund's target; do not build. The 20-year long-term auction award secures nearly all revenue, but a battery bid is capped at a regulated 4.5% pre-tax return and most trading upside is clawed back, so the purchase price is the decision. The award's six-hour obligation must hold to year 20, which takes a nine-hour build without augmentation. ${edge[0]}`,
        `以达到基金目标收益的价格收购已投运的中标方，而非新建。20年期长期脱碳电源拍卖中标合同几乎锁定全部收入，但蓄电池报价的税前回报受监管上限4.5%约束，且大部分交易收益须返还，因此收购价格决定成败。中标合同的六小时义务须维持到第20年，在不扩容的前提下需九小时装机。${edge[1]}`] });
  }

  /* ---- ERCOT (5A) ---- */
  const ercot = await store.read('ercot');
  const mora = 'ercot-january-2027-mora';
  changes.push({ market: 'ercot', path: `triggers.${mora}`, author: analyst,
    reason: ruled('the fund call had no dated event; ERCOT publishes each month\'s adequacy outlook two months ahead on the first Friday, so January 2027\'s is due on 6 November.',
      '基金结论此前没有带日期的事件；ERCOT于每月第一个星期五提前两个月发布资源充裕度月报，因此2027年1月的月报应于11月6日发布。'),
    to: { id: mora, kind: 'event', market: 'ercot',
      label: ['January 2027 MORA: review winter evening adequacy and battery availability', '2027年1月资源充裕度月报：复核冬季晚高峰供需与电池可用性'],
      expected: '2026-11-06', watches: ['demandGrowth', 'saturation'], direction: 'either',
      source: { publisher: 'ERCOT', url: 'https://www.ercot.com/gridinfo/resource', access: 'opened' },
      note: ['ERCOT issues the MORA on the first Friday of each month, two months ahead of the reporting month (December 2026\'s was published on 2 October 2026). It informs demand and saturation; it is not evidence of a toll price.',
        'ERCOT于每月第一个星期五发布资源充裕度月报，提前两个月覆盖报告月份（2026年12月月报于2026年10月2日发布）。该报告反映需求与饱和程度，但不能作为租赁价格的依据。'],
      effect: null } });
  const erFund = ercot.verdicts.infraFund;
  changes.push({ market: 'ercot', path: 'verdicts.infraFund', author: analyst,
    reason: ruled('the January 2027 adequacy outlook is the call\'s next dated event.', '2027年1月资源充裕度月报是该结论下一个带日期的事件。'),
    to: { ...erFund, asOf: AS_OF, changesIf: [...erFund.changesIf.filter(id => id !== mora), mora] } });
  const erPlay = ercot.plays['ercot-toll-2h'];
  changes.push({ market: 'ercot', path: 'plays.ercot-toll-2h', author: analyst,
    reason: ruled('the play\'s action gets the MORA date; the toll itself stays to be underwritten separately.', '方案行动采用月报日期；租赁本身仍须另行承保。'),
    to: { ...erPlay, asOf: AS_OF,
      action: { text: ['Read the January 2027 MORA on 6 November for winter evening adequacy and battery availability. Engage only with an executed toll: get its price and test it against the 2025 realised index before any bid.',
        '于11月6日阅读2027年1月资源充裕度月报，复核冬季晚高峰供需与电池可用性。只考虑已签署租赁的项目：出价前取得租赁价格，并与2025年实际指数对比检验。'], due: '2026-11-06' } } });

  return changes;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)){
  const store = createViewStore();
  const changes = await openCallChanges(store);
  if (process.argv[2] === '--apply'){
    const done = await store.applyBatch(changes, new Date());
    console.log(`Applied ${done.length} changes. See view/changelog.jsonl.`);
  } else {
    const prepared = await store.prepareBatch(changes, new Date());
    console.log(`${prepared.length} changes pass the writer's gate. Nothing was written.`);
  }
}
