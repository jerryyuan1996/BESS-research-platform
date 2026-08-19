/* ---------------------------------------------------------------------------
   Key readings for an allocation committee.

   COMPUTED, not authored. The previous version was prose written around the five
   seed markets, quoting fixed values and naming fixed winners. Three Japanese
   allocation points made several of those statements false, and the same would
   happen on the next market added.

   Each finding below states a structural claim that stays true as the registry
   changes, and fills the specific markets and numbers in from the engine. If a
   data refresh flips a ranking, the sentence flips with it — which is the point.
   The `why` block at the bottom is the one piece of standing editorial: it says
   what the reader should do when a finding does change.
   --------------------------------------------------------------------------- */
import { h } from '../utils/dom.js';
import { L } from '../app/i18n.js';
import { spacedCard } from '../components/card.js';
import { badge } from '../components/badge.js';
import { why } from '../components/decisionLogic.js';
import { fmtPct, fmtIRR, fmtX, fmtN } from '../utils/formatting.js';
import { runAll, runCase } from '../comparison/engine.js';
import { baseStrategy } from '../comparison/strategies.js';

/** Markets ranked by an accessor, unavailable results dropped. */
function ranked(marketList, results, fn, hi = true){
  return marketList
    .map(m => ({ m, r: results.get(m.manifest.id) }))
    .filter(x => x.r && !x.r.na)
    .map(x => ({ ...x, v: fn(x.m, x.r) }))
    .filter(x => Number.isFinite(x.v))
    .sort((a, b) => (hi ? b.v - a.v : a.v - b.v));
}

const nm = (x) => L(x.m.manifest.shortName);

export function renderFindings(main, marketList, exitYear){
  const results = runAll(marketList, exitYear);
  const n = marketList.length;

  const byYield = ranked(marketList, results, (m, r) => r.yield1 * 100);
  const bySecured = ranked(marketList, results, (m, r) => (r.evidenceSecuredShare || 0) * 100);
  const byMoic = ranked(marketList, results, (m, r) => r.moic);
  const byKw = ranked(marketList, results, (m, r) => r.kwPerM);
  const byIrr = ranked(marketList, results, (m, r) => r.irrHold);
  const byTenor = ranked(marketList, results, (m, r) => r.evidenceSecuredYears || 0);

  const items = [];

  // 1 — current income clusters, exits do not
  if (byYield.length >= 2 && byMoic.length >= 2){
    const yLo = byYield[byYield.length - 1], yHi = byYield[0];
    const mLo = byMoic[byMoic.length - 1], mHi = byMoic[0];
    items.push({
      title: ['1 · Cash yields cluster; exits diverge.', '1 · 现金收益率趋同；退出结果分化。'],
      body: [
        'Year-1 yields run from ' + fmtPct(yLo.v) + ' (' + nm(yLo) + ') to ' + fmtPct(yHi.v) + ' (' + nm(yHi) + ') across all ' + n + ' allocation markets — a band of ' + fmtPct(yHi.v - yLo.v) + '. Exit MOIC at year ' + exitYear + ' runs from ' + fmtX(mLo.v) + ' (' + nm(mLo) + ') to ' + fmtX(mHi.v) + ' (' + nm(mHi) + '). Certainty, not current income, is where these markets actually differ.',
        '全部' + n + '个配置市场的第1年收益率介于' + fmtPct(yLo.v) + '（' + nm(yLo) + '）至' + fmtPct(yHi.v) + '（' + nm(yHi) + '）之间，带宽' + fmtPct(yHi.v - yLo.v) + '。第' + exitYear + '年退出MOIC介于' + fmtX(mLo.v) + '（' + nm(mLo) + '）至' + fmtX(mHi.v) + '（' + nm(mHi) + '）。市场之间的真实差异在于确定性，而非当期收入。',
      ],
    });
  }

  // 2 — merchant viability is a duration question
  const merchant = marketList
    .map(m => ({ m, r: runCase(m, 'mer', exitYear) }))
    .filter(x => !x.r.na && x.r.irrHold != null)
    .map(x => ({ ...x, h: x.m.comparison.archetype.durationHours, v: x.r.irrHold }))
    .sort((a, b) => a.h - b.h);
  if (merchant.length >= 3){
    const short = merchant.filter(x => x.h <= 2), long = merchant.filter(x => x.h >= 4);
    const fmtGrp = (g) => g.map(x => nm(x) + ' ' + fmtIRR(x.v)).join(', ');
    items.push({
      title: ['2 · Merchant viability tracks duration, not geography.', '2 · 纯市场化可行性取决于时长，而非地域。'],
      body: [
        'Strip the capacity contracts away and the result sorts by hours, not by country. ' + (short.length ? 'Short-duration: ' + fmtGrp(short) + '. ' : '') + (long.length ? 'Four hours and longer: ' + fmtGrp(long) + '. ' : '') + 'Merchant revenue pays for power; only a capacity mechanism pays for hours.',
        '剥离容量合同后，结果按小时数而非国别排序。' + (short.length ? '短时长：' + fmtGrp(short) + '。' : '') + (long.length ? '4小时及以上：' + fmtGrp(long) + '。' : '') + '市场化收入为功率付费；只有容量机制为小时数付费。',
      ],
    });
  }

  // 3 — secured share and secured tenor are different questions
  if (bySecured.length >= 2 && byTenor.length >= 2){
    const sHi = bySecured[0];
    const tHi = byTenor[0], tLo = byTenor.filter(x => x.v > 0).slice(-1)[0];
    items.push({
      title: ['3 · A high secured share is not a long contract.', '3 · 高锁定占比不等于长期合同。'],
      body: [
        nm(sHi) + ' has the highest secured share of year-1 revenue at ' + fmtPct(sHi.v, 0) + ', but secured share and secured tenor are separate questions: tenors in this set run from ' + (tLo ? tLo.v : 0) + ' to ' + tHi.v + ' years. A capacity payment won one delivery year at a time is secured for that year and market risk thereafter — which is why the league table shows both rows.',
        nm(sHi) + '的第1年收入锁定占比最高，达' + fmtPct(sHi.v, 0) + '，但锁定占比与锁定年限是两个问题：本样本中年限从' + (tLo ? tLo.v : 0) + '年到' + tHi.v + '年不等。逐个实需年度竞得的容量付费仅在该年度构成锁定，其后即为市场风险 — 这正是对比表同时列示两行的原因。',
      ],
    });
  }

  // 4 — duration is capital intensity in disguise
  if (byKw.length >= 2){
    const kHi = byKw[0], kLo = byKw[byKw.length - 1];
    items.push({
      title: ['4 · Duration is capital intensity in disguise.', '4 · 时长是资本强度的另一种形态。'],
      body: [
        '$1M controls ~' + fmtN(kHi.v) + ' kW in ' + nm(kHi) + ' (' + kHi.m.comparison.archetype.durationHours + 'h) and ~' + fmtN(kLo.v) + ' kW in ' + nm(kLo) + ' (' + kLo.m.comparison.archetype.durationHours + 'h). Markets that pay for hours force you to buy hours — the same policy that raises the revenue line raises the denominator under it.',
        '100万美元在' + nm(kHi) + '（' + kHi.m.comparison.archetype.durationHours + '小时）可控约' + fmtN(kHi.v) + 'kW，在' + nm(kLo) + '（' + kLo.m.comparison.archetype.durationHours + '小时）仅约' + fmtN(kLo.v) + 'kW。为小时数付费的市场也迫使你购买小时数 — 抬高收入线的同一政策，也抬高了其下的分母。',
      ],
    });
  }

  // 5 — within-country dispersion, when a country contributes several markets
  const byCountry = new Map();
  for (const m of marketList){
    const key = m.manifest.dashboardId || m.manifest.id;
    if (!byCountry.has(key)) byCountry.set(key, []);
    byCountry.get(key).push(m);
  }
  const multi = [...byCountry.values()].filter(g => g.length > 1);
  for (const group of multi){
    const g = ranked(group, results, (m, r) => r.irrHold);
    if (g.length < 2) continue;
    const hi = g[0], lo = g[g.length - 1];
    const spread = (hi.v - lo.v) * 100;
    const crossHi = byIrr[0], crossLo = byIrr[byIrr.length - 1];
    const crossSpread = (crossHi.v - crossLo.v) * 100;
    items.push({
      title: ['5 · One country, three exposures — the within-country spread is real.',
              '5 · 一国三敞口 — 国内区域间差异真实存在。'],
      body: [
        g.map(x => nm(x) + ' ' + fmtIRR(x.v)).join(' · ') + '. The spread between the best and worst region inside one national rulebook is ' + spread.toFixed(1) + ' IRR points, against ' + crossSpread.toFixed(1) + ' points across the whole ' + n + '-market set. Same capacity mechanism, same balancing products, same auction — different price formation, different grid, different saturation. Holding all three is diversification against the timing of saturation, not against saturation itself.',
        g.map(x => nm(x) + ' ' + fmtIRR(x.v)).join(' · ') + '。在同一国家规则体系内，最优与最差区域相差' + spread.toFixed(1) + '个IRR百分点，而全部' + n + '个市场的差距为' + crossSpread.toFixed(1) + '个百分点。相同的容量机制、相同的调整力品种、相同的拍卖 — 但价格形成、电网条件与饱和程度各异。同时持有三者分散的是饱和发生的时点，而非饱和风险本身。',
      ],
    });
  }

  const c = spacedCard(
    ['Key readings for an allocation committee — computed from the current ' + n + ' markets',
     '供配置委员会参考的核心结论 — 基于当前' + n + '个市场计算'],
    [badge('calc'), badge('illus')]);

  c.append(h('div', {}, items.map(f =>
    h('div', { style: 'padding:8px 0;border-bottom:1px solid var(--grid);' },
      h('div', { style: 'font-size:var(--fs-sm);font-weight:var(--fw-medium);' }, L(f.title)),
      h('div', { style: 'font-size:var(--fs-xs);color:var(--ink2);margin-top:3px;' }, L(f.body))))));

  c.append(why([
    'These readings are recomputed from the engine every render, so they cannot go stale the way hand-written commentary does. The claims are structural — the shape of each sentence holds as markets are added; only the names and numbers move. If a data refresh overturns the shape of one (for example, if merchant IRRs stop sorting by duration), that is a market-regime change worth a full committee discussion, not a model recalibration.',
    '上述结论在每次渲染时由引擎重新计算，因而不会像手写评论那样过时。这些论断是结构性的 — 随着市场增加，句式保持不变，仅名称与数值变化。若数据更新推翻了某一论断的结构（例如纯市场化IRR不再按时长排序），那是值得委员会专题讨论的市场机制变化，而非一次模型重校准。',
  ], ['Structural claims, computed values', '结构性论断，计算得出的数值']));

  main.append(c);
}
